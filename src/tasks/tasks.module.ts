import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';

@Module({
  imports: [TasksController],
})
export class TasksModule {}
