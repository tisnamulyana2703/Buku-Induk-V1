import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { supabase, checkSupabaseConnection, saveAppDataToSupabase, getAppDataFromSupabase } from '../lib/supabase';
import { Database, CloudUpload, CloudDownload, CheckCircle2, AlertCircle, RefreshCw, Copy, Check } from 'lucide-react';

export const SupabaseSyncCard: React.FC = () => {
  const { schoolData, academicYear, students, semesterRecords, subjects, setSchoolData, setAcademicYear, setStudents, setSemesterRecords, setSubjects } = useApp();

  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [showSqlDetails, setShowSqlDetails] = useState<boolean>(false);

  const sqlSchema = `-- Salin dan jalankan SQL ini di SQL Editor Supabase Anda:

CREATE TABLE IF NOT EXISTS public.app_store (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buka akses RLS (Row Level Security) untuk anon key
ALTER TABLE public.app_store ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Akses publik baca tulis app_store" ON public.app_store
  FOR ALL USING (true) WITH CHECK (true);
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

    const results = await Promise.all([
      saveAppDataToSupabase('school_data', schoolData),
      saveAppDataToSupabase('academic_year', academicYear),
      saveAppDataToSupabase('students', students),
      saveAppDataToSupabase('semester_records', semesterRecords),
      saveAppDataToSupabase('subjects', subjects)
    ]);

    const failed = results.find(r => !r.success);
    if (failed) {
      setShowSqlDetails(true);
      setSyncMessage({
        type: 'error',
        text: `Tabel 'app_store' belum dibuat di Supabase. Silakan jalankan query SQL pada panel di bawah ini di SQL Editor Supabase Anda.`
      });
    } else {
      setSyncMessage({
        type: 'success',
        text: 'Seluruh data sekolah, siswa, nilai, dan mata pelajaran berhasil diunggah ke Supabase!'
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

      {/* URL Project Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1 font-mono">
        <div className="flex justify-between items-center text-slate-600 font-sans">
          <span className="font-bold text-slate-700">Project URL:</span>
          <span className="text-emerald-700 font-bold font-mono">
            {import.meta.env.VITE_SUPABASE_URL ? '✓ ' + import.meta.env.VITE_SUPABASE_URL : 'Belum diisi'}
          </span>
        </div>
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
