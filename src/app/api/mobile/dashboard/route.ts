import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/auth-options';
import { 
  getWalletsCollection, 
  getTransactionsCollection,
  getFeedPostsCollection,
  getProposalsCollection,
  getInventoryCollection,
  getNotificationsCollection
} from '@/lib/mongodb';

/**
 * Mobile Dashboard API
 * Returns an overview of all essential user information for the mobile dashboard
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
    
    // For demo purposes, we're simulating the data instead of making actual DB queries
    // In a real implementation, these would be DB queries using the userId

    // Get wallet info
    const walletCollection = await getWalletsCollection();
    const wallet = await walletCollection.findOne({ userId });
    
    // Get recent transactions
    const transactionsCollection = await getTransactionsCollection();
    const recentTransactions = await transactionsCollection
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(3)
      .toArray();
    
    // Get congress info (active proposals)
    const proposalsCollection = await getProposalsCollection();
    const activeProposalsCount = await proposalsCollection.countDocuments({ 
      status: 'voting', 
      active: true 
    });
    
    const endingSoonProposalsCount = await proposalsCollection.countDocuments({
      status: 'voting',
      active: true,
      endsAt: { $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) } // Next 24 hours
    });
    
    // Get feed info
    const feedCollection = await getFeedPostsCollection();
    const newPostsCount = await feedCollection.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });
    
    const topPost = await feedCollection
      .find({})
      .sort({ likesCount: -1 })
      .limit(1)
      .toArray();
    
    // Get inventory status
    const inventoryCollection = await getInventoryCollection();
    const criticalResourcesCount = await inventoryCollection.countDocuments({ status: 'critical' });
    const warningResourcesCount = await inventoryCollection.countDocuments({ status: 'warning' });
    
    // Get notifications
    const notificationsCollection = await getNotificationsCollection();
    const unreadNotifications = await notificationsCollection
      .find({ userId, read: false })
      .sort({ timestamp: -1 })
      .limit(5)
      .toArray();
    
    // Prepare the response
    const response = {
      user: {
        id: userId,
        name: session.user.name,
        avatarUrl: session.user.image,
        citizenStatus: session.user.citizenStatus || 'newcomer'
      },
      wallet: {
        balance: wallet?.balance || 0,
        recentTransactions: recentTransactions.map(tx => ({
          id: tx._id.toString(),
          type: tx.type,
          amount: tx.amount,
          timestamp: tx.timestamp
        }))
      },
      congress: {
        activeProposals: activeProposalsCount,
        endingSoonProposals: endingSoonProposalsCount
      },
      feed: {
        newPosts: newPostsCount,
        topPost: topPost.length > 0 ? {
          id: topPost[0]._id.toString(),
          userName: topPost[0].userName || 'Unknown User',
          content: topPost[0].content.length > 100 
            ? topPost[0].content.substring(0, 97) + '...' 
            : topPost[0].content,
          likesCount: topPost[0].likesCount || 0
        } : null
      },
      inventory: {
        criticalResources: criticalResourcesCount,
        warningResources: warningResourcesCount
      },
      notifications: unreadNotifications.map(notif => ({
        id: notif._id.toString(),
        type: notif.type,
        title: notif.title,
        timestamp: notif.timestamp
      }))
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching mobile dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}