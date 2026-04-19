"use client"

import { useState, useEffect, useRef } from "react"
import {
  Plus, RefreshCw, Trash2, Edit2, X,
  Wallet, Users, TrendingUp, Calendar,
  Tag, CreditCard, UserCircle, UsersRound,
  Sparkles, Activity, Check, Sun, Moon,
  EyeOff, Eye, RotateCcw, Archive,
  ChevronDown, ChevronUp, Settings, Palette,
  ArrowLeft, Building2, GraduationCap, BookOpen,
  Clock, Grid3X3, Printer, LogOut,
  School, UserCog, BookMarked, PersonStanding,
  LayoutGrid, FileText, ChevronRight, ChevronLeft,
  Save, Trash, Search, Filter, MoreVertical,
  MapPin, Phone, Mail, Image as ImageIcon,
  Menu, ClipboardList
} from "lucide-react"

// =============================================================================
// SWEETALERT2 HELPERS
// =============================================================================
const getSwal = async () => {
  const { default: Swal } = await import("sweetalert2")
  return Swal
}

const getSwalBase = () => {
  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains("dark")
  return isDarkMode
    ? {
        background: "#13132a", color: "#eeeef8", confirmButtonColor: "#6366f1",
        cancelButtonColor: "transparent", scrollbarPadding: false, heightAuto: false,
        customClass: {
          popup: "swal2-ent swal2-ent-dark", title: "swal2-ent-title", htmlContainer: "swal2-ent-html",
          confirmButton: "swal2-ent-confirm", cancelButton: "swal2-ent-cancel", actions: "swal2-ent-actions",
        },
      }
    : {
        background: "#ffffff", color: "#18182e", confirmButtonColor: "#6366f1",
        cancelButtonColor: "transparent", scrollbarPadding: false, heightAuto: false,
        customClass: {
          popup: "swal2-ent swal2-ent-light", title: "swal2-ent-title-light", htmlContainer: "swal2-ent-html-light",
          confirmButton: "swal2-ent-confirm", cancelButton: "swal2-ent-cancel-light", actions: "swal2-ent-actions",
        },
      }
}

// =============================================================================
// MINIMAL CSS (WITH PRINT STYLES & SWEETALERT CUSTOMIZATIONS)
// =============================================================================
const minimalCss = `
  @keyframes fadeUp { from { opacity:0; transform: translateY(14px); } to { opacity:1; transform: translateY(0); } }
  @keyframes fadeInBg  { from { opacity:0; } to { opacity:1; } }
  @keyframes slideUpModal { from { opacity:0; transform: translateY(20px) translateZ(0); } to { opacity:1; transform: translateY(0) translateZ(0); } }
  @keyframes slideUpModalMobile { from { opacity:0; transform: translateY(100%) translateZ(0); } to { opacity:1; transform: translateY(0) translateZ(0); } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .modal-anim    { animation: slideUpModal .25s cubic-bezier(.22,1,.36,1) both; will-change: transform, opacity; transform: translateZ(0); }
  .modal-anim-mobile { animation: slideUpModalMobile .28s cubic-bezier(.22,1,.36,1) both; will-change: transform, opacity; transform: translateZ(0); }
  .backdrop-anim { animation: fadeInBg .2s ease both; }
  
  input[type="date"]::-webkit-calendar-picker-indicator, input[type="time"]::-webkit-calendar-picker-indicator { filter:invert(.45); cursor:pointer; }
  .dark input[type="date"]::-webkit-calendar-picker-indicator, .dark input[type="time"]::-webkit-calendar-picker-indicator { filter:invert(.7); }

  .swal2-ent { border-radius:20px !important; box-shadow:0 32px 80px rgba(0,0,0,.35) !important; font-family:'Kanit',sans-serif !important; width: min(420px, calc(100vw - 24px)) !important; padding: 24px 20px !important; }
  .swal2-ent.swal2-ent-dark  { background:#13132a !important; border:1px solid rgba(255,255,255,.1) !important; }
  .swal2-ent.swal2-ent-light { background:#ffffff !important; border:1px solid rgba(0,0,0,.09) !important; box-shadow:0 16px 60px rgba(0,0,0,.12) !important; }
  .swal2-ent-title { color:#eeeef8 !important; font-family:'Kanit',sans-serif !important; font-size:clamp(16px,4vw,20px) !important; font-weight:600 !important; }
  .swal2-ent-title-light { color:#18182e !important; font-family:'Kanit',sans-serif !important; font-size:clamp(16px,4vw,20px) !important; font-weight:600 !important; }
  .swal2-ent-html { color:#8888aa !important; font-family:'Kanit',sans-serif !important; font-size:clamp(13px,3.5vw,15px) !important; margin-top: 8px !important;}
  .swal2-ent-html-light { color:#55557a !important; font-family:'Kanit',sans-serif !important; font-size:clamp(13px,3.5vw,15px) !important; margin-top: 8px !important;}
  .swal2-ent-actions { gap:12px !important; flex-wrap:wrap !important; margin-top: 24px !important; }
  .swal2-ent-confirm { border-radius:10px !important; font-family:'Kanit',sans-serif !important; font-size:clamp(13px,3.5vw,14px) !important; font-weight:600 !important; padding:10px 24px !important; box-shadow:0 4px 14px rgba(99,102,241,.35) !important; }
  .swal2-ent-cancel { border-radius:10px !important; font-family:'Kanit',sans-serif !important; font-size:clamp(13px,3.5vw,14px) !important; font-weight:500 !important; padding:10px 24px !important; border:1px solid rgba(255,255,255,.1) !important; color:#8888aa !important; background:rgba(255,255,255,.04) !important; }
  .swal2-ent-cancel:hover { background:rgba(255,255,255,.08) !important; color:#eeeef8 !important; }
  .swal2-ent-cancel-light { border-radius:10px !important; font-family:'Kanit',sans-serif !important; font-size:clamp(13px,3.5vw,14px) !important; font-weight:500 !important; padding:10px 24px !important; border:1px solid rgba(0,0,0,.1) !important; color:#55557a !important; background:rgba(0,0,0,.03) !important; }
  .swal2-ent-cancel-light:hover { background:rgba(0,0,0,.07) !important; color:#18182e !important; }

  @media (max-width:480px) {
    .swal2-popup { margin: 0 12px !important; }
    .swal2-ent { padding:20px !important; }
    .swal2-icon { transform: scale(0.85); margin:0 auto 12px !important; }
    .swal2-ent-actions { width:100% !important; justify-content:stretch !important; }
    .swal2-ent-confirm, .swal2-ent-cancel, .swal2-ent-cancel-light { flex:1 !important; justify-content:center !important; }
  }

  /* Print Styles */
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white !important; color: black !important; margin: 0; padding: 0; }
    main { margin-left: 0 !important; padding: 0 !important; }
    .print-container { width: 100%; max-width: 100%; margin: 0 auto; }
    .print-table { width: 100%; border-collapse: collapse; page-break-inside: avoid; }
    .print-table th, .print-table td { border: 1px solid #000; padding: 8px; text-align: center; }
    .print-table th { background-color: #f3f4f6 !important; -webkit-print-color-adjust: exact; color: #000 !important; }
    .dark .print-table th, .dark .print-table td { border-color: #000; color: #000; }
    ::-webkit-scrollbar { display: none; }
  }
`

// =============================================================================
// SHARED CLASSES
// =============================================================================
const fieldInputCls = "w-full h-10 px-3 rounded-lg text-[13px] outline-none appearance-none font-[inherit] bg-black/[.03] dark:bg-white/[.03] border border-black/[.08] dark:border-white/[.07] text-[#18182e] dark:text-[#eeeef8] focus:border-[#6366f1]/50 focus:bg-[#6366f1]/[.04] focus:ring-2 focus:ring-[#6366f1]/10 transition-all"
const fieldLabelCls = "text-[10px] font-medium tracking-wider uppercase flex items-center gap-1 text-[#9999b8] dark:text-[#55556a] mb-1.5"
const btnPrimaryCls = "h-9 px-5 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] border-0 text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(99,102,241,.3)] hover:-translate-y-px hover:shadow-[0_6px_22px_rgba(99,102,241,.45)] disabled:opacity-60 disabled:cursor-not-allowed transition-all font-[inherit] cursor-pointer"
const btnSecondaryCls = "h-9 px-4 rounded-lg border border-black/[.08] dark:border-white/[.07] bg-transparent text-[#55557a] dark:text-[#8888aa] text-[13px] font-medium cursor-pointer hover:border-black/20 dark:hover:border-white/[.14] hover:text-[#18182e] dark:hover:text-[#eeeef8] hover:bg-black/[.03] dark:hover:bg-white/[.04] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-[inherit]"

