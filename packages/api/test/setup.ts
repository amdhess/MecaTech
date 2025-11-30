import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function cleanDatabase() {
  await prisma.partsOnServiceOrders.deleteMany();
  await prisma.serviceOrder.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.client.deleteMany();
  await prisma.part.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
}
