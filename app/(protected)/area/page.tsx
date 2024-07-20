// pages/index.tsx
"use client";

import React from 'react';
import Head from 'next/head';

const studyAreas = [
  { id: 1, name: 'Business and Management', icon: '🏢' },
  { id: 2, name: 'Computer Science and IT', icon: '💻' },
  { id: 3, name: 'Engineering', icon: '⚙' },
  { id: 4, name: 'Social Science', icon: '🌐' },
  { id: 5, name: 'Architecture', icon: '🏛' },
  { id: 6, name: 'Professional Studies', icon: '📚' },
  { id: 7, name: 'Hospitality and Tourism', icon: '🏨' },
  { id: 8, name: 'Science', icon: '🔬' },
  { id: 9, name: 'Sports', icon: '⚽' },
  { id: 10, name: 'Fine Arts', icon: '🎨' },
  { id: 11, name: 'Law', icon: '⚖' },
  { id: 12, name: 'Education', icon: '🎓' },
  { id: 13, name: 'Mathematics', icon: '🔢' },
  { id: 14, name: 'Medicine', icon: '🩺' },
  { id: 15, name: 'Journalism and Media', icon: '📰' },
  { id: 16, name: 'Agriculture and Forestry', icon: '🌱' },
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Head>
        <title>AdmitKard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-4 sm:mb-8">
          <span className="text-gray-600">Admit</span>Kard
        </h1>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          <div className="flex-1 bg-purple-500 text-white p-6 sm:p-8 rounded-3xl">
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-3xl sm:text-4xl font-bold">150</p>
                <p className="text-sm sm:text-base">universities</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-bold">13220</p>
                <p className="text-sm sm:text-base">courses</p>
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-semibold mb-2">
              Let&apos;s help you find your dream
            </p>
            <div className="mt-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 sm:h-12 sm:w-12"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </div>
          </div>

          <div className="flex-1 bg-purple-100 p-6 sm:p-8 rounded-3xl text-black">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              What is your preferred area of study?
            </h2>
            <div className="grid grid-cols-custom gap-3 sm:gap-4 mx-auto">
              {studyAreas.map((area) => (
                <button
                  key={area.id}
                  className={`flex items-center justify-left p-2 border rounded-full bg-white hover:bg-gray-100 transition-colors py-2 sm:py-3 text-sm sm:text-base w-full area-${area.id}`}
                >
                  <span className="mr-2">{area.icon}</span>
                  <span className="whitespace-nowrap">{area.name}</span>
                </button>
              ))}
            </div>
            <button className="mt-4 sm:mt-6 bg-white text-gray-700 px-4 rounded-full hover:bg-gray-100 transition-colors flex mx-auto py-2 sm:py-3 text-sm sm:text-base">
              Next &gt;
            </button>
          </div>
        </div>
      </main>
      <style jsx>{`
        .grid-cols-custom {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(6, auto);
          grid-template-areas:
            "area-1 area-2 . . ."
            "area-3 area-4 area-5 . ."
            "area-6 area-7 . . ."
            "area-8 area-9 area-10 area-11 ."
            "area-12 area-13 area-14 . ."
            "area-15 area-16 . . .";
          justify-content: center;
          gap: 3px;
        }
        .grid-cols-custom > .area-1 {
          grid-area: area-1;
        }
        .grid-cols-custom > .area-2 {
          grid-area: area-2;
        }
        .grid-cols-custom > .area-3 {
          grid-area: area-3;
        }
        .grid-cols-custom > .area-4 {
          grid-area: area-4;
        }
        .grid-cols-custom > .area-5 {
          grid-area: area-5;
        }
        .grid-cols-custom > .area-6 {
          grid-area: area-6;
        }
        .grid-cols-custom > .area-7 {
          grid-area: area-7;
        }
        .grid-cols-custom > .area-8 {
          grid-area: area-8;
        }
        .grid-cols-custom > .area-9 {
          grid-area: area-9;
        }
        .grid-cols-custom > .area-10 {
          grid-area: area-10;
        }
        .grid-cols-custom > .area-11 {
          grid-area: area-11;
        }
        .grid-cols-custom > .area-12 {
          grid-area: area-12;
        }
        .grid-cols-custom > .area-13 {
          grid-area: area-13;
        }
        .grid-cols-custom > .area-14 {
          grid-area: area-14;
        }
        .grid-cols-custom > .area-15 {
          grid-area: area-15;
        }
        .grid-cols-custom > .area-16 {
          grid-area: area-16;
        }

        @media (max-width: 768px) {
          .grid-cols-custom {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(8, auto);
            grid-template-areas:
              "area-1 area-2"
              "area-3 area-4"
              "area-5 area-6"
              "area-7 area-8"
              "area-9 area-10"
              "area-11 area-12"
              "area-13 area-14"
              "area-15 area-16";
          }
        }

        @media (max-width: 576px) {
          .grid-cols-custom {
            grid-template-columns: repeat(1, 1fr);
            grid-template-rows: repeat(16, auto);
            grid-template-areas:
              "area-1"
              "area-2"
              "area-3"
              "area-4"
              "area-5"
              "area-6"
              "area-7"
              "area-8"
              "area-9"
              "area-10"
              "area-11"
              "area-12"
              "area-13"
              "area-14"
              "area-15"
              "area-16";
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
