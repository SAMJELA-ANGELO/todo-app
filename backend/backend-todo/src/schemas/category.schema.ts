import {z} from 'zod';

export const createCategorySchema = z.object ({
  
    name: z.string().min(1),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#000000')

});

export const updateCategorySchema = createCategorySchema.partial(); 