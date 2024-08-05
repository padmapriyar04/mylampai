import React, { useState, useEffect } from 'react';

const carouselItems = [
  { id: 1, title: 'Resource 1', description: 'Description for Resource 1', image: '/blog/instructor.svg' },
  { id: 2, title: 'Resource 2', description: 'Description for Resource 2', image: '/blog/instructor.svg' },
  { id: 3, title: 'Resource 3', description: 'Description for Resource 3', image: '/blog/instructor.svg' },
  { id: 4, title: 'Resource 4', description: 'Description for Resource 4', image: '/blog/instructor.svg '},
  { id: 5, title: 'Resource 5', description: 'Description for Resource 5', image: '/blog/instructor.svg' },
  { id: 5, title: 'Resource 5', description: 'Description for Resource 5', image: '/blog/instructor.svg' },
  // Add more items if needed
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 4;
  const numberOfItems = carouselItems.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex >= numberOfItems - itemsToShow ? 0 : prevIndex + 1));
    }, 3000); // Change slide every 3 seconds
    return () => clearInterval(interval);
  }, [numberOfItems, itemsToShow]);

  return (
    <div className='relative w-full px-20 text-2xl'>
        <div className=' w-full p-4  text-3xl font-semibold text-[#8C52FF]'>Suggested Resources  </div>
      <div className='relative w-full overflow-hidden flex justify-center'>
        <div className='flex transition-transform duration-500' style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}>
          {carouselItems.map((item) => (
            <div key={item.id} className='flex-none w-[calc(100% / 4)] shadow-xl p-4'>
              <div className='bg-white shadow-xl rounded-sm overflow-hidden flex flex-col items-center'>
                <img src={item.image} alt={item.title} className='w-full rounded-lg max-w-[300px] h-48 object-cover mb-3' />
                <div className='p-4 text-center'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>{item.title}</h3>
                  <p className='text-gray-600'>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
