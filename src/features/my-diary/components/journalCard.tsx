export function JournalCard({ diary }: { diary: TDiaryItem }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      {/* <header className="text-[12px] text-white/55 mb-2">{journal.time}</header> */}

      <p className="text-[14px] leading-relaxed whitespace-pre-wrap">
        {diary.content}
      </p>

      {diary.tags && (
        <footer className="mt-3 flex gap-1.5 flex-wrap">
          {diary.tags.map((t) => (
            <span
              key={t.tag_id}
              className="text-[11px] px-2 py-0.5 rounded-full bg-white/8 text-white/70"
            >
              #{t.tag_name}
            </span>
          ))}
        </footer>
      )}
    </article>
  );
}
