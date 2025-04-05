import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', contact: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', contact: '', message: '' });
  };

  return (
    <div className="contact-container">
      <div className="contact-3d-background"></div>
      <div className="contact-card">
        <h1 className="contact-title">Get in Touch With Us</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="contact-input"
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="contact-input"
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="contact-input"
            type="tel"
            name="contact"
            placeholder="Phone Number"
            value={formData.contact}
            onChange={handleChange}
            required
          />
          <textarea
            className="contact-textarea"
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="contact-button"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;