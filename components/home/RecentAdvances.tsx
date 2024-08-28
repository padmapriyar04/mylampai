import Image from "next/image";

const data = [
  {
    imageUrl: "/home/profile.jpg",
    title: "Exploring new developements in genAI",
    description:
      "GenAI is a platform that uses AI to provide insights and recommendations to users.",
  },
  {
    imageUrl: "/home/profile.jpg",
    title: "Exploring new developements in genAI",
    description:
      "GenAI is a platform that uses AI to provide insights and recommendations to users.",
  },
  {
    imageUrl: "/home/profile.jpg",
    title: "Exploring new developements in genAI",
    description:
      "GenAI is a platform that uses AI to provide insights and recommendations to users.",
  },
  {
    imageUrl: "/home/profile.jpg",
    title: "Exploring new developements in genAI",
    description:
      "GenAI is a platform that uses AI to provide insights and recommendations to users.",
  },
];

function RecentAdvancesCard({
  imageUrl,
  title,
  description,
}: {
  imageUrl: string;
  title: string;
  description: string;
}) {
  return (
    <>
      <div className="relative flex flex-col justify-between md:max-w-[23.5%] pb-4 rounded-2xl overflow-hidden min-h-[350px] shadow-md hover:scale-105 transition-all">
        <Image
          src={imageUrl}
          height={100}
          width={500}
          alt="blog image"
          className="w-full h-auto"
        />
        <h3 className="font-semibold text-lg  px-4 pt-4">{title}</h3>
        <p className="text-sm text-[#00000090] px-4 pb-4">{description}</p>
        <Image
          src={"/home/arrowdown.svg"}
          width={200}
          height={200}
          alt="arrow"
          className="h-auto absolute w-8 bottom-2 right-2 shadow-lg rounded-full"
        ></Image>
      </div>
    </>
  );
}

export default function RecentAdvances() {
  return (
    <>
      <div className="max-w-[1300px] mx-auto mt-12 px-5">
        <div className="flex justify-between flex-col sm:flex-row items-center mx-2">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Recent Blogs
          </h2>
          <button className="flex items-center gap-2 border-2 border-black font-semibold mt-4 sm:mt-0 rounded-full px-4 py-1 sm:py-2 hover:scale-[1.02] hover:bg-[fafafa] transition-all duration-200">
            Read More
            <Image
              src={"/home/ArrowLearnMore.svg"}
              alt=""
              height={25}
              width={25}
            />
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center sm:justify-evenly lg:justify-between gap-4 my-8 sm:my-[50px]">
          {data.map((item, index) => (
            <RecentAdvancesCard key={index} {...item} />
          ))}
        </div>
        
      </div>
    </>
  );
}
