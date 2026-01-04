export default function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-xl bg-white/6 backdrop-blur-sm border border-white/10",
        "shadow-[0_6px_18px_rgba(6,19,42,0.35)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
