"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Info, AlertTriangle, XCircle, X } from "lucide-react";

export default function DashboardPage() {
  // Stats (mocked)
  const [stats] = useState({
    activeUsers: 1287,
    projectsCreated: 154,
    errorsReported: 27,
    revenue: 8245,
  });

  // Activities (mocked)
  const [activities] = useState([
    { id: 1, text: "User JohnDoe deployed new project 'API Gateway'", time: "2 hours ago" },
    { id: 2, text: "New subscription started by company 'TechCorp'", time: "5 hours ago" },
    { id: 3, text: "Error #503 reported in 'DataSync' microservice", time: "1 day ago" },
  ]);

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, type: "info", message: "Scheduled maintenance on June 15, 2025 at 2:00 AM UTC." },
    { id: 2, type: "warning", message: "High error rates detected in 'AuthService' microservice." },
    { id: 3, type: "success", message: "Your last deployment was successful." },
  ]);

  // Icon component mapper
  function getIcon(type: string) {
    const iconProps = { className: "w-5 h-5 mr-2 flex-shrink-0" };
    switch (type) {
      case "info":
        return <Info {...iconProps} color="#3B82F6" />; // blue
      case "warning":
        return <AlertTriangle {...iconProps} color="#FBBF24" />; // yellow
      case "success":
        return <CheckCircle {...iconProps} color="#22C55E" />; // green
      case "error":
        return <XCircle {...iconProps} color="#EF4444" />; // red
      default:
        return <Info {...iconProps} />;
    }
  }

  // Color styles for notifications
  function getNotificationColor(type: string) {
    switch (type) {
      case "info":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-300";
      case "success":
        return "bg-green-50 text-green-700 border-green-200";
      case "error":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  }

  // Dismiss notification handler
  function dismissNotification(id: number) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  // Simulate real-time notification polling every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newId = Date.now();
      const demoNotifications = [
        { type: "info", message: "New user signed up: JaneSmith" },
        { type: "warning", message: "Memory usage is above 80% on 'CacheService'" },
        { type: "success", message: "Backup completed successfully" },
        { type: "error", message: "Failed to connect to database" },
      ];
      const random = Math.floor(Math.random() * demoNotifications.length);
      const newNotification = { id: newId, ...demoNotifications[random] };

      setNotifications((prev) => [newNotification, ...prev]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 p-8">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl sm:text-3xl font-bold tracking-tight leading-none font-sans transition-transform hover:scale-105 duration-200">
        <span className="text-indigo-600 dark:text-indigo-400">Welcome to </span>
        <span className="text-emerald-500">T-</span>
        <span className="text-blue-950">rejected</span>
        <span className="text-yellow-400 font-mono">.dev </span>
        <span className="text-indigo-600 dark:text-indigo-400">Dashboard</span> 
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-xl">
          Monitor your platform's performance and recent activities at a glance.
        </p>
      </header>

      {/* Stats cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Active Users
          </p>
          <p className="mt-3 text-3xl font-semibold text-indigo-600 dark:text-indigo-400">
            {stats.activeUsers.toLocaleString()}
          </p>
          <p className="mt-1 text-green-500 font-medium">+8% since last week</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Projects Created
          </p>
          <p className="mt-3 text-3xl font-semibold text-indigo-600 dark:text-indigo-400">
            {stats.projectsCreated}
          </p>
          <p className="mt-1 text-green-500 font-medium">+15% since last month</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Errors Reported
          </p>
          <p className="mt-3 text-3xl font-semibold text-red-600 dark:text-red-400">
            {stats.errorsReported}
          </p>
          <p className="mt-1 text-red-500 font-medium">-12% since last week</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Monthly Revenue
          </p>
          <p className="mt-3 text-3xl font-semibold text-indigo-600 dark:text-indigo-400">
            ${stats.revenue.toLocaleString()}
          </p>
          <p className="mt-1 text-green-500 font-medium">+22% since last month</p>
        </div>
      </section>

      {/* Notifications / Alerts */}
      <section className="mb-12 max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Notifications & Alerts
        </h2>
        <ul className="space-y-4">
          {notifications.map(({ id, type, message }) => (
            <li
              key={id}
              className={`border-l-4 p-4 rounded-md shadow-sm flex justify-between items-start ${getNotificationColor(type)}`}
              role="alert"
            >
              <div className="flex items-center">
                {getIcon(type)}
                <p className="text-sm">{message}</p>
              </div>
              <button
                aria-label="Dismiss notification"
                onClick={() => dismissNotification(id)}
                className="ml-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </li>
          ))}
          {notifications.length === 0 && (
            <li className="text-center text-gray-500 dark:text-gray-400 italic">No notifications</li>
          )}
        </ul>
      </section>

      {/* Latest Activity */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 shadow-md max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Latest Activity
        </h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {activities.map(({ id, text, time }) => (
            <li key={id} className="py-4">
              <p className="text-gray-800 dark:text-gray-200">{text}</p>
              <time className="text-sm text-gray-500 dark:text-gray-400">{time}</time>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
