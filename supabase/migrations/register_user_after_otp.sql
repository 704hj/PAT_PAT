-- RPC 함수: OTP 인증 후 사용자 프로필 생성
-- 이 함수는 auth.users에 생성된 사용자를 우리 스키마(users, user_profile, user_identity)에 등록합니다.

CREATE OR REPLACE FUNCTION public.register_user_after_otp(
  _auth_user_id uuid,
  _email citext,
  _nickname text,
  _signup_method text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id bigint;
  _existing_user_id bigint;
BEGIN
  -- 1) 이미 등록된 사용자인지 확인
  SELECT user_id INTO _existing_user_id
  FROM public.users
  WHERE auth_user_id = _auth_user_id;

  -- 2) 이미 존재하면 닉네임만 업데이트
  IF _existing_user_id IS NOT NULL THEN
    -- user_profile 업데이트
    UPDATE public.user_profile
    SET nickname = _nickname,
        updated_at = now()
    WHERE user_id = _existing_user_id;
    
    RETURN jsonb_build_object(
      'success', true,
      'user_id', _existing_user_id,
      'message', 'User profile updated'
    );
  END IF;

  -- 3) users 테이블에 신규 사용자 생성
  INSERT INTO public.users (
    auth_user_id,
    email,
    password_hash,
    signup_method,
    created_at,
    updated_at
  )
  VALUES (
    _auth_user_id,
    _email,
    NULL, -- OTP는 비밀번호 해시 없음
    'email', -- 'email_otp' 대신 'email' 사용
    now(),
    now()
  )
  RETURNING user_id INTO _user_id;

  -- 4) user_profile 테이블에 닉네임 저장
  INSERT INTO public.user_profile (
    user_id,
    nickname,
    created_at,
    updated_at
  )
  VALUES (
    _user_id,
    _nickname,
    now(),
    now()
  );

  -- 5) user_identity 테이블에 인증 방법 저장
  INSERT INTO public.user_identity (
    user_id,
    provider,
    provider_uid,
    created_at
  )
  VALUES (
    _user_id,
    'email',
    _email,
    now()
  )
  ON CONFLICT (provider, provider_uid) DO NOTHING; -- 중복 방지

  -- 6) 성공 응답
  RETURN jsonb_build_object(
    'success', true,
    'user_id', _user_id,
    'message', 'User registered successfully'
  );

EXCEPTION
  WHEN unique_violation THEN
    -- 닉네임 중복 등의 경우
    RAISE EXCEPTION '중복된 데이터: %', SQLERRM;
  WHEN OTHERS THEN
    -- 기타 오류
    RAISE EXCEPTION '회원가입 실패: %', SQLERRM;
END;
$$;

-- 함수 소유자를 postgres로 변경 (모든 권한 확보)
ALTER FUNCTION public.register_user_after_otp OWNER TO postgres;

-- 함수에 적절한 권한 부여
GRANT EXECUTE ON FUNCTION public.register_user_after_otp(uuid, citext, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_user_after_otp(uuid, citext, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.register_user_after_otp(uuid, citext, text, text) TO anon;

-- 함수 설명 추가
COMMENT ON FUNCTION public.register_user_after_otp IS 
'OTP 인증 후 사용자 프로필을 생성합니다. auth.users에 생성된 사용자를 우리 스키마에 등록합니다.';

