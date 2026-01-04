"use client";
import React from "react";

type Props = {
  next?: string;
} & React.ComponentProps<"button">; // 버튼 props 전부 허용 (className, disabled 등)

export default function SocialLogout({
  next = "/auth/signin",
  children = "로그아웃",
  className,
  ...buttonProps
}: Props) {
  return (
    <form
      method="POST"
      action={`/api/auth/signout?next=${encodeURIComponent(next)}`}
      className="w-full"
    >
      <button
        type="submit"
        className={["w-full", className].filter(Boolean).join(" ")}
        {...buttonProps}
      >
        {children}
      </button>
    </form>
  );
}
