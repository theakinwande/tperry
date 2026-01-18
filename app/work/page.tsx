'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import styles from './work.module.css';

interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
}

interface CategoryFolder {
  name: string;
  projects: Project[];
  count: number;
}

// Fallback projects if API fails or no projects exist
const fallbackProjects: Project[] = [
  { id: 1, title: 'Project Alpha', category: 'Motion Graphics', year: '2024' },
  { id: 2, title: 'Brand Vision', category: 'Motion Graphics', year: '2024' },
  { id: 3, title: 'Fluid Motion', category: 'Sport Designs', year: '2023' },
  { id: 4, title: 'Digital Dreams', category: 'Sport Designs', year: '2023' },
  { id: 5, title: 'Abstract Flow', category: 'Visual Identity', year: '2023' },
  { id: 6, title: 'Minimal Impact', category: 'Visual Identity', year: '2022' },
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
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryFolder[]>([]);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setProjects(data);
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  // Group projects by category
  useEffect(() => {
    const grouped = projects.reduce((acc, project) => {
      const existing = acc.find(c => c.name === project.category);
      if (existing) {
        existing.projects.push(project);
        existing.count++;
      } else {
        acc.push({ name: project.category, projects: [project], count: 1 });
      }
      return acc;
    }, [] as CategoryFolder[]);
    setCategories(grouped);
  }, [projects]);

  const handleFolderClick = (categoryName: string) => {
    setOpenFolder(openFolder === categoryName ? null : categoryName);
  };

  return (
    <div className={styles.wrapper}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <MagneticElement>
          <Link href="/" className={styles.logo}>
            <Image 
              src="/tperry.svg" 
              alt="T Perry Logo" 
              width={150} 
              height={64}
              className={styles.logoImg}
            />
          </Link>
        </MagneticElement>
        <MagneticElement>
          <Link href="/" className={styles.backLink}>← Back</Link>
        </MagneticElement>
      </nav>

      {/* Page Header */}
      <motion.div
        className={styles.pageHeader}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={styles.pageTitle}>Selected Work</h1>
        <p className={styles.pageSubtitle}>Browse by category</p>
      </motion.div>

      {/* Folder Grid */}
      <div className={styles.folderContainer}>
        <div className={styles.folderGrid}>
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <MagneticElement>
                <div 
                  className={`${styles.folder} ${openFolder === category.name ? styles.folderOpen : ''}`}
                  onClick={() => handleFolderClick(category.name)}
                >
                  <div className={styles.folderTab}></div>
                  <div className={styles.folderBody}>
                    <div className={styles.folderContent}>
                      <span className={styles.folderName}>{category.name}</span>
                      <span className={styles.folderCount}>{category.count} projects</span>
                    </div>
                    <div className={styles.folderIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </MagneticElement>
            </motion.div>
          ))}
        </div>

        {/* Projects Panel (shown when folder is open) */}
        <AnimatePresence>
          {openFolder && (
            <motion.div
              className={styles.projectsPanel}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>{openFolder}</h2>
                <button 
                  className={styles.closeButton}
                  onClick={() => setOpenFolder(null)}
                >
                  ✕
                </button>
              </div>
              <div className={styles.projectsGrid}>
                {categories
                  .find(c => c.name === openFolder)
                  ?.projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      className={styles.projectCard}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className={styles.projectImage}>
                        {project.videoUrl ? (
                          <video
                            src={project.videoUrl}
                            className={styles.projectMedia}
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : project.imageUrl ? (
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className={styles.projectMedia}
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <span className={styles.projectNumber}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        )}
                      </div>
                      <div className={styles.projectInfo}>
                        <h3 className={styles.projectTitle}>{project.title}</h3>
                        <span className={styles.projectYear}>{project.year}</span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
