import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/app/utils/supabase/server";

/**
 * 이메일로 가입된 provider 목록을 반환
 * @returns { providers: string[] } - 예: ["google"], ["kakao"], ["password"], ["google", "kakao"] 등
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { providers: [] },
        { status: 400 }
      );
    }

    // Admin API를 사용하여 이메일의 provider 확인
    const adminClient = await createSupabaseAdminClient();
    
    // 이메일로 사용자 조회
    const { data, error } = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    
    if (error) {
      console.error("[check-providers] Admin API error:", error);
      return NextResponse.json({ providers: [] });
    }

    // 이메일로 사용자 찾기
    const users = data.users.filter(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    );

    // 각 사용자의 provider 수집 (중복 제거)
    const providers = new Set<string>();
    
    users.forEach((user) => {
      // Supabase에서 provider는 app_metadata.provider 또는 identities에서 확인 가능
      // identities 배열에서 provider 추출
      if (user.identities && Array.isArray(user.identities)) {
        user.identities.forEach((identity: any) => {
          if (identity.provider) {
            // Supabase의 provider 이름을 우리 시스템의 이름으로 매핑
            const provider = identity.provider;
            if (provider === "email") {
              providers.add("password"); // email provider를 password로 표시
            } else {
              providers.add(provider); // google, kakao 등
            }
          }
        });
      }
      
      // app_metadata에서도 확인 (fallback)
      if (user.app_metadata?.provider) {
        const provider = user.app_metadata.provider;
        if (provider === "email") {
          providers.add("password");
        } else {
          providers.add(provider);
        }
      }
    });

    return NextResponse.json({ 
      providers: Array.from(providers) 
    });
  } catch (err: any) {
    console.error("[check-providers] Error:", err);
    return NextResponse.json({ providers: [] });
  }
}

