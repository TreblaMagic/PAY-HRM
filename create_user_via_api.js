// Create user via Supabase Admin API
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz'; // From supabase start output

// Create admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createUser() {
  try {
    // First, check if user exists and delete it
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === 'treblamagic@gmail.com');
    
    if (existingUser) {
      console.log('Deleting existing user...');
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
      if (deleteError) {
        console.error('Error deleting user:', deleteError);
      } else {
        console.log('Existing user deleted');
      }
    }

    // Create user via Admin API (proper way)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: 'treblamagic@gmail.com',
      password: 'asdfghjkl',
      email_confirm: true, // Auto-confirm email for local dev
      user_metadata: {
        username: 'treblamagic'
      }
    });

    if (error) {
      console.error('Error creating user:', error);
      return;
    }

    console.log('User created successfully:', data.user.id);

    // Add role to user_roles table
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: data.user.id,
        username: 'treblamagic',
        role: 'IT'
      });

    if (roleError) {
      console.error('Error adding role:', roleError);
    } else {
      console.log('Role added successfully!');
    }

    console.log('\n✅ User creation complete!');
    console.log('Email: treblamagic@gmail.com');
    console.log('Password: asdfghjkl');
    console.log('Role: IT');
    console.log('User ID:', data.user.id);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createUser();
