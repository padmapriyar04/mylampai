// Analysis.tsx
import React from 'react';

const Analysis: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-primary-foreground max-h-[100vh]">
      <div className='absolute top-0 left-0 bg-primary w-[50vw] h-[40vw]'>

      </div>
      <div className='absolute bottom-0 right-0 bg-primary w-[30vw] h-[30vw] rounded-tl-full'>

      </div>
      <div className="p-4 bg-white rounded-lg shadow-md w-[85vw] h-[85vh] z-10 flex flex-col gap-4">
        <h2 className="text-3xl font-bold">Analysis</h2>
        <div className='h-[23%] bg-purple-50 w-full rounded-lg p-2 flex flex-row gap-2 border-2 border-primary-foreground shadow-lg'>
          <div className='h-full w-[120px] bg-white text-black flex justify-center items-center'>
            img
          </div>
          <div className='text-xl flex flex-col gap-2 top-4 relative'>
          <div>
            Name and Info
          </div>
          <div>
            Job Profile/Domain
          </div>
          </div>
        </div>
        <div className='w-full h-[40%] flex gap-4'>
          <div className='w-[70%]'>
            <div className='text-black text-2xl font-semibold pt-2 w-full h-[33%]'>
              Your Score:
            </div>  
            <div className='text-black text-2xl font-semibold pt-2 w-full h-[66%]'>
              Summary:
            </div>
          </div> 
          
          <div className='w-[30%] bg-primary h-[47%] rounded-lg border-2 border-primary-foreground text-white font-semibold text-xl p-4 shadow-lg'>
            You are better than 60% other user from this domain who gave the AI interview!
          </div>
          
        </div>
      </div>

    </div>
  );
};

export default Analysis;
