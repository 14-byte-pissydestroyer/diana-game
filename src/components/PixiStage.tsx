'use client'

import React, { useRef, useEffect, useCallback } from 'react'

interface PixiStageProps {
  background: string
  characters: string[]
}

// Detect theme from CSS gradient string
function detectTheme(bg: string): string {
  if (bg.includes('#2d1b4e') && bg.includes('#1a0a2e') && !bg.includes('#4e1a4e')) return 'cottage'
  if (bg.includes('#1a2e1a')) return 'forest'
  if (bg.includes('#1a1a4e')) return 'tower'
  if (bg.includes('#2e1a1a')) return 'bridge'
  if (bg.includes('#4e1a4e')) return 'castle'
  if (bg.includes('#4e1a2e')) return 'throne'
  if (bg.includes('#ff6b35')) return 'sunrise'
  if (bg.includes('#98fb98')) return 'garden'
  if (bg.includes('#330000')) return 'void'
  return 'dark'
}

// Character configs
const CHAR_CONFIGS: Record<string, {
  body: number; hair: number; accent: number; eyes: number; skin: number;
  label: string; h: number; w: number;
  features?: string
}> = {
  diana:   { body: 0x2d1b4e, hair: 0x1a0a2e, accent: 0xff69b4, eyes: 0x87ceeb, skin: 0xf0d0a0, label: 'Диана', h: 110, w: 80 },
  seva:    { body: 0x1b3a5c, hair: 0x4a3728, accent: 0xffd700, eyes: 0x4a90d9, skin: 0xe8c090, label: 'Сева', h: 120, w: 90 },
  arsen:   { body: 0x3d5a3d, hair: 0x8b4513, accent: 0xffd700, eyes: 0x2d5016, skin: 0xd4a070, label: 'Арсенеус', h: 140, w: 100, features: 'mustache' },
  viktor:  { body: 0x1a1a4e, hair: 0x4a2d7a, accent: 0x00ff88, eyes: 0x00ff88, skin: 0xf0d0a0, label: 'Виктор', h: 115, w: 85, features: 'glow' },
  swapna:  { body: 0x8b2252, hair: 0x1a0a2e, accent: 0xff69b4, eyes: 0x8b4513, skin: 0xe8c090, label: 'Свапна', h: 105, w: 80, features: 'aura' },
  jotaro:  { body: 0x1a1a1a, hair: 0x1a1a1a, accent: 0x4a90d9, eyes: 0x1a1a1a, skin: 0xd4a070, label: 'Джотаро', h: 140, w: 100, features: 'hat' },
  dio:     { body: 0x8b0000, hair: 0xffd700, accent: 0xffd700, eyes: 0xff0000, skin: 0xf0d0a0, label: 'Дио', h: 135, w: 100, features: 'muscular' },
  siren1:  { body: 0x8b2252, hair: 0xff69b4, accent: 0xff1493, eyes: 0xff69b4, skin: 0xe8c090, label: 'Шлюхидзе', h: 110, w: 80 },
  siren2:  { body: 0x2d2d2d, hair: 0x4a0000, accent: 0xff4444, eyes: 0xff0000, skin: 0xd4a070, label: 'Протитутидзе', h: 125, w: 90, features: 'armor' },
  siren3:  { body: 0x2d1b4e, hair: 0x6b3fa0, accent: 0xa78bfa, eyes: 0xc4b5fd, skin: 0xe8c090, label: 'Тёлкидзе', h: 115, w: 85, features: 'crown' },
  troll:   { body: 0x3d5a3d, hair: 0x2d3a2d, accent: 0x8b8b00, eyes: 0xffff00, skin: 0x6b8b4d, label: 'Тролль', h: 150, w: 120, features: 'muscular' },
}

// Particle interface
interface Particle {
  g: any
  vx: number
  vy: number
  life: number
  maxLife: number
  baseAlpha: number
}

