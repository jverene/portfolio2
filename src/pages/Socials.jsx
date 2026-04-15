import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react'

const SOCIAL_LINKS = [
    {
        label: 'GitHub',
        url: 'https://github.com',
        icon: Github,
        handle: '@yourhandle',
        color: '#c8c2f0',
    },
    {
        label: 'Twitter / X',
        url: 'https://twitter.com',
        icon: Twitter,
        handle: '@yourhandle',
        color: '#7B61FF',
    },
    {
        label: 'LinkedIn',
        url: 'https://linkedin.com',
        icon: Linkedin,
        handle: 'Your Name',
        color: '#9d85ff',
    },
    {
        label: 'Email',
        url: 'mailto:you@example.com',
        icon: Mail,
        handle: 'you@example.com',
        color: '#c8c2f0',
    },
]

function MagneticButton({ children, className, href }) {
    const ref = useRef(null)
    const [offset, setOffset] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (e.clientX - cx) * 0.15
        const dy = (e.clientY - cy) * 0.15
        setOffset({ x: dx, y: dy })
    }

    const handleMouseLeave = () => {
        setOffset({ x: 0, y: 0 })
    }

    return (
        <a
            ref={ref}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `translate(${offset.x}px, ${offset.y}px)`,
                transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
        >
            {children}
        </a>
    )
}

export default function Socials() {
    const containerRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('[data-social-header]', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.2,
            })
            gsap.from('[data-social-card]', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.4,
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={containerRef} className="relative z-10 min-h-screen pt-32 pb-24 px-6 md:px-16 lg:px-24">
            <div className="max-w-2xl">
                <h1
                    data-social-header
                    className="font-display font-bold text-4xl md:text-6xl text-ivory tracking-wide mb-2"
                >
                    Socials
                </h1>
                <p data-social-header className="text-ghost/40 text-lg mb-12 font-serif italic font-light">
                    Let's connect.
                </p>

                <div className="space-y-4">
                    {SOCIAL_LINKS.map((item, i) => {
                        const Icon = item.icon
                        return (
                            <MagneticButton
                                key={i}
                                href={item.url}
                                className="group card-surface rounded-3xl p-6 md:p-8 hover:border-accent/20 transition-all duration-500 flex items-center gap-5 cursor-pointer w-full block"
                            >
                                <div
                                    className="p-3 rounded-2xl border border-ghost/10 group-hover:border-accent/20 transition-all duration-300"
                                    style={{ color: item.color }}
                                >
                                    <Icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-display font-semibold text-ivory text-lg group-hover:text-accent-glow transition-colors duration-300">
                                        {item.label}
                                    </h3>
                                    <p className="text-ghost/30 text-sm font-mono">{item.handle}</p>
                                </div>
                                <ArrowUpRight
                                    size={20}
                                    className="text-ghost/15 group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300"
                                    data-social-card
                                />
                            </MagneticButton>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
