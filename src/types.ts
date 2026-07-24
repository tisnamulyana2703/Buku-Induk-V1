export type Gender = 'L' | 'P'; // Laki-laki | Perempuan

export interface SubjectItem {
  code: string;
  namaMataPelajaran: string;
  kKM: number;
  kelompok?: 'Wajib' | 'Muatan Lokal' | 'Pilihan' | string;
}

export interface SchoolData {
  namaSekolah: string;
  npsn: string;
  nss: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  logoUrl?: string;
}

export interface AcademicYearData {
  tahunAjaran: string; // e.g., "2024/2025"
  kurikulum: 'Kurikulum Merdeka' | 'Kurikulum 2013';
  semesterAktif: 1 | 2;
  tanggalRapor: string;
  waliKelasMap: Record<number, { nama: string; nip: string }>; // Class number (1-6) -> Wali Kelas
}

export interface StudentParentData {
  namaAyah: string;
  nikAyah: string;
  tahunLahirAyah: string;
  pendidikanAyah: string;
  pekerjaanAyah: string;
  penghasilanAyah: string;
  namaIbu: string;
  nikIbu: string;
  tahunLahirIbu: string;
  pendidikanIbu: string;
  pekerjaanIbu: string;
  penghasilanIbu: string;
  namaWali?: string;
  pekerjaanWali?: string;
  alamatOrangTua: string;
  noHpOrangTua: string;
}

export interface StudentPhysicalData {
  tinggiBadan: number; // cm
  beratBadan: number; // kg
  golonganDarah: string;
  pendengaran: string;
  penglihatan: string;
  gigi: string;
  kelainanFisik?: string;
}

export interface StudentDetail {
  id: string;
  nis: string;
  nisn: string;
  namaLengkap: string;
  namaPanggilan: string;
  jenisKelamin: Gender;
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  agama: string;
  kewarganegaraan: string;
  anakKe: number;
  jumlahSaudaraKandung: number;
  jumlahSaudaraTiri: number;
  jumlahSaudaraAngkat: number;
  statusAnak: 'Kandung' | 'Tiri' | 'Angkat';
  bahasaSehariHari: string;
  
  // Alamat & Tempat Tinggal
  alamatSiswa: string;
  rtRw: string;
  dusunDesa: string;
  kecamatan: string;
  kabupaten: string;
  tinggalDengan: 'Orang Tua' | 'Wali' | 'Kos' | 'Lainnya';
  jarakKeSekolah: string;
  transportasi: string;

  // Riwayat
  sekolahAsal: string;
  diterimaDiKelas: number;
  tanggalDiterima: string;
  
  // Foto & Status
  fotoUrl?: string;
  statusSiswa: 'Aktif' | 'Lulus' | 'Pindah' | 'Keluar';
  tahunLulus?: string;
  noIjazah?: string;

  parentData: StudentParentData;
  physicalData: StudentPhysicalData;
}

export interface SubjectGrade {
  code: string;
  namaMataPelajaran: string;
  kKM: number;
  nilaiPengetahuan: number;
  nilaiKeterampilan?: number;
  nilaiAkhir: number;
  predikat: 'A' | 'B' | 'C' | 'D';
  deskripsiCapaian: string;
}

export interface StudentSemesterRecord {
  studentId: string;
  kelas: number; // 1 - 6
  semester: 1 | 2;
  tahunAjaran: string;
  grades: SubjectGrade[];
  sakit: number;
  izin: number;
  tanpaKeterangan: number;
  ekstrakurikuler: { nama: string; nilai: string; keterangan: string }[];
  catatanWaliKelas: string;
}

export type AssessmentMode = 'tanpa' | 'dengan'; // Tanpa Deskripsi | Dengan Deskripsi

export type ActiveView = 
  | 'dashboard'
  | 'data-awal'
  | 'data-sekolah'
  | 'data-siswa'
  | 'data-lengkap-siswa'
  | 'catatan-siswa'
  | 'print-cover'
  | 'print-identitas'
  | 'print-index'
  | 'print-buku-induk-tanpa'
  | 'print-buku-induk-dengan';
