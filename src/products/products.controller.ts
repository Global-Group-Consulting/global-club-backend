import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common';
import {ProductsService} from './products.service';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiTags} from "@nestjs/swagger";
import {ReadProductDto} from "./dto/read-product.dto";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {DeleteProductFilesDto} from "./dto/delete-product-files.dto";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";

@ApiBearerAuth()
@ApiTags("Products")
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService,
              ) {
  }
  
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  
  @Get()
  findAll() {
    return this.productsService.findAll();
  }
  
  @Get(':id')
  findOne(@Param() params: ReadProductDto) {
    return this.productsService.findOne(params.id);
  }
  
  @Patch(':id')
  update(@Param() params: ReadProductDto, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(params.id, updateProductDto);
  }
  
  @Delete(':id')
  remove(@Param() params: ReadProductDto) {
    return this.productsService.remove(params.id);
  }
  
  @Delete(':id/files')
  async removeFiles(@Param() params: ReadProductDto, @Body() body: DeleteProductFilesDto) {
    return this.productsService.removeFiles(body.filesToDelete, params.id)
  }
}
