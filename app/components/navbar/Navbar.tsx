"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/" && (
        <nav className="p-3 flex z-50 bg-white sticky top-0 justify-between items-center shadow">
          <div>
            <Link href="/" className="">
              <Image
                src="/logo.png"
                alt="Logo"
                className="mr-2"
                width={100}
                height={40}
                priority
              />
            </Link>
          </div>

          <div className="flex ">
            <Link
              href="/"
              className="flex border border-primary p-2 rounded-full mr-2"
            >
              Account
              <Image
                src="/group.svg"
                alt="Verceldcjncn Logo"
                className="ml-2"
                width={25}
                height={20}
                priority
              />{" "}
            </Link>

            <Link
              href="/"
              className="flex border border-primary p-2 rounded-full"
            >
              Menu
              <Image
                src="/menu bar.png"
                alt="Verceldcjncn Logo"
                className="ml-2"
                width={20}
                height={20}
                priority
              />
            </Link>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
