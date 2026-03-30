'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
}

/**
 * 인증 상태를 반환하는 훅.
 * 라우트 보호는 미들웨어(src/middleware.ts)가 담당하므로
 * 이 훅은 redirect 없이 상태만 제공합니다.
 *
 * @example
 * const { user, loading } = useAuth()
 */
export function useAuth(_options: { required?: boolean } = {}): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'INITIAL_SESSION') {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
