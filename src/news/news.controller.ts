import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Controller("/news")
export class NewsController {
  constructor (private readonly newsService: NewsService) {}
  
  @Get('createNews')
  create (@Payload() createNewsDto: CreateNewsDto) {
    
    return this.newsService.create(createNewsDto);
  }
  
  @Get('/')
  findAll () {
    return this.newsService.findAll();
  }
  
  @Get('findOneNews')
  findOne (@Payload() id: number) {
    return this.newsService.findOne(id);
  }
  
  @Get('updateNews')
  update (@Payload() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(updateNewsDto.id, updateNewsDto);
  }
  
  @Get('removeNews')
  remove (@Payload() id: number) {
    return this.newsService.remove(id);
  }
}
