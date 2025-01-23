"use client";
import Link from "next/link";
import Image from "next/image";
import { addSkills, createTalentProfile } from "@/actions/setupProfileActions";
import { Clock9 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCategoriesSelector } from "@/components/create-profile/job-specialites";
import { ArrayInput } from "@/components/misc/ArrayInput";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ProfessionalRole } from "@/components/create-profile/job-role";
import { WorkExperiences } from "@/components/create-profile/work-experiences";
import { EducationDetails } from "@/components/create-profile/education-details";
import { LanguageSelector } from "@/components/create-profile/language-selector";
import { BioDetails } from "@/components/create-profile/bio-details";
import { HourlyRate } from "@/components/create-profile/hourly-rate";
import { PersonalDetailsForm } from "@/components/create-profile/personal-details-form";
import { useState, useRef, useCallback, DragEvent } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserStore } from "@/utils/userStore";
import { useProfileStore } from "@/utils/profileStore";
import * as pdfjsLib from "pdfjs-dist/webpack";
import { generateSasToken } from "@/actions/azureActions";
import { IoCloudUploadOutline, IoDocumentAttach } from "react-icons/io5";
import { User } from "next-auth";


const formSchema = z.object({
  skills: z.array(z.string()).min(1, "At least one skill is required"),
});

// const baseUrl = "https://optim-cv-judge.onrender.com";
const baseUrl = process.env.NEXT_PUBLIC_RESUME_API_ENDPOINT;


function generateFileName(originalFileName: string, filetype: string) {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  const fileExtension = originalFileName.split(".").pop();
  return `${timestamp}_${filetype}.${fileExtension}`;
}

interface Experience {
  Company: string;
  Position: string;
  Location: string;
  "Start Date": string;
  "End Date": string;
  Description: string;
}

interface Education {
  "School/Institution": string;
  Degree: string | null;
  "Field of Study": string | null;
  Grade: string;
  "Start Date": string;
  "End Date": string;
  Description: string | null;
}

interface StructuredResult {
  Name: string;
  "First Name": string;
  "Last Name": string;
  "Phone Number": string;
  "Street Address": string | null;
  Country: string | null;
  City: string | null;
  "State/Province": string | null;
  "ZIP/Postal Code": string | null;
  "Work Category": string;
  "Work Specialities": string[];
  Skills: string[];
  "Job Role": string;
  Experience: Experience[];
  Education: Education[];
  Bio: string;
}

interface UserInfo {
  name: string;
  first_name: string;
  last_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  work_category: string;
  work_specialities: string[];
}

