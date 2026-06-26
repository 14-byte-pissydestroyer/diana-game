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
    <div className="w-full space-y-2 animate-fadeIn" style={{ animationDuration: '0.3s' }}>
      {options.map((option, i) => (
        <button
          key={i}
          className={`pixel-btn w-full text-[9px] leading-relaxed flex items-center gap-2 ${
            option.disabled ? 'opacity-40 cursor-not-allowed' : ''
          }`}
          onClick={() => !option.disabled && onSelect(i)}
          onTouchEnd={(e) => {
            e.preventDefault()
            if (!option.disabled) onSelect(i)
          }}
          disabled={option.disabled}
        >
          <span className="text-lg flex-shrink-0">{option.emoji}</span>
          <span className="flex-1 text-left">{option.text}</span>
          {option.disabled && option.reason && (
            <span className="text-[7px] text-red-400 flex-shrink-0">({option.reason})</span>
          )}
        </button>
      ))}
    </div>
  )
}
