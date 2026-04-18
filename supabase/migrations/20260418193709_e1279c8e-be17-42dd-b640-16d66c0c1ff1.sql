-- 1. Skill Scope tables
CREATE TABLE public.skill_scope_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.skill_scope_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.skill_scope_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  tagline TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_skill_scope_tools_category ON public.skill_scope_tools(category_id);

ALTER TABLE public.skill_scope_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_scope_tools ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Skill scope categories viewable by everyone"
  ON public.skill_scope_categories FOR SELECT USING (true);
CREATE POLICY "Skill scope tools viewable by everyone"
  ON public.skill_scope_tools FOR SELECT USING (true);

-- Admin write
CREATE POLICY "Admins can insert categories"
  ON public.skill_scope_categories FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update categories"
  ON public.skill_scope_categories FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete categories"
  ON public.skill_scope_categories FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert tools"
  ON public.skill_scope_tools FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update tools"
  ON public.skill_scope_tools FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete tools"
  ON public.skill_scope_tools FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_skill_scope_categories_updated_at
  BEFORE UPDATE ON public.skill_scope_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_skill_scope_tools_updated_at
  BEFORE UPDATE ON public.skill_scope_tools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed categories
INSERT INTO public.skill_scope_categories (name, description, display_order) VALUES
  ('Cloud & Infrastructure', 'Tools for managing cloud resources and infrastructure as code', 1),
  ('Automation & Remote Execution', 'High-level SSH and configuration automation', 2),
  ('Containers & Orchestration', 'Build, manage, and orchestrate containerized workloads', 3),
  ('Monitoring & Testing', 'Validate infrastructure health and load-test services', 4),
  ('Essential Utilities', 'Everyday libraries every DevOps engineer needs', 5);

-- Seed tools
INSERT INTO public.skill_scope_tools (category_id, name, tagline, description, display_order)
SELECT id, 'Boto3', 'AWS SDK for Python', 'The absolute must-have if you use AWS. It''s the most mature cloud SDK available, giving you full programmatic control over every AWS service.', 1
FROM public.skill_scope_categories WHERE name = 'Cloud & Infrastructure';

INSERT INTO public.skill_scope_tools (category_id, name, tagline, description, display_order)
SELECT id, 'Pulumi', 'Infrastructure as Code in pure Python', 'Better than a wrapper — Pulumi lets you write your actual infrastructure (IaC) in pure Python, with full type safety and real programming constructs.', 2
FROM public.skill_scope_categories WHERE name = 'Cloud & Infrastructure';

INSERT INTO public.skill_scope_tools (category_id, name, tagline, description, display_order)
SELECT id, 'Fabric', 'High-level SSH automation', 'The best choice for high-level SSH automation. It''s much easier to use than Paramiko for running commands across multiple servers.', 1
FROM public.skill_scope_categories WHERE name = 'Automation & Remote Execution';

INSERT INTO public.skill_scope_tools (category_id, name, tagline, description, display_order)
SELECT id, 'Ansible Runner', 'Trigger Ansible from Python', 'Use this if you want the power of Ansible''s configuration management but need to trigger it from within a Python application.', 2
FROM public.skill_scope_categories WHERE name = 'Automation & Remote Execution';

INSERT INTO public.skill_scope_tools (category_id, name, tagline, description, display_order)
SELECT id, 'Docker SDK', 'Programmatic container management', 'Essential for automating image builds and managing local or remote containers directly from Python code.', 1
FROM public.skill_scope_categories WHERE name = 'Containers & Orchestration';

INSERT INTO public.skill_scope_tools (category_id, name, tagline, description, display_order)
SELECT id, 'Kubernetes Python Client', 'Official K8s API client', 'The standard way to programmatically scale pods, check cluster health, or manage resources via the Kubernetes API.', 2
FROM public.skill_scope_categories WHERE name = 'Containers & Orchestration';

INSERT INTO public.skill_scope_tools (category_id, name, tagline, description, display_order)
SELECT id, 'Pytest', 'Testing for code AND infrastructure', 'Use this not just for code, but for Infrastructure Testing — verifying that ports are open, services are running, and configs are valid.', 1
FROM public.skill_scope_categories WHERE name = 'Monitoring & Testing';

INSERT INTO public.skill_scope_tools (category_id, name, tagline, description, display_order)
SELECT id, 'Locust', 'Python-native load testing', 'The best Python-based tool for performance and load testing your APIs, with scenarios written in plain Python.', 2
FROM public.skill_scope_categories WHERE name = 'Monitoring & Testing';

INSERT INTO public.skill_scope_tools (category_id, name, tagline, description, display_order)
SELECT id, 'Requests', 'HTTP for humans', 'You will inevitably need to talk to a REST API (GitHub, Jira, Slack); Requests makes it painless and readable.', 1
FROM public.skill_scope_categories WHERE name = 'Essential Utilities';

INSERT INTO public.skill_scope_tools (category_id, name, tagline, description, display_order)
SELECT id, 'PyYAML', 'Parse and edit YAML configs', 'Since almost every DevOps tool uses YAML for config, you need this to parse and edit those files programmatically.', 2
FROM public.skill_scope_categories WHERE name = 'Essential Utilities';

-- 2. Delete all non-featured articles
DELETE FROM public.votes WHERE article_id IN (SELECT id FROM public.articles WHERE is_featured = false OR is_featured IS NULL);
DELETE FROM public.comments WHERE article_id IN (SELECT id FROM public.articles WHERE is_featured = false OR is_featured IS NULL);
DELETE FROM public.saved_articles WHERE article_id IN (SELECT id FROM public.articles WHERE is_featured = false OR is_featured IS NULL);
DELETE FROM public.articles WHERE is_featured = false OR is_featured IS NULL;