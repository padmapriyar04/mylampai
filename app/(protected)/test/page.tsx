'use client';

import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

function TestPage() {
  const [selectedDegree, setSelectedDegree] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const country = searchParams.get('country');

  const handleDegreeSelect = (degree: string) => {
    setSelectedDegree(degree);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedDegree) {
      router.push(`/english?country=${country}&degree=${selectedDegree}`);
    } else {
      alert('Please select a degree');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex relative">
        <div className="bg-purple-500 h-[500px] w-[350px] rounded-3xl mr-4"></div>
        <div className="bg-purple-100 h-[220px] w-[550px] rounded-3xl relative flex flex-col items-start justify-center">
          <h1 className="text-black text-[20px] absolute left-[25px] top-[15px]">
            What degree do you want to pursue?
          </h1>
          <form className="relative left-[65px] top-[65px] flex-grow" onSubmit={handleSubmit}>
            <div>
              {[
                { name: 'Bachelors', img: '/yel.png' },
                { name: 'Masters', img: '/green.png' },
              ].map((degree) => (
                <div
                  key={degree.name}
                  className={`bg-purple-100 border border-gray-300 hover:bg-white h-[50px] w-[200px] rounded-full inline-flex items-center m-[5px] pl-[10px] cursor-pointer ${selectedDegree === degree.name ? 'bg-white' : ''}`}
                  onClick={() => handleDegreeSelect(degree.name)}
                >
                  <img src={degree.img} className="h-[30px] w-[30px] mr-2" />
                  <h1 className="text-[15px]">{degree.name}</h1>
                </div>
              ))}
            </div>
            <button type="submit" className="bg-gray-300 border border-gray-300 text-gray-200 px-4 py-2 rounded-full inline-flex items-center space-x-2 absolute bottom-20 left-1/2 transform -translate-x-1/2 hover:bg-purple-800">
              <span>Next</span>
              <span className="w-3 h-3"><FaArrowRight /></span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TestPage;
