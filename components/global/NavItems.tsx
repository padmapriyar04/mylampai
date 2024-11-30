import Link from "next/link";
import Image from "next/image";

type NavItemsProps = {
  name: string;
  icon: string;
  link: string;
  pathname: string;
};

export function NavItem({ name, icon, link, pathname }: NavItemsProps) {
  return (
    <Link
      href={link}
      className={`flex flex-row items-center px-5 py-2 gap-4 w-full hover:bg-[#8c52ff10] hover:grayscale-0 relative group transition duration-200 ${
        pathname === link ? "grayscale-0 text-primary" : "grayscale"
      }`}
    >
      <div className="h-12 left-[-2px] bottom-1/2 translate-y-1/2 absolute">
        <Image
          src="/sidebar/navbarslider.svg"
          alt="slider"
          height={10}
          width={10}
          className={`${pathname === link ? "block" : "hidden"} h-full`}
        />
      </div>
      <div className="w-6 flex items-center">
        <Image
          height={100}
          width={100}
          alt="icon"
          src={icon}
          className="w-full"
        />
      </div>
      <h2
        className={`text-lg font-bold group-hover:text-primary ${
          pathname === link ? "text-primary" : "text-slate-500"
        }`}
      >
        {name}
      </h2>
    </Link>
  );
}