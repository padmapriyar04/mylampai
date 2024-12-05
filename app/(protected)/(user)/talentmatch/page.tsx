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

type ProfileDataType = {
  resumeId: string;
  interviewId: string;
  skills: string[];
  profiles: string[];
  certifications: string[];
  expectedSalary: string;
  locationPref: "onsite" | "remote" | "hybrid";
  availability: "full-time" | "part-time";
  experienceYears: string;
  userId: string;
};

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
  
  const [profileData, setProfileData] = useState<ProfileDataType | null>(null);

  const createProfile = async () => {
    try {
      if (!profileData) return;

      const res = await createTalentProfile(profileData);

      if (res === "success") {
        toast.success("Talent Profile created Successfully");
      } else {
        toast.error("Failed to create talent profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create talent profile");
    }
  };

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
    </div>
  );
}
