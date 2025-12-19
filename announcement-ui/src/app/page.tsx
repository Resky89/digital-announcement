import Link from "next/link";
import { Megaphone, ArrowRight, Users, Shield, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Animated background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Digital Announcement
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/user"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300"
            >
              Lihat Pengumuman
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-indigo-300 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Platform Pengumuman Modern
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Kelola Pengumuman
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Dengan Mudah
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Platform digital announcement yang memudahkan Anda mengelola dan menyebarkan informasi penting kepada semua pengguna dengan cepat dan efisien.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/user"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              Lihat Pengumuman
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
          {/* Feature 1 */}
          <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/30 mb-6 group-hover:scale-110 transition-transform">
              <Megaphone className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Kelola Pengumuman
            </h3>
            <p className="text-slate-400">
              Buat, edit, dan hapus pengumuman dengan mudah melalui dashboard admin yang intuitif.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30 mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Manajemen Pengguna
            </h3>
            <p className="text-slate-400">
              Kelola akses pengguna dengan sistem role-based access control yang aman.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg shadow-pink-500/30 mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Keamanan Terjamin
            </h3>
            <p className="text-slate-400">
              Sistem autentikasi JWT yang aman untuk melindungi data dan akses aplikasi.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Digital Announcement. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
