
-- Recreate the view with SECURITY INVOKER to use the querying user's permissions
DROP VIEW IF EXISTS public.comments_public;

CREATE VIEW public.comments_public
WITH (security_invoker = true)
AS
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

GRANT SELECT ON public.comments_public TO anon, authenticated;
