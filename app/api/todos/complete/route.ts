import { type NextRequest } from "next/server";
import { IResponse } from "@/definitions/response.interface";
import { connectDatabase, disconnectDatabase } from "../../lib/mongoose.setup";
import Task from "../../models/task.schema.model";
import pusher from "../../models/pusher.model";

export async function POST(req: NextRequest) {
  await connectDatabase();
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("taskId");
  const user = searchParams.get("user");
  if (!id) {
    const response: IResponse = {
      message: "taskId and user param is required",
      status: 403,
      data: null,
    };
    return Response.json(response);
  }

  try {
    const task = await Task.findById(id);
    if (!task) {
      const response: IResponse = {
        message: "Task not found",
        status: 404,
        data: null,
      };
      return Response.json(response);
    }
    task.marker = user;
    task.done = true;
    await task.save();

    const respData = {
      id,
      done: true,
      marker: user,
    };

    const response: IResponse = {
      message: "Task completed successfully",
      status: 200,
      data: respData,
    };

    pusher.trigger("TODO_CHANNEL", "COMPLETE_TODO_EVENT", {
      message: `${JSON.stringify(respData)}\n\n`,
    });

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
