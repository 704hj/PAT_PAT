'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const FAQS = [
  {
    q: 'PAT PAT은 어떤 서비스인가요?',
    a: 'PAT PAT은 하루의 감정을 한 줄로 기록하고, 기록이 쌓일수록 별이 되어 나만의 별자리를 만들어가는 감정 다이어리 서비스예요.',
  },
  {
    q: '일기는 하루에 몇 번 쓸 수 있나요?',
    a: '하루에 하나의 일기를 작성할 수 있어요. 이미 작성한 날은 수정할 수 있습니다.',
  },
  {
    q: '작성한 일기를 삭제할 수 있나요?',
    a: '현재는 일기 삭제 기능을 제공하지 않아요. 기록된 감정은 별이 되어 남아 있답니다.',
  },
  {
    q: '별자리는 어떻게 만들어지나요?',
    a: '일기를 작성할 때마다 별이 하나씩 생성돼요. 별이 쌓이면 별자리 화면에서 나만의 별자리를 확인할 수 있어요.',
  },
  {
    q: '태그는 어떻게 사용하나요?',
    a: '일기 작성 시 감정과 관련된 태그를 최대 3개까지 선택할 수 있어요. 태그를 활용하면 기록을 더 세밀하게 분류할 수 있어요.',
  },
  {
    q: '계정을 삭제하면 데이터는 어떻게 되나요?',
    a: '계정을 삭제하면 작성한 모든 일기와 별이 영구적으로 삭제돼요. 삭제 전에 신중하게 결정해 주세요.',
  },
  {
    q: '로그인 방식을 변경할 수 있나요?',
    a: '현재는 가입 시 선택한 로그인 방식을 변경하는 기능을 제공하지 않아요. 불편하시면 문의하기를 통해 알려주세요.',
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <main className="relative min-h-[100svh] overflow-y-auto">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#07102a_0%,#050b1c_100%)]" />

      <section className="mx-auto max-w-[480px] px-5 pb-24">
        <header className="pt-6 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="h-9 w-9 rounded-lg bg-white/6 border border-white/10 text-white/80 flex items-center justify-center"
          >
            ←
          </button>
          <h1 className="text-white text-[18px] font-semibold">도움말</h1>
        </header>

        <p className="mt-4 text-white/55 text-[13px]">
          자주 묻는 질문을 모았어요.
        </p>

        <div className="mt-5 space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-[14px] border border-white/10 bg-white/5 backdrop-blur overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left"
              >
                <span className="text-white/90 text-[14px] leading-snug">
                  {faq.q}
                </span>
                <span className="shrink-0 text-white/40 text-[12px]">
                  {openIndex === i ? '▴' : '▾'}
                </span>
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 text-white/60 text-[13px] leading-relaxed border-t border-white/8 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[14px] border border-white/10 bg-white/4 px-4 py-4 text-center">
          <p className="text-white/60 text-[13px]">원하는 답을 찾지 못했나요?</p>
          <button
            onClick={() => router.push('/lumi/contact')}
            className="mt-2 text-white/85 text-[13px] underline underline-offset-4"
          >
            문의하기 →
          </button>
        </div>
      </section>
    </main>
  );
}
