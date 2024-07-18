"use client";
import { useEffect } from "react";
import HeroSection from "@/app/components/home/HeroSection";
import AboutWize from "@/app/components/home/AboutWize";
import WizeCamp from "@/app/components/home/WizeCamp";
import WhyWize from "@/app/components/home/WhyWize";
import BackedByBest from "@/app/components/home/BackedByBest";
import PowerOfWize from "@/app/components/home/PowerOfWize";
import RecentAdvances from "@/app/components/home/RecentAdvances";
import CommunitySection from "@/app/components/home/Community";
import Footer from "@/app/components/home/Footer";
import HomeSlider from "@/app/components/home/HomeSlider";
import HomeNavbar from "@/app/components/home/HomeNavbar";

export default function Page() {
  useEffect(() => {
    document.title = "MyLampAi - Home";
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main className="h-full bg-[#fff]">
        <HomeNavbar />
        <HeroSection />
        <AboutWize />
        <WizeCamp />
        <HomeSlider />
        <WhyWize />
        <BackedByBest />
        <PowerOfWize />
        <RecentAdvances />
        <CommunitySection />
        <Footer />
      </main>
    </>
  );
}
