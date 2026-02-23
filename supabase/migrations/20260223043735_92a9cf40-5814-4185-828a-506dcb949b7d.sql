
-- Create a secure view that exposes comments with profile info but NOT raw user_id
-- Instead it exposes an is_own flag so the frontend can still check ownership
CREATE OR REPLACE VIEW public.comments_public AS
SELECT
  c.id,
  c.article_id,
  c.content,
  c.parent_id,
  c.created_at,
  c.updated_at,
  p.username,
  p.full_name,
  (auth.uid() = c.user_id) AS is_own
FROM public.comments c
LEFT JOIN public.profiles p ON p.user_id = c.user_id;

-- Grant access to the view
GRANT SELECT ON public.comments_public TO anon, authenticated;
