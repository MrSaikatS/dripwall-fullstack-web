import { UserTable, type UserTableUser } from "@/components/Admin/UserTable";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const AdminUsersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.role !== "admin") {
    return null;
  }

  const result = await auth.api.listUsers({
    query: { limit: 100, offset: 0 },
    headers: await headers(),
  });

  const users: UserTableUser[] = (result as unknown as { users: UserTableUser[] })?.users ?? result ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage user roles and bans
        </p>
      </div>

      <UserTable users={users} />
    </div>
  );
};

export default AdminUsersPage;
