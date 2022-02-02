import {Model} from "mongoose";
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {FilesService} from "../files/files.service";
import {CreateProductCategoryDto} from './dto/create-product-category.dto';
import {UpdateProductCategoryDto} from './dto/update-product-category.dto';
import {ProductCategory, ProductCategoryDocument} from "./schemas/product-category.schema";
import {FindException} from "../_exceptions/find.exception";
import {UpdateException} from "../_exceptions/update.exception";
import {RemoveException} from "../_exceptions/remove.exception";
import {ProductsService} from "../products/products.service";
import {Product, ProductDocument} from "../products/schemas/product.schema";

@Injectable()
export class ProductCategoryService {
  constructor(@InjectModel(ProductCategory.name) private productCategoryModel: Model<ProductCategoryDocument>,
              @InjectModel(Product.name) private productModel: Model<ProductDocument>,
              private filesService: FilesService) {
  }
  
  async create(createProductCategoryDto: CreateProductCategoryDto) {
    let newProduct = new this.productCategoryModel(createProductCategoryDto);
    
    return await newProduct.save()
  }
  
  findAll() {
    return this.productCategoryModel.find().exec()
  }
  
  findOne(id: string) {
    return this.productCategoryModel.findById(id).exec()
  }
  
  async update(id: string, updateProductCategoryDto: UpdateProductCategoryDto) {
    const categoryToUpdate = await this.checkExistence(id);
    
    // If trying to add a new Thumbnail while already existing one,
    // block the user and throw an error. The thumbnail must first be manually removed.
    if (updateProductCategoryDto.thumbnail && categoryToUpdate.thumbnail) {
      // when throwing an error there is no need to manually remove the uploaded files
      // because this will be done by the server who proxied this call.
      
      throw new UpdateException("Can't change the thumbnail. First must be removed the existing one.")
    }
    
    return this.productCategoryModel.findByIdAndUpdate(id, updateProductCategoryDto as any, {new: true})
  }
  
  async remove(id: string) {
    const categoryToUpdate = await this.checkExistence(id);
    
    await this.checkIfUsed(id);
    
    try {
      await this.removeThumbnail(id, categoryToUpdate)
      await categoryToUpdate.delete()
    } catch (er) {
      throw new RemoveException(er.message)
    }
  }
  
  async removeThumbnail (id: string, category?: ProductCategoryDocument): Promise<ProductCategory> {
    /*
   By default tries to read the product from the params of the function
    */
    let categoryToUpdate: ProductCategoryDocument = category;
  
    /*
    If the product in the params of the function is null
    but the productId is provided, find the relative product
     */
    if (id && !categoryToUpdate) {
      categoryToUpdate = await this.productCategoryModel.findById(id)
    }
    
    if (!categoryToUpdate) {
      throw new RemoveException("Can't find the requested product category")
    }
    
    try {
      // Wait for the files cancellation call
      await this.filesService.delete([categoryToUpdate.thumbnail.id])
  
      categoryToUpdate.thumbnail = null
  
      await categoryToUpdate.save()
  
      return this.productCategoryModel.findById(id)
  
    } catch (er) {
      throw new RemoveException(er.message, er.status)
    }
  }
  
  /**
   * Check if the provided ids really exists or not.
   */
  async checkExistence(id: string): Promise<ProductCategoryDocument> {
    if (!id) {
      return
    }
    
    const category = await this.productCategoryModel.findById(id).exec()
    
    if (!category) {
      throw new FindException("Can't find one or more of the specified categories")
    }
    
    return category
  }
  
  /**
   * Check if a category is used in any product.
   * This can be useful when trying to delete a cateory. If used can't delete it otherwise the ref will be lost.
   */
  async checkIfUsed(id: string) {
    const products = await this.productModel.find({categories: id}).exec();
    
    if (products && products.length > 0) {
      throw new RemoveException("Can't remove this category because in use. First remove it from the various products.")
    }
  }
}
