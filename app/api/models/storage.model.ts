import fs, { existsSync } from "fs";
import path from "path";
import database from "../database.json";
import { IData, IDatabase } from "@/definitions/database.interface";
import { BadRequest, InternalError } from "../../../definitions/error.model";

export default class Storage {
  private storage: IDatabase = database;
  private filePath: string = path.resolve(__dirname, "../../database.json");

  public getStorage(): IDatabase {
    return this.storage;
  }

  public setStorage(data: IDatabase): void {
    this.storage = data;
  }

  public saveNewUser(username: string): boolean {
    if (this.storage.users.includes(username)) {
      throw new BadRequest("username already exists");
    }

    this.storage.users.push(username);
    this.writeToFile();
    return true;
  }

  public saveNewEntry(data: IData): void {
    this.storage.data.push(data);
    this.writeToFile();
  }

  public getTodos(user: string): Array<IData> {
    const data = this.storage.data;
    return data.filter((todo) => {});
  }

  private writeToFile(): void {
    try {
      console.log("Writing to file:", fs.existsSync(this.filePath));
      fs.writeFileSync(
        this.filePath,
        JSON.stringify({}, null, 2),
        "utf-8"
      );
    } catch (error) {
      console.error("Error writing to file:", error);
      throw new InternalError("Failed to save data to file");
    }
  }
}
