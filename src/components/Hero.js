import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { personalInfo, stats } from '../data/personal';
import { getFeaturedProjects } from '../data/projects';

function Hero() {
    const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
    const featuredProjects = getFeaturedProjects().slice(0, 3); // Show top 3

    // Rotate taglines
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTaglineIndex((prev) => (prev + 1) % personalInfo.taglines.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
            {/* Modern Animated Mesh Background */}
            <div className="absolute inset-0 bg-gradient-mesh opacity-40"></div>

            {/* Floating Orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-accent-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
            </div>

            {/* Subtle dot pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}></div>

            {/* Main content */}
            <motion.div
                className="relative z-10 container-custom py-20 text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Profile Image */}
                <motion.div variants={itemVariants} className="mb-8">
                    <img
                        src={personalInfo.profileImage}
                        alt={`${personalInfo.name} - ${personalInfo.title}`}
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto border-4 border-white/30 shadow-2xl"
                    />
                </motion.div>

                {/* Name */}
                <motion.h1
                    variants={itemVariants}
                    className="text-5xl md:text-7xl font-bold text-white mb-4 text-shadow-lg"
                >
                    {personalInfo.name}
                </motion.h1>

                {/* Title */}
                <motion.p
                    variants={itemVariants}
                    className="text-xl md:text-2xl text-white/90 font-semibold mb-4"
                >
                    {personalInfo.title}
                </motion.p>

                {/* Rotating Tagline */}
                <motion.div
                    variants={itemVariants}
                    className="h-16 md:h-20 flex items-center justify-center mb-12"
                >
                    <motion.p
                        key={currentTaglineIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="text-lg md:text-xl text-secondary-200 max-w-2xl mx-auto px-4"
                    >
                        {personalInfo.taglines[currentTaglineIndex]}
                    </motion.p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                >
                    <Link
                        to="/projects"
                        className="btn-primary text-lg px-8 py-4 w-full sm:w-auto"
                    >
                        View My Work
                    </Link>
                    <Link
                        to="/contact"
                        className="btn-outline border-white text-white hover:bg-white hover:text-primary-700 text-lg px-8 py-4 w-full sm:w-auto"
                    >
                        Let's Connect
                    </Link>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto mb-16"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                        >
                            <div className="text-4xl mb-2">{stat.icon}</div>
                            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm md:text-base text-white/80">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Featured Projects Preview */}
                <motion.div variants={itemVariants} className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                        Featured Projects
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredProjects.map((project, index) => (
                            <Link
                                key={project.id}
                                to="/projects"
                                className="card-interactive bg-white p-6 cursor-pointer hover:scale-105 transition-transform duration-300"
                            >
                                <motion.div
                                    whileHover={{ y: -8 }}
                                >
                                    <img
                                        src={project.images[0]}
                                        alt={project.title}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <h3 className="text-xl font-bold text-primary-700 mb-2 line-clamp-2">
                                        {project.title}
                                    </h3>
                                    <p className="text-neutral-600 text-sm line-clamp-3 mb-4">
                                        {project.brief}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack.slice(0, 3).map((tech, i) => (
                                            <span key={i} className="badge-primary text-xs">
                                                {tech}
                                            </span>
                                        ))}
                                        {project.techStack.length > 3 && (
                                            <span className="badge-primary text-xs">
                                                +{project.techStack.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                    <Link
                        to="/projects"
                        className="inline-block mt-8 text-white hover:text-secondary-300 font-semibold text-lg transition-colors duration-200"
                    >
                        View All Projects →
                    </Link>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    variants={itemVariants}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-white/60 text-sm flex flex-col items-center"
                    >
                        <span className="mb-2">Scroll to explore</span>
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}

export default Hero;
