import { IResponse } from "@/definitions/response.interface";
import { connectDatabase } from "../../lib/mongoose.setup";
import User from "../../models/user.schema.model";

export async function POST(req: Request) {
  await connectDatabase();
  const { username } = await req.json();
  if (!username) {
    const response: IResponse = {
      message: "Username is required",
      status: 403,
      data: null,
    };
    return Response.json(response);
  }

  try {
    const userExits = await User.findOne({ username: username });
    if (userExits) {
      const response: IResponse = {
        message: `user already exists`,
        status: 400,
        data: null,
      };
      return Response.json(response);
    }

    const user = new User({ username });
    await user.save();

    const response: IResponse = {
      message: `${username} has been registered successfully`,
      status: 201,
      data: user,
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
