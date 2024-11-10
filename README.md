# Todo App - Full Stack Application

This project is a **Full Stack Todo Application** with the **Frontend** built in **React** using **Material UI** and the **Backend** built with **FastAPI**. The backend connects to a **PostgreSQL** database which is containerized with **Docker** for local development.

## Project Structure

The project is divided into two main parts:

- **`todo-app`**: The React frontend application.
- **`todo-server`**: The Python FastAPI backend application.

## Prerequisites

Before running the project locally, ensure that you have the following installed:

- [Node.js 20.18+ and npm 10.8+](https://nodejs.org/en/)
- [Python 3.9+](https://www.python.org/downloads/)
- [Docker](https://www.docker.com/get-started)


## Getting Started

---

### Running the Frontend (React with Material UI)

1. Navigate to the `todo-app` directory:

    ```bash
    cd todo-app
    ```

2. Setup Environment Variables

    To configure the API URL for the frontend, you can set the `REACT_APP_API_URL` environment variable in the `.env` file. This allows the frontend to communicate with the backend server.

    Example for `.env` file in the frontend:

    ```bash
    touch .env
    echo REACT_APP_API_URL="http://localhost:8000" > .env
    ``` 

3. Install the necessary dependencies:

    ```bash
    npm install
    ```

4. Start the React development server:

    ```bash
    npm start
    ```

5. Open your browser and visit `http://localhost:3000` to see the app running.

The frontend communicates with the backend using **Axios** for API requests. The base URL for the backend is set via the `REACT_APP_API_URL` environment variable.

6. Run lint formatter (Optional)
    ```bash
    npm run lint
    ```
---

### Running the Backend (FastAPI with PostgreSQL and Docker)

1. Navigate to the `todo-server` directory:

    ```bash
    cd todo-server
    ```

2. Setup Environment Variables

    To configure the database connection, you can set the `DATABASE_URL` environment variable in the `.env` file. This allows the backend to communicate with the database.

    Example for `.env` file in the backend:

    ```bash
    touch .env
    echo DATABASE_URL="postgresql://user:password@localhost:5432/todolist" > .env
    ``` 

3. Set up a Python virtual environment:

    ```bash
    python3 -m venv .venv
    ```

4. Activate the virtual environment:

    - On MacOS/Linux:

      ```bash
      source .venv/bin/activate
      ```

    - On Windows:

      ```bash
      source .venv\Scripts\activate
      ```

5. Install the required dependencies using `pip`:

    ```bash
    pip install -r requirements.txt
    ```

6. Initialize the database container using Docker:

    ```bash
    sudo docker compose up -d
    ```

7. Run the fastAPI server application:

    ```bash
    fastapi dev app/main.py
    ```

---

## Project Details

### Frontend (`todo-app`)
- Built with **React**.
- Styled using **Material UI** components.
- **Axios** is used to make API calls to the backend.

### Backend (`todo-server`)
- Built with **FastAPI**.
- **SQLAlchemy** for database ORM.
- **Pydantic** for data validation.
- **PostgreSQL** is used for the database (via Docker).
