import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-neutral-800 rounded-md shadow-md p-4 flex flex-col items-center animate-pulse">
      <div className="w-24 h-24 bg-neutral-700 rounded-full mb-2"></div>
      <div className="w-24 h-4 bg-neutral-700 rounded mb-2"></div>
      <div className="w-24 h-4 bg-neutral-700 rounded mb-2"></div>
      <div className="flex gap-2 w-full justify-center mt-2">
        <div className="w-4 h-4 bg-neutral-700 rounded"></div>
        <div className="w-4 h-4 bg-neutral-700 rounded"></div>
        <div className="w-4 h-4 bg-neutral-700 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
