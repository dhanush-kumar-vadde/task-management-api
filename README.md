# Task Management API

A backend REST API for managing users, projects, tasks, and messages.

Built using Node.js, Express, and MongoDB.

## Features

- User authentication using JWT
- Project management
- Task management
- Project-based messaging
- Notifications
- Background cleanup jobs
- Swagger API documentation

## Tech Stack

Node.js  
Express.js  
MongoDB  
Mongoose  
Socket.IO  
JWT Authentication  
node-cron  

## Installation

Clone the repository

git clone https://github.com/dhanush-kumar-vadde/task-management-api.git

Navigate to the project

cd task-management-api

Install dependencies

npm install

## Environment Variables

Create a `.env` file and configure:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret

## Running the Server

Development

npm run dev

Production

npm start

## API Documentation

Swagger documentation is available at

http://localhost:5000/api-docs

## Example Routes

Auth
POST /auth/register  
POST /auth/login  

Users
GET /users  
GET /users/:id  

Projects
POST /projects  
GET /projects  

Tasks
POST /tasks  
GET /tasks  

Messages
GET /api/projects/:projectId/messages  

## Background Jobs

The application runs scheduled jobs to remove expired sessions and verification tokens using node-cron.

## Author

Dhanush Kumar Vadde  
https://github.com/dhanush-kumar-vadde
