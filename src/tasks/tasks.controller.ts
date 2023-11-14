import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto, FilterTasksDto } from './dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query() query: FilterTasksDto): Task[] {
    if (Object.keys(query).length) {
      return this.tasksService.findTasksByFilters(query);
    }
    return this.tasksService.findAllTasks();
  }

  @Post()
  createTask(@Body() body: CreateTaskDto): Task {
    return this.tasksService.createTask(body);
  }

  @Get(':id')
  getOneTask(@Param('id') id: string, @Res({ passthrough: true }) response: Response): Task | void {
    const task = this.tasksService.findTaskById(id);
    if (!task) {
      response.status(404).send({ message: `No task with the ID (${id}) was found.` });
      return;
    }
    return task;
  }

  @Delete(':id')
  @HttpCode(204)
  deleteOneTask(@Param('id') id: string, @Res({ passthrough: true }) response: Response) {
    const isRemoved = this.tasksService.removeTaskById(id);
    if (!isRemoved) {
      response.status(404).send({ message: `No task with the ID (${id}) was found.` });
    }
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
    @Res({ passthrough: true }) response: Response,
  ): Task | void {
    const updatedTask = this.tasksService.changeTaskStatus(id, status);
    if (!updatedTask) {
      response.status(404).send({ message: `No task with the ID (${id}) was found.` });
      return;
    }
    return updatedTask;
  }
}
