# Bill Payment System

A Node.js application built with Express.js, TypeScript, and MongoDB for managing user bills and payments. The system includes a worker service using Bull for processing bill payments asynchronously.

## Features

- User authentication and authorization
- Wallet management with balance tracking
- Bill creation and management
- Asynchronous bill payment processing
- MongoDB transactions for data consistency
- Redis-based job queue for payment processing

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- MongoDB
- Redis

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd express-mongo-test
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bill-payment
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379
```

4. Start the services using Docker Compose:
```bash
docker-compose up -d
```

5. Start the application:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /users` - Register a new user
- `POST /auth/signin` - Sign in user
- `GET /auth/me` - Get current user information

### Wallet
- `POST /wallet/topup` - Add funds to wallet
  ```json
  {
    "amount": 100.00
  }
  ```

### Bills
- `POST /bills` - Create a new bill
  ```json
  {
    "amount": 50.00,
    "description": "Electricity bill",
    "dueDate": "2024-03-31"
  }
  ```
- `GET /bills` - Get all bills for current user
- `POST /bills/pay` - Process all pending bills

## Worker Service

The application includes a worker service that processes bill payments asynchronously using Bull queue. The worker:

1. Picks up payment jobs from the queue
2. Uses MongoDB transactions for data consistency
3. Updates bill statuses and user wallet balance
4. Handles retries and rollbacks in case of failures

## Error Handling

The application includes comprehensive error handling for:
- Invalid input data
- Insufficient wallet balance
- Database transaction failures
- Queue processing errors

## Development

- `npm run dev` - Start development server
- `npm run build` - Build TypeScript files
- `npm start` - Start production server 