import { CheckCircle2, Heart, Home, Save, User, Users } from 'lucide-react';
import React, { useState } from 'react';
import { Header } from './Header';
import { useApp } from '../context/AppContext';
import { StudentDetail } from '../types';

export const DataLengkapSiswaView: React.FC = () => {
  const { students, selectedStudentId, setSelectedStudentId, updateStudent, getStudentById } = useApp();
  
  const currentStudent = getStudentById(selectedStudentId || '') || students[0];
  const [formData, setFormData] = useState<StudentDetail>(currentStudent);
  const [activeTab, setActiveTab] = useState<'identitas' | 'orangtua' | 'fisik' | 'foto'>('identitas');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // When selected student changes in dropdown
  const handleStudentSelect = (id: string) => {
    setSelectedStudentId(id);
    const target = getStudentById(id);
    if (target) {
      setFormData(target);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <p className="text-slate-600">Belum ada siswa terdaftar. Silakan tambah data siswa terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header title="DATA LENGKAP SISWA (BIODATA BUKU INDUK)" />

      <main className="max-w-5xl mx-auto w-full p-4 sm:p-6 flex-1">
        {/* Student Switcher Dropdown Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <User className="w-5 h-5 text-emerald-600" />
            <label className="text-xs font-bold text-slate-700 uppercase">Pilih Siswa:</label>
            <select
              value={formData.id}
              onChange={e => handleStudentSelect(e.target.value)}
              className="border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-1 sm:w-80"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nis} - {s.namaLengkap} ({s.jenisKelamin})
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs font-semibold text-slate-500">
            NISN: <span className="font-bold text-slate-800">{formData.nisn}</span>
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-4 bg-emerald-100 border border-emerald-400 text-emerald-800 px-4 py-3 rounded-xl flex items-center space-x-2 shadow">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-sm">Biodata Lengkap Siswa berhasil diperbarui!</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-2 pt-2 space-x-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('identitas')}
            className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-t-xl transition flex items-center space-x-2 border-b-2 cursor-pointer ${
              activeTab === 'identitas'
                ? 'bg-slate-100 border-emerald-600 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>1. Identitas Diri</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orangtua')}
            className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-t-xl transition flex items-center space-x-2 border-b-2 cursor-pointer ${
              activeTab === 'orangtua'
                ? 'bg-slate-100 border-emerald-600 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Orang Tua / Wali</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fisik')}
            className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-t-xl transition flex items-center space-x-2 border-b-2 cursor-pointer ${
              activeTab === 'fisik'
                ? 'bg-slate-100 border-emerald-600 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>3. Fisik & Kesehatan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('foto')}
            className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-t-xl transition flex items-center space-x-2 border-b-2 cursor-pointer ${
              activeTab === 'foto'
                ? 'bg-slate-100 border-emerald-600 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>4. Foto & Mutasi</span>
          </button>
        </div>

        {/* Tab Content Box */}
        <form onSubmit={handleSave} className="bg-white p-5 sm:p-6 rounded-b-2xl shadow-sm border border-slate-200 border-t-0 space-y-6">
          
          {/* TAB 1: IDENTITAS DIRI */}
          {activeTab === 'identitas' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-800 border-b pb-2 text-base">Identitas Diri Siswa</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">NIS Sekolah *</label>
                  <input
                    type="text"
                    value={formData.nis}
                    onChange={e => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">NISN *</label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={e => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={e => setFormData({ ...formData, jenisKelamin: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Lengkap Siswa *</label>
                  <input
                    type="text"
                    value={formData.namaLengkap}
                    onChange={e => setFormData({ ...formData, namaLengkap: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    value={formData.namaPanggilan}
                    onChange={e => setFormData({ ...formData, namaPanggilan: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={formData.tempatLahir}
                    onChange={e => setFormData({ ...formData, tempatLahir: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={e => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Agama</label>
                  <input
                    type="text"
                    value={formData.agama}
                    onChange={e => setFormData({ ...formData, agama: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kewarganegaraan</label>
                  <input
                    type="text"
                    value={formData.kewarganegaraan}
                    onChange={e => setFormData({ ...formData, kewarganegaraan: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Anak Ke-</label>
                  <input
                    type="number"
                    value={formData.anakKe}
                    onChange={e => setFormData({ ...formData, anakKe: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status Anak</label>
                  <select
                    value={formData.statusAnak}
                    onChange={e => setFormData({ ...formData, statusAnak: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white"
                  >
                    <option value="Kandung">Kandung</option>
                    <option value="Tiri">Tiri</option>
                    <option value="Angkat">Angkat</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Alamat Tempat Tinggal</label>
                  <input
                    type="text"
                    value={formData.alamatSiswa}
                    onChange={e => setFormData({ ...formData, alamatSiswa: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tinggal Dengan</label>
                  <select
                    value={formData.tinggalDengan}
                    onChange={e => setFormData({ ...formData, tinggalDengan: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white"
                  >
                    <option value="Orang Tua">Orang Tua</option>
                    <option value="Wali">Wali</option>
                    <option value="Kos">Kos / Asrama</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATA ORANG TUA / WALI */}
          {activeTab === 'orangtua' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-800 border-b pb-2 text-base">Data Ayah & Ibu Kandung / Wali</h3>
              
              <div className="p-4 bg-slate-50 border rounded-xl space-y-3">
                <h4 className="font-bold text-emerald-800 text-sm">AYAH KANDUNG</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">Nama Ayah</label>
                    <input
                      type="text"
                      value={formData.parentData.namaAyah}
                      onChange={e => setFormData({
                        ...formData,
                        parentData: { ...formData.parentData, namaAyah: e.target.value }
                      })}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">NIK Ayah</label>
                    <input
                      type="text"
                      value={formData.parentData.nikAyah}
                      onChange={e => setFormData({
                        ...formData,
                        parentData: { ...formData.parentData, nikAyah: e.target.value }
                      })}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">Pekerjaan Ayah</label>
                    <input
                      type="text"
                      value={formData.parentData.pekerjaanAyah}
                      onChange={e => setFormData({
                        ...formData,
                        parentData: { ...formData.parentData, pekerjaanAyah: e.target.value }
                      })}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border rounded-xl space-y-3">
                <h4 className="font-bold text-emerald-800 text-sm">IBU KANDUNG</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">Nama Ibu</label>
                    <input
                      type="text"
                      value={formData.parentData.namaIbu}
                      onChange={e => setFormData({
                        ...formData,
                        parentData: { ...formData.parentData, namaIbu: e.target.value }
                      })}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">NIK Ibu</label>
                    <input
                      type="text"
                      value={formData.parentData.nikIbu}
                      onChange={e => setFormData({
                        ...formData,
                        parentData: { ...formData.parentData, nikIbu: e.target.value }
                      })}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">Pekerjaan Ibu</label>
                    <input
                      type="text"
                      value={formData.parentData.pekerjaanIbu}
                      onChange={e => setFormData({
                        ...formData,
                        parentData: { ...formData.parentData, pekerjaanIbu: e.target.value }
                      })}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">No. HP / Kontak Orang Tua</label>
                  <input
                    type="text"
                    value={formData.parentData.noHpOrangTua}
                    onChange={e => setFormData({
                      ...formData,
                      parentData: { ...formData.parentData, noHpOrangTua: e.target.value }
                    })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Alamat Orang Tua</label>
                  <input
                    type="text"
                    value={formData.parentData.alamatOrangTua}
                    onChange={e => setFormData({
                      ...formData,
                      parentData: { ...formData.parentData, alamatOrangTua: e.target.value }
                    })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PERKEMBANGAN FISIK & KESEHATAN */}
          {activeTab === 'fisik' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-800 border-b pb-2 text-base">Ciri Fisik & Riwayat Kesehatan Siswa</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tinggi Badan (cm)</label>
                  <input
                    type="number"
                    value={formData.physicalData.tinggiBadan}
                    onChange={e => setFormData({
                      ...formData,
                      physicalData: { ...formData.physicalData, tinggiBadan: Number(e.target.value) }
                    })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Berat Badan (kg)</label>
                  <input
                    type="number"
                    value={formData.physicalData.beratBadan}
                    onChange={e => setFormData({
                      ...formData,
                      physicalData: { ...formData.physicalData, beratBadan: Number(e.target.value) }
                    })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Golongan Darah</label>
                  <input
                    type="text"
                    value={formData.physicalData.golonganDarah}
                    onChange={e => setFormData({
                      ...formData,
                      physicalData: { ...formData.physicalData, golonganDarah: e.target.value }
                    })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pendengaran</label>
                  <input
                    type="text"
                    value={formData.physicalData.pendengaran}
                    onChange={e => setFormData({
                      ...formData,
                      physicalData: { ...formData.physicalData, pendengaran: e.target.value }
                    })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Penglihatan</label>
                  <input
                    type="text"
                    value={formData.physicalData.penglihatan}
                    onChange={e => setFormData({
                      ...formData,
                      physicalData: { ...formData.physicalData, penglihatan: e.target.value }
                    })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kondisi Gigi</label>
                  <input
                    type="text"
                    value={formData.physicalData.gigi}
                    onChange={e => setFormData({
                      ...formData,
                      physicalData: { ...formData.physicalData, gigi: e.target.value }
                    })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FOTO & MUTASI */}
          {activeTab === 'foto' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-800 border-b pb-2 text-base">Foto Pas Siswa & Status Keberadaan</h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-40 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center overflow-hidden bg-slate-50 relative group">
                  {formData.fotoUrl ? (
                    <img src={formData.fotoUrl} alt={formData.namaLengkap} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-400 text-center p-2">Foto 3x4 Pas Siswa</span>
                  )}
                </div>

                <div className="space-y-3 flex-1 w-full">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">URL Foto Pas Siswa (3x4)</label>
                    <input
                      type="text"
                      value={formData.fotoUrl || ''}
                      onChange={e => setFormData({ ...formData, fotoUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status Siswa</label>
                      <select
                        value={formData.statusSiswa}
                        onChange={e => setFormData({ ...formData, statusSiswa: e.target.value as any })}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white font-bold"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Lulus">Lulus</option>
                        <option value="Pindah">Pindah Sekolah</option>
                        <option value="Keluar">Keluar / Putus Sekolah</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">No. Ijazah (Jika Lulus)</label>
                      <input
                        type="text"
                        value={formData.noIjazah || ''}
                        onChange={e => setFormData({ ...formData, noIjazah: e.target.value })}
                        placeholder="DN-02/D-SD/06/..."
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tahun Lulus (Jika Lulus)</label>
                      <input
                        type="text"
                        value={formData.tahunLulus || ''}
                        onChange={e => setFormData({ ...formData, tahunLulus: e.target.value })}
                        placeholder="2026/2027"
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 transition cursor-pointer"
            >
              <Save className="w-5 h-5" />
              <span>Simpan Perubahan Biodata</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
