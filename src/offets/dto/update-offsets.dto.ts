import { PartialType } from '@nestjs/swagger';
import { CreateOffsetDto } from './create-offsets.dto';

export class UpdateOffsetDto extends PartialType(CreateOffsetDto) {}
