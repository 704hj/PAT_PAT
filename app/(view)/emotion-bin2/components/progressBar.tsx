import React, { useEffect, useState, useRef } from "react";

interface ProcessingBarProps {
  text?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  progressColors?: string[];
  duration?: number;
}

const ProcessingBar: React.FC<ProcessingBarProps> = ({
  text = "처리중...",
  width = 220,
  height = 80,
  backgroundColor = "#2e2a3a",
  progressColors = [
    "#ff57a8",
    "#ff75c1",
    "#d77aff",
    "#b57aff",
    "#9557ff",
    "#a066ff",
    "#d057ff",
  ],
  duration = 8,
}) => {
  const [progress, setProgress] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = (timestamp - start) / 1000;
      const percent = (elapsed / duration) * 100;

      if (percent <= 100) {
        setProgress(percent);
        requestAnimationFrame(step);
      } else {
        return;
        // start = timestamp;
        // setProgress(0);
        // requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [duration]);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((idx) => (idx + 1) % progressColors.length);
    }, (duration * 1000) / progressColors.length);
    return () => clearInterval(interval);
  }, [duration, progressColors.length]);

  // 몽환적 느낌 위한 흐르는 그라데이션 애니메이션
  useEffect(() => {
    if (!gradientRef.current) return;
    let pos = 0;
    let animId: number;

    const animate = () => {
      pos = (pos + 1) % 200; // 0~200% 반복 이동
      if (gradientRef.current) {
        gradientRef.current.style.backgroundPosition = `${pos}% 0%`;
      }
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor,
        borderRadius: 12,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 20px rgba(149, 87, 255, 0.6)", // 보라빛 은은한 빛 추가
      }}
    >
      <div
        ref={gradientRef}
        style={{
          width: `${progress}%`,
          height: "100%",
          borderRadius: 12,
          background: `linear-gradient(270deg, ${progressColors.join(", ")})`,
          backgroundSize: "400% 100%",
          filter: "blur(1.5px) brightness(1.2)", // 살짝 흐릿하고 밝게
          transition: `width 0.1s linear`,
          boxShadow: "0 0 15px 3px rgba(255, 87, 168, 0.8)", // 핑크빛 네온 광채
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "rgba(255, 255, 255, 0.9)",
          fontFamily: "'Dongle', sans-serif",
          fontSize: 18,
          fontWeight: "bold",
          textShadow: "0 0 5px #9557ff, 0 0 10px #d057ff, 0 0 20px #ff75c1",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default ProcessingBar;
