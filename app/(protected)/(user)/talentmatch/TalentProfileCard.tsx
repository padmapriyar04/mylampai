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
import { Education, Employment, TalentProfile } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { getUserEducations } from "@/actions/profileActions";
import { useProfileStore } from "@/utils/profileStore";
import { getProfileEmployments } from "@/actions/talentMatchActions";
import exp from "constants";

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

export function TalentProfileCard({ profile }: { profile: TalentProfile }) {
  const { userData } = useUserStore();
  const { id } = useProfileStore();
  const [education, setEducation] = useState<Education[] | null>(null);
  const [experience, setExperience] = useState<Employment[] | null>(null);

  const getExperiences = async () => {
    try {
      if (!id) return;
      const experiences = await getProfileEmployments(id);
      setExperience(experiences);
      console.log(experiences);
    } catch (error) {
      console.error("Error getting experiences:", error);
    }
  };

  const getEducations = async () => {
    if (education) return;
    if (!userData || !userData.id) return;
    try {
      const educations = await getUserEducations(userData.id);
      setEducation(educations);
    } catch (error) {
      console.error("Error getting educations:", error);
    }
  };

  useEffect(() => {}, []);

  if (!userData) return null;

  return (
    <div className="mx-auto">
      <div className="flex items-center gap-4 h-32 relative bg-gray-100">
        <Avatar className="h-24 w-24 rounded-lg absolute -bottom-8 left-8 shadow-lg ">
          <AvatarImage src={userData?.image} alt={userData?.name} />
          <AvatarFallback className="rounded-lg cursor-default">
            {userData?.name ? userData?.name : "User"}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="px-8 mt-12">
        <h2 className="text-2xl font-semibold">{userData?.name}</h2>
        <p className="text-muted-foreground">{profile?.title}</p>
        <p></p>
      </div>
      <Tabs defaultValue="account" className="w-full px-8 mt-8">
        <TabsList className="w-full justify-start p-2 gap-4 h-auto">
          <TabsTrigger
            className="py-2"
            value="education"
            onClick={getEducations}
          >
            Education
          </TabsTrigger>
          <TabsTrigger
            className="py-2"
            value="experience"
            onClick={getExperiences}
          >
            Experience
          </TabsTrigger>
        </TabsList>
        <TabsContent value="education" className="px-1">
          {education?.map((edu, index) => (
            <div key={index} className="mt-4">
              <h3 className="font-semibold text-lg">{edu.school}</h3>
              <p className="text-muted-foreground">
                <span className="">{edu.degree}</span>
                &nbsp;-&nbsp;
                <span>{edu.field}</span>
              </p>
              <p>
                <span className="text-muted-foreground text-sm">
                  {edu?.startDate?.toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                &nbsp;-&nbsp;
                <span className="text-muted-foreground text-sm">
                  {edu?.endDate?.toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="experience">
          {experience?.map((exp, index) => (
            <div key={index} className="mt-4">
              <h3 className="font-semibold text-lg">{exp.company}</h3>
              <div className="text-muted-foreground">
                <p className="">{exp.position}</p>

                <div>
                  <span className="text-muted-foreground text-sm">
                    &nbsp;-&nbsp;
                    {exp?.endDate?.toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p>{exp.location}</p>
              </div>
              <p>
                <span className="text-muted-foreground text-sm">
                  {exp?.startDate?.toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="text-muted-foreground text-sm">
                  &nbsp;-&nbsp;
                  {exp?.endDate?.toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* <div className="space-y-4 ">
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
      </div> */}
    </div>
  );
}
