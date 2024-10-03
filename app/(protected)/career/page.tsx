"use client";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";

export default function Career() {
  const [expandedDiv, setExpandedDiv] = useState<number | null>(null);
  const [isRegistered, setISRegistered] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedDiv(expandedDiv === index ? null : index);
  };

  const handleRegister = (index: number) => {
    setISRegistered(isRegistered === index ? null : index);
  };

  return (
    <div className="bg-primary-foreground w-full flex justify-center p-4">
      <div className="w-full grid grid-cols-1 gap-4">
        {Array.from({ length: 7 }, (_, index) => (
          <div
            key={index}
            className={`bg-white w-full rounded-lg shadow-lg transition-all duration-300 ease-in-out overflow-hidden p-4 ${
              expandedDiv === index ? "h-auto" : "h-[200px]"
            }`}
          >
            <div className="w-full flex mb-4">
              <div className="text-xl font-bold">
                Competition Name
                <div className="text-xs font-light">Organized by IITKGP</div>
              </div>
              <button
                onClick={() => toggleExpand(index)}
                className="bg-primary font-bold flex gap-[2px] justify-center items-center text-white px-2 py-2 text-[0.87vw] rounded absolute right-8 hover:bg-purple-600 transition w-24"
              >
                {expandedDiv === index ? "Show Less" : "Show More"}
                <IoIosArrowDown />
              </button>
            </div>
            <div className="h-[110px] w-full flex gap-4">
              <div className="h-full w-[13%] bg-primary rounded-md text-xs flex justify-center items-center text-white">
                Competition logo
              </div>
              <div className="h-[110px] w-[87%] text-sm font-light flex flex-col gap-2">
                <p>Eligibility: 18+ </p>
                <p>Registration Deadline: 20 days left </p>
                <p>Mode: Online </p>
                <p>Participants Registered: 69 </p>
              </div>
            </div>

            {expandedDiv === index && (
              <>
                <div className="flex flex-col justify-evenly gap-6 h-[50%]">
                  <div className="w-full mt-4 text-sm font-light h-[90%]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Pellentesque semper lectus urna. Proin orci nibh, porttitor
                    rhoncus mauris sed, mollis vulputate dolor. Integer congue
                    quam est, ac ornare tortor bibendum sit amet. Etiam rhoncus
                    sem eu elit hendrerit faucibus. Sed lectus justo, euismod eu
                    condimentum sed, imperdiet eu turpis. Fusce libero massa,
                    sagittis et faucibus in, ultricies vel nisi. Aliquam in
                    laoreet dolor, imperdiet luctus tellus. Suspendisse pretium
                    pharetra neque a scelerisque. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Pellentesque semper lectus urna. Proin orci nibh, porttitor
                    rhoncus mauris sed, mollis vulputate dolor. Integer congue
                    quam est, ac ornare tortor bibendum sit amet. Etiam rhoncus
                    sem eu elit hendrerit faucibus. Sed lectus justo, euismod eu
                    condimentum sed, imperdiet eu turpis.
                  </div>

                  <div className="w-full h-[10%] flex items-center relative gap-2">
                    <button
                      onClick={() => handleRegister(index)}
                      className="bg-green-500 font-bold flex gap-[2px] justify-center items-center text-white px-2 py-2 text-[0.93vw] rounded hover:bg-green-600 transition w-24"
                    >
                      {isRegistered === index
                        ? "Registering..."
                        : "Register"}
                    </button>

                    {/* CV Review Stage Link */}
                    <Link
                      href="/cvreviewer"
                      className={`${
                        isRegistered === index
                          ? "bg-primary hover:bg-purple-600 cursor-pointer"
                          : "bg-gray-400 cursor-not-allowed"
                      } w-fit font-bold flex gap-[2px] justify-center items-center text-white px-2 py-2 text-[0.93vw] rounded transition`}
                      onClick={(e) => {
                        if (isRegistered !== index) {
                          e.preventDefault();
                        }
                      }}
                    >
                      CV Review Stage
                    </Link>

                    {/* Interview Stage Link */}
                    <Link
                      href="/interview"
                      className={`${
                        isRegistered === index
                          ? "bg-primary hover:bg-purple-600 cursor-pointer"
                          : "bg-gray-400 cursor-not-allowed"
                      } w-fit font-bold flex gap-[2px] justify-center items-center text-white px-2 py-2 text-[0.93vw] rounded transition`}
                      onClick={(e) => {
                        if (isRegistered !== index) {
                          e.preventDefault();
                        }
                      }}
                    >
                      Interview Stage
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
