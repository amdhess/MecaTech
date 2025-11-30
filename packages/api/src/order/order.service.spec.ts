import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from 'src/prisma/prisma.service';

const mockPrismaService = {
  serviceOrder: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  part: { findUnique: jest.fn(), update: jest.fn() },
  service: { findMany: jest.fn() },
  $transaction: jest
    .fn()
    .mockImplementation((cb: (tx: any) => Promise<any>) => {
      return cb(mockPrismaService);
    }),
};

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
