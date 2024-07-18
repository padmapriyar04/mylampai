"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CountrySelector from "./CountryFlag";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import Globe from "../../public/images/Globe.svg";
import wiZe from "../../public/header/wiZe.png";
import Arrow from "../../public/images/Arrow.png";
import Lock from "../../public/images/icons8-lock.svg";
// import BackgroundImage from "../../public/images/background.jpg";

// Import other carousel images here
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
      toast.error("Please enter a valid Gmail address.");
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
    <div className="bg-purple-200 flex flex-col items-center justify-center min-h-screen h-screen relative p-4 md:p-0">
      {/* Background Image */}
      {/*<Image*/}
      {/*  src={BackgroundImage}*/}
      {/*  alt="Background"*/}
      {/*  layout="fill"*/}
      {/*  objectFit="cover"*/}
      {/*  quality={100}*/}
      {/*/>*/}

      {/* Logo at the Top Left Corner */}
      <div className="hidden md:block absolute top-8 left-8 z-10">
        <Image src={wiZe} alt="wiZe" className="" />
      </div>

      <div className="w-11/12 max-w-7xl z-10">
        {/* Tabs moved above the main container */}
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
      </div>

      <div className="glass bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl md:rounded-tr-6xl md:rounded-tl-2xl md:rounded-bl-6xl md:rounded-br-2xl p-4 shadow-xl hover:shadow-2xl transition-shadow duration-300 w-11/12 max-w-7xl flex flex-col md:flex-row h-auto md:h-3/4 z-20">
        {/* Left Side with Carousel */}
        <div className="hidden md:block w-full md:w-1/3 bg-purple-500 rounded-2xl md:rounded-tr-6xl md:rounded-tl-2xl md:rounded-bl-6xl md:rounded-br-2xl p-4 flex flex-col items-center justify-between mb-4 md:mb-0 relative">
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

        <div className="w-full md:w-2/3 p-4 md:p-12 flex flex-col justify-center">
          <div className="text-gray-400 font-semibold">Hey Champ!</div>
          <div className="text-gray-700 text-4xl font-semibold mb-2">
            Create your wiZe Account
          </div>
          <hr className="border-t border-gray-300 mb-4 md:mb-8 w-3/4" />

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col md:flex-row md:space-x-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={user.firstName}
                onChange={handleChange}
                className="w-full md:w-1/2 p-2 border-2  bg-white border-purple-100 focus:outline-none rounded-xl text-black placeholder:text-gray-400 font-semibold focus:-translate-y-1 focus:border-purple-300 focus:shadow-lg hover:shadow-sm hover:border-purple-300 transition-all duration-300"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={user.lastName}
                onChange={handleChange}
                className="w-full md:w-1/2 p-2 border-2 bg-white border-purple-100 focus:outline-none rounded-xl text-black placeholder:text-gray-400 font-semibold focus:-translate-y-1 focus:border-purple-300 focus:shadow-lg hover:shadow-sm hover:border-purple-300 transition-all duration-300"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-2 border-2 bg-white border-purple-100 focus:outline-none rounded-xl text-black placeholder:text-gray-400 font-semibold focus:-translate-y-1 focus:border-purple-300 focus:shadow-lg hover:shadow-sm hover:border-purple-300 transition-all duration-300"
            />

            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex items-center w-full md:w-1/4 p-2 border-2 border-purple-100 rounded-xl mb-4 md:mb-0 bg-white">
                <CountrySelector />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={user.phone}
                onChange={handleChange}
                className="w-full md:w-3/4 p-2 border-2 border-purple-100 focus:outline-none rounded-xl text-black placeholder:text-gray-400 font-semibold focus:-translate-y-1 focus:border-purple-300 focus:shadow-lg hover:shadow-sm hover:border-purple-300 transition-all duration-300"
              />
            </div>

            <div className="flex flex-col md:flex-row md:space-x-4 items-center">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={user.password}
                onChange={handleChange}
                className="w-full md:w-1/2 p-2 border-2 border-purple-100 focus:outline-none rounded-xl text-black placeholder:text-gray-400 font-semibold focus:-translate-y-1 focus:border-purple-300 focus:shadow-lg hover:shadow-sm hover:border-purple-300 transition-all duration-300"
              />
              <div className="relative w-full md:w-1/2 mt-4 md:mt-0">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 pl-3 pr-24 border-2 border-purple-100 focus:outline-none rounded-xl text-black placeholder:text-gray-400 font-semibold focus:-translate-y-1 focus:border-purple-300 focus:shadow-lg hover:shadow-sm hover:border-purple-300 transition-all duration-300"
                />
                {otpSent ? (
                  <button
                    type="button"
                    onClick={verifyOTP}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white p-1 rounded-xl text-xs transition-all duration-300 hover:shadow-lg hover:bg-green-600"
                  >
                    Verify OTP
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={sendOTP}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-500 text-white p-1 rounded-xl text-xs transition-all duration-300 hover:shadow-lg hover:bg-purple-600"
                  >
                    Send OTP
                  </button>
                )}
              </div>
            </div>

            {activeTab === "admin" && (
              <input
                type="password"
                name="secret"
                placeholder="Secret Key"
                value={user.secret}
                onChange={handleChange}
                className="w-full p-2 border-2 border-purple-100 focus:outline-none rounded-xl text-black placeholder:text-gray-400 font-semibold focus:-translate-y-1 focus:border-purple-300 focus:shadow-lg hover:shadow-sm hover:border-purple-300 transition-all duration-300"
              />
            )}

            <div className="flex items-center space-x-2 mt-4">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="form-checkbox h-4 w-4 text-purple-600 transition duration-150 ease-in-out"
              />
              <span className="text-gray-500 text-xs font-semibold">
                All your information is collected, stored, and processed as per
                our data processing guidelines. By signing up on wiZe, you agree
                to our{" "}
                <Link
                  href="/privacy-policy"
                  className="text-purple-500 hover:text-purple-700 transition-colors duration-300"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/terms-of-use"
                  className="text-purple-500 hover:text-purple-700 transition-colors duration-300"
                >
                  Terms of Use
                </Link>
                .
              </span>
            </div>

            <div className="flex justify-between items-center mt-10">
              <div className="text-gray-500">
                <span>Already have an account?</span>{" "}
                <Link
                  href="/login"
                  className="text-purple-500 text-sm font-semibold hover:text-purple-700 transition-colors duration-300"
                >
                  Login
                </Link>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-purple-500 text-white px-4 py-2 rounded-6xl flex items-center space-x-2 md:shadow transition-all duration-300 hover:shadow-lg hover:bg-purple-600 hover:transform hover:scale-105"
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
