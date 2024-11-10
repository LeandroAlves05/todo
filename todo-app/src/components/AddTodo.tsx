import React from "react";
import { Button, CircularProgress, TextField, Paper } from "@mui/material";

interface AddTodoProps {
    newTodo: string;
    loading: boolean;
    onNewTodoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddTodo: () => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ newTodo, loading, onNewTodoChange, onAddTodo, onKeyDown }) => {
    return (
        <Paper className="todo-input">
            <TextField
                label="New Todo"
                variant="outlined"
                fullWidth
                value={newTodo}
                onChange={onNewTodoChange}
                onKeyDown={onKeyDown}
                margin="normal"
                disabled={loading}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={onAddTodo}
                fullWidth
                className="add-button"
                disabled={loading || newTodo.trim() === ""}
                data-testid="add-todo-button"
            >
                {loading ? <CircularProgress size={24} /> : "Add Todo"}
            </Button>
        </Paper>
    );
};

export default AddTodo;
