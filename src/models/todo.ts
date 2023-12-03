import db from '@/lib/prisma';
import { TodoStatus } from '@prisma/client';
import { z } from 'zod';

const todoStatusValues = Object.values(TodoStatus) as [TodoStatus, ...TodoStatus[]];
// [TodoStatus.PLANNING, TodoStatus.PROCESSING, TodoStatus.CANCELED, TodoStatus.COMPLETED, TodoStatus.ARCHIVED]

export const TodoCreateSchema = z
  .object({
    title: z.string().max(32),
    content: z.string().optional(),
    status: z.enum(todoStatusValues).optional(),
    authorId: z.number(),
  })
  .strict(); // forbid additional fields

export const TodoUpdateSchema = z
  .object({
    title: z.string().max(32).optional(),
    content: z.string().optional(),
    status: z.enum(todoStatusValues).optional(),
    authorId: z.number().optional(),
  })
  .strict(); // forbid additional fields

export interface TodoCreateDto {
  title: string;
  content?: string;
  status?: TodoStatus;
  authorId: number;
}

export interface TodoUpdateDto {
  title?: string;
  content?: string;
  status?: TodoStatus;
  authorId?: number;
}

class TodoModel {
  findByAuthorId(authorId: number) {
    return db.todo.findMany({
      where: {
        authorId,
      },
    });
  }

  findByStatus(status: TodoStatus) {
    return db.todo.findMany({
      where: {
        status,
      },
    });
  }

  create(dto: TodoCreateDto) {
    return db.todo.create({
      data: Object.assign(dto, {
        updatedAt: new Date(),
      }),
    });
  }

  bulkCreate(dtos: TodoCreateDto[]) {
    return db.todo.createMany({
      data: dtos,
    });
  }

  update(id: number, dto: TodoUpdateDto) {
    return db.todo.update({
      where: {
        id,
      },
      data: Object.assign(dto, {
        updatedAt: new Date(),
      }),
    });
  }

  remove(id: number) {
    return db.todo.delete({
      where: {
        id,
      },
    });
  }

  getById(id: number) {
    return db.todo.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }
}

const model = new TodoModel();

export default model;
