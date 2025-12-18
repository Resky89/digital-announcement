'use client';

import { useState } from 'react';
import { Button, Input, Textarea, Modal } from '@/components/ui';
import type { CreateAnnouncementPayload, UpdateAnnouncementPayload, Announcement } from '@/types';

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

  const isEdit = !!initialData;

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

    await onSubmit({ title, content });
    
    if (!isEdit) {
      setTitle('');
      setContent('');
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
