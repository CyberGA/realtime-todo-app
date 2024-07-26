"use client";

import { useState, useEffect, useCallback } from "react";
import { ITask } from "@/definitions/task.interface";
import { IResponse } from "@/definitions/response.interface";
import { IUser } from "@/definitions/user.interface";
import axios from "@/lib/axios";

export default function AddTask(): React.JSX.Element {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [users, setUsers] = useState<Array<IUser>>([]);

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

  const getCollaborators = useCallback(async (): Promise<void> => {
    try {
      const resp = await axios.get("/api/users");
      const currentUser = sessionStorage.getItem("username");
      const resData: IResponse = resp.data;
      if (resData.status == 200) {
        const allUsers: IUser[] = resData.data;
        setUsers(allUsers.filter((user) => user.username != currentUser));
      }
    } catch (error) {}
  }, []);

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
      const username: string = sessionStorage.getItem("username") as string;
      data.owner = username;
      const resp = await axios.post("/api/todos/add", data);
      const res: IResponse = resp.data;
      if (res.status == 201) {
        setFormData({
          title: "",
          desc: "",
          done: false,
          owner: "",
          marker: null,
          contributors: [],
        });
        setShowForm(showForm => false)
      }
    } catch (error) {
      setError("Could not create task");
    } finally {
      setLoading((loading) => false);
    }
  };

  useEffect(() => {
    getCollaborators();
  }, [getCollaborators]);

  return (
    <>
      <button
        onClick={() => setShowForm((showForm) => !showForm)}
        className="text-white text-xs bg-primary-100 px-2 py-1 rounded-lg"
      >
        {showForm ? "Close Form" : "Add Task"}
      </button>
      <div
        className={`bg-white absolute z-20 left-6 right-6 top-10 ${
          showForm ? "block" : "hidden"
        } duration-300 ease-in`}
      >
        <div className="w-full max-w-2xl mx-auto px-6 py-12 bg-white rounded-lg border shadow-md">
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
                <div className="border w-full px-4 py-2 text-base rounded-lg cursor-pointer *:hover:cursor-pointer">
                  <select
                    name="contributors"
                    value={formData.contributors}
                    onChange={handleFormData}
                    className="w-full outline-none focus-visible:outline-none cursor-pointer"
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
                {loading ? "loading.." : "Done"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
