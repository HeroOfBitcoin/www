import React from 'react';

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  variant?: 'default' | 'alert' | 'success' | 'info'; 
}

const PixelCard: React.FC<PixelCardProps> = ({ children, className = '', title, variant = 'default' }) => {
  
  const headerStyles = {
    default: 'bg-black text-white',
    alert: 'bg-red-600 text-white',
    success: 'bg-green-600 text-white',
    info: 'bg-blue-600 text-white'
  };

  return (
    <div className={`bg-white border-4 border-black pixel-shadow p-6 relative mb-8 ${className}`}>
      {title && (
        <div className={`absolute -top-5 left-4 px-3 py-1 font-pixel text-xs border-2 border-black tracking-widest ${headerStyles[variant]}`}>
          {title.toUpperCase()}
        </div>
      )}
      {children}
    </div>
  );
};

export default PixelCard;
