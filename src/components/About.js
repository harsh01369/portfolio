import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { personalInfo } from '../data/personal';
import { skillCategories } from '../data/skills';
import { education } from '../data/experience';
import { fadeInUp, fadeInLeft, fadeInRight, viewportConfig } from '../utils/scrollAnimations';

function About() {
    const [selectedCategory, setSelectedCategory] = useState(skillCategories[0].id);
    const [searchTerm, setSearchTerm] = useState('');

    const selectedSkillCategory = skillCategories.find(cat => cat.id === selectedCategory);

    // Filter skills based on search
    const filterSkills = (skills) => {
        if (!searchTerm) return skills;
        return skills.filter(skill =>
            skill.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return (
        <section className="min-h-screen bg-gradient-bg py-20">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
                        About Me
                    </h1>
                </motion.div>

                {/* Bio Section */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    className="max-w-4xl mx-auto mb-20"
                >
                    <div className="card p-8 md:p-12">
                        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                            <img
                                src={personalInfo.profileImage}
                                alt={personalInfo.name}
                                className="w-40 h-40 rounded-full border-4 border-primary-200 shadow-lg"
                            />
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-2">
                                    {personalInfo.name}
                                </h2>
                                <p className="text-xl text-neutral-600 mb-4">
                                    {personalInfo.title}
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span className="badge-primary">{personalInfo.location}</span>
                                    <span className="badge-secondary">{personalInfo.availability}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 text-neutral-700 text-lg leading-relaxed">
                            <p className="font-semibold text-primary-700 text-xl">
                                {personalInfo.bio.short}
                            </p>
                            {personalInfo.bio.long.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Education Section */}
                <motion.div
                    variants={fadeInLeft}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    className="max-w-4xl mx-auto mb-20"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 gradient-text">
                        Education
                    </h2>
                    {education.map((edu) => (
                        <div key={edu.id} className="card p-8 hover:shadow-medium transition-shadow duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">🎓</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-primary-700 mb-2">
                                        {edu.degree}
                                    </h3>
                                    <p className="text-lg text-neutral-700 mb-2">
                                        {edu.institution} • {edu.location}
                                    </p>
                                    <p className="text-neutral-600 mb-4">{edu.period}</p>
                                    <p className="text-neutral-700 mb-4">{edu.description}</p>
                                    {edu.achievements && (
                                        <ul className="space-y-2">
                                            {edu.achievements.map((achievement, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="text-secondary-600 mt-1">✓</span>
                                                    <span className="text-neutral-700">{achievement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Skills Section */}
                <motion.div
                    variants={fadeInRight}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 gradient-text">
                        Skills & Expertise
                    </h2>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search skills..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-6 py-4 pl-14 rounded-2xl border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 text-lg"
                            />
                            <svg
                                className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12 px-4">
                        {skillCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-3 py-2 md:px-6 md:py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-1 md:gap-2 text-sm md:text-base ${
                                    selectedCategory === category.id
                                        ? 'bg-primary-600 text-white shadow-lg scale-105'
                                        : 'bg-white text-neutral-700 hover:bg-neutral-100 border-2 border-neutral-200'
                                }`}
                            >
                                <span className="text-xl md:text-2xl">{category.icon}</span>
                                <span className="hidden sm:inline">{category.title}</span>
                            </button>
                        ))}
                    </div>

                    {/* Skills Display */}
                    <motion.div
                        key={selectedCategory}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="grid gap-6">
                            {selectedSkillCategory.subcategories.map((subcategory, index) => {
                                const filteredSkills = filterSkills(subcategory.skills);
                                if (filteredSkills.length === 0 && searchTerm) return null;

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="card p-6 hover:shadow-medium transition-all duration-300"
                                    >
                                        <h3 className="text-xl font-bold text-primary-700 mb-4">
                                            {subcategory.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {filteredSkills.map((skill, i) => (
                                                <motion.div
                                                    key={i}
                                                    whileHover={{ scale: 1.05 }}
                                                    className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
                                                        skill.proficiency === 'Expert'
                                                            ? 'bg-primary-100 text-primary-800 border-2 border-primary-300'
                                                            : skill.proficiency === 'Advanced'
                                                            ? 'bg-secondary-100 text-secondary-800 border-2 border-secondary-300'
                                                            : 'bg-neutral-100 text-neutral-700 border-2 border-neutral-200'
                                                    }`}
                                                >
                                                    {skill.icon && <span>{skill.icon}</span>}
                                                    <span>{skill.name}</span>
                                                    {skill.proficiency && (
                                                        <span className="text-xs opacity-75">
                                                            ({skill.proficiency})
                                                        </span>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* No results message */}
                        {searchTerm && selectedSkillCategory.subcategories.every(
                            sub => filterSkills(sub.skills).length === 0
                        ) && (
                            <div className="text-center py-12">
                                <p className="text-neutral-600 text-lg">
                                    No skills found matching "{searchTerm}"
                                </p>
                            </div>
                        )}
                    </motion.div>

                    {/* Skill Legend */}
                    <div className="max-w-4xl mx-auto mt-12 card p-6">
                        <h4 className="text-lg font-bold text-neutral-900 mb-4 text-center">
                            Proficiency Levels
                        </h4>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-primary-400 rounded"></div>
                                <span className="text-sm text-neutral-700">Expert</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-secondary-400 rounded"></div>
                                <span className="text-sm text-neutral-700">Advanced</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-neutral-300 rounded"></div>
                                <span className="text-sm text-neutral-700">Intermediate / Beginner</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default About;
