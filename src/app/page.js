'use client';
import { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '@/app/actions/tasks';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { success, tasks } = await getTasks();
    if (success) setTasks(tasks);
    setLoading(false);
  };

  const handleDelete = async (taskId) => {
    const res = await deleteTask(taskId);
    
    if (res.success) {
      alert("Task deleted successfully!");
      setTasks(tasks.filter(task => task._id !== taskId)); // Update UI instantly
    } else {
      alert("Error deleting task: " + res.error);
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <TaskForm onTaskCreated={fetchTasks} />
      {loading ? <p>Loading...</p> : <TaskList tasks={tasks} onDelete={handleDelete} onUpdate={fetchTasks} />}
    </div>
  );
}