import { Context, Next } from 'hono';

export const errorHandler = async (c: Context, next: Next) => {
  try {
    return await next();
  } catch (error) {
    console.error('Error:', error);
    return c.json({ 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    }, 500);
  }
}; 