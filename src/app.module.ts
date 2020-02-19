import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { typeormConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
console.log(typeormConfig);
@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
