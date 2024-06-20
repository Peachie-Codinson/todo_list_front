import React, { useState } from 'react';
import ToDoList from './components/ToDoList';
import ToDoForm from './components/ToDoForm';

const App = () => {
    const [fetchTodos, setFetchTodos] = useState(() => () => {});
    const [editingTodo, setEditingTodo] = useState(null);

    return (
        <div>
            <ToDoForm
                fetchTodos={fetchTodos}
                editingTodo={editingTodo}
                setEditingTodo={setEditingTodo}
            />
            <ToDoList setFetchTodos={setFetchTodos} setEditingTodo={setEditingTodo} />
        </div>
    );
};

export default App;
