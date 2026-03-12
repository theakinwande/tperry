'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

/* ─── Magnetic hover component ─── */
function MagneticText({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setPosition({
      x: (e.clientX - centerX) * 0.15,
      y: (e.clientY - centerY) * 0.15,
    });
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Stagger animation ease ─── */
const entryEase = [0.76, 0, 0.24, 1] as const;

export default function Home() {
  const [introReady, setIntroReady] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [introPhase, setIntroPhase] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('tperry-intro-seen') === '1';
    if (seen) {
      // Skip intro entirely
      setIntroPhase(3);
      setShowIntro(false);
      setIntroReady(true);
      return;
    }

    // First visit — play intro
    setShowIntro(true);
    setIntroReady(true);

    const t1 = setTimeout(() => setIntroPhase(1), 500);
    const t2 = setTimeout(() => setIntroPhase(2), 1500);
    const t3 = setTimeout(() => setIntroPhase(3), 2500);
    const t4 = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem('tperry-intro-seen', '1');
    }, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const services = 'MOTION GRAPHICS \u00A0◆\u00A0 BRAND DESIGN \u00A0◆\u00A0 VIDEO EDITING \u00A0◆\u00A0 DIGITAL ART \u00A0◆\u00A0 ';

  return (
    <>
      {/* ═══════ CINEMATIC INTRO ═══════ */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className={styles.intro}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div className={styles.introContent}>
              {/* Avatar with animated ring */}
              <motion.div
                className={styles.introAvatarWrap}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={introPhase >= 1 ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.6, ease: entryEase }}
              >
                <svg
                  className={`${styles.introAvatarRing} ${introPhase >= 1 ? styles.introAvatarRingAnimate : ''}`}
                  viewBox="0 0 100 100"
                >
                  <circle cx="50" cy="50" r="48" />
                </svg>
                <div className={`${styles.introAvatarInner} ${introPhase >= 2 ? styles.introAvatarColor : ''}`}>
                  <Image
                    src="/tperry-avatar.jpeg"
                    alt="T Perry"
                    width={120}
                    height={120}
                    className={styles.introAvatar}
                    priority
                  />
                </div>
              </motion.div>

              <motion.div
                className={styles.introName}
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={introPhase >= 1 ? { clipPath: 'inset(0 0% 0 0)' } : {}}
                transition={{ duration: 1, ease: entryEase, delay: 0.2 }}
              >
                tperry
              </motion.div>

              <motion.div
                className={styles.introLine}
                initial={{ scaleX: 0 }}
                animate={introPhase >= 2 ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, ease: entryEase }}
              />

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

      {/* ═══════ MAIN CONTENT ═══════ */}
      <motion.main
        className={styles.main}
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* ─── Navigation ─── */}
        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navMenuOpen : ''}`}>
          <MagneticText>
            <Link href="/" className={styles.logo}>
              tperry
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
          </div>

          <button
            className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </nav>

        {/* ─── Mobile Menu ─── */}
        <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <Link href="/work" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Work</Link>
          <a href="#about" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#contact" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Contact</a>
        </div>

        {/* ─── Hero ─── */}
        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>
              <motion.span
                className={styles.heroLabel}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Portfolio
              </motion.span>

              <motion.h1
                className={styles.heroTitle}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: entryEase }}
              >
                <span className={styles.heroTitleLine}>Tperry</span>
                <span className={`${styles.heroTitleLine} ${styles.heroTitleLineIndent}`}>the Designer</span>
              </motion.h1>

              <motion.p
                className={styles.heroDesc}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                Crafting visual stories through motion, design & creativity
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <MagneticText>
                  <Link href="/work" className={styles.ctaBtn}>
                    View Work
                    <span className={styles.ctaArrow}>→</span>
                  </Link>
                </MagneticText>
              </motion.div>
            </div>

            <motion.div
              className={styles.heroRight}
              initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
              animate={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.5, ease: entryEase }}
            >
              <div className={styles.heroImgWrap}>
                <Image
                  src="/tperry-avatar.jpeg"
                  alt="T Perry — Designer"
                  width={460}
                  height={580}
                  className={styles.heroImg}
                  priority
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Marquee ─── */}
        <div className={styles.marquee} aria-hidden="true">
          <div className={styles.marqueeTrack}>
            <span>{services}</span>
            <span>{services}</span>
            <span>{services}</span>
            <span>{services}</span>
          </div>
        </div>

        {/* ─── About ─── */}
        <section id="about" className={styles.section}>
          <div className={styles.sectionGrid}>
            <motion.div
              className={styles.sectionSidebar}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className={styles.sectionIndex}>01</span>
              <span className={styles.sectionLabel}>About</span>
            </motion.div>

            <motion.div
              className={styles.sectionContent}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className={styles.aboutQuote}>
                Design is how I think — visuals are just how I speak.
              </p>
              <div className={styles.aboutBody}>
                <p className={styles.aboutText}>
                  I&apos;m Temitayo Oyewusi, a multidisciplinary creative designer based in Nigeria, 
                  working under the alias <strong>tperry</strong>. I blend graphic design, motion, 
                  and digital art to build visual experiences that are bold, intentional, 
                  and impossible to scroll past.
                </p>
                <p className={styles.aboutText}>
                  Whether it&apos;s animating a brand identity, cutting a music video, 
                  or crafting a poster that stops you mid-scroll — every project starts 
                  with one question: <em>does this make someone feel something?</em> If not, 
                  it&apos;s not done yet.
                </p>
              </div>
              <div className={styles.aboutDisciplines}>
                <span className={styles.disciplineTag}>Motion Graphics</span>
                <span className={styles.disciplineTag}>Brand Design</span>
                <span className={styles.disciplineTag}>Video Editing</span>
                <span className={styles.disciplineTag}>Digital Art</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Contact ─── */}
        <section id="contact" className={`${styles.section} ${styles.sectionBorder}`}>
          <div className={styles.sectionGrid}>
            <motion.div
              className={styles.sectionSidebar}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className={styles.sectionIndex}>02</span>
              <span className={styles.sectionLabel}>Contact</span>
            </motion.div>

            <motion.div
              className={styles.sectionContent}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={styles.contactHeading}>
                Let&apos;s Work<br />Together
              </h2>

              <a
                href="mailto:oyewusitemitayoxyz@gmail.com"
                className={styles.contactEmail}
              >
                oyewusitemitayoxyz@gmail.com
              </a>

              <div className={styles.contactSocials}>
                <MagneticText>
                  <a href="https://x.com/tperryxyz" className={styles.socialLink} target="_blank" rel="noopener noreferrer">Twitter</a>
                </MagneticText>
                <MagneticText>
                  <a href="https://instagram.com/tperryxyz" className={styles.socialLink} target="_blank" rel="noopener noreferrer">Instagram</a>
                </MagneticText>
                <MagneticText>
                  <a href="https://tiktok.com/@tperryxyz" className={styles.socialLink} target="_blank" rel="noopener noreferrer">TikTok</a>
                </MagneticText>
                <MagneticText>
                  <a href="https://behance.net/temitayooyewusi" className={styles.socialLink} target="_blank" rel="noopener noreferrer">Behance</a>
                </MagneticText>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className={styles.footer}>
          <span>© 2026 tperry</span>
          <span>All rights reserved</span>
        </footer>
      </motion.main>
    </>
  );
}
