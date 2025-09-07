```
/app
  /api
    /_lib                ← API 공통 헬퍼 모음
      errors.ts          ← AppError 클래스 + Errors 팩토리
      map-supabase-error.ts ← Supabase/Postgres 에러 매핑
      http.ts            ← jsonOk/jsonError/makeRequestId
      validate.ts        ← zod 기반 입력 검증
      index.ts           ← 위 네 개를 모아서 export (진입점)
    /constellations
      route.ts           ← 실제 API 엔드포인트
    /diary
      route.ts
    ...
  /lib
    supabase
      client.ts          ← 클라이언트용 supabase
      server.ts          ← 서버용 supabase (anon or service role)

```
