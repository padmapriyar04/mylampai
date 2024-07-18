import Link from "next/link";

export default function DashboardPage() {
  return (
    <main>
      <div className="flex justify-between items-center">
        <h1>Admin Dashboard</h1>
        <Link href="/community">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Community
          </button>
        </Link>
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {/* Other content or components related to the admin dashboard */}
      </div>
    </main>
  );
}
