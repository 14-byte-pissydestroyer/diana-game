'use client'

import React, { useState } from 'react'

interface InventoryProps {
  items: string[]
  hp: number
  maxHp: number
  chapter: number
}

const ITEM_ICONS: Record<string, string> = {
  'Зелье исцеления': '🧪',
  'Подсказка о Сиренах': '📜',
  'Щит Барона': '🛡️',
  'Хакерский Артефакт': '💻',
  'Заклинание защиты': '✨',
  'Звезда Платинума': '⭐',
}

export default function Inventory({ items, hp, maxHp, chapter }: InventoryProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Inventory toggle button */}
      <button
        className="fixed top-3 right-3 z-40 pixel-btn !p-2 !px-3 text-[8px] flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm">🎒</span>
        {items.length > 0 && (
          <span className="bg-purple-600 text-white text-[7px] rounded-full w-4 h-4 flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>

      {/* HP and Chapter display */}
      <div className="fixed top-3 left-3 z-40 flex items-center gap-2">
        {/* HP */}
        <div className="pixel-box !p-1 !px-2 flex items-center gap-1">
          <span className="text-[8px] text-red-400">❤️</span>
          <div className="flex gap-0.5">
            {Array.from({ length: maxHp }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{
                  background: i < hp ? '#ff4444' : '#333',
                  boxShadow: i < hp ? '0 0 4px #ff444480' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Chapter */}
        <div className="pixel-box !p-1 !px-2">
          <span className="text-[7px] text-purple-300">
            Гл.{chapter}
          </span>
        </div>
      </div>

      {/* Inventory panel */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="pixel-box w-full max-w-sm relative z-10 p-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-[11px] text-purple-200 mb-3 text-center">
              🎒 Инвентарь
            </h2>

            {items.length === 0 ? (
              <p className="text-[8px] text-purple-400/50 text-center py-4">
                Пусто...
              </p>
            ) : (
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 bg-purple-900/30 rounded border border-purple-700/30"
                  >
                    <span className="text-lg">{ITEM_ICONS[item] || '📦'}</span>
                    <span className="text-[8px] text-purple-100">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* HP section */}
            <div className="mt-4 pt-3 border-t border-purple-700/30">
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-purple-300">Здоровье</span>
                <div className="flex gap-1">
                  {Array.from({ length: maxHp }).map((_, i) => (
                    <span key={i} className="text-sm">
                      {i < hp ? '❤️' : '🖤'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="pixel-btn w-full mt-3 text-center text-[8px]"
              onClick={() => setIsOpen(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  )
}
