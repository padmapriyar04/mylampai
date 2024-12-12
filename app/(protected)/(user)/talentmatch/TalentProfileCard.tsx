import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPinIcon,
  ClockIcon,
  DollarSignIcon,
  BriefcaseIcon,
  AwardIcon,
} from "lucide-react";
import { useUserStore } from "@/utils/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TalentProfile {
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
}

interface TalentProfileCardProps {
  profile: TalentProfile;
}

const ProfileDetail = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}) => (
  <div className="flex items-center space-x-2 text-sm">
    {icon}
    <span className="font-medium">{label}:</span>
    <span>{value}</span>
  </div>
);

const TagList = ({ title, items }: { title: string; items: string[] }) => (
  <div className="mt-4">
    <h3 className="font-semibold mb-2">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <Badge key={index} variant="secondary">
          {item}
        </Badge>
      ))}
    </div>
  </div>
);

export function TalentProfileCard({ profile }: TalentProfileCardProps) {
  const { userData } = useUserStore();

  if (!userData) return null;

  return (
    <div className="mx-auto">
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24 rounded-lg">
          <AvatarImage src={userData?.image} alt={userData?.name} />
          <AvatarFallback className="rounded-lg cursor-default">
            {userData?.name ? userData?.name : "User"}
          </AvatarFallback>
        </Avatar>
        <div className="text-2xl font-semibold">{userData?.name}</div>
      </div>
      <div className="space-y-4 ">
        {profile.experienceYears && (
          <ProfileDetail
            icon={<BriefcaseIcon className="h-4 w-4" />}
            label="Experience"
            value={`${profile.experienceYears} ${
              parseInt(profile.experienceYears) === 1 ? "year" : "years"
            }`}
          />
        )}
        <ProfileDetail
          icon={<MapPinIcon className="h-4 w-4" />}
          label="Location Preference"
          value={profile.locationPref}
        />
        <ProfileDetail
          icon={<ClockIcon className="h-4 w-4" />}
          label="Availability"
          value={profile.availability}
        />
        <ProfileDetail
          icon={<DollarSignIcon className="h-4 w-4" />}
          label="Expected Salary"
          value={profile.expectedSalary}
        />

        <TagList title="Skills" items={profile.skills} />
        <TagList title="Profiles" items={profile.profiles} />

        {profile.certifications.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2 flex items-center">
              <AwardIcon className="h-4 w-4 mr-2" />
              Certifications
            </h3>
            <ul className="list-disc list-inside">
              {profile.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          <p>Resume ID: {profile.resumeId}</p>
          <p>Interview ID: {profile.interviewId}</p>
        </div>
      </div>
    </div>
  );
}
