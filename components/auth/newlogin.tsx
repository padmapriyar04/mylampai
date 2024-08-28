"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import Input from "./Input";
import CountrySelector from "../misc/CountryFlag";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { setCookie } from "@/utils/cookieUtils";
import { useUserStore } from "@/utils/userStore";
import Arrow from "../../public/images/Arrow.png";
import Lock from "../../public/images/icons8-lock.svg";
import GoogleImg from "../../public/images/Google_Icons-09-512.png";

const AuthForm: React.FC = () => {
  const { data: session } = useSession();
  const { userData, setUserData, clearUser } = useUserStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isOTPVerifing, setIsOTPVerifing] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "user"
  });
  
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isOtpLogin, setIsOtpLogin] = useState(false);

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value.trim(),
    }));
  };

  const handleCredentialsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
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
    
    if (!user.firstName || !user.lastName || !user.email || !user.phone || !user.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!validateEmail(user.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!validatePhone(user.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
      
    setIsOTPVerifing(true);
    
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
      toast.error("An error occurred while sending OTP");
    }
    setIsOTPVerifing(false);
  };

  const verifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter OTP.");
      return;
    }
    
    setIsOTPVerifing(true);
    
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
    setIsOTPVerifing(false);
  };

  const handleSubmitSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user.firstName || !user.lastName || !user.email || !user.phone || !user.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!validateEmail(user.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!validatePhone(user.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!otpVerified) {
      toast.error("Please verify OTP first.");
      return;
    }
    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions.");
      return;
    }
    
    
    setIsSigningUp(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          name: `${user.firstName} ${user.lastName}`,
          phone: user.phone,
          password: user.password,
          role: "user"
        }),
      });

      if (res.ok) {
        const userData = await res.json();
        setCookie("token", userData.token, 7); // Set cookie for 7 days
        setCookie("user", JSON.stringify(userData.user), 7); // Set cookie for 7 days
        toast.success("Registration successful!");
        setUserData(userData.user, userData.token);
        setIsSigningUp(false);
        router.push("/questions");
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Registration failed")
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("An error occurred during registration");
    }
    setIsSigningUp(false);
  };
  
  const handleSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
    console.log("LoginviaPassword");
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    if (!validateEmail(credentials.email)) {
      toast.error("Please enter a valid Gmail address.");
      return;
    }

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

        // Store user data and token in cookies
        setCookie("token", data.token, 7); // Set cookie for 7 days
        setCookie("user", JSON.stringify(data.user), 7); // Set cookie for 7 days

        toast.success("Login successful!");

        setUserData(data.user, data.token);

        router.push("/profile");
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
      const result = await signIn("google");
      if (result?.error) {
        console.error("Google sign-in error:", result.error);
        toast.error("Google sign-in failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      toast.error("An error occurred during Google sign-in");
    }
  };
  
  useEffect(() => {
    if (session?.user || userData) {
        router.push("/");
    } else {
      clearUser();
    }
  }, [session]);

  const sendOTPforlogin = async () => {
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: credentials.email }),
      });
  
      if (response.ok) {
        setOtpSent(true);
        // Display a success message using Sonner or any other method
      } else {
        // Handle errors, show an error message
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  
  const verifyOTPforlogin = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    try {
      const response = await fetch("/api/auth/loginWithOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          otp: otp,
        }),
      });
  
      const data = await response.json();
  
      
      if (response.ok) {
        // Handle successful OTP verification (e.g., log the user in, redirect, etc.)
        console.log("OTP verified successfully:", data);
        setCookie("token", data.token, 7); // Set cookie for 7 days
        setCookie("user", JSON.stringify(data.user), 7); // Set cookie for 7 days
        console.log(data.user);
        toast.success("Login successful!");

        setUserData(data.user, data.token);
        router.push("/profile");
      } else {
        // Handle error (e.g., show an error message to the user)
        console.error("Error verifying OTP:", data.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="bg-primary-foreground flex flex-col items-center justify-center md:h-screen relative p-4 md:p-0">
      <div className="bg-[#fcfcfc] rounded-sm md:rounded-tr-5xl md:rounded-bl-5xl p-3 gap-2 w-full max-w-5xl flex flex-col md:flex-row md:min-h-[50vh] 3xl:min-h-[750px] 3xl:max-w-[1300px] shadow-md items-center">
        <div className="md:block w-full md:max-w-[350px] bg-purple-500 rounded-lg md:rounded-tr-5xl md:rounded-bl-5xl p-4 flex flex-col items-center justify-between mb-4 md:mb-0 relative h-full">
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            autoPlay
            interval={5000}
            showArrows={false}
            showIndicators={false}
            className="w-full  md:h-full flex flex-col justify-between"
          >
            <div className="flex justify-center items-center h-full">
              <Image
                src={"/images/Globe.svg"}
                alt="Carousel Image 1"
                className="w-4/5"
                width={100}
                height={100}
              />
            </div>
            <div className="flex justify-center items-center h-full">
              <Image
                src={"/images/Globe.svg"}
                alt="Carousel Image 1"
                className="w-4/5"
                width={100}
                height={100}
              />
            </div>
          </Carousel>
        </div>

        <div className="w-full  md:h-full md:min-h-[80vh] p-4 md:p-6 gap-2 flex flex-col justify-center ">
          {isSignUp ? (
            <>
              <div className="text-popover-foreground  flex flex-col">
                <div className="text-[#555] text-sm mb-1">Hey Champ!</div>
                <div className="font-semibold text-[#333] text-2xl mb-4 ">
                  Create your wiZe Account
                  <div className="h-[1px] my-2 bg-gradient-to-r from-white to-gray-400 max-w-[300px] rounded-full mt-3 "></div>
                </div>
              </div>

              <form onSubmit={handleSubmitSignUp} className="space-y-8">
                <div className="flex flex-col md:flex-row gap-2 ">
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

                <div className="flex flex-col mt-4 md:flex-row md:space-x-2 ">
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

                <div className="flex flex-col md:flex-row md:space-x-2 items-center">
                  <Input
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={user.password}
                    onChange={handleChange}
                  />
                  <div className="relative w-full md:mt-0">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 border-2 bg-white outline-none rounded-md text-[#222] placeholder:text-gray-400 placeholder:font-semibold  focus:border-primary-foreground font-medium border-primary-foreground hover:border-primary-foreground transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={otpSent ? verifyOTP : sendOTP}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white py-1 px-3 rounded-md text-sm font-medium transition-all duration-200"
                    >
                      {otpSent ? (isOTPVerifing ? "Verifing" : "Verify OTP") : (isOTPVerifing ? "Sending" : "Send OTP")}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-6">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="form-checkbox h-12 w-12 accent-primary transition duration-150 ease-in-out mb-10 "
                  />
                  <span className="text-gray-800 text-l font-medium">
                    All your information is collected, stored, and processed as
                    per our data processing guidelines. By signing up on wiZe,
                    you agree to our{" "}
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

                <div className="flex justify-between items-center mt-10 ml-8">
                  <div className="text-gray-500 font-semibold">
                    <span className="text-sm">Already have an account? </span>{" "}
                    <button
                      onClick={() => setIsSignUp(false)}
                      className="text-primary font-semibold"
                    >
                      {isSigningUp ? "Signing In" : "Sign In"}
                    </button>
                  </div>
                  <div className="flex space-x-6 mr-8 mb-1">
                    <button
                      type="submit"
                      className="bg-primary text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 hover:scale-105 duration-200 text-2xl"
                    >
                      <span>Sign Up</span>
                      <Image
                        src={Arrow}
                        alt="Sign Up Icon"
                        className="w-6 h-6"
                      />
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="">
                <div className="text-gray-400 font-semibold">Hey Champ!</div>
                <div className="text-gray-600 text-2xl font-semibold mb-3">
                  Welcome Back to wiZe!
                </div>
                <div className="h-[1px] my-2 bg-gradient-to-r from-white to-gray-400 max-w-[300px] rounded-full  "></div>
              </div>

              <button
                type="button"
                className="flex items-center justify-center w-full bg-white text-gray-500 md:shadow p-3 border-1 rounded-l space-x-2 mb-8 mt-5 font-semibold transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 text-lg"
                onClick={handleGoogleSignIn}
              >
                <Image src={GoogleImg} alt="Google" className="w-6 h-6" />
                <span className="text-gray-600 font-bold">
                  Login with Google
                </span>
              </button>

              <div className="flex items-center justify-center mb-4">
                <div className="w-1/3 border-b border-gray-300 mr-4"></div>
                <span className="text-gray-400 font-bold text-center text-sm">
                  Or login with email
                </span>
                <div className="w-1/3 border-b border-gray-300 ml-4 "></div>
              </div>

              <form onSubmit={isOtpLogin ? verifyOTPforlogin: handleSubmitLogin} className="space-y-10 mt-4">
                <div className="flex flex-col gap-2">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={credentials.email}
                    onChange={handleCredentialsChange}
                    className="w-full px-2 py-3 border-2 bg-white outline-none rounded-md text-black placeholder:text-gray-400 placeholder:font-semibold placeholder:text-l focus:border-primary-foreground focus:font-semibold border-primary-foreground hover:border-primary-foreground transition-all duration-300"
                  />
                  <Link
                    href="#"
                    onClick={() => setIsOtpLogin(!isOtpLogin)}
                    className="text-blue-500 font-semibold text-le hover:text-blue-700 transition-colors duration-300"
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
                      className="w-full px-2 py-3 border-2 bg-white outline-none rounded-md text-black placeholder:text-gray-400 placeholder:font-semibold placeholder:text-l focus:border-primary-foreground focus:font-semibold border-primary-foreground hover:border-primary-foreground transition-all duration-300"
                    />
                    <div className="flex items-center mt-3 ml-[-10px]">
                      <Image
                        src={Lock}
                        alt="Image beside Forgot password"
                        className="ml-2 w-3 h-3"
                      />
                      <Link
                        href="/forgot-password"
                        className="text-blue-500 font-semibold text-left hover:text-blue-700 transition-colors duration-300 "
                      >
                        Didn&apos;t Receive OTP yet?
                      </Link>
                    </div>
                      <button
                        type="button"
                        onClick={sendOTPforlogin}
                        className="absolute font-semibold right-2 top-[30%] transform -translate-y-1/2 bg-purple-500 text-white p-2 rounded-sm text-xs transition-all duration-300 hover:shadow-lg hover:bg-purple-600"
                      >
                        {otpSent ? "Resend OTP" : "Send OTP"}
                      </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={credentials.password}
                      onChange={handleCredentialsChange}
                      className="w-full px-2 py-3 border-2 bg-white outline-none rounded-md text-black placeholder:text-gray-400 placeholder:font-semibold placeholder:text-l focus:border-primary-foreground focus:font-semibold border-primary-foreground hover:border-primary-foreground transition-all duration-300"
                    />
                    <div className="flex items-center mt-3 ml-[-10px]">
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

                <div className="flex justify-between items-center mt-16">
                  <div className="text-gray-500">
                    <span>Don&apos;t have an account?</span>{" "}
                    <button
                      onClick={() => setIsSignUp(true)}
                      className="text-purple-500 text-sm font-semibold hover:text-purple-700 transition-colors duration-300"
                    >
                      Register
                    </button>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-primary text-white pl-6 pr-6 py-3 rounded-full font-semibold flex items-center space-x-2 hover:scale-105 duration-200 text-2xl mr-11"
                    >
                      <span >Log In</span>
                      <Image
                        src={Arrow}
                        alt="Sign Up Icon"
                        className="w-6 h-6"
                      />
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;