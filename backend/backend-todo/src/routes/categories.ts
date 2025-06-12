import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { CategoryController } from '../controllers/category.controller';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';

const categories = new OpenAPIHono();
const categoryController = new CategoryController();
const getAllCategoriesRoute = createRoute ({

  method: 'get',
  path: '/',
  tags: ['Categories'],
  security: [{ bearerAuth: [] }],

  responses: {

    200: {

      description: 'List of categories',
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
                name: { 
                  type: 'string'
                 },
                color: {
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

const getOneCategoryRoute = createRoute({
  method: 'get',
  path: '/:id',
  tags: ['Categories'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Category details',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
                
              id: { 
                type: 'string'
               },
              name: { 
                type: 'string'
               },
              color: {
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
      description: 'Category not found'
    }
  }
});

const createCategoryRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Categories'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: createCategorySchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Category created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
                  
              id: { 
                type: 'string'
               },
              name: { 
                type: 'string'
               },
              color: {
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

const updateCategoryRoute = createRoute({
  method: 'put',
  path: '/:id',
  tags: ['Categories'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: updateCategorySchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Category updated successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
                  
              id: { 
                type: 'string'
               },
              name: { 
                type: 'string'
               },
              color: {
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
      description: 'Category not found'
    }
  }
});

const deleteCategoryRoute = createRoute({
  method: 'delete',
  path: '/:id',
  tags: ['Categories'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Category deleted successfully',
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
      description: 'Category not found'
    }
  }
});

categories.openapi(getAllCategoriesRoute, (c) => categoryController.getAll(c) as any);
categories.openapi(getOneCategoryRoute, (c) => categoryController.getOne(c) as any);
categories.openapi(createCategoryRoute, (c) => categoryController.create(c) as any);
categories.openapi(updateCategoryRoute, (c) => categoryController.update(c) as any);
categories.openapi(deleteCategoryRoute, (c) => categoryController.delete(c) as any);

export { categories }; 