import MonsterDefault from "@/public/images/icon/monster_open.svg";

import { useEffect, useState } from "react";

const colors = [
  "#ff5757",
  "#ff8f57",
  "#ffdb57",
  "#caff57",
  "#57ff97",
  "#57ffe9",
  "#57b3ff",
  "#5765ff",
  "#9557ff",
  "#ff57a8",
  "#ff575a",
];

export default function RainbowCharacter() {
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ color: colors[colorIndex] }}>
      {/* fill="currentColor"로 바꾸었을 때 color로 제어 가능 */}
      <MonsterDefault />
    </div>
  );
}