export default function PixiStage({ background, characters }: PixiStageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<any>(null)
  const PIXIRef = useRef<any>(null)
  const particlesRef = useRef<Particle[]>([])
  const charContainerRef = useRef<any>(null)
  const bgContainerRef = useRef<any>(null)
  const particleContainerRef = useRef<any>(null)
  const tickerFnRef = useRef<any>(null)

  const drawBackground = useCallback((PIXI: any, bgContainer: any, particleContainer: any, w: number, h: number, theme: string) => {
    bgContainer.removeChildren()
    particleContainer.removeChildren()
    particlesRef.current = []

    // Helper: draw filled rect
    const rect = (x: number, y: number, rw: number, rh: number, color: number, alpha = 1) => {
      const g = new PIXI.Graphics()
      g.rect(x, y, rw, rh)
      g.fill({ color, alpha })
      bgContainer.addChild(g)
      return g
    }

    // Helper: draw circle
    const circ = (cx: number, cy: number, r: number, color: number, alpha = 1) => {
      const g = new PIXI.Graphics()
      g.circle(cx, cy, r)
      g.fill({ color, alpha })
      bgContainer.addChild(g)
      return g
    }

    // Helper: gradient rect (draw horizontal bands)
    const gradRect = (x: number, y: number, rw: number, rh: number, colors: { pos: number; color: number; alpha?: number }[]) => {
      const bandH = Math.max(2, rh / 40)
      for (let i = 0; i < colors.length - 1; i++) {
        const c0 = colors[i]
        const c1 = colors[i + 1]
        const startY = y + c0.pos * rh
        const endY = y + c1.pos * rh
        const steps = Math.max(1, Math.ceil((endY - startY) / bandH))
        for (let s = 0; s < steps; s++) {
          const t = s / steps
          const py = startY + t * (endY - startY)
          const ph = (endY - startY) / steps + 1
          const a0 = c0.alpha ?? 1
          const a1 = c1.alpha ?? 1
          const alpha = a0 + t * (a1 - a0)
          const r0 = (c0.color >> 16) & 0xff, g0 = (c0.color >> 8) & 0xff, b0 = c0.color & 0xff
          const r1 = (c1.color >> 16) & 0xff, g1 = (c1.color >> 8) & 0xff, b1 = c1.color & 0xff
          const ri = Math.round(r0 + t * (r1 - r0))
          const gi = Math.round(g0 + t * (g1 - g0))
          const bi = Math.round(b0 + t * (b1 - b0))
          const color = (ri << 16) | (gi << 8) | bi
          rect(x, py, rw, ph, color, alpha)
        }
      }
    }

    // Random helper (seeded)
    let seed = theme.length * 137
    const rng = () => { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646 }

    // Create particles for a theme
    const makeParticles = (count: number, colors: number[], speedY: [number, number], speedX: [number, number], size: [number, number], alphaRange: [number, number]) => {
      for (let i = 0; i < count; i++) {
        const g = new PIXI.Graphics()
        const s = size[0] + rng() * (size[1] - size[0])
        const color = colors[Math.floor(rng() * colors.length)]
        g.circle(0, 0, s)
        g.fill({ color, alpha: alphaRange[0] + rng() * (alphaRange[1] - alphaRange[0]) })
        g.x = rng() * w
        g.y = rng() * h
        particleContainer.addChild(g)
        particlesRef.current.push({
          g,
          vx: speedX[0] + rng() * (speedX[1] - speedX[0]),
          vy: speedY[0] + rng() * (speedY[1] - speedY[0]),
          life: rng() * 300,
          maxLife: 300 + rng() * 300,
          baseAlpha: alphaRange[0] + rng() * (alphaRange[1] - alphaRange[0]),
        })
      }
    }

    switch (theme) {
      case 'cottage': {
        // Dark interior wall
        gradRect(0, 0, w, h, [
          { pos: 0, color: 0x1a0a2e },
          { pos: 0.3, color: 0x2d1b4e },
          { pos: 0.7, color: 0x251540 },
          { pos: 1, color: 0x1a0a2e },
        ])
        // Wooden floor
        gradRect(0, h * 0.72, w, h * 0.28, [
          { pos: 0, color: 0x3d2817 },
          { pos: 0.5, color: 0x4a3020 },
          { pos: 1, color: 0x2d1a0e },
        ])
        // Floor planks
        for (let i = 0; i < 6; i++) {
          const px = (w / 6) * i + rng() * 20
          rect(px, h * 0.72, 2, h * 0.28, 0x2a1508, 0.4)
        }
        // Back wall texture
        for (let i = 0; i < 12; i++) {
          rect(rng() * w, rng() * h * 0.7, 3 + rng() * 6, 2, 0x1a0820, 0.3)
        }
        // Window (right side)
        const winX = w * 0.65, winY = h * 0.15, winW = w * 0.2, winH = h * 0.25
        rect(winX, winY, winW, winH, 0x0a1a3e)
        // Window frame
        rect(winX - 3, winY - 3, winW + 6, 3, 0x4a3020)
        rect(winX - 3, winY + winH, winW + 6, 3, 0x4a3020)
        rect(winX - 3, winY, 3, winH, 0x4a3020)
        rect(winX + winW, winY, 3, winH, 0x4a3020)
        rect(winX + winW / 2 - 1, winY, 2, winH, 0x4a3020)
        rect(winX, winY + winH / 2 - 1, winW, 2, 0x4a3020)
        // Moon through window
        circ(winX + winW * 0.7, winY + winH * 0.3, 8, 0xeeeedd, 0.6)
        // Stars through window
        for (let i = 0; i < 5; i++) {
          circ(winX + rng() * winW, winY + rng() * winH, 1, 0xffffff, 0.3 + rng() * 0.4)
        }
        // Table
        rect(w * 0.25, h * 0.55, w * 0.35, 5, 0x5a3a20)
        rect(w * 0.28, h * 0.60, 4, h * 0.12, 0x4a2a15)
        rect(w * 0.52, h * 0.60, 4, h * 0.12, 0x4a2a15)
        // Candle on table
        rect(w * 0.4, h * 0.48, 4, 7, 0xeeeecc)
        // Candle flame
        circ(w * 0.405, h * 0.46, 4, 0xffaa00, 0.8)
        circ(w * 0.405, h * 0.45, 2, 0xffdd44, 0.9)
        // Candle glow
        circ(w * 0.405, h * 0.46, 30, 0xff8800, 0.05)
        circ(w * 0.405, h * 0.46, 60, 0xff6600, 0.02)
        // Scroll on table
        rect(w * 0.35, h * 0.52, 15, 6, 0xddcc88, 0.8)
        // Bookshelf left
        rect(w * 0.05, h * 0.2, w * 0.12, h * 0.4, 0x3d2010)
        for (let i = 0; i < 4; i++) {
          rect(w * 0.06, h * 0.22 + i * h * 0.09, w * 0.1, 3, 0x3d2010)
        }
        // Books
        for (let i = 0; i < 8; i++) {
          const bookColors = [0x8b2252, 0x2d4a8b, 0x4a8b2d, 0x8b6b2d, 0x4a2d8b]
          rect(w * 0.06 + i * 8, h * 0.23 + Math.floor(i / 3) * h * 0.09, 6, 12 + rng() * 5, bookColors[i % bookColors.length], 0.8)
        }
        // Ember particles
        makeParticles(12, [0xff8800, 0xffaa22, 0xff6600], [-0.3, -0.8], [-0.2, 0.2], [1, 3], [0.3, 0.7])
        break
      }
      case 'forest': {
        // Night sky
        gradRect(0, 0, w, h * 0.4, [
          { pos: 0, color: 0x050d05 },
          { pos: 1, color: 0x0a1a0a },
        ])
        // Ground
        gradRect(0, h * 0.4, w, h * 0.6, [
          { pos: 0, color: 0x0f1f0f },
          { pos: 0.3, color: 0x0a150a },
          { pos: 1, color: 0x050a05 },
        ])
        // Moon
        circ(w * 0.75, h * 0.12, 20, 0xeeeedd, 0.5)
        circ(w * 0.75, h * 0.12, 18, 0xffffee, 0.3)
        // Moon glow
        circ(w * 0.75, h * 0.12, 50, 0xaaddaa, 0.03)
        // Stars
        for (let i = 0; i < 30; i++) {
          circ(rng() * w, rng() * h * 0.35, 0.5 + rng() * 1.5, 0xffffff, 0.2 + rng() * 0.5)
        }
        // Background trees (far)
        for (let i = 0; i < 8; i++) {
          const tx = rng() * w
          const th = h * 0.3 + rng() * h * 0.15
          const tw = 15 + rng() * 20
          // Trunk
          rect(tx - 3, h * 0.4 - th, 6, th, 0x0a150a, 0.6)
          // Canopy (triangular approximation)
          for (let j = 0; j < 4; j++) {
            const cw = tw - j * 4
            const cy = h * 0.4 - th + j * th * 0.15
            rect(tx - cw / 2, cy, cw, th * 0.2, 0x0d200d, 0.5 + j * 0.05)
          }
        }
        // Midground trees
        for (let i = 0; i < 5; i++) {
          const tx = rng() * w
          const th = h * 0.35 + rng() * h * 0.1
          const tw = 20 + rng() * 25
          rect(tx - 4, h * 0.5 - th * 0.4, 8, th * 0.5, 0x0f1a0f, 0.7)
          for (let j = 0; j < 5; j++) {
            const cw = tw - j * 5
            const cy = h * 0.5 - th * 0.4 + j * th * 0.08
            rect(tx - cw / 2, cy, cw, th * 0.12, 0x142814, 0.6 + j * 0.04)
          }
        }
        // Ground details - grass tufts
        for (let i = 0; i < 20; i++) {
          const gx = rng() * w
          const gy = h * 0.6 + rng() * h * 0.3
          rect(gx, gy, 2, 4 + rng() * 4, 0x1a3a1a, 0.4)
          rect(gx + 3, gy + 1, 2, 3 + rng() * 3, 0x1a3a1a, 0.3)
        }
        // Glowing mushrooms
        for (let i = 0; i < 6; i++) {
          const mx = w * 0.1 + rng() * w * 0.8
          const my = h * 0.65 + rng() * h * 0.2
          const mColors = [0x00ff88, 0x88ffcc, 0x44ffaa]
          const mc = mColors[Math.floor(rng() * mColors.length)]
          // Stem
          rect(mx, my - 6, 3, 6, 0x336633, 0.6)
          // Cap
          rect(mx - 4, my - 10, 11, 5, mc, 0.6)
          // Glow
          circ(mx + 1, my - 7, 10, mc, 0.08)
        }
        // Firefly particles
        makeParticles(20, [0x88ff44, 0xaaffaa, 0x66ff88], [-0.2, 0.2], [-0.3, 0.3], [1, 3], [0.2, 0.6])
        break
      }
      case 'tower': {
        // Deep blue sky
        gradRect(0, 0, w, h, [
          { pos: 0, color: 0x050520 },
          { pos: 0.4, color: 0x0a0a3e },
          { pos: 1, color: 0x050515 },
        ])
        // Tower structure
        rect(w * 0.3, h * 0.1, w * 0.4, h * 0.8, 0x0d0d2a)
        // Tower edges
        rect(w * 0.3, h * 0.1, 3, h * 0.8, 0x1a1a4e, 0.6)
        rect(w * 0.7 - 3, h * 0.1, 3, h * 0.8, 0x1a1a4e, 0.6)
        // Tower top (spire)
        for (let i = 0; i < 8; i++) {
          const spW = w * 0.4 - i * 8
          rect(w * 0.5 - spW / 2, h * 0.1 - i * 6, spW, 6, 0x0d0d2a)
        }
        // Windows (glowing screens)
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 2; j++) {
            const wx = w * 0.35 + j * w * 0.2
            const wy = h * 0.2 + i * h * 0.15
            rect(wx, wy, w * 0.08, h * 0.08, 0x002200)
            rect(wx + 2, wy + 2, w * 0.08 - 4, h * 0.08 - 4, 0x003300, 0.5)
            // Screen glow
            circ(wx + w * 0.04, wy + h * 0.04, 15, 0x00ff44, 0.04)
          }
        }
        // Code streams (vertical green lines)
        for (let i = 0; i < 15; i++) {
          const cx = w * 0.32 + rng() * w * 0.36
          const cy = rng() * h
          const cLen = 20 + rng() * 60
          for (let j = 0; j < cLen; j += 4) {
            if (rng() > 0.3) {
              rect(cx, cy + j, 2, 3, 0x00ff44, 0.1 + rng() * 0.3)
            }
          }
        }
        // Ground
        rect(0, h * 0.85, w, h * 0.15, 0x0a0a20)
        // Circuit-like ground details
        for (let i = 0; i < 10; i++) {
          const lx = rng() * w
          const ly = h * 0.87 + rng() * h * 0.1
          rect(lx, ly, 20 + rng() * 40, 1, 0x00ff44, 0.15)
          rect(lx + 20 * rng(), ly, 1, 10 + rng() * 15, 0x00ff44, 0.1)
        }
        // Floating code particles
        makeParticles(25, [0x00ff44, 0x44ffaa, 0x00cc33], [0.2, 0.8], [-0.1, 0.1], [1, 2], [0.15, 0.4])
        break
      }
      case 'bridge': {
        // Dark red sky
        gradRect(0, 0, w, h * 0.5, [
          { pos: 0, color: 0x0a0000 },
          { pos: 0.5, color: 0x1a0808 },
          { pos: 1, color: 0x2e1212 },
        ])
        // Chasm
        gradRect(0, h * 0.5, w, h * 0.5, [
          { pos: 0, color: 0x0a0000 },
          { pos: 0.5, color: 0x150000 },
          { pos: 1, color: 0x080000 },
        ])
        // Chasm glow from below
        gradRect(w * 0.2, h * 0.85, w * 0.6, h * 0.15, [
          { pos: 0, color: 0x440000, alpha: 0.1 },
          { pos: 1, color: 0x882200, alpha: 0.05 },
        ])
        // Cliff edges
        rect(0, h * 0.45, w * 0.3, h * 0.55, 0x1a0a0a)
        rect(w * 0.7, h * 0.45, w * 0.3, h * 0.55, 0x1a0a0a)
        // Cliff texture
        for (let i = 0; i < 15; i++) {
          const side = rng() > 0.5 ? 0 : w * 0.7
          rect(side + rng() * w * 0.28, h * 0.45 + rng() * h * 0.5, 3 + rng() * 8, 2, 0x251010, 0.3)
        }
        // Bridge planks
        for (let i = 0; i < 8; i++) {
          const bx = w * 0.3 + i * (w * 0.4 / 8)
          rect(bx, h * 0.48, w * 0.4 / 8 - 3, 4, 0x3d2010, 0.8)
        }
        // Bridge ropes
        for (let i = 0; i < 3; i++) {
          const ry = h * 0.42 + i * 4
          rect(w * 0.3, ry, w * 0.4, 1, 0x5a3a20, 0.5)
        }
        // Distant mountains
        for (let i = 0; i < 4; i++) {
          const mx = i * w * 0.3 - w * 0.05
          const mh = h * 0.15 + rng() * h * 0.1
          for (let j = 0; j < 5; j++) {
            const mw = w * 0.3 - j * 20
            rect(mx + j * 10, h * 0.45 - mh + j * mh * 0.15, mw, mh * 0.15, 0x150808, 0.3)
          }
        }
        // Wind/ash particles
        makeParticles(15, [0xff4444, 0xff6644, 0x884444], [-0.1, 0.3], [-0.5, -0.1], [1, 2], [0.15, 0.35])
        break
      }
      case 'castle': {
        // Dark purple sky
        gradRect(0, 0, w, h, [
          { pos: 0, color: 0x0a0015 },
          { pos: 0.3, color: 0x1a0a2e },
          { pos: 0.6, color: 0x2e0a2e },
          { pos: 1, color: 0x1a0015 },
        ])
        // Castle silhouette - main body
        rect(w * 0.15, h * 0.3, w * 0.7, h * 0.7, 0x150020, 0.8)
        // Towers
        rect(w * 0.15, h * 0.15, w * 0.12, h * 0.85, 0x1a0025, 0.85)
        rect(w * 0.73, h * 0.1, w * 0.12, h * 0.9, 0x1a0025, 0.85)
        rect(w * 0.42, h * 0.05, w * 0.16, h * 0.95, 0x1a0025, 0.9)
        // Spire tops
        for (let t = 0; t < 3; t++) {
          const tx = [w * 0.21, w * 0.5, w * 0.79][t]
          const ty = [h * 0.15, h * 0.05, h * 0.1][t]
          for (let i = 0; i < 6; i++) {
            const spW = 12 - i * 2
            rect(tx - spW / 2, ty - i * 8, spW, 8, 0x1a0025, 0.9)
          }
          // Spire tip glow
          circ(tx, ty - 48, 3, 0xa78bfa, 0.6)
          circ(tx, ty - 48, 8, 0xa78bfa, 0.1)
        }
        // Castle windows (purple glow)
        for (let i = 0; i < 5; i++) {
          const wx = w * 0.25 + i * w * 0.1
          const wy = h * 0.4 + (i % 2) * h * 0.1
          rect(wx, wy, 8, 12, 0x4e1a6e, 0.6)
          circ(wx + 4, wy + 6, 10, 0xa78bfa, 0.06)
        }
        // Gate
        rect(w * 0.43, h * 0.65, w * 0.14, h * 0.35, 0x0a0010)
        // Gate arch
        circ(w * 0.5, h * 0.65, w * 0.07, 0x0a0010)
        // Ground
        rect(0, h * 0.88, w, h * 0.12, 0x0a0010)
        // Magical sparkle particles
        makeParticles(20, [0xa78bfa, 0xc4b5fd, 0x7c3aed], [-0.3, -0.1], [-0.2, 0.2], [1, 3], [0.2, 0.5])
        break
      }
      case 'throne': {
        // Crimson interior
        gradRect(0, 0, w, h, [
          { pos: 0, color: 0x1a0508 },
          { pos: 0.3, color: 0x2e0a12 },
          { pos: 0.7, color: 0x4e1a28 },
          { pos: 1, color: 0x2e0a12 },
        ])
        // Floor
        gradRect(0, h * 0.75, w, h * 0.25, [
          { pos: 0, color: 0x200a0e },
          { pos: 1, color: 0x150508 },
        ])
        // Floor pattern
        for (let i = 0; i < 8; i++) {
          rect(w * 0.1 + i * w * 0.1, h * 0.75, 1, h * 0.25, 0x3a1520, 0.3)
        }
        // Throne (center)
        const throneX = w * 0.4, throneW = w * 0.2
        // Throne back
        rect(throneX, h * 0.15, throneW, h * 0.55, 0x2a0a10)
        // Throne top ornament
        for (let i = 0; i < 5; i++) {
          rect(throneX + i * throneW / 5, h * 0.1 + (2 - Math.abs(i - 2)) * 5, throneW / 5 - 2, 8, 0xffd700, 0.4)
        }
        // Throne seat
        rect(throneX + 8, h * 0.5, throneW - 16, h * 0.08, 0x8b0000, 0.6)
        // Throne armrests
        rect(throneX - 5, h * 0.45, 8, h * 0.15, 0x4a1a20)
        rect(throneX + throneW - 3, h * 0.45, 8, h * 0.15, 0x4a1a20)
        // Gold accents on throne
        rect(throneX + 2, h * 0.15, throneW - 4, 3, 0xffd700, 0.3)
        rect(throneX + 2, h * 0.5, throneW - 4, 2, 0xffd700, 0.2)
        // Columns
        for (let i = 0; i < 4; i++) {
          const cx = w * 0.08 + i * w * 0.28
          rect(cx, h * 0.05, 10, h * 0.75, 0x3a1018)
          // Column capital
          rect(cx - 3, h * 0.05, 16, 6, 0x4a1a25)
          // Column base
          rect(cx - 3, h * 0.75, 16, 6, 0x4a1a25)
        }
        // Banners
        for (let i = 0; i < 3; i++) {
          const bx = w * 0.2 + i * w * 0.3
          rect(bx, h * 0.08, 15, h * 0.25, 0x8b0000, 0.5)
          rect(bx + 3, h * 0.1, 9, h * 0.05, 0xffd700, 0.2)
        }
        // Ember/red particles
        makeParticles(18, [0xff4444, 0xff6644, 0xffd700, 0xff8800], [-0.5, -0.1], [-0.15, 0.15], [1, 3], [0.2, 0.5])
        break
      }
      case 'sunrise': {
        // Sky gradient (orange to blue)
        gradRect(0, 0, w, h * 0.6, [
          { pos: 0, color: 0xff6b35 },
          { pos: 0.2, color: 0xff8844 },
          { pos: 0.4, color: 0xffd700 },
          { pos: 0.6, color: 0xffdd88 },
          { pos: 0.8, color: 0x87ceeb },
          { pos: 1, color: 0x4a90d9 },
        ])
        // Sun
        circ(w * 0.5, h * 0.25, 30, 0xffdd44, 0.8)
        circ(w * 0.5, h * 0.25, 40, 0xffcc22, 0.3)
        circ(w * 0.5, h * 0.25, 60, 0xffaa00, 0.1)
        // Clouds
        for (let i = 0; i < 4; i++) {
          const cx = rng() * w
          const cy = h * 0.1 + rng() * h * 0.2
          for (let j = 0; j < 3; j++) {
            rect(cx + j * 15, cy + j * 2, 25 - j * 3, 8, 0xffeedd, 0.15)
          }
        }
        // Hills (back)
        for (let i = 0; i < 6; i++) {
          const hx = i * w * 0.2 - w * 0.1
          const hh = h * 0.08 + rng() * h * 0.06
          for (let j = 0; j < 4; j++) {
            const hw = w * 0.25 - j * 15
            rect(hx + j * 8, h * 0.55 - hh + j * hh * 0.2, hw, hh * 0.2, 0x2d6b2d, 0.4 + j * 0.05)
          }
        }
        // Hills (front)
        gradRect(0, h * 0.58, w, h * 0.42, [
          { pos: 0, color: 0x228b22 },
          { pos: 0.3, color: 0x1a7a1a },
          { pos: 1, color: 0x155a15 },
        ])
        // Grass details
        for (let i = 0; i < 25; i++) {
          const gx = rng() * w
          const gy = h * 0.62 + rng() * h * 0.3
          rect(gx, gy, 2, 3 + rng() * 5, 0x3a9a3a, 0.4)
        }
        // Flowers
        for (let i = 0; i < 8; i++) {
          const fx = rng() * w
          const fy = h * 0.65 + rng() * h * 0.25
          const fColors = [0xff69b4, 0xffd700, 0xff4444, 0xffffff]
          rect(fx, fy - 4, 1, 4, 0x2d8b2d, 0.5)
          circ(fx, fy - 6, 2, fColors[Math.floor(rng() * fColors.length)], 0.7)
        }
        // Light motes
        makeParticles(15, [0xffd700, 0xffee88, 0xffcc44], [-0.2, 0.1], [-0.1, 0.1], [1, 3], [0.2, 0.5])
        break
      }
      case 'garden': {
        // Blue sky
        gradRect(0, 0, w, h * 0.4, [
          { pos: 0, color: 0x4a90d9 },
          { pos: 1, color: 0x87ceeb },
        ])
        // Grass
        gradRect(0, h * 0.4, w, h * 0.6, [
          { pos: 0, color: 0x98fb98 },
          { pos: 0.3, color: 0x44aa44 },
          { pos: 1, color: 0x228b22 },
        ])
        // Sun
        circ(w * 0.8, h * 0.1, 25, 0xffdd44, 0.5)
        circ(w * 0.8, h * 0.1, 40, 0xffcc22, 0.15)
        // Clouds
        for (let i = 0; i < 3; i++) {
          const cx = rng() * w * 0.7
          const cy = h * 0.05 + rng() * h * 0.15
          for (let j = 0; j < 4; j++) {
            rect(cx + j * 12, cy + Math.sin(j) * 3, 20 - j * 2, 10, 0xffffff, 0.3)
          }
        }
        // Trees
        for (let i = 0; i < 4; i++) {
          const tx = rng() * w
          rect(tx - 4, h * 0.25, 8, h * 0.2, 0x3d2810, 0.7)
          circ(tx, h * 0.22, 20 + rng() * 15, 0x228b22, 0.6)
          circ(tx - 8, h * 0.25, 15, 0x2d8b2d, 0.5)
          circ(tx + 8, h * 0.25, 15, 0x2d8b2d, 0.5)
        }
        // Flowers (many, varied)
        for (let i = 0; i < 25; i++) {
          const fx = rng() * w
          const fy = h * 0.5 + rng() * h * 0.4
          const fColors = [0xff69b4, 0xff4444, 0xffd700, 0xff88cc, 0xffffff, 0xff6b35]
          const fc = fColors[Math.floor(rng() * fColors.length)]
          rect(fx, fy - 6, 1, 6, 0x2d8b2d, 0.6)
          circ(fx, fy - 8, 2 + rng() * 2, fc, 0.7)
        }
        // Path
        for (let i = 0; i < 10; i++) {
          const px = w * 0.4 + Math.sin(i * 0.5) * 10
          const py = h * 0.55 + i * h * 0.04
          rect(px - 8, py, 16, 6, 0xd4a574, 0.3)
        }
        // Butterfly particles
        makeParticles(12, [0xff69b4, 0xffd700, 0xa78bfa, 0xffffff], [-0.3, 0.1], [-0.3, 0.3], [1.5, 3], [0.3, 0.6])
        break
      }
      case 'void': {
        gradRect(0, 0, w, h, [
          { pos: 0, color: 0x1a0000 },
          { pos: 0.5, color: 0x330000 },
          { pos: 1, color: 0x1a0000 },
        ])
        // Faint red glow center
        circ(w * 0.5, h * 0.5, 80, 0x660000, 0.05)
        circ(w * 0.5, h * 0.5, 40, 0x880000, 0.08)
        // Sparse embers
        makeParticles(8, [0xff2200, 0xff4400, 0x882200], [-0.2, 0.2], [-0.2, 0.2], [1, 2], [0.1, 0.3])
        break
      }
      case 'dark':
      default: {
        gradRect(0, 0, w, h, [
          { pos: 0, color: 0x000000 },
          { pos: 0.5, color: 0x0a0a0a },
          { pos: 1, color: 0x000000 },
        ])
        // Faint stars
        for (let i = 0; i < 10; i++) {
          circ(rng() * w, rng() * h, 0.5 + rng(), 0xffffff, 0.1 + rng() * 0.2)
        }
        makeParticles(5, [0xa78bfa, 0xffffff], [-0.1, 0.1], [-0.1, 0.1], [0.5, 1.5], [0.05, 0.15])
        break
      }
    }

    // Add vignette overlay (dark edges)
    const vigG = new PIXI.Graphics()
    // Top edge
    vigG.rect(0, 0, w, h * 0.15)
    vigG.fill({ color: 0x000000, alpha: 0.3 })
    // Bottom edge
    vigG.rect(0, h * 0.85, w, h * 0.15)
    vigG.fill({ color: 0x000000, alpha: 0.3 })
    bgContainer.addChild(vigG)
  }, [])

  const drawCharacters = useCallback((PIXI: any, charContainer: any, chars: string[], w: number, h: number) => {
    charContainer.removeChildren()

    if (chars.length === 0) return

    const gap = 20
    const totalWidth = chars.reduce((sum, name) => sum + (CHAR_CONFIGS[name]?.w || 80), 0) + (chars.length - 1) * gap
    let startX = (w - totalWidth) / 2

    chars.forEach((name, idx) => {
      const cfg = CHAR_CONFIGS[name]
      if (!cfg) return

      const spriteContainer = new PIXI.Container()
      const cw = cfg.w
      const ch = cfg.h

      const g = new PIXI.Graphics()

      // Scale factor for bigger characters
      const s = 1.4

      // Shadow under character
      const shadowG = new PIXI.Graphics()
      shadowG.ellipse(0, ch * s + 5, cw * s * 0.4, 6)
      shadowG.fill({ color: 0x000000, alpha: 0.3 })
      spriteContainer.addChild(shadowG)

      // Body
      const bodyW = cfg.features === 'muscular' ? cw * 0.55 : cw * 0.45
      const bodyH = ch * 0.4
      g.rect(-bodyW * s / 2, ch * 0.4 * s, bodyW * s, bodyH * s)
      g.fill({ color: cfg.body })

      // Body accent/border
      g.rect(-bodyW * s / 2, ch * 0.4 * s, bodyW * s, 2)
      g.fill({ color: cfg.accent, alpha: 0.6 })

      // Chest detail
      g.rect(-6 * s, ch * 0.44 * s, 12 * s, 10 * s)
      g.fill({ color: cfg.accent, alpha: 0.3 })

      // Armor overlay
      if (cfg.features === 'armor') {
        g.rect(-bodyW * s / 2 - 2, ch * 0.4 * s, bodyW * s + 4, bodyH * s * 0.5)
        g.fill({ color: 0x555555, alpha: 0.6 })
      }

      // Head (skin)
      const headW = cw * 0.5
      const headH = ch * 0.2
      const headY = cfg.features === 'hat' ? ch * 0.15 : ch * 0.12
      g.rect(-headW * s / 2, headY * s, headW * s, headH * s)
      g.fill({ color: cfg.skin })

      // Hair
      const hairY = cfg.features === 'hat' ? ch * 0.05 : ch * 0.06
      const hairH = ch * 0.12
      g.rect((-headW * s / 2) - 1, hairY * s, headW * s + 2, hairH * s)
      g.fill({ color: cfg.hair })

      // Eyes
      const eyeY = headY * s + headH * s * 0.35
      g.rect(-8 * s, eyeY, 6 * s, 5 * s)
      g.fill({ color: cfg.eyes })
      g.rect(4 * s, eyeY, 6 * s, 5 * s)
      g.fill({ color: cfg.eyes })

      // Eye pupils
      g.rect(-6 * s, eyeY + 1, 3 * s, 3 * s)
      g.fill({ color: 0x111111 })
      g.rect(6 * s, eyeY + 1, 3 * s, 3 * s)
      g.fill({ color: 0x111111 })

      // Mouth
      g.rect(-4 * s, headY * s + headH * s * 0.7, 8 * s, 2 * s)
      g.fill({ color: 0xd4a07a })

      // Hat (Jotaro)
      if (cfg.features === 'hat') {
        g.rect(-headW * s / 2 - 3, 0, headW * s + 6, ch * 0.08 * s)
        g.fill({ color: cfg.hair })
        g.rect(-headW * s / 2 - 3, ch * 0.07 * s, headW * s + 6, 2)
        g.fill({ color: cfg.accent })
      }

      // Mustache (Arsen)
      if (cfg.features === 'mustache') {
        g.rect(-10 * s, headY * s + headH * s * 0.6, 20 * s, 4 * s)
        g.fill({ color: 0x5a3a1a })
      }

      // Crown (Siren3)
      if (cfg.features === 'crown') {
        g.rect(-12 * s, -6 * s, 24 * s, 10 * s)
        g.fill({ color: cfg.accent })
        // Crown points
        for (let i = 0; i < 5; i++) {
          g.rect((-12 + i * 6) * s, -12 * s + (i % 2) * 4 * s, 4 * s, 8 * s)
          g.fill({ color: cfg.accent })
        }
      }

      // Aura/Glow
      if (cfg.features === 'aura' || cfg.features === 'glow') {
        const auraG = new PIXI.Graphics()
        auraG.ellipse(0, ch * 0.4 * s, cw * s * 0.7, ch * s * 0.55)
        auraG.fill({ color: cfg.accent, alpha: 0.06 })
        spriteContainer.addChildAt(auraG, 0)
      }

      // Star Platinum ghost (Jotaro)
      if (name === 'jotaro') {
        const ghostG = new PIXI.Graphics()
        ghostG.ellipse(-15, ch * 0.3 * s, cw * s * 0.6, ch * s * 0.5)
        ghostG.fill({ color: 0x4a90d9, alpha: 0.08 })
        spriteContainer.addChildAt(ghostG, 0)
      }

      spriteContainer.addChild(g)

      // Name label
      // Using simple text - not available without PIXI.Text, so skip for now
      // Characters are identified by their visual design

      // Position
      spriteContainer.x = startX + cw / 2
      spriteContainer.y = h * 0.25

      // Idle bobbing animation
      const baseY = spriteContainer.y
      let elapsed = idx * 50
      const ticker = (t: any) => {
        elapsed += t.deltaTime
        spriteContainer.y = baseY + Math.sin(elapsed * 0.03) * 4
      }
      // We'll add ticker later in the main ticker

      // Enter animation (fade in + slide up)
      spriteContainer.alpha = 0
      spriteContainer.y += 30
      let enterProgress = 0
      const enterAnim = (t: any) => {
        enterProgress += t.deltaTime * 0.05
        if (enterProgress >= 1) {
          spriteContainer.alpha = 1
          spriteContainer.y = baseY
          // Remove enter anim, add idle
          // This is handled in main ticker
        } else {
          spriteContainer.alpha = enterProgress
          spriteContainer.y = baseY + 30 * (1 - enterProgress)
        }
      }

      // Store animation info
      ;(spriteContainer as any)._animData = { baseY, elapsed: idx * 50, entering: true, enterProgress: 0 }

      charContainer.addChild(spriteContainer)
      startX += cw + gap
    })
  }, [])

  // Main init and update effect
  useEffect(() => {
    if (!containerRef.current) return
    let destroyed = false
    let app: any = null

    const init = async () => {
      const PIXI = await import('pixi.js')
      if (destroyed) return

      PIXIRef.current = PIXI

      app = new PIXI.Application()
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        background: 0x000000,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true,
        antialias: false,
      })

      if (destroyed) {
        app.destroy(true)
        return
      }

      appRef.current = app

      // Remove canvas class that pixi adds
      const canvas = app.canvas as HTMLCanvasElement
      canvas.style.position = 'absolute'
      canvas.style.inset = '0'
      canvas.style.width = '100%'
      canvas.style.height = '100%'

      containerRef.current!.appendChild(canvas)

      // Create containers
      const bgContainer = new PIXI.Container()
      const particleContainer = new PIXI.Container()
      const charContainer = new PIXI.Container()

      bgContainerRef.current = bgContainer
      particleContainerRef.current = particleContainer
      charContainerRef.current = charContainer

      app.stage.addChild(bgContainer)
      app.stage.addChild(particleContainer)
      app.stage.addChild(charContainer)

      // Initial render
      const theme = detectTheme(background)
      const w = app.screen.width
      const h = app.screen.height
      drawBackground(PIXI, bgContainer, particleContainer, w, h, theme)
      drawCharacters(PIXI, charContainer, characters, w, h)

      // Main animation ticker
      const tickerFn = (ticker: any) => {
        // Animate particles
        particlesRef.current.forEach(p => {
          p.life += ticker.deltaTime
          p.g.x += p.vx * ticker.deltaTime
          p.g.y += p.vy * ticker.deltaTime

          // Fade in/out
          const lifeRatio = p.life / p.maxLife
          if (lifeRatio < 0.1) {
            p.g.alpha = p.baseAlpha * (lifeRatio / 0.1)
          } else if (lifeRatio > 0.8) {
            p.g.alpha = p.baseAlpha * (1 - (lifeRatio - 0.8) / 0.2)
          } else {
            p.g.alpha = p.baseAlpha
          }

          // Reset when life expires
          if (p.life >= p.maxLife) {
            p.life = 0
            p.g.x = Math.random() * w
            p.g.y = Math.random() * h
          }

          // Wrap around screen
          if (p.g.x < -10) p.g.x = w + 10
          if (p.g.x > w + 10) p.g.x = -10
          if (p.g.y < -10) p.g.y = h + 10
          if (p.g.y > h + 10) p.g.y = -10
        })

        // Animate characters
        charContainer.children.forEach((sprite: any) => {
          const data = sprite._animData
          if (!data) return

          if (data.entering) {
            data.enterProgress += ticker.deltaTime * 0.04
            if (data.enterProgress >= 1) {
              data.entering = false
              sprite.alpha = 1
            } else {
              sprite.alpha = data.enterProgress
              sprite.y = data.baseY + 30 * (1 - data.enterProgress)
            }
          } else {
            // Idle bob
            data.elapsed += ticker.deltaTime
            sprite.y = data.baseY + Math.sin(data.elapsed * 0.03) * 4
          }
        })
      }

      tickerFnRef.current = tickerFn
      app.ticker.add(tickerFn)

      // Handle resize
      const handleResize = () => {
        if (!app || destroyed) return
        const newW = window.innerWidth
        const newH = window.innerHeight
        app.renderer.resize(newW, newH)
        // Re-render background
        const theme = detectTheme(background)
        drawBackground(PIXI, bgContainer, particleContainer, newW, newH, theme)
        drawCharacters(PIXI, charContainer, characters, newW, newH)
      }
      window.addEventListener('resize', handleResize)
      ;(app as any)._resizeHandler = handleResize
    }

    init()

    return () => {
      destroyed = true
      if (app) {
        if ((app as any)._resizeHandler) {
          window.removeEventListener('resize', (app as any)._resizeHandler)
        }
        if (tickerFnRef.current) {
          app.ticker.remove(tickerFnRef.current)
        }
        app.destroy(true, { children: true })
        appRef.current = null
      }
    }
  }, []) // Only init once

  // Update when background or characters change
  useEffect(() => {
    const app = appRef.current
    const PIXI = PIXIRef.current
    if (!app || !PIXI) return

    const theme = detectTheme(background)
    const w = app.screen.width
    const h = app.screen.height

    if (bgContainerRef.current && particleContainerRef.current) {
      drawBackground(PIXI, bgContainerRef.current, particleContainerRef.current, w, h, theme)
    }
    if (charContainerRef.current) {
      drawCharacters(PIXI, charContainerRef.current, characters, w, h)
    }
  }, [background, characters, drawBackground, drawCharacters])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
      }}
    />
  )
}
