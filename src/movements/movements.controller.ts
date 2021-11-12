import {Controller, Get, Post, Body, Patch, Param, Delete, Req} from '@nestjs/common';
import {MovementsService} from './movements.service';
import {CreateManualMovementDto} from './dto/create-manual-movement.dto';
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Movement} from "./schemas/movement.schema";
import {ReadDto} from "../_basics/read.dto";
import {RemoveManualMovementDto} from "./dto/remove-manual-movement.dto";
import {UseMovementDto} from "./dto/use-movement.dto";
import {CalcTotalsDto} from "./dto/calc-totals.dto";

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
   * Get available brites per semester
   */
  @ApiOperation({
    summary: "Available brites per semester",
    description: `A user portfolio is divided by semesters (January-June, July-December).<br>
    Each semester has a "total" key that indicates how much can still be used for that semester. There are also the expiration date and usable from date.<br>
    Last there is a "packs" object which will contain all details for the remaining amount, based on the clubPack associated.<br>
    <ul>
      <li><strong>totalRemaining</strong>: refers to the total amount of money the user has for that semester or pack, but does not take in consideration all the various usability conditions of the different packs.</li>
      <li><strong>totalUsable</strong>: refers to the total amount of money the user has AND TAKES in consideration all the various packs conditions. For this reasons, this amount could equal or less than “totalRemaining”.</li>
    </ul>`
  })
  @Get(":id/total")
  calcTotalBrites (@Param() params: ReadDto): Promise<CalcTotalsDto[]> {
    return this.movementsService.calcTotalBrites(params.id, null, false);
  }
  
  /**
   * Allow to use the user brites.
   */
  /* @ApiOperation({summary: "Use brites"})
  @Patch(":id") */
  use(@Body() useMovementDto: UseMovementDto, @Param() params: ReadDto): Promise<Movement[]> {
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
