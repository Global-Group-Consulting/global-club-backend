import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {MovementsService} from './movements.service';
import {CreateMovementDto} from './dto/create-movement.dto';
import {UpdateMovementDto} from './dto/update-movement.dto';
import {ApiTags} from "@nestjs/swagger";
import {Movement} from "./schemas/movement.schema";

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
  
  @Get()
  findAll(): Promise<Movement[]> {
    return this.movementsService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movementsService.findOne(+id);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovementDto: UpdateMovementDto) {
    return this.movementsService.update(+id, updateMovementDto);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movementsService.remove(+id);
  }
}
