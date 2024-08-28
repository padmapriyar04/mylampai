"use client";
import Image from "next/image";
import React, { useRef, useState, useEffect, useCallback } from "react";
import ExclusiveCommunity from "@/components/community/ExclusiveCommunity";
import { toast } from "sonner";
import socket from "@/utils/socket";
import { useUserStore } from "@/utils/userStore";
import { format } from "date-fns";

interface Community {
  id: string;
  createdAt: string;
  lastmessageAt: string;
  name: string;
  description: string;
  isCommunity: boolean;
  messagesIds: any;
  userIds: string[];
  comm_type: "exclusive" | "normal";
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
  const { userData, token } = useUserStore();
  let lastDate: string | null = null;
  let lastUser: string | null = null;
  const [messageHeading, setMessageHeading] = useState<string>("");
  const [communities, setCommunities] = useState<Community[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(
    null,
  );
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);

  const [exclusiveCommunities, setExclusiveCommunities] = useState<Community[]>(
    [],
  );

  const toggleHeading = (name: string, communityId: string) => {
    setSelectedCommunityId(communityId);
    setMessageHeading(name);
    setMessages([]);
    socket.emit("check-join", { communityId });
  };

  const fetchCommunities = async () => {
    try {
      const response = await fetch("/api/community");
      const data = await response.json();

      const exclusiveCommunities = data.communities.filter(
        (community: Community) => community.comm_type === "exclusive",
      );
      setCommunities(data.communities);
      setExclusiveCommunities(exclusiveCommunities);
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  const joinCommunity = useCallback(
    async (communityId: string) => {
      try {
        const response = await fetch(`/api/community/${communityId}/join`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          socket.emit("join-room", { communityId });
          setMessages([]);
          socket.emit("fetch-community-messages", { communityId });
          toast.success("Joined to the community");
        } else {
          console.error("Error joining community:", response.statusText);
        }
      } catch (error) {
        console.error("Error joining community:", error);
      }
    },
    [token],
  );

  const leaveCommunity = async (communityId: string) => {
    try {
      const response = await fetch(`/api/community/${communityId}/leave`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        socket.emit("leave-room", { communityId });
        toast.success("Left Community successfully");
      } else {
        toast.error("Error leaving community");
      }
    } catch (error) {
      toast.error("Error leaving community");
    }
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setText(value);
    socket.emit("message", value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (text) {
      if (text.trim() !== "") {
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
      const fileType = file.type.startsWith("image")
        ? "image"
        : file.type.startsWith("video")
          ? "video"
          : "document";

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        socket.emit(`send-${fileType}`, {
          type: fileType,
          content: base64String,
          selectedCommunityId,
        });
        setFile(null);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const crossCheck = async (communityId: string) => {
      try {
        const response = await fetch(
          `/api/community/${communityId}/crosscheck`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.ok) {
          const data = await response.json();

          if (data.exists === false) {
            joinCommunity(communityId);
          }
        }
      } catch (error) {
        toast.error("Error getting Info");
      }
    };

    if (selectedCommunityId !== null) {
      crossCheck(selectedCommunityId);
    }
  }, [selectedCommunityId, token, joinCommunity]);

  const base64ToBlobUrl = (base64: string, type: string) => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteNumbers], { type });
    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    const processMessage = (message: Message) => {
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

    if (selectedCommunityId !== null) {
      const handleNewMessages = (newMessages: Message[]) => {
        // Check if the data is a single message or an array
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

  useEffect(() => {
    fetchCommunities();
  }, []);

  return (
    <div className="w-full shadow-inner flex items-stretch justify-between h-[calc(100vh-4rem)] gap-4 p-4 ">
      <div className="w-full max-w-[440px] h-[calc(100vh-6rem)] flex flex-col items-stretch justify-start gap-4">
        <div className="w-full flex flex-col">
          <div className="font-semibold text-gray-700">
          Hello {userData?.name ? userData.name.split(" ")[0] : "User"}!
          </div>
          <span className="text-sm text-gray-700">
            Learn with your peers to maximize learning
          </span>
          <div className="relative mt-4">
            <input
              type="text"
              className="pl-12 pr-4 py-2 w-full rounded-lg shadow-[0px_0px_5px_rgba(140,82,255,0.2)]"
              placeholder="Search Communities"
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
        <ExclusiveCommunity exclusiveCommunities={exclusiveCommunities} />
        <div className="flex flex-row justify-between">
          <span className="text-xl font-semibold">All Communities</span>
          <button className="font-semibold text-primary">See All</button>
        </div>
        <div className="h-full overflow-auto scrollbar-hide">
          <div className="w-full flex flex-col justify-center gap-2">
            {communities.map(
              (community, index) =>
                community.comm_type == "normal" && (
                  <div
                    key={index}
                    className="w-full h-20 bg-[#fff] flex flex-row text-md font-bold justify-between items-center rounded-lg cursor-pointer"
                    onClick={() => {
                      toggleHeading(community.name, community.id);
                    }}
                  >
                    <div className="flex flex-row items-center">
                      <div className="w-[80px] p-1">
                        <Image
                          src="/community/WebDev.svg"
                          alt="img"
                          height={10}
                          width={10}
                          className="w-full"
                        />
                      </div>
                      <span className="pl-5 capitalize">{community.name}</span>
                    </div>
                  </div>
                ),
            )}
          </div>
        </div>
      </div>
      <div
        className={`w-full flex flex-col items-center justify-center h-calc(100vh-6rem) ${selectedCommunityId === null ? "bg-[#fafafa]" : "bg-white"} overflow-hidden rounded-xl shadow-lg`}
      >
        {selectedCommunityId === null ? (
          <div className="max-w-[400px]">
            <Image
              src={"/community/communityicon.svg"}
              alt="community"
              width={1000}
              height={1000}
              className="w-full h-auto object-cover object-center"
            />

            <div className="flex flex-col items-center text-center">
              <span className="text-2xl font-semibold text-primary">
                Welcome to the Community
              </span>
              <span className="text-lg text-gray-700">
                Select a community to start chatting
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-row bg-primary w-full p-2 items-center justify-between">
              <div className="flex flex-row gap-14 items-center pl-10">
                <div className="w-12 h-12 bg-[#fff] rounded-full flex justify-center items-center">
                  <Image
                    src={"/community/WebDev.svg"}
                    alt="img"
                    height={10}
                    width={10}
                    className="w-8 h-8"
                  />
                </div>
                <span className="text-xl font-semibold text-white capitalize">
                  {messageHeading}
                </span>
              </div>
              <div className="flex flex-row items-center gap-8 pr-6">
                <Image
                  src="/community/arrowdown.svg"
                  alt="img"
                  height={10}
                  width={10}
                  className="w-6 h-6"
                />
              </div>
            </div>
            <div className="flex flex-col py-4 h-full overflow-y-scroll scrollbar-hide">
              {" "}
              {messages.length > 0 &&
                messages.map((message) => {
                  const date = format(
                    new Date(message.createdAt),
                    "MMMM d, yyyy",
                  );
                  const showDate = lastDate !== date;
                  lastDate = date;

                  const senderId = message.sender.id;
                  const showSender = senderId !== lastUser;
                  lastUser = senderId;

                  return (
                    <>
                      {showDate && (
                        <div className="flex items-center">
                          <div className="h-[2px] bg-primary-foreground w-full"></div>
                          <div className="rounded-full text-nowrap py-1 px-3 border-2 border-primary-foreground">
                            {date}
                          </div>
                          <div className="h-[2px] bg-primary-foreground w-full"></div>
                        </div>
                      )}

                      <div
                        className={`px-4 py-1 ${
                          showSender ? "pt-2" : "pt-0"
                        } flex gap-2 hover:bg-[#fafafa] group`}
                      >
                        <div className="max-w-12 w-full rounded-lg">
                          {showSender && !showDate && (
                            <Image
                              src={"/home/profile.jpg"}
                              alt="user"
                              width={100}
                              height={100}
                              className="bg-cover"
                            />
                          )}
                        </div>
                        <div className="relative">
                          {!showSender && (
                            <div className="absolute hidden group-hover:block left-0 -translate-x-full text-xs w-14 text-[#777] -translate-y-1/2 top-1/2">
                              {format(new Date(message.createdAt), "h:mm a")}
                            </div>
                          )}
                          {showSender && (
                            <div className="text-primary font-semibold text-lg gap-x-3 uppercase flex items-center ">
                              <div>
                                {message.sender.first_name}{" "}
                                {userData?.id === message.sender.id && "(Me)"}
                              </div>
                              <div className="text-[#333] font-normal text-sm">
                                {format(new Date(message.createdAt), "h:mm a")}
                              </div>
                            </div>
                          )}

                          {message.type === "text" ? (
                            <div className="text-base">{message.content}</div>
                          ) : message.type === "image" ? (
                            <Image
                              src={message.content}
                              alt="Uploaded"
                              className="w-full max-w-[500px] rounded-xl mt-2 h-auto"
                              width={100}
                              height={100}
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
                      </div>
                    </>
                  );
                })}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="w-full p-4">
              <input
                type="text"
                className="px-4 py-2 w-full rounded-xl outline-none border-2 "
                placeholder="text"
                value={text}
                onChange={handleChangeText}
              />
              <input
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                onChange={handleFileChange}
                className="mr-4"
              />
              {/* <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImage(e.target.files ? e.target.files[0] : null)
                }
                className="p-2 w-full"
              />

              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setVideo(e.target.files ? e.target.files[0] : null)
                }
                className="p-2 w-full"
              />

              <input
                type="file"
                accept=".pdf, .doc, .docx"
                onChange={(e) =>
                  setDocument(e.target.files ? e.target.files[0] : null)
                }
                className="p-2 w-full"
              /> */}

              <button
                className=" bg-green-600 py-2 px-4 rounded-full text-white font-bold"
                type="submit"
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
