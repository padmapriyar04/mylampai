"use server";
import { auth } from "@/lib/authlib";
import {
  Lock,
  FileText,
  TvMinimal,
  BriefcaseBusiness,
  Eye,
  CalendarCheck2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TalentMatchCSS from "./Talent.module.css";
import CreateTalenProfileDialog from "./CreateTalentProfile";
import { getTalentProfiles } from "@/actions/talentMatchActions";
import { Badge } from "@/components/ui/badge";
import PdfToImage from "@/components/misc/pdftoimg";

export default async function TalentMatchPage() {
  const user = await auth();

  if (!user) {
    return null;
  }

  const talentProfiles = await getTalentProfiles(user.id);

  return (
    <div className="flex sm:flex-row flex-col p-2 sm:pr-2">
      <ScrollArea className="h-60 sm:h-screen w-full sm:w-5/12 sm:p-4">
        <div className="h-52 sm:h-[calc(100vh-2rem)] flex items-center border rounded-lg">
          <div
            className={`${TalentMatchCSS.verticalText} h-full text-white rounded-r-lg px-2 text-center bg-primary`}
          >
            Your Matches
          </div>
          <div className="w-full flex flex-col items-center justify-center py-2">
            <Lock className="w-8 h-8 text-primary" />
            <div className="text-center max-w-[400px] text-sm text-muted-foreground mt-2 p-4">
              Complete your profile and attempt the AI interview to be
              considered for the talent pool.
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="flex flex-col border my-4 w-full sm:w-7/12 rounded-lg h-[calc(100vh-2rem)]">
        <div className="border-b py-3 px-5 flex relative text-sm gap-4 ">
          {talentProfiles && talentProfiles.length < 4 && (
            <CreateTalenProfileDialog />
          )}
          <div className="font-medium cursor-pointer">Career Profile</div>
          <div className="text-muted-foreground">Work Preference</div>
        </div>
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="flex flex-col gap-2 p-2">
            {talentProfiles?.map((profile, index) => (
              <div
                key={index}
                className="border p-4 flex flex-col gap-4 rounded-lg shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <BriefcaseBusiness className="w-12 h-12 bg-primary text-white rounded-lg p-3 " />
                  <h2 className="text-xl font-semibold uppercase">
                    {profile.title}
                  </h2>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Experts in</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 justify-between items-start">
                  <div className="w-full">
                    <h3 className="font-medium mb-2">Looking for</h3>
                    {profile.target && (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="capitalize"
                      >
                        {profile.target.toLowerCase()}
                      </Badge>
                    )}
                  </div>
                  <div className="w-full">
                    <h3 className="font-medium mb-2">Availability</h3>
                    {profile.target && (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="capitalize"
                      >
                        {profile.availability?.toLowerCase().replace("_", " ")}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="border w-full bg-muted-foreground"></div>
                <div className="flex justify-between flex-col md:flex-row gap-8 sm:gap-4 items-start mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground w-full ">
                    <div className="flex gap-2 justify-center items-center bg-accent text-accent-foreground relative h-8 rounded-lg w-full sm:w-[150px] text-center text-sm">
                      <div className="absolute bottom-0 translate-y-full text-xs italic font-light left-16 w-full">
                        resume uploaded
                      </div>
                      <FileText className="w-4 h-4" /> Resume
                    </div>
                    <div className="bg-primary text-white rounded-lg">
                      <PdfToImage pdfUrl={profile.resumeUrl} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground w-full">
                    <div className="flex gap-2 justify-center items-center bg-accent text-accent-foreground relative h-8 rounded-lg w-full sm:w-[150px] text-center text-sm">
                      <div className="absolute bottom-0 translate-y-full text-xs italic font-light left-12 w-[250px]">
                        scheduled on{" "}
                        {profile.interviewDate &&
                          new Date(profile.interviewDate).toLocaleString(
                            "en-IN",
                            { timeZone: "Asia/Kolkata" }
                          )}
                      </div>
                      <TvMinimal className="w-4 h-4" /> Interview
                    </div>
                    <div className="bg-primary text-white p-2 rounded-lg">
                      <CalendarCheck2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
