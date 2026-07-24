import { BookOpen, CheckCircle2, Plus, Save, Trash2, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import { useApp } from '../context/AppContext';
import { StudentSemesterRecord, SubjectGrade } from '../types';

export const CatatanSiswaView: React.FC = () => {
  const {
    students,
    selectedStudentId,
    setSelectedStudentId,
    getStudentById,
    selectedClass,
    setSelectedClass,
    selectedSemester,
    setSelectedSemester,
    getSemesterRecord,
    saveSemesterRecord,
    assessmentMode,
    setActiveView,
    rombelList
  } = useApp();

  const currentStudent = getStudentById(selectedStudentId || '') || students[0];

  const [record, setRecord] = useState<StudentSemesterRecord>(() => {
    return getSemesterRecord(
      currentStudent?.id || '',
      selectedClass,
      selectedSemester
    );
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when selected student, class, or semester changes
  useEffect(() => {
    if (currentStudent) {
      setRecord(getSemesterRecord(currentStudent.id, selectedClass, selectedSemester));
    }
  }, [selectedStudentId, selectedClass, selectedSemester]);

  const handleStudentChange = (id: string) => {
    setSelectedStudentId(id);
  };

  const handleGradeChange = (index: number, field: keyof SubjectGrade, value: any) => {
    setRecord(prev => {
      const copyGrades = [...prev.grades];
      const target = { ...copyGrades[index], [field]: value };

      // Auto-calculate final score and predicate if score changes
      if (field === 'nilaiPengetahuan' || field === 'nilaiKeterampilan') {
        const p = Number(target.nilaiPengetahuan) || 0;
        const k = Number(target.nilaiKeterampilan) || p;
        const avg = Math.round((p + k) / 2);
        target.nilaiAkhir = avg;

        if (avg >= 90) target.predikat = 'A';
        else if (avg >= 80) target.predikat = 'B';
        else if (avg >= 70) target.predikat = 'C';
        else target.predikat = 'D';
      }

      copyGrades[index] = target;
      return { ...prev, grades: copyGrades };
    });
  };

  const handleEskulChange = (idx: number, field: string, value: string) => {
    setRecord(prev => {
      const copyEskul = [...prev.ekstrakurikuler];
      copyEskul[idx] = { ...copyEskul[idx], [field]: value };
      return { ...prev, ekstrakurikuler: copyEskul };
    });
  };

  const addEskul = () => {
    setRecord(prev => ({
      ...prev,
      ekstrakurikuler: [
        ...prev.ekstrakurikuler,
        { nama: 'Olahraga / Seni', nilai: 'B', keterangan: 'Baik' }
      ]
    }));
  };

  const removeEskul = (idx: number) => {
    setRecord(prev => ({
      ...prev,
      ekstrakurikuler: prev.ekstrakurikuler.filter((_, i) => i !== idx)
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSemesterRecord(record);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <p className="text-slate-600">Siswa tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header
        title={`CATATAN NILAI SISWA - KELAS ${selectedClass} SEMESTER ${selectedSemester}`}
        subtitle={`Mode Aktif: ${assessmentMode === 'tanpa' ? 'Tanpa Deskripsi (Nilai Angka)' : 'Dengan Deskripsi Capaian'}`}
      />

      <main className="max-w-6xl mx-auto w-full p-4 sm:p-6 flex-1 space-y-4">
        {/* Top Selectors Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Student Picker */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <User className="w-5 h-5 text-emerald-600" />
            <label className="text-xs font-bold text-slate-700 uppercase">Siswa:</label>
            <select
              value={currentStudent.id}
              onChange={e => handleStudentChange(e.target.value)}
              className="border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-1 md:w-72"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nis} - {s.namaLengkap}
                </option>
              ))}
            </select>
          </div>

          {/* Class & Semester Selectors */}
          <div className="flex flex-wrap items-center space-x-2 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-slate-600 uppercase">Kelas/Rombel:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl space-x-1 overflow-x-auto max-w-full sm:max-w-xs md:max-w-md">
              {rombelList.map(k => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSelectedClass(k)}
                  className={`px-2.5 py-1 text-xs font-extrabold rounded-lg transition whitespace-nowrap cursor-pointer ${
                    String(selectedClass) === String(k) ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-slate-600 uppercase ml-2">Sem:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl space-x-1">
              {[1, 2].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSemester(s as 1 | 2)}
                  className={`px-3 py-1 text-xs font-extrabold rounded-lg transition cursor-pointer ${
                    selectedSemester === s ? 'bg-amber-500 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sem {s}
                </button>
              ))}
            </div>
          </div>

        </div>

        {savedSuccess && (
          <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 px-4 py-3 rounded-xl flex items-center space-x-2 shadow">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-sm">Catatan nilai semester berhasil disimpan!</span>
          </div>
        )}

        {/* Grade Entry Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-800 text-white p-3 font-bold text-sm flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>DAFTAR NILAI MATA PELAJARAN</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveView('data-awal')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center space-x-1 cursor-pointer transition shadow-sm"
                  title="Pengaturan Mata Pelajaran (Tambah, Edit, Hapus, Duplikasi)"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Kelola Mapel</span>
                </button>
                <span className="text-xs text-amber-300 font-normal hidden sm:inline">
                  Siswa: {currentStudent.namaLengkap} (NIS: {currentStudent.nis})
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 text-xs font-bold uppercase border-b">
                    <th className="p-3 text-center w-10">No</th>
                    <th className="p-3">Mata Pelajaran</th>
                    <th className="p-3 text-center w-20">KKM</th>
                    <th className="p-3 text-center w-24">Nilai</th>
                    <th className="p-3 text-center w-20">Predikat</th>
                    {assessmentMode === 'dengan' && (
                      <th className="p-3">Deskripsi Capaian Pembelajaran</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {record.grades.map((g, idx) => (
                    <tr key={g.code} className="hover:bg-slate-50">
                      <td className="p-3 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-3 font-semibold text-slate-900">
                        {g.namaMataPelajaran}
                        <span className="text-xs text-slate-400 block font-normal">{g.code}</span>
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          value={g.kKM}
                          onChange={e => handleGradeChange(idx, 'kKM', Number(e.target.value))}
                          className="w-14 text-center border border-slate-300 rounded px-1 py-1 text-xs"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          value={g.nilaiAkhir}
                          onChange={e => handleGradeChange(idx, 'nilaiPengetahuan', Number(e.target.value))}
                          className="w-16 text-center font-bold border border-emerald-400 bg-emerald-50 rounded px-1.5 py-1 text-sm text-emerald-900"
                          min={0}
                          max={100}
                        />
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-black ${
                          g.predikat === 'A' ? 'bg-emerald-100 text-emerald-800' :
                          g.predikat === 'B' ? 'bg-sky-100 text-sky-800' :
                          g.predikat === 'C' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {g.predikat}
                        </span>
                      </td>
                      {assessmentMode === 'dengan' && (
                        <td className="p-3">
                          <textarea
                            value={g.deskripsiCapaian}
                            onChange={e => handleGradeChange(idx, 'deskripsiCapaian', e.target.value)}
                            rows={2}
                            placeholder="Tuliskan deskripsi kualitatif capaian siswa..."
                            className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Kehadiran & Ekstrakurikuler Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kehadiran */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
              <h3 className="font-bold text-slate-800 border-b pb-2 text-sm uppercase">Catatan Kehadiran (Hari)</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Sakit</label>
                  <input
                    type="number"
                    value={record.sakit}
                    onChange={e => setRecord({ ...record, sakit: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Izin</label>
                  <input
                    type="number"
                    value={record.izin}
                    onChange={e => setRecord({ ...record, izin: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Tanpa Keterangan</label>
                  <input
                    type="number"
                    value={record.tanpaKeterangan}
                    onChange={e => setRecord({ ...record, tanpaKeterangan: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-center font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Ekstrakurikuler */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-slate-800 text-sm uppercase">Kegiatan Ekstrakurikuler</h3>
                <button
                  type="button"
                  onClick={addEskul}
                  className="text-xs bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {record.ekstrakurikuler.map((esk, i) => (
                  <div key={i} className="flex items-center space-x-2 text-xs">
                    <input
                      type="text"
                      value={esk.nama}
                      onChange={e => handleEskulChange(i, 'nama', e.target.value)}
                      placeholder="Nama Ekskul"
                      className="border border-slate-300 rounded-lg px-2 py-1 w-1/3"
                    />
                    <select
                      value={esk.nilai}
                      onChange={e => handleEskulChange(i, 'nilai', e.target.value)}
                      className="border border-slate-300 rounded-lg px-2 py-1 bg-white font-bold"
                    >
                      <option value="A">A (Sangat Baik)</option>
                      <option value="B">B (Baik)</option>
                      <option value="C">C (Cukup)</option>
                    </select>
                    <input
                      type="text"
                      value={esk.keterangan}
                      onChange={e => handleEskulChange(i, 'keterangan', e.target.value)}
                      placeholder="Keterangan"
                      className="border border-slate-300 rounded-lg px-2 py-1 flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeEskul(i)}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Catatan Wali Kelas */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-2">
            <h3 className="font-bold text-slate-800 text-sm uppercase">Catatan Wali Kelas</h3>
            <textarea
              value={record.catatanWaliKelas}
              onChange={e => setRecord({ ...record, catatanWaliKelas: e.target.value })}
              rows={3}
              placeholder="Catatan perkembangan dan motivasi belajar dari wali kelas..."
              className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 transition cursor-pointer"
            >
              <Save className="w-5 h-5" />
              <span>Simpan Catatan Nilai</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
