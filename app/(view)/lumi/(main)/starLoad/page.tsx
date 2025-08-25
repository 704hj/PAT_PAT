// "use client";
// import React, { useMemo, useId } from "react";

// type RecordItem = {
//   id: string;
//   mood: number; // 1~5
//   tags?: string[];
//   createdAt: string; // ISO
// };

// type Point = { x: number; y: number };
// type Template = { name: string; points: Point[]; edges?: [number, number][] };

// export type ConstellationClustersProps = {
//   records?: ReadonlyArray<RecordItem> | null;
//   clusterSize?: number;
//   maxStars?: number;
//   onStarClick?: (rec: RecordItem) => void;
//   className?: string;
// };

// const TEMPLATES: Template[] = [
//   {
//     name: "tri",
//     points: [
//       { x: 10, y: 10 },
//       { x: 40, y: 20 },
//       { x: 20, y: 45 },
//     ],
//     edges: [
//       [0, 1],
//       [1, 2],
//       [2, 0],
//     ],
//   },
//   {
//     name: "kite",
//     points: [
//       { x: 20, y: 10 },
//       { x: 40, y: 25 },
//       { x: 25, y: 45 },
//       { x: 10, y: 25 },
//     ],
//     edges: [
//       [0, 1],
//       [1, 2],
//       [2, 3],
//       [3, 0],
//       [0, 2],
//     ],
//   },
//   {
//     name: "hook",
//     points: [
//       { x: 15, y: 10 },
//       { x: 35, y: 15 },
//       { x: 45, y: 30 },
//       { x: 25, y: 40 },
//     ],
//     edges: [
//       [0, 1],
//       [1, 2],
//       [2, 3],
//     ],
//   },
//   {
//     name: "house",
//     points: [
//       { x: 10, y: 40 },
//       { x: 40, y: 40 },
//       { x: 40, y: 20 },
//       { x: 25, y: 10 },
//       { x: 10, y: 20 },
//     ],
//     edges: [
//       [0, 1],
//       [1, 2],
//       [2, 3],
//       [3, 4],
//       [4, 0],
//     ],
//   },
//   {
//     name: "zigzag",
//     points: [
//       { x: 10, y: 15 },
//       { x: 25, y: 25 },
//       { x: 15, y: 35 },
//       { x: 35, y: 45 },
//     ],
//     edges: [
//       [0, 1],
//       [1, 2],
//       [2, 3],
//     ],
//   },
// ];

// function starRadius(mood: number) {
//   return 5 + (mood ?? 3) * 1.2;
// }
// function starFill(mood: number) {
//   const palette = ["#FFE9A8", "#FFD66B", "#FFC43D", "#FFB000", "#FF9A1F"];
//   const idx = Math.min(Math.max((mood | 0) - 1, 0), palette.length - 1);
//   return palette[idx];
// }

// export default function ConstellationClusters({
//   records = [],
//   clusterSize = 5,
//   maxStars = 30,
//   onStarClick,
//   className,
// }: ConstellationClustersProps) {
//   const uid = useId(); // SSR/CSR 동일 ID 보장
//   const W = 800,
//     H = 1200;

//   const recent = useMemo(() => {
//     const safe = Array.isArray(records) ? records.slice() : [];
//     safe.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
//     return safe.slice(0, maxStars);
//   }, [records, maxStars]);

//   const totalStars = recent.length;
//   const milkyOpacity = useMemo(() => {
//     const min = 0.15,
//       max = 0.55;
//     const ratio = Math.min(totalStars / maxStars, 1);
//     return Math.round((min + (max - min) * ratio) * 100) / 100;
//   }, [totalStars, maxStars]);

//   // 변경: 항상 전체 슬롯을 보여주기 위해 maxStars 기준으로 계산
//   const clusterCount = Math.ceil(maxStars / clusterSize);

//   function clusterSlotRect(index: number) {
//     const cols = 2,
//       gutter = 24;
//     const slotW = (W - gutter) / cols;
//     const slotH = 300;
//     const col = index % cols;
//     const row = Math.floor(index / cols);
//     const x = col * (slotW + gutter);
//     const y = row * (slotH + gutter) + 120;
//     return { x, y, w: slotW, h: slotH };
//   }

//   function materializePoints(
//     tpl: Template,
//     rect: { x: number; y: number; w: number; h: number }
//   ) {
//     return tpl.points.map((p) => ({
//       x: rect.x + (p.x / 100) * rect.w,
//       y: rect.y + (p.y / 100) * rect.h,
//     }));
//   }

