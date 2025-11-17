import { useEffect, useState } from 'react';
import { requireAdmin } from '../services/session';
import { router } from 'expo-router';

export function useAdminGuard() {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const ok = await requireAdmin();
      if (!ok) router.replace('/admin/login');
      else setAllowed(true);
    })();
  }, []);

  return allowed; // null = carregando, true = ok
}
