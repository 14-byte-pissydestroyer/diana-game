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

  useEffect(() => {
    textRef.current = text
    setDisplayedText('')
    setCharIndex(0)
    setIsComplete(false)
    skipRef.current = false
  }, [text])

  useEffect(() => {
    if (isComplete) return
    if (charIndex >= textRef.current.length) {
      setIsComplete(true)
      onComplete()
      return
    }

    const speed = isNarrator ? 30 : isThought ? 40 : 25
    const char = textRef.current[charIndex]
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
      if (timerRef.current) clearTimeout(timerRef.current)
      skipRef.current = true
      setDisplayedText(textRef.current)
      setIsComplete(true)
      setCharIndex(textRef.current.length)
      onComplete()
    }
  }, [isComplete, onComplete, onSkip])

  const getSpeakerColor = () => {
    if (isNarrator) return '#a78bfa'
    if (speaker === 'Диана') return '#ff69b4'
    if (speaker === 'Сева') return '#4a90d9'
    if (speaker === 'Дио') return '#ff4444'
    if (speaker === 'Джотаро') return '#5ba3ff'
    if (speaker === 'Арсенеус') return '#ffd700'
    if (speaker === 'Викториус' || speaker === 'Виктор') return '#00ff88'
    if (speaker === 'Свапна') return '#ff9ecd'
    if (speaker === 'Шлюхидзе') return '#ff1493'
    if (speaker === 'Протитутидзе') return '#ff4444'
    if (speaker === 'Тёлкидзе') return '#c4b5fd'
    if (speaker === 'Тролль') return '#bdbd00'
    if (speaker === 'Свитка') return '#ffd700'
    return '#e8d5ff'
  }

  const getBorderColor = () => {
    if (isNarrator) return 'rgba(167, 139, 250, 0.4)'
    if (isThought) return 'rgba(96, 165, 250, 0.4)'
    return 'rgba(124, 92, 191, 0.6)'
  }

  const getEmotionEmoji = () => {
    switch (emotion) {
      case 'happy': return '😊'
      case 'sad': return '😢'
      case 'angry': return '😠'
      case 'scared': return '😨'
      case 'determined': return '😤'
      case 'thinking': return '🤔'
      case 'surprised': return '😮'
      default: return null
    }
  }

  return (
    <div
      className="w-full pixel-box rounded-lg cursor-pointer select-none animate-fadeInUp"
      style={{
        borderColor: getBorderColor(),
        animationDuration: '0.3s',
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      {/* Speaker name */}
      {!isNarrator && speaker !== 'Свитка' && speaker !== 'Голос' && (
        <div className="px-4 pt-3 pb-1">
          <span
            className="speaker-name"
            style={{
              color: getSpeakerColor(),
              textShadow: `0 0 10px ${getSpeakerColor()}50`,
            }}
          >
            {speaker}
            {getEmotionEmoji() && (
              <span className="ml-2 text-base">{getEmotionEmoji()}</span>
            )}
          </span>
        </div>
      )}

      {/* Text area */}
      <div className="px-4 pb-4 pt-1">
        <p
          className={
            isNarrator
              ? 'dialogue-text-narrator text-purple-200/90'
              : isThought
              ? 'dialogue-text-thought text-blue-200/90'
              : 'dialogue-text text-gray-100'
          }
          style={{
            textShadow: isNarrator 
              ? '0 0 8px rgba(167,139,250,0.3)' 
              : isThought 
              ? '0 0 8px rgba(96,165,250,0.3)' 
              : 'none',
          }}
        >
          {isThought && <span className="text-blue-300/60 mr-1">💭</span>}
          {displayedText}
          {!isComplete && <span className="typewriter-cursor" />}
        </p>

        {/* Click to continue */}
        {isComplete && (
          <div className="mt-3 text-right">
            <span className="click-hint text-purple-400/60">
              ▼ нажми
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
