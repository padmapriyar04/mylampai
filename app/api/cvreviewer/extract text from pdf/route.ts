import { NextResponse, NextRequest } from "next/server";
import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse"; // You may need to install this library: npm install pdf-parse

// Helper function to parse the PDF file and extract text
const extractTextFromPDF = async (filePath: string) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

// POST to extract text from PDF
export const POST = async (req: NextRequest) => {
  try {
    // Using formidable to parse the form data
    const form = new formidable.IncomingForm();
    
    const formData = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        }
        resolve({ fields, files });
      });
    });

    const { files } = formData;
    const file = files.file; // assuming the file key is 'file'

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const filePath = (file as formidable.File).filepath;
    
    const text = await extractTextFromPDF(filePath);

    // Cleaning up the file after extraction
    fs.unlinkSync(filePath);

    return NextResponse.json({ message: "Success", text }, { status: 200 });
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
};

export const GET = async () => {
  return NextResponse.json({ message: "Use POST method to extract text from a PDF." }, { status: 405 });
};

export const config = {
  api: {
    bodyParser: false, // Disabling body parsing so we can use formidable
  },
};
