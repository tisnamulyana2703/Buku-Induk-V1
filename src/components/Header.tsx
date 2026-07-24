import { ArrowLeft, Home, Printer, School, UserCheck } from 'lucide-react';
import React from 'react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { setActiveView, schoolData, academicYear, assessmentMode, setAssessmentMode } = useApp();

  return (
    <header className="bg-[#1e3a3f] text-white p-3 sm:p-4 shadow-md sticky top-0 z-30 flex flex-col sm:flex-row items-center justify-between gap-3 border-b-2 border-emerald-500">
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <button
          onClick={() => setActiveView('dashboard')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl font-bold flex items-center space-x-1 transition shadow cursor-pointer text-xs sm:text-sm"
          title="Kembali ke Menu Utama"
        >
          <ArrowLeft className="w-4 h-4" />
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Menu Utama</span>
        </button>

        <div className="border-l border-emerald-700 pl-3">
          <h1 className="font-extrabold text-base sm:text-lg text-emerald-200 uppercase tracking-wide leading-tight">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-xs text-gray-300">{subtitle}</p>
          ) : (
            <p className="text-xs text-emerald-400">
              {schoolData.namaSekolah} &bull; T.A {academicYear.tahunAjaran}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 text-xs w-full sm:w-auto justify-end">
        {/* Assessment Mode Quick Switch */}
        <div className="bg-emerald-950/80 p-1 rounded-xl flex items-center space-x-1 border border-emerald-800">
          <button
            onClick={() => setAssessmentMode('tanpa')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              assessmentMode === 'tanpa'
                ? 'bg-[#70c738] text-white shadow'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Tanpa Deskripsi
          </button>
          <button
            onClick={() => setAssessmentMode('dengan')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              assessmentMode === 'dengan'
                ? 'bg-[#89d0e2] text-[#0f3844] shadow'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Dengan Deskripsi
          </button>
        </div>
      </div>
    </header>
  );
};
