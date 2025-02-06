'use client';
import { useState } from 'react';
import { updateTask } from '@/app/actions/tasks';

export default function TaskList({ tasks, onDelete, onUpdate }) {
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editIsCompleted, setEditIsCompleted] = useState(false);

  const startEdit = (task) => {
    setEditingTask(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDueDate(task.dueDate);
    setEditIsCompleted(task.isCompleted);
  };

  const handleEditSubmit = async () => {
    await updateTask(editingTask, {
      title: editTitle,
      description: editDescription,
      dueDate: editDueDate,
      isCompleted: editIsCompleted,
    });

    setEditingTask(null);
    onUpdate(); // Refresh task list
  };

  const handleToggleComplete = async (taskId, isCompleted) => {
    await updateTask(taskId, { isCompleted: !isCompleted });
    onUpdate(); // Refresh task list
  };

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task._id} className="border p-4 mb-2 flex justify-between items-center">
          <div>
            <h2 className={`font-bold ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h2>
            <p>{task.description}</p>
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => handleToggleComplete(task._id, task.isCompleted)}
              className="mr-2"
            />
            <button onClick={() => startEdit(task)} className="text-blue-500 mr-2">Edit</button>
            <button onClick={() => onDelete(task._id)} className="text-red-500">Delete</button>
          </div>
        </li>
      ))}

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-2 text-black">Edit Task</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="border p-2 w-full mb-2 text-black"
            />
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="border p-2 w-full mb-2 text-black"
            />
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="border p-2 w-full mb-2 text-black"
            />
            <label className="flex items-center mb-2 text-black">
              <input
                type="checkbox"
                checked={editIsCompleted}
                onChange={() => setEditIsCompleted(!editIsCompleted)}
                className="mr-2"
              />
              Mark as Completed
            </label>
            <div className="flex justify-end">
              <button onClick={handleEditSubmit} className="bg-blue-500 text-white p-2 mr-2">Save</button>
              <button onClick={() => setEditingTask(null)} className="bg-gray-300 p-2">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </ul>
  );
}
