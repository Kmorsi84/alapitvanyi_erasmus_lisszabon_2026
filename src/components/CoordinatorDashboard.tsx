import { useState, useEffect, useMemo, useRef } from 'react';
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
  Printer,
  BarChart3,
  Users,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  PlusCircle,
  Check,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Send,
  Building,
  MapPin,
  Calendar,
  X,
} from 'lucide-react';
import {
  fetchTeacherStudentSummaries,
  TeacherStudentSummary,
  resetStudentSession,
  addStudentByCoordinator,
} from '../lib/erasmusService';

interface CoordinatorDashboardProps {
  onLogout: () => void;
  onReturnToGame: () => void;
}

type TabType = 'overview' | 'students' | 'cards' | 'report';
type SortField = 'name' | 'class' | 'profession' | 'totalPoints' | 'completion';
type SortOrder = 'asc' | 'desc';

export function CoordinatorDashboard({ onLogout, onReturnToGame }: CoordinatorDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [students, setStudents] = useState<TeacherStudentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filters for student table
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedProfession, setSelectedProfession] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Sorting
  const [sortField, setSortField] = useState<SortField>('totalPoints');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Selected student for detail modal
  const [inspectedStudent, setInspectedStudent] = useState<TeacherStudentSummary | null>(null);

  // New Student Form state
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('');
  const [newStudentProfession, setNewStudentProfession] = useState('Szakács');
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  // Resetting session state
  const [resettingId, setResettingId] = useState<string | null>(null);

  const reportPrintRef = useRef<HTMLDivElement>(null);
  const cardsPrintRef = useRef<HTMLDivElement>(null);

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

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Distinct classes and professions for filters
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

        const isComplete = s.completedMissionsCount === 5;
        const matchesStatus =
          selectedStatus === 'ALL' ||
          (selectedStatus === 'COMPLETED' && isComplete) ||
          (selectedStatus === 'IN_PROGRESS' && s.completedMissionsCount > 0 && !isComplete) ||
          (selectedStatus === 'NOT_STARTED' && s.completedMissionsCount === 0);

        return matchesSearch && matchesClass && matchesProfession && matchesStatus;
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
  }, [students, searchQuery, selectedClass, selectedProfession, selectedStatus, sortField, sortOrder]);

  const handleToggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'name' ? 'asc' : 'desc');
    }
  };

  // Reset student device session binding
  const handleResetSession = async (studentId: string, studentName: string) => {
    if (!confirm(`Biztosan feloldod ${studentName} munkamenetét? Ezután a diák új böngészőből vagy telefonról is be tud majd lépni a kódjával.`)) {
      return;
    }

    setResettingId(studentId);
    try {
      const res = await resetStudentSession(studentId);
      if (res.success) {
        showToast(`${studentName} munkamenete sikeresen feloldva.`);
        loadData();
      } else {
        alert(`Nem sikerült a munkamenet feloldása: ${res.error}`);
      }
    } finally {
      setResettingId(null);
    }
  };

  // Add new student
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    setIsAddingStudent(true);
    try {
      const res = await addStudentByCoordinator(newStudentName, newStudentClass, newStudentProfession);
      if (res.success) {
        showToast(`"${newStudentName}" sikeresen hozzáadva a mobilitási listához.`);
        setNewStudentName('');
        setNewStudentClass('');
        setIsAddStudentOpen(false);
        loadData();
      } else {
        alert(`Hiba a diák hozzáadásakor: ${res.error}`);
      }
    } finally {
      setIsAddingStudent(false);
    }
  };

  // Export CSV
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
      'Százalékos Teljesítmény (%)',
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
      Math.round((s.totalPoints / 150) * 100) + '%',
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
      `Erasmus_Lisszabon_Zarojelentes_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Mission Competency Analytics
  const missionAnalytics = useMemo(() => {
    const total = students.length || 1;
    const missions = [
      { id: 1, name: 'Gasztronómiai szókincs & igék', max: 20, sum: 0, completedCount: 0 },
      { id: 2, name: 'Piaci alapanyagok & recepttudás', max: 30, sum: 0, completedCount: 0 },
      { id: 3, name: 'Étlapolvasás & allergénbiztonság', max: 30, sum: 0, completedCount: 0 },
      { id: 4, name: 'Vendégkommunikáció & panaszkezelés B1', max: 50, sum: 0, completedCount: 0 },
      { id: 5, name: 'Vizuális fogás-felismerés & ajánlás', max: 20, sum: 0, completedCount: 0 },
    ];

    students.forEach((s) => {
      missions.forEach((m) => {
        const r = s.results[m.id];
        if (r) {
          m.sum += r.points || 0;
          if (r.completed) m.completedCount++;
        }
      });
    });

    return missions.map((m) => {
      const avg = Math.round((m.sum / total) * 10) / 10;
      const percent = Math.round((avg / m.max) * 100);
      return {
        ...m,
        avg,
        percent,
      };
    });
  }, [students]);

  // Vocational Breakdown
  const professionStats = useMemo(() => {
    const map = new Map<string, { count: number; totalPoints: number; completedAllCount: number }>();

    students.forEach((s) => {
      const prof = s.profession || 'Egyéb szakma';
      const existing = map.get(prof) || { count: 0, totalPoints: 0, completedAllCount: 0 };
      existing.count += 1;
      existing.totalPoints += s.totalPoints;
      if (s.completedMissionsCount === 5) existing.completedAllCount += 1;
      map.set(prof, existing);
    });

    return Array.from(map.entries()).map(([profession, data]) => ({
      profession,
      count: data.count,
      avgPoints: Math.round(data.totalPoints / (data.count || 1)),
      avgPercent: Math.round((data.totalPoints / (data.count * 150 || 1)) * 100),
      completedAll: data.completedAllCount,
    }));
  }, [students]);

  // Overall KPIs
  const kpis = useMemo(() => {
    const total = students.length;
    if (total === 0) return { total: 0, completedAll: 0, avgPoints: 0, readinessRate: 0 };
    const completedAll = students.filter((s) => s.completedMissionsCount === 5).length;
    const avgPoints = Math.round(
      students.reduce((acc, s) => acc + s.totalPoints, 0) / (total || 1)
    );
    const readyStudents = students.filter((s) => s.totalPoints >= 75).length;
    const readinessRate = Math.round((readyStudents / total) * 100);

    return {
      total,
      completedAll,
      avgPoints,
      readinessRate,
    };
  }, [students]);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-400 flex items-center gap-2.5 animate-in slide-in-from-top duration-200 text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Coordinator Banner */}
      <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 text-amber-300 flex items-center justify-center font-bold text-xl shadow-md border border-blue-800 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-bold text-blue-900 tracking-wider">
                  Erasmus+ VET Mobilitás · Lisszabon 2026
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Projektkoordinátori Központ
                </span>
              </div>
              <h1 className="font-serif-lisbon font-bold text-xl sm:text-2xl text-blue-950">
                Gasztronómiai & Vendéglátó Mobilitási Irányítópult
              </h1>
            </div>
          </div>

          {/* Quick Actions */}
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
              onClick={() => window.print()}
              className="px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Aktuális nézet kinyomtatása"
            >
              <Printer className="w-3.5 h-3.5 text-blue-700" />
              <span>Nyomtatás</span>
            </button>

            <button
              onClick={handleExportCsv}
              disabled={filteredStudents.length === 0}
              className="px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              title="Eredmények letöltése Excel/CSV formátumban"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Zárójelentés CSV</span>
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
              title="Kijelentkezés a koordinátori fiókból"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Kilépés</span>
            </button>
          </div>
        </div>

        {/* Coordinator Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 pt-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-blue-900 text-blue-950 bg-blue-50/60'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-blue-700" />
            <span>Mobilitási Elemzés & KPI-k</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'students'
                ? 'border-blue-900 text-blue-950 bg-blue-50/60'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-700" />
            <span>Tanulói Eredménykövető ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'cards'
                ? 'border-blue-900 text-blue-950 bg-blue-50/60'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-600" />
            <span>Belépési Kódkiosztó & Nyomtatás</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'report'
                ? 'border-blue-900 text-blue-950 bg-blue-50/60'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-700" />
            <span>Erasmus+ Zárójelentés & Europass</span>
          </button>
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm">
          {errorMessage}
        </div>
      )}

      {/* =========================================================================
          TAB 1: OVERVIEW & MOBILITY ANALYTICS
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wide">
                Mobilitási Résztvevők
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-blue-950">
                {kpis.total} <span className="text-sm font-normal text-slate-500">fő</span>
              </div>
              <p className="text-[11px] text-slate-500">Nyilvántartásba vett szakképző tanuló</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                Mind az 5 Küldetés Kész
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-950">
                {kpis.completedAll} <span className="text-sm font-normal text-slate-500">fő</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium">
                {kpis.total > 0 ? Math.round((kpis.completedAll / kpis.total) * 100) : 0}% teljesítési arány
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
                Csoportos Átlagpont
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-950">
                {kpis.avgPoints} <span className="text-sm font-normal text-slate-500">/ 150</span>
              </div>
              <p className="text-[11px] text-amber-800 font-medium">
                {Math.round((kpis.avgPoints / 150) * 100)}%-os felkészültségi átlag
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-purple-200 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-purple-800 uppercase tracking-wide">
                Szakmai Felkészültség
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-950">
                {kpis.readinessRate}%
              </div>
              <p className="text-[11px] text-purple-700 font-medium">Min. 50% feletti teljesítmény</p>
            </div>
          </div>

          {/* Mission Competency Deep Dive */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="font-serif-lisbon font-bold text-lg text-blue-950">
                  Szakmai & Nyelvi Kompetenciák Elemzése Küldetésenként
                </h2>
                <p className="text-xs text-slate-500">
                  Az Erasmus+ B1 szakmai angol és lisszaboni vendéglátó gyakorlati felkészültség mutatói
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                Összesített adatok
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {missionAnalytics.map((m) => (
                <div key={m.id} className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-blue-900 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0">
                        M{m.id}
                      </span>
                      <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                        {m.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-500">
                        Átlag: <strong className="text-blue-950 font-mono">{m.avg}</strong> / {m.max} pont
                      </span>
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                        m.percent >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.percent >= 60
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {m.percent}%
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        ({m.completedCount}/{students.length || 0} kész)
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        m.percent >= 80
                          ? 'bg-emerald-600'
                          : m.percent >= 60
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, m.percent)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vocational Profession Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h2 className="font-serif-lisbon font-bold text-lg text-blue-950">
              Szakmai Csoportok Teljesítménye
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {professionStats.map((p) => (
                <div key={p.profession} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {p.profession}
                  </span>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500">Létszám:</span>
                    <strong className="text-blue-950 font-mono">{p.count} fő</strong>
                  </div>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500">Átlagpont:</span>
                    <strong className="text-amber-800 font-mono">{p.avgPoints} / 150</strong>
                  </div>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500">5/5 kész:</span>
                    <strong className="text-emerald-800 font-mono">{p.completedAll} fő</strong>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden mt-1">
                    <div
                      className="bg-blue-800 h-full rounded-full"
                      style={{ width: `${p.avgPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coordinator Pedagogical Advice Notice */}
          <div className="rounded-xl bg-gradient-to-r from-blue-950 to-indigo-950 text-white p-5 border border-blue-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold shrink-0 shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-serif-lisbon font-bold text-base text-amber-300">
                Koordinátori Szakmai Elemzés & Javaslat a Kiutazás Előtt:
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                A 3. Küldetés (Allergénbiztonság) és a 4. Küldetés (Panaszkezelés és rendelésfelvétel) kiemelten fontos a lisszaboni vendéglátóhelyeken.
                Javasolt a 75 pont alatti tanulóknak még a felkészítő héten átismételni az allergén listát és a B1 udvariassági fordulatokat!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: DETAILED STUDENT TABLE & ACTIONS
          ========================================================================= */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          {/* Filter Bar */}
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

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-800 cursor-pointer"
              >
                <option value="ALL">Minden Állapot</option>
                <option value="COMPLETED">5/5 Kész (Oklevél)</option>
                <option value="IN_PROGRESS">Folyamatban</option>
                <option value="NOT_STARTED">Még nem kezdte el</option>
              </select>

              <button
                onClick={() => setIsAddStudentOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>Új Tanuló</span>
              </button>
            </div>
          </div>

          {/* Student Table */}
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
                    <th className="py-3 px-2 text-center" title="M1: Szókincs (max 20)">
                      M1 (20)
                    </th>
                    <th className="py-3 px-2 text-center" title="M2: Piac (max 30)">
                      M2 (30)
                    </th>
                    <th className="py-3 px-2 text-center" title="M3: Étlap (max 30)">
                      M3 (30)
                    </th>
                    <th className="py-3 px-2 text-center" title="M4: Felszolgálás (max 50)">
                      M4 (50)
                    </th>
                    <th className="py-3 px-2 text-center" title="M5: Szakértő (max 20)">
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
                      className="py-3 px-3 text-center cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Státusz</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3 px-3 text-right">Műveletek</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <RefreshCw className="w-5 h-5 animate-spin text-blue-900" />
                          <span>Tanulói adatok lekérése a Supabase adatbázisból...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-500">
                        <p className="font-semibold text-slate-700">Nem található tanuló a megadott szűrési feltételekkel.</p>
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
                          <td className="py-3 px-2 text-center font-mono">
                            <span className={m1?.completed ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                              {m1?.points ?? 0}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center font-mono">
                            <span className={m2?.completed ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                              {m2?.points ?? 0}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center font-mono">
                            <span className={m3?.completed ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                              {m3?.points ?? 0}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center font-mono">
                            <span className={m4?.completed ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                              {m4?.points ?? 0}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center font-mono">
                            <span className={m5?.completed ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                              {m5?.points ?? 0}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap">
                            <span className={student.totalPoints >= 120 ? 'text-amber-700' : 'text-blue-950'}>
                              {student.totalPoints} / 150
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            {isComplete ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                5/5 kész
                              </span>
                            ) : student.completedMissionsCount > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-800">
                                <Clock className="w-3 h-3 text-blue-600" />
                                {student.completedMissionsCount}/5 kész
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Nem kezdte</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setInspectedStudent(student)}
                                className="px-2 py-1 rounded hover:bg-blue-100 text-blue-800 text-[11px] font-medium cursor-pointer"
                                title="Részletes adatlap megtekintése"
                              >
                                Részletek
                              </button>
                              <button
                                onClick={() => handleResetSession(student.id, student.full_name)}
                                disabled={resettingId === student.id}
                                className="px-2 py-1 rounded hover:bg-amber-100 text-amber-800 text-[11px] font-medium cursor-pointer"
                                title="Munkamenet feloldása (új telefon/böngésző esetén)"
                              >
                                {resettingId === student.id ? '...' : 'Reset'}
                              </button>
                            </div>
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
      )}

      {/* =========================================================================
          TAB 3: STUDENT CODE DISTRIBUTION & PRINTABLE ACCESS CARDS
          ========================================================================= */}
      {activeTab === 'cards' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif-lisbon font-bold text-lg text-blue-950">
                Tanulói Belépési Kártyák & Kiosztó Lista
              </h2>
              <p className="text-xs text-slate-500">
                Nyomtasd ki a mobilitási csoportnak a személyre szabott belépési kártyákat a felkészítéshez!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Kártyák Kinyomtatása</span>
              </button>
              <button
                onClick={() => setIsAddStudentOpen(true)}
                className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Új Tanuló</span>
              </button>
            </div>
          </div>

          {/* Printable Cards Grid (Optimized for both screen & print) */}
          <div
            ref={cardsPrintRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-3"
          >
            {students.map((student, idx) => (
              <div
                key={student.id}
                className="rounded-xl border-2 border-blue-900/40 bg-white p-4 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-3 print:break-inside-avoid print:border-blue-950"
              >
                {/* Azulejo micro-stripe */}
                <div className="h-2 -mt-4 -mx-4 mb-2 bg-gradient-to-r from-blue-900 via-amber-400 to-emerald-600" />

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-blue-900 uppercase font-bold tracking-wider">
                    <span>Erasmus+ Lisszabon 2026</span>
                    <span className="font-mono">#{idx + 1}</span>
                  </div>
                  <h3 className="font-serif-lisbon font-bold text-base text-blue-950 leading-tight">
                    {student.full_name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-600 pt-0.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-800 text-[11px]">
                      {student.class_name || '11. évfolyam'}
                    </span>
                    <span className="text-amber-800 italic text-[11px]">
                      {student.profession || 'Vendéglátó szakma'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-blue-50/80 border border-blue-200 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-blue-800 block">
                    Belépési Útmutató Tanulónak:
                  </span>
                  <ol className="list-decimal list-inside text-[11px] text-slate-700 space-y-0.5">
                    <li>Nyisd meg a játék linkjét telefonon vagy gépen</li>
                    <li>Írd be a neved: <strong>{student.full_name}</strong></li>
                    <li>Add meg a tanárod által adott egyedi kódot</li>
                  </ol>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Portuguese Food Quest</span>
                  <span className="font-semibold text-emerald-800">
                    {student.completedMissionsCount === 5 ? '✓ Teljesítve' : `${student.completedMissionsCount}/5 kész`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: ERASMUS+ MOBILITY FINAL REPORT & EUROPASS SUMMARY
          ========================================================================= */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif-lisbon font-bold text-lg text-blue-950">
                Erasmus+ Mobilitási Zárójelentés & Intézményi Összesítő
              </h2>
              <p className="text-xs text-slate-500">
                Hivatalos összefoglaló az Erasmus+ Beneficiary Module zárójelentéshez és Europass tanúsításhoz
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Zárójelentés Nyomtatása</span>
              </button>
              <button
                onClick={handleExportCsv}
                className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV Export</span>
              </button>
            </div>
          </div>

          {/* Official Printable Report Card */}
          <div
            ref={reportPrintRef}
            className="bg-white rounded-2xl border-2 border-blue-900/60 p-6 sm:p-10 shadow-lg space-y-6 print:border-blue-950 print:p-6"
          >
            {/* Header */}
            <div className="border-b-2 border-amber-400 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-amber-800 tracking-widest block">
                  ERASMUS+ VOCATIONAL EDUCATION & TRAINING (VET)
                </span>
                <h1 className="font-serif-lisbon font-bold text-2xl text-blue-950">
                  Mobilitási Nyelvi & Szakmai Eredményességi Jelentés
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  Projekt: <strong>Portuguese Food Quest – Lisszaboni Éttermi Szakmai Kaland (2026)</strong>
                </p>
              </div>
              <div className="text-right text-xs text-slate-500 space-y-0.5">
                <p>Helyszín: <strong>Lisszabon, Portugália</strong></p>
                <p>Nyelvi szint: <strong>CEFR B1 Szakmai Angol</strong></p>
                <p>Kelt: <strong>{new Date().toLocaleDateString('hu-HU')}</strong></p>
              </div>
            </div>

            {/* Narrative summary for Beneficiary Module */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <h3 className="font-bold text-blue-950 uppercase tracking-wide text-xs">
                Összefoglaló a mobilitási záróbeszámolóhoz (Beneficiary Module):
              </h3>
              <p>
                A szakképzési mobilitási csoport összesen <strong>{kpis.total} fő</strong> tanulóval vett részt a lisszaboni gasztronómiai és vendéglátó felkészítő szimulációban.
                A diákok <strong>{kpis.readinessRate}%-a</strong> sikeresen teljesítette a CEFR B1 szintű szakmai követelményeket.
                Mind az 5 interaktív szakmai küldetést (szókincs, piaci beszerzés, étlap és allergének, vendégtéri panaszkezelés és ételajánlás)
                <strong> {kpis.completedAll} fő</strong> fejezte be hibátlanul vagy kiváló minősítéssel, megszerezve a hivatalos <em>Gastronomy Ambassador Certificate</em> oklevelet.
              </p>
              <p>
                A csoportos átlagpontszám <strong>{kpis.avgPoints} / 150 pont ({Math.round((kpis.avgPoints / 150) * 100)}%)</strong>,
                amely bizonyítja a tanulók önálló és magabiztos idegen nyelvi kommunikációját valós portugál éttermi és piaci szituációkban.
              </p>
            </div>

            {/* Mission Breakdown Table in Report */}
            <div className="space-y-2">
              <h3 className="font-serif-lisbon font-bold text-sm text-blue-950">
                Kompetencia Területek Értékelése:
              </h3>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
                    <th className="p-2">Küldetés</th>
                    <th className="p-2">Fejlesztett Szakmai & Nyelvi Kompetencia</th>
                    <th className="p-2 text-center">Max Pont</th>
                    <th className="p-2 text-center">Csoport Átlag</th>
                    <th className="p-2 text-center">Sikeres ráta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {missionAnalytics.map((m) => (
                    <tr key={m.id}>
                      <td className="p-2 font-bold font-mono">Mission {m.id}</td>
                      <td className="p-2 font-medium">{m.name}</td>
                      <td className="p-2 text-center">{m.max}</td>
                      <td className="p-2 text-center font-bold text-blue-900">{m.avg}</td>
                      <td className="p-2 text-center font-bold text-emerald-800">{m.percent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Official Signatures Block */}
            <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
              <div className="space-y-12">
                <div className="border-b border-slate-400 pb-1" />
                <p className="font-semibold text-slate-800">
                  Erasmus+ Intézményi / Projektkoordinátor
                </p>
              </div>
              <div className="space-y-12">
                <div className="border-b border-slate-400 pb-1" />
                <p className="font-semibold text-slate-800">
                  Kísérő Szakmai Oktató / Tanár
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: INSPECT STUDENT DETAILS
          ========================================================================= */}
      {inspectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-blue-200 p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-800">Tanulói Adatlap</span>
                <h3 className="font-serif-lisbon font-bold text-xl text-blue-950">
                  {inspectedStudent.full_name}
                </h3>
                <p className="text-xs text-slate-500">
                  {inspectedStudent.class_name || '—'} · {inspectedStudent.profession || '—'}
                </p>
              </div>
              <button
                onClick={() => setInspectedStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <span className="text-slate-500 block text-[11px]">Összpontszám</span>
                  <span className="text-xl font-bold font-mono text-blue-950">
                    {inspectedStudent.totalPoints} / 150
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-slate-500 block text-[11px]">Teljesítés</span>
                  <span className="text-xl font-bold font-mono text-emerald-950">
                    {inspectedStudent.completedMissionsCount} / 5 küldetés
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="font-bold text-slate-800 block text-xs">Küldetésenkénti Eredmények:</span>
                {[1, 2, 3, 4, 5].map((mNum) => {
                  const res = inspectedStudent.results[mNum];
                  const maxMap = [0, 20, 30, 30, 50, 20];
                  return (
                    <div key={mNum} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs">
                      <span>Küldetés {mNum}</span>
                      <span className="font-mono font-semibold">
                        {res?.points ?? 0} / {maxMap[mNum]} pont {res?.completed ? '✓' : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  handleResetSession(inspectedStudent.id, inspectedStudent.full_name);
                  setInspectedStudent(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold cursor-pointer"
              >
                Munkamenet feloldása (Session Reset)
              </button>
              <button
                onClick={() => setInspectedStudent(null)}
                className="px-4 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer"
              >
                Bezárás
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW STUDENT FORM
          ========================================================================= */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-blue-200 p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif-lisbon font-bold text-lg text-blue-950">
                Új Tanuló Rögzítése
              </h3>
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Tanuló Teljes Neve *</label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="pl. Horváth Máté"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Osztály (opcionális)</label>
                <input
                  type="text"
                  value={newStudentClass}
                  onChange={(e) => setNewStudentClass(e.target.value)}
                  placeholder="pl. 11.A vagy 12.B"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Szakma</label>
                <select
                  value={newStudentProfession}
                  onChange={(e) => setNewStudentProfession(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  <option value="Szakács">Szakács</option>
                  <option value="Cukrász">Cukrász</option>
                  <option value="Vendégtéri szakember (Pincér)">Vendégtéri szakember (Pincér)</option>
                  <option value="Turisztikai technikus">Turisztikai technikus</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  disabled={isAddingStudent}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Mégse
                </button>
                <button
                  type="submit"
                  disabled={isAddingStudent || !newStudentName.trim()}
                  className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isAddingStudent ? 'Mentés...' : 'Tanuló Rögzítése'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
