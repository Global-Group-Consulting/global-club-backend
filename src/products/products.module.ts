import {Module} from '@nestjs/common';
import {HttpModule} from "@nestjs/axios";
import {MongooseModule} from "@nestjs/mongoose";
import {ProductsService} from './products.service';
import {ProductsController} from './products.controller';
import {Product, ProductSchema} from "./schemas/product.schema";
import {HttpConfigService} from "../_configServices/HttpConfigService";
import {AxiosModule} from "../axios/axios.module";

@Module({
  imports: [
    MongooseModule.forFeature([{name: Product.name, schema: ProductSchema}], "club"),
    AxiosModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {
}
