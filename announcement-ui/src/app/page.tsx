"use client";

import { useEffect, useMemo, useState } from "react";
import { announcementsApi } from "@/lib/api";
import type { Announcement, Asset } from "@/types";
import { API_BASE_URL } from "@/config/constants";
import { Card, CardContent, Badge, EmptyState, Spinner } from "@/components/ui";
import { Calendar, FileText, ExternalLink, Clock, Image as ImageIcon, FileType } from "lucide-react";
import { formatDate, isImageFile } from "@/lib/utils";

// Real-time clock component
function DateTimeClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDateFull = (date: Date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-2xl p-6 mb-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5" />
            <p className="text-sm font-medium opacity-90">{formatDateFull(currentTime)}</p>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6" />
            <p className="text-4xl font-bold tracking-tight">{formatTime(currentTime)}</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-xs uppercase tracking-wider opacity-75 mb-1">WIB</p>
            <p className="text-2xl font-bold">GMT+7</p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
        <DateTimeClock />
        <EmptyState
          icon={<FileText className="w-8 h-8 text-slate-400" />}
          title="Belum ada pengumuman"
          description="Pengumuman yang dipublikasikan akan muncul di halaman ini"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Real-time Date and Time */}
      <DateTimeClock />

      {/* Announcements */}
      {items.map((ann) => {
        const imageAssets: Asset[] = (ann.assets || []).filter(a => isImageFile(a.file_type));
        const pdfAssets: Asset[] = (ann.assets || []).filter(a => a.file_type === 'pdf' || a.file_type.includes('pdf'));
        const hasImages = imageAssets.length > 0;
        const hasPdfs = pdfAssets.length > 0;

        return (
          <Card key={ann.id} variant="glass">
            <CardContent className="p-0">
              {/* Header Section */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{ann.title}</h1>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(ann.created_at)}</span>
                  </div>
                  
                  {hasImages && (
                    <Badge variant="success" size="sm" className="flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      {imageAssets.length} Gambar
                    </Badge>
                  )}
                  
                  {hasPdfs && (
                    <Badge variant="warning" size="sm" className="flex items-center gap-1">
                      <FileType className="w-3 h-3" />
                      {pdfAssets.length} PDF
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-6">
                {/* Text Content */}
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-lg whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
                    {ann.content}
                  </p>
                </div>

                {/* Images Section - Only show if there are images */}
                {hasImages && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <ImageIcon className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">Gambar Lampiran</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {imageAssets.map((asset) => {
                        const imageUrl = `${API_BASE_URL}/${asset.file_path}`;
                        return (
                          <div 
                            key={asset.id} 
                            className="relative rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 group"
                          >
                            <img 
                              src={imageUrl} 
                              alt={asset.file_name} 
                              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                              <p className="text-white text-sm font-medium truncate">{asset.file_name}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* PDF Section - Only show if there are PDFs */}
                {hasPdfs && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <FileType className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">Dokumen PDF</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {pdfAssets.map((asset) => {
                        const url = `${API_BASE_URL}/${asset.file_path}`;
                        return (
                          <div 
                            key={asset.id} 
                            className="flex items-center justify-between rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
                                  {asset.file_name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">PDF Document</p>
                              </div>
                            </div>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex-shrink-0"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Buka
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
