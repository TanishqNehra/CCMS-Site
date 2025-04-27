-- Check if user_role type exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('CUSTOMER', 'STAFF', 'DRIVER', 'ADMIN');
    END IF;
END$$;

-- Create profiles table with proper schema
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role user_role DEFAULT 'CUSTOMER'::user_role,
    phone_number TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can insert their own profile" ON profiles;

-- Create more permissive policies
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (true);  -- Allow anyone to view profiles for now

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id OR auth.role() = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Service role can insert profiles" 
ON profiles FOR INSERT 
WITH CHECK (true);  -- Allow anyone to insert profiles for now

-- Create or replace the function to handle new users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert if the profile doesn't already exist
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = new.id) THEN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
      new.id, 
      COALESCE(new.raw_user_meta_data->>'full_name', new.email),
      COALESCE((new.raw_user_meta_data->>'role')::user_role, 'CUSTOMER'::user_role)
    );
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
