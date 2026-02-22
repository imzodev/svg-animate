'use client';

import React, { useState, useEffect } from 'react';

export interface BarData {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarData[];
}

const colors = ['#06b6d4', '#d946ef', '#84cc16', '#eab308', '#0ea5e9'];

export default function BarChart({ data }: BarChartProps) {
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    if (data.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= data.length) return -1;
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [data.length]);

  const width = 800;
  const height = 400;
  const paddingX = 80;
  const paddingY = 60;
  
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;
  
  const maxValue = Math.max(...data.map((d) => d.value), 10);
  
  const barWidth = data.length > 0 ? (chartWidth / data.length) * 0.5 : 0;
  const stepDistance = data.length > 0 ? chartWidth / data.length : 0;
  const gap = stepDistance - barWidth;

  return (
    <div className="flex w-full items-center justify-center p-4">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block bg-neutral-950 rounded-xl overflow-hidden shadow-2xl"
        style={{ fontFamily: 'inherit' }}
      >
        <defs>
          <pattern id="grid-bar" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
          </pattern>
          <filter id="neonGlow-bar" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={width} height={height} fill="url(#grid-bar)" />

        {/* Axes */}
        <line
          x1={paddingX}
          y1={height - paddingY}
          x2={width - paddingX}
          y2={height - paddingY}
          stroke="#3f3f46"
          strokeWidth="2"
          filter="url(#neonGlow-bar)"
        />
        <line
          x1={paddingX}
          y1={paddingY}
          x2={paddingX}
          y2={height - paddingY}
          stroke="#3f3f46"
          strokeWidth="2"
          filter="url(#neonGlow-bar)"
        />

        {/* Bars */}
        {data.map((item, i) => {
          const color = colors[i % colors.length];
          const isActive = i <= currentStep;
          
          const targetHeight = (item.value / maxValue) * chartHeight;
          const currentHeight = isActive ? targetHeight : 0;
          
          const x = paddingX + gap / 2 + i * stepDistance;
          const y = height - paddingY - currentHeight;

          return (
            <g key={`bar-${i}`}>
              <rect
                x={x}
                width={barWidth}
                fill={color}
                filter="url(#neonGlow-bar)"
                style={{
                  height: currentHeight,
                  y: y,
                  transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1.2)'
                }}
                rx="4"
                ry="4"
                className="opacity-90"
              />
              <text
                x={x + barWidth / 2}
                y={height - paddingY + 24}
                textAnchor="middle"
                fill="#a3a3a3"
                className="text-sm font-medium"
              >
                {item.label}
              </text>
              <g
                style={{
                  transform: `translate(${x + barWidth / 2}px, ${y - 12}px) translateY(${isActive ? 0 : 20}px)`,
                  opacity: isActive ? 1 : 0,
                  transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1.2)'
                }}
              >
                <text
                  textAnchor="middle"
                  fill={color}
                  className="text-sm font-bold"
                  style={{
                    textShadow: `0 0 8px ${color}`
                  }}
                >
                  {item.value}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
