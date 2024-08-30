"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/auth/resetPassword", {
        method: "PUT", // Use PUT method as per your backend route
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setMessage(errorData.error || "Something went wrong.");
        return;
      }

      // Handle the successful case
      const data = await response.json();
      setMessage(data.message || "Password reset successfully.");
      toast.success("Password reset successfully.");
      router.push("/");
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Failed to reset password.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-4">Reset Your Password</h1>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded px-2 py-1 mb-2 w-full"
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="border rounded px-2 py-1 mb-4 w-full"
      />
      <button
        onClick={handleResetPassword}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300 w-full"
      >
        Reset Password
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
