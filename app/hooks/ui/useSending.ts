"use client";

import { useSearchParams } from "next/navigation";

type Ritual = "wind" | "wave" | "star";

const useSending = () => {
  const searchParams = useSearchParams();
  const kind = (searchParams.get("kind") as Ritual) || "wind";
  const t = (searchParams.get("t") ?? "").trim();
  const line =
    t ||
    (kind === "wind"
      ? "가볍게 올려보내요"
      : kind === "wave"
      ? "잔물결에 실어 흘려보내요"
      : "별빛에 잠깐 맡겨둘게요");

  return { kind, line };
};

export default useSending;
