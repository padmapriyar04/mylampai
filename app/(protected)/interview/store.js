import create from 'zustand';
import { persist } from 'zustand/middleware';

const useInterviewStore = create(
  persist(
    (set) => ({
      resumeFile: null,
      jobDescriptionFile: null,
      setResumeFile: (file) => set({ resumeFile: file }),
      setJobDescriptionFile: (file) => set({ jobDescriptionFile: file }),
     
    }),
    {
      name: 'interview-storage', // unique name for the storage (localStorage key)
      getStorage: () => localStorage, // default localStorage
    }
  )
);

export default useInterviewStore;
