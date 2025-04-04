import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth-options';

export async function POST(request: NextRequest) {
  // Get session to check authentication
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    // In a real app, this would interact with a database to toggle the like status
    // It might also record the action on the blockchain for transparency
    
    // For demo purposes, we'll simulate a successful like toggle
    return NextResponse.json({
      success: true,
      postId: body.postId,
      // In a real app, this would reflect the actual new state
      isLiked: body.action === 'like', // 'like' or 'unlike'
    });
  } catch (error) {
    console.error('Error processing like:', error);
    return NextResponse.json(
      { error: 'Failed to process like' },
      { status: 500 }
    );
  }
}