
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Use the values from Supabase integration
const SUPABASE_URL = "https://ebrijjavqdjndquzerqf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVicmlqamF2cWRqbmRxdXplcnFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MTg5ODEsImV4cCI6MjA2MjQ5NDk4MX0.AJDr5ZufMsxLm72_GGShaQMoWZ8nYUlvANbNWQcnOeA";

// Create Supabase client with proper configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Log that the Supabase client is initialized
console.log('Supabase client initialized');
