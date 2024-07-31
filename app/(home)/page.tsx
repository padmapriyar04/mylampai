"use client";
import { useEffect } from "react";
// import HeroSection from "../../components/home/HeroSection";
import HeroSection from "@/components/home/HeroSection";
import AboutWize from "@/components/home/AboutWize";
import WizeCamp from "@/components/home/WizeCamp";
import WhyWize from "@/components/home/WhyWize";
import BackedByBest from "@/components/home/BackedByBest";
import PowerOfWize from "@/components/home/PowerOfWize";
import RecentAdvances from "@/components/home/RecentAdvances";
import CommunitySection from "@/components/home/Community";
import Footer from "@/components/home/Footer";
import HomeSlider from "@/components/home/HomeSlider";
import HomeNavbar from "@/components/home/HomeNavbar";
import './home.css';

export default function Page() {
  useEffect(() => {
    document.title = "MyLampAi - Home";
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main className="home-page h-full bg-[#fff]">
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
