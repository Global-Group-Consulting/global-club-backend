import { IsArray, IsNotEmpty } from 'class-validator';

export class DeleteProductFilesDto  {
  @IsArray()
  @IsNotEmpty()
  filesToDelete: string[]
}
