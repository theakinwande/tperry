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
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('light-theme');
  };

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
                T PERRY
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
                Motion Designer
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
                src="/tperry.png" 
                alt="T Perry Logo" 
                width={120} 
                height={40}
                className={styles.logoImg}
              />
            </Link>
          </MagneticText>
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
            <MagneticText>
              <button 
                className={styles.themeToggle}
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                )}
              </button>
            </MagneticText>
          </div>
        </nav>

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
              <DistortText>Motion Designer</DistortText>
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
          <p>© 2024 T Perry. All rights reserved.</p>
        </footer>
      </motion.main>
    </>
  );
}
