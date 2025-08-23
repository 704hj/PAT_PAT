import Link from "next/link";
function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M3 10.5l9-6 9 6V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z"
        fill="currentColor"
      />
    </svg>
  );
}
function IconJournal() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M6 4h10a2 2 0 0 1 2 2v12l-4-2-4 2-4-2V6a2 2 0 0 1 2-2z"
        fill="currentColor"
      />
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"
        fill="currentColor"
      />
    </svg>
  );
}
export default function BottomNav() {
  return (
    <nav
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2 
        w-[92%] max-w-[420px] h-[64px] z-50
        pb-[env(safe-area-inset-bottom)]
      "
    >
      <div className="rounded-2xl bg-white/6 backdrop-blur-lg border border-white/10 px-3 py-2">
        <ul className="flex items-center justify-between text-white/85">
          <li>
            <Link
              href="/lumi/home"
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg bg-white/8"
            >
              <IconHome />
              <span className="text-[11px]">홈</span>
            </Link>
          </li>
          <li>
            <Link
              href="/lumi/home"
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg hover:bg-white/8 transition"
            >
              <IconJournal />
              <span className="text-[11px]">기록</span>
            </Link>
          </li>
          <li>
            <Link
              href="/lumi/home"
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg hover:bg-white/8 transition"
            >
              <IconUser />
              <span className="text-[11px]">내 정보</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
