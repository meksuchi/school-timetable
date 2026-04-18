"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Plus, RefreshCw, Trash2, Edit2, X,
  Wallet, Users, TrendingUp, Calendar,
  Tag, CreditCard, UserCircle, UsersRound,
  Sparkles, Activity, Check, Sun, Moon,
  EyeOff, Eye, RotateCcw, Archive,
  ChevronDown, ChevronUp, Settings, Palette,
  ArrowLeft, Building2, GraduationCap, BookOpen,
  Clock, Grid3X3, Eye, Printer, LogOut,
  School, UserCog, BookMarked, PersonStanding,
  LayoutGrid, FileText, ChevronRight, ChevronLeft,
  Save, Trash, Search, Filter, MoreVertical,
  MapPin, Phone, Mail, Image as ImageIcon,
  Menu
} from "lucide-react"

// =============================================================================
// SCHOOL TIMETABLE MANAGEMENT SYSTEM
// Next.js Client Component with MySQL Backend
// =============================================================================

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const DAYS = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์']
const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri']

const PRESET_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#14b8a6"]

const DEFAULT_ACADEMIC_YEAR = { year: new Date().getFullYear() + 543, semester: 1 }

// =============================================================================
// SWEETALERT2 HELPERS (Same pattern as expenses/page.js)
// =============================================================================

const getSwal = async () => {
  const { default: Swal } = await import("sweetalert2")
  return Swal
}

const getSwalBase = () => {
  const isDarkMode = document.documentElement.classList.contains("dark")
  return isDarkMode
    ? {
        background: "#13132a", color: "#eeeef8", confirmButtonColor: "#6366f1",
        cancelButtonColor: "transparent",
        scrollbarPadding: false, heightAuto: false,
        customClass: {
          popup: "swal2-ent swal2-ent-dark", title: "swal2-ent-title", htmlContainer: "swal2-ent-html",
          confirmButton: "swal2-ent-confirm", cancelButton: "swal2-ent-cancel",
          actions: "swal2-ent-actions",
        },
      }
    : {
        background: "#ffffff", color: "#18182e", confirmButtonColor: "#6366f1",
        cancelButtonColor: "transparent",
        scrollbarPadding: false, heightAuto: false,
        customClass: {
          popup: "swal2-ent swal2-ent-light", title: "swal2-ent-title-light", htmlContainer: "swal2-ent-html-light",
          confirmButton: "swal2-ent-confirm", cancelButton: "swal2-ent-cancel-light",
          actions: "swal2-ent-actions",
        },
      }
}

const getToastPreset = () => {
  const base = getSwalBase()
  const isMobile = window.innerWidth < 640
  return {
    ...base, toast: true,
    position: isMobile ? "top" : "top-end",
    showConfirmButton: false, timer: 2800, timerProgressBar: true,
    width: isMobile ? "calc(100vw - 24px)" : "340px",
  }
}

