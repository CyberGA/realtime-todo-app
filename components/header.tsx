"use client";

import { IUser } from "@/definitions/user.interface";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Header: React.FC = () => {
  const [user, setUser] = useState<IUser>({
    username: "",
    id: "",
  });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const username = sessionStorage.getItem("username") || "";
    const id = sessionStorage.getItem("id") || "";
    if (username) {
      setUser({
        username,
        id,
      });
    } else {
      router.push("/");
    }
  }, [pathname, router]);
  return (
    <header className="sticky top-0 bg-white z-50">
      <div className="flex items-center justify-between gap-2 h-24 w-full max-w-6xl mx-auto px-6 sm:px-10 md:px-16 text-primary-100">
        <Link href="/">
          <p title="brand name" className="text-3xl italic font-semibold">
            SyncUp
          </p>
        </Link>
        {user.id && user.username && (
          <p className="text-sm text-black/80 underline underline-offset-2">
            <span className="italics">Identified as</span>: {user.username}
          </p>
        )}
      </div>
    </header>
  );
};

export default Header;
