"use client";

import { motion, useMotionValue } from "framer-motion";
import { RefObject, useLayoutEffect, useRef, useState } from "react";

interface Props {
  onDrag: (rect: DOMRect | undefined) => void;
  onDragEnd: (rect: DOMRect | undefined) => void;
  isEating: boolean;
  targetRef: RefObject<HTMLDivElement | null>;
}

export default function DraggableLetter({
  onDrag,
  onDragEnd,
  isEating,
  targetRef,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 초기 위치 계산 및 dragConstraints 설정
  useLayoutEffect(() => {
    if (!ref.current || !targetRef.current) return;

    const letterRect = ref.current.getBoundingClientRect();

    const parentRect = document.body.getBoundingClientRect();

    setConstraints({
      top: -letterRect.top + parentRect.top,
      left: -letterRect.left + parentRect.left,
      right: parentRect.right - letterRect.right,
      bottom: parentRect.bottom - letterRect.bottom,
    });
  }, [targetRef]);

  const resetPosition = () => {
    if (!ref.current || !targetRef.current) return;
    const letterRect = ref.current.getBoundingClientRect();
    const charRect = targetRef.current.getBoundingClientRect();
    x.set(charRect.left - letterRect.right - 10);
    y.set(charRect.top - letterRect.top);
  };

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none">
      <motion.div
        drag
        dragConstraints={constraints}
        ref={ref}
        className="pointer-events-auto inline-block cursor-pointer"
        dragElastic={0.2}
        onDrag={() => onDrag(ref.current?.getBoundingClientRect())}
        onDragEnd={() => onDragEnd(ref.current?.getBoundingClientRect())}
        animate={isEating ? { scale: 0.2, opacity: 0 } : undefined} // false일 때 animate undefined
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <img
          src="/images/icon/paper.png"
          alt="letter"
          className="max-w-[20%] h-auto block object-contain"
          draggable={false}
        />
      </motion.div>

      <button
        onClick={resetPosition}
        className="absolute bottom-10 right-4 w-10 h-10 flex items-center justify-center pointer-events-auto"
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
