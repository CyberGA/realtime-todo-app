import { ITask } from "@/definitions/task.interface";
import mongoose, { Schema, Document } from "mongoose";

interface ISToreTask extends Omit<ITask, "id">, Document {}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  done: { type: Boolean, default: false },
  owner: { type: String, default: "default" },
  marker: { type: String, default: null },
  contributors: { type: [String], default: [] },
});

export default mongoose.models.Task ||
  mongoose.model<ISToreTask>("Task", TaskSchema);
