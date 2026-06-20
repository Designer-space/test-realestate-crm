import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type Lead = {
  id: string
  form_type: 'SRA Opportunity' | 'Redevelopment' | 'Open Plot' | 'Others'
  full_name: string
  phone_number: string
  email: string | null
  status: 'New' | 'Contacted' | 'Qualified' | 'Follow-up' | 'Converted' | 'Rejected'
  metadata: Record<string, string | number>
  created_at: string
}

let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _supabase
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return _supabaseAdmin
}
