import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ToDoForm = ({ fetchTodos, editingTodo, setEditingTodo }) => {
    const [description, setDescription] = useState('');
    const [dateToBeCompleted, setDateToBeCompleted] = useState('');
    const [priority, setPriority] = useState('low');

    useEffect(() => {
        if (editingTodo) {
            setDescription(editingTodo.description);
            setDateToBeCompleted(editingTodo.date_to_be_completed);
            setPriority(editingTodo.priority);
        }
    }, [editingTodo]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (editingTodo) {
            await axios.put(`http://localhost:8080/api/todos/${editingTodo.id}/`, {
                description,
                date_to_be_completed: dateToBeCompleted,
                priority,
            });
        } else {
            await axios.post('http://localhost:8080/api/todos/', {
                description,
                date_to_be_completed: dateToBeCompleted,
                priority,
            });
        }
        setDescription('');
        setDateToBeCompleted('');
        setPriority('low');
        setEditingTodo(null);
        fetchTodos();
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Description:
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            <label>
                Date to be completed:
                <input
                    type="datetime-local"
                    value={dateToBeCompleted}
                    onChange={(e) => setDateToBeCompleted(e.target.value)}
                />
            </label>
            <label>
                Priority:
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </label>
            <button type="submit">{editingTodo ? 'Update' : 'Add'} To-Do</button>
        </form>
    );
};

export default ToDoForm;
