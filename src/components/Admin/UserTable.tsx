"use client";

import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/shadcnui/badge";
import { Button } from "@/components/shadcnui/button";
import {
  BanIcon,
  CheckCircleIcon,
  LoaderIcon,
  ShieldIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export type UserTableUser = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  image: string | null;
  createdAt: Date | null;
};

type UserTableProps = {
  users: UserTableUser[];
};

export const UserTable = ({ users }: UserTableProps) => {
  const router = useRouter();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const handleSetRole = async (userId: string, role: "admin" | "user") => {
    setLoadingUserId(userId);
    try {
      const result = await authClient.admin.setRole({ userId, role });
      if (result.error) {
        toast.error(result.error.message ?? "Failed to update role");
      } else {
        toast.success(
          `Role updated to ${role === "admin" ? "Admin" : "User"}`,
        );
        router.refresh();
      }
    } catch {
      toast.error("Failed to update role");
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleBanToggle = async (
    userId: string,
    currentlyBanned: boolean | null,
  ) => {
    setLoadingUserId(userId);
    try {
      if (currentlyBanned) {
        const result = await authClient.admin.unbanUser({ userId });
        if (result.error) {
          toast.error(result.error.message ?? "Failed to unban user");
        } else {
          toast.success("User unbanned");
          router.refresh();
        }
      } else {
        const result = await authClient.admin.banUser({ userId });
        if (result.error) {
          toast.error(result.error.message ?? "Failed to ban user");
        } else {
          toast.success("User banned");
          router.refresh();
        }
      }
    } catch {
      toast.error("Failed to update user");
    } finally {
      setLoadingUserId(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
        <UserIcon className="h-12 w-12" />
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="px-4 py-3">{user.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
              <td className="px-4 py-3">
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                >
                  {user.role === "admin" ? (
                    <StarIcon className="mr-1 h-3 w-3" />
                  ) : (
                    <ShieldIcon className="mr-1 h-3 w-3" />
                  )}
                  {user.role ?? "user"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                {user.banned ? (
                  <Badge variant="destructive">Banned</Badge>
                ) : (
                  <Badge variant="outline">Active</Badge>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {loadingUserId === user.id ? (
                    <Button variant="ghost" size="sm" disabled>
                      <LoaderIcon className="h-4 w-4 animate-spin" />
                    </Button>
                  ) : (
                    <>
                      {user.role !== "admin" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetRole(user.id, "admin")}
                        >
                          <StarIcon className="mr-1 h-3 w-3" />
                          Make Admin
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetRole(user.id, "user")}
                        >
                          <UserIcon className="mr-1 h-3 w-3" />
                          Remove Admin
                        </Button>
                      )}
                      <Button
                        variant={user.banned ? "outline" : "destructive"}
                        size="sm"
                        onClick={() => handleBanToggle(user.id, user.banned)}
                      >
                        {user.banned ? (
                          <>
                            <CheckCircleIcon className="mr-1 h-3 w-3" />
                            Unban
                          </>
                        ) : (
                          <>
                            <BanIcon className="mr-1 h-3 w-3" />
                            Ban
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
