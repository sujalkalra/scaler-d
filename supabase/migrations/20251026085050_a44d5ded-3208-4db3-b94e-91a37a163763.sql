-- Add downvotes column to articles table
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS downvotes integer DEFAULT 0;