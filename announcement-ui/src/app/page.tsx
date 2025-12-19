"use client";

import { useEffect, useMemo, useState } from "react";
import { announcementsApi } from "@/lib/api";
import type { Announcement, Asset } from "@/types";
import { API_BASE_URL } from "@/config/constants";
import { Card, CardContent, Badge, Button, EmptyState, Spinner } from "@/components/ui";
import { Calendar, FileText, ExternalLink } from "lucide-react";
import { formatDate, isImageFile } from "@/lib/utils";

export default function HomePage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await announcementsApi.getAll();
        setAnnouncements(Array.isArray(data) ? data : []);
      } catch (e) {
        setAnnouncements([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const items = useMemo(() => Array.isArray(announcements) ? announcements : [], [announcements]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<FileText className="w-8 h-8 text-slate-400" />}
          title="Belum ada pengumuman"
          description="Pengumuman yang dipublikasikan akan muncul di halaman ini"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {items.map((ann) => {
        const imageAsset: Asset | undefined = ann.assets?.find(a => isImageFile(a.file_type));
        const pdfAssets: Asset[] = (ann.assets || []).filter(a => a.file_type === 'pdf' || a.file_type.includes('pdf'));
        const imageUrl = imageAsset ? `${API_BASE_URL}/${imageAsset.file_path}` : null;

        return (
          <Card key={ann.id} variant="glass">
            <CardContent className="p-6 space-y-4">
              {/* Image when available */}
              {imageUrl && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={imageUrl} alt={imageAsset?.file_name || "Gambar"} className="w-full h-auto object-cover" />
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{ann.title}</h1>

              {/* Meta */}
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4" />
                {formatDate(ann.created_at)}
                {ann.assets && ann.assets.length > 0 && (
                  <Badge variant="info" size="sm" className="ml-2">
                    {ann.assets.length} Lampiran
                  </Badge>
                )}
              </div>

              {/* Content always visible */}
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed">{ann.content}</p>
              </div>

              {/* PDF attachments if present */}
              {pdfAssets.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lampiran PDF</h3>
                  <ul className="space-y-2">
                    {pdfAssets.map((a) => {
                      const url = `${API_BASE_URL}/${a.file_path}`;
                      return (
                        <li key={a.id} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                          <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{a.file_name}</span>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Buka
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
