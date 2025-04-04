import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/auth-options';
import { 
  getWalletsCollection, 
  getProposalsCollection,
  getNotificationsCollection
} from '@/lib/mongodb';

/**
 * Mobile User Status API
 * Returns essential user status information
 */
export async function GET(request: NextRequest) {
  try {
    // Get session to check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Get wallet balance
    const walletCollection = await getWalletsCollection();
    const wallet = await walletCollection.findOne({ userId });
    
    // Get unread notifications count
    const notificationsCollection = await getNotificationsCollection();
    const unreadNotificationsCount = await notificationsCollection.countDocuments({ 
      userId, 
      read: false 
    });
    
    // Get active proposals that need attention
    const proposalsCollection = await getProposalsCollection();
    const activeProposalsCount = await proposalsCollection.countDocuments({ 
      status: 'voting', 
      active: true 
    });
    
    // Prepare the response
    const response = {
      id: userId,
      name: session.user.name,
      citizenStatus: session.user.citizenStatus || 'newcomer',
      walletBalance: wallet?.balance || 0,
      unreadNotifications: unreadNotificationsCount,
      activeProposals: activeProposalsCount
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user status' },
      { status: 500 }
    );
  }
}