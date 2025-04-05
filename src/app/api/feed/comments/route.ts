import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth-options';

// Define comment interface
interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: Date;
}

// Mock comments data - in a real app this would come from a database
const mockComments: Record<string, Comment[]> = {
  '1': [ // Comments for post ID 1
    {
      id: 'c1',
      postId: '1',
      userId: 'user2',
      userName: 'John Chen',
      userAvatar: '/assets/feed/avatar2.jpg',
      content: 'Great work on the solar panel installation! What\'s the expected power output increase?',
      createdAt: new Date('2025-04-03T15:10:00'),
    },
    {
      id: 'c2',
      postId: '1',
      userId: 'user1',
      userName: 'Sarah Miller',
      userAvatar: '/assets/feed/avatar1.jpg',
      content: 'Thanks John! We\'re expecting about 120 kWh per day in additional output.',
      createdAt: new Date('2025-04-03T15:20:00'),
    },
    {
      id: 'c3',
      postId: '1',
      userId: 'user5',
      userName: 'Jamal Washington',
      userAvatar: '/assets/feed/avatar5.jpg',
      content: 'How are they holding up against the dust storms?',
      createdAt: new Date('2025-04-03T16:45:00'),
    },
  ],
  '2': [ // Comments for post ID 2
    {
      id: 'c4',
      postId: '2',
      userId: 'user3',
      userName: 'Maria Rodriguez',
      userAvatar: '/assets/feed/avatar3.jpg',
      content: 'I can\'t wait to taste these tomatoes! Will they be available in the community kitchen?',
      createdAt: new Date('2025-04-03T11:05:00'),
    },
    {
      id: 'c5',
      postId: '2',
      userId: 'user2',
      userName: 'John Chen',
      userAvatar: '/assets/feed/avatar2.jpg',
      content: 'Yes, we\'ll distribute the first batch through the community kitchen. The taste is slightly more tart than Earth tomatoes due to the soil composition.',
      createdAt: new Date('2025-04-03T11:30:00'),
    },
  ]
};

export async function GET(request: NextRequest) {
  // Get session to check authentication
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Get post ID from query parameters
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  
  if (!postId) {
    return NextResponse.json(
      { error: 'Post ID is required' },
      { status: 400 }
    );
  }
  
  // Return comments for the specified post
  const comments = mockComments[postId] || [];
  
  return NextResponse.json(comments);
}

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
    if (!body.postId || !body.content || body.content.trim() === '') {
      return NextResponse.json(
        { error: 'Post ID and content are required' },
        { status: 400 }
      );
    }
    
    // In a real app, this would save to a database
    
    // Simulate creating a new comment
    const newComment = {
      id: `c${Date.now()}`,
      postId: body.postId,
      userId: session.user.id || 'unknown-user',
      userName: session.user.name || 'Martian User',
      userAvatar: session.user.image,
      content: body.content,
      createdAt: new Date(),
    };
    
    // In a real app, we would add this to the database
    // For this mock, we'll just return the new comment
    
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}