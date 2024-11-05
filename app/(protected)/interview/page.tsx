"use client";
import { Button } from "@/components/ui/button";
import CreateInterview from "./CreateInterview";
import { getInterviews } from "@/actions/interviewActions";
import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "@/utils/userStore";
import { verifyInterview } from "@/actions/interviewActions";
import { toast } from "sonner";
import FullScreenLoader from "@/components/global/FullScreenLoader";
import { useRouter } from "next/navigation";

type Interview = {
  id: string;
};

export default function InterviewsPage() {
  const router = useRouter();
  const { userData } = useUserStore();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInterviews = useCallback(async (userId: string) => {
    const res = await getInterviews(userId);
    setInterviews(res);
  }, []);

  const onSelectInterview = async (interviewId: string, userId: string) => {
    const res = await verifyInterview({ interviewId, userId });

    if (res.status === "failed") {
      if (res.code === 3) toast.error("Interview not found");
      else toast.error(res.message);
    } else {
      setLoading(true);
      router.push(`/interview/${interviewId}`);
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
      {loading && <FullScreenLoader message="Starting Interview" />}
      <div className="flex justify-between gap-8 items-center mb-6">
        <h1 className="text-3xl font-bold">Past Interviews</h1>
        <CreateInterview />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {interviews?.map((interview, index) => (
          <Button
            key={index}
            onClick={() =>
              onSelectInterview(interview.id, userData?.id as string)
            }
            className="w-full p-4"
            variant="outline"
          >
            Interview #{index + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}