// =============================================================================
// MINIMAL CSS (Same glassmorphic pattern as expenses)
// =============================================================================
const minimalCss = `
  @keyframes fadeUp {
    from { opacity:0; transform: translateY(14px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes fadeInBg  { from { opacity:0; } to { opacity:1; } }
  @keyframes slideUpModal {
    from { opacity:0; transform: translateY(20px) translateZ(0); }
    to   { opacity:1; transform: translateY(0) translateZ(0); }
  }
  @keyframes slideUpModalMobile {
    from { opacity:0; transform: translateY(100%) translateZ(0); }
    to   { opacity:1; transform: translateY(0) translateZ(0); }
  }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .stagger-1 { animation: fadeUp .45s ease .05s both; }
  .stagger-2 { animation: fadeUp .45s ease .13s both; }
  .stagger-3 { animation: fadeUp .45s ease .21s both; }
  .modal-anim    { animation: slideUpModal .25s cubic-bezier(.22,1,.36,1) both; will-change: transform, opacity; transform: translateZ(0); }
  .modal-anim-mobile { animation: slideUpModalMobile .28s cubic-bezier(.22,1,.36,1) both; will-change: transform, opacity; transform: translateZ(0); }
  .backdrop-anim { animation: fadeInBg .2s ease both; }
  
  input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(.45); cursor:pointer; }
  .dark input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(.7); }
  input[type="time"]::-webkit-calendar-picker-indicator { filter:invert(.45); cursor:pointer; }
  .dark input[type="time"]::-webkit-calendar-picker-indicator { filter:invert(.7); }

  /* SweetAlert2 base */
  .swal2-ent {
    border-radius:16px !important;
    box-shadow:0 32px 80px rgba(0,0,0,.35) !important;
    font-family:'Kanit',sans-serif !important;
    width: min(420px, calc(100vw - 24px)) !important;
    padding: 20px !important;
  }
  .swal2-ent.swal2-ent-dark  { background:#13132a !important; border:1px solid rgba(255,255,255,.1) !important; }
  .swal2-ent.swal2-ent-light { background:#ffffff !important; border:1px solid rgba(0,0,0,.09) !important; box-shadow:0 16px 60px rgba(0,0,0,.12) !important; }

  .swal2-ent-title       { color:#eeeef8 !important; font-family:'Kanit',sans-serif !important; font-size:clamp(15px,4vw,18px) !important; font-weight:600 !important; }
  .swal2-ent-title-light { color:#18182e !important; font-family:'Kanit',sans-serif !important; font-size:clamp(15px,4vw,18px) !important; font-weight:600 !important; }

  .swal2-ent-html       { color:#8888aa !important; font-family:'Kanit',sans-serif !important; font-size:clamp(12px,3.5vw,14px) !important; }
  .swal2-ent-html-light { color:#55557a !important; font-family:'Kanit',sans-serif !important; font-size:clamp(12px,3.5vw,14px) !important; }

  .swal2-ent-actions { gap:10px !important; flex-wrap:wrap !important; }
  .swal2-ent-confirm { border-radius:9px !important; font-family:'Kanit',sans-serif !important; font-size:clamp(12px,3.5vw,13px) !important; font-weight:600 !important; padding:9px 20px !important; box-shadow:0 4px 14px rgba(99,102,241,.35) !important; }
  .swal2-ent-cancel       { border-radius:9px !important; font-family:'Kanit',sans-serif !important; font-size:clamp(12px,3.5vw,13px) !important; font-weight:500 !important; padding:9px 20px !important; border:1px solid rgba(255,255,255,.1) !important; color:#8888aa !important; background:rgba(255,255,255,.04) !important; }
  .swal2-ent-cancel:hover { background:rgba(255,255,255,.08) !important; color:#eeeef8 !important; }
  .swal2-ent-cancel-light       { border-radius:9px !important; font-family:'Kanit',sans-serif !important; font-size:clamp(12px,3.5vw,13px) !important; font-weight:500 !important; padding:9px 20px !important; border:1px solid rgba(0,0,0,.1) !important; color:#55557a !important; background:rgba(0,0,0,.03) !important; }
  .swal2-ent-cancel-light:hover { background:rgba(0,0,0,.07) !important; color:#18182e !important; }

  /* success icon */
  .swal2-icon.swal2-success { border-color:rgba(104,217,164,.4) !important; }
  .swal2-icon.swal2-success .swal2-success-ring { border-color:rgba(104,217,164,.3) !important; }
  .swal2-icon.swal2-success [class^=swal2-success-line] { background-color:#68d9a4 !important; }
  .swal2-icon.swal2-success [class^=swal2-success-circular-line],
  .swal2-icon.swal2-success .swal2-success-fix { background-color:#ffffff !important; }
  .swal2-ent-dark .swal2-icon.swal2-success [class^=swal2-success-circular-line],
  .swal2-ent-dark .swal2-icon.swal2-success .swal2-success-fix { background-color:#13132a !important; }

  /* warning icon */
  .swal2-icon.swal2-warning { color:#f5c842 !important; border-color:rgba(245,200,66,.4) !important; }
  .swal2-icon.swal2-warning .swal2-icon-content { color:#f5c842 !important; }

  /* error icon */
  .swal2-icon.swal2-error { border-color:rgba(255,77,109,.4) !important; }
  .swal2-icon.swal2-error [class^=swal2-x-mark-line] { background-color:#ff4d6d !important; }

  .swal2-timer-progress-bar { background:rgba(99,102,241,.6) !important; }

  /* toast */
  .swal2-toast.swal2-ent { border-radius:12px !important; padding:10px 14px !important; width:auto !important; }
  .swal2-toast .swal2-ent-title, .swal2-toast .swal2-ent-title-light { font-size:clamp(11px,3.5vw,13px) !important; }

  /* mobile adjustments */
  @media (max-width:480px) {
    .swal2-popup { margin: 0 12px !important; }
    .swal2-ent { padding:16px !important; }
    .swal2-icon { transform: scale(0.75); margin:0 auto 8px !important; }
    .swal2-ent-actions { width:100% !important; justify-content:stretch !important; }
    .swal2-ent-confirm, .swal2-ent-cancel, .swal2-ent-cancel-light { flex:1 !important; justify-content:center !important; }
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.5); }

  /* Print styles for timetable */
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white !important; }
    .dark { background: white !important; color: black !important; }
  }
`

// =============================================================================
// SHARED CLASS STRINGS (Same as expenses/page.js)
// =============================================================================
const thCls =
  "px-3 sm:px-4 py-2.5 text-left text-[10px] font-bold tracking-[.08em] uppercase " +
  "text-[#9999b8] dark:text-[#55556a] bg-black/[.02] dark:bg-white/[.02] " +
  "border-b border-black/[.06] dark:border-white/[.06] whitespace-nowrap"

const fieldInputCls =
  "w-full h-10 px-3 rounded-lg text-[13px] outline-none appearance-none font-[inherit] " +
  "bg-black/[.03] dark:bg-white/[.03] border border-black/[.08] dark:border-white/[.07] " +
  "text-[#18182e] dark:text-[#eeeef8] " +
  "focus:border-[#6366f1]/50 focus:bg-[#6366f1]/[.04] focus:ring-2 focus:ring-[#6366f1]/10 transition-all"

