'use client';

import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Truck, Mail, Phone, MapPin, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Do not show global footer on custom full-screen login page
  if (pathname === '/login') return null;
  return (
    <footer className="bg-navy-950 text-white border-t border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <NextLink href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-navy-900 via-electric-500 to-cyan-400 flex items-center justify-center text-white shadow-glow-blue">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Gear<span className="text-electric-400">Up</span> Marketplace
              </span>
            </NextLink>
            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              The premier peer-to-peer equipment rental marketplace connecting contractors, industrial developers, farmers, and film crews with verified high-performance machinery.
            </p>
            
            {/* Social Icons including the modern X logo */}
            <div className="flex items-center space-x-3 pt-2">
              {/* New X Logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:border-electric-500 hover:bg-electric-500/20 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:border-electric-500 hover:bg-electric-500/20 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:border-electric-500 hover:bg-electric-500/20 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-black tracking-wider uppercase text-electric-400 mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><NextLink href="/equipment?category=Excavators" className="hover:text-white transition-colors">Excavators</NextLink></li>
              <li><NextLink href="/equipment?category=Cranes" className="hover:text-white transition-colors">Mobile Cranes</NextLink></li>
              <li><NextLink href="/equipment?category=Generators" className="hover:text-white transition-colors">Commercial Generators</NextLink></li>
              <li><NextLink href="/equipment?category=Forklifts" className="hover:text-white transition-colors">Rough-Terrain Forklifts</NextLink></li>
              <li><NextLink href="/equipment?category=Bulldozers" className="hover:text-white transition-colors">Heavy Bulldozers</NextLink></li>
              <li><NextLink href="/equipment?category=Trucks" className="hover:text-white transition-colors">Haul & Dump Trucks</NextLink></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black tracking-wider uppercase text-electric-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><NextLink href="/equipment" className="hover:text-white transition-colors">Browse Marketplace</NextLink></li>
              <li><NextLink href="/#how-it-works" className="hover:text-white transition-colors">How Renting Works</NextLink></li>
              <li><NextLink href="/about" className="hover:text-white transition-colors">About Our Platform</NextLink></li>
              <li><NextLink href="/contact" className="hover:text-white transition-colors">Support & Contact</NextLink></li>
              <li><NextLink href="/register" className="hover:text-white transition-colors">List Your Equipment</NextLink></li>
              <li><NextLink href="/login" className="hover:text-white transition-colors">Account Login</NextLink></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-black tracking-wider uppercase text-electric-400 mb-4">
              Dispatch Desk
            </h4>
            <ul className="space-y-3 text-xs text-white/70">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>100 Equipment Blvd, Chicago, IL 60601</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span>+1 (800) 555-GEAR (24/7)</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>dispatch@gearupequipment.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/50">
          <p>© 2026 GearUp Marketplace Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Rental Master Contract</span>
            <span className="hover:underline cursor-pointer">Owner Escrow Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
