import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { type Task, TaskStatus } from './task.model';
import CreateTaskDto from './dto/create-task.dto';
import FilterTasksDto from '#tasks/dto/filter-tasks.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  private tasksCopy(): Task[] {
    return JSON.parse(JSON.stringify(this.tasks));
  }

  findAllTasks(): Task[] {
    return this.tasks;
  }

  findTasksByFilters(filters: FilterTasksDto): Task[] {
    let tasks = this.tasksCopy();

    if (filters.status) {
      tasks = tasks.filter((task) => task.status === filters.status);
    }

    if (filters.search) {
      const search = filters.search.toLocaleLowerCase();
      tasks = tasks.filter(({ title, description }) => {
        title = title.toLocaleLowerCase();
        description = description.toLocaleLowerCase();
        return title.includes(search) || description.includes(search);
      });
    }

    return tasks;
  }

  findTaskById(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  createTask(info: CreateTaskDto): Task {
    const { title, description } = info;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.open,
      createdAt: Date.now(),
      updatedAt: null,
    };

    this.tasks.push(task);
    return task;
  }

  removeTaskById(id: string) {
    const tasks = JSON.parse(JSON.stringify(this.tasks)) as Task[];

    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return false;

    tasks.splice(index, 1);
    this.tasks = tasks;

    return true;
  }

  changeTaskStatus(id: string, status: TaskStatus): Task | undefined {
    const tasks = JSON.parse(JSON.stringify(this.tasks)) as Task[];

    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return undefined;

    tasks.splice(index, 1, {
      ...tasks[index],
      status,
      updatedAt: Date.now(),
    });
    this.tasks = tasks;

    return this.findTaskById(id);
  }
}
