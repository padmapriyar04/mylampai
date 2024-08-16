"use client";
import { useUserStore } from "@/utils/userStore";

const GetToken = () => {
  const { token } = useUserStore();
  
  return token;
};

export default GetToken;
