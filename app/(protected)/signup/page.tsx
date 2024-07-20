'use client';

import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

function SignupPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const router = useRouter();

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedCountry) {
      router.push(`/test?country=${selectedCountry}`);
    } else {
      alert('Please select a country');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex relative">
        <div className="bg-purple-500 h-[500px] w-[350px] rounded-3xl mr-4"></div>
        <div className="bg-purple-100 h-[300px] w-[660px] rounded-3xl relative flex flex-col items-start justify-center">
          <h1 className="text-black text-[20px] absolute left-[25px] top-[10px]">Where do you want to study?</h1>
          <form className="relative left-[20px] top-[18px] flex flex-col justify-between h-full w-full pt-[40px] pb-[60px]" onSubmit={handleSubmit}>
            <div className="flex-grow">
              {[
                { name: 'United States', img: '/us.png' },
                { name: 'United Kingdom', img: '/uk.png' },
                { name: 'Australia', img: '/aus.png' },
                { name: 'Canada', img: '/canada.png' },
                { name: 'Singapore', img: '/singa.png' },
                { name: 'France', img: '/france.png' },
                { name: 'Germany', img: '/ger.png' },
                { name: 'New Zealand', img: '/new.png' },
                { name: 'Ireland', img: '/ire.png' },
              ].map((country) => (
                <div
                  key={country.name}
                  className={`bg-purple-100 border border-gray-300 hover:bg-white h-[50px] w-[200px] rounded-full inline-flex items-center m-[5px] pl-[10px] cursor-pointer ${selectedCountry === country.name ? 'bg-white' : ''}`}
                  onClick={() => handleCountrySelect(country.name)}
                >
                  <img src={country.img} className="h-[30px] w-[30px] mr-2" />
                  <h1 className="text-[15px]">{country.name}</h1>
                </div>
              ))}
            </div>
            <button type="submit" className="bg-gray-300 border border-gray-300 text-gray-200 px-4 py-2 rounded-full inline-flex items-center space-x-2 self-center mb-1 hover:bg-purple-800 mt-auto">
              <span>Next</span>
              <span className="w-3 h-3"><FaArrowRight /></span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
