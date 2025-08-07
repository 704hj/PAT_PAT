"use client";

import { forwardRef } from "react";

interface Props {
  isEating: boolean;
}

const Character = forwardRef<HTMLDivElement, Props>(({ isEating }, ref) => {
  return (
    <div ref={ref} className="mt-16">
      <img
        src={isEating ? "/images/icon/cat_open.svg" : "/images/icon/cat.svg"}
        alt="캐릭터"
        className="w-60 h-60 object-contain"
      />
    </div>
  );
});

Character.displayName = "Character";

export default Character;
