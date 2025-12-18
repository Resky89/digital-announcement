"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Megaphone, Clock, FileText } from "lucide-react";
import { Button, Card, CardContent, Spinner } from "@/components/ui";
import { AnnouncementList } from "@/components/announcements";
import { announcementsApi } from "@/lib/api";
import { formatShortDate } from "@/lib/utils";
import type { Announcement } from "@/types";

export default function UserHomePage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await announcementsApi.getAll();
        setAnnouncements(data);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const latestAnnouncement = announcements[0];
  const recentAnnouncements = announcements.slice(0, 6);

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
       <section className="text-center py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium mb-6">
          <Megaphone className="w-4 h-4" />
          Digital Announcement Platform
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
          Informasi Terbaru untuk Anda
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mt-4">
          Dapatkan pengumuman dan informasi penting terkini di satu tempat yang mudah diakses.
        </p>
      </section>

      {/* Latest Announcement Highlight */}
      {latestAnnouncement && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-600" />
              Pengumuman Terbaru
            </h2>
          </div>

          <Card variant="gradient" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <CardContent className="p-8 relative">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-medium mb-4">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                    </span>
                    Terbaru
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {latestAnnouncement.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-3 line-clamp-3">
                    {latestAnnouncement.content}
                  </p>
                  <div className="flex items-center gap-4 mt-6">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {formatShortDate(latestAnnouncement.created_at)}
                    </span>
                    {latestAnnouncement.assets && latestAnnouncement.assets.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs">
                        <FileText className="w-3 h-3" />
                        {latestAnnouncement.assets.length} Lampiran
                      </span>
                    )}
                  </div>
                </div>
                <div className="lg:flex-shrink-0">
                  <Link href={`/user/announcements/${latestAnnouncement.id}`}>
                    <Button size="lg">
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* All Announcements */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Semua Pengumuman
          </h2>
          <Link href="/user/announcements">
            <Button variant="ghost">
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <AnnouncementList announcements={recentAnnouncements} isLoading={isLoading} />
      </section>
    </div>
  );
}
