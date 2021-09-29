import {Controller, Get, Post, Body, Patch, Param, Delete, Req} from '@nestjs/common';
import {MovementsService} from './movements.service';
import {CreateManualMovementDto} from './dto/create-manual-movement.dto';
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Movement} from "./schemas/movement.schema";
import {ReadDto} from "../_basics/read.dto";
import {RemoveManualMovementDto} from "./dto/remove-manual-movement.dto";
import {UseMovementDto} from "./dto/use-movement.dto";

@ApiBearerAuth()
@ApiTags("Movements")
@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {
  }
  
  /**
   * Manually add brites for a specific user
   */
  @ApiOperation({summary: "Manually add brites"})
  @Post(":id")
  manualAdd(@Param() params: ReadDto, @Body() createMovementDto: CreateManualMovementDto) {
    return this.movementsService.manualAdd(params.id, createMovementDto);
  }
  
  /**
   * Fetch all existing movements for a specified users
   */
  @ApiOperation({summary: "Movements list for user"})
  @Get(":id")
  findAllForUser(@Param() params: ReadDto): Promise<Movement[]> {
    return this.movementsService.findAllForUser(params.id);
  }
  
  /**
   * Allow to use the user brites.
   */
  @ApiOperation({summary: "Use brites"})
  @Patch(":id")
  use(@Body() useMovementDto: UseMovementDto, @Param() params: ReadDto) {
    return this.movementsService.use(params.id, useMovementDto);
  }
  
  /**
   * Manually removes brites from a user wallet
   */
  @ApiOperation({summary: "Manually remove brites"})
  @Delete(':id')
  manualRemove(@Param() params: ReadDto, @Body() removeMovementDto: RemoveManualMovementDto) {
    return this.movementsService.manualRemove(params.id, removeMovementDto);
  }
}
