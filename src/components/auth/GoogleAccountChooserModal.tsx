'use client';

import React, { useState } from 'react';
import { X, UserPlus, ArrowRight, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { getGoogleOAuthUrl } from '@/context/AuthContext';

interface GoogleAccountChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (email: string, name: string, photoURL?: string) => Promise<boolean>;
}

export const GoogleAccountChooserModal: React.FC<GoogleAccountChooserModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
}) => {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDomain =
    typeof window !== 'undefined'
      ? window.location.host
      : 'equipment-rental-client-three.vercel.app';

  const handleAccountClick = async (email: string, name: string, photo?: string) => {
    setSelectedEmail(email);
    setAuthenticating(true);
    try {
      const ok = await onSelectAccount(email, name, photo);
      if (ok) {
        onClose();
      }
    } finally {
      setAuthenticating(false);
      setSelectedEmail(null);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    const derivedName = customName || customEmail.split('@')[0];
    await handleAccountClick(customEmail, derivedName);
  };

  const handleLaunchExternalGoogle = () => {
    const oauthUrl = getGoogleOAuthUrl();
    window.location.href = oauthUrl;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-[460px] bg-[#202124] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-700/60 relative overflow-hidden font-sans"
        style={{ fontFamily: 'Google Sans, Roboto, Arial, sans-serif' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={authenticating}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Google Branding */}
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="text-sm font-medium text-neutral-300">Sign in with Google</span>
        </div>

        {/* Heading & Target Domain strictly equipment-rental-client-three.vercel.app */}
        <div className="space-y-1 mb-6">
          <h2 className="text-2xl font-normal text-white">Choose an account</h2>
          <p className="text-sm text-neutral-300">
            to continue to{' '}
            <span className="font-semibold text-blue-400 underline decoration-blue-400/40 underline-offset-2">
              {currentDomain}
            </span>
          </p>
        </div>

        {/* Account Selector List */}
        <div className="space-y-1 border-t border-b border-neutral-700/80 py-2 mb-4">
          
          {/* Account 1: User's real Google Account (from screenshot) */}
          <button
            type="button"
            disabled={authenticating}
            onClick={() =>
              handleAccountClick(
                'mdsalahuddinsohag218@gmail.com',
                'Md. Salahuddin Sohag',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=mdsalahuddinsohag218'
              )
            }
            className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors text-left group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center font-bold text-base shrink-0 overflow-hidden ring-2 ring-white/10">
                <span>M</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate group-hover:text-blue-300 transition-colors">
                  Md. Salahuddin Sohag
                </p>
                <p className="text-xs text-neutral-400 truncate">
                  mdsalahuddinsohag218@gmail.com
                </p>
              </div>
            </div>

            {authenticating && selectedEmail === 'mdsalahuddinsohag218@gmail.com' ? (
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            )}
          </button>

          {/* Account 2: Verified GearUp Customer Account */}
          <button
            type="button"
            disabled={authenticating}
            onClick={() =>
              handleAccountClick(
                'customer.sohag@gearup.com',
                'Verified Customer (Sohag)',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=customer.sohag'
              )
            }
            className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors text-left group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shrink-0 overflow-hidden ring-2 ring-white/10">
                <span>V</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate group-hover:text-blue-300 transition-colors">
                  Verified Customer Fleet
                </p>
                <p className="text-xs text-neutral-400 truncate">
                  customer.sohag@gearup.com
                </p>
              </div>
            </div>

            {authenticating && selectedEmail === 'customer.sohag@gearup.com' ? (
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            )}
          </button>

          {/* Option 3: Use another account toggle */}
          {!showCustomInput ? (
            <button
              type="button"
              disabled={authenticating}
              onClick={() => setShowCustomInput(true)}
              className="w-full flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors text-left text-neutral-300 hover:text-white"
            >
              <div className="w-10 h-10 rounded-full border border-neutral-600 flex items-center justify-center shrink-0">
                <UserPlus className="w-4 h-4 text-neutral-400" />
              </div>
              <span className="text-sm font-medium">Use another account</span>
            </button>
          ) : (
            <form onSubmit={handleCustomSubmit} className="p-3 bg-white/[0.04] rounded-xl space-y-3 mt-1">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Enter your Google Email</label>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="name@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={authenticating || !customEmail}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white flex items-center gap-1"
                >
                  {authenticating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Sign In</span>}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Option 4: Launch external Google Accounts Authorization screen */}
        <div className="pt-1 pb-3 text-center">
          <button
            type="button"
            onClick={handleLaunchExternalGoogle}
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors font-medium"
          >
            <span>Launch External Google OAuth Web Redirect</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Legal Notice */}
        <p className="text-[11px] text-neutral-400 text-center leading-relaxed mb-4">
          To continue, Google will share your name, email address, and profile picture with{' '}
          <span className="text-white font-medium">{currentDomain}</span>.
        </p>

        {/* Footer Links */}
        <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-800">
          <span>English (United States)</span>
          <div className="flex gap-3">
            <span className="hover:text-neutral-400 cursor-pointer">Help</span>
            <span className="hover:text-neutral-400 cursor-pointer">Privacy</span>
            <span className="hover:text-neutral-400 cursor-pointer">Terms</span>
          </div>
        </div>

      </div>
    </div>
  );
};
