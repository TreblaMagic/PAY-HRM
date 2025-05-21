import { supabase } from '@/lib/supabaseClient';
import { UserWithRole, UserRole, rolePermissions } from '@/types/role';

export const fetchUsers = async (): Promise<UserWithRole[]> => {
  try {
    console.log('Fetching users...');
    // First get all user roles
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('*') as { data: any[], error: any };
    
    if (roleError) {
      console.error('Supabase error fetching user roles:', roleError);
      throw new Error(`Failed to fetch user roles: ${roleError.message}`);
    }

    if (!roleData || roleData.length === 0) {
      console.log('No user roles found');
      return [];
    }

    // Get user information from auth for each role
    const formattedUsers = await Promise.all(roleData.map(async (role) => {
      const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(role.user_id);
      
      if (userError) {
        console.error(`Error fetching user ${role.user_id}:`, userError);
        return {
          id: role.user_id,
          email: 'Unknown',
          username: role.username || 'Unknown',
          role: role.role as UserRole,
          created_at: role.created_at
        };
      }

      return {
        id: role.user_id,
        email: user?.email || 'Unknown',
        username: role.username || (user?.email || 'Unknown').split('@')[0],
        role: role.role as UserRole,
        created_at: role.created_at
      };
    }));

    console.log(`Successfully fetched ${formattedUsers.length} users`);
    return formattedUsers;
  } catch (error) {
    console.error('Error in fetchUsers:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to load users: ${error.message}`);
    }
    throw new Error('Failed to load users: Unknown error occurred');
  }
};

export const createUser = async (email: string, password: string, username: string, role: UserRole): Promise<void> => {
  try {
    // Create user in auth system using regular signUp
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role
        }
      }
    });
    
    if (authError) {
      throw authError;
    }
    
    if (!authData.user) {
      throw new Error('User creation failed');
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
      // If role creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
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
    
    // First check user metadata for role
    const userRole = session.user.user_metadata?.role as UserRole;
    if (userRole && ['HR', 'Finance', 'IT'].includes(userRole)) {
      console.log('Found role in user metadata:', userRole);
      return userRole;
    }
    
    // Special case for admin user
    if (session.user.email === 'treblamagic@gmail.com') {
      console.log('Admin user detected, assigning IT role directly');
        return 'IT';
    }
    
    // For non-admin users, check the user_roles table
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();
      
      if (error || !data) {
        console.log('No role found in user_roles table');
        return null;
      }
      
      console.log('Role found in user_roles table:', data.role);
      return data.role as UserRole;
    } catch (error) {
      console.error('Error getting user role from table:', error);
      return null;
    }
  } catch (error) {
    console.error('Error in getCurrentUserRole:', error);
    return null;
  }
};

// Updated function to assign IT role to admin
export const assignITRoleToAdmin = async (email: string): Promise<boolean> => {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || session.user.email !== email) {
      console.error('User not found or not logged in as the target user:', email);
      return false;
    }
    
    const userId = session.user.id;
    console.log('Assigning IT role to user ID:', userId);
    
    // Check if user already has a role
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (existingRole) {
      // Update existing role to IT
      console.log('Updating existing role to IT');
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
      console.log('Inserting new IT role');
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
    
    console.log('Successfully assigned IT role to', email);
    return true;
  } catch (error) {
    console.error('Error assigning IT role:', error);
    return false;
  }
};

export const debugUserRole = async (): Promise<{
  session: any;
  role: UserRole | null;
  permissions: string[] | null;
  error?: string;
}> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return {
        session: null,
        role: null,
        permissions: null,
        error: 'No active session found'
      };
    }
    
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();
    
    if (roleError || !roleData) {
      return {
        session: session.user,
        role: null,
        permissions: null,
        error: roleError?.message || 'No role found for user'
      };
    }
    
    const role = roleData.role as UserRole;
    const permissions = rolePermissions[role] || null;
    
    return {
      session: session.user,
      role,
      permissions
    };
  } catch (error) {
    return {
      session: null,
      role: null,
      permissions: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
