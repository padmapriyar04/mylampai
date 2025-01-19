import { z } from "zod";

export const profileDataSchema = z.object({
  resumeId: z.string().min(1, "Resume ID is required"),
  interviewId: z.string().min(1, "Interview ID is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  profiles: z.array(z.string()).min(1, "At least one profile is required"),
  certifications: z.array(z.string()),
  expectedSalary: z.string().min(1, "Expected salary is required"),
  locationPref: z.enum(["onsite", "remote", "hybrid"], {
    required_error: "Location preference is required",
  }),
  availability: z.enum(["FULL_TIME", "PART_TIME", "INTERN", "CONTRACT"], {
    required_error: "Availability is required",
  }),
  experienceYears: z.string().min(1, "Years of experience is required"),
});

export type ProfileDataType = z.infer<typeof profileDataSchema>;
