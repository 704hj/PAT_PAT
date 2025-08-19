"use client";

import { motion } from "framer-motion";
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
    <div ref={parentRef} className="relative w-full h-screen">
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
        className="absolute bottom-1/6 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-16 w-20 h-16"
        animate={{
          scale: isEating ? 0.2 : 1,
          opacity: isEating ? 0 : 1,
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
        onAnimationComplete={() => {
          if (isEating) {
            setShowModal(true);
          }
        }}
        dragElastic={0.2}
      >
        <img
          src="/images/icon/paper.png"
          alt="편지"
          className="w-full h-12 object-contain"
          draggable={false}
        />
      </motion.div>
    </div>
  );
}
