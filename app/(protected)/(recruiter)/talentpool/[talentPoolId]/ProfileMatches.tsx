"use client";
import {
  matchTalentProfile,
  addUsersInTalentPool,
} from "@/actions/talentPoolActions";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  MapPinIcon,
  DollarSignIcon,
  ClockIcon,
  BriefcaseIcon,
} from "lucide-react";
import { toast } from "sonner";

type TalentPoolData = {
  id: string;
  skills: string[];
  profiles: string[];
  salary: string;
  locationPref: string;
};

interface DeveloperProfile {
  id: string;
  resumeId: string | null;
  interviewId: string | null;
  skills: string[];
  profiles: string[];
  certifications: string[];
  expectedSalary: string | null;
  locationPref: string | null;
  experienceYears: string | null;
  availability: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function ProfileMatches({
  poolData,
}: {
  poolData: TalentPoolData;
}) {
  const [profiles, setProfiles] = useState<DeveloperProfile[]>([]);

  const handleAddUser = useCallback(
    async (userId: string) => {
      try {
        const res = await addUsersInTalentPool({
          talentPoolId: poolData.id,
          talentIds: [userId],
        });
        if (res.status === "success") {
          toast.success(res.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [poolData]
  );

  const handleGetProfiles = useCallback(async () => {
    try {
      const res = await matchTalentProfile(poolData);
      // if (res) setProfiles(res);
    } catch (error) {
      console.error(error);
    }
  }, [poolData]);

  return (
    <div>
      <h1>Profile Matches</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <Card key={profile.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Developer {profile.id} Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Skills</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Profiles</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.profiles.map((prof) => (
                      <Badge key={prof} variant="outline">
                        {prof}
                      </Badge>
                    ))}
                  </div>
                </div>
                {profile.certifications.length > 0 && (
                  <div>
                    <h3 className="font-semibold">Certifications</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.certifications.map((cert) => (
                        <Badge key={cert} variant="default">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center">
                  <DollarSignIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>Expected Salary: ${profile.expectedSalary}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>Location Preference: {profile.locationPref}</span>
                </div>
                <div className="flex items-center">
                  <BriefcaseIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>Experience: {profile.experienceYears} years</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>Availability: {profile.availability}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>
                    Created: {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Button type="button" onClick={() => handleAddUser(profile.userId)}>
                  Add User
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button type="button" onClick={handleGetProfiles}>
        Get Profiles
      </Button>
    </div>
  );
}
