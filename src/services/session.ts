import { auth } from './firebase';

export async function requireAdmin() {
  const user = auth.currentUser;

  if (!user) return false;

  return true;
}
