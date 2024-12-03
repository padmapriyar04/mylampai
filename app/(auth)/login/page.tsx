"use client";
import NewLogin from "@/components/auth/newlogin";
// import Link from "next/link";
// import Image from "next/image";
// import { Input } from "@/components/ui/input";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { Linkedin, CircleArrowOutUpRight } from "lucide-react";
// import { z } from "zod";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from "@/components/ui/input-otp";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { useSession } from "next-auth/react";
// import { useEffect } from "react";

// const FormSchema = z.object({
//   email: z.string().email({
//     message: "Please enter a valid email address.",
//   }),
//   pin: z.string().min(6, {
//     message: "Your one-time password must be 6 characters.",
//   }),
// });

export default function SignupPage() {
  // const router = useRouter();
  // const { data } = useSession();

  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  //   defaultValues: {
  //     email: "",
  //     pin: "",
  //   },
  // });

  // function onSubmit(data: z.infer<typeof FormSchema>) {}

  // const sendOTPforLogin = async () => {};

  // const handleNextAuthLogin = async (method: string) => {
  //   try {
  //     await signIn(method);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   if (data) {
  //     router.push("/dashboard");
  //   }
  // }, [data, router]);

  return (
    <NewLogin />
    // <div className="bg-primary-foreground flex flex-col items-center justify-center md:h-screen relative p-4 md:p-0 h-screen">
    //   <div className="absolute top-2 left-0 max-w-[220px]">
    //     <Link href="/">
    //       <Image
    //         src={"/home/logo.svg"}
    //         width={180}
    //         height={100}
    //         alt="logo"
    //         className="w-full h-auto drop-shadow-md"
    //       />
    //     </Link>
    //   </div>
    //   <div className="bg-white rounded-lg md:rounded-tr-5xl md:rounded-bl-5xl p-3 gap-2 w-full max-w-5xl flex flex-col md:flex-row md:min-h-[50vh] 3xl:min-h-[750px] 3xl:max-w-[1300px] shadow-md items-center xl:h-[46vw] lg:h-[50vw] 2xl:h-[35vw] lg:min-h-[612px]">
    //     <div className="justify-center items-center hidden md:flex w-full md:max-w-[350px] bg-primary rounded-lg md:rounded-tr-5xl md:rounded-bl-5xl p-4 mb-4 md:mb-0 relative h-full">
    //       <div className="">
    //         <Image
    //           src={"/images/Globe.svg"}
    //           alt="Carousel Image 1"
    //           className="w-full"
    //           width={100}
    //           height={100}
    //         />
    //       </div>
    //     </div>

    //     <div className="w-full  md:h-full md:min-h-[80vh] p-4 md:p-6 flex flex-col justify-center">
    //       <>
    //         <Form {...form}>
    //           <form
    //             onSubmit={form.handleSubmit(onSubmit)}
    //             className="w-2/3 space-y-6"
    //           >
    //             <FormField
    //               control={form.control}
    //               name="email"
    //               render={({ field }) => (
    //                 <FormItem>
    //                   <FormControl>
    //                     <Input placeholder="your-email@gmail.com" {...field} />
    //                   </FormControl>
    //                   <FormMessage />
    //                 </FormItem>
    //               )}
    //             />
    //             <FormField
    //               control={form.control}
    //               name="pin"
    //               render={({ field }) => (
    //                 <FormItem>
    //                   <FormControl>
    //                     <InputOTP maxLength={6} {...field}>
    //                       <InputOTPGroup>
    //                         <InputOTPSlot index={0} />
    //                         <InputOTPSlot index={1} />
    //                         <InputOTPSlot index={2} />
    //                         <InputOTPSlot index={3} />
    //                         <InputOTPSlot index={4} />
    //                         <InputOTPSlot index={5} />
    //                       </InputOTPGroup>
    //                     </InputOTP>
    //                   </FormControl>
    //                   <FormMessage />
    //                 </FormItem>
    //               )}
    //             />

    //             <button
    //               type="button"
    //               onClick={sendOTPforLogin}
    //               className="font-semibold bg-primary text-white p-2 rounded-sm text-xs transition-all duration-300 hover:shadow-lg"
    //             >
    //               Next
    //             </button>

    //             <div className="flex justify-between items-center mt-12 mb-4">
    //               <Button
    //                 type="submit"
    //                 className="bg-primary text-white px-6 py-3 rounded-full font-bold flex hover:bg-primary items-center gap-2 hover:scale-105 duration-200 md:text-xl "
    //               >
    //                 Submit
    //                 <CircleArrowOutUpRight />
    //               </Button>
    //             </div>
    //           </form>
    //         </Form>

    //         <button
    //           type="button"
    //           className="flex items-center justify-center w-full bg-white text-gray-500 md:shadow p-3 border-1 rounded-l space-x-2  font-semibold transition-all duration-300 hover:shadow-sm hover:transform hover:scale-[1.02] text-lg"
    //           onClick={() => handleNextAuthLogin("google")}
    //         >
    //           <Image
    //             src={"/images/Google_Icons-09-512.png"}
    //             alt="google login"
    //             width={100}
    //             height={100}
    //             className="w-6 h-6"
    //           />
    //           <span className="text-slate-600 font-medium">
    //             Login using Google
    //           </span>
    //         </button>

    //         <button
    //           type="button"
    //           className="flex items-center justify-center w-full bg-white text-slate-500 md:shadow p-3 border-1 rounded-l space-x-2  font-semibold transition-all duration-300 hover:shadow-sm hover:transform hover:scale-[1.02] text-lg"
    //           onClick={() => handleNextAuthLogin("linkedin")}
    //         >
    //           <Linkedin />
    //           <span className="text-slate-600 font-medium">
    //             Login using LinkedIn
    //           </span>
    //         </button>
    //       </>
    //     </div>
    //   </div>
    // </div>
  );
}
