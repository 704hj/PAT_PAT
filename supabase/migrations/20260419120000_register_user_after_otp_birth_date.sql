-- RPC 함수 갱신: 회원가입 시 birth_date(생일) 함께 저장 가능하도록 _birth_date 파라미터 추가
-- 시그니처가 달라지면 새 오버로드가 만들어지므로 기존 함수 먼저 제거
DROP FUNCTION IF EXISTS public.register_user_after_otp(uuid, citext, text, text);
DROP FUNCTION IF EXISTS public.register_user_after_otp(uuid, citext, text, text, date);

CREATE OR REPLACE FUNCTION public.register_user_after_otp(
  _auth_user_id uuid,
  _email citext,
  _nickname text,
  _signup_method text,
  _birth_date date default null
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  _user_id bigint;
  _existing_user_id bigint;
begin
  -- 1) 기존 유저 확인 및 업데이트
  select user_id into _existing_user_id
  from public.users
  where auth_user_id = _auth_user_id
  limit 1;

  if _existing_user_id is not null then
    update public.users
    set
      email = coalesce(_email, email),
      nickname = _nickname,
      signup_method = coalesce(_signup_method, signup_method),
      birth_date = coalesce(_birth_date, birth_date),
      updated_at = now(),
      deleted_at = null
    where user_id = _existing_user_id;

    insert into public.user_identity (auth_user_id, provider, provider_uid, created_at)
    values (_auth_user_id, 'email', _email::text, now())
    on conflict (auth_user_id, provider) do nothing;

    return jsonb_build_object('success', true, 'user_id', _existing_user_id, 'message', 'User updated');
  end if;

  -- 2) 신규 유저 생성
  insert into public.users (
    auth_user_id,
    email,
    nickname,
    signup_method,
    birth_date,
    created_at,
    updated_at,
    deleted_at
  )
  values (
    _auth_user_id,
    _email,
    _nickname,
    coalesce(_signup_method, 'email'),
    _birth_date,
    now(),
    now(),
    null
  )
  returning user_id into _user_id;

  -- 3) user_identity 생성
  insert into public.user_identity (auth_user_id, provider, provider_uid, created_at)
  values (_auth_user_id, 'email', _email::text, now())
  on conflict (auth_user_id, provider) do nothing;

  return jsonb_build_object('success', true, 'user_id', _user_id, 'message', 'User registered successfully');

exception
  when others then
    raise log 'register_user_after_otp 에러: %', sqlerrm;
    raise exception '회원가입 실패: %', sqlerrm;
end;
$$;

ALTER FUNCTION public.register_user_after_otp(uuid, citext, text, text, date) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.register_user_after_otp(uuid, citext, text, text, date) TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.register_user_after_otp(uuid, citext, text, text, date) IS
'OTP 인증 후 사용자 프로필을 생성합니다. _birth_date 파라미터로 생일(별자리)도 함께 저장합니다.';
