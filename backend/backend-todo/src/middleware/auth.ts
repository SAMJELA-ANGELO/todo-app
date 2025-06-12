import { Context, Next } from 'hono';
import {verify} from 'jsonwebtoken'
import {PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const authMiddleware = async (c: Context, next: Next) => {
  
    try {
    const authHeader = c.req.header('Authorization');
  
    if (!authHeader?.startsWith('Bearer '))
    {
            return c.json({ message: 'Unauthorized' }, 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string };

    const user = await prisma.user.findUnique ({

      where: { id: decoded.userId }
    
    });

    if (!user) {
      return c.json({ message: 'User not found' }, 401);
    }

    c.set('user', user);
    c.set('userId', user.id);
    await next();
  } catch (error) {
    return c.json({ message: 'Invalid token' }, 401);
  }
}; 