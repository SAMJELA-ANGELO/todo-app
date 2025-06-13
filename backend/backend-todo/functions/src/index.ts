/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from 'firebase-functions/v2/https';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { auth } from '../../src/routes/auth';
import { todos } from '../../src/routes/todos';
import { categories } from '../../src/routes/categories';
import { errorHandler } from '../../src/middleware/error-handler';
import { authMiddleware } from '../../src/middleware/auth';
import { openApiConfig } from '../../src/config/openapi';

// Initialize Hono app
const app = new OpenAPIHono();

// Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors({
  origin: ['http://localhost:4200', 'https://geloshopping-fb.web.app'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}));

// Error handling
app.use('/api/*', errorHandler);

// API Documentation
app.doc('/api-docs', openApiConfig);
app.get('/swagger', swaggerUI({ url: '/api-docs' }));

// Routes
app.route('/api/auth', auth);
app.use('/api/*', authMiddleware);
app.route('/api/todos', todos);
app.route('/api/categories', categories);

// Health check endpoint
app.get('/health', (c) => c.json({ status: 'ok' }));

// Export Firebase Functions
export const api = onRequest({
  cors: true,
  region: 'us-central1',
  memory: '256MiB',
  timeoutSeconds: 60,
}, async (req, res) => {
  try {
    // Convert Firebase request to standard Request object
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        const headerValue = Array.isArray(value) ? value.join(', ') : value;
        headers.set(key, headerValue);
      }
    });

    const request = new Request(req.url, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const response = await app.fetch(request);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
