export const StarsFalling = () => {
  return (
    <div className="pointer-events-none fixed top-0 left-0 w-full h-full overflow-hidden z-50">
      {Array.from({ length: 30 }).map((_, i) => {
        const size = Math.random() * 6 + 4; // 4~10px 크기
        const color = ["#FF909B", "#FFDEAD", "#A1E8FF"][
          Math.floor(Math.random() * 3)
        ];

        return (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              width: `${size}px`,
              height: `${size}px`,
              background: color,
              boxShadow: `0 0 6px ${color}`,
            }}
          />
        );
      })}

      <style jsx>{`
        .star {
          position: absolute;
          top: -10px;
          border-radius: 50%;
          animation: fall 2.5s ease-in forwards;
        }

        @keyframes fall {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateX(10px) translateY(50vh);
          }
          100% {
            transform: translateX(-10px) translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
