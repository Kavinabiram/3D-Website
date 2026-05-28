import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ContactSectionProps {
  onClickSound: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onClickSound }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClickSound();
    setIsSubmitted(true);
    
    // Reset submission feedback after 4 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <section className="h-screen w-full flex items-center justify-center px-4 sm:px-6 relative z-10 pointer-events-none text-cream-200">
      <div className="w-full max-w-lg pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-cocoa-900/60 backdrop-blur-xl border border-white/10 p-5 sm:p-8 rounded-3xl shadow-glass"
        >
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <span className="text-[10px] font-bold tracking-[0.3em] text-gold-500 uppercase block mb-1">
                  Inquiries
                </span>
                <h2 className="text-3xl font-serif tracking-wider text-cream-100 uppercase">
                  Contact Universe
                </h2>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-widest text-cream-200/50 font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border border-white/10 focus:border-gold-500 rounded-xl px-4 py-3 text-xs tracking-wider outline-none text-cream-100 transition-all duration-300"
                  placeholder="E.g. Alexander Mercer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-widest text-cream-200/50 font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/5 border border-white/10 focus:border-gold-500 rounded-xl px-4 py-3 text-xs tracking-wider outline-none text-cream-100 transition-all duration-300"
                  placeholder="alexander@luxury.com"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase tracking-widest text-cream-200/50 font-semibold">
                  Your Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white/5 border border-white/10 focus:border-gold-500 rounded-xl px-4 py-3 text-xs tracking-wider outline-none text-cream-100 transition-all duration-300 resize-none"
                  placeholder="Describe your corporate order or general inquiry..."
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3 text-xs font-bold uppercase tracking-widest text-cocoa-900 bg-gold-500 hover:bg-gold-400 rounded-xl transition-all duration-300 cursor-pointer text-center"
              >
                Send Transmission
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-16 h-16 rounded-full border border-gold-500 flex items-center justify-center text-gold-500 text-2xl mb-6">
                ✓
              </div>
              <h3 className="text-xl font-serif text-gold-500 uppercase tracking-widest mb-2">
                Transmission Received
              </h3>
              <p className="text-xs text-cream-200/60 leading-relaxed max-w-xs font-light">
                Thank you for reaching out. A ChocoVerse Concierge will respond to your luxury inquiry shortly.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
