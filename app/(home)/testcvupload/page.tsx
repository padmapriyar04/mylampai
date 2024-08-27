"use client"

import { useState } from "react";
import { useUserStore } from "@/utils/userStore";

const CreateCV = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [message, setMessage] = useState("");

  const {token} = useUserStore()

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { name } = e.target;
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert file to base64 string
      reader.onload = () => {
        if (name === "cv") setResume(reader.result);
        else setJobDescription(reader.result);
      };
      reader.onerror = () => {
        setMessage("Error reading file");
      };
    }
  };

  console.log(token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(token)
    
    if (!token) {
        console.log("token", token)
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
          Resume: resume, // Send the base64 string
          JobDescription: jobDescription,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("CV created successfully!");
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
