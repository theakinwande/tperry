'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './projects.module.css';

interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string | null;
  imageUrl: string | null;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <div className={styles.actions}>
          <Link href="/admin/projects/new" className={styles.addButton}>
            + Add Project
          </Link>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : projects.length === 0 ? (
        <div className={styles.empty}>
          <p>No projects yet</p>
          <Link href="/admin/projects/new" className={styles.addButton}>
            Create your first project
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {projects.map((project) => (
            <div key={project.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{project.title}</h2>
                <span className={styles.cardYear}>{project.year}</span>
              </div>
              <p className={styles.cardCategory}>{project.category}</p>
              {project.description && (
                <p className={styles.cardDescription}>{project.description}</p>
              )}
              <div className={styles.cardActions}>
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className={styles.editButton}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(project.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
