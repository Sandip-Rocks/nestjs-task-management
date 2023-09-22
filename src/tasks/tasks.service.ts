import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { User } from 'src/auth/user.model';

@Injectable()
export class TasksService {
  // private tasks: Task[] = [];

  // checkIfTaskExist(): boolean {
  //   return this.tasks.length > 0 ? true : false;
  // }
  async getAllTasks(user: User): Promise<Task[]> {
    const allTaskData = await this.tasksService.findAll({
      where: { userId: user.id },
    });

    return allTaskData;
  }
  // getTasksWithFilter(filterDto: GetTaskFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter((task) =>
  //       task.title.toLowerCase().includes(search) ||
  //       task.description.toLowerCase().includes(search)
  //         ? true
  //         : false,
  //     );
  //   }
  //   return tasks;
  // }

  async updateTaskById(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const { title, description, status } = updateTaskDto;
    try {
      const task = await this.getTaskById(id, user);
      if (task) {
        task.title = title;
        task.description = description;
        task.status = status;
        task.save();
        return task;
      } else {
        throw new NotFoundException(`Task id ${id} does not exist`);
      }
    } catch (error) {
      this.logger.error(error.response);
      return error.response;
    }
  }

  constructor(
    @InjectModel(Task)
    private readonly tasksService: typeof Task,
  ) {}
  logger = new Logger();
  async getTaskById(id: string, user: User): Promise<Task> {
    try {
      const taskData = await this.tasksService.findOne({
        where: { id, userId: user.id },
      });
      if (!taskData) {
        throw new NotFoundException();
      }
      return taskData;
    } catch (error) {
      this.logger.error(error.message);
      return error.response;
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.tasksService.create({
      title,
      description,
      status: TaskStatus.OPEN,
      userId: user.id,
    });
    (await task).save();

    return task;
  }
  async deleteTaskById(id: string, user: User): Promise<void> {
    try {
      const taskData = await this.tasksService.findOne({
        where: { id, userId: user.id },
      });
      if (!taskData) {
        throw new NotFoundException(`Task id with ${id} not found.`);
      }
      await taskData.destroy();
    } catch (error) {
      this.logger.error(error.message);
      return error.response;
    }
  }
}
