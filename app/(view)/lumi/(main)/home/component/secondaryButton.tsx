import React from "react";

export default function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full h-12 rounded-[14px] text-[14px] font-medium text-white/85 bg-white/6 border border-white/12 hover:bg-white/10 transition"
    >
      {children}
    </button>
  );
}
