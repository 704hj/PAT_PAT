"use client";

import { forwardRef } from "react";

interface Props {
  isEating: boolean;
  isHover: boolean;
}

const Character = forwardRef<HTMLDivElement, Props>(
  ({ isEating, isHover }, ref) => {
    return (
      <div className="mt-16 relative inline-block">
        {/* 캐릭터 이미지 */}
        {/* <div ref={ref}>
          {isHover ? (
            <MonsterHappy style="w-30 h-auto" />
          ) : isEating ? (
            <MonsterEat style="w-30 h-auto" />
          ) : (
            <MonsterDefault style="w-30 h-auto" />
          )}
        </div> */}

        <div ref={ref}>
          <img
            src={
              isHover
                ? "/images/icon/simple_cat.png"
                : isEating
                ? "/images/icon/simple_cat.png"
                : "/images/icon/simple_cat.png"
            }
            alt="캐릭터"
            className={`w-45 h-45 object-contain transition-transform duration-300 ${
              isEating ? "scale-110" : ""
            }`}
          />
        </div>
      </div>
    );
  }
);

export default Character;
