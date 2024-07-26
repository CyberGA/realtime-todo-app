"use client";

import { useState, useEffect, useCallback } from "react";
import { ITask } from "@/definitions/task.interface";
import { IResponse } from "@/definitions/response.interface";
import { IUser } from "@/definitions/user.interface";
import axios from "@/lib/axios";

const TaskActions: React.FC<{ task: ITask }> = ({ task }) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [users, setUsers] = useState<Array<IUser>>([]);
  const [currentUser, setCurrent] = useState<IUser>({
    username: "",
    id: "",
  });

  const [formData, setFormData] = useState<
    Omit<ITask, "owner" | "marker" | "done">
  >({
    id: task.id,
    title: task.title,
    desc: task.desc,
    contributors: task.contributors,
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

  const completeTasks = async (taskId: string): Promise<void> => {
    if (task.done) return;
    try {
      setBusy((busy) => true);
      const user = sessionStorage.getItem("username");
      const resp = await axios.post(
        `/api/todos/complete?taskId=${taskId}&user=${user}`
      );
      const res: IResponse = resp.data;
    } catch (error) {
      setError("Could not mark as completed");
    } finally {
      setBusy((busy) => false);
    }
  };

  const updateHandler = async (
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

      const resp = await axios.post("/api/todos/edit", formData);
      const res: IResponse = resp.data;
      if (res.status === 200) {
        setShowEdit((showEdit) => false);
      }
    } catch (error) {
      setError("Could not create task");
    } finally {
      setLoading((loading) => false);
    }
  };

  const deleteHandler = async (taskId: string): Promise<void> => {
    setError("");

    try {
      setBusy((busy) => true);

      const resp = await axios.delete(`/api/todos?id=${taskId}`);
      const res: IResponse = resp.data;
    } catch (error) {
      setError("Could not create task");
    } finally {
      setBusy((busy) => false);
    }
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

  useEffect(() => {
    getCollaborators();
  }, [getCollaborators]);

  useEffect(() => {
    setCurrent({
      username: sessionStorage.getItem("username") || "",
      id: sessionStorage.getItem("userId") || "",
    });
  }, []);

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {!showEdit && (
          <input
            type="checkbox"
            className="default:ring-2 cursor-pointer"
            readOnly={true}
            checked={task.done}
            disabled={busy}
            onClick={() => completeTasks(task.id)}
          />
        )}
        {!task.done && (
          <button
            onClick={() => setShowEdit((showEdit) => !showEdit)}
            className="text-black/60 text-xs px-2 py-1 rounded-lg"
          >
            {showEdit ? "Undo" : "Edit"}
          </button>
        )}
        {!showEdit && (
          <button
            disabled={busy}
            onClick={() => deleteHandler(task.id)}
            className="text-white text-xs bg-red-500 px-2 py-1 rounded-lg"
          >
            Delete
          </button>
        )}
      </div>
      <div className={` ${showEdit ? "block" : "hidden"} duration-300 ease-in`}>
        <div className="w-full max-w-2xl mx-auto my-2 px-6 py-4 bg-white rounded-lg border">
          <form onSubmit={updateHandler} className="">
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
              {currentUser.username === task.owner && (
                <div className="w-full flex gap-2 items-center">
                  <div className="border w-full px-4 py-2 text-base rounded-lg cursor-pointer *:hover:cursor-pointer">
                    <select
                      name="contributors"
                      value={formData.contributors}
                      onChange={handleFormData}
                      className="w-full outline-none focus-visible:outline-none "
                    >
                      <option value="">Select a contributor</option>
                      {users
                        .filter(
                          (user: IUser) =>
                            !formData.contributors.includes(user.username) &&
                            user.username != task.owner
                        )
                        .map((user: IUser) => (
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
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 mt-5 text-white text-base bg-primary-100 rounded-lg cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? "loading.." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TaskActions;
