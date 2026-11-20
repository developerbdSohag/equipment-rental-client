'use client';

import React from 'react';
import NextLink from 'next/link';
import { Truck, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-base-200 border-t border-base-300 text-base-content transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <NextLink href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-white shadow-md shadow-primary/20">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-base-content">
                Gear<span className="text-primary">Up</span> Rentals
              </span>
            </NextLink>
            <p className="text-sm text-base-content/70 leading-relaxed max-w-sm">
              The premier peer-to-peer equipment rental marketplace connecting construction firms, creators, farmers, and event organizers with verified high-performance machinery and tools.
            </p>
            
            {/* Social Icons including the new X logo */}
            <div className="flex items-center space-x-3 pt-2">
              {/* New X Logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-9 h-9 rounded-xl bg-base-100 border border-base-300 flex items-center justify-center text-base-content/80 hover:text-primary hover:border-primary transition-all"
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
                className="w-9 h-9 rounded-xl bg-base-100 border border-base-300 flex items-center justify-center text-base-content/80 hover:text-primary hover:border-primary transition-all"
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
                className="w-9 h-9 rounded-xl bg-base-100 border border-base-300 flex items-center justify-center text-base-content/80 hover:text-primary hover:border-primary transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-base-100 border border-base-300 flex items-center justify-center text-base-content/80 hover:text-primary hover:border-primary transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-base-content mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-base-content/70">
              <li><NextLink href="/equipment?category=Construction" className="hover:text-primary transition-colors">Construction Gear</NextLink></li>
              <li><NextLink href="/equipment?category=Photography" className="hover:text-primary transition-colors">Cinema & Photography</NextLink></li>
              <li><NextLink href="/equipment?category=Vehicles" className="hover:text-primary transition-colors">Commercial Vehicles</NextLink></li>
              <li><NextLink href="/equipment?category=Agriculture" className="hover:text-primary transition-colors">Farming Equipment</NextLink></li>
              <li><NextLink href="/equipment?category=Electronics" className="hover:text-primary transition-colors">Industrial Electronics</NextLink></li>
              <li><NextLink href="/equipment?category=Event" className="hover:text-primary transition-colors">Stage & Sound Systems</NextLink></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-base-content mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-base-content/70">
              <li><NextLink href="/equipment" className="hover:text-primary transition-colors">Browse Equipment</NextLink></li>
              <li><NextLink href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</NextLink></li>
              <li><NextLink href="/about" className="hover:text-primary transition-colors">About Our Platform</NextLink></li>
              <li><NextLink href="/contact" className="hover:text-primary transition-colors">Support & Contact</NextLink></li>
              <li><NextLink href="/register" className="hover:text-primary transition-colors">Become an Owner</NextLink></li>
              <li><NextLink href="/login" className="hover:text-primary transition-colors">Account Login</NextLink></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-base-content mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-base-content/70">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>100 Equipment Blvd, Suite 400, Chicago, IL 60601</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+1 (800) 555-GEAR</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>support@gearupequipment.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-base-300 flex flex-col sm:flex-row items-center justify-between text-xs text-base-content/60">
          <p>© 2026 GearUp Equipment Rental Platform. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Rental Terms</span>
            <span className="hover:underline cursor-pointer">Owner Protection Plan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
