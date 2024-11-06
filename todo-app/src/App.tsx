import React, { useEffect, useState, useCallback } from "react";
import { Button, List, ListItem, ListItemText, TextField, Container, Typography, Paper, ListItemButton, IconButton, Box, CircularProgress } from "@mui/material";
import { getTodos, createTodo, updateTodo, deleteTodo, Todo } from "./api";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './App.css';

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

  const handleToggleTodo = useCallback(async (todoId: number) => {
    const todo = todos.find((todo) => todo.id === todoId);
    if (!todo) return;
    setLoading(true);
    try {
      const updatedTodo = await updateTodo(todoId, {
        id: todoId,
        text: todo.text,
        completed: !todo.completed,
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId ? updatedTodo : todo
        )
      );
    } catch (error) {
      console.error("Error while updating Todo (frontend error):", error);
    } finally {
      setLoading(false);
    }
  }, [todos]);

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
        prevTodos.map((todo) =>
          todo.id === editingTodoId ? { ...todo, text: updatedTodo.text } : todo
        )
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

      <Paper className="todo-input">
        <TextField
          label="New Todo"
          variant="outlined"
          fullWidth
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          margin="normal"
          disabled={loading}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={addTodo}
          fullWidth
          className="add-button"
          disabled={loading || newTodo.trim() === ""}
        >
          {loading ? <CircularProgress size={24} /> : "Add Todo"}
        </Button>
      </Paper>

      <List className="todo-list">
        {todos.map((todo) => (
          <ListItem key={todo.id} className={`todo-item ${todo.completed ? 'completed' : 'pending'}`}>
            {editingTodoId === todo.id ? (
              <Box className="editing-todo">
                <TextField
                  value={editingTodoText}
                  onChange={(e) => setEditingTodoText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  size="small"
                  autoFocus
                  fullWidth
                />
              </Box>
            ) : (
              <ListItemButton
                onClick={() => handleToggleTodo(todo.id)}
                disabled={loading}
              >
                <ListItemText
                  primary={todo.text}
                  secondary={todo.completed ? "Completed" : "Pending"}
                />
              </ListItemButton>
            )}

            <Box className="todo-actions">
              {editingTodoId === todo.id ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveEdit}
                    size="small"
                    disabled={loading || editingTodoText.trim() === "" || editingTodoText === todo.text}
                  >
                    {loading ? <CircularProgress size={24} /> : "Save"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancelEdit}
                    size="small"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Box className="action-buttons">
                  <IconButton color="primary" onClick={() => handleEditTodo(todo)} disabled={loading}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteTodo(todo.id)} disabled={loading}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default App;
