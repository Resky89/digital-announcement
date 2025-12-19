"use client";

import { useEffect, useState } from "react";
import { Trash2, Search, FileImage, FileVideo, FileText, File, Eye } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Spinner,
  EmptyState,
  Modal,
  Badge,
} from "@/components/ui";
import { announcementsApi, assetsApi } from "@/lib/api";
import { formatShortDate, getFileTypeIcon, isImageFile, isVideoFile } from "@/lib/utils";
import type { Asset, Announcement } from "@/types";
import { API_BASE_URL } from "@/config/constants";

interface AssetWithAnnouncement extends Asset {
  announcement?: Announcement;
}

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState<AssetWithAnnouncement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>([]);
  const [formAnnouncementId, setFormAnnouncementId] = useState<number | "">("");
  const [formFile, setFormFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAssets = async () => {
    try {
      const announcementsData = await announcementsApi.getAll();
      const allAssets: AssetWithAnnouncement[] = [];

      announcementsData.forEach((announcement) => {
        if (announcement.assets) {
          announcement.assets.forEach((asset) => {
            allAssets.push({
              ...asset,
              announcement,
            });
          });
        }
      });

      setAssets(allAssets);
      setAnnouncementsList(announcementsData);
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await assetsApi.delete(deletingId);
      await fetchAssets();
      setDeleteModalOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Failed to delete asset:", error);
    }
  };

  const openDeleteModal = (id: number) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const getFileIcon = (fileType: string) => {
    if (isImageFile(fileType)) return FileImage;
    if (isVideoFile(fileType)) return FileVideo;
    if (fileType.includes("pdf") || fileType.includes("document")) return FileText;
    return File;
  };

  const filteredAssets = assets.filter(
    (asset) =>
      asset.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.announcement?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  const resetForm = () => {
    setFormAnnouncementId("");
    setFormFile(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formAnnouncementId) errors.announcement_id = "Pengumuman wajib dipilih";
    if (!formFile) errors.file = "File wajib dipilih";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !formFile || !formAnnouncementId) return;
    setIsSubmitting(true);
    try {
      await assetsApi.create(Number(formAnnouncementId), formFile);
      await fetchAssets();
      setFormOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create asset:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Assets
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Kelola file dan media pengumuman
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          Tambah Asset
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari asset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <EmptyState
          icon={<FileImage className="w-8 h-8 text-slate-400" />}
          title="Belum ada asset"
          description="Asset akan muncul saat ditambahkan ke pengumuman"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => {
            const FileIcon = getFileIcon(asset.file_type);
            const isImage = isImageFile(asset.file_type);

            return (
              <Card key={asset.id} hover className="overflow-hidden">
                {/* Preview area */}
                <div className="relative h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {isImage ? (
                    <img
                      src={`${API_BASE_URL}/${asset.file_path}`}
                      alt={asset.file_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div className={`flex flex-col items-center gap-2 ${isImage ? 'hidden' : ''}`}>
                    <FileIcon className="w-12 h-12 text-slate-400" />
                    <span className="text-xs text-slate-500 uppercase">
                      {asset.file_type.split("/")[1] || "File"}
                    </span>
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* File name */}
                  <h3 className="font-medium text-slate-900 dark:text-white truncate">
                    {asset.file_name}
                  </h3>

                  {/* Announcement link */}
                  {asset.announcement && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">
                      📢 {asset.announcement.title}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="info" size="sm">
                      {(asset.file_type === 'pdf' ? 'PDF' : (isImage ? 'IMAGE' : (asset.file_type.split('/')
                        [1]?.toUpperCase() || 'FILE')))}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {formatShortDate(asset.created_at)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => setPreviewAsset(asset)}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => openDeleteModal(asset.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Asset Modal */}
      <Modal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) resetForm();
        }}
        title="Tambah Asset"
        description="Pilih pengumuman dan file untuk diunggah"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Pengumuman
            </label>
            <select
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formAnnouncementId}
              onChange={(e) => setFormAnnouncementId(e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">Pilih pengumuman</option>
              {announcementsList.map((a) => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
            {formErrors.announcement_id && (
              <p className="text-sm text-red-500 mt-1">{formErrors.announcement_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              File
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFormFile(e.target.files ? e.target.files[0] : null)}
              className="block w-full text-slate-900 dark:text-white file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-300"
            />
            {formErrors.file && (
              <p className="text-sm text-red-500 mt-1">{formErrors.file}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => { setFormOpen(false); resetForm(); }}>
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Upload
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Hapus Asset"
        description="Apakah Anda yakin ingin menghapus asset ini? Tindakan ini tidak dapat dibatalkan."
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

      {/* Preview Modal */}
      <Modal
        open={!!previewAsset}
        onOpenChange={() => setPreviewAsset(null)}
        title={previewAsset?.file_name || "Preview"}
        size="xl"
      >
        {previewAsset && (
          <div className="flex items-center justify-center min-h-[300px]">
            {isImageFile(previewAsset.file_type) ? (
              <img
                src={`${API_BASE_URL}/${previewAsset.file_path}`}
                alt={previewAsset.file_name}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
              />
            ) : isVideoFile(previewAsset.file_type) ? (
              <video
                controls
                className="max-w-full max-h-[60vh] rounded-lg"
                src={`${API_BASE_URL}/${previewAsset.file_path}`}
              />
            ) : (
              <div className="text-center">
                <File className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  Preview tidak tersedia untuk tipe file ini
                </p>
                <a
                  href={`${API_BASE_URL}/${previewAsset.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-indigo-600 hover:text-indigo-700"
                >
                  <Eye className="w-4 h-4" />
                  Buka di tab baru
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
