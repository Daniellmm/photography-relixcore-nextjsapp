

// import { useEffect, useState } from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simulated admin data
 

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-primary/20 shadow-lg hidden md:block">
        <div className="p-4 text-lg text-black font-semibold">Admin Panel</div>
        <ul className="space-y-2 p-4">
          <li><a href="/admin" className="text-gray-700 hover:text-black">Dashboard</a></li>
          <li><a href="/admin/upload" className="text-gray-700 hover:text-black">Albums</a></li>
          <li><a href="/admin/images" className="text-gray-700 hover:text-black">Images</a></li>
          <li><a href="/admin/users" className="text-gray-700 hover:text-black">Users</a></li>
        </ul>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white text-black  shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-medium">Welcome back, Admin!</h1>
          <div className="text-right text-sm">
            {/* <div className="font-medium">{admin.name}</div> */}
            {/* <div className="text-gray-500">{admin.email}</div> */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
