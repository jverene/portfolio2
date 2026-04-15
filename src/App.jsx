import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ConstellationCanvas from './components/ConstellationCanvas'
import Navbar from './components/Navbar'
import GlitchIntro from './components/GlitchIntro'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Readings from './pages/Readings'
import Socials from './pages/Socials'

export default function App() {
    const { pathname } = useLocation()
    const [introComplete, setIntroComplete] = useState(false)

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return (
        <div className="relative min-h-screen bg-void text-ivory">
            {!introComplete && <GlitchIntro onComplete={() => setIntroComplete(true)} />}
            <ConstellationCanvas />
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Home introComplete={introComplete} />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/readings" element={<Readings />} />
                    <Route path="/socials" element={<Socials />} />
                </Routes>
            </main>
        </div>
    )
}
