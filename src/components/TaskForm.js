'use client';
import { useState } from 'react';
import { createTask } from '@/app/actions/tasks';

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if dueDate is empty or invalid
    if (!dueDate || isNaN(new Date(dueDate).getTime())) {
      setError('Please provide a valid due date.');
      return;
    }
    
    console.log('Form submitted with data:', { title, description, dueDate });

    const { success, error } = await createTask({ title, description, dueDate });
    if (success) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setError(''); // Clear error if task is successfully created
      onTaskCreated();
    } else {
      console.error('Error creating task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-4 max-w-lg mx-auto">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full bg-white text-black"
        required
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full bg-white text-black"
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border p-2 w-full bg-white text-black"
      />

      {error && <p className="text-red-500">{error}</p>}

      <button type="submit" className="bg-blue-500 text-white p-2 w-full">
        Add Task
      </button>
    </form>
  );
}
