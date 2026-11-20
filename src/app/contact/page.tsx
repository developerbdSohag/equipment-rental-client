'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success('Your message has been sent to our dispatch team!');
  };

  return (
    <div className="min-h-screen bg-base-100 py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">24/7 Support Desk</span>
          <h1 className="text-4xl font-black text-base-content tracking-tight">Contact GearUp Dispatch</h1>
          <p className="text-sm text-base-content/75">
            Need assistance with an active booking, custom delivery logistics, or owner verification? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-base-200/50 border border-base-300 space-y-6">
              <h3 className="text-lg font-bold text-base-content">Headquarters & Support</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-base-content">Office Location</p>
                    <p className="text-base-content/60">Plot 14-15, Road 3, Tejgaon Light Industrial Area, Dhaka-1208, Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-base-content">Direct Phone Support</p>
                    <p className="text-base-content/60">+880 9612-443278 (Hotline 24/7) / +880 1711-000001</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-base-content">Email Inquiries</p>
                    <p className="text-base-content/60">dispatch@gearupequipment.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Promise */}
            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-2 text-xs">
              <span className="font-bold text-primary flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Guaranteed Rapid Response
              </span>
              <p className="text-base-content/70">
                All inquiries submitted during business hours are assigned to an equipment specialist within 15 minutes.
              </p>
            </div>
          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-base-100 p-8 sm:p-10 rounded-3xl border border-base-300 shadow-sm">
            {sent ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-base-content">Thank you, {name}!</h3>
                <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                  Your message has been safely received. A member of our equipment logistics team will reach out to {email} promptly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Send Dispatch Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-base-content/70 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Contractor"
                      className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-base-content/70 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@buildcorp.com"
                      className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Inquiring about Caterpillar Excavator rental"
                    className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about dates, equipment needed, and job site location..."
                    className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Dispatch</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
