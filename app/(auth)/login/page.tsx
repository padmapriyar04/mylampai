"use client";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/utils/userStore";
import { useEffect, useState } from "react";
import { setCookie } from "@/utils/cookieUtils";
import {
  handleSendOTP,
  verifyOTPandLogin,
  nextAuthLogin,
} from "@/actions/authActions";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  pin: z
    .string()
    .min(6, {
      message: "Your one-time password must be 6 characters.",
    })
    .max(6, {
      message: "Your one-time password must be 6 characters.",
    })
    .refine((value) => /^\d+$/.test(value), {
      message: "Your one-time password must contain only numbers.",
    }),
});

export default function LoginPage() {
  const router = useRouter();
  const { data } = useSession();
  const { setUserData } = useUserStore();
  const [showOTP, setshowOTP] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      pin: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await verifyOTPandLogin({
        email: data.email,
        otp: data.pin,
      });

      if (res.otpVerified) {
        toast.success("Login successful");

        if (res.user && res.accessToken) {
          setUserData(res.user, res.accessToken);
          setCookie("accessToken", res.accessToken);
          router.push("/home");
        } else {
          toast.error("Failed to login");
        }
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to login");
    }
  }

  const sendOTPforLogin = async () => {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const role =
        queryParams.get("role") === "recruiter" ? "recruiter" : "user";

      const res = await handleSendOTP(form.getValues("email"), role);
      if (res.otpSent) {
        setshowOTP(true);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send OTP");
    }
  };

  const handleNextAuthLogin = async (method: string) => {
    try {
      await signIn(method);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!data || !data.user) {
      return;
    }

    const email = data.user.email as string;

    const queryParams = new URLSearchParams(window.location.search);
    const role = queryParams.get("role") === "recruiter" ? "recruiter" : "user";

    const handleLogin = async () => {
      const res = await nextAuthLogin({ email, role });

      if (res.status === "success") {
        toast.success(res.message);
        if (res.user && res.accessToken) {
          setUserData(res.user, res.accessToken);
          setCookie("accessToken", res.accessToken);
        }
      } else {
        toast.error(res.message);
      }

      await signOut();
    };

    handleLogin();
  }, [data, router, setUserData]);

  return (
    <div className="bg-primary-foreground flex flex-col items-center justify-center md:h-screen relative p-4 md:p-0 h-screen">
      <Link href="/" className="absolute top-2 left-4 max-w-[110px]">
        <Image
          src={"/home/navbar/wizelogo.svg"}
          width={180}
          height={100}
          alt="logo"
          className="w-full h-auto drop-shadow-md"
        />
      </Link>
      <div className="bg-white rounded-lg md:rounded-tr-[5.5rem] md:rounded-bl-[5.5rem] p-3 gap-2 w-full max-w-5xl flex flex-col md:flex-row md:min-h-[50vh] 3xl:min-h-[750px] 3xl:max-w-[1300px] shadow-md items-center xl:h-[46vw] lg:h-[50vw] 2xl:h-[35vw] lg:min-h-[612px]">
        <div className="justify-evenly flex-col items-center hidden md:flex w-full md:max-w-[350px] bg-primary-foreground rounded-lg md:rounded-tr-5xl md:rounded-bl-5xl p-4 mb-4 md:mb-0 relative h-full">
          <Image
            src={"/images/Globe.svg"}
            alt="globe"
            className="w-full filter"
            width={100}
            height={100}
          />
          <div className="flex flex-col gap-2 justify-center items-center p-2">
            <h2 className="font-bold text-gray-500 text-center">
              Take the WiZe AI Mock Interview
            </h2>
            <div>
              <p className="text-gray-400 font-semibold text-xs">
                You&apos;ll be taking a 20-minute interview to have your skills
                evaluated. Just relax and take the interview.
              </p>
              <p className="text-gray-600 font-semibold text-xs">
                All the Best!
              </p>
            </div>
            <div className="flex gap-1 items-center mt-4">
              <p className="text-gray-400 text-xs font-semibold">
                Want to hire talent?
              </p>
              <Link
                href={"/login?role=recruiter"}
                className="text-primary font-bold text-sm"
              >
                Continue Here
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full  md:h-full md:min-h-[80vh] p-4 md:p-6 flex flex-col justify-center my-auto">
          <div className="flex flex-col h-full sm:p-1 gap-4">
            <p className="bg-primary mx-auto w-6 h-6 sm:w-8 sm:h-8 rounded"></p>
            <div className="flex justify-center items-center">
              <h1 className="font-bold sm:text-xl mr-2">SignUp or Login to</h1>
              <h1 className="font-bold text-primary sm:text-xl"> wiZ</h1>
              <h1 className="font-bold sm:text-xl">e in seconds</h1>
            </div>
            <div className="flex flex-col justify-center items-cente p-0 sm:p-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className=" p-0 sm:p-4 w-full"
                >
                  {!showOTP ? (
                    <div className="flex flex-col gap-4 items-center justify-center p-2 ">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="font-bold">
                              Email Id
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Email"
                                {...field}
                                className="flex items-center text-xs md:text-sm justify-center bg-white font-semibold text-slate-500 shadow p-3 border-slate-300 rounded-md space-x-2  transition-all duration-300 hover:shadow-sm hover:transform hover:scale-[1.02]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <button
                        type="button"
                        onClick={sendOTPforLogin}
                        className="bg-primary text-slate-50 w-full text-sm sm:font-bold px-2 sm:px-4 py-2 rounded-md shadow hover:bg-primary-dark transition-all duration-300 hover:shadow-lg hover:scale-105"
                      >
                        Continue
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 items-center justify-center p-0 sm:p-2 ">
                      <FormField
                        control={form.control}
                        name="pin"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="font-bold">OTP</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="OTP"
                                {...field}
                                className="flex items-center text-xs md:text-sm justify-center bg-white font-semibold text-slate-500 shadow p-3 border-slate-300 rounded-md space-x-2  transition-all duration-300 hover:shadow-sm hover:transform hover:scale-[1.02]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="bg-primary text-slate-50 w-full text-sm sm:font-bold px-2 sm:px-4 py-2 rounded-md shadow hover:bg-primary-dark transition-all duration-300 hover:shadow-lg hover:scale-105"
                      >
                        Let&apos;s Go
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
              <div className="flex items-center justify-center gap-2 w-full p-0 sm:p-6">
                <div className="flex-grow border-t border-gray-400"></div>
                <p className="text-gray-400 sm:text-sm font-bold">
                  Or Continue with
                </p>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>

              <div className="flex gap-2 sm:gap-8 justify-center items-center w-full p-0 sm:p-4">
                <button
                  type="button"
                  className="flex items-center justify-center w-full bg-white text-gray-500 shadow p-3 border-gray-600 rounded-md space-x-2  font-semibold transition-all duration-300 hover:shadow-sm hover:transform hover:scale-[1.02]"
                  onClick={() => handleNextAuthLogin("google")}
                >
                  <Image
                    src={"/images/Google_Icons-09-512.png"}
                    alt="google login"
                    width={100}
                    height={100}
                    className="w-6 h-6"
                  />
                  <span className="text-slate-500 font-bold sm:text-sm">
                    Google
                  </span>
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center w-full bg-white text-slate-500 shadow p-3 border-gray-600 rounded-md space-x-2 transition-all duration-300 hover:shadow-sm hover:transform hover:scale-[1.02]"
                  onClick={() => handleNextAuthLogin("linkedin")}
                >
                  {/* <Linkedin /> */}
                  <Image
                    src={"/images/linkedin-icon.png"}
                    alt="linkedin login"
                    width={100}
                    height={100}
                    className="w-6 h-6"
                  />
                  <span className="text-slate-500 font-bold sm:text-sm">
                    LinkedIn
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
