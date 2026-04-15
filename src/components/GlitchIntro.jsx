import { useEffect, useRef, useState, useCallback } from 'react'

const TILE_SIZE = 120
const FLIP_DURATION = 2400 // total time before component unmounts
const FLASH_PHASE = 800   // how long color-flashing lasts before flips begin
const FLIP_STAGGER = 1200 // window over which all flips complete

export default function GlitchIntro({ onComplete }) {
    const [active, setActive] = useState(true)
    const [grid, setGrid] = useState({ cols: 1, rows: 1, total: 1 })
    const tilesRef = useRef([])

    // Compute grid on mount
    useEffect(() => {
        const cols = Math.ceil(window.innerWidth / TILE_SIZE)
        const rows = Math.ceil(window.innerHeight / TILE_SIZE)
        setGrid({ cols, rows, total: cols * rows })
    }, [])

    const onCompleteRef = useRef(onComplete)
    onCompleteRef.current = onComplete

    useEffect(() => {
        if (!active || grid.total <= 1) return

        const tiles = tilesRef.current
        const total = grid.total

        const glitchColors = [
            '#7B61FF', '#9d85ff', '#c8c2f0',
            '#111128', '#1a1a3e', '#2a1a5e',
            '#4a3a8e', '#0a0a18',
        ]

        // Phase 1: Rapid color flashes on random tiles
        let flashCount = 0
        const flashInterval = setInterval(() => {
            if (flashCount > FLASH_PHASE / 30) {
                clearInterval(flashInterval)
                return
            }
            const count = Math.floor(Math.random() * 5) + 2
            for (let i = 0; i < count; i++) {
                const idx = Math.floor(Math.random() * total)
                const front = tiles[idx]?.querySelector('.tile-front')
                if (front) {
                    front.style.backgroundColor = glitchColors[Math.floor(Math.random() * glitchColors.length)]
                }
            }
            flashCount++
        }, 30)

        // Phase 2: Randomly flip tiles to reveal page
        const flipStart = setTimeout(() => {
            // Create a shuffled index array for random order
            const indices = Array.from({ length: total }, (_, i) => i)
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                    ;[indices[i], indices[j]] = [indices[j], indices[i]]
            }

            indices.forEach((idx, order) => {
                const delay = (order / total) * FLIP_STAGGER + Math.random() * 80
                setTimeout(() => {
                    const tile = tiles[idx]
                    if (tile) {
                        tile.classList.add('flipped')
                    }
                }, delay)
            })
        }, FLASH_PHASE)

        // Phase 3: Unmount
        const removeTimeout = setTimeout(() => {
            setActive(false)
            if (onCompleteRef.current) onCompleteRef.current()
        }, FLIP_DURATION)

        return () => {
            clearInterval(flashInterval)
            clearTimeout(flipStart)
            clearTimeout(removeTimeout)
        }
    }, [active, grid])

    if (!active || grid.total <= 1) return null

    return (
        <>
            <style>{`
        .mosaic-tile {
          perspective: 600px;
        }
        .tile-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.7s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.7s ease;
          transform-style: preserve-3d;
        }
        .mosaic-tile.flipped .tile-inner {
          transform: rotateX(180deg);
          opacity: 0;
        }
        .tile-front {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          background-color: #06060e;
        }
      `}</style>
            <div
                className="fixed inset-0 z-[100]"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
                    gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
                    gap: '0px',
                    pointerEvents: 'none',
                }}
            >
                {Array.from({ length: grid.total }).map((_, i) => (
                    <div
                        key={i}
                        ref={(el) => (tilesRef.current[i] = el)}
                        className="mosaic-tile"
                    >
                        <div className="tile-inner">
                            <div className="tile-front" />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
