"use server";
import prisma from "@/lib/index";

type JobDataType = {
  jobTitle: string;
  jobRole: string;
  jobDescription: string;
  company: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  skills: string[];
  profiles: string[];
  location: string;
  salary: string;
  availability: "FULL_TIME" | "PART_TIME" | "INTERN" | "CONTRACT";
};

export const createJob = async (jobData: JobDataType, userId: string) => {
  try {
    await prisma.jobProfile.create({
      data: {
        ...jobData,
        userId,
      },
    });

    return "success";
  } catch (error) {
    console.error(error);
    return "failed";
  }
};

type RoundType = {
  roundName: string;
  roundNumber: number;
  details: string;
  roundType: string;
  roundDate: Date;
  jobProfileId: string;
};

export const addRounds = async (rounds: RoundType[]) => {
  try {
    await prisma.jobRound.createMany({
      data: rounds,
    });

    return "success";
  } catch (error) {
    console.error(error);
    return "failed";
  }
};

type CandidateDataType = {
  candidateId: string;
  score: number;
};

export const updateCandidates = async (
  candidates: CandidateDataType[],
  jobRoundId: string,
  jobProfileId: string
) => {
  try {
    const candidateData = candidates.map((candidate) => {
      return {
        ...candidate,
        jobRoundId,
      };
    });

    return "success";
  } catch (error) {
    console.error(error);
    return "failed";
  }
};

export const updateJobStatus = async (
  jobProfileId: string,
  status: string,
  candidates: CandidateDataType[]
) => {
  try {
    return "success";
  } catch (error) {
    console.error(error);
    return "failed";
  }
};
