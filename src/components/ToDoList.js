import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Row, Col } from 'react-bootstrap';
import ToDoForm from './ToDoForm';
import EditToDo from './EditToDo';

const ToDoList = () => {
    const [todos, setTodos] = useState([]);
    const [editingTodo, setEditingTodo] = useState(null);
    const [sortedTodos, setSortedTodos] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('date_created'); // Default sort criteria
    const [showCompleted, setShowCompleted] = useState(false); // State to toggle between in-progress and completed tasks

    useEffect(() => {
        fetchTodos();
    }, [showCompleted]); // Fetch todos when showCompleted changes

    useEffect(() => {
        sortTodos(sortCriteria);
    }, [todos, sortCriteria, showCompleted]);

    const fetchTodos = async () => {
        try {
            const endpoint = showCompleted ? 'completed' : 'in-progress';
            const response = await axios.get(`http://localhost:8080/api/todos/${endpoint}/`);
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

    const sortTodos = (criteria) => {
        let sorted;
        switch (criteria) {
            case 'date_created':
                sorted = [...todos].sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
                break;
            case 'date_ended':
                sorted = [...todos].sort((a, b) => {
                    if (!a.date_ended) return 1; // Tasks with no end date go to the end
                    if (!b.date_ended) return -1;
                    return new Date(b.date_ended) - new Date(a.date_ended);
                });
                break;
            case 'priority':
                sorted = [...todos].sort((a, b) => {
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                });
                break;
            default:
                sorted = [...todos]; // Default to original order
        }
        setSortedTodos(sorted);
        setSortCriteria(criteria);
    };

    const toggleShowCompleted = () => {
        setShowCompleted(!showCompleted);
    };

    return (
        <div>
            <header className="text-center mb-4 my-4">
                <h1>To-Do List</h1>
                <Button variant="secondary" onClick={toggleShowCompleted} className="mt-3">
                    {showCompleted ? 'View In Progress' : 'View Completed'}
                </Button>
            </header>
            <hr />
            <div className="container justify-content-center">
                {!showCompleted ? (
                    <div>
                        <ToDoForm fetchTodos={fetchTodos} />
                        <div className="row justify-content-center mb-4">
                            <div className="col-md-8">
                                <h2 className="text-left">Task list:</h2>
                            </div>
                        </div>
                        <div className="row justify-content-center mb-4">
                            <div className="btn-group col-md-8">
                                <button className="btn btn-secondary" onClick={() => sortTodos('date_created')}>
                                    Sort by Date Created
                                </button>
                                <button className="btn btn-secondary" onClick={() => sortTodos('date_ended')}>
                                    Sort by Deadline
                                </button>
                                <button className="btn btn-secondary" onClick={() => sortTodos('priority')}>
                                    Sort by Priority
                                </button>
                            </div>
                        </div>

                        {sortedTodos.map(todo => (
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
                                                    <div className="d-flex flex-column mt-3">
                                                        <p className="text-muted mb-1">Deadline : {formatDateTime(todo.date_to_be_completed)}</p>
                                                        <p className="text-muted">Created on: {formatDateTime(todo.date_created)}</p>
                                                    </div>
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
                ) : (
                    <div>
                        {/* Content for showing completed tasks */}
                        <h2 className="text-center mt-4 mb-4">Completed Tasks</h2>
                        {/* Add logic to display completed tasks */}
                        {/* Example: */}
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <ul className="list-group">
                                    {todos.map(todo => (
                                        <li key={todo.id} className="list-group-item">
                                            <h5>{todo.description}</h5>
                                            <p>Priority: {todo.priority}</p>
                                            <p>Completed on: {formatDateTime(todo.date_completed)}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
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
