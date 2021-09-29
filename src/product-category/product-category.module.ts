import {forwardRef, Module} from '@nestjs/common';
import {ProductCategoryService} from './product-category.service';
import {ProductCategoryController} from './product-category.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {ProductCategory, ProductCategorySchema} from "./schemas/product-category.schema";
import {FilesModule} from "../files/files.module";
import {ProductsModule} from "../products/products.module";
import {Product, ProductSchema} from "../products/schemas/product.schema";

@Module({
  imports: [
    forwardRef(() => ProductsModule),
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
