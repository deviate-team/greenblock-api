import { Test, TestingModule } from '@nestjs/testing';
import { OffsetController } from './offset.controller';
import { OffsetService } from './offset.service';

describe('OffsetController', () => {
  let controller: OffsetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffsetController],
      providers: [OffsetService],
    }).compile();

    controller = module.get<OffsetController>(OffsetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
