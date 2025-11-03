-- Add index for faster article queries on published articles ordered by date
CREATE INDEX IF NOT EXISTS idx_articles_published_created_at 
ON public.articles (published, created_at DESC) 
WHERE published = true;