import {z} from 'zod'

export const createTodoSchema = z.object ({
  
    title: z.string().min(1),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
    dueDate: z.string().datetime().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).default('PENDING'),
    categoryId: z.string().optional()

});

export const updateTodoSchema = createTodoSchema.partial(); 