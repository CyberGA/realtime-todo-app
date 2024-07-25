import { type NextRequest } from "next/server";
import { IResponse } from "@/definitions/response.interface";
import { connectDatabase } from "../lib/mongoose.setup";
import Task from "../models/task.schema.model";
import { IData } from "@/definitions/database.interface";

export async function GET(req: NextRequest) {
  await connectDatabase();
  const searchParams = req.nextUrl.searchParams;
  const username = searchParams.get("username");
  if (!username) {
    const response: IResponse = {
      message: "Username is required",
      status: 403,
      data: null,
    };
    return Response.json(response);
  }

  try {
    const defaultTasks: IData[] = await Task.find({ owner: "default" });
    const ownerTasks: IData[] = await Task.find({ owner: "default" });
    const userTasks: IData[] = await Task.find({ contributors: username });
    const tasks = defaultTasks.concat(ownerTasks).concat(userTasks);

    const response: IResponse = {
      message: "Tasks retrieved successfully",
      status: 200,
      data: tasks,
    };
    return Response.json(response);
  } catch (err) {
    let response: IResponse;
    response = {
      message: "Request failed",
      status: 500,
      data: null,
    };
    return Response.json(response);
  }
}

export async function DELETE(req: NextRequest) {
  await connectDatabase();
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    const response: IResponse = {
      message: "task id is required",
      status: 403,
      data: null,
    };
    return Response.json(response);
  }

  try {
    const task = await Task.findByIdAndDelete(id);

    const response: IResponse = {
      message: "Task deleted successfully",
      status: 200,
      data: task,
    };

    return Response.json(response);
  } catch (err) {
    let response: IResponse;
    response = {
      message: "Request failed",
      status: 500,
      data: null,
    };
    return Response.json(response);
  }
}
