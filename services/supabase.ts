import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vxbohgxnzivlbujhhqln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4Ym9oZ3hueml2bGJ1amhocWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MjUzNDcsImV4cCI6MjA5ODQwMTM0N30.zHsdepOZT5uE3csRJYZPiyhdDKT7h4YxRYuHoZIlgNM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});