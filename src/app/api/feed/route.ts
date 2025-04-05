import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth-options';

// Mock feed data - in a real app this would come from a database
const feedItems = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Sarah Miller',
    userAvatar: '/assets/feed/avatar1.jpg',
    content: 'Just completed the installation of new solar panels at Olympus City. Energy production increased by 15%! #infrastructure #energy',
    attachmentUrl: '/assets/feed/solar-panels.jpg',
    attachmentType: 'image',
    likesCount: 24,
    commentsCount: 5,
    isLikedByUser: false,
    tag: 'infrastructure',
    createdAt: new Date('2025-04-03T14:32:00'),
    txid: '0x7a9f8e7d6c5b4a3',
    ipfsHash: 'Qm7a9f8e7d6c5b4a3',
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'John Chen',
    userAvatar: '/assets/feed/avatar2.jpg',
    content: 'Exciting news! The hydroponics lab has successfully grown the first Martian-adapted tomatoes. Taste test tomorrow at the community center. #agriculture #food',
    likesCount: 42,
    commentsCount: 12,
    isLikedByUser: true,
    tag: 'agriculture',
    createdAt: new Date('2025-04-03T10:15:00'),
    txid: '0x6b5c4d3e2f1g0h',
    ipfsHash: 'Qm6b5c4d3e2f1g0h',
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Maria Rodriguez',
    userAvatar: '/assets/feed/avatar3.jpg',
    content: 'The Congress has approved funding for the new water reclamation facility! Construction begins next week. This will increase our water recycling efficiency from 94% to 98%. #governance #water',
    attachmentUrl: 'https://example.com/congress-proposal-247',
    attachmentType: 'link',
    likesCount: 36,
    commentsCount: 8,
    isLikedByUser: false,
    tag: 'governance',
    createdAt: new Date('2025-04-02T21:45:00'),
    txid: '0x5d4e3f2g1h0i9j',
    ipfsHash: 'Qm5d4e3f2g1h0i9j',
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Alex Kim',
    userAvatar: '/assets/feed/avatar4.jpg',
    content: 'Rover expedition to Valles Marineris departing tomorrow. Will be collecting geological samples and testing the new remote sensing equipment. Expected return in 12 days. #science #exploration',
    attachmentUrl: '/assets/feed/rover-expedition.jpg',
    attachmentType: 'image',
    likesCount: 18,
    commentsCount: 3,
    isLikedByUser: false,
    tag: 'science',
    createdAt: new Date('2025-04-02T16:20:00'),
    txid: '0x4c3d2e1f0g9h8i',
    ipfsHash: 'Qm4c3d2e1f0g9h8i',
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'Jamal Washington',
    userAvatar: '/assets/feed/avatar5.jpg',
    content: 'Maintenance alert: Life support systems in Habitat Module C will undergo routine maintenance from 0900-1100 MST tomorrow. No disruption to normal operations expected. #maintenance #safety',
    likesCount: 12,
    commentsCount: 2,
    isLikedByUser: false,
    tag: 'maintenance',
    createdAt: new Date('2025-04-02T14:05:00'),
    txid: '0x3b2a1z9y8x7w6v',
    ipfsHash: 'Qm3b2a1z9y8x7w6v',
  },
  {
    id: '6',
    userId: 'user6',
    userName: 'Emily Chen',
    userAvatar: '/assets/feed/avatar6.jpg',
    content: 'Just published my research on Martian soil microbiome development. Open access for all citizens. #science #research',
    attachmentUrl: '/assets/feed/research-document.pdf',
    attachmentType: 'document',
    likesCount: 29,
    commentsCount: 7,
    isLikedByUser: true,
    tag: 'science',
    createdAt: new Date('2025-04-02T09:30:00'),
    txid: '0x2a1b9c8d7e6f5g',
    ipfsHash: 'Qm2a1b9c8d7e6f5g',
  },
  {
    id: '7',
    userId: 'user7',
    userName: 'Omar Hassan',
    userAvatar: '/assets/feed/avatar7.jpg',
    content: 'Community announcement: The arts council is looking for submissions for the Martian Heritage Museum exhibition. Theme: "Life on the Red Planet." Deadline: 2 weeks. #community #culture',
    likesCount: 31,
    commentsCount: 9,
    isLikedByUser: false,
    tag: 'community',
    createdAt: new Date('2025-04-01T18:45:00'),
    txid: '0x1z2y3x4w5v6u7t',
    ipfsHash: 'Qm1z2y3x4w5v6u7t',
  },
  {
    id: '8',
    userId: 'user8',
    userName: 'Zoe Parker',
    userAvatar: '/assets/feed/avatar8.jpg',
    content: 'Transportation update: The new electric rover fleet is now operational. Book your transport via the Martian Transit app. #transportation #infrastructure',
    attachmentUrl: '/assets/feed/electric-rovers.jpg',
    attachmentType: 'image',
    likesCount: 15,
    commentsCount: 4,
    isLikedByUser: false,
    tag: 'infrastructure',
    createdAt: new Date('2025-04-01T13:10:00'),
    txid: '0x9i8u7y6t5r4e3w',
    ipfsHash: 'Qm9i8u7y6t5r4e3w',
  },
];

export async function GET(request: NextRequest) {
  // Get session to check authentication
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');
  
  // Filter by tag if provided
  let filteredItems = feedItems;
  if (tag) {
    filteredItems = feedItems.filter(item => item.tag === tag);
  }
  
  return NextResponse.json(filteredItems);
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
    if (!body.content || body.content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    // In a real app, this would save to a database and potentially
    // interact with blockchain/IPFS services to store the data
    
    // For now, we'll simulate a successful creation
    const newPost = {
      id: `post-${Date.now()}`,
      userId: session?.user?.id || 'unknown-user',
      userName: session?.user?.name || 'Martian User',
      userAvatar: session?.user?.image || undefined,
      content: body.content,
      attachmentUrl: body.attachmentUrl,
      attachmentType: body.attachmentType,
      likesCount: 0,
      commentsCount: 0,
      isLikedByUser: false,
      tag: body.tag || 'community',
      createdAt: new Date(),
      // In a real app, these would be generated after blockchain transactions
      txid: `0x${Math.random().toString(16).slice(2)}`,
      ipfsHash: `Qm${Math.random().toString(16).slice(2)}`,
    };
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}