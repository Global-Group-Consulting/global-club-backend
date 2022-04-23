import { Controller, Get, Query, Redirect } from '@nestjs/common'
import { FinderQueryDto } from './dto/finder-query.dto'
import { response } from 'express'

@Controller('finder')
export class FinderController {
  @Get('/')
  // @Redirect('https://docs.nestjs.com', 302)
  handleFinder (@Query() query: FinderQueryDto) {
    return "you found me!"
  }
}
