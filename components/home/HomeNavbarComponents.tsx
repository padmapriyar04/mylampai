import Link from "next/link";
import { ChevronDown } from "lucide-react";

export function TalentComponent() {
  return (
    <div className="hover:text-black relative text-[#697386] flex items-center gap-2 group focus:text-black transition-all py-2 px-4 rounded-lg duration-500 hover:transform z-0 ">
      <div>Talent</div>
      <ChevronDown className="w-4 h-4 text-[#697386] group-hover:-rotate-180 group-hover:text-black transition-all duration-100" />

      <div className="group-hover:w-10 group-hover:h-10 w-0 h-0 bg-primary-foreground backdrop-blur-md transform rotate-45 absolute bottom-0 translate-y-full opacity-0 group-hover:opacity-100 z-0 ease-in-out rounded-sm"></div>
      <div className="max-h-0 overflow-hidden group-hover:max-h-screen group-focus:max-h-screen absolute top-full right-0 translate-x-1/2 bg-primary-foreground backdrop-blur-md w-[600px] rounded-xl">
        <div className="flex items-stretch p-2 gap-2 font-normal">
          <ul className="flex place-items-center flex-col gap-2 w-full max-w-40 ">
            <li className="p-2 rounded-lg border border-primary w-full text-center cursor-pointer">
              Talent Match
            </li>
            <li className="p-2 rounded-lg border border-primary w-full text-center cursor-pointer">
              AI Interviewer
            </li>
            <li className="p-2 rounded-lg border border-primary w-full text-center cursor-pointer">
              AI CV Reviewer
            </li>
            <li className="p-2 rounded-lg border border-primary w-full text-center cursor-pointer">
              Careers
            </li>
          </ul>
          <div className="flex flex-col w-full gap-2 justify-between items-center">
            <div>
              You'll be taking a 20-minute interview to Lorem ipsum dolor sit
              Lorem ipsum dolor sit orem, ipsum.
            </div>
            <div className="h-full border border-primary p-2 w-full rounded-lg">
              Image
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecruiterComponent() {
  // const [email, setEmail] = useState("");

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setEmail(e.target.value);
  // };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   try {
  //     const res = await fetch("/api/newsletteremails", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email }),
  //     });

  //     if (res.ok) {
  //       toast.success("Subscribed!");
  //       setEmail("");
  //     }
  //   } catch (err) {
  //     toast.error("Failed");
  //     console.log(err);
  //   }
  // };

  return (
    <div className="hover:text-black text-[#697386] flex items-center gap-2 group relative focus:text-black transition-all py-2 px-4 rounded-lg duration-500 hover:transform ">
      <div>Recruiter</div>
      <ChevronDown className="w-4 h-4 text-[#697386] group-hover:-rotate-180 group-hover:text-black transition-all duration-100" />
      <div className="max-h-0 group-hover:max-h-screen group-focus:max-h-screen flex flex-col items-center overflow-hidden opacity-0 scale-75 transition-all duration-500 group-hover:height-auto group-hover:opacity-100 group-hover:scale-100 group-focus:flex group-focus:opacity-100 group-focus:scale-100 absolute top-[110%] left-0 bg-[#f9f9f9] w-[180px] rounded-xl shadow-[0px_0px_1px_rgba(0,0,0,0.3)] font-normal px-2">
        {/* <form
          onSubmit={handleSubmit}
          className="flex items-center justify-start w-full overflow-hidden rounded-lg text-sm mb-2 mt-2"
        >
          <input
            placeholder="Join Newsletter"
            type="email"
            name="newsletter"
            className="bg-primary-foreground text-center w-full h-[35px] outline-none border-none p-2 "
            value={email}
            onChange={handleChange}
          />
          <button type="submit">
            <Image
              className="bg-[#8C52FF] h-[35px] w-[40px] p-2"
              src={"/home/arrowInput.svg"}
              height={30}
              width={30}
              alt="arrowInput"
            />
          </button>
        </form>
        <div className="p-2 hover:bg-primary-foreground w-full text-center duration-400 rounded-lg">
          Handbooks
        </div>
        <div className="p-2 hover:bg-primary-foreground w-full text-center duration-400 rounded-lg mb-2">
          Career Blogs
        </div> */}
      </div>
    </div>
  );
}

export function AboutComponent() {
  return (
    <div className="hover:text-black text-[#697386] flex items-center gap-2 group relative focus:text-black transition-all py-2 px-4 rounded-lg duration-500 hover:transform ">
      <div>About</div>
      <ChevronDown className="w-4 h-4 text-[#697386] group-hover:-rotate-180 group-hover:text-black transition-all duration-100" />
      <div className="max-h-0 max-w-full group-hover:max-h-screen group-focus:max-h-screen flex flex-col items-center overflow-hidden opacity-0 scale-75 transition-all duration-500 group-hover:height-auto group-hover:opacity-100 group-hover:scale-100 group-focus:flex group-focus:opacity-100 group-focus:scale-100 absolute top-[110%] left-0 bg-[#f9f9f9] rounded-xl shadow-[0px_0px_1px_rgba(0,0,0,0.3)] font-normal px-2">
        <Link
          href={"/aboutus"}
          className="hover:bg-primary-foreground w-full p-2 rounded-lg duration-400 text-center mt-2"
        >
          {" "}
          About Us
        </Link>
        <Link
          href={"/careers"}
          className="hover:bg-primary-foreground w-full p-2 rounded-lg duration-400 text-center"
        >
          {" "}
          Careers
        </Link>
        <Link
          href={"/contactus"}
          className="hover:bg-primary-foreground w-full p-2 rounded-lg duration-400 text-center mb-2"
        >
          {" "}
          Contact Us
        </Link>
      </div>
    </div>
  );
}
