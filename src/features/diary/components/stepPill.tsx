export default function StepPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full px-2 py-1 text-[12px] font-semibold tracking-[-0.01em] bg-white/8 border border-white/12 text-white/80">
      {children}
    </span>
  );
}
