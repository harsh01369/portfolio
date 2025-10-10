import React, { useEffect } from 'react';
import './About.css';

function About() {
    useEffect(() => {
        if (window.particlesJS) {
            // Remove any existing instance to avoid conflicts
            if (document.getElementById('particles-js-about')) {
                document.getElementById('particles-js-about').innerHTML = '';
            }
            window.particlesJS('particles-js-about', {
                particles: {
                    number: { value: 60, density: { enable: true, value_area: 800 } },
                    color: { value: '#F0F0F0' }, // Lighter shade
                    shape: { type: 'circle' },
                    opacity: { value: 0.25, random: true },
                    size: { value: 3, random: true },
                    move: { enable: true, speed: 0.6, direction: 'none', random: true },
                },
                interactivity: { detect_on: 'canvas', events: { onhover: { enable: false } } },
            }, function () {
                console.log('Particles.js initialized for About page');
            });
        } else {
            console.error('particlesJS is not loaded. Check the CDN script in index.html.');
        }
    }, []);

    return (
        <section id="about" className="about">
            <div id="particles-js-about" className="particles-bg"></div>
            <div className="content-wrapper">
                <h1 className="about-title">About Me</h1>
                <div className="about-text">
                    <p className="about-para">I am a Computer Science graduate with a strong foundation in full-stack development, AI-driven applications, and digital growth strategies. My experience spans building a MERN-stack e-commerce platform with advanced authentication and payment systems, creating and scaling a digital content brand, and developing intelligent automation tools such as GeoThreadBot for multi-language content processing.</p>
                    <p className="about-para">Beyond technical expertise, I bring proven experience in SEO, social media strategy, video production, and customer engagement, blending creativity with analytical problem-solving. I thrive in fast-paced, remote-first environments, where I can contribute to both product innovation and client success. With a passion for AI, automation, and user experience, I aim to bridge technology with impactful solutions that scale businesses and empower communities.</p>
                </div>
                <div className="skills-section">
                    <h1 className="skills-title">Skills</h1>
                    <div className="skills-cards">
                        <div className="skill-card">
                            <h2 className="card-title">Technical & Development</h2>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Programming Languages</h3>
                                <div className="skill-list">
                                    <span className="skill-item">Python</span>
                                    <span className="skill-item">Java</span>
                                    <span className="skill-item">C</span>
                                    <span className="skill-item">JavaScript (ES6+)</span>
                                    <span className="skill-item">PHP</span>
                                    <span className="skill-item">HTML5</span>
                                    <span className="skill-item">CSS3</span>
                                </div>
                            </div>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Frameworks & Libraries</h3>
                                <div className="skill-list">
                                    <span className="skill-item">React</span>
                                    <span className="skill-item">Node.js</span>
                                    <span className="skill-item">Express.js</span>
                                    <span className="skill-item">Firebase</span>
                                    <span className="skill-item">Tailwind CSS</span>
                                    <span className="skill-item">spaCy</span>
                                </div>
                            </div>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Databases</h3>
                                <div className="skill-list">
                                    <span className="skill-item">SQL</span>
                                    <span className="skill-item">MongoDB</span>
                                    <span className="skill-item">Supabase (Postgres with RLS)</span>
                                </div>
                            </div>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Web Development</h3>
                                <div className="skill-list">
                                    <span className="skill-item">MERN Stack</span>
                                    <span className="skill-item">REST APIs</span>
                                    <span className="skill-item">JWT Authentication</span>
                                    <span className="skill-item">Stripe & SendGrid integrations</span>
                                    <span className="skill-item">WordPress basics</span>
                                </div>
                            </div>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Tools & Platforms</h3>
                                <div className="skill-list">
                                    <span className="skill-item">Git</span>
                                    <span className="skill-item">GitHub</span>
                                    <span className="skill-item">VS Code</span>
                                    <span className="skill-item">PyCharm</span>
                                    <span className="skill-item">Google Colab</span>
                                    <span className="skill-item">CoPilot</span>
                                    <span className="skill-item">Render</span>
                                    <span className="skill-item">Hostinger</span>
                                    <span className="skill-item">Zapier</span>
                                    <span className="skill-item">Storyblok CMS</span>
                                    <span className="skill-item">Vercel</span>
                                </div>
                            </div>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Cloud & Infra</h3>
                                <div className="skill-list">
                                    <span className="skill-item">Azure Functions</span>
                                    <span className="skill-item">Kubernetes (basic familiarity)</span>
                                    <span className="skill-item">serverless deployment</span>
                                </div>
                            </div>
                        </div>
                        <div className="skill-card">
                            <h2 className="card-title">AI, Data & Automation</h2>
                            <div className="skill-category">
                                <h3 className="subcategory-title">AI/LLM Tools</h3>
                                <div className="skill-list">
                                    <span className="skill-item">ChatGPT</span>
                                    <span className="skill-item">Grok</span>
                                    <span className="skill-item">Claude</span>
                                    <span className="skill-item">Perplexity Pro</span>
                                    <span className="skill-item">AI image generation tools</span>
                                </div>
                            </div>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Automation</h3>
                                <div className="skill-list">
                                    <span className="skill-item">Flask API integration</span>
                                    <span className="skill-item">content scheduling</span>
                                    <span className="skill-item">RSS/YouTube/Twitter monitoring</span>
                                </div>
                            </div>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Data Analysis</h3>
                                <div className="skill-list">
                                    <span className="skill-item">Sentiment analysis</span>
                                    <span className="skill-item">SEO keyword research</span>
                                    <span className="skill-item">KPI tracking</span>
                                    <span className="skill-item">reinforcement learning concepts</span>
                                </div>
                            </div>
                        </div>
                        <div className="skill-card">
                            <h2 className="card-title">Digital Marketing & Growth</h2>
                            <div className="skill-category">
                                <h3 className="subcategory-title">SEO & Content Marketing</h3>
                                <div className="skill-list">
                                    <span className="skill-item">Keyword research</span>
                                    <span className="skill-item">internal/external linking strategies</span>
                                    <span className="skill-item">blog/article optimization</span>
                                    <span className="skill-item">funnel analysis</span>
                                </div>
                            </div>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Social Media Management</h3>
                                <div className="skill-list">
                                    <span className="skill-item">Instagram</span>
                                    <span className="skill-item">TikTok</span>
                                    <span className="skill-item">LinkedIn</span>
                                    <span className="skill-item">Reddit engagement strategies</span>
                                </div>
                            </div>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Content Creation</h3>
                                <div className="skill-list">
                                    <span className="skill-item">Video editing (CapCut, FL Studio)</span>
                                    <span className="skill-item">AI-generated visuals</span>
                                    <span className="skill-item">Canva</span>
                                    <span className="skill-item">copywriting</span>
                                    <span className="skill-item">blog drafting</span>
                                </div>
                            </div>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Ads & Campaigns</h3>
                                <div className="skill-list">
                                    <span className="skill-item">Google Ads</span>
                                    <span className="skill-item">Meta Business Suite (campaign setup and analysis)</span>
                                </div>
                            </div>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Email Marketing</h3>
                                <div className="skill-list">
                                    <span className="skill-item">Automated flows</span>
                                    <span className="skill-item">newsletters</span>
                                    <span className="skill-item">customer engagement using SendGrid</span>
                                </div>
                            </div>
                        </div>
                        <div className="skill-card">
                            <h2 className="card-title">Customer-Facing & Business Skills</h2>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Customer Experience</h3>
                                <div className="skill-list">
                                    <span className="skill-item">Client support</span>
                                    <span className="skill-item">troubleshooting</span>
                                    <span className="skill-item">service excellence (SPAR, Nisa Local, UWEAR)</span>
                                </div>
                            </div>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Team Collaboration</h3>
                                <div className="skill-list">
                                    <span className="skill-item">Agile ceremonies</span>
                                    <span className="skill-item">sprint planning</span>
                                    <span className="skill-item">retrospectives</span>
                                    <span className="skill-item">stakeholder communication</span>
                                </div>
                            </div>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Project Management</h3>
                                <div className="skill-list">
                                    <span className="skill-item">ClickUp</span>
                                    <span className="skill-item">time-sensitive execution</span>
                                </div>
                            </div>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Leadership & Communication</h3>
                                <div className="skill-list">
                                    <span className="skill-item">Supervising teams</span>
                                    <span className="skill-item">guiding customers through technical and service workflows</span>
                                    <span className="skill-item">presenting data-driven solutions</span>
                                </div>
                            </div>
                        </div>
                        <div className="skill-card">
                            <h2 className="card-title">Creative & Research-Oriented</h2>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Content Writing</h3>
                                <div className="skill-list">
                                    <span className="skill-item">Articles</span>
                                    <span className="skill-item">poetry</span>
                                    <span className="skill-item">cultural/spiritual writings</span>
                                    <span className="skill-item">technical reviews</span>
                                </div>
                            </div>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Academic Research</h3>
                                <div className="skill-list">
                                    <span className="skill-item">Reinforcement learning applications in high-frequency trading</span>
                                    <span className="skill-item">algorithmic adaptability</span>
                                    <span className="skill-item">ethical analysis</span>
                                </div>
                            </div>
                            <div className="skill-category">
                                <h3 className="subcategory-title">Brand Development</h3>
                                <div className="skill-list">
                                    <span className="skill-item">Built Bhairav Aaradhyaa from scratch with integrated strategy (SEO + content + community building)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;