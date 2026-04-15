import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ArrowRight, ExternalLink, Github } from 'lucide-react'

const FEATURED_PROJECT = {
    title: 'Project Name',
    description: 'A brief description of your most recent and impressive project. Replace this with your own content.',
    tags: ['React', 'Node.js', 'Design'],
    link: '#',
    github: '#',
}

export default function Home({ introComplete }) {
    const heroRef = useRef(null)
    const featuredRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero text animation
            gsap.from('[data-hero-anim]', {
                y: 50,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power3.out',
                delay: introComplete ? 0.2 : 2.2,
            })

            // Featured project card
            gsap.from(featuredRef.current, {
                y: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                delay: introComplete ? 0.5 : 2.8,
            })
        }, heroRef)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={heroRef} className="relative z-10">
            {/* Hero Section */}
            <section className="min-h-[100dvh] flex flex-col justify-end pb-24 px-6 md:px-16 lg:px-24">
                <div className="max-w-4xl">
                    <p
                        data-hero-anim
                        className="font-mono text-xs text-accent/50 mb-6 tracking-[0.3em] uppercase"
                    >
                        ✦ Welcome
                    </p>
                    <h1 data-hero-anim className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-wide text-ivory mb-4">
                        I'm{''}
                        <span className="text-gradient"> Harry Jiang</span>
                    </h1>
                    <p
                        data-hero-anim
                        className="font-serif italic text-2xl md:text-4xl text-ghost/50 mt-3 mb-10 font-light"
                    >
                        always finding a way.
                    </p>
                    <div data-hero-anim className="flex gap-3">
                        <Link
                            to="/projects"
                            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-void font-semibold text-sm hover:scale-[1.03] transition-transform duration-300"
                            style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                        >
                            View Projects
                            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <Link
                            to="/socials"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-ghost/15 text-ghost/80 font-medium text-sm hover:border-accent/30 hover:text-ivory hover:scale-[1.03] transition-all duration-300"
                            style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                        >
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Project */}
            <section className="px-6 md:px-16 lg:px-24 pb-32">
                <p className="font-mono text-xs text-accent/50 tracking-widest uppercase mb-6">
                    Featured Project
                </p>
                <div
                    ref={featuredRef}
                    className="card-surface rounded-4xl p-8 md:p-12 group hover:border-accent/20 transition-all duration-500 cursor-pointer"
                >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="flex-1">
                            <h2 className="font-display font-semibold text-2xl md:text-3xl text-ivory mb-3 group-hover:text-accent-glow transition-colors duration-300 tracking-wide">
                                {FEATURED_PROJECT.title}
                            </h2>
                            <p className="text-ghost/50 text-base leading-relaxed max-w-xl mb-4 font-body">
                                {FEATURED_PROJECT.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {FEATURED_PROJECT.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 rounded-full text-xs font-mono text-accent/70 bg-accent/5 border border-accent/10"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <a
                                href={FEATURED_PROJECT.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-2xl border border-ghost/10 text-ghost/40 hover:text-accent hover:border-accent/30 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                <Github size={20} />
                            </a>
                            <a
                                href={FEATURED_PROJECT.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-2xl border border-ghost/10 text-ghost/40 hover:text-accent hover:border-accent/30 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                <ExternalLink size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            label: 'All Projects', path: '/projects', desc: "Everything I've built"
                        },
                        { label: 'Readings', path: '/readings', desc: 'Books & articles I recommend' },
                        { label: 'Socials', path: '/socials', desc: 'Find me online' },
                    ].map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="group card-surface rounded-3xl p-6 hover:border-accent/20 transition-all duration-500"
                        >
                            <h3 className="font-display font-semibold text-ivory text-lg group-hover:text-accent-glow transition-colors duration-300 mb-1 tracking-wide">
                                {item.label}
                            </h3>
                            <p className="text-ghost/40 text-sm font-body">{item.desc}</p>
                            <ArrowRight
                                size={16}
                                className="mt-3 text-ghost/20 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300"
                            />
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}
