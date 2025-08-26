import { Test, TestingModule } from '@nestjs/testing';
import { SubcategorieController } from './subcategorie.controller';

describe('SubcategorieController', () => {
  let controller: SubcategorieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubcategorieController],
    }).compile();

    controller = module.get<SubcategorieController>(SubcategorieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
