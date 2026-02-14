import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create Admin User
    const adminEmail = 'admin@uiet.com';
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash: hashedPassword,
                name: 'System Admin',
                role: 'ADMIN',
                isApproved: true,
                department: 'UIET',
            }
        });
        console.log('✅ Admin user created: admin@uiet.com / admin123');
    } else {
        console.log('ℹ️ Admin user already exists');
    }

    // Create some sample classrooms
    const classrooms = [
        { name: 'Room 101', building: 'Block A', floor: 1, capacity: 60, features: ['Projector', 'AC'] },
        { name: 'Room 201', building: 'Block B', floor: 2, capacity: 40, features: ['Whiteboard'] },
        { name: 'Lab 1', building: 'IT Block', floor: 3, capacity: 30, features: ['Computers', 'AC', 'Projector'] },
    ];

    for (const cr of classrooms) {
        const existing = await prisma.classroom.findFirst({
            where: { name: cr.name, building: cr.building }
        });
        if (!existing) {
            await prisma.classroom.create({ data: cr });
            console.log(`✅ Classroom created: ${cr.name}`);
        }
    }

    console.log('🏁 Seeding finished!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
