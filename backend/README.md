# TTDECOM Backend

NestJS backend for the TTDECOM landing page, powered by Prisma ORM with MySQL.

## Project setup

```bash
$ npm install
```

## Environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="mysql://root:mysql123@localhost:3306/ttdecom_v2"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Endpoints

### Auth

| Method | Endpoint              | Auth       | Description                          |
| ------ | --------------------- | ---------- | ------------------------------------ |
| POST   | `/api/auth/register`  | No         | Register a new customer account      |
| POST   | `/api/auth/login`     | No         | Login and receive JWT                |
| GET    | `/api/auth/profile`   | JWT Bearer | Get current user's profile           |

#### POST /api/auth/register

Request body:

```json
{
  "email": "customer@example.com",
  "password": "123456",
  "fullname": "Nguyen Van A",
  "phone": "0901234567",
  "company": "Company Name"
}
```

> `phone` and `company` are optional.

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 3,
    "email": "customer@example.com",
    "fullname": "Nguyen Van A",
    "role": "ROLE_CUSTOMER",
    "company": "Company Name"
  }
}
```

#### POST /api/auth/login

Request body:

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullname": "John Doe",
    "role": "ROLE_ADMIN",
    "company": "TTDECOM"
  }
}
```

#### GET /api/auth/profile

Headers:

```
Authorization: Bearer <access_token>
```

Response:

```json
{
  "id": 1,
  "email": "user@example.com",
  "fullname": "John Doe",
  "role": "ROLE_ADMIN",
  "company": "TTDECOM",
  "phone": "0123456789"
}
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
