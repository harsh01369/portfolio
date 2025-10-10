import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const menuVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand"></div>
            <div className="hamburger" onClick={toggleMenu}>
                <motion.span
                    animate={{
                        rotate: isOpen ? 45 : 0,
                        y: isOpen ? 0 : 0,
                        opacity: 1,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    {isOpen ? '\u2715' : '\u2630'} {/* Unicode for close (✕) and hamburger (☰) */}
                </motion.span>
            </div>
            <motion.ul
                className="nav-menu"
                initial="hidden"
                animate={isOpen ? 'visible' : 'hidden'}
                variants={menuVariants}
            >
                <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
                <li><Link to="/about" onClick={toggleMenu}>About Me</Link></li>
                <li><Link to="/projects" onClick={toggleMenu}>Projects</Link></li>
                <li><Link to="/experience" onClick={toggleMenu}>Education & Experience</Link></li>
                <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
            </motion.ul>
            <ul className="nav-menu-desktop">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Me</Link></li>
                <li><Link to="/projects">Projects</Link></li>
                <li><Link to="/experience">Education & Experience</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
            <style jsx>{`
                .navbar {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 1rem 2rem;
                    background: #0A1F44;
                    color: #fff;
                    position: fixed;
                    width: 100%;
                    top: 0;
                    z-index: 1000;
                    height: 60px;
                }
                .navbar-brand {
                    display: none;
                }
                .hamburger {
                    display: none;
                    font-size: 2rem;
                    cursor: pointer;
                    color: #ffffff; /* White color for hamburger/close icons */
                    z-index: 1002; /* Ensure above other elements */
                    align-self: center; /* Vertically center within flex parent */
                }
                .nav-menu {
                    display: none;
                    flex-direction: column;
                    position: absolute;
                    top: 60px;
                    right: 0;
                    background: #0A1F44; /* Navy blue theme */
                    padding: 1rem;
                    width: 200px;
                    z-index: 999;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                }
                .nav-menu.active {
                    display: flex;
                }
                .nav-menu-desktop {
                    display: flex;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                .nav-menu li, .nav-menu-desktop li {
                    margin: 0.5rem 1rem;
                }
                .nav-menu li a, .nav-menu-desktop li a {
                    color: #fff; /* White font for consistency */
                    text-decoration: none;
                    font-size: 1.1rem;
                    padding: 0.5rem 1rem;
                    display: block;
                }
                .nav-menu li a:hover, .nav-menu-desktop li a:hover {
                    color: #FFFF99;
                    background-color: #1a2a44;
                    border-radius: 5px;
                }
                @media (max-width: 768px) {
                    .navbar {
                        justify-content: space-between; /* Space between brand and hamburger */
                    }
                    .hamburger {
                        display: block;
                        order: 2; /* Push to the right */
                    }
                    .nav-menu {
                        display: ${isOpen ? 'flex' : 'none'};
                    }
                    .nav-menu-desktop {
                        display: none;
                    }
                }
            `}</style>
        </nav>
    );
}

export default Navbar;