import {
  PRIVACY_SECTIONS,
  TERMS_SECTIONS,
} from '@/features/auth/constants/termsContent';
import BackButton from '@/shared/components/BackButton';
import type { Metadata, NextPage } from 'next';

export const metadata: Metadata = {
  title: '개인정보 처리방침 · PAT PAT',
  description: 'PAT PAT 서비스의 개인정보 처리방침 및 이용약관',
};

function PolicySection({
  section,
  index,
}: {
  section: { id: string; title: string; content: string };
  index: number;
}) {
  return (
    <section className="rounded-2xl border border-white/8 bg-white/[0.04] px-5 py-5">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="text-[11px] font-mono text-white/25 tabular-nums shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="text-[14px] font-semibold text-white/85">
          {section.title}
        </h3>
      </div>
      <div className="h-px bg-white/8 mb-3" />
      <p className="whitespace-pre-line text-[13px] leading-[1.8] text-white/55">
        {section.content}
      </p>
    </section>
  );
}

const PrivacyPage: NextPage = () => {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: 'linear-gradient(180deg, #07102a 0%, #050b1c 100%)',
      }}
    >
      <div className="mx-auto w-full max-w-[640px] px-5 py-12 pb-20">
        {/* 뒤로가기 */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* 헤더 */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/8 border border-white/12 text-2xl mb-4">
            ✦
          </div>
          <h1 className="text-[24px] font-bold tracking-tight text-white">
            PAT PAT
          </h1>
          <p className="mt-1 text-[14px] text-white/50">
            이용약관 및 개인정보 처리방침
          </p>
          <p className="mt-1 text-[12px] text-white/30">
            최초 시행일: 2026년 3월 8일
          </p>
        </div>

        {/* 이용약관 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-white/8" />
            <h2 className="text-[13px] font-semibold text-white/60 tracking-widest uppercase">
              이용약관
            </h2>
            <div className="h-px flex-1 bg-white/8" />
          </div>
          <div className="space-y-3">
            {TERMS_SECTIONS.map((s, i) => (
              <PolicySection key={s.id} section={s} index={i} />
            ))}
          </div>
        </div>

        {/* 개인정보 처리방침 */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-white/8" />
            <h2 className="text-[13px] font-semibold text-white/60 tracking-widest uppercase">
              개인정보 처리방침
            </h2>
            <div className="h-px flex-1 bg-white/8" />
          </div>
          <div className="space-y-3">
            {PRIVACY_SECTIONS.map((s, i) => (
              <PolicySection key={s.id} section={s} index={i} />
            ))}
          </div>
        </div>

        {/* 푸터 */}
        <div className="mt-10 text-center text-[12px] text-white/25">
          문의: hyoung1566@gmail.com
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
