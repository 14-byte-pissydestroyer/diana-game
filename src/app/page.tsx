'use client'

import { GameProvider } from '@/engine/gameState'
import Game from '@/components/Game'

export default function Home() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  )
}
