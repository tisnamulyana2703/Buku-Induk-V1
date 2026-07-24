import React from 'react';
import { PrintWrapper } from './PrintWrapper';
import { useApp } from '../context/AppContext';
import { formatIndonesianDate } from '../utils/dateUtils';

export const PrintBukuIndukTanpa: React.FC = () => {
  const { schoolData, academicYear, getStudentById, selectedStudentId, students, semesterRecords, subjects, rombelList } = useApp();
  const currentStudent = getStudentById(selectedStudentId || '') || students[0];

  if (!currentStudent) return null;

  return (
    <PrintWrapper documentTitle="BUKU INDUK SISWA (TANPA DESKRIPSI / FORMAT ANGKA)">
      <div className="font-sans text-xs space-y-4 text-slate-900">
        
        {/* Header */}
        <div className="border-b-2 border-black pb-2 text-center space-y-0.5">
          <h1 className="font-black text-lg uppercase tracking-wider">{schoolData.namaSekolah}</h1>
          <h2 className="font-bold text-sm uppercase">LEMBAR BUKU INDUK SISWA (NILAI ANGKA & PREDIKAT)</h2>
          <p className="text-[11px] font-semibold text-slate-700">
            Kurikulum: {academicYear.kurikulum} &bull; T.A {academicYear.tahunAjaran}
          </p>
        </div>

        {/* Student Biodata Summary */}
        <div className="grid grid-cols-12 gap-2 border border-black p-2 font-sans text-[11px] bg-slate-50">
          <div className="col-span-6 space-y-1">
            <div><span className="font-bold">Nama Lengkap:</span> <span className="font-extrabold uppercase">{currentStudent.namaLengkap}</span></div>
            <div><span className="font-bold">NIS / NISN:</span> {currentStudent.nis} / {currentStudent.nisn}</div>
            <div><span className="font-bold">Jenis Kelamin:</span> {currentStudent.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
          </div>
          <div className="col-span-6 space-y-1">
            <div><span className="font-bold">Tempat, Tgl Lahir:</span> {currentStudent.tempatLahir}, {formatIndonesianDate(currentStudent.tanggalLahir)}</div>
            <div><span className="font-bold">Nama Orang Tua:</span> {currentStudent.parentData.namaAyah} / {currentStudent.parentData.namaIbu}</div>
            <div><span className="font-bold">Diterima di Kelas:</span> Kelas {currentStudent.diterimaDiKelas}</div>
          </div>
        </div>

        {/* Grade Ledger Table (Dynamic Rombels) */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black text-center font-sans text-[10px]">
            <thead>
              <tr className="bg-slate-200 border-b border-black font-bold uppercase">
                <th rowSpan={2} className="border border-black p-1 w-6">No</th>
                <th rowSpan={2} className="border border-black p-1 text-left w-36">Mata Pelajaran</th>
                {rombelList.map(k => (
                  <th key={k} colSpan={2} className="border border-black p-1">KELAS {k}</th>
                ))}
              </tr>
              <tr className="bg-slate-100 border-b border-black font-bold">
                {rombelList.map(k => (
                  <React.Fragment key={k}>
                    <th className="border border-black p-1 min-w-[28px]">S1</th>
                    <th className="border border-black p-1 min-w-[28px]">S2</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, idx) => (
                <tr key={sub.code} className="border-b border-black">
                  <td className="border border-black p-1 font-bold">{idx + 1}</td>
                  <td className="border border-black p-1 text-left font-semibold">{sub.namaMataPelajaran}</td>
                  
                  {rombelList.map(k => {
                    const recS1 = semesterRecords.find(r => r.studentId === currentStudent.id && String(r.kelas) === String(k) && r.semester === 1);
                    const recS2 = semesterRecords.find(r => r.studentId === currentStudent.id && String(r.kelas) === String(k) && r.semester === 2);
                    
                    const scoreS1 = recS1?.grades.find(g => g.code === sub.code)?.nilaiAkhir;
                    const scoreS2 = recS2?.grades.find(g => g.code === sub.code)?.nilaiAkhir;

                    return (
                      <React.Fragment key={k}>
                        <td className="border border-black p-1 font-bold text-slate-900">
                          {scoreS1 ?? '-'}
                        </td>
                        <td className="border border-black p-1 font-bold text-slate-900">
                          {scoreS2 ?? '-'}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Signatures */}
        <div className="flex justify-between pt-6 font-sans text-xs">
          <div className="text-center w-64">
            <p className="font-normal leading-tight">Mengetahui,</p>
            <p className="font-bold leading-tight uppercase">Kepala Sekolah {schoolData.namaSekolah}</p>
            <div className="h-20"></div> {/* Clear space for signature & official stamp */}
            <p className="font-black underline uppercase text-sm">{schoolData.namaKepalaSekolah}</p>
            <p className="text-[11px] font-bold text-slate-700">NIP. {schoolData.nipKepalaSekolah}</p>
          </div>

          <div className="text-center w-64">
            <p className="font-normal leading-tight">{schoolData.kabupaten}, {academicYear.tanggalRapor}</p>
            <p className="font-bold leading-tight uppercase">Petugas Buku Induk</p>
            <div className="h-20"></div> {/* Clear space for signature */}
            <p className="font-black underline uppercase text-sm">_______________________</p>
            <p className="text-[11px] font-bold text-slate-700">NIP. .....................................</p>
          </div>
        </div>

      </div>
    </PrintWrapper>
  );
};
