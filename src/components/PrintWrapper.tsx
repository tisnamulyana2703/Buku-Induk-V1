import { ArrowLeft, Printer, Search, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface PrintWrapperProps {
  documentTitle: string;
  children: React.ReactNode;
  showStudentPicker?: boolean;
}

export const PrintWrapper: React.FC<PrintWrapperProps> = ({
  documentTitle,
  children,
  showStudentPicker = true
}) => {
  const {
    setActiveView,
    students,
    selectedStudentId,
    setSelectedStudentId,
    getStudentById
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(s =>
    s.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.nisn && s.nisn.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePrint = () => {
    window.print();
  };

  const currentStudent = getStudentById(selectedStudentId || '') || students[0];

  return (
    <div className="min-h-screen bg-slate-700 text-slate-900 flex flex-col">
      {/* Top Controls Toolbar (Hidden when printing) */}
      <header className="print:hidden bg-slate-900 text-white p-3 sm:p-4 sticky top-0 z-50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={() => setActiveView('dashboard')}
            className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-slate-700 transition cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Menu Utama</span>
          </button>
          <div className="border-l border-slate-700 pl-3">
            <h1 className="font-extrabold text-sm sm:text-base text-emerald-400 uppercase tracking-wide">
              {documentTitle}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          {showStudentPicker && currentStudent && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Quick Search Input */}
              <div className="relative min-w-[160px] sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama / NIS..."
                  value={searchQuery}
                  onChange={e => {
                    const val = e.target.value;
                    setSearchQuery(val);
                    const matches = students.filter(s =>
                      s.namaLengkap.toLowerCase().includes(val.toLowerCase()) ||
                      s.nis.toLowerCase().includes(val.toLowerCase())
                    );
                    if (matches.length > 0 && !matches.some(m => m.id === selectedStudentId)) {
                      setSelectedStudentId(matches[0].id);
                    }
                  }}
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-white p-0.5 rounded-full"
                    title="Bersihkan"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Student Dropdown */}
              <div className="flex items-center space-x-1.5">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={currentStudent.id}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[200px] sm:max-w-[260px] truncate"
                >
                  {filteredStudents.length === 0 ? (
                    <option value="" disabled>Siswa tidak ditemukan</option>
                  ) : (
                    filteredStudents.map((s, idx) => (
                      <option key={`${s.id}-${idx}`} value={s.id}>
                        {s.nis} - {s.namaLengkap}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          )}

          <button
            onClick={handlePrint}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 shadow-lg transition cursor-pointer shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Export PDF</span>
          </button>
        </div>
      </header>

      {/* Printable Sheet Canvas Container */}
      <main className="flex-1 p-2 sm:p-8 flex justify-center items-start overflow-y-auto">
        <div className="bg-white text-black p-8 sm:p-12 shadow-2xl rounded-none w-full max-w-[210mm] min-h-[297mm] print:shadow-none print:m-0 print:w-full print:max-w-none print:p-0">
          {children}
        </div>
      </main>

      {/* Embedded CSS for Print Styling */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            font-size: 11pt !important;
          }
          header {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
        }
      `}</style>
    </div>
  );
};
