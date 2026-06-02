"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { toast } from "react-toastify"

import { authClient } from "@/lib/auth-client"
import { Badge } from "@/components/shadcnui/badge"
import { Button } from "@/components/shadcnui/button"
import { DataTableColumnHeader } from "@/components/shadcnui/data-table-column-header"
import {
  BanIcon,
  CheckCircleIcon,
  LoaderIcon,
  ShieldIcon,
  StarIcon,
  UserIcon,
} from "lucide-react"

export type UserTableUser = {
  id: string
  name: string
  email: string
  role: string | null
  banned: boolean | null
  image: string | null
  createdAt: Date | null
}

export const useUserColumns = () => {
  const router = useRouter()
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null)

  const handleSetRole = useCallback(
    async (userId: string, role: "admin" | "user") => {
      setLoadingUserId(userId)
      try {
        const result = await authClient.admin.setRole({ userId, role })
        if (result.error) {
          toast.error(result.error.message ?? "Failed to update role")
        } else {
          toast.success(
            `Role updated to ${role === "admin" ? "Admin" : "User"}`,
          )
          router.refresh()
        }
      } catch {
        toast.error("Failed to update role")
      } finally {
        setLoadingUserId(null)
      }
    },
    [router],
  )

  const handleBanToggle = useCallback(
    async (userId: string, currentlyBanned: boolean | null) => {
      setLoadingUserId(userId)
      try {
        if (currentlyBanned) {
          const result = await authClient.admin.unbanUser({ userId })
          if (result.error) {
            toast.error(result.error.message ?? "Failed to unban user")
          } else {
            toast.success("User unbanned")
            router.refresh()
          }
        } else {
          const result = await authClient.admin.banUser({ userId })
          if (result.error) {
            toast.error(result.error.message ?? "Failed to ban user")
          } else {
            toast.success("User banned")
            router.refresh()
          }
        }
      } catch {
        toast.error("Failed to update user")
      } finally {
        setLoadingUserId(null)
      }
    },
    [router],
  )

  const columns: ColumnDef<UserTableUser>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string | null
        return (
          <Badge variant={role === "admin" ? "default" : "secondary"}>
            {role === "admin" ? (
              <StarIcon className="mr-1 h-3 w-3" />
            ) : (
              <ShieldIcon className="mr-1 h-3 w-3" />
            )}
            {role ?? "user"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "banned",
      header: "Status",
      cell: ({ row }) => {
        const banned = row.getValue("banned") as boolean | null
        return banned ? (
          <Badge variant="destructive">Banned</Badge>
        ) : (
          <Badge variant="outline">Active</Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original
        const isLoading = loadingUserId === user.id

        if (isLoading) {
          return (
            <Button variant="ghost" size="sm" disabled>
              <LoaderIcon className="h-4 w-4 animate-spin" />
            </Button>
          )
        }

        return (
          <div className="flex gap-2">
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
          </div>
        )
      },
    },
  ]

  return columns
}
