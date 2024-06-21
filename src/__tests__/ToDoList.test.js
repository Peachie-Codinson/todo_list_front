

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import ToDoList from '../components/ToDoList';

jest.mock('axios');

const mockTodos = [
    {
        id: 1,
        description: 'Test ToDo 1',
        priority: 'high',
        date_created: '2023-06-20T12:00:00Z',
        date_to_be_completed: '2023-06-25T12:00:00Z',
        status: 'in-progress',
    },
    {
        id: 2,
        description: 'Test ToDo 2',
        priority: 'medium',
        date_created: '2023-06-18T12:00:00Z',
        date_to_be_completed: '2023-06-22T12:00:00Z',
        status: 'in-progress',
    },
];

describe('ToDoList Component', () => {
    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockTodos });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('fetches and displays todos', async () => {
        render(<ToDoList />);
        
        expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/todos/in-progress/');
        
        await waitFor(() => {
            expect(screen.getByText('Test ToDo 1')).toBeInTheDocument();
            expect(screen.getByText('Test ToDo 2')).toBeInTheDocument();
        });
    });

    test('marks a todo as done', async () => {
        axios.put.mockResolvedValue({});
        render(<ToDoList />);
        
        await waitFor(() => {
            expect(screen.getByText('Test ToDo 1')).toBeInTheDocument();
        });

        const markAsDoneButton = screen.getAllByText('Mark as Done')[0];
        fireEvent.click(markAsDoneButton);

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith('http://localhost:8080/api/todos/1/', expect.any(Object));
            expect(axios.get).toHaveBeenCalledTimes(2); 
        });
    });

    test('edits a todo', async () => {
        render(<ToDoList />);
        
        await waitFor(() => {
            expect(screen.getByText('Test ToDo 1')).toBeInTheDocument();
        });

        const editButton = screen.getAllByText('Edit')[0];
        fireEvent.click(editButton);

        await waitFor(() => {
            expect(screen.getByText('Edit')).toBeInTheDocument();
        });
    });

    test('deletes a todo', async () => {
        axios.delete.mockResolvedValue({});
        render(<ToDoList />);
        
        await waitFor(() => {
            expect(screen.getByText('Test ToDo 1')).toBeInTheDocument();
        });

        const deleteButton = screen.getAllByText('Delete')[0];
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith('http://localhost:8080/api/todos/1/');
            expect(axios.get).toHaveBeenCalledTimes(2); 
        });
    });

    test('toggles show completed tasks', async () => {
        render(<ToDoList />);
        
        const toggleButton = screen.getByText('View Completed');
        fireEvent.click(toggleButton);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/todos/completed/');
        });
    });



});
