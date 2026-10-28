export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'faculty' | 'security' | 'staff';
  studentId?: string;
  department?: string;
  provider: 'google' | 'campus';
  loginAt: string;
}

export interface GoogleJwtPayload {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified?: boolean;
}
