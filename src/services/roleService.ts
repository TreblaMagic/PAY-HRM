
import { supabase } from '@/lib/supabaseClient';
import { UserWithRole, UserRole } from '@/types/role';

export const fetchUsers = async (): Promise<UserWithRole[]> => {
  try {
    // Using the "any" type here because the Supabase types don't include user_roles yet
    const { data, error } = await supabase
      .from('user_roles')
      .select('*, users:user_id(id, email)') as { data: any, error: any };
    
    if (error) {
      throw error;
    }

    // Format the data to match our UserWithRole type
    return data.map((item: any) => ({
      id: item.users.id,
      email: item.users.email,
      username: item.username || item.users.email.split('@')[0],
      role: item.role as UserRole,
      created_at: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (email: string, password: string, username: string, role: UserRole): Promise<void> => {
  try {
    // Create user in auth system
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (authError) {
      throw authError;
    }
    
    // Create user role in the custom table
    // Using "any" type here because the Supabase types don't include user_roles yet
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        username,
        role
      }) as { error: any };
    
    if (roleError) {
      throw roleError;
    }
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUserRole = async (userId: string, role: UserRole, username?: string): Promise<void> => {
  try {
    const updateData: { role: UserRole, username?: string } = { role };
    
    if (username) {
      updateData.username = username;
    }
    
    // Using "any" type here because the Supabase types don't include user_roles yet
    const { error } = await supabase
      .from('user_roles')
      .update(updateData)
      .eq('user_id', userId) as { error: any };
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // Delete user from auth system
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    
    if (authError) {
      throw authError;
    }
    
    // The user_role entry will be deleted automatically due to foreign key constraint
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getCurrentUserRole = async (): Promise<UserRole | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return null;
    }
    
    // Using "any" type here because the Supabase types don't include user_roles yet
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single() as { data: any, error: any };
    
    if (error || !data) {
      return null;
    }
    
    return data.role as UserRole;
  } catch (error) {
    console.error('Error getting current user role:', error);
    return null;
  }
};
