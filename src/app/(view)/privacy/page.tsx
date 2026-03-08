import {
  PRIVACY_SECTIONS,
  TERMS_SECTIONS,
} from '@/features/auth/constants/termsContent';
import BackButton from '@/shared/components/BackButton';
import type { Metadata, NextPage } from 'next';

import { PolicyAccordion } from './PolicyAccordion';

export const metadata: Metadata = {
  title: '개인정보 처리방침 · PAT PAT',
  description: 'PAT PAT 서비스의 개인정보 처리방침 및 이용약관',
};

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px flex-1 bg-white/10" />
      <span className="text-[11px] font-semibold text-white/35 tracking-[0.15em] uppercase">
        {label}
      </span>
      <div className="h-px flex-1 bg-white/10" />
    </div>
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
      <div className="mx-auto w-full max-w-[640px] px-5 pt-10 pb-24">
        {/* 뒤로가기 */}
        <div className="mb-8">
          <BackButton />
        </div>

        {/* 헤더 */}
        <div className="mb-12 flex flex-col items-center gap-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background:
                'radial-gradient(circle, rgba(120,100,255,0.15) 0%, rgba(120,100,255,0.04) 100%)',
              boxShadow: '0 0 32px rgba(120,100,255,0.12)',
            }}
          >
            <img
              src="/images/icon/lumi/lumi_main.svg"
              alt="Lumi"
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="text-center">
            <h1 className="font-surround text-[22px] font-bold tracking-tight text-white">
              PAT PAT
            </h1>
            <p className="mt-1 text-[13px] text-white/45">
              이용약관 및 개인정보 처리방침
            </p>
          </div>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
            <span className="text-[11px] text-white/30">시행일</span>
            <span className="text-[11px] text-white/50">2026년 3월 8일</span>
          </div>
        </div>

        {/* 이용약관 */}
        <div className="mb-10">
          <SectionDivider label="이용약관" />
          <PolicyAccordion sections={TERMS_SECTIONS} />
        </div>

        {/* 개인정보 처리방침 */}
        <div>
          <SectionDivider label="개인정보 처리방침" />
          <PolicyAccordion sections={PRIVACY_SECTIONS} />
        </div>

        {/* 푸터 */}
        <div className="mt-12 text-center">
          <p className="text-[11px] text-white/20">
            문의:{' '}
            <span className="text-white/35">hyoung1566@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
