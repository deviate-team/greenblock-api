import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Offer, OfferSchema } from './schemas/offer.schema';
import { Project, ProjectSchema } from '@/projects/schemas/project.schema';
import { ProjectsModule } from '@/projects/projects.module';
import { User, UserSchema } from '@/users/schemas/user.schema';
import { UsersModule } from '@/users/users.module';
import { TransactionsModule } from '@/transactions/transactions.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Offer.name, schema: OfferSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema }
    ])
    ,
    TransactionsModule,
    UsersModule,
    ProjectsModule,
  ],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
