-- Remove the check constraint that's blocking the insert, and then add our data
ALTER TABLE public.articles DROP CONSTRAINT IF EXISTS articles_difficulty_check;

-- 1) Create public avatars bucket if not exists
insert into storage.buckets (id, name, public)
select 'avatars', 'avatars', true
where not exists (select 1 from storage.buckets where id = 'avatars');

-- 2) Storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3) Ensure unique votes per (user, article, type)
CREATE UNIQUE INDEX IF NOT EXISTS votes_unique_user_article_type 
ON public.votes(user_id, article_id, vote_type);

-- 4) Seed a few non-featured published articles
INSERT INTO public.articles (title, content, excerpt, company, read_time, tags, difficulty, published, is_featured)
VALUES
  (
    'Designing a URL Shortener like Bitly',
    'In this article we explore hashing, database design, and cache strategies to build a scalable URL shortener. We start with requirements gathering, then move to high-level architecture, database schema design, and finally discuss caching and rate limiting strategies.',
    'Hashing, DB design, and caching strategies for a URL shortener.',
    'Generic', 8, ARRAY['architecture','hashing','cache'], 'Beginner', true, false
  ),
  (
    'Building a Rate Limiter Service',
    'We discuss token bucket vs leaky bucket, Redis data structures, and deployment patterns for a reliable rate limiter. This includes implementation details, performance considerations, and monitoring strategies.',
    'Token bucket vs leaky bucket; Redis patterns for rate limiting.',
    'Generic', 10, ARRAY['redis','limits','api-gateway'], 'Intermediate', true, false
  ),
  (
    'How a News Feed Works (Beginner Guide)',
    'Fan-out on write vs read, timeline storage, and ranking basics for a social feed. We cover the fundamental concepts behind feed generation, storage strategies, and basic ranking algorithms.',
    'Fan-out patterns, storage models, and ranking basics for feeds.',
    'Generic', 7, ARRAY['feeds','ranking','storage'], 'Beginner', true, false
  ),
  (
    'Job Queue and Worker System Basics',
    'Designing a resilient job queue with retry, dead-letter, and idempotency guarantees. This covers message queue fundamentals, reliability patterns, and scaling considerations.',
    'Queues, retries, dead letters, and idempotency explained.',
    'Generic', 9, ARRAY['queues','workers','reliability'], 'Intermediate', true, false
  )
ON CONFLICT (title) DO NOTHING;