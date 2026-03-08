'use client';

import BackButton from '@/shared/components/BackButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const isValid =
    form.name.trim().length > 0 &&
    form.email.includes('@') &&
    form.message.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setStatus('submitting');
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? 'success' : 'error');
  };

  if (status === 'success') {
    return (
      <main className="relative min-h-[100svh] flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#07102a_0%,#050b1c_100%)]" />
        <div className="mx-auto max-w-[480px] px-5 text-center">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="text-white text-[18px] font-semibold mb-2">문의가 접수되었어요</h2>
          <p className="text-white/55 text-[13px] leading-relaxed">
            빠른 시일 내에 입력하신 이메일로 답변 드릴게요.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-8 px-6 py-2.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-[13px]"
          >
            돌아가기
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-[100svh] overflow-y-auto">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#07102a_0%,#050b1c_100%)]" />

      <section className="mx-auto max-w-[480px] px-5 pb-24">
        <header className="pt-6 flex items-center gap-3">
          <BackButton />
          <h1 className="text-white text-[18px] font-semibold">문의하기</h1>
        </header>

        <p className="mt-4 text-white/55 text-[13px]">
          불편한 점이나 건의사항을 알려주세요.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-white/60 text-[12px]">이름</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="홍길동"
              className="w-full rounded-[12px] border border-white/10 bg-white/5 px-4 py-3 text-white text-[14px] placeholder:text-white/25 outline-none focus:border-white/25 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-white/60 text-[12px]">이메일</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="example@email.com"
              className="w-full rounded-[12px] border border-white/10 bg-white/5 px-4 py-3 text-white text-[14px] placeholder:text-white/25 outline-none focus:border-white/25 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-white/60 text-[12px]">문의 내용</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="문의하실 내용을 입력해 주세요."
              rows={6}
              className="w-full rounded-[12px] border border-white/10 bg-white/5 px-4 py-3 text-white text-[14px] placeholder:text-white/25 outline-none focus:border-white/25 transition-colors resize-none"
            />
          </div>

          {status === 'error' && (
            <p className="text-red-400/80 text-[12px]">
              문의 전송 중 오류가 발생했어요. 다시 시도해 주세요.
            </p>
          )}

          <button
            type="submit"
            disabled={!isValid || status === 'submitting'}
            className="w-full py-3.5 rounded-[14px] bg-white/10 border border-white/15 text-white/90 text-[14px] font-medium disabled:opacity-40 transition-opacity"
          >
            {status === 'submitting' ? '전송 중...' : '문의 보내기'}
          </button>
        </form>
      </section>
    </main>
  );
}
