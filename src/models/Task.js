import { ObjectId } from 'mongodb';

export class Task {
  constructor({ title, description, dueDate, isCompleted = false, _id }) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.isCompleted = isCompleted;
    this._id = _id ? new ObjectId(_id) : null;
  }
}