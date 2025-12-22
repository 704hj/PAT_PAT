import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function BottomNav() {
  const [selected, setSelected] = useState<string>("home");

  return (
    <nav
      className="
 absolute bottom-4 left-1/2 -translate-x-1/2
    w-full px-4 h-[64px]
    z-50
    pb-[env(safe-area-inset-bottom)]
      "
    >
      <div className="rounded-2xl bg-white/6 backdrop-blur-lg border border-white/10 px-3 py-2">
        <ul className="flex items-center justify-between text-white/85">
          <li>
            <Link
              href="/lumi/home"
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg `}
              onClick={() => {
                setSelected("home");
              }}
            >
              <Image
                src="/images/icon/menu/home.svg"
                alt="home"
                width={40}
                height={40}
              />
              <span className="text-[10px] text-white">홈</span>
            </Link>
          </li>
          <li>
            <Link
              href="/lumi/write"
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg  ${
                selected === "journal" ? "bg-white/8" : ""
              } `}
              onClick={() => {
                setSelected("journal");
              }}
            >
              <Image
                src="/images/icon/menu/diary.svg"
                alt="home"
                width={40}
                height={40}
              />
              <span className="text-[10px] text-white">일기쓰기</span>
            </Link>
          </li>
          <li>
            <Link
              href="/lumi/profile"
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg  ${
                selected === "profile" ? "bg-white/8" : ""
              } `}
              onClick={() => {
                setSelected("profile");
              }}
            >
              <Image
                src="/images/icon/menu/profile.svg"
                alt="home"
                width={40}
                height={40}
              />
              <span className="text-[10px] text-white">MY 루미</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
