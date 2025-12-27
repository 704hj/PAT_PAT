export default function SplashStar() {
  return (
    /* 부모 컨테이너 */
    <div>
      {/* 별 레이어 */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {[
          // 우상단 클러스터(밝고 촘촘)
          { x: 86, y: 12, s: 4, cls: "star star-d2", delay: "0s" },
          { x: 82, y: 16, s: 3.5, cls: "star", delay: "0.6s" },
          { x: 89, y: 19, s: 3.2, cls: "star", delay: "-.4s" },
          { x: 78, y: 22, s: 3.5, cls: "star star-d3", delay: "1.1s" },

          // 가운데~우측 중부의 은은한 별무리
          { x: 62, y: 34, s: 3.2, cls: "star", delay: ".2s" },
          { x: 70, y: 40, s: 3.0, cls: "star", delay: "1.4s" },
          { x: 58, y: 46, s: 3.4, cls: "star", delay: "-.8s" },

          // 좌측 중단의 흐린 글로우
          { x: 22, y: 42, s: 3.2, cls: "star star-d2", delay: ".9s" },
        ].map((p, i) => (
          <span
            key={i}
            className={p.cls}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.s}px`,
              height: `${p.s}px`,
              // 좌표가 별의 '중심'에 오도록
              transform: `translate(-50%, -50%) ${
                p.cls.includes("star-d2")
                  ? "scale(1.25)"
                  : p.cls.includes("star-d3")
                  ? "scale(.9)"
                  : ""
              }`.trim(),
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}
