// "use client"
// import Image from "next/image"
// import WizeCampLink from "@/components/home/WizeCampLink";
// import { useState } from "react";
// interface Data {
//     id: string;
//     text: string;
// }
// const blogLinks = [
//     {
//         id: "allroundassistance",
//         text: "Why Choose WordPress?",
//     },
//     {
//         id: "smartestplatform",
//         text: "WordPress Developer Roadmap",
//     },
//     {
//         id: "ourwinningrecord",
//         text: "Conclusion",
//     },
// ];
// export default function blogId() {
//     const [active, setActive] = useState("allroundassistance");
//     return (
//         <div className="flex flex-col gap-4 justify-center items-center">
//             <div className="bg-[#8c52af] h-96 w-[97vw] text-[#f5f5f5] flex flex-row my-4 rounded-lg">
//                 <div className="w-2/3 flex justify-center">
//                     <div className="flex flex-col justify-center w-9/12 gap-4">
//                         <span className="text-[45px] font-semibold">How to Become a WordPress Developer in 8 Steps</span>
//                         <div className="flex flex-row gap-4">
//                             <Image src="/blog/dp.png" alt="dp" width={30} height={30}/>
//                             <span className="text-[20px]">Meghdeep Patnaik</span>
//                         </div>
//                         <span className="text-[20px]">In this article, we will provide a detailed and comprehensive roadmap on how to become a WordPress developer, covering essential skills, tools, and resources.</span>
//                     </div>
//                 </div>
//                 <div className="w-1/3 flex justify-center items-center">
//                     <Image src="/blog/instructor.svg" alt="img" width={10} height={10} className="w-10/12" />
//                 </div>

//             </div>
//             <div className="flex flex-col items-center mb-4">
//                 <div className="flex w-full max-w-[1450px] relative">
//                     <div className="hidden md:flex flex-col w-full max-w-[300px] pt-[100px] sticky top-0 h-screen text-[#000000BB] px-2 text-lg font-semibold tracking-wide gap-4 ">
//                         {blogLinks.map((item: Data, index) => {
//                             return (
//                                 <WizeCampLink
//                                     key={index}
//                                     active={active}
//                                     setActive={setActive}
//                                     id={item.id}
//                                     text={item.text}
//                                 />
//                             );
//                         })}
//                     </div>
//                     <div className="md:border-l-4 md:border-[#baa1eb] px-6 lg:px-[60px] xl:px-[100px] relative">
//                         <div id="allroundassistance" className="pb-[50px] sm:pb-[100px] focus:text-[#8C52FF] ">  
//                             <div className="text-2xl sm:text-3xl font-medium mt-8 mb-4">
//                                 Why Choose WordPress?
//                             </div>
//                             <p className="text-sm sm:text-lg text-[#000000BB] font-medium my-4">
//                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet nam nobis tenetur vitae placeat inventore, doloremque atque facere molestias doloribus assumenda officiis suscipit hic! Ipsa sit neque eligendi magni explicabo ab, non modi maxime!
//                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium earum culpa, non corrupti fugit, accusamus animi amet cupiditate illo iste placeat, expedita aut nam eos fugiat! Totam facilis repellat ut ipsam dicta, illum optio sunt accusamus, et tenetur expedita atque possimus? Corrupti ut sed consequuntur sunt, laborum veniam repellat odit nihil perferendis debitis provident maxime assumenda aspernatur quia itaque alias, veritatis accusamus, consectetur deserunt eos voluptate nostrum! Deleniti corrupti amet iure consectetur modi sunt incidunt deserunt ab? Ipsam vitae at eveniet, rem vel possimus dolorum officiis nostrum deleniti minus reprehenderit.
//                             </p>
//                         </div>
//                         <div id="smartestplatform" className="pb-[50px] sm:pb-[100px] ">
//                             <div className="text-2xl sm:text-3xl font-medium mt-8 mb-4">
//                                 WordPress Developer Roadmap (Step-By-Step)
//                             </div>
//                             <p className="text-sm sm:text-lg text-[#000000BB] font-medium my-4">
//                                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus laudantium tenetur, dicta quae qui cum obcaecati rerum sit? Officia iusto explicabo dolores! Est iure quos saepe aliquam magni accusantium voluptates voluptatem incidunt. Eveniet, perferendis.
//                                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis architecto, tempora suscipit quod culpa exercitationem! Aliquam iste sapiente maiores, totam natus quasi dignissimos perferendis iusto animi odio ipsam dolorem dolorum molestiae quo in repellendus similique ipsum optio laborum ea ullam placeat excepturi. Eum totam ipsum similique tenetur dicta repellat architecto consequatur! Corporis facilis illo sapiente sequi debitis pariatur, delectus esse asperiores ipsa, recusandae laudantium iusto! Corporis explicabo, aspernatur debitis quidem mollitia iure pariatur omnis animi maiores, laboriosam eos repellat fuga atque nostrum ducimus nesciunt dolore fugiat asperiores. Labore, incidunt obcaecati!
//                             </p>
//                         </div>
//                         <div id="ourwinningrecord" className=" ">
//                             <div className="text-2xl sm:text-3xl font-medium mt-8 mb-4">
//                                 Conclusion
//                             </div>
//                             <p className="text-sm sm:text-lg text-[#000000BB] font-medium my-4">
//                                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti ab aspernatur expedita! Provident unde eos a non tempora sit ducimus repellendus officia magnam debitis. Magni ipsam veniam vel est nostrum deleniti consequuntur sunt rem!
//                                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet quas quasi suscipit mollitia architecto animi dicta debitis odio praesentium provident excepturi quia nostrum maiores aut, voluptas, aliquam nemo unde commodi cupiditate. Dolorum deserunt culpa, nulla ratione saepe commodi ea hic voluptatibus sit officiis magnam tempore iste tempora ex consectetur quis dolore beatae nobis! Dignissimos odio voluptatibus esse cupiditate iusto non, tempora odit quam. Accusantium cum nihil cumque iusto quam nobis explicabo saepe magni, labore minima, blanditiis ut tempore. Deleniti id ullam cum tempora perspiciatis maxime maiores temporibus perferendis ad illum!
//                             </p>

//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
import React from 'react';
import HomeNavbar from './bloghomebar';
import { FaHome } from "react-icons/fa";

export default function BlogId() {
    return (
        <div className='w-full h-[100vh] bg-[#000000] flex flex-col'>
            <div className='w-full h-fit border-b-[2px] border-b-white fixed top-0 left-0 z-10'>
                <HomeNavbar />
            </div>
            <div className='w-full flex-1 text-white flex justify-between mt-[4rem] px-32 py-20  '>
                <div className='text-white w-[50%] flex space-x-2 h-full mx-2 flex-col gap-4 '>
                    <div className=' w-full h-fit flex flex-row gap-1 bg-red-600'>
                    <FaHome size={24} color='#8C52FF' />
                    <h1>Home</h1>
                    <span className='text-[#8C52FF] h-fit'>&gt;</span>
                    <h1>Blogs</h1>
                    <span className='text-[#8C52FF] h-fit '>&gt;</span>
                    <h1>ABC</h1>
                    </div>
                    <div className='bg-red-300 flex justify-start w-full h-fit -mx-2 my-8'> <div>01</div> <div>002</div></div>
                    <div className='bg-green-200'>0003</div>
                    <div className='bg-gray-400'>004</div>
                    <div className='bg-gray-400'>005</div>
                </div>
                <div className='w-[50%] text-white bg-green-300 '>02</div>
            </div>
        </div>
    );
}


