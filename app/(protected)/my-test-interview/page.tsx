"use client";
import Link from "next/link";
import CreateInterview from "./CreateInterview";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getInterviews } from "@/actions/interviewActions";
import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "@/utils/userStore";

type Interview = {
  id: string;
};

export default function InterviewsPage() {
  const { userData } = useUserStore();
  const [interviews, setInterviews] = useState<Interview[]>([]);

  const fetchInterviews = useCallback(async (userId: string) => {
    const res = await getInterviews(userId);
    setInterviews(res);
  }, []);

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
