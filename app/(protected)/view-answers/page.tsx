"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import pageData from "../questions/pageData";

const ViewAnswersPage: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const router = useRouter();

  useEffect(() => {
    const savedAnswers = localStorage.getItem("questionnaireAnswers");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  const renderAnswer = (questionIndex: number) => {
    const answer = answers[questionIndex];
    const question = pageData[questionIndex];

    if (!answer) return "Not answered";

    switch (question.type) {
      case "dropdown":
        return answer;
      case "tabs":
        return `${question.tabs![0]}: ${answer}`;
      case "input":
        return answer;
      case "multiDropdown":
        return Object.values(answer).join(", ");
      default:
        return JSON.stringify(answer);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Answers</h1>
      {pageData.map((question, index) => (
        <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold">{question.question}</h2>
          <p>{renderAnswer(index)}</p>
        </div>
      ))}
      <button
        onClick={() => router.push("/questions")}
        className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
      >
        Back to Questions
      </button>
    </div>
  );
};

export default ViewAnswersPage;
