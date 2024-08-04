"use client"
import React from "react";
import Image from 'next/image'
import { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const Dashboard = () => {
//   const [assessment, setAssessment] = React.useState<number | null>(null);

//   const assessment1 = ["Quiz 1", "Quiz 2", "Quiz 3", "Quiz 4"];
//   const assessment2 = ["Coding 1", "Coding 2", "Coding 3", "Coding 4"];

//   return (
//     <div className="bg-purple-100 w-full">
//     <div className="container mx-auto px-4">
//       <div className="flex flex-wrap">
//         <section className="w-full">
//           <h2 className="text-2xl font-bold mb-4">Exclusive Masterclass</h2>
//           <div className="flex flex-wrap gap-4">
//             {/* Masterclass cards */}
//             <div className="bg-white shadow-lg rounded flex-1">
//               <img
//                 src="/mechanical.jpeg"
//                 alt="Mechanical Engineering"
//                 className="w-full h-19 object-cover mb-24"
//               />
//               <h3 className="text-lg font-bold mb-24 -mt-12 text-center">
//                 Competitive Programming
//               </h3>
//             </div>
//             <div className="bg-white shadow-lg rounded flex-1">
//               <img
//                 src="computerprogramming.jpeg"
//                 alt="Case Study"
//                 className="w-full h-19 object-cover mb-24"
//               />
//               <h3 className="text-lg font-bold mb-24 -mt-12 text-center">
//                 Case Study & Guesstimates
//               </h3>
//             </div>
//             <div className="bg-white shadow-lg rounded flex-1">
//               <img
//                 src="financial.jpeg"
//                 alt="Financial Analysis"
//                 className="w-full h-19 object-cover mb-24"
//               />
//               <h3 className="text-lg font-bold mb-24 -mt-12 text-center">
//                 Financial Analysis
//               </h3>
//             </div>
//             <div className="bg-white shadow-lg rounded flex-1">
//               <img
//                 src="financial.jpeg"
//                 alt="Financial Analysis"
//                 className="w-full h-19 object-cover mb-24"
//               />
//               <h3 className="text-lg font-bold mb-24 -mt-12 text-center">
//                 Resume Making
//               </h3>
//             </div>
//           </div>  
//             <h2 className="text-2xl font-bold mb-4 mt-8">Suggested Sessions</h2>
//             <div className="flex flex-wrap gap-4">
//               <div className="bg-white shadow-lg rounded p-4 flex-1 flex flex-col items-start justify-between">
//                 <div className="flex justify-between items-center w-full">
//                   <div className="flex flex-col items-start justify-between">
//                     <h3 className="text-lg font-semibold mb-2">Competitive Programming</h3>
//                     <button
//                       type="button"
//                       className="text-white bg-purple-700 border-none hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 mt-4 flex flex-row gap-5 items-center"
//                     >
//                       Book Now
//                       {assessment === 1 ? (
//                         <MoveUpLeft
//                           size={20}
//                           onClick={() => setAssessment(null)}
//                           className="cursor-pointer"
//                         />
//                       ) : (
//                         <MoveDownRight
//                           size={20}
//                           onClick={() => setAssessment(1)}
//                           className="cursor-pointer"
//                         />
//                       )}
//                     </button>
//                   </div>
//                   <img
//                     src="placeholder1.jpeg"
//                     alt="Placeholder"
//                     className="w-[175px] h-[175px] object-cover"
//                   />
//                 </div>
//               </div>
//               <div className="bg-white shadow-lg rounded p-4 flex-1 flex flex-col items-start justify-between">
//                 <div className="flex justify-between items-center w-full">
//                   <div className="flex flex-col items-start justify-between">
//                     <h3 className="text-lg font-semibold mb-2">Internship Fundae</h3>
//                     <button
//                       type="button"
//                       className="text-white bg-purple-700 border-none hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 mt-4 flex flex-row gap-5 items-center"
//                     >
//                        Book Now
//                       {assessment === 2 ? (
//                         <MoveUpLeft
//                           size={20}
//                           onClick={() => setAssessment(null)}
//                           className="cursor-pointer"
//                         />
//                       ) : (
//                         <MoveDownRight
//                           size={20}
//                           onClick={() => setAssessment(2)}
//                           className="cursor-pointer"
//                         />
//                       )}
//                     </button>
//                   </div>
//                   <img
//                     src="placeholder2.jpg"
//                     alt="Placeholder"
//                     className="w-[175px] h-[175px] object-cover"
//                   />
//                 </div>
//               </div>
//               {assessment === 1 && (
//                 <div className="bg-white shadow-lg rounded my-5 p-4 w-full flex flex-col items-start justify-between">
//                   <div className="flex flex-col gap-3 w-full">
//                     {assessment1.map((test, index) => (
//                       <div
//                         key={index}
//                         className="bg-purple-100/75 rounded-lg shadow-md flex flex-row items-center justify-between w-full"
//                       >
//                         <h3 className="text-lg font-semibold pl-5">{test}</h3>
//                         <button
//                           type="button"
//                           className="text-purple-800 hover:text-white bg-white border-purple-600 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 mr-5"
//                         >
//                           Start Now
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               {assessment === 2 && (
//                 <div className="bg-white shadow-lg rounded my-5 p-4 w-full flex flex-col items-start justify-between">
//                   <div className="flex flex-col gap-3 w-full">
//                     {assessment2.map((test, index) => (
//                       <div
//                         key={index}
//                         className="bg-purple-100/75 rounded-lg shadow-md flex flex-row items-center justify-between w-full"
//                       >
//                         <h3 className="text-lg font-semibold pl-5">{test}</h3>
//                         <button
//                           type="button"
//                           className="text-purple-800 hover:text-white bg-white border-purple-600 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 mr-5"
//                         >
//                           Start Now
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               <div className="bg-white shadow-lg rounded p-4 flex-1 flex flex-col items-start justify-between">
//                 <div className="flex justify-between items-center w-full">
//                   <div className="flex flex-col items-start justify-between">
//                     <h3 className="text-lg font-semibold mb-2">Interview Ready</h3>
//                     <button
//                       type="button"
//                       className="text-white bg-purple-700 border-none hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 mt-4 flex flex-row gap-5 items-center"
//                     >
//                       Book Now
//                       {assessment === 3 ? (
//                         <MoveUpLeft
//                           size={20}
//                           onClick={() => setAssessment(null)}
//                           className="cursor-pointer"
//                         />
//                       ) : (
//                         <MoveDownRight
//                           size={20}
//                           onClick={() => setAssessment(3)}
//                           className="cursor-pointer"
//                         />
//                       )}
//                     </button>
//                   </div>
//                   <img
//                     src="placeholder3.jpg"
//                     alt="Placeholder"
//                     className="w-[175px] h-[175px] object-cover"
//                   />
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };
interface ExclusiveAssementsType {
	text: string;
	imgURL: string;
	bgColor: string;
}

const Dashboard = (props: { exclusiveAssements: ExclusiveAssementsType[] }) => {
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const exclusiveAssements = props.exclusiveAssements;

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			const containerWidth = scrollContainerRef.current.clientWidth;
        	let cardWidth;
			if (window.innerWidth >= 1024) { // For lg and xl screens
				cardWidth = containerWidth / 3;
			} else { // For smaller screens
				cardWidth = containerWidth / 2;
			}
			scrollContainerRef.current.scrollBy({
				left: -cardWidth,
				behavior: 'smooth',
			});
		}
	};

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			const containerWidth = scrollContainerRef.current.clientWidth;
			let cardWidth;

			if (window.innerWidth >= 1024) { // For lg and xl screens
				cardWidth = containerWidth / 3;
			} else { // For smaller screens
				cardWidth = containerWidth / 2;
			}
			scrollContainerRef.current.scrollBy({
				left: cardWidth,
				behavior: 'smooth',
			});
		}
	};

	const CardComponent = ({ data }: { data: ExclusiveAssementsType }) => {
		const { text, imgURL, bgColor } = data;

		return (
			<div className="w-[100%] h-full bg-white rounded-2xl shadow-slate-300 shadow-md">
				<div
					style={{ backgroundColor: bgColor }}
					className="rounded-lg h-[60%] relative">
					<Image
						alt="exclusive assessment"
						width={100}
						height={100}
						src={imgURL}
						className="h-[70%] max-w-[70%] absolute right-5 bottom-0"
					/>
				</div>
				<p className="font-bold text-xl h-auto w-[50%] mt-3 ml-5 flex items-center">{text}</p>
			</div>
		);
	};

	return (
		<div>
			<style>
				{`
          			.no-scrollbar::-webkit-scrollbar {
            		display: none;
          			}
          		    .no-scrollbar {
            		-ms-overflow-style: none; /* IE and Edge */
            		scrollbar-width: none; /* Firefox */
          			}
                `}
			</style>
			<div className="flex justify-between">
				<div className="font-bold text-lg">Exclusive Assessments</div>
				<div className="flex gap-4">
					<button onClick={scrollLeft}>
						<FaChevronLeft />
					</button>
					<button onClick={scrollRight}>
						<FaChevronRight />
					</button>
				</div>
			</div>
			<div
				ref={scrollContainerRef}
				className="flex justify-start mt-4 w-full h-[300px] overflow-x-auto scroll-snap-x-mandatory snap-x no-scrollbar"
			>
				{exclusiveAssements.map((value, index) => (
					<div
						key={index}
						className="flex-shrink-0 w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 h-full p-2 snap-start"
					>
						<CardComponent data={value} />
					</div>
				))}
			</div>
		</div>
	);
};

export default Dashboard;

