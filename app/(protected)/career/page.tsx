"use client";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { getJobs } from "@/actions/careerActions";
import { Job } from "./job";

type Job = {
  id: string;
  jobTitle: string;
  jobDescription: string;
  company: string;
  startDate: Date;
  endDate: Date | null;
  registrationDeadline: Date;
  skills: string[];
  salary: string;
  location: string;
  availability: string;
};

export default function Career() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const [jobsData, setJobsData] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getJobs(Number(page));
        setJobsData(jobs);
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching jobs");
      }
    };

    fetchJobs();
  }, [page]);

  return (
    <>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobsData.map((job) => (
            <Job key={job.id} job={job} />
          ))}
        </div>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="/career" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={`/career?page=${page}`}>
              {page}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={`/career?page=${Number(page) + 1}`} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
