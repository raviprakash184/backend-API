import { PartialType } from '@nestjs/swagger';
import { CreateSubCategoryDto } from './create-subcategorie.dto';

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {}
