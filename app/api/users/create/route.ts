import { IResponse } from "@/definitions/response.interface";
import { connectDatabase, disconnectDatabase } from "../../lib/mongoose.setup";
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
  if (username == "admin") {
    const response: IResponse = {
      message: "Username not allowed",
      status: 403,
      data: null,
    };
    return Response.json(response);
  }

  try {
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      const response: IResponse = {
        message: `Login Successful`,
        status: 200,
        data: {
          id: existingUser._id.toString(),
          username,
        },
      };
      return Response.json(response);
    }

    const user = new User({ username });
    await user.save();

    const respData = {
      id: user._id.toString(),
      username: user.username,
    };

    const response: IResponse = {
      message: `${username} has been registered successfully`,
      status: 201,
      data: respData,
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
