'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
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
  const [activeHash, setActiveHash] = useState('');

  // 1. Scroll shadow detector
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Hash tracking & section observer on the Home Page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActiveHash(window.location.hash);
    }

    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 3. Scroll tracking across homepage sections (Home, Categories, How It Works)
  useEffect(() => {
    if (pathname !== '/') {
      setActiveHash('');
      return;
    }

    const handleScrollSections = () => {
      const scrollPos = window.scrollY + 200;
      const catElem = document.getElementById('categories');
      const howElem = document.getElementById('how-it-works');

      if (catElem && howElem) {
        const catTop = catElem.offsetTop;
        const catBottom = catTop + catElem.offsetHeight;
        const howTop = howElem.offsetTop;
        const howBottom = howTop + howElem.offsetHeight;

        if (scrollPos >= howTop && scrollPos <= howBottom + 150) {
          setActiveHash('#how-it-works');
        } else if (scrollPos >= catTop && scrollPos <= catBottom + 150) {
          setActiveHash('#categories');
        } else if (window.scrollY < 250) {
          setActiveHash('');
        }
      }
    };

    window.addEventListener('scroll', handleScrollSections, { passive: true });
    handleScrollSections();
    return () => window.removeEventListener('scroll', handleScrollSections);
  }, [pathname]);

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

  // Precision active-state detector across routes and homepage anchors
  const isActive = (href: string) => {
    if (pathname === '/') {
      if (href === '/#categories') return activeHash === '#categories';
      if (href === '/#how-it-works') return activeHash === '#how-it-works';
      if (href === '/') return !activeHash || activeHash === '#' || activeHash === '#home';
      return false;
    }
    if (href === '/') return false;
    if (href.startsWith('/#')) return false;
    return pathname.startsWith(href);
  };

  // Immediate smooth-scroll and state trigger when clicking anchor navigation items
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      const hash = href.replace('/', '');
      setActiveHash(hash);
      if (pathname === '/') {
        e.preventDefault();
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', hash);
        }
      }
    } else if (href === '/') {
      setActiveHash('');
      if (pathname === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '/');
      }
    }
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
          <NextLink href="/" onClick={(e) => handleNavClick(e, '/')} className="flex items-center space-x-3 group nav-link-item">
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

          {/* Desktop Navigation: Executive, Clean & Professional Active States */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <NextLink
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`nav-link-item relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 select-none ${
                    active
                      ? 'text-electric-600 dark:text-cyan-300 bg-electric-50/80 dark:bg-white/[0.08] font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{link.name}</span>
                  {active && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-electric-500 dark:bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(56,120,255,0.4)]" />
                  )}
                </NextLink>
              );
            })}
          </nav>

          {/* Actions & Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="nav-link-item p-2.5 rounded-2xl border border-base-300/80 text-base-content/70 hover:text-electric-500 hover:bg-base-200/80 transition-all"
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
                  className="nav-link-item flex items-center space-x-3 pl-2 pr-3 py-1.5 rounded-2xl border border-base-300/80 hover:border-electric-500/50 transition-all bg-base-100/80 backdrop-blur-md shadow-sm"
                >
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-electric-500/40"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;
                    }}
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

                      <NextLink
                        href="/dashboard/customer?tab=favorites"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-bold text-base-content/80 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                      >
                        <Heart className="w-4 h-4 mr-3 text-rose-500" />
                        My Favorites
                      </NextLink>

                      <NextLink
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-bold text-base-content/80 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <User className="w-4 h-4 mr-3 text-primary" />
                        My Profile & Security
                      </NextLink>
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
              // Unauthenticated Actions: Crisp & Professional
              <div className="flex items-center space-x-2">
                <NextLink
                  href="/login?role=Owner"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 transition-all flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Owner Sign In</span>
                </NextLink>
                <NextLink
                  href="/login"
                  className="nav-link-item px-3.5 py-1.5 rounded-xl text-xs font-bold text-base-content/80 hover:text-electric-500 dark:hover:text-cyan-400 hover:bg-base-200/80 transition-colors"
                >
                  Login
                </NextLink>
                <NextLink
                  href="/register"
                  className="btn-premium-primary px-4 py-1.5 text-xs font-extrabold shadow-sm tracking-wide"
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
              className="nav-link-item p-2 rounded-xl border border-base-300 text-base-content/80"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              className="nav-link-item p-2 rounded-xl border border-base-300 text-base-content hover:text-electric-500"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-surface border-b border-base-300/80 px-4 pt-3 pb-6 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <NextLink
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, link.href);
                }}
                className={`nav-link-item flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? 'text-electric-500 dark:text-cyan-400 bg-electric-500/10 dark:bg-cyan-400/10 font-bold border-l-4 border-electric-500 dark:border-cyan-400'
                    : 'text-base-content/75 hover:bg-base-200/80 hover:text-base-content'
                }`}
              >
                <span>{link.name}</span>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-electric-500 dark:bg-cyan-400" />
                )}
              </NextLink>
            );
          })}

          <div className="pt-4 border-t border-base-300">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-3 py-2 bg-base-200 rounded-2xl">
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-9 h-9 rounded-xl object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;
                    }}
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
                <NextLink
                  href="/dashboard/customer?tab=favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 rounded-xl text-xs font-bold border border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
                >
                  <Heart className="w-4 h-4 mr-2 text-rose-500" />
                  My Favorites
                </NextLink>
                <NextLink
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 rounded-xl text-xs font-bold border border-base-300 hover:bg-base-200 transition-colors"
                >
                  <User className="w-4 h-4 mr-2 text-primary" />
                  My Profile & Security
                </NextLink>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center py-2.5 rounded-xl text-xs font-bold text-error bg-error/10 hover:bg-error/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <NextLink
                  href="/login?role=Owner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="col-span-2 flex items-center justify-center py-2.5 rounded-xl text-xs font-bold bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400"
                >
                  <Truck className="w-4 h-4 mr-1.5" />
                  <span>Machinery Owner Sign In (ভেন্ডর সাইন ইন)</span>
                </NextLink>
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
