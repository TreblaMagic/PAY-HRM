// This file re-exports the Supabase client from the main client file
// Use @/lib/supabaseClient instead for consistency
import { supabase } from '@/lib/supabaseClient';
import type { Database } from './types';

// Re-export for backward compatibility
export { supabase };
export type { Database };