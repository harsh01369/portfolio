import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { personalInfo, socialLinks, contactInfo } from '../data/personal';

function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Projects', path: '/projects' },
        { name: 'Experience', path: '/experience' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <footer className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white">
            <div className="container-custom py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="inline-block mb-4">
                            <h3 className="text-3xl font-bold font-display bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                                {personalInfo.name}
                            </h3>
                        </Link>
                        <p className="text-neutral-300 mb-6 leading-relaxed max-w-md">
                            {personalInfo.bio.short}
                        </p>
                        <div className="flex items-center gap-2 text-neutral-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>UK • India</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
                        <ul className="space-y-3">
                            {footerLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.path}
                                        className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 transition-all duration-200"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white">Get in Touch</h4>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href={`mailto:${contactInfo.email}`}
                                    className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 flex items-start gap-3 group"
                                >
                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="break-all">{contactInfo.email}</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`tel:${contactInfo.phoneUK}`}
                                    className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 flex items-start gap-3 group"
                                >
                                    <span className="text-lg mt-0.5 flex-shrink-0">📞</span>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-neutral-400">UK</span>
                                        <span>{contactInfo.phoneUK}</span>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`tel:${contactInfo.phoneIND}`}
                                    className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 flex items-start gap-3 group"
                                >
                                    <span className="text-lg mt-0.5 flex-shrink-0">📱</span>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-neutral-400">India</span>
                                        <span>{contactInfo.phoneIND}</span>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={contactInfo.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 flex items-start gap-3 group"
                                >
                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                    <span>LinkedIn</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Social Links */}
                <div className="border-t border-neutral-700 pt-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <span className="text-neutral-400 text-sm">Follow me:</span>
                            <div className="flex gap-3">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.url}
                                        target={social.name !== 'Email' ? '_blank' : undefined}
                                        rel={social.name !== 'Email' ? 'noopener noreferrer' : undefined}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-10 h-10 bg-neutral-800 hover:bg-primary-600 rounded-full flex items-center justify-center text-neutral-300 hover:text-white transition-all duration-300"
                                        aria-label={social.label}
                                        title={social.label}
                                    >
                                        {social.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></span>
                            <span className="text-neutral-400 text-sm">
                                {personalInfo.availability}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-neutral-700 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-400">
                        <p>
                            &copy; {currentYear} {personalInfo.name}. All rights reserved.
                        </p>
                        <p className="flex items-center gap-2">
                            Built with
                            <span className="text-red-500 animate-pulse">❤</span>
                            using
                            <span className="text-primary-400 font-semibold">React</span>
                            +
                            <span className="text-secondary-400 font-semibold">Tailwind CSS</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-8 right-8 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-50"
                aria-label="Scroll to top"
            >
                <svg
                    className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                </svg>
            </button>
        </footer>
    );
}

export default Footer;
