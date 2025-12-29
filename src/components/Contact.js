import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { contactInfo, socialLinks } from '../data/personal';
import { fadeInLeft, fadeInRight, viewportConfig } from '../utils/scrollAnimations';

function Contact() {
    const formRef = useRef();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState(''); // 'success', 'error', 'sending', ''
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setStatus('sending');

        try {
            // EmailJS configuration - replace these with your actual EmailJS credentials
            const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
            const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
            const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

            // Send email using EmailJS
            await emailjs.sendForm(
                serviceId,
                templateId,
                formRef.current,
                publicKey
            );

            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });

            // Reset success message after 5 seconds
            setTimeout(() => setStatus(''), 5000);
        } catch (error) {
            console.error('EmailJS Error:', error);
            setStatus('error');
            setTimeout(() => setStatus(''), 5000);
        }
    };

    return (
        <section className="min-h-screen bg-gradient-bg py-20">
            <div className="container-custom max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
                        Let's Work Together
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
                        Have a project in mind? Let's discuss how I can help bring your ideas to life.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        variants={fadeInLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                    >
                        <h2 className="text-3xl font-bold text-primary-700 mb-8">
                            Get in Touch
                        </h2>

                        {/* Contact Methods */}
                        <div className="space-y-6 mb-12">
                            <a
                                href={`mailto:${contactInfo.email}`}
                                className="card p-6 flex items-start gap-4 hover:shadow-medium transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 transition-colors duration-300">
                                    <svg className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-neutral-900 mb-1">Email</h3>
                                    <p className="text-neutral-600">{contactInfo.email}</p>
                                </div>
                            </a>

                            <a
                                href={`tel:${contactInfo.phoneUK}`}
                                className="card p-6 flex items-start gap-4 hover:shadow-medium transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-secondary-600 transition-colors duration-300">
                                    <span className="text-2xl">📞</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-neutral-900 mb-1">Phone (UK)</h3>
                                    <p className="text-neutral-600">{contactInfo.phoneUK}</p>
                                </div>
                            </a>

                            <a
                                href={`tel:${contactInfo.phoneIND}`}
                                className="card p-6 flex items-start gap-4 hover:shadow-medium transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-accent-600 transition-colors duration-300">
                                    <span className="text-2xl">📱</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-neutral-900 mb-1">Phone (India)</h3>
                                    <p className="text-neutral-600">{contactInfo.phoneIND}</p>
                                </div>
                            </a>
                        </div>

                        {/* Social Links */}
                        <div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-6">Connect on Social</h3>
                            <div className="flex flex-wrap gap-4">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.url}
                                        target={social.name !== 'Email' ? '_blank' : undefined}
                                        rel={social.name !== 'Email' ? 'noopener noreferrer' : undefined}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-14 h-14 bg-white border-2 border-neutral-200 rounded-full flex items-center justify-center text-2xl hover:border-primary-500 hover:text-primary-600 transition-all duration-300 shadow-sm hover:shadow-md"
                                        aria-label={social.label}
                                        title={social.label}
                                    >
                                        {social.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="mt-12 card p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
                            <h3 className="text-lg font-bold text-primary-700 mb-2">Availability</h3>
                            <p className="text-neutral-700">
                                Currently <span className="font-semibold text-secondary-700">open to new opportunities</span> for full-time positions, freelance projects, and collaborations.
                            </p>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        variants={fadeInRight}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                    >
                        <div className="card p-8">
                            <h2 className="text-2xl font-bold text-primary-700 mb-6">
                                Send a Message
                            </h2>

                            {/* Status Messages */}
                            {status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-secondary-100 border border-secondary-300 rounded-lg text-secondary-800"
                                >
                                    ✓ Message sent successfully! I'll get back to you soon.
                                </motion.div>
                            )}

                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800"
                                >
                                    ✗ Something went wrong. Please try again or email me directly.
                                </motion.div>
                            )}

                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                                            errors.name
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-neutral-200 focus:border-primary-500'
                                        } focus:ring-2 focus:ring-primary-200`}
                                        placeholder="John Doe"
                                        disabled={status === 'sending'}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                                            errors.email
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-neutral-200 focus:border-primary-500'
                                        } focus:ring-2 focus:ring-primary-200`}
                                        placeholder="john@example.com"
                                        disabled={status === 'sending'}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                                            errors.subject
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-neutral-200 focus:border-primary-500'
                                        } focus:ring-2 focus:ring-primary-200`}
                                        placeholder="Project Inquiry"
                                        disabled={status === 'sending'}
                                    />
                                    {errors.subject && (
                                        <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                                    )}
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="6"
                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 resize-none ${
                                            errors.message
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-neutral-200 focus:border-primary-500'
                                        } focus:ring-2 focus:ring-primary-200`}
                                        placeholder="Tell me about your project..."
                                        disabled={status === 'sending'}
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className={`btn-primary w-full ${
                                        status === 'sending' ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {status === 'sending' ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default Contact;
