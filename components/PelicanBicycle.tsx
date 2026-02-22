"use client";

import React, { useEffect, useRef } from "react";

export default function PelicanBicycle() {
  const wheelRRef = useRef<SVGGElement>(null);
  const wheelFRef = useRef<SVGGElement>(null);
  const bodyGroupRef = useRef<SVGGElement>(null);
  const crankLRef = useRef<SVGLineElement>(null);
  const crankRRef = useRef<SVGLineElement>(null);
  const pedalLRef = useRef<SVGRectElement>(null);
  const pedalRRef = useRef<SVGRectElement>(null);
  const legLRef = useRef<SVGPathElement>(null);
  const legRRef = useRef<SVGPathElement>(null);
  
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);

  const bgLinesRef = useRef(
    Array.from({ length: 15 }).map(() => ({
      y: 480 + Math.random() * 100,
      speed: 0.5 + Math.random() * 2,
      width: 20 + Math.random() * 150,
      initialX: Math.random() * 1200,
      color: Math.random() > 0.5 ? "#6d28d9" : "#2563eb",
    }))
  );

  useEffect(() => {
    let frameId: number;
    const start = performance.now();

    const solveIK = (x0: number, y0: number, x2: number, y2: number, l1: number, l2: number, flip: boolean) => {
      const dx = x2 - x0;
      const dy = y2 - y0;
      const d = Math.hypot(dx, dy);
      
      let x1, y1;
      
      if (d > l1 + l2) {
        // Soft stretch if out of bounds
        const ratio = l1 / (l1 + l2);
        x1 = x0 + dx * ratio;
        y1 = y0 + dy * ratio;
      } else {
        const a = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
        const a_clamped = Math.max(-1, Math.min(1, a));
        const angle = Math.acos(a_clamped);
        const baseAngle = Math.atan2(dy, dx);
        // Using flip=true usually points knees "forward"
        const finalAngle = flip ? baseAngle - angle : baseAngle + angle;
        x1 = x0 + l1 * Math.cos(finalAngle);
        y1 = y0 + l1 * Math.sin(finalAngle);
      }
      return { x1, y1 };
    };

    const update = (time: number) => {
      const elapsed = time - start;
      const t = elapsed;
      
      const speed = 0.006;
      const rThetaFront = t * speed;
      const rThetaBack = rThetaFront + Math.PI;

      const cx = 375;
      const cy = 400;
      const R = 32;

      // Wheel rotation
      const deg = (rThetaFront * 180) / Math.PI;
      if (wheelRRef.current) wheelRRef.current.setAttribute("transform", `rotate(${deg} 200 400)`);
      if (wheelFRef.current) wheelFRef.current.setAttribute("transform", `rotate(${deg} 550 400)`);

      // Gentle bob for the body
      const bobY = Math.sin(t * 0.005) * 4;
      if (bodyGroupRef.current) bodyGroupRef.current.setAttribute("transform", `translate(0, ${bobY})`);

      const currentHipY = 195 + bobY;
      const hipX = 290; // Align with center of seat

      // Calculate pedal positions
      const pxL = cx + R * Math.cos(rThetaBack);
      const pyL = cy + Math.sin(rThetaBack) * R;
      const pxR = cx + R * Math.cos(rThetaFront);
      const pyR = cy + Math.sin(rThetaFront) * R;

      if (crankLRef.current) {
        crankLRef.current.setAttribute("x2", `${pxL}`);
        crankLRef.current.setAttribute("y2", `${pyL}`);
      }
      if (crankRRef.current) {
        crankRRef.current.setAttribute("x2", `${pxR}`);
        crankRRef.current.setAttribute("y2", `${pyR}`);
      }

      if (pedalLRef.current) pedalLRef.current.setAttribute("transform", `translate(${pxL}, ${pyL})`);
      if (pedalRRef.current) pedalRRef.current.setAttribute("transform", `translate(${pxR}, ${pyR})`);

      const L1 = 135;
      const L2 = 135;
      
      // Update Legs
      const jL = solveIK(hipX, currentHipY, pxL, pyL, L1, L2, true);
      if (legLRef.current) {
        legLRef.current.setAttribute("d", `M ${hipX} ${currentHipY} L ${jL.x1} ${jL.y1} L ${pxL} ${pyL}`);
      }

      const jR = solveIK(hipX, currentHipY, pxR, pyR, L1, L2, true);
      if (legRRef.current) {
        legRRef.current.setAttribute("d", `M ${hipX} ${currentHipY} L ${jR.x1} ${jR.y1} L ${pxR} ${pyR}`);
      }

      // Parallax Lines
      bgLinesRef.current.forEach((line, i) => {
        const el = lineRefs.current[i];
        if (!el) return;
        const currentX = line.initialX - elapsed * 0.3 * line.speed;
        const displayX = ((currentX % 1400) + 1400) % 1400 - 200;
        el.setAttribute("transform", `translate(${displayX - line.initialX}, 0)`);
      });

      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const renderWheel = (cx: number, cy: number, wheelRef: React.RefObject<SVGGElement | null>) => (
    <g>
      <circle cx={cx} cy={cy} r={65} fill="none" stroke="#0f172a" strokeWidth={16} />
      <circle cx={cx} cy={cy} r={57} fill="none" stroke="#38bdf8" strokeWidth={4} />
      <circle cx={cx} cy={cy} r={10} fill="#94a3b8" />
      <g ref={wheelRef}>
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={cx} y1={cy-57} x2={cx} y2={cy+57} stroke="#475569" strokeWidth={3} transform={`rotate(${i * 15} ${cx} ${cy})`} opacity={0.6} />
        ))}
      </g>
    </g>
  );

  return (
    <div className="w-full max-w-5xl mx-auto aspect-video bg-[#020617] rounded-3xl overflow-hidden shadow-2xl relative border border-[#1e293b]">
      <style>
        {`
          @keyframes flap {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(15deg); }
          }
          .animate-flap {
            animation: flap 0.6s ease-in-out infinite;
          }
          @keyframes dashFloor {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: -200; }
          }
          .animate-floor {
            animation: dashFloor 1s linear infinite;
          }
        `}
      </style>
      <svg viewBox="0 0 800 600" className="w-full h-full block">
        <defs>
          <linearGradient id="sky" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#172554" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          <linearGradient id="neon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <rect width="800" height="600" fill="url(#sky)" />
        <circle cx="400" cy="350" r="180" fill="url(#sun)" opacity="0.8" />

        {/* Dynamic environment lines */}
        <g>
          {bgLinesRef.current.map((line, i) => (
            <line
              key={i}
              ref={(el) => { lineRefs.current[i] = el; }}
              x1={line.initialX}
              y1={line.y}
              x2={line.initialX + line.width}
              y2={line.y}
              stroke={line.color}
              strokeWidth={Math.random() * 2 + 1}
              strokeLinecap="round"
              opacity={0.5}
            />
          ))}
        </g>

        {/* Floor */}
        <rect x="0" y="465" width="800" height="135" fill="#020617" opacity="0.9" />
        <line x1="0" y1="465" x2="800" y2="465" stroke="#1e1b4b" strokeWidth="2" />
        <line x1="0" y1="465" x2="800" y2="465" stroke="#6d28d9" strokeWidth="6" strokeDasharray="40 160" className="animate-floor" />

        {/* 1. Left (Back) Leg & Pedal */}
        <path ref={legLRef} d="" fill="none" stroke="#ea580c" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
        <g>
          <line ref={crankLRef} x1={375} y1={400} x2={375} y2={400} stroke="#334155" strokeWidth={8} strokeLinecap="round" />
          <rect ref={pedalLRef} x={-20} y={-8} width={40} height={16} rx={4} fill="#4b5563" stroke="#020617" strokeWidth={3} />
        </g>

        {/* 2. Wheels */}
        {renderWheel(200, 400, wheelRRef)}
        {renderWheel(550, 400, wheelFRef)}

        {/* 3. Bike Frame */}
        <g stroke="url(#neon)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#glow)">
          <path d="M 200 400 L 375 400 L 300 250 Z" />
          <path d="M 375 400 L 300 250 L 480 250 L 500 310 Z" />
          <line x1={550} y1={400} x2={480} y2={250} />
        </g>
        <g stroke="#94a3b8" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round">
          <line x1={300} y1={250} x2={290} y2={200} />
          <path d="M 480 250 L 470 200 Q 500 200 500 180" fill="none" stroke="#cbd5e1" strokeWidth={12} />
        </g>
        {/* Seat */}
        <path d="M 250 210 Q 290 190 320 210" stroke="#0f172a" strokeWidth={24} strokeLinecap="round" fill="none" />

        {/* 4. Pelican Body */}
        <g ref={bodyGroupRef}>
          {/* Tail */}
          <path d="M 230 180 Q 250 210 280 190 Z" fill="#f8fafc" />
          {/* Main body */}
          <path d="M 270 190 C 240 140, 280 80, 360 120 C 380 180, 320 230, 270 190 Z" fill="#f8fafc" />
          {/* Neck */}
          <path d="M 330 110 C 380 50, 420 50, 450 50 C 470 50, 430 100, 360 140 Z" fill="#f8fafc" />
          {/* Head */}
          <circle cx={450} cy={55} r={22} fill="#f8fafc" />
          {/* Beak */}
          <polygon points="450,45 580,60 570,70 450,60" fill="#fbbf24" />
          <path d="M 450 60 Q 520 130 570 70 Z" fill="#fb923c" />
          {/* Eye */}
          <circle cx={455} cy={50} r={4} fill="#1e293b" />
          <circle cx={457} cy={48} r={1.5} fill="#ffffff" />
          {/* Wing */}
          <path className="origin-[340px_160px] animate-flap" d="M 340 140 C 380 170, 350 210, 290 200 C 290 180, 320 160, 340 140 Z" fill="#cbd5e1" stroke="#f1f5f9" strokeWidth="2" />
          {/* Arm holding handlebars */}
          <path d="M 330 140 C 380 120, 450 160, 480 200" stroke="#e2e8f0" strokeWidth={16} strokeLinecap="round" fill="none" />
        </g>

        {/* 5. Right (Front) Leg & Pedal */}
        <g>
          <line ref={crankRRef} x1={375} y1={400} x2={375} y2={400} stroke="#1e293b" strokeWidth={10} strokeLinecap="round" />
          <rect ref={pedalRRef} x={-20} y={-8} width={40} height={16} rx={4} fill="#94a3b8" stroke="#0f172a" strokeWidth={3} />
        </g>
        <path ref={legRRef} d="" fill="none" stroke="#f97316" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
        {/* Front Chainring */}
        <circle cx={375} cy={400} r={20} fill="#0ea5e9" stroke="#1e293b" strokeWidth={8} />

      </svg>
    </div>
  );
}
