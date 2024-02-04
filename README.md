# Price Tracker

## Prerequisites Installation

Before running the application, you need to ensure that Redis, RabbitMQ, and PostgreSQL are running. Here are the commands to run each service using Docker:

### Redis

```bash
docker run --name my-redis -p 6379:6379 -d redis
```

### RabbitMQ

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

### PostgreSQL

```bash
docker run --name mypostgres -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydb -p 5432:5432 -d postgres
```

## Install Dependencies

- Open a terminal and navigate to the root directory of your application. Run the following command to install all necessary dependencies as defined in your package.json file:

```bash
npm install
```

## Start the Application

```bash
npm run dev
```

## Run the Consumer Service

- To start the consumer service that listens to the RabbitMQ message queue and handles email notifications, you'll run it as a separate process. Open a new terminal window or tab, navigate to your project's root directory, and run:

```bash
node ./message_queue/consumer.js
```

## Application Overview

This application enables users to monitor cryptocurrency prices in real-time and receive notifications when specific price targets are reached. Users can register, log in, create price alerts, and manage these alerts through a REST API. The application leverages WebSockets for real-time price updates, Redis for caching, and RabbitMQ for managing email notifications.

## User Authentication

### Register

- **POST** `/register`
  - **Description**: Registers a new user with a username and password.
  - **Request Body**:
    ```json
    {
      "username": "user1",
      "password": "password123"
    }
    ```
  - **Success Response**: `201 Created`
  - **Error Response**: `400 Bad Request` if the username is already taken.

### Login

- **POST** `/login`
  - **Description**: Authenticates a user and returns a JWT token.
  - **Request Body**:
    ```json
    {
      "username": "user1",
      "password": "password123"
    }
    ```
  - **Success Response**: `200 OK` with JWT token.
  - **Error Response**: `401 Unauthorized` if credentials are incorrect.

## Alert Management

### Create Alert

- **POST** `/alert`
  - **Description**: Creates a new price alert for a specific user.
  - **Request Body**:
    ```json
    {
      "currencyPair": "BTCUSTD",
      "targetPrice": 50000
    }
    ```
  - **Success Response**: `201 Created`
  - **Error Response**: `400 Bad Request` if the input is invalid.

### Get All Alerts + Filter

- **GET** `/alert` or '/alert?status=active | triggered'
  - **Description**: Fetches all alerts for the logged-in user, with optional filtering.
  - **Query Parameters**:
    - `currency` (optional): Filter alerts by currency.
  - **Success Response**: `200 OK` with a list of alerts.
  - **Error Response**: `500 Internal Server Error` if an error occurs.

### Delete Alert

- **DELETE** `/alert/delete/:id`
  - **Description**: Deletes a specific alert by its ID.
  - **Success Response**: `200 OK`
  - **Error Response**: `404 Not Found` if the alert ID does not exist.

## Real-Time Price Monitoring with WebSockets

The application uses WebSockets to subscribe to a cryptocurrency price feed, allowing it to receive and process price updates in real-time. When the current price of a cryptocurrency meets or exceeds the target price set in any user alert, the application proceeds to notify the user.

## Email Notification via Nodemailer and RabbitMQ

When an alert condition is met, the application sends a message to a RabbitMQ queue, indicating that an email notification should be sent. A separate worker service listens on this queue, extracts email notification tasks, and uses Nodemailer to send the emails. This decouples the email sending process from the main application logic, improving scalability and reliability.

## Using Redis for Caching

Redis is utilized to cache frequently accessed data, such as active alerts or recent price information. This reduces response times and decreases the load on the primary database.

## Summary

This documentation outlines the key functionalities of your application, emphasizing user management, alert operations, real-time data handling with WebSockets, and asynchronous email notifications via RabbitMQ. The use of Redis for caching enhances the application's performance and efficiency.

docker run --name my-redis -p 6379:6379 -d redis
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
docker run --name mypostgres -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydb -p 5432:5432 -d postgres
