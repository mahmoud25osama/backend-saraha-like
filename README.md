# Saraha Backend

This is the backend API for the Saraha-like anonymous messaging app. It is built with Node.js, Express, TypeScript, and MongoDB (via Mongoose). The backend handles user authentication, anonymous message delivery, and user profile management.

## Features

-   User registration and login with JWT authentication
-   Secure password hashing with bcryptjs
-   Anonymous message sending and receiving
-   User profile management (public profile, bio, avatar, etc.)
-   CORS and environment variable support
-   RESTful API structure

## Getting Started

1. **Install dependencies:**

    ```sh
    npm install
    ```

2. **Set up environment variables:**

    - Create a `.env` file in the backend root with:
        ```
        MONGODB_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        FRONTEND_URL=http://localhost:3000
        ```

3. **Run the development server:**

    ```sh
    npm run dev
    ```

4. **Build for production:**
    ```sh
    npm run build
    npm start
    ```

## Folder Structure

-   `src/` - Source code
    -   `modules/` - Feature modules (auth, user, message)
    -   `database/` - Database connection and models
    -   `middleware/` - Express middleware
    -   `utils/` - Utility classes and helpers

## API Endpoints

See the `src/modules` folders for available routes and controllers.
