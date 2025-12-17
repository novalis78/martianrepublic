'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Proposal {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  status: 'submitted' | 'voting' | 'passed' | 'rejected' | 'expired';
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  totalVotes: number;
  yesPercent: number;
  noPercent: number;
  threshold: number;
  expiresAt: string;
  createdAt: string;
}

export default function CongressPage() {
  const { data: session, status: authStatus } = useSession();
  const [activeTab, setActiveTab] = useState('active');
  const [isLoading, setIsLoading] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showNewProposalModal, setShowNewProposalModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [votingProposal, setVotingProposal] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state for new proposal
  const [newProposal, setNewProposal] = useState({
    title: '',
    content: '',
    category: '',
    duration: 14,
    agreedToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProposals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/congress/proposals');

      if (!response.ok) {
        throw new Error('Failed to fetch proposals');
      }

      const data = await response.json();
      setProposals(data.proposals || []);
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setError('Failed to load proposals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetchProposals();
    } else if (authStatus === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [authStatus, fetchProposals]);

  const handleVote = async (proposalId: string, vote: 'Y' | 'N' | 'A') => {
    try {
      setVotingProposal(proposalId);
      setError(null);

      const response = await fetch('/api/congress/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId, vote }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit vote');
      }

      // Update the proposal in our local state with new vote counts
      setProposals(prev => prev.map(p => {
        if (p.id === proposalId) {
          return {
            ...p,
            yesVotes: data.counts.yesVotes,
            noVotes: data.counts.noVotes,
            abstainVotes: data.counts.abstainVotes,
            totalVotes: data.counts.totalVotes,
            yesPercent: data.counts.yesPercent,
            noPercent: data.counts.noPercent,
          };
        }
        return p;
      }));

      setSuccessMessage('Your vote has been recorded!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit vote');
      setTimeout(() => setError(null), 5000);
    } finally {
      setVotingProposal(null);
    }
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProposal.title || !newProposal.content || !newProposal.agreedToTerms) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch('/api/congress/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProposal.title,
          content: newProposal.content,
          category: newProposal.category || 'general',
          duration: newProposal.duration,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create proposal');
      }

      // Refresh proposals
      await fetchProposals();

      // Reset form and close modal
      setNewProposal({ title: '', content: '', category: '', duration: 14, agreedToTerms: false });
      setShowNewProposalModal(false);
      setSuccessMessage('Proposal created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFilteredProposals = () => {
    if (activeTab === 'active') {
      return proposals.filter(p => p.status === 'voting' || p.status === 'submitted');
    } else if (activeTab === 'passed') {
      return proposals.filter(p => p.status === 'passed');
    } else if (activeTab === 'rejected') {
      return proposals.filter(p => p.status === 'rejected' || p.status === 'expired');
    }
    return proposals;
  };

  const canCreateProposal = () => {
    return session?.user?.citizenStatus === 'citizen';
  };

  const canVote = () => {
    return session?.user?.citizenStatus === 'citizen';
  };

  if (authStatus === 'loading' || isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mars-red"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-lg flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <h1 className="text-3xl font-bold mb-2">Martian Congress</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Shape the future of Mars through democratic governance and collective decision-making.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Congress Dashboard</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Active Proposals</div>
                  <div className="text-2xl font-bold">{proposals.filter(p => p.status === 'voting').length}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Your Voting Power</div>
                  <div className="text-2xl font-bold">
                    {session?.user?.citizenStatus === 'citizen' ? '1.0' : '0.0'}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Recent Participation</div>
                  <div className="text-2xl font-bold">78%</div>
                </div>
              </div>
              
              {canCreateProposal() ? (
                <button
                  onClick={() => setShowNewProposalModal(true)}
                  className="w-full mt-6 px-4 py-2 bg-mars-red text-white rounded-md hover:bg-mars-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red"
                >
                  New Proposal
                </button>
              ) : (
                <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-sm text-yellow-800 dark:text-yellow-200">
                  <p>You need to be a citizen to create proposals.</p>
                  <Link href="/citizen" className="mt-1 text-mars-red hover:underline block">
                    Apply for citizenship →
                  </Link>
                </div>
              )}
            </div>
            
            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Congress Stats</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Proposals</span>
                  <span className="font-medium">{proposals.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Passed</span>
                  <span className="font-medium">{proposals.filter(p => p.status === 'passed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Rejected</span>
                  <span className="font-medium">{proposals.filter(p => p.status === 'rejected').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Citizens</span>
                  <span className="font-medium">1,432</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Avg. Participation</span>
                  <span className="font-medium">72%</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link href="/congress/stats" className="text-sm text-mars-red hover:text-mars-red/80">
                  View detailed statistics →
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'active'
                        ? 'border-mars-red text-mars-red'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Active Proposals
                  </button>
                  <button
                    onClick={() => setActiveTab('passed')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'passed'
                        ? 'border-mars-red text-mars-red'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Passed
                  </button>
                  <button
                    onClick={() => setActiveTab('rejected')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'rejected'
                        ? 'border-mars-red text-mars-red'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Rejected
                  </button>
                </nav>
              </div>

              {/* Proposals List */}
              <div className="p-6">
                {getFilteredProposals().length > 0 ? (
                  <div className="space-y-6">
                    {getFilteredProposals().map((proposal) => (
                      <div key={proposal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold hover:text-mars-red">
                              <Link href={`/congress/proposals/${proposal.id}`}>
                                {proposal.title}
                              </Link>
                            </h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${proposal.status === 'voting' 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                                : proposal.status === 'passed'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}
                            >
                              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                            {proposal.description}
                          </p>
                          
                          {(proposal.status === 'voting' || proposal.status === 'submitted') && (
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-green-600 dark:text-green-400">Yes: {proposal.yesPercent || 0}%</span>
                                <span className="text-red-600 dark:text-red-400">No: {proposal.noPercent || 0}%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                                <div
                                  className="h-full bg-green-500"
                                  style={{ width: `${proposal.yesPercent || 0}%` }}
                                ></div>
                                <div
                                  className="h-full bg-red-500"
                                  style={{ width: `${proposal.noPercent || 0}%` }}
                                ></div>
                              </div>
                              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {proposal.totalVotes || 0} votes • Needs {proposal.threshold || 51}% to pass • Ends {new Date(proposal.expiresAt).toLocaleDateString()}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs mr-2">
                                {proposal.category || 'general'}
                              </span>
                              {new Date(proposal.createdAt).toLocaleDateString()}
                            </div>
                            
                            {(proposal.status === 'voting' || proposal.status === 'submitted') && canVote() && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleVote(proposal.id, 'Y')}
                                  disabled={votingProposal === proposal.id}
                                  className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800 text-sm font-medium disabled:opacity-50"
                                >
                                  {votingProposal === proposal.id ? '...' : 'Yes'}
                                </button>
                                <button
                                  onClick={() => handleVote(proposal.id, 'N')}
                                  disabled={votingProposal === proposal.id}
                                  className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 text-sm font-medium disabled:opacity-50"
                                >
                                  {votingProposal === proposal.id ? '...' : 'No'}
                                </button>
                                <button
                                  onClick={() => handleVote(proposal.id, 'A')}
                                  disabled={votingProposal === proposal.id}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 text-sm font-medium disabled:opacity-50"
                                >
                                  {votingProposal === proposal.id ? '...' : 'Abstain'}
                                </button>
                              </div>
                            )}

                            {(proposal.status === 'voting' || proposal.status === 'submitted') && !canVote() && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                                Citizens only
                              </span>
                            )}

                            {proposal.status !== 'voting' && proposal.status !== 'submitted' && (
                              <Link
                                href={`/congress/proposals/${proposal.id}`}
                                className="text-sm text-mars-red hover:text-mars-red/80"
                              >
                                View Details →
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No proposals found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                      {activeTab === 'active' 
                        ? 'There are no active proposals at the moment. Check back later or create a new one.'
                        : `There are no ${activeTab} proposals to display.`
                      }
                    </p>
                    
                    {canCreateProposal() && (
                      <button
                        onClick={() => setShowNewProposalModal(true)}
                        className="mt-6 px-4 py-2 bg-mars-red text-white rounded-md hover:bg-mars-red/90"
                      >
                        Create a New Proposal
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Proposal Modal */}
      {showNewProposalModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-mars-dark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-mars-dark px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                      Create New Proposal
                    </h3>
                    
                    <form className="space-y-4" onSubmit={handleCreateProposal}>
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          value={newProposal.title}
                          onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          placeholder="Proposal title..."
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Content
                        </label>
                        <textarea
                          id="content"
                          rows={4}
                          value={newProposal.content}
                          onChange={(e) => setNewProposal(prev => ({ ...prev, content: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          placeholder="Describe your proposal in detail..."
                          required
                          disabled={isSubmitting}
                        ></textarea>
                      </div>

                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Category
                        </label>
                        <select
                          id="category"
                          value={newProposal.category}
                          onChange={(e) => setNewProposal(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          disabled={isSubmitting}
                        >
                          <option value="">Select a category</option>
                          <option value="constitutional">Constitutional</option>
                          <option value="governance">Governance</option>
                          <option value="economic">Economics</option>
                          <option value="infrastructure">Infrastructure</option>
                          <option value="safety">Safety</option>
                          <option value="social">Social</option>
                          <option value="science">Science & Education</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="votingPeriod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Voting Period (days)
                        </label>
                        <input
                          type="number"
                          id="votingPeriod"
                          min="1"
                          max="30"
                          value={newProposal.duration}
                          onChange={(e) => setNewProposal(prev => ({ ...prev, duration: parseInt(e.target.value) || 14 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="terms"
                            type="checkbox"
                            checked={newProposal.agreedToTerms}
                            onChange={(e) => setNewProposal(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
                            className="h-4 w-4 text-mars-red focus:ring-mars-red border-gray-300 rounded"
                            disabled={isSubmitting}
                            required
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
                            I certify that this proposal complies with Martian laws and constitution
                          </label>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg -mx-4 -mb-4 mt-6">
                        <button
                          type="submit"
                          disabled={isSubmitting || !newProposal.agreedToTerms}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-mars-red text-base font-medium text-white hover:bg-mars-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowNewProposalModal(false);
                            setNewProposal({ title: '', content: '', category: '', duration: 14, agreedToTerms: false });
                          }}
                          disabled={isSubmitting}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}