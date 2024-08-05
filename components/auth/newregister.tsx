"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Input from "./Input";
import CountrySelector from "../misc/CountryFlag";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import Globe from "../../public/images/Globe.svg";
import wiZe from "../../public/header/wiZe.png";
import Arrow from "../../public/images/Arrow.png";
import Lock from "../../public/images/icons8-lock.svg";

import CarouselImage1 from "../../public/images/Globe.svg";
import CarouselImage2 from "../../public/images/Globe.svg";
import CarouselImage3 from "../../public/images/Globe.svg";
import CarouselImage4 from "../../public/images/Globe.svg";

const SignUp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [user, setUser] = useState({
    firstName: "",
    lastName: "", 
    email: "",
    phone: "",
    password: "",
    role: "user",
    secret: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    console.log(value);
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  const sendOTP = async () => {
    if (!validatePhone(user.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      if (res.ok) {
        setOtpSent(true);
        toast.success("OTP sent!");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An error occurred while sending OTP");
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter OTP.");
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, otp }),
      });

      if (res.ok) {
        toast.success("OTP verified!");
        setOtpVerified(true);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "OTP verification failed");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred while verifying OTP");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpVerified) {
      toast.error("Please verify OTP first.");
      return;
    }
    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions.");
      return;
    }
    if (!user.firstName || !user.lastName) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!validateEmail(user.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!validatePhone(user.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!user.password) {
      toast.error("Please enter a password.");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          password: user.password,
          role: activeTab === "admin" ? "admin" : "user",
          secret: user.secret, // Only send secret if role is admin
        }),
      });

      if (res.ok) {
        const userData = await res.json();
        localStorage.setItem("user", JSON.stringify(userData.user));
        toast.success("Registration successful!");
        router.push("/login");
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("An error occurred during registration");
    }
  };

  return (
    <div className="bg-primary-foreground flex flex-col items-center justify-center min-h-screen h-screen relative p-4 md:p-0">
      {/* <div className="w-11/12 max-w-7xl z-10">
        <div className="flex justify-start mb-4">
          <div className="space-x-4 font-semibold">
            <button
              className={`p-2 rounded-2xl ${
                activeTab === "student"
                  ? "bg-purple-500 text-gray-500 glass"
                  : "bg-gray-300 text-gray-700 opacity-75"
              }`}
              onClick={() => setActiveTab("student")}
            >
              Student
            </button>
            <button
              className={`p-2 rounded-2xl ${
                activeTab === "admin"
                  ? "bg-purple-500 text-gray-500 glass"
                  : "bg-gray-300 text-gray-700 opacity-75"
              }`}
              onClick={() => setActiveTab("admin")}
            >
              Admin
            </button>
          </div>
        </div>
      </div> */}

      <div className="bg-[#fcfcfc] rounded-sm md:rounded-tr-5xl md:rounded-bl-5xl p-3 gap-3 w-full max-w-5xl flex flex-col md:flex-row min-h-[600px] shadow-md">
        <div className="md:block w-full md:max-w-[350px] bg-purple-500 rounded-sm md:rounded-tr-5xl md:rounded-bl-5xl p-4 flex flex-col items-center justify-between mb-4 md:mb-0 relative">
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            autoPlay
            interval={5000}
            showArrows={false}
            className="w-full h-full flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-center mt-4">
                <Image src={Globe} alt="Globe" className="w-4/5" />
              </div>
            </div>
            {/* Add other carousel items here */}
            <div>
              <div className="flex justify-center items-center h-full">
                <Image
                  src={CarouselImage1}
                  alt="Carousel Image 1"
                  className="w-4/5"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-center items-center h-full">
                <Image
                  src={CarouselImage2}
                  alt="Carousel Image 2"
                  className="w-4/5"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-center items-center h-full">
                <Image
                  src={CarouselImage3}
                  alt="Carousel Image 3"
                  className="w-4/5"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-center items-center h-full">
                <Image
                  src={CarouselImage4}
                  alt="Carousel Image 4"
                  className="w-4/5"
                />
              </div>
            </div>
          </Carousel>
        </div>

        <div className="w-full p-4 md:p-6 flex flex-col justify-center">
          <div className="text-popover-foreground mb-4 flex flex-col">
            <div className="text-[#555] text-sm mb-1">Hey Champ!</div>
            <div className="font-semibold text-[#333] text-2xl ">
              Create your wiZe Account
              <div className="h-[1px] my-2 bg-gradient-to-r from-white to-gray-400 max-w-[300px] rounded-full "></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                name="firstName"
                placeholder="First Name"
                type="text"
                value={user.firstName}
                onChange={handleChange}
              />
              <Input
                name="lastName"
                placeholder="Last Name"
                type="text"
                value={user.lastName}
                onChange={handleChange}
              />
            </div>

            <Input
              name="email"
              placeholder="Email"
              type="email"
              value={user.email}
              onChange={handleChange}
            />

            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex items-center justify-evenly w-full max-w-[150px] border-2 rounded-md mb-4 md:mb-0">
                <CountrySelector />
              </div>

              <Input
                name="phone"
                placeholder="Phone Number"
                type="phone"
                value={user.phone}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col md:flex-row md:space-x-4 items-center">
              <Input
                name="password"
                placeholder="Password"
                type="password"
                value={user.password}
                onChange={handleChange}
              />
              <div className="relative w-full mt-4 md:mt-0">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 pl-3 pr-24 border-2 outline-none focus:border-primary-foreground rounded-md text-black placeholder:text-gray-400 font-semibold hover:border-primary-foreground transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={otpSent ? verifyOTP : sendOTP}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white py-1 px-3 rounded-md text-sm font-medium transition-all duration-200"
                >
                  {otpSent ? "Verify OTP" : "Send OTP"}
                </button>
              </div>
            </div>

            {activeTab === "admin" && (
              <input
                type="password"
                name="secret"
                placeholder="Secret Key"
                value={user.secret}
                onChange={handleChange}
                className="w-full p-2 border-2 bg-primary-foreground focus:outline-none rounded-xl text-black placeholder:text-gray-400 font-semibold focus:-translate-y-1 focus:border-purple-300 focus:shadow-lg hover:shadow-sm hover:border-purple-300 transition-all duration-300"
              />
            )}

            <div className="flex items-center space-x-2 mt-8">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="form-checkbox h-6 w-6 accent-primary transition duration-150 ease-in-out"
              />
              <span className="text-gray-500 text-xs font-medium">
                All your information is collected, stored, and processed as per
                our data processing guidelines. By signing up on wiZe, you agree
                to our{" "}
                <Link
                  href="/privacypolicy"
                  className="text-purple-500 hover:text-purple-700 transition-colors duration-300"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/termsandconditions"
                  className="text-purple-500 hover:text-purple-700 transition-colors duration-300"
                >
                  Terms of Use
                </Link>
                .
              </span>
            </div>

            <div className="flex justify-between items-center mt-10">
              <div className="text-gray-400">
                <span className="text-sm">Already have an account?</span>{" "}
                <Link href="/login" className="text-primary font-semibold">
                  Login
                </Link>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-primary text-white pl-4 pr-2 py-2 rounded-full font-semibold flex items-center space-x-2 hover:scale-105 duration-200"
                >
                  <span>Sign Up</span>
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

export default SignUp;
