"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  getTalentMatches,
  getTalentProfiles,
  acceptTalentMatch,
  getResumeAndInterviewIds,
  uploadResumeToAzure,
  updateTalentProfile,
} from "@/actions/talentMatchActions";
import { getTalentPoolsData } from "@/actions/talentPoolActions";
import { useUserStore } from "@/utils/userStore";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CirclePlus, Lock, FileText, TvMinimal } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ProfileDataType,
  profileDataSchema,
} from "@/schemas/talentMatchSchema";
import * as pdfjsLib from "pdfjs-dist";
import { ArrayInput } from "@/components/misc/ArrayInput";
import { TalentProfileCard } from "./TalentProfileCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, IndianRupee } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { TalentProfile } from "@prisma/client";
import TalentMatchCSS from "./Talent.module.css";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

type TalentMatchType = {
  id: string;
  skills: string[];
  profiles: string[];
  salary: string;
  locationPref: string;
  isMatched: boolean;
  matchId: string;
};

type IdsType = {
  id: string;
};

const baseUrl = "https://optim-cv-judge.onrender.com";

type StructuredData = {
  "Personal Information": {
    [key: string]: string;
  };
  Description: string[];
  Skills: {
    HARD: string[];
    SOFT: string[];
  };
  Education: {
    [key: string]: string;
  }[];
  Sections: string[];
  Interests: string[];
  Projects: {
    [key: string]: string | string[];
  }[];
  "Work Experience": {
    [key: string]: string | string[];
  }[];
};

const newProfileSchema = z.object({
  resumeUrl: z.string(),
  title: z.string(),
  availability: z.enum(["FULL_TIME", "PART_TIME", "FREELANCE"]),
  interview: z.date(),
});

export default function TalentMatchPage() {
  const [open, setOpen] = useState(false);
  const { userData } = useUserStore();
  const [selectedProfieIndex, setSelectedProfileIndex] = useState<
    number | null
  >(null);
  const [talentMatches, setTalentMatches] = useState<TalentMatchType[]>([]);
  const [talentProfiles, setTalentProfiles] = useState<TalentProfile[]>([]);
  // const [resumeIds, setResumeIds] = useState<IdsType[]>([]);
  // const [interviewIds, setInterviewIds] = useState<IdsType[]>([]);
  const structuredData = useRef<StructuredData | null>(null);

  const [profileId, setProfileId] = useState<string | null>(null);

  const form = useForm<ProfileDataType>({
    resolver: zodResolver(profileDataSchema),
    defaultValues: {
      resumeId: "",
      interviewId: "",
      skills: [],
      profiles: [],
      certifications: [],
      expectedSalary: "",
      locationPref: "onsite",
      availability: "FULL_TIME",
      experienceYears: "",
    },
  });

  const createProfile = useForm<z.infer<typeof newProfileSchema>>({
    resolver: zodResolver(newProfileSchema),
    defaultValues: {
      resumeUrl: "",
      title: "",
      availability: "FULL_TIME",
      interview: new Date(),
    },
  });

  async function onSubmit(values: ProfileDataType) {
    try {
      if (!userData || !profileId) return;

      const userName = userData.name || "No Name";

      const res = await updateTalentProfile(
        {
          ...values,
          userName,
        },
        profileId
      );

      if (res === "success") {
        form.reset();
        toast.success("Talent Profile created Successfully");
      } else {
        toast.error("Failed to create talent profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create talent profile");
    }
  }

  async function onSubmitProfile(values: z.infer<typeof newProfileSchema>) {
    try {
    } catch (error) {
      console.error(error);
      toast.error("Failed to create talent profile");
    }
  }

  const extractStructuredData = useCallback(async (text: string) => {
    try {
      const response = await fetch(`${baseUrl}/extract_structured_data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cv_text: text }),
      });

      const result = await response.json();

      return response.ok ? result.message : null;
    } catch (error) {
      return null;
    }
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const file = event.target.files?.[0];

    if (!file || file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      toast.error("File size should not exceed 1MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadResumeToAzure(formData);

      if (res.status === "failed") {
        toast.error(res.message);
        return;
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to upload resume");
      return;
    }

    const fileReader = new FileReader();
    let extractedText = "";

    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result as ArrayBuffer);

      const pdf = await pdfjsLib.getDocument(typedArray).promise;

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        extractedText += pageText + "\n";
      }

      if (!extractedText) {
        toast.error("Error extracting text");
        return;
      }

      const structuredDataResult = await extractStructuredData(extractedText);

      if (!structuredDataResult) {
        toast.error("Failed to analyse resume");
        return;
      }

      structuredData.current = structuredDataResult;

      console.log(structuredDataResult);
    };

    fileReader.readAsArrayBuffer(file);
  };

  const handleConfirmMatch = async (matchId: string) => {
    try {
      const res = await acceptTalentMatch(matchId);

      if (res === "success") {
        toast.success("Match confirmed successfully");
      } else {
        toast.error("Failed to confirm match");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to confirm match");
    }
  };

  useEffect(() => {
    if (!userData || !userData.id) return;

    const fetchIds = async () => {
      try {
        // const ids = await getResumeAndInterviewIds(userData?.id);
        // if (ids.status === "success") {
        //   setResumeIds(ids.cvIds);
        //   setInterviewIds(ids.interviewIds);
        // }
      } catch (error) {
        console.error("Error fetching resume id:", error);
      }
    };

    fetchIds();
  }, [userData]);

  useEffect(() => {
    if (!userData || !userData.id) return;

    const fetchData = async (userId: string) => {
      try {
        const [matches, profiles] = await Promise.all([
          getTalentMatches(userId),
          getTalentProfiles(userId),
        ]);

        if (profiles) {
          setTalentProfiles(profiles);
        }

        if (matches && matches.length) {
          const talentPoolIds = matches.map((match) => match.talentPoolId);
          const talentPoolsData = await getTalentPoolsData(talentPoolIds);

          const mergedData = matches.map((match, index) => ({
            matchId: match.id,
            isMatched: match.isMatched,
            ...(talentPoolsData[index] || {}),
          }));

          setTalentMatches(mergedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(userData.id);
  }, [userData]);

  return (
    <div className="flex">
      <ScrollArea className="h-screen w-[42.5%] border-r">
        <div className="p-4">
          <div className="h-48 flex items-center border rounded-lg">
            <div
              className={`${TalentMatchCSS.verticalText} h-full text-white rounded-lg px-2 text-center bg-primary`}
            >
              Your Matches
            </div>
            <div className="w-full flex justify-center py-2">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="flex flex-col border my-4 rounded-lg min-h-[calc(100vh-256px)]">
            <div className="border-b py-3 px-5 flex  text-sm gap-4 ">
              <div className="font-medium cursor-pointer">Career Profile</div>
              <div className="text-muted-foreground">Work Preference</div>
            </div>
            <div className="p-4 flex flex-col gap-4 flex-1">
              {talentProfiles.map((profile, index) => (
                <div
                  key={index}
                  className="border p-4 flex flex-col gap-1 rounded-lg shadow-sm cursor-pointer"
                  onClick={() => setSelectedProfileIndex(index)}
                >
                  <p className="rounded-lg ">{profile.title}</p>
                  <p className="text-muted-foreground">
                    Availability: Full Time
                  </p>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <FileText className="w-6 h-6" /> Resume
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <TvMinimal className="w-6 h-6" /> Interview
                  </div>
                </div>
              ))}
            </div>
            <div className="m-auto mb-4">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="m-auto">Create Talent Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add another section</DialogTitle>
                  </DialogHeader>
                  <Form {...createProfile}>
                    <form
                      onSubmit={createProfile.handleSubmit(onSubmitProfile)}
                      className="space-y-4"
                    >
                      <FormField
                        control={createProfile.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Section Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter the title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createProfile.control}
                        name="availability"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Availability</FormLabel>
                            <Select {...field} defaultValue="FULL_TIME">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="FULL_TIME">
                                  Full Time
                                </SelectItem>
                                <SelectItem value="PART_TIME">
                                  Part Time
                                </SelectItem>
                                <SelectItem value="FREELANCE">
                                  Freelance
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createProfile.control}
                        name="interview"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date (Optional)</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-[240px] pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit">Save Education</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </ScrollArea>
      <ScrollArea className="h-screen w-[57.5%] ">
        {selectedProfieIndex && (
          <TalentProfileCard profile={talentProfiles[selectedProfieIndex]} />
        )}
      </ScrollArea>
    </div>
  );
}
