"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Carousel from "../../../components/community/NewCarousel";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import socket from "@/utils/socket";
import { useUserStore } from "@/utils/userStore";
import { IoSend } from "react-icons/io5";

// Define the Community and Message types
interface Community {
  id: string;
  createdAt: string;
  lastmessageAt: string;
  name: string;
  description: string;
  isCommunity: boolean;
  messagesIds: any;
  userIds: string[];
  comm_type: "Exclusive" | "Normal";
}

interface Sender {
  id: string;
  first_name: string;
}

interface Message {
  id: string;
  type: "image" | "video" | "document" | "text";
  content: string;
  createdAt: string;
  seenIds: string[];
  communityId: string;
  senderId: string;
  sender: Sender;
}

export default function Community() {
  const userStore = useUserStore();
  const [error, setError] = useState<string | null>(null);
  const token = useUserStore((state) => state.token);
  const [messageHeading, setMessageHeading] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [smScreen, setSmScreen] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(
    null
  );
  const [leftRoom, setLeftRoom] = useState<string>("no");
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);
  const [normalCommunities, setNormalCommunities] = useState<Community[]>([]);

  const toggleHeading = (text: string, communityId: string) => {
    setSelectedCommunityId(communityId);
    setMessageHeading(text);
    socket.emit("check-join", { communityId });
  };

  const handleSmScreen = () => {
    setSmScreen(!smScreen);
  };

  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth < 640); // Tailwind's sm breakpoint is 640px
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await fetch("/api/community/getAll");
      const data = await response.json();
      setCommunities(data.communities);
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  const fetchNormalCommunities = async () => {
    try {
      const response = await fetch("/api/community/getAll");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Log the full data to verify the structure
      console.log("Fetched data:", data);

      // Ensure data.communities exists and is an array
      if (Array.isArray(data.communities)) {
        // Log the type of each community to check for discrepancies
        data.communities.forEach((community: Community) => {
          console.log(`Community comm_type: ${community.comm_type}`);
        });

        // Filter for normal communities
        const normal = data.communities.filter(
          (community: Community) => community.comm_type === "Normal"
        );
        console.log("Normal communities:", normal); // Debug statement
        setNormalCommunities(normal);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching normal communities:", error);
      setError("Failed to load communities.");
    }
  };

  useEffect(() => {
    fetchNormalCommunities();
  }, []);

  useEffect(() => {
    const userIdFromLocalStorage = localStorage.getItem("userId");
    if (userIdFromLocalStorage) {
      setUserId(userIdFromLocalStorage);
      console.log(userIdFromLocalStorage);
    }

    fetchCommunities();
  }, []);

  useEffect(() => {
    const crossCheck = async (communityId: string) => {
      try {
        const response = await fetch(
          `/api/community/${communityId}/crosscheck`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust token retrieval as per your setup
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("dats:", data.message);
          if (data.message === "No") {
            setLeftRoom("yes");
          }
          await fetchCommunities();
        } else {
          console.error(
            "Error checking community membership:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error checking community membership:", error);
      }
    };

    if (selectedCommunityId !== null) {
      crossCheck(selectedCommunityId);
    }
  }, [selectedCommunityId]);

  useEffect(() => {
    if (selectedCommunityId !== null) {
      const handleNewMessages = (newMessages: Message[]) => {
        if (Array.isArray(newMessages)) {
          newMessages.forEach((message) => {
            processMessage(message);
          });
        } else {
          processMessage(newMessages);
        }
      };

      socket.on("receive-message-community", handleNewMessages);
      socket.emit("fetch-community-messages", {
        communityId: selectedCommunityId,
      });

      return () => {
        socket.off("receive-message-community", handleNewMessages);
      };
    }
  }, [selectedCommunityId]);

  const processMessage = (message: Message) => {
    console.log(message.type);
    switch (message.type) {
      case "image":
        const ImageUrl = base64ToBlobUrl(message.content, "image/png");
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...message, content: ImageUrl, type: "image" },
        ]);
        break;
      case "video":
        const VideoUrl = base64ToBlobUrl(message.content, "video/mp4");
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...message, content: VideoUrl, type: "video" },
        ]);
        break;
      case "document":
        const mediaUrl = base64ToBlobUrl(message.content, "application/pdf");
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...message, content: mediaUrl, type: "document" },
        ]);
        break;
      case "text":
      default:
        setMessages((prevMessages) => [...prevMessages, message]);
        break;
    }
  };

  const base64ToBlobUrl = (base64: string, type: string) => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteNumbers], { type });
    return URL.createObjectURL(blob);
  };

  const capitalizeFirstLetterOfEachWord = (text: string) => {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const joinCommunity = async (communityId: string) => {
    try {
      const response = await fetch(`/api/community/${communityId}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Adjust token retrieval as per your setup
        },
      });
      if (response.ok) {
        socket.emit("join-room", { communityId });
        setMessages([]);
        socket.emit("fetch-community-messages", { communityId });
        setLeftRoom("no");
        toast.success("Joined to the community");
        await fetchCommunities();
      } else {
        console.error("Error joining community:", response.statusText);
      }
    } catch (error) {
      console.error("Error joining community:", error);
    }
  };

  const leaveCommunity = async (communityId: string) => {
    try {
      const response = await fetch(`/api/community/${communityId}/leave`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Adjust token retrieval as per your setup
        },
      });
      if (response.ok) {
        socket.emit("leave-room", { communityId });
        await fetchCommunities();
        setLeftRoom("yes");
        toast.success("Left Community successfully");
      } else {
        console.error("Error leaving community:", response.statusText);
        toast.error("Error leaving community:");
      }
    } catch (error) {
      console.error("Error leaving community:", error);
    }
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setText(value);
    socket.emit("message", value);
  };

  const sendText = () => {
    if (text) {
      if (text !== "") {
        setFile(null);
        const communityId = selectedCommunityId;
        socket.emit("message", {
          type: "text",
          message: text,
          community: communityId,
        });
        setText("");
      }
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const fileType = file.type;
        const socketEvent = fileType.includes("image")
          ? "send-image"
          : fileType.includes("video")
          ? "send-video"
          : "send-document";
        socket.emit(socketEvent, {
          type: socketEvent.split("-")[1],
          content: base64String,
          communityId: selectedCommunityId,
        });
        setFile(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center overflow-hidden">
      <div className="bg-[#F1EAFF] w-full h-full flex flex-wrap md:flex-nowrap gap-3">
        <div className="w-full md:w-85 h-full flex flex-col gap-3 pl-4 pt-3 overflow-hidden ml-20">
          <div className="text-[#737373] font-semibold flex flex-col gap-2.5">
            <div className="font-bold">Hello Raj!</div>
            <span className="text-[#A6A6A6]">
              Learn with your peers to maximize learning
            </span>
            <div className="relative">
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-11/12 border rounded-lg"
                placeholder="Search Problems"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Image
                  src="/community/search-lens.svg"
                  alt="search"
                  width={25}
                  height={25}
                />
              </div>
            </div>
          </div>
          <Carousel />
          <div className="flex flex-col items-center gap-3 mt-[250px] overflow-hidden">
            <div className="flex flex-row justify-between w-full max-w-3xl">
              <span className="text-base font-semibold">All Communities</span>
              <button className="text-sm font-semibold text-[#8c52ff]">
                See All
              </button>
            </div>
            <div className="w-11/12 max-w-3xl gap-3 flex flex-col justify-center">
              {communities &&
                communities.map((community) => (
                  <div
                    key={community.id}
                    className="w-full h-20 bg-[#fff] flex flex-row text-md font-bold justify-between items-center rounded-lg cursor-pointer shadow-md transition-transform transform hover:scale-105 p-4"
                    onClick={() => {
                      toggleHeading(community.name, community.id);
                      handleSmScreen();
                    }}
                  >
                    <div>
                      <button
                        className="text-sm font-semibold text-red-500 mr-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          leaveCommunity(community.id);
                        }}
                      >
                        Leave
                      </button>
                      <button
                        className="text-sm font-semibold text-green-500 mr-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          joinCommunity(community.id);
                        }}
                      >
                        Join
                      </button>
                    </div>
                    <div className="flex flex-row items-center flex-grow">
                      <div className="w-10 h-10 p-1">
                        <Image
                          src="/community/WebDev.svg" // Use a default icon or handle appropriately
                          alt="img"
                          height={40}
                          width={40}
                          className="w-full"
                        />
                      </div>
                      <span className="pl-3">
                        {capitalizeFirstLetterOfEachWord(community.name)}
                      </span>
                    </div>
                    <div>
                      {community.messagesIds &&
                        community.messagesIds.length > 0 && (
                          <div className="w-8 h-8 rounded-full bg-[#8c52ff] text-lg flex justify-center items-center text-[#fff] mr-3">
                            {community.messagesIds.length}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div
          className={`${
            isSmallScreen ? "absolute top-14 h-[90%] w-full ml-0" : ""
          } ${
            smScreen ? "flex" : "hidden"
          } md:flex flex-col h-[90%] w-full md:w-1/2 bg-[#fff] rounded-lg m-3 mb-0 justify-end transition-all duration-300 `}
        >
          <div className="flex flex-row bg-[#8c52ff] w-full h-16 rounded-lg items-center justify-between">
            <div
              className="rounded-full flex justify-center items-center md:hidden"
              onClick={handleSmScreen}
            >
              <Image
                src="/community/backarrow-white.png"
                alt="img"
                height={10}
                width={10}
                className="w-8 h-8"
              />
            </div>
            <div className="flex flex-row gap-14 items-center pl-10">
              <div className="w-12 h-12 bg-[#fff] rounded-full flex justify-center items-center">
                <Image
                  src={icon}
                  alt="img"
                  height={10}
                  width={10}
                  className="w-8 h-8"
                />
              </div>
              <span className="text-xl font-semibold text-[#fff]">
                {messageHeading}
              </span>
            </div>
            <div className="flex flex-row items-center gap-8 pr-6">
              <div>
                <Image
                  src="/community/search-lens.svg"
                  alt="img"
                  height={10}
                  width={10}
                  className="w-6 h-6"
                />
              </div>
              <div>
                <Image
                  src="/community/arrowdown.svg"
                  alt="img"
                  height={10}
                  width={10}
                  className="w-6 h-6"
                />
              </div>
            </div>
          </div>
          {leftRoom === "no" ? (
            <div className="flex flex-col h-full">
              <div className="flex-grow flex flex-col p-4 overflow-auto">
                {messages.length > 0 &&
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className="mb-2 p-2 bg-gray-100 rounded-lg"
                    >
                      <p className="text-blue-800 font-serif size-5 ">
                        {message.sender.first_name}
                      </p>
                      {message.type === "text" ? (
                        <div>
                          <p>{message.content}</p>
                        </div>
                      ) : message.type === "image" ? (
                        <img
                          src={message.content}
                          alt="Uploaded"
                          style={{ maxWidth: "100%", marginTop: "10px" }}
                        />
                      ) : message.type === "video" ? (
                        <video
                          controls
                          style={{ maxWidth: "100%", marginTop: "10px" }}
                        >
                          <source src={message.content} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : message.type === "document" ? (
                        <a
                          href={message.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: "block", marginTop: "10px" }}
                        >
                          Open Document
                        </a>
                      ) : (
                        message.content
                      )}
                    </div>
                  ))}
              </div>
              <div className="flex justify-center p-3">
                <div className="relative w-full md:w-[65vw] mb-4">
                  <input
                    type="text"
                    className="pl-12 pr-16 py-2 w-full border rounded-lg bg-[#E9D9FF] text-gray-700"
                    placeholder="Enter Message"
                    value={text}
                    onChange={handleChangeText}
                  />
                  <label
                    htmlFor="file-input"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  >
                    <Image
                      src="/community/textplussign.svg"
                      alt="search"
                      width={25}
                      height={25}
                    />
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={(e) =>
                      setFile(e.target.files ? e.target.files[0] : null)
                    }
                    className="hidden"
                  />
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={sendText}
                  >
                    <IoSend className="text-purple-700 size-6" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>Join the community</div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
