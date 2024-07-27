export default function DashboardPage() {
  return (
    <main>
      <div>Student dashboard</div>
      <div style={{ marginTop: "20px", textAlign: "center" }}></div>
    </main>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // Correct import for App Router
// import { toast } from "sonner";

// interface User {
//   first_name: string;
//   last_name: string;
//   email: string;
// }

// const ProfilePage = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch("@/app/pages/api/user/profile");
//         if (response.ok) {
//           const userData = await response.json();
//           setUser(userData);
//         } else {
//           throw new Error("Failed to fetch user data");
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         toast.error("Failed to load user data. Please try logging in again.");
//         router.push("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [router]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         Loading...
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         User not found
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
//       <div className="bg-white p-8 rounded-lg shadow-md">
//         <h1 className="text-3xl font-bold mb-4 text-purple-600">
//           Welcome to Your Profile
//         </h1>
//         <p className="text-xl text-gray-700 mb-2">
//           Hello, {user.first_name} {user.last_name}!
//         </p>
//         <p className="text-md text-gray-600">Email: {user.email}</p>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
