-- Remove broken base64 images from existing articles
-- Replace image markdown with a note about regenerating
UPDATE articles 
SET content = REGEXP_REPLACE(
  content, 
  '!\[.*?\]\(data:image/[^)]+\)',
  '_[Architecture diagram will be available when article is regenerated]_',
  'g'
)
WHERE content LIKE '%data:image%';