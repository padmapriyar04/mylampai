"use client"

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react"; // Import signIn function from next-auth/react

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();

        // Store user data and token in local storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
 
        // Redirect based on role
        if (data.user.role === "admin") {
          router.push("/adminDashboard");
        } else {
          router.push("/studentDashboard");
        }
      } else {
        console.error("Login error:", await response.json());
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const socialAction = (action:string)=>{
    signIn(action,{redirect:false}).then((callback=>{
      if(callback?.error){
        alert("Invalid Credientials")
      }
      if(callback?.ok && !callback?.error){
        alert("Logged In")
      }
    })).finally(()=>router.push("/studentDashboard"))
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-600 text-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={credentials.email}
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
            value={credentials.password}
            onChange={handleChange}
            required
            className="w-full p-2 border text-black border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>

        <button
          type="button"
          onClick={()=>socialAction('google')}
          className="w-full p-2 mt-4 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign in with Google
        </button>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
