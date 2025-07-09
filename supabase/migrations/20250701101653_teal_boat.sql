/*
  # Role-Based Dashboard System

  1. Schema Updates
    - Expand role types in profiles table
    - Add permissions table for granular access control
    - Add role_permissions junction table
    - Add content workflow tables
    - Add user management audit logs

  2. New Tables
    - permissions - Define system permissions
    - role_permissions - Map roles to permissions
    - content_workflows - Track content approval process
    - user_audit_logs - Track user management actions
    - client_assessments - Patient assessment reports for counsellors

  3. Security
    - Update RLS policies for role-based access
    - Add permission checking functions
*/

-- Update profiles table role constraint to include all new roles
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN (
    'user', 'counsellor', 'admin', 'manager', 'content_manager', 
    'moderator', 'senior_writer', 'writer', 'contributor'
  ));

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  granted_at timestamptz DEFAULT now(),
  UNIQUE(role, permission_id)
);

-- Create content_workflows table
CREATE TABLE IF NOT EXISTS content_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('blog_post', 'article', 'resource')),
  content_id uuid NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES auth.users(id),
  status text NOT NULL CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'published')) DEFAULT 'draft',
  comments text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_audit_logs table
CREATE TABLE IF NOT EXISTS user_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  details jsonb,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Create client_assessments table for counsellors
CREATE TABLE IF NOT EXISTS client_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  counsellor_id uuid REFERENCES counsellors(id) ON DELETE CASCADE,
  client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id uuid REFERENCES sessions(id),
  assessment_type text NOT NULL CHECK (assessment_type IN ('initial', 'progress', 'discharge', 'crisis')),
  mood_assessment jsonb,
  risk_assessment jsonb,
  treatment_goals text[],
  progress_notes text,
  recommendations text,
  next_steps text,
  confidential_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert system permissions
INSERT INTO permissions (name, description, category) VALUES
-- User Management
('manage_all_users', 'Create, modify, delete all user accounts', 'user_management'),
('manage_domain_users', 'Manage users within assigned domain', 'user_management'),
('view_user_analytics', 'View user analytics and reports', 'user_management'),
('suspend_users', 'Suspend or warn users', 'user_management'),

-- Content Management
('create_all_content', 'Create and edit all content types', 'content_management'),
('approve_content', 'Approve content for publication', 'content_management'),
('publish_content', 'Publish content directly', 'content_management'),
('moderate_comments', 'Moderate user comments and testimonials', 'content_management'),
('manage_editorial_calendar', 'Manage content scheduling and calendar', 'content_management'),
('assign_content_tasks', 'Assign tasks to writers', 'content_management'),

-- System Administration
('system_configuration', 'Access system settings and configuration', 'system_admin'),
('database_management', 'Database management and backups', 'system_admin'),
('server_monitoring', 'Server monitoring and maintenance', 'system_admin'),
('override_permissions', 'Override any permission or restriction', 'system_admin'),

-- Analytics and Reporting
('view_all_analytics', 'View comprehensive analytics and reports', 'analytics'),
('view_content_analytics', 'View content performance metrics', 'analytics'),
('generate_reports', 'Generate reports for assigned areas', 'analytics'),

-- Counsellor Specific
('view_client_assessments', 'View and create client assessment reports', 'counsellor'),
('manage_client_sessions', 'Manage client sessions and notes', 'counsellor'),
('access_client_data', 'Access client wellness and session data', 'counsellor');

-- Assign permissions to roles
INSERT INTO role_permissions (role, permission_id) 
SELECT 'admin', id FROM permissions; -- Admin gets all permissions

INSERT INTO role_permissions (role, permission_id) 
SELECT 'manager', id FROM permissions 
WHERE name IN (
  'manage_domain_users', 'view_user_analytics', 'approve_content', 
  'moderate_comments', 'view_all_analytics', 'generate_reports'
);

INSERT INTO role_permissions (role, permission_id) 
SELECT 'content_manager', id FROM permissions 
WHERE name IN (
  'create_all_content', 'approve_content', 'publish_content', 
  'manage_editorial_calendar', 'assign_content_tasks', 'view_content_analytics'
);

INSERT INTO role_permissions (role, permission_id) 
SELECT 'moderator', id FROM permissions 
WHERE name IN (
  'approve_content', 'moderate_comments', 'suspend_users', 'generate_reports'
);

INSERT INTO role_permissions (role, permission_id) 
SELECT 'senior_writer', id FROM permissions 
WHERE name IN (
  'create_all_content', 'publish_content', 'assign_content_tasks', 'view_content_analytics'
);

INSERT INTO role_permissions (role, permission_id) 
SELECT 'writer', id FROM permissions 
WHERE name IN ('create_all_content', 'view_content_analytics');

INSERT INTO role_permissions (role, permission_id) 
SELECT 'contributor', id FROM permissions 
WHERE name IN ('create_all_content');

INSERT INTO role_permissions (role, permission_id) 
SELECT 'counsellor', id FROM permissions 
WHERE name IN (
  'view_client_assessments', 'manage_client_sessions', 'access_client_data'
);

-- Enable RLS on new tables
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for permissions (read-only for authenticated users)
CREATE POLICY "Anyone can read permissions"
  ON permissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read role permissions"
  ON role_permissions FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for content workflows
CREATE POLICY "Users can read own content workflows"
  ON content_workflows FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id OR auth.uid() = reviewer_id);

CREATE POLICY "Authors can create content workflows"
  ON content_workflows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors and reviewers can update workflows"
  ON content_workflows FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id OR auth.uid() = reviewer_id);

-- RLS Policies for user audit logs (admin only)
CREATE POLICY "Admins can manage audit logs"
  ON user_audit_logs FOR ALL
  TO authenticated
  USING (
    EXISTS(
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- RLS Policies for client assessments
CREATE POLICY "Counsellors can manage own client assessments"
  ON client_assessments FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM counsellors 
      WHERE id = client_assessments.counsellor_id
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM counsellors 
      WHERE id = client_assessments.counsellor_id
    )
  );

-- Create function to check user permissions
CREATE OR REPLACE FUNCTION has_permission(user_id uuid, permission_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1 
    FROM profiles p
    JOIN role_permissions rp ON p.role = rp.role
    JOIN permissions perm ON rp.permission_id = perm.id
    WHERE p.id = user_id AND perm.name = permission_name
  );
$$;

-- Create function to get user permissions
CREATE OR REPLACE FUNCTION get_user_permissions(user_id uuid)
RETURNS TABLE(permission_name text, permission_description text, category text)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT perm.name, perm.description, perm.category
  FROM profiles p
  JOIN role_permissions rp ON p.role = rp.role
  JOIN permissions perm ON rp.permission_id = perm.id
  WHERE p.id = user_id;
$$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role);
CREATE INDEX IF NOT EXISTS idx_content_workflows_author ON content_workflows(author_id);
CREATE INDEX IF NOT EXISTS idx_content_workflows_status ON content_workflows(status);
CREATE INDEX IF NOT EXISTS idx_client_assessments_counsellor ON client_assessments(counsellor_id);
CREATE INDEX IF NOT EXISTS idx_client_assessments_client ON client_assessments(client_id);