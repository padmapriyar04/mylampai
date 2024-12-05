"use client";
import { createTalentPool } from "@/actions/talentPoolActions";
import { useState } from "react";
import { toast } from "sonner";

type TalentPoolType = {
  id: string;
  userId: string;
  skills: string[];
  profiles: string[];
  salary: string;
  locationPref: string;
  experienceNeeded: string;
};

export default function TalentPoolPage() {
  const [talentPool, setTalentPool] = useState<TalentPoolType | null>(null);

  const createTalent = async () => {
    try {
      if (!talentPool) return;

      const res = await createTalentPool(talentPool);

      if (res === "success") {
        toast.success("Successfully created talent pool");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to created Talent");
    }
  };

  return (
    <div>
      <h1>Talent Pool</h1>
      <div>
        <h2>Create Talent Pool</h2>
        {/* Create Talent Pool Form */}
      </div>
    </div>
  );
}
