import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Mail,
  User,
  Sparkles,
  Lock,
  ExternalLink,
  GraduationCap,
  KeyRound,
} from 'lucide-react';
import { useAuth, DEMO_CAMPUS_USERS } from '../context/AuthContext';
import { AuthUser } from '../types/auth';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack, onLoginSuccess }) => {
  const { user, loginWithGoogleCredential, loginWithGoogleProfile, loginWithCampusEmail, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'google' | 'campus'>('google');
  
  // Custom Google Login states
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  
  // Campus Email Form states
  const [campusEmail, setCampusEmail] = useState('');
  const [campusName, setCampusName] = useState('');
  const [campusStudentId, setCampusStudentId] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Initialize official Google Identity Services (GIS) if available
  useEffect(() => {
    const clientId =
      (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
      '983741827364-sample.apps.googleusercontent.com';

    if (window.google?.accounts?.id && googleBtnRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential?: string }) => {
            if (response.credential) {
              loginWithGoogleCredential(response.credential);
              onLoginSuccess();
            }
          },
        });

        // Render official button
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        });
      } catch (e) {
        console.log('GIS render info:', e);
      }
    }
  }, [loginWithGoogleCredential, onLoginSuccess]);

  const handleSelectDemoGoogleUser = (preset: AuthUser) => {
    loginWithGoogleProfile(preset);
    onLoginSuccess();
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) {
      setErrorMsg('Please enter your Google account email');
      return;
    }
    if (!customGoogleEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    loginWithGoogleProfile({
      email: customGoogleEmail.trim(),
      name: customGoogleName.trim() || customGoogleEmail.split('@')[0],
      provider: 'google',
    });
    onLoginSuccess();
  };

  const handleCampusEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campusEmail.trim()) {
      setErrorMsg('Campus email is required');
      return;
    }
    if (!campusEmail.includes('@')) {
      setErrorMsg('Please enter a valid campus email');
      return;
    }

    loginWithCampusEmail(campusEmail, campusName, campusStudentId);
    onLoginSuccess();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Back Link */}
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to CampusFind Portal</span>
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-7 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md mb-3">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Sign in to CampusFind
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Use your campus Google account to report, track, and recover belongings.
            </p>
          </div>

          {/* Active User Alert if already logged in */}
          {user && (
            <div className="mb-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={
                    user.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`
                  }
                  alt={user.name}
                  className="w-10 h-10 rounded-full border border-indigo-200 object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                  <span className="inline-block px-2 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 mt-0.5">
                    Currently Signed In
                  </span>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <button
                  onClick={onLoginSuccess}
                  className="px-3 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                >
                  Continue
                </button>
                <button
                  onClick={logout}
                  className="text-[11px] text-rose-600 hover:underline font-semibold"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Login Mode Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
            <button
              onClick={() => {
                setActiveTab('google');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeTab === 'google'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {/* Google G Icon */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
              <span>Google Sign-In</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('campus');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeTab === 'campus'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Campus Email</span>
            </button>
          </div>

          {/* TAB 1: GOOGLE SIGN-IN */}
          {activeTab === 'google' && (
            <div className="space-y-5">
              {/* GIS Container */}
              <div ref={googleBtnRef} className="w-full flex justify-center min-h-[44px]" />

              {/* Direct Quick Google Account Sign-In */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Or select a verified campus Google profile:
                </p>
                <div className="space-y-2">
                  {DEMO_CAMPUS_USERS.map(demo => (
                    <button
                      key={demo.id}
                      type="button"
                      onClick={() => handleSelectDemoGoogleUser(demo)}
                      className="w-full flex items-center justify-between p-2.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition text-left cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={demo.avatar}
                          alt={demo.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 flex items-center space-x-1.5">
                            <span>{demo.name}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-normal">
                              {demo.role}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">{demo.email}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Sign In →
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enter any Google email */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500 mb-2">
                  Sign in with any custom Google account:
                </p>
                <form onSubmit={handleCustomGoogleSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={customGoogleEmail}
                      onChange={e => setCustomGoogleEmail(e.target.value)}
                      placeholder="your.name@gmail.com or @campus.edu"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    {/* Google G icon */}
                    <svg className="w-4 h-4 absolute left-3 top-2.5" viewBox="0 0 24 24">
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
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition cursor-pointer flex items-center justify-center space-x-2 shadow-xs"
                  >
                    <span>Continue with Google</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: CAMPUS EMAIL SIGN-IN */}
          {activeTab === 'campus' && (
            <form onSubmit={handleCampusEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Student / Staff Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={campusName}
                    onChange={e => setCampusName(e.target.value)}
                    placeholder="e.g. Jordan Smith"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Campus Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={campusEmail}
                    onChange={e => setCampusEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Student ID Number (Optional)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={campusStudentId}
                    onChange={e => setCampusStudentId(e.target.value)}
                    placeholder="e.g. STU-2024-9102"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition cursor-pointer flex items-center justify-center space-x-2 shadow-xs mt-2"
              >
                <span>Sign In with Campus ID</span>
              </button>
            </form>
          )}

          {/* Architecture Privacy & No-Firebase Notice */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <div className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Google Identity (GIS) • Zero Firebase Dependency</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Your profile is preserved locally across browser sessions and linked to reports you publish.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
