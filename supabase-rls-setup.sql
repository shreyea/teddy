-- ================================================
-- RLS POLICIES FOR PROJECTS TABLE
-- Run this in Supabase Dashboard > SQL Editor
-- ================================================

-- Step 1: Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies (if any) to start fresh
DROP POLICY IF EXISTS "select_projects" ON projects;
DROP POLICY IF EXISTS "update_projects" ON projects;
DROP POLICY IF EXISTS "insert_projects" ON projects;

-- Step 3: Allow SELECT for all (needed for login verification + public view)
CREATE POLICY "select_projects" ON projects
FOR SELECT
USING (true);

-- Step 4: Allow UPDATE for all (we verify by project ID in our code)
CREATE POLICY "update_projects" ON projects
FOR UPDATE
USING (true);

-- Step 5: (Optional) Allow INSERT if you need to create projects
CREATE POLICY "insert_projects" ON projects
FOR INSERT
WITH CHECK (true);

-- ================================================
-- VERIFY: Run this to check policies are set
-- ================================================
SELECT * FROM pg_policies WHERE tablename = 'projects';
