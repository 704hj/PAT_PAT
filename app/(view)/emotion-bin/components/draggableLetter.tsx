"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Props {
  onDrag: (rect: DOMRect | undefined) => void;
  onDragEnd: (rect: DOMRect | undefined) => void;
}

export default function DraggableLetter({ onDrag, onDragEnd }: Props) {
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
        onDrag={() => {
          const letterRect = ref.current?.getBoundingClientRect();
          onDrag(letterRect);
        }}
        onDragEnd={() => {
          const letterRect = ref.current?.getBoundingClientRect();
          onDragEnd(letterRect);
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
