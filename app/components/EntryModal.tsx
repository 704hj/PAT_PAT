"use client";

import { displayDate } from "@/app/lib/zodiac";
import { Entry } from "@/app/utils/entries";
import { useEffect, useState } from "react";

type EntryModalProps = {
  isOpen: boolean;
  date: string | null;
  entry: Entry | null;
  onClose: () => void;
  onEdit?: () => void;
};

export default function EntryModal({
  isOpen,
  date,
  entry,
  onClose,
  onEdit,
}: EntryModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      // 모달 열릴 때 body 스크롤 막기
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* 모달 컨텐츠 */}
      <div
        className={`relative w-full max-w-md rounded-2xl bg-[#0d1a3d] border border-white/20 p-6 shadow-2xl transition-transform ${
          isClosing ? "scale-95" : "scale-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-lg font-semibold">
            {date ? displayDate(date) : "일기"}
          </h2>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="닫기"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="mb-6">
          {entry && entry.content ? (
            <div className="text-white/90 text-[15px] leading-relaxed whitespace-pre-wrap">
              {entry.content}
            </div>
          ) : (
            <div className="text-white/50 text-[14px] text-center py-8">
              아직 작성된 글이 없습니다.
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-end gap-3">
          {entry && entry.content && onEdit && (
            <button
              onClick={() => {
                onEdit();
                handleClose();
              }}
              className="px-4 py-2 rounded-xl bg-[#657FC2] text-white text-sm font-medium hover:bg-[#5570b5] transition-colors"
            >
              수정하기
            </button>
          )}
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-white/10 text-white/80 text-sm font-medium hover:bg-white/15 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

