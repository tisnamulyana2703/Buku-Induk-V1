import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  defaultSubjects,
  initialAcademicYear,
  initialSchoolData,
  initialSemesterRecords,
  initialStudents
} from '../data/initialData';
import {
  AcademicYearData,
  ActiveView,
  AssessmentMode,
  SchoolData,
  StudentDetail,
  StudentSemesterRecord,
  SubjectGrade,
  SubjectItem
} from '../types';

interface AppContextType {
  schoolData: SchoolData;
  setSchoolData: React.Dispatch<React.SetStateAction<SchoolData>>;
  academicYear: AcademicYearData;
  setAcademicYear: React.Dispatch<React.SetStateAction<AcademicYearData>>;
  students: StudentDetail[];
  setStudents: React.Dispatch<React.SetStateAction<StudentDetail[]>>;
  semesterRecords: StudentSemesterRecord[];
  setSemesterRecords: React.Dispatch<React.SetStateAction<StudentSemesterRecord[]>>;
  
  subjects: SubjectItem[];
  setSubjects: React.Dispatch<React.SetStateAction<SubjectItem[]>>;
  addSubject: (subject: SubjectItem) => void;
  updateSubject: (oldCode: string, updatedSubject: SubjectItem) => void;
  deleteSubject: (code: string) => void;
  duplicateSubject: (code: string) => void;

  assessmentMode: AssessmentMode;
  setAssessmentMode: (mode: AssessmentMode) => void;
  
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  // Selected state for student modal or print view
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
  
  selectedClass: number; // 1 to 6
  setSelectedClass: (c: number) => void;
  selectedSemester: 1 | 2;
  setSelectedSemester: (s: 1 | 2) => void;

