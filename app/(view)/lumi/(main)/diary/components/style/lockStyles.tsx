export function IconPinStar({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* 핀 바디 */}
      <path d="M15 3l-3 3 6 6-3 3-6-6-3 3" />
      {/* 꽂힌 느낌 */}
      <path d="M12 14l-7 7" />
      {/* 별 헤드(센터) */}
      <path d="M12 9.2l.8.5-.2-.9.7-.6-1-.1-.3-.8-.3.8-1 .1.7.6-.2.9z" />
    </svg>
  );
}

export function IconShareComet({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* 혜성 핵(작은 별) */}
      <path d="M15 9.5l.7.45-.2-.85.65-.55-0.9-.08-.28-.75-.28.75-.9.08.65.55-.2.85z" />
      {/* 꼬리 */}
      <path d="M5 13.5c3-1 6-2.2 9-3.8M6 16c3-1.5 6-3.2 9-5M7.5 18c2.4-1 4.8-2 7.2-3.4" />
    </svg>
  );
}

export function IconDeleteFlame({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* 불꽃 외곽 */}
      <path d="M12 3c1.5 2 3 3.2 3 5.2 0 1.7-1.2 2.8-2.5 3.6-1.2.8-2.5 1.6-2.5 3.2 0 2.3 2 4 4.5 4s4.5-1.7 4.5-4.4c0-3.6-2.8-6-7-11.6z" />
      {/* 안쪽 불씨(작은 물방울) */}
      <path d="M10.8 17.2c0-1.1.8-1.7 1.8-2.4" />
    </svg>
  );
}
