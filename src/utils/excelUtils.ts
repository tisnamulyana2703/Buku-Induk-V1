import * as XLSX from 'xlsx';
import { StudentDetail } from '../types';

export const EXCEL_COLUMNS = [
  'NIS',
  'NISN',
  'Nama Lengkap',
  'Nama Panggilan',
  'Jenis Kelamin (L/P)',
  'Tempat Lahir',
  'Tanggal Lahir (DD MMMM YYYY)',
  'Agama',
  'Diterima di Kelas',
  'Status Siswa (Aktif/Lulus/Pindah/Keluar)',
  'Nama Ayah',
  'Nama Ibu',
  'No HP Orang Tua',
  'Alamat Siswa'
];

export const downloadExcelTemplate = () => {
  const sampleData = [
    {
      'NIS': '2122010',
      'NISN': '0149982310',
      'Nama Lengkap': 'Budi Santoso Putra',
      'Nama Panggilan': 'Budi',
      'Jenis Kelamin (L/P)': 'L',
      'Tempat Lahir': 'Bandung',
      'Tanggal Lahir (DD MMMM YYYY)': '10 Mei 2015',
      'Agama': 'Islam',
      'Diterima di Kelas': 1,
      'Status Siswa (Aktif/Lulus/Pindah/Keluar)': 'Aktif',
      'Nama Ayah': 'Rahmat Santoso',
      'Nama Ibu': 'Siti Rohmah',
      'No HP Orang Tua': '081234567890',
      'Alamat Siswa': 'Jl. Merdeka No. 100, Bandung'
    },
    {
      'NIS': '2122011',
      'NISN': '0149982311',
      'Nama Lengkap': 'Siti Aminah Lestari',
      'Nama Panggilan': 'Siti',
      'Jenis Kelamin (L/P)': 'P',
      'Tempat Lahir': 'Jakarta',
      'Tanggal Lahir (DD MMMM YYYY)': '15 Agustus 2015',
      'Agama': 'Islam',
      'Diterima di Kelas': 1,
      'Status Siswa (Aktif/Lulus/Pindah/Keluar)': 'Aktif',
      'Nama Ayah': 'Herman Lestari',
      'Nama Ibu': 'Dewi Sartika',
      'No HP Orang Tua': '085712345678',
      'Alamat Siswa': 'Jl. Riau No. 45, Bandung'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData, { header: EXCEL_COLUMNS });
  
  // Set column widths for better readability in Excel
  worksheet['!cols'] = [
    { wch: 12 }, // NIS
    { wch: 15 }, // NISN
    { wch: 28 }, // Nama Lengkap
    { wch: 15 }, // Nama Panggilan
    { wch: 18 }, // Jenis Kelamin
    { wch: 15 }, // Tempat Lahir
    { wch: 25 }, // Tanggal Lahir
    { wch: 12 }, // Agama
    { wch: 16 }, // Diterima di Kelas
    { wch: 25 }, // Status Siswa
    { wch: 22 }, // Nama Ayah
    { wch: 22 }, // Nama Ibu
    { wch: 18 }, // No HP
    { wch: 35 }, // Alamat
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');

  XLSX.writeFile(workbook, 'Template_Import_Siswa_SD.xlsx');
};

export const parseExcelFile = (file: File): Promise<Omit<StudentDetail, 'id'>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawRows || rawRows.length === 0) {
          throw new Error('File Excel kosong atau format tidak sesuai.');
        }

        const parsedStudents: Omit<StudentDetail, 'id'>[] = rawRows.map((row) => {
          const nis = String(row['NIS'] || row['nis'] || '').trim();
          const nisn = String(row['NISN'] || row['nisn'] || '').trim();
          const namaLengkap = String(row['Nama Lengkap'] || row['namaLengkap'] || row['Nama'] || '').trim();

          if (!namaLengkap) return null;

          const jkRaw = String(row['Jenis Kelamin (L/P)'] || row['Jenis Kelamin'] || row['JK'] || 'L').trim().toUpperCase();
          const jenisKelamin = jkRaw.startsWith('P') ? 'P' : 'L';

          const statusRaw = String(row['Status Siswa (Aktif/Lulus/Pindah/Keluar)'] || row['Status Siswa'] || row['Status'] || 'Aktif').trim();
          let statusSiswa: 'Aktif' | 'Lulus' | 'Pindah' | 'Keluar' = 'Aktif';
          
          if (/lulus/i.test(statusRaw)) statusSiswa = 'Lulus';
          else if (/pindah/i.test(statusRaw)) statusSiswa = 'Pindah';
          else if (/keluar|putus|do/i.test(statusRaw)) statusSiswa = 'Keluar';

          const kelasVal = parseInt(String(row['Diterima di Kelas'] || row['Kelas'] || '1'), 10);
          const diterimaDiKelas = isNaN(kelasVal) ? 1 : Math.min(Math.max(kelasVal, 1), 6);

          return {
            nis: nis || `2122${Math.floor(100 + Math.random() * 900)}`,
            nisn: nisn || `014${Math.floor(1000000 + Math.random() * 9000000)}`,
            namaLengkap,
            namaPanggilan: String(row['Nama Panggilan'] || namaLengkap.split(' ')[0] || '').trim(),
            jenisKelamin,
            tempatLahir: String(row['Tempat Lahir'] || 'Bandung').trim(),
            tanggalLahir: String(row['Tanggal Lahir (DD MMMM YYYY)'] || row['Tanggal Lahir'] || '01 Januari 2015').trim(),
            agama: String(row['Agama'] || 'Islam').trim(),
            kewarganegaraan: 'WNI',
            anakKe: 1,
            jumlahSaudaraKandung: 1,
            jumlahSaudaraTiri: 0,
            jumlahSaudaraAngkat: 0,
            statusAnak: 'Kandung',
            bahasaSehariHari: 'Bahasa Indonesia',
            alamatSiswa: String(row['Alamat Siswa'] || row['Alamat'] || 'Bandung').trim(),
            rtRw: '001/001',
            dusunDesa: 'Citarum',
            kecamatan: 'Bandung Wetan',
            kabupaten: 'Kota Bandung',
            tinggalDengan: 'Orang Tua',
            jarakKeSekolah: '1 km',
            transportasi: 'Jalan Kaki',
            sekolahAsal: 'TK/PAUD',
            diterimaDiKelas,
            tanggalDiterima: '12 Juli 2021',
            statusSiswa,
            parentData: {
              namaAyah: String(row['Nama Ayah'] || '-').trim(),
              nikAyah: '-',
              tahunLahirAyah: '1980',
              pendidikanAyah: 'SMA',
              pekerjaanAyah: 'Wiraswasta',
              penghasilanAyah: 'Rp 3.000.000 - Rp 5.000.000',
              namaIbu: String(row['Nama Ibu'] || '-').trim(),
              nikIbu: '-',
              tahunLahirIbu: '1982',
              pendidikanIbu: 'SMA',
              pekerjaanIbu: 'Ibu Rumah Tangga',
              penghasilanIbu: 'Tidak Berpenghasilan',
              alamatOrangTua: String(row['Alamat Siswa'] || 'Bandung').trim(),
              noHpOrangTua: String(row['No HP Orang Tua'] || row['No HP'] || '-').trim()
            },
            physicalData: {
              tinggiBadan: 130,
              beratBadan: 30,
              golonganDarah: 'O',
              pendengaran: 'Baik',
              penglihatan: 'Normal',
              gigi: 'Baik'
            }
          };
        }).filter(Boolean) as Omit<StudentDetail, 'id'>[];

        resolve(parsedStudents);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
