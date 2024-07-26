import { type NextRequest } from "next/server";
import { IResponse } from "@/definitions/response.interface";
import { connectDatabase, disconnectDatabase } from "../lib/mongoose.setup";
import Task from "../models/task.schema.model";
import { IData } from "@/definitions/database.interface";
import pusher from "../models/pusher.model";

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
    const defaultTasks = await Task.find({
      owner: "admin",
    });
    const userTasks = await Task.find({ owner: username});
    const otherTasks = await Task.find({
      contributors: { $in: [username] },
    });
    const tasks = defaultTasks
      .concat(userTasks)
      .concat(otherTasks)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    const respData: IData[] = tasks.map((task) => {
      return {
        id: task._id.toString(),
        title: task.title,
        desc: task.desc,
        done: task.done,
        owner: task.owner,
        marker: task.marker,
        contributors: task.contributors,
      };
    });

    const response: IResponse = {
      message: "Tasks retrieved successfully",
      status: 200,
      data: respData,
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
  } finally {
    await disconnectDatabase();
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

    if (!task) {
      const response: IResponse = {
        message: "Task not found",
        status: 404,
        data: null,
      };
      return Response.json(response);
    }

    const respData = {
      id,
      title: task.title,
      desc: task.desc,
      done: task.done,
      owner: task.owner,
    };

    const response: IResponse = {
      message: "Task deleted successfully",
      status: 200,
      data: task,
    };

    pusher.trigger("TODO_CHANNEL", "DELETE_TODO_EVENT", {
      message: `${JSON.stringify(respData)}\n\n`,
    });

    return Response.json(response);
  } catch (err) {
    let response: IResponse;
    response = {
      message: "Could not delete task",
      status: 500,
      data: null,
    };
    return Response.json(response);
  } finally {
    await disconnectDatabase();
  }
}
