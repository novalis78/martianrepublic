import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  bordered?: boolean;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

const Card = ({
  children,
  className = '',
  hoverable = false,
  bordered = true,
  title,
  subtitle,
  headerContent,
  footerContent,
}: CardProps) => {
  const cardClasses = `
    bg-white dark:bg-gray-800
    rounded-lg shadow
    ${hoverable ? 'transition-shadow hover:shadow-lg' : ''}
    ${bordered ? 'border border-gray-200 dark:border-gray-700' : ''}
    ${className}
  `;

  return (
    <div className={cardClasses}>
      {/* Card Header */}
      {(title || subtitle || headerContent) && (
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 md:p-6 flex justify-between items-start">
          {/* Title Area */}
          {(title || subtitle) && (
            <div>
              {title && (
                typeof title === 'string' 
                  ? <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                  : title
              )}
              {subtitle && (
                typeof subtitle === 'string'
                  ? <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
                  : subtitle
              )}
            </div>
          )}
          
          {/* Extra Header Content (like buttons, etc) */}
          {headerContent && (
            <div>{headerContent}</div>
          )}
        </div>
      )}
      
      {/* Card Body */}
      <div className="p-4 md:p-6">
        {children}
      </div>
      
      {/* Card Footer */}
      {footerContent && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 md:p-6">
          {footerContent}
        </div>
      )}
    </div>
  );
}

export default Card;