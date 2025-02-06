'use client';
import { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '@/app/actions/tasks';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import { ToastContainer, toast } from 'react-toastify';  // Import toastify
import 'react-toastify/dist/ReactToastify.css';  // Import toastify CSS

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
      toast.success("Task deleted successfully!");  // Show success toast
      setTasks(tasks.filter(task => task._id !== taskId)); // Update UI instantly
    } else {
      toast.error("Error deleting task: " + res.error);  // Show error toast
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <TaskForm onTaskCreated={fetchTasks} />
      {loading ? <p>Loading...</p> : <TaskList tasks={tasks} onDelete={handleDelete} onUpdate={fetchTasks} />}
      <ToastContainer />  {/* Add ToastContainer for displaying toasts */}
    </div>
  );
}
