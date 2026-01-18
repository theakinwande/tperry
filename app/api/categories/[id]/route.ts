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

// PUT update category
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
        const { name, order } = body;

        const category = await prisma.category.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name }),
                ...(order !== undefined && { order }),
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

// DELETE category
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!verifyAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;

        // Check if category has projects
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) },
            include: { _count: { select: { projects: true } } }
        });

        if (category && category._count.projects > 0) {
            return NextResponse.json(
                { error: 'Cannot delete category with projects. Move or delete projects first.' },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: 'Category deleted' });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
