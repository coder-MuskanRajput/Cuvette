This project is a comprehensive backend system developed for managing user registrations, template operations, and job postings with various functionalities including email and SMS notifications. It uses Node.js, Express, and MongoDB and integrates third-party services like Nodemailer for email handling and fast2sms for sending SMS.
## Features
- User registration with OTP verification via email and SMS.
- Email verification and mobile number verification endpoints.- User login with OTP.
- CRUD operations for email templates.- Job posting with notification services.
- Secure routes with JWT authentication.
## Prerequisites
Before you begin, ensure you have met the following requirements:- Node.js installed on your machine.
- MongoDB running locally or remotely.- An account with fast2sms for SMS services.
- A configured SMTP server or a service like Gmail for sending emails with Nodemailer.
## Installation
Follow these steps to get your development environment running:
1. Clone the repository:bash
git clone https://github.com/coder-MuskanRajput/cuvette
2. Install dependencies:bash
npm install
3. Set up your environment variables:
Create a .env file in the root of your project and update it with your details:plaintext
EXPRESS_SESSION_SECRET=your_session_secret_here
PORT=3000MONGO_URI=your_mongodb_uri_here
FAST2SMS_API_KEY=your_fast2sms_api_keyEMAIL_SERVICE_PROVIDER=your_email_provider
EMAIL_USERNAME=your_email_usernameEMAIL_PASSWORD=your_email_password
4. Run the application:bash
npm start
## Usage
Once the project is running, you can use the provided endpoints to interact with the system. The application supports various operations such as:
- POST /auth/register - Register a new user.
- POST /auth/login - Log in a user with an OTP.- GET /job/jobs - Retrieve all jobs.
- POST /templates/create-template - Create a new email template.
