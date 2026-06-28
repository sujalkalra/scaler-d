-- 1) roadmap_quizzes: one row per roadmap node, holds the 10 generated MCQs
CREATE TABLE public.roadmap_quizzes (
  node_id INTEGER PRIMARY KEY,
  questions JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.roadmap_quizzes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.roadmap_quizzes TO authenticated;
GRANT ALL ON public.roadmap_quizzes TO service_role;

ALTER TABLE public.roadmap_quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read quizzes"
  ON public.roadmap_quizzes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert quizzes"
  ON public.roadmap_quizzes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update quizzes"
  ON public.roadmap_quizzes FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete quizzes"
  ON public.roadmap_quizzes FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_roadmap_quizzes_updated_at
  BEFORE UPDATE ON public.roadmap_quizzes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) quiz_attempts: history of attempts per user/node
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  node_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quiz_attempts_user_node ON public.quiz_attempts(user_id, node_id);

GRANT SELECT, INSERT ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own attempts"
  ON public.quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own attempts"
  ON public.quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3) user_badges: earned achievements
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  badge_slug TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_slug)
);

CREATE INDEX idx_user_badges_user ON public.user_badges(user_id);

GRANT SELECT ON public.user_badges TO anon;
GRANT SELECT, INSERT ON public.user_badges TO authenticated;
GRANT ALL ON public.user_badges TO service_role;

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges"
  ON public.user_badges FOR SELECT
  USING (true);

CREATE POLICY "Users insert own badges"
  ON public.user_badges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);