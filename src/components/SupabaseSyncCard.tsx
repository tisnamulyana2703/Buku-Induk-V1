import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  checkSupabaseConnection,
  syncAllDataToSupabase,
  getAppDataFromSupabase,
  getSupabaseCredentials,
  setCustomSupabaseCredentials,
  clearCustomSupabaseCredentials
} from '../lib/supabase';
import {
  Database,
  CloudUpload,
  CloudDownload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Globe,
  Key,
  Settings,
  Eye,
  EyeOff,
  Save,
  RotateCcw
} from 'lucide-react';

export const SupabaseSyncCard: React.FC = () => {
  const {
    schoolData,
    academicYear,
    students,
    semesterRecords,
    subjects,
    setSchoolData,
    setAcademicYear,
    setStudents,
    setSemesterRecords,
    setSubjects,
    isRealtimeActive,
    isAutoSyncing,
    lastSyncedAt,
    syncError
  } = useApp();

  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [showSqlDetails, setShowSqlDetails] = useState<boolean>(false);

  // Kredensial Form State
  const [inputUrl, setInputUrl] = useState<string>('');
  const [inputKey, setInputKey] = useState<string>('');
  const [showAnonKey, setShowAnonKey] = useState<boolean>(false);
  const [showConfigForm, setShowConfigForm] = useState<boolean>(false);
  const [credSource, setCredSource] = useState<'manual' | 'env' | 'none'>('none');

  useEffect(() => {
    const creds = getSupabaseCredentials();
    setInputUrl(creds.url);
    setInputKey(creds.key);
    setCredSource(creds.source);
    if (!creds.url || !creds.key) {
      setShowConfigForm(true);
    }
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSyncMessage(null);

    if (!inputUrl.trim() || !inputKey.trim()) {
      setSyncMessage({
        type: 'error',
        text: 'Mohon isi URL Supabase dan Anon Key secara lengkap.'
      });
      return;
    }

    setCustomSupabaseCredentials(inputUrl.trim(), inputKey.trim());
    const creds = getSupabaseCredentials();
    setCredSource(creds.source);

    setSyncMessage({
      type: 'success',
      text: 'Kredensial Supabase berhasil disimpan! Memeriksa koneksi...'
    });

    await testConnection();
  };

  const handleResetConfig = async () => {
    clearCustomSupabaseCredentials();
    const creds = getSupabaseCredentials();
    setInputUrl(creds.url);
    setInputKey(creds.key);
    setCredSource(creds.source);
    setSyncMessage({
      type: 'success',
      text: 'Kredensial dikembalikan ke pengaturan default environment.'
    });
    await testConnection();
  };

  const sqlSchema = `-- ==========================================
-- SCRIPT MIGRASI DATABASE SUPABASE LENGKAP
-- Buku Induk Siswa & Rapor Digital SD
-- ==========================================

-- 1. TABEL UTAMA SINKRONISASI JSON APLIKASI (app_store)
CREATE TABLE IF NOT EXISTS public.app_store (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL PROFIL SEKOLAH (school_data)
CREATE TABLE IF NOT EXISTS public.school_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  npsn TEXT UNIQUE NOT NULL,
  nama_sekolah TEXT NOT NULL,
  nss TEXT,
  alamat TEXT,
  kelurahan TEXT,
  kecamatan TEXT,
  kabupaten TEXT,
  provinsi TEXT,
  kode_pos TEXT,
  telepon TEXT,
  email TEXT,
  website TEXT,
  nama_kepala_sekolah TEXT,
  nip_kepala_sekolah TEXT,
  logo_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL PENGATURAN TAHUN AJARAN & KURIKULUM (academic_years)
CREATE TABLE IF NOT EXISTS public.academic_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tahun_ajaran TEXT UNIQUE NOT NULL,
  kurikulum TEXT NOT NULL DEFAULT 'Kurikulum Merdeka',
  semester_aktif INTEGER CHECK (semester_aktif IN (1, 2)) DEFAULT 1,
  tanggal_rapor TEXT,
  rombel_list JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL PENGATURAN ROMBONGAN BELAJAR / KELAS (rombels)
CREATE TABLE IF NOT EXISTS public.rombels (
  nama_rombel TEXT PRIMARY KEY,
  urutan INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL DAFTAR WALI KELAS (wali_kelas)
CREATE TABLE IF NOT EXISTS public.wali_kelas (
  nama_rombel TEXT PRIMARY KEY,
  nama_wali_kelas TEXT NOT NULL,
  nip_wali_kelas TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL MATA PELAJARAN (subjects)
CREATE TABLE IF NOT EXISTS public.subjects (
  code TEXT PRIMARY KEY,
  nama_mata_pelajaran TEXT NOT NULL,
  kkm INTEGER DEFAULT 75,
  kelompok TEXT DEFAULT 'Wajib',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL SISWA (students)
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  nis TEXT UNIQUE NOT NULL,
  nisn TEXT UNIQUE,
  nama_lengkap TEXT NOT NULL,
  nama_panggilan TEXT,
  jenis_kelamin TEXT CHECK (jenis_kelamin IN ('L', 'P')),
  tempat_lahir TEXT,
  tanggal_lahir DATE,
  agama TEXT,
  kewarganegaraan TEXT DEFAULT 'Indonesia',
  anak_ke INTEGER,
  jumlah_saudara_kandung INTEGER DEFAULT 0,
  jumlah_saudara_tiri INTEGER DEFAULT 0,
  jumlah_saudara_angkat INTEGER DEFAULT 0,
  status_anak TEXT DEFAULT 'Kandung',
  bahasa_sehari_hari TEXT,
  alamat_siswa TEXT,
  rt_rw TEXT,
  dusun_desa TEXT,
  kecamatan TEXT,
  kabupaten TEXT,
  tinggal_dengan TEXT,
  jarak_ke_sekolah TEXT,
  transportasi TEXT,
  sekolah_asal TEXT,
  diterima_di_kelas TEXT,
  tanggal_diterima DATE,
  status_siswa TEXT DEFAULT 'Aktif',
  foto_url TEXT,
  parent_data JSONB,
  physical_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL REKAP SEMESTER & NILAI (semester_records)
CREATE TABLE IF NOT EXISTS public.semester_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  kelas TEXT NOT NULL,
  semester INTEGER CHECK (semester IN (1, 2)),
  tahun_ajaran TEXT NOT NULL,
  sakit INTEGER DEFAULT 0,
  izin INTEGER DEFAULT 0,
  tanpa_keterangan INTEGER DEFAULT 0,
  catatan_wali_kelas TEXT,
  grades JSONB,
  ekstrakurikuler JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, kelas, semester, tahun_ajaran)
);

-- ==========================================
-- AKSEBILITAS & RLS (Row Level Security)
-- ==========================================
ALTER TABLE public.app_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rombels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wali_kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semester_records ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses Baca & Tulis Publik
DROP POLICY IF EXISTS "Public app_store" ON public.app_store;
CREATE POLICY "Public app_store" ON public.app_store FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public school_data" ON public.school_data;
CREATE POLICY "Public school_data" ON public.school_data FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public academic_years" ON public.academic_years;
CREATE POLICY "Public academic_years" ON public.academic_years FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public rombels" ON public.rombels;
CREATE POLICY "Public rombels" ON public.rombels FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public wali_kelas" ON public.wali_kelas;
CREATE POLICY "Public wali_kelas" ON public.wali_kelas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public subjects" ON public.subjects;
CREATE POLICY "Public subjects" ON public.subjects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public students" ON public.students;
CREATE POLICY "Public students" ON public.students FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public semester_records" ON public.semester_records;
CREATE POLICY "Public semester_records" ON public.semester_records FOR ALL USING (true) WITH CHECK (true);
`;

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setIsSyncing(true);
    const ok = await checkSupabaseConnection();
    setIsConnected(ok);
    setIsSyncing(false);
  };

  const handlePushToSupabase = async () => {
    setIsSyncing(true);
    setSyncMessage(null);

    const report = await syncAllDataToSupabase(
      schoolData,
      academicYear,
      students,
      semesterRecords,
      subjects
    );

    if (report.success) {
      const savedTables: string[] = [];
      if (report.appStoreSaved) savedTables.push('app_store');
      if (report.relationalSaved.school_data) savedTables.push('school_data');
      if (report.relationalSaved.subjects) savedTables.push('subjects');
      if (report.relationalSaved.students) savedTables.push('students');
      if (report.relationalSaved.semester_records) savedTables.push('semester_records');

      setSyncMessage({
        type: 'success',
        text: `Berhasil disimpan ke Supabase! Tabel terisi: ${savedTables.join(', ')}.`
      });
      setIsConnected(true);
    } else {
      setShowSqlDetails(true);
      setSyncMessage({
        type: 'error',
        text: `Gagal menyimpan ke Supabase: ${report.errors.join(' | ')}. Pastikan skrip SQL di bawah telah dijalankan di SQL Editor Supabase Anda.`
      });
    }
    setIsSyncing(false);
  };

  const handlePullFromSupabase = async () => {
    setIsSyncing(true);
    setSyncMessage(null);

    try {
      const remoteSchool = await getAppDataFromSupabase('school_data');
      const remoteAcademic = await getAppDataFromSupabase('academic_year');
      const remoteStudents = await getAppDataFromSupabase('students');
      const remoteRecords = await getAppDataFromSupabase('semester_records');
      const remoteSubjects = await getAppDataFromSupabase('subjects');

      let updatedCount = 0;
      if (remoteSchool) { setSchoolData(remoteSchool); updatedCount++; }
      if (remoteAcademic) { setAcademicYear(remoteAcademic); updatedCount++; }
      if (remoteStudents) { setStudents(remoteStudents); updatedCount++; }
      if (remoteRecords) { setSemesterRecords(remoteRecords); updatedCount++; }
      if (remoteSubjects) { setSubjects(remoteSubjects); updatedCount++; }

      if (updatedCount > 0) {
        setSyncMessage({
          type: 'success',
          text: `Berhasil mengunduh ${updatedCount} komponen data dari Supabase!`
        });
      } else {
        setSyncMessage({
          type: 'error',
          text: 'Belum ada data tersimpan di Supabase atau tabel app_store belum dibuat.'
        });
      }
    } catch (err: any) {
      setSyncMessage({
        type: 'error',
        text: `Gagal mengunduh dari Supabase: ${err.message}`
      });
    }
    setIsSyncing(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Integrasi Database Supabase</h2>
            <p className="text-xs text-slate-500">
              Koneksi cloud database untuk sinkronisasi data rapor online
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center space-x-2">
          {isConnected === true ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Terhubung ke Supabase</span>
            </span>
          ) : isConnected === false ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Kredensial Siap (Tabel Belum Dibuat)</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Memeriksa koneksi...</span>
            </span>
          )}

          <button
            type="button"
            onClick={testConnection}
            disabled={isSyncing}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
            title="Cek ulang koneksi"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Realtime Auto-Sync Status Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span className="text-xs font-bold text-emerald-900">
                Mode Realtime Aktif & Otomatis Tersinkron
              </span>
            </div>
          </div>

          <div className="text-[11px] font-medium text-emerald-800 flex items-center space-x-2">
            {isAutoSyncing ? (
              <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Menyimpan ke Supabase...</span>
              </span>
            ) : lastSyncedAt ? (
              <span className="text-emerald-700">
                Tersimpan otomatis ({lastSyncedAt.toLocaleTimeString('id-ID')})
              </span>
            ) : (
              <span className="text-emerald-700">Siap sinkron otomatis</span>
            )}
          </div>
        </div>
        <p className="text-[11px] text-emerald-700/90 leading-normal">
          Setiap perubahan data sekolah, mata pelajaran, siswa, dan nilai rapor akan langsung tersimpan secara otomatis ke Supabase secara <strong>Real-Time</strong> tanpa harus menekan tombol simpan.
        </p>
      </div>

      {/* Kredensial Supabase Configuration Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-slate-800">
              Konfigurasi Kredensial Proyek Supabase
            </h3>
            {credSource === 'manual' ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Input Manual
              </span>
            ) : credSource === 'env' ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                .env Variable
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
                Belum Dikonfigurasi
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowConfigForm(!showConfigForm)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
          >
            <span>{showConfigForm ? 'Sembunyikan Form' : 'Ubah Kredensial'}</span>
            <span className="text-[10px]">{showConfigForm ? '▲' : '▼'}</span>
          </button>
        </div>

        {/* Current Active URL display summary */}
        {!showConfigForm && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700 font-sans">Project URL:</span>
            <span className="text-emerald-700 font-bold truncate">
              {inputUrl ? '✓ ' + inputUrl : 'Belum diisi (Klik "Ubah Kredensial")'}
            </span>
          </div>
        )}

        {showConfigForm && (
          <form onSubmit={handleSaveConfig} className="space-y-3 pt-2 border-t border-slate-200">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>Supabase Project URL</span>
              </label>
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://xyz.supabase.co"
                className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white text-slate-900"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                <Key className="w-3.5 h-3.5 text-slate-500" />
                <span>Supabase Anon / API Key</span>
              </label>
              <div className="relative">
                <input
                  type={showAnonKey ? 'text' : 'password'}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full text-xs font-mono pr-10 pl-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white text-slate-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowAnonKey(!showAnonKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showAnonKey ? 'Sembunyikan key' : 'Tampilkan key'}
                >
                  {showAnonKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5 shadow transition cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan & Hubungkan Supabase</span>
              </button>

              {credSource === 'manual' && (
                <button
                  type="button"
                  onClick={handleResetConfig}
                  className="text-slate-600 hover:text-slate-800 font-semibold px-3 py-2 text-xs flex items-center space-x-1 border border-slate-300 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Kredensial</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Sync Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        <button
          type="button"
          onClick={handlePushToSupabase}
          disabled={isSyncing}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow transition cursor-pointer"
        >
          <CloudUpload className="w-4 h-4" />
          <span>Unggah / Simpan Data ke Supabase</span>
        </button>

        <button
          type="button"
          onClick={handlePullFromSupabase}
          disabled={isSyncing}
          className="flex-1 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow transition cursor-pointer"
        >
          <CloudDownload className="w-4 h-4" />
          <span>Muat / Unduh Data dari Supabase</span>
        </button>
      </div>

      {/* Auto Sync Error Notification */}
      {syncError && !syncMessage && (
        <div className="p-3 rounded-xl text-xs font-semibold border flex items-center space-x-2 bg-amber-50 text-amber-900 border-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Auto-sync Supabase: {syncError}</span>
        </div>
      )}

      {/* Sync Notification */}
      {syncMessage && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold border flex items-center space-x-2 ${
            syncMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-900 border-amber-200'
          }`}
        >
          {syncMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>{syncMessage.text}</span>
        </div>
      )}

      {/* SQL Setup Helper Section */}
      <div className="pt-2 border-t border-slate-100">
        <details className="group" open={showSqlDetails} onToggle={(e) => setShowSqlDetails((e.target as HTMLDetailsElement).open)}>
          <summary className="text-xs font-bold text-slate-700 cursor-pointer flex items-center justify-between py-1 hover:text-emerald-700">
            <span className="flex items-center space-x-1.5">
              <span>⚙️</span>
              <span>Langkah Penting: Buat Tabel 'app_store' di Supabase SQL Editor</span>
            </span>
            <span className="text-slate-400 text-[10px] group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-2 space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
              Pesan error <code>Could not find the table 'public.app_store'</code> terjadi karena tabel penyimpanan belum dibuat di database Supabase Anda.
            </p>
            <ol className="text-[11px] text-slate-600 list-decimal list-inside space-y-1 pl-1">
              <li>Buka dashboard Supabase Anda di <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-emerald-600 font-bold underline">https://supabase.com/dashboard</a></li>
              <li>Pilih proyek Supabase Anda (<code>blbemgpkmtfktkxxzknd</code>).</li>
              <li>Pilih menu <strong>SQL Editor</strong> di bilah navigasi sebelah kiri.</li>
              <li>Klik tombol <strong>New query</strong>, lalu tempel (paste) kode SQL di bawah ini.</li>
              <li>Klik tombol <strong>Run</strong> (atau tombol Play hijau) untuk membangkitkan tabel.</li>
            </ol>
            <div className="relative bg-slate-900 text-slate-200 p-3 rounded-xl text-[11px] font-mono overflow-x-auto mt-2">
              <button
                type="button"
                onClick={handleCopySql}
                className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-sans font-bold flex items-center space-x-1 border border-slate-700 cursor-pointer"
              >
                {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSql ? 'Tersalin!' : 'Salin Query SQL'}</span>
              </button>
              <pre className="pr-20">{sqlSchema}</pre>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};
