import React, { useEffect, useState, useCallback } from "react";
import { Container, Typography, List } from "@mui/material";
import { getTodos, createTodo, updateTodo, deleteTodo, Todo } from "./api/index";
import AddTodo from "./components/AddTodo";
import TodoItem from "./components/TodoItem";
import "./App.css";

const App: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState<string>("");
    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
    const [editingTodoText, setEditingTodoText] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const addTodo = useCallback(async () => {
        if (newTodo.trim() === "") return;
        setLoading(true);
        try {
            const createdTodo = await createTodo({
                text: newTodo,
                completed: false,
            });
            setTodos((prevTodos) => [...prevTodos, createdTodo]);
            setNewTodo("");
        } catch (error) {
            console.error("Error while creating Todo (frontend error):", error);
        } finally {
            setLoading(false);
        }
    }, [newTodo]);

    const handleToggleTodo = useCallback(
        async (todoId: number) => {
            const todo = todos.find((todo) => todo.id === todoId);
            if (!todo) return;
            setLoading(true);
            try {
                const updatedTodo = await updateTodo(todoId, {
                    id: todoId,
                    text: todo.text,
                    completed: !todo.completed,
                });
                setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === todoId ? updatedTodo : todo)));
            } catch (error) {
                console.error("Error while updating Todo (frontend error):", error);
            } finally {
                setLoading(false);
            }
        },
        [todos],
    );

    const handleEditTodo = (todo: Todo) => {
        setEditingTodoId(todo.id);
        setEditingTodoText(todo.text);
    };

    const handleSaveEdit = async () => {
        if (!editingTodoId || editingTodoText.trim() === "") return;
        setLoading(true);
        try {
            const updatedTodo = await updateTodo(editingTodoId, {
                id: editingTodoId,
                text: editingTodoText,
                completed: false,
            });
            setTodos((prevTodos) =>
                prevTodos.map((todo) => (todo.id === editingTodoId ? { ...todo, text: updatedTodo.text } : todo)),
            );
            setEditingTodoId(null);
            setEditingTodoText("");
        } catch (error) {
            console.error("Error while editing Todo (frontend error):", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingTodoId(null);
        setEditingTodoText("");
    };

    const handleDeleteTodo = async (todoId: number) => {
        setLoading(true);
        try {
            await deleteTodo(todoId);
            setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
        } catch (error) {
            console.error("Error while deleting Todo (frontend error):", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        getTodos()
            .then((data) => setTodos(data))
            .catch((error) => console.error("Error while searching for Todos:", error))
            .finally(() => setLoading(false));
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            if (editingTodoId) {
                handleSaveEdit();
            } else {
                addTodo();
            }
        } else if (event.key === "Escape") {
            handleCancelEdit();
        }
    };

    return (
        <Container maxWidth="md" className="app-container">
            <Typography variant="h4" gutterBottom textAlign="center" className="text">
                Todo List
            </Typography>

            <AddTodo
                newTodo={newTodo}
                loading={loading}
                onNewTodoChange={(e) => setNewTodo(e.target.value)}
                onAddTodo={addTodo}
                onKeyDown={handleKeyDown}
            />

            <List className="todo-list">
                {todos.map((todo) => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        editingTodoId={editingTodoId}
                        editingTodoText={editingTodoText}
                        loading={loading}
                        onToggle={handleToggleTodo}
                        onEdit={handleEditTodo}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                        onDelete={handleDeleteTodo}
                        onTextChange={setEditingTodoText}
                    />
                ))}
            </List>
        </Container>
    );
};

export default App;
