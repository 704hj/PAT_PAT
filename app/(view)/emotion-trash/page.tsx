"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const availableTags = [
  "분노",
  "슬픔",
  "불안",
  "행복",
  "외로움",
  "좌절",
  "기쁨",
  "걱정",
];

export default function DiaryForm() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [animateTag, setAnimateTag] = useState<string | null>(null);
  const router = useRouter();

  const filteredTags = availableTags.filter(
    (tag) => tag.includes(search) && !selectedTags.includes(tag)
  );

  const onSelectTag = (tag: string) => {
    setSelectedTags((prev) => [...prev, tag]);
    setSearch("");
    setAnimateTag(tag);
  };

  useEffect(() => {
    if (animateTag) {
      const timer = setTimeout(() => setAnimateTag(null), 300);
      return () => clearTimeout(timer);
    }
  }, [animateTag]);

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-dongle font-bold text-gray-700 text-center mb-2">
          마음 비우기
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed">
          오늘 느낀 감정을 적고 태그로 표현해보세요
        </p>

        <form className="flex flex-col space-y-6">
          {/* 감정 일기 입력 */}
          <textarea
            className="font-dongle text-2xl w-full h-40 p-4 border border-gray-300 rounded-xl 
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 
                       transition"
            placeholder="버리고 싶은 감정을 솔직하게 적어보세요..."
            spellCheck={false}
          />

          {/* 선택된 태그 */}
          <div className="flex flex-wrap gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
            {selectedTags.length === 0 ? (
              <p className="text-gray-400 text-sm italic">
                태그를 선택해보세요
              </p>
            ) : (
              selectedTags.map((tag) => (
                <span
                  key={tag}
                  className={`font-dongle flex items-center bg-purple-100 text-purple-800 text-xl px-4 py-1 rounded-full 
                              transition-transform ${
                                animateTag === tag ? "scale-105" : "scale-100"
                              }`}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-purple-500 hover:text-purple-700"
                    aria-label={`Remove tag ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          {/* 태그 검색 */}
          <div className="relative">
            <input
              type="text"
              className="font-dongle text-2xl w-full p-3 pl-4 border border-gray-300 rounded-full 
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="태그를 검색해서 선택하세요"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            {search && filteredTags.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow max-h-44 overflow-y-auto">
                {filteredTags.map((tag) => (
                  <li
                    key={tag}
                    className="font-dongle text-2xl cursor-pointer px-4 py-2 hover:bg-purple-50 transition"
                    onClick={() => onSelectTag(tag)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") onSelectTag(tag);
                    }}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 전송 버튼 */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-gray-500  border border-purple-300  text-white font-semibold text-lg py-3 px-8 rounded-full transition"
              onClick={(e) => {
                e.preventDefault();
                router.push("/emotion-bin2");
              }}
            >
              보내기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
