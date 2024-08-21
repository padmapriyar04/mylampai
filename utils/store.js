import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useInterviewStore = create(
  persist(
    (set) => ({
      resumeFile: null,
      jobDescriptionFile: null,
      setResumeFile: (file) => set({ resumeFile: file }),
      setJobDescriptionFile: (file) => set({ jobDescriptionFile: file }),
      extractedText: '',
      setExtractedText: (text) => set({ extractedText: text }),
    }),
    {
      name: "interview-storage", // unique name for the storage (localStorage key)
      getStorage: () => localStorage, // default localStorage
    },
  ),
);