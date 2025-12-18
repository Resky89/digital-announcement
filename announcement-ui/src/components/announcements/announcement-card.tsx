'use client';

import { Announcement } from '@/types';
import { Card, CardContent, CardFooter, Badge } from '@/components/ui';
import { formatShortDate, truncateText, getInitials } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { FileImage, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/config/constants';

interface AnnouncementCardProps {
  announcement: Announcement;
  variant?: 'default' | 'compact';
}

export function AnnouncementCard({ announcement, variant = 'default' }: AnnouncementCardProps) {
  const hasAssets = announcement.assets && announcement.assets.length > 0;

  if (variant === 'compact') {
    return (
      <Link href={ROUTES.USER.ANNOUNCEMENT_DETAIL(announcement.id)}>
        <Card hover className="h-full">
          <CardContent className="p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2">
              {announcement.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
              {truncateText(announcement.content, 100)}
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
              <Calendar className="w-3 h-3" />
              {formatShortDate(announcement.created_at)}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={ROUTES.USER.ANNOUNCEMENT_DETAIL(announcement.id)}>
      <Card hover variant="glass" className="h-full overflow-hidden group">
        {/* Image preview for first image asset */}
        {hasAssets && announcement.assets?.[0]?.file_type?.startsWith('image/') && (
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          </div>
        )}

        <CardContent className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {announcement.title}
          </h3>

          {/* Content preview */}
          <p className="text-slate-600 dark:text-slate-400 mt-3 line-clamp-3">
            {announcement.content}
          </p>

          {/* Assets badge */}
          {hasAssets && (
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="info" size="sm">
                <FileImage className="w-3 h-3 mr-1" />
                {announcement.assets?.length} Asset{announcement.assets?.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-6 py-4 flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center gap-2">
            {announcement.author ? (
              <>
                <Avatar
                  fallback={getInitials(announcement.author.name)}
                  size="sm"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {announcement.author.name}
                </span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500">Admin</span>
              </>
            )}
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            {formatShortDate(announcement.created_at)}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
