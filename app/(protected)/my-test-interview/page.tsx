"use client";
import { Button } from "@/components/ui/button";
import CreateInterview from "./CreateInterview";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getInterviews } from "@/actions/interviewActions";
import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "@/utils/userStore";
import { verifyInterview } from "@/actions/interviewActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserIcon } from "lucide-react";

type Interview = {
  id: string;
};

export default function InterviewsPage() {
  const router = useRouter();
  const { userData } = useUserStore();
  const [interviews, setInterviews] = useState<Interview[]>([]);

  const fetchInterviews = useCallback(async (userId: string) => {
    const res = await getInterviews(userId);
    setInterviews(res);
  }, []);

  const routeInterview = async (interviewId: string, userId: string) => {
    const res = await verifyInterview({ interviewId, userId });
UserIcon
    if (res.status === "failed") {
      if (res.code === 3) toast.error("Interview not found");
      else toast.error(res.message);
    } else {
      router.push(`/my-test-interview/${interviewId}`);
    }
  };

  useEffect(() => {
    const userId = userData?.id;
    if (userId) {
      fetchInterviews(userId);
    }
  }, [userData?.id, fetchInterviews]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between gap-8 items-center mb-6">
        <h1 className="text-3xl font-bold">Past Interviews</h1>
        <CreateInterview />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {interviews.map((interview, index) => (
          <Button
            onClick={() => routeInterview(interview.id, userData?.id as string)}
            key={interview.id}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Interview #{index + 1}
                </CardTitle>
              </CardHeader>
            </Card>
          </Button>
        ))}
      </div>
    </div>
  );
}
