'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import LogoutButton from "../dashboard/LogoutButton";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  

  // ✅ Redirect non-admin users
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.replace('/'); // redirect to home or unauthorized page
    }
  }, [status, session, router]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const menuButton = document.getElementById('mobile-menu-button');
      if (sidebar && menuButton &&
        !sidebar.contains(event.target as Node) &&
        !menuButton.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/upload", label: "Upload Album" },
    { href: "/admin/images", label: "Upload Images" },
    { href: "/admin/payments", label: "Payments" },
  ];

   const activeItem = navItems.reduce((bestMatch, item) => {
    if (
      pathname === item.href ||
      pathname.startsWith(item.href + "/")
    ) {
      return item.href.length > bestMatch.length ? item.href : bestMatch;
    }
    return bestMatch;
  }, "");

  const NavContent = () => (
    <>
      <div className="p-4 text-lg text-black font-semibold border-b border-gray-200">
        Admin Panel
      </div>
      <ul className="space-y-2 p-4 flex-1">
        {navItems.map((item) => {
         const isActive = activeItem === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-3 py-2 rounded-md transition-colors ${isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-black hover:text-white'
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="p-4 border-t border-gray-200">
        <LogoutButton />
      </div>
    </>
  );

  // ✅ Show loader while checking session
  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-gray-600">Loading...</span>
      </div>
    );
  }

  // ✅ Don't render layout if not admin (redirect happens in useEffect)
  if (status === 'authenticated' && session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-primary/20 shadow-lg hidden md:flex md:flex-col overflow-y-auto">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-white bg-opacity-50" />
          <aside
            id="mobile-sidebar"
            className="fixed left-0 top-0 h-full w-64 bg-primary/20 shadow-lg flex flex-col overflow-y-auto transform transition-transform duration-300 ease-in-out"
          >
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <header className="bg-white text-black shadow p-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-3">
            <button
              id="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <h1 className="text-lg font-medium">Welcome back, Admin!</h1>
          </div>
        </header>

        <main className="flex-1 overflow-x-auto overflow-y-auto min-w-0">{children}</main>
      </div>
    </div>
  );
}
