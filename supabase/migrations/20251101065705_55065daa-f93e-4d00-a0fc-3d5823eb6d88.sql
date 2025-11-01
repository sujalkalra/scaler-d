-- Create roadmap_progress table to track user progress
CREATE TABLE public.roadmap_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  node_id integer NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, node_id)
);

-- Enable RLS
ALTER TABLE public.roadmap_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
CREATE POLICY "Users can view their own roadmap progress"
  ON public.roadmap_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can create their own roadmap progress"
  ON public.roadmap_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update their own roadmap progress"
  ON public.roadmap_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own progress
CREATE POLICY "Users can delete their own roadmap progress"
  ON public.roadmap_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_roadmap_progress_updated_at
  BEFORE UPDATE ON public.roadmap_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();