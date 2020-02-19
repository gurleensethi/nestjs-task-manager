import { TaskStatus } from '../task.model';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  search: string;
}
