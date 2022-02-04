import { FilterMap } from '../../../_basics/FilterMap.dto';
import {ProductCategory} from "../../schemas/product-category.schema";

export class FindAllProductCategoriesFilter implements Partial<ProductCategory> {

}

export const FindAllProductCategoriesFilterMap: FilterMap<FindAllProductCategoriesFilter> = {

}
