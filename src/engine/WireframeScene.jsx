import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import Name3D from './Name3D'

export default function WireframeScene() {
    const mountRef = useRef(null)
    const sceneRef = useRef(null)
    const rendererRef = useRef(null)
    const cameraRef = useRef(null)
    const animationRef = useRef(null)
    const materialRef = useRef(null)

    const setup = useCallback(() => {
        if (!mountRef.current) return

        const container = mountRef.current

        // ─── Scene (white background, white fog) ───────────
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xffffff)
        scene.fog = new THREE.Fog(0xffffff, 25, 45)
        sceneRef.current = scene

        // ─── Camera ────────────────────────────────────────
        const camera = new THREE.PerspectiveCamera(
            50,
            container.clientWidth / container.clientHeight,
            0.1,
            100
        )
        camera.position.set(0, 0, 32)
        cameraRef.current = camera

        // ─── Renderer (no tone mapping, raw and stark) ─────
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.setClearColor(0xffffff, 1)
        container.appendChild(renderer.domElement)
        rendererRef.current = renderer

        // ─── Shared wireframe material (black on white) ────
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true,
        })
        materialRef.current = material

        // ─── Lighting (minimal — stark, no bloom feel) ────
        const ambient = new THREE.AmbientLight(0xffffff, 1)
        scene.add(ambient)

        // ─── Resize ────────────────────────────────────────
        const handleResize = () => {
            const w = container.clientWidth
            const h = container.clientHeight
            camera.aspect = w / h
            camera.updateProjectionMatrix()
            renderer.setSize(w, h)
        }
        window.addEventListener('resize', handleResize)

        // ─── Build name ────────────────────────────────────
        const nameGroup = Name3D.build(material)
        scene.add(nameGroup)

        // ─── Render loop ───────────────────────────────────
        const animate = () => {
            animationRef.current = requestAnimationFrame(animate)
            renderer.render(scene, camera)
        }
        animate()

        // ─── Cleanup ───────────────────────────────────────
        return () => {
            cancelAnimationFrame(animationRef.current)
            window.removeEventListener('resize', handleResize)
            container.removeChild(renderer.domElement)
            renderer.dispose()
        }
    }, [])

    useEffect(() => {
        const cleanup = setup()
        return cleanup
    }, [setup])

    return (
        <div
            ref={mountRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
            }}
        />
    )
}
