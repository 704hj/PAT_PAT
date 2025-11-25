import { supabase } from "../utils/supabase/client";

/**
 * > session 값 가져오기
 *  > session 없으면 로그인으로 이동
 *  > session 있으면 user.nickName 추출
 *  > user.nickName상태에 저장
 */

// 현재 로그인된 유저의 session값 가져오기 (로그인 후 사용자 정보 확인할 때 필요)
const {
  data: { session },
} = await supabase.auth.getSession();

//유저 정보 가져오기 (세션 기반으로 현재 로그인된 사람의 정보 읽을 때 필요)
const {
  data: { user },
} = await supabase.auth.getUser();

//이메일 + 비밀번호 로그인 (로그인 할 때만 사용)
const { data, error } = await supabase.auth.signInWithPassword({
  email: "",
  password: "",
});
