-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- Add RLS policies for article images bucket
CREATE POLICY "Anyone can view article images"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can upload article images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'article-images'
  AND auth.uid() IS NOT NULL
);