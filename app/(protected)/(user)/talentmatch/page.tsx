"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  getTalentMatches,
  createTalentProfile,
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
import { CirclePlus } from "lucide-react";
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
import {
  ProfileDataType,
  profileDataSchema,
} from "@/schemas/talentMatchSchema";
import { generateSasToken } from "@/actions/azureActions";
import * as pdfjsLib from "pdfjs-dist";
import { ArrayInput } from "@/components/misc/ArrayInput";
import { TalentProfileCard } from "./TalentProfileCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, IndianRupee } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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

type TalentProfileType = {
  id: string;
  resumeId: string | null;
  interviewId: string | null;
  skills: string[];
  profiles: string[];
  certifications: string[];
  expectedSalary: string | null;
  locationPref: string | null;
  availability: string | null;
  experienceYears: string | null;
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

export default function TalentMatchPage() {
  const { userData } = useUserStore();
  const [talentMatches, setTalentMatches] = useState<TalentMatchType[]>([]);
  const [talentProfiles, setTalentProfiles] = useState<TalentProfileType[]>([]);
  const [resumeIds, setResumeIds] = useState<IdsType[]>([]);
  const [interviewIds, setInterviewIds] = useState<IdsType[]>([]);
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
        const ids = await getResumeAndInterviewIds(userData?.id);

        if (ids.status === "success") {
          setResumeIds(ids.cvIds);
          setInterviewIds(ids.interviewIds);
        }
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
    <div className="flex  ">
      <ScrollArea className="h-screen w-[42.5%]">
        <div>
          <div className="w-full flex py-2">
            {talentMatches.map((match, index) => (
              <div
                key={index}
                className="scale-75 border-primary border rounded-lg"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {match.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Profiles</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {match.profiles.map((profile) => (
                        <Badge key={profile} variant="outline">
                          {profile}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Salary: ₹{match.salary}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Location Preference: {match.locationPref}</span>
                  </div>
                </div>
                {!match.isMatched ? (
                  <Button onClick={() => handleConfirmMatch(match.matchId)}>
                    Confirm Match
                  </Button>
                ) : (
                  <Badge variant="outline">Match Confirmed</Badge>
                )}
              </div>
            ))}
            {talentMatches.map((match, index) => (
              <div key={index} className="p-4 border-primary border rounded-lg">
                <div className="space-y-4">
                  <div className="flex justify-start gap-2">
                    <h3 className="font-semibold mt-2">Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {match.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-start gap-2">
                    <h3 className="font-semibold mt-2">Profiles</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {match.profiles.map((profile) => (
                        <Badge key={profile} variant="outline">
                          {profile}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Salary: ₹{match.salary}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Location Preference: {match.locationPref}</span>
                  </div>
                </div>
                {!match.isMatched ? (
                  <Button onClick={() => handleConfirmMatch(match.matchId)}>
                    Confirm Match
                  </Button>
                ) : (
                  <Badge variant="outline">Match Confirmed</Badge>
                )}
              </div>
            ))}
            {talentMatches.map((match, index) => (
              <div
                key={index}
                className="scale-75 border-primary border rounded-lg"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {match.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Profiles</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {match.profiles.map((profile) => (
                        <Badge key={profile} variant="outline">
                          {profile}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Salary: ₹{match.salary}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Location Preference: {match.locationPref}</span>
                  </div>
                </div>
                {!match.isMatched ? (
                  <Button onClick={() => handleConfirmMatch(match.matchId)}>
                    Confirm Match
                  </Button>
                ) : (
                  <Badge variant="outline">Match Confirmed</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          {talentProfiles.map((profile, index) => (
            <div key={index}>
              <div>
                {profile.profiles.map((item, ind) => (
                  <Badge key={ind} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button type="button">Create new profile</Button>
        <Input type="file" onChange={handleFileChange} />
      </ScrollArea>
      <ScrollArea className="h-screen w-[57.5%] ">
        <div>
          <div className="flex items-center">
            {talentProfiles.map((profile) => (
              <TalentProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
