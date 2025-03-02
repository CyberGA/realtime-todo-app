"use client";

import { useState, useRef } from "react";
import { IResponse } from "@/definitions/response.interface";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

export default function Identification(): React.JSX.Element {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const userNameRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const submitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");
    if (!userNameRef.current?.value) {
      setError("Username is required");
      return;
    }
    try {
      setLoading((loading) => true);
      const username = userNameRef.current?.value;
      const resp = await axios.post("/api/users/create", { username });

      const res: IResponse = resp.data;
      if (res.status !== 201 && res.status !== 200) {
        setError(res.message);
      } else {
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("id", res.data?.id);
        userNameRef.current.value = "";
        router.push("/todos");
      }
    } catch (error) {
      console.log(error)
      setError("Identification failed");
    } finally {
      setLoading((loading) => false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 px-6 py-12 rounded-lg border shadow-md">
      <form onSubmit={submitHandler} className="">
        <h1 className="text-4xl font-bold text-black/60">Identification</h1>
        <p className="italic text-sm">
          Enter the username you wish to be identified by
        </p>
        {error && (
          <div className="border border-rose-400 px-4 py-2 rounded-md mt-2 text-black/60 text-sm">
            Error: {error}
          </div>
        )}
        <div className="flex items-center gap-2 my-10">
          <input
            ref={userNameRef}
            placeholder="e.g. user1"
            className="border px-4 py-3 text-base w-full rounded-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-fit px-4 py-3 text-white text-base bg-primary-100 rounded-lg cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "loading.." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
