'use client';

import { useState } from 'react';

type Section = { id: string; title: string; content: string };

function AccordionItem({
  section,
  index,
}: {
  section: Section;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl border border-white/[0.07] bg-white/[0.03] overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
      >
        <span className="text-[10px] font-mono text-white/20 tabular-nums shrink-0 mt-px">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex-1 text-[13px] font-semibold text-white/80">
          {section.title}
        </span>
        <span
          className="shrink-0 text-white/30 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 5L7 9L11 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open && (
        <>
          <div className="mx-5 h-px bg-white/[0.06]" />
          <p className="px-5 pt-3 pb-4 ml-7 whitespace-pre-line text-[12.5px] leading-[1.9] text-white/45">
            {section.content}
          </p>
        </>
      )}
    </div>
  );
}

export function PolicyAccordion({ sections }: { sections: Section[] }) {
  return (
    <div className="space-y-2.5">
      {sections.map((s, i) => (
        <AccordionItem key={s.id} section={s} index={i} />
      ))}
    </div>
  );
}
