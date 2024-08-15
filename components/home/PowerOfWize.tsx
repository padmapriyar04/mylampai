import Image from "next/image";

export default function PowerOfWize() {
  return (
    <>
      <div className="flex flex-col  md:flex-row md:justify-between w-full max-w-[1300px] m-auto gap-4 ">
        <div className="w-full flex flex-col py-4 pl-8 md:items-start justify-between md:pl-4">
          <p className="w-full text-sm font-bold mb-4 uppercase">
            The Power of wiZe ----
          </p>
          <div className="flex flex-col items-start max-w-[500px] gap-8 pr-8 mb-4">
            <p className="text-3xl md:text-4xl font-medium">
              Your <span className="text-[#B7B7B7]">Gateway</span> to a Dream
              Career - <span className="text-[#5FE8F1]">One</span> platform,{" "}
              <br />a <span className="text-[#8C52FF]">Million</span> of
              Possibilities.
            </p>
            <button className="flex items-center gap-2 text-lg md:text-xl border-2 border-black rounded-full px-4 py-2 font-semibold hover:scale-[1.02] hover:bg-[#fafafa] transition-all duration-200">
              Learn More{" "}
              <Image
                src={"/home/ArrowLearnMore.svg"}
                alt=""
                height={30}
                width={30}
              />
            </button>
          </div>
          <p className="w-full text-sm font-bold mb-4 uppercase text-right">
            ---- Trusted by leading professionals and visionary partners
          </p>
        </div>
        <div className="grid gap-4 grid-cols-2 relative w-full max-w-[600px] m-auto p-4">
          <div className="relative bg-cover bg-[url('/home/PowerOfWize.svg')] md:bg-black w-full bg-center max-w-[290px] rounded-tr-[5rem] rounded-bl-[5rem] h-[276px]">
            <div className="absolute flex items-center justify-center text-white w-[calc(100%-48px)] h-10 bg-[#ffffff60] backdrop-blur-lg top-6 left-4 rounded-3xl ">
              types of design tools
            </div>
            <div className="absolute flex items-center justify-center text-3xl text-white font-medium w-[100px] h-16 bg-[#ffffff60] backdrop-blur-lg bottom-4 right-4 rounded-3xl ">
              20+
            </div>
          </div>
          <div className="relative bg-cover bg-[url('/home/PowerOfWize.svg')] md:bg-black w-full bg-center max-w-[290px] rounded-br-[5rem] rounded-tl-[5rem]  h-[276px]">
            <div className="absolute flex items-center justify-center text-white w-[calc(100%-48px)] h-10 bg-[#ffffff60] backdrop-blur-lg top-6 right-4 rounded-3xl ">
              types of design tools
            </div>
            <div className="absolute flex items-center justify-center text-3xl text-white font-medium w-[100px] h-16 bg-[#ffffff60] backdrop-blur-lg bottom-4 left-4 rounded-3xl ">
              20+
            </div>
          </div>
          <div className="relative bg-cover bg-[url('/home/PowerOfWize.svg')] md:bg-black w-full bg-center max-w-[290px] rounded-tl-[5rem] rounded-br-[5rem]  h-[276px]">
            <div className="absolute flex items-center justify-center text-3xl text-white font-medium w-[100px] h-16 bg-[#ffffff60] backdrop-blur-lg top-4 right-4 rounded-3xl ">
              20+
            </div>
            <div className="absolute flex items-center justify-center text-white w-[calc(100%-48px)] h-10 bg-[#ffffff60] backdrop-blur-lg bottom-6 left-4 rounded-3xl ">
              types of design tools
            </div>
          </div>
          <div className="relative bg-cover bg-[url('/home/PowerOfWize.svg')] md:bg-black w-full bg-center max-w-[290px] rounded-bl-[5rem] rounded-tr-[5rem]  h-[276px]">
            <div className="absolute flex items-center justify-center text-3xl text-white font-medium w-[100px] h-16 bg-[#ffffff60] backdrop-blur-lg top-4 left-4 rounded-3xl ">
              20+
            </div>
            <div className="absolute flex items-center justify-center text-white w-[calc(100%-48px)] h-10 bg-[#ffffff60] backdrop-blur-lg bottom-6 right-4 rounded-3xl ">
              types of design tools
            </div>
          </div>
        </div>
        {/* <ImageGrid /> */}
      </div>
      <div className="flex items-center flex-col sm:flex-row justify-between rounded-2xl shadow-md bg-primary-foreground sm:my-[40px] m-2 md:mx-auto sm:m-4 sm:py-8 p-4 sm:px-12 min-h-[100px] max-w-[1300px]">
        <p className="sm:text-lg font-semibold mb-2 text-center text-[#1c1c1c]">
          So, what are you waiting for? <br className="hidden sm:block" />
          Start exploring career options now!
        </p>
        <button className="bg-primary transition-all border-2 border-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold sm:text-lg rounded-lg py-2 px-4 sm:px-8 shadow-md ">
          Let&apos;s get Started
        </button>
      </div>
    </>
  );
}
