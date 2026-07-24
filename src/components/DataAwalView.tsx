import { Calendar, CheckCircle2, GraduationCap, Save } from 'lucide-react';
import React, { useState } from 'react';
import { Header } from './Header';
import { useApp } from '../context/AppContext';
import { PengaturanMataPelajaranCard } from './PengaturanMataPelajaranCard';
import { SupabaseSyncCard } from './SupabaseSyncCard';

export const DataAwalView: React.FC = () => {
  const { academicYear, setAcademicYear } = useApp();
  const [formData, setFormData] = useState({ ...academicYear });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleWaliKelasChange = (kelasNum: number, field: 'nama' | 'nip', value: string) => {
    setFormData(prev => ({
      ...prev,
      waliKelasMap: {
        ...prev.waliKelasMap,
        [kelasNum]: {
          ...prev.waliKelasMap[kelasNum],
          [field]: value
        }
      }
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAcademicYear(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header title="DATA AWAL & PENGATURAN TAHUN AJARAN" />

      <main className="max-w-5xl mx-auto w-full p-4 sm:p-6 flex-1">
        {savedSuccess && (
          <div className="mb-4 bg-emerald-100 border border-emerald-400 text-emerald-800 px-4 py-3 rounded-xl flex items-center space-x-2 animate-fade-in shadow">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-sm">Data Awal & Pengaturan Tahun Ajaran berhasil disimpan!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* General Academic Config Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-lg mb-4 border-b border-slate-100 pb-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <h2>Pengaturan Tahun Ajaran & Kurikulum</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tahun Ajaran
                </label>
                <input
                  type="text"
                  value={formData.tahunAjaran}
                  onChange={e => setFormData({ ...formData, tahunAjaran: e.target.value })}
                  placeholder="Contoh: 2024/2025"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kurikulum Digunakan
                </label>
                <select
                  value={formData.kurikulum}
                  onChange={e => setFormData({ ...formData, kurikulum: e.target.value as any })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Kurikulum Merdeka">Kurikulum Merdeka</option>
                  <option value="Kurikulum 2013">Kurikulum 2013 (K13)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Semester Aktif
                </label>
                <select
                  value={formData.semesterAktif}
                  onChange={e => setFormData({ ...formData, semesterAktif: Number(e.target.value) as 1 | 2 })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value={1}>Semester 1 (Ganjil)</option>
                  <option value={2}>Semester 2 (Genap)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tanggal Pembagian Rapor
                </label>
                <input
                  type="text"
                  value={formData.tanggalRapor}
                  onChange={e => setFormData({ ...formData, tanggalRapor: e.target.value })}
                  placeholder="Contoh: 21 Desember 2024"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Wali Kelas Assignment Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-lg mb-4 border-b border-slate-100 pb-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <h2>Daftar Wali Kelas (Kelas 1 s/d Kelas 6)</h2>
            </div>

            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map(k => (
                <div key={k} className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-2 font-black text-emerald-900 text-sm bg-emerald-100 text-center py-2 rounded-lg border border-emerald-200">
                    KELAS {k}
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Nama Wali Kelas</label>
                    <input
                      type="text"
                      value={formData.waliKelasMap[k]?.nama || ''}
                      onChange={e => handleWaliKelasChange(k, 'nama', e.target.value)}
                      placeholder="Nama Lengkap & Gelar Wali Kelas"
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm bg-white"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">NIP Wali Kelas</label>
                    <input
                      type="text"
                      value={formData.waliKelasMap[k]?.nip || ''}
                      onChange={e => handleWaliKelasChange(k, 'nip', e.target.value)}
                      placeholder="NIP Wali Kelas"
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 transition cursor-pointer"
            >
              <Save className="w-5 h-5" />
              <span>Simpan Data Awal</span>
            </button>
          </div>
        </form>

        {/* Supabase Cloud Database Integration Card */}
        <div className="mt-6">
          <SupabaseSyncCard />
        </div>

        {/* Pengaturan Mata Pelajaran Card */}
        <div className="mt-6">
          <PengaturanMataPelajaranCard />
        </div>
      </main>
    </div>
  );
};
