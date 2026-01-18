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

// GET all categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { order: 'asc' },
            include: {
                _count: {
                    select: { projects: true }
                }
            }
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

// POST create new category
export async function POST(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }

        // Check if category already exists
        const existing = await prisma.category.findUnique({
            where: { name }
        });

        if (existing) {
            return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
        }

        const categoryCount = await prisma.category.count();

        const category = await prisma.category.create({
            data: {
                name,
                order: categoryCount,
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
