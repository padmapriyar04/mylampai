import JobForm from "./JobForm";
import { JobCard } from "./jobCard";
import { getRecruiterJobs } from "@/actions/createJobActions";

export default async function CreateJobPage() {
  const res = await getRecruiterJobs();

  return (
    <div>
      {res.status === "success" ? (
        <div className="flex">
          {res.data?.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>
      ) : (
        <>
          <h1>Failed to fetch jobs</h1>
        </>
      )}
      <JobForm />
    </div>
  );
}
