import React from 'react';
import './Experience.css';

function Experience() {
    const education = {
        title: 'University Academy 92 (Lancaster University)',
        duration: 'Apr 2022 - Jul 2024',
        details: 'Computer Science BSc (Hons), CGPA 3.5',
    };

    const experiences = [
        { title: 'UWEAR UK | Junior Web Developer ', duration: 'Sep 2024 - Present', details: 'Built a React-based e-commerce platform with MongoDB and Node.js, integrating payment gateways and APIs. Ensured scalability, security, and a seamless user experience. Managed stock, packaging, and order fulfillment.' },
        { title: 'Self-Employed | Content Creator & Writer', duration: 'Apr 2025 - Present', details: 'Created reels, videos, poems, and articles on spirituality, philosophy, and culture. Managed and grew two Instagram accounts under the Bhairav Aaradhyaa brand. Developed a content strategy with plans to expand into a business.' },
        { title: 'SPAR | Customer Service Supervisor', duration: 'Sep 2023 - Present', details: 'Proficiently managed customer inquiries. Provided exceptional service to ensure a seamless shopping experience.' },
        { title: 'KPMG | Work Experience Program', duration: 'Mar 2024 - Apr 2024', details: 'Collaborated with experienced professionals. Enhanced skills in business analysis, problem-solving, and client communication. Gained valuable industry exposure and practical knowledge in IT.' },
        { title: 'Nisa Local | Customer Service Representative', duration: 'Jul 2022 - Aug 2023', details: 'Managed in-store operations. Assisted customers with their needs.' },
    ];

    return (
        <section id="experience" className="experience">
            <div className="content-wrapper">
                <h1 className="experience-title">Education</h1>
                <div className="education-card">
                    <h2 className="card-title">{education.title}</h2>
                    <p className="duration">{education.duration}</p>
                    <p className="details">{education.details}</p>
                </div>
                <h1 className="experience-title">Experience</h1>
                <div className="experience-cards">
                    {experiences.map((exp, index) => (
                        <div key={index} className="experience-card">
                            <h2 className="card-title">{exp.title}</h2>
                            <p className="duration">{exp.duration}</p>
                            <p className="details">{exp.details}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Experience;