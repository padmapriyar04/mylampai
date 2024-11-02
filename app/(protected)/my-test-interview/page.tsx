import Link from "next/link";
import CreateInterview from "./CreateInterview";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getInterviews } from "@/actions/interviewActions";

type Interview = {
  id: string;
};

export default async function InterviewsPage() {
  const userId = "67265e2620b1febba1857c93";
  const interviews: Interview[] = await getInterviews(userId);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Interviews</h1>
        <CreateInterview />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {interviews.map((interview, index) => (
          <Link href={`/my-test-interview/${interview.id}`} key={interview.id}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Interview #{index + 1}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
