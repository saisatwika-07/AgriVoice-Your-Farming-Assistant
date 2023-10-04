Task Management System (MERN Stack)

Introduction
The Task Management System is a web application built using the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to efficiently manage their tasks, providing features such as task creation, reading, updating, and deletion. Each task includes essential details like a title, description, due date, and status, allowing users to organize and track their tasks effectively. Additionally, users can register and log in to access and manage their tasks securely.

Features
User Registration: Users can create new accounts by providing a username, password, and email address.
User Login: Registered users can log in securely to access their tasks.
Task Management: Users can perform CRUD (Create, Read, Update, Delete) operations on tasks.
Task Listing: Display a list of tasks with essential details, such as title, description, due date, and status.
User Authentication: Ensure secure user authentication using JWT (JSON Web Tokens).
Responsive Design: Provide a user-friendly interface accessible on various devices and screen sizes.
Tools and Technologies
The Task Management System utilizes a combination of technologies to provide a robust and user-friendly experience:

Front-End:

React :A JavaScript library for building the user interface.
React Router: For client-side routing between different views.
HTML: For structuring the web pages.
CSS: For styling the user interface.
Back-End:

Node.js: A JavaScript runtime environment for server-side development.
Express.js: A web application framework for building RESTful APIs.
MongoDB: A NoSQL database for storing task and user data.
Mongoose: An ODM (Object-Document Mapping) library for MongoDB.
JWT: For user authentication and authorization.
Development and Deployment:

npm: The Node Package Manager for managing project dependencies.
Create React App: A tool for setting up the React application.
Getting Started
To run the Task Management System locally and explore its features, follow these steps:

Clone the project repository from https://github.com/RamGrandhi71/TaskManagementSystem to your local machine.

Navigate to the project's root directory using the command line.

Install the necessary dependencies for both the server and client.

Set up your MongoDB database and configure the connection in the server's .env file.

Start the server and client separately.

Access the application in your web browser at http://localhost:3000.

Database Schema
The database schema includes two main tables/entities:

Users
Fields:
id (Primary Key, ObjectId)
username (String)
password (String)
email (String)
Tasks
Fields:
id (Primary Key, ObjectId)
title (String)
status (String)
userId (Reference to Users)
API Documentation
The Task Management System API provides the following endpoints for managing tasks and user authentication:

User Management:

Registration: POST /api/auth/register

Login: POST /api/auth/login

Task Management:

Create Task: `POST /api/todos/new

Get All Tasks: `GET /api/todos/current

Update Task: PUT /api/todos/:id

Delete Task: DELETE /api/todos/:id
