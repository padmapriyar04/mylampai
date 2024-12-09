import Image from "next/image";

export default function CommunitySection() {
  return (
    <>
      <div className="flex justify-between flex-col-reverse sm:flex-row items-center md:mx-auto mx-4 max-w-[1300px] min-h-[400px] py-8 px-6 sm:px-[50px] rounded-2xl shadow-xl bg-primary-foreground mt-[200px]">
        <div className="flex flex-col gap-4 items-start justify-evenly min-h-[300px] max-w-[500px] h-full ">
          <h2 className="text-2xl sm:text-3xl font-bold max-w-[400px]">
            College journey is better with{" "}
            <span className="text-[#8C52FF]">wiZ</span>e community
          </h2>
          <p className="font-bold text-[#00000090]">
            Join a community of serious & passionate teck folks, students,
            mentors and coaches to accelerate your career
          </p>
          <button className="bg-[#8C52FF] hover:bg-primary-foreground hover:text-[#8c52ff] hover:shadow-md rounded-2xl text-primary-foreground font-semibold py-2 px-4 transition-all  border-2 border-[#8c52ff] sm:px-16 ">
            Join Our <br />
            AI-Powered Community
          </button>
        </div>
        <div className="sm:h-[300px] max-w-[500px]">
          <Image
            src="/home/community.svg"
            height={300}
            width={500}
            alt="community"
            className="w-full h-auto sm:translate-y-[-40%]"
          />
        </div>
      </div>
    </>
  );
}
