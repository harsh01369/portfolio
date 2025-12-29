import React from 'react';
import { motion } from 'framer-motion';
import { experience, education } from '../data/experience';
import { fadeInLeft, fadeInRight, viewportConfig } from '../utils/scrollAnimations';

function Experience() {
    const allItems = [
        ...education.map(item => ({ ...item, type: 'education' })),
        ...experience.map(item => ({ ...item, type: 'experience' }))
    ].sort((a, b) => {
        // Education FIRST, then work experience (current jobs first, then past)
        if (a.type === 'education' && b.type !== 'education') return -1;
        if (a.type !== 'education' && b.type === 'education') return 1;

        // Among work experiences, current jobs come first
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;
        return 0;
    });

    return (
        <section className="min-h-screen bg-gradient-bg py-20">
            <div className="container-custom max-w-5xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
                        Experience & Education
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
                        My professional journey and academic background
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-400 via-secondary-400 to-primary-400"></div>

                    {allItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportConfig}
                            className={`relative mb-12 md:mb-16 ${
                                index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:ml-auto'
                            } md:w-1/2 w-full pl-20 md:pl-0`}
                        >
                            {/* Timeline dot */}
                            <div className={`absolute left-6 md:left-auto ${
                                index % 2 === 0 ? 'md:right-[-1.5rem]' : 'md:left-[-1.5rem]'
                            } top-6 w-12 h-12 rounded-full bg-white border-4 flex items-center justify-center shadow-lg z-10 ${
                                item.type === 'education' ? 'border-accent-500' : 'border-primary-500'
                            }`}>
                                <span className="text-2xl">
                                    {item.type === 'education' ? '🎓' : item.current ? '💼' : '📋'}
                                </span>
                            </div>

                            {/* Content Card */}
                            <div className={`card p-6 hover:shadow-hard transition-all duration-300 ${
                                index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                            }`}>
                                {/* Period Badge */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`badge text-xs ${
                                        item.current ? 'badge-accent' : 'badge-primary'
                                    }`}>
                                        {item.period}
                                    </span>
                                    {item.current && (
                                        <span className="badge-secondary text-xs animate-pulse">
                                            Current
                                        </span>
                                    )}
                                    <span className={`badge text-xs ${
                                        item.type === 'education' ? 'bg-accent-100 text-accent-700' : 'bg-primary-100 text-primary-700'
                                    }`}>
                                        {item.type === 'education' ? 'Education' : item.type || 'Experience'}
                                    </span>
                                </div>

                                {/* Title & Company/Institution */}
                                <h3 className="text-2xl font-bold text-primary-700 mb-2">
                                    {item.title || item.degree}
                                </h3>
                                <p className="text-lg text-neutral-700 font-semibold mb-1">
                                    {item.company || item.institution}
                                </p>
                                {item.location && (
                                    <p className="text-neutral-600 mb-4 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {item.location}
                                    </p>
                                )}

                                {/* Description */}
                                <p className="text-neutral-700 mb-4 leading-relaxed">
                                    {item.description || item.details}
                                </p>

                                {/* Responsibilities or Achievements */}
                                {(item.responsibilities || item.achievements) && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-bold text-neutral-900 mb-2 uppercase tracking-wide">
                                            {item.responsibilities ? 'Key Responsibilities' : 'Achievements'}
                                        </h4>
                                        <ul className="space-y-2">
                                            {(item.responsibilities || item.achievements).map((point, i) => (
                                                <li key={i} className="flex items-start gap-2 text-neutral-700">
                                                    <span className="text-secondary-600 mt-1 flex-shrink-0">✓</span>
                                                    <span className="text-sm">{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Technologies */}
                                {item.technologies && (
                                    <div className="mt-4 pt-4 border-t border-neutral-200">
                                        <div className="flex flex-wrap gap-2">
                                            {item.technologies.map((tech, i) => (
                                                <span key={i} className="badge-primary text-xs">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Download Resume CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-16"
                >
                    <div className="card p-8 bg-gradient-to-br from-primary-50 to-secondary-50">
                        <h3 className="text-2xl font-bold text-primary-700 mb-4">
                            Want to know more?
                        </h3>
                        <p className="text-neutral-700 mb-6">
                            Download my resume for a complete overview of my experience and qualifications.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/resume.pdf"
                                download
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download Resume
                            </a>
                            <a
                                href="https://linkedin.com/in/harsh-khetia111/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline inline-flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                View LinkedIn
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default Experience;
