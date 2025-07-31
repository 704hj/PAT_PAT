"use client";

import { useEffect, useState } from "react";

type Diary = {
  id: number;
  title: string;
  content: string;
  emotion: string;
  mbti: string;
  created_at: string;
};

export default function DiaryTestPage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    emotion: "",
    mbti: "",
  });

  const fetchDiaries = async () => {
    const res = await fetch("/api/diary");
    const data = await res.json();
    setDiaries(data);
  };

  const submitDiary = async () => {
    const res = await fetch("/api/diary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "9015bb03-eafb-4224-9084-2d0ed9df9850", // 테스트용 UUID
        ...form,
      }),
    });
    console.log("res ", res);
    if (res.ok) {
      setForm({ title: "", content: "", emotion: "", mbti: "" });
      fetchDiaries();
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-bold">📘 감정 일기 테스트</h1>

      <div className="space-y-2">
        <input
          placeholder="제목"
          className="border px-2 py-1 w-full"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <textarea
          placeholder="내용"
          className="border px-2 py-1 w-full"
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
        />
        <input
          placeholder="감정 (예: happy)"
          className="border px-2 py-1 w-full"
          value={form.emotion}
          onChange={(e) => setForm((f) => ({ ...f, emotion: e.target.value }))}
        />
        <input
          placeholder="MBTI (예: INFP)"
          className="border px-2 py-1 w-full"
          value={form.mbti}
          onChange={(e) => setForm((f) => ({ ...f, mbti: e.target.value }))}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={submitDiary}
        >
          작성
        </button>
      </div>

      <div>
        <h2 className="font-semibold mt-6">📝 작성된 일기</h2>
        <ul className="space-y-2">
          {diaries.map((d) => (
            <li key={d.id} className="border p-2 rounded">
              <strong>{d.title}</strong> — {d.emotion} ({d.mbti})
              <div className="text-sm text-gray-600">{d.content}</div>
              <div className="text-xs text-gray-400">
                {new Date(d.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
