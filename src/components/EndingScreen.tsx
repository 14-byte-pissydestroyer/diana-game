'use client'

import React, { useState, useEffect } from 'react'
import { ENDING_TITLES } from '@/data/story'

interface EndingScreenProps {
  ending: string
  onRestart: () => void
}

export default function EndingScreen({ ending, onRestart }: EndingScreenProps) {
  const [showContent, setShowContent] = useState(false)
  const [showCredits, setShowCredits] = useState(false)
  const [showButton, setShowButton] = useState(false)

  const endingInfo = ENDING_TITLES[ending] || ENDING_TITLES.bad

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 1000)
    const t2 = setTimeout(() => setShowCredits(true), 3000)
    const t3 = setTimeout(() => setShowButton(true), 5000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const getBackground = () => {
    switch (ending) {
      case 'best':
        return 'linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 30%, #4a2d7a 50%, #2d1b4e 70%, #1a0a2e 100%)'
      case 'medium':
        return 'linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 30%, #3d2a5c 50%, #2d1b4e 70%, #1a0a2e 100%)'
      default:
        return 'linear-gradient(180deg, #0a0a0a 0%, #1a0a1a 30%, #0a0a0a 100%)'
    }
  }

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center p-4"
      style={{ background: getBackground() }}
    >
      {/* Floating particles for best ending */}
      {ending === 'best' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${(i * 13) % 100}%`,
                top: `${(i * 19) % 100}%`,
                width: 2 + (i % 3),
                height: 2 + (i % 3),
                background: i % 2 === 0 ? '#ffd700' : '#ff69b4',
                opacity: 0.5,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + (i % 3)}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Ending title */}
      <div className={`text-center relative z-10 transition-all duration-1500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-4xl mb-4 animate-float">{endingInfo.emoji}</div>
        <h1
          className={`text-sm sm:text-base mb-2 ${
            ending === 'best' ? 'text-purple-100' : ending === 'medium' ? 'text-yellow-200' : 'text-gray-400'
          }`}
          style={{
            textShadow: ending === 'best' ? '0 0 20px rgba(167,139,250,0.5)' : 'none',
          }}
        >
          {endingInfo.title}
        </h1>
        <p className="text-[13px] text-purple-300/60 max-w-[250px] leading-loose">
          {endingInfo.subtitle}
        </p>
      </div>

      {/* Credits */}
      <div className={`relative z-10 mt-8 transition-all duration-1500 ${showCredits ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="pixel-box p-4 text-center max-w-[280px]">
          {ending === 'best' && (
            <>
              <p className="text-[13px] text-purple-200 mb-2">💜 Сделано с бесконечной любовью 💜</p>
              <p className="text-[14px] text-[#ffd700] mb-1">Сева → Диана</p>
              <p className="text-[13px] text-purple-300">Сикс Сэвен, навсегда.</p>
              <div className="my-3 border-t border-purple-700/30" />
            </>
          )}

          {ending === 'medium' && (
            <>
              <p className="text-[13px] text-purple-200 mb-2">💜 Сделано с любовью, Севой для Дианы 💜</p>
              <div className="my-3 border-t border-purple-700/30" />
            </>
          )}

          {ending === 'bad' && (
            <>
              <p className="text-[13px] text-gray-400 mb-2">Это ещё не конец...</p>
              <p className="text-[12px] text-purple-400/50">Попробуй ещё раз. На этот раз — верь в себя.</p>
              <div className="my-3 border-t border-purple-700/30" />
            </>
          )}

          <p className="text-[12px] text-purple-500/30">
            Путь Дианы • v1.0
          </p>
        </div>
      </div>

      {/* Restart button */}
      <div className={`relative z-10 mt-6 w-full max-w-[260px] transition-all duration-700 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <button
          className="pixel-btn w-full text-center text-[14px]"
          onClick={onRestart}
        >
          {ending === 'bad' ? '🔄 Попробовать ещё раз' : '🔄 Начать заново'}
        </button>
      </div>
    </div>
  )
}
