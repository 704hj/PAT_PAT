"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LockOverlay({ unlocked }: { unlocked: boolean }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (unlocked) {
      // 해제 후 1.2초 지나면 오버레이 사라짐
      const t = setTimeout(() => setVisible(false), 1200);
      return () => clearTimeout(t);
    }
  }, [unlocked]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
        >
          {/* 자물쇠 전체 */}
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-6 h-6 text-white/85 drop-shadow-[0_0_8px_rgba(180,220,255,0.8)]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* 고리 */}
            <motion.path
              d="M7 10V7a5 5 0 0110 0v3"
              animate={unlocked ? { rotate: -15, y: -6 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            {/* 본체 */}
            <rect
              x="5"
              y="10"
              width="14"
              height="10"
              rx="2"
              className="fill-black/40 stroke-current"
            />
            {/* 중앙 별 */}
            <motion.path
              d="M12 13.5l1 .7-.3-1.2.9-.8-1.2-.1L12 11l-.4 1.1-1.2.1.9.8-.3 1.2z"
              className="fill-current text-cyan-200"
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={
                unlocked
                  ? { scale: [1, 1.5, 0.5], opacity: [1, 1, 0] }
                  : { scale: [0.95, 1, 0.95], opacity: [0.7, 1, 0.7] }
              }
              transition={
                unlocked
                  ? { duration: 0.8, ease: "easeOut" }
                  : { repeat: Infinity, duration: 2, ease: "easeInOut" }
              }
            />
          </motion.svg>

          {/* 별빛 파편 효과 */}
          {unlocked &&
            [...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-cyan-200 rounded-full"
                initial={{ opacity: 1, scale: 0.8, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 0.2,
                  x: (Math.random() - 0.5) * 60,
                  y: (Math.random() - 0.5) * 60,
                }}
                transition={{ duration: 1, delay: 0.1 * i }}
              />
            ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
