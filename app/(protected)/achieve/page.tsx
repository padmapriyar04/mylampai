import Image from "next/image"

export default function Achieve() {
  return (
    <div className="bg-primary-foreground w-full gap-4 p-4 grid grid-cols-2 grid-rows-12 min-h-[calc(100vh-4rem)]">
      <div className="w-full bg-white rounded-sm row-span-8 h-full">
        <Image src={"/community/communityicon.svg"} width={100} height={100} alt="cv reviewer"/>
      </div>
      <div className="w-full bg-white rounded-sm row-span-8 h-full"></div>
      <div className="w-full bg-white rounded-sm row-span-4 col-span-2 h-full"></div>
    </div>
  );
}