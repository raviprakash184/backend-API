import { Test, TestingModule } from '@nestjs/testing';
import { SubcategorieService } from './subcategorie.service';

describe('SubcategorieService', () => {
  let service: SubcategorieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubcategorieService],
    }).compile();

    service = module.get<SubcategorieService>(SubcategorieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
