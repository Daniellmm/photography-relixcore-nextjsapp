'use client';

import { useEffect, useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Simulated user data
    const [user, setUser] = useState({ name: 'Client User', email: 'user@example.com' });

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-primary/20 shadow-lg hidden md:block">
                <div className="p-4 text-lg text-black font-semibold">Client Dashboard</div>
                <ul className="space-y-2 p-4 text-primary-foreground ">
                    <li><a href="/dashboard" className="text-gray-700 hover:text-black">My Gallery</a></li>
                    <li><a href="/dashboard/profile" className="text-gray-700 hover:text-black">Profile</a></li>
                    <li><a href="/dashboard/orders" className="text-gray-700 hover:text-black">Orders</a></li>
                </ul>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <header className="bg-white text-black shadow p-4 flex justify-between items-center">
                    <h1 className="text-lg font-medium">Welcome, {user.name}!</h1>
                    <div className="text-right text-sm">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-gray-500">{user.email}</div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
