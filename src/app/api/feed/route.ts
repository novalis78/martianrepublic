import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth-options';
import { getFeedPostsCollection, getLikesCollection, getCommentsCollection, getUsersCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Default feed posts for seeding empty database
const DEFAULT_FEED_POSTS = [
  {
    userName: 'Sarah Miller',
    content: 'Just completed the installation of new solar panels at Olympus City. Energy production increased by 15%! #infrastructure #energy',
    attachmentUrl: '/assets/feed/solar-panels.jpg',
    attachmentType: 'image',
    tag: 'infrastructure',
    createdAt: new Date('2025-04-03T14:32:00'),
  },
  {
    userName: 'John Chen',
    content: 'Exciting news! The hydroponics lab has successfully grown the first Martian-adapted tomatoes. Taste test tomorrow at the community center. #agriculture #food',
    tag: 'agriculture',
    createdAt: new Date('2025-04-03T10:15:00'),
  },
  {
    userName: 'Maria Rodriguez',
    content: 'The Congress has approved funding for the new water reclamation facility! Construction begins next week. This will increase our water recycling efficiency from 94% to 98%. #governance #water',
    tag: 'governance',
    createdAt: new Date('2025-04-02T21:45:00'),
  },
  {
    userName: 'Alex Kim',
    content: 'Rover expedition to Valles Marineris departing tomorrow. Will be collecting geological samples and testing the new remote sensing equipment. Expected return in 12 days. #science #exploration',
    attachmentUrl: '/assets/feed/rover-expedition.jpg',
    attachmentType: 'image',
    tag: 'science',
    createdAt: new Date('2025-04-02T16:20:00'),
  },
  {
    userName: 'Emily Chen',
    content: 'Just published my research on Martian soil microbiome development. Open access for all citizens. #science #research',
    attachmentType: 'document',
    tag: 'science',
    createdAt: new Date('2025-04-02T09:30:00'),
  },
  {
    userName: 'Omar Hassan',
    content: 'Community announcement: The arts council is looking for submissions for the Martian Heritage Museum exhibition. Theme: "Life on the Red Planet." Deadline: 2 weeks. #community #culture',
    tag: 'community',
    createdAt: new Date('2025-04-01T18:45:00'),
  },
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const feedCollection = await getFeedPostsCollection();
    const likesCollection = await getLikesCollection();
    const commentsCollection = await getCommentsCollection();

    // Build query filter
    const filter: Record<string, any> = {};
    if (tag && tag !== 'all') {
      filter.tag = tag;
    }

    // Check if we have any posts, if not seed with defaults
    const count = await feedCollection.countDocuments({});
    if (count === 0) {
      await feedCollection.insertMany(DEFAULT_FEED_POSTS.map(p => ({
        ...p,
        userId: null,
        userAvatar: null,
        likesCount: Math.floor(Math.random() * 40) + 5,
        commentsCount: Math.floor(Math.random() * 10),
        txid: `0x${Math.random().toString(16).slice(2, 18)}`,
        ipfsHash: `Qm${Math.random().toString(36).slice(2, 20)}`,
      })));
    }

    // Fetch feed posts with pagination
    const posts = await feedCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    // Get likes and comments counts, check if user liked
    const userId = session.user?.id;
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        // Get actual counts from collections
        const [likesCount, commentsCount, userLike] = await Promise.all([
          likesCollection.countDocuments({ postId: post._id }),
          commentsCollection.countDocuments({ postId: post._id }),
          userId ? likesCollection.findOne({ postId: post._id, userId: new ObjectId(userId) }) : null,
        ]);

        return {
          id: post._id.toString(),
          userId: post.userId?.toString() || null,
          userName: post.userName || 'Martian User',
          userAvatar: post.userAvatar,
          content: post.content,
          attachmentUrl: post.attachmentUrl,
          attachmentType: post.attachmentType,
          likesCount: likesCount || post.likesCount || 0,
          commentsCount: commentsCount || post.commentsCount || 0,
          isLikedByUser: !!userLike,
          tag: post.tag || 'community',
          createdAt: post.createdAt,
          txid: post.txid,
          ipfsHash: post.ipfsHash,
        };
      })
    );

    const totalCount = await feedCollection.countDocuments(filter);

    return NextResponse.json({
      posts: postsWithCounts,
      total: totalCount,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feed' },
      { status: 500 }
    );
  }
}

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

    // Validate required fields
    if (!body.content || body.content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const feedCollection = await getFeedPostsCollection();

    const now = new Date();
    const newPost = {
      userId: new ObjectId(session.user.id),
      userName: session.user.name || 'Martian User',
      userAvatar: session.user.image || null,
      content: body.content.trim(),
      attachmentUrl: body.attachmentUrl || null,
      attachmentType: body.attachmentType || null,
      likesCount: 0,
      commentsCount: 0,
      tag: body.tag || 'community',
      txid: null, // Will be set after blockchain anchoring
      ipfsHash: null, // Will be set after IPFS upload
      createdAt: now,
      updatedAt: now,
    };

    const result = await feedCollection.insertOne(newPost);

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...newPost,
      isLikedByUser: false,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}