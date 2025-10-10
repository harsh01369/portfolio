import React, { useState } from 'react';
import './Contact.css';

function Contact() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        request: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { firstName, lastName, email, request } = formData;
        if (!firstName || !lastName || !email || !request) {
            alert('Please fill in all mandatory fields.');
            return;
        }
        const subject = `Contact Request from ${firstName} ${lastName}`;
        const body = `Email: ${email}\nRequest: ${request}`;
        window.location.href = `mailto:work.harshkhetia@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setFormData({ firstName: '', lastName: '', email: '', request: '' }); // Clear form
    };

    return (
        <section id="contact" className="contact">
            <div className="content-wrapper">
                <h1 className="contact-title">Contact</h1>
                <div className="contact-info">
                    <p>Email: <a href="mailto:work.harshkhetia@gmail.com">work.harshkhetia@gmail.com</a></p>
                    <p>Phone: +447587358048</p>
                    <a href="https://linkedin.com/in/harsh-khetia111/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
                <div className="contact-form-card">
                    <h2 className="card-title">Send Me a Message</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name *"
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name *"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email *"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                name="request"
                                value={formData.request}
                                onChange={handleChange}
                                placeholder="Your Request *"
                                required
                            ></textarea>
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Contact;