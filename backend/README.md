# Express Node.js Backend Authentication/Authorization Server

This project is a robust backend authentication and authorization server built using Express.js and Node.js. It provides endpoints for user registration, email verification, login, password reset, and more. Below are the steps to set up and run this project on your local machine.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a connection URI)

## Installation

1. **Clone the repository:**

   ```bash
   git clone -b https://github.com/udayvalera/Personalized_Finance_Management.git
   cd Personalized_Finance_Management
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

## Configuration

1. **Create a `.env` file:**

   In the root directory of the project, create a `.env` file and add the following environment variables:

   ```env
   # MongoDB connection URI
   MONGO_LOCAL_URI=mongodb://localhost:27017/your-database-name

   # Email configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS2=your-email-app-password
   ```
    - Replace `your-database-name` with the name of your MongoDB database.

    - Replace `your-email@gmail.com` with your Gmail address.

    - Replace `your-email-app-password` with your Gmail app password.
2. **Ensure MongoDB is running:**

   Make sure your MongoDB server is running locally or update the `MONGO_LOCAL_URI` to point to your remote MongoDB instance.

## Running the Server

1. **Start the server:**

   ```bash
   npm start
   ```
   The server should start running on `http://localhost:3000`.

2. **Test the server:**

   You can test the server by visiting `http://localhost:3000/api/v1/test` in your browser or using a tool like Postman.

## API Endpoints

### Authentication

- **Register a new user:**
  - **POST** `/api/v1/auth/register`
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```

- **Verify OTP for email verification:**
  - **POST** `/api/v1/auth/verify-otp`
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "otp": "123456"
    }
    ```

- **Login a user:**
  - **POST** `/api/v1/auth/login`
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```

- **Send OTP for password reset:**
  - **POST** `/api/v1/auth/forgot-password`
  - Request Body:
    ```json
    {
      "email": "user@example.com"
    }
    ```

- **Reset password using OTP:**
  - **POST** `/api/v1/auth/reset-password`
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "otp": "123456",
      "newPassword": "newpassword123"
    }
    ```

### Test

- **Test endpoint:**
  - **GET** `/api/v1/test`

## Project Structure

```dir
backend/
├── config/
│ ├── database.js
│ └── firebase.js
├── controllers/
│ ├── authController.js
│ ├── forgetPasswordController.js
│ ├── loginController.js
│ ├── registerController.js
│ ├── testController.js
│ └── verifyOTPController.js
├── models/
│ ├── testUser.js
│ └── User.js
├── routes/
│ ├── authRoutes.js
│ └── testRoutes.js
├── utils/
│ ├── emailUtils.js
│ ├── jwtUtils.js
│ ├── otpUtils.js
│ └── testMailSender.js
├── .env
├── .gitignore
├── app.js
└── package.json
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.





  
