// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// export const supabase = createClientComponentClient();

import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // Vercel/로컬에 반드시 설정: NEXT_PUBLIC_SUPABASE_ANON_KEY (또는 PUBLISHABLE_KEY)
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
