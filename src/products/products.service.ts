import {Model} from "mongoose";
import {lastValueFrom} from "rxjs";
import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {InjectModel} from "@nestjs/mongoose";
import {ConfigService} from "@nestjs/config";
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {DeleteProductFilesDto} from "./dto/delete-product-files.dto";
import {Product, ProductDocument} from "./schemas/product.schema";
import {RemoveException} from "../_exceptions/remove.exception";
import {AxiosService} from "../axios/axios.service";

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>,
              private httpService: AxiosService,
              private configService: ConfigService) {
  }
  
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    
    return newProduct.save()
  }
  
  async findAll(): Promise<Product[]> {
    return this.productModel.find();
  }
  
  async findOne(id: string): Promise<Product> {
    return this.productModel.findById(id);
  }
  
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productModel.findByIdAndUpdate(id, updateProductDto, {new: true});
  }
  
  async remove(id: string) {
    const foundProduct: ProductDocument = await this.productModel.findById(id);
    
    // I first check if the product exists, to avoid bugs or errors
    if (!foundProduct) {
      throw new RemoveException("Can't find the requested product")
    }
    
    // creates the array of string with the files that must be deleted
    // relative the stored product data
    const filesToDelete: string[] = [...foundProduct.images, foundProduct.thumbnail].reduce((acc, curr) => {
      acc.push(curr.id)
      
      return acc;
    }, []);
    
    try {
      await this.removeFiles(filesToDelete)
      await foundProduct.delete()
    } catch (er) {
      throw new RemoveException(er.message)
    }
  }
  
  async removeFiles(filesToDelete: string[], productId?: string, product?: ProductDocument) {
    //
    // May be the case to check if the files realy belongs to that product ??????
    //
    
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
      
      // for each file that must be deleted i must check where it exists,
      // if in the thumbnail or in the images
      filesToDelete.forEach(file => {
        if (productToUpdate.thumbnail.id === file) {
          productToUpdate.thumbnail = null;
        }
        
        // check if that image exists in the images array.
        const imgIndex = productToUpdate.images.findIndex(img => img.id === file);
        
        // if exists, removes it from the array
        if (imgIndex > -1) {
          productToUpdate.images.splice(imgIndex, 1)
        }
      })
      
      await productToUpdate.save()
      
    } catch (er) {
      throw  new RemoveException(er.message)
    }
    
  }
}
