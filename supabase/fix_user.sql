-- Fix user record for treblamagic@gmail.com
-- Delete and recreate with all required fields

DO $$
DECLARE
  user_id_to_delete UUID;
BEGIN
  -- Get the user ID
  SELECT id INTO user_id_to_delete FROM auth.users WHERE email = 'treblamagic@gmail.com';
  
  -- Delete existing user (this will cascade delete the role)
  IF user_id_to_delete IS NOT NULL THEN
    DELETE FROM auth.users WHERE id = user_id_to_delete;
    RAISE NOTICE 'Deleted existing user';
  END IF;
  
  -- Recreate user with all required fields
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change_token_new,
    recovery_token,
    phone_change_token,
    phone_change,
    email_change,
    is_super_admin,
    is_sso_user
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'treblamagic@gmail.com',
    crypt('asdfghjkl', gen_salt('bf')),
    NOW(),
    NOW(),
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    '',
    '',
    FALSE,
    FALSE
  ) RETURNING id INTO user_id_to_delete;

  -- Add IT role
  INSERT INTO user_roles (user_id, username, role)
  VALUES (user_id_to_delete, 'treblamagic', 'IT');

  RAISE NOTICE 'User recreated successfully with ID: %', user_id_to_delete;
END $$;
