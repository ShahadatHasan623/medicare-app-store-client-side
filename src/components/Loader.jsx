import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="relative flex items-center justify-center">
    
        <div className="absolute animate-ping h-20 w-20 rounded-full bg-emerald-400 opacity-20"></div>
        <div className="absolute animate-pulse h-24 w-24 rounded-full border-4 border-emerald-500 border-t-transparent border-b-transparent"></div>
    
        <div className="relative bg-white p-4 rounded-xl shadow-lg border-2 border-emerald-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-emerald-600 animate-bounce" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={3} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
        </div>
      </div>
      
      {/* লোডিং টেক্সট */}
      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold text-slate-700 tracking-wider">
          MEDI<span className="text-emerald-500 font-extrabold text-2xl">CARE</span>
        </h2>
        <p className="text-sm font-medium text-gray-500 mt-2 animate-pulse uppercase tracking-[0.2em]">
          Loading Inventory...
        </p>
      </div>
    </div>
  );
};

export default Loader;