const fieldLabelCls =
  "text-[10px] font-medium tracking-wider uppercase flex items-center gap-1 text-[#9999b8] dark:text-[#55556a]"

const btnPrimaryCls =
  "h-9 px-5 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] border-0 text-white text-[13px] " +
  "font-semibold flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(99,102,241,.3)] " +
  "hover:-translate-y-px hover:shadow-[0_6px_22px_rgba(99,102,241,.45)] disabled:opacity-50 " +
  "disabled:cursor-not-allowed transition-all font-[inherit] cursor-pointer"

const btnSecondaryCls =
  "h-9 px-4 rounded-lg border border-black/[.08] dark:border-white/[.07] bg-transparent " +
  "text-[#55557a] dark:text-[#8888aa] text-[13px] font-medium cursor-pointer " +
  "hover:border-black/20 dark:hover:border-white/[.14] hover:text-[#18182e] dark:hover:text-[#eeeef8] " +
  "hover:bg-black/[.03] dark:hover:bg-white/[.04] transition-all font-[inherit]"

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const formatThaiDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

const formatThaiDateTime = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return dateStr;
  }
}

const parseTimeValue = (val) => {
  if (!val) return '';
  if (typeof val === 'string' && /^\d{1,2}:\d{2}$/.test(val)) return val;
  if (typeof val === 'string' && val.includes('T')) {
    const timePart = val.split('T')[1];
    if (timePart) {
      const [h, m] = timePart.split(':');
      return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
    }
  }
  if (val instanceof Date) {
    return `${String(val.getHours()).padStart(2, '0')}:${String(val.getMinutes()).padStart(2, '0')}`;
  }
  return String(val).substring(0, 5);
}

const minsToTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// =============================================================================
// STAT CARD COMPONENT
// =============================================================================
function StatCard({ label, value, sub, accent, children, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`relative rounded-2xl border border-black/[.08] dark:border-white/[.07] bg-white dark:bg-[#121221] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-black/20 dark:hover:border-white/[.14] group ${onClick ? 'cursor-pointer' : ''}`}>
      <div className="p-4 sm:p-5 relative z-10">
        <div className="flex items-start justify-between mb-2">
          <span className="text-[10px] font-medium tracking-widest uppercase text-[#9999b8] dark:text-[#55556a] leading-tight pr-1">
            {label}
          </span>
          <div
            className="w-7 h-7 rounded-[7px] flex-shrink-0 bg-black/[.04] dark:bg-white/[.05] border border-black/[.06] dark:border-white/[.07] flex items-center justify-center"
            style={{ color: accent }}
          >
            {children}
          </div>
        </div>
        <p className="text-xl sm:text-[24px] font-bold text-[#18182e] dark:text-[#eeeef8] tracking-tight leading-none break-all">
          {value}
        </p>
        {sub && <p className="text-[11px] text-[#9999b8] dark:text-[#55556a] mt-1.5">{sub}</p>}
      </div>
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 80% 20%,${accent}22,transparent 65%)` }}
      />
    </div>
  )
}

// =============================================================================
// SIDEBAR NAVIGATION ITEM
// =============================================================================
function NavItem({ icon: Icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
        active
          ? 'bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20'
          : 'text-[#55557a] dark:text-[#8888aa] hover:bg-black/[.03] dark:hover:bg-white/[.03]'
      }`}
    >
      <Icon size={18} />
      <span className="text-[13px] font-medium flex-1">{label}</span>
      {badge > 0 && (
        <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-semibold">
          {badge}
        </span>
      )}
    </button>
  )
}

