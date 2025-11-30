import { Test, TestingModule } from '@nestjs/testing';
import { PartController } from './part.controller';
import { PartService } from './part.service';

const mockPartService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('PartController', () => {
  let controller: PartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartController],
      providers: [{ provide: PartService, useValue: mockPartService }],
    }).compile();

    controller = module.get<PartController>(PartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
