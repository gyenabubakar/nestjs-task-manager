import { Body, Controller, Delete, Get, HttpCode, Param, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import CreateTaskDto from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.findAllTasks();
  }

  @Post()
  createTask(@Body() body: CreateTaskDto): Task {
    return this.tasksService.createTask(body);
  }

  @Get(':id')
  getOneTask(@Param('id') id: string, @Res({ passthrough: true }) response: Response): Task {
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
    const removed = this.tasksService.removeTaskById(id);
    if (!removed) {
      response.status(404).send({ message: `No task with the ID (${id}) was found.` });
    }
  }
}
