// import { useEffect, useMemo, useRef, useState } from 'react';

// // import { GradientProps, LetterProps, PositionProps } from '../types';
// // import { GradientColors } from './../constants/gradientColors';
// // import RandomComp from './RandomComp';

// interface LettersProps {
//   data: LetterProps[];
//   onClick: (letter: string) => void;
// }

// const Letters: React.FC<LettersProps> = ({ data, onClick }) => {
//   const [windowWidth, setWindowWidth] = useState(
//     typeof window !== 'undefined' ? window.innerWidth : 1920,
//   );
//   const [windowHeight, setWindowHeight] = useState(
//     typeof window !== 'undefined' ? window.innerHeight : 1080,
//   );
//   const [baseSize, setBaseSize] = useState(
//     windowWidth < 540 ? 150 : windowWidth < 1024 ? 200 : 300,
//   );
//   const [coloredData, setColoredData] = useState<
//     { id: string; color: GradientProps }[]
//   >([]);

//   //debouncing - windowWidth, baseSize
//   useEffect(() => {
//     let timeoutId: NodeJS.Timeout | null = null;

//     const handleResize = () => {
//       if (timeoutId) clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => {
//         const width = window.innerWidth;
//         setWindowWidth(width);
//         setWindowHeight(window.innerHeight);

//         if (width < 540) setBaseSize(150);
//         else if (width < 1024) setBaseSize(200);
//         else setBaseSize(300);
//       }, 200);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       if (timeoutId) clearTimeout(timeoutId);
//     };
//   }, []);

//   const xLimit = useMemo(() => {
//     if (baseSize === 150) return 540;
//     if (baseSize === 200) return 1024;
//     return 1920;
//   }, [baseSize]);

//   const yLimit = useMemo(() => windowHeight, [windowHeight]);

//   // 전체 아이콘의 위치를 모아둔 배열
//   const positions = useRef<PositionProps[]>([]);

//   // mapping - data, gradient
//   useEffect(() => {
//     setColoredData(
//       data.map((letter) => ({
//         id: letter.id,
//         color:
//           GradientColors[Math.floor(Math.random() * GradientColors.length)],
//       })),
//     );
//   }, [data]);

//   return (
//     <div className="absolute inset-0 z-20 overflow-hidden">
//       {coloredData.map(({ id, color }) => (
//         <RandomComp
//           key={`${id}-${baseSize}`}
//           id={id}
//           baseSize={baseSize}
//           xLimit={xLimit}
//           yLimit={yLimit}
//           gradient={color}
//           onClick={onClick}
//           positions={positions.current}
//         />
//       ))}
//     </div>
//   );
// };

// export default Letters;
