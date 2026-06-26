'use client'

import React from 'react'

interface ChoiceOption {
  text: string
  emoji: string
  disabled?: boolean
  reason?: string
}

interface ChoicesProps {
  options: ChoiceOption[]
  onSelect: (index: number) => void
}

export default function Choices({ options, onSelect }: ChoicesProps) {
  return (
    <div className="w-full space-y-3 animate-fadeInUp" style={{ animationDuration: '0.4s' }}>
      {options.map((option, i) => (
        <button
          key={i}
          className={`pixel-btn w-full flex items-center gap-3 ${
            option.disabled ? 'choice-disabled' : ''
          }`}
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
          onClick={() => !option.disabled && onSelect(i)}
          disabled={option.disabled}
        >
          <span className="text-xl flex-shrink-0">{option.emoji}</span>
          <span className="flex-1 text-left leading-relaxed">{option.text}</span>
          {option.disabled && option.reason && (
            <span className="text-[10px] text-red-400/80 flex-shrink-0 ml-2">
              ({option.reason})
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