// =============================================================================
// MODAL COMPONENT
// =============================================================================
function Modal({ open, onClose, title, icon: Icon, children, size = "md" }) {
  const isMobileRef = useRef(false);
  
  useEffect(() => {
    isMobileRef.current = window.innerWidth < 640;
  }, []);
  
  useEffect(() => {
    if (open) {
      document.body.style.touchAction = "none";
      document.body.style.overscrollBehavior = "none";
    } else {
      document.body.style.touchAction = "";
      document.body.style.overscrollBehavior = "";
    }
    return () => {
      document.body.style.touchAction = "";
      document.body.style.overscrollBehavior = "";
    };
  }, [open]);
  
  if (!open) return null;
  
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const sizeClasses = {
    sm: "sm:max-w-[400px]",
    md: "sm:max-w-[560px]",
    lg: "sm:max-w-[720px]",
    xl: "sm:max-w-[900px]",
    full: "sm:max-w-[95vw]"
  };
  
  return (
    <div
      className="fixed inset-0 z-[9000] flex items-end sm:items-center justify-center sm:p-5 backdrop-anim"
      style={{
        background: "rgba(4,4,14,.75)",
        backdropFilter: isMobile ? "none" : "blur(8px)",
        WebkitBackdropFilter: isMobile ? "none" : "blur(8px)",
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className={[
          "w-full bg-white dark:bg-[#111127]",
          "border dark:border-white/[.14] border-black/[.1] sm:border",
          "rounded-t-[24px] sm:rounded-[18px] border-b-0 sm:border-b",
          "shadow-[0_32px_80px_rgba(0,0,0,.55)]",
          "max-h-[90dvh] overflow-hidden flex flex-col relative",
          isMobile ? "modal-anim-mobile" : "modal-anim",
          "border-t-2 border-t-[rgba(99,102,241,.55)]",
          sizeClasses[size] || sizeClasses.md
        ].join(" ")}
      >
        {/* Mobile handle */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex justify-center pt-2.5 sm:hidden z-20 pointer-events-none">
          <div className="w-10 h-1.5 rounded-full bg-black/15 dark:bg-white/15" />
        </div>

        {/* Header */}
        <div className="sticky top-0 z-10 px-4 sm:px-5 pt-6 pb-3 sm:py-3.5 border-b border-black/[.07] dark:border-white/[.07] flex items-center justify-between bg-white/90 dark:bg-[#111127]/90 backdrop-blur-md rounded-t-[24px] sm:rounded-none">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center bg-[rgba(99,102,241,.12)] border border-[rgba(99,102,241,.22)] text-[#6366f1]">
                <Icon size={14} />
              </div>
            )}
            <span className="text-[14px] font-semibold text-[#18182e] dark:text-[#eeeef8]">{title}</span>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg border border-black/[.08] dark:border-white/[.07] bg-transparent text-[#9999b8] dark:text-[#55556a] flex items-center justify-center hover:border-black/20 dark:hover:border-white/[.14] hover:text-[#18182e] dark:hover:text-[#eeeef8] transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// CONFIRM DELETE MODAL
// =============================================================================
function ConfirmModal({ open, onClose, onConfirm, title, message }) {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };
  
  return (
    <Modal open={open} onClose={onClose} title={title} icon={Trash2} size="sm">
      <div className="space-y-4">
        <p className="text-[13px] text-[#55557a] dark:text-[#8888aa]">{message}</p>
        <div className="flex gap-2.5 justify-end pt-4 border-t border-black/[.07] dark:border-white/[.07]">
          <button onClick={onClose} className={btnSecondaryCls}>
            ยกเลิก
          </button>
          <button onClick={handleConfirm} className={`${btnPrimaryCls} !bg-gradient-to-br !from-red-500 !to-red-600 hover:!shadow-red-500/30`}>
            <Trash2 size={14} />
            ยืนยันลบ
          </button>
        </div>
      </div>
    </Modal>
  );
}

// =============================================================================
// LOADING OVERLAY
// =============================================================================
function LoadingOverlay({ show, text = "กำลังโหลด..." }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 flex flex-col items-center gap-3 shadow-2xl">
        <div className="w-10 h-10 rounded-full border-3 border-[#6366f1]/20 border-t-[#6366f1] animate-spin" />
        <span className="text-[13px] text-[#55557a] dark:text-[#8888aa]">{text}</span>
      </div>
    </div>
  );
}

// =============================================================================
// EMPTY STATE
// =============================================================================
function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#6366f1]/10 flex items-center justify-center mb-4">
        <Icon size={28} className="text-[#6366f1]" />
      </div>
      <h3 className="text-[15px] font-semibold text-[#18182e] dark:text-[#eeeef8] mb-1">{title}</h3>
      <p className="text-[12px] text-[#9999b8] dark:text-[#55556a] max-w-[200px]">{description}</p>
    </div>
  );
}

// =============================================================================
// BADGE COMPONENT
// =============================================================================
function Badge({ children, color = "#6366f1", type = "default" }) {
  const typeStyles = {
    default: { bg: `${color}15`, border: `${color}30`, text: color },
    success: { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", text: "#059669" },
    warning: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", text: "#d97706" },
    error: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.3)", text: "#ef4444" },
    info: { bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)", text: "#3b82f6" }
  };
  const style = typeStyles[type] || typeStyles.default;
  
  return (
    <span className="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold border"
      style={{ background: style.bg, borderColor: style.border, color: style.text }}>
      {children}
    </span>
  );
}

// =============================================================================
// DAY COLOR HELPERS
// =============================================================================
const getDayColor = (day) => {
  const colors = {
    'จันทร์': 'from-pink-500 to-rose-500',
    'อังคาร': 'from-orange-500 to-amber-500',
    'พุธ': 'from-emerald-500 to-green-500',
    'พฤหัสบดี': 'from-blue-500 to-indigo-500',
    'ศุกร์': 'from-violet-500 to-purple-500'
  };
  return colors[day] || 'from-gray-500 to-gray-600';
}

const getDayBgColor = (day) => {
  const colors = {
    'จันทร์': 'bg-pink-500',
    'อังคาร': 'bg-orange-500',
    'พุธ': 'bg-emerald-500',
    'พฤหัสบดี': 'bg-blue-500',
    'ศุกร์': 'bg-violet-500'
  };
  return colors[day] || 'bg-gray-500';
}

// =============================================================================
// MAIN SCHOOL TIMETABLE MANAGEMENT SYSTEM PAGE
// =============================================================================
export default function SchoolTimetableSystem() {
  // ─── STATE ─────────────────────────────────────────────────────────────────
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // Data states
  const [schoolInfo, setSchoolInfo] = useState({ schoolName: '', affiliation: '', logoURL: '', address: '', phone: '', email: '' })
  const [academicYears, setAcademicYears] = useState([])
  const [admins, setAdmins] = useState([])
  const [periods, setPeriods] = useState([])
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [assignments, setAssignments] = useState([])
  const [timetable, setTimetable] = useState([])
  const [activityLog, setActivityLog] = useState([])
  
  // Form states
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '', onConfirm: null })
  
  // Timetable builder states
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [timetableGrid, setTimetableGrid] = useState({})
  
  // View states
  const [viewMode, setViewMode] = useState('class') // 'class' or 'teacher'
  const [viewSelected, setViewSelected] = useState('')
  
  // ─── EFFECTS ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("theme")
    const prefersDark = stored === "dark"
    setIsDark(prefersDark)
    document.documentElement.classList.toggle("dark", prefersDark)
    setMounted(true)
    
    // Load all data
    loadAllData()
  }, [])
  
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
    localStorage.setItem("theme", isDark ? "dark" : "light")
  }, [isDark])
  
  // ─── DATA LOADING ──────────────────────────────────────────────────────────
  const loadAllData = async () => {
    setLoading(true)
    try {
      // Simulated data loading - replace with actual API calls
      await Promise.all([
        loadSchoolInfo(),
        loadAcademicYears(),
        loadAdmins(),
        loadPeriods(),
        loadSubjects(),
        loadTeachers(),
        loadAssignments(),
        loadTimetable(),
        loadActivityLog()
      ])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const loadSchoolInfo = async () => {
    // Replace with actual API call
    setSchoolInfo({
      schoolName: 'โรงเรียนตัวอย่าง',
      affiliation: 'สำนักงานเขตพื้นที่การศึกษา',
      logoURL: '',
      address: '123 ถนนตัวอย่าง',
      phone: '02-123-4567',
      email: 'school@example.ac.th'
    })
  }
  
  const loadAcademicYears = async () => {
    const currentYear = new Date().getFullYear() + 543
    setAcademicYears([
      { id: '1', year: currentYear, semester: 1, startDate: `${currentYear-543}-05-01`, endDate: `${currentYear-543}-09-30`, isActive: true },
      { id: '2', year: currentYear, semester: 2, startDate: `${currentYear-543}-10-01`, endDate: `${currentYear-543+1}-02-28`, isActive: false }
    ])
  }
  
  const loadAdmins = async () => {
    setAdmins([
      { id: '1', title: 'นาย', firstName: 'สมชาย', lastName: 'ใจดี', position: 'ผู้อำนวยการ' },
      { id: '2', title: 'นาง', firstName: 'สมหญิง', lastName: 'รักเรียน', position: 'รองผู้อำนวยการ' }
    ])
  }
  
  const loadPeriods = async () => {
    setPeriods([
      { id: '1', periodNumber: 1, startTime: '08:30', endTime: '09:20', isActive: true, label: 'คาบที่ 1' },
      { id: '2', periodNumber: 2, startTime: '09:20', endTime: '10:10', isActive: true, label: 'คาบที่ 2' },
      { id: '3', periodNumber: 3, startTime: '10:10', endTime: '11:00', isActive: true, label: 'คาบที่ 3' },
      { id: '4', periodNumber: 4, startTime: '11:00', endTime: '11:50', isActive: true, label: 'คาบที่ 4' },
      { id: '5', periodNumber: 5, startTime: '12:50', endTime: '13:40', isActive: true, label: 'คาบที่ 5 (บ่าย)' },
      { id: '6', periodNumber: 6, startTime: '13:40', endTime: '14:30', isActive: true, label: 'คาบที่ 6' },
      { id: '7', periodNumber: 7, startTime: '14:30', endTime: '15:20', isActive: true, label: 'คาบที่ 7' },
      { id: '8', periodNumber: 8, startTime: '15:20', endTime: '16:10', isActive: true, label: 'คาบที่ 8' }
    ])
  }
  
  const loadSubjects = async () => {
    setSubjects([
      { id: '1', code: 'ท31101', name: 'ภาษาไทยพื้นฐาน', periodsPerWeek: 5, type: 'พื้นฐาน', classroom: 'ม.1/1' },
      { id: '2', code: 'ค31101', name: 'คณิตศาสตร์พื้นฐาน', periodsPerWeek: 5, type: 'พื้นฐาน', classroom: 'ม.1/1' },
      { id: '3', code: 'ว31101', name: 'วิทยาศาสตร์พื้นฐาน', periodsPerWeek: 4, type: 'พื้นฐาน', classroom: 'ม.1/1' },
      { id: '4', code: 'อ31101', name: 'ภาษาอังกฤษพื้นฐาน', periodsPerWeek: 4, type: 'พื้นฐาน', classroom: 'ม.1/1' },
      { id: '5', code: 'ส31101', name: 'สังคมศึกษาพื้นฐาน', periodsPerWeek: 3, type: 'พื้นฐาน', classroom: 'ม.1/1' },
      { id: '6', code: 'พ31101', name: 'สุขศึกษาและพลศึกษา', periodsPerWeek: 3, type: 'พื้นฐาน', classroom: 'ม.1/1' },
      { id: '7', code: 'ศ31101', name: 'ศิลปะ', periodsPerWeek: 2, type: 'พื้นฐาน', classroom: 'ม.1/1' },
      { id: '8', code: 'ง31101', name: 'การงานอาชีพ', periodsPerWeek: 2, type: 'พื้นฐาน', classroom: 'ม.1/1' }
    ])
  }
  
  const loadTeachers = async () => {
    setTeachers([
      { id: '1', prefix: 'นาย', firstName: 'สมศักดิ์', lastName: 'รักการสอน', department: 'ภาษาไทย' },
      { id: '2', prefix: 'นาง', firstName: 'มณีรัตน์', lastName: 'คณิตศาสตร์ดี', department: 'คณิตศาสตร์' },
      { id: '3', prefix: 'นาย', firstName: 'วิทยา', lastName: 'วิทย์เก่ง', department: 'วิทยาศาสตร์' },
      { id: '4', prefix: 'นางสาว', firstName: 'อังกฤษ', lastName: 'ภาษาดี', department: 'ภาษาต่างประเทศ' },
      { id: '5', prefix: 'นาย', firstName: 'สังคม', lastName: 'สงเคราะห์', department: 'สังคมศึกษา' }
    ])
  }
  
  const loadAssignments = async () => {
    setAssignments([
      { id: '1', teacherId: '1', subjectId: '1', classroom: 'ม.1/1', academicYearId: '1' },
      { id: '2', teacherId: '2', subjectId: '2', classroom: 'ม.1/1', academicYearId: '1' },
      { id: '3', teacherId: '3', subjectId: '3', classroom: 'ม.1/1', academicYearId: '1' },
      { id: '4', teacherId: '4', subjectId: '4', classroom: 'ม.1/1', academicYearId: '1' },
      { id: '5', teacherId: '5', subjectId: '5', classroom: 'ม.1/1', academicYearId: '1' }
    ])
  }
  
  const loadTimetable = async () => {
    setTimetable([
      { id: '1', day: 'จันทร์', period: 1, subjectId: '1', teacherId: '1', classroom: 'ม.1/1', academicYearId: '1' },
      { id: '2', day: 'จันทร์', period: 2, subjectId: '2', teacherId: '2', classroom: 'ม.1/1', academicYearId: '1' }
    ])
  }
  
  const loadActivityLog = async () => {
    setActivityLog([
      { id: '1', action: 'LOGIN', user: 'admin', detail: 'เข้าสู่ระบบ', timestamp: new Date().toISOString() },
      { id: '2', action: 'ADD_SUBJECT', user: 'admin', detail: 'เพิ่มรายวิชา ท31101', timestamp: new Date().toISOString() }
    ])
  }
  
  // ─── HELPERS ───────────────────────────────────────────────────────────────
  const fireToast = async (icon, title) => {
    const Swal = await getSwal()
    Swal.fire({ ...getToastPreset(), icon, title })
  }
  
  const openModal = (type, item = null) => {
    setModalType(type)
    setEditingItem(item)
    setShowModal(true)
  }
  
  const closeModal = () => {
    setShowModal(false)
    setModalType('')
    setEditingItem(null)
  }
  
  const confirmDeleteAction = (id, name, onConfirm) => {
    setConfirmDelete({ open: true, id, name, onConfirm })
  }
  
  // ─── SECTIONS RENDER ─────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="relative rounded-2xl border border-black/[.08] dark:border-white/[.07] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] p-6 text-white overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">ยินดีต้อนรับสู่ระบบจัดตารางเรียน</h1>
          <p className="text-white/80 text-sm">{schoolInfo.schoolName || 'โรงเรียนตัวอย่าง'}</p>
          <p className="text-white/60 text-xs mt-1">{schoolInfo.affiliation || 'สำนักงานเขตพื้นที่การศึกษา'}</p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-full opacity-10">
          <School size={200} className="absolute right-4 top-4" />
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="รายวิชา" value={subjects.length} accent="#6366f1" sub={`${subjects.filter(s => s.type === 'พื้นฐาน').length} พื้นฐาน`}>
          <BookOpen size={18} />
        </StatCard>
        <StatCard label="ครูผู้สอน" value={teachers.length} accent="#8b5cf6" sub={`${new Set(teachers.map(t => t.department)).size} กลุ่มสาระ`}>
          <GraduationCap size={18} />
        </StatCard>
        <StatCard label="ห้องเรียน" value={[...new Set(subjects.map(s => s.classroom))].length} accent="#ec4899" sub={`${assignments.length} การจัดครู`}>
          <Building2 size={18} />
        </StatCard>
        <StatCard label="คาบเรียน" value={periods.filter(p => p.isActive).length} accent="#10b981" sub="ต่อวัน">
          <Clock size={18} />
        </StatCard>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-black/[.08] dark:border-white/[.07] bg-white dark:bg-[#121221] p-5">
          <h3 className="text-sm font-semibold text-[#18182e] dark:text-[#eeeef8] mb-4 flex items-center gap-2">
            <Activity size={16} className="text-[#6366f1]" />
            กิจกรรมล่าสุด
          </h3>
          <div className="space-y-3">
            {activityLog.slice(0, 5).map((log, i) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-black/[.02] dark:bg-white/[.02]">
                <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">📝</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#18182e] dark:text-[#eeeef8] truncate">{log.action}</p>
                  <p className="text-[11px] text-[#9999b8] dark:text-[#55556a] truncate">{log.detail}</p>
                  <p className="text-[10px] text-[#9999b8] dark:text-[#55556a]">{formatThaiDateTime(log.timestamp)}</p>
                </div>
              </div>
            ))}
            {activityLog.length === 0 && (
              <p className="text-center text-[#9999b8] dark:text-[#55556a] text-sm py-4">ไม่มีกิจกรรมล่าสุด</p>
            )}
          </div>
        </div>
        
        <div className="rounded-2xl border border-black/[.08] dark:border-white/[.07] bg-white dark:bg-[#121221] p-5">
          <h3 className="text-sm font-semibold text-[#18182e] dark:text-[#eeeef8] mb-4 flex items-center gap-2">
            <Users size={16} className="text-[#6366f1]" />
            ผู้บริหาร
          </h3>
          <div className="space-y-3">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center gap-3 p-3 rounded-xl bg-black/[.02] dark:bg-white/[.02]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-bold text-sm">
                  {admin.firstName[0]}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#18182e] dark:text-[#eeeef8]">{admin.title}{admin.firstName} {admin.lastName}</p>
                  <p className="text-[11px] text-[#9999b8] dark:text-[#55556a]">{admin.position}</p>
                </div>
              </div>
            ))}
            {admins.length === 0 && (
              <p className="text-center text-[#9999b8] dark:text-[#55556a] text-sm py-4">ไม่มีข้อมูลผู้บริหาร</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
  
  // Render other sections... (simplified for brevity)
  const renderSchoolInfo = () => (
    <div className="max-w-2xl">
      <div className="rounded-2xl border border-black/[.08] dark:border-white/[.07] bg-white dark:bg-[#121221] p-6">
        <h2 className="text-lg font-semibold text-[#18182e] dark:text-[#eeeef8] mb-6">ข้อมูลโรงเรียน</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={fieldLabelCls}><Building2 size={12} />ชื่อโรงเรียน</label>
            <input type="text" value={schoolInfo.schoolName} onChange={e => setSchoolInfo({...schoolInfo, schoolName: e.target.value})} className={fieldInputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={fieldLabelCls}><School size={12} />สังกัด</label>
            <input type="text" value={schoolInfo.affiliation} onChange={e => setSchoolInfo({...schoolInfo, affiliation: e.target.value})} className={fieldInputCls} />
          </div>
          <div>
            <label className={fieldLabelCls}><MapPin size={12} />ที่อยู่</label>
            <input type="text" value={schoolInfo.address} onChange={e => setSchoolInfo({...schoolInfo, address: e.target.value})} className={fieldInputCls} />
          </div>
          <div>
            <label className={fieldLabelCls}><Phone size={12} />โทรศัพท์</label>
            <input type="text" value={schoolInfo.phone} onChange={e => setSchoolInfo({...schoolInfo, phone: e.target.value})} className={fieldInputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={fieldLabelCls}><Mail size={12} />อีเมล</label>
            <input type="email" value={schoolInfo.email} onChange={e => setSchoolInfo({...schoolInfo, email: e.target.value})} className={fieldInputCls} />
          </div>
        </div>
        <div className="mt-6">
          <button onClick={() => fireToast('success', 'บันทึกข้อมูลเรียบร้อย')} className={btnPrimaryCls}>
            <Save size={14} /> บันทึกข้อมูล
          </button>
        </div>
      </div>
    </div>
  )
  
  // ─── MAIN RENDER ───────────────────────────────────────────────────────────
  if (!mounted) {
    return (
      <div className="h-screen w-full bg-[#f8fafc] dark:bg-[#0a0a10] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-2 border-[#6366f1]/30 border-t-[#6366f1] animate-spin mx-auto mb-4" />
          <p className="text-[14px] text-[#9999b8] dark:text-[#55556a] tracking-widest uppercase">กำลังโหลด...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0a10] transition-colors duration-300">
      <style>{minimalCss}</style>
      <LoadingOverlay show={loading} />
      
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 z-40 w-64 bg-white dark:bg-[#121221] border-r border-black/[.08] dark:border-white/[.07] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-black/[.08] dark:border-white/[.07]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white">
              <School size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#18182e] dark:text-[#eeeef8] leading-tight">ระบบจัดตารางเรียน</p>
              <p className="text-[10px] text-[#9999b8] dark:text-[#55556a]">School Timetable</p>
            </div>
          </div>
        </div>
        
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          <div className="text-[10px] font-semibold text-[#9999b8] dark:text-[#55556a] uppercase tracking-wider px-3 py-2">เมนูหลัก</div>
          <NavItem icon={LayoutGrid} label="หน้าหลัก" active={activeSection === 'dashboard'} onClick={() => setActiveSection('dashboard')} />
          <NavItem icon={Building2} label="ข้อมูลโรงเรียน" active={activeSection === 'schoolInfo'} onClick={() => setActiveSection('schoolInfo')} />
          <NavItem icon={Calendar} label="ปีการศึกษา" active={activeSection === 'academicYears'} onClick={() => setActiveSection('academicYears')} />
          <NavItem icon={UserCog} label="ผู้บริหาร" active={activeSection === 'admins'} onClick={() => setActiveSection('admins')} />
          <NavItem icon={Clock} label="กำหนดเวลาเรียน" active={activeSection === 'periods'} onClick={() => setActiveSection('periods')} />
          
          <div className="text-[10px] font-semibold text-[#9999b8] dark:text-[#55556a] uppercase tracking-wider px-3 py-2 mt-4">ข้อมูลพื้นฐาน</div>
          <NavItem icon={BookOpen} label="รายวิชา" active={activeSection === 'subjects'} onClick={() => setActiveSection('subjects')} />
          <NavItem icon={GraduationCap} label="ครูผู้สอน" active={activeSection === 'teachers'} onClick={() => setActiveSection('teachers')} />
          <NavItem icon={Users} label="จัดครูผู้สอน" active={activeSection === 'assignments'} onClick={() => setActiveSection('assignments')} />
          
          <div className="text-[10px] font-semibold text-[#9999b8] dark:text-[#55556a] uppercase tracking-wider px-3 py-2 mt-4">ตารางเรียน</div>
          <NavItem icon={Grid3X3} label="จัดตารางเรียน" active={activeSection === 'timetableBuilder'} onClick={() => setActiveSection('timetableBuilder')} />
          <NavItem icon={Eye} label="ดู/พิมพ์ตาราง" active={activeSection === 'timetableView'} onClick={() => setActiveSection('timetableView')} />
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-black/[.08] dark:border-white/[.07] bg-white dark:bg-[#121221]">
          <button onClick={() => window.location.href = '/'} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-red-500 hover:bg-red-500/10 transition-all">
            <LogOut size={18} />
            <span className="text-[13px] font-medium">ออกจากระบบ</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#121221]/80 backdrop-blur-md border-b border-black/[.08] dark:border-white/[.07]">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-black/[.05] dark:hover:bg-white/[.05] text-[#55557a] dark:text-[#8888aa]">
                <Menu size={20} />
              </button>
              <h1 className="text-lg font-semibold text-[#18182e] dark:text-[#eeeef8]">
                {activeSection === 'dashboard' && 'หน้าหลัก'}
                {activeSection === 'schoolInfo' && 'ข้อมูลโรงเรียน'}
                {activeSection === 'academicYears' && 'ปีการศึกษา'}
                {activeSection === 'admins' && 'ผู้บริหาร'}
                {activeSection === 'periods' && 'กำหนดเวลาเรียน'}
                {activeSection === 'subjects' && 'รายวิชา'}
                {activeSection === 'teachers' && 'ครูผู้สอน'}
                {activeSection === 'assignments' && 'จัดครูผู้สอน'}
                {activeSection === 'timetableBuilder' && 'จัดตารางเรียน'}
                {activeSection === 'timetableView' && 'ดู/พิมพ์ตาราง'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-lg hover:bg-black/[.05] dark:hover:bg-white/[.05] text-[#55557a] dark:text-[#8888aa]">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <div className="p-6">
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'schoolInfo' && renderSchoolInfo()}
          {/* Other sections would be implemented similarly */}
          {activeSection !== 'dashboard' && activeSection !== 'schoolInfo' && (
            <EmptyState 
              icon={Construction} 
              title="อยู่ระหว่างพัฒนา" 
              description="ฟีเจอร์นี้กำลังอยู่ระหว่างการพัฒนา กรุณากลับมาใหม่ภายหลัง"
            />
          )}
        </div>
      </main>
      
      {/* Confirm Delete Modal */}
      <ConfirmModal 
        open={confirmDelete.open} 
        onClose={() => setConfirmDelete({ open: false, id: null, name: '', onConfirm: null })}
        onConfirm={confirmDelete.onConfirm}
        title="ยืนยันการลบ"
        message={`คุณต้องการลบ "${confirmDelete.name}" ใช่หรือไม่?`}
      />
    </div>
  )
}

// Construction icon for empty state
function Construction({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="6" width="20" height="8" rx="1" />
      <path d="M17 14v7" />
      <path d="M7 14v7" />
      <path d="M17 3v3" />
      <path d="M7 3v3" />
      <path d="M10.5 14 12 9l1.5 5" />
      <path d="M8.5 9 12 3l3.5 6" />
    </svg>
  )
}
