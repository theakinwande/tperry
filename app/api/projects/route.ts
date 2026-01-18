import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

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

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, category, year, description, imageUrl, videoUrl } = body;

    if (!title || !category || !year) {
      return NextResponse.json(
        { error: 'Title, category, and year are required' },
        { status: 400 }
      );
    }

    const projectCount = await prisma.project.count();

    const project = await prisma.project.create({
      data: {
        title,
        category,
        year,
        description: description || null,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        order: projectCount,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
