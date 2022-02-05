import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import {ProductCategoryService} from './product-category.service';
import {CreateProductCategoryDto} from './dto/create-product-category.dto';
import {UpdateProductCategoryDto} from './dto/update-product-category.dto';
import {ApiBasicAuth, ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {ReadDto} from "../_basics/read.dto";
import {ProductCategory} from './schemas/product-category.schema';
import {PaginatedFindAllProductCategoriesDto} from "./dto/paginated-find-all-product-categories.dto";
import {PaginatedResultProductCategoryDto} from "./dto/paginated-result-product-category.dto";

@ApiBearerAuth()
@ApiBasicAuth("client-key")
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
  findAll(@Query() paginationQuery: PaginatedFindAllProductCategoriesDto): Promise<PaginatedResultProductCategoryDto> {
    return this.productCategoryService.findAll(paginationQuery);
  }
  
  @Get("/raw")
  findAllRaw(): Promise<ProductCategory[]> {
    return this.productCategoryService.findAllRaw();
  }
  
  @Get(':id')
  findOne(@Param() params: ReadDto): Promise<ProductCategory> {
    return this.productCategoryService.findOne(params.id);
  }
  
  @Patch(':id')
  update(@Param() params: ReadDto, @Body() updateProductCategoryDto: UpdateProductCategoryDto): Promise<ProductCategory> {
    return this.productCategoryService.update(params.id, updateProductCategoryDto);
  }
  
  @Delete(':id')
  remove(@Param() params: ReadDto) {
    return this.productCategoryService.remove(params.id);
  }
  
  @Delete(':id/thumbnail')
  removeThumbnail (@Param() params: ReadDto): Promise<ProductCategory> {
    return this.productCategoryService.removeThumbnail(params.id);
  }
}
