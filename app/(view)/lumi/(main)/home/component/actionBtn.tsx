import Link from "next/link";
import React from "react";

export default function ActionButton({
  label,
  href,
  variant = "solid",
  icon,
}: {
  label: string;
  href: string;
  variant?: "solid" | "glass";
  icon?: React.ReactNode;
}) {
  const cls =
    variant === "solid"
      ? "text-[#f5f8ff] bg-gradient-to-r from-[#0b1d4a] to-[#1b3b78] hover:brightness-105"
      : "text-slate-100 bg-white/6 border border-white/10 hover:border-cyan-200/35";
  return (
    <Link
      href={href}
      className={[
        "flex items-center justify-center gap-2 h-12 rounded-xl text-[15px] font-semibold",
        "transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
        cls,
      ].join(" ")}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
