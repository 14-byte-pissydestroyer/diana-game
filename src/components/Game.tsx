'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useGame } from '@/engine/gameState'
import { SCENES, CHAPTER_TITLES, type Choice } from '@/data/story'
import TitleScreen from './TitleScreen'
import EndingScreen from './EndingScreen'
import Scene from './Scene'
import Dialogue from './Dialogue'
import Choices from './Choices'
import Inventory from './Inventory'
import PixelCharacter from './Character'

export default function Game() {
  const { state, dispatch, loadGame } = useGame()
  const [showChapterTitle, setShowChapterTitle] = useState(false)
  const [chapterTitleText, setChapterTitleText] = useState('')
  const [lastChapter, setLastChapter] = useState(0)
  const [textReady, setTextReady] = useState(false)
  const [choicesVisible, setChoicesVisible] = useState(false)
  const [hasSave, setHasSave] = useState(false)

  useEffect(() => {
    setHasSave(!!localStorage.getItem('diana-game-save'))
  }, [])

  const currentScene = useMemo(() => SCENES[state.currentScene], [state.currentScene])
  const currentDialogue = currentScene?.dialogue[state.dialogueIndex]
  const isLastDialogue = currentScene ? state.dialogueIndex >= currentScene.dialogue.length - 1 : false
  const showChoices = isLastDialogue && state.textComplete && currentScene?.choices && choicesVisible

  // Chapter title animation
  useEffect(() => {
    if (state.phase !== 'playing') return
    if (state.chapter !== lastChapter && CHAPTER_TITLES[state.chapter]) {
      setLastChapter(state.chapter)
      setChapterTitleText(CHAPTER_TITLES[state.chapter])
      setShowChapterTitle(true)
      const timer = setTimeout(() => setShowChapterTitle(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [state.chapter, state.phase, lastChapter])

  // Reset choices visibility when scene changes
  useEffect(() => {
    setChoicesVisible(false)
    setTextReady(false)
  }, [state.currentScene])

  const handleTextComplete = useCallback(() => {
    dispatch({ type: 'SET_TEXT_COMPLETE' })
    setTextReady(true)
    // Small delay before showing choices
    setTimeout(() => setChoicesVisible(true), 300)
  }, [dispatch])

  const handleAdvance = useCallback(() => {
    if (!currentScene) return
    if (!state.textComplete) return

    if (isLastDialogue) {
      if (currentScene.choices) {
        setChoicesVisible(true)
      } else if (currentScene.ending) {
        dispatch({ type: 'SET_ENDING', ending: currentScene.ending })
      } else if (currentScene.next) {
        dispatch({ type: 'SET_SCENE', scene: currentScene.next })
      }
    } else {
      dispatch({ type: 'ADVANCE_DIALOGUE' })
    }
  }, [currentScene, state.textComplete, isLastDialogue, dispatch])

  const handleChoice = useCallback((index: number) => {
    if (!currentScene?.choices) return
    const choice = currentScene.choices[index]

    // Check conditions
    if (choice.condition) {
      if (choice.condition.hasItem && !state.inventory.includes(choice.condition.hasItem)) return
      if (choice.condition.minCourage && state.courage < choice.condition.minCourage) return
    }

    dispatch({
      type: 'MAKE_CHOICE',
      choice: {
        nextScene: choice.nextScene,
        ...choice.effects,
      },
    })
  }, [currentScene, state.inventory, state.courage, dispatch])

  const handleStart = useCallback(() => {
    dispatch({ type: 'START_GAME' })
    setLastChapter(0)
  }, [dispatch])

  const handleContinue = useCallback((): boolean => {
    return loadGame()
  }, [loadGame])

  const handleRestart = useCallback(() => {
    localStorage.removeItem('diana-game-save')
    dispatch({ type: 'RESET' })
    setLastChapter(0)
  }, [dispatch])

  // Get available choices with condition checking
  const getFilteredChoices = useCallback((): { text: string; emoji: string; disabled?: boolean; reason?: string }[] => {
    if (!currentScene?.choices) return []
    return currentScene.choices.map((choice) => {
      let disabled = false
      let reason = ''
      if (choice.condition) {
        if (choice.condition.hasItem && !state.inventory.includes(choice.condition.hasItem)) {
          disabled = true
          reason = `Нет: ${choice.condition.hasItem}`
        }
        if (choice.condition.minCourage && state.courage < choice.condition.minCourage) {
          disabled = true
          reason = 'Недостаточно храбрости'
        }
      }
      return { text: choice.text, emoji: choice.emoji, disabled, reason }
    })
  }, [currentScene, state.inventory, state.courage])

  // Title screen
  if (state.phase === 'title') {
    return (
      <TitleScreen
        onStart={handleStart}
        onContinue={handleContinue}
        hasSave={hasSave}
      />
    )
  }

  // Ending screen
  if (state.phase === 'ending' && state.ending) {
    return (
      <EndingScreen
        ending={state.ending}
        onRestart={handleRestart}
      />
    )
  }

  // Playing screen
  if (!currentScene) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <p className="text-red-400 text-[10px]">Ошибка: сцена не найдена ({state.currentScene})</p>
      </div>
    )
  }

  return (
    <Scene background={currentScene.background}>
      {/* Chapter title overlay */}
      {showChapterTitle && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="animate-fadeIn text-center" style={{ animationDuration: '0.5s' }}>
            <h2 className="text-[11px] text-purple-100 px-4" style={{ textShadow: '0 0 20px rgba(167,139,250,0.5)' }}>
              {chapterTitleText}
            </h2>
          </div>
        </div>
      )}

      {/* Inventory */}
      <Inventory
        items={state.inventory}
        hp={state.hp}
        maxHp={state.maxHp}
        chapter={state.chapter}
      />

      {/* Character display area */}
      <div className="absolute top-4 left-0 right-0 bottom-[45%] flex items-end justify-center gap-3 pointer-events-none">
        {currentScene.characters.map((char, i) => (
          <div
            key={char}
            className="animate-fadeIn"
            style={{
              animationDuration: '0.5s',
              animationDelay: `${i * 0.1}s`,
              zIndex: char === 'diana' ? 10 : 5,
            }}
          >
            <PixelCharacter
              name={char}
              size={currentScene.characters.length === 1 ? 'lg' : 'md'}
            />
          </div>
        ))}
      </div>

      {/* Dialogue + Choices area */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-20 space-y-2">
        {/* Current dialogue */}
        {currentDialogue && (
          <Dialogue
            key={`${state.currentScene}-${state.dialogueIndex}`}
            speaker={currentDialogue.speaker}
            text={currentDialogue.text}
            isNarrator={currentDialogue.isNarrator}
            isThought={currentDialogue.isThought}
            emotion={currentDialogue.emotion}
            onComplete={handleTextComplete}
            onSkip={handleAdvance}
          />
        )}

        {/* Choices */}
        {showChoices && currentScene.choices && (
          <Choices
            options={getFilteredChoices()}
            onSelect={handleChoice}
          />
        )}

        {/* Continue hint when no choices */}
        {isLastDialogue && state.textComplete && !currentScene.choices && (
          <button
            className="pixel-btn w-full text-center text-[8px] animate-pulse"
            onClick={handleAdvance}
          >
            {currentScene.ending ? '◆ Завершить' : '◆ Продолжить →'}
          </button>
        )}
      </div>
    </Scene>
  )
}
