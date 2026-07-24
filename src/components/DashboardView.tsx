import React from 'react';
import { useApp } from '../context/AppContext';
import { SchoolInfographic } from './SchoolInfographic';

export const DashboardView: React.FC = () => {
  const {
    assessmentMode,
    setAssessmentMode,
    setActiveView,
    setSelectedClass,
    setSelectedSemester,
    resetAllData,
    students,
    schoolData,
    rombelList
  } = useApp();

  const handleOpenCatatan = (kelas: string | number, semester: 1 | 2) => {
    setSelectedClass(kelas);
    setSelectedSemester(semester);
    setActiveView('catatan-siswa');
  };

  return (
    <div className="min-h-screen bg-[#3a585d] text-gray-900 p-2 sm:p-4 lg:p-6 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Background Decorative Wavy Board Frame */}
      <div className="absolute inset-2 border-4 border-[#e8d5b7] rounded-3xl pointer-events-none opacity-40"></div>
      
      {/* Top Banner & Title Area */}
      <div className="relative z-10 mb-3 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-start mb-1">
          <div className="text-xs text-emerald-200 font-bold px-3 py-1 bg-emerald-900/50 rounded-lg backdrop-blur">
            {schoolData.namaSekolah} | NPSN: {schoolData.npsn}
          </div>
          <div className="bg-[#bfe6ff] text-[#003865] px-3 py-1 rounded-full text-xs font-bold shadow-md border border-white">
            Versi 1.1
          </div>
        </div>

        <div className="text-center py-2">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-wider drop-shadow-[0_3px_3px_rgba(0,0,0,0.6)] font-sans uppercase">
            <span className="text-emerald-300 drop-shadow-[0_2px_0_#000]">APLIKASI BUKU INDUK SISWA</span>
          </h1>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-widest drop-shadow-[0_3px_3px_rgba(0,0,0,0.6)] mt-1 uppercase">
            SEKOLAH DASAR
          </h2>
        </div>
      </div>

      {/* Main 4-Section Menu Grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 my-auto">
        
        {/* COLUMN 1: DATA MASTER (Left - 3 cols) */}
        {/* Note: Swap position of DATA SEKOLAH and DATA AWAL */}
        <div className="md:col-span-3 flex flex-col space-y-3 justify-center">
          <button
            onClick={() => setActiveView('data-sekolah')}
            className="w-full bg-[#fbd0bd] hover:bg-[#f7bc9f] text-[#2b1810] border-2 border-white rounded-2xl py-3 px-4 shadow-lg font-black text-lg tracking-wide transition transform active:scale-95 flex items-center justify-center text-center cursor-pointer"
          >
            DATA SEKOLAH
          </button>

          <button
            onClick={() => setActiveView('data-awal')}
            className="w-full bg-[#fbd0bd] hover:bg-[#f7bc9f] text-[#2b1810] border-2 border-white rounded-2xl py-3 px-4 shadow-lg font-black text-lg tracking-wide transition transform active:scale-95 flex items-center justify-center text-center cursor-pointer"
          >
            DATA AWAL
          </button>

          <button
            onClick={() => setActiveView('data-siswa')}
            className="w-full bg-[#fbd0bd] hover:bg-[#f7bc9f] text-[#2b1810] border-2 border-white rounded-2xl py-3 px-4 shadow-lg font-black text-lg tracking-wide transition transform active:scale-95 flex items-center justify-center text-center cursor-pointer"
          >
            DATA SISWA
          </button>

          <button
            onClick={() => setActiveView('data-lengkap-siswa')}
            className="w-full bg-[#fbd0bd] hover:bg-[#f7bc9f] text-[#2b1810] border-2 border-white rounded-2xl py-3 px-4 shadow-lg font-black text-lg tracking-wide transition transform active:scale-95 flex items-center justify-center text-center cursor-pointer"
          >
            DATA LENGKAP SISWA
          </button>
        </div>

        {/* COLUMN 2: MODE DESKRIPSI (Center Left - 3 cols) */}
        <div className="md:col-span-3 flex flex-col space-y-4 justify-center">
          <button
            onClick={() => setAssessmentMode('tanpa')}
            className={`w-full py-8 px-4 rounded-3xl border-4 transition-all shadow-xl font-extrabold text-xl sm:text-2xl tracking-wide flex items-center justify-center text-center cursor-pointer ${
              assessmentMode === 'tanpa'
                ? 'bg-[#70c738] text-white border-yellow-300 ring-4 ring-yellow-300/50 scale-105'
                : 'bg-[#70c738]/80 hover:bg-[#70c738] text-white border-white'
            }`}
          >
            <div className="flex flex-col items-center">
              <span>TANPA DESKRIPSI</span>
              {assessmentMode === 'tanpa' && (
                <span className="text-xs bg-white text-emerald-800 px-3 py-0.5 rounded-full mt-2 font-bold uppercase shadow">
                  Aktif
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => setAssessmentMode('dengan')}
            className={`w-full py-8 px-4 rounded-3xl border-4 transition-all shadow-xl font-extrabold text-xl sm:text-2xl tracking-wide flex items-center justify-center text-center cursor-pointer ${
              assessmentMode === 'dengan'
                ? 'bg-[#89d0e2] text-[#0f3844] border-yellow-300 ring-4 ring-yellow-300/50 scale-105'
                : 'bg-[#89d0e2]/80 hover:bg-[#89d0e2] text-[#0f3844] border-white'
            }`}
          >
            <div className="flex flex-col items-center">
              <span>DENGAN DESKRIPSI</span>
              {assessmentMode === 'dengan' && (
                <span className="text-xs bg-[#0f3844] text-white px-3 py-0.5 rounded-full mt-2 font-bold uppercase shadow">
                  Aktif
                </span>
              )}
            </div>
          </button>
        </div>

        {/* COLUMN 3: CATATAN SISWA (Center Right - 3 cols) */}
        <div className="md:col-span-3 bg-[#e4eef0]/20 backdrop-blur-md p-2 sm:p-3 rounded-2xl border border-white/30 flex flex-col justify-center">
          <div className="bg-[#fbd0bd] border-2 border-white text-[#2b1810] font-black text-center py-2 px-3 rounded-xl shadow mb-2 text-base sm:text-lg">
            CATATAN SISWA
          </div>

          <div className="bg-white/95 rounded-xl p-2 shadow-inner">
            <div className="grid grid-cols-12 gap-1 mb-1 font-black text-xs sm:text-sm text-center text-gray-800">
              <div className="col-span-6 bg-black text-white py-1 rounded">KELAS</div>
              <div className="col-span-6 bg-[#fff6a2] text-gray-900 py-1 rounded">SEMESTER</div>
            </div>

            <div className="space-y-1.5 max-h-[290px] overflow-y-auto pr-1">
              {rombelList.map(kelasKey => (
                <div key={kelasKey} className="grid grid-cols-12 gap-1.5 items-center">
                  <button
                    onClick={() => handleOpenCatatan(kelasKey, 1)}
                    className="col-span-6 bg-[#89e051] hover:bg-[#72cc3a] text-gray-900 font-black py-1.5 px-2 rounded-lg text-center text-xs sm:text-sm shadow transition border border-emerald-600 truncate cursor-pointer"
                    title={`Buka Catatan Kelas ${kelasKey}`}
                  >
                    KELAS {kelasKey}
                  </button>
                  <button
                    onClick={() => handleOpenCatatan(kelasKey, 1)}
                    className="col-span-3 bg-[#fdf8bc] hover:bg-[#fbf192] text-gray-900 font-extrabold py-1.5 rounded-lg text-center text-xs sm:text-sm shadow border border-amber-300 transition cursor-pointer"
                    title={`Semester 1`}
                  >
                    1
                  </button>
                  <button
                    onClick={() => handleOpenCatatan(kelasKey, 2)}
                    className="col-span-3 bg-[#fdf8bc] hover:bg-[#fbf192] text-gray-900 font-extrabold py-1.5 rounded-lg text-center text-xs sm:text-sm shadow border border-amber-300 transition cursor-pointer"
                    title={`Semester 2`}
                  >
                    2
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 4: PRINT OUT (Right - 3 cols) */}
        <div className="md:col-span-3 flex flex-col justify-center space-y-2.5">
          <div className="bg-[#b2e0e6] border-2 border-white text-[#112d32] font-black text-center py-2 px-3 rounded-xl shadow text-base sm:text-lg">
            PRINT OUT
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveView('print-cover')}
                className="bg-[#fbd0bd] hover:bg-[#f7bc9f] text-[#2b1810] border-2 border-white rounded-xl py-3 px-2 shadow font-extrabold text-sm text-center transition active:scale-95 cursor-pointer"
              >
                COVER
              </button>

              <button
                onClick={() => setActiveView('print-buku-induk-tanpa')}
                className="bg-[#89e051] hover:bg-[#72cc3a] text-gray-900 border-2 border-white rounded-xl py-2 px-2 shadow font-bold text-xs leading-tight text-center transition active:scale-95 cursor-pointer"
              >
                BUKU INDUK TANPA DESKRIPSI
              </button>
            </div>

            <button
              onClick={() => setActiveView('print-identitas')}
              className="bg-[#fbd0bd] hover:bg-[#f7bc9f] text-[#2b1810] border-2 border-white rounded-xl py-3 px-3 shadow font-extrabold text-sm text-center transition active:scale-95 cursor-pointer"
            >
              IDENTITAS SISWA
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveView('print-index')}
                className="bg-[#fbd0bd] hover:bg-[#f7bc9f] text-[#2b1810] border-2 border-white rounded-xl py-3 px-2 shadow font-extrabold text-sm text-center transition active:scale-95 cursor-pointer"
              >
                INDEX SISWA
              </button>

              <button
                onClick={() => setActiveView('print-buku-induk-dengan')}
                className="bg-[#b2e0e6] hover:bg-[#9cd4dd] text-[#112d32] border-2 border-white rounded-xl py-2 px-2 shadow font-bold text-xs leading-tight text-center transition active:scale-95 cursor-pointer"
              >
                BUKU INDUK DESKRIPSI
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Area with Infographic */}
      <div className="relative z-10 max-w-7xl mx-auto w-full mt-4 flex flex-col space-y-2">
        <SchoolInfographic />

        <div className="flex justify-between items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 text-white text-xs font-bold">
          <div>Jumlah Siswa Terdaftar: <span className="text-yellow-300">{students.length} Siswa</span></div>
          <div>Mode Aktif: <span className="text-emerald-200 capitalize">{assessmentMode === 'tanpa' ? 'Tanpa Deskripsi' : 'Dengan Deskripsi'}</span></div>
          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin mengembalikan data ke sampel awal?')) {
                resetAllData();
              }
            }}
            className="text-[11px] text-amber-200 underline hover:text-white cursor-pointer"
          >
            Reset Data Sampel
          </button>
        </div>
      </div>
    </div>
  );
};
