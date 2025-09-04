-- Update articles table to support Featured Articles
-- Make author_id nullable to allow featured articles without authors
ALTER TABLE public.articles 
ALTER COLUMN author_id DROP NOT NULL;

-- Add new fields for featured articles
ALTER TABLE public.articles 
ADD COLUMN company_image TEXT,
ADD COLUMN is_featured BOOLEAN DEFAULT false,
ADD COLUMN read_time INTEGER;

-- Update RLS policies to handle nullable author_id
DROP POLICY IF EXISTS "Users can create their own articles" ON public.articles;
DROP POLICY IF EXISTS "Users can update their own articles" ON public.articles;
DROP POLICY IF EXISTS "Users can delete their own articles" ON public.articles;

-- Recreate policies with proper null handling
CREATE POLICY "Users can create their own articles" 
ON public.articles 
FOR INSERT 
WITH CHECK (
  -- Featured articles can be created by any authenticated user (admin functionality)
  (is_featured = true AND auth.uid() IS NOT NULL) OR 
  -- Regular articles must have matching author_id
  (is_featured = false AND auth.uid() = author_id)
);

CREATE POLICY "Users can update their own articles" 
ON public.articles 
FOR UPDATE 
USING (
  -- Featured articles can be updated by any authenticated user (admin functionality)
  (is_featured = true AND auth.uid() IS NOT NULL) OR 
  -- Regular articles must have matching author_id
  (is_featured = false AND auth.uid() = author_id)
);

CREATE POLICY "Users can delete their own articles" 
ON public.articles 
FOR DELETE 
USING (
  -- Featured articles can be deleted by any authenticated user (admin functionality)
  (is_featured = true AND auth.uid() IS NOT NULL) OR 
  -- Regular articles must have matching author_id
  (is_featured = false AND auth.uid() = author_id AND author_id IS NOT NULL)
);