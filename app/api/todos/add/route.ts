import { IResponse } from "@/definitions/response.interface";
import { connectDatabase, disconnectDatabase } from "../../lib/mongoose.setup";
import Task from "../../models/task.schema.model";
import pusher from "../../models/pusher.model";

export async function POST(req: Request) {
  await connectDatabase();
  const { title, desc, done, owner, marker, contributors } = await req.json();
  if (!title || !desc || !owner) {
    const response: IResponse = {
      message: "Title, description, and owner are required",
      status: 403,
      data: null,
    };
    return Response.json(response);
  }

  try {
    const task = new Task({
      title,
      desc,
      done,
      owner,
      marker,
      contributors,
    });
    await task.save();

    const respData = {
      id: task._id.toString(),
      title,
      desc,
      done,
      owner,
      marker,
      contributors,
    };

    const response: IResponse = {
      message: "Task saved successfully",
      status: 201,
      data: respData,
    };
    pusher.trigger("TODO_CHANNEL", "ADD_UPDATE_TODO_EVENT", {
      message: `${JSON.stringify(respData)}\n\n`,
    });
    return Response.json(response);
  } catch (err) {
    let response: IResponse;
    response = {
      message: "Could not create the task",
      status: 500,
      data: null,
    };
    return Response.json(response);
  } finally {
    await disconnectDatabase();
  }
}
