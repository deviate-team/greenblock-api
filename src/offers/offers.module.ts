import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Offer, OfferSchema } from './schemas/offer.schema';
import { ProjectsModule } from '@/projects/projects.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Offer.name, schema: OfferSchema }]),
    ProjectsModule,
  ],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
