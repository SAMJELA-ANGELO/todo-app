import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { app } from './index';

const prisma = new PrismaClient();
let server: any;

beforeAll( async () => {
  
    server = serve({
    fetch: app.fetch,
    port: 3001
  
 });
});

afterAll(async () => {
 
    await prisma.$disconnect();
  // server.close();

});

describe('API Endpoints', () => {

    let authToken: string;
    let userId: string;


  it('should register a new user', async () => {

    const response = await fetch('http://localhost:3001/api/auth/register', {

      method: 'POST',
      headers: {
      
        'Content-Type': 'application/json'
      
    },
      body: JSON.stringify({
    
        email: 'testuser@example.com',
        password: 'password123',
        name: 'Test User'
    
      })
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.user).toBeDefined();
    expect(data.token).toBeDefined();
    authToken = data.token;
    userId = data.user.id;
  
  });

  
  it('should login with valid credentials', async () => {
  
    const response = await fetch('http://localhost:3001/api/auth/login', {
  
     method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'password123'

      })

    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.token).toBeDefined();

  });

  it('should create a new todo', async () => {
    
    const response = await fetch('http://localhost:3001/api/todos', {
    
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        title: 'Test Todo',
        description: 'Test Description',
        priority: 'MEDIUM'

      })
    });

    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data.title).toBe('Test Todo');
  });

  it('should get all todos', async () => {
   
    const response = await fetch('http://localhost:3001/api/todos', {
   
        headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('should create a new category', async () => {
    
    const response = await fetch('http://localhost:3001/api/categories', {
    
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      
      body: JSON.stringify({
        name: 'Test Category',
        color: '#FF0900'
      })
    });

    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data.name).toBe('Test Category');
  });

  it('should get all categories', async () => {
    
    const response = await fetch('http://localhost:3001/api/categories', {
    
        headers: {
        'Authorization': `Bearer ${authToken}`
      }
    
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  
});

  afterAll( async () => {
    await prisma.todo.deleteMany ({

      where: { userId }

    });
    await prisma.category.deleteMany({
      
        where: { userId }
        
    });
    await prisma.user.delete({
      where: { id: userId }
    });
  });
}); 