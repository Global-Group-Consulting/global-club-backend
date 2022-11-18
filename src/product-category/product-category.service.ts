import { Model } from 'mongoose'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilesService } from '../files/files.service'
import { CreateProductCategoryDto } from './dto/create-product-category.dto'
import { UpdateProductCategoryDto } from './dto/update-product-category.dto'
import { ProductCategory, ProductCategoryDocument } from './schemas/product-category.schema'
import { FindException } from '../_exceptions/find.exception'
import { UpdateException } from '../_exceptions/update.exception'
import { RemoveException } from '../_exceptions/remove.exception'
import { ProductsService } from '../products/products.service'
import { Product, ProductDocument } from '../products/schemas/product.schema'
import { FindAllProductsFilterMap } from '../products/dto/filters/find-all-products.filter'
import { BasicService } from '../_basics/BasicService'
import { ConfigService } from '@nestjs/config'
import { AuthRequest } from '../_basics/AuthRequest'
import { PaginatedFindAllProductCategoriesDto } from './dto/paginated-find-all-product-categories.dto'
import { FindAllRawProductCategoriesDto } from './dto/find-all-raw-product-categories.dto'
import { FindAllProductCategoriesFilterMap } from './dto/filters/find-all-product-categories.filter'

@Injectable()
export class ProductCategoryService extends BasicService {
  model: Model<ProductCategoryDocument>
  
  constructor (@InjectModel(ProductCategory.name) private productCategoryModel: Model<ProductCategoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private filesService: FilesService, protected config: ConfigService,
    @Inject('REQUEST') protected request: AuthRequest) {
    super()
    
    this.model = productCategoryModel
  }
  
  async create (createProductCategoryDto: CreateProductCategoryDto) {
    let newProduct = new this.productCategoryModel(createProductCategoryDto)
    
    return await newProduct.save()
  }
  
  findAll (paginationData: PaginatedFindAllProductCategoriesDto) {
    const query = this.prepareQuery((paginationData.filter ?? {}), FindAllProductsFilterMap)
    
    return this.findPaginated<ProductCategory>(query, paginationData, {}, {
      populate: 'parent'
    })
  }
  
  findAllRaw (incomingQuery: FindAllRawProductCategoriesDto) {
    const query = this.prepareQuery((incomingQuery.filter ?? {}), FindAllProductCategoriesFilterMap)
    
    return this.model.find(query).sort({ title: 1 }).populate('parent').exec()
  }
  
  findOne (id: string) {
    return this.productCategoryModel.findById(id).exec()
  }
  
  async update (id: string, updateProductCategoryDto: UpdateProductCategoryDto) {
    const categoryToUpdate = await this.checkExistence(id)
    let mustUpdateChildrenLevels = false
    
    // If trying to add a new Thumbnail while already existing one,
    // block the user and throw an error. The thumbnail must first be manually removed.
    if (updateProductCategoryDto.thumbnail && categoryToUpdate.thumbnail) {
      // when throwing an error there is no need to manually remove the uploaded files
      // because this will be done by the server who proxied this call.
      
      throw new UpdateException('Can\'t change the thumbnail. First must be removed the existing one.')
    }
    
    // check if the parent has changed.
    // If so, must update the level of the category based on the level of the new parent
    if (updateProductCategoryDto.parent !== categoryToUpdate.parent?.toString()) {
      // If there is no parent, simply set the level to 0
      // Otherwise, get the level of the parent
      if (!updateProductCategoryDto.parent) {
        updateProductCategoryDto.level = 0
      } else {
        const newParent = await this.checkExistence(updateProductCategoryDto.parent)
        
        updateProductCategoryDto.level = newParent.level + 1
      }
      
      mustUpdateChildrenLevels = true
    }
    
    const updateResult = await this.productCategoryModel.findByIdAndUpdate(id, updateProductCategoryDto as any, { new: true }).exec()
    
    // Must also check if this category has children. If so, must update the level of each children
    if (mustUpdateChildrenLevels) {
      await this.checkAndUpdateChildrenLevels(updateResult)
    }
    
    return updateResult
  }
  
  async remove (id: string) {
    const categoryToUpdate = await this.checkExistence(id)
    
    await this.checkIfUsed(id)
    
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
    let categoryToUpdate: ProductCategoryDocument = category
    
    /*
    If the product in the params of the function is null
    but the productId is provided, find the relative product
     */
    if (id && !categoryToUpdate) {
      categoryToUpdate = await this.productCategoryModel.findById(id)
    }
    
    if (!categoryToUpdate) {
      throw new RemoveException('Can\'t find the requested product category')
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
  async checkExistence (id: string): Promise<ProductCategoryDocument> {
    if (!id) {
      return
    }
    
    const category = await this.productCategoryModel.findById(id).exec()
    
    if (!category) {
      throw new FindException('Can\'t find one or more of the specified categories')
    }
    
    return category
  }
  
  /**
   * Check if a category is used in any product.
   * This can be useful when trying to delete a cateory. If used can't delete it otherwise the ref will be lost.
   */
  async checkIfUsed (id: string) {
    const products = await this.productModel.find({ categories: id }).exec()
    
    if (products && products.length > 0) {
      throw new RemoveException('Can\'t remove this category because in use. First remove it from the various products.')
    }
  }
  
  async checkAndUpdateChildrenLevels (category: ProductCategoryDocument) {
    const children = await this.productCategoryModel.find({ parent: category._id }).exec()
    
    if (children && children.length > 0) {
      for (const child of children) {
        child.level = category.level + 1
        
        await child.save()
        
        await this.checkAndUpdateChildrenLevels(child)
      }
    }
  }
}
