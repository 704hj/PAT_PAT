export const profileKeys = {
  /**
   * 1. 최상위 루트 키 (all)
   * - 프로필과 관련된 모든 쿼리의 시작점이다.
   * - 사용자가 로그아웃하거나 모든 일기 데이터를 한 번에 새로고침(Invalidate)해야 할 때,
   * queryClient.invalidateQueries({ queryKey: diaryKeys.all }) 한 줄로 해결 가능하다.
   */
  all: ['profile'] as const,
};
