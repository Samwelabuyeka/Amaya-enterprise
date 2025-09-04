import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Warn and export a proxy that throws a clear error when used.
  // This prevents a hard crash at import time but gives a helpful message when code tries to call Supabase.
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_URL/SUPABASE_ANON_KEY or VITE_SUPABASE_*) in .env');

  const handler: ProxyHandler<any> = {
    get() {
      throw new Error('Supabase client not initialized: missing environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_URL/SUPABASE_ANON_KEY or VITE_SUPABASE_*).');
    },
    apply() {
      throw new Error('Supabase client not initialized: missing environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_URL/SUPABASE_ANON_KEY or VITE_SUPABASE_*).');
    }
  };

  // Export a proxy object that will throw on any access/use.
  // Consumers will receive a helpful error rather than an undefined runtime exception.
  // @ts-ignore
  export const supabase = new Proxy({}, handler);
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
}
