export function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded ${className}`} aria-hidden />;
}

export function SkeletonCircle({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-full ${className}`} aria-hidden />;
}

export function GlassCardSkeleton({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-white/6 backdrop-blur",
        className,
      ].join(" ")}
      aria-hidden
    >
      {children}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "animate-pulse rounded-xl bg-white/10 border border-white/10",
        className,
      ].join(" ")}
    />
  );
}
