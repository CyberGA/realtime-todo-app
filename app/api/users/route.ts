import { IResponse } from "@/definitions/response.interface";
import { connectDatabase, disconnectDatabase } from "../lib/mongoose.setup";
import User from "../models/user.schema.model";
import { IUser } from "@/definitions/user.interface";

export async function GET() {
  await connectDatabase();

  try {
    //   get add users
    let users = await User.find();

    const resData: IUser[] = users.map((user) => {
      return {
        id: user.id.toString(),
        username: user.username,
      };
    });

    const response: IResponse = {
      message: "Users retrieved successfully",
      status: 200,
      data: resData,
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
  } finally {
    await disconnectDatabase();
  }
}
