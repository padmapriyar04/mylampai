import Image from "next/image";

export default function BackedByBest() {
  return (
    <>
      <div className="bg-[url('/home/herosection-background.svg')] flex flex-col justify-center items-center my-4 pb-4 min-h-[540px]">
        <div className="text-4xl font-medium max-w-[1300px] h-[100px] flex justify-center items-center w-full gap-4 mb-8">
          <div className="h-1 bg-black w-full bg-gradient-to-r from-white to-primary"></div>
          <div className="w-full text-center">Backed by the Best</div>
          <div className="h-1 bg-black w-full bg-gradient-to-r from-primary to-white"></div>
        </div>
        <div className="flex flex-wrap w-full items-start justify-evenly">
          <div className="mb-4 min-h-[100px] md:min-h-[240px] flex flex-col justify-between font-semibold text-xl items-center ">
            <div className="md:max-w-[400px] px-12 w-full flex items-center h-[180px] bg-white border rounded-lg ">
              <Image
                src="/home/IIMBanglore.svg"
                alt="IIM Bangalore"
                className="w-full h-auto"
                width={200}
                height={200}
              />
            </div>
            <div className="text-2xl text-[#222]">IIM Bangalore</div>
          </div>
          <div className="w-full max-w-[200px] md:max-w-[400px] mb-4 min-h-[100px] md:min-h-[240px] flex flex-col justify-between font-semibold text-xl items-center ">
            <div className=" md:max-w-[400px] px-4 w-full flex items-center h-[180px] bg-white border rounded-lg ">
              <Image
                src="/home/microsoft1.svg"
                alt="microsoft"
                className="w-full h-auto"
                width={200}
                height={200}
              />
            </div>
            <div className="drop-shadow-md text-2xl text-[#222]">
              Microsoft
            </div>
          </div>
          <div className="w-full max-w-[200px] md:max-w-[400px] min-h-[150px] md:min-h-[240px] flex flex-col justify-between font-semibold text-xl items-center ">
            <div className="md:max-w-[400px] w-full justify-center py-8 flex items-center h-[180px] bg-white border  rounded-lg ">
              <Image
                src="/home/IITKGP.svg"
                alt="IIT Kharagpur"
                className="h-full w-auto"
                width={200}
                height={200}
              />
            </div>
            <div className="text-2xl text-[#222]">IIT Kharagpur</div>
          </div>
        </div>
      </div>
    </>
  );
}
