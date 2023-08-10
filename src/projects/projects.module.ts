import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/project.schema';
import { TransactionsModule } from '@/transactions/transactions.module';
import { User, UserSchema } from '@/users/schemas/user.schema';
import { UsersModule } from '@/users/users.module';
import { Offer, OfferSchema } from '@/offers/schemas/offer.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema },
      { name: Offer.name, schema: OfferSchema },
    ]),
    TransactionsModule,
    UsersModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
