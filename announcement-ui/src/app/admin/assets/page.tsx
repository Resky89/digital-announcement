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
import { assetsApi } from "@/lib/api";
import { formatShortDate, isImageFile, isVideoFile } from "@/lib/utils";
import type { Asset } from "@/types";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/constants";

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formFileName, setFormFileName] = useState<string>("");
  const [formFile, setFormFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAssets = async () => {
    try {
      const list = await assetsApi.list();
      setAssets(list);
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
      asset.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  const resetForm = () => {
    setFormFileName("");
    setFormFile(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formFileName.trim()) errors.file_name = "Nama file wajib diisi";
    if (!formFile) errors.file = "File wajib dipilih";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !formFile) return;
    setIsSubmitting(true);
    try {
      await assetsApi.create(formFileName, formFile);
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
            const assetUrl = `${API_BASE_URL}${API_ENDPOINTS.PUBLIC.ASSET_STREAM(asset.id)}`;

            return (
              <Card key={asset.id} hover className="overflow-hidden">
                {/* Preview area */}
                <div className="relative h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <img
                      src={assetUrl}
                      alt={asset.file_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.currentTarget;
                        const parent = img.parentElement;
                        if (parent) {
                          img.style.display = "none";
                          // Create placeholder element
                          const placeholder = document.createElement('div');
                          placeholder.className = 'flex flex-col items-center justify-center gap-2 w-full h-full';
                          placeholder.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
                              <line x1="2" y1="2" x2="22" y2="22"></line>
                              <path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"></path>
                              <line x1="13.5" y1="13.5" x2="6" y2="21"></line>
                              <line x1="18" y1="12" x2="21" y2="15"></line>
                              <path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59"></path>
                              <path d="M21 15V5a2 2 0 0 0-2-2H9"></path>
                            </svg>
                            <span class="text-sm text-slate-500">Gambar tidak tersedia</span>
                          `;
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <FileIcon className="w-12 h-12 text-slate-400" />
                      <span className="text-xs text-slate-500 uppercase">
                        {asset.file_type.split("/")[1] || "File"}
                      </span>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  {/* File name */}
                  <h3 className="font-medium text-slate-900 dark:text-white truncate">
                    {asset.file_name}
                  </h3>

                  

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
        description="Isi nama file dan unggah file"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nama File
            </label>
            <input
              type="text"
              value={formFileName}
              onChange={(e) => setFormFileName(e.target.value)}
              placeholder="Masukkan nama file"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {formErrors.file_name && (
              <p className="text-sm text-red-500 mt-1">{formErrors.file_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              File
            </label>
            <input
              type="file"
              accept="image/*,video/*,application/pdf"
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
                src={`${API_BASE_URL}${API_ENDPOINTS.PUBLIC.ASSET_STREAM(previewAsset.id)}`}
                alt={previewAsset.file_name}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
                onError={(e) => {
                  const img = e.currentTarget;
                  const parent = img.parentElement;
                  if (parent) {
                    img.style.display = "none";
                    const placeholder = document.createElement('div');
                    placeholder.className = 'flex flex-col items-center justify-center gap-4 text-center';
                    placeholder.innerHTML = `
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
                        <line x1="2" y1="2" x2="22" y2="22"></line>
                        <path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"></path>
                        <line x1="13.5" y1="13.5" x2="6" y2="21"></line>
                        <line x1="18" y1="12" x2="21" y2="15"></line>
                        <path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59"></path>
                        <path d="M21 15V5a2 2 0 0 0-2-2H9"></path>
                      </svg>
                      <p class="text-slate-500 dark:text-slate-400">Gambar tidak dapat dimuat</p>
                    `;
                    parent.appendChild(placeholder);
                  }
                }}
              />
            ) : isVideoFile(previewAsset.file_type) ? (
              <video
                controls
                className="max-w-full max-h-[60vh] rounded-lg"
               src={`${API_BASE_URL}${API_ENDPOINTS.PUBLIC.ASSET_STREAM(previewAsset.id)}`}
              />
            ) : (
              <div className="text-center">
                <File className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  Preview tidak tersedia untuk tipe file ini
                </p>
                <a
                  href={`${API_BASE_URL}${API_ENDPOINTS.PUBLIC.ASSET_STREAM(previewAsset.id)}`}
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
