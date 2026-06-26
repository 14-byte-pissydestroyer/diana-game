'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react'

// --- Types ---
export interface GameState {
  currentScene: string
  chapter: number
  courage: number
  hp: number
  maxHp: number
  inventory: string[]
  flags: Record<string, boolean>
  phase: 'title' | 'playing' | 'ending'
  ending: string | null
  dialogueIndex: number
  textComplete: boolean
}

type GameAction =
  | { type: 'SET_SCENE'; scene: string }
  | { type: 'ADVANCE_DIALOGUE' }
  | { type: 'SET_TEXT_COMPLETE' }
  | { type: 'MAKE_CHOICE'; choice: ChoiceEffect }
  | { type: 'START_GAME' }
  | { type: 'SET_ENDING'; ending: string }
  | { type: 'LOAD_SAVE'; state: GameState }
  | { type: 'RESET' }
  | { type: 'SET_PHASE'; phase: GameState['phase'] }

interface ChoiceEffect {
  courage?: number
  addItem?: string
  removeItem?: string
  setFlag?: string
  nextScene: string
  damage?: number
}

const initialState: GameState = {
  currentScene: 'ch1_s1',
  chapter: 1,
  courage: 0,
  hp: 3,
  maxHp: 3,
  inventory: [],
  flags: {},
  phase: 'title',
  ending: null,
  dialogueIndex: 0,
  textComplete: false,
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return { ...initialState, phase: 'playing' }
    case 'SET_SCENE':
      return { ...state, currentScene: action.scene, dialogueIndex: 0, textComplete: false }
    case 'ADVANCE_DIALOGUE':
      return { ...state, dialogueIndex: state.dialogueIndex + 1, textComplete: false }
    case 'SET_TEXT_COMPLETE':
      return { ...state, textComplete: true }
    case 'MAKE_CHOICE': {
      const { courage, addItem, removeItem, setFlag, nextScene, damage } = action.choice
      const newState = { ...state }
      if (courage) newState.courage += courage
      if (addItem && !newState.inventory.includes(addItem)) {
        newState.inventory = [...newState.inventory, addItem]
      }
      if (removeItem) {
        newState.inventory = newState.inventory.filter(i => i !== removeItem)
      }
      if (setFlag) {
        newState.flags = { ...newState.flags, [setFlag]: true }
      }
      if (damage) {
        newState.hp = Math.max(0, newState.hp - damage)
      }
      // Extract chapter from scene id
      const chapterMatch = nextScene.match(/^ch(\d+)/)
      if (chapterMatch) {
        newState.chapter = parseInt(chapterMatch[1])
      }
      newState.currentScene = nextScene
      newState.dialogueIndex = 0
      newState.textComplete = false
      return newState
    }
    case 'SET_ENDING':
      return { ...state, phase: 'ending', ending: action.ending }
    case 'LOAD_SAVE':
      return { ...action.state, phase: 'playing' }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

interface GameContextType {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  saveGame: () => void
  loadGame: () => boolean
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const stateRef = useRef(state)
  stateRef.current = state

  const saveGame = useCallback(() => {
    try {
      localStorage.setItem('diana-game-save', JSON.stringify(stateRef.current))
    } catch {}
  }, [])

  const loadGame = useCallback((): boolean => {
    try {
      const saved = localStorage.getItem('diana-game-save')
      if (saved) {
        const parsed = JSON.parse(saved) as GameState
        dispatch({ type: 'LOAD_SAVE', state: parsed })
        return true
      }
    } catch {}
    return false
  }, [])

  // Auto-save on state changes (when playing)
  useEffect(() => {
    if (state.phase === 'playing') {
      const timer = setTimeout(saveGame, 500)
      return () => clearTimeout(timer)
    }
  }, [state, saveGame])

  return (
    <GameContext.Provider value={{ state, dispatch, saveGame, loadGame }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
