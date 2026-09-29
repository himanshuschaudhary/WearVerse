import React, { useState } from 'react';
import { X, LogIn, UserPlus, Sparkles, Lock, Mail, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WearVerseLogo } from '../WearVerseLogo';

interface AuthModalProps {
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode = 'login' }) => {
  const { login, closeModal, theme } = useApp();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-md border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 transition-colors ${
        theme === 'dark'
          ? 'bg-[#121624] border-slate-700/80 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900 shadow-xl'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={closeModal}
          className={`absolute top-4 right-4 p-2 rounded-xl transition ${
            theme === 'dark'
              ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <WearVerseLogo size="md" showText={false} />
          </div>
          <h2 className={`text-xl sm:text-2xl font-black font-['Space_Grotesk'] ${
            theme === 'dark' ? 'text-white' : 'text-slate-950'
          }`}>
            {mode === 'login' ? 'Sign In to WearVerse' : 'Create Creator Account'}
          </h2>
          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {mode === 'login' 
              ? 'Access your custom T-shirt wardrobe & manage live orders' 
              : 'Unlock 3 complimentary AI design syntheses and virtual try-on'}
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {mode === 'signup' && (
            <div>
              <label className={`text-[11px] font-bold block mb-1.5 flex items-center gap-1.5 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <User className="w-3.5 h-3.5 text-indigo-500" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white'
                }`}
              />
            </div>
          )}

          <div>
            <label className={`text-[11px] font-bold block mb-1.5 flex items-center gap-1.5 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <Mail className="w-3.5 h-3.5 text-indigo-500" />
              <span>Email Address</span>
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white'
              }`}
            />
          </div>

          <div>
            <label className={`text-[11px] font-bold block mb-1.5 flex items-center gap-1.5 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <Lock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white'
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 !text-white text-white-force font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95 mt-2"
          >
            {mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4 !text-white text-white-force" />
                <span className="!text-white text-white-force">Sign In</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 !text-white text-white-force" />
                <span className="!text-white text-white-force">Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className={`pt-2 text-center text-xs border-t ${
          theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
        }`}>
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => setMode('signup')}
                className="text-indigo-500 hover:underline font-bold ml-1"
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
                className="text-indigo-500 hover:underline font-bold ml-1"
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
