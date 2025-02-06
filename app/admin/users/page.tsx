import { AdminUsersTable } from "@/app/components/admin/AdminUsersTable";
import prisma from "@/app/utils/db";


async function getUsers() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          tasks: true,
          posts: true,
          taskAttendees: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return users;
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>
      <AdminUsersTable data={users} />
    </div>
  );
}