import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://YOUR-SUPABASE-URL.supabase.co'
const supabaseAnonKey = 'YOUR-ANON-KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
