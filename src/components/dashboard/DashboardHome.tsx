import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

const DashboardHome = () => {
  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Revenue",
      value: "$45,231",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Active Sessions",
      value: "1,234",
      change: "-2.4%",
      changeType: "negative" as const,
      icon: Activity,
    },
    {
      title: "Growth Rate",
      value: "23.1%",
      change: "+4.3%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "John Doe",
      action: "Created new account",
      time: "2 minutes ago",
      status: "success",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "Updated profile information",
      time: "5 minutes ago",
      status: "info",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "Made a purchase",
      time: "12 minutes ago",
      status: "success",
    },
    {
      id: 4,
      user: "Sarah Wilson",
      action: "Requested support",
      time: "1 hour ago",
      status: "warning",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your application.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-700"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.changeType === "positive" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span
                  className={
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart Placeholder */}
        <Card className="col-span-4 dark:bg-gray-900 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>
              Your application performance over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Chart visualization would go here
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Integration with your preferred chart library
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3 dark:bg-gray-900 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest user actions</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.user}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.action}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge
                      variant={
                        activity.status === "success"
                          ? "default"
                          : activity.status === "warning"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="dark:bg-gray-900 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used actions for managing your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/dashboard/add-user">
                <Users className="mr-2 h-4 w-4" />
                Add User
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/reports">
                <Activity className="mr-2 h-4 w-4" />
                View Reports
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
