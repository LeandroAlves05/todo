import React, { useEffect, useState, useCallback } from "react";
import { Button, List, ListItem, ListItemText, TextField, Container, Typography, Paper, ListItemButton, IconButton, Box } from "@mui/material";
import { getTodos, createTodo, updateTodo, deleteTodo, Todo } from "./api";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './App.css';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState<string>("");

  const fetchTodos = useCallback(async () => {
    try {
      const todosData = await getTodos();
      setTodos(todosData);
    } catch (error) {
      console.error("Erro ao buscar todos:", error);
    }
  }, []);

  const addTodo = useCallback(async () => {
    if (newTodo.trim() === "") return;
    try {
      const newTodoData: Omit<Todo, 'id'> = {
        title: newTodo,
        completed: false,
      };
      const createdTodo = await createTodo(newTodoData);
      setTodos((prevTodos) => [...prevTodos, createdTodo]);
      setNewTodo("");
    } catch (error) {
      console.error("Erro ao criar o Todo:", error);
    }
  }, [newTodo]);

  const handleToggleTodo = useCallback(async (todoId: number, currentStatus: boolean) => {
    try {
      const updatedTodo = await updateTodo(todoId, {
        id: todoId,
        title: "",
        completed: !currentStatus,
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId ? { ...todo, completed: updatedTodo.completed } : todo
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar o Todo:", error);
    }
  }, []);

  const handleEditTodo = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTodoTitle(todo.title);
  };

  const handleSaveEdit = async () => {
    if (!editingTodoId || editingTodoTitle.trim() === "") return;
    try {
      const updatedTodo = await updateTodo(editingTodoId, {
        id: editingTodoId,
        title: editingTodoTitle,
        completed: false,
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === editingTodoId ? { ...todo, title: updatedTodo.title } : todo
        )
      );
      setEditingTodoId(null);
      setEditingTodoTitle("");
    } catch (error) {
      console.error("Erro ao editar o Todo:", error);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    } catch (error) {
      console.error("Erro ao excluir o Todo:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <Container maxWidth="md" className="app-container">
      <Typography variant="h4" gutterBottom textAlign="center" className="title">
        Todo List
      </Typography>

      <Paper sx={{ padding: 3, mb: 2 }} className="todo-input">
        <TextField
          label="New Todo"
          variant="outlined"
          fullWidth
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={addTodo} fullWidth sx={{ mt: 2 }}>
          Add Todo
        </Button>
      </Paper>

      <List sx={{ width: '100%', maxWidth: 600, margin: 'auto' }} className="todo-list">
        {todos.map((todo) => (
          <ListItem key={todo.id} className={`todo-item ${todo.completed ? 'completed' : 'pending'}`}>
            <ListItemButton onClick={() => handleToggleTodo(todo.id, todo.completed)} className="todo-button">
              {editingTodoId === todo.id ? (
                <TextField
                  value={editingTodoTitle}
                  onChange={(e) => setEditingTodoTitle(e.target.value)}
                  size="small"
                  autoFocus
                  fullWidth
                />
              ) : (
                <ListItemText
                  primary={todo.title}
                  secondary={todo.completed ? "Completed" : "Pending"}
                />
              )}
            </ListItemButton>

            <Box className="todo-actions">
              {editingTodoId === todo.id ? (
                <Button variant="contained" color="primary" onClick={handleSaveEdit} size="small" className="save-button">
                  Save
                </Button>
              ) : (
                <Box className="action-buttons">
                  <IconButton color="primary" onClick={() => handleEditTodo(todo)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteTodo(todo.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}

              <Box className={`status-box ${todo.completed ? 'completed' : 'pending'}`}>
                {todo.completed ? "Completed" : "Pending"}
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default App;
