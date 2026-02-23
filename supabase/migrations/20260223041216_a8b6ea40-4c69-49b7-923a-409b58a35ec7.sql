
-- Table to store editable roadmap article content (overrides local TS files)
CREATE TABLE public.roadmap_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  difficulty text,
  read_time integer,
  category text,
  tags text[],
  source_url text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.roadmap_articles ENABLE ROW LEVEL SECURITY;

-- Everyone can read roadmap articles
CREATE POLICY "Roadmap articles are viewable by everyone"
ON public.roadmap_articles FOR SELECT
USING (true);

-- Only admins can insert/update/delete roadmap articles
CREATE POLICY "Only admins can insert roadmap articles"
ON public.roadmap_articles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roadmap articles"
ON public.roadmap_articles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roadmap articles"
ON public.roadmap_articles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Auto-update timestamp trigger
CREATE TRIGGER update_roadmap_articles_updated_at
BEFORE UPDATE ON public.roadmap_articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
