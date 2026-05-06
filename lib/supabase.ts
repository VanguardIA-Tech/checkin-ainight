import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://sogwjhtohkqqpntslsyj.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvZ3dqaHRvaGtxcXBudHNsc3lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNjc2MTcsImV4cCI6MjA5MzY0MzYxN30.HMLeLBAhrgzBk3PQSds02PpnM1xkc1X9edEZWx6PVec'

export type Checkin = {
  id: string
  nome: string
  telefone: string
  criado_em: string
}

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return _client
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
