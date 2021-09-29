import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {ProductCategoryService} from './product-category.service';
import {CreateProductCategoryDto} from './dto/create-product-category.dto';
import {UpdateProductCategoryDto} from './dto/update-product-category.dto';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {ReadDto} from "../_basics/read.dto";

@ApiBearerAuth()
@ApiTags("ProductCategories")
@Controller('product-categories')
export class ProductCategoryController {
  constructor(private readonly productCategoryService: ProductCategoryService) {
  }
  
  @Post()
  create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoryService.create(createProductCategoryDto);
  }
  
  @Get()
  findAll() {
    return this.productCategoryService.findAll();
  }
  
  @Get(':id')
  findOne(@Param() params: ReadDto) {
    return this.productCategoryService.findOne(params.id);
  }
  
  @Patch(':id')
  update(@Param() params: ReadDto, @Body() updateProductCategoryDto: UpdateProductCategoryDto) {
    return this.productCategoryService.update(params.id, updateProductCategoryDto);
  }
  
  @Delete(':id')
  remove(@Param() params: ReadDto) {
    return this.productCategoryService.remove(params.id);
  }
  
  @Delete(':id/thumbnail')
  removeThumbnail(@Param() params: ReadDto) {
    return this.productCategoryService.removeThumbnail(params.id);
  }
}
