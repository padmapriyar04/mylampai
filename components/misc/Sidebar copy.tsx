"use client"
import { useState, useRef, useEffect } from 'react';
import { usePathname } from "next/navigation";
import Image from "next/image";
import NavLinks from '@/app/components/navbar/NavItems'
import navData from '@/app/components/navbar/navLinks.json'
import smData from '@/app/data/navsocialicon.json'

export default function Sidebar(props: any) {

    const pathname = usePathname();
    const navLen = navData.length;
    const socialLen = smData.length;
    const navRender = Array(navLen).fill(null);
    const smRender = Array(socialLen).fill(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const checkScreenSize = () => {
        setIsSmallScreen(window.innerWidth < 640); // Tailwind's sm breakpoint is 640px
    };

    useEffect(() => {
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <div className={`sticky z-50`}>
            <div className={`h-[100vh] gap-2 ${isSmallScreen?"hidden" : "flex"} flex flex-col bg-[#fff] transition-all duration-300 z-50`}>
                <div className="w-full h-[500px] flex flex-col gap-7 overflow-x-clip overflow-y-auto scrollbar-hide mr-6">
                    {
                        navRender.map((item, navindex) => {
                            const isActive = pathname === navData[navindex].Link;
                            return (
                                <div key={navindex}>
                                    <NavLinks name={navData[navindex].name} icon={navData[navindex].icon} Link={navData[navindex].Link} index={navindex} />
                                </div>
                            );
                        })
                    }
                </div>
                <div className="w-full flex flex-col items-center">
                    <div className="w-12 h-12 border-4 rounded-full border-[#f5f5f5] absolute z-10">
                        <Image src="/avtar.svg" alt="pfp" height={50} width={50} />
                    </div>
                    <div className="w-11/12 h-24 border-2 bg-[#8c52ff] rounded-xl relative top-5"></div>
                </div>
                <div className="w-full9 h-20 bg-[#E8E2F4] text-lg font-medium flex flex-col justify-center items-center gap-2 mt-6 rounded-lg">
                    <div className="flex flex-row gap-1.5 font-semibold">
                        {
                            smRender.map((item, smindex) => (
                                <div key={smindex}>
                                    <div className="w-7 h-7"><Image src={smData[smindex].icon} alt={smData[smindex].name} height={100} width={100} /></div>
                                </div>
                            ))
                        }
                    </div>
                    <span>Connect with us</span>
                </div>

            </div>
            <div className={`h-[100vh] w-screen ${isSmallScreen?"flex" : "hidden"} gap-2 flex flex-col items-center bg-[#fff] transition-all duration-300 z-50`}>
                <div className="w-full h-[500px] flex flex-col gap-7 overflow-x-clip overflow-y-auto scrollbar-hide pl-32">
                    {
                        navRender.map((item, navindex) => {
                            const isActive = pathname === navData[navindex].Link;
                            return (
                                <div key={navindex}>
                                    <NavLinks name={navData[navindex].name} icon={navData[navindex].icon} Link={navData[navindex].Link} index={navindex} />
                                </div>
                            );
                        })
                    }
                </div>
                <div className="w-9/12 flex flex-col items-center">
                    <div className="w-12 h-12 border-4 rounded-full border-[#f5f5f5] absolute z-10">
                        <Image src="/avtar.svg" alt="pfp" height={50} width={50} />
                    </div>
                    <div className="w-11/12 h-24 border-2 bg-[#8c52ff] rounded-xl relative top-5"></div>
                </div>
                <div className="w-9/12 h-20 bg-[#E8E2F4] text-lg font-medium flex flex-col justify-center items-center gap-2 mt-6 rounded-lg">
                    <div className="flex flex-row gap-1.5 font-semibold">
                        {
                            smRender.map((item, smindex) => (
                                <div key={smindex}>
                                    <div className="w-7 h-7"><Image src={smData[smindex].icon} alt={smData[smindex].name} height={100} width={100} /></div>
                                </div>
                            ))
                        }
                    </div>
                    <span>Connect with us</span>
                </div>

            </div>
        </div>
    );
}