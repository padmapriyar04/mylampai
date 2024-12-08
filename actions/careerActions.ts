"use server";
import prisma from "@/lib/index";

type CandidateDataType = {
  candidateId: string;
  score: number;
  jobProfileId: string;
};

export const applyJob = async (candidateData: CandidateDataType) => {
  try {
    await prisma.jobCandidate.create({
      data: {
        ...candidateData,
      },
    });

    return "success";
  } catch (error) {
    console.error(error);
    return "failed";
  }
};

export const getJobs = async (page: number) => {
  try {
    const jobs = await prisma.jobProfile.findMany({
      skip: (page - 1) * 10,
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        jobTitle: true,
        company: true,
        startDate: true,
        endDate: true,
        registrationDeadline: true,
        jobDescription: true,
        location: true,
        skills: true,
        availability: true,
        salary: true,
      }
    });

    return jobs;
  } catch (error) {
    console.error(error);
    return [];
  }
};
