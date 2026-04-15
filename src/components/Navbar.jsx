import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
    { label: 'Home', path: '/' },
    { label: 'Projects', path: '/projects' },
    { label: 'Readings', path: '/readings' },
    { label: 'Socials', path: '/socials' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 80)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-2 py-2 rounded-full transition-all duration-500 ease-out flex items-center gap-1 ${scrolled
                ? 'bg-deep/70 backdrop-blur-xl border border-accent/10 shadow-lg shadow-accent/5'
                : 'bg-transparent border border-transparent'
                }`}
        >
            <Link
                to="/"
                className="px-4 py-1.5 font-display font-bold text-sm tracking-widest text-ivory hover:text-accent transition-colors duration-300"
            >
                ✦
            </Link>

            <div className="flex items-center gap-0.5">
                {NAV_LINKS.map((link) => {
                    const isActive = location.pathname === link.path
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`relative px-4 py-1.5 text-sm font-body rounded-full transition-all duration-300 ${isActive
                                ? 'text-accent bg-accent/10'
                                : 'text-ghost/60 hover:text-ivory hover:bg-ivory/5'
                                }`}
                        >
                            {link.label}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
