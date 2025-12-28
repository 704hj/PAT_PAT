export default function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] bg-white/8 border border-white/12 text-white/80">
      {children}
    </span>
  );
}
