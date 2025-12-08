'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

// Magnetic text component
function MagneticText({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) * 0.15;
    const y = (e.clientY - centerY) * 0.15;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.div>
  );
}

// Distortion text component
function DistortText({ children }: { children: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.span
      className={styles.distortText}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scaleX: isHovered ? 1.1 : 1,
        scaleY: isHovered ? 0.9 : 1,
        letterSpacing: isHovered ? '0.05em' : '-0.03em',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.span>
  );
}

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [introPhase, setIntroPhase] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Cinematic intro sequence
    const timer1 = setTimeout(() => setIntroPhase(1), 500);
    const timer2 = setTimeout(() => setIntroPhase(2), 1500);
    const timer3 = setTimeout(() => setIntroPhase(3), 2500);
    const timer4 = setTimeout(() => setShowIntro(false), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <>
      {/* CINEMATIC INTRO */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className={styles.intro}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div className={styles.introContent}>
              {/* Name reveal */}
              <motion.div
                className={styles.introName}
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={introPhase >= 1 ? { clipPath: 'inset(0 0% 0 0)' } : {}}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              >
                tperryskillz
              </motion.div>
              
              {/* Line */}
              <motion.div
                className={styles.introLine}
                initial={{ scaleX: 0 }}
                animate={introPhase >= 2 ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              />
              
              {/* Role */}
              <motion.div
                className={styles.introRole}
                initial={{ opacity: 0, y: 20 }}
                animate={introPhase >= 3 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                Designer
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <motion.main
        className={styles.main}
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Navigation */}
        <nav className={styles.nav}>
          <MagneticText>
            <Link href="/" className={styles.logo}>
              <Image 
                src="/tperry.svg" 
                alt="T Perry Logo" 
                width={150} 
                height={64}
                className={styles.logoImg}
              />
            </Link>
          </MagneticText>

          {/* Desktop Nav Links */}
          <div className={styles.navLinks}>
            <MagneticText>
              <Link href="/work" className={styles.navLink}>Work</Link>
            </MagneticText>
            <MagneticText>
              <a href="#about" className={styles.navLink}>About</a>
            </MagneticText>
            <MagneticText>
              <a href="#contact" className={styles.navLink}>Contact</a>
            </MagneticText>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className={styles.hamburger}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ''}`} />
            <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ''}`} />
            <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ''}`} />
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <Link href="/work" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Work</Link>
          <a href="#about" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#contact" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Contact</a>
        </div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
            >
              <DistortText>Creative</DistortText>
              <br />
              <DistortText>Designer</DistortText>
            </motion.h1>

            <motion.p
              className={styles.heroSubtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Crafting visual stories through motion, design & creativity
            </motion.p>

            <motion.div
              className={styles.heroCta}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <MagneticText>
                <Link href="/work" className={styles.ctaBtn}>
                  View Work
                  <span className={styles.ctaArrow}>→</span>
                </Link>
              </MagneticText>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <motion.div
            className={styles.heroCircle}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
          />
        </section>

        {/* About Section */}
        <section id="about" className={styles.about}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <DistortText>About</DistortText>
          </motion.h2>
          <motion.p
            className={styles.aboutText}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            I'm a motion designer and creative developer passionate about 
            bringing ideas to life through animation and visual storytelling.
          </motion.p>
        </section>

        {/* Contact Section */}
        <section id="contact" className={styles.contact}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <DistortText>Let's Talk</DistortText>
          </motion.h2>
          <motion.div
            className={styles.contactLinks}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <MagneticText>
              <a href="mailto:hello@tperry.com" className={styles.contactLink}>Email</a>
            </MagneticText>
            <MagneticText>
              <a href="#" className={styles.contactLink}>Twitter</a>
            </MagneticText>
            <MagneticText>
              <a href="#" className={styles.contactLink}>Instagram</a>
            </MagneticText>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>© 2025 tperry. All rights reserved.</p>
        </footer>
      </motion.main>
    </>
  );
}
