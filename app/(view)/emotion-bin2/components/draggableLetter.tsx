"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SuccessModal from "./modal";

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

  return (
    <div ref={parentRef} className="relative w-full h-[400px]">
      <motion.div
        drag
        dragConstraints={constraints}
        onDrag={() => {
          const letterRect = ref.current?.getBoundingClientRect();
          onDrag(letterRect);
        }}
        onDragEnd={() => {
          const letterRect = ref.current?.getBoundingClientRect();
          onDragEnd(letterRect);
        }}
        ref={ref}
        className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 w-20 h-20"
        animate={{
          scale: isEating ? 0.2 : 1, // 크기 줄이기
          opacity: isEating ? 0 : 1, // 투명도 줄이기
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
        onAnimationComplete={() => {
          if (isEating) {
            setShowModal(true); // 애니메이션 완료 후 모달 열기
          }
        }}
      >
        <img
          src="/images/icon/rainbowLetter.svg"
          alt="편지"
          className="w-full h-full object-contain"
        />
      </motion.div>
      {showModal && (
        <SuccessModal
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
