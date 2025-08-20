"use client";
//memo: 동일한 props면 재렌더링 막는 컴포넌트 메모이제이션
//useMemo: 값 계산을 메모해서 의존성이 안 바뀌면 재계산 안 함
//useRef: mutable한 상자(객체)를 만들어 .current에 값을 저장. 렌더 사이에 값 유지, 바꿔도 리렌더 안 됨.
import { memo, useMemo, useRef } from "react";

//해당 DOM을 애니메이션 가능.
import { motion } from "framer-motion";

import { TLetterBtnProps } from "../../../types/memory/star";
import { pickIconPosition } from "../../../utils/pickRandomPosition";

//문자열(이미지 경로)
const STAR_IMAGES = [
  "/images/icon/starWhite.png",
  "/images/icon/starYellow.png",
];

const RandomStar = memo(
  ({ id, baseSize, xLimit, yLimit, onClick, positions }: TLetterBtnProps) => {
    // IconSrc 첫 렌더링 시 한 번만 선택되도록 설정
    const IconSrc = useMemo(() => {
      return STAR_IMAGES[Math.floor(Math.random() * STAR_IMAGES.length)];
    }, []);

    // 크기와 위치 값을 처음 렌더링 시에만 계산하도록 useRef로 저장
    const sizeRef = useRef<number | null>(null);
    const positionRef = useRef<{ x: number; y: number } | null>(null);

    // 아이콘 크기, 좌표 설정 (페이지 새로고침 시에만 랜덤 값 적용)
    if (sizeRef.current === null || positionRef.current === null) {
      const { x, y, size } = pickIconPosition(
        baseSize,
        xLimit,
        yLimit,
        positions,
        300
      );

      sizeRef.current = size!;
      positionRef.current = { x, y };
    }

    const { x, y } = positionRef.current;

    // ✅ 랜덤 duration 값 useRef로 생성
    const randomDuration = useRef(Math.random() * 4 + 8).current;

    return (
      <motion.div
        className="absolute translate-x-[-50%] translate-y-[-50%]"
        style={{
          top: y,
          left: x,
          willChange: "transform",
        }}
        animate={{
          x: [0, 5, 0, -5, 0],
          y: [0, -10, 0, 10, 0],
          rotate: [0, 2, 0, -2, 0],
        }}
        transition={{
          duration: randomDuration,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
      >
        <button
          type="button"
          onClick={() => onClick(id)}
          aria-label={`Letter Button ${id}`}
          className="transition-transform duration-300 ease-in-out hover:scale-110 active:scale-90 focus:scale-90 flex justify-center items-center"
        >
          {/* 문자열 경로는 컴포넌트가 아니므로 <img>로 그린다 */}
          <img
            src={IconSrc}
            alt=""
            // width={sizeRef.current ?? baseSize}
            className="w-10 h-10 md:w-8 md:h-8 lg:w-10 lg:h-10 object-contain"
            // height={sizeRef.current ?? baseSize}
            draggable={false}
          />
        </button>
      </motion.div>
    );
  }
);

RandomStar.displayName = "RandomStar";

export default RandomStar;
