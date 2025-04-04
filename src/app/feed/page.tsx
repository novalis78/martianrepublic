'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

interface FeedItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'document' | 'link';
  likesCount: number;
  commentsCount: number;
  isLikedByUser: boolean;
  tag: string;
  createdAt: Date;
  txid?: string;
  ipfsHash?: string;
}

export default function FeedPage() {
  const { data: session, status } = useSession();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  
  useEffect(() => {
    // In a real implementation, feed items would be fetched from an API
    const mockFeedItems: FeedItem[] = [
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

    // Simulate loading
    setTimeout(() => {
      setFeedItems(mockFeedItems);
      setIsLoading(false);
    }, 500);
  }, []);

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'infrastructure':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'agriculture':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'governance':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'science':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'community':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const handleLike = (id: string) => {
    setFeedItems(prevItems => 
      prevItems.map(item => 
        item.id === id
          ? { 
              ...item, 
              isLikedByUser: !item.isLikedByUser,
              likesCount: item.isLikedByUser ? item.likesCount - 1 : item.likesCount + 1
            }
          : item
      )
    );
  };

  const handleSubmitPost = () => {
    if (!newPostContent.trim()) return;
    
    // In a real implementation, this would post to an API
    const newPost: FeedItem = {
      id: `new-${Date.now()}`,
      userId: session?.user?.id || 'unknown',
      userName: session?.user?.name || 'Martian User',
      userAvatar: session?.user?.image,
      content: newPostContent,
      likesCount: 0,
      commentsCount: 0,
      isLikedByUser: false,
      tag: 'community', // Default tag
      createdAt: new Date(),
    };
    
    setFeedItems(prevItems => [newPost, ...prevItems]);
    setNewPostContent('');
    setShowPostModal(false);
  };

  const getFilteredFeed = () => {
    if (!activeTag) return feedItems;
    return feedItems.filter(item => item.tag === activeTag);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mars-red"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-6 text-center">Martian Community Feed</h1>
        <p className="mb-6 text-center max-w-md">
          Sign in to view and participate in the Martian Republic community feed.
        </p>
        <Link
          href="/auth/sign-in?callbackUrl=/feed"
          className="px-4 py-2 bg-mars-red text-white rounded hover:bg-opacity-90"
        >
          Sign In to Access Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Martian Community Feed</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Stay updated with the latest news and activities from the Martian community.
            </p>
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="mt-4 md:mt-0 px-4 py-2 bg-mars-red text-white rounded-md hover:bg-mars-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Filter by Topic</h2>
              
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTag(null)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    activeTag === null 
                      ? 'bg-mars-red/10 text-mars-red' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  All Posts
                </button>
                <button 
                  onClick={() => setActiveTag('infrastructure')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    activeTag === 'infrastructure' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Infrastructure
                </button>
                <button 
                  onClick={() => setActiveTag('agriculture')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    activeTag === 'agriculture' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Agriculture
                </button>
                <button 
                  onClick={() => setActiveTag('governance')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    activeTag === 'governance' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Governance
                </button>
                <button 
                  onClick={() => setActiveTag('science')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    activeTag === 'science' 
                      ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Science & Research
                </button>
                <button 
                  onClick={() => setActiveTag('maintenance')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    activeTag === 'maintenance' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Maintenance & Safety
                </button>
                <button 
                  onClick={() => setActiveTag('community')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    activeTag === 'community' 
                      ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Community & Events
                </button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Active Users</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-mars-red/20 flex-shrink-0 overflow-hidden">
                    <Image 
                      src="/assets/feed/avatar1.jpg" 
                      alt="Sarah Miller" 
                      width={40} 
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Sarah Miller</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">5 posts this week</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-mars-red/20 flex-shrink-0 overflow-hidden">
                    <Image 
                      src="/assets/feed/avatar2.jpg" 
                      alt="John Chen" 
                      width={40} 
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">John Chen</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">3 posts this week</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-mars-red/20 flex-shrink-0 overflow-hidden">
                    <Image 
                      src="/assets/feed/avatar3.jpg" 
                      alt="Maria Rodriguez" 
                      width={40} 
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Maria Rodriguez</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">2 posts this week</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link href="/citizen/directory" className="text-sm text-mars-red hover:text-mars-red/80">
                  View all citizens →
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Post composer for small screens */}
            <div className="lg:hidden bg-white dark:bg-mars-dark rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-mars-red/20 flex-shrink-0 overflow-hidden">
                  {session?.user?.image ? (
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || 'User'} 
                      width={40} 
                      height={40}
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-mars-red flex items-center justify-center text-white">
                      {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'M'}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowPostModal(true)}
                  className="ml-3 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-gray-500 dark:text-gray-400 text-left flex-grow"
                >
                  What's happening on Mars?
                </button>
              </div>
            </div>

            {/* Feed items */}
            <div className="space-y-6">
              {getFilteredFeed().map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white dark:bg-mars-dark rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => window.location.href = `/feed/${item.id}`}
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-mars-red/20 flex-shrink-0 overflow-hidden">
                        {item.userAvatar ? (
                          <Image 
                            src={item.userAvatar} 
                            alt={item.userName} 
                            width={40} 
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-mars-red flex items-center justify-center text-white">
                            {item.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex-grow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{item.userName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(item.createdAt)}</p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagColor(item.tag)}`}>
                            {item.tag.charAt(0).toUpperCase() + item.tag.slice(1)}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-gray-900 dark:text-white whitespace-pre-line">{item.content}</p>
                        </div>
                        
                        {item.attachmentUrl && (
                          <div className="mt-3">
                            {item.attachmentType === 'image' && (
                              <div className="relative h-64 rounded-lg overflow-hidden">
                                <Image 
                                  src={item.attachmentUrl} 
                                  alt="Post attachment" 
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            {item.attachmentType === 'document' && (
                              <a
                                href={item.attachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block bg-gray-100 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-200 dark:hover:bg-gray-700"
                              >
                                <div className="flex items-center">
                                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                  </svg>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">View Document</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF Document</p>
                                  </div>
                                </div>
                              </a>
                            )}
                            {item.attachmentType === 'link' && (
                              <a
                                href={item.attachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block bg-gray-100 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-200 dark:hover:bg-gray-700"
                              >
                                <div className="flex items-center">
                                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                  </svg>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">View Resource</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.attachmentUrl}</p>
                                  </div>
                                </div>
                              </a>
                            )}
                          </div>
                        )}
                        
                        {(item.txid || item.ipfsHash) && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.txid && (
                              <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                TX: {item.txid.substring(0, 8)}...
                              </span>
                            )}
                            {item.ipfsHash && (
                              <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                                </svg>
                                IPFS: {item.ipfsHash.substring(0, 8)}...
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(item.id);
                        }}
                        className={`flex items-center space-x-2 ${
                          item.isLikedByUser ? 'text-mars-red' : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {item.isLikedByUser ? (
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                        )}
                        <span>{item.likesCount}</span>
                      </button>
                      <Link 
                        href={`/feed/${item.id}`}
                        className="flex items-center space-x-2 text-gray-500 dark:text-gray-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{item.commentsCount}</span>
                      </Link>
                      <button 
                        className="flex items-center space-x-2 text-gray-500 dark:text-gray-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {getFilteredFeed().length === 0 && (
                <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-8 text-center">
                  <div className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No posts found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    {activeTag 
                      ? `There are no posts with the ${activeTag} tag yet. Be the first to post about this topic!` 
                      : 'No posts are available right now. Start the conversation by creating a new post!'}
                  </p>
                  
                  <button
                    onClick={() => setShowPostModal(true)}
                    className="mt-6 px-4 py-2 bg-mars-red text-white rounded-md hover:bg-mars-red/90"
                  >
                    Create a Post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-mars-dark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-mars-dark px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                      Create a Post
                    </h3>
                    
                    <div className="flex items-start mb-4">
                      <div className="h-10 w-10 rounded-full bg-mars-red/20 flex-shrink-0 overflow-hidden">
                        {session?.user?.image ? (
                          <Image 
                            src={session.user.image} 
                            alt={session.user.name || 'User'} 
                            width={40} 
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-mars-red flex items-center justify-center text-white">
                            {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'M'}
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{session.user?.name || 'Martian User'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Posting to the Martian Feed</p>
                      </div>
                    </div>
                    
                    <textarea
                      placeholder="What's happening on Mars?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700 dark:text-white min-h-[120px]"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    ></textarea>
                    
                    <div className="mt-4">
                      <label htmlFor="postTag" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tag
                      </label>
                      <select
                        id="postTag"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                      >
                        <option value="community">Community & Events</option>
                        <option value="infrastructure">Infrastructure</option>
                        <option value="agriculture">Agriculture</option>
                        <option value="governance">Governance</option>
                        <option value="science">Science & Research</option>
                        <option value="maintenance">Maintenance & Safety</option>
                      </select>
                    </div>
                    
                    <div className="mt-4">
                      <button className="inline-flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Add Image
                      </button>
                      <button className="inline-flex items-center text-sm text-gray-700 dark:text-gray-300 ml-4">
                        <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Add Link
                      </button>
                      <button className="inline-flex items-center text-sm text-gray-700 dark:text-gray-300 ml-4">
                        <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        Attach File
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-mars-red text-base font-medium text-white hover:bg-mars-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSubmitPost}
                  disabled={!newPostContent.trim()}
                >
                  Post
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                  onClick={() => setShowPostModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}