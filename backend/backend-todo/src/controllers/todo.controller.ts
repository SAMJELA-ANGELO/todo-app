import { Context } from 'hono';
import { BaseController } from './base.controller';
import { createTodoSchema, updateTodoSchema } from '../schemas/todo.schema';

export class TodoController extends BaseController {
  async getAll(c: Context) {
    const user = c.get('user');
    const todos = await this.prisma.todo.findMany({
      where: { userId: user.id },
      include: { category: true }
    });
    return this.success(c, todos);
  }

  async getOne(c: Context) {
    const user = c.get('user');
    const id = c.req.param('id');

    const todo = await this.prisma.todo.findFirst({
      where: { id, userId: user.id },
      include: { category: true }
    });

    if (!todo) {
      return this.error(c, 'Todo not found', 404);
    }

    return this.success(c, todo);
  }

  async create(c: Context) {
    const user = c.get('user');
    const body = await c.req.json();
    const data = createTodoSchema.parse(body);

    const { categoryId, ...todoData } = data;

    const todo = await this.prisma.todo.create({
      data: {
        ...todoData,
        user: {
          connect: { id: user.id }
        },
        ...(categoryId && {
          category: {
            connect: { id: categoryId }
          }
        })
      },
      include: { category: true }
    });

    return this.success(c, todo, 201);
  }

  async update(c: Context) {
    const user = c.get('user');
    const id = c.req.param('id');
    const body = await c.req.json();
    const data = updateTodoSchema.parse(body);

    const todo = await this.prisma.todo.findFirst({
      where: { id, userId: user.id }
    });

    if (!todo) {
      return this.error(c, 'Todo not found', 404);
    }

    const updatedTodo = await this.prisma.todo.update({
      where: { id },
      data,
      include: { category: true }
    });

    return this.success(c, updatedTodo);
  }

  async delete(c: Context) {
    const user = c.get('user');
    const id = c.req.param('id');

    const todo = await this.prisma.todo.findFirst({
      where: { id, userId: user.id }
    });

    if (!todo) {
      return this.error(c, 'Todo not found', 404);
    }

    await this.prisma.todo.delete({
      where: { id }
    });

    return this.success(c, { message: 'Todo deleted successfully' });
  }
} 