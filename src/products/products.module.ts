import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {ProductsService} from './products.service';
import {ProductsController} from './products.controller';
import {Product, ProductSchema} from "./schemas/product.schema";
import {FilesModule} from "../files/files.module";
import {ProductCategory, ProductCategorySchema} from "../product-category/schemas/product-category.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema
      },
      {
        name: ProductCategory.name,
        schema: ProductCategorySchema
      }
    ], "club"),
    FilesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {
}
