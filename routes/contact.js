import React from 'react';
import '../css/Contact.css';

export default function Contact() {
  // use VITE env variables (set in project root .env) for phone & default message
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '233501234567';
  const messageText = import.meta.env.VITE_WHATSAPP_MESSAGE || 'Hello Arkyn! I would like to talk about a project.';
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`;

  const handleWhatsAppClick = async () => {
    try {
      // send lead to backend
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'WhatsApp Visitor',
          message: messageText,
          source: 'whatsapp-link'
        })
      });
    } catch (err) {
      console.warn('Could not log WhatsApp click:', err);
    }

    // open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="section contact">
      <div className="contact-grid">
        <div className="contact-card">
          <h2>Let’s build something together</h2>
          <p>Prefer WhatsApp? Tap the button to start a conversation. We generally respond within one business day.</p>

          <button className="btn whatsapp" onClick={handleWhatsAppClick}>
            Chat on WhatsApp
          </button>

          <div className="contact-info">
            <div><strong>Email</strong><span>hello@arkyn.com</span></div>
            <div><strong>Location</strong><span>Kumasi, Ghana</span></div>
          </div>
        </div>

        <div className="contact-side">
          <h3>Quick brief</h3>
          <p>Share a few lines about your product idea, timeline and budget. Or simply message us on WhatsApp and we'll take it from there.</p>
        </div>
      </div>

      <footer className="site-footer">
        <div>© {new Date().getFullYear()} Arkyn — Built with care</div>
      </footer>
    </section>
  );
}
