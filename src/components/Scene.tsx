'use client'

import React from 'react'
import PixiStage from './PixiStage'

interface SceneProps {
  background: string
  characters: string[]
  children: React.ReactNode
}

export default function Scene({ background, characters, children }: SceneProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* PixiJS canvas as background + character layer */}
      <PixiStage background={background} characters={characters} />

      {/* Semi-transparent overlay for better text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 100%)',
          zIndex: 1,
        }}
      />

      {/* React UI overlay */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  )
}
