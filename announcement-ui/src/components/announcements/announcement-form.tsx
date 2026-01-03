'use client';

import { useEffect, useState } from 'react';
import { Button, Input, Textarea, Modal } from '@/components/ui';
import type { CreateAnnouncementPayload, UpdateAnnouncementPayload, Announcement, Asset } from '@/types';
import { assetsApi } from '@/lib/api';

interface AnnouncementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateAnnouncementPayload | UpdateAnnouncementPayload) => Promise<void>;
  initialData?: Announcement;
  isLoading?: boolean;
}

export function AnnouncementForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: AnnouncementFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});
  const [assetOptions, setAssetOptions] = useState<Asset[]>([]);
  const [selectedAssetIds, setSelectedAssetIds] = useState<number[]>(initialData?.assets?.map(a => a.id) || []);

  const isEdit = !!initialData;

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const list = await assetsApi.list();
        setAssetOptions(list);
      } catch (e) {
        // ignore error for now
      }
    };
    if (open) loadAssets();
  }, [open]);

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title || '');
      setContent(initialData?.content || '');
      setSelectedAssetIds(initialData?.assets?.map(a => a.id) || []);
    }
  }, [initialData, open]);

  const validate = () => {
    const newErrors: { title?: string; content?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Judul wajib diisi';
    }

    if (!content.trim()) {
      newErrors.content = 'Konten wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const payload: CreateAnnouncementPayload | UpdateAnnouncementPayload = selectedAssetIds.length
      ? { title, content, asset_ids: selectedAssetIds }
      : { title, content };
    await onSubmit(payload);
    
    if (!isEdit) {
      setTitle('');
      setContent('');
      setSelectedAssetIds([]);
    }
    
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
      description={isEdit ? 'Ubah detail pengumuman' : 'Isi form untuk membuat pengumuman baru'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Judul"
          placeholder="Masukkan judul pengumuman"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
        />

        <Textarea
          label="Konten"
          placeholder="Masukkan isi pengumuman"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          error={errors.content}
          rows={6}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Lampirkan Asset (opsional)
          </label>
          <div className="max-h-56 overflow-auto rounded-lg border border-slate-200 dark:border-slate-700 p-3 space-y-2">
            {assetOptions.length === 0 ? (
              <p className="text-sm text-slate-500">Tidak ada asset tersedia</p>
            ) : (
              assetOptions.map((asset) => (
                <label key={asset.id} className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedAssetIds.includes(asset.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAssetIds((prev) => [...prev, asset.id]);
                      } else {
                        setSelectedAssetIds((prev) => prev.filter((id) => id !== asset.id));
                      }
                    }}
                  />
                  <span className="truncate">{asset.file_name}</span>
                  <span className="ml-auto text-xs text-slate-400">{asset.file_type}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEdit ? 'Simpan Perubahan' : 'Buat Pengumuman'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
