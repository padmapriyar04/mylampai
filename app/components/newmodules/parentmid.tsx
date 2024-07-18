import React, { useState, useEffect } from 'react';
import RightSide from './right/rightside';
import Middle from './middlecomponents/middlecomponents';
import useStoreright from './right/zustandright/storeright';
import useStore from './left/zustandleft/storeleft';
import LeftSide from './left/leftside';
import Link from 'next/link';
import { IoBackspace } from "react-icons/io5";


export default function ParentMid() {
  const { isOpen } = useStore();
  const { isOpenright } = useStoreright();
  const [isSmallScreenRight, setIsSmallScreenRight] = useState(false);
  const [isSmallScreenLeft, setIsSmallScreenLeft] = useState(false);

  
  // Function to check screen size for right side
  const checkScreenSizeRight = () => {
    setIsSmallScreenRight(window.innerWidth < 1279); // Adjust the breakpoint (1279 is for xl)
  };

  // Function to check screen size for left side
  const checkScreenSizeLeft = () => {
    setIsSmallScreenLeft(window.innerWidth < 1020); // Adjust the breakpoint (1020 is for custom breakpoint)
  };

  // Add event listeners to check screen size on resize
  useEffect(() => {
    checkScreenSizeRight();
    checkScreenSizeLeft();
    window.addEventListener('resize', checkScreenSizeRight);
    window.addEventListener('resize', checkScreenSizeLeft);
    return () => {
      window.removeEventListener('resize', checkScreenSizeRight);
      window.removeEventListener('resize', checkScreenSizeLeft);
    };
  }, []);

  return (
    <div  className="flex h-[91vh] relative">
       <Link href={"/learn"}>
        <IoBackspace
          size={20}
          className="absolute top-3 left-4 z-10 w-fit h-fit invert rounded-full cursor-pointer transition-transform duration-300 hover:scale-110"
        />
      </Link>
      {isSmallScreenLeft ? (
        <div className={`bg-blue-500 h-full left-0 absolute z-10 lg:hidden transition-width duration-800 ${isOpen ? 'w-fit' : 'w-0'}`}>
          {isOpen && <LeftSide />}
        </div>
      ) : (
        isOpen && <LeftSide />
      )}
      <Middle />
      {isSmallScreenRight ? (
        <div className={`bg-red-500 h-full hidden md:block right-0 absolute xl:hidden transition-width duration-800 ${isOpenright ? 'w-fit' : 'w-0'}`}>
          {isOpenright && <RightSide />}
        </div>
      ) : (
        isOpenright && <RightSide />
      )}
    </div>
  );
}
