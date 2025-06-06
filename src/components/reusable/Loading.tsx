// LoadingComponent.tsx
import React from 'react';

const LoadingComponent: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 flex flex-col items-center min-w-full justify-center min-h-full bg-transparent text-white">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg">Loading...</p>
    </div>
  );
};

export default LoadingComponent;


export const LoadingSmall: React.FC = () => {
  return (
    <div className="flex flex-col items-center min-w-full justify-center min-h-full bg-transparent text-white">
      <div className="w-7 h-7 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};




