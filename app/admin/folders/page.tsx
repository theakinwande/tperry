'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../projects/projects.module.css';

interface Category {
  id: number;
  name: string;
  _count: {
    projects: number;
  };
}

export default function FoldersPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFolder, setNewFolder] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolder.trim()) return;

    setCreating(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolder.trim() }),
      });

      if (res.ok) {
        setNewFolder('');
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create folder');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder');
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async (id: number) => {
    if (!editName.trim()) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
      });

      if (res.ok) {
        setEditingId(null);
        setEditName('');
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update folder');
      }
    } catch (error) {
      console.error('Error updating folder:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this folder?')) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete folder');
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Folders</h1>
        <div className={styles.actions}>
          <Link href="/admin/projects" className={styles.addButton}>
            ← Projects
          </Link>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      {/* Create New Folder */}
      <form onSubmit={handleCreate} className={styles.createForm}>
        <input
          type="text"
          value={newFolder}
          onChange={(e) => setNewFolder(e.target.value)}
          placeholder="New folder name..."
          className={styles.createInput}
        />
        <button 
          type="submit" 
          className={styles.addButton}
          disabled={creating || !newFolder.trim()}
        >
          {creating ? 'Creating...' : '+ Create Folder'}
        </button>
      </form>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : categories.length === 0 ? (
        <div className={styles.empty}>
          <p>No folders yet</p>
          <p>Create your first folder above</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {categories.map((category) => (
            <div key={category.id} className={styles.card}>
              {editingId === category.id ? (
                <div className={styles.editRow}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={styles.editInput}
                    autoFocus
                  />
                  <button 
                    onClick={() => handleEdit(category.id)}
                    className={styles.editButton}
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setEditingId(null)}
                    className={styles.deleteButton}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>📁 {category.name}</h2>
                    <span className={styles.cardYear}>
                      {category._count.projects} projects
                    </span>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      onClick={() => startEditing(category)}
                      className={styles.editButton}
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className={styles.deleteButton}
                      disabled={category._count.projects > 0}
                      title={category._count.projects > 0 ? 'Remove projects first' : ''}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
