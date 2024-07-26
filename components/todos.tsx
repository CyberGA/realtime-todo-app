"use client";

import { ITask } from "@/definitions/task.interface";
import axios from "axios";
import { useEffect, useState } from "react";
import AddTask from "./add-task";
import { IResponse } from "@/definitions/response.interface";
import TaskActions from "./task-actions";
import pusherService from "@/lib/pusher.service";
import { IUser } from "@/definitions/user.interface";

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [user, setUser] = useState<IUser>({
    username: "",
    id: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddOrUpdateTodoEvent = (eventMessagge: string): void => {
    const newTask: ITask = JSON.parse(eventMessagge);
    const currentUser = sessionStorage.getItem("username") as string;
    if (
      newTask.owner == "admin" ||
      newTask.owner.trim() === currentUser.trim() ||
      Array.from(newTask.contributors).includes(currentUser)
    ) {
      setTasks((tasks) => {
        const oldTaskIndex = tasks.findIndex((task) => task.id === newTask.id);
        if (oldTaskIndex !== -1) {
          const newTasks = [...tasks];
          newTasks[oldTaskIndex] = newTask;
          return newTasks;
        } else {
          return [newTask, ...tasks];
        }
      });
    }
  };

  const handleCompleteTodoEvent = (eventMessagge: string): void => {
    const data = JSON.parse(eventMessagge);
    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((task) => {
        if (task.id === data.id) {
          return { ...task, done: true, marker: data.marker };
        }
        return task;
      });
      return newTasks;
    });
  };

  const handleDeleteTodoEvent = (eventMessagge: string): void => {
    const data = JSON.parse(eventMessagge);
    setTasks((prevTasks) => {
      const newTasks = prevTasks.filter((task) => task.id !== data.id);
      return newTasks;
    });
  };

  useEffect(() => {
    setUser({
      username: sessionStorage.getItem("username") || "",
      id: sessionStorage.getItem("userId") || "",
    });

    const channel = pusherService.subscribe("TODO_CHANNEL");
    channel.bind("ADD_UPDATE_TODO_EVENT", function (data: any) {
      handleAddOrUpdateTodoEvent(data.message);
    });
    channel.bind("COMPLETE_TODO_EVENT", function (data: any) {
      handleCompleteTodoEvent(data.message);
    });
    channel.bind("DELETE_TODO_EVENT", function (data: any) {
      handleDeleteTodoEvent(data.message);
    });

    return () => {
      channel.unbind("ADD_UPDATE_TODO_EVENT", handleAddOrUpdateTodoEvent);
      channel.unbind("COMPLETE_TODO_EVENT", handleCompleteTodoEvent);
      channel.unbind("DELETE_TODO_EVENT", handleDeleteTodoEvent);
      pusherService.unsubscribe("TODO_CHANNEL");
    };
  }, []);

  useEffect(() => {
    const getTodos = async (): Promise<void> => {
      try {
        setLoading(true);
        const username: string = sessionStorage.getItem("username") as string;
        const resp = await axios.get(`/api/todos?username=${username}`);
        const res: IResponse = resp.data;
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

    getTodos();
  }, []);

  return (
    <div className="relative z-0 w-full max-w-2xl mx-auto mt-10 px-6 py-12 rounded-lg">
      {loading ? (
        <p className="italic font-light my-20 text-center">Loading tasks...</p>
      ) : (
        <>
          <div className="sticky top-24 bg-white py-2 z-[1] flex items-center justify-between gap-3 my-1">
            <h1 className="uppercase text-3xl text-black/50 font-bold">
              Tasks List
            </h1>
            <AddTask />
          </div>
          <div className="relative z-0 flex flex-col gap-2 mt-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className=" flex flex-col border px-4 py-2 rounded-lg"
              >
                <div className="w-fit rounded-full px-4 border border-primary-100/70">
                  <p className="text-xs text-black/65">
                    {task.owner === "admin"
                      ? "DEFAULT"
                      : `Creator: ${
                          task.owner == user.username ? "You" : task.owner
                        }`}
                  </p>
                </div>
                {task.marker && (
                  <p className="pl-2 text-xs font-semibold underline underline-offset-2">
                    Completed by: {task.marker}
                  </p>
                )}
                <h2 className="text-lg font-semibold my-2 border-b">
                  {task.title}
                </h2>
                <p
                  className={`relative z-0 text-sm ${
                    task.done ? "line-through" : "no-underline"
                  }`}
                >
                  {task.desc}
                </p>
                <div className="flex flex-col justify-end">
                  <TaskActions task={task} />
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
