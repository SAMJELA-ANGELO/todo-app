import { Context, Next } from 'hono';

export const errorHandler = async (c: Context, next: Next) => {
  try{
     await next();
  } 
  catch (error: any) {
  
    console.error(error);

    if (error.name === 'ZodError') {
    
            return c.json({
            message: 'Validation error',
            errors: error.errors
        }, 400
        );
    
    }

        if (error.code === 'P2002'){
        return c.json({
            message: 'Unique constraint violation',
            
            field: error.meta?.target?.[0]
        }, 409
        );
    }

    return c.json({
     
        message: error.message || 'Internal server error'
    
    }, 
    error.status || 500);
  }
}; 