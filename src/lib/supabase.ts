import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Safe fallback so createClient never throws on startup if env vars are missing
const validUrl = supabaseUrl && supabaseUrl.startsWith('http') ? supabaseUrl : 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey || 'placeholder';

export const supabase = createClient(validUrl, validKey);

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co');
};

export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    if (!isSupabaseConfigured()) return false;
    const { error } = await supabase.from('app_store').select('key').limit(1);
    if (error && error.code === 'PGRST116') return true;
    return !error || error.code === '42P01';
  } catch {
    return false;
  }
};

export const saveAppDataToSupabase = async (key: string, value: any): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!isSupabaseConfigured()) return { success: false, error: 'Variabel Supabase belum dikonfigurasi.' };
    const { error } = await supabase.from('app_store').upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Terjadi kesalahan saat menyimpan ke Supabase.' };
  }
};

export const getAppDataFromSupabase = async (key: string): Promise<any | null> => {
  try {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.from('app_store').select('value').eq('key', key).single();
    if (error || !data) return null;
    return data.value;
  } catch {
    return null;
  }
};

// Safe date formatter for PostgreSQL DATE columns
const safeDate = (d?: string | null) => {
  if (!d || typeof d !== 'string' || d.trim() === '') return null;
  return d;
};

export interface SyncReport {
  success: boolean;
  appStoreSaved: boolean;
  relationalSaved: {
    school_data?: boolean;
    subjects?: boolean;
    students?: boolean;
    semester_records?: boolean;
  };
  errors: string[];
}

export const syncAllDataToSupabase = async (
  schoolData: any,
  academicYear: string,
  students: any[],
  semesterRecords: any[],
  subjects: any[]
): Promise<SyncReport> => {
  const report: SyncReport = {
    success: false,
    appStoreSaved: false,
    relationalSaved: {},
    errors: []
  };

  if (!isSupabaseConfigured()) {
    report.errors.push('URL Supabase atau Anon Key belum dikonfigurasi.');
    return report;
  }

  // 1. Sync to app_store (Key-Value Store)
  try {
    const appStorePayloads = [
      { key: 'school_data', value: schoolData, updated_at: new Date().toISOString() },
      { key: 'academic_year', value: academicYear, updated_at: new Date().toISOString() },
      { key: 'students', value: students, updated_at: new Date().toISOString() },
      { key: 'semester_records', value: semesterRecords, updated_at: new Date().toISOString() },
      { key: 'subjects', value: subjects, updated_at: new Date().toISOString() }
    ];

    const { error: appStoreErr } = await supabase.from('app_store').upsert(appStorePayloads, { onConflict: 'key' });
    if (appStoreErr) {
      report.errors.push(`Tabel 'app_store': ${appStoreErr.message}`);
    } else {
      report.appStoreSaved = true;
    }
  } catch (err: any) {
    report.errors.push(`Tabel 'app_store': ${err.message || 'Gagal menyimpan ke app_store'}`);
  }

  // 2. Sync to school_data relational table
  if (schoolData) {
    try {
      const payload = {
        npsn: schoolData.npsn || '00000000',
        nama_sekolah: schoolData.namaSekolah || 'Sekolah Dasar',
        nss: schoolData.nss || null,
        alamat: schoolData.alamat || null,
        kelurahan: schoolData.kelurahan || null,
        kecamatan: schoolData.kecamatan || null,
        kabupaten: schoolData.kabupaten || null,
        provinsi: schoolData.provinsi || null,
        kode_pos: schoolData.kodePos || null,
        telepon: schoolData.telepon || null,
        email: schoolData.email || null,
        website: schoolData.website || null,
        nama_kepala_sekolah: schoolData.namaKepalaSekolah || null,
        nip_kepala_sekolah: schoolData.nipKepalaSekolah || null,
        logo_url: schoolData.logoUrl || null,
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase.from('school_data').upsert([payload], { onConflict: 'npsn' });
      if (error) {
        report.errors.push(`Tabel 'school_data': ${error.message}`);
      } else {
        report.relationalSaved.school_data = true;
      }
    } catch (err: any) {
      report.errors.push(`Tabel 'school_data': ${err.message}`);
    }
  }

  // 3. Sync to subjects relational table
  if (Array.isArray(subjects) && subjects.length > 0) {
    try {
      const payload = subjects.map(s => ({
        code: s.code,
        nama_mata_pelajaran: s.namaMataPelajaran,
        kkm: s.kkm || 75,
        kelompok: s.kelompok || 'Wajib'
      }));
      const { error } = await supabase.from('subjects').upsert(payload, { onConflict: 'code' });
      if (error) {
        report.errors.push(`Tabel 'subjects': ${error.message}`);
      } else {
        report.relationalSaved.subjects = true;
      }
    } catch (err: any) {
      report.errors.push(`Tabel 'subjects': ${err.message}`);
    }
  }

  // 4. Sync to students relational table
  if (Array.isArray(students) && students.length > 0) {
    try {
      const payload = students.map(st => ({
        id: st.id,
        nis: st.nis || st.id,
        nisn: st.nisn || null,
        nama_lengkap: st.namaLengkap || 'Tanpa Nama',
        nama_panggilan: st.namaPanggilan || null,
        jenis_kelamin: st.jenisKelamin === 'L' || st.jenisKelamin === 'P' ? st.jenisKelamin : null,
        tempat_lahir: st.tempatLahir || null,
        tanggal_lahir: safeDate(st.tanggalLahir),
        agama: st.agama || null,
        kewarganegaraan: st.kewarganegaraan || 'Indonesia',
        anak_ke: st.anakKe ? Number(st.anakKe) : null,
        jumlah_saudara_kandung: st.jumlahSaudaraKandung ? Number(st.jumlahSaudaraKandung) : 0,
        jumlah_saudara_tiri: st.jumlahSaudaraTiri ? Number(st.jumlahSaudaraTiri) : 0,
        jumlah_saudara_angkat: st.jumlahSaudaraAngkat ? Number(st.jumlahSaudaraAngkat) : 0,
        status_anak: st.statusAnak || 'Kandung',
        bahasa_sehari_hari: st.bahasaSehariHari || null,
        alamat_siswa: st.alamatSiswa || null,
        rt_rw: st.rtRw || null,
        dusun_desa: st.dusunDesa || null,
        kecamatan: st.kecamatan || null,
        kabupaten: st.kabupaten || null,
        tinggal_dengan: st.tinggalDengan || null,
        jarak_ke_sekolah: st.jarakKeSekolah || null,
        transportasi: st.transportasi || null,
        sekolah_asal: st.sekolahAsal || null,
        diterima_di_kelas: st.diterimaDiKelas ? Number(st.diterimaDiKelas) : null,
        tanggal_diterima: safeDate(st.tanggalDiterima),
        status_siswa: st.statusSiswa || 'Aktif',
        foto_url: st.fotoUrl || null,
        parent_data: st.parentData || {},
        physical_data: st.physicalData || {}
      }));
      const { error } = await supabase.from('students').upsert(payload, { onConflict: 'id' });
      if (error) {
        report.errors.push(`Tabel 'students': ${error.message}`);
      } else {
        report.relationalSaved.students = true;
      }
    } catch (err: any) {
      report.errors.push(`Tabel 'students': ${err?.message || String(err)}`);
    }
  }

  // 5. Sync to semester_records relational table
  if (Array.isArray(semesterRecords) && semesterRecords.length > 0) {
    try {
      const payload = semesterRecords.map(rec => ({
        student_id: rec.studentId,
        kelas: Number(rec.kelas),
        semester: Number(rec.semester),
        tahun_ajaran: rec.tahunAjaran,
        sakit: Number(rec.sakit || 0),
        izin: Number(rec.izin || 0),
        tanpa_keterangan: Number(rec.tanpaKeterangan || 0),
        catatan_wali_kelas: rec.catatanWaliKelas || null,
        grades: rec.grades || [],
        ekstrakurikuler: rec.ekstrakurikuler || [],
        updated_at: new Date().toISOString()
      }));
      const { error } = await supabase.from('semester_records').upsert(payload, { onConflict: 'student_id,kelas,semester,tahun_ajaran' });
      if (error) {
        report.errors.push(`Tabel 'semester_records': ${error.message}`);
      } else {
        report.relationalSaved.semester_records = true;
      }
    } catch (err: any) {
      report.errors.push(`Tabel 'semester_records': ${err?.message || String(err)}`);
    }
  }

  report.success = report.appStoreSaved || Object.values(report.relationalSaved).some(Boolean);
  return report;
};



