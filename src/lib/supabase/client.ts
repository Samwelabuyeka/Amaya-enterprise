import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://amaya-2da6f.supabase.co'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY' // Replace this

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
