'use client'

import React from 'react'

interface PixelCharacterProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const CHARACTER_CONFIGS: Record<string, {
  body: string
  hair: string
  accent: string
  eyes: string
  label: string
  height: number
  features?: 'hat' | 'mustache' | 'muscular' | 'aura' | 'glow' | 'armor' | 'crown'
}> = {
  diana: {
    body: '#2d1b4e',
    hair: '#1a0a2e',
    accent: '#ff69b4',
    eyes: '#87ceeb',
    label: 'Диана',
    height: 100,
  },
  seva: {
    body: '#1b3a5c',
    hair: '#4a3728',
    accent: '#ffd700',
    eyes: '#4a90d9',
    label: 'Сева',
    height: 110,
  },
  arsen: {
    body: '#3d5a3d',
    hair: '#8b4513',
    accent: '#ffd700',
    eyes: '#2d5016',
    label: 'Арсенеус',
    height: 130,
    features: 'mustache',
  },
  viktor: {
    body: '#1a1a4e',
    hair: '#4a2d7a',
    accent: '#00ff88',
    eyes: '#00ff88',
    label: 'Виктор',
    height: 105,
    features: 'glow',
  },
  swapna: {
    body: '#8b2252',
    hair: '#1a0a2e',
    accent: '#ff69b4',
    eyes: '#8b4513',
    label: 'Свапна',
    height: 95,
    features: 'aura',
  },
  jotaro: {
    body: '#1a1a1a',
    hair: '#1a1a1a',
    accent: '#4a90d9',
    eyes: '#1a1a1a',
    label: 'Джотаро',
    height: 130,
    features: 'hat',
  },
  dio: {
    body: '#8b0000',
    hair: '#ffd700',
    accent: '#ffd700',
    eyes: '#ff0000',
    label: 'Дио',
    height: 125,
    features: 'muscular',
  },
  siren1: {
    body: '#8b2252',
    hair: '#ff69b4',
    accent: '#ff1493',
    eyes: '#ff69b4',
    label: 'Шлюхидзе',
    height: 100,
  },
  siren2: {
    body: '#2d2d2d',
    hair: '#4a0000',
    accent: '#ff4444',
    eyes: '#ff0000',
    label: 'Протитутидзе',
    height: 115,
    features: 'armor',
  },
  siren3: {
    body: '#2d1b4e',
    hair: '#6b3fa0',
    accent: '#a78bfa',
    eyes: '#c4b5fd',
    label: 'Тёлкидзе',
    height: 105,
    features: 'crown',
  },
  troll: {
    body: '#3d5a3d',
    hair: '#2d3a2d',
    accent: '#8b8b00',
    eyes: '#ffff00',
    label: 'Тролль',
    height: 140,
    features: 'muscular',
  },
}

export default function PixelCharacter({ name, size = 'md' }: PixelCharacterProps) {
  const config = CHARACTER_CONFIGS[name]
  if (!config) return null

  const scale = size === 'sm' ? 0.6 : size === 'lg' ? 1.2 : 0.85

  return (
    <div className="flex flex-col items-center sprite-idle" style={{ transform: `scale(${scale})` }}>
      <div className="relative" style={{ width: 60, height: config.height }}>
        {/* Hair/Hat */}
        {config.features === 'hat' ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 8,
              width: 44,
              height: 18,
              background: config.hair,
              borderRadius: '4px 4px 0 0',
              borderBottom: `3px solid ${config.accent}`,
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              top: 2,
              left: 10,
              width: 40,
              height: 16,
              background: config.hair,
              borderRadius: '8px 8px 0 0',
            }}
          />
        )}

        {/* Head */}
        <div
          style={{
            position: 'absolute',
            top: config.features === 'hat' ? 14 : 12,
            left: 12,
            width: 36,
            height: 32,
            background: '#f0d0a0',
            borderRadius: '4px',
            border: '2px solid rgba(0,0,0,0.2)',
          }}
        >
          {/* Eyes */}
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 6,
              width: 8,
              height: 8,
              background: config.eyes,
              borderRadius: '2px',
              boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.3)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 6,
              width: 8,
              height: 8,
              background: config.eyes,
              borderRadius: '2px',
              boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.3)',
            }}
          />
          {/* Mouth */}
          <div
            style={{
              position: 'absolute',
              bottom: 6,
              left: 12,
              width: 12,
              height: 4,
              background: '#d4a07a',
              borderRadius: '2px',
            }}
          />
          {/* Mustache */}
          {config.features === 'mustache' && (
            <div
              style={{
                position: 'absolute',
                bottom: 10,
                left: 4,
                width: 28,
                height: 6,
                background: '#5a3a1a',
                borderRadius: '0 0 4px 4px',
              }}
            />
          )}
        </div>

        {/* Body */}
        <div
          style={{
            position: 'absolute',
            top: config.features === 'hat' ? 44 : 42,
            left: config.features === 'muscular' ? 6 : 10,
            width: config.features === 'muscular' ? 48 : 40,
            height: config.height - 52,
            background: config.body,
            borderRadius: '4px',
            border: `2px solid ${config.accent}`,
          }}
        >
          {/* Chest detail */}
          <div
            style={{
              position: 'absolute',
              top: 4,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 16,
              height: 12,
              background: config.accent,
              borderRadius: '2px',
              opacity: 0.6,
            }}
          />
        </div>

        {/* Armor overlay */}
        {config.features === 'armor' && (
          <div
            style={{
              position: 'absolute',
              top: 42,
              left: 6,
              width: 48,
              height: 40,
              background: 'linear-gradient(180deg, #555 0%, #333 100%)',
              borderRadius: '4px',
              border: '2px solid #888',
            }}
          />
        )}

        {/* Aura effect */}
        {(config.features === 'aura' || config.features === 'glow') && (
          <div
            style={{
              position: 'absolute',
              top: -5,
              left: -5,
              right: -5,
              bottom: -5,
              borderRadius: '8px',
              boxShadow: `0 0 15px ${config.accent}40, 0 0 30px ${config.accent}20`,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Crown */}
        {config.features === 'crown' && (
          <div
            style={{
              position: 'absolute',
              top: -4,
              left: 14,
              width: 32,
              height: 12,
              background: config.accent,
              clipPath: 'polygon(0% 100%, 10% 30%, 25% 70%, 40% 0%, 55% 70%, 70% 30%, 85% 70%, 100% 100%)',
            }}
          />
        )}

        {/* Star Platinum ghost (Jotaro only) */}
        {name === 'jotaro' && (
          <div
            style={{
              position: 'absolute',
              top: -10,
              left: -20,
              width: 100,
              height: config.height + 20,
              background: 'radial-gradient(ellipse, rgba(74,144,217,0.15) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Name label */}
      <div
        className="mt-1 text-center"
        style={{
          fontSize: '12px',
          color: config.accent,
          textShadow: `0 0 4px ${config.accent}80`,
          letterSpacing: '1px',
        }}
      >
        {config.label}
      </div>
    </div>
  )
}
