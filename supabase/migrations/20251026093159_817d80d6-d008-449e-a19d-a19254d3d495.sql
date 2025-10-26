-- Create saved_articles table for bookmarking functionality
CREATE TABLE public.saved_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Enable Row Level Security
ALTER TABLE public.saved_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_articles
CREATE POLICY "Users can view their own saved articles"
ON public.saved_articles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved articles"
ON public.saved_articles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved articles"
ON public.saved_articles
FOR DELETE
USING (auth.uid() = user_id);