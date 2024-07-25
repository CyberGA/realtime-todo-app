"use client";

import { ITask } from "@/definitions/task.interface";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import AddTask from "./add-task";
import { useRouter } from "next/navigation";
import { IResponse } from "@/definitions/response.interface";
import EditTask from "./edit-task";

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const getTodos = async (): Promise<void> => {
    try {
      setLoading(true);
      const username: string | null = sessionStorage.getItem("username");
      if (!username) {
        router.push("/");
        return;
      }
      const resp = await axios.get(`/api/todos?username=${username}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res: IResponse = resp.data;
      console.log(res);
      if (res.status == 200) {
        const data: ITask[] = res.data;
        setTasks(data);
      }
    } catch (error) {
      alert("An error occurred getting the tasks");
    } finally {
      setLoading(false);
    }
  };

  const completeTasks = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    );
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="relative z-0 w-full max-w-2xl mx-auto mt-10 px-6 py-12 rounded-lg border">
      {loading ? (
        <p className="italic font-light my-20 text-center">Loading tasks...</p>
      ) : (
        <>
          <div className="relative z-0 flex items-center justify-between gap-3 my-1">
            <h1 className="uppercase text-3xl text-black/50 font-bold">
              Tasks List
            </h1>
            <AddTask />
          </div>
          <div className="relative z-0 flex flex-col gap-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="relative z-0 flex flex-col border px-4 py-2 rounded-lg"
              >
                <div className="relative z-0 w-fit rounded-full px-4 border border-primary-100 py-1">
                  <p className="text-xs">
                    {task.owner == "default"
                      ? "DEFAULT"
                      : `Creator: ${task.owner}`}
                  </p>
                </div>
                {task.marker && (
                  <p className="relative z-0 text-xs">
                    Completed by: {task.marker}
                  </p>
                )}
                <h2 className="relative z-0 text-lg font-semibold my-2 border-b">
                  {task.title}
                </h2>
                <p
                  className={`relative z-0 text-sm ${
                    task.done ? "line-through" : "no-underline"
                  }`}
                >
                  {task.desc}
                </p>
                <div className="relative z-0 flex justify-end">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="default:ring-2"
                      checked={task.done}
                    />
                    <EditTask task={task} />
                    <button className="text-white text-xs bg-red-500 px-2 py-1 rounded-lg">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TodoList;
