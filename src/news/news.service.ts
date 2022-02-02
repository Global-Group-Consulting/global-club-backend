import { Inject, Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NewsService {
  constructor (@Inject('NEWS_MICROSERVICE') private client: ClientProxy) {}
  
  async onApplicationBootstrap () {
    await this.client.connect();
  }
  
  create (createNewsDto: CreateNewsDto) {
    return 'This action adds a new news';
  }
  
  findAll () {
    return this.client.send("findAllNews", "");
  }
  
  findOne (id: number) {
    return `This action returns a #${id} news`;
  }
  
  update (id: number, updateNewsDto: UpdateNewsDto) {
    return `This action updates a #${id} news`;
  }
  
  remove (id: number) {
    return `This action removes a #${id} news`;
  }
}
