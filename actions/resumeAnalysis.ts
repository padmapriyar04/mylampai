"use server";

import prisma from "@/lib";

export type AnalysisDataType = {
    sectionanalysis: object;
    skillsassessment: object;
    quantification: object;
    repetition: object;
    verbstrength: object;
    verbtense: object;
    overusedphrases: object;
    spellingerrors: string[];
    genericpoints: string[];
    summary: string;
    score: number;
    cvId?:string
};

export const analysisResume = async (data: AnalysisDataType) => {
    try {
        // Ensure the input is valid and type-check
        if (!data || typeof data !== "object") {
            throw new Error("Data is missing or invalid");
        }

        const {
            sectionanalysis,
            skillsassessment,
            quantification,
            repetition,
            verbstrength,
            verbtense,
            overusedphrases,
            spellingerrors,
            genericpoints,
            summary,
            score,
            cvId
        } = data;

        // Validate required fields
        if (
            !sectionanalysis ||
            !skillsassessment ||
            !quantification ||
            !repetition ||
            !verbstrength ||
            !verbtense ||
            !overusedphrases ||
            !spellingerrors.length ||
            !genericpoints.length ||
            !summary ||
            !cvId ||
            typeof score !== "number"
        ) {
            return { error: "Missing required fields", status: 400 };
        }
        // console.log(userId)
        // Create ResumeAnalysis and link it with the user
        const response = await prisma.resumeAnalysis.create({
            data: {
                sectionanalysis,
                skillsassessment,
                quantification,
                repetition,
                verbstrength,
                verbtense,
                overusedphrases,
                spellingerrors,
                genericpoints,
                summary,
                score,
                cvId
            },
        });
        // Return response or error
        if (!response) {
            return { error: "Failed to create resume analysis", status: 500 };
        }

        return { success: true, data: response, status: 200 };
    } catch (error) {
        console.error("Error in analysisResume:", error);
        return { success: false, error: "Internal server error", status: 500 };
    }
};

export const fetchAnalysis = async (id: string) => {
    try {
        // Fetch analysis by id
        const response = await prisma.resumeAnalysis.findFirst({
            where: { cvId:id }
        });
        // Return response or error
        console.log(response)
        if (!response) {
            return { error: "Analysis not found", status: 404 };
        }
        return { success: true, data: response, status: 200 };
    } catch (error) {
        console.error("Error in fetchAnalysis:", error);
        return { success: false, error: "Internal server error", status: 500 };
        }
}
