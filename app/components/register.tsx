"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import prisma from "@/prisma";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/app/helpers/server";
import Link from "next/link";

export default function Register() {
  const [user, setUser] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    role: "",
    secret: "",
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        // Store user data in local storage
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect based on role
        router.push("/login");
      }
    } catch (error) {
      console.error("register error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-600 text-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl mb-6 text-center">Register</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
            required
            className="w-full p-2 border text-black border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            Name:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={user.name}
            onChange={handleChange}
            required
            className="w-full p-2 border text-black border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block mb-2">
            Phone:
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={user.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border text-black border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}
            required
            className="w-full p-2 border text-black border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block mb-2">
            Role:
          </label>
          <select
            id="role"
            name="role"
            value={user.role}
            onChange={handleChange}
            required
            className="w-full p-2 border text-black border-gray-300 rounded"
          >
            <option value="">Select a role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {user.role === "admin" && (
          <div className="mb-4">
            <label htmlFor="secret" className="block mb-2">
              Secret:
            </label>
            <input
              id="secret"
              name="secret"
              type="password"
              value={user.secret}
              onChange={handleChange}
              required
              className="w-full p-2 border text-black border-gray-300 rounded"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full p-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Register
        </button>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
