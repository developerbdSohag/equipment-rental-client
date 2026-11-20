'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Phone,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Truck,
  Loader2,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  // Current Step: 1, 2, 3, 4, or 5 (Success)
  const [step, setStep] = useState(1);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'Customer' | 'Owner'>('Customer');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Password validation indicators
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUpperCase && hasLowerCase && hasMinLength;
  const passwordsMatch = password && password === confirmPassword;

  // Step 1 -> Step 2 validation
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Please enter your full name and valid email.');
      return;
    }
    setStep(2);
  };

  // Step 2 -> Step 3 validation
  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      toast.error('Password must have uppercase, lowercase, and at least 6 characters.');
      return;
    }
    if (!passwordsMatch) {
      toast.error('Passwords do not match.');
      return;
    }
    setStep(3);
  };

  // Step 3 -> Step 4 validation
  const handleNextStep3 = () => {
    setStep(4);
  };

  // Final Submit
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error('Please accept the Terms of Service to complete registration.');
      return;
    }

    setSubmitting(true);
    const success = await register(
      name,
      email,
      password,
      undefined,
      role,
      phone
    );
    setSubmitting(false);

    if (success) {
      setStep(5); // Show animated success screen
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-base-200">
      
      {/* Background Soft Glows */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-electric-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full glass-card p-8 sm:p-10 rounded-3xl border border-white/80 shadow-glass-lg relative z-10">
        
        {/* Brand & Progress Bar */}
        <div className="text-center space-y-3 mb-6">
          <NextLink href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-navy-900 via-electric-500 to-cyan-400 flex items-center justify-center text-white shadow-glow-blue">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-navy-900 dark:text-white">
              Gear<span className="text-electric-500">Up</span>
            </span>
          </NextLink>

          <h2 className="text-2xl font-black text-navy-900 dark:text-white tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-base-content/60">
            Step {Math.min(step, 4)} of 4: {
              step === 1 ? 'Personal Information' :
              step === 2 ? 'Account Security' :
              step === 3 ? 'Select Account Role' :
              step === 4 ? 'Confirm & Finish' : 'Welcome to GearUp'
            }
          </p>

          {/* Progress Indicator */}
          {step <= 4 && (
            <div className="w-full bg-base-200 rounded-full h-2 mt-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-electric-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* STEP 1: Personal Information */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleNextStep1}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-base-content/70 block mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Miller or Vertex Builders"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-base-100 border border-base-300 text-xs font-bold text-base-content focus:outline-none focus:border-electric-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-base-content/70 block mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-base-100 border border-base-300 text-xs font-bold text-base-content focus:outline-none focus:border-electric-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-base-content/70 block mb-1">Contact Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-base-100 border border-base-300 text-xs font-bold text-base-content focus:outline-none focus:border-electric-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-premium-primary py-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
              >
                <span>Continue to Password</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}

          {/* STEP 2: Account Security */}
          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleNextStep2}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-base-content/70 block mb-1">Choose Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-base-100 border border-base-300 text-xs font-bold text-base-content focus:outline-none focus:border-electric-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-base-content/70 block mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-base-100 border border-base-300 text-xs font-bold text-base-content focus:outline-none focus:border-electric-500"
                  />
                </div>
              </div>

              {/* Live Password Requirements Feedback */}
              <div className="p-3.5 rounded-2xl bg-base-200/80 border border-base-300/80 space-y-1.5 text-[11px]">
                <span className="font-bold text-base-content/60 block mb-1">Security Checklist:</span>
                <div className="flex items-center gap-2">
                  {hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                  <span className={hasMinLength ? 'text-emerald-600 font-medium' : 'text-base-content/60'}>At least 6 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasUpperCase ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                  <span className={hasUpperCase ? 'text-emerald-600 font-medium' : 'text-base-content/60'}>At least one uppercase letter (A-Z)</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasLowerCase ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                  <span className={hasLowerCase ? 'text-emerald-600 font-medium' : 'text-base-content/60'}>At least one lowercase letter (a-z)</span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordsMatch ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                  <span className={passwordsMatch ? 'text-emerald-600 font-medium' : 'text-base-content/60'}>Passwords match</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 rounded-xl border border-base-300 font-bold hover:bg-base-200"
                >
                  <ArrowLeft className="w-4 h-4 mx-auto" />
                </button>
                <button
                  type="submit"
                  className="w-2/3 btn-premium-primary py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Select Role</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 3: Account Type Selection */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 text-xs"
            >
              <p className="font-bold text-base-content/70">Select how you intend to use the marketplace:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Card */}
                <div
                  onClick={() => setRole('Customer')}
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
                    role === 'Customer'
                      ? 'border-electric-500 bg-electric-500/10 shadow-glow-blue scale-[1.02]'
                      : 'border-base-300 bg-base-100 hover:border-electric-500/50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-electric-500/15 text-electric-500 flex items-center justify-center mb-3">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-base-content">Customer / Renter</h4>
                  <p className="text-[11px] text-base-content/70 mt-1">
                    Rent machinery, generators, and tools for your jobsites and shoots.
                  </p>
                </div>

                {/* Owner Card */}
                <div
                  onClick={() => setRole('Owner')}
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
                    role === 'Owner'
                      ? 'border-orange-500 bg-orange-500/10 shadow-glow-orange scale-[1.02]'
                      : 'border-base-300 bg-base-100 hover:border-orange-500/50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center mb-3">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-base-content">Equipment Owner</h4>
                  <p className="text-[11px] text-base-content/70 mt-1">
                    Monetize idle machinery, list fleet units, and receive Stripe payouts.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3.5 rounded-xl border border-base-300 font-bold hover:bg-base-200"
                >
                  <ArrowLeft className="w-4 h-4 mx-auto" />
                </button>
                <button
                  type="button"
                  onClick={handleNextStep3}
                  className="w-2/3 btn-premium-primary py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Review & Confirm</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Confirmation */}
          {step === 4 && (
            <motion.form
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleCompleteRegistration}
              className="space-y-4 text-xs"
            >
              <div className="p-4 rounded-2xl bg-base-200/80 border border-base-300/80 space-y-2 text-xs">
                <h4 className="font-black text-base-content">Registration Summary:</h4>
                <div className="flex justify-between text-base-content/70">
                  <span>Name:</span>
                  <span className="font-bold text-base-content">{name}</span>
                </div>
                <div className="flex justify-between text-base-content/70">
                  <span>Email:</span>
                  <span className="font-bold text-base-content">{email}</span>
                </div>
                <div className="flex justify-between text-base-content/70">
                  <span>Selected Role:</span>
                  <span className="font-black text-electric-500">{role}</span>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start space-x-2.5 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="checkbox checkbox-primary checkbox-xs mt-0.5 rounded-md"
                />
                <span className="text-[11px] text-base-content/80 leading-relaxed">
                  I agree to the GearUp Equipment Rental Marketplace Terms of Service, Privacy Policy, and Peer-to-Peer Rental Agreement.
                </span>
              </label>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-1/3 py-3.5 rounded-xl border border-base-300 font-bold hover:bg-base-200"
                >
                  <ArrowLeft className="w-4 h-4 mx-auto" />
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 btn-premium-orange py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 5: Animated Success Screen */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-6 space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center ring-8 ring-emerald-500/10 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-base-content tracking-tight">Account Created!</h3>
                <p className="text-xs text-base-content/70">
                  Welcome to GearUp, {name}. Your {role} session has been established.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    if (role === 'Owner') router.push('/dashboard/owner');
                    else router.push('/dashboard/customer');
                  }}
                  className="btn-premium-primary px-8 py-3.5 text-xs font-black uppercase tracking-wider"
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Existing account link */}
        {step <= 4 && (
          <p className="text-center text-xs text-base-content/60 mt-6 pt-4 border-t border-base-200">
            Already registered?{' '}
            <NextLink href="/login" className="font-bold text-electric-500 hover:underline">
              Sign In to your account
            </NextLink>
          </p>
        )}

      </div>
    </div>
  );
}
