import {FilterMap} from '../../../_basics/FilterMap.dto';
import {FindAllOrdersFilter} from '../../../orders/dto/filters/find-all-orders.filter';
import {Product} from '../../schemas/product.schema';
import {toString} from '../../../_basics/transformers/toString';
import {toRegExp} from '../../../_basics/transformers/toRegExp';
import {castToObjectId} from '../../../utilities/Formatters';
import {toObjectIdArray} from '../../../_basics/transformers/toObjectIdArray';
import {ApiProperty} from '@nestjs/swagger';
import {IsArray, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString} from 'class-validator';
import {ToArray} from '../../../_basics/transformers/toArray';
import {IsMongoIdArray} from '../../../_basics/validators/IsMongoIdArray';
import {ToBoolean, toBoolean} from "../../../_basics/transformers/toBoolean";

export class FindAllProductsFilter implements Partial<Product> {
  @ApiProperty({
    name: "filter[title]",
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;
  
  @ApiProperty({
    name: "filter[description]",
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;
  
  @ApiProperty({
    name: "filter[categories]",
    required: false
  })
  @IsOptional()
  @ToArray()
  @IsMongoId({each: true})
  categories?: string[];
  
  visible?: boolean
  
  @IsOptional()
  @ToBoolean()
  priceUndefined?: boolean
}

export const FindAllProductsFilterMap: FilterMap<FindAllProductsFilter> = {
  title: {
    castValue: toString,
    query: toRegExp
  },
  description: {
    castValue: toString,
    query: toRegExp
  },
  categories: {
    castValue: toObjectIdArray,
    query: value => ({$in: value})
  },
  visible: {
    castValue: toBoolean
  },
  priceUndefined: {
    castValue: toBoolean
  }
}
