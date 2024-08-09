"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/utils/userStore";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

// import { Carousel } from "react-responsive-carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import "react-responsive-carousel/lib/styles/carousel.min.css";

import Globe from "../../public/images/Globe.svg";
// import wiZe from "../../public/header/wiZe.png";
import Arrow from "../../public/images/Arrow.png";
import GoogleImg from "../../public/images/Google_Icons-09-512.png";
import Lock from "../../public/images/icons8-lock.svg";
// import BackgroundImage from "../../public/images/background.jpg";

// Import other carousel images here
import CarouselImage1 from "../../public/images/Globe.svg";
import CarouselImage2 from "../../public/images/Globe.svg";
import CarouselImage3 from "../../public/images/Globe.svg";
import CarouselImage4 from "../../public/images/Globe.svg";

const LogIn: React.FC = () => {
  const setUser = useUserStore((state) => state.setUser);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();

        // Fetch user details immediately after successful login
        const userResponse = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          // Store user data and token in Zustand store
          setUser(userData, data.token);
          localStorage.setItem("token", data.token);

          toast.success("Login successful!");

          // Redirect based on role
          if (userData.role === "admin") {
            router.push("/adminDashboard");
          } else {
            router.push("/questions");
          }
        } else {
          throw new Error("Failed to fetch user data");
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", { callbackUrl: "/" });
      if (result?.error) {
        console.error("Google sign-in error:", result.error);
        toast.error("Google sign-in failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      toast.error("An error occurred during Google sign-in");
    }
  };

  const sendOTP = async () => {
    // Implement OTP sending logic here
    setOtpSent(true);
    toast.success("OTP sent!");
  };

  const verifyOTP = async () => {
    // Implement OTP verification logic here
    toast.success("OTP verified!");
  };

  return (
    <div className="bg-purple-200 flex flex-col items-center justify-center min-h-screen h-screen relative p-4 md:p-0">
      <div className="hidden md:block absolute top-8 left-8 z-10">
        {/* <Image src={wiZe} alt="wiZe" className="" /> */}
      </div>

      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl md:rounded-tr-6xl md:rounded-tl-2xl md:rounded-bl-6xl md:rounded-br-2xl p-4 shadow-xl hover:shadow-2xl transition-shadow duration-300 w-11/12 max-w-7xl flex flex-col md:flex-row h-auto md:h-3/4">
        {/* <div className="glass bg-white rounded-2xl md:rounded-tr-6xl md:rounded-tl-2xl md:rounded-bl-6xl md:rounded-br-2xl p-4 shadow-xl hover:shadow-2xl transition-shadow duration-300 w-11/12 max-w-7xl flex flex-col md:flex-row h-auto md:h-3/4 relative z-20"> */}
        {/* Left Side with Carousel */}
        <div className="md:block w-full md:w-1/3 bg-purple-500 rounded-2xl md:rounded-tr-6xl md:rounded-tl-2xl md:rounded-bl-6xl md:rounded-br-2xl p-4 flex flex-col items-center justify-start mb-4 md:mb-0">
          <Carousel
            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
            className="w-full h-full"
          >
            <CarouselContent>
              {[
                Globe,
                CarouselImage1,
                CarouselImage2,
                CarouselImage3,
                CarouselImage4,
              ].map((img, index) => (
                <CarouselItem key={index}>
                  <div className="flex justify-center items-center h-full">
                    <Image
                      src={img}
                      alt={`Carousel Image ${index}`}
                      className="w-4/5"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden" />
            <CarouselNext className="hidden" />
          </Carousel>
        </div>

        {/* Right Side with Form */}
        <div className="w-full md:w-2/3 p-4 md:p-12 flex flex-col justify-center">
          <div className="">
            <div className="text-gray-400 font-semibold">Hey Champ!</div>
            <div className="text-gray-700 text-4xl font-semibold mb-2">
              Welcome Back to wiZe!
            </div>
            <hr className="border-t border-gray-300 mb-4" />
          </div>

          <button
            type="button"
            className="flex items-center justify-center w-full bg-white text-gray-400 md:shadow p-2 border-2 rounded-xl space-x-2 mb-4 font-semibold transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105"
            onClick={handleGoogleSignIn}
          >
            <Image src={GoogleImg} alt="Google" className="w-6 h-6" />
            <span className="text-gray-500 font-semibold">
              Login with Google
            </span>
          </button>

          <div className="flex items-center justify-center mb-4">
            <div className="w-1/3 border-b border-gray-300 mr-4"></div>
            <span className="text-gray-500 text-center text-sm">
              Or login with email
            </span>
            <div className="w-1/3 border-b border-gray-300 ml-4"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={credentials.email}
                onChange={handleChange}
                className="w-full p-2 border-2 border-purple-100 focus:outline-none rounded-xl text-black placeholder:text-gray-400 font-semibold focus:-translate-y-1 focus:border-purple-300 focus:shadow-lg hover:shadow-sm hover:border-purple-300 transition-all duration-300
                "
              />
              <Link
                href="#"
                onClick={() => setIsOtpLogin(!isOtpLogin)}
                className="text-blue-500 font-semibold text-left ml-5 hover:text-blue-700 transition-colors duration-300"
              >
                {isOtpLogin ? "Login with Password" : "Login via OTP"}
              </Link>
            </div>

            {isOtpLogin ? (
              <div className="relative w-full mt-4">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 pl-3 pr-24 border-2 border-purple-100 focus:outline-none rounded-xl text-black placeholder:text-gray-400 font-semibold focus:-translate-y-1 focus:border-purple-300 focus:shadow-lg hover:shadow-sm hover:border-purple-300 transition-all duration-300
                  "
                />
                <div className="flex items-center">
                  <Image
                    src={Lock}
                    alt="Image beside Forgot password"
                    className="ml-2 w-3 h-3"
                  />
                  <Link
                    href="/forgot-password"
                    className="text-blue-500 font-semibold text-left ml-1 hover:text-blue-700 transition-colors duration-300"
                  >
                    Didn&apos;t Receive OTP yet?
                  </Link>
                </div>
                {otpSent ? (
                  <button
                    type="button"
                    onClick={verifyOTP}
                    className="absolute right-2 top-1/3 transform -translate-y-1/2 bg-green-500 text-white p-1 rounded-xl text-xs transition-all duration-300 hover:shadow-lg hover:bg-green-600"
                  >
                    Verify OTP
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={sendOTP}
                    className="absolute right-2 top-1/3 transform -translate-y-1/2 bg-purple-500 text-white p-1 rounded-xl text-xs transition-all duration-300 hover:shadow-lg hover:bg-purple-600"
                  >
                    Send OTP
                  </button>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-purple-100 focus:outline-none rounded-xl text-black placeholder:text-gray-400 font-semibold focus:-translate-y-1 focus:border-purple-300 focus:shadow-lg hover:shadow-sm hover:border-purple-300 transition-all duration-300
                  "
                />
                <div className="flex items-center">
                  <Image
                    src={Lock}
                    alt="Image beside Forgot password"
                    className="ml-2 w-3 h-3"
                  />
                  <Link
                    href="/forgot-password"
                    className="text-blue-500 font-semibold text-left ml-1 hover:text-blue-700 transition-colors duration-300"
                  >
                    Forgot Password
                  </Link>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-10">
              <div className="text-gray-500">
                <span>Don&apos;t have an account?</span>{" "}
                <Link
                  href="/register"
                  className="text-purple-500 text-sm font-semibold hover:text-purple-700 transition-colors duration-300"
                >
                  Register
                </Link>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-purple-500 text-white px-4 py-2 rounded-6xl flex items-center space-x-2 md:shadow transition-all duration-300 hover:shadow-lg hover:bg-purple-600 hover:transform hover:scale-105"
                >
                  <span>Log In</span>
                  <Image src={Arrow} alt="Sign Up Icon" className="w-6 h-6" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
