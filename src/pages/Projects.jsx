import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ExternalLink, Github } from 'lucide-react'

const PROJECTS = [
    {
        title: 'Project Alpha',
        description: 'A short description of the project and what it does.',
        tags: ['React', 'TypeScript', 'GSAP'],
        link: '#',
        github: '#',
    },
    {
        title: 'Project Beta',
        description: 'Another project with a compelling one-liner.',
        tags: ['Python', 'FastAPI', 'PostgreSQL'],
        link: '#',
        github: '#',
    },
    {
        title: 'Project Gamma',
        description: 'Something creative and different.',
        tags: ['Swift', 'iOS', 'CoreML'],
        link: '#',
        github: '#',
    },
    {
        title: 'Project Delta',
        description: 'An older but still interesting project.',
        tags: ['Node.js', 'Express', 'MongoDB'],
        link: '#',
        github: '#',
    },
]

export default function Projects() {
    const containerRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('[data-project-header]', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.2,
            })

            gsap.from('[data-project-card]', {
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
            <div className="max-w-4xl">
                <h1
                    data-project-header
                    className="font-display font-bold text-4xl md:text-6xl text-ivory tracking-wide mb-2"
                >
                    Projects
                </h1>
                <p data-project-header className="text-ghost/40 text-lg mb-12 font-serif italic font-light">
                    Things I've built and shipped.
                </p>

                <div className="space-y-4">
                    {PROJECTS.map((project, i) => (
                        <div
                            key={i}
                            data-project-card
                            className="group card-surface rounded-3xl p-6 md:p-8 hover:border-accent/20 transition-all duration-500"
                        >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex-1">
                                    <h2 className="font-display font-semibold text-xl text-ivory group-hover:text-accent-glow transition-colors duration-300 mb-2 tracking-wide">
                                        {project.title}
                                    </h2>
                                    <p className="text-ghost/40 text-sm leading-relaxed mb-3 font-body">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 rounded-full text-xs font-mono text-accent/60 bg-accent/5 border border-accent/8"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 rounded-xl border border-ghost/10 text-ghost/30 hover:text-accent hover:border-accent/30 transition-all duration-300 hover:-translate-y-0.5"
                                    >
                                        <Github size={18} />
                                    </a>
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 rounded-xl border border-ghost/10 text-ghost/30 hover:text-accent hover:border-accent/30 transition-all duration-300 hover:-translate-y-0.5"
                                    >
                                        <ExternalLink size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
