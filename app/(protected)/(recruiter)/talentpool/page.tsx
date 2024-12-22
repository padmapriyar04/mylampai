import TalentPoolForm from "./TalentPoolForm";
import { getRecruiterTalentPool } from "@/actions/talentPoolActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, DollarSignIcon } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/authlib";

export default async function TalentPoolPage() {
  const user = await auth();

  if (!user || user.role !== "recruiter") {
    return <div>Unauthorized</div>;
  }

  const pools = await getRecruiterTalentPool(user.id);

  return (
    <div>
      <div>
        <h1>Talent Pools</h1>
        <div className="flex gap-4 p-4">
          {pools.map((pool) => (
            <Link href={`/talentpool/${pool.id}`} key={pool.id}>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Developer Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Skills</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {pool.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">Profiles</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {pool.profiles.map((prof) => (
                          <Badge key={prof} variant="outline">
                            {prof}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <DollarSignIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Salary: ₹{pool.salary}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Location Preference: {pool.locationPref}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      <span>
                        Created: {new Date(pool.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h2>Create Talent Pool</h2>
        <TalentPoolForm />
      </div>
    </div>
  );
}
