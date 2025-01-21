import { AnalysisDataType, analysisResume } from "@/actions/resumeAnalysis";
import transformKeys from "@/lib/converter";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const POST = async (req: NextRequest) => {
    const baseUrl = process.env.NEXT_PUBLIC_RESUME_API_ENDPOINT?.trim();
    const jwtSecret = process.env.JWT_SECRET;

    if (!baseUrl) {
        return NextResponse.json(
            { message: "NEXT_PUBLIC_RESUME_API_ENDPOINT environment variable is not set" },
            { status: 500 }
        );
    }

    if (!jwtSecret) {
        return NextResponse.json(
            { error: "Server misconfiguration: JWT_SECRET is not set" },
            { status: 500 }
        );
    }

    let decodedToken: { id: string } | null = null;

    try {
        // Validate Authorization Header
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized: Missing or invalid token" }, { status: 401 });
        }

        // Extract and verify JWT token
        const token = authHeader.substring(7); // Remove "Bearer "
        decodedToken = jwt.verify(token, jwtSecret) as { id: string };

        if (!decodedToken?.id) {
            return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
        }
    } catch (error) {
        console.error("JWT verification error:", error);
        return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
        // Parse the request body
        body = await req.json();
        if (!body || typeof body !== "object") {
            throw new Error("Invalid or empty request body");
        }
    } catch (error) {
        console.error("Error parsing request body:", error);
        return NextResponse.json(
            { message: "Invalid request body", status: 400 },
            { status: 400 }
        );
    }

    try {
        // Send the POST request to the external API with the response of the summary
        const endpoint = ["responsibility_checker","personal_info","total_bullet_points","bullet_points_improver","bullet_point_length","resume_length","resume_score"]
        
        const response = await fetch(baseUrl.concat("/summary"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        
        if (!response.ok) {
            const errorText = await response.text(); // Capture error details
            console.error(`Failed to fetch summary: ${response.status} - ${errorText}`);
            return NextResponse.json(
                { message: `Failed to fetch summary: ${response.statusText}`, status: response.status },
                { status: response.status }
            );
        }

        const result = await response.json();
        
        
        if (result?.message) {
            const response = await fetch(baseUrl.concat("/personal_info"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            console.log("profile data",await response.text())
            const summary = transformKeys(result.message) as AnalysisDataType;
            summary.cvId = body.id as string;
            // console.log("this is body",summary)
            // Save the analysis result
            const summaryResponse = await analysisResume(summary);
            return NextResponse.json(summaryResponse, { status: 200 });
        }

        return NextResponse.json(
            { message: "No summary found in response", status: 400 },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            {
                message: "Failed to process request",
                status: 500,
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
};
