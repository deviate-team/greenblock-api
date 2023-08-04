import { Module } from '@nestjs/common';
import { OffsetService } from './offset.service';
import { OffsetController } from './offset.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { Offset, OffsetSchema } from './schemas/offset.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Offset.name, schema: OffsetSchema }]),
  ],
  controllers: [OffsetController],
  providers: [OffsetService],
})
export class OffsetModule {}
