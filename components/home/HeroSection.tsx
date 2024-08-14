import Image from "next/image";
import Typing from "./Typing";
import InfiniteLogoSlide from "./InfiniteLogoSlide";

export default function HeroSection() {
  return (
    <>
      <div className="flex flex-col max-w-screen overflow-hidden bg-primary-foreground">
        <div className="flex justify-evenly items-center min-h-[555px] md:min-h-[700px] pt-4 px-8 gap-8 w-full m-auto">
          <div className="flex flex-col justify-center lg:justify-end min-h-[600px] w-full">
            <div className="text-4xl md:text-5xl xl:text-6xl font-bold lg:ml-14 mb-6">
              <Typing /> <br />{" "}
              <span className="font-semibold">Your Dream Career</span>
            </div>
            <div className=" lg:text-2xl font-medium lg:ml-16 mb-9 max-w-[640px]">
              Get AI- Powered personalised career guidance based on Your
              interests, aptitude, and goals
            </div>
            <button className="flex items-center justify-between bg-[#8C52FF] rounded-full duration-150 hover:scale-[1.02] text-white text-xl md:text-2xl font-semibold py-2 md:py-3 pl-4 md:pl-8 px-2 md:px-3 max-w-[232px] md:max-w-[300px] mb-12 lg:ml-14">
              Let&apos;s Get Started
              <Image
                src={"/home/heroSectionArrow.svg"}
                height={45}
                width={45}
                alt=""
                className="w-8 md:w-10"
              ></Image>
            </button>
            <div className="flex gap-4 ">
              <div className="flex flex-wrap gap-2 w-full bg-[#f5f5f580] rounded-2xl p-4">
                <div className="flex w-full gap-x-2">
                  <div className="bg-[#f5f5f5] rounded-2xl p-3 min-h-16 w-full hover:scale-[1.01] hover:bg-[#fafafa] transition-all duration-100">
                    <h1 className="flex items-center gap-2 font-semibold">
                      <Image
                        className=""
                        src={"/home/HSecMentorship.svg"}
                        alt=""
                        height={30}
                        width={30}
                      />{" "}
                      Mentorship
                    </h1>
                    <div className="text-[#00000090] text-xs ml-2 line-clamp-2">
                      Get assistance from experts from IITs and IIMs and get
                      ahead in your career.
                    </div>
                  </div>
                  <div className="bg-[#f5f5f5] rounded-2xl p-3 min-h-16 w-full hover:scale-[1.01] hover:bg-[#fafafa] transition-all duration-100">
                    <h1 className="flex items-center gap-2 font-semibold">
                      <Image
                        className=""
                        src={"/home/HSecResources.svg"}
                        alt=""
                        height={30}
                        width={30}
                      />{" "}
                      Resources
                    </h1>
                    <div className="text-[#00000090] text-xs ml-2 line-clamp-2">
                      Get free access to resources helpful for your college and
                      career journey
                    </div>
                  </div>
                </div>
                <div className="flex  bg-[#f5f5f5] rounded-2xl p-3 min-h-16 w-full hover:scale-[1.01] hover:bg-[#fafafa] transition-all duration-100">
                  <Image
                    src={"/home/HSecCareer.svg"}
                    alt=""
                    height={20}
                    width={20}
                    className="w-[100px] mr-4"
                  />
                  <div>
                    <h1 className="flex items-center gap-2 font-semibold">
                      Career Blogs
                    </h1>
                    <div className="text-[#00000090] text-xs line-clamp-2">
                      Explore personalized career blogs crafted to enhance your
                      domain knowledge.
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden xl:flex flex-col bg-[#f5f5f580] hover:bg-[#f1eaff] transition-all duration-200 p-4 rounded-2xl max-w-[260px]">
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <div className="p-2 bg-white  rounded-full hover:bg-primary-foreground duration-400 w-11 h-11 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        fill="#8c52ff"
                        className="bi bi-telegram"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
                      </svg>
                    </div>
                    <div className="p-2 bg-white  rounded-full hover:bg-primary-foreground duration-400 w-11 h-11 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        fill="#8c52ff"
                        className="bi bi-discord"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
                      </svg>
                    </div>
                    <div className="p-2 bg-white  rounded-full hover:bg-primary-foreground duration-400 w-11 h-11 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        fill="#8c52ff"
                        className="bi bi-whatsapp"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                      </svg>
                    </div>
                  </div>
                  <Image
                    src="/home/arrowdown.svg"
                    width={100}
                    height={100}
                    alt="box"
                    className="w-9 mx-2 hover:scale-110 transition-all duration-100"
                  />
                </div>
                <div className="w-full h-[2px] bg-white my-4"></div>
                <div>
                  <div className="my-2 text-xl font-medium">
                    Join to our Community
                  </div>
                  <div className="text-xs text-[#00000090] mt-4 line-clamp-3">
                    Join a community of serious and passionate tech folks,
                    students, mentors and coaches to accelerate your career.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:block hidden p-6 w-full max-w-[600px] bg-[#ffffff50] rounded-2xl">
            <Image
              src={"/home/HeroSection.svg"}
              alt="HeroSection"
              width={100}
              height={100}
              className="w-full bg-[#f5f5f5] min-h-[552px] rounded-2xl py-2 px-5"
            ></Image>
          </div>
        </div>
        <InfiniteLogoSlide />
      </div>
    </>
  );
}
