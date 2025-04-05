import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import walletService from '@/lib/services/blockchain';

/**
 * POST /api/wallet/generate
 * Generates a new seed phrase
 */
export async function POST(req: NextRequest) {
  try {
    // Ensure the user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Generate a new seed phrase
    const seedPhrase = walletService.generateSeedPhrase();
    
    return NextResponse.json({
      success: true,
      seedPhrase,
    });
  } catch (error) {
    console.error('Error generating seed phrase:', error);
    return NextResponse.json({ error: 'Failed to generate seed phrase' }, { status: 500 });
  }
}