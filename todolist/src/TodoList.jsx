import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState("");

    // Sayfa yüklendiğinde görevleri getir
    useEffect(() => {
        fetch("http://localhost:5000/todos")
            .then((response) => response.json())
            .then((data) => setTodos(data));
    }, []);

    // Yeni görev ekleme
    const addTask = () => {
        if (!newTask.trim()) return;
        fetch("http://localhost:5000/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: newTask }),
        })
            .then((response) => response.json())
            .then((newTodo) => setTodos([...todos, newTodo]));
        setNewTask("");
    };

    // Görev silme
    const deleteTask = (id) => {
        fetch(`http://localhost:5000/todos/${id}`, { method: "DELETE" })
            .then(() => setTodos(todos.filter((todo) => todo.id !== id)));
    };

    // Görevi güncelleme
    const updateTask = (id, updatedTask) => {
        fetch(`http://localhost:5000/todos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ task: updatedTask, completed: false }),
        })
            .then((response) => response.json())
            .then((updatedTodo) => {
                setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
            });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
                Todo List
            </Typography>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ mb: 3 }}
            >
                <TextField
                    variant="outlined"
                    label="Yeni görev ekle..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    fullWidth
                    sx={{ mr: 1 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={addTask}
                >
                    Ekle
                </Button>
            </Box>
            <List>
                {todos.map((todo) => (
                    <React.Fragment key={todo.id}>
                        <ListItem
                            secondaryAction={
                                <>
                                    <IconButton
                                        edge="end"
                                        color="primary"
                                        onClick={() => {
                                            const updatedTask = prompt(
                                                "Yeni görevi girin:",
                                                todo.task
                                            );
                                            if (updatedTask) updateTask(todo.id, updatedTask);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        color="error"
                                        onClick={() => deleteTask(todo.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText primary={todo.task} />
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </Container>
    );
};

export default TodoList;
