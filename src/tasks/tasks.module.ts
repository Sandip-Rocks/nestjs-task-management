import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Task]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
