import { z } from "zod"

export const talentPoolSchema = z.object({
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  profiles: z.array(z.string()).min(1, "At least one profile is required"),
  salary: z.string().min(1, "Salary is required"),
  locationPref: z.string().min(1, "Location preference is required"),
})

export type TalentPoolFormData = z.infer<typeof talentPoolSchema>
