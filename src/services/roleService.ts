
import { supabase } from '@/lib/supabaseClient';
import { UserWithRole, UserRole } from '@/types/role';

export const fetchUsers = async (): Promise<UserWithRole[]> => {
  try {
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
    console.log('Fetching current user role...');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No active session found');
      return null;
    }
    
    console.log('Session found for user:', session.user.email);
    
    // Special case for admin user
    if (session.user.email === 'treblamagic@gmail.com') {
      console.log('Admin user detected, checking if IT role exists');
      
      // Check if admin already has a role
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single() as { data: any, error: any };
      
      if (error || !data) {
        console.log('No role found for admin, assigning IT role');
        // Try to insert the IT role for this user
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: session.user.id,
            username: 'Admin',
            role: 'IT'
          });
        
        if (!insertError) {
          console.log('Successfully assigned IT role to Admin user');
          return 'IT';
        } else {
          console.error('Error assigning IT role:', insertError);
        }
      } else {
        console.log('Admin role found:', data.role);
        return data.role as UserRole;
      }
    }
    
    // For non-admin users
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single() as { data: any, error: any };
    
    if (error || !data) {
      console.log('No role found for user');
      return null;
    }
    
    console.log('Role found for user:', data.role);
    return data.role as UserRole;
  } catch (error) {
    console.error('Error getting current user role:', error);
    return null;
  }
};

// Function to assign IT role to a specific user
export const assignITRoleToAdmin = async (email: string): Promise<boolean> => {
  try {
    // We can't directly query auth.users from client-side
    // Instead, we need the user to be logged in or look them up differently
    
    // Get user by querying the user_roles table for a user with matching email
    // This requires a different approach since we can't directly access auth.users
    
    // For this specific function, we'll get the current user's session
    // and check if the email matches the target email
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || session.user.email !== email) {
      console.error('User not found or not logged in as the target user:', email);
      return false;
    }
    
    const userId = session.user.id;
    
    // Check if user already has a role
    const { data: existingRole, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (existingRole) {
      // Update existing role to IT
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({ role: 'IT', username: 'Admin' })
        .eq('user_id', userId);
        
      if (updateError) {
        console.error('Error updating role:', updateError);
        return false;
      }
    } else {
      // Insert new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          username: 'Admin',
          role: 'IT'
        });
        
      if (insertError) {
        console.error('Error inserting role:', insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error assigning IT role:', error);
    return false;
  }
};
