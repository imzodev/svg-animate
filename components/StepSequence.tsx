'use client';

import React, { useState, useEffect } from 'react';

export interface StepItem {
  id: string;
  label: string;
  iconPath: string;
}

interface StepSequenceProps {
  steps: StepItem[];
}

export default function StepSequence({ steps }: StepSequenceProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (steps.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [steps.length]);

  const width = 800;
  const height = 250;
  const paddingX = 100;
  const usableWidth = width - paddingX * 2;
  const stepDistance = steps.length > 1 ? usableWidth / (steps.length - 1) : 0;
  const startX = paddingX;
  const y = height / 2 - 20; // Slight offset to accommodate labels below

  const currentLength = currentStep * stepDistance;

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
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
          </pattern>

          <linearGradient id="glowGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>

          <filter id="neonLineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={width} height={height} fill="url(#grid)" />

        {/* Base Line */}
        {steps.length > 1 && (
          <line
            x1={startX}
            y1={y}
            x2={startX + usableWidth}
            y2={y}
            stroke="#262626"
            strokeWidth="4"
          />
        )}

        {/* Active Line Progress */}
        {steps.length > 1 && (
          <line
            x1={startX}
            y1={y}
            x2={startX + currentLength}
            y2={y}
            stroke="url(#glowGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#neonLineGlow)"
            className="transition-all duration-500 ease-in-out"
          />
        )}

        {/* Nodes and Labels */}
        {steps.map((step, i) => {
          const cx = startX + i * stepDistance;
          const cy = y;
          const isActive = i <= currentStep;
          const isCurrent = i === currentStep;

          // Color calculation: interpolate between #0ea5e9 and #d946ef based on index
          const progressRatio = steps.length > 1 ? i / (steps.length - 1) : 0;
          const strokeColor =
            progressRatio < 0.5 ? '#0ea5e9' : '#d946ef';

          return (
            <g
              key={step.id}
              style={{
                transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                transformOrigin: `${cx}px ${cy}px`,
                transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
            >
              {/* Circle Node */}
              <circle
                cx={cx}
                cy={cy}
                r="26"
                fill="#0a0a0a"
                stroke={isActive ? strokeColor : '#262626'}
                strokeWidth="4"
                filter={isActive ? 'url(#neonGlow)' : 'none'}
                className="transition-colors duration-500"
              />

              {/* Icon */}
              <svg
                x={cx - 12}
                y={cy - 12}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d={step.iconPath}
                  stroke={isActive ? '#ffffff' : '#525252'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-colors duration-500"
                />
              </svg>

              {/* Label */}
              <text
                x={cx}
                y={cy + 60}
                textAnchor="middle"
                fill={isActive ? '#ffffff' : '#525252'}
                className="text-sm font-medium transition-colors duration-500"
                style={
                  isActive
                    ? {
                        textShadow: `0 0 8px ${strokeColor}, 0 0 16px ${strokeColor}`,
                      }
                    : {}
                }
              >
                {step.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
