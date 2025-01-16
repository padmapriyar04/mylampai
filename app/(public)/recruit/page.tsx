import { Metadata } from "next";
import RecruitHero from "@/components/recruit/RecruitHero";
import BackedByBest from "@/components/home/BackedByBest";
import ExclusivePool from "@/components/recruit/ExclusivePool";

export const metadata: Metadata = {
  title: "wiZe (myLampAI) | Recruit",
  description:
    "wiZe is a career guidance platform that helps you find your dream career.",
};

export default function Page() {
  return (
    <>
      <main className="home-page h-full bg-white">
        <RecruitHero />
        <BackedByBest />
        <ExclusivePool />
      </main>
    </>
  );
}
