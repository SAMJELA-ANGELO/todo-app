import {Context} from 'hono'
import {PrismaClient} from '@prisma/client'

export abstract class BaseController  {
  protected prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  protected success<T extends Record<string, any>>(c: Context, data: T, status = 200)  {
   
    return c.json(data, status as any);
  
}

  protected error(c: Context, message: string, status = 400)  {

    return c.json({ message }, status as any);
  
}

  protected notFound(c: Context, message = 'Resource not found') {

    return this.error(c, message, 404);

}

  protected unauthorized(c: Context, message = 'Unauthorized') {

    return this.error(c, message, 401);

}

  protected forbidden(c: Context, message = 'Forbidden') {

    return this.error(c, message, 403);

}
} 