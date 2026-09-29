import React, { useState } from 'react';
import { X, LogIn, UserPlus, Sparkles, Lock, Mail, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WearVerseLogo } from '../WearVerseLogo';

interface AuthModalProps {
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode = 'login' }) => {
  const { login, closeModal } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // Check for Founder / Store Owner credentials (Himanshu)
    const isFounderCredential = 
      (cleanEmail.toLowerCase() === 'himanshu@wearverse.com' ||
       cleanEmail.toLowerCase() === 'admin@wearverse.com' ||
       cleanEmail.toLowerCase() === 'founder@wearverse.com' ||
       cleanEmail.toLowerCase() === 'himanshu') &&
      (cleanPassword === 'wearverse2026' || cleanPassword === 'admin123' || cleanPassword === 'admin' || cleanPassword === 'founder');

    if (isFounderCredential) {
      login({
        name: 'Himanshu (Founder)',
        username: 'himanshu',
        role: 'admin',
        email: 'himanshu@wearverse.com',
        hasUnlimitedPass: true,
        creditsRemaining: 9999,
      });
      return;
    }

    const cleanName = name.trim() || (cleanEmail ? cleanEmail.split('@')[0] : 'Creator');
    const username = (cleanEmail ? cleanEmail.split('@')[0] : 'creator')
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '');

    login({
      name: cleanName,
      username: username || 'creator',
      role: 'user',
      email: cleanEmail,
      creditsRemaining: 3,
      hasUnlimitedPass: false,
    });
  };

  const handleFounderQuickLogin = () => {
    login({
      name: 'Himanshu (Founder)',
      username: 'himanshu',
      role: 'admin',
      email: 'himanshu@wearverse.com',
      hasUnlimitedPass: true,
      creditsRemaining: 9999,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#121624] border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <WearVerseLogo size="md" showText={false} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Space_Grotesk']">
            {mode === 'login' ? 'Sign In to WearVerse' : 'Create Creator Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login' 
              ? 'Access your custom T-shirt wardrobe & manage live orders' 
              : 'Unlock 3 complimentary AI design syntheses and virtual try-on'}
          </p>
        </div>

        {/* Founder (Himanshu) Quick Access Portal */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-indigo-500/10 border border-amber-500/35 flex items-center justify-between gap-3 shadow-lg shadow-amber-500/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/25 border border-amber-500/50 flex items-center justify-center text-amber-300 text-base shadow-sm">
              👑
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-300">Founder Himanshu</span>
                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">Owner</span>
              </div>
              <p className="text-[10px] text-slate-400">Unlimited AI • Full Store Manager</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFounderQuickLogin}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition active:scale-95 whitespace-nowrap"
            title="Log in directly as Founder Himanshu with unlimited designs and Store Manager access"
          >
            Founder Sign-In
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-wider text-slate-500">or sign in with email</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>Email Address</span>
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com (or himanshu@wearverse.com)"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password (Founder: wearverse2026)"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95"
          >
            {mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account (3 Free Designs)</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-slate-400 pt-1 border-t border-slate-800">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => setMode('signup')}
                className="text-indigo-400 hover:underline font-bold ml-1"
              >
                Sign up free
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => setMode('login')}
                className="text-indigo-400 hover:underline font-bold ml-1"
              >
                Sign in
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
