'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

interface LogEntry {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdById: string;
  entryType: 'research' | 'engineering' | 'exploration' | 'social' | 'governance' | 'other';
  location: string;
  tags: string[];
  ipfsHash?: string;
  txid?: string;
  createdAt: Date;
  sol: number;
}

export default function LogbookPage() {
  const { data: session, status: authStatus } = useSession();
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [entryFilter, setEntryFilter] = useState('');
  
  useEffect(() => {
    // In a real implementation, fetch log entries from an API
    const mockLogEntries: LogEntry[] = [
      {
        id: '1',
        title: 'Research on Martian Soil Composition',
        content: 'Collected samples from Ares Vallis region. Initial analysis shows high iron oxide content, approximately 15-20% by mass. Soil has potential for in-situ resource utilization for construction materials. Further spectroscopic analysis needed to determine trace element composition.',
        createdBy: 'Sarah Miller',
        createdById: 'user123',
        entryType: 'research',
        location: 'Ares Vallis',
        tags: ['soil', 'research', 'geology', 'samples'],
        ipfsHash: 'Qm1234567890abcdef',
        txid: 'MARS1234567890',
        createdAt: new Date('2025-03-23'),
        sol: 423,
      },
      {
        id: '2',
        title: 'Water Recycling System Maintenance',
        content: 'Performed quarterly maintenance on primary filtration system. Replaced carbon filters and calibrated pressure sensors. System efficiency improved by 3.2% after maintenance. Recommended replacing UV sterilization lamps within next 50 sols.',
        createdBy: 'John Chen',
        createdById: 'user456',
        entryType: 'engineering',
        location: 'Olympus Base',
        tags: ['engineering', 'maintenance', 'water', 'infrastructure'],
        ipfsHash: 'Qm0987654321fedcba',
        txid: 'MARS0987654321',
        createdAt: new Date('2025-03-21'),
        sol: 421,
      },
      {
        id: '3',
        title: 'Exploration of Candor Chasma Cave Network',
        content: 'Conducted initial survey of newly discovered lava tube network in Candor Chasma region. Cave system extends approximately 3.2km into cliff face with multiple chambers. Evidence of past water flow observed. Could serve as natural radiation shelter for future outpost.',
        createdBy: 'Miguel Rodriguez',
        createdById: 'user789',
        entryType: 'exploration',
        location: 'Candor Chasma',
        tags: ['exploration', 'caves', 'geology', 'habitat'],
        ipfsHash: 'Qm2468013579abcdef',
        txid: 'MARS2468013579',
        createdAt: new Date('2025-03-18'),
        sol: 418,
      },
      {
        id: '4',
        title: 'Community Meeting on Resource Allocation',
        content: 'Facilitated community discussion regarding water usage quotas for agricultural section. Concerns raised about increasing allocation for experimental crops. Agreement reached to increase allocation by 5% pending successful yield improvements from current experiments.',
        createdBy: 'Aisha Kwame',
        createdById: 'user101',
        entryType: 'governance',
        location: 'Olympus Commons',
        tags: ['governance', 'resources', 'agriculture', 'water'],
        ipfsHash: 'Qm1357924680abcdef',
        txid: 'MARS1357924680',
        createdAt: new Date('2025-03-15'),
        sol: 415,
      },
      {
        id: '5',
        title: 'Solar Panel Array Expansion',
        content: 'Completed installation of additional 50kW solar panel array in Grid Sector E-7. New panels increase total power generation capacity by 8%. Dust mitigation system also installed with automated cleaning schedule. Integration with power grid completed and tested.',
        createdBy: 'Hiroshi Tanaka',
        createdById: 'user202',
        entryType: 'engineering',
        location: 'Olympus Power Grid',
        tags: ['engineering', 'power', 'solar', 'infrastructure'],
        ipfsHash: 'Qm5678901234abcdef',
        txid: 'MARS5678901234',
        createdAt: new Date('2025-03-12'),
        sol: 412,
      },
    ];

    // Simulate loading
    setTimeout(() => {
      setLogEntries(mockLogEntries);
      setIsLoading(false);
    }, 500);
  }, []);

  const getFilteredEntries = () => {
    let filtered = logEntries;
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(entry => entry.entryType === activeTab);
    }
    
    if (entryFilter) {
      const lowercaseFilter = entryFilter.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(lowercaseFilter) ||
        entry.content.toLowerCase().includes(lowercaseFilter) ||
        entry.tags.some(tag => tag.toLowerCase().includes(lowercaseFilter))
      );
    }
    
    return filtered;
  };

  const getEntryTypeIcon = (type: string) => {
    switch (type) {
      case 'research':
        return (
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
        );
      case 'engineering':
        return (
          <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        );
      case 'exploration':
        return (
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 dark:bg-green-900 dark:text-green-300">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'governance':
        return (
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 dark:bg-purple-900 dark:text-purple-300">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        );
      case 'social':
        return (
          <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 dark:bg-pink-900 dark:text-pink-300">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
    }
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
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Martian Logbook</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Record and browse activities on Mars - permanently stored on the blockchain.
            </p>
          </div>
          
          <button
            onClick={() => setShowNewEntryModal(true)}
            className="mt-4 md:mt-0 px-4 py-2 bg-mars-red text-white rounded-md hover:bg-mars-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red"
          >
            Create New Entry
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Filter Entries</h2>
              
              <div className="mb-6">
                <label htmlFor="searchEntries" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="searchEntries"
                  placeholder="Search entries..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                  value={entryFilter}
                  onChange={(e) => setEntryFilter(e.target.value)}
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Entry Type</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('all')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeTab === 'all' 
                        ? 'bg-mars-red/10 text-mars-red' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    All Entries
                  </button>
                  <button 
                    onClick={() => setActiveTab('research')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeTab === 'research' 
                        ? 'bg-mars-red/10 text-mars-red' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Research
                  </button>
                  <button 
                    onClick={() => setActiveTab('engineering')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeTab === 'engineering' 
                        ? 'bg-mars-red/10 text-mars-red' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Engineering & Maintenance
                  </button>
                  <button 
                    onClick={() => setActiveTab('exploration')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeTab === 'exploration' 
                        ? 'bg-mars-red/10 text-mars-red' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Exploration
                  </button>
                  <button 
                    onClick={() => setActiveTab('governance')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeTab === 'governance' 
                        ? 'bg-mars-red/10 text-mars-red' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Governance
                  </button>
                  <button 
                    onClick={() => setActiveTab('social')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeTab === 'social' 
                        ? 'bg-mars-red/10 text-mars-red' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Social & Cultural
                  </button>
                  <button 
                    onClick={() => setActiveTab('other')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeTab === 'other' 
                        ? 'bg-mars-red/10 text-mars-red' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Other
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Logbook Stats</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Entries</span>
                  <span className="font-medium">{logEntries.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Research</span>
                  <span className="font-medium">{logEntries.filter(e => e.entryType === 'research').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Engineering</span>
                  <span className="font-medium">{logEntries.filter(e => e.entryType === 'engineering').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Exploration</span>
                  <span className="font-medium">{logEntries.filter(e => e.entryType === 'exploration').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Current Sol</span>
                  <span className="font-medium">423</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link href="/logbook/stats" className="text-sm text-mars-red hover:text-mars-red/80">
                  View detailed statistics →
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {activeTab === 'all' ? 'All Entries' : 
                    activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + ' Entries'}
                </h2>
                
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                    {getFilteredEntries().length} entries
                  </span>
                  <select className="text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700">
                    <option>Latest First</option>
                    <option>Oldest First</option>
                    <option>Alphabetical</option>
                  </select>
                </div>
              </div>
              
              {getFilteredEntries().length > 0 ? (
                <div className="space-y-6">
                  {getFilteredEntries().map((entry) => (
                    <div key={entry.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="p-5">
                        <div className="flex">
                          <div className="mr-4">
                            {getEntryTypeIcon(entry.entryType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-medium hover:text-mars-red">
                                  <Link href={`/logbook/entries/${entry.id}`}>
                                    {entry.title}
                                  </Link>
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Recorded by {entry.createdBy} • Sol {entry.sol} • {new Date(entry.createdAt).toLocaleDateString()} • {entry.location}
                                </p>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                {entry.ipfsHash && (
                                  <a
                                    href={`https://ipfs.io/ipfs/${entry.ipfsHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-gray-400 hover:text-mars-red"
                                    title="View on IPFS"
                                  >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12,1.5L3,6.6v10.8l9,5.1l9-5.1V6.6L12,1.5z M12,23.1l-9.5-5.4V7.3L12,1.9l9.5,5.4v10.4L12,23.1z M12,13.1l-3.2-1.8V7.7 L12,5.9l3.2,1.8v3.6L12,13.1z M12,5.1L8.2,7.3L12,9.5l3.8-2.2L12,5.1z M8.2,12.9L12,15.1l3.8-2.2L12,10.7L8.2,12.9z"></path>
                                    </svg>
                                  </a>
                                )}
                                {entry.txid && (
                                  <a
                                    href={`https://explore.marscoin.org/tx/${entry.txid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-gray-400 hover:text-mars-red"
                                    title="View transaction"
                                  >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                  </a>
                                )}
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                              {entry.content}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {entry.tags.map((tag) => (
                                <span 
                                  key={tag} 
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
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
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No entries found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    {activeTab === 'all' 
                      ? 'There are no entries matching your search criteria.'
                      : `There are no ${activeTab} entries to display.`
                    }
                  </p>
                  
                  <button
                    onClick={() => setShowNewEntryModal(true)}
                    className="mt-6 px-4 py-2 bg-mars-red text-white rounded-md hover:bg-mars-red/90"
                  >
                    Create New Entry
                  </button>
                </div>
              )}
              
              {getFilteredEntries().length > 0 && (
                <div className="mt-6 text-center">
                  <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                    Load More Entries
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Entry Modal */}
      {showNewEntryModal && (
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
                      Create New Logbook Entry
                    </h3>
                    
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                          placeholder="Entry title..."
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="entryType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Entry Type
                        </label>
                        <select
                          id="entryType"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                        >
                          <option value="research">Research</option>
                          <option value="engineering">Engineering & Maintenance</option>
                          <option value="exploration">Exploration</option>
                          <option value="governance">Governance</option>
                          <option value="social">Social & Cultural</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                          placeholder="Entry location..."
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Entry Content
                        </label>
                        <textarea
                          id="content"
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                          placeholder="Describe your activity or findings..."
                        ></textarea>
                      </div>
                      
                      <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          id="tags"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                          placeholder="e.g., research, geology, water"
                        />
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="ipfsStorage"
                            type="checkbox"
                            className="h-4 w-4 text-mars-red focus:ring-mars-red border-gray-300 rounded"
                            defaultChecked
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="ipfsStorage" className="font-medium text-gray-700 dark:text-gray-300">
                            Store on IPFS
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">Entry will be stored permanently on the distributed IPFS network.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="blockchainAnchor"
                            type="checkbox"
                            className="h-4 w-4 text-mars-red focus:ring-mars-red border-gray-300 rounded"
                            defaultChecked
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="blockchainAnchor" className="font-medium text-gray-700 dark:text-gray-300">
                            Anchor on Marscoin Blockchain
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">Entry hash will be stored on the Marscoin blockchain for verification.</p>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-mars-red text-base font-medium text-white hover:bg-mars-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Submit Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewEntryModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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