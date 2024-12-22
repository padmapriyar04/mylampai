"use client";
import React, { useEffect, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfToImage = ({ pdfUrl }: { pdfUrl: string }) => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const renderPdfToImage = async () => {
      try {
        const pdf = await pdfjs.getDocument(pdfUrl).promise;
        const page = await pdf.getPage(1); // Render the first page

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Failed to get canvas 2d context");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport,
        };

        await page.render(renderContext).promise;

        const imageData = canvas.toDataURL("image/png"); // Convert canvas to image URL
        setImageSrc(imageData);
      } catch (error) {
        console.error("Error rendering PDF to image:", error);
      }
    };

    renderPdfToImage();
  }, [pdfUrl]);

  return (
    <Dialog>
      <DialogTrigger className="p-2">
        <Eye className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            <Image
              src={imageSrc}
              width={800}
              height={600}
              className="w-full h-auto"
              alt="resume preview"
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PdfToImage;
