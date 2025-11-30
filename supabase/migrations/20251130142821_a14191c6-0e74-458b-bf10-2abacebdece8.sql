-- Add extra_marks column to students table for other certificates
ALTER TABLE public.students 
ADD COLUMN extra_marks integer DEFAULT 0;