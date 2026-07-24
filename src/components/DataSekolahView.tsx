import { CheckCircle2, Save, School, UserCheck } from 'lucide-react';
import React, { useState } from 'react';
import { Header } from './Header';
import { useApp } from '../context/AppContext';

export const DataSekolahView: React.FC = () => {
  const { schoolData, setSchoolData } = useApp();
  const [formData, setFormData] = useState({ ...schoolData });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSchoolData(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header title="DATA SEKOLAH & PROFIL SD" />

      <main className="max-w-5xl mx-auto w-full p-4 sm:p-6 flex-1">
        {savedSuccess && (
          <div className="mb-4 bg-emerald-100 border border-emerald-400 text-emerald-800 px-4 py-3 rounded-xl flex items-center space-x-2 animate-fade-in shadow">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-sm">Profil Data Sekolah berhasil diperbarui!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identitas Sekolah Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-lg mb-4 border-b border-slate-100 pb-2">
              <School className="w-5 h-5 text-emerald-600" />
              <h2>Identitas Identitas Sekolah Dasar</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Sekolah
                </label>
                <input
                  type="text"
                  value={formData.namaSekolah}
                  onChange={e => setFormData({ ...formData, namaSekolah: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  NPSN
                </label>
                <input
                  type="text"
                  value={formData.npsn}
                  onChange={e => setFormData({ ...formData, npsn: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  NSS / NDS
                </label>
                <input
                  type="text"
                  value={formData.nss}
                  onChange={e => setFormData({ ...formData, nss: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Alamat Jalan
                </label>
                <input
                  type="text"
                  value={formData.alamat}
                  onChange={e => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kelurahan / Desa
                </label>
                <input
                  type="text"
                  value={formData.kelurahan}
                  onChange={e => setFormData({ ...formData, kelurahan: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kecamatan
                </label>
                <input
                  type="text"
                  value={formData.kecamatan}
                  onChange={e => setFormData({ ...formData, kecamatan: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kabupaten / Kota
                </label>
                <input
                  type="text"
                  value={formData.kabupaten}
                  onChange={e => setFormData({ ...formData, kabupaten: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Provinsi
                </label>
                <input
                  type="text"
                  value={formData.provinsi}
                  onChange={e => setFormData({ ...formData, provinsi: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kode Pos
                </label>
                <input
                  type="text"
                  value={formData.kodePos}
                  onChange={e => setFormData({ ...formData, kodePos: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Telepon Sekolah
                </label>
                <input
                  type="text"
                  value={formData.telepon}
                  onChange={e => setFormData({ ...formData, telepon: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Sekolah
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Website / Blog
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Kepala Sekolah Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-lg mb-4 border-b border-slate-100 pb-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <h2>Pimpinan & Penandatangan Rapor / Buku Induk</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Kepala Sekolah & Gelar
                </label>
                <input
                  type="text"
                  value={formData.namaKepalaSekolah}
                  onChange={e => setFormData({ ...formData, namaKepalaSekolah: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  NIP Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={formData.nipKepalaSekolah}
                  onChange={e => setFormData({ ...formData, nipKepalaSekolah: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  URL Logo Sekolah (Opsional untuk Kop Rapor)
                </label>
                <input
                  type="text"
                  value={formData.logoUrl || ''}
                  onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 transition cursor-pointer"
            >
              <Save className="w-5 h-5" />
              <span>Simpan Profil Sekolah</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
