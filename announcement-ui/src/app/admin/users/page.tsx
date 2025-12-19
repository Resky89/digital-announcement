"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Mail, User as UserIcon } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Input,
  Spinner,
  EmptyState,
  Modal,
  Avatar,
  Badge,
} from "@/components/ui";
import { usersApi } from "@/lib/api";
import { formatShortDate, getInitials } from "@/lib/utils";
import type { User, CreateUserPayload, UpdateUserPayload } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fetchUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "" });
    setFormErrors({});
    setEditingUser(undefined);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Nama wajib diisi";
    }

    if (!formData.email.trim()) {
      errors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Format email tidak valid";
    }

    if (!editingUser && !formData.password) {
      errors.password = "Password wajib diisi";
    } else if (formData.password && formData.password.length < 6) {
      errors.password = "Password minimal 6 karakter";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (editingUser) {
        const updateData: UpdateUserPayload = {
          name: formData.name,
          email: formData.email,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await usersApi.update(editingUser.id, updateData);
      } else {
        await usersApi.create(formData as CreateUserPayload);
      }
      await fetchUsers();
      setFormOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await usersApi.delete(deletingId);
      await fetchUsers();
      setDeleteModalOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
    });
    setFormOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const source = Array.isArray(users) ? users : [];
  const filteredUsers = source.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
            Users
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Kelola akun pengguna sistem
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Tambah User
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={<UserIcon className="w-8 h-8 text-slate-400" />}
          title="Belum ada user"
          description="Mulai dengan menambahkan user pertama"
          action={
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="w-4 h-4" />
              Tambah User
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
                    User
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white hidden md:table-cell">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white hidden sm:table-cell">
                    Bergabung
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar fallback={getInitials(user.name)} size="md" />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 md:hidden">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {formatShortDate(user.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user.id)}
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
      <Modal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) resetForm();
        }}
        title={editingUser ? "Edit User" : "Tambah User Baru"}
        description={
          editingUser
            ? "Ubah informasi user"
            : "Isi form untuk menambahkan user baru"
        }
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama"
            placeholder="Masukkan nama lengkap"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            error={formErrors.name}
          />

          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={formErrors.email}
          />

          <Input
            label={editingUser ? "Password (Kosongkan jika tidak diubah)" : "Password"}
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            error={formErrors.password}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setFormOpen(false);
                resetForm();
              }}
            >
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingUser ? "Simpan Perubahan" : "Tambah User"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Hapus User"
        description="Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan."
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
