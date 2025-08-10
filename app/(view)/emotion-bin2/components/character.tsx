"use client";

import { forwardRef } from "react";
import ProcessingBar from "./progressBar";
import MonsterHappy from "./monsterHappy";
import MonsterEat from "./monsterEat";
import MonsterDefault from "./monsterDefault";

interface Props {
  isEating: boolean;
  isHover: boolean;
}

const Character = forwardRef<HTMLDivElement, Props>(
  ({ isEating, isHover }, ref) => {
    return (
      <div ref={ref} className="mt-16 relative inline-block">
        {isEating && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-bounce">
            <ProcessingBar
              text=""
              width={120}
              height={10}
              backgroundColor="#eee"
              duration={6}
            />
          </div>
        )}

        {/* 캐릭터 이미지 */}
        {isHover ? (
          <MonsterHappy style="w-30 h-auto" />
        ) : isEating ? (
          <MonsterEat style="w-30 h-auto" />
        ) : (
          <MonsterDefault style="w-30 h-auto" />
        )}

        {/* <img
          src={
            isHover
              ? "/images/icon/monster_happy.svg"
              : isEating
              ? "/images/icon/monster_open.svg"
              : "/images/icon/monster_default.svg"
          }
          alt="캐릭터"
          className={`w-45 h-45 object-contain transition-transform duration-300 ${
            isEating ? "scale-110" : ""
          }`}
        /> */}
      </div>
    );
  }
);

export default Character;
