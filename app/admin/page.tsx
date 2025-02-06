import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "../utils/db";
import { AdminTasksTable } from "../components/admin/AdminTasksTable";

async function getAdminOverview() {
  const [totalUsers, totalTasks, recentTasks, totalPosts] = await Promise.all([
    prisma.user.count(),
    prisma.task.count(),
    prisma.task.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        User: {
          select: {
            name: true,
          },
        },
        attendees: true,
        posts: true,
      },
    }),
    prisma.post.count(),
  ]);

  return {
    totalUsers,
    totalTasks,
    recentTasks,
    totalPosts,
  };
}

export default async function AdminPage() {
  const { totalUsers, totalTasks, recentTasks, totalPosts } =
    await getAdminOverview();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentTasks.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Tasks</h2>
        <div className="overflow-x-auto rounded-md border">
          <AdminTasksTable data={recentTasks} />
        </div>
      </div>
    </div>
  );
}
