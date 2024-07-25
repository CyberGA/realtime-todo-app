import { IData } from "./database.interface";

export interface IResponse {
  status: number;
  message: string;
  data?: Array<IData>
}
