"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import { Card, CardContent, Spinner } from "@/components/ui";
import { AnnouncementList } from "@/components/announcements";
import { announcementsApi } from "@/lib/api";
import type { Announcement } from "@/types";
import { cn } from "@/lib/utils";

export default function UserAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  const filteredAnnouncements = announcements.filter(
    (ann) =>
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Pengumuman
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Temukan semua pengumuman dan informasi penting di sini
        </p>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari pengumuman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "list"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results info */}
      {searchQuery && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Menampilkan {filteredAnnouncements.length} hasil untuk "{searchQuery}"
        </p>
      )}

      {/* Announcements */}
      <AnnouncementList
        announcements={filteredAnnouncements}
        isLoading={isLoading}
        variant={viewMode}
      />
    </div>
  );
}
