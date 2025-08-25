"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetch("/api/test")
      .then((res) => res.json())
      .then(setResult)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Supabase 연결 테스트_</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
