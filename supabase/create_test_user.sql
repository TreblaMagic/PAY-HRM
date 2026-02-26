-- Create user: treblamagic@gmail.com with IT role
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
    'treblamagic@gmail.com',
    crypt('asdfghjkl', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    FALSE
  ) RETURNING id INTO new_user_id;

  -- Add IT role
  INSERT INTO user_roles (user_id, username, role)
  VALUES (new_user_id, 'treblamagic', 'IT')
  ON CONFLICT (user_id) DO UPDATE SET role = 'IT', username = 'treblamagic';

  RAISE NOTICE 'User created successfully with ID: %', new_user_id;
END $$;
