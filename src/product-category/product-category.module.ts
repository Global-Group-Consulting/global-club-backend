import {Module} from '@nestjs/common';
import {ProductCategoryService} from './product-category.service';
import {ProductCategoryController} from './product-category.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {ProductCategory, ProductCategorySchema} from "./schemas/product-category.schema";
import {FilesModule} from "../files/files.module";
import {Product, ProductSchema} from "../products/schemas/product.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductCategory.name,
        schema: ProductCategorySchema
      },
      {
        name: Product.name,
        schema: ProductSchema
      },
    ], "club"),
    FilesModule,
  ],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
  exports: [ProductCategoryService]
})
export class ProductCategoryModule {
}
