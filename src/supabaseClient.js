import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://kwxipiptibojtfginmfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eGlwaXB0aWJvanRmZ2lubWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1ODA0NzAsImV4cCI6MjA2NzE1NjQ3MH0.m6FBnxsaWn6Bs4VLTuOYxnCOKLDain89-pK8ZZuR6ms';
export const supabase = createClient(supabaseUrl, supabaseKey);