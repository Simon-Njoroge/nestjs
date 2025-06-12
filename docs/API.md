API Documentation - Tourism Management System

Base URL

http://localhost:3000/api

Authentication

POST /auth/signup

Registers a new user

Request Body:

{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "John Doe"
}

Response: JWT tokens and user info

POST /auth/login

Logs in a user

Request Body:

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: Access and refresh tokens

POST /auth/refresh

Refreshes access token

POST /auth/logout

Logs out a user

Users

GET /users

Retrieves all users (paginated)

Query Params: page, limit

Tour Packages

GET /tour-packages

Retrieves a list of tour packages (paginated)

GET /tour-packages/:id

Get details of a specific tour package

POST /tour-packages

Create a new tour package (Admin only)

PUT /tour-packages/:id

Update tour package details

DELETE /tour-packages/:id

Delete a tour package

Bookings

POST /bookings

Book a tour package

GET /bookings/user/:userId

Get bookings for a specific user

Payments

POST /payments/mpesa/stk-push

Initiate M-PESA STK Push

GET /payments/status/:transactionId

Get M-PESA payment status

Tickets

POST /tickets

Generate a ticket for a booking

Inquiries

POST /inquiries

Submit a question or inquiry

Reviews

POST /reviews

Submit a review for a tour package

GET /reviews/:tourPackageId

Get all reviews for a tour package