import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

export const getTodos = async () => {
    const response = await api.get("/todos");
    return response.data;
};

export const createTodo = async (todo: Omit<Todo, "id">) => {
    const response = await api.post("/todos", todo);
    return response.data;
};

export const updateTodo = async (todoId: number, todo: Todo) => {
    const response = await api.put(`/todos/${todoId}`, todo);
    return response.data;
};

export const deleteTodo = async (todoId: number) => {
    await api.delete(`/todos/${todoId}`);
};
