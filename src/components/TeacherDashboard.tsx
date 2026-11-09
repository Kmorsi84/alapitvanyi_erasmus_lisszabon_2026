import { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  RefreshCw,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  LogOut,
  ChevronRight,
  Award,
  BookOpen,
} from 'lucide-react';
import { fetchTeacherStudentSummaries, TeacherStudentSummary } from '../lib/erasmusService';

interface TeacherDashboardProps {
  onLogout: () => void;
  onReturnToGame: () => void;
}

type SortField = 'name' | 'class' | 'profession' | 'totalPoints' | 'completion';
type SortOrder = 'asc' | 'desc';

export function TeacherDashboard({ onLogout, onReturnToGame }: TeacherDashboardProps) {
  const [students, setStudents] = useState<TeacherStudentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedProfession, setSelectedProfession] = useState<string>('ALL');

  // Sorting
  const [sortField, setSortField] = useState<SortField>('totalPoints');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { summaries, error } = await fetchTeacherStudentSummaries();
      if (error) {
        setErrorMessage(`Hiba a tanulók betöltésekor: ${error}`);
      } else {
        setStudents(summaries);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ismeretlen hiba';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Distinct classes and professions for dropdown filters
  const uniqueClasses = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.class_name) set.add(s.class_name);
    });
    return Array.from(set).sort();
  }, [students]);

  const uniqueProfessions = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.profession) set.add(s.profession);
    });
    return Array.from(set).sort();
  }, [students]);

  // Filtered & Sorted student list
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchesSearch =
          s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.class_name && s.class_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (s.profession && s.profession.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesClass = selectedClass === 'ALL' || s.class_name === selectedClass;
        const matchesProfession =
          selectedProfession === 'ALL' || s.profession === selectedProfession;

        return matchesSearch && matchesClass && matchesProfession;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortField === 'name') {
          diff = a.full_name.localeCompare(b.full_name, 'hu');
        } else if (sortField === 'class') {
          diff = (a.class_name || '').localeCompare(b.class_name || '', 'hu');
        } else if (sortField === 'profession') {
          diff = (a.profession || '').localeCompare(b.profession || '', 'hu');
        } else if (sortField === 'totalPoints') {
          diff = a.totalPoints - b.totalPoints;
        } else if (sortField === 'completion') {
          diff = a.completedMissionsCount - b.completedMissionsCount;
        }
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [students, searchQuery, selectedClass, selectedProfession, sortField, sortOrder]);

  const handleToggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'name' ? 'asc' : 'desc');
    }
  };

  // Export to CSV function
  const handleExportCsv = () => {
    if (filteredStudents.length === 0) return;

    const headers = [
      'Név',
      'Osztály',
      'Szakma',
      'M1_Szókincs (max 20)',
      'M2_Piac (max 30)',
      'M3_Étlap (max 30)',
      'M4_Felszolgálás (max 50)',
      'M5_Szakértő (max 20)',
      'Összpontszám (max 150)',
      'Teljesített Küldetések (db/5)',
      'Állapot',
    ];

    const rows = filteredStudents.map((s) => [
      `"${s.full_name.replace(/"/g, '""')}"`,
      `"${(s.class_name || '').replace(/"/g, '""')}"`,
      `"${(s.profession || '').replace(/"/g, '""')}"`,
      s.results[1]?.points || 0,
      s.results[2]?.points || 0,
      s.results[3]?.points || 0,
      s.results[4]?.points || 0,
      s.results[5]?.points || 0,
      s.totalPoints,
      s.completedMissionsCount,
      s.completedMissionsCount === 5 ? 'Teljesítve (Oklevél)' : 'Folyamatban',
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Erasmus_Lisszabon_Eredmenyek_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Aggregated Statistics
  const stats = useMemo(() => {
    const total = students.length;
    if (total === 0) return { total: 0, completedAll: 0, avgPoints: 0, activeToday: 0 };
    const completedAll = students.filter((s) => s.completedMissionsCount === 5).length;
    const avgPoints = Math.round(
      students.reduce((acc, s) => acc + s.totalPoints, 0) / (total || 1)
    );
    return {
      total,
      completedAll,
      avgPoints,
    };
  }, [students]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-900 text-amber-300 flex items-center justify-center font-bold text-xl shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-blue-800 tracking-wider">
                  Erasmus+ Lisszabon 2026
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Tanári Adminisztráció
                </span>
              </div>
              <h1 className="font-serif-lisbon font-bold text-xl sm:text-2xl text-blue-950">
                Tanulói Eredménykövető & Értékelő Felület
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Adatok frissítése"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Frissítés</span>
            </button>

            <button
              onClick={handleExportCsv}
              disabled={filteredStudents.length === 0}
              className="px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              title="Eredmények letöltése Excel/CSV formátumban"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV Export</span>
            </button>

            <button
              onClick={onReturnToGame}
              className="px-3 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>Vissza a Játékhoz</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Kijelentkezés a tanári fiókból"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Kijelentkezés</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/60">
            <span className="text-[11px] font-semibold text-blue-800 block">Összes Tanuló</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-blue-950">
              {stats.total} fő
            </span>
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/60">
            <span className="text-[11px] font-semibold text-emerald-800 block">
              Mind az 5 Küldetést Kész
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-950">
              {stats.completedAll} fő
            </span>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60">
            <span className="text-[11px] font-semibold text-amber-800 block">
              Átlagos Pontszám
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-amber-950">
              {stats.avgPoints} <span className="text-xs font-normal text-slate-500">/ 150</span>
            </span>
          </div>

          <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200/60">
            <span className="text-[11px] font-semibold text-purple-800 block">
              Megjelenítve most
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-purple-950">
              {filteredStudents.length} fő
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Keresés névre, osztályra vagy szakmára..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-800 cursor-pointer"
            >
              <option value="ALL">Minden Osztály</option>
              {uniqueClasses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Profession Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-800 cursor-pointer"
            >
              <option value="ALL">Minden Szakma</option>
              {uniqueProfessions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm">
          {errorMessage}
        </div>
      )}

      {/* Main Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th
                  onClick={() => handleToggleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Tanuló Neve</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('class')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Osztály</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('profession')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Szakma</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-2 text-center" title="Mission 1: Ételek szókincse (max 20)">
                  M1 (20)
                </th>
                <th className="py-3 px-2 text-center" title="Mission 2: Piac alapanyagok (max 30)">
                  M2 (30)
                </th>
                <th className="py-3 px-2 text-center" title="Mission 3: Étlap & allergének (max 30)">
                  M3 (30)
                </th>
                <th className="py-3 px-2 text-center" title="Mission 4: Felszolgálás & szituációk (max 50)">
                  M4 (50)
                </th>
                <th className="py-3 px-2 text-center" title="Mission 5: Szakértő teszt (max 20)">
                  M5 (20)
                </th>
                <th
                  onClick={() => handleToggleSort('totalPoints')}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Összpont</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('completion')}
                  className="py-3 px-4 text-center cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Státusz</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-blue-900" />
                      <span>Tanulói adatok lekérése a Supabase adatbázisból...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <p className="font-semibold text-slate-700">Nem található tanuló a megadott szűrési feltételekkel.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {students.length === 0
                        ? 'Az erasmus_students tábla még nem tartalmaz sorokat, vagy a tanulók még nem jelentkeztek be.'
                        : 'Próbáld meg törölni a keresőszót vagy módosítani a szűrőket.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const m1 = student.results[1];
                  const m2 = student.results[2];
                  const m3 = student.results[3];
                  const m4 = student.results[4];
                  const m5 = student.results[5];

                  const isComplete = student.completedMissionsCount === 5;

                  return (
                    <tr key={student.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-blue-950 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{student.full_name}</span>
                          {isComplete && (
                            <span title="Minden küldetés kész! Oklevél elérhető.">
                              <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono text-[11px]">
                          {student.class_name || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {student.profession || '—'}
                      </td>
                      {/* Mission 1 (max 20) */}
                      <td className="py-3 px-2 text-center font-mono">
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            m1?.completed
                              ? 'bg-emerald-50 text-emerald-800 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          {m1?.points ?? 0}
                        </span>
                      </td>
                      {/* Mission 2 (max 30) */}
                      <td className="py-3 px-2 text-center font-mono">
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            m2?.completed
                              ? 'bg-emerald-50 text-emerald-800 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          {m2?.points ?? 0}
                        </span>
                      </td>
                      {/* Mission 3 (max 30) */}
                      <td className="py-3 px-2 text-center font-mono">
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            m3?.completed
                              ? 'bg-emerald-50 text-emerald-800 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          {m3?.points ?? 0}
                        </span>
                      </td>
                      {/* Mission 4 (max 50) */}
                      <td className="py-3 px-2 text-center font-mono">
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            m4?.completed
                              ? 'bg-emerald-50 text-emerald-800 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          {m4?.points ?? 0}
                        </span>
                      </td>
                      {/* Mission 5 (max 20) */}
                      <td className="py-3 px-2 text-center font-mono">
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            m5?.completed
                              ? 'bg-emerald-50 text-emerald-800 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          {m5?.points ?? 0}
                        </span>
                      </td>
                      {/* Total Points */}
                      <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-md ${
                            student.totalPoints >= 120
                              ? 'bg-amber-100 text-amber-900'
                              : student.totalPoints > 0
                              ? 'bg-blue-50 text-blue-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {student.totalPoints} / 150
                        </span>
                      </td>
                      {/* Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {isComplete ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Kész (5/5)
                          </span>
                        ) : student.completedMissionsCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800">
                            <Clock className="w-3 h-3 text-blue-600" />
                            {student.completedMissionsCount}/5 kész
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-slate-500 bg-slate-100">
                            Még nem kezdte el
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
