import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth-options';
import { getLikesCollection, getFeedPostsCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const likesCollection = await getLikesCollection();
    const feedCollection = await getFeedPostsCollection();

    const userId = new ObjectId(session.user.id);
    const postObjectId = new ObjectId(postId);

    // Check if like exists
    const existingLike = await likesCollection.findOne({
      postId: postObjectId,
      userId,
    });

    let isLiked: boolean;
    let likesCount: number;

    if (existingLike) {
      // Unlike - remove the like
      await likesCollection.deleteOne({
        postId: postObjectId,
        userId,
      });

      // Decrement likes count on post
      await feedCollection.updateOne(
        { _id: postObjectId },
        { $inc: { likesCount: -1 } }
      );

      isLiked = false;
    } else {
      // Like - add new like
      await likesCollection.insertOne({
        postId: postObjectId,
        userId,
        createdAt: new Date(),
      });

      // Increment likes count on post
      await feedCollection.updateOne(
        { _id: postObjectId },
        { $inc: { likesCount: 1 } }
      );

      isLiked = true;
    }

    // Get updated count
    likesCount = await likesCollection.countDocuments({ postId: postObjectId });

    return NextResponse.json({
      success: true,
      postId,
      isLiked,
      likesCount,
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}