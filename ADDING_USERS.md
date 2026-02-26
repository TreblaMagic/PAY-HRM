# How to Add Users

There are several ways to add users to your Supabase application:

## Method 1: Using Supabase Studio (Easiest for Local Development)

1. **Open Supabase Studio:**
   - Go to: http://127.0.0.1:54323
   - Navigate to **Authentication** → **Users** in the left sidebar

2. **Add a new user:**
   - Click **"Add user"** button
   - Enter:
     - **Email**: user@example.com
     - **Password**: (choose a secure password)
     - **Auto Confirm User**: ✅ Check this box (for local dev, skips email verification)
   - Click **"Create user"**

3. **Add user role:**
   - After creating the user, note the **User ID** (UUID)
   - Go to **Table Editor** → **user_roles**
   - Click **"Insert"** → **"Insert row"**
   - Enter:
     - **user_id**: (paste the User ID from step 2)
     - **username**: (e.g., "john_doe")
     - **role**: Choose one: `HR`, `Finance`, or `IT`
   - Click **"Save"**

## Method 2: Using the App UI (Roles & Permissions Page)

If you have access to the Roles & Permissions page in your app:

1. **Navigate to Roles & Permissions:**
   - In your app, go to the Roles & Permissions page
   - You should see a "Create User" form

2. **Fill in the form:**
   - **Username**: e.g., "john_doe"
   - **Email**: user@example.com
   - **Password**: (choose a secure password)
   - **Role**: Select `HR`, `Finance`, or `IT`

3. **Submit:**
   - Click "Create User"
   - The app will create both the auth user and the role entry automatically

## Method 3: Using SQL in Supabase Studio

1. **Open Supabase Studio:**
   - Go to: http://127.0.0.1:54323
   - Navigate to **SQL Editor**

2. **Run this SQL:**
   ```sql
   -- First, create the auth user
   INSERT INTO auth.users (
     instance_id,
     id,
     aud,
     role,
     email,
     encrypted_password,
     email_confirmed_at,
     created_at,
     updated_at,
     raw_app_meta_data,
     raw_user_meta_data,
     is_super_admin,
     confirmation_token,
     recovery_token
   ) VALUES (
     '00000000-0000-0000-0000-000000000000',
     gen_random_uuid(),
     'authenticated',
     'authenticated',
     'user@example.com',
     crypt('your_password_here', gen_salt('bf')),
     NOW(),
     NOW(),
     NOW(),
     '{"provider":"email","providers":["email"]}',
     '{}',
     FALSE,
     '',
     ''
   ) RETURNING id;
   ```

3. **Then add the role:**
   ```sql
   -- Replace 'USER_ID_FROM_ABOVE' with the ID returned from step 2
   INSERT INTO user_roles (user_id, username, role)
   VALUES (
     'USER_ID_FROM_ABOVE',
     'john_doe',
     'IT'  -- or 'HR' or 'Finance'
   );
   ```

## Method 4: Using Supabase CLI (Command Line)

You can also create users via the Supabase CLI, but this requires the service role key.

## Quick Test User

For local development, here's a quick SQL script to create a test user:

```sql
-- Create test user with IT role
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Create auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@test.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    FALSE
  ) RETURNING id INTO new_user_id;

  -- Add role
  INSERT INTO user_roles (user_id, username, role)
  VALUES (new_user_id, 'admin', 'IT');

  RAISE NOTICE 'User created with ID: %', new_user_id;
END $$;
```

## Important Notes

1. **Email Confirmation:**
   - For local development, you can disable email confirmation in `supabase/config.toml`
   - Or use "Auto Confirm User" in Supabase Studio when creating users

2. **Roles:**
   - Valid roles are: `HR`, `Finance`, `IT`
   - Users need both an auth.users entry AND a user_roles entry to work properly

3. **Password Requirements:**
   - Minimum 6 characters (Supabase default)
   - Use strong passwords in production

4. **Testing:**
   - After creating a user, try logging in at your app's login page
   - The user should be able to sign in with their email and password

## Troubleshooting

- **User can't log in:** Make sure `email_confirmed_at` is set (or email confirmation is disabled)
- **User has no role:** Check that an entry exists in `user_roles` table
- **Permission errors:** Verify RLS policies allow the user to access the tables they need
