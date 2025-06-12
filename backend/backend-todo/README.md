# Todo App Backend

A Node.js backend application for a todo app, built with Hono, Prisma, and MongoDB.

## Prerequisites

- Node.js 20.x
- Docker (for containerization)
- AWS CLI (for deployment)
- MongoDB Atlas account

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration.

3. Generate Prisma client:
```bash
npm run prisma:generate
```

## Development

Run the development server:
```bash
npm run dev
```

## Testing

Run tests:
```bash
npm test
```

## Docker

Build the Docker image:
```bash
npm run docker:build
```

Run the container:
```bash
npm run docker:run
```

## AWS Deployment

1. Configure AWS credentials:
```bash
aws configure
```

2. Store sensitive environment variables in AWS SSM:
```bash
aws ssm put-parameter --name "/todo-app/DATABASE_URL" --value "your-database-url" --type SecureString
aws ssm put-parameter --name "/todo-app/JWT_SECRET" --value "your-jwt-secret" --type SecureString
```

3. Deploy to AWS:
```bash
npm run aws:deploy
```

4. Remove deployment:
```bash
npm run aws:remove
```

## API Documentation

Once deployed, access the API documentation at:
- Swagger UI: `http://your-api-url/swagger`
- OpenAPI JSON: `http://your-api-url/api-docs`

## Environment Variables

- `DATABASE_URL`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: JWT token expiration time
- `PORT`: Application port (default: 3000)
- `NODE_ENV`: Environment (development/production)