//   const clusters = useMemo(() => {
//     const out: {
//       idx: number;
//       points: Array<{ x: number; y: number; record?: RecordItem }>;
//       edges: [number, number][];
//     }[] = [];
//     for (let i = 0; i < clusterCount; i++) {
//       const slot = clusterSlotRect(i);
//       const tpl = TEMPLATES[i % TEMPLATES.length];
//       const pts = materializePoints(tpl, slot);
//       const start = i * clusterSize;
//       const end = Math.min(start + clusterSize, maxStars); // 슬롯은 maxStars까지
//       const slice = recent.slice(start, end); // 실제 기록은 recent 범위 내에서만
//       const mapped = pts.map((p, idx) => ({
//         x: p.x,
//         y: p.y,
//         record: slice[idx], // undefined면 자리표시자
//       }));
//       out.push({ idx: i, points: mapped, edges: tpl.edges ?? [] });
//     }
//     return out;
//   }, [clusterCount, clusterSize, maxStars, recent]);

//   function delayMs(clusterIdx: number, pointIdx: number) {
//     return 80 * (clusterIdx * clusterSize + pointIdx);
//   }

//   return (
//     <div
//       className={["relative w-full max-w-[480px] mx-auto", className]
//         .filter(Boolean)
//         .join(" ")}
//     >
//       <div className="relative w-full aspect-[2/3]">
//         <svg
//           viewBox={`0 0 ${W} ${H}`}
//           className="absolute inset-0 h-full w-full"
//           preserveAspectRatio="xMidYMid meet"
//           role="img"
//           aria-labelledby={`${uid}-title`}
//         >
//           <title id={`${uid}-title`}>나만의 별자리</title>

//           <defs>
//             <radialGradient id={`${uid}-milky`} cx="50%" cy="30%" r="60%">
//               <stop
//                 offset="0%"
//                 stopColor={`rgba(255,255,255,${milkyOpacity})`}
//               />
//               <stop offset="100%" stopColor="rgba(255,255,255,0)" />
//             </radialGradient>
//             <filter id={`${uid}-glow`}>
//               <feGaussianBlur stdDeviation="2" result="blur" />
//               <feMerge>
//                 <feMergeNode in="blur" />
//                 <feMergeNode in="SourceGraphic" />
//               </feMerge>
//             </filter>
//           </defs>

//           <rect x={0} y={0} width={W} height={H} fill={`url(#${uid}-milky)`} />

//           {clusters.map((c) => (
//             <g key={`edges-${c.idx}`}>
//               {c.edges.map((edge, ei) => (
//                 <line
//                   key={`edge-${c.idx}-${ei}`}
//                   x1={c.points[edge[0]].x}
//                   y1={c.points[edge[0]].y}
//                   x2={c.points[edge[1]].x}
//                   y2={c.points[edge[1]].y}
//                   stroke="rgba(255,255,255,0.35)" /* 자리표시자에도 보이도록 약간 연함 */
//                   strokeWidth={1.2}
//                   strokeLinecap="round"
//                 />
//               ))}
//             </g>
//           ))}

//           {clusters.map((c) => (
//             <g key={`stars-${c.idx}`}>
//               {c.points.map((p, pi) =>
//                 p.record ? (
//                   <g
//                     key={`pt-${c.idx}-${pi}`}
//                     style={{ cursor: onStarClick ? "pointer" : "default" }}
//                     onClick={() => p.record && onStarClick?.(p.record)}
//                   >
//                     <circle
//                       cx={p.x}
//                       cy={p.y}
//                       r={starRadius(p.record.mood)}
//                       fill={starFill(p.record.mood)}
//                       filter={`url(#${uid}-glow)`}
//                     >
//                       <animate
//                         attributeName="r"
//                         from="0"
//                         to={String(starRadius(p.record.mood))}
//                         dur="280ms"
//                         begin={`${delayMs(c.idx, pi)}ms`}
//                         fill="freeze"
//                       />
//                       <animate
//                         attributeName="opacity"
//                         from="0"
//                         to="1"
//                         dur="280ms"
//                         begin={`${delayMs(c.idx, pi)}ms`}
//                         fill="freeze"
//                       />
//                     </circle>
//                   </g>
//                 ) : (
//                   <circle
//                     key={`pt-${c.idx}-${pi}-empty`}
//                     cx={p.x}
//                     cy={p.y}
//                     r={3.2}
//                     fill="rgba(255,255,255,0.25)" /* 자리표시자 */
//                   />
//                 )
//               )}
//             </g>
//           ))}
//         </svg>
//       </div>
//     </div>
//   );
// }
// /components/ConstellationCanvas.tsx
import ConstellationCanvas from "../../components/constellationCanvas";

export default function Page() {
  const d = new Date(2025, 11, 1);
  return (
    <main className="min-h-[100svh] px-5 pt-6">
      <h2 className="text-white/90 text-[16px] mb-3">이번 달 별자리</h2>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <ConstellationCanvas userId="demoUser" date={d} />
      </div>
    </main>
  );
}
