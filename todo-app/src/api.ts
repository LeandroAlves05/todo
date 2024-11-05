import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

export const getTodos = async () => {
    try {
        const response = await api.get("/todos/");
        return response.data;
    } catch (error) {
        console.error("Error while getting Todos:", error);
        throw error;
    }
};

export const createTodo = async (todo: Omit<Todo, 'id'>) => {
    try {
        const response = await api.post("/todos/", todo);
        return response.data;
    } catch (error) {
        console.error("Error while creating Todo:", error);
        throw error;
    }
};

export const updateTodo = async (todoId: number, todo: Todo) => {
    try {
        const response = await api.put(`/todos/${todoId}`, todo);
        return response.data;
    } catch (error) {
        console.error("Error while updating Todo:", error);
        throw error;
    }
};

export const deleteTodo = async (todoId: number) => {
    try {
        const response = await api.delete(`/todos/${todoId}`);
        return response.data;
    } catch (error) {
        console.error("Error while deleting Todo:", error);
        throw error;
    }
};
