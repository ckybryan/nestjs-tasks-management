import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        t => t.title.includes(search) || t.description.includes(search),
      );
    }

    return tasks;
  }

  getTaskByID(id: string): Task {
    const found = this.tasks.find(t => t.id === id);
    if (!found) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid.v1(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): void {
    const found = this.getTaskByID(id);
    this.tasks = this.tasks.filter(t => t.id !== found.id);
  }

  updateTaskStats(id: string, status: TaskStatus): Task {
    const task = this.getTaskByID(id);
    task.status = status;
    return task;
  }
}
