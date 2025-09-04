-- Check table constraints
SELECT conname, consrc FROM pg_constraint WHERE conrelid = 'articles'::regclass;