'use client';

import { Bell, Settings, User, Building2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const getCenterTitle = () => {
    if (pathname === '/vehicles') {
      return 'Global Vehicle Overview';
    } else if (pathname === '/materials') {
      return 'Global Material Overview';
    } else if (pathname === '/expenses') {
      return 'Global Expense Overview';
    } else if (pathname === '/payments') {
      return 'Global Payment Overview';
    }
    return 'Site-Focused Management'; // Default for dashboard
  };
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Gavith Build</h1>
            <p className="text-xs text-gray-600">Construction Management System</p>
          </div>
        </div>

        {/* Center - Dynamic Title */}
        <div className="flex-1 text-center">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            {getCenterTitle()}
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Live and AD indicators */}
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Live</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">AD</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="h-5 w-5" />
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">Welcome, admin</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
