'use client';

import React, { useState, useEffect } from 'react';

export interface LayerData {
  id: string;
  number: string;
  label: string;
  description: string;
  color: string;
  sideColor: string;
}

interface StackedLayersProps {
  data: LayerData[];
}

export default function StackedLayers({ data }: StackedLayersProps) {
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    if (data.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= data.length + 1) return -1;
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [data.length]);

  const width = 800;
  // Calculate dynamic height based on number of layers
  const height = Math.max(500, data.length * 90 + 150);
  const baseX = 270;

  return (
    <div className="flex w-full items-center justify-center p-4">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block rounded-xl overflow-hidden shadow-2xl bg-[#0d1117]"
        style={{ fontFamily: 'inherit' }}
      >
        <defs>
          <pattern id="grid-layers" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
          </pattern>
          <filter id="neonGlow-layers" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={width} height={height} fill="url(#grid-layers)" />

        {/* Map blocks from bottom to top (index 0 is lowest) */}
        {data.map((item, i) => {
          const isActive = i <= currentStep;
          const isLeft = i % 2 === 0;
          
          const baseY = height - 120 - i * 90;
          const boxX = isLeft ? 50 : 580;
          const lines = item.description.split('\n');

          return (
            <g key={item.id}>
              {/* 3D Block Group */}
              <g 
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1.2)'
                }}
              >
                {/* Top face */}
                <polygon 
                  points={`${baseX},${baseY} ${baseX + 260},${baseY} ${baseX + 288},${baseY - 28} ${baseX + 28},${baseY - 28}`} 
                  fill={item.color} 
                  fillOpacity="0.15"
                  stroke={item.color} 
                  strokeWidth="1.5"
                  filter={isActive ? "url(#neonGlow-layers)" : "none"}
                />
                {/* Front face */}
                <polygon 
                  points={`${baseX},${baseY} ${baseX + 260},${baseY} ${baseX + 260},${baseY + 30} ${baseX},${baseY + 30}`} 
                  fill={item.sideColor} 
                  stroke={item.color} 
                  strokeWidth="1"
                />
                {/* Right face */}
                <polygon 
                  points={`${baseX + 260},${baseY} ${baseX + 288},${baseY - 28} ${baseX + 288},${baseY + 2} ${baseX + 260},${baseY + 30}`} 
                  fill={item.sideColor} 
                  stroke={item.color} 
                  strokeWidth="1"
                />
              </g>

              {/* Info Group */}
              <g 
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateX(0)' : `translateX(${isLeft ? '20px' : '-20px'})`,
                  transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1.2) 0.2s'
                }}
              >
                {/* Connection Line & Circle */}
                <path 
                  d={`M ${isLeft ? baseX : baseX + 275} ${baseY + 15} L ${isLeft ? 250 : 570} ${baseY + 15}`} 
                  stroke={item.color} 
                  strokeWidth="1.5" 
                  opacity="0.5"
                  strokeDasharray="4 4"
                />
                <circle 
                  cx={isLeft ? 250 : 570} 
                  cy={baseY + 15} 
                  r="3.5" 
                  fill={item.color} 
                  filter={isActive ? "url(#neonGlow-layers)" : "none"}
                />

                {/* Large Number */}
                <text 
                  x={boxX} 
                  y={baseY + 25} 
                  fontSize="42" 
                  fontWeight="900" 
                  fill={item.color} 
                  filter={isActive ? "url(#neonGlow-layers)" : "none"}
                  style={{ fontFamily: 'sans-serif' }}
                >
                  {item.number}
                </text>
                
                {/* Badge Rectangle */}
                <rect 
                  x={boxX + 60} 
                  y={baseY - 12} 
                  width="140" 
                  height="22" 
                  rx="11" 
                  fill={item.sideColor} 
                  stroke={item.color} 
                  strokeWidth="1" 
                />
                {/* Badge Label */}
                <text 
                  x={boxX + 60 + 70} 
                  y={baseY - 1} 
                  fontSize="11" 
                  fontWeight="bold" 
                  fill="#ffffff" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  style={{ fontFamily: 'sans-serif', letterSpacing: '0.05em' }}
                >
                  {item.label}
                </text>
                
                {/* 3 Decorative Dots */}
                <circle cx={boxX + 208} cy={baseY - 1} r="1.5" fill={item.color} />
                <circle cx={boxX + 214} cy={baseY - 1} r="1.5" fill={item.color} opacity="0.6" />
                <circle cx={boxX + 220} cy={baseY - 1} r="1.5" fill={item.color} opacity="0.3" />

                {/* Description */}
                <text 
                  x={boxX + 60} 
                  y={baseY + 18} 
                  fontSize="10" 
                  fill="#9ca3af" 
                  style={{ fontFamily: 'sans-serif' }}
                >
                  {lines[0] && <tspan x={boxX + 60} dy="0">{lines[0]}</tspan>}
                  {lines[1] && <tspan x={boxX + 60} dy="14">{lines[1]}</tspan>}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
