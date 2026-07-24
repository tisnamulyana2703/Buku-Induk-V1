import { Calendar, CheckCircle2, GraduationCap, Save, Plus, Edit3, Trash2, Layers, RotateCcw } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { useApp } from '../context/AppContext';
import { PengaturanMataPelajaranCard } from './PengaturanMataPelajaranCard';
import { SupabaseSyncCard } from './SupabaseSyncCard';

export const DataAwalView: React.FC = () => {
  const { academicYear, setAcademicYear } = useApp();
  const [formData, setFormData] = useState({ ...academicYear });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Rombel Input State
  const [newRombelName, setNewRombelName] = useState('');
  const [editingRombel, setEditingRombel] = useState<string | null>(null);
  const [editRombelValue, setEditRombelValue] = useState('');

  // Sync formData when academicYear from context changes (e.g. from Supabase sync)
  useEffect(() => {
    setFormData({ ...academicYear });
  }, [academicYear]);

  const currentRombels = formData.rombelList && formData.rombelList.length > 0
    ? formData.rombelList
    : ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'];

  const handleWaliKelasChange = (kelasKey: string | number, field: 'nama' | 'nip', value: string) => {
    setFormData(prev => ({
      ...prev,
      waliKelasMap: {
        ...prev.waliKelasMap,
        [kelasKey]: {
          ...(prev.waliKelasMap[kelasKey] || { nama: '', nip: '' }),
          [field]: value
        }
      }
    }));
  };

  const handleAddRombel = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newRombelName.trim().toUpperCase();
    if (!clean) return;

    if (currentRombels.includes(clean)) {
      alert(`Kelas / Rombel "${clean}" sudah ada!`);
      return;
    }

    const updated = [...currentRombels, clean];
    setFormData(prev => ({
      ...prev,
      rombelList: updated,
      waliKelasMap: {
        ...prev.waliKelasMap,
        [clean]: prev.waliKelasMap[clean] || { nama: '', nip: '' }
      }
    }));
    setNewRombelName('');
  };

  const handleStartEdit = (rombel: string) => {
    setEditingRombel(rombel);
    setEditRombelValue(rombel);
  };

  const handleSaveEditRombel = (oldName: string) => {
    const clean = editRombelValue.trim().toUpperCase();
    if (!clean || clean === oldName) {
      setEditingRombel(null);
      return;
    }

    if (currentRombels.includes(clean)) {
      alert(`Nama Rombel "${clean}" sudah digunakan!`);
      return;
    }

    const updated = currentRombels.map(r => (r === oldName ? clean : r));
    const newWaliMap = { ...formData.waliKelasMap };
    if (newWaliMap[oldName]) {
      newWaliMap[clean] = newWaliMap[oldName];
      delete newWaliMap[oldName];
    }

    setFormData(prev => ({
      ...prev,
      rombelList: updated,
      waliKelasMap: newWaliMap
    }));
    setEditingRombel(null);
  };

  const handleDeleteRombel = (rombel: string) => {
    if (currentRombels.length <= 1) {
      alert('Minimal harus ada 1 Rombel / Kelas!');
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus Rombel "${rombel}"?`)) {
      const updated = currentRombels.filter(r => r !== rombel);
      const newWaliMap = { ...formData.waliKelasMap };
      delete newWaliMap[rombel];

      setFormData(prev => ({
        ...prev,
        rombelList: updated,
        waliKelasMap: newWaliMap
      }));
    }
  };

  const handleApplyPreset = (type: '12-rombel' | '6-kelas') => {
    let preset: string[];
    if (type === '12-rombel') {
      preset = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'];
    } else {
      preset = ['1', '2', '3', '4', '5', '6'];
    }

    if (confirm(`Terapkan preset ${type === '12-rombel' ? '12 Rombel (1A - 6B)' : '6 Kelas (1 - 6)'}?`)) {
      const newWaliMap = { ...formData.waliKelasMap };
      preset.forEach(r => {
        if (!newWaliMap[r]) {
          newWaliMap[r] = { nama: '', nip: '' };
        }
      });

      setFormData(prev => ({
        ...prev,
        rombelList: preset,
        waliKelasMap: newWaliMap
      }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAcademicYear({
      ...formData,
      rombelList: currentRombels
    });
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
            <span className="font-semibold text-sm">Data Awal & Pengaturan Rombel berhasil disimpan!</span>
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
                  placeholder="Contoh: 2026/2027"
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
                  placeholder="Contoh: 21 Desember 2026"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Rombel / Class Management Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-lg">
                <Layers className="w-5 h-5 text-emerald-600" />
                <h2>Pengaturan Rombongan Belajar (Rombel / Kelas)</h2>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Total: {currentRombels.length} Rombel
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('12-rombel')}
                  className="px-2.5 py-1 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg transition cursor-pointer flex items-center space-x-1"
                  title="Reset ke 12 Rombel SD (1A - 6B)"
                >
                  <RotateCcw className="w-3 h-3 text-amber-600" />
                  <span>Preset 12 Rombel (1A-6B)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyPreset('6-kelas')}
                  className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg transition cursor-pointer flex items-center space-x-1"
                  title="Reset ke 6 Kelas Dasar (1 - 6)"
                >
                  <RotateCcw className="w-3 h-3 text-slate-500" />
                  <span>Preset 6 Kelas (1-6)</span>
                </button>
              </div>
            </div>

            {/* Rombel Tag List */}
            <div className="flex flex-wrap gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              {currentRombels.map(rombel => (
                <div
                  key={rombel}
                  className="bg-white border border-emerald-300 shadow-sm rounded-xl px-3 py-1.5 flex items-center space-x-2 font-bold text-xs text-emerald-900 group hover:border-emerald-500 transition"
                >
                  {editingRombel === rombel ? (
                    <div className="flex items-center space-x-1">
                      <input
                        type="text"
                        value={editRombelValue}
                        onChange={e => setEditRombelValue(e.target.value)}
                        className="w-16 px-1.5 py-0.5 border border-emerald-500 rounded text-xs font-bold font-mono outline-none uppercase"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveEditRombel(rombel);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEditRombel(rombel)}
                        className="text-emerald-700 hover:text-emerald-900 text-[10px] font-bold bg-emerald-100 px-1.5 py-0.5 rounded cursor-pointer"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-extrabold font-mono text-sm">{rombel}</span>
                      <div className="flex items-center space-x-1 border-l pl-2 border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(rombel)}
                          className="text-slate-400 hover:text-sky-600 transition cursor-pointer"
                          title="Edit nama rombel"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRombel(rombel)}
                          className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          title="Hapus rombel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Rombel Input Bar */}
            <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
              <input
                type="text"
                value={newRombelName}
                onChange={e => setNewRombelName(e.target.value)}
                placeholder="Tambah Rombel Baru (misal: 1C, 7A, PAUD-A)..."
                className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
              />
              <button
                type="button"
                onClick={handleAddRombel}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1 shadow transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Rombel</span>
              </button>
            </div>
          </div>

          {/* Wali Kelas Assignment Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-lg mb-4 border-b border-slate-100 pb-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <h2>Daftar Wali Kelas ({currentRombels.length} Rombel)</h2>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {currentRombels.map(k => (
                <div key={k} className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-3 items-center hover:border-emerald-300 transition">
                  <div className="sm:col-span-3 font-black text-emerald-900 text-sm bg-emerald-100 text-center py-2 rounded-lg border border-emerald-200">
                    KELAS / ROMBEL {k}
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Nama Wali Kelas</label>
                    <input
                      type="text"
                      value={formData.waliKelasMap[k]?.nama || ''}
                      onChange={e => handleWaliKelasChange(k, 'nama', e.target.value)}
                      placeholder={`Nama Wali Kelas Rombel ${k}`}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm bg-white font-semibold"
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
              <span>Simpan Data Awal & Rombel</span>
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
