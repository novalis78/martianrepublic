'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Location {
  id: string;
  name: string;
  type: 'settlement' | 'landmark' | 'research' | 'industrial' | 'historical';
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  population?: number;
  established?: string;
  imageUrl?: string;
}

export default function PlanetPageComponent() {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapMode, setMapMode] = useState<'topographic' | 'satellite' | 'elevation'>('topographic');
  const [locations, setLocations] = useState<Location[]>([]);
  const [activeLocationCategory, setActiveLocationCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real implementation, locations would be fetched from an API
    const mockLocations: Location[] = [
      {
        id: '1',
        name: 'Olympus City',
        type: 'settlement',
        coordinates: { lat: 18.65, lng: -133.8 },
        description: 'The capital city of the Martian Republic, located at the base of Olympus Mons. Home to the Congress building and the primary administrative center.',
        population: 1840,
        established: '2031',
        imageUrl: '/assets/planet/olympus-city.jpg',
      },
      {
        id: '2',
        name: 'Valles Marineris Outpost',
        type: 'settlement',
        coordinates: { lat: -14, lng: -59 },
        description: 'Research and exploration outpost in the heart of the Valles Marineris canyon system. Specializes in geological research.',
        population: 320,
        established: '2035',
        imageUrl: '/assets/planet/valles-outpost.jpg',
      },
      {
        id: '3',
        name: 'Gale Research Station',
        type: 'research',
        coordinates: { lat: -5.4, lng: 137.8 },
        description: 'Scientific research facility built near the original Curiosity rover landing site. Focuses on paleoclimate studies and ancient habitability.',
        population: 85,
        established: '2033',
        imageUrl: '/assets/planet/gale-station.jpg',
      },
      {
        id: '4',
        name: 'Jezero Colony',
        type: 'settlement',
        coordinates: { lat: 18.4, lng: 77.7 },
        description: 'Agricultural settlement focused on developing Martian farming techniques. Located near the ancient river delta in Jezero Crater.',
        population: 560,
        established: '2036',
        imageUrl: '/assets/planet/jezero-colony.jpg',
      },
      {
        id: '5',
        name: 'Olympus Mons Peak',
        type: 'landmark',
        coordinates: { lat: 18.65, lng: -133.8 },
        description: 'The tallest mountain in the solar system at 21.9 km high. Features a research station and observation post at 15km elevation.',
        imageUrl: '/assets/planet/olympus-mons.jpg',
      },
      {
        id: '6',
        name: 'Utopia Planitia Shipyards',
        type: 'industrial',
        coordinates: { lat: 49.5, lng: 118 },
        description: 'Major manufacturing and construction facility. Produces habitation modules, vehicles, and spacecraft components using in-situ resources.',
        population: 780,
        established: '2038',
        imageUrl: '/assets/planet/utopia-shipyards.jpg',
      },
      {
        id: '7',
        name: 'Hellas Basin Laboratory',
        type: 'research',
        coordinates: { lat: -42.4, lng: 70.5 },
        description: 'Deep atmosphere research facility in the lowest elevation on Mars. Studies atmospheric density and composition at higher pressures.',
        population: 65,
        established: '2037',
        imageUrl: '/assets/planet/hellas-lab.jpg',
      },
      {
        id: '8',
        name: 'Spirit Memorial',
        type: 'historical',
        coordinates: { lat: -14.57, lng: 175.47 },
        description: 'Monument commemorating the Spirit rover landing site. Historical site with visitor center documenting early Mars exploration.',
        imageUrl: '/assets/planet/spirit-memorial.jpg',
      },
    ];

    // Simulate loading
    setTimeout(() => {
      setLocations(mockLocations);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredLocations = activeLocationCategory 
    ? locations.filter(location => location.type === activeLocationCategory)
    : locations;

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const renderMap = () => {
    return (
      <div className="relative h-[600px] rounded-lg overflow-hidden">
        {/* The map background image changes based on selected mode */}
        <div className="absolute inset-0">
          <Image 
            src={`/assets/planet/mars-${mapMode}.jpg`} 
            alt={`Mars ${mapMode} map`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
        
        {/* Location markers */}
        {filteredLocations.map((location) => (
          <button 
            key={location.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group ${
              selectedLocation?.id === location.id ? 'scale-125' : ''
            }`} 
            style={{ 
              left: `${(location.coordinates.lng + 180) / 360 * 100}%`, 
              top: `${(90 - location.coordinates.lat) / 180 * 100}%` 
            }}
            onClick={() => handleLocationClick(location)}
          >
            <div className={`relative h-4 w-4 rounded-full ${
              location.type === 'settlement' ? 'bg-blue-500' : 
              location.type === 'landmark' ? 'bg-green-500' : 
              location.type === 'research' ? 'bg-purple-500' : 
              location.type === 'industrial' ? 'bg-yellow-500' : 
              'bg-red-500'
            } pulse-animation group-hover:scale-125 transition-transform`}>
              <span className="sr-only">{location.name}</span>
            </div>
            
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black bg-opacity-75 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                {location.name}
              </div>
            </div>
          </button>
        ))}
        
        {/* Map controls */}
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-md shadow-md p-2 z-20">
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => setMapMode('topographic')}
              className={`px-2 py-1 text-xs rounded ${
                mapMode === 'topographic' 
                  ? 'bg-mars-red text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              Topographic
            </button>
            <button 
              onClick={() => setMapMode('satellite')}
              className={`px-2 py-1 text-xs rounded ${
                mapMode === 'satellite' 
                  ? 'bg-mars-red text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              Satellite
            </button>
            <button 
              onClick={() => setMapMode('elevation')}
              className={`px-2 py-1 text-xs rounded ${
                mapMode === 'elevation' 
                  ? 'bg-mars-red text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              Elevation
            </button>
          </div>
        </div>
        
        {/* Location filter */}
        <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-md shadow-md p-2 z-20">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveLocationCategory(null)}
              className={`px-2 py-1 text-xs rounded ${
                activeLocationCategory === null
                  ? 'bg-mars-red text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveLocationCategory('settlement')}
              className={`px-2 py-1 text-xs rounded ${
                activeLocationCategory === 'settlement'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              Settlements
            </button>
            <button
              onClick={() => setActiveLocationCategory('landmark')}
              className={`px-2 py-1 text-xs rounded ${
                activeLocationCategory === 'landmark'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              Landmarks
            </button>
            <button
              onClick={() => setActiveLocationCategory('research')}
              className={`px-2 py-1 text-xs rounded ${
                activeLocationCategory === 'research'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              Research
            </button>
            <button
              onClick={() => setActiveLocationCategory('industrial')}
              className={`px-2 py-1 text-xs rounded ${
                activeLocationCategory === 'industrial'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              Industrial
            </button>
            <button
              onClick={() => setActiveLocationCategory('historical')}
              className={`px-2 py-1 text-xs rounded ${
                activeLocationCategory === 'historical'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              Historical
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
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
            <h1 className="text-3xl font-bold mb-2">Martian Geography</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Explore Mars with our interactive map and information about key locations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Explore Mars</h2>
              
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('map')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    activeTab === 'map' 
                      ? 'bg-mars-red/10 text-mars-red' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Interactive Map
                </button>
                <button 
                  onClick={() => setActiveTab('locations')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    activeTab === 'locations' 
                      ? 'bg-mars-red/10 text-mars-red' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Notable Locations
                </button>
                <button 
                  onClick={() => setActiveTab('facts')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    activeTab === 'facts' 
                      ? 'bg-mars-red/10 text-mars-red' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Mars Facts
                </button>
                <button 
                  onClick={() => setActiveTab('resources')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    activeTab === 'resources' 
                      ? 'bg-mars-red/10 text-mars-red' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Resources
                </button>
              </div>
            </div>
            
            {selectedLocation && (
              <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold mb-2">{selectedLocation.name}</h2>
                  <button 
                    onClick={() => setSelectedLocation(null)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {selectedLocation.imageUrl && (
                  <div className="mb-4 mt-2 relative h-48 rounded-md overflow-hidden">
                    <Image 
                      src={selectedLocation.imageUrl}
                      alt={selectedLocation.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Type: </span>
                    <span className="font-medium capitalize">{selectedLocation.type}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Coordinates: </span>
                    <span className="font-medium">{selectedLocation.coordinates.lat}°N, {Math.abs(selectedLocation.coordinates.lng)}°{selectedLocation.coordinates.lng < 0 ? 'W' : 'E'}</span>
                  </div>
                  
                  {selectedLocation.population && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Population: </span>
                      <span className="font-medium">{selectedLocation.population.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {selectedLocation.established && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Established: </span>
                      <span className="font-medium">{selectedLocation.established}</span>
                    </div>
                  )}
                </div>
                
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  {selectedLocation.description}
                </p>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link href={`/planet/locations/${selectedLocation.id}`} className="text-sm text-mars-red hover:text-mars-red/80">
                    View detailed information →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md overflow-hidden">
              {activeTab === 'map' && (
                <div>
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold">Interactive Mars Map</h2>
                  </div>
                  {renderMap()}
                </div>
              )}

              {activeTab === 'locations' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Notable Locations</h2>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                        {filteredLocations.length} locations
                      </span>
                      <select className="text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700">
                        <option>All Types</option>
                        <option>Settlements</option>
                        <option>Landmarks</option>
                        <option>Research</option>
                        <option>Industrial</option>
                        <option>Historical</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {locations.map((location) => (
                      <div 
                        key={location.id} 
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-mars-red hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handleLocationClick(location)}
                      >
                        <div className="relative h-48">
                          {location.imageUrl ? (
                            <Image 
                              src={location.imageUrl}
                              alt={location.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                              <span className="text-gray-400">No image available</span>
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              location.type === 'settlement' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              location.type === 'landmark' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              location.type === 'research' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                              location.type === 'industrial' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-1">{location.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {location.coordinates.lat}°N, {Math.abs(location.coordinates.lng)}°{location.coordinates.lng < 0 ? 'W' : 'E'}
                            {location.population && ` • Pop: ${location.population.toLocaleString()}`}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {location.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'facts' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Mars Facts</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Physical Characteristics</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Diameter:</span>
                          <span className="font-medium">6,779 km (0.53 × Earth)</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Mass:</span>
                          <span className="font-medium">6.39 × 10²³ kg (0.107 × Earth)</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Surface gravity:</span>
                          <span className="font-medium">3.72 m/s² (0.38 × Earth)</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Distance from Sun:</span>
                          <span className="font-medium">228 million km</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Day length:</span>
                          <span className="font-medium">24h 39m 35s</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Year length:</span>
                          <span className="font-medium">687 Earth days</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Atmosphere</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Composition:</span>
                          <span className="font-medium">95% CO₂</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Surface pressure:</span>
                          <span className="font-medium">0.636 kPa (< 1% Earth)</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Temperature range:</span>
                          <span className="font-medium">-140°C to 30°C</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Average temp:</span>
                          <span className="font-medium">-63°C</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Wind speeds:</span>
                          <span className="font-medium">Up to 97 km/h</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Dust storms:</span>
                          <span className="font-medium">Global coverage possible</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Geography</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Surface area:</span>
                          <span className="font-medium">144.8 million km²</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Land area:</span>
                          <span className="font-medium">144.8 million km²</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Highest point:</span>
                          <span className="font-medium">Olympus Mons (21.9 km)</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Lowest point:</span>
                          <span className="font-medium">Hellas Basin (-8.2 km)</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Polar ice caps:</span>
                          <span className="font-medium">H₂O and CO₂ ice</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Moons:</span>
                          <span className="font-medium">Phobos and Deimos</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Martian Calendar</h3>
                    <p className="mb-4">The Martian calendar is based on Mars' orbit around the Sun, with each year (or "sol") lasting 668.6 Martian solar days (sols). The Martian Republic uses a calendar with 24 months of 28 sols each, plus a special 5-day period at the end of the year.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Current Martian Date</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-mars-red">Sol 423</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Month 15, Day 3, Year 6 MR</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">April 4, 2025 (Earth Date)</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Seasons (Northern Hemisphere)</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Spring:</span>
                              <span className="font-medium">Sols 0-194</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Summer:</span>
                              <span className="font-medium">Sols 195-371</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Fall:</span>
                              <span className="font-medium">Sols 372-513</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Winter:</span>
                              <span className="font-medium">Sols 514-668</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Martian Resources</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold mb-4">Natural Resources</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Mars contains various resources that are critical for sustaining the Martian Republic and its expansion.
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-1">Iron Oxide (Fe₂O₃)</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Abundant in Martian soil (15-18% by mass). Used for construction materials, steel production, and oxygen extraction.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Water Ice (H₂O)</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Present in polar caps and subsurface deposits. Critical for human consumption, agriculture, and fuel production.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Carbon Dioxide (CO₂)</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Main component of Martian atmosphere. Used for greenhouse operations, fuel production, and life support systems.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Regolith</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Surface soil containing silicates, iron compounds, and trace elements. Used for construction, radiation shielding, and agriculture.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold mb-4">Resource Extraction</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        The Martian Republic has developed various technologies for in-situ resource utilization (ISRU).
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-1">Water Extraction</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Subsurface drilling and heating operations extract water ice, which is then purified for use in settlements.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Oxygen Production</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            MOXIE (Mars Oxygen In-Situ Resource Utilization Experiment) technology extracts oxygen from CO₂ through electrolysis.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Methane Synthesis</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Sabatier reactors combine H₂ and CO₂ to produce methane (CH₄) for fuel and heating purposes.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Metal Refining</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Electromagnetic separation and reduction processes extract iron, aluminum, and other metals from regolith.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-4">Resource Maps</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative rounded-lg overflow-hidden h-64">
                      <Image 
                        src="/assets/planet/water-map.jpg"
                        alt="Mars Water Resources Map"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h4 className="font-medium mb-1">Water Resources Map</h4>
                        <p className="text-sm">Showing known water ice deposits across Mars</p>
                      </div>
                    </div>
                    
                    <div className="relative rounded-lg overflow-hidden h-64">
                      <Image 
                        src="/assets/planet/mineral-map.jpg"
                        alt="Mars Mineral Resources Map"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h4 className="font-medium mb-1">Mineral Resources Map</h4>
                        <p className="text-sm">Showing mineral concentrations and mining operations</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pulse-animation {
          animation: pulse 2s infinite;
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
      `}</style>
    </div>
  );
}