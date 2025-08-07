"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MbtiModal from "../../components/mbtiModal";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    // localStorage 확인 후 없으면 모달 표시
    const savedMbti = localStorage.getItem("mbti_tf");
    if (!savedMbti) setShowModal(true);
  }, []);

  const handleClose = (type: "T" | "F") => {
    localStorage.setItem("mbti_tf", type);
    setShowModal(false);
  };
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-20 text-black max-w-lg mx-auto">
      <h1 className="text-4xl font-semibold text-center max-w-md leading-snug mb-24">
        오늘의 마음을 <br />
        어디에 담아볼까요?
      </h1>

      <div className="flex flex-col gap-10 w-full max-w-md">
        <Link href="/emotion-trash" passHref>
          <button className="w-full py-5 rounded-xl bg-pink-200 text-pink-700 font-semibold text-2xl shadow-md hover:bg-pink-300 transition">
            감정 쓰레기통
          </button>
        </Link>

        <Link href="/gratitude" passHref>
          <button className="w-full py-5 rounded-xl bg-sky-200 text-sky-700 font-semibold text-2xl shadow-md hover:bg-sky-300 transition">
            감사 일기장
          </button>
        </Link>
      </div>

      <p className="mt-32 text-center text-gray-500 text-lg leading-relaxed select-none max-w-md">
        가볍게 비워내고, <br /> 따뜻하게 채워보세요.
      </p>
      {showModal && <MbtiModal onClose={handleClose} />}
    </main>
  );
}
