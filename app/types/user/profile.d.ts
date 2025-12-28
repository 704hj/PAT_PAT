type UserProfile = {
  user_id: number; // users.user_id bigint
  auth_user_id: string; // users.auth_user_id uuid
  email: string | null;
  nickname: string | null;
  signup_method: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
