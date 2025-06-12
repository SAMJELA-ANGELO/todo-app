
export const openApiConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Todo API',
    version: '1.0.0',
    description: 'API for managing todos and categories'
  },
  servers: [
  
    {
      url: 'http://localhost:3000',
      description: 'Development server for todo app'
    }
  ],
  tags: [
    
    {
      name: 'Auth',
      description: 'Authentication endpoints'
    },
    
    {
      name: 'Todos',
      description: 'Todo management endpoints'
    },

    {
      name: 'Categories',
      description: 'Category management endpoints'
    }
  ],
  components: {
    securitySchemes: {

      bearerAuth: {
        
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      
    }
    
}
  },
 
  security: [
    
    {
      
        bearerAuth: []
    
    }
  ]
}; 