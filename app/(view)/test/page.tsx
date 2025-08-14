"use client";

import { useEffect, useState } from "react";

export default function DiaryTestPage() {
  const photos = [
    "sky1.jpeg",
    "sky2.jpeg",
    "sky3.jpeg",
    "sky6.jpeg",
    "sky7.jpeg",
    "sky9.jpeg",
    "sky.gif",
  ];

  const cats = ["black_cat1.png", "black_cat2.png"];
  const [isOpen, setIsOpen] = useState(false);

  const [index, setIndex] = useState(0);
  const photo = photos[index];

  const [index2, setIndex2] = useState(0);
  const cat = cats[index];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(/images/bg/${photo})` }}
    >
      <button
        className="absolute top-4 left-4 px-4 py-2 text-sm text-cyan-100 font-bold"
        onClick={() => setIndex((prev) => (prev + 1) % photos.length)}
      >
        {photo.split(".")[0]}
      </button>

      <button
        className="absolute bottom-4 right-4 px-4 py-2 text-sm text-gray-200 font-bold "
        onClick={() => setIndex2((prev) => (prev + 1) % cats.length)}
      >
        {`cat${index2}`}
      </button>

      {/* <img
        src="/images/icon/star.png"
        alt="star"
        className="absolute top-5/12 left-20 transform -translate-x-1/2 max-w-[20%] h-auto transition-transform duration-150 ease-out active:translate-y-2 active:scale-95"
      /> */}
      <img
        src="/images/icon/star2.png"
        alt="star"
        className="absolute top-10 right-10 transform -translate-x-1/2 max-w-[25%] h-auto transition-transform duration-150 ease-out active:translate-y-2 active:scale-95"
      />

      <img
        src="/images/icon/cloud.png"
        alt="cloud"
        className="absolute top-40 left-20 transform -translate-x-1/2 max-w-[30%] h-auto transition-transform duration-150 ease-out active:translate-y-2 active:scale-95"
      />

      <img
        src="/images/icon/info.png"
        alt="info"
        className="absolute bottom-20 right-0 transform -translate-x-1/2 max-w-[15%] h-auto transition-transform duration-150 ease-out active:translate-y-2 active:scale-95 animate-glow cursor-pointer"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      />
      {isOpen && (
        <div className="absolute bottom-32 right-10 bg-white/90 backdrop-blur-sm rounded-xl p-4 max-w-xs shadow-lg z-40">
          <h2 className="text-sm font-semibold mb-2">INFO</h2>
          <p className="text-xs">여기에 INFP 관련 정보를 넣으세요.</p>
        </div>
      )}
      {index2 % 2 === 0 ? (
        <img
          src="/images/icon/black_cat1.png"
          alt="고양이"
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 max-w-[40%] h-auto"
        />
      ) : (
        <img
          src="/images/icon/black_cat2.png"
          alt="고양이"
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 max-w-[60%] h-auto"
        />
      )}
    </div>
  );
}
