const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Ahmed Ben Ali',
        email: 'ahmed.benali@investfarm.tn',
        phone: '+216 71 234 567',
        password: hashedPassword,
        role: 'ADMIN',
        address: '123 Habib Bourguiba Street, Tunis',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Fatma Trabelsi',
        email: 'fatma.trabelsi@investfarm.tn',
        phone: '+216 98 765 432',
        password: hashedPassword,
        role: 'USER',
        address: '456 Avenue Habib Bourguiba, Sfax',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Mohamed Khelil',
        email: 'mohamed.khelil@investfarm.tn',
        phone: '+216 22 345 678',
        password: hashedPassword,
        role: 'USER',
        address: '789 Rue de la République, Gabès',
      },
    }),
  ]);

  console.log('✅ Users created:', users.length);

  // Create equipment
  const equipment = await Promise.all([
    prisma.equipment.create({
      data: {
        name: 'John Deere Tractor 6120M',
        type: 'TRACTOR',
        price: 85000,
        status: 'AVAILABLE',
        description: 'High-performance 120HP tractor for heavy farming',
      },
    }),
    prisma.equipment.create({
      data: {
        name: 'New Holland Harvester',
        type: 'HARVESTER',
        price: 150000,
        status: 'RENTED',
        description: 'Combine harvester for wheat and barley',
      },
    }),
    prisma.equipment.create({
      data: {
        name: 'Smart Irrigation System',
        type: 'IRRIGATION',
        price: 35000,
        status: 'AVAILABLE',
        description: 'Automated drip irrigation with sensors',
      },
    }),
  ]);

  console.log('✅ Equipment created:', equipment.length);

  // Create lands
  const lands = await Promise.all([
    prisma.land.create({
      data: {
        name: 'Olive Grove Estate',
        location: 'Sfax, Tunisia',
        size: 25,
        price: 850000,
        status: 'AVAILABLE',
        description: 'Premium olive grove with mature trees',
        userId: users[0].id,
      },
    }),
    prisma.land.create({
      data: {
        name: 'Date Palm Oasis',
        location: 'Gabès, Tunisia',
        size: 18,
        price: 650000,
        status: 'AVAILABLE',
        description: 'Beautiful date palm plantation',
        userId: users[1].id,
      },
    }),
    prisma.land.create({
      data: {
        name: 'Cereal Farm Plains',
        location: 'Béja, Tunisia',
        size: 120,
        price: 1800000,
        status: 'RENTED',
        description: 'Large-scale cereal production land',
        userId: users[2].id,
      },
    }),
  ]);

  console.log('✅ Lands created:', lands.length);

  // Create orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        userId: users[1].id,
        totalAmount: 450,
        status: 'COMPLETED',
        orderItems: {
          create: [
            {
              quantity: 2,
              price: 225,
              equipmentId: equipment[0].id,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[2].id,
        totalAmount: 3200,
        status: 'PENDING',
        orderItems: {
          create: [
            {
              quantity: 1,
              price: 3200,
              equipmentId: equipment[2].id,
            },
          ],
        },
      },
    }),
  ]);

  console.log('✅ Orders created:', orders.length);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
