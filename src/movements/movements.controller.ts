import {Controller, Get, Post, Body, Patch, Param, Delete, Req} from '@nestjs/common';
import {MovementsService} from './movements.service';
import {CreateMovementDto} from './dto/create-movement.dto';
import {ApiTags} from "@nestjs/swagger";
import {Movement} from "./schemas/movement.schema";
import {ReadMovementDto} from "./dto/read-movement.dto";
import {Request} from "express";

@ApiTags("Movements")
@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {
  }
  
  /**
   * Manual adding for a new user movement
   * @param createMovementDto
   * @param targetUserId
   */
  @Post(":userId")
  create(@Body() createMovementDto: CreateMovementDto, @Param('userId') targetUserId: string) {
    /*const targetUserId = params.id
    const authUserId = auth.user._id
  
    /!** @type { import("../../../../@types/Brite/dto/brite.manualAdd").BriteManualAdd } *!/
    const data = request.all()
  
    return BriteModel.manualAdd({
      amountChange: data.amountChange,
      notes: data.notes,
      semesterId: data.semester,
      userId,
      created_by: currentUser
    });*/
    
    return this.movementsService.create(createMovementDto);
  }
  
  /**
   * Fetch all existing movements for all users
   */
  @Get()
  findAll(@Req() req: Request): Promise<Movement[]> {
    return this.movementsService.findAll();
  }
  
  /**
   * Fetch all movements for the given user
   */
  @Get(':id')
  findOne(@Param() params: ReadMovementDto) {
    return this.movementsService.findOne(params.id);
  }
  
  @Delete(':id')
  remove(@Param() params: ReadMovementDto) {
    return this.movementsService.remove(params.id);
  }
}
