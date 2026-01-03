"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  User,
  FileImage,
  FileVideo,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Spinner,
  Badge,
  Avatar,
} from "@/components/ui";
import { announcementsApi } from "@/lib/api";
import { formatDate, getInitials, isImageFile, isVideoFile } from "@/lib/utils";
import { API_BASE_URL, API_ENDPOINTS } from '@/config/constants';
import type { Announcement } from "@/types";

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const announcementId = Number(params.id);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const data = await announcementsApi.getById(announcementId);
        setAnnouncement(data);
      } catch (err) {
        setError("Pengumuman tidak ditemukan");
        console.error("Failed to fetch announcement:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (announcementId) {
      fetchAnnouncement();
    }
  }, [announcementId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Pengumuman Tidak Ditemukan
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Pengumuman yang Anda cari tidak ada atau telah dihapus.
        </p>
        <Link href="/user/announcements">
          <Button>
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Pengumuman
          </Button>
        </Link>
      </div>
    );
  }

  const getFileIcon = (fileType: string) => {
    if (isImageFile(fileType)) return FileImage;
    if (isVideoFile(fileType)) return FileVideo;
    return FileText;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>

      {/* Main Content */}
      <Card variant="glass">
        <CardContent className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
              {announcement.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mt-6">
              {/* Author */}
              {announcement.author && (
                <div className="flex items-center gap-2">
                  <Avatar
                    fallback={getInitials(announcement.author.name)}
                    size="sm"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {announcement.author.name}
                  </span>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4" />
                {formatDate(announcement.created_at)}
              </div>

              {/* Assets count */}
              {announcement.assets && announcement.assets.length > 0 && (
                <Badge variant="info">
                  <FileImage className="w-3 h-3 mr-1" />
                  {announcement.assets.length} Lampiran
                </Badge>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-8" />

          {/* Content */}
          <article className="prose prose-slate dark:prose-invert max-w-none">
            <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {announcement.content}
            </div>
          </article>
        </CardContent>
      </Card>

      {/* Assets Section */}
      {announcement.assets && announcement.assets.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Lampiran ({announcement.assets.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {announcement.assets.map((asset) => {
                const FileIcon = getFileIcon(asset.file_type);
                const isImage = isImageFile(asset.file_type);
                const isVideo = isVideoFile(asset.file_type);
                const staticUrl = `${API_BASE_URL}${API_ENDPOINTS.PUBLIC.ASSET_STREAM(asset.id)}`;

                return (
                  <div
                    key={asset.id}
                    className="group relative rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Preview */}
                    {isImage ? (
                      <div className="relative h-48 bg-slate-100 dark:bg-slate-900">
                        <img
                          src={staticUrl}
                          alt={asset.file_name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <a
                            href={staticUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Button variant="secondary" size="sm">
                              <ExternalLink className="w-4 h-4" />
                              Buka
                            </Button>
                          </a>
                        </div>
                      </div>
                    ) : isVideo ? (
                      <div className="relative h-48">
                        <video
                          src={staticUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-32 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
                        <FileIcon className="w-12 h-12 text-slate-400 mb-2" />
                        <span className="text-xs text-slate-500 uppercase">
                          {asset.file_type === 'pdf' ? 'PDF' : (asset.file_type.split('/')[1] || 'FILE')}
                        </span>
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-4">
                      <p className="font-medium text-slate-900 dark:text-white truncate">
                        {asset.file_name}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant="default" size="sm">
                          {(asset.file_type === 'pdf' ? 'PDF' : (asset.file_type.split('/')[1]?.toUpperCase() || 'FILE'))}
                        </Badge>
                        <a
                          href={staticUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
