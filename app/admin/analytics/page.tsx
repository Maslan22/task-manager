// app/admin/analytics/page.tsx
import { Overview } from "@/app/components/admin/Overview";
import { RecentActivity } from "@/app/components/admin/RecentActivity";
import { TaskStats } from "@/app/components/admin/TaskStats";
import prisma from "@/app/utils/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { subDays } from "date-fns";

async function getAnalyticsData() {
  const thirtyDaysAgo = subDays(new Date(), 30);

  const [
    basicStats,
    dailyActivity,
    taskStats,
    recentActivity
  ] = await Promise.all([
    // Basic stats
    Promise.all([
      prisma.user.count(),
      prisma.task.count(),
      prisma.post.count(),
      prisma.taskAttendee.count(),
      // Recent counts (last 30 days)
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.task.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      })
    ]),

    // Daily activity for charts
    prisma.task.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      },
      include: {
        _count: {
          select: { attendees: true, posts: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    }),

    // Task statistics
    prisma.post.groupBy({
      by: ['status'],
      _count: true,
    }),

    // Recent activity
    prisma.task.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        User: true,
        _count: { select: { attendees: true } }
      }
    })
  ]);

  const [
    totalUsers,
    totalTasks,
    totalPosts,
    totalAttendees,
    newUsers,
    newTasks
  ] = basicStats;

  return {
    overview: {
      totalUsers,
      totalTasks,
      totalPosts,
      totalAttendees,
      newUsers,
      newTasks
    },
    dailyActivity,
    taskStats,
    recentActivity
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{data.overview.newUsers} last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              +{data.overview.newTasks} last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalAttendees}</div>
            <p className="text-xs text-muted-foreground">
              Avg {(data.overview.totalAttendees / data.overview.totalTasks).toFixed(1)} per task
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <Overview data={data.dailyActivity} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Task Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskStats data={data.taskStats} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity data={data.recentActivity} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}