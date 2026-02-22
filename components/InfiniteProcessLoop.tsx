'use client';

import React, { useState, useEffect } from 'react';

export interface ProcessPhase {
  id: string;
  label: string;
  description: string;
  color: string;
  icon: string;
}

const defaultPhases: ProcessPhase[] = [
  {
    id: 'p1',
    label: 'Entrada',
    description: 'Recepción y validación\ninicial de datos.',
    color: '#0ea5e9', // sky-500
    icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3', // Download
  },
  {
    id: 'p2',
    label: 'Procesamiento',
    description: 'Transformación y\nanálisis de carga.',
    color: '#d946ef', // fuchsia-500
    icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z', // Settings
  },
  {
    id: 'p3',
    label: 'Optimización',
    description: 'Modelado y ajuste\nfino de parámetros.',
    color: '#10b981', // emerald-500
    icon: 'M22 12h-4l-3 9L9 3l-3 9H2', // Activity
  },
  {
    id: 'p4',
    label: 'Salida',
    description: 'Entrega de resultados\nal ecosistema cliente.',
    color: '#fbbf24', // amber-400
    icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12', // Upload
  },
];

interface InfiniteProcessLoopProps {
  data?: ProcessPhase[];
}

export default function InfiniteProcessLoop({ data = defaultPhases }: InfiniteProcessLoopProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (data.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % data.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [data.length]);

  const width = 1000;
  const height = 600;

  // Diamond positions for 4 isometric blocks
  const blocks = [
    { cx: 500, cy: 150 }, // Top
    { cx: 700, cy: 300 }, // Right
    { cx: 500, cy: 450 }, // Bottom
    { cx: 300, cy: 300 }, // Left
  ];

  // Alternating info box offsets to prevent overlap
  const infoOffsets = [
    { dx: -120, dy: -60, anchor: 'end' as const },
    { dx: 120, dy: -60, anchor: 'start' as const },
    { dx: 120, dy: 60, anchor: 'start' as const },
    { dx: -120, dy: 60, anchor: 'end' as const },
  ];

  const getTopFace = (cx: number, cy: number) =>
    `${cx},${cy - 25} ${cx + 50},${cy} ${cx},${cy + 25} ${cx - 50},${cy}`;
  const getLeftFace = (cx: number, cy: number) =>
    `${cx - 50},${cy} ${cx},${cy + 25} ${cx},${cy + 55} ${cx - 50},${cy + 30}`;
  const getRightFace = (cx: number, cy: number) =>
    `${cx},${cy + 25} ${cx + 50},${cy} ${cx + 50},${cy + 30} ${cx},${cy + 55}`;

  return (
    <div className="flex w-full items-center justify-center p-4">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block bg-[#0d1117] rounded-xl overflow-hidden shadow-2xl"
        style={{ fontFamily: 'inherit' }}
      >
        <defs>
          <pattern id="loop-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
          <filter id="loop-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="loop-glow-intense" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={width} height={height} fill="url(#loop-grid)" />

        {/* Lines representing the process cycle */}
        {blocks.map((b, i) => {
          const nextTarget = blocks[(i + 1) % 4];
          const isLineActive = currentStep === i;
          
          return (
            <g key={`connection-${i}`}>
              {/* Dim base line */}
              <line
                x1={b.cx}
                y1={b.cy + 15}
                x2={nextTarget.cx}
                y2={nextTarget.cy + 15}
                stroke="#1f2937"
                strokeWidth="2"
              />
              {/* Highlighted energy line segment */}
              <line
                x1={b.cx}
                y1={b.cy + 15}
                x2={nextTarget.cx}
                y2={nextTarget.cy + 15}
                stroke={isLineActive ? data[i].color : 'transparent'}
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#loop-glow)"
                className="transition-colors duration-500"
              />
            </g>
          );
        })}

        {/* Isometric 3D Blocks */}
        {blocks.map((b, i) => {
          const d = data[i];
          const isActive = currentStep === i;
          const baseColor = isActive ? d.color : '#1e293b'; // slate-800
          
          return (
            <g key={`block-${d.id}`}>
              {/* 3D Isometric Body */}
              <g
                style={{
                  transform: isActive ? 'translateY(-12px)' : 'translateY(0)',
                  transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1.2)',
                }}
              >
                {/* Top Face */}
                <polygon
                  points={getTopFace(b.cx, b.cy)}
                  fill={baseColor}
                  stroke={baseColor}
                  className="transition-colors duration-500"
                  filter={isActive ? 'url(#loop-glow)' : 'none'}
                />
                <polygon points={getTopFace(b.cx, b.cy)} fill="#ffffff" opacity="0.15" />

                {/* Left Face */}
                <polygon
                  points={getLeftFace(b.cx, b.cy)}
                  fill={baseColor}
                  stroke={baseColor}
                  className="transition-colors duration-500"
                />
                <polygon points={getLeftFace(b.cx, b.cy)} fill="#000000" opacity="0.4" />

                {/* Right Face */}
                <polygon
                  points={getRightFace(b.cx, b.cy)}
                  fill={baseColor}
                  stroke={baseColor}
                  className="transition-colors duration-500"
                />
                <polygon points={getRightFace(b.cx, b.cy)} fill="#000000" opacity="0.6" />

                {/* Floating Icon */}
                <svg
                  x={b.cx - 16}
                  y={b.cy - 16 - (isActive ? 18 : 0)}
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  style={{ transition: 'all 0.5s ease-in-out' }}
                >
                  <path
                    d={d.icon}
                    stroke={isActive ? '#ffffff' : '#64748b'}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-colors duration-500"
                    filter={isActive ? 'url(#loop-glow)' : 'none'}
                  />
                </svg>
              </g>

              {/* Dynamic Info (Labels & Lines) */}
              <g
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'scale(1)' : 'scale(0.95)',
                  transformOrigin: `${b.cx}px ${b.cy}px`,
                  transition: 'all 0.5s ease-out',
                }}
              >
                {/* Connection Line to Info */}
                <path
                  d={`M ${b.cx} ${b.cy} L ${b.cx + infoOffsets[i].dx * 0.5} ${b.cy + infoOffsets[i].dy} L ${
                    b.cx + infoOffsets[i].dx
                  } ${b.cy + infoOffsets[i].dy}`}
                  stroke={d.color}
                  fill="none"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />
                {/* Terminal Circle */}
                <circle
                  cx={b.cx + infoOffsets[i].dx}
                  cy={b.cy + infoOffsets[i].dy}
                  r="4"
                  fill={d.color}
                  filter="url(#loop-glow)"
                />

                {/* Text Group */}
                <text
                  x={b.cx + infoOffsets[i].dx + (infoOffsets[i].anchor === 'start' ? 12 : -12)}
                  y={b.cy + infoOffsets[i].dy - 8}
                  fill="#ffffff"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor={infoOffsets[i].anchor}
                  filter="url(#loop-glow)"
                  style={{ textShadow: `0 0 12px ${d.color}` }}
                >
                  {d.label}
                </text>

                <text
                  x={b.cx + infoOffsets[i].dx + (infoOffsets[i].anchor === 'start' ? 12 : -12)}
                  y={b.cy + infoOffsets[i].dy + 12}
                  fill="#9ca3af"
                  fontSize="12"
                  textAnchor={infoOffsets[i].anchor}
                >
                  {d.description.split('\n').map((line, idx) => (
                    <tspan
                      key={idx}
                      x={b.cx + infoOffsets[i].dx + (infoOffsets[i].anchor === 'start' ? 12 : -12)}
                      dy={idx === 0 ? 0 : 16}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
