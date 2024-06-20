import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Row, Col } from 'react-bootstrap';
import ToDoForm from './ToDoForm';
import EditToDo from './EditToDo';

const ToDoList = () => {
    const [todos, setTodos] = useState([]);
    const [editingTodo, setEditingTodo] = useState(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/todos/in-progress/');
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/todos/${id}/`);
            fetchTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const editTodo = (todo) => {
        setEditingTodo(todo);
    };

    const updateTodo = async (updatedTodo) => {
        try {
            await axios.put(`http://localhost:8080/api/todos/${updatedTodo.id}/`, updatedTodo);
            fetchTodos(); // Refresh the list after updating
            setEditingTodo(null); // Exit editing mode
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const cancelEdit = () => {
        setEditingTodo(null); // Cancel editing mode
    };

    const markAsDone = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/todos/${id}/`, {
                ...todos.find(todo => todo.id === id),
                status: 'completed',
                date_completed: new Date().toISOString(),
            });
            fetchTodos(); // Refresh the list after marking as done
        } catch (error) {
            console.error('Error marking as done:', error);
        }
    };


    return (
        <div>
            <header className="text-center mb-4 my-4">
                <h1>To-Do List</h1>
            </header>
            <hr />
            <div className="container justify-content-center">
                <ToDoForm fetchTodos={fetchTodos} />
                <div className="row justify-content-center mb-4">
                    <div className="col-md-8">
                        <h2 className="text-left">Task list:</h2>
                    </div>
                </div>

                {todos.map(todo => (
                    <Row key={todo.id} className="justify-content-center mb-4">
                        <Col md={8}>
                            {editingTodo && editingTodo.id === todo.id ? (
                                <EditToDo todo={editingTodo} fetchTodos={fetchTodos} onCancel={cancelEdit} />
                            ) : (
                                <Card>
                                    <Card.Body className="d-flex">
                                        <div className="flex-grow-1">
                                            <div className="d-flex flex-column">
                                                <h3 className="mb-0 me-1">{todo.description}</h3>
                                                <p className="text-muted mb-2 mt-1">Priority: {todo.priority}</p>
                                            </div>
                                            <p className="text-muted mt-4">Created on: {formatDateTime(todo.date_created)}</p>
                                        </div>
                                        <div className="col-4 text-end">
                                            <Button variant="success" className="w-100 mb-2" onClick={() => markAsDone(todo.id)}>Mark as Done</Button>
                                            <Button variant="primary" className="w-100 mb-2" onClick={() => editTodo(todo)}>Edit</Button>
                                            <Button variant="danger" className="w-100" onClick={() => deleteTodo(todo.id)}>Delete</Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            )}
                        </Col>
                    </Row>
                ))}
            </div>
        </div>
    );

    function formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        return date.toLocaleDateString('en-GB', options);
    }


};

export default ToDoList;
