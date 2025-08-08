"use client";

import { forwardRef } from "react";

interface Props {
  isEating: boolean;
  isHover: boolean;
}

const Character = forwardRef<HTMLDivElement, Props>(
  ({ isEating, isHover }, ref) => {
    return (
      <div ref={ref} className="mt-16">
        <img
          src={
            isHover
              ? "/images/icon/monster_happy.svg"
              : isEating
              ? "/images/icon/monster_open.svg"
              : "/images/icon/monster_default.svg"
          }
          alt="캐릭터"
          className="w-45 h-45 object-contain"
        />
      </div>
    );
  }
);

Character.displayName = "Character";

export default Character;
