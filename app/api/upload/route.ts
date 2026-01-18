import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Helper to verify admin token
function verifyAdmin(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return false;

  try {
    jwt.verify(token, process.env.ADMIN_JWT_SECRET || 'fallback-secret');
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  // Verify admin access
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, MP4, WebM' }, { status: 400 });
    }

    // Determine folder based on file type
    const isVideo = file.type.startsWith('video/');
    const subfolder = isVideo ? 'videos' : 'images';
    const uploadDir = path.join(UPLOAD_DIR, subfolder);

    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Create unique filename
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    // Save file
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));

    // Return the public URL
    const publicUrl = `/uploads/${subfolder}/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      type: isVideo ? 'video' : 'image'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
