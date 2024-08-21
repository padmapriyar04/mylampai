import Link from "next/link";
import navData from "../../components/navbar/navLinks.json";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function NavItems(props: any) {
  const pathname = usePathname();

  return (
    <div
      className={`flex flex-row transition px-5 w-full gap-4 grayscale hover:grayscale-0 relative hover:text-primary duration-300 ${
        pathname == navData[props.index].Link ? "grayscale-0 text-primary" : ""
      } items-center`}
    >
      <div
        className={`h-4 left-0 bottom-1/2 -translate-y-1/2 absolute `}
      >
        <Image
          src="/sidebar/navbarslider.svg"
          alt="slider"
          height={10}
          width={10}
          className={`${
            pathname == navData[props.index].Link ? "block" : "hidden"
          } w-full`}
        />
      </div>
      <div className="w-6 flex items-center">
        <Image
          height={100}
          width={100}
          alt="icon"
          src={props.icon}
          className="w-full"
        />
      </div>
      <Link
        href={props.Link}
        className={`text-lg font-bold text-[#737373] hover:text-primary ${
          pathname == navData[props.index].Link
            ? "grayscale-0 text-primary"
            : ""
        }`}
      >
        {props.name}
      </Link>
    </div>
  );
}
