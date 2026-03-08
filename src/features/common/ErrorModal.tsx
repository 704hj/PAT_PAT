'use client';

interface ErrorModalProps {
  open?: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
}

export default function ErrorModal({
  open = true,
  title = '앗, 문제가 생겼어요',
  description,
  onClose,
}: ErrorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 sm:items-center px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-[400px] rounded-t-3xl bg-[#1E2843] p-8 shadow-2xl sm:rounded-3xl animate-in slide-in-from-bottom-10 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 text-4xl animate-bounce">😿</div>
          <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
          <p className="mb-6 text-[#A6A6A6] text-sm leading-relaxed whitespace-pre-line">
            {description || '알 수 없는 오류가 발생했습니다.'}
            <br />
            다시 한 번 시도해 주시겠어요?
          </p>
          <button
            onClick={onClose}
            className="w-full rounded-full bg-[#FEE300] py-4 font-bold text-[#353C3B] hover:bg-[#F0D500] active:scale-[0.98] transition-all"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
