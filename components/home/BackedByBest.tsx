import Image from "next/image";

export default function BackedByBest() {
  return (
    <>
      <div className="bg-[url('/home/herosection-background.svg')] flex flex-col justify-center items-center my-4 pb-4 min-h-[600px]">
        <div className="text-4xl font-medium max-w-[1300px] h-[100px] flex justify-center items-center w-full gap-4 mb-8">
          <div className="h-1 bg-black w-full bg-gradient-to-r from-white to-primary"></div>
          <div className="w-full text-center">Backed by Best</div>
          <div className="h-1 bg-black w-full bg-gradient-to-r from-primary to-white"></div>
        </div>
        <div className="flex flex-wrap w-full items-center justify-evenly">
          <div className="w-full max-w-[200px] md:max-w-[300px] mb-[30px] min-h-[100px] md:min-h-[280px] flex flex-col justify-between  font-bold text-xl items-center ">
            <div className=" md:max-w-[350px] w-full flex items-center h-[200px] bg-white border  rounded-lg ">
              <Image
                src="/home/IIMBanglore.svg"
                alt="IIT Kharagpur"
                className="w-full h-auto"
                width={200}
                height={200}
              />
            </div>
            <div className="text-xl md:text-[1.4rem]">IIM Bangalore</div>
          </div>
          <div className="w-full max-w-[200px] md:max-w-[450px] mb-[30px] min-h-[100px] md:min-h-[280px] flex flex-col justify-between font-bold text-xl items-center ">
            <div className=" md:max-w-[350px] w-full flex items-center h-[200px] bg-white border  rounded-lg ">
              <Image
                src="/home/microsoft1.svg"
                alt="IIT Kharagpur"
                className="w-full h-auto"
                width={200}
                height={200}
              />
            </div>
            <div className="drop-shadow-md text-xl md:text-[1.4rem]">
              Microsoft
            </div>
          </div>
          <div className="w-full max-w-[200px] md:max-w-[300px] min-h-[150px] md:min-h-[280px] flex flex-col justify-between font-bold text-xl items-center ">
            <div className=" md:max-w-[350px] w-full flex items-center h-[160px] bg-white border  rounded-lg ">
              <Image
                src="/home/IITKGP.svg"
                alt="IIT Kharagpur"
                className="w-full h-auto"
                width={200}
                height={200}
              />
            </div>
            <div className="text-xl md:text-[1.4rem]">IIT Kharagpur</div>
          </div>
        </div>
      </div>
    </>
  );
}
