'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MapPin, 
  Truck, 
  Package, 
  DollarSign, 
  CreditCard, 
  Users, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  X,
  Menu
} from 'lucide-react';
import Image from 'next/image';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Site Management', href: '/sites', icon: MapPin },
  { name: 'Vehicle & Equipment', href: '/vehicles', icon: Truck },
  { name: 'Material Management', href: '/materials', icon: Package },
  { name: 'Expense Management', href: '/expenses', icon: DollarSign },
  { name: 'Payment Tracking', href: '/payments', icon: CreditCard },
  { name: 'Vendor Management', href: '/vendors', icon: Users },
  { name: 'Reports & Analytics', href: '/analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Mobile sidebar overlay
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 lg:hidden"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between px-2 py-1 border-b border-gray-200">
                <div className="flex items-center bg-transparent">
                  <Image
                    src="/logo.png"
                    alt="Gravith Build Logo"
                    width={140}
                    height={32}
                    className="object-contain bg-transparent"
                    style={{ 
                      backgroundColor: 'transparent', 
                      border: 'none', 
                      outline: 'none',
                      boxShadow: 'none',
                      background: 'none',
                      backgroundImage: 'none'
                    }}
                  />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="mt-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-white text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 h-full flex flex-col ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center bg-transparent">
            <Image
              src="/logo.png"
              alt="Gravith Build Logo"
              width={140}
              height={32}
              className="object-contain bg-transparent"
              style={{ 
                backgroundColor: 'transparent', 
                border: 'none', 
                outline: 'none',
                boxShadow: 'none',
                background: 'none',
                backgroundImage: 'none'
              }}
            />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
      
      {/* Ensure remaining space is white */}
      <div className="flex-1 bg-white"></div>
    </div>
  );
}
