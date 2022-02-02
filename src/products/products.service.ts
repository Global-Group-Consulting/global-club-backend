import { Model } from "mongoose";
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from "./schemas/product.schema";
import { RemoveException } from "../_exceptions/remove.exception";
import { UpdateException } from "../_exceptions/update.exception";
import { FilesService } from "../files/files.service";
import { Attachment } from "../_schemas/attachment.schema";
import { FindException } from "../_exceptions/find.exception";
import { ProductCategory, ProductCategoryDocument } from "../product-category/schemas/product-category.schema";
import { PaginatedFindAllProductDto } from './dto/paginated-find-all-product.dto';
import { BasicService } from '../_basics/BasicService';
import { ConfigService } from '@nestjs/config';
import { PaginatedResultProductDto } from './dto/paginated-result-product.dto';
import { FindAllUserFilterMap } from '../users/dto/filters/find-all-user.filter';
import { FindAllProductsFilterMap } from './dto/filters/find-all-products.filter';
import { AuthRequest } from '../_basics/AuthRequest';

@Injectable()
export class ProductsService extends BasicService {
  model: Model<ProductDocument>
  
  constructor (@InjectModel(Product.name) private productModel: Model<ProductDocument>,
               @InjectModel(ProductCategory.name) private productCategoryModel: Model<ProductCategoryDocument>,
               private filesService: FilesService, protected config: ConfigService,
               @Inject("REQUEST") protected request: AuthRequest) {
    
    super()
    
    this.model = productModel;
  }
  
  private getFilesToDelete (foundProduct: Partial<Product>): string[] {
    // creates the array of string with the files that must be deleted
    // relative the stored product data
    const filesList: Attachment[] = [];
    
    if (!foundProduct) {
      return []
    }
    
    if (foundProduct.images) {
      filesList.push(...foundProduct.images)
    }
    
    if (foundProduct.thumbnail) {
      filesList.push(foundProduct.thumbnail)
    }
    
    return filesList.reduce((acc, curr) => {
      acc.push(curr.id)
      
      return acc;
    }, []);
    
  }
  
  async create (createProductDto: CreateProductDto): Promise<Product> {
    await this.checkCategoryExistence(createProductDto.categories)
    
    let newProduct = new this.productModel(createProductDto);
    
    return await newProduct.save()
  }
  
  async findAll (paginationData: PaginatedFindAllProductDto): Promise<PaginatedResultProductDto> {
    const query = this.prepareQuery((paginationData.filter ?? {}), FindAllProductsFilterMap)
    
    return this.findPaginated<Product>(query, paginationData);
  }
  
  async findOne (id: string): Promise<Product> {
    return this.findOrFail(id, null, { populate: ["categories"] });
  }
  
  async findByCategory (id: string): Promise<Product[]> {
    return this.productModel.find({ categories: id }).exec()
  }
  
  async update (id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const productToUpdate: ProductDocument = await this.productModel.findById(id).exec();
    
    if (!productToUpdate) {
      throw new FindException("Can't find the requested product")
    }
    
    // Check if provided categories really exists
    await this.checkCategoryExistence(updateProductDto.categories)
    
    // If trying to add a new Thumbnail while already existing one,
    // block the user and throw an error. The thumbnail must first be manually removed.
    if (updateProductDto.thumbnail && productToUpdate.thumbnail) {
      // when throwing an error there is no need to manually remove the uploaded files
      // because this will be done by the server who proxied this call.
      
      throw new UpdateException("Can't change the thumbnail. First must be removed the existing one.")
    }
  
    // if there are pushed new images to the images list, add them to the existing ones.
    if (updateProductDto.images) {
      // To add to a mongo array i must use the push method
      updateProductDto["$push"] = { images: { $each: updateProductDto.images } }
    
      delete updateProductDto.images
    }
  
    if (updateProductDto.priceUndefined) {
      updateProductDto.price = 0;
    }
  
    return this.productModel.findByIdAndUpdate(id, updateProductDto as any, { new: true, populate: ["categories"] })
  }
  
  async remove(id: string) {
    const foundProduct: ProductDocument = await this.productModel.findById(id);
    
    // I first check if the product exists, to avoid bugs or errors
    if (!foundProduct) {
      throw new RemoveException("Can't find the requested product")
    }
    
    const filesToDelete = this.getFilesToDelete(foundProduct)
    
    try {
      await this.removeFiles(filesToDelete, null, foundProduct)
      await foundProduct.delete()
    } catch (er) {
      throw new RemoveException(er.message)
    }
  }
  
  async removeFiles(filesToDelete: string[], productId?: string, product?: ProductDocument) {
    //
    // May be the case to check if the files really belongs to that product ??????
    //
    
    if (filesToDelete.length === 0) {
      return
    }
    
    /*
    By default tries to read the product from the params of the function
     */
    let productToUpdate: ProductDocument = product;
    
    /*
    If the product in the params of the function is null
    but the productId is provided, find the relative product
     */
    if (productId && !productToUpdate) {
      productToUpdate = await this.productModel.findById(productId)
    }
    
    if (!productToUpdate) {
      throw new RemoveException("Can't find the requested product")
    }
    
    try {
      // Wait for the files cancellation call
      await this.filesService.delete(filesToDelete)
      
      /*
      I must work on an external array otherwise th slice won't work while splicing the undesired image
       */
      const finalImages = [...productToUpdate.images]
      
      // for each file that must be deleted i must check where it exists,
      // if in the thumbnail or in the images
      filesToDelete.forEach(file => {
        if (productToUpdate?.thumbnail?.id === file) {
          productToUpdate.thumbnail = null;
          
          return;
        }
        
        // check if that image exists in the images array.
        const imgIndex = finalImages.findIndex(img => img.id === file);
        
        // if exists, removes it from the array
        if (imgIndex > -1) {
          finalImages.splice(imgIndex, 1)
        }
      })
  
      // If any image was removed, update the stored image
      if (finalImages.length !== productToUpdate.images.length) {
        productToUpdate.images = finalImages
      }
  
      await productToUpdate.save()
  
      return this.findOne(productToUpdate.id.toString())
    } catch (er) {
      throw new RemoveException(er.message, er.status)
    }
    
  }
  
  /**
   * Check if the provided ids really exists or not.
   */
  async checkCategoryExistence(ids: string[]): Promise<void | FindException> {
    if (!ids) {
      return
    }
    
    const categories = await this.productCategoryModel.find({_id: {$in: ids}}).exec()
    
    if (!categories || categories.length !== ids.length) {
      throw new FindException("Can't find one or more of the specified categories")
    }
  }
}
