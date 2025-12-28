"use client";

import React from "react";

type BtnProps = {
  label: string;
  icon?: string;
  onClick?: () => void;
  ariaLabel?: string;
  variant?: "glass" | "solid";
  fullWidth?: boolean;
};

export default function GlowButton({
  label,
  icon,
  onClick,
  ariaLabel,
  variant = "glass",
  fullWidth = false,
}: BtnProps) {
  const base =
    "relative group inline-flex items-center justify-center gap-2 " +
    (fullWidth ? "w-full " : "w-[280px] ") +
    "h-12 rounded-xl text-[15px] font-semibold select-none " +
    "transition active:scale-[0.99] focus:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-white/30";

  const glass =
    "text-slate-100 bg-white/5 backdrop-blur-sm border border-white/10 " +
    "shadow-[0_6px_18px_rgba(6,19,42,0.35)] hover:border-cyan-200/35";

  const solid =
    "text-white bg-gradient-to-r from-[#0b1d4a] to-[#1b3b78] " +
    "shadow-[0_6px_18px_rgba(11,29,74,0.35)] hover:brightness-105";

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      className={[base, variant === "glass" ? glass : solid].join(" ")}
    >
      {icon && (
        <img
          src={icon}
          alt=""
          className={
            variant === "glass"
              ? "w-5 h-5 opacity-90 filter invert-[85%] brightness-105"
              : "w-5 h-5"
          }
        />
      )}
      <span>{label}</span>
    </button>
  );
}
