import { IResponse } from "@/definitions/response.interface";
import { connectDatabase } from "../../lib/mongoose.setup";
import Task from "../../models/task.schema.model";

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

    const response: IResponse = {
      message: "Task saved successfully",
      status: 201,
      data: {
        title,
        desc,
        done,
        owner,
        marker,
        contributors,
      },
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
