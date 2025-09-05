-- 1) Create public avatars bucket if not exists
insert into storage.buckets (id, name, public)
select 'avatars', 'avatars', true
where not exists (select 1 from storage.buckets where id = 'avatars');

-- 2) Storage policies for avatars bucket (create only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
      AND polname = 'Avatar images are publicly accessible'
  ) THEN
    CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'avatars');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
      AND polname = 'Users can upload their own avatar'
  ) THEN
    CREATE POLICY "Users can upload their own avatar"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
      bucket_id = 'avatars' 
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
      AND polname = 'Users can update their own avatar'
  ) THEN
    CREATE POLICY "Users can update their own avatar"
    ON storage.objects
    FOR UPDATE
    USING (
      bucket_id = 'avatars' 
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
      AND polname = 'Users can delete their own avatar'
  ) THEN
    CREATE POLICY "Users can delete their own avatar"
    ON storage.objects
    FOR DELETE
    USING (
      bucket_id = 'avatars' 
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END$$;

-- 3) Ensure unique votes per (user, article, type)
CREATE UNIQUE INDEX IF NOT EXISTS votes_unique_user_article_type 
ON public.votes(user_id, article_id, vote_type);

-- 4) Seed a few non-featured published articles (skip if already exist by title)
WITH existing_titles AS (
  SELECT title FROM public.articles WHERE title IN (
    'Designing a URL Shortener like Bitly',
    'Building a Rate Limiter Service',
    'How a News Feed Works (Beginner Guide)',
    'Job Queue and Worker System Basics'
  )
)
INSERT INTO public.articles (title, content, excerpt, company, read_time, tags, difficulty, published, is_featured)
SELECT x.title, x.content, x.excerpt, x.company, x.read_time, x.tags, x.difficulty, true, false
FROM (
  VALUES
    (
      'Designing a URL Shortener like Bitly',
      'In this article we explore hashing, database design, and cache strategies to build a scalable URL shortener...',
      'Hashing, DB design, and caching strategies for a URL shortener.',
      'Generic', 8, ARRAY['architecture','hashing','cache']::text[], 'beginner'
    ),
    (
      'Building a Rate Limiter Service',
      'We discuss token bucket vs leaky bucket, Redis data structures, and deployment patterns for a reliable rate limiter...',
      'Token bucket vs leaky bucket; Redis patterns for rate limiting.',
      'Generic', 10, ARRAY['redis','limits','api-gateway']::text[], 'intermediate'
    ),
    (
      'How a News Feed Works (Beginner Guide)',
      'Fan-out on write vs read, timeline storage, and ranking basics for a social feed...',
      'Fan-out patterns, storage models, and ranking basics for feeds.',
      'Generic', 7, ARRAY['feeds','ranking','storage']::text[], 'beginner'
    ),
    (
      'Job Queue and Worker System Basics',
      'Designing a resilient job queue with retry, dead-letter, and idempotency guarantees...',
      'Queues, retries, dead letters, and idempotency explained.',
      'Generic', 9, ARRAY['queues','workers','reliability']::text[], 'intermediate'
    )
) AS x(title, content, excerpt, company, read_time, tags, difficulty)
LEFT JOIN existing_titles e ON e.title = x.title
WHERE e.title IS NULL;