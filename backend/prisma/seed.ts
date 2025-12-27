import { PrismaClient, Sender } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create a sample conversation
    const conversation = await prisma.conversation.create({
        data: {
            metadata: {
                source: 'seed',
                demo: true,
            },
        },
    });

    console.log(`✅ Created conversation: ${conversation.id}`);

    // Create sample messages
    await prisma.message.createMany({
        data: [
            {
                conversationId: conversation.id,
                sender: Sender.USER,
                text: 'Hello! What are your support hours?',
                timestamp: new Date('2025-12-27T10:00:00Z'),
            },
            {
                conversationId: conversation.id,
                sender: Sender.AI,
                text: 'Hello! Our support team is available Monday through Friday, 9 AM to 6 PM EST. We also offer 24/7 email support for any urgent matters. How can I help you today?',
                timestamp: new Date('2025-12-27T10:00:02Z'),
            },
            {
                conversationId: conversation.id,
                sender: Sender.USER,
                text: 'Do you offer free shipping?',
                timestamp: new Date('2025-12-27T10:01:00Z'),
            },
            {
                conversationId: conversation.id,
                sender: Sender.AI,
                text: 'Yes! We offer free shipping on all orders over $50. Orders typically arrive within 3-5 business days. We ship to the USA, Canada, and the UK.',
                timestamp: new Date('2025-12-27T10:01:03Z'),
            },
        ],
    });

    console.log('✅ Created sample messages');
    console.log('🎉 Seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
