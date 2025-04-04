'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
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

interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [post, setPost] = useState<FeedItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const postId = params.id as string;
  
  useEffect(() => {
    // In a real implementation, post details would be fetched from an API
    const fetchPostDetails = async () => {
      setIsLoading(true);
      try {
        // Simulated API call
        // In real app: const response = await fetch(`/api/feed/${postId}`);
        
        // For demo, we're using mock data
        const mockPost: FeedItem = {
          id: postId,
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
        };
        
        // Simulated API call for comments
        // In real app: const commentsResponse = await fetch(`/api/feed/comments?postId=${postId}`);
        
        const mockComments: Comment[] = [
          {
            id: 'c1',
            postId: postId,
            userId: 'user2',
            userName: 'John Chen',
            userAvatar: '/assets/feed/avatar2.jpg',
            content: 'Great work on the solar panel installation! What's the expected power output increase?',
            createdAt: new Date('2025-04-03T15:10:00'),
          },
          {
            id: 'c2',
            postId: postId,
            userId: 'user1',
            userName: 'Sarah Miller',
            userAvatar: '/assets/feed/avatar1.jpg',
            content: 'Thanks John! We're expecting about 120 kWh per day in additional output.',
            createdAt: new Date('2025-04-03T15:20:00'),
          },
          {
            id: 'c3',
            postId: postId,
            userId: 'user5',
            userName: 'Jamal Washington',
            userAvatar: '/assets/feed/avatar5.jpg',
            content: 'How are they holding up against the dust storms?',
            createdAt: new Date('2025-04-03T16:45:00'),
          },
        ];
        
        setPost(mockPost);
        setComments(mockComments);
      } catch (error) {
        console.error('Error fetching post details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPostDetails();
  }, [postId]);
  
  const handleLike = async () => {
    if (!post) return;
    
    // In a real app, this would call an API
    // const response = await fetch('/api/feed/like', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ 
    //     postId: post.id,
    //     action: post.isLikedByUser ? 'unlike' : 'like'
    //   })
    // });
    
    // Optimistic update for demo
    setPost({
      ...post,
      isLikedByUser: !post.isLikedByUser,
      likesCount: post.isLikedByUser ? post.likesCount - 1 : post.likesCount + 1
    });
  };
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !post) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call an API
      // const response = await fetch('/api/feed/comments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     postId: post.id,
      //     content: commentText
      //   })
      // });
      
      // Simulate API response
      const newComment: Comment = {
        id: `c${Date.now()}`,
        postId: post.id,
        userId: session?.user?.id || 'unknown',
        userName: session?.user?.name || 'Martian User',
        userAvatar: session?.user?.image,
        content: commentText,
        createdAt: new Date(),
      };
      
      // Update comment count and comments list
      setPost({
        ...post,
        commentsCount: post.commentsCount + 1
      });
      
      setComments([...comments, newComment]);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          href={`/auth/sign-in?callbackUrl=/feed/${postId}`}
          className="px-4 py-2 bg-mars-red text-white rounded hover:bg-opacity-90"
        >
          Sign In to View Post
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-6 text-center">Post Not Found</h1>
        <p className="mb-6 text-center max-w-md">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/feed"
          className="px-4 py-2 bg-mars-red text-white rounded hover:bg-opacity-90"
        >
          Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/feed"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-mars-red mb-4"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Feed
          </Link>
          
          <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              {/* Post header */}
              <div className="flex items-start">
                <div className="h-12 w-12 rounded-full bg-mars-red/20 flex-shrink-0 overflow-hidden">
                  {post.userAvatar ? (
                    <Image 
                      src={post.userAvatar} 
                      alt={post.userName} 
                      width={48} 
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-mars-red flex items-center justify-center text-white">
                      {post.userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-grow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">{post.userName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagColor(post.tag)}`}>
                      {post.tag.charAt(0).toUpperCase() + post.tag.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Post content */}
              <div className="mt-4">
                <p className="text-gray-900 dark:text-white text-lg whitespace-pre-line">{post.content}</p>
              </div>
              
              {/* Post attachment */}
              {post.attachmentUrl && (
                <div className="mt-4">
                  {post.attachmentType === 'image' && (
                    <div className="relative h-80 rounded-lg overflow-hidden">
                      <Image 
                        src={post.attachmentUrl} 
                        alt="Post attachment" 
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {post.attachmentType === 'document' && (
                    <a
                      href={post.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gray-100 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">View Document</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PDF Document</p>
                        </div>
                      </div>
                    </a>
                  )}
                  {post.attachmentType === 'link' && (
                    <a
                      href={post.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gray-100 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">View Resource</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{post.attachmentUrl}</p>
                        </div>
                      </div>
                    </a>
                  )}
                </div>
              )}
              
              {/* Blockchain reference */}
              {(post.txid || post.ipfsHash) && (
                <div className="mt-4 flex flex-wrap gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {post.txid && (
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Transaction ID: <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">{post.txid}</code>
                      </span>
                    </div>
                  )}
                  {post.ipfsHash && (
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        IPFS Hash: <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">{post.ipfsHash}</code>
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Post actions */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={handleLike}
                  className={`flex items-center space-x-2 ${
                    post.isLikedByUser ? 'text-mars-red' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {post.isLikedByUser ? (
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  )}
                  <span className="text-lg">{post.likesCount}</span>
                </button>
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-lg">{post.commentsCount}</span>
                </div>
                <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Comments section */}
        <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Comments</h2>
            
            {/* Comment form */}
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="flex items-start">
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
                <div className="ml-3 flex-grow">
                  <textarea
                    placeholder="Write a comment..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700 dark:text-white min-h-[80px]"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                  ></textarea>
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || !commentText.trim()}
                      className="px-4 py-2 bg-mars-red text-white rounded-md hover:bg-mars-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red disabled:opacity-50"
                    >
                      {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
            
            {/* Comments list */}
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-mars-red/20 flex-shrink-0 overflow-hidden">
                        {comment.userAvatar ? (
                          <Image 
                            src={comment.userAvatar} 
                            alt={comment.userName} 
                            width={40} 
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-mars-red flex items-center justify-center text-white">
                            {comment.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex-grow">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium">{comment.userName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.createdAt)}</p>
                          </div>
                          <p className="text-gray-900 dark:text-white whitespace-pre-line">{comment.content}</p>
                        </div>
                        <div className="mt-1 flex items-center space-x-4 ml-1">
                          <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-mars-red">
                            Like
                          </button>
                          <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-mars-red">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">No comments yet</p>
                  <p className="text-gray-500 dark:text-gray-400">Be the first to share your thoughts on this post!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}