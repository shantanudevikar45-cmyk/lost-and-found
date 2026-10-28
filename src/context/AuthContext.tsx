import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, GoogleJwtPayload } from '../types/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginWithGoogleCredential: (credential: string) => void;
  loginWithGoogleProfile: (profile: Partial<AuthUser>) => void;
  loginWithCampusEmail: (email: string, name: string, studentId?: string) => void;
  logout: () => void;
}

const STORAGE_KEY = 'campusfind_auth_user';

export const DEMO_CAMPUS_USERS: AuthUser[] = [
  {
    id: 'google-usr-101',
    name: 'Alex Morgan',
    email: 'alex.morgan@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'student',
    studentId: 'STU-2024-8492',
    department: 'Computer Science & Engineering',
    provider: 'google',
    loginAt: new Date().toISOString(),
  },
  {
    id: 'google-usr-102',
    name: 'Elena Vance',
    email: 'elena.vance@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    role: 'student',
    studentId: 'STU-2023-4102',
    department: 'Electrical Engineering',
    provider: 'google',
    loginAt: new Date().toISOString(),
  },
  {
    id: 'google-usr-103',
    name: 'Officer Martinez',
    email: 'martinez.security@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    role: 'security',
    studentId: 'SEC-OFFICER-09',
    department: 'Campus Safety & Lost Desk',
    provider: 'google',
    loginAt: new Date().toISOString(),
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    // Default to the first demo student so the portal is immediately usable
    return DEMO_CAMPUS_USERS[0];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  /**
   * Decode Google Identity Services (GIS) JWT token directly in browser without Firebase
   */
  const loginWithGoogleCredential = (credential: string) => {
    try {
      const parts = credential.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT credential format');
      }

      // Base64Url decode payload
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload: GoogleJwtPayload = JSON.parse(jsonPayload);

      const authUser: AuthUser = {
        id: `google-${payload.sub}`,
        name: payload.name || payload.email.split('@')[0],
        email: payload.email,
        avatar: payload.picture,
        role: 'student',
        studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        department: 'General Studies',
        provider: 'google',
        loginAt: new Date().toISOString(),
      };

      setUser(authUser);
    } catch (err) {
      console.error('Error decoding Google Identity JWT:', err);
      // Fallback to demo profile with user's email if decoding failed
      loginWithGoogleProfile({ name: 'Google User', email: 'user@gmail.com' });
    }
  };

  /**
   * Sign in with Google account profile details
   */
  const loginWithGoogleProfile = (profile: Partial<AuthUser>) => {
    const authUser: AuthUser = {
      id: profile.id || `google-${Date.now()}`,
      name: profile.name || 'Google Student',
      email: profile.email || 'student@campus.edu',
      avatar:
        profile.avatar ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name || 'Student')}`,
      role: profile.role || 'student',
      studentId: profile.studentId || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      department: profile.department || 'Campus Department',
      provider: 'google',
      loginAt: new Date().toISOString(),
    };
    setUser(authUser);
  };

  /**
   * Sign in with standard campus email
   */
  const loginWithCampusEmail = (email: string, name: string, studentId?: string) => {
    const authUser: AuthUser = {
      id: `campus-${Date.now()}`,
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
      role: 'student',
      studentId: studentId?.trim() || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      department: 'Campus Student',
      provider: 'campus',
      loginAt: new Date().toISOString(),
    };
    setUser(authUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loginWithGoogleCredential,
        loginWithGoogleProfile,
        loginWithCampusEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
