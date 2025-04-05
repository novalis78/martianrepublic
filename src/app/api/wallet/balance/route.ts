import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import walletService from '@/lib/services/blockchain';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user's public address from session
    const publicAddress = session.user.publicAddress;

    // If we have an address in the session, use it directly
    if (publicAddress) {
      // Get balance from the blockchain service
      const balance = await walletService.getBalance(publicAddress);
      const transactions = await walletService.getTransactions(publicAddress);
      
      return NextResponse.json({
        balance,
        address: publicAddress,
        txCount: transactions.length,
      });
    }
    
    // If no address in session, check the database for the user's wallet
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
    }

    const db = await getCollection('users');
    const user = await db.findOne({ _id: new ObjectId(userId) });

    if (!user || !user.publicAddress) {
      return NextResponse.json({ error: 'No wallet address found' }, { status: 404 });
    }

    // Get balance from the blockchain service using the address from the database
    const balance = await walletService.getBalance(user.publicAddress);
    const transactions = await walletService.getTransactions(user.publicAddress);
    
    return NextResponse.json({
      balance,
      address: user.publicAddress,
      txCount: transactions.length,
    });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return NextResponse.json({ error: 'Failed to fetch wallet balance' }, { status: 500 });
  }
}