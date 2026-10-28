import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  Menu,
  X,
  Compass,
  UserCheck,
  Code2,
  ChevronDown,
  Layers,
  LogOut,
  User,
  LogIn,
  Shield,
  GraduationCap,
} from 'lucide-react';
import { ItemType } from '../types/item';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onSearch: (query: string) => void;
  onOpenReportModal: (type?: ItemType) => void;
  onOpenBackendGuide: () => void;
  isBackendConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onSearch,
  onOpenReportModal,
  onOpenBackendGuide,
  isBackendConnected,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      onSearch(navSearch.trim());
      onNavigate('browse');
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'browse', label: 'Browse Items', icon: Layers },
    { id: 'my-reports', label: 'My Reports', icon: UserCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2.5 cursor-pointer group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 flex items-center justify-center text-white shadow-xs transition">
                <Search className="w-5 h-5 -rotate-12" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition">
                  Campus<span className="text-indigo-600">Find</span>
                </span>
                <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                  Lost & Found Portal
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map(link => {
                const Icon = link.icon;
                const active = currentTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => onNavigate(link.id)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                      active
                        ? 'text-indigo-600 bg-indigo-50/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </button>
                );
              })}

              {/* Spring Boot Backend Tab in nav */}
              <button
                onClick={onOpenBackendGuide}
                className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-indigo-500" />
                <span>Spring Boot Backend</span>
              </button>
            </nav>
          </div>

          {/* Center search bar (desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={navSearch}
                onChange={e => setNavSearch(e.target.value)}
                placeholder="Search campus items..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100/80 border border-transparent rounded-xl focus:bg-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2 pointer-events-none" />
            </form>
          </div>

          {/* Right Actions: User Profile Dropdown & Report CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* User Profile or Sign In Button */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-white hover:border-indigo-300 transition cursor-pointer"
                >
                  <img
                    src={
                      user.avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`
                    }
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight flex items-center space-x-1">
                      <span className="truncate max-w-[110px]">{user.name}</span>
                    </p>
                    <span className="text-[10px] text-slate-500 block leading-none capitalize">
                      {user.provider === 'google' ? 'Google Account' : 'Campus User'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-20 space-y-2">
                      <div className="p-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={
                              user.avatar ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`
                            }
                            alt={user.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          />
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                            <span className="inline-block mt-1 text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-semibold">
                              {user.studentId || user.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('my-reports');
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                        >
                          <UserCheck className="w-4 h-4 text-indigo-600" />
                          <span>My Reports</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('login');
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Switch User / Account</span>
                        </button>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-indigo-300 shadow-xs transition cursor-pointer"
              >
                {/* Google G icon */}
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
                <span>Sign In with Google</span>
              </button>
            )}

            {/* Prominent Report an Item Dropdown */}
            <div className="relative">
              <button
                onClick={() => setReportDropdownOpen(!reportDropdownOpen)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-xs transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report an Item</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Dropdown Menu */}
              {reportDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setReportDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-20">
                    <button
                      onClick={() => {
                        setReportDropdownOpen(false);
                        onOpenReportModal('LOST');
                      }}
                      className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-amber-50 text-left transition cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <PlusCircle className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800">
                          Report Lost Item
                        </div>
                        <div className="text-[11px] text-slate-400">I lost my belonging</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setReportDropdownOpen(false);
                        onOpenReportModal('FOUND');
                      }}
                      className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-emerald-50 text-left transition cursor-pointer group mt-1"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <PlusCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                          Report Found Item
                        </div>
                        <div className="text-[11px] text-slate-400">I discovered an item</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => onOpenReportModal('LOST')}
              className="p-2 text-white bg-indigo-600 rounded-xl"
              title="Report item"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200/80 bg-white px-4 pt-3 pb-6 space-y-3">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={navSearch}
              onChange={e => setNavSearch(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>

          {/* Navigation Items */}
          <div className="space-y-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const active = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition text-left ${
                    active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => {
                onOpenBackendGuide();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Code2 className="w-4 h-4 text-indigo-500" />
              <span>Spring Boot Backend Code</span>
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  onNavigate('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <User className="w-4 h-4 text-indigo-500" />
                <span>Profile & Switch User</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onNavigate('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 hover:bg-indigo-50 font-bold"
              >
                <LogIn className="w-4 h-4 text-indigo-600" />
                <span>Sign in with Google</span>
              </button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReportModal('LOST');
              }}
              className="w-full py-2.5 px-4 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl flex items-center justify-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Lost Item</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReportModal('FOUND');
              }}
              className="w-full py-2.5 px-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center justify-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Found Item</span>
            </button>
          </div>

          {isAuthenticated && user && (
            <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-between">
              <span>Signed in as <strong>{user.name}</strong></span>
              <button onClick={logout} className="text-rose-600 hover:underline font-semibold">
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
