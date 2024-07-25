import { BadRequest } from "@/definitions/error.model";
import Storage from "../../models/storage.model";
import { IResponse } from "@/definitions/response.interface";

const storage: Storage = new Storage();

export async function POST(req: Request) {
  const { username } = await req.json();
  if (!username) {
    const response: IResponse = {
      message: "Username is required",
      status: 403,
    };
    return Response.json(response);
  }

  try {
    storage.saveNewUser(username);
    const response: IResponse = {
      message: `${username} has been registered`,
      status: 201,
    };
    return Response.json(response);
  } catch (err) {
    let response: IResponse;
    if (err instanceof BadRequest) {
      response = { message: err.message, status: 400 };
    }
    response = {
      message: "Failed to save data to file",
      status: 500,
    };
    return Response.json(response);
  }
}
