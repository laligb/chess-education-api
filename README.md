# Chess API

## Overview

Chess Education API is a backend service designed to manage chess tournaments, games, and educational components. To connect professors with the student.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **NestJS**: Framework for building efficient, reliable, and scalable applications.
- **MongoDB**: NoSQL database for storing user, tournament, and game data.
- **Mongoose**: ODM for MongoDB and Node.js.
- **Firebase Authentication**: Secure user authentication for users.

## Setup and Run Locally

### Prerequisites

- Node.js and npm (or yarn) installed.
- MongoDB running locally or remotely.
- Locally:

### Steps to Run the API Locally:

1. Clone the repository:

   ````bash
   git clone https://github.com/laligb/chess-education-api.git
   cd chess-education-api

   ```bash
     monogd
   ````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your local MongoDB instance or use a remote MongoDB service. If using a local instance, ensure MongoDB is running on `localhost:27017`.

4. Create a `.env` file in the root directory and add the following:

   ```env
   DATABASE_URL=mongodb://localhost:27017/chess-education
   JWT_SECRET=your-jwt-secret-key
   ```

5. Run the application:

   ```bash
   npm run start:dev
   ```

6. The API will be available at `http://localhost:3000`.

## Endpoints

- `POST /auth/login`: Authenticates a user (professor or student) and returns a JWT token.
- `GET /tournaments`: Fetches all tournaments.
- `GET /games`: Fetches all games.
- `GET /games/:id`: a games.
- `GET /users/`: Fetches all users.
- `GET /users/:id`: Fetches a user.
- `POST /users`: Creates a new user.
- `PUT /users/:id`: Updates a users.

For full API documentation, refer to the API endpoints in the code.
