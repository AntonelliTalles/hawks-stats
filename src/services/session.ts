import { supabase } from './supabase';

export async function requireAdmin() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  if (error) return false;
  return data?.role === 'admin';
}
