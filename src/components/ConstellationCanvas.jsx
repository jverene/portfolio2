import { useEffect, useRef } from 'react'

const STAR_COUNT = 220
const CONNECTION_DISTANCE = 180
const MOUSE_RADIUS = 280
const ATTRACTION_STRENGTH = 1.2
const HOME_DRIFT = 0.008 // How fast stars return home

export default function ConstellationCanvas() {
    const canvasRef = useRef(null)
    const starsRef = useRef([])
    const mouseRef = useRef({ x: -1000, y: -1000 })
    const animFrameRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            // Re-scatter home positions on resize
            starsRef.current.forEach((s) => {
                s.homeX = Math.random() * canvas.width
                s.homeY = Math.random() * canvas.height
                s.x = s.homeX
                s.y = s.homeY
            })
        }
        resize()
        window.addEventListener('resize', resize)

        // Initialize stars with home positions
        starsRef.current = Array.from({ length: STAR_COUNT }, () => {
            const hx = Math.random() * canvas.width
            const hy = Math.random() * canvas.height
            return {
                x: hx,
                y: hy,
                homeX: hx,
                homeY: hy,
                vx: 0,
                vy: 0,
                radius: Math.random() * 1.8 + 0.3,
                baseAlpha: Math.random() * 0.6 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
            }
        })

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }
        }
        window.addEventListener('mousemove', handleMouseMove)

        let time = 0
        const animate = () => {
            time += 1
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const stars = starsRef.current
            const mouse = mouseRef.current

            for (let i = 0; i < stars.length; i++) {
                const s = stars[i]

                // Mouse attraction
                const dxM = mouse.x - s.x
                const dyM = mouse.y - s.y
                const distM = Math.sqrt(dxM * dxM + dyM * dyM)
                const inRange = distM < MOUSE_RADIUS && distM > 5

                if (inRange) {
                    const force = ((MOUSE_RADIUS - distM) / MOUSE_RADIUS) * ATTRACTION_STRENGTH
                    s.vx += (dxM / distM) * force * 0.02
                    s.vy += (dyM / distM) * force * 0.02
                } else {
                    // Drift back home
                    const dxH = s.homeX - s.x
                    const dyH = s.homeY - s.y
                    s.vx += dxH * HOME_DRIFT
                    s.vy += dyH * HOME_DRIFT
                }

                // Damping
                s.vx *= 0.94
                s.vy *= 0.94

                // Clamp velocity
                const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy)
                if (speed > 1.5) {
                    s.vx = (s.vx / speed) * 1.5
                    s.vy = (s.vy / speed) * 1.5
                }

                s.x += s.vx
                s.y += s.vy

                // Twinkle
                const alpha = s.baseAlpha + Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.25

                // Star glow
                const glowSize = s.radius * 3
                const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowSize)
                gradient.addColorStop(0, `rgba(200, 194, 240, ${alpha})`)
                gradient.addColorStop(0.4, `rgba(123, 97, 255, ${alpha * 0.3})`)
                gradient.addColorStop(1, `rgba(123, 97, 255, 0)`)
                ctx.beginPath()
                ctx.arc(s.x, s.y, glowSize, 0, Math.PI * 2)
                ctx.fillStyle = gradient
                ctx.fill()

                // Star core
                ctx.beginPath()
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(238, 234, 246, ${alpha})`
                ctx.fill()
            }

            // Connections between nearby stars
            for (let i = 0; i < stars.length; i++) {
                for (let j = i + 1; j < stars.length; j++) {
                    const dx = stars[i].x - stars[j].x
                    const dy = stars[i].y - stars[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < CONNECTION_DISTANCE) {
                        const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.25
                        ctx.beginPath()
                        ctx.moveTo(stars[i].x, stars[i].y)
                        ctx.lineTo(stars[j].x, stars[j].y)
                        ctx.strokeStyle = `rgba(123, 97, 255, ${alpha})`
                        ctx.lineWidth = 0.8
                        ctx.stroke()
                    }
                }
            }

            // Cursor constellation lines
            for (let i = 0; i < stars.length; i++) {
                const dx = stars[i].x - mouse.x
                const dy = stars[i].y - mouse.y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < MOUSE_RADIUS) {
                    const alpha = (1 - dist / MOUSE_RADIUS) * 0.35
                    ctx.beginPath()
                    ctx.moveTo(stars[i].x, stars[i].y)
                    ctx.lineTo(mouse.x, mouse.y)
                    ctx.strokeStyle = `rgba(157, 133, 255, ${alpha})`
                    ctx.lineWidth = 0.6 + (1 - dist / MOUSE_RADIUS) * 0.6
                    ctx.stroke()
                }
            }

            // Cursor glow dot
            if (mouse.x > 0 && mouse.y > 0) {
                const cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 8)
                cursorGlow.addColorStop(0, 'rgba(157, 133, 255, 0.4)')
                cursorGlow.addColorStop(1, 'rgba(123, 97, 255, 0)')
                ctx.beginPath()
                ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2)
                ctx.fillStyle = cursorGlow
                ctx.fill()
            }

            animFrameRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animFrameRef.current)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ background: 'transparent' }}
        />
    )
}
