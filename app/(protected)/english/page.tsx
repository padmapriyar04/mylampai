'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa';

function EnglishPage() {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const country = searchParams.get('country');
  const degree = searchParams.get('degree');

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOption) return;

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country, degree, option: selectedOption }),
      });

      if (response.ok) {
        router.push('/next-page'); // Navigate to the next page
      } else {
        console.error('Failed to submit');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex relative">
        <div className="bg-purple-500 h-[500px] w-[350px] rounded-3xl mr-4"></div>
        <div className="bg-purple-100 h-[300px] w-[650px] rounded-3xl relative flex flex-col items-start justify-center">
          <h1 className="text-black text-[20px] absolute left-[25px] top-[15px]">
            What English proficiency test do you have?
          </h1>
          <form className="relative left-[65px] top-[70px] flex-grow" onSubmit={handleSubmit}>
            <div>
              {['TOEFL', 'IELTS', 'PTE', 'None'].map((option) => (
                <div
                  key={option}
                  className={`bg-purple-100 border border-gray-300 hover:bg-white h-[50px] w-[120px] rounded-full inline-flex items-center m-[5px] pl-[10px] cursor-pointer ${selectedOption === option ? 'bg-white' : ''}`}
                  onClick={() => handleOptionChange(option)}
                >
                  <img src="/green.png" className="h-[40px] w-[40px] mr-2" />
                  <h1 className="text-[15px]">{option}</h1>
                </div>
              ))}
            </div>
            <div className="relative left-[60px] top-[20px] w-full flex items-center mt-4">
              <div className="bg-white text-[13px] p-4 rounded-2xl flex items-center w-full h-[60px] max-w-[430px]">
                <p>There are currently no courses available for this selection but courses would be shown with an assumed score of 6.5 in IELTS</p>
              </div>
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

export default EnglishPage;

