import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-primary/20 shadow-lg hidden md:block">
        <div className="p-4 text-lg text-black font-semibold">Client Dashboard</div>
        <ul className="space-y-2 p-4 text-primary-foreground">
          <li>
            <Link href="/dashboard" className="text-gray-700 hover:text-black">My Gallery</Link>
          </li>
          <li>
            <Link href="/dashboard/profile" className="text-gray-700 hover:text-black">Profile</Link>
          </li>
          <li>
            <Link href="/dashboard/orders" className="text-gray-700 hover:text-black">Orders</Link>
          </li>
        </ul>
        <div className="w-full px-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white text-black shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-medium">Welcome, {session.user.name}!</h1>
          <div className="text-right text-sm">
            <div className="font-medium">{session.user.name}</div>
            <div className="text-gray-500">{session.user.email}</div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
