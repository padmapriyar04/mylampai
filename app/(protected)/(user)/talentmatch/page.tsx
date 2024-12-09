"use client";
import { useEffect, useState } from "react";
import {
  getTalentMatches,
  createTalentProfile,
  getTalentProfiles,
  acceptTalentMatch,
  getResumeAndInterviewIds,
} from "@/actions/talentMatchActions";
import { getTalentPoolsData } from "@/actions/talentPoolActions";
import { useUserStore } from "@/utils/userStore";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { ArrayInput } from "@/components/misc/ArrayInput";
import { TalentProfileCard } from "./TalentProfileCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, IndianRupee } from "lucide-react";

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
  resumeId: string;
  interviewId: string;
  skills: string[];
  profiles: string[];
  certifications: string[];
  expectedSalary: string;
  locationPref: string;
  experienceYears: string;
  availability: string;
};

type IdsType = {
  id: string;
};

export default function TalentMatchPage() {
  const { userData } = useUserStore();
  const [talentMatches, setTalentMatches] = useState<TalentMatchType[]>([]);
  const [talentProfiles, setTalentProfiles] = useState<TalentProfileType[]>([]);
  const [resumeIds, setResumeIds] = useState<IdsType[]>([]);
  const [interviewIds, setInterviewIds] = useState<IdsType[]>([]);

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
      availability: "full-time",
      experienceYears: "",
    },
  });

  async function onSubmit(values: ProfileDataType) {
    try {
      if (!userData) return;

      const userName = userData.name || "No Name";

      const res = await createTalentProfile({
        ...values,
        userId: userData.id,
        userName,
      });

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
    <div>
      <h1>Talent Match</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {talentMatches.map((match, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Talent Match</CardTitle>
            </CardHeader>
            <CardContent>
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
              <Button onClick={() => handleConfirmMatch(match.matchId)}>
                Confirm Match
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
        <h2>Matches</h2>
      </div>
      <h2>Talent Profile</h2>
      <div className="flex items-center">
        {talentProfiles.map((profile) => (
          <TalentProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
      <div>
        <h2>Create Talent Profile</h2>
      </div>
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="resumeId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select resume preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resumeIds.map((id, index) => (
                        <SelectItem key={index} value={id.id}>
                          {id.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interviewId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interview preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {interviewIds.map((id, index) => (
                        <SelectItem key={index} value={id.id}>
                          {id.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <ArrayInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Enter a skill and press Enter"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your skills and press Enter to add them.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profiles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profiles</FormLabel>
                  <FormControl>
                    <ArrayInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Enter a profile and press Enter"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your profiles and press Enter to add them.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="certifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certifications</FormLabel>
                  <FormControl>
                    <ArrayInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Enter a certification and press Enter"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your certifications and press Enter to add them.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expectedSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Salary</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter expected salary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locationPref"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Preference</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="onsite">Onsite</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experienceYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter years of experience" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
