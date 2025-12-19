"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { announcementsApi } from "@/lib/api";
import type { Announcement, Asset } from "@/types";
import { API_BASE_URL } from "@/config/constants";
import { Badge, EmptyState, Spinner } from "@/components/ui";
import { Calendar, FileText, ExternalLink, Clock, Image as ImageIcon, FileType, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { formatDate, isImageFile } from "@/lib/utils";

// Placeholder SVG for broken images
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%231e293b' width='400' height='300'/%3E%3Cg fill='%2364748b'%3E%3Crect x='170' y='100' width='60' height='60' rx='8'/%3E%3Cpath d='M185 175h30l15 25h-60z'/%3E%3Ccircle cx='225' cy='115' r='12'/%3E%3C/g%3E%3Ctext x='200' y='230' text-anchor='middle' fill='%2394a3b8' font-family='system-ui' font-size='14'%3EGambar tidak tersedia%3C/text%3E%3C/svg%3E";

// Real-time clock component (tanpa zona waktu)
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
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-white shadow-2xl border border-white/20">
      <div className="flex items-center justify-center flex-col gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-indigo-300" />
          <p className="text-xl font-medium text-white/90">{formatDateFull(currentTime)}</p>
        </div>
        <div className="flex items-center gap-4">
          <Clock className="w-10 h-10 text-indigo-300" />
          <p className="text-6xl font-bold tracking-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            {formatTime(currentTime)}
          </p>
        </div>
      </div>
    </div>
  );
}

// Lazy loaded image component with placeholder fallback
function LazyImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 rounded-2xl">
          <Spinner size="lg" />
        </div>
      )}
      {isInView && (
        hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 rounded-2xl">
            <ImageOff className="w-16 h-16 text-slate-500 mb-3" />
            <p className="text-slate-400 text-sm">Gambar tidak tersedia</p>
          </div>
        ) : (
          <img 
            src={src} 
            alt={alt} 
            className={`w-full h-full object-cover transition-all duration-500 rounded-2xl ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
            onError={handleError}
          />
        )
      )}
    </div>
  );
}

// Announcement Card Component
function AnnouncementCard({ ann, isActive }: { ann: Announcement; isActive: boolean }) {
  const imageAssets: Asset[] = (ann.assets || []).filter(a => isImageFile(a.file_type));
  const pdfAssets: Asset[] = (ann.assets || []).filter(a => a.file_type === 'pdf' || a.file_type.includes('pdf'));
  const hasImages = imageAssets.length > 0;
  const hasPdfs = pdfAssets.length > 0;

  return (
    <div 
      className={`h-full transition-all duration-700 ${
        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0 pointer-events-none'
      }`}
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl h-full flex flex-col">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 p-6">
          <h1 className="text-3xl font-bold text-white mb-3">{ann.title}</h1>
          
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-2 text-white/80">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(ann.created_at)}</span>
            </div>
            
            {hasImages && (
              <Badge variant="success" size="sm" className="flex items-center gap-1 bg-emerald-500/80 text-white border-0">
                <ImageIcon className="w-3 h-3" />
                {imageAssets.length} Gambar
              </Badge>
            )}
            
            {hasPdfs && (
              <Badge variant="warning" size="sm" className="flex items-center gap-1 bg-amber-500/80 text-white border-0">
                <FileType className="w-3 h-3" />
                {pdfAssets.length} PDF
              </Badge>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6 flex-1 overflow-auto">
          {/* Text Content */}
          <div className="prose max-w-none">
            <p className="text-lg whitespace-pre-wrap leading-relaxed text-white/90">
              {ann.content}
            </p>
          </div>

          {/* Images Section - Full width grid */}
          {hasImages && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/90">
                <ImageIcon className="w-5 h-5 text-indigo-300" />
                <h3 className="text-lg font-semibold">Gambar Lampiran</h3>
              </div>
              <div className={`grid gap-4 ${
                imageAssets.length === 1 
                  ? 'grid-cols-1' 
                  : imageAssets.length === 2 
                    ? 'grid-cols-2' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}>
                {imageAssets.map((asset, index) => {
                  const imageUrl = `${API_BASE_URL}/${asset.file_path}`;
                  return (
                    <div 
                      key={asset.id} 
                      className={`relative rounded-2xl overflow-hidden border-2 border-white/20 hover:border-indigo-400 transition-all duration-300 group ${
                        imageAssets.length === 1 ? 'aspect-[16/9]' : 'aspect-video'
                      }`}
                    >
                      <LazyImage 
                        src={imageUrl} 
                        alt={asset.file_name} 
                        className="w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-sm font-medium truncate">{asset.file_name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PDF Section - Full width */}
          {hasPdfs && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/90">
                <FileType className="w-5 h-5 text-indigo-300" />
                <h3 className="text-lg font-semibold">Dokumen PDF</h3>
              </div>
              <div className="space-y-3">
                {pdfAssets.map((asset) => {
                  const url = `${API_BASE_URL}/${asset.file_path}`;
                  return (
                    <div 
                      key={asset.id} 
                      className="flex items-center justify-between rounded-2xl border-2 border-white/20 p-4 hover:border-indigo-400 hover:bg-white/5 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:bg-red-500/30 transition-colors duration-300">
                          <FileText className="w-7 h-7 text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white/90 truncate">
                            {asset.file_name}
                          </p>
                          <p className="text-xs text-white/60">PDF Document</p>
                        </div>
                      </div>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all duration-300 flex-shrink-0 shadow-lg hover:shadow-indigo-500/30"
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
      </div>
    </div>
  );
}

// Carousel component
function AnnouncementCarousel({ items }: { items: Announcement[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && items.length > 1) {
      autoPlayRef.current = setInterval(() => {
        goToNext();
      }, 10000); // Change slide every 10 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, goToNext, items.length]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (items.length === 0) return null;

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main carousel container */}
      <div className="relative min-h-[500px]">
        {items.map((ann, index) => (
          <AnnouncementCard 
            key={ann.id} 
            ann={ann} 
            isActive={index === currentIndex}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 shadow-xl z-10 group"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-7 h-7 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 shadow-xl z-10 group"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-7 h-7 group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {items.length > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-indigo-400 w-10 shadow-lg shadow-indigo-400/50' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to announcement ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide counter */}
      {items.length > 1 && (
        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 text-white/90 text-sm font-medium border border-white/20 z-10">
          {currentIndex + 1} / {items.length}
        </div>
      )}
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        </div>
        <Spinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        </div>
        
        <div className="relative z-10 w-full max-w-2xl space-y-8">
          <DateTimeClock />
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <EmptyState
              icon={<FileText className="w-12 h-12 text-indigo-400" />}
              title="Belum ada pengumuman"
              description="Pengumuman yang dipublikasikan akan muncul di halaman ini"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      </div>

      <div className="relative z-10 w-full space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Real-time Date and Time */}
        <DateTimeClock />

        {/* Announcements Carousel */}
        <AnnouncementCarousel items={items} />
      </div>
    </div>
  );
}
