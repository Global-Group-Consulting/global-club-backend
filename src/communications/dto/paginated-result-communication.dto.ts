import { PaginatedResultDto } from '../../_basics/pagination-result.dto';
import { PaginatedFilterCommunicationDto } from './paginated-filter-communication.dto';
import { Communication } from '../schemas/communications.schema';

export class PaginatedResultCommunicationDto extends PaginatedResultDto {
  data: Communication[]
  filter?: Pick<PaginatedFilterCommunicationDto, "filter">
}
