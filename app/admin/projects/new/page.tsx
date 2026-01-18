'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../projects.module.css';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    year: new Date().getFullYear().toString(),
    description: '',
    imageUrl: '',
    videoUrl: '',
  });

  // Track media type: 'image' | 'video' | null
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.type === 'video') {
          setFormData((prev) => ({ ...prev, videoUrl: data.url, imageUrl: '' }));
          setMediaType('video');
        } else {
          setFormData((prev) => ({ ...prev, imageUrl: data.url, videoUrl: '' }));
          setMediaType('image');
        }
      } else {
        const error = await res.json();
        alert(error.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveMedia = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '', videoUrl: '' }));
    setMediaType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/projects');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const mediaUrl = formData.videoUrl || formData.imageUrl;

  return (
    <div className={styles.container}>
      <Link href="/admin/projects" className={styles.backLink}>
        ← Back to Projects
      </Link>

      <div className={styles.form}>
        <h1 className={styles.formTitle}>New Project</h1>

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.formField}>
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Project name"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label htmlFor="category">Category *</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Motion Design"
                required
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="year">Year *</label>
              <input
                type="text"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="2024"
                required
              />
            </div>
          </div>

          <div className={styles.formField}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief project description..."
            />
          </div>

          {/* Single Media Upload (Image OR Video) */}
          <div className={styles.formField}>
            <label>Project Media (Image or Video)</label>
            <div className={styles.uploadArea}>
              {mediaUrl ? (
                <div className={styles.preview}>
                  {mediaType === 'video' ? (
                    <video 
                      src={formData.videoUrl} 
                      width={200} 
                      height={150}
                      className={styles.previewVideo}
                      controls
                    />
                  ) : (
                    <Image 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      width={200} 
                      height={150}
                      className={styles.previewImage}
                    />
                  )}
                  <button 
                    type="button" 
                    className={styles.removeButton}
                    onClick={handleRemoveMedia}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div 
                  className={styles.uploadBox}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? 'Uploading...' : 'Click to upload image or video'}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={loading || uploading}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  );
}
