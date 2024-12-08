import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, ClockIcon } from "lucide-react";
import Link from "next/link";

interface JobProps {
  job: {
    id: string;
    jobTitle: string;
    skills: string[];
    jobRole: string;
    company: string;
    startDate: Date;
    salary: string;
    location: string;
    availability: string;
  };
}

export function JobCard({ job }: JobProps) {
  return (
    <Link href={`/job/${job.id}`}>
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>{job.jobTitle}</CardTitle>
          <p className="text-sm text-muted-foreground">{job.company}</p>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-2" />
              {job.location}
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-2" />
              {job.availability}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm font-semibold">Salary: ${job.salary}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
