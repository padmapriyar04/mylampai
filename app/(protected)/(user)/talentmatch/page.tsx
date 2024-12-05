"use client";
import { useCallback, useEffect, useState } from "react";
import {
  getTalentMatches,
  createTalentProfile,
  getTalentProfiles,
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
import { X } from "lucide-react";
import {
  ProfileDataType,
  profileDataSchema,
} from "@/schemas/talentMatchSchema";

type TalentMatchType = {
  id: string;
  skills: string[];
  profiles: string[];
  salary: string;
  locationPref: string;
  experienceNeeded: string;
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
};

export default function TalentMatchPage() {
  const { userData } = useUserStore();
  const [talentMatches, setTalentMatches] = useState<TalentMatchType[]>([]);
  const [talentProfiles, setTalentProfiles] = useState<TalentProfileType[]>([]);

  const [submittedProfile, setSubmittedProfile] =
    useState<ProfileDataType | null>(null);

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

      const res = await createTalentProfile({ ...values, userId: userData.id });

      if (res === "success") {
        toast.success("Talent Profile created Successfully");
      } else {
        toast.error("Failed to create talent profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create talent profile");
    }
  }

  useEffect(() => {
    if (!userData || !userData.id) return;

    const handleGetTalentMatches = async (userId: string) => {
      try {
        const matches = await getTalentMatches(userId);

        if (matches && matches.length) {
          const talentPoolIds = matches.map((match) => match.talentPoolId);

          const fetchTalentPoolData = async (talentPoolIds: string[]) => {
            const talentPoolsData = await getTalentPoolsData(talentPoolIds);
            setTalentMatches(talentPoolsData);
          };

          fetchTalentPoolData(talentPoolIds);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchTalentProfile = async (userId: string) => {
      try {
        const profiles = await getTalentProfiles(userId);

        if (profiles) {
          setTalentProfiles(profiles);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchTalentProfile(userData.id);
    handleGetTalentMatches(userData.id);
  }, [userData]);

  return (
    <div>
      <h1>Talent Match</h1>
      <div>
        <h2>Matches</h2>
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
                  <FormLabel>Resume ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Resume ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interviewId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Interview ID" {...field} />
                  </FormControl>
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

        {submittedProfile && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Submitted Profile:</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
              {JSON.stringify(submittedProfile, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

interface ArrayInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}

function ArrayInput({ value, onChange, placeholder }: ArrayInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((item, index) => (
          <div
            key={index}
            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center"
          >
            {item}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-1 h-auto p-0"
              onClick={() => removeItem(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}
