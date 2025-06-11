export type UserRole = 'HR' | 'Finance' | 'IT' | 'Agent';

export interface UserWithRole {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  created_at: string;
}

export const rolePermissions: Record<UserRole, string[]> = {
  'HR': [
    '/dashboard',
    '/employees',
    '/attendance',
    '/leave',
    '/documents',
    '/roles-permissions'
  ],
  'Finance': [
    '/dashboard',
    '/payroll',
    '/isp',
    '/documents'
  ],
  'IT': [
    '/dashboard',
    '/employees',
    '/attendance',
    '/leave',
    '/payroll',
    '/isp',
    '/documents',
    '/isp/settings',
    '/roles-permissions'
  ],
  'Agent': [
    '/dashboard',
    '/isp',
    '/isp/settings'
  ]
};
