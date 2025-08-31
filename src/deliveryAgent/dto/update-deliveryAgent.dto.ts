import { PartialType } from '@nestjs/swagger';
import { CreateDeliveryAgentDto } from './create-deliveryAgent.dto';

export class UpdateDeliveryAgentDto extends PartialType(CreateDeliveryAgentDto) {}
