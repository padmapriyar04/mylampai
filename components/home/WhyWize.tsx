"use client";
import { useState, useEffect, useRef } from "react";
import ExperiencedCounsellors from "./ExperiencedCounsellors";
import PracticeCoding from "./PractiseCoding";
import WizeCampLink from "./WizeCampLink";

const whyWizeLinks = [
  { id: "allroundguidance", text: "All Round Guidance" },
  { id: "pathtosuccess", text: "Path To Success" },
  { id: "smartestplatform", text: "Smartest Platform" },
  { id: "expertsinsights", text: "Experts Insights" },
  { id: "advancedfeatures", text: "Advanced Features" },
];

export default function WhyWize() {
  const [active, setActive] = useState("allroundguidance");

  // Create a ref array for each section
  const sectionsRef = useRef(new Array(whyWizeLinks.length).fill(null));

  useEffect(() => {
    // Intersection Observer setup
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        root: null, // viewport
        rootMargin: "0px", // no margin
        threshold: 0.5, // trigger when 50% of the section is visible
      }
    );

    // Observe each section
    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    // Cleanup observer on component unmount
    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="flex flex-col items-center mb-4">
      <div className="max-w-[1300px] h-[100px] flex justify-center items-center w-full gap-4 mb-8">
        <div className="h-1 bg-black w-full max-w-[150px] sm:max-w-[200px] md:max-w-[33%] bg-gradient-to-r from-white to-primary"></div>
        <div className="w-full text-3xl md:text-4xl font-medium text-center">
          Why Choose&nbsp;<span className="text-[#8C52FF]">wiZ</span>e
        </div>
        <div className="h-1 bg-black w-full max-w-[150px] sm:max-w-[200px] md:max-w-[33%] bg-gradient-to-r from-primary to-white"></div>
      </div>
      <div className="flex w-full max-w-[1350px] relative">
        <div className="hidden md:flex flex-col w-full max-w-[300px] pt-[100px] sticky top-0 h-screen text-[#000000BB] px-8 text-lg font-semibold tracking-wide gap-3">
          {whyWizeLinks.map((item) => (
            <WizeCampLink
              key={item.id}
              active={active}
              setActive={setActive}
              id={item.id}
              text={item.text}
            />
          ))}
        </div>
        <div className="md:border-l-4 md:border-[#baa1eb] px-6 lg:px-[60px] xl:px-[100px] relative">
          <div
            id="allroundguidance"
            ref={(el) => { sectionsRef.current[0] = el }}
            className="pb-[50px] sm:pb-[100px] sm:min-h-[700px]"
          >
            <h4 className="pt-4 font-semibold text-[#8C52FF]">
              ALL ROUND GUIDANCE
              <div className="bg-[#8C52FF] w-6 h-6 blur-sm rounded-full absolute left-0 md:top-0 translate-x-[-14px] translate-y-[-100%] md:translate-y-[-50%]"></div>
            </h4>
            <div className="text-2xl sm:text-3xl font-medium mt-8 mb-4">
              To make it happen for you
            </div>
            <p className="text-sm sm:text-base text-[#000000BB] font-medium my-4">
              Everything you need, we got it! Career Exploration - yup,
              Personalized learning - yes, Competitions, hackathons, acads-
              yeah, projects and practice - yus, CV building and test and
              Interview prep - in-house AI!
            </p>
            <div className="bg-[#3a3a3a] min-h-[400px] w-full my-8 rounded-2xl"></div>
          </div>

          <PracticeCoding />


          <div
            id="smartestplatform"
            ref={(el) => { sectionsRef.current[2] = el }}
            className="pb-[50px] sm:pb-[100px] sm:min-h-[700px]"
          >
            <h4 className="pt-4 font-semibold text-[#8C52FF]">
              SMARTEST PLATFORM
              <div className="bg-[#8C52FF] w-6 h-6 blur-sm rounded-full absolute left-0 translate-x-[-14px] translate-y-[-100%]"></div>
            </h4>
            <div className="text-2xl sm:text-3xl font-medium mt-8 mb-4">
              100% online and designed for your comfort and engaging learning
              experience
            </div>
            <p className="text-sm sm:text-base text-[#000000BB] font-medium my-4">
              From starting your college journey to your placement and even
              post-college, we provide comprehensive guidance. Just keep
              showing up and stay engaged, and our AI-powered platform will
              take care of you!
            </p>
            <div className="bg-[#3a3a3a] min-h-[400px] w-full my-8 rounded-2xl"></div>
          </div>

          <ExperiencedCounsellors />

          <div
            id="advancedfeatures"
            ref={(el) => { sectionsRef.current[4] = el }}
            className="pb-[50px] sm:pb-[100px] sm:min-h-[700px]"
          >
            <h4 className="pt-4 font-semibold text-[#8C52FF]">
              ADVANCED FEATURES
              <div className="bg-[#8C52FF] w-6 h-6 blur-sm rounded-full absolute left-0 translate-x-[-14px] translate-y-[-100%]"></div>
            </h4>
            <div className="text-2xl sm:text-3xl font-medium mt-8 mb-4">
              Explore the advanced tools and features
            </div>
            <p className="text-sm sm:text-base text-[#000000BB] font-medium my-4">
              From AI-powered tools to interactive learning experiences, our
              platform is equipped with the best features.
            </p>
            <div className="bg-[#3a3a3a] min-h-[400px] w-full my-8 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

