'use client'

import React, { useState, useEffect } from 'react'

interface TitleScreenProps {
  onStart: () => void
  onContinue: () => boolean
  hasSave: boolean
}

export default function TitleScreen({ onStart, onContinue, hasSave }: TitleScreenProps) {
  const [showTitle, setShowTitle] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const [flicker, setFlicker] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowTitle(true), 500)
    const t2 = setTimeout(() => setShowSubtitle(true), 1500)
    const t3 = setTimeout(() => setShowButtons(true), 2500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(prev => !prev)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 30%, #2d1b4e 60%, #1a0a2e 100%)',
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23 + 10) % 100}%`,
              width: 3 + (i % 4),
              height: 3 + (i % 4),
              background: i % 3 === 0 ? '#ffd700' : i % 3 === 1 ? '#ff69b4' : '#a78bfa',
              opacity: 0.3 + (i % 3) * 0.1,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 4)}s`,
            }}
          />
        ))}

        {/* Central glowing orb */}
        <div
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)',
            boxShadow: '0 0 60px rgba(167,139,250,0.15)',
          }}
        />
      </div>

      {/* Title */}
      <div className={`text-center relative z-10 transition-all duration-1000 ${showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h1 className="text-xl sm:text-2xl text-purple-100 mb-2 leading-relaxed">
          <span className="block text-[#ffd700]" style={{ textShadow: '0 0 10px rgba(255,215,0,0.5), 0 0 20px rgba(255,215,0,0.2)' }}>
            ПУТЬ
          </span>
          <span className="block text-[#ff69b4]" style={{ textShadow: '0 0 10px rgba(255,105,180,0.5), 0 0 20px rgba(255,105,180,0.2)' }}>
            ДИАНЫ
          </span>
        </h1>

        {/* Sword divider */}
        <div className="flex items-center justify-center gap-2 my-3">
          <div className="w-8 h-[2px] bg-gradient-to-r from-transparent to-purple-500" />
          <span className="text-xs">⚔️</span>
          <div className="w-8 h-[2px] bg-gradient-to-l from-transparent to-purple-500" />
        </div>
      </div>

      {/* Subtitle */}
      <div className={`text-center relative z-10 transition-all duration-1000 ${showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p className="text-[8px] text-purple-300/70 leading-loose max-w-[250px]">
          Интерактивная пиксельная новелла
        </p>
        <p className="text-[7px] text-purple-400/40 mt-1">
          💜 Подарок от Севы для Дианы 💜
        </p>
      </div>

      {/* Buttons */}
      <div className={`relative z-10 mt-8 w-full max-w-[260px] space-y-3 transition-all duration-700 ${showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <button
          className="pixel-btn w-full text-center text-[10px] animate-pulse-glow"
          onClick={onStart}
        >
          ▶ Новая игра
        </button>

        {hasSave && (
          <button
            className="pixel-btn w-full text-center text-[9px]"
            onClick={() => {
              if (!onContinue()) {
                onStart()
              }
            }}
          >
            ◆ Продолжить
          </button>
        )}
      </div>

      {/* Bottom decoration */}
      <div className={`absolute bottom-4 text-center transition-all duration-700 ${showButtons ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-[6px] text-purple-500/30">
          Нажми "Новая игра" чтобы начать приключение
        </p>
        <p className="text-[5px] text-purple-600/20 mt-1">
          v1.0 • Made with 💜
        </p>
      </div>
    </div>
  )
}
