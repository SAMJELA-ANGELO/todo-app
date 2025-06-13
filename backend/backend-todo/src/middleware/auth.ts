import { Context, Next } from 'hono';
import { verify } from 'jsonwebtoken';

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'No authorization header' }, 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const decoded = verify(token, process.env.JWT_SECRET || 'secret');
    c.set('user', decoded);
    
    return await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
}; 