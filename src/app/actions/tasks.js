'use server';
import clientPromise from '@/lib/mongodb';
import { Task } from '@/models/Task';
import { ObjectId } from "mongodb";

const DB_NAME = process.env.MONGODB_DB_NAME || 'task-manager'; // Default to 'task-manager' if not set in the environment

export async function createTask(taskData) {
    console.log('createTask called with data:', taskData);
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME); // Use environment variable for DB name
      const tasksCollection = db.collection('tasks');
  
      const task = new Task(taskData);
      console.log('Task object:', task);
      
      const result = await tasksCollection.insertOne(task);
      console.log('Task inserted with ID:', result.insertedId);
  
      return { success: true, taskId: result.insertedId.toString() }; // Convert ObjectId to string
    } catch (error) {
      console.error('Error in createTask:', error);
      return { success: false, error: error.message };
    }
}

export async function getTasks() {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME); // Use environment variable for DB name
      const tasksCollection = db.collection('tasks');

      // Fetch tasks and sort: incomplete tasks first, completed tasks last
      const tasks = await tasksCollection.find().sort({ isCompleted: 1 }).toArray();

      // Convert MongoDB documents to plain objects
      const plainTasks = tasks.map((task) => ({
        ...task,
        _id: task._id.toString(), // Convert ObjectId to string
      }));

      return { success: true, tasks: plainTasks };
    } catch (error) {
      return { success: false, error: error.message };
    }
}

export async function updateTask(taskId, updates) {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME); // Use environment variable for DB name
      const tasksCollection = db.collection('tasks');
  
      const result = await tasksCollection.updateOne(
        { _id: new ObjectId(taskId) }, // Convert taskId to ObjectId
        { $set: updates }
      );
  
      return { success: true, modifiedCount: result.modifiedCount };
    } catch (error) {
      return { success: false, error: error.message };
    }
}

export async function deleteTask(taskId) {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME); // Use environment variable for DB name
      const tasksCollection = db.collection('tasks');
  
      const result = await tasksCollection.deleteOne({ _id: new ObjectId(taskId) }); // Convert taskId to ObjectId
  
      return { success: true, deletedCount: result.deletedCount };
    } catch (error) {
      return { success: false, error: error.message };
    }
}