// =============================================================================
// UTILS
// =============================================================================
const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => (c == 'x' ? Math.random() * 16 | 0 : (Math.random() * 16 | 0 & 0x3 | 0x8)).toString(16))

const formatThaiDateTime = (dateStr) => {
  if (!dateStr) return '-';
  try { return new Date(dateStr).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }) } catch { return dateStr }
}

const parseTimeValue = (val) => {
  if (!val) return '';
  if (typeof val === 'string' && /^\d{1,2}:\d{2}$/.test(val)) return val;
  if (typeof val === 'string' && val.includes('T')) return val.split('T')[1]?.split(':').slice(0,2).join(':') || '';
  if (val instanceof Date) return `${String(val.getHours()).padStart(2, '0')}:${String(val.getMinutes()).padStart(2, '0')}`;
  return String(val).substring(0, 5);
}

// Helper: ตรวจสอบว่าข้อมูลมีการเปลี่ยนแปลงจริงหรือไม่
const hasDataChanged = (original, updated, fields) => {
  if (!original) return true // ถ้าไม่มี original ถือว่ามีการเปลี่ยนแปลง (กรณีสร้างใหม่)
  return fields.some(field => String(original[field] ?? '') !== String(updated[field] ?? ''))
}

// =============================================================================
// REUSABLE UI COMPONENTS
// =============================================================================
function StatCard({ label, value, sub, accent, children }) {
  return (
    <div className="relative rounded-2xl border border-black/[.08] dark:border-white/[.07] bg-white dark:bg-[#121221] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-black/20 dark:hover:border-white/[.14] group">
      <div className="p-3 sm:p-4 lg:p-5 relative z-10">
        <div className="flex items-start justify-between mb-1.5 sm:mb-2">
          <span className="text-[9px] sm:text-[10px] font-medium tracking-widest uppercase text-[#9999b8] dark:text-[#55556a] leading-tight pr-1 truncate max-w-[70%]">{label}</span>
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-[7px] flex-shrink-0 bg-black/[.04] dark:bg-white/[.05] border border-black/[.06] dark:border-white/[.07] flex items-center justify-center" style={{ color: accent }}>{children}</div>
        </div>
        <div className="text-[18px] sm:text-[22px] lg:text-[26px] font-bold text-[#18182e] dark:text-[#eeeef8] leading-none tracking-tight">{value}</div>
        {sub && <div className="text-[10px] sm:text-[11px] text-[#9999b8] dark:text-[#55556a] mt-1 leading-snug truncate">{sub}</div>}
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: `radial-gradient(ellipse at 80% 20%,${accent}22,transparent 65%)` }} />
    </div>
  )
}

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${active ? 'bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20' : 'text-[#55557a] dark:text-[#8888aa] hover:bg-black/[.03] dark:hover:bg-white/[.03]'}`}>
      <Icon size={18} />
      <span className="text-[13px] font-medium flex-1">{label}</span>
    </button>
  )
}

function Modal({ open, onClose, title, icon: Icon, children, size = "md" }) {
  if (!open) return null;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const sizeClasses = { sm: "sm:max-w-[400px]", md: "sm:max-w-[560px]", lg: "sm:max-w-[720px]", xl: "sm:max-w-[900px]", full: "sm:max-w-[95vw]" };
  
  return (
    <div className="fixed inset-0 z-[9000] flex items-end sm:items-center justify-center sm:p-5 backdrop-anim" style={{ background: "rgba(4,4,14,.75)", backdropFilter: isMobile ? "none" : "blur(8px)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={["w-full bg-white dark:bg-[#111127] border dark:border-white/[.14] border-black/[.1] sm:border rounded-t-[24px] sm:rounded-[18px] border-b-0 sm:border-b shadow-[0_32px_80px_rgba(0,0,0,.55)] max-h-[90dvh] overflow-hidden flex flex-col relative", isMobile ? "modal-anim-mobile" : "modal-anim", "border-t-2 border-t-[rgba(99,102,241,.55)]", sizeClasses[size]].join(" ")}>
        <div className="absolute top-0 left-0 right-0 h-1.5 flex justify-center pt-2.5 sm:hidden z-20 pointer-events-none"><div className="w-10 h-1.5 rounded-full bg-black/15 dark:bg-white/15" /></div>
        <div className="sticky top-0 z-10 px-4 sm:px-5 pt-6 pb-3 sm:py-3.5 border-b border-black/[.07] dark:border-white/[.07] flex items-center justify-between bg-white/90 dark:bg-[#111127]/90 backdrop-blur-md rounded-t-[24px] sm:rounded-none">
          <div className="flex items-center gap-2.5">
            {Icon && <div className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center bg-[rgba(99,102,241,.12)] border border-[rgba(99,102,241,.22)] text-[#6366f1]"><Icon size={14} /></div>}
            <span className="text-[14px] font-semibold text-[#18182e] dark:text-[#eeeef8]">{title}</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg border border-black/[.08] dark:border-white/[.07] bg-transparent text-[#9999b8] dark:text-[#55556a] flex items-center justify-center hover:border-black/20 dark:hover:border-white/[.14] hover:text-[#18182e] dark:hover:text-[#eeeef8] transition-all"><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}

function Badge({ children, type = "default" }) {
  const typeStyles = {
    default: { bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.3)", text: "#6366f1" },
    success: { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", text: "#059669" },
    warning: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", text: "#d97706" },
    error: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.3)", text: "#ef4444" },
    info: { bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)", text: "#3b82f6" }
  };
  const style = typeStyles[type] || typeStyles.default;
  return <span className="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold border" style={{ background: style.bg, borderColor: style.border, color: style.text }}>{children}</span>
}

function LoadingOverlay({ show, text = "กำลังโหลดข้อมูลระบบ..." }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f8fafc] dark:bg-[#0a0a10]">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border-2 border-[#6366f1]/30 border-t-[#6366f1] animate-spin mx-auto mb-4" />
        <p className="text-[14px] text-[#9999b8] dark:text-[#55556a] tracking-widest uppercase">{text}</p>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================
export default function SchoolTimetableSystem() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [initialLoad, setInitialLoad] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  
  // Data States
  const [schoolInfo, setSchoolInfo] = useState({ schoolName: '', affiliation: '', logoURL: '', address: '', phone: '', email: '' })
  const [academicYears, setAcademicYears] = useState([])
  const [admins, setAdmins] = useState([])
  const [periods, setPeriods] = useState([])
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [assignments, setAssignments] = useState([])
  const [timetable, setTimetable] = useState([])
  const [activityLog, setActivityLog] = useState([])
  
  // Modal & Form States
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false) 
  const [savingSchoolInfo, setSavingSchoolInfo] = useState(false)
  
  // Builder & Viewer States
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [viewMode, setViewMode] = useState('class') // 'class' or 'teacher'
  const [selectedViewTeacher, setSelectedViewTeacher] = useState('')
  
  useEffect(() => {
    let prefersDark = false
    try {
      const stored = localStorage.getItem("theme")
      if (stored) prefersDark = stored === "dark"
      else prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch (e) {}
    
    setIsDark(prefersDark)
    document.documentElement.classList.toggle("dark", prefersDark)
    setMounted(true)
    loadAllData(true)
    
    const checkMobile = () => { setIsMobile(window.innerWidth < 1024); if(window.innerWidth < 1024) setSidebarOpen(false); else setSidebarOpen(true); }
    checkMobile(); window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", isDark)
      localStorage.setItem("theme", isDark ? "dark" : "light")
    }
  }, [isDark, mounted])
  
  useEffect(() => { if (showModal) setFormData(editingItem || {}) }, [editingItem, showModal])

  useEffect(() => {
    const classrooms = [...new Set((subjects || []).map(s => s?.classroom).filter(Boolean))]
    if (!selectedClass && classrooms.length > 0) setSelectedClass(classrooms[0])
  }, [subjects, selectedClass])

  useEffect(() => {
    if (!selectedYear && academicYears.length > 0) setSelectedYear(academicYears.find(y => y?.isActive)?.id || academicYears[0]?.id)
  }, [academicYears, selectedYear])

  useEffect(() => {
    if (!selectedViewTeacher && teachers.length > 0) setSelectedViewTeacher(teachers[0].id)
  }, [teachers, selectedViewTeacher])
  
  // ─── DATA FETCHING ─────────────────────────────────────────────────────────
  const loadAllData = async (isFirstLoad = false) => {
    if (isFirstLoad) setInitialLoad(true)
    try {
      const res = await fetch('/api/all-data')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      
      setSchoolInfo(data.schoolInfo || {})
      setAcademicYears((data.academicYears || []).map(y => ({ ...y, startDate: y.start_date, endDate: y.end_date })))
      setAdmins((data.admins || []).map(a => ({ id: a.id, title: a.title, firstName: a.first_name, lastName: a.last_name, position: a.position })))
      setPeriods((data.settings || []).map(p => ({ id: p.id, periodNumber: p.period_number, startTime: parseTimeValue(p.start_time), endTime: parseTimeValue(p.end_time), isActive: p.is_active, label: p.label })))
      setSubjects((data.subjects || []).map(s => ({ id: s.id, code: s.code, name: s.name, periodsPerWeek: s.periods_per_week, type: s.type, classroom: s.classroom })))
      setTeachers((data.teachers || []).map(t => ({ id: t.id, prefix: t.prefix, firstName: t.first_name, lastName: t.last_name, department: t.department })))
      setAssignments((data.assignments || []).map(a => ({ id: a.id, teacherId: a.teacher_id, subjectId: a.subject_id, classroom: a.classroom, academicYearId: a.academic_year_id, teacherPrefix: a.teacher_prefix, teacherFirstName: a.teacher_first_name, teacherLastName: a.teacher_last_name, subjectCode: a.subject_code, subjectName: a.subject_name })))
      setTimetable((data.timetable || []).map(t => ({ id: t.id, day: t.day, period: t.period, subjectId: t.subject_id, teacherId: t.teacher_id, classroom: t.classroom, academicYearId: t.academic_year_id, subjectCode: t.subject_code, subjectName: t.subject_name, subjectType: t.subject_type, teacherPrefix: t.teacher_prefix, teacherFirstName: t.teacher_first_name, teacherLastName: t.teacher_last_name })))
      setActivityLog((data.activityLog || []).map(a => ({ id: a.id, action: a.action, user: a.user, detail: a.detail, timestamp: a.timestamp, ipAddress: a.ip_address, device: a.device })))
    } catch (error) {
      showAlert('error', 'ข้อผิดพลาด', `โหลดข้อมูลไม่สำเร็จ: ${error.message}`)
    } finally {
      if (isFirstLoad) setInitialLoad(false)
    }
  }

  const loadTimetable = async () => {
    try {
      const res = await fetch('/api/timetable')
      const data = await res.json()
      if (Array.isArray(data)) setTimetable(data.map(t => ({ id: t.id, day: t.day, period: t.period, subjectId: t.subject_id, teacherId: t.teacher_id, classroom: t.classroom, academicYearId: t.academic_year_id, subjectCode: t.subject_code, subjectName: t.subject_name, subjectType: t.subject_type, teacherPrefix: t.teacher_prefix, teacherFirstName: t.teacher_first_name, teacherLastName: t.teacher_last_name })))
    } catch (error) { console.error(error) }
  }
  
  // ─── SWEETALERT FUNCTIONS ──────────────────────────────────────────────────
  const showAlert = async (icon, title, text) => {
    const Swal = await getSwal();
    Swal.fire({ ...getSwalBase(), icon, title, text, timer: icon === 'success' ? 2500 : undefined, showConfirmButton: icon !== 'success', confirmButtonText: 'ตกลง', confirmButtonColor: '#6366f1' });
  };

  const showConfirmDialog = async (itemName, onConfirm) => {
    const Swal = await getSwal();
    const result = await Swal.fire({ ...getSwalBase(), title: 'ยืนยันการลบข้อมูล', text: `คุณต้องการลบ "${itemName}" ใช่หรือไม่? ข้อมูลนี้จะไม่สามารถกู้คืนได้`, icon: 'warning', showCancelButton: true, confirmButtonText: 'ยืนยันลบ', cancelButtonText: 'ยกเลิก', confirmButtonColor: '#ef4444', reverseButtons: true });
    if (result.isConfirmed) { Swal.showLoading(); await onConfirm(); }
  };

  // ─── CRUD FUNCTIONS ────────────────────────────────────────────────────────
  const openModal = (type, item = null) => {
    setModalType(type)
    setEditingItem(item)
    setFormData(item || {})
    setShowModal(true)
  }
  
  const closeModal = () => {
    if (saving) return; 
    setShowModal(false)
    setModalType('')
    setEditingItem(null)
    setFormData({})
  }

  const saveSchoolInfo = async () => {
    setSavingSchoolInfo(true)
    try {
      const res = await fetch('/api/school-info', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(schoolInfo) })
      const data = await res.json()
      if (data.success) { 
        if (data.changed === false) {
          // ไม่มีการเปลี่ยนแปลงข้อมูล
        } else {
          showAlert('success', 'สำเร็จ', 'บันทึกข้อมูลโรงเรียนเรียบร้อยแล้ว')
          loadAllData()
        }
      }
      else showAlert('error', 'ข้อผิดพลาด', data.error || 'เกิดข้อผิดพลาดในการบันทึก')
    } catch (error) { showAlert('error', 'ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์') } finally { setSavingSchoolInfo(false) }
  }

  const handleSave = async (type, item, isEdit = false) => {
    setSaving(true)
    try {
      // ตรวจสอบว่าข้อมูลมีการเปลี่ยนแปลงจริงหรือไม่ (เฉพาะกรณีแก้ไข)
      if (isEdit && editingItem) {
        const changeFields = {
          academicYear: ['year', 'semester', 'startDate', 'endDate', 'isActive'],
          admin: ['title', 'firstName', 'lastName', 'position'],
          subject: ['code', 'name', 'periodsPerWeek', 'type', 'classroom'],
          teacher: ['prefix', 'firstName', 'lastName', 'department'],
          assignment: ['teacherId', 'subjectId', 'classroom', 'academicYearId']
        }
        const fieldsToCheck = changeFields[type]
        if (fieldsToCheck && !hasDataChanged(editingItem, item, fieldsToCheck)) {
          // ไม่มีการเปลี่ยนแปลงข้อมูล ปิด modal โดยไม่แสดง alert
          closeModal()
          setSaving(false)
          return
        }
      }

      if (type === 'academicYear' && (!item.year || !item.semester)) { showAlert('warning', 'ข้อมูลไม่ครบถ้วน', 'กรุณากรอกปีการศึกษาและภาคเรียนให้ครบถ้วน'); setSaving(false); return; }
      if (type === 'admin' && (!item.title || !item.firstName || !item.lastName)) { showAlert('warning', 'ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลผู้บริหารให้ครบถ้วน'); setSaving(false); return; }
      if (type === 'subject' && (!item.code || !item.name)) { showAlert('warning', 'ข้อมูลไม่ครบถ้วน', 'กรุณากรอกรหัสวิชาและชื่อวิชาให้ครบถ้วน'); setSaving(false); return; }
      if (type === 'teacher' && (!item.prefix || !item.firstName || !item.lastName)) { showAlert('warning', 'ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลครูให้ครบถ้วน'); setSaving(false); return; }
      if (type === 'assignment' && (!item.teacherId || !item.subjectId || !item.classroom)) { showAlert('warning', 'ข้อมูลไม่ครบถ้วน', 'กรุณาเลือกครู วิชา และห้องเรียนให้ครบถ้วน'); setSaving(false); return; }
      
      const endpoints = { academicYear: '/api/academic-years', admin: '/api/administrators', period: '/api/periods', subject: '/api/subjects', teacher: '/api/teachers', assignment: '/api/assignments' }
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(endpoints[type], { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) })
      const data = await res.json()
      
      if (data.success) {
        showAlert('success', 'สำเร็จ', data.message || 'บันทึกข้อมูลเรียบร้อยแล้ว')
        loadAllData()
        if(type !== 'period') closeModal()
      } else showAlert('error', 'ข้อผิดพลาด', data.error || 'เกิดข้อผิดพลาดในการบันทึก')
    } catch (error) { showAlert('error', 'ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์') } finally { setSaving(false) }
  }
  
  const handleDelete = async (type, id) => {
    try {
      const endpoints = { academicYear: '/api/academic-years', admin: '/api/administrators', subject: '/api/subjects', teacher: '/api/teachers', assignment: '/api/assignments' }
      const res = await fetch(`${endpoints[type]}?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) { showAlert('success', 'สำเร็จ', 'ลบข้อมูลเรียบร้อยแล้ว'); loadAllData() } 
      else showAlert('error', 'ข้อผิดพลาด', data.error || 'เกิดข้อผิดพลาดในการลบ')
    } catch (error) { showAlert('error', 'ข้อผิดพลาด', 'เชื่อมต่อล้มเหลว') }
  }

  // ─── SHORTCUT COMPONENTS ───────────────────────────────────────────────────
  const DataTable = ({ headers, data, emptyMsg, renderRow }) => (
    <div className="rounded-2xl border border-black/[.08] dark:border-white/[.07] bg-white dark:bg-[#121221] overflow-hidden no-print">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]"><thead className="bg-black/[.03] dark:bg-white/[.03]"><tr>{headers.map((h, i) => <th key={i} className="px-4 py-3 text-left text-[11px] font-semibold text-[#55557a] uppercase whitespace-nowrap">{h}</th>)}</tr></thead><tbody className="divide-y divide-black/[.06] dark:divide-white/[.06]">{data.length === 0 ? <tr><td colSpan={headers.length} className="text-center p-8 text-[#9999b8]">{emptyMsg}</td></tr> : data.map(renderRow)}</tbody></table>
      </div>
    </div>
  )

  const ActionBtns = ({ item, name, type }) => (
    <div className="flex gap-1">
      <button onClick={() => openModal(type, item)} className="p-1.5 text-blue-500 hover:bg-black/[.05] dark:hover:bg-white/[.05] rounded-lg transition-colors"><Edit2 size={16} /></button>
      <button onClick={() => showConfirmDialog(name, () => handleDelete(type, item.id))} className="p-1.5 text-red-500 hover:bg-black/[.05] dark:hover:bg-white/[.05] rounded-lg transition-colors"><Trash2 size={16} /></button>
    </div>
  )
  
  // ─── RENDER SECTIONS ───────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-6 no-print">
      <div className="relative rounded-2xl border border-black/[.08] dark:border-white/[.07] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] p-6 text-white overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">ยินดีต้อนรับสู่ระบบจัดตารางเรียน</h1>
          <p className="text-white/80 text-sm">{schoolInfo.schoolName || 'โรงเรียนตัวอย่าง'}</p>
          <p className="text-white/60 text-xs mt-1">{schoolInfo.affiliation || 'สำนักงานเขตพื้นที่การศึกษา'}</p>
        </div>
        <School size={200} className="absolute right-4 top-4 opacity-10 pointer-events-none" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="รายวิชา" value={subjects.length} accent="#6366f1" sub={`${subjects.filter(s => s.type === 'พื้นฐาน').length} พื้นฐาน`}><BookOpen size={18} /></StatCard>
        <StatCard label="ครูผู้สอน" value={teachers.length} accent="#8b5cf6" sub={`${new Set(teachers.map(t => t.department)).size} กลุ่มสาระ`}><GraduationCap size={18} /></StatCard>
        <StatCard label="ห้องเรียน" value={[...new Set(subjects.map(s => s.classroom))].length} accent="#ec4899" sub={`${assignments.length} การจัดครู`}><Building2 size={18} /></StatCard>
        <StatCard label="คาบเรียน" value={periods.filter(p => p.isActive).length} accent="#10b981" sub="ต่อวัน"><Clock size={18} /></StatCard>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-black/[.08] dark:border-white/[.07] bg-white dark:bg-[#121221] p-5">
          <h3 className="text-sm font-semibold text-[#18182e] dark:text-[#eeeef8] mb-4 flex items-center gap-2"><Activity size={16} className="text-[#6366f1]" /> กิจกรรมล่าสุด</h3>
          <div className="space-y-3">
            {activityLog.slice(0, 5).map((log, i) => (
              <div key={log.id || i} className="flex items-start gap-3 p-3 rounded-xl bg-black/[.02] dark:bg-white/[.02]">
                <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0"><span className="text-xs">📝</span></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#18182e] dark:text-[#eeeef8] truncate">{log.action || '-'}</p>
                  <p className="text-[11px] text-[#9999b8] dark:text-[#55556a] truncate">{log.detail || ''}</p>
                  <p className="text-[10px] text-[#9999b8] dark:text-[#55556a]">{log.timestamp ? formatThaiDateTime(log.timestamp) : '-'}</p>
                </div>
              </div>
            ))}
            {activityLog.length === 0 && <p className="text-center text-[#9999b8] dark:text-[#55556a] text-sm py-4">ไม่มีกิจกรรมล่าสุด</p>}
          </div>
        </div>
        <div className="rounded-2xl border border-black/[.08] dark:border-white/[.07] bg-white dark:bg-[#121221] p-5">
          <h3 className="text-sm font-semibold text-[#18182e] dark:text-[#eeeef8] mb-4 flex items-center gap-2"><Users size={16} className="text-[#6366f1]" /> ผู้บริหาร</h3>
          <div className="space-y-3">
            {admins.map((admin, i) => (
              <div key={admin.id || i} className="flex items-center gap-3 p-3 rounded-xl bg-black/[.02] dark:bg-white/[.02]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-bold text-sm">{admin.firstName?.[0] || '?'}</div>
                <div>
                  <p className="text-[13px] font-medium text-[#18182e] dark:text-[#eeeef8]">{admin.title || ''}{admin.firstName || ''} {admin.lastName || ''}</p>
                  <p className="text-[11px] text-[#9999b8] dark:text-[#55556a]">{admin.position || '-'}</p>
                </div>
              </div>
            ))}
            {admins.length === 0 && <p className="text-center text-[#9999b8] dark:text-[#55556a] text-sm py-4">ไม่มีข้อมูลผู้บริหาร</p>}
          </div>
        </div>
      </div>
    </div>
  )

  const renderSchoolInfo = () => (
    <div className="max-w-2xl no-print">
      <div className="rounded-2xl border border-black/[.08] dark:border-white/[.07] bg-white dark:bg-[#121221] p-6">
        <h2 className="text-lg font-semibold text-[#18182e] dark:text-[#eeeef8] mb-6">ข้อมูลโรงเรียน</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className={fieldLabelCls}>ชื่อโรงเรียน</label><input type="text" value={schoolInfo.schoolName || ''} onChange={e => setSchoolInfo({...schoolInfo, schoolName: e.target.value})} className={fieldInputCls} /></div>
          <div className="sm:col-span-2"><label className={fieldLabelCls}>สังกัด</label><input type="text" value={schoolInfo.affiliation || ''} onChange={e => setSchoolInfo({...schoolInfo, affiliation: e.target.value})} className={fieldInputCls} /></div>
          <div><label className={fieldLabelCls}>โทรศัพท์</label><input type="text" value={schoolInfo.phone || ''} onChange={e => setSchoolInfo({...schoolInfo, phone: e.target.value})} className={fieldInputCls} /></div>
          <div><label className={fieldLabelCls}>อีเมล</label><input type="email" value={schoolInfo.email || ''} onChange={e => setSchoolInfo({...schoolInfo, email: e.target.value})} className={fieldInputCls} /></div>
          <div className="sm:col-span-2"><label className={fieldLabelCls}>ที่อยู่</label><input type="text" value={schoolInfo.address || ''} onChange={e => setSchoolInfo({...schoolInfo, address: e.target.value})} className={fieldInputCls} /></div>
        </div>
        <button onClick={saveSchoolInfo} disabled={savingSchoolInfo} className={`mt-6 ${btnPrimaryCls}`}>{savingSchoolInfo ? <RefreshCw size={14} className="animate-spin"/> : <Save size={14}/>} {savingSchoolInfo ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</button>
      </div>
    </div>
  )

  const renderPeriods = () => (
    <div className="no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-[#18182e] dark:text-[#eeeef8] flex items-center gap-2"><Clock size={18} className="text-[#6366f1]" /> กำหนดเวลาเรียน (คาบเรียน)</h2>
        <button onClick={() => handleSave('period', { periods }, true)} disabled={saving} className={btnPrimaryCls}>{saving ? <RefreshCw size={14} className="animate-spin"/> : <Save size={14}/>} {saving ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}</button>
      </div>
      <div className="rounded-2xl border border-black/[.08] dark:border-white/[.07] bg-white dark:bg-[#121221] overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-black/[.03] dark:bg-white/[.03]">
            <tr>{['คาบ', 'ชื่อเรียก (Label)', 'เวลาเริ่ม', 'เวลาจบ', 'ใช้งาน', ''].map((h, i) => <th key={i} className="px-4 py-3 text-left text-[11px] font-semibold text-[#55557a] uppercase whitespace-nowrap">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-black/[.06] dark:divide-white/[.06]">
            {periods.length === 0 && <tr><td colSpan="6" className="text-center p-8 text-[#9999b8]">ไม่มีข้อมูล</td></tr>}
            {(periods || []).map((period, idx) => (
              <tr key={period.id || idx} className="hover:bg-black/[.02] dark:hover:bg-white/[.02]">
                <td className="px-4 py-3 text-[13px] text-[#18182e] dark:text-[#eeeef8]">{period.periodNumber || idx + 1}</td>
                <td className="px-4 py-3"><input type="text" placeholder={`คาบที่ ${idx+1}`} value={period.label || ''} onChange={e => setPeriods(periods.map((p, i) => i === idx ? { ...p, label: e.target.value } : p))} className={fieldInputCls} /></td>
                <td className="px-4 py-3"><input type="time" value={period.startTime || ''} onChange={e => setPeriods(periods.map((p, i) => i === idx ? { ...p, startTime: e.target.value } : p))} className={fieldInputCls} /></td>
                <td className="px-4 py-3"><input type="time" value={period.endTime || ''} onChange={e => setPeriods(periods.map((p, i) => i === idx ? { ...p, endTime: e.target.value } : p))} className={fieldInputCls} /></td>
                <td className="px-4 py-3"><input type="checkbox" checked={period.isActive || false} onChange={e => setPeriods(periods.map((p, i) => i === idx ? { ...p, isActive: e.target.checked } : p))} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" /></td>
                <td className="px-4 py-3"><button onClick={() => setPeriods(periods.filter((_, i) => i !== idx))} className="text-red-500 p-1.5 hover:bg-black/[.05] dark:hover:bg-white/[.05] rounded-lg transition-colors"><Trash2 size={16}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => setPeriods([...periods, { id: generateUUID(), periodNumber: periods.length + 1, startTime: '08:00', endTime: '09:00', isActive: true, label: `คาบที่ ${periods.length + 1}` }])} className={`mt-4 ${btnSecondaryCls}`}><Plus size={14} /> เพิ่มคาบเรียน</button>
    </div>
  )

  const renderTimetableBuilder = () => {
    const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์']
    const activePeriods = periods.filter(p => p.isActive).sort((a, b) => a.periodNumber - b.periodNumber)
    const classrooms = [...new Set(subjects.map(s => s.classroom).filter(Boolean))]
    
    return (
      <div className="no-print">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-[13px] text-[#55557a] dark:text-[#8888aa] whitespace-nowrap">ห้องเรียน:</label>
            <select value={selectedClass || ''} onChange={e => setSelectedClass(e.target.value)} className={fieldInputCls}>
              {classrooms.length === 0 && <option value="">ไม่มีห้องเรียน</option>}
              {classrooms.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-[13px] text-[#55557a] dark:text-[#8888aa] whitespace-nowrap">ปีการศึกษา:</label>
            <select value={selectedYear || ''} onChange={e => setSelectedYear(e.target.value)} className={fieldInputCls}>
              {academicYears.length === 0 && <option value="">ไม่มีปีการศึกษา</option>}
              {academicYears.map(y => <option key={y.id} value={y.id}>{y.year}/{y.semester}</option>)}
            </select>
          </div>
        </div>
        
        <div className="rounded-2xl border border-black/[.08] dark:border-white/[.07] bg-white dark:bg-[#121221] overflow-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-black/[.03] dark:bg-white/[.03]">
              <tr>
                <th className="px-3 py-3 text-[11px] font-semibold text-[#55557a] text-center w-20 border-r border-black/[.05] dark:border-white/[.05]">วัน / คาบ</th>
                {activePeriods.map(p => <th key={p.id} className="px-3 py-3 text-[11px] font-semibold text-[#55557a] text-center border-r border-black/[.05] dark:border-white/[.05] last:border-0">{p.label || `คาบ ${p.periodNumber}`}<br/><span className="font-normal text-[10px]">{p.startTime}-{p.endTime}</span></th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[.06] dark:divide-white/[.06]">
              {days.map(day => (
                <tr key={day}>
                  <td className="px-3 py-3 text-[13px] font-medium bg-black/[.02] dark:bg-white/[.02] text-center border-r border-black/[.05] dark:border-white/[.05]">{day}</td>
                  {activePeriods.map(period => {
                    const slot = timetable.find(t => t.day === day && t.period === period.periodNumber && t.classroom === selectedClass && t.academicYearId === selectedYear)
                    const availableAssignments = assignments.filter(a => a.classroom === selectedClass && a.academicYearId === selectedYear)
                    return (
                      <td key={`${day}-${period.periodNumber}`} className="px-2 py-2 text-center border-r border-black/[.05] dark:border-white/[.05] last:border-0 hover:bg-black/[.02] dark:hover:bg-white/[.02] transition-colors">
                        <select value={slot?.subjectId || ''} onChange={async e => {
                          const subjectId = e.target.value
                          const assignment = availableAssignments.find(a => a.subjectId === subjectId)
                          await fetch('/api/timetable', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ day, period: period.periodNumber, subjectId, teacherId: assignment?.teacherId || null, classroom: selectedClass, academicYearId: selectedYear }) })
                          loadTimetable()
                        }} className="w-full text-[11px] p-2 rounded-lg border border-black/[.1] dark:border-white/[.1] bg-transparent outline-none cursor-pointer focus:ring-2 focus:ring-[#6366f1]/20">
                          <option value="">- ว่าง -</option>
                          {availableAssignments.length === 0 && <option value="" disabled>ไม่มีรายวิชาที่จัดครูแล้วในห้องนี้</option>}
                          {availableAssignments.map(a => <option key={a.subjectId} value={a.subjectId}>{a.subjectCode}</option>)}
                        </select>
                        {slot && <p className="text-[10px] text-[#6366f1] font-medium mt-1.5 truncate px-1" title={`${slot.teacherPrefix}${slot.teacherFirstName} ${slot.teacherLastName}`}>{slot.teacherFirstName}</p>}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderTimetableView = () => {
    const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์']
    const activePeriods = periods.filter(p => p.isActive).sort((a, b) => a.periodNumber - b.periodNumber)
    const classrooms = [...new Set(subjects.map(s => s.classroom).filter(Boolean))]

    return (
      <div className="print-container">
        {/* Controls (Hidden in Print) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 no-print">
          <div className="flex gap-2 p-1 bg-black/[.04] dark:bg-white/[.04] rounded-lg">
            <button onClick={() => setViewMode('class')} className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all ${viewMode === 'class' ? 'bg-white dark:bg-[#121221] shadow-sm text-[#6366f1]' : 'text-[#55557a]'}`}>ตามห้องเรียน</button>
            <button onClick={() => setViewMode('teacher')} className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all ${viewMode === 'teacher' ? 'bg-white dark:bg-[#121221] shadow-sm text-[#6366f1]' : 'text-[#55557a]'}`}>ตามครูผู้สอน</button>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <select value={selectedYear || ''} onChange={e => setSelectedYear(e.target.value)} className={`w-32 ${fieldInputCls}`}>{academicYears.map(y => <option key={y.id} value={y.id}>ปี {y.year}/{y.semester}</option>)}</select>
            {viewMode === 'class' ? (
              <select value={selectedClass || ''} onChange={e => setSelectedClass(e.target.value)} className={`w-32 ${fieldInputCls}`}>{classrooms.length===0 && <option value="">ไม่มีห้องเรียน</option>}{classrooms.map(c => <option key={c} value={c}>ห้อง {c}</option>)}</select>
            ) : (
              <select value={selectedViewTeacher || ''} onChange={e => setSelectedViewTeacher(e.target.value)} className={`w-48 ${fieldInputCls}`}>{teachers.length===0 && <option value="">ไม่มีครู</option>}{teachers.map(t => <option key={t.id} value={t.id}>{t.prefix}{t.firstName} {t.lastName}</option>)}</select>
            )}
            <button onClick={() => window.print()} className={btnPrimaryCls}><Printer size={14}/> พิมพ์ตาราง</button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="bg-white dark:bg-[#121221] sm:p-6 rounded-2xl border border-black/[.08] dark:border-white/[.07] print:border-none print:p-0">
          <div className="text-center mb-6 print-only pb-4">
            <h2 className="text-xl font-bold mb-1">{schoolInfo.schoolName || 'โรงเรียนตัวอย่าง'}</h2>
            <h3 className="text-lg mb-1">
              ตารางเรียน {viewMode === 'class' ? `ห้อง ${selectedClass}` : `ของ ${(teachers.find(t=>t.id===selectedViewTeacher)?.prefix || '')}${(teachers.find(t=>t.id===selectedViewTeacher)?.firstName || '')} ${(teachers.find(t=>t.id===selectedViewTeacher)?.lastName || '')}`}
            </h3>
            <p className="text-sm">ภาคเรียนที่ {(academicYears.find(y=>y.id===selectedYear)?.semester || '')} ปีการศึกษา {(academicYears.find(y=>y.id===selectedYear)?.year || '')}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] print-table border-collapse">
              <thead>
                <tr>
                  <th className="border border-black/[.2] p-2 text-[12px] bg-black/[.05] dark:bg-white/[.05] w-24">วัน / คาบ</th>
                  {activePeriods.map(p => (
                    <th key={p.id} className="border border-black/[.2] p-2 text-[12px] bg-black/[.05] dark:bg-white/[.05]">
                      {p.label || `คาบ ${p.periodNumber}`}<br/><span className="font-normal text-[10px]">{p.startTime}-{p.endTime}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map(day => (
                  <tr key={day}>
                    <td className="border border-black/[.2] p-2 text-[13px] font-bold text-center bg-black/[.02] dark:bg-white/[.02]">{day}</td>
                    {activePeriods.map(period => {
                      const slot = viewMode === 'class' 
                        ? timetable.find(t => t.day === day && t.period === period.periodNumber && t.classroom === selectedClass && t.academicYearId === selectedYear)
                        : timetable.find(t => t.day === day && t.period === period.periodNumber && t.teacherId === selectedViewTeacher && t.academicYearId === selectedYear);
                      
                      return (
                        <td key={`${day}-${period.periodNumber}`} className="border border-black/[.2] p-2 text-center align-middle h-20">
                          {slot ? (
                            <div className="flex flex-col items-center justify-center">
                              <span className="font-bold text-[#18182e] dark:text-[#eeeef8] text-[12px]">{slot.subjectCode}</span>
                              <span className="text-[11px] text-[#55557a] dark:text-[#8888aa] line-clamp-2 w-full max-w-[100px] leading-tight mt-0.5">{slot.subjectName}</span>
                              <span className="text-[10px] text-[#6366f1] font-semibold mt-1">
                                {viewMode === 'class' ? slot.teacherFirstName : `ห้อง ${slot.classroom}`}
                              </span>
                            </div>
                          ) : <span className="text-gray-300 dark:text-gray-700 select-none">-</span>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderActivityLog = () => (
    <div className="no-print">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#18182e] dark:text-[#eeeef8] flex items-center gap-2"><ClipboardList className="text-[#6366f1] w-5 h-5"/> ประวัติการใช้งานระบบ</h2>
        <button onClick={() => loadAllData()} className={btnSecondaryCls}><RefreshCw size={14}/> รีเฟรช</button>
      </div>
      <div className="rounded-2xl border border-black/[.08] dark:border-white/[.07] bg-white dark:bg-[#121221] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-black/[.03] dark:bg-white/[.03]">
              <tr>{['วันเวลา', 'ผู้ทำรายการ', 'การกระทำ', 'รายละเอียด', 'IP Address'].map((h, i) => <th key={i} className="px-4 py-3 text-left text-[11px] font-semibold text-[#55557a] uppercase whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-black/[.06] dark:divide-white/[.06]">
              {activityLog.length === 0 ? <tr><td colSpan="5" className="text-center p-8 text-[#9999b8]">ไม่มีประวัติการใช้งาน</td></tr> : 
                activityLog.map((log) => (
                  <tr key={log.id} className="hover:bg-black/[.02] dark:hover:bg-white/[.02]">
                    <td className="px-4 py-3 text-[12px] text-[#55557a] whitespace-nowrap">{formatThaiDateTime(log.timestamp)}</td>
                    <td className="px-4 py-3 text-[13px] font-medium text-[#18182e] dark:text-[#eeeef8]">{log.user}</td>
                    <td className="px-4 py-3"><Badge type="info">{log.action}</Badge></td>
                    <td className="px-4 py-3 text-[12px] text-[#55557a]">{log.detail}</td>
                    <td className="px-4 py-3 text-[11px] text-[#9999b8]">{log.ipAddress || '-'}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  if (!mounted) return null;
  
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0a10] transition-colors duration-300">
      <style>{minimalCss}</style>
      
      <LoadingOverlay show={initialLoad} />
      
      {/* Sidebar & Mobile Menu Overlay */}
      <div className="no-print">
        {isMobile && sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />}
        <aside className={`fixed left-0 top-0 bottom-0 z-40 w-64 bg-white dark:bg-[#121221] border-r border-black/[.08] dark:border-white/[.07] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <div className="p-4 border-b border-black/[.08] dark:border-white/[.07]"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white"><School size={20} /></div><div><p className="text-sm font-bold text-[#18182e] dark:text-[#eeeef8]">ระบบจัดตารางเรียน</p><p className="text-[10px] text-[#9999b8]">Timetable System</p></div></div></div>
          <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
            <div className="px-3 py-2 text-[10px] font-semibold text-[#9999b8] uppercase tracking-wider">เมนูหลัก</div>
            <NavItem icon={LayoutGrid} label="หน้าหลัก" active={activeSection === 'dashboard'} onClick={() => {setActiveSection('dashboard'); if(isMobile) setSidebarOpen(false);}} />
            <NavItem icon={Building2} label="ข้อมูลโรงเรียน" active={activeSection === 'schoolInfo'} onClick={() => {setActiveSection('schoolInfo'); if(isMobile) setSidebarOpen(false);}} />
            <NavItem icon={Calendar} label="ปีการศึกษา" active={activeSection === 'academicYears'} onClick={() => {setActiveSection('academicYears'); if(isMobile) setSidebarOpen(false);}} />
            <NavItem icon={UserCog} label="ผู้บริหาร" active={activeSection === 'admins'} onClick={() => {setActiveSection('admins'); if(isMobile) setSidebarOpen(false);}} />
            <NavItem icon={Clock} label="เวลาเรียน (คาบ)" active={activeSection === 'periods'} onClick={() => {setActiveSection('periods'); if(isMobile) setSidebarOpen(false);}} />
            <div className="mt-4 px-3 py-2 text-[10px] font-semibold text-[#9999b8] uppercase tracking-wider">ข้อมูลพื้นฐาน</div>
            <NavItem icon={BookOpen} label="รายวิชา" active={activeSection === 'subjects'} onClick={() => {setActiveSection('subjects'); if(isMobile) setSidebarOpen(false);}} />
            <NavItem icon={GraduationCap} label="ครูผู้สอน" active={activeSection === 'teachers'} onClick={() => {setActiveSection('teachers'); if(isMobile) setSidebarOpen(false);}} />
            <NavItem icon={Users} label="จัดครูผู้สอน" active={activeSection === 'assignments'} onClick={() => {setActiveSection('assignments'); if(isMobile) setSidebarOpen(false);}} />
            <div className="mt-4 px-3 py-2 text-[10px] font-semibold text-[#9999b8] uppercase tracking-wider">ตารางเรียน & รายงาน</div>
            <NavItem icon={Grid3X3} label="จัดตารางเรียน" active={activeSection === 'timetableBuilder'} onClick={() => {setActiveSection('timetableBuilder'); if(isMobile) setSidebarOpen(false);}} />
            <NavItem icon={Printer} label="ดู/พิมพ์ตาราง" active={activeSection === 'timetableView'} onClick={() => {setActiveSection('timetableView'); if(isMobile) setSidebarOpen(false);}} />
            <NavItem icon={ClipboardList} label="ประวัติการใช้งาน" active={activeSection === 'activityLogs'} onClick={() => {setActiveSection('activityLogs'); if(isMobile) setSidebarOpen(false);}} />
          </nav>
        </aside>
      </div>
      
      {/* Main Content Area */}
      <main className={`transition-all duration-300 lg:ml-64 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#121221]/80 backdrop-blur-md border-b border-black/[.08] dark:border-white/[.07] no-print">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 lg:hidden text-[#55557a] hover:bg-black/[.05] dark:hover:bg-white/[.05] rounded-lg"><Menu size={20} /></button>
              <h1 className="text-lg font-semibold text-[#18182e] dark:text-[#eeeef8]">
                {activeSection === 'dashboard' ? 'หน้าหลัก' : 
                 activeSection === 'schoolInfo' ? 'ข้อมูลโรงเรียน' : 
                 activeSection === 'academicYears' ? 'จัดการปีการศึกษา' :
                 activeSection === 'admins' ? 'จัดการผู้บริหาร' :
                 activeSection === 'periods' ? 'กำหนดเวลาเรียน' :
                 activeSection === 'subjects' ? 'จัดการรายวิชา' :
                 activeSection === 'teachers' ? 'จัดการครูผู้สอน' :
                 activeSection === 'assignments' ? 'จัดครูผู้สอนประจำวิชา' :
                 activeSection === 'timetableBuilder' ? 'สร้างและจัดตารางเรียน' :
                 activeSection === 'timetableView' ? 'ดูและพิมพ์ตารางเรียน' :
                 activeSection === 'activityLogs' ? 'ประวัติการใช้งานระบบ' : 'จัดการข้อมูล'}
              </h1>
            </div>
            <button onClick={() => setIsDark(!isDark)} className="p-2 text-[#55557a] hover:bg-black/[.05] dark:hover:bg-white/[.05] rounded-lg transition-colors">{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
          </div>
        </header>
        
        <div className="p-4 lg:p-6 safe-area-inset">
          {/* Renders */}
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'schoolInfo' && renderSchoolInfo()}
          {activeSection === 'periods' && renderPeriods()}
          {activeSection === 'timetableBuilder' && renderTimetableBuilder()}
          {activeSection === 'timetableView' && renderTimetableView()}
          {activeSection === 'activityLogs' && renderActivityLog()}
          
          {/* Data Tables rendering */}
          {activeSection === 'academicYears' && (
            <div>
              <div className="flex justify-between items-center mb-6 no-print"><h2 className="text-lg font-semibold flex items-center gap-2 text-[#18182e] dark:text-[#eeeef8]"><Calendar className="text-[#6366f1] w-5 h-5"/> ปีการศึกษา</h2><button onClick={() => openModal('academicYear')} className={btnPrimaryCls}><Plus size={14}/> เพิ่มข้อมูล</button></div>
              <DataTable headers={['ปี', 'ภาคเรียน', 'เริ่ม', 'สิ้นสุด', 'สถานะ', 'จัดการ']} data={academicYears} emptyMsg="ไม่มีข้อมูลปีการศึกษา" renderRow={y => <tr key={y.id} className="hover:bg-black/[.02] dark:hover:bg-white/[.02]"><td className="px-4 py-3 text-[13px]">{y.year}</td><td className="px-4 py-3 text-[13px]">{y.semester}</td><td className="px-4 py-3 text-[13px] text-[#55557a]">{y.startDate}</td><td className="px-4 py-3 text-[13px] text-[#55557a]">{y.endDate}</td><td className="px-4 py-3">{y.isActive ? <Badge type="success">ใช้งานปัจจุบัน</Badge> : <Badge>ไม่ได้ใช้งาน</Badge>}</td><td className="px-4 py-3"><ActionBtns item={y} name={`ปี ${y.year}/${y.semester}`} type="academicYear" /></td></tr>} />
            </div>
          )}
          
          {activeSection === 'admins' && (
            <div>
              <div className="flex justify-between items-center mb-6 no-print"><h2 className="text-lg font-semibold flex items-center gap-2 text-[#18182e] dark:text-[#eeeef8]"><UserCog className="text-[#6366f1] w-5 h-5"/> ผู้บริหาร</h2><button onClick={() => openModal('admin')} className={btnPrimaryCls}><Plus size={14}/> เพิ่มข้อมูล</button></div>
              <DataTable headers={['คำนำหน้า', 'ชื่อ', 'นามสกุล', 'ตำแหน่ง', 'จัดการ']} data={admins} emptyMsg="ไม่มีข้อมูลผู้บริหาร" renderRow={a => <tr key={a.id} className="hover:bg-black/[.02] dark:hover:bg-white/[.02]"><td className="px-4 py-3 text-[13px]">{a.title}</td><td className="px-4 py-3 text-[13px]">{a.firstName}</td><td className="px-4 py-3 text-[13px]">{a.lastName}</td><td className="px-4 py-3 text-[13px] text-[#55557a]">{a.position}</td><td className="px-4 py-3"><ActionBtns item={a} name={`${a.title}${a.firstName} ${a.lastName}`} type="admin" /></td></tr>} />
            </div>
          )}

          {activeSection === 'subjects' && (
            <div>
              <div className="flex justify-between items-center mb-6 no-print"><h2 className="text-lg font-semibold flex items-center gap-2 text-[#18182e] dark:text-[#eeeef8]"><BookOpen className="text-[#6366f1] w-5 h-5"/> รายวิชา</h2><button onClick={() => openModal('subject')} className={btnPrimaryCls}><Plus size={14}/> เพิ่มข้อมูล</button></div>
              <DataTable headers={['รหัส', 'ชื่อวิชา', 'คาบ/สัปดาห์', 'ประเภท', 'ห้องเรียน', 'จัดการ']} data={subjects} emptyMsg="ไม่มีข้อมูลรายวิชา" renderRow={s => <tr key={s.id} className="hover:bg-black/[.02] dark:hover:bg-white/[.02]"><td className="px-4 py-3 text-[13px] font-semibold text-[#6366f1]">{s.code}</td><td className="px-4 py-3 text-[13px]">{s.name}</td><td className="px-4 py-3 text-[13px]">{s.periodsPerWeek}</td><td className="px-4 py-3"><Badge type={s.type==='พื้นฐาน'?'default':s.type==='เพิ่มเติม'?'info':'warning'}>{s.type}</Badge></td><td className="px-4 py-3 text-[13px]">{s.classroom || '-'}</td><td className="px-4 py-3"><ActionBtns item={s} name={`วิชา ${s.name}`} type="subject" /></td></tr>} />
            </div>
          )}

          {activeSection === 'teachers' && (
            <div>
              <div className="flex justify-between items-center mb-6 no-print"><h2 className="text-lg font-semibold flex items-center gap-2 text-[#18182e] dark:text-[#eeeef8]"><GraduationCap className="text-[#6366f1] w-5 h-5"/> ครูผู้สอน</h2><button onClick={() => openModal('teacher')} className={btnPrimaryCls}><Plus size={14}/> เพิ่มข้อมูล</button></div>
              <DataTable headers={['คำนำหน้า', 'ชื่อ', 'นามสกุล', 'กลุ่มสาระ', 'จัดการ']} data={teachers} emptyMsg="ไม่มีข้อมูลครูผู้สอน" renderRow={t => <tr key={t.id} className="hover:bg-black/[.02] dark:hover:bg-white/[.02]"><td className="px-4 py-3 text-[13px]">{t.prefix}</td><td className="px-4 py-3 text-[13px]">{t.firstName}</td><td className="px-4 py-3 text-[13px]">{t.lastName}</td><td className="px-4 py-3 text-[13px] text-[#55557a]">{t.department || '-'}</td><td className="px-4 py-3"><ActionBtns item={t} name={`ครู ${t.firstName} ${t.lastName}`} type="teacher" /></td></tr>} />
            </div>
          )}

          {activeSection === 'assignments' && (
            <div>
              <div className="flex justify-between items-center mb-6 no-print"><h2 className="text-lg font-semibold flex items-center gap-2 text-[#18182e] dark:text-[#eeeef8]"><Users className="text-[#6366f1] w-5 h-5"/> จัดครูผู้สอน</h2><button onClick={() => openModal('assignment')} className={btnPrimaryCls}><Plus size={14}/> เพิ่มข้อมูล</button></div>
              <DataTable headers={['ครูผู้สอน', 'วิชาที่สอน', 'ห้องเรียน', 'ปีการศึกษา', 'จัดการ']} data={assignments} emptyMsg="ไม่มีข้อมูลการจัดครูเข้าสอน" renderRow={a => <tr key={a.id} className="hover:bg-black/[.02] dark:hover:bg-white/[.02]"><td className="px-4 py-3 text-[13px] font-medium">{a.teacherPrefix}{a.teacherFirstName} {a.teacherLastName}</td><td className="px-4 py-3 text-[13px]"><span className="text-[#6366f1] font-semibold">{a.subjectCode}</span> {a.subjectName}</td><td className="px-4 py-3 text-[13px]">{a.classroom}</td><td className="px-4 py-3 text-[13px] text-[#55557a]">{academicYears.find(y=>y.id===a.academicYearId)?.year || '-'}</td><td className="px-4 py-3"><ActionBtns item={a} name={`การจัดสอนวิชา ${a.subjectName} ของครู${a.teacherFirstName}`} type="assignment" /></td></tr>} />
            </div>
          )}
        </div>
      </main>
      
      {/* =========================================================================
          DYNAMIC MODALS FOR CRUD OPERATIONS 
          ========================================================================= */}
      <Modal open={showModal} onClose={closeModal} title={editingItem ? `แก้ไขข้อมูล` : `เพิ่มข้อมูลใหม่`} icon={editingItem ? Edit2 : Plus}>
        <div className="space-y-4">
          
          {modalType === 'academicYear' && (<>
            <div><label className={fieldLabelCls}>ปีการศึกษา (พ.ศ.)</label><input type="number" value={formData.year || ''} onChange={e=>setFormData({...formData, year: e.target.value})} className={fieldInputCls} placeholder="เช่น 2567"/></div>
            <div><label className={fieldLabelCls}>ภาคเรียน</label><select value={formData.semester || 1} onChange={e=>setFormData({...formData, semester: e.target.value})} className={fieldInputCls}><option value="1">1</option><option value="2">2</option><option value="3">3 (ฤดูร้อน)</option></select></div>
            <div className="grid grid-cols-2 gap-4"><div><label className={fieldLabelCls}>วันที่เริ่มต้น</label><input type="date" value={formData.startDate || ''} onChange={e=>setFormData({...formData, startDate: e.target.value})} className={fieldInputCls}/></div><div><label className={fieldLabelCls}>วันที่สิ้นสุด</label><input type="date" value={formData.endDate || ''} onChange={e=>setFormData({...formData, endDate: e.target.value})} className={fieldInputCls}/></div></div>
            <div className="flex items-center gap-2 mt-2 p-3 rounded-lg border border-black/[.08] dark:border-white/[.07] bg-black/[.02] dark:bg-white/[.02]"><input type="checkbox" id="chkActiveYear" checked={formData.isActive || false} onChange={e=>setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"/> <label htmlFor="chkActiveYear" className="text-[13px] text-[#18182e] dark:text-[#eeeef8] cursor-pointer font-medium">ตั้งเป็นปีการศึกษาปัจจุบัน (Active)</label></div>
          </>)}
          
          {modalType === 'admin' && (<>
            <div><label className={fieldLabelCls}>คำนำหน้า</label><input type="text" value={formData.title || ''} onChange={e=>setFormData({...formData, title: e.target.value})} className={fieldInputCls} placeholder="เช่น นาย, นาง, นางสาว"/></div>
            <div className="grid grid-cols-2 gap-4"><div><label className={fieldLabelCls}>ชื่อ</label><input type="text" value={formData.firstName || ''} onChange={e=>setFormData({...formData, firstName: e.target.value})} className={fieldInputCls} placeholder="ชื่อจริง"/></div><div><label className={fieldLabelCls}>นามสกุล</label><input type="text" value={formData.lastName || ''} onChange={e=>setFormData({...formData, lastName: e.target.value})} className={fieldInputCls} placeholder="นามสกุล"/></div></div>
            <div><label className={fieldLabelCls}>ตำแหน่ง</label><input type="text" value={formData.position || ''} onChange={e=>setFormData({...formData, position: e.target.value})} className={fieldInputCls} placeholder="เช่น ผู้อำนวยการ, รองผู้อำนวยการ"/></div>
          </>)}
          
          {modalType === 'subject' && (<>
            <div><label className={fieldLabelCls}>รหัสวิชา</label><input type="text" value={formData.code || ''} onChange={e=>setFormData({...formData, code: e.target.value})} className={fieldInputCls} placeholder="เช่น ท21101"/></div>
            <div><label className={fieldLabelCls}>ชื่อวิชา</label><input type="text" value={formData.name || ''} onChange={e=>setFormData({...formData, name: e.target.value})} className={fieldInputCls} placeholder="เช่น ภาษาไทยพื้นฐาน"/></div>
            <div className="grid grid-cols-2 gap-4"><div><label className={fieldLabelCls}>จำนวนคาบ/สัปดาห์</label><input type="number" min="1" max="10" value={formData.periodsPerWeek || 1} onChange={e=>setFormData({...formData, periodsPerWeek: e.target.value})} className={fieldInputCls}/></div><div><label className={fieldLabelCls}>ห้องเรียนที่สอน</label><input type="text" value={formData.classroom || ''} onChange={e=>setFormData({...formData, classroom: e.target.value})} placeholder="เช่น ม.1/1" className={fieldInputCls}/></div></div>
            <div><label className={fieldLabelCls}>ประเภทรายวิชา</label><select value={formData.type || 'พื้นฐาน'} onChange={e=>setFormData({...formData, type: e.target.value})} className={fieldInputCls}><option value="พื้นฐาน">พื้นฐาน</option><option value="เพิ่มเติม">เพิ่มเติม</option><option value="กิจกรรม">กิจกรรมพัฒนาผู้เรียน</option></select></div>
          </>)}
          
          {modalType === 'teacher' && (<>
            <div><label className={fieldLabelCls}>คำนำหน้า</label><input type="text" value={formData.prefix || ''} onChange={e=>setFormData({...formData, prefix: e.target.value})} className={fieldInputCls} placeholder="เช่น นาย, นาง, นางสาว, ว่าที่ ร.ต."/></div>
            <div className="grid grid-cols-2 gap-4"><div><label className={fieldLabelCls}>ชื่อ</label><input type="text" value={formData.firstName || ''} onChange={e=>setFormData({...formData, firstName: e.target.value})} className={fieldInputCls} placeholder="ชื่อจริง"/></div><div><label className={fieldLabelCls}>นามสกุล</label><input type="text" value={formData.lastName || ''} onChange={e=>setFormData({...formData, lastName: e.target.value})} className={fieldInputCls} placeholder="นามสกุล"/></div></div>
            <div><label className={fieldLabelCls}>กลุ่มสาระการเรียนรู้</label><input type="text" value={formData.department || ''} onChange={e=>setFormData({...formData, department: e.target.value})} className={fieldInputCls} placeholder="เช่น วิทยาศาสตร์, คณิตศาสตร์"/></div>
          </>)}
          
          {modalType === 'assignment' && (<>
            <div><label className={fieldLabelCls}>ครูผู้สอน</label><select value={formData.teacherId || ''} onChange={e=>setFormData({...formData, teacherId: e.target.value})} className={fieldInputCls}><option value="">-- เลือกครูผู้สอน --</option>{teachers.map(t=><option key={t.id} value={t.id}>{t.prefix}{t.firstName} {t.lastName}</option>)}</select></div>
            <div><label className={fieldLabelCls}>รายวิชา</label><select value={formData.subjectId || ''} onChange={e=>setFormData({...formData, subjectId: e.target.value})} className={fieldInputCls}><option value="">-- เลือกรายวิชา --</option>{subjects.map(s=><option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}</select></div>
            <div><label className={fieldLabelCls}>ห้องเรียน</label><input type="text" value={formData.classroom || ''} onChange={e=>setFormData({...formData, classroom: e.target.value})} placeholder="เช่น ม.1/1 (ต้องตรงกับเวลาจัดตาราง)" className={fieldInputCls}/></div>
            <div><label className={fieldLabelCls}>ปีการศึกษา</label><select value={formData.academicYearId || selectedYear} onChange={e=>setFormData({...formData, academicYearId: e.target.value})} className={fieldInputCls}>{academicYears.map(y=><option key={y.id} value={y.id}>ปี {y.year} ภาคเรียนที่ {y.semester}</option>)}</select></div>
          </>)}
          
          {/* Action Buttons for Modal */}
          <div className="flex gap-2.5 justify-end pt-5 mt-5 border-t border-black/[.07] dark:border-white/[.07]">
            <button onClick={closeModal} disabled={saving} className={btnSecondaryCls}>ยกเลิก</button>
            <button onClick={() => handleSave(modalType, formData, !!editingItem)} disabled={saving} className={btnPrimaryCls}>
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}