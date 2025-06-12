import { Context } from 'hono';
import { BaseController } from './base.controller';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';
export class CategoryController extends BaseController {
  async getAll(c: Context) {

    const user = c.get('user');
    
    const categories = await this.prisma.category.findMany({
    
        where: { userId: user.id }
    
    });
    
    return this.success(c, categories);
  }

  async getOne(c: Context) {
    
    const user = c.get('user');
    
    const id = c.req.param('id');

    const category = await this.prisma.category.findFirst({
    
        where: { id, userId: user.id }
    
    });

    
    if (!category) {
    
        return this.error(c, 'Category not found', 404);
    }

    
    return this.success(c, category);
  
}

  async create(c: Context) {

    const user = c.get('user');

    const body = await c.req.json();

    const data = createCategorySchema.parse(body);

    const category = await this.prisma.category.create({

        data: {

            ...data,

            user: {

                connect: { id: user.id }
        }

    }

});


return this.success(c, category, 201);

}


async update(c: Context) {

    const user = c.get('user');

    const id = c.req.param('id');

    const body = await c.req.json();

    const data = updateCategorySchema.parse(body);


    const category = await this.prisma.category.findFirst({

        where: { id, userId: user.id }

    });


    if (!category) {
    
        return this.error(c, 'Category not found', 404);
    
    }

    const updatedCategory = await this.prisma.category.update({
    
        where: { id },
    
        data
    });

    
    return this.success(c, updatedCategory);
  
}

  async delete(c: Context) {

    const user = c.get('user');

    const id = c.req.param('id');


    const category = await this.prisma.category.findFirst({

        where: { id, userId: user.id }
    });


    if (!category) {

        return this.error(c, 'Category not found', 404);
    }

    await this.prisma.category.delete({

        where: { id }
    });

    return this.success(c, { message: 'Category deleted successfully' });
  }
} 