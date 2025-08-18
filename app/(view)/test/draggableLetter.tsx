"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Props {
  onDrag: (rect: DOMRect | undefined) => void;
  onDragEnd: (rect: DOMRect | undefined) => void;
  isEating: boolean;
}

export default function DraggableLetter({
  onDrag,
  onDragEnd,
  isEating,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  // x, y 위치값
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [constraints, setConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  useEffect(() => {
    if (parentRef.current && ref.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const elRect = ref.current.getBoundingClientRect();

      setConstraints({
        top: -(elRect.top - parentRect.top),
        left: -(elRect.left - parentRect.left),
        right: parentRect.right - elRect.right,
        bottom: parentRect.bottom - elRect.bottom,
      });
    }
  }, []);

  // 초기 위치로 되돌리는 함수
  const resetPosition = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={parentRef}
      className="fixed inset-0 flex justify-center items-start p-3"
    >
      <motion.div
        drag
        dragConstraints={constraints}
        style={{ x, y }} // drag 시 MotionValue로 위치 제어
        ref={ref}
        onDrag={() => {
          const letterRect = ref.current?.getBoundingClientRect();
          onDrag(letterRect);
        }}
        onDragEnd={() => {
          const letterRect = ref.current?.getBoundingClientRect();
          onDragEnd(letterRect);
        }}
        className="inline-block cursor-pointer z-[9999] "
        animate={{
          scale: isEating ? 0.2 : 1,
          opacity: isEating ? 0 : 1,
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
        onAnimationComplete={() => {
          if (isEating) setShowModal(true);
        }}
        dragElastic={0.2}
      >
        <img
          src="/images/icon/feathers.svg"
          alt="cloud"
          className="block object-contain"
          draggable={false}
        />
      </motion.div>

      {/* 초기화 버튼 */}
      <button
        onClick={resetPosition}
        className="absolute bottom-10 right-4 w-10 h-10 flex items-center justify-center "
      >
        <img
          src="/images/icon/reset.svg"
          alt="Reset"
          className="object-contain hover:scale-105 transition-transform"
          draggable={false}
        />
      </button>
    </div>
  );
}
