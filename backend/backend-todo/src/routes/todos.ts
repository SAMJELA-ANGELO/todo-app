import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { TodoController } from '../controllers/todo.controller';
import { createTodoSchema, updateTodoSchema } from '../schemas/todo.schema';

const todos = new OpenAPIHono();
const todoController = new TodoController();

const getAllTodosRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Todos'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'List of todos',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { 
                    type: 'string'
                 },
                title: { 
                    type: 'string'
                 },
                description: { 
                    type: 'string'
                 },
                priority: {
                     type: 'string',
                      enum: ['LOW', 'MEDIUM', 'HIGH'] 
                    },
                status: { 
                    type: 'string',
                    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED']
                 },
                dueDate: { 
                    type: 'string',
                    format: 'date-time'
                 },
                categoryId: { 
                    type: 'string'
                 },
                userId: { 
                    type: 'string'
                 },
                createdAt: {
                     type: 'string',
                    format: 'date-time'
                 },
                updatedAt: { 
                    type: 'string', 
                    format: 'date-time'
                 }
              }
            }
          }
        }
      }
    }
  }
});

const getOneTodoRoute = createRoute({
  method: 'get',
  path: '/:id',
  tags: ['Todos'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Todo details',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
                id: { 
                    type: 'string'
                 },
                title: { 
                    type: 'string'
                 },
                description: { 
                    type: 'string'
                 },
                priority: {
                     type: 'string',
                      enum: ['LOW', 'MEDIUM', 'HIGH'] 
                    },
                status: { 
                    type: 'string',
                    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED']
                 },
                dueDate: { 
                    type: 'string',
                    format: 'date-time'
                 },
                categoryId: { 
                    type: 'string'
                 },
                userId: { 
                    type: 'string'
                 },
                createdAt: {
                     type: 'string',
                    format: 'date-time'
                 },
                updatedAt: { 
                    type: 'string', 
                    format: 'date-time'
                 }
            }
          }
        }
      }
    },
    404: {

      description: 'Todo not found'
    
    }
  }
});

// Create todo route
const createTodoRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Todos'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: createTodoSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Todo created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
                id: { 
                    type: 'string'
                 },
                title: { 
                    type: 'string'
                 },
                description: { 
                    type: 'string'
                 },
                priority: {
                     type: 'string',
                      enum: ['LOW', 'MEDIUM', 'HIGH'] 
                    },
                status: { 
                    type: 'string',
                    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED']
                 },
                dueDate: { 
                    type: 'string',
                    format: 'date-time'
                 },
                categoryId: { 
                    type: 'string'
                 },
                userId: { 
                    type: 'string'
                 },
                createdAt: {
                     type: 'string',
                    format: 'date-time'
                 },
                updatedAt: { 
                    type: 'string', 
                    format: 'date-time'
                 }
            }
          }
        }
      }
    }
  }
});

const updateTodoRoute = createRoute({
  method: 'put',
  path: '/:id',
  tags: ['Todos'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {

        'application/json': {
          schema: updateTodoSchema
        
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Todo updated successfully',

      content: {
      
        'application/json': {
          schema: {
            type: 'object',
            properties: {
                id: { 
                    type: 'string'
                 },
                title: { 
                    type: 'string'
                 },
                description: { 
                    type: 'string'
                 },
                priority: {
                     type: 'string',
                      enum: ['LOW', 'MEDIUM', 'HIGH'] 
                    },
                status: { 
                    type: 'string',
                    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED']
                 },
                dueDate: { 
                    type: 'string',
                    format: 'date-time'
                 },
                categoryId: { 
                    type: 'string'
                 },
                userId: { 
                    type: 'string'
                 },
                createdAt: {
                     type: 'string',
                    format: 'date-time'
                 },
                updatedAt: { 
                    type: 'string', 
                    format: 'date-time'
                 }
            }
          }
        }
      }
    },
    404: {
      description: 'Todo not found'
    }
  }
});

const deleteTodoRoute = createRoute ({

  method: 'delete',
  path: '/:id',
  tags: ['Todos'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Todo deleted successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      }
    },

    404: {
      description: 'Todo not found'
    }
  }
});

todos.openapi(getAllTodosRoute, (c) => todoController.getAll(c) as any);
todos.openapi(getOneTodoRoute, (c) => todoController.getOne(c) as any);
todos.openapi(createTodoRoute, (c) => todoController.create(c) as any);
todos.openapi(updateTodoRoute, (c) => todoController.update(c) as any);
todos.openapi(deleteTodoRoute, (c) => todoController.delete(c) as any);

export { todos }; 