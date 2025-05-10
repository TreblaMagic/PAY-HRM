
import { createClient } from '@supabase/supabase-js';

// Use actual values directly since environment variables aren't loading
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Check if we're in a development environment and use placeholders for demo/preview
if (!supabaseUrl.includes('supabase.co') || supabaseAnonKey === 'your-anon-key') {
  console.warn('Using placeholder Supabase credentials. Replace with your actual Supabase URL and anon key.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
