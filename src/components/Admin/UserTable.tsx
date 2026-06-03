"use client"

import { DataTable } from "@/components/shadcnui/data-table"
import { UserIcon } from "lucide-react"

import { useUserColumns } from "./users-columns"
import type { UserTableUser } from "./users-columns"

type UserTableProps = {
  users: UserTableUser[]
}

export { type UserTableUser } from "./users-columns"

export const UserTable = ({ users }: UserTableProps) => {
  const columns = useUserColumns()

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
        <UserIcon className="h-12 w-12" />
        <p>No users found</p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={users}
      filterColumn="email"
      filterPlaceholder="Filter emails..."
    />
  )
}
