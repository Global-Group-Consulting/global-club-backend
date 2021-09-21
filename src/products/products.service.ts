import {Model} from "mongoose";
import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {ConfigService} from "@nestjs/config";
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {Product, ProductDocument, ProductImage} from "./schemas/product.schema";
import {RemoveException} from "../_exceptions/remove.exception";
import {AxiosService} from "../axios/axios.service";
import {UpdateException} from "../_exceptions/update.exception";

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>,
              private httpService: AxiosService,
              private configService: ConfigService) {
  }
  
  private getFilesToDelete(foundProduct: Partial<Product>): string[] {
    // creates the array of string with the files that must be deleted
    // relative the stored product data
    const filesList: ProductImage[] = [];
    
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
  
  async create(createProductDto: CreateProductDto): Promise<Product> {
    let newProduct = null;
    
    try {
      newProduct = new this.productModel(createProductDto);
      
      return await newProduct.save()
    } catch (er) {
      
      await this.removeFiles(this.getFilesToDelete(newProduct))
      
      return er
    }
  }
  
  async findAll(): Promise<Product[]> {
    return this.productModel.find();
  }
  
  async findOne(id: string): Promise<Product> {
    return this.productModel.findById(id);
  }
  
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const productToUpdate: ProductDocument = await this.productModel.findById(id).exec();
    
    // If trying to add a new Thumbnail while already existing one,
    // block the user and throw an error. The thumbnail must first be manually removed.
    if (updateProductDto.thumbnail && productToUpdate.thumbnail) {
      // when throwing an error there is no neet to manually remove the uploaded files
      // because this will be done by the server who proxied this call.
      
      throw new UpdateException("Can't change the thumbnail. First must be removed the existing one.")
    }
    
    // if there are pushed new images to the images list, add them to the existing ones.
    if (updateProductDto.images) {
      // To add to a mongo array i must use the push method
      updateProductDto["$push"] = {images: {$each: updateProductDto.images}}
      
      delete updateProductDto.images
    }
    
    return this.productModel.findByIdAndUpdate(id, updateProductDto, {new: true})
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
      const deleteObserver = await this.httpService.delete(this.configService.get<string>("http.deletePath"), {
        data: {
          filesToDelete
        }
      })
      
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
      
    } catch (er) {
      throw  new RemoveException(er.response?.statusText || er.message)
    }
    
  }
}
