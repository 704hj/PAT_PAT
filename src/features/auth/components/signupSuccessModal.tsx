'use client';

interface Props {
  nickname: string;
  onConfirm: () => void;
}

export default function SignupSuccessModal({ nickname, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-[2px] sm:items-center px-4">
      <div className="w-full max-w-[400px] rounded-t-3xl sm:rounded-3xl bg-[#0f1e3a] border border-white/10 p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        <div className="flex flex-col items-center text-center">
          <img
            src="/images/icon/lumi/lumi_happy.svg"
            alt="루미"
            className="mb-3 w-20 h-20 object-contain"
          />
          <h3 className="text-[20px] font-bold text-white mb-2 tracking-tight">
            별빛 계정이 만들어졌어요!
          </h3>
          <p className="text-[13.5px] text-white/55 leading-relaxed mb-7">
            {nickname}님의 밤하늘이 준비됐어요.
            <br />
            오늘의 감정을 별로 기록해 보세요 ✨
          </p>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full h-[52px] rounded-2xl text-[15px] font-bold text-white bg-[linear-gradient(180deg,var(--cta-from)_0%,var(--cta-to)_100%)] shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:brightness-110 active:scale-[0.98] transition-all"
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
