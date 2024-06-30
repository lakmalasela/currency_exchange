# Currency Exchange Application - backend 

This is an Express.js application for server side that provides API endpoints for currency conversion. It uses MongoDB for data storage 

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Make sure you have the following installed on your machine:

- Node.js (version 18.x or higher)
- npm (version 6.x or higher)
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository:

    ```bash
    https://github.com/lakmalasela/currency_exchange.git
    cd your-repo-name
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

## Running the Application

1. Create a `.env` file in the root directory and add your MongoDB URI and other environment variables. See [Environment Variables](#environment-variables) for details.

2. Start the application:

    ```bash
    npm run dev
    ```

    This will start the server with Nodemon for development. The server will automatically restart when you make changes to the source code.

## Environment Variables

Create a `.env` file in the root directory of the project with the following variables:

PORT=4000
MONGO_URI=mongodb+srv://asela:TzJfLeUjVyBaclex@cluster0.9snvyq7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

###########################################################################################################################################################################################
# Currency Exchange Application - frontend

This is a React.js application that provides a user interface for currency conversion. It uses Material-UI for styling and Axios for making HTTP requests to the backend API.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Build for Production](#build-for-production)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Make sure you have the following installed on your machine:

- Node.js (version 18.x or higher)
- npm (version 6.x or higher)

## Installation

1. Clone the repository:

    ```bash
    https://github.com/lakmalasela/currency_exchange.git
    cd your-repo-name
    ```

2. Install the dependencies:

    ```bash
    npm install --force
    ```

## Running the Application

1. Start the development server:

    ```bash
    npm start
    ```

    This will start the development server on `http://localhost:3000` and open the application in your default web browser.


## Environment Variables

Create a `.env` file in the root directory of the project with the following variables:

SERVER_API_URL = http://localhost:4000
EXCHANGE_RATE_API = https://open.er-api.com/v6/latest

## Build for Production

To build the application for production, run:

```bash
npm run build








