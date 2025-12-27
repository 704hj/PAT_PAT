export function JournalCard({ journal }: { journal: Journal }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <header className="text-[12px] text-white/55 mb-2">{journal.time}</header>

      <p className="text-[14px] leading-relaxed whitespace-pre-wrap">
        {journal.text}
      </p>

      {journal.tags && (
        <footer className="mt-3 flex gap-1.5 flex-wrap">
          {journal.tags.map((t) => (
            <span
              key={t}
              className="text-[11px] px-2 py-0.5 rounded-full bg-white/8 text-white/70"
            >
              #{t}
            </span>
          ))}
        </footer>
      )}
    </article>
  );
}
