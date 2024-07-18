"use client";
import React, { useRef } from 'react';
import Image from "next/image";
import Exdata from '@/app/data/Excommunity.json';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ExdataType {
	name: string;
	svg: string;
	message: number;
}

const Carousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.clientWidth / 2; // Width of one card
      carouselRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.clientWidth / 2; // Width of one card
      carouselRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const CardComponent = ({ data }: { data: ExdataType }) => {
    const { name, svg, message } = data;

    return (
      <div className="w-full h-full bg-white rounded-2xl shadow-slate-300 shadow-md">
        <div className="rounded-lg h-[60%] relative">
          <Image
            alt={name}
            layout="fill"
            objectFit="cover"
            src={svg}
            className="rounded-lg"
          />
        </div>
        <p className="font-bold text-xl h-auto w-[50%] mt-3 ml-5 flex items-center text-ellipsis">{name}</p>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>
      <div className="flex flex-col gap-3 relative">
        <div className="flex flex-row justify-between">
          <span className="text-base font-semibold">Exclusive Assessments</span>
          <div className="flex flex-row gap-4">
            <button onClick={scrollLeft}>
              <FaChevronLeft />
            </button>
            <button onClick={scrollRight}>
              <FaChevronRight />
            </button>
          </div>
        </div>
        <div className="carousel-container absolute top-7 ml-2 flex justify-start">
          <div
            className="carousel flex overflow-x-auto scrollbar-hide w-[90vw] md:w-[34vw] h-[250px]"
            ref={carouselRef}
          >
            {Exdata.map((data, index) => (
              <div key={index} className="flex-shrink-0 w-1/2 md:w-1/2 h-full p-2 snap-start">
                <CardComponent data={data} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Carousel;













// "use client"
// import React, { useRef } from 'react';
// import Image from "next/image";
// import Exdata from '@/app/data/Excommunity.json';
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const Carousel = () => {
//   const carouselRef = useRef<HTMLDivElement>(null);

//   const scrollLeft = () => {
//     if (carouselRef.current) {
//       const cardWidth = carouselRef.current.clientWidth / 2; // Width of one card
//       carouselRef.current.scrollBy({
//         left: -cardWidth,
//         behavior: 'smooth',
//       });
//     }
//   };

//   const scrollRight = () => {
//     if (carouselRef.current) {
//       const cardWidth = carouselRef.current.clientWidth / 2; // Width of one card
//       carouselRef.current.scrollBy({
//         left: cardWidth,
//         behavior: 'smooth',
//       });
//     }
//   };

//   return (
//     <>
//       <div className="flex flex-col gap-3 relative">
//         <div className="flex flex-row justify-between">
//           <span className="text-base font-semibold">Exclusive Assessments</span>
//           <div className="flex flex-row gap-4">
//             <button onClick={scrollLeft}>
//               <FaChevronLeft />
//             </button>
//             <button onClick={scrollRight}>
//               <FaChevronRight />
//             </button>
//           </div>
//         </div>
//         <div className="carousel-container absolute top-7 ml-2 flex justify-start">
//           <div className="carousel flex space-x-4 overflow-x-auto scrollbar-hide w-[90vw] md:w-[48vw] h-[250px]" ref={carouselRef}>
//             {Exdata.map((slide, index) => (
//               <div key={index}>
//                 <div className="bg-[#fff] rounded-lg h-full w-60">
//                   <div>
//                     <Image src={slide.svg} className="w-full" alt="item" height={100} width={100} />
//                   </div>
//                   <div className="text-md font-bold h-16 flex flex-row justify-around pt-3">
//                     <div className="w-3/5">{slide.name}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Carousel;





















// "use client"
// import React, { useRef } from 'react';
// import Image from "next/image";
// import Exdata from '@/app/data/Excommunity.json';
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


// const Carousel= () => {
//   const carouselRef = useRef<HTMLDivElement>(null);

//   const scrollLeft = () => {
// 		if (carouselRef.current) {
// 			const containerWidth = carouselRef.current.clientWidth;
//         	let cardWidth;
// 			if (window.innerWidth >= 1024) { // For lg and xl screens
// 				cardWidth = containerWidth / 3;
// 			} else { // For smaller screens
// 				cardWidth = containerWidth / 2;
// 			}
// 			carouselRef.current.scrollBy({
// 				left: -cardWidth,
// 				behavior: 'smooth',
// 			});
// 		}
// 	};

// 	const scrollRight = () => {
// 		if (carouselRef.current) {
// 			const containerWidth = carouselRef.current.clientWidth;
// 			let cardWidth;

// 			if (window.innerWidth >= 1024) { // For lg and xl screens
// 				cardWidth = containerWidth / 3;
// 			} else { // For smaller screens
// 				cardWidth = containerWidth / 2;
// 			}
// 			carouselRef.current.scrollBy({
// 				left: cardWidth,
// 				behavior: 'smooth',
// 			});
// 		}
// 	};

//   // const handlePrevClick = () => {
//   //   if (carouselRef.current) {
//   //     carouselRef.current.scrollBy({
//   //       left: -200, // Adjust the scroll distance as needed
//   //       behavior: 'smooth'
//   //     });
//   //   }
//   // };

//   // const handleNextClick = () => {
//   //   if (carouselRef.current) {
//   //     carouselRef.current.scrollBy({
//   //       left: 200, // Adjust the scroll distance as needed
//   //       behavior: 'smooth'
//   //     });
//   //   }
//   // };
//   return (
//     <>
//       <div className="flex flex-col gap-3 relative">
//         <div className="flex flex-row justify-between">
//           <span className="text-base font-semibold">Exclusive Assessments</span>
//           <div className="flex flex-row gap-4">
//             <button onClick={scrollLeft}>
//               <FaChevronLeft />
//             </button>
//             <button onClick={scrollRight}>
//               <FaChevronRight />
//             </button>
//           </div>
//         </div>
//         <div className="carousel-container absolute top-7 ml-2 flex justify-start">
//           <div className="carousel flex space-x-4 overflow-x-auto scrollbar-hide w-[90vw] md:w-[48vw] h-[250px]" ref={carouselRef}>
//               {Exdata.map((slide, index) => (
//                 <div key={index} >
//                   <div className="bg-[#fff] rounded-lg h-full w-60">
//                     <div ><Image src={Exdata[index].svg} className="w-full" alt="item" height={100} width={100} /></div>
//                     <div className="text-md font-bold h-16 flex flex-row justify-around pt-3">
//                       <div className="w-3/5">{Exdata[index].name}</div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>

//       </div>
//     </>
//   );
// };

// export default Carousel;
