import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../data/projects';

function Projects() {
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const categories = useMemo(() => ['All', ...new Set(projects.map(p => p.category))], []);

    const filteredProjects = useMemo(() =>
        selectedCategory === 'All'
            ? projects
            : projects.filter(p => p.category === selectedCategory),
        [selectedCategory]
    );

    const openProjectModal = (project) => {
        setSelectedProject(project);
        setCurrentImageIndex(0);
        document.body.style.overflow = 'hidden';
    };

    const closeProjectModal = () => {
        setSelectedProject(null);
        setCurrentImageIndex(0);
        document.body.style.overflow = 'unset';
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
    };

    return (
        <section className="min-h-screen bg-gradient-bg py-20">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
                        My Projects
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
                        Explore my portfolio of full-stack applications, AI/ML experiments, and digital growth projects.
                    </p>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                                selectedCategory === category
                                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border-2 border-neutral-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>

                {/* Projects Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="card-interactive group overflow-hidden"
                                onClick={() => openProjectModal(project)}
                            >
                                {/* Project Image */}
                                <div className="relative h-56 overflow-hidden rounded-t-2xl">
                                    <img
                                        src={project.images[0]}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        <span className="text-white font-semibold">View Details →</span>
                                    </div>
                                    {project.featured && (
                                        <div className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                            Featured
                                        </div>
                                    )}
                                </div>

                                {/* Project Info */}
                                <div className="p-6">
                                    <div className="badge-secondary text-xs mb-3">
                                        {project.category}
                                    </div>
                                    <h3 className="text-xl font-bold text-primary-700 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-neutral-600 text-sm line-clamp-3 mb-4">
                                        {project.brief}
                                    </p>

                                    {/* Tech Stack Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.techStack.slice(0, 3).map((tech, i) => (
                                            <span key={i} className="badge-primary text-xs">
                                                {tech}
                                            </span>
                                        ))}
                                        {project.techStack.length > 3 && (
                                            <span className="badge-primary text-xs">
                                                +{project.techStack.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    {/* External Link */}
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors"
                                    >
                                        Visit Project
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* No results message */}
                {filteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-neutral-600 text-lg">No projects found in this category.</p>
                    </motion.div>
                )}
            </div>

            {/* Project Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeProjectModal}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
                        >
                            <div className="min-h-screen px-4 py-8 flex items-center justify-center">
                                {/* Modal Content */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto scrollbar-custom"
                                >
                                    {/* Close Button */}
                                    <button
                                        onClick={closeProjectModal}
                                        className="sticky top-4 right-4 float-right w-12 h-12 bg-neutral-900/80 hover:bg-neutral-900 text-white rounded-full flex items-center justify-center z-10 transition-colors"
                                        aria-label="Close modal"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    {/* Image Gallery */}
                                    <div className="relative h-96 bg-neutral-900 rounded-t-3xl overflow-hidden">
                                        <img
                                            src={selectedProject.images[currentImageIndex]}
                                            alt={`${selectedProject.title} screenshot ${currentImageIndex + 1}`}
                                            className="w-full h-full object-contain"
                                        />

                                        {/* Gallery Navigation */}
                                        {selectedProject.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                                                    {currentImageIndex + 1} / {selectedProject.images.length}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Project Details */}
                                    <div className="p-8">
                                        <div className="badge-secondary text-sm mb-4">
                                            {selectedProject.category}
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
                                            {selectedProject.title}
                                        </h2>

                                        {/* External Link Button */}
                                        <a
                                            href={selectedProject.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary inline-flex items-center mb-6"
                                        >
                                            Visit Live Project
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>

                                        {/* Brief */}
                                        <p className="text-lg text-neutral-700 mb-6 leading-relaxed">
                                            {selectedProject.brief}
                                        </p>

                                        {/* Details */}
                                        <div className="prose prose-neutral max-w-none mb-6">
                                            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Project Details</h3>
                                            <div className="whitespace-pre-wrap text-neutral-700 leading-relaxed">
                                                {selectedProject.details}
                                            </div>
                                        </div>

                                        {/* Tech Stack */}
                                        <div className="mb-6">
                                            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Technologies Used</h3>
                                            <div className="flex flex-wrap gap-3">
                                                {selectedProject.techStack.map((tech, i) => (
                                                    <span key={i} className="badge-primary">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Image Thumbnails */}
                                        {selectedProject.images.length > 1 && (
                                            <div className="border-t border-neutral-200 pt-6">
                                                <h3 className="text-xl font-bold text-neutral-900 mb-4">Gallery</h3>
                                                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                                    {selectedProject.images.map((image, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setCurrentImageIndex(index)}
                                                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                                                currentImageIndex === index
                                                                    ? 'border-primary-600 scale-105'
                                                                    : 'border-neutral-200 hover:border-primary-400'
                                                            }`}
                                                        >
                                                            <img
                                                                src={image}
                                                                alt={`Thumbnail ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}

export default Projects;
