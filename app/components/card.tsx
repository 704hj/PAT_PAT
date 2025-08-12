import React from "react";

export default function Card() {
  return (
    <div className="relative w-[360px] h-[640px] bg-[#2e3240] rounded-lg p-4 box-border">
      <div className="absolute top-16 left-4 right-4 bg-white rounded-lg shadow-lg p-4 flex flex-col">
        {/* 카드 헤더 */}
        <div className="flex justify-end mb-2">
          <span className="text-sm text-gray-400">✎</span>
        </div>

        {/* 텍스트 입력 */}
        <textarea
          className="w-full h-32 resize-none border-none outline-none text-sm leading-relaxed text-gray-800 font-inherit placeholder-gray-400"
          placeholder="내용을 입력하세요."
          maxLength={500}
        ></textarea>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-2 mt-3">
          <button className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-sm">
            취소
          </button>
          <button className="px-3 py-1 rounded bg-black text-white text-sm">
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
