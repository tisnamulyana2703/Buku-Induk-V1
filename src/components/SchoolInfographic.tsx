import React from 'react';
import { useApp } from '../context/AppContext';

export const SchoolInfographic: React.FC = () => {
  const { students, schoolData, academicYear } = useApp();

  const totalSiswa = students.length;
  const countLaki = students.filter(s => s.jenisKelamin === 'L').length;
  const countPerempuan = students.filter(s => s.jenisKelamin === 'P').length;

  const pctLaki = totalSiswa > 0 ? Math.round((countLaki / totalSiswa) * 100) : 0;
  const pctPerempuan = totalSiswa > 0 ? Math.round((countPerempuan / totalSiswa) * 100) : 0;

  // Status Counts
  const countAktif = students.filter(s => s.statusSiswa === 'Aktif').length;
  const countLulus = students.filter(s => s.statusSiswa === 'Lulus').length;
  const countPindah = students.filter(s => s.statusSiswa === 'Pindah').length;
  const countKeluar = students.filter(s => s.statusSiswa === 'Keluar').length;

  // Class distribution (diterimaDiKelas / active class)
  const classDist = [1, 2, 3, 4, 5, 6].map(k => {
    const count = students.filter(s => s.diterimaDiKelas === k).length;
    const pct = totalSiswa > 0 ? Math.round((count / totalSiswa) * 100) : 0;
    return { kelas: k, count, pct };
  });

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-sky-950 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300/60 shadow-2xl space-y-6 font-sans relative overflow-hidden">
      
      {/* Dynamic Glowing Background Effect */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/20 pb-4 gap-3 relative z-10">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              INFOGRAFIS DINAMIK & MEGAH
            </span>
            <span className="text-xs text-sky-300 font-bold">T.A. {academicYear.tahunAjaran}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-white tracking-wide">
            STATISTIK BUKU INDUK SISWA
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            {schoolData.namaSekolah} &bull; NPSN: {schoolData.npsn}
          </p>
        </div>

        <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 shadow-lg text-right">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 leading-none">{totalSiswa}</div>
            <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Total Siswa Terdaftar</div>
          </div>
        </div>
      </div>

      {/* Grid Row 1: Status Siswa Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        
        {/* Siswa Aktif */}
        <div className="bg-emerald-900/60 border border-emerald-400/40 rounded-2xl p-3.5 shadow-lg backdrop-blur-sm transition transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">Aktif</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{countAktif}</div>
          <p className="text-[11px] text-emerald-200/80 font-medium mt-1">Siswa aktif sekolah</p>
        </div>

        {/* Siswa Lulus */}
        <div className="bg-sky-900/60 border border-sky-400/40 rounded-2xl p-3.5 shadow-lg backdrop-blur-sm transition transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-black text-sky-300 uppercase tracking-wider">Lulus</span>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{countLulus}</div>
          <p className="text-[11px] text-sky-200/80 font-medium mt-1">Alumni / Lulusan SD</p>
        </div>

        {/* Siswa Pindah */}
        <div className="bg-amber-900/60 border border-amber-400/40 rounded-2xl p-3.5 shadow-lg backdrop-blur-sm transition transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider">Pindah</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{countPindah}</div>
          <p className="text-[11px] text-amber-200/80 font-medium mt-1">Mutasi keluar sekolah</p>
        </div>

        {/* Siswa Keluar / Putus */}
        <div className="bg-rose-900/60 border border-rose-400/40 rounded-2xl p-3.5 shadow-lg backdrop-blur-sm transition transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-black text-rose-300 uppercase tracking-wider">Keluar / DO</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{countKeluar}</div>
          <p className="text-[11px] text-rose-200/80 font-medium mt-1">Putus sekolah / nonaktif</p>
        </div>

      </div>

      {/* Grid Row 2: Gender Ratio & Class Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative z-10">
        
        {/* Gender Breakdown (5 cols) */}
        <div className="md:col-span-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 mb-3 border-b border-white/10 pb-1.5">
            PROPORSI JENIS KELAMIN
          </h3>

          <div className="space-y-4 my-auto">
            {/* Laki-Laki Bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-sky-300 flex items-center space-x-1">
                  <span>Laki-Laki (L)</span>
                </span>
                <span className="text-white">{countLaki} Siswa ({pctLaki}%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-sky-400/30">
                <div
                  className="bg-gradient-to-r from-sky-500 to-blue-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pctLaki}%` }}
                ></div>
              </div>
            </div>

            {/* Perempuan Bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-pink-300 flex items-center space-x-1">
                  <span>Perempuan (P)</span>
                </span>
                <span className="text-white">{countPerempuan} Siswa ({pctPerempuan}%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-pink-400/30">
                <div
                  className="bg-gradient-to-r from-pink-500 to-rose-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pctPerempuan}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-white/10 text-[11px] text-slate-300 flex justify-between font-semibold">
            <span>Kurikulum: <strong className="text-white">{academicYear.kurikulum}</strong></span>
            <span>Rapor: <strong className="text-white">{academicYear.tanggalRapor}</strong></span>
          </div>
        </div>

        {/* Class Level Distribution (7 cols) */}
        <div className="md:col-span-7 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 mb-3 border-b border-white/10 pb-1.5">
            DISTRIBUSI SISWA PER TINGKAT KELAS
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {classDist.map(item => (
              <div key={item.kelas} className="bg-slate-900/70 border border-white/10 rounded-xl p-2.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-black text-amber-200">KELAS {item.kelas}</span>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-200 font-extrabold px-1.5 py-0.5 rounded">
                    {item.pct}%
                  </span>
                </div>
                <div className="text-lg font-black text-white">{item.count} <span className="text-xs font-normal text-slate-300">Siswa</span></div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(item.pct, 5)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
