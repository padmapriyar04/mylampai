"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { applyJob } from "@/actions/careerActions";

export default function ApplyJob({ jobProfileId }: { jobProfileId: string }) {
  const handleApply = async () => {
    const res = await applyJob(jobProfileId);

    if (res.status === "success") {
      toast.success("Applied successfully");
    } else {
      toast.error("Failed to apply");
    }
  };

  return (
    <Button
      type="button"
      onClick={handleApply}
      className="absolute top-8 right-8"
    >
      Apply
    </Button>
  );
}
