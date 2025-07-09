/*
  # Counsellor Authentication and Role-Based Access

  1. Schema Changes
    - Add role column to profiles table
    - Add is_first_login column to profiles table

  2. Security Updates
    - Update RLS policies for role-based access
    - Add functions for role checking

  3. Data Setup
    - Update existing counsellor records with proper user associations
*/

-- Add role column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text CHECK (role IN ('user', 'counsellor', 'admin')) DEFAULT 'user';
  END IF;
END $$;

-- Add is_first_login column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_first_login'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_first_login boolean DEFAULT true;
  END IF;
END $$;

-- Update RLS policies for role-based access

-- Messages policies for counsellors
DROP POLICY IF EXISTS "Users can read own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;

CREATE POLICY "Users and counsellors can read their messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id OR
    auth.uid() IN (
      SELECT user_id FROM counsellors 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users and counsellors can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Appointments policies for counsellors
DROP POLICY IF EXISTS "Users can read own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;

CREATE POLICY "Users and counsellors can read relevant appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT user_id FROM counsellors WHERE id = counsellor_id)
  );

CREATE POLICY "Users and counsellors can update relevant appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT user_id FROM counsellors WHERE id = counsellor_id)
  );

-- Sessions policies for counsellors
DROP POLICY IF EXISTS "Users can read own sessions" ON sessions;
DROP POLICY IF EXISTS "Counsellors can create sessions" ON sessions;

CREATE POLICY "Users and counsellors can read relevant sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT user_id FROM counsellors WHERE id = counsellor_id)
  );

CREATE POLICY "Counsellors can manage sessions"
  ON sessions FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM counsellors WHERE id = counsellor_id))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM counsellors WHERE id = counsellor_id));

-- Create function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role FROM profiles WHERE id = user_id;
$$;

-- Create function to check if user is counsellor
CREATE OR REPLACE FUNCTION is_counsellor(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1 FROM profiles 
    WHERE id = user_id AND role = 'counsellor'
  );
$$;

-- Note: Counsellor user accounts will need to be created manually through Supabase Auth
-- or through the application signup process with role assignment.
-- The following counsellor emails should be created:
-- - sarah.johnson@u-recover.com
-- - michael.chen@u-recover.com  
-- - emily.davis@u-recover.com
-- - james.wilson@u-recover.com
-- Default password: counsellor123 (to be changed on first login)