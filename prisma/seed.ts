import pkg from '@prisma/client';
import bcrypt from 'bcryptjs';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.admin.upsert({
        where: { email: 'oyewusitemitayoxyz@gmail.com' },
        update: {},
        create: {
            email: 'oyewusitemitayoxyz@gmail.com',
            password: hashedPassword,
        },
    });

    console.log('Admin user created:', admin.email);

    // Create sample projects
    const projects = [
        { title: 'Project Alpha', category: 'Motion Design', year: '2024', order: 0 },
        { title: 'Brand Vision', category: 'Visual Identity', year: '2024', order: 1 },
        { title: 'Fluid Motion', category: 'Animation', year: '2023', order: 2 },
    ];

    for (const project of projects) {
        await prisma.project.upsert({
            where: { id: project.order + 1 },
            update: {},
            create: project,
        });
    }

    console.log('Sample projects created');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
