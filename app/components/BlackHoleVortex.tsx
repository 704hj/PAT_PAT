"use client";
import React, { useEffect, useRef } from "react";

type Props = {
  show: boolean;
  durationMs?: number;
  particleCount?: number;
  onFinished?: () => void;
};

type Particle = {
  x: number;
  y: number;
  px: number;
  py: number; // 이전 위치(꼬리용)
  vx: number;
  vy: number; // 속도
  hue: number;
  alpha: number;
  size: number;
};

export default function BlackHoleVortex({
  show,
  durationMs = 1800,
  particleCount = 360, // 과하면 지저분+느려짐
  onFinished,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!show || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true })!;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const ensureSize = () => {
      const { clientWidth: cw, clientHeight: ch } = canvas;
      if (!cw || !ch) return false;
      canvas.width = Math.floor(cw * dpr);
      canvas.height = Math.floor(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return true;
    };
    if (!ensureSize()) return;

    const onResize = () => ensureSize();
    window.addEventListener("resize", onResize);

    const W = () => canvas.clientWidth;
    const H = () => canvas.clientHeight;
    const CX = () => W() / 2;
    const CY = () => H() / 2;

    // 초기 입자들: 바깥에서 랜덤 각도로 시작
    const maxR = Math.hypot(W(), H());
    const parts: Particle[] = Array.from({ length: particleCount }).map(() => {
      const a = Math.random() * Math.PI * 2;
      const r = (W() + H()) * (0.35 + Math.random() * 0.45);
      const x = CX() + Math.cos(a) * r;
      const y = CY() + Math.sin(a) * r;

      // 초깃속도: 접선 방향으로 살짝 + 랜덤
      const tdx = -Math.sin(a);
      const tdy = Math.cos(a);
      const speed = 0.8 + Math.random() * 1.4;

      return {
        x,
        y,
        px: x,
        py: y,
        vx: tdx * speed,
        vy: tdy * speed,
        hue: 200 + Math.random() * 60,
        alpha: 0.7,
        size: 1 + Math.random() * 1.6,
      };
    });

    const startAt = performance.now();
    runningRef.current = true;

    const drawAccretionDisk = (progress: number) => {
      ctx.save();
      ctx.translate(CX(), CY());

      // 원반 반지름/두께
      const R = Math.min(W(), H()) * 0.28;
      const T = Math.max(10, R * 0.18);

      // 회전 속도
      const rot = progress * Math.PI * 2 * 0.8;
      ctx.rotate(rot);

      // 안쪽/바깥쪽 그라디언트 띠
      const grd = ctx.createRadialGradient(0, 0, R - T, 0, 0, R + T);
      grd.addColorStop(0.0, "rgba(255,255,255,0.04)");
      grd.addColorStop(0.35, "rgba(255,255,255,0.10)");
      grd.addColorStop(0.5, "rgba(180,180,255,0.12)");
      grd.addColorStop(0.7, "rgba(100,120,255,0.10)");
      grd.addColorStop(1.0, "rgba(0,0,0,0.00)");

      ctx.strokeStyle = grd;
      ctx.lineWidth = T;
      ctx.globalCompositeOperation = "screen";

      // 회전 질감: 끊긴 아크 여러 개
      const segments = 28;
      for (let i = 0; i < segments; i++) {
        const s = (i / segments) * Math.PI * 2;
        const e = s + Math.PI / 16; // 짧은 아크
        ctx.beginPath();
        ctx.arc(0, 0, R, s, e);
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawCore = (progress: number) => {
      // 중앙의 블랙홀 + 렌징 느낌
      const r = Math.max(14, Math.min(W(), H()) * (0.08 - 0.02 * progress));
      const grd = ctx.createRadialGradient(CX(), CY(), r * 0.25, CX(), CY(), r);
      grd.addColorStop(0, "rgba(255,255,255,0.10)");
      grd.addColorStop(0.45, "rgba(0,0,0,0.85)");
      grd.addColorStop(1, "rgba(0,0,0,1)");

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(CX(), CY(), r, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = () => {
      if (!runningRef.current) return;

      const t = performance.now() - startAt;
      const progress = Math.min(1, t / durationMs);

      // 약한 잔상(배경 어둡게)
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(11, 15, 30, 0.18)";
      ctx.fillRect(0, 0, W(), H());

      // 축적원반 먼저
      drawAccretionDisk(progress);

      // 입자 업데이트 & 꼬리
      ctx.globalCompositeOperation = "screen";
      for (const p of parts) {
        // 중심 벡터
        const dx = CX() - p.x;
        const dy = CY() - p.y;
        const dist = Math.hypot(dx, dy) + 0.0001;

        // 중력(안쪽으로), 거리의 제곱 반비례 느낌
        const gravity = Math.min(0.035, (0.0009 * (W() + H())) / (dist * 0.5));

        // 소용돌이(접선 방향) — 오른손 법칙으로 90도 회전( -y, x )
        const swirl = 0.06; // 값 키우면 더 휘감김
        const tx = -dy / dist;
        const ty = dx / dist;

        // 감쇠(마찰)
        const damp = 0.992;

        // 속도 갱신
        p.vx = (p.vx + (dx / dist) * gravity + tx * swirl * 0.02) * damp;
        p.vy = (p.vy + (dy / dist) * gravity + ty * swirl * 0.02) * damp;

        // 위치 갱신
        p.px = p.x;
        p.py = p.y;
        p.x += p.vx;
        p.y += p.vy;

        // 코어에 가까울수록 더 작고 밝게
        const near = Math.max(0, 1 - dist / (Math.min(W(), H()) * 0.6));
        const alpha = p.alpha * (0.4 + near * 0.8);

        // 꼬리(이전 위치 → 현재 위치 라인)
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `hsla(${p.hue}, 70%, ${60 + near * 20}%, ${alpha})`;
        ctx.lineWidth = Math.max(0.6, p.size * (0.8 - near * 0.6));
        ctx.stroke();
      }

      // 중앙 코어 마지막에
      drawCore(progress);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        runningRef.current = false;
        window.removeEventListener("resize", onResize);
        onFinished?.();
      }
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [show, durationMs, particleCount, onFinished]);

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] rounded-2xl overflow-hidden bg-[#0b0f1e]">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
