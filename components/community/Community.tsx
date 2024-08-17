// "use client"
// import Image from "next/image";
// import React, { useState } from 'react';
// import { FaStar } from "react-icons/fa";
// import Exdata from '@/app/data/Excommunity.json';
// import Alldata from '@/app/data/Allcommunity.json'


// interface Community {
//     id: string;
//     createdAt: string;
//     lastmessageAt: string;
//     name: string;
//     description: string;
//     isCommunity: boolean;
//     messagesIds: any;
//     userIds: string[];
//     type: "Exclusive" | "Normal"; // Added type property
//   }

// export default function Community() {
//   const ExdataLen = Exdata.length;
//   const AlldataLen = Alldata.length;
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [exclusiveCommunities, setExclusiveCommunities] = useState<Community[]>([]);
//   const [normalCommunities, setNormalCommunities] = useState<Community[]>([]);
//   const handleNext = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % ExdataLen);
//   };
//   const handlePrev = () => {
//     setCurrentIndex((prevIndex) => (prevIndex - 1 + ExdataLen) % ExdataLen);
//   };
//   const [messageHeading,setMessageHeading] = useState('');
//   const toggleHeading  = (text:string) =>{
//     setMessageHeading(text);
//   }

//   const fetchCommunities = async () => {
//     try {
//       const response = await fetch("/api/community/getAll");
//       const data = await response.json();
//       const exclusive = data.communities.filter((community: Community) => community.type === "Exclusive");
      
//       const normal = data.communities.filter((community: Community) => community.type === "Normal");
//       setExclusiveCommunities(exclusive);
//       console.log(setExclusiveCommunities);
//       setNormalCommunities(normal);
//     } catch (error) {
//       console.error("Error fetching communities:", error);
//     }
//   };

//   return (
//     <div className="w-full flex justify-center">
//         <div className="bg-[#F1EAFF] w-full h-100vh max-w-[1200px] flex flex-wrap lg:flex-nowrap gap-3" >
//         <div className="w-2/5 h-[90vh] flex flex-col gap-3 pl-4 pt-3 overflow-auto scrollbar-hide">
//             <div className=" text-[#737373] font-semibold flex flex-col gap-2.5">
//             <div className="font-bold">Hello Raj!</div>
//             <span className="text-[#A6A6A6]">Lear with your peers to maximise learing</span>
//             <div className="relative">
//                 <input type="text" className="pl-10 pr-4 py-2 w-11/12 border rounded-lg" placeholder="Search Problems" />
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Image src="/community/search-lens.svg" alt="search" width={25} height={25} />
//                 </div>
//             </div>
//             </div>
//             <div className="flex flex-col gap-3">
//             <div className="flex flex-row justify-between">
//                 <span className="text-base font-semibold">Exclusive Communities</span>
//                 <div className="flex flex-row gap-4">
//                 <button onClick={handlePrev}><Image src="/community/lfarw.svg" alt="arr" width={7.89} height={13.99} /></button>
//                 <button onClick={handleNext}><Image src="/community/rfarw.svg" alt="arr" width={7.89} height={13.99} /></button>

//                 </div>
//             </div>
//             <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${(currentIndex / ExdataLen) * 100}%)` }}>
//                 {Exdata.map((slide, index) => (
//                 <div key={index} className="min-w-[200px] px-3 h-56 ">
//                     <div className="bg-[#fff] rounded-lg h-full">
//                     <div><Image src={Exdata[index].svg} alt="img" height={100} width={230} className="w-full" /></div>
//                     <div className="text-md font-bold h-16 flex flex-row justify-around pt-3">
//                         <div className="w-3/5">{Exdata[index].name}</div>
//                         <div className={`w-10 h-10 rounded-full bg-[#8c52ff] text-lg ${Exdata[index].message === 0 ? "hidden" : "flex"} flex justify-center items-center text-[#fff] `}>{Exdata[index].message}</div>
//                     </div>
//                     </div>
//                 </div>
//                 ))}
//             </div>
            
//             </div>
//             <div className="flex flex-col gap-3 overflow-x-clip">
//             <div className="flex flex-row justify-between">
//                 <span className="text-base font-semibold">All Communities</span>
//                 <button className="text-sm font-semibold text-[#8c52ff]">See All</button>
//             </div>
//             <div className="w-full gap-3 flex flex-col justify-center">
//                 {
//                 Alldata.map((item, index) => (
//                     <div key={index} className="w-full h-20 bg-[#fff] flex flex-row text-md font-bold justify-between items-center rounded-lg" onClick={()=>toggleHeading(Alldata[index].name)}>
//                     <div className="flex flex-row items-center">
//                         <div className="w-[80px] p-1"><Image src={Alldata[index].svg} alt="img" height={10} width={10} className="w-full" /></div>
//                         <span className="pl-5">{Alldata[index].name}</span>
//                     </div>
//                     <div className={`w-10 h-10 rounded-full bg-[#8c52ff] text-lg ${Alldata[index].message === 0 ? "hidden" : "flex"} flex justify-center items-center text-[#fff] mr-3`}>{Alldata[index].message}</div>
//                     </div>
//                 ))
//                 }
//             </div>
//             </div>
//         </div>
//         <div className="flex flex-col w-3/5 bg-[#fff] rounded-lg m-3 mb-0">
//             <div className="flex flex-row bg-[#8c52ff] w-full h-16 rounded-lg items-center justify-between">
//             <div className="flex flex-row gap-14 items-center pl-10">
//                 <div className="w-12 h-12 bg-[#fff] rounded-full flex justify-center items-center"><Image src="/community/webdevchaticon.svg" alt="img" height={10} width={10} className="w-8 h-8" /></div>
//                 <span className="text-xl font-semibold text-[#fff]">{messageHeading}</span>
//             </div>
//             <div className="flex flex-row items-center gap-8 pr-6">
//                 <div><Image src="/community/searchdocument.svg" alt="img" height={10} width={10} className="w-8 h-8" /></div>
//                 <div><Image src="/community/arrowdown.svg" alt="img" height={10} width={10} className="w-6 h-6" /></div>
//             </div>
//             </div>
//             <div className="flex flex-grow"></div>
//             <div className="flex justify-center p-3">
//             <div className="relative w-[65vw] ">
//                 <input type="text" className="pl-10 pr-4 py-2 w-full border rounded-lg bg-[#D9D9D9]" placeholder="text" />
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none justify-between w-full">
//                 <Image src="/community/textplussign.svg" alt="search" width={25} height={25} />
//                 <Image src="/community/sendicon.svg" alt="send" width={25} height={25} className="mr-3" />
//                 </div>
//             </div>
//             </div> 
//         </div>

//         </div>
//     </div>
//   );
// }