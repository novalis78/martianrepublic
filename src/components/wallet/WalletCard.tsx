'use client';

import React from 'react';

interface WalletCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onClick?: () => void;
  className?: string;
}

const WalletCard: React.FC<WalletCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  onClick,
  className = '',
}) => {
  return (
    <div 
      className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 shadow-md border border-gray-700 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <div className="bg-mars-red/20 rounded-full p-2 text-mars-red">
          {icon}
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-white">{value}</span>
        {trend && (
          <div className={`flex items-center mt-2 text-xs ${
            trend === 'up' ? 'text-green-400' : 
            trend === 'down' ? 'text-red-400' : 'text-gray-400'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            <span className="ml-1">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletCard;