import React from "react";
import {
    Button,
    Box,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    TextField,
    CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Todo } from "../api/index";

interface TodoItemProps {
    todo: Todo;
    editingTodoId: number | null;
    editingTodoText: string;
    loading: boolean;
    onToggle: (id: number) => void;
    onEdit: (todo: Todo) => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onDelete: (id: number) => void;
    onTextChange: (text: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
    todo,
    editingTodoId,
    editingTodoText,
    loading,
    onToggle,
    onEdit,
    onSaveEdit,
    onCancelEdit,
    onDelete,
    onTextChange,
}) => {
    return (
        <ListItem key={todo.id} className={`todo-item ${todo.completed ? "completed" : "pending"}`}>
            {editingTodoId === todo.id ? (
                <Box className="editing-todo">
                    <TextField
                        value={editingTodoText}
                        onChange={(e) => onTextChange(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onSaveEdit()}
                        size="small"
                        autoFocus
                        fullWidth
                    />
                </Box>
            ) : (
                <ListItemButton onClick={() => onToggle(todo.id)} disabled={loading}>
                    <ListItemText primary={todo.text} secondary={todo.completed ? "Completed" : "Pending"} />
                </ListItemButton>
            )}

            <Box className="todo-actions">
                {editingTodoId === todo.id ? (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onSaveEdit}
                            size="small"
                            disabled={loading || editingTodoText.trim() === "" || editingTodoText === todo.text}
                        >
                            {loading ? <CircularProgress size={24} /> : "Save"}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={onCancelEdit}
                            size="small"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </>
                ) : (
                    <Box className="action-buttons">
                        <IconButton
                            color="primary"
                            onClick={() => onEdit(todo)}
                            disabled={loading}
                            data-testid="edit-todo-button"
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => onDelete(todo.id)}
                            disabled={loading}
                            data-testid="delete-todo-button"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </ListItem>
    );
};

export default TodoItem;
