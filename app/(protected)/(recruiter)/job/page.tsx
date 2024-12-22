import JobForm from "./JobForm";
import { JobCard } from "./jobCard";
import { getRecruiterJobs } from "@/actions/createJobActions";
import { auth } from "@/lib/authlib";

export default async function CreateJobPage() {
  const user = await auth();

  if (!user) {
    return <h1>Not authorized</h1>;
  }

  const res = await getRecruiterJobs(user.id);

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
