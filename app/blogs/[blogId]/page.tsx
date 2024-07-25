"use client"
import Image from "next/image"
import WizeCampLink from "@/components/home/WizeCampLink";
import { useState } from "react";
interface Data {
    id: string;
    text: string;
}
const whyWizeLinks = [
    {
        id: "allroundassistance",
        text: "Why Choose WordPress?",
    },
    {
        id: "smartestplatform",
        text: "WordPress Developer Roadmap",
    },
    {
        id: "ourwinningrecord",
        text: "Conclusion",
    },
];
export default function blogId() {
    const [active, setActive] = useState("allroundassistance");
    return (
        <div>
            <div className="bg-[#8c52af] h-96 w-full text-[#f5f5f5] flex flex-row ">
                <div className="w-2/3 flex justify-center">
                    <div className="flex flex-col justify-center w-9/12 gap-4">
                        <span className="text-[45px] font-semibold">How to Become a WordPress Developer in 8 Steps</span>
                        <div className="flex flex-row gap-4">
                            <Image src="/blog/dp.png" alt="dp" width={30} height={30}/>
                            <span className="text-[20px]">Meghdeep Patnaik</span>
                        </div>
                        <span className="text-[20px]">In this article, we will provide a detailed and comprehensive roadmap on how to become a WordPress developer, covering essential skills, tools, and resources.</span>
                    </div>
                </div>
                <div className="w-1/3 flex justify-center items-center">
                    <Image src="/blog/instructor.svg" alt="img" width={10} height={10} className="w-10/12" />
                </div>

            </div>
            <div className="flex flex-col items-center mb-4">
                <div className="max-w-[1300px] h-[100px] flex justify-center items-center w-full  mb-8">
                    <div className="h-1 bg-black w-full max-w-[150px] sm:max-w-[200px] md:max-w-[33%] bg-gradient-to-r from-white to-primary"></div>
                    <div className="h-1 bg-black w-full max-w-[150px] sm:max-w-[200px] md:max-w-[33%] "></div>            
                    <div className="h-1 bg-black w-full max-w-[150px] sm:max-w-[200px] md:max-w-[33%] bg-gradient-to-r from-primary to-white"></div>
                </div>
                <div className="flex w-full max-w-[1350px] relative">
                    <div className="hidden md:flex flex-col w-full max-w-[300px] pt-[100px] sticky top-0 h-screen text-[#000000BB] px-8 text-lg font-semibold tracking-wide gap-3 ">
                        {whyWizeLinks.map((item: Data, index) => {
                            return (
                                <WizeCampLink
                                    key={index}
                                    active={active}
                                    setActive={setActive}
                                    id={item.id}
                                    text={item.text}
                                />
                            );
                        })}
                    </div>
                    <div className="md:border-l-4 md:border-[#baa1eb] px-6 lg:px-[60px] xl:px-[100px] relative">
                        <div id="allroundassistance" className="pb-[50px] sm:pb-[100px] focus:text-[#8C52FF] sm:min-h-[700px]">  
                            <div className="text-2xl sm:text-3xl font-medium mt-8 mb-4">
                                Why Choose WordPress?
                            </div>
                            <p className="text-sm sm:text-base text-[#000000BB] font-medium my-4">
                               Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet nam nobis tenetur vitae placeat inventore, doloremque atque facere molestias doloribus assumenda officiis suscipit hic! Ipsa sit neque eligendi magni explicabo ab, non modi maxime!
                            </p>
                        </div>
                        <div id="smartestplatform" className="pb-[50px] sm:pb-[100px] sm:min-h-[700px]">
                            <div className="text-2xl sm:text-3xl font-medium mt-8 mb-4">
                                WordPress Developer Roadmap (Step-By-Step)
                            </div>
                            <p className="text-sm sm:text-base text-[#000000BB] font-medium my-4">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus laudantium tenetur, dicta quae qui cum obcaecati rerum sit? Officia iusto explicabo dolores! Est iure quos saepe aliquam magni accusantium voluptates voluptatem incidunt. Eveniet, perferendis.
                            </p>
                            <div className="bg-[#3a3a3a] min-h-[400px] w-full my-8 rounded-2xl"></div>
                        </div>
                        <div id="ourwinningrecord" className=" sm:min-h-[700px]">
                            <div className="text-2xl sm:text-3xl font-medium mt-8 mb-4">
                                Conclusion
                            </div>
                            <p className="text-sm sm:text-base text-[#000000BB] font-medium my-4">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti ab aspernatur expedita! Provident unde eos a non tempora sit ducimus repellendus officia magnam debitis. Magni ipsam veniam vel est nostrum deleniti consequuntur sunt rem!
                            </p>
                            {/* <div className="flex flex-wrap justify-center gap-4 min-h-[400px] w-full my-8 rounded-2xl">
                                <div className="bg-white w-full max-w-[300px] lg:max-w-[380px] xl:max-w-[400px] rounded-2xl border-2 border-[#8C52FF90] drop-shadow-md shadow-[#8C52FF30] min-h-[200px]"></div>
                                <div className="bg-white w-full max-w-[300px] lg:max-w-[380px] xl:max-w-[400px] rounded-2xl border-2 border-[#8C52FF90] drop-shadow-md shadow-[#8C52FF30] min-h-[200px]"></div>
                                <div className="bg-white w-full max-w-[300px] lg:max-w-[380px] xl:max-w-[400px] rounded-2xl border-2 border-[#8C52FF90] drop-shadow-md shadow-[#8C52FF30] min-h-[200px]"></div>
                                <div className="bg-white w-full max-w-[300px] lg:max-w-[380px] xl:max-w-[400px] rounded-2xl border-2 border-[#8C52FF90] drop-shadow-md shadow-[#8C52FF30] min-h-[200px]"></div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}