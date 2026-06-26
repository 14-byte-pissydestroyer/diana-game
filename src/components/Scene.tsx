'use client'

import React, { useMemo } from 'react'

interface SceneProps {
  background: string
  children: React.ReactNode
}

function generatePixelPattern(seed: number) {
  const pixels: { x: number; y: number; color: string; size: number }[] = []
  const colors = ['rgba(255,255,255,0.1)', 'rgba(167,139,250,0.15)', 'rgba(255,215,0,0.1)', 'rgba(255,105,180,0.08)']

  for (let i = 0; i < 30; i++) {
    const rng = ((seed * 9301 + 49297 + i * 233) % 233280) / 233280
    const rng2 = ((seed * 9301 + 49297 + i * 457) % 233280) / 233280
    const rng3 = ((seed * 9301 + 49297 + i * 691) % 233280) / 233280
    pixels.push({
      x: rng * 100,
      y: rng2 * 100,
      color: colors[Math.floor(rng3 * colors.length)],
      size: 2 + Math.floor(rng * 6),
    })
  }
  return pixels
}

export default function Scene({ background, children }: SceneProps) {
  const seed = useMemo(() => background.length * 7 + background.charCodeAt(0) * 13, [background])
  const pixels = useMemo(() => generatePixelPattern(seed), [seed])

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background }}
    >
      {/* Pixel pattern overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {pixels.map((p, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
            }}
          />
        ))}
      </div>

      {/* Ground/base gradient */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '30%',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 100%)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  )
}
