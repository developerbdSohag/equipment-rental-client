'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Wrench,
  Sun,
  Moon,
  Menu,
  X,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Heart,
  PlusCircle,
  Truck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'Admin') return '/dashboard/admin';
    if (user.role === 'Owner') return '/dashboard/owner';
    return '/dashboard/customer';
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Equipment', href: '/equipment' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-base-100/90 border-b border-base-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Website Name */}
          <NextLink href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
              <Truck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-base-content flex items-center gap-1">
                Gear<span className="text-primary">Up</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold hidden sm:inline-block">
                  Rental
                </span>
              </span>
              <span className="text-[11px] font-medium text-base-content/60 tracking-wider uppercase -mt-0.5 hidden sm:inline-block">
                Equipment Platform
              </span>
            </div>
          </NextLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <NextLink
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-primary bg-primary/10 font-semibold'
                    : 'text-base-content/80 hover:text-primary hover:bg-base-200'
                }`}
              >
                {link.name}
              </NextLink>
            ))}
          </nav>

          {/* Actions & Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl border border-base-300 text-base-content/80 hover:text-primary hover:bg-base-200 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {user ? (
              // Logged In User Dropdown
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 pl-2 pr-3 py-1.5 rounded-xl border border-base-300 hover:border-primary/50 transition-all bg-base-200/50"
                >
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/40"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-base-content truncate max-w-[100px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-medium text-primary">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-base-content/60" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-base-100 rounded-2xl shadow-xl border border-base-300 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-base-200">
                      <p className="text-sm font-semibold text-base-content truncate">{user.name}</p>
                      <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        {user.role} Account
                      </span>
                    </div>

                    <div className="py-1">
                      <NextLink
                        href={getDashboardLink()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-base-content/90 hover:bg-base-200 hover:text-primary transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3 text-primary" />
                        Dashboard
                      </NextLink>

                      {user.role === 'Owner' && (
                        <NextLink
                          href="/dashboard/owner?tab=add-equipment"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-base-content/90 hover:bg-base-200 hover:text-primary transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 mr-3 text-secondary" />
                          Add Equipment
                        </NextLink>
                      )}

                      {user.role === 'Customer' && (
                        <NextLink
                          href="/dashboard/customer?tab=favorites"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-base-content/90 hover:bg-base-200 hover:text-primary transition-colors"
                        >
                          <Heart className="w-4 h-4 mr-3 text-red-500" />
                          My Favorites
                        </NextLink>
                      )}
                    </div>

                    <div className="border-t border-base-200 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Unauthenticated Actions
              <div className="flex items-center space-x-2">
                <NextLink
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-base-content hover:text-primary hover:bg-base-200 transition-colors"
                >
                  Login
                </NextLink>
                <NextLink
                  href="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/90 shadow-sm shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Register
                </NextLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg border border-base-300 text-base-content/80"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-base-content hover:bg-base-200"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-base-300 bg-base-100 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <NextLink
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                isActive(link.href)
                  ? 'text-primary bg-primary/10 font-bold'
                  : 'text-base-content/80 hover:bg-base-200'
              }`}
            >
              {link.name}
            </NextLink>
          ))}

          <div className="pt-4 border-t border-base-200">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-3 py-2 bg-base-200 rounded-xl">
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-base-content">{user.name}</p>
                    <p className="text-xs text-primary">{user.role}</p>
                  </div>
                </div>
                <NextLink
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </NextLink>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold text-error bg-error/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <NextLink
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl text-sm font-bold border border-base-300 hover:bg-base-200"
                >
                  Login
                </NextLink>
                <NextLink
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl text-sm font-bold bg-primary text-white"
                >
                  Register
                </NextLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
