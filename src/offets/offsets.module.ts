import { Module } from '@nestjs/common';
import { OffsetService } from './offsets.service';
import { OffsetController } from './offsets.controller';
import {MongooseModule} from '@nestjs/mongoose';

import { Offset, OffsetSchema } from './schemas/offsets.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Offset.name, schema: OffsetSchema }]),
  ],
  controllers: [OffsetController],
  providers: [OffsetService]
})
export class OffsetModule {}
