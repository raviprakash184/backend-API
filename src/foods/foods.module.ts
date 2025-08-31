import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';
import { Food, FoodSchema } from './schemas/food.schema';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { Restaurant, RestaurantSchema } from './schemas/restaurant.schema';
import { SubCategory } from '../subcategorie/schemas/subcategory.schema';
import { SubCategorySchema } from '../subcategorie/schemas/subcategory.schema';
import { Category } from '../category/schemas/category.schema';
import { CategorySchema } from '../category/schemas/category.schema';
// Removed duplicate category controller, service, and schema. Use unified category module instead.

@Module({
  imports: [
    MongooseModule.forFeature([
  { name: Food.name, schema: FoodSchema },
  { name: Restaurant.name, schema: RestaurantSchema },
  { name: SubCategory.name, schema: SubCategorySchema },
  { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [FoodsController, RestaurantsController],
  providers: [FoodsService, RestaurantsService],
})
export class FoodsModule {}
