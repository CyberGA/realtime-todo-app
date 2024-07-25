"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ITask } from "@/definitions/task.interface";
import { IResponse } from "@/definitions/response.interface";
import { useRouter } from "next/navigation";
import { IUser } from "@/definitions/user.interface";

export default function AddTask(): React.JSX.Element {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<Array<IUser>>([]);
  const router = useRouter();

  const [formData, setFormData] = useState<Omit<ITask, "id">>({
    title: "",
    desc: "",
    done: false,
    owner: "",
    marker: null,
    contributors: [],
  });

  const resetContributors = (): void => {
    setFormData({
      ...formData,
      contributors: [],
    });
  };

  const handleFormData = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    if (e.target.name === "contributors") {
      console.log(e.target.value);
      const selectedContributors = [...formData.contributors, e.target.value];
      setFormData({
        ...formData,
        [e.target.name]: selectedContributors,
      });
      return;
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getAllUsers = async (): Promise<void> => {
    try {
      const resp = await axios.get("/api/users", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData: IResponse = resp.data;
      console.log(resData.data);
      if (resData.status == 200) {
        const allUsers: IUser[] = resData.data;
        setUsers(allUsers);
      }
    } catch (error) {}
  };

  const submitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");
    if (!formData.title || !formData.desc) {
      setError("Title and Description are required");
      return;
    }

    try {
      setLoading((loading) => true);
      const data = formData;
      const username: string | null = sessionStorage.getItem("username");
      if (!username) {
        router.push("/");
        return;
      }
      data.owner = username;
      console.log(data);
      const resp = await axios.post("/api/todos/add", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res: IResponse = resp.data;
      console.log(res);
    } catch (error) {
      setError("Could not create task");
    } finally {
      setLoading((loading) => false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto my-2 px-6 py-12 bg-white rounded-lg border shadow-md">
      <form onSubmit={submitHandler} className="">
        <h1 className="text-4xl font-bold text-black/60">New Task</h1>
        {error && (
          <div className="border border-rose-400 px-4 py-2 rounded-md mt-2 text-black/60 text-sm">
            Error: {error}
          </div>
        )}
        <div className="flex flex-col items-center gap-2 my-10">
          <input
            name="title"
            required
            onChange={handleFormData}
            value={formData.title}
            placeholder="e.g. My Title"
            className="border px-4 py-3 text-base w-full rounded-lg"
          />
          <textarea
            name="desc"
            onChange={handleFormData}
            required
            value={formData.desc}
            placeholder="e.g. My Description"
            className="border px-4 h-20 resize-none py-3 text-base w-full rounded-lg hover:bg-black/5"
          />
          <div className="w-full flex gap-2 items-center">
            <div className="border w-full px-4 py-2 text-base rounded-lg hover:bg-black/5">
              <select
                name="contributors"
                value={formData.contributors}
                onChange={handleFormData}
                className="w-full outline-none focus-visible:outline-none "
              >
                <option value="">Select a contributor</option>
                {users
                  .filter(
                    (user) => !formData.contributors.includes(user.username)
                  )
                  .map((user) => (
                    <option key={user.id} value={user.username}>
                      {user.username}
                    </option>
                  ))}
              </select>
            </div>
            {formData.contributors.length != 0 && (
              <span
                onClick={resetContributors}
                className="cursor-pointer text-black/50 text-xs"
              >
                Reset
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 mt-5 text-white text-base bg-primary-100 rounded-lg cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "loading.." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
