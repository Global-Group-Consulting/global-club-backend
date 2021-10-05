import {FindException} from "../_exceptions/find.exception";

export abstract class BasicService {
  abstract model: any;
  
  protected async findOrFail<T>(id: string): Promise<T> {
    const item = await this.model.findById(id)
    
    if (!item) {
      throw new FindException()
    }
    
    return item
  }
}
