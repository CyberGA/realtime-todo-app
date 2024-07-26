import { type NextRequest } from "next/server";
import { IResponse } from "@/definitions/response.interface";
import { connectDatabase, disconnectDatabase } from "../../lib/mongoose.setup";
import Task from "../../models/task.schema.model";
import pusher from "../../models/pusher.model";

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
  // check if all field except id is undefined or null
  if (!title && !desc && !done && !owner && !marker && !contributors) {
    const response: IResponse = {
      message: "No data to update",
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
    if (title) task.title = title;
    if (desc) task.desc = desc;
    if (contributors) task.contributors = contributors;
    await task.save();

    const respData = {
      id: task._id.toString(),
      title: task.title,
      desc: task.desc,
      done: task.done,
      owner: task.owner,
      marker: task.marker,
      contributors: task.contributors,
    };

    const response: IResponse = {
      message: "Task updated successfully",
      status: 200,
      data: respData,
    };

    pusher
      .trigger("TODO_CHANNEL", "ADD_UPDATE_TODO_EVENT", {
        message: `${JSON.stringify(respData)}\n\n`,
      });

    return Response.json(response);
  } catch (err) {
    let response: IResponse;
    response = {
      message: "Failed to update task",
      status: 500,
      data: null,
    };
    return Response.json(response);
  } finally {
    await disconnectDatabase();
  }
}
