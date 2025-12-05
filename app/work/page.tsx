'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import styles from './work.module.css';

const projects = [
  { id: 1, title: 'Project Alpha', category: 'Motion Design', year: '2024' },
  { id: 2, title: 'Brand Vision', category: 'Visual Identity', year: '2024' },
  { id: 3, title: 'Fluid Motion', category: 'Animation', year: '2023' },
  { id: 4, title: 'Digital Dreams', category: 'Video Edit', year: '2023' },
  { id: 5, title: 'Abstract Flow', category: 'Motion Design', year: '2023' },
  { id: 6, title: 'Minimal Impact', category: 'Graphics', year: '2022' },
];

// Magnetic effect component
function MagneticElement({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) * 0.1;
    const y = (e.clientY - centerY) * 0.1;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

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

export default function WorkPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    if (scrollRef.current) {
      setScrollWidth(scrollRef.current.scrollWidth - window.innerWidth);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollWidth]);

  return (
    <div className={styles.wrapper}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <MagneticElement>
          <Link href="/" className={styles.logo}>
            <Image 
              src="/tperry.png" 
              alt="T Perry Logo" 
              width={120} 
              height={40}
              className={styles.logoImg}
            />
          </Link>
        </MagneticElement>
        <MagneticElement>
          <Link href="/" className={styles.backLink}>← Back</Link>
        </MagneticElement>
      </nav>

      {/* Page Title */}
      <motion.div
        className={styles.pageHeader}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={styles.pageTitle}>Selected Work</h1>
        <p className={styles.pageSubtitle}>Scroll to explore →</p>
      </motion.div>

      {/* Horizontal Scroll Container */}
      <div ref={containerRef} className={styles.scrollContainer}>
        <div className={styles.sticky}>
          <motion.div
            ref={scrollRef}
            className={styles.horizontal}
            style={{ x }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className={styles.project}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <MagneticElement className={styles.projectInner}>
                  <div className={styles.projectImage}>
                    <span className={styles.projectNumber}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className={styles.projectInfo}>
                    <h2 className={styles.projectTitle}>{project.title}</h2>
                    <div className={styles.projectMeta}>
                      <span>{project.category}</span>
                      <span>{project.year}</span>
                    </div>
                  </div>
                </MagneticElement>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer hint */}
      <div className={styles.scrollHint}>
        <span>Keep scrolling</span>
      </div>
    </div>
  );
}
