'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

interface Resource {
  id: string;
  name: string;
  type: 'consumable' | 'equipment' | 'material' | 'biological';
  quantity: number;
  unit: string;
  capacity: number;
  location: string;
  status: 'normal' | 'warning' | 'critical' | 'surplus';
  lastUpdated: Date;
  category: string;
  responsiblePerson?: string;
  notes?: string;
  imageUrl?: string;
}

export default function InventoryPage() {
  const { data: session, status: authStatus } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [resourceFilter, setResourceFilter] = useState<string | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);

  useEffect(() => {
    // In a real implementation, resources would be fetched from an API
    const mockResources: Resource[] = [
      {
        id: '1',
        name: 'Water',
        type: 'consumable',
        quantity: 750,
        unit: 'L',
        capacity: 1000,
        location: 'Habitat Module A',
        status: 'normal',
        lastUpdated: new Date('2025-04-03'),
        category: 'life-support',
        responsiblePerson: 'Sarah Miller',
        notes: 'Daily consumption rate: ~25L. Recycling system operating at 97% efficiency.',
        imageUrl: '/assets/inventory/water-tank.jpg',
      },
      {
        id: '2',
        name: 'Oxygen',
        type: 'consumable',
        quantity: 90,
        unit: '%',
        capacity: 100,
        location: 'Life Support System',
        status: 'normal',
        lastUpdated: new Date('2025-04-04'),
        category: 'life-support',
        responsiblePerson: 'John Chen',
        notes: 'MOXIE system producing 30kg of oxygen per day. Backup electrolysis system on standby.',
        imageUrl: '/assets/inventory/oxygen-system.jpg',
      },
      {
        id: '3',
        name: 'Food',
        type: 'consumable',
        quantity: 500,
        unit: 'kg',
        capacity: 1000,
        location: 'Storage Facility',
        status: 'warning',
        lastUpdated: new Date('2025-04-02'),
        category: 'life-support',
        responsiblePerson: 'Maria Rodriguez',
        notes: 'Current hydroponic harvest anticipated in 14 days. Supply level requires careful management.',
        imageUrl: '/assets/inventory/food-storage.jpg',
      },
      {
        id: '4',
        name: 'Mars Rovers',
        type: 'equipment',
        quantity: 3,
        unit: 'units',
        capacity: 5,
        location: 'Vehicle Bay',
        status: 'normal',
        lastUpdated: new Date('2025-04-01'),
        category: 'vehicles',
        responsiblePerson: 'Alex Kim',
        notes: 'Rover 1: In use (Science Team Alpha). Rover 2: Available. Rover 3: Maintenance scheduled.',
        imageUrl: '/assets/inventory/mars-rovers.jpg',
      },
      {
        id: '5',
        name: 'EVA Suits',
        type: 'equipment',
        quantity: 10,
        unit: 'units',
        capacity: 15,
        location: 'Airlock Storage',
        status: 'normal',
        lastUpdated: new Date('2025-04-03'),
        category: 'equipment',
        responsiblePerson: 'Jamal Washington',
        notes: 'Available: 7, In use: 2, Maintenance: 1. All suits passed quarterly certification.',
        imageUrl: '/assets/inventory/eva-suits.jpg',
      },
      {
        id: '6',
        name: 'Solar Panels',
        type: 'equipment',
        quantity: 250,
        unit: 'units',
        capacity: 300,
        location: 'Main Power Array',
        status: 'normal',
        lastUpdated: new Date('2025-03-25'),
        category: 'power',
        responsiblePerson: 'Emily Chen',
        notes: 'Current efficiency: 86%. Dust accumulation within acceptable parameters. Automated cleaning system operational.',
        imageUrl: '/assets/inventory/solar-panels.jpg',
      },
      {
        id: '7',
        name: 'Regolith',
        type: 'material',
        quantity: 15000,
        unit: 'kg',
        capacity: 50000,
        location: 'Material Storage Bay',
        status: 'surplus',
        lastUpdated: new Date('2025-03-20'),
        category: 'construction',
        responsiblePerson: 'Omar Hassan',
        notes: 'Processed and ready for 3D printing construction. High iron oxide content (18.7%).',
        imageUrl: '/assets/inventory/regolith.jpg',
      },
      {
        id: '8',
        name: 'Martian Wheat',
        type: 'biological',
        quantity: 200,
        unit: 'plants',
        capacity: 500,
        location: 'Hydroponics Bay 2',
        status: 'normal',
        lastUpdated: new Date('2025-04-03'),
        category: 'agriculture',
        responsiblePerson: 'Zoe Parker',
        notes: 'Current growth cycle: 65% complete. Expected yield: 120kg. Mars-adapted strain showing 15% yield improvement.',
        imageUrl: '/assets/inventory/martian-wheat.jpg',
      },
      {
        id: '9',
        name: 'Medical Supplies',
        type: 'consumable',
        quantity: 65,
        unit: '%',
        capacity: 100,
        location: 'Medical Bay',
        status: 'warning',
        lastUpdated: new Date('2025-03-28'),
        category: 'medical',
        responsiblePerson: 'Dr. James Wilson',
        notes: 'Antibiotics running low. Next resupply mission scheduled in 30 days. 3D printed splints and casts available.',
        imageUrl: '/assets/inventory/medical-supplies.jpg',
      },
      {
        id: '10',
        name: 'Fuel Cells',
        type: 'equipment',
        quantity: 8,
        unit: 'units',
        capacity: 10,
        location: 'Power Station B',
        status: 'normal',
        lastUpdated: new Date('2025-04-02'),
        category: 'power',
        responsiblePerson: 'Hiroshi Tanaka',
        notes: 'Backup power system. All cells operational. Hydrogen storage at 78% capacity.',
        imageUrl: '/assets/inventory/fuel-cells.jpg',
      },
    ];

    // Simulate loading
    setTimeout(() => {
      setResources(mockResources);
      setIsLoading(false);
    }, 500);
  }, []);

  const getFilteredResources = () => {
    let filtered = resources;
    
    if (resourceFilter) {
      if (resourceFilter === 'critical') {
        filtered = filtered.filter(resource => resource.status === 'critical');
      } else if (resourceFilter === 'warning') {
        filtered = filtered.filter(resource => resource.status === 'warning');
      } else {
        filtered = filtered.filter(resource => resource.type === resourceFilter);
      }
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.name.toLowerCase().includes(query) ||
        resource.location.toLowerCase().includes(query) ||
        resource.category.toLowerCase().includes(query) ||
        (resource.notes && resource.notes.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'life-support':
        return 'Life Support';
      case 'equipment':
        return 'Equipment';
      case 'vehicles':
        return 'Vehicles';
      case 'power':
        return 'Power Systems';
      case 'construction':
        return 'Construction Materials';
      case 'agriculture':
        return 'Agriculture';
      case 'medical':
        return 'Medical';
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  const getResourceStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      case 'surplus':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'consumable':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'equipment':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'material':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'biological':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
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
            <h1 className="text-3xl font-bold mb-2">Martian Inventory</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track and manage resources to ensure the sustainability of Martian settlements.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={() => setShowQRScanner(true)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Scan QR
            </button>
            <button
              onClick={() => setShowAddResourceModal(true)}
              className="px-4 py-2 bg-mars-red text-white rounded-md hover:bg-mars-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Resource
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Filter Resources</h2>
              
              <div className="mb-6">
                <label htmlFor="searchResources" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="searchResources"
                  placeholder="Search resources..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resource Type</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setResourceFilter(null)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      resourceFilter === null 
                        ? 'bg-mars-red/10 text-mars-red' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    All Resources
                  </button>
                  <button 
                    onClick={() => setResourceFilter('consumable')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      resourceFilter === 'consumable' 
                        ? 'bg-mars-red/10 text-mars-red' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Consumables
                  </button>
                  <button 
                    onClick={() => setResourceFilter('equipment')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      resourceFilter === 'equipment' 
                        ? 'bg-mars-red/10 text-mars-red' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Equipment
                  </button>
                  <button 
                    onClick={() => setResourceFilter('material')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      resourceFilter === 'material' 
                        ? 'bg-mars-red/10 text-mars-red' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Materials
                  </button>
                  <button 
                    onClick={() => setResourceFilter('biological')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      resourceFilter === 'biological' 
                        ? 'bg-mars-red/10 text-mars-red' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Biological
                  </button>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2"></div>
                  <button 
                    onClick={() => setResourceFilter('critical')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      resourceFilter === 'critical' 
                        ? 'bg-red-500/10 text-red-500' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                      Critical Levels
                    </div>
                  </button>
                  <button 
                    onClick={() => setResourceFilter('warning')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      resourceFilter === 'warning' 
                        ? 'bg-yellow-500/10 text-yellow-500' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                      Warning Levels
                    </div>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Inventory Stats</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Resources</span>
                  <span className="font-medium">{resources.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Critical</span>
                  <span className="font-medium">{resources.filter(r => r.status === 'critical').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Warning</span>
                  <span className="font-medium">{resources.filter(r => r.status === 'warning').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Surplus</span>
                  <span className="font-medium">{resources.filter(r => r.status === 'surplus').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Locations</span>
                  <span className="font-medium">{new Set(resources.map(r => r.location)).size}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link href="/inventory/reports" className="text-sm text-mars-red hover:text-mars-red/80">
                  Generate inventory report →
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
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'overview'
                        ? 'border-mars-red text-mars-red'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('consumables')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'consumables'
                        ? 'border-mars-red text-mars-red'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Consumables
                  </button>
                  <button
                    onClick={() => setActiveTab('equipment')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'equipment'
                        ? 'border-mars-red text-mars-red'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Equipment
                  </button>
                  <button
                    onClick={() => setActiveTab('locations')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'locations'
                        ? 'border-mars-red text-mars-red'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Locations
                  </button>
                </nav>
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Resource Overview</h2>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                        {getFilteredResources().length} resources
                      </span>
                      <select className="text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700">
                        <option>Sort by Name</option>
                        <option>Sort by Status</option>
                        <option>Sort by Quantity</option>
                        <option>Sort by Location</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Alert Panel for Critical Resources */}
                  {resources.some(r => r.status === 'critical') && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                            Critical Resource Levels
                          </h3>
                          <div className="mt-2 text-sm text-red-700 dark:text-red-200">
                            <ul className="list-disc pl-5 space-y-1">
                              {resources.filter(r => r.status === 'critical').map(resource => (
                                <li key={resource.id}>
                                  <button 
                                    onClick={() => setSelectedResource(resource)}
                                    className="hover:underline focus:outline-none"
                                  >
                                    {resource.name}: {resource.quantity} {resource.unit} of {resource.capacity} {resource.unit} ({Math.round(resource.quantity / resource.capacity * 100)}%)
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Grid of Resource Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getFilteredResources().map((resource) => (
                      <div 
                        key={resource.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-mars-red hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setSelectedResource(resource)}
                      >
                        <div className={`h-1 ${getResourceStatusColor(resource.status)}`}></div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg">{resource.name}</h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                              {getCategoryLabel(resource.category)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">
                            {resource.location}
                          </p>
                          
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{resource.quantity} {resource.unit}</span>
                              <span>{resource.capacity} {resource.unit}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${getResourceStatusColor(resource.status)} rounded-full`}
                                style={{ width: `${(resource.quantity / resource.capacity) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              {getResourceTypeIcon(resource.type)}
                              <span className="ml-1 capitalize">{resource.type}</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Updated {new Date(resource.lastUpdated).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {getFilteredResources().length === 0 && (
                    <div className="text-center py-12">
                      <div className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No resources found</h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        No resources match your current filter criteria. Try adjusting your filters or search term.
                      </p>
                      
                      <button
                        onClick={() => {
                          setResourceFilter(null);
                          setSearchQuery('');
                        }}
                        className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Consumables Tab */}
              {activeTab === 'consumables' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Consumable Resources</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Resource
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Location
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Last Updated
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-mars-dark divide-y divide-gray-200 dark:divide-gray-700">
                        {resources.filter(r => r.type === 'consumable').map((resource) => (
                          <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={() => setSelectedResource(resource)}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`h-3 w-3 rounded-full ${getResourceStatusColor(resource.status)}`}></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{resource.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{getCategoryLabel(resource.category)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">{resource.quantity} {resource.unit}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">of {resource.capacity} {resource.unit}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {resource.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(resource.lastUpdated).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" onClick={(e) => {
                                  e.stopPropagation();
                                  // Logic to update resource
                                }}>
                                  Update
                                </button>
                                <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" onClick={(e) => {
                                  e.stopPropagation();
                                  // Logic to delete resource
                                }}>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {resources.filter(r => r.type === 'consumable').length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">No consumable resources found.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Equipment Tab */}
              {activeTab === 'equipment' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Equipment</h2>
                  
                  <div className="space-y-6">
                    {resources.filter(r => r.type === 'equipment').map((resource) => (
                      <div 
                        key={resource.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-mars-red hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setSelectedResource(resource)}
                      >
                        <div className="flex flex-col md:flex-row">
                          {resource.imageUrl && (
                            <div className="md:w-48 h-48 md:h-auto relative">
                              <Image 
                                src={resource.imageUrl}
                                alt={resource.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="p-6 flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-semibold">{resource.name}</h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                resource.status === 'normal' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                resource.status === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                resource.status === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              }`}>
                                {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                              </span>
                            </div>
                            
                            <div className="mt-2 grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Quantity</div>
                                <div className="text-lg font-medium">{resource.quantity} {resource.unit}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Location</div>
                                <div className="text-lg font-medium">{resource.location}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Responsible Person</div>
                                <div className="text-lg font-medium">{resource.responsiblePerson || 'N/A'}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
                                <div className="text-lg font-medium">{new Date(resource.lastUpdated).toLocaleDateString()}</div>
                              </div>
                            </div>
                            
                            {resource.notes && (
                              <div className="mt-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Notes</div>
                                <p className="text-sm mt-1">{resource.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {resources.filter(r => r.type === 'equipment').length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">No equipment resources found.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Locations Tab */}
              {activeTab === 'locations' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Resource Locations</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from(new Set(resources.map(r => r.location))).map((location) => {
                      const locationResources = resources.filter(r => r.location === location);
                      
                      return (
                        <div key={location} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold">{location}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{locationResources.length} resources</p>
                          </div>
                          
                          <div className="p-4">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                              {locationResources.map((resource) => (
                                <li 
                                  key={resource.id} 
                                  className="py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                  onClick={() => setSelectedResource(resource)}
                                >
                                  <div className="flex items-center">
                                    <div className={`h-2 w-2 rounded-full ${getResourceStatusColor(resource.status)} mr-3`}></div>
                                    <div>
                                      <div className="text-sm font-medium">{resource.name}</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{resource.type}</div>
                                    </div>
                                  </div>
                                  <div className="text-sm">
                                    {resource.quantity} {resource.unit}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resource Detail Modal */}
      {selectedResource && (
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
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        {selectedResource.name}
                      </h3>
                      <button
                        onClick={() => setSelectedResource(null)}
                        className="bg-white dark:bg-mars-dark rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {selectedResource.imageUrl && (
                      <div className="mt-4 relative h-48 rounded overflow-hidden">
                        <Image 
                          src={selectedResource.imageUrl}
                          alt={selectedResource.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{selectedResource.quantity} {selectedResource.unit}</span>
                          <span>{selectedResource.capacity} {selectedResource.unit}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getResourceStatusColor(selectedResource.status)} rounded-full`}
                            style={{ width: `${(selectedResource.quantity / selectedResource.capacity) * 100}%` }}
                          ></div>
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                          {Math.round((selectedResource.quantity / selectedResource.capacity) * 100)}%
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Type</div>
                          <div className="text-sm font-medium capitalize">{selectedResource.type}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Category</div>
                          <div className="text-sm font-medium">{getCategoryLabel(selectedResource.category)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Location</div>
                          <div className="text-sm font-medium">{selectedResource.location}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
                          <div className="text-sm font-medium">{new Date(selectedResource.lastUpdated).toLocaleDateString()}</div>
                        </div>
                        {selectedResource.responsiblePerson && (
                          <div className="col-span-2">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Responsible Person</div>
                            <div className="text-sm font-medium">{selectedResource.responsiblePerson}</div>
                          </div>
                        )}
                      </div>
                      
                      {selectedResource.notes && (
                        <div className="mb-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Notes</div>
                          <p className="text-sm mt-1">{selectedResource.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-mars-red text-base font-medium text-white hover:bg-mars-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Update Resource
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedResource(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddResourceModal && (
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
                      Add New Resource
                    </h3>
                    
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="resourceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Resource Name
                        </label>
                        <input
                          type="text"
                          id="resourceName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                          placeholder="Enter resource name..."
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="resourceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Type
                          </label>
                          <select
                            id="resourceType"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                          >
                            <option value="consumable">Consumable</option>
                            <option value="equipment">Equipment</option>
                            <option value="material">Material</option>
                            <option value="biological">Biological</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="resourceCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category
                          </label>
                          <select
                            id="resourceCategory"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                          >
                            <option value="life-support">Life Support</option>
                            <option value="equipment">Equipment</option>
                            <option value="vehicles">Vehicles</option>
                            <option value="power">Power Systems</option>
                            <option value="construction">Construction Materials</option>
                            <option value="agriculture">Agriculture</option>
                            <option value="medical">Medical</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="resourceQuantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            id="resourceQuantity"
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                            placeholder="0"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="resourceUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Unit
                          </label>
                          <input
                            type="text"
                            id="resourceUnit"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                            placeholder="kg, L, units, etc."
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="resourceCapacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Capacity
                          </label>
                          <input
                            type="number"
                            id="resourceCapacity"
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                            placeholder="Max capacity"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="resourceLocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          id="resourceLocation"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                          placeholder="Resource location..."
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="resourceResponsible" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Responsible Person
                        </label>
                        <input
                          type="text"
                          id="resourceResponsible"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                          placeholder="Person responsible for this resource..."
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="resourceNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Notes
                        </label>
                        <textarea
                          id="resourceNotes"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                          placeholder="Additional notes about this resource..."
                        ></textarea>
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
                  Add Resource
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddResourceModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showQRScanner && (
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
                      Scan Resource QR Code
                    </h3>
                    
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Camera access required to scan QR codes</p>
                        <button className="mt-4 px-4 py-2 bg-mars-red text-white rounded-md hover:bg-mars-red/90">
                          Enable Camera
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Position the QR code within the camera frame to automatically scan resource information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowQRScanner(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red sm:w-auto sm:text-sm"
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