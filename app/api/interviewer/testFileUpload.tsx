import { useState } from "react";
import { useRouter } from "next/router";

const CreateCV = () => {
  const [resume, setResume] = useState<string | ArrayBuffer | null>(null); // Type adjusted for base64
  const [jobDescription, setJobDescription] = useState<string | ArrayBuffer | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Define the type for the event parameter
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Safe access with optional chaining
    const { name } = e.target;

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert file to base64 string

      reader.onload = () => {
        if (name === "cv") {
          setResume(reader.result);
        } else {
          setJobDescription(reader.result); 
        }
      };

      reader.onerror = () => {
        setMessage("Error reading file");
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Unauthorized: Please log in.");
      return;
    }

    try {
      const response = await fetch("/api/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Resume: resume, 
          JobDescription: jobDescription,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("CV created successfully!");
        router.push(`/cv/${data.cv.id}`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="create-cv">
      <h1>Create CV</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Resume</label>
          <input
            name="cv"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <label>Job Description</label>
          <input
            name="jd"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Create CV</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateCV;
