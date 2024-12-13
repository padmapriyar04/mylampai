"use client";
import Image from "next/image";
import Typing from "./Typing";
import { useEffect } from "react";
import InfiniteLogoSlide from "./InfiniteLogoSlide";
import { MoveRight } from "lucide-react";
import Globe from "@/components/ui/globe";
import { useSession } from "next-auth/react";
import { nextAuthLogin } from "@/actions/authActions";
import { signOut } from "next-auth/react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { setCookie } from "@/utils/cookieUtils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRoleStore } from "@/utils/loginStore";
import { useUserStore } from "@/utils/userStore";
import LoginComponent from "../global/Login";

export default function HeroSection() {
  const router = useRouter();
  const { data } = useSession();

  const { role, setRole } = useRoleStore();

  const { setUserData } = useUserStore();
  const handleLogin = async (email: string, role: "user" | "recruiter") => {
    const res = await nextAuthLogin({ email, role });

    if (res.status === "success" && res.user && res.accessToken) {
      setUserData(res.user, res.accessToken);
      setCookie("accessToken", res.accessToken);
    } else {
      toast.error(res.message);
    }

    await signOut();
  };

  useEffect(() => {
    if (role === null) return;

    if (!data || !data.user) {
      return;
    }

    const email = data.user.email as string;

    handleLogin(email, role);
  }, [data, router, role, setUserData]);

  return (
    <>
      <div className="flex flex-col select-none bg-[url('/home/herosection-background.svg')] max-w-screen overflow-hidden ">
        <div className="flex relative justify-evenly items-center min-h-[555px] md:min-h-screen px-8 gap-8 w-full m-auto">
          {/* <div className="absolute bg-[url('/home/herosection/herosection-earth.svg')] scale-x-125 scale-y-[0.8] bg-no-repeat bg-center bg-cover h-[336px] -bottom-[5%] left-[10%] w-[600px]"></div> */}

          <div className="flex flex-col justify-center min-h-[600px] w-full z-10">
            <div className="text-4xl relative md:text-5xl xl:text-6xl font-bold lg:ml-14 mb-6">
              <div className="flex items-center justify-evenly text-sm font-light absolute top-0 -translate-y-[140%] rounded-lg px-4 py-1 gap-2 bg-[#fafafa] border max-w-[300px]">
                Backed by{" "}
                <Image
                  src={"/home/herosection/nsrcel_logo.svg"}
                  width={80}
                  height={40}
                  className="w-auto h-[20px]"
                  alt="IIM Banglore logo"
                />{" "}
                IIM Banglore
              </div>
              <Typing /> <br />{" "}
              <span className="font-semibold">Your Dream Career</span>
            </div>
            <div className=" lg:text-2xl font-medium lg:ml-16 mb-9 max-w-[640px]">
              Get AI - Powered personalised career guidance based on Your
              interests, aptitude, and goals
            </div>
            <div className="flex gap-4 relative">
              <div className="absolute bottom-0 z-0 translate-y-full left-1/2 -translate-x-1/2 scale-125 w-[600px] h-[600px] overflow-hidden">
                <Globe />
              </div>
              <Dialog>
                <DialogTrigger className="z-10">
                  <div
                    onClick={() => setRole("user")}
                    className="flex gap-4 items-center w-[195px] h-[45px] justify-center bg-primary rounded-lg duration-150 hover:scale-[1.02] text-white text-sm font-semibold py-2 md:py-3 pl-4 md:pl-8 px-2 md:px-3 md:max-w-[300px]  lg:ml-14"
                  >
                    Get Started
                    <MoveRight size={24} />
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-transparent border-none max-w-3xl">
                  <LoginComponent />
                </DialogContent>
              </Dialog>

              {/* <Link href={"/login?role=recruiter"}>
                Recruiter
                <MoveRight size={24} />
              </Link> */}
              <Dialog>
                <DialogTrigger className="z-10">
                  <div
                    onClick={() => setRole("recruiter")}
                    className="flex gap-4 z-10 items-center w-[195px] h-[45px] justify-center  rounded-lg duration-150 hover:scale-[1.02] border-2 text-sm font-semibold py-2 md:py-3 pl-4 md:pl-8 px-2 md:px-3 md:max-w-[300px] lg:ml-14"
                  >
                    {" "}
                    Recruiter
                    <MoveRight size={24} />
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-transparent border-none max-w-3xl">
                  <LoginComponent />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="lg:block bg-[#f1eaff] hidden z-10 p-6 w-full max-w-[600px] rounded-2xl">
            <Image
              src={"/home/HeroSection.svg"}
              alt="HeroSection"
              width={100}
              height={100}
              className="w-full bg-white min-h-[552px] rounded-2xl py-2 px-5"
            ></Image>
          </div>
        </div>
        <InfiniteLogoSlide />
      </div>
    </>
  );
}
