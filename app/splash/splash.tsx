"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Dongle } from "next/font/google";

const dongle = Dongle({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-dongle",
  display: "swap",
});
export default function Splash() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6"
      style={{
        backgroundColor: "var(--color-bg)",
        fontFamily: "var(--font-dongle), cursive, sans-serif",
      }}
    >
      <h1
        className="text-7xl font-bold drop-shadow-lg"
        style={{
          color: "var(--color-main)",
        }}
      >
        Pat Pat
      </h1>
      <p
        className="mt-4 text-xl font-light text-center max-w-xs fade-in-down"
        style={{
          animationDelay: "0.4s",
          animationFillMode: "forwards",
          color: "var(--color-main-light)",
        }}
      >
        오늘의 감정을 조용히 기록하는 곳
      </p>
    </div>
  );
}
