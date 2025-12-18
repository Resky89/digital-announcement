'use client';

import { Announcement } from '@/types';
import { AnnouncementCard } from './announcement-card';
import { EmptyState, Spinner } from '@/components/ui';
import { Megaphone } from 'lucide-react';

interface AnnouncementListProps {
  announcements: Announcement[];
  isLoading?: boolean;
  variant?: 'grid' | 'list';
}

export function AnnouncementList({
  announcements,
  isLoading = false,
  variant = 'grid',
}: AnnouncementListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <EmptyState
        icon={<Megaphone className="w-8 h-8 text-slate-400" />}
        title="Belum ada pengumuman"
        description="Pengumuman yang dipublikasikan akan muncul di sini"
      />
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            variant="compact"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </div>
  );
}
