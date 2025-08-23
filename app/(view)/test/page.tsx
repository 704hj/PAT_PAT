"use client";
import { useEffect, useRef, useState } from "react";

export default function WindowStars() {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [windowArea, setWindowArea] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>();

  const ORIGINAL = { width: 768, height: 1709 }; // 이미지 실제 사이즈 확인 필요
  const COORDS = [235, 406, 585, 772]; // image-map에서 가져온 좌표 https://www.image-map.net/

  useEffect(() => {
    const updateArea = () => {
      if (!imgRef.current) return;
      const rect = imgRef.current.getBoundingClientRect();

      // 비율 계산
      const x1 = (COORDS[0] / ORIGINAL.width) * rect.width + rect.left;
      const y1 = (COORDS[1] / ORIGINAL.height) * rect.height + rect.top;
      const x2 = (COORDS[2] / ORIGINAL.width) * rect.width + rect.left;
      const y2 = (COORDS[3] / ORIGINAL.height) * rect.height + rect.top;

      setWindowArea({
        left: x1,
        top: y1,
        width: x2 - x1,
        height: y2 - y1,
      });
    };

    updateArea();
    window.addEventListener("resize", updateArea);
    return () => window.removeEventListener("resize", updateArea);
  }, []);

  // ⭐ 랜덤 생성
  const stars = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    top: Math.random() * (windowArea?.height || 0),
    left: Math.random() * (windowArea?.width || 0),
  }));

  return (
    <div className="relative w-full flex justify-center">
      {windowArea &&
        stars.map((star) => (
          <div
            key={star.id}
            className="absolute text-yellow-400"
            style={{
              top: windowArea.top + star.top,
              left: windowArea.left + star.left,
            }}
          >
            ⭐
          </div>
        ))}
    </div>
  );
}
