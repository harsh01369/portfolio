import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Hero() {
    const experiences = [
        { title: 'UWEAR UK : Junior Web Developer', duration: 'Sep 2024 - Present' },
        { title: 'Content Creation : Self-Employed', duration: 'Apr 2025 - Present' },
        { title: 'KPMG : Work Experience Program', duration: 'March 2024 - April 2024' },
    ];

    // Project data (unchanged from your provided version)
    const projectData = [
        {
            title: 'UWEAR UK E-Commerce Platform',
            link: 'https://uwearuk.com/',
            brief: 'A complete full-stack e-commerce platform built entirely from scratch, including a customer-facing website, admin dashboard, and backend server. Designed and developed solo, this project powers UwearUK, a clothing brand that connects wholesale and retail operations in real time.',
            image: '/images/uwear/1.png',
        },
        {
            title: 'Enhancing Reinforcement Learning in High-Frequency Trading',
            link: 'https://colab.research.google.com/drive/1VqGT41gxVGRac4hZDJUVP4UZaPZVrGeS?usp=sharing',
            brief: 'A research-driven project exploring how Reinforcement Learning (RL) optimizes decision-making in High-Frequency Trading environments. Implemented and tested on Google Colab using TensorFlow.',
            image: '/images/rl/11.jpg',
        },
        {
            title: 'AI-Powered Geopolitics News Bot',
            link: 'https://github.com/harsh01369/AI-powered-Geo-politics-news-bot',
            brief: 'An intelligent, end-to-end AI-driven news automation bot that fetches, analyzes, verifies, summarizes, and posts breaking geopolitical content from YouTube, RSS feeds, and Twitter (X) using advanced NLP and API integrations.',
            image: '/images/bot/1.jpg',
        },
        {
            title: 'Bhairav Aaradhyaa — Content Creation & Digital Platform',
            link: 'https://www.instagram.com/bhairav.aaradhyaa/',
            brief: 'A growing digital platform dedicated to spreading spirituality, wisdom, and higher consciousness through modern content creation. Built organically from zero to 700K reach in six months.',
            image: '/images/bhairavMaa/11.jpg',
        },
        {
            title: 'AI-Powered Used Car Price Prediction with Random Forest Regression',
            link: 'https://colab.research.google.com/drive/1dF35FXnz0mZehVuitJUkawH5Y5Qeawpb?usp=sharing',
            brief: 'A machine learning project analyzing used car advertisement data to build a predictive model for vehicle prices. Utilizes Random Forest Regression on Google Colab for accurate forecasting based on key attributes like mileage, registration year, and vehicle specs.',
            image: '/images/ai/1.jpg',
        },
    ];

    // About Me and Education text with fade cycle
    const aboutMeText = [
        
        'Computer Science graduate with a strong foundation in full-stack development, AI-driven applications, and digital growth strategies.',
        'Creative mind behind Bhairav Aaradhyaa',
    ];
    const educationText = [
        'BSc(Hons) Computer Science at University of Lancaster (2022-2024).',
    ];
    const [currentAboutTextIndex, setCurrentAboutTextIndex] = useState(0);
    const [currentEducationTextIndex, setCurrentEducationTextIndex] = useState(0);

    useEffect(() => {
        const aboutInterval = setInterval(() => {
            setCurrentAboutTextIndex((prev) => (prev + 1) % aboutMeText.length);
        }, 3000);
        const educationInterval = setInterval(() => {
            setCurrentEducationTextIndex((prev) => (prev + 1) % educationText.length);
        }, 3000);
        return () => {
            clearInterval(aboutInterval);
            clearInterval(educationInterval);
        };
    }, [aboutMeText.length, educationText.length]);

    useEffect(() => {
        if (window.particlesJS) {
            window.particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: '#FFFFFF' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.5, random: true },
                    size: { value: 3, random: true },
                    move: { enable: true, speed: 1, direction: 'none', random: true },
                },
                interactivity: { detect_on: 'canvas', events: { onhover: { enable: false } } },
            });
        } else {
            console.error('particlesJS is not loaded. Check the CDN script in index.html.');
        }
    }, []);

    // Continuous slide animation for cards
    const cardVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            transition: { duration: 0.5 },
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.5 },
        },
        exit: (direction) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            transition: { duration: 0.5 },
        }),
    };

    return (
        <section id="hero">
            <div id="particles-js"></div>
            <style>
                {`
                    .project-card h3 {
                        font-size: 1.5rem; /* Larger title, unchanged */
                        font-weight: bold;
                        margin-bottom: 0.5rem;
                    }
                    .project-card p {
                        font-size: 1.1rem; /* Medium size for brief */
                        line-height: 1.4;
                        color: #000000; /* Black for better readability */
                    }
                `}
            </style>
            <div className="hero-content">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                >Harsh Khetia</motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>Full-Stack & AI Developer | Creative Technologist | Digital Visionary</motion.p>
                <img src="/images/11.gif" alt="Harsh Khetia" />
                {/* Projects Section */}
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                    transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
                    onClick={() => window.location.href = '/projects'}
                    style={{ cursor: 'pointer' }}
                >Projects</motion.h2>
                <motion.div className="project-grid" initial="hidden" animate="visible" variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                }}>
                    <AnimatePresence>
                        {projectData.map((project, index) => (
                            <motion.div
                                key={index}
                                className="project-card"
                                custom={index % 2 === 0 ? 1 : -1}
                                variants={cardVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onClick={() => window.location.href = '/projects'}
                                style={{ cursor: 'pointer' }}
                            >
                                <h3>{project.title}</h3>
                                <p>{project.brief}</p>
                                <img src={project.image} alt={project.title} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
                {/* About Me Section */}
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                    transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
                    onClick={() => window.location.href = '/about'}
                    style={{ cursor: 'pointer' }}
                >About Me</motion.h2>
                <motion.div
                    className="about-info"
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                    onClick={() => window.location.href = '/about'}
                    style={{ cursor: 'pointer' }}
                >
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentAboutTextIndex}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.5 }}
                            style={{ color: '#FFFFFF' }}
                        >
                            {aboutMeText[currentAboutTextIndex]}
                        </motion.p>
                    </AnimatePresence>
                </motion.div>
                {/* Education Section */}
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                    transition={{ type: 'spring', stiffness: 100, delay: 0.6 }}
                    onClick={() => window.location.href = '/education'}
                    style={{ cursor: 'pointer' }}
                >Education</motion.h2>
                <motion.div
                    className="about-info"
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                    onClick={() => window.location.href = '/education'}
                    style={{ cursor: 'pointer' }}
                >
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentEducationTextIndex}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.5 }}
                            style={{ color: '#FFFFFF' }}
                        >
                            {educationText[currentEducationTextIndex]}
                        </motion.p>
                    </AnimatePresence>
                </motion.div>
                {/* Experience Section */}
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                    transition={{ type: 'spring', stiffness: 100, delay: 0.8 }}
                    onClick={() => window.location.href = '/experience'}
                    style={{ cursor: 'pointer' }}
                >Experience</motion.h2>
                <motion.div className="experience-grid" initial="hidden" animate="visible" variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                }}>
                    <AnimatePresence>
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={index}
                                className="experience-card"
                                custom={index % 2 === 0 ? 1 : -1}
                                variants={cardVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onClick={() => window.location.href = '/experience'}
                                style={{ cursor: 'pointer' }}
                            >
                                <h3>{exp.title}</h3>
                                <p>{exp.duration}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
                {/* Contact Section */}
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                    transition={{ type: 'spring', stiffness: 100, delay: 1.0 }}
                    onClick={() => window.location.href = '/contact'}
                    style={{ cursor: 'pointer' }}
                >Contact</motion.h2>
                <motion.div className="contact-icons" initial="hidden" animate="visible" variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
                }}>
                    <motion.a
                        href="mailto:work.harshkhetia@gmail.com"
                        variants={{ hidden: { rotate: -90, opacity: 0 }, visible: { rotate: 0, opacity: 1 } }}
                        whileHover={{ scale: 1.2, boxShadow: '0 0 15px #FFFFFF', transition: { duration: 0.3 } }}
                        style={{ color: '#FFFFFF', fontSize: '2rem' }}
                        onClick={(e) => { e.preventDefault(); window.location.href = '/contact'; }}
                    >
                        <span role="img" aria-label="email">✉</span>
                    </motion.a>
                    <motion.a
                        href="https://linkedin.com/in/harsh-khetia111/"
                        variants={{ hidden: { rotate: -90, opacity: 0 }, visible: { rotate: 0, opacity: 1 } }}
                        whileHover={{ scale: 1.2, boxShadow: '0 0 15px #FFFFFF', transition: { duration: 0.3 } }}
                        style={{ color: '#FFFFFF', fontSize: '2rem' }}
                        onClick={(e) => { e.preventDefault(); window.location.href = '/contact'; }}
                    >
                        <span role="img" aria-label="linkedin">[in]</span>
                    </motion.a>
                    <motion.a
                        href="tel:+447587358048"
                        variants={{ hidden: { rotate: -90, opacity: 0 }, visible: { rotate: 0, opacity: 1 } }}
                        whileHover={{ scale: 1.2, boxShadow: '0 0 15px #FFFFFF', transition: { duration: 0.3 } }}
                        style={{ color: '#FFFFFF', fontSize: '2rem' }}
                        onClick={(e) => { e.preventDefault(); window.location.href = '/contact'; }}
                    >
                        <span role="img" aria-label="phone">☏</span>
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}

export default Hero;