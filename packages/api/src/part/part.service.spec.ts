import { Test, TestingModule } from '@nestjs/testing';
import { PartService } from './part.service';
import { PrismaService } from 'src/prisma/prisma.service';

const mockPrismaService = {
  part: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  partsOnServiceOrders: {
    findFirst: jest.fn(),
  },
};

describe('PartService', () => {
  let service: PartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PartService>(PartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