export default function CreateProfile() {
  const { id, setId, setResumeUrl } = useProfileStore();
  const { userData } = useUserStore();
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userInfo,setuserInfo]=useState<UserInfo>({
    name:"",
    first_name:"",
    last_name:"",
    phone:"",
    street:"",
    city:"",
    state:"",
    country:"",
    zipCode:"",
    work_category:"",
    work_specialities:[]
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: [],
    },
  });

  const handleResumeUpload = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    };
  
    const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
  
      setUploading(true);
  
      if (file && file.type === "application/pdf") {
        if (file.size > 1 * 1024 * 1024) {
          toast.error("File size should be less than 1MB");
          setUploading(false);
          return;
        }
        const blobName = generateFileName(file.name, "cv");
        const sasUrl = await generateSasToken(blobName);
        if (!sasUrl) {
          toast.error("Error uploading resume");
          return;
        }
  
        try {
          const uploadResponse = await fetch(sasUrl, {
            method: "PUT",
            headers: {
              "x-ms-blob-type": "BlockBlob",
            },
            body: file,
          });
  
          if (!uploadResponse.ok) {
            toast.error("Resume Upload Failed");
          } else {
            console.log(uploadResponse);
          }
        } catch (error) {
          console.error(error);
        }
  
        // setResumeFile(file);
  
        const fileReader = new FileReader();
        let extractedText = "";
  
        fileReader.onload = async function () {
          const typedArray = new Uint8Array(this.result as ArrayBuffer);
  
          // Load the PDF document
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
  
          // Loop through each page
          for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const textContent = await page.getTextContent();
  
            // Extract text
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(" ");
            extractedText += pageText + "\n";
          }
  
          // Convert the file to base64
          const base64Reader = new FileReader();
          base64Reader.onloadend = async () => {
            const base64String = base64Reader.result?.toString().split(",")[1];
  
            if (base64String && extractedText) {
              try {
                // setExtractedText(extractedText);
                const structuredDataResult = await extractStructuredData(
                  extractedText
                );
  
                // Check if structuredDataResult and 
                console.log("structurnmn  ",structuredDataResult)
                // structuredDataResult.message exist before accessing
                if (structuredDataResult) {
                  // setStructuredData(structuredDataResult.message);
                } else {
                  toast.error("Failed to extract structured data");
                }
  
                // Trigger the upload of CV and Job Description with base64 string and extracted text
                // await uploadCVAndJobDescription(base64String, extractedText);
              } catch (err) {
                toast.error("Failed to process the PDF");
                console.error("Error:", err);
              }
            } else {
              toast.error("Error converting file to base64 or extracting text");
            }
          };
  
          base64Reader.readAsDataURL(file); // Start reading the file as a data URL
        };
  
        fileReader.readAsArrayBuffer(file);
      } else {
        toast.error("Please upload a PDF file");
        setUploading(false);
      }
    };

    const mapStructuredResultToUserInfo  =(structuredResult:StructuredResult):UserInfo=>{
       return {
        name: structuredResult.Name || "",
        first_name: structuredResult["First Name"] || "",
        last_name: structuredResult["Last Name"] || "",
        phone: structuredResult["Phone Number"] || "",
        street: structuredResult["Street Address"] || "",
        city: structuredResult.City || "",
        state: structuredResult["State/Province"] || "",
        country: structuredResult.Country || "",
        zipCode: structuredResult["ZIP/Postal Code"] || "",
        work_category: structuredResult["Work Category"] || "",
        work_specialities: structuredResult["Work Specialities"] || []
       }
    }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const file = event.target.files?.[0];

    setUploading(true);

    if (file && file.type === "application/pdf") {
      if (file.size > 1 * 1024 * 1024) {
        toast.error("File size should be less than 1MB");
        setUploading(false);
        return;
      }
      const blobName = generateFileName(file.name, "cv");
      const sasUrl = await generateSasToken(blobName);

      if (!sasUrl) {
        toast.error("Error uploading resume");
        return;
      }

      try {
        const uploadResponse = await fetch(sasUrl, {
          method: "PUT",
          headers: {
            "x-ms-blob-type": "BlockBlob",
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          toast.error("Resume Upload Failed");
        } else {
          console.log(uploadResponse);
        }
      } catch (error) {
        console.error(error);
      }

      // setResumeFile(file);

      const fileReader = new FileReader();
      let extractedText = "";

      fileReader.onload = async function () {
        const typedArray = new Uint8Array(this.result as ArrayBuffer);

        // Load the PDF document
        const pdf = await pdfjsLib.getDocument(typedArray).promise;

        // Loop through each page
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const textContent = await page.getTextContent();

          // Extract text
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(" ");
          extractedText += pageText + "\n";
        }

        // Convert the file to base64
        const base64Reader = new FileReader();
        base64Reader.onloadend = async () => {
          const base64String = base64Reader.result?.toString().split(",")[1];

          if (base64String && extractedText) {
            try {
              // setExtractedText(extractedText);
              console.log("extracted Text :-> ", extractedText)
              const structuredDataResult = await extractStructuredData(
                extractedText
              );

              // Check if structuredDataResult and structuredDataResult.message exist before accessing
              if (structuredDataResult) {
                console.log("structuredDataResult :-> ", structuredDataResult)
                setuserInfo(mapStructuredResultToUserInfo(structuredDataResult))
                // setStructuredData(structuredDataResult.message);
              } else {
                toast.error("Failed to extract structured data");
              }

              // Trigger the upload of CV and Job Description with base64 string and extracted text
              // await uploadCVAndJobDescription(base64String, extractedText);
            } catch (err) {
              toast.error("Failed to process the PDF");
              console.error("Error:", err);
            }
          } else {
            toast.error("Error converting file to base64 or extracting text");
          }
        };

        base64Reader.readAsDataURL(file); // Start reading the file as a data URL
      };

      fileReader.readAsArrayBuffer(file);
    } else {
      toast.error("Please upload a PDF file");
      setUploading(false);
    }
  };

  const extractStructuredData = useCallback(async (text: string) => {
    try {
      console.log("debug in extractSD")
      const response = await fetch(`${baseUrl}/extract_profile_data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cv_text: text }),
      });

      const result = await response.json();
      if (response.ok) {
        setIsResumeUploaded(true);
        toast.success("Resume uploaded successfully");
        return result;
      }
      toast.error("Error extracting structured data from resume");
      return null;
    } catch (error) {
      toast.error("Error extracting structured data from resume");
      setUploading(false);
      return null;
    }
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!id) return;
      const res = await addSkills(values.skills, id);

      if (res.status === 200) {
        setStep(4);
      } else {
        console.error("Error adding skills:", res.error);
        toast.error("Error adding skills");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create job");
    }
  }

  const handleIncStep = (val: number) => {
    if (step < 10) setStep(val);
  };

  const handleDecStep = (val: number) => {
    if (step > 1) setStep(val);
  };

  return (
    <div className="relative">
      <Link href="/" className="absolute top-2 left-4 max-w-[110px]">
        <Image
          src={"/home/navbar/wizelogo.svg"}
          width={180}
          height={100}
          alt="logo"
          className="w-full h-auto drop-shadow-md"
        />
      </Link>
      <ScrollArea className="h-[calc(100vh-96px)]">
        <section
          className={`${step === 1 ? "flex" : "hidden"
            } h-[calc(100vh-96px)] max-w-3xl mx-auto flex flex-col justify-center`}
        >
          <div className="flex text-sm gap-4">
            <span>1/10 &nbsp; Create your profile</span>{" "}
            <span className="flex items-center">
              <Clock9 className="w-4 h-4" /> &nbsp; 5-10 min
            </span>
          </div>
          <h2 className="text-2xl font-medium my-4">
            How would you like to tell us about yourself?
          </h2>
          <p className="mb-8">
            We need to get a sense of your education, experience and skills.
            It&apos;s quickest to import your information — you can edit it
            before your profile goes live.
          </p>
          {/* <form className="flex-col flex max-w-sm gap-4"> */}
          {/* <Button
              type="button"
              className="bg-white text-primary border border-primary hover:bg-primary hover:text-white"
            >
              Manually enter details
            </Button> */}
          {/* <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              onClick={handleResumeUpload}
              className="bg-white text-primary rounded-lg text-center py-2 h-10 cursor-pointer hover:bg-primary hover:text-white duration-100 text-sm border border-primary"
            >
              Upload your Resume
            </label> */}
          {/* </form> */}

          {/* Similar cv uploader like cv reviewer */}
          <div className="flex text-center mb-4 mt-3 w-full text-2xl font-bold text-gray-800">
             Upload your latest CV/Resume
          </div>

          <div className="bg-white py-4 px-8 rounded-3xl w-full md:max-w-[350px] lg:max-w-[400px] shadow-lg text-center">
            <div className="flex items-center justify-center text-primary mb-2 relative top-0 text-3xl">
              <IoDocumentAttach />
            </div>

            <div
              className="border-dashed border-2 border-slate-500 rounded-xl p-2 flex flex-col items-center justify-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="text-gray-500 mt-2 text-sm">Drag & Drop or</div>
              <label
                htmlFor="resumeUpload"
                className="text-gray-500 cursor-pointer text-sm"
              >
                Click to{" "}
                <span className="font-semibold text-primary ">
                  Upload Resume
                </span>
              </label>
              <input
                id="resumeUpload"
                type="file"
                ref={fileInputRef}
                accept=".doc,.docx,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="text-4xl mt-3 text-slate-500">
                <IoCloudUploadOutline />
              </div>

              <p className="text-slate-500 text-sm mt-2">
                Supported file format: .PDF File size limit 1MB.
              </p>
            </div>

            <div className="flex justify-center mt-4">
              <button
                className="bg-primary text-base px-10 relative text-white font-semibold py-[6px] rounded-xl hover:bg-primary focus:ring-4 focus:ring-primary-foreground transition"
                onClick={handleResumeUpload}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline-block mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                {isResumeUploaded
                  ? "Upload again"
                  : uploading
                    ? "Uploading..."
                    : "Upload Resume"}
              </button>
            </div>
          </div>
        </section>

        <section
          className={`${step === 2 ? "flex" : "hidden"
            } h-[calc(100vh-96px)] max-w-4xl mx-auto flex flex-col justify-center overflow-scroll scrollbar-hide`}
        >
          <div className="text-sm">2/10</div>

          <h2 className="text-2xl font-medium my-4">
            Great, so what kind of work are you here to do?
          </h2>
          <p className="mb-8">
            Don&apos;t worry, you can change these choices later on.
          </p>
          <JobCategoriesSelector setStep={setStep} />
        </section>

        <section
          className={`${step === 3 ? "flex" : "hidden"
            } h-[calc(100vh-96px)] max-w-3xl mx-auto flex flex-col justify-center`}
        >
          <div className="text-sm">3/10</div>

          <h2 className="text-2xl font-medium my-4">
            Nearly there! What work are you here to do?
          </h2>
          <p className="mb-8">
            Your skills show clients what you can offer, and help us choose
            which jobs to recommend to you. Add or remove the ones we&apos;ve
            suggested, or start typing to pick more. It&apos;s up to you.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 max-w-3xl"
            >
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormDescription>
                      Press &quot;enter&quot; key to add skills
                    </FormDescription>
                    <FormControl>
                      <ArrayInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter skills required"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="hover:bg-primary-dark"
                disabled={form.formState.isSubmitting}
              >
                Submit
              </Button>
            </form>
          </Form>
        </section>

        <section
          className={`${step === 4 ? "flex" : "hidden"
            } h-[calc(100vh-96px)] max-w-3xl mx-auto flex flex-col justify-center`}
        >
          <div className="text-sm">4/10</div>

          <h2 className="text-2xl font-medium my-4">
            Got it. Now, add a title to tell the world what you do.
          </h2>
          <p className="mb-8">
            It&apos;s the very first thing clients see, so make it count. Stand
            out by describing your expertise in your own words.
          </p>
          <ProfessionalRole setStep={setStep} />
        </section>

        <section
          className={`${step === 5 ? "flex" : "hidden"
            } h-[calc(100vh-96px)] max-w-3xl mx-auto flex flex-col justify-center`}
        >
          <div className="text-sm">5/10</div>

          <h2 className="text-2xl font-medium my-4">
            If you have relevant work experience, add it here.
          </h2>
          <p className="mb-8">
            Freelancers who add their experience are twice as likely to win
            work. But if you&apos;re just starting out, you can still create a
            great profile. Just head on to the next page.
          </p>
          <WorkExperiences setStep={setStep} />
        </section>

        <section
          className={`${step === 6 ? "flex" : "hidden"
            } h-[calc(100vh-96px)] max-w-3xl mx-auto flex flex-col justify-center`}
        >
          <div className="text-sm">6/10</div>

          <h2 className="text-2xl font-medium my-4">
            Clients like to know what you know - add your education here.
          </h2>
          <p className="mb-8">
            You don&apos;t have to have a degree. Adding any relevant education
            helps make your profile more visible.
          </p>
          <EducationDetails setStep={setStep} />
        </section>

        <section
          className={`${step === 7 ? "flex" : "hidden"
            } h-[calc(100vh-96px)] max-w-3xl mx-auto flex flex-col justify-center`}
        >
          <div className="text-sm">7/10</div>

          <h2 className="text-2xl font-medium my-4">
            Looking good. Next, tell us which languages you speak.
          </h2>
          <p className="mb-8">
            Upwork is global, so clients are often interested to know what
            languages you speak. English is a must, but do you speak any other
            languages?
          </p>
          <LanguageSelector setStep={setStep} />
        </section>

        <section
          className={`${step === 8 ? "flex" : "hidden"
            } h-[calc(100vh-96px)] max-w-3xl mx-auto flex flex-col justify-center`}
        >
          <div className="text-sm">8/10</div>

          <h2 className="text-2xl font-medium my-4">
            Great. Now write a bio to tell the world about yourself.
          </h2>
          <p className="mb-8">
            Help people get to know you at a glance. What work do you do best?
            Tell them clearly, using paragraphs or bullet points. You can always
            edit later; just make sure you proofread now?
          </p>
          <BioDetails setStep={setStep} />
        </section>

        <section
          className={`${step === 9 ? "flex" : "hidden"
            } h-[calc(100vh-96px)] max-w-3xl mx-auto flex flex-col justify-center`}
        >
          <div className="text-sm">9/10</div>

          <h2 className="text-2xl font-medium my-4">
            Now, let&apos;s set your hourly rate.
          </h2>
          <p className="mb-8">
            Clients will see this rate on your profile and in search results
            once you publish your profile. You can adjust your rate every time
            you submit a proposal.
          </p>
          <HourlyRate setStep={setStep} />
        </section>

        <section
          className={`${step === 10 ? "flex" : "hidden"
            } h-[calc(100vh-96px)] max-w-6xl mx-auto flex flex-col justify-center`}
        >
          <div className="text-sm">10/10</div>

          <h2 className="text-2xl font-medium my-4">
            A few last details, then you can check and publish your profile.
          </h2>
          <p className="mb-8">
            A professional photo helps you build trust with your clients. To
            keep things safe and simple, they&apos;ll pay you through us - which
            is why we need your personal information.
          </p>
          <PersonalDetailsForm setStep={setStep} />
        </section>
      </ScrollArea>
      <div className="relative h-24 flex items-center">
        <div className="absolute top-0 bg-gray-300 h-1 w-full">
          <div
            className="h-1 rounded-r-lg bg-primary transition-all"
            style={{
              width: `${step * 10}%`,
            }}
          ></div>
        </div>
        <div className="px-8 flex justify-between w-full">
          <Button
            onClick={() => handleDecStep(step - 1)}
            className="bg-white border border-primary text-primary px-8"
          >
            Back
          </Button>{" "}
          <Button
            onClick={() => handleIncStep(step + 1)}
            className="bg-white border border-primary text-primary hover:bg-primary hover:text-white px-8"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
