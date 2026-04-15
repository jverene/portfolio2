import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { BookOpen, ExternalLink } from 'lucide-react'

const READINGS = [
    {
        title: 'Book or Article Title',
        author: 'Author Name',
        type: 'Book',
        link: '#',
        note: 'A short note about why you liked it or what you learned.',
    },
    {
        title: 'Another Great Read',
        author: 'Another Author',
        type: 'Article',
        link: '#',
        note: 'A quick takeaway or recommendation.',
    },
    {
        title: 'Design Patterns',
        author: 'Gang of Four',
        type: 'Book',
        link: '#',
        note: 'Foundational software engineering.',
    },
]

export default function Readings() {
    const containerRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('[data-reading-header]', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.2,
            })
            gsap.from('[data-reading-item]', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: 'power3.out',
                delay: 0.4,
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={containerRef} className="relative z-10 min-h-screen pt-32 pb-24 px-6 md:px-16 lg:px-24">
            <div className="max-w-3xl">
                <h1
                    data-reading-header
                    className="font-display font-bold text-4xl md:text-6xl text-ivory tracking-wide mb-2"
                >
                    Readings
                </h1>
                <p data-reading-header className="text-ghost/40 text-lg mb-12 font-serif italic font-light">
                    Books and articles that shaped my thinking.
                </p>

                <div className="space-y-3">
                    {READINGS.map((item, i) => (
                        <a
                            key={i}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-reading-item
                            className="group card-surface rounded-2xl p-5 md:p-6 hover:border-accent/20 transition-all duration-500 flex items-start gap-4 cursor-pointer"
                        >
                            <div className="p-2.5 rounded-xl bg-accent/5 border border-accent/10 text-accent/50 group-hover:text-accent transition-colors duration-300 shrink-0 mt-0.5">
                                <BookOpen size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-display font-semibold text-ivory group-hover:text-accent-glow transition-colors duration-300 text-base">
                                            {item.title}
                                        </h3>
                                        <p className="text-ghost/30 text-sm mt-0.5">
                                            {item.author}
                                            <span className="mx-2 text-ghost/15">·</span>
                                            <span className="font-mono text-xs text-accent/40">{item.type}</span>
                                        </p>
                                    </div>
                                    <ExternalLink
                                        size={14}
                                        className="text-ghost/15 group-hover:text-accent/50 transition-colors duration-300 shrink-0 mt-1"
                                    />
                                </div>
                                {item.note && (
                                    <p className="text-ghost/30 text-sm mt-2 leading-relaxed">
                                        {item.note}
                                    </p>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}