  // Helpers
  addStudent: (student: Omit<StudentDetail, 'id'>) => void;
  updateStudent: (student: StudentDetail) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => StudentDetail | undefined;
  getSemesterRecord: (studentId: string, kelas: number, semester: 1 | 2) => StudentSemesterRecord | undefined;
  saveSemesterRecord: (record: StudentSemesterRecord) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'buku_induk_sd_v1.1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schoolData, setSchoolData] = useState<SchoolData>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_school`);
    return saved ? JSON.parse(saved) : initialSchoolData;
  });

  const [academicYear, setAcademicYear] = useState<AcademicYearData>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_academic`);
    return saved ? JSON.parse(saved) : initialAcademicYear;
  });

  const [students, setStudents] = useState<StudentDetail[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_students`);
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [semesterRecords, setSemesterRecords] = useState<StudentSemesterRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_records`);
    return saved ? JSON.parse(saved) : initialSemesterRecords;
  });

  const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_subjects`);
    return saved ? JSON.parse(saved) : defaultSubjects;
  });

  const [assessmentMode, setAssessmentMode] = useState<AssessmentMode>('tanpa');
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(students[0]?.id || null);
  const [selectedClass, setSelectedClass] = useState<number>(1);
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);

  // Auto save to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_school`, JSON.stringify(schoolData));
  }, [schoolData]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_academic`, JSON.stringify(academicYear));
  }, [academicYear]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_records`, JSON.stringify(semesterRecords));
  }, [semesterRecords]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_subjects`, JSON.stringify(subjects));
  }, [subjects]);

  // Keep selected student valid if students change
  useEffect(() => {
    if (!selectedStudentId && students.length > 0) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, selectedStudentId]);

  // Subject management helpers
  const addSubject = (newSub: SubjectItem) => {
    setSubjects(prev => [...prev, newSub]);
  };

  const updateSubject = (oldCode: string, updatedSub: SubjectItem) => {
    setSubjects(prev => prev.map(s => (s.code === oldCode ? updatedSub : s)));
    // Sync semester records if code, name, or KKM changed
    setSemesterRecords(prev =>
      prev.map(rec => ({
        ...rec,
        grades: rec.grades.map(g =>
          g.code === oldCode
            ? {
                ...g,
                code: updatedSub.code,
                namaMataPelajaran: updatedSub.namaMataPelajaran,
                kKM: updatedSub.kKM
              }
            : g
        )
      }))
    );
  };

  const deleteSubject = (code: string) => {
    setSubjects(prev => prev.filter(s => s.code !== code));
    setSemesterRecords(prev =>
      prev.map(rec => ({
        ...rec,
        grades: rec.grades.filter(g => g.code !== code)
      }))
    );
  };

  const duplicateSubject = (code: string) => {
    const target = subjects.find(s => s.code === code);
    if (!target) return;

    let newCode = `${code}_COPY`;
    let counter = 1;
    while (subjects.some(s => s.code === newCode)) {
      counter++;
      newCode = `${code}_COPY${counter}`;
    }

    const newSubject: SubjectItem = {
      ...target,
      code: newCode,
      namaMataPelajaran: `${target.namaMataPelajaran} (Salinan)`
    };

    setSubjects(prev => [...prev, newSubject]);
  };

  const addStudent = (newStudentData: Omit<StudentDetail, 'id'>) => {
    const newId = `std-${Date.now()}`;
    const newStudent: StudentDetail = { ...newStudentData, id: newId };
    setStudents(prev => [...prev, newStudent]);
    setSelectedStudentId(newId);
  };

  const updateStudent = (updatedStudent: StudentDetail) => {
    setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    if (selectedStudentId === id) {
      const remaining = students.filter(s => s.id !== id);
      setSelectedStudentId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const getStudentById = (id: string) => {
    return students.find(s => s.id === id);
  };

  const getSemesterRecord = (studentId: string, kelas: number, semester: 1 | 2): StudentSemesterRecord => {
    const found = semesterRecords.find(
      r => r.studentId === studentId && r.kelas === kelas && r.semester === semester
    );

    const gradeMap = new Map<string, SubjectGrade>();
    if (found) {
      found.grades.forEach(g => gradeMap.set(g.code, g));
    }

    // Always align grades strictly with current active `subjects` list and order!
    const activeGrades: SubjectGrade[] = subjects.map(sub => {
      const existing = gradeMap.get(sub.code);
      if (existing) {
        return {
          ...existing,
          namaMataPelajaran: sub.namaMataPelajaran,
          kKM: sub.kKM
        };
      }
      return {
        code: sub.code,
        namaMataPelajaran: sub.namaMataPelajaran,
        kKM: sub.kKM,
        nilaiPengetahuan: 75,
        nilaiKeterampilan: 75,
        nilaiAkhir: 75,
        predikat: 'B',
        deskripsiCapaian: 'Menunjukkan penguasaan yang baik dalam capaian pembelajaran.'
      };
    });

    if (found) {
      return {
        ...found,
        grades: activeGrades
      };
    }

    return {
      studentId,
      kelas,
      semester,
      tahunAjaran: academicYear.tahunAjaran,
      grades: activeGrades,
      sakit: 0,
      izin: 0,
      tanpaKeterangan: 0,
      ekstrakurikuler: [{ nama: 'Pramuka', nilai: 'A', keterangan: 'Aktif' }],
      catatanWaliKelas: 'Siswa menunjukkan sikap baik dan disiplin dalam mengikuti pembelajaran.'
    };
  };

  const saveSemesterRecord = (record: StudentSemesterRecord) => {
    setSemesterRecords(prev => {
      const index = prev.findIndex(
        r => r.studentId === record.studentId && r.kelas === record.kelas && r.semester === record.semester
      );
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = record;
        return copy;
      } else {
        return [...prev, record];
      }
    });
  };

  const resetAllData = () => {
    setSchoolData(initialSchoolData);
    setAcademicYear(initialAcademicYear);
    setStudents(initialStudents);
    setSemesterRecords(initialSemesterRecords);
    setSubjects(defaultSubjects);
    setSelectedStudentId(initialStudents[0].id);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        schoolData,
        setSchoolData,
        academicYear,
        setAcademicYear,
        students,
        setStudents,
        semesterRecords,
        setSemesterRecords,
        subjects,
        setSubjects,
        addSubject,
        updateSubject,
        deleteSubject,
        duplicateSubject,
        assessmentMode,
        setAssessmentMode,
        activeView,
        setActiveView,
        selectedStudentId,
        setSelectedStudentId,
        selectedClass,
        setSelectedClass,
        selectedSemester,
        setSelectedSemester,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentById,
        getSemesterRecord,
        saveSemesterRecord,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
