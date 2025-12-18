"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Input,
  Spinner,
  EmptyState,
  Modal,
} from "@/components/ui";
import { AnnouncementForm } from "@/components/announcements";
import { announcementsApi } from "@/lib/api";
import { formatShortDate } from "@/lib/utils";
import type { Announcement, CreateAnnouncementPayload, UpdateAnnouncementPayload } from "@/types";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (data: CreateAnnouncementPayload | UpdateAnnouncementPayload) => {
    setIsSubmitting(true);
    try {
      await announcementsApi.create(data as CreateAnnouncementPayload);
      await fetchAnnouncements();
    } catch (error) {
      console.error("Failed to create announcement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: CreateAnnouncementPayload | UpdateAnnouncementPayload) => {
    if (!editingAnnouncement) return;
    
    setIsSubmitting(true);
    try {
      await announcementsApi.update(editingAnnouncement.id, data);
      await fetchAnnouncements();
      setEditingAnnouncement(undefined);
    } catch (error) {
      console.error("Failed to update announcement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    
    try {
      await announcementsApi.delete(deletingId);
      await fetchAnnouncements();
      setDeleteModalOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Failed to delete announcement:", error);
    }
  };

  const openEditModal = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const filteredAnnouncements = announcements.filter(
    (ann) =>
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Pengumuman
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Kelola semua pengumuman digital
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingAnnouncement(undefined);
            setFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Buat Pengumuman
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pengumuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <EmptyState
          title="Belum ada pengumuman"
          description="Mulai dengan membuat pengumuman pertama Anda"
          action={
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="w-4 h-4" />
              Buat Pengumuman
            </Button>
          }
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Judul
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white hidden md:table-cell">
                    Konten
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white hidden sm:table-cell">
                    Tanggal
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAnnouncements.map((announcement) => (
                  <tr
                    key={announcement.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {announcement.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-slate-500 dark:text-slate-400 truncate max-w-xs">
                        {announcement.content}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {formatShortDate(announcement.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(announcement)}
                          className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(announcement.id)}
                          className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <AnnouncementForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingAnnouncement(undefined);
        }}
        onSubmit={editingAnnouncement ? handleUpdate : handleCreate}
        initialData={editingAnnouncement}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Hapus Pengumuman"
        description="Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini tidak dapat dibatalkan."
        size="sm"
      >
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  );
}
