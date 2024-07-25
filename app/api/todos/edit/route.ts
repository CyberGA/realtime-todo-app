import { type NextRequest } from "next/server";
import { IResponse } from "@/definitions/response.interface";
import { connectDatabase } from "../../lib/mongoose.setup";
import Task from "../../models/task.schema.model";
import { IData } from "@/definitions/database.interface";

export async function POST(req: Request) {
  await connectDatabase();
  // update the task with the data from req body
  const { id, title, desc, done, owner, marker, contributors } =
    await req.json();
  if (!id) {
    const response: IResponse = {
      message: "Task id is required",
      status: 403,
      data: null,
    };
    return Response.json(response);
  }

  try {
    const task = await Task.findById({ id });
    if (!task) {
      const response: IResponse = {
        message: "Task not found",
        status: 404,
        data: null,
      };
      return Response.json(response);
    }
    task.title = title;
    task.desc = desc;
    task.done = done;
    task.owner = owner;
    task.marker = marker;
    task.contributors = contributors;

    await task.save();
    const response: IResponse = {
      message: "Task updated successfully",
      status: 200,
      data: task,
    };

    return Response.json(response);
  } catch (err) {
    let response: IResponse;
    response = {
      message: "Failed to save data to file",
      status: 500,
      data: null,
    };
    return Response.json(response);
  }
}
