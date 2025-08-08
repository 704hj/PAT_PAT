"use client";

import Link from "next/link";
import { motion } from "framer-motion";
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-start px-6 py-16 max-w-md mx-auto text-gray-900">
      <motion.h1
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-7xl sm:text-6xl font-extrabold text-gray-500 tracking-widest text-center mb-12 drop-shadow-lg"
        style={{
          fontFamily: "var(--font-dongle), cursive, sans-serif",
        }}
      >
        PAT-PAT
      </motion.h1>
      <div className="mt-[60px] flex flex-row gap-6 justify-center">
        <Link href="/emotion-bin2" passHref>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 20px rgba(219, 39, 119, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center gap-2 w-36 h-36 rounded-xl bg-gray-100 text-gray-600 font-semibold text-lg transition-colors"
          >
            <img
              src={"/images/icon/monster_default.svg"}
              alt="캐릭터"
              className="w-10 h-10 object-contain"
            />
            감정 쓰레기통
          </motion.button>
        </Link>

        <Link href="/gratitude" passHref>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 20px rgba(56, 189, 248, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center gap-2 w-36 h-36 rounded-xl bg-gray-100 text-gray-600 font-semibold text-lg transition-colors"
          >
            <img
              src={"/images/icon/cloud.svg"}
              alt="구름"
              className="w-10 h-10 object-contain"
            />
            감사 일기
          </motion.button>
        </Link>
      </div>
    </main>
  );
}
