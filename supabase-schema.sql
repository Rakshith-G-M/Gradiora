-- Run in Supabase SQL Editor

create table if not exists public.users (
  id uuid primary key,
  email text,
  created_at timestamptz default now()
);

create table if not exists public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  selected_role text not null,
  status text default 'in_progress',
  started_at timestamptz default now(),
  completed_at timestamptz
);

create table if not exists public.interview_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  question_id text not null,
  question_text text not null,
  answer_text text not null,
  difficulty text,
  nlp_score numeric,
  sentiment_score numeric,
  answered_at timestamptz default now()
);

create table if not exists public.interview_reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid unique not null,
  user_id uuid not null,
  overall_score numeric,
  technical_score numeric,
  confidence_score numeric,
  communication_score numeric,
  analytics jsonb,
  generated_at timestamptz default now()
);
