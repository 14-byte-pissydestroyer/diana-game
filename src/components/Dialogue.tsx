'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'

interface DialogueProps {
  speaker: string
  text: string
  isNarrator?: boolean
  isThought?: boolean
  emotion?: string
  onComplete: () => void
  onSkip: () => void
}

export default function Dialogue({
  speaker,
  text,
  isNarrator,
  isThought,
  emotion,
  onComplete,
  onSkip,
}: DialogueProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [charIndex, setCharIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const textRef = useRef(text)
  const skipRef = useRef(false)

  // Reset when text changes
  useEffect(() => {
    textRef.current = text
    setDisplayedText('')
    setCharIndex(0)
    setIsComplete(false)
    skipRef.current = false
  }, [text])

  // Typewriter effect
  useEffect(() => {
    if (isComplete) return
    if (charIndex >= textRef.current.length) {
      setIsComplete(true)
      onComplete()
      return
    }

    const speed = isNarrator ? 25 : isThought ? 35 : 20
    const char = textRef.current[charIndex]

    // Pause on punctuation
    const pauseChars = ['.', '!', '?', '…', '—', ',']
    const delay = pauseChars.includes(char) ? speed * 4 : speed

    timerRef.current = setTimeout(() => {
      setDisplayedText(prev => prev + textRef.current[charIndex])
      setCharIndex(prev => prev + 1)
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [charIndex, isComplete, isNarrator, isThought, onComplete])

  const handleClick = useCallback(() => {
    if (isComplete) {
      onSkip()
    } else {
      // Skip to full text
      if (timerRef.current) clearTimeout(timerRef.current)
      skipRef.current = true
      setDisplayedText(textRef.current)
      setIsComplete(true)
      setCharIndex(textRef.current.length)
      onComplete()
    }
  }, [isComplete, onComplete, onSkip])

  // Determine speaker color
  const getSpeakerColor = () => {
    if (isNarrator) return '#a78bfa'
    if (speaker === 'Диана') return '#ff69b4'
    if (speaker === 'Сева') return '#4a90d9'
    if (speaker === 'Дио') return '#ff4444'
    if (speaker === 'Джотаро') return '#4a90d9'
    if (speaker === 'Арсенеус') return '#ffd700'
    if (speaker === 'Виктор') return '#00ff88'
    if (speaker === 'Свапна') return '#ff69b4'
    if (speaker === 'Шлюхидзе') return '#ff1493'
    if (speaker === 'Протитутидзе') return '#ff4444'
    if (speaker === 'Тёлкидзе') return '#a78bfa'
    if (speaker === 'Тролль') return '#8b8b00'
    if (speaker === 'Свитка') return '#ffd700'
    return '#e8d5ff'
  }

  const getBoxStyle = () => {
    if (isNarrator) return 'border-purple-500/50'
    if (isThought) return 'border-blue-400/50'
    return 'border-purple-600/50'
  }

  return (
    <div
      className={`w-full pixel-box ${getBoxStyle()} rounded-sm cursor-pointer select-none`}
      onClick={handleClick}
      onTouchEnd={handleClick}
      role="button"
      tabIndex={0}
    >
      {/* Speaker name */}
      {!isNarrator && speaker !== 'Свитка' && speaker !== 'Голос' && (
        <div className="px-3 pt-2 pb-1">
          <span
            className="text-[9px] tracking-wider uppercase"
            style={{
              color: getSpeakerColor(),
              textShadow: `0 0 6px ${getSpeakerColor()}60`,
            }}
          >
            {speaker}
            {emotion && emotion !== 'normal' && (
              <span className="ml-2 opacity-70">
                {emotion === 'happy' && '😊'}
                {emotion === 'sad' && '😢'}
                {emotion === 'angry' && '😠'}
                {emotion === 'scared' && '😨'}
                {emotion === 'determined' && '😤'}
                {emotion === 'thinking' && '🤔'}
                {emotion === 'surprised' && '😮'}
              </span>
            )}
          </span>
        </div>
      )}

      {/* Text area */}
      <div className="px-3 pb-3 pt-1">
        <p
          className={`leading-relaxed ${
            isNarrator
              ? 'text-[9px] italic text-purple-200/80'
              : isThought
              ? 'text-[9px] italic text-blue-200/80'
              : 'text-[10px] text-gray-100'
          }`}
          style={{
            textShadow: isNarrator ? '0 0 4px rgba(167,139,250,0.3)' : 'none',
          }}
        >
          {isThought && <span className="text-blue-300/50 mr-1">💭</span>}
          {displayedText}
          {!isComplete && <span className="typewriter-cursor" />}
        </p>

        {/* Click to continue hint */}
        {isComplete && (
          <div className="mt-2 text-right">
            <span className="text-[7px] text-purple-400/50 animate-pulse">
              ▼ нажми
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
