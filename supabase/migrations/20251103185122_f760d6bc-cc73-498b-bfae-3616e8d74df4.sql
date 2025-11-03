-- Fix 1: Restrict profiles table to authenticated users only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Fix 2: Restrict votes table so users can only see their own votes
DROP POLICY IF EXISTS "Users can view all votes" ON public.votes;
CREATE POLICY "Users can view their own votes"
  ON public.votes FOR SELECT
  USING (auth.uid() = user_id);

-- Fix 3: Create role-based access control system for featured articles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Update articles policies to use role-based access control
DROP POLICY IF EXISTS "Users can create their own articles" ON public.articles;
CREATE POLICY "Users can create articles"
  ON public.articles FOR INSERT
  WITH CHECK (
    (is_featured = false AND auth.uid() = author_id)
    OR (is_featured = true AND public.has_role(auth.uid(), 'admin'))
  );

DROP POLICY IF EXISTS "Users can update their own articles" ON public.articles;
CREATE POLICY "Users can update articles"
  ON public.articles FOR UPDATE
  USING (
    (is_featured = false AND auth.uid() = author_id)
    OR (is_featured = true AND public.has_role(auth.uid(), 'admin'))
  );

DROP POLICY IF EXISTS "Users can delete their own articles" ON public.articles;
CREATE POLICY "Users can delete articles"
  ON public.articles FOR DELETE
  USING (
    (is_featured = false AND auth.uid() = author_id AND author_id IS NOT NULL)
    OR (is_featured = true AND public.has_role(auth.uid(), 'admin'))
  );

-- Add database constraints for input validation
ALTER TABLE public.profiles
  ADD CONSTRAINT username_length_check CHECK (char_length(username) <= 30),
  ADD CONSTRAINT full_name_length_check CHECK (char_length(full_name) <= 100),
  ADD CONSTRAINT bio_length_check CHECK (char_length(bio) <= 500);

ALTER TABLE public.comments
  ADD CONSTRAINT content_length_check CHECK (char_length(content) <= 5000 AND char_length(content) >= 1);

ALTER TABLE public.articles
  ADD CONSTRAINT title_length_check CHECK (char_length(title) <= 200 AND char_length(title) >= 1),
  ADD CONSTRAINT content_length_check CHECK (char_length(content) >= 1);