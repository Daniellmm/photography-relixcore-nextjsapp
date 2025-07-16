

// import { useEffect, useState } from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "../dashboard/LogoutButton";
import Link from "next/link";

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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-primary/20 shadow-lg hidden md:block overflow-y-auto">
        <div className="p-4 text-lg text-black font-semibold">Admin Panel</div>
        <ul className="space-y-2 p-4">
          <li><Link href="/admin" className="text-gray-700 hover:text-black">Dashboard</Link></li>
          <li><Link href="/admin/users" className="text-gray-700 hover:text-black">Users</Link></li>
          <li><Link href="/admin/upload" className="text-gray-700 hover:text-black">Upload Album</Link></li>
          <li><Link href="/admin/images" className="text-gray-700 hover:text-black">Upload Images</Link></li>
          <li><Link href="/admin/payments" className="text-gray-700 hover:text-black">Payments</Link></li>
        </ul>
        <div className="w-full px-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Top Navbar */}
        <header className="bg-white text-black  shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-medium">Welcome back, Admin!</h1>
          <div className="text-right text-sm">
            {/* <div className="font-medium">{admin.name}</div> */}
            {/* <div className="text-gray-500">{admin.email}</div> */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto  p-6">{children}</main>
      </div>
    </div>
  );
}
