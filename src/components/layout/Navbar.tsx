'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
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
  Truck,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Do not show global navbar on custom full-screen login page
  if (pathname === '/login') return null;

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'Admin') return '/dashboard/admin';
    if (user.role === 'Owner') return '/dashboard/owner';
    return '/dashboard/customer';
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse Equipment', href: '/equipment' },
    { name: 'Categories', href: '/#categories' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'glass-surface shadow-glass py-2'
          : 'bg-transparent py-4 border-b border-base-300/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <NextLink href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-navy-900 via-electric-500 to-cyan-400 flex items-center justify-center text-white shadow-glow-blue group-hover:scale-105 transition-transform duration-300">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-base-content flex items-center gap-1">
                Gear<span className="text-electric-500">Up</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-electric-500/10 text-electric-500 font-extrabold hidden sm:inline-block">
                  Marketplace
                </span>
              </span>
              <span className="text-[10px] font-semibold text-base-content/50 tracking-widest uppercase -mt-1 hidden sm:inline-block">
                Premium Equipment
              </span>
            </div>
          </NextLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <NextLink
                key={link.name}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-electric-500 bg-electric-500/10 shadow-sm'
                    : 'text-base-content/75 hover:text-electric-500 hover:bg-base-200/80'
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
              className="p-2.5 rounded-2xl border border-base-300/80 text-base-content/70 hover:text-electric-500 hover:bg-base-200/80 transition-all hover:scale-105 active:scale-95"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {user ? (
              // Logged In User Dropdown
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 pl-2 pr-3 py-1.5 rounded-2xl border border-base-300/80 hover:border-electric-500/50 transition-all bg-base-100/80 backdrop-blur-md shadow-sm"
                >
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-electric-500/40"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-base-content truncate max-w-[100px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-extrabold text-electric-500 uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-base-content/50" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 glass-card rounded-3xl shadow-glass-lg border border-base-300/80 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-base-200">
                      <p className="text-sm font-bold text-base-content truncate">{user.name}</p>
                      <p className="text-xs text-base-content/50 truncate">{user.email}</p>
                      <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-electric-500/10 text-electric-500 rounded-full">
                        {user.role} Account
                      </span>
                    </div>

                    <div className="py-1.5">
                      <NextLink
                        href={getDashboardLink()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-xs font-bold text-base-content/80 hover:bg-electric-500/10 hover:text-electric-500 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3 text-electric-500" />
                        Dashboard
                      </NextLink>

                      {user.role === 'Owner' && (
                        <NextLink
                          href="/dashboard/owner?tab=add-equipment"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-xs font-bold text-base-content/80 hover:bg-orange-500/10 hover:text-orange-500 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 mr-3 text-orange-500" />
                          Add Equipment
                        </NextLink>
                      )}

                      {user.role === 'Customer' && (
                        <NextLink
                          href="/dashboard/customer?tab=favorites"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-xs font-bold text-base-content/80 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                        >
                          <Heart className="w-4 h-4 mr-3 text-rose-500" />
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
                        className="w-full flex items-center px-4 py-2.5 text-xs font-bold text-error hover:bg-error/10 transition-colors"
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
                  className="px-4 py-2 rounded-xl text-xs font-bold text-base-content hover:text-electric-500 hover:bg-base-200/80 transition-colors"
                >
                  Login
                </NextLink>
                <NextLink
                  href="/register"
                  className="btn-premium-primary px-5 py-2.5 text-xs tracking-wide"
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
              className="p-2 rounded-xl border border-base-300 text-base-content/80"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-base-content hover:bg-base-200"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-surface border-t border-base-300 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <NextLink
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-bold ${
                isActive(link.href)
                  ? 'text-electric-500 bg-electric-500/10'
                  : 'text-base-content/80 hover:bg-base-200'
              }`}
            >
              {link.name}
            </NextLink>
          ))}

          <div className="pt-4 border-t border-base-300">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-3 py-2 bg-base-200 rounded-2xl">
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-9 h-9 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-base-content">{user.name}</p>
                    <p className="text-[10px] text-electric-500 font-bold uppercase">{user.role}</p>
                  </div>
                </div>
                <NextLink
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 rounded-xl text-xs font-bold btn-premium-primary"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </NextLink>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center py-2.5 rounded-xl text-xs font-bold text-error bg-error/10"
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
                  className="flex items-center justify-center py-2.5 rounded-xl text-xs font-bold border border-base-300 hover:bg-base-200"
                >
                  Login
                </NextLink>
                <NextLink
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl text-xs font-bold btn-premium-primary"
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
