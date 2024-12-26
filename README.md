# AndhraCuisine

## Overview

This project implements an **Enterprise Web Application** with a Virtual Customer Service system using **LangChain**, **OpenAI GPT-4o Mini**, and **MongoDB**. The application allows users to interact with AI agents for:

- **Product Recommendations**
- **Order/Shipping Status Inquiries**
- **Reporting Fraudulent Transactions**

The application uses **React** for the frontend and **Flask** for the backend.

---

## Features

1. **Product Recommendations**:
   - Users can receive personalized product recommendations based on their preferences.
2. **Order/Shipping Status**:
   - Users can inquire about the status of their orders and estimated delivery times.
3. **Fraudulent Transaction Reporting**:
   - Users can report fraudulent activities or issues with their transactions.
4. **User Management**:
   - Users can log in using the provided credentials or sign up to create a new account.
5. **Database Integration**:
   - The application uses MongoDB to store user data, orders, and product information.

---

## Tech Stack

- **Frontend**: React.js
- **Backend**: Flask
- **Database**: MongoDB
- **AI Framework**: LangChain
- **AI Model**: OpenAI GPT-4o Mini

---

## Prerequisites

- Install **Node.js** and **npm** for the frontend.
- Install **Python** (3.8 or above) and set up a virtual environment for the backend.
- Set up MongoDB and ensure the `MONGO_URI` is configured in the `.env` file.
- Add your OpenAI API Key to the `.env` file under `OPENAI_API_KEY`.

---

## Installation and Setup

### Backend

1. **Environment Variables**

   - In the `backend` directory, create a `.env` file and add your OpenAI API Key:
     ```plaintext
     OPENAI_API_KEY=your_openai_api_key_here
     ```

2. **Database Setup**

   - Set up a MongoDB database with the following specifications:
     - **Database Name:** `CuisineConnect`
     - **Collections:** `Users`, `Orders`, `Products`

3. **Install Python Dependencies**

   - Navigate to the `backend` folder and run the following command to install required Python dependencies:
     ```bash
     pip install -r requirements.txt
     ```

4. **Start the Flask Server**
   - In the `backend` directory, run the following command to start the Flask server:
     ```bash
     python main.py
     ```

### Frontend

1. **Install Node Modules**

   - Navigate to the `frontend` folder and install required npm packages by running:
     ```bash
     npm install
     ```

2. **Run the React Application**
   - In the `frontend` directory, start the React application by executing:
     ```bash
     npm start
     ```

---

## Usage

### Login Credentials

Use the following credentials to log in:

Or use the **Sign Up** option to create a new account.

---

## API Endpoints

- **Product Recommendations**: Provides personalized recommendations based on user queries.
- **Order/Shipping Status**: Retrieves the status of an order using the order ID.
- **Fraudulent Transaction Reporting**: Processes fraudulent transaction reports for resolution.

---

## How It Works

1. **React Frontend**: Handles the user interface, including login/signup, querying agents, and displaying results.
2. **Flask Backend**: Processes frontend requests and interacts with LangChain and MongoDB.
3. **LangChain Framework**: Integrates AI agents for natural language understanding and decision-making.
4. **MongoDB Database**: Stores user, product, and order details.
