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

// GET single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, category, year, description, imageUrl, videoUrl, order } = body;

    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(category && { category }),
        ...(year && { year }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.project.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
