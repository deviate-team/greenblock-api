import { PartialType } from '@nestjs/swagger';
import { CreateOffsetDto } from './create-offset.dto';

export class UpdateOffsetDto extends PartialType(CreateOffsetDto) {}
