"use client";
import Image from "next/image";
import {
  Carousel,
  CarouselNext,
  CarouselPrevious,
  CarouselItem,
  CarouselContent,
} from "@/components/ui/carousel";

interface CounsellorCardProps {
  name: string;
  image: string;
  experience: string;
  ranking: string;
}

const carouselData = [
  {
    name: "Fiona Claudia",
    image: "/home/profile.jpg",
    experience: "22k+ students counselled",
    ranking: "Lead Counsellor",
  },
  {
    name: "Fiona Claudia",
    image: "/home/profile.jpg",
    experience: "22k+ students counselled",
    ranking: "Lead Counsellor",
  },
  {
    name: "Fiona Claudia",
    image: "/home/profile.jpg",
    experience: "22k+ students counselled",
    ranking: "Lead Counsellor",
  },
];

const CounsellorCard: React.FC<CounsellorCardProps> = ({
  name,
  image,
  experience,
  ranking,
}) => {
  return (
    <div className="w-full max-w-[260px] flex flex-col items-center bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="w-full h-24 bg-primary flex items-center justify-center"></div>
      <Image
        src={image}
        alt="profile"
        width={200}
        height={200}
        className="h-24 w-24 rounded-full object-cover -translate-y-1/2 border-2 border-primary"
      />

      <div className="text-xl font-semibold -translate-y-6">{name}</div>
      <div className="text-[#000000BB] text-sm -translate-y-4">{ranking}</div>
      <div className="h-[1px] w-full bg-black"></div>
      <div className="text-[#000000BB] text-center font-medium p-4">
        {experience}
      </div>
    </div>
  );
};

interface BulletCardProps {
  title: string;
  description: string;
}

const BulletCard: React.FC<BulletCardProps> = ({ title, description }) => {
  return (
    <div className="w-full max-w-[380px] flex p-4 gap-4 items-center bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="bg-[#2E66D3] w-6 h-6 rounded-full backdrop-blur-sm"></div>
      <div>
        <div className="text-xl font-semibold">{title}</div>
        <div className="text-[#000000BB] font-medium text-sm">
          {description}
        </div>
      </div>
    </div>
  );
};

const ExperiencedCounsellors = () => {
  return (
    <>
      <div id="expertsinsights" className="pb-[100px] min-h-screen">
        <h4 className="pt-4 font-semibold text-primary">
          EXPERTS INSIGHTS
          <div className="bg-primary w-6 h-6 blur-sm rounded-full absolute left-0 translate-x-[-14px] translate-y-[-100%] "></div>
        </h4>
        <div className="text-3xl font-medium mt-8 mb-4">
          Expertise of 1,000+ industry professionals and experts at your reach
        </div>
        <p className="text-[#000000BB] font-medium my-4">
          For every phase of your college and career journey, we&apos;ve got you
          covered. Our models are trained on extensive quality data and curated
          insights from experienced industry and subject matter experts, guiding
          you to your dream path.
        </p>
        <div className="w-full my-8 rounded-2xl shadow-md">
          <Carousel>
            <CarouselContent className="px-2 pb-8">
              {carouselData.map((item, index) => (
                <CarouselItem key={index} className="md:basis-1/2 xl:basis-1/3">
                  <CounsellorCard
                    name={item.name}
                    image={item.image}
                    experience={item.experience}
                    ranking={item.ranking}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex flex-wrap gap-4 justify-evenly bg-primary-foreground py-8 px-4">
            <BulletCard title="10k+" description="Successful Premium Admits" />
            <BulletCard title="10k+" description="Successful Premium Admits" />
            <BulletCard title="10k+" description="Successful Premium Admits" />
            <BulletCard title="10k+" description="Successful Premium Admits" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ExperiencedCounsellors;
