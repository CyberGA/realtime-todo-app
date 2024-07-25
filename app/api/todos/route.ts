import { type NextRequest } from "next/server";
import { BadRequest } from "@/definitions/error.model";
import Storage from "../models/storage.model";
import { IResponse } from "@/definitions/response.interface";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const username = searchParams.get("username");
  if (!username) {
    const response: IResponse = {
      message: "Username is required",
      status: 403,
    };
    return Response.json(response);
  }
  const storage: Storage = new Storage();

  try {
    const data = storage.getStorage();
    const response: IResponse = {
      message: "List of todos ",
      status: 200,
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
