import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
jest.mock('../auth/user.entity');
import { User } from '../auth/user.entity';
import {} from 'jest';
import { Task } from './task.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

const mockUser = new User();

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

function getSampleTask() {
  const task = new Task();
  task.id = 1;
  task.description = 'testing';
  return task;
}

function getCreateTaskDto(): CreateTaskDto {
  return { title: 'testing', description: 'testing' };
}

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository: jest.Mocked<TaskRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = (await module.get<TaskRepository>(
      TaskRepository,
    )) as jest.Mocked<TaskRepository>;
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      const task = getSampleTask();
      const fakeTasks: Task[] = [task];
      taskRepository.getTasks.mockResolvedValue(fakeTasks);
      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filterDto: GetTasksFilterDto = {
        status: TaskStatus.IN_PORGRESS,
        search: 'testing',
      };

      const result = await tasksService.getTasks(filterDto, mockUser);
      expect(result).toEqual(fakeTasks);
      expect(taskRepository.getTasks).toHaveBeenCalled();
    });
  });

  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
      const task = getSampleTask();
      taskRepository.findOne.mockResolvedValue(task);
      const result = await tasksService.getTaskById(task.id, mockUser);
      expect(result).toEqual(task);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: task.id, userId: mockUser.id },
      });
    });

    it('throws an error as task is not found', () => {
      taskRepository.findOne.mockResolvedValue(undefined);
      const task = getSampleTask();
      expect(tasksService.getTaskById(task.id, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('creatTask', () => {
    it('calls taskRepository.create() and returns the result', async () => {
      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const createTaskDto: CreateTaskDto = getCreateTaskDto();
      const task = new Task();
      taskRepository.createTask.mockResolvedValue(task);
      const result = await tasksService.createTask(createTaskDto, mockUser);
      expect(result).toEqual(task);
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );
    });
  });

  describe('deleteTask', () => {
    it('calls taskRepository.deleteTask() and returns the result', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1, raw: 0 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTaskById(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('throws error when task is not found', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0, raw: 0 });
      expect(tasksService.deleteTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTaskStatus', () => {
    it("updates a task's status", async () => {
      const task = getSampleTask();
      const save = jest.fn().mockResolvedValue(task);
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        save,
        status: TaskStatus.OPEN,
      });

      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result = await tasksService.updateTaskStatus(
        task.id,
        TaskStatus.DONE,
        mockUser,
      );
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
