'use client';

import React, { useState } from 'react';
import { SecurityTier, getSecurityTierDescription, getSecurityRecommendations } from '@/lib/wallet/secureStorage';

interface SecurityTierIndicatorProps {
  securityTier: SecurityTier;
  className?: string;
}

const SecurityTierIndicator: React.FC<SecurityTierIndicatorProps> = ({
  securityTier,
  className = '',
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Determine color and icon based on security tier
  const getTierStyles = () => {
    switch (securityTier) {
      case SecurityTier.BASIC:
        return {
          color: 'text-amber-600 dark:text-amber-500',
          bgColor: 'bg-amber-100 dark:bg-amber-900/30',
          borderColor: 'border-amber-200 dark:border-amber-900/50',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
          ),
          securityLevel: 'Basic Security',
        };
      case SecurityTier.ENHANCED:
        return {
          color: 'text-blue-600 dark:text-blue-500',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          borderColor: 'border-blue-200 dark:border-blue-900/50',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ),
          securityLevel: 'Enhanced Security',
        };
      case SecurityTier.MAXIMUM:
        return {
          color: 'text-green-600 dark:text-green-500',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          borderColor: 'border-green-200 dark:border-green-900/50',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ),
          securityLevel: 'Maximum Security',
        };
      default:
        return {
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          borderColor: 'border-gray-200 dark:border-gray-700',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          ),
          securityLevel: 'Unknown Security',
        };
    }
  };
  
  const tierStyles = getTierStyles();
  const recommendations = getSecurityRecommendations(securityTier);
  
  return (
    <div className={`${className}`}>
      <div 
        className={`flex items-center gap-2 text-sm p-2 rounded-lg ${tierStyles.color} ${tierStyles.bgColor} border ${tierStyles.borderColor} cursor-pointer`}
        onClick={() => setShowDetails(!showDetails)}
      >
        {tierStyles.icon}
        <span>{tierStyles.securityLevel}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 ml-auto transition-transform ${showDetails ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {showDetails && (
        <div className={`mt-2 p-3 text-sm rounded-lg ${tierStyles.bgColor} border ${tierStyles.borderColor}`}>
          <p className="font-medium mb-2">{getSecurityTierDescription(securityTier)}</p>
          
          {recommendations.length > 0 && (
            <>
              <p className="font-medium mt-3 mb-1">Recommendations:</p>
              <ul className="list-disc pl-5 space-y-1">
                {recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </>
          )}
          
          {securityTier === SecurityTier.BASIC && (
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Get Mobile Wallet
              </button>
              <button className="px-3 py-1.5 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-xs flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                Learn More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SecurityTierIndicator;