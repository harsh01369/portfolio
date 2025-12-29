import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const menuRef = useRef(null);

    // Handle scroll to add backdrop blur and shadow
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Projects', path: '/projects' },
        { name: 'Experience', path: '/experience' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActivePath = (path) => location.pathname === path;

    const mobileMenuVariants = {
        hidden: {
            opacity: 0,
            x: '100%',
            transition: {
                duration: 0.3,
                ease: 'easeInOut',
            },
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                ease: 'easeOut',
                staggerChildren: 0.07,
                delayChildren: 0.1,
            },
        },
    };

    const menuItemVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <>
            {/* Navbar */}
            <nav
                ref={menuRef}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-lg'
                        : 'bg-primary-700'
                }`}
            >
                <div className="container-custom">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo/Brand */}
                        <Link
                            to="/"
                            className={`text-xl md:text-2xl font-bold transition-colors duration-200 ${
                                scrolled
                                    ? 'text-primary-700 hover:text-primary-600'
                                    : 'text-white hover:text-secondary-300'
                            }`}
                        >
                            <span className="font-display">HK</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <ul className="hidden md:flex items-center space-x-1 lg:space-x-2">
                            {navLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                            isActivePath(link.path)
                                                ? scrolled
                                                    ? 'bg-primary-100 text-primary-700'
                                                    : 'bg-white/20 text-white'
                                                : scrolled
                                                ? 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-700'
                                                : 'text-white/90 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Mobile Hamburger Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`md:hidden relative w-10 h-10 flex flex-col items-center justify-center focus:outline-none transition-colors duration-200 ${
                                scrolled ? 'text-primary-700' : 'text-white'
                            }`}
                            aria-label="Toggle menu"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Toggle menu</span>
                            <motion.span
                                className={`block w-6 h-0.5 mb-1.5 ${
                                    scrolled ? 'bg-primary-700' : 'bg-white'
                                }`}
                                animate={{
                                    rotate: isOpen ? 45 : 0,
                                    y: isOpen ? 8 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                            <motion.span
                                className={`block w-6 h-0.5 mb-1.5 ${
                                    scrolled ? 'bg-primary-700' : 'bg-white'
                                }`}
                                animate={{
                                    opacity: isOpen ? 0 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                            <motion.span
                                className={`block w-6 h-0.5 ${
                                    scrolled ? 'bg-primary-700' : 'bg-white'
                                }`}
                                animate={{
                                    rotate: isOpen ? -45 : 0,
                                    y: isOpen ? -8 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Mobile Menu Slide-in */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={mobileMenuVariants}
                            className="fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
                        >
                            <div className="flex flex-col h-full">
                                {/* Menu Header */}
                                <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                                    <h2 className="text-2xl font-bold text-primary-700 font-display">
                                        Menu
                                    </h2>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors duration-200 text-neutral-600"
                                        aria-label="Close menu"
                                    >
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
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                {/* Menu Items */}
                                <nav className="flex-1 p-6">
                                    <ul className="space-y-2">
                                        {navLinks.map((link, index) => (
                                            <motion.li
                                                key={link.path}
                                                variants={menuItemVariants}
                                                custom={index}
                                            >
                                                <Link
                                                    to={link.path}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`flex items-center px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                                                        isActivePath(link.path)
                                                            ? 'bg-primary-100 text-primary-700 shadow-sm'
                                                            : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-700'
                                                    }`}
                                                >
                                                    {link.name}
                                                    {isActivePath(link.path) && (
                                                        <motion.span
                                                            layoutId="activeIndicator"
                                                            className="ml-auto w-2 h-2 rounded-full bg-primary-700"
                                                        />
                                                    )}
                                                </Link>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </nav>

                                {/* Menu Footer */}
                                <div className="p-6 border-t border-neutral-200 bg-neutral-50">
                                    <p className="text-sm text-neutral-600 text-center">
                                        Built with ❤️ by Harsh Khetia
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default Navbar;
