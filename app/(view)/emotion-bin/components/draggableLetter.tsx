"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Props {
  onDrop: (rect: DOMRect | undefined) => void;
}

export default function DraggableLetter({ onDrop }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
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
        onDragEnd={() => {
          const letterRect = ref.current?.getBoundingClientRect();
          onDrop(letterRect);
        }}
        className="w-20 h-20 object-contain absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
        ref={ref}
      >
        <img
          src="/images/icon/rainbowLetter.svg"
          alt="편지"
          className="w-full h-full object-contain"
        />
      </motion.div>
    </div>
  );
}
