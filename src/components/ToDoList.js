import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ToDoList = () => {
    const [todos, setTodos] = useState([]);
    const [editingTodo, setEditingTodo] = useState(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/todos/');
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };
    

    const deleteTodo = async (id) => {
        await axios.delete(`http://localhost:8080/api/todos/${id}/`);
        fetchTodos();
    };

    const editTodo = (todo) => {
        setEditingTodo(todo);
    };

    return (
        <div>
            <h1>To-Do List</h1>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        {todo.description} (Priority: {todo.priority})
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                        <button onClick={() => editTodo(todo)}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ToDoList;
