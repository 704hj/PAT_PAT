import {
  createServerSupabaseClient,
  createSupabaseAdminClient,
} from "@/app/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password, nickname } = await req.json();

    if (!password || password.length < 8) {
      return NextResponse.json(
        { ok: false, message: "비밀번호는 8자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    if (!nickname || nickname.trim().length < 2) {
      return NextResponse.json(
        { ok: false, message: "닉네임은 2자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    // 현재 로그인된 사용자 확인 (OTP 인증 완료된 상태)
    const userClient = await createServerSupabaseClient();
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { ok: false, message: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    // Admin API를 사용하여 비밀번호 설정
    const adminClient = await createSupabaseAdminClient();
    const { data: updatedUser, error: updateError } =
      await adminClient.auth.admin.updateUserById(user.id, {
        password,
        user_metadata: {
          nickname: nickname.trim(),
        },
      });

    if (updateError) {
      console.error("비밀번호 설정 오류:", updateError);
      return NextResponse.json(
        { ok: false, message: `비밀번호 설정 실패: ${updateError.message}` },
        { status: 500 }
      );
    }

    // 프로필 정보 저장 (RPC 호출)
    console.log("===== RPC 호출 시작 =====");
    console.log("user.id:", user.id);
    console.log("user.email:", user.email);
    console.log("nickname:", nickname.trim());

    const { data: rpcData, error: rpcErr } = await adminClient.rpc(
      "register_user_after_otp",
      {
        _auth_user_id: user.id,
        _email: user.email,
        _nickname: nickname.trim(),
        _signup_method: "email",
      }
    );

    console.log("RPC 결과:", rpcData);
    console.log("RPC 에러:", rpcErr);
    console.log("===== RPC 호출 완료 =====");

    if (!user.email)
      return NextResponse.json(
        { ok: false, message: "이메일이 없습니다." },
        { status: 400 }
      );

    if (rpcErr) {
      console.error("프로필 저장 오류:", rpcErr);
      return NextResponse.json(
        { ok: false, message: `프로필 저장 실패: ${rpcErr.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "회원가입이 완료되었습니다.",
      debug: rpcData, // 디버그 정보 포함
    });
  } catch (error: any) {
    console.error("비밀번호 설정 예외:", error);
    return NextResponse.json(
      { ok: false, message: `서버 오류: ${error?.message || error}` },
      { status: 500 }
    );
  }
}
