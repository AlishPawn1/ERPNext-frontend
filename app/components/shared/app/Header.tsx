"use client";

import { Bell, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const AdminHeader = () => {
  const router = useRouter();

  async function handleLogout() {
    try {
      // Ensure cookies are included for same-origin requests
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      // Redirect to login page (or home) after logout
      router.push('/login');
    }
  }

  return (
    <header className="bg-white shadow flex justify-between items-center px-6 py-3 sticky top-0 z-50">
      {/* Left section: Logo and Page Title */}
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-bold text-gray-800">E</div> {/* Logo */}
        <h1 className="text-lg font-medium text-gray-700">Buying</h1> {/* Page title */}
      </div>

      {/* Right section: Search, Notification, Profile */}
      <div className="flex items-center space-x-4">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search or type a command (Ctrl + G)"
            className="border rounded-md py-1 px-3 pl-10 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Notification icon */}
        <button className="p-2 rounded hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />
        </button>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold hover:bg-gray-300"
          >A</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export { AdminHeader };
