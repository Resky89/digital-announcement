"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, Spinner } from "@/components/ui";
import { announcementsApi, usersApi } from "@/lib/api";
import {
  Megaphone,
  Users,
  FileImage,
  TrendingUp,
  Calendar,
} from "lucide-react";
import type { Announcement } from "@/types";

interface DashboardStats {
  totalAnnouncements: number;
  totalUsers: number;
  totalAssets: number;
  recentAnnouncements: Announcement[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAnnouncements: 0,
    totalUsers: 0,
    totalAssets: 0,
    recentAnnouncements: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [announcements, users] = await Promise.all([
          announcementsApi.getAll(),
          usersApi.getAll(),
        ]);

        const totalAssets = announcements.reduce(
          (acc, ann) => acc + (ann.assets?.length || 0),
          0
        );

        setStats({
          totalAnnouncements: announcements.length,
          totalUsers: users.length,
          totalAssets: totalAssets,
          recentAnnouncements: announcements.slice(0, 5),
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Pengumuman",
      value: stats.totalAnnouncements,
      icon: Megaphone,
      color: "from-indigo-500 to-purple-600",
      shadowColor: "shadow-indigo-500/30",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-emerald-500 to-teal-600",
      shadowColor: "shadow-emerald-500/30",
    },
    {
      title: "Total Assets",
      value: stats.totalAssets,
      icon: FileImage,
      color: "from-amber-500 to-orange-600",
      shadowColor: "shadow-amber-500/30",
    },
    {
      title: "Aktivitas Bulan Ini",
      value: stats.totalAnnouncements,
      icon: TrendingUp,
      color: "from-pink-500 to-rose-600",
      shadowColor: "shadow-pink-500/30",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Ringkasan statistik dan aktivitas terbaru
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg ${stat.shadowColor}`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                {/* Decorative gradient */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Announcements */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Pengumuman Terbaru
            </h2>
            <a
              href="/admin/announcements"
              className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
            >
              Lihat Semua →
            </a>
          </div>

          {stats.recentAnnouncements.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              Belum ada pengumuman
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Megaphone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 dark:text-white truncate">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">
                      {announcement.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(announcement.created_at).toLocaleDateString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
