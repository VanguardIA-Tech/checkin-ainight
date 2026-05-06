-- Run this in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS checkins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_insert" ON checkins
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "allow_read_anon" ON checkins
  FOR SELECT TO anon USING (true);
