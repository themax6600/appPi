import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ofnioamjxvvxfcdnvlev.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mbmlvYW1qeHZ2eGZjZG52bGV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMDE4OTcsImV4cCI6MjA3NTg3Nzg5N30.VqCgDNOEaDkBuNf1RvfAqFDfkZ5APWsi9t9TZjRif_s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
