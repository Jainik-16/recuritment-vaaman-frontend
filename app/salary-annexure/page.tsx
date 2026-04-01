"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    ArrowLeft, FileText, Calendar, Briefcase, Building2,
    Plus, Trash2, User, CheckCircle2, AlertCircle,
    Menu, X, Home, ChevronRight, Upload, Users, MessageSquare,
    Zap, UserCheck, LogOut, DollarSign, Hash, RefreshCw,
} from "lucide-react"
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,
} from "@/components/ui/command"
import {
    Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { getFrappeCSRF } from "@/lib/csrf"

const API_MODULE_PATH = "resume.api.salary_annexure"
const API_BASE_URL = "https://ats.octavision.in"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sa {
    --sb-w:      265px;
    --sb:        #1e1e2d;
    --sb-hover:  #2b2b40;
    --sb-bdr:    rgba(255,255,255,.07);
    --sb-txt:    #9899ac;
    --sb-lbl:    #474761;
    --accent:    #009ef7;
    --accent-h:  #007ec4;
    --accent-lt: #e0f4ff;
    --accent-md: rgba(0,158,247,.15);
    --bg:        #f0f8fe;
    --card:      #ffffff;
    --border:    #cce8f8;
    --border-s:  #ddf0fb;
    --t1:        #0d1b2a;
    --t2:        #2d5a78;
    --t3:        #6a9cb8;
    --green:     #16a34a;
    --green-lt:  #dcfce7;
    --red:       #dc2626;
    --red-lt:    #fee2e2;
    --purple:    #7c3aed;
    --purple-lt: #ede9fe;
    --amber:     #d97706;
    --amber-lt:  #fef3c7;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13.5px;
    -webkit-font-smoothing: antialiased;
  }

  .sa-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  /* ══ SIDEBAR ══ */
  .sa-sb {
    width: var(--sb-w); background: var(--sb); min-height: 100vh;
    position: fixed; top: 0; left: 0; z-index: 100; display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .sa-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }
  .sa-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }
  .sa-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(0,158,247,.15); border: 1px solid rgba(0,158,247,.25);
    display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
  }
  .sa-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .sa-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; line-height: 1.25; }
  .sa-sb-sub { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
  .sa-sb-close {
    margin-left: auto; flex-shrink: 0; width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer; color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center; transition: all .14s;
  }
  .sa-sb-close:hover { background: var(--sb-hover); color: #fff; }
  .sa-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .sa-nav::-webkit-scrollbar { width: 3px; }
  .sa-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }
  .sa-nav-cta {
    display: flex; align-items: center; gap: 9px; padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md); border: 1px solid rgba(0,158,247,.28);
    color: var(--accent); font-size: 13px; font-weight: 600; text-decoration: none;
    transition: background .15s; margin-bottom: 22px; letter-spacing: -0.1px;
  }
  .sa-nav-cta:hover { background: rgba(0,158,247,.24); }
  .sa-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
  }
  .sa-nav-link {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt); text-decoration: none; transition: all .14s;
  }
  .sa-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; transition: opacity .14s; }
  .sa-nav-link:hover { background: var(--sb-hover); color: #fff; }
  .sa-nav-link:hover svg { opacity: 1; }
  .sa-nav-link.active { background: var(--accent-md); color: var(--accent); border: 1px solid rgba(0,158,247,.2); }
  .sa-nav-link.active svg { opacity: 1; }
  .sa-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .sa-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; border-radius: 8px; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--sb-lbl); text-align: left; transition: all .14s;
  }
  .sa-logout svg { opacity: .6; width: 15px; height: 15px; }
  .sa-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }
  .sa-overlay {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
  }
  @media (max-width: 768px) { .sa-overlay.show { display: block; } }

  /* ══ MAIN ══ */
  .sa-main {
    margin-left: var(--sb-w); flex: 1; display: flex; flex-direction: column;
    min-height: 100vh; transition: margin-left .25s cubic-bezier(.4,0,.2,1);
  }
  .sa-main.sb-closed { margin-left: 0; }
  .sa-header {
    height: 60px; background: #fff; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 0 rgba(0,158,247,.08);
  }
  .sa-toggle {
    width: 34px; height: 34px; border-radius: 8px; background: none;
    border: 1px solid var(--border); cursor: pointer; display: flex;
    align-items: center; justify-content: center; color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .sa-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .sa-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .sa-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
  .sa-crumb svg { width: 13px; height: 13px; color: var(--t3); }
  .sa-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }

  /* ══ PAGE ══ */
  .sa-page-outer { flex: 1; display: flex; justify-content: center; padding: 28px 32px; }
  .sa-page { width: 100%; max-width: 1000px; display: flex; flex-direction: column; gap: 22px; }

  /* toolbar */
  .sa-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
  .sa-page-title { font-size: 21px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; line-height: 1.15; }
  .sa-page-sub { font-size: 13px; color: var(--t3); margin-top: 5px; }
  .sa-back-btn {
    display: flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--card); color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .14s;
  }
  .sa-back-btn:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

  /* ══ CARDS ══ */
  .sa-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 14px;
    overflow: hidden; box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .sa-card-head {
    padding: 16px 22px; border-bottom: 1px solid var(--border-s);
    background: linear-gradient(to right, #f8fbff, #eef7ff);
    display: flex; align-items: center; justify-content: space-between;
  }
  .sa-card-head-left { display: flex; align-items: center; gap: 10px; }
  .sa-card-head-icon {
    width: 34px; height: 34px; border-radius: 9px;
    background: linear-gradient(135deg, var(--accent), #3b82f6);
    display: flex; align-items: center; justify-content: center;
  }
  .sa-card-head-icon.green { background: linear-gradient(135deg, #16a34a, #15803d); }
  .sa-card-head-icon.purple { background: linear-gradient(135deg, #a855f7, #7e22ce); }
  .sa-card-head-icon.amber { background: linear-gradient(135deg, #f59e0b, #d97706); }
  .sa-card-head-icon svg { color: #fff; width: 16px; height: 16px; }
  .sa-card-title { font-size: 14px; font-weight: 700; color: var(--t1); letter-spacing: -0.2px; }
  .sa-card-body { padding: 24px; }

  /* badge */
  .sa-badge {
    display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px;
    font-size: 11.5px; font-weight: 600; border: 1px solid transparent;
  }
  .sa-badge.blue { background: var(--accent-lt); color: var(--accent); border-color: rgba(0,158,247,.25); }
  .sa-badge.green { background: var(--green-lt); color: var(--green); border-color: rgba(22,163,74,.25); }

  /* ══ FORM ══ */
  .sa-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .sa-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
  .sa-field { display: flex; flex-direction: column; gap: 6px; }
  .sa-label {
    display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600;
    color: var(--t2); letter-spacing: 0.02em;
  }
  .sa-label svg { width: 13px; height: 13px; color: var(--accent); flex-shrink: 0; }
  .sa-req { color: #ef4444; margin-left: 2px; }
  .sa-input {
    height: 42px; padding: 0 12px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--bg); color: var(--t1); font-family: 'Inter', sans-serif; font-size: 13.5px;
    outline: none; transition: all .15s; width: 100%;
  }
  .sa-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-lt); }
  .sa-input::placeholder { color: var(--t3); }
  .sa-input:disabled { opacity: 0.65; cursor: not-allowed; background: #f0f4f8; }
  .sa-input-readonly {
    height: 42px; padding: 0 12px; border-radius: 8px; border: 1px solid var(--border-s);
    background: linear-gradient(to right, #f8fbff, #eef7ff); color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13.5px; width: 100%;
    display: flex; align-items: center; font-weight: 600;
  }

  /* hint text */
  .sa-hint { display: flex; align-items: center; gap: 5px; font-size: 11.5px; color: var(--accent); margin-top: 4px; }
  .sa-hint svg { width: 12px; height: 12px; }
  .sa-hint.amber { color: var(--amber); }

  /* ══ ALERT BANNERS ══ */
  .sa-alert {
    border-radius: 10px; padding: 14px 16px; display: flex; align-items: flex-start; gap: 12px;
  }
  .sa-alert.blue { background: var(--accent-lt); border: 1px solid rgba(0,158,247,.25); }
  .sa-alert.green { background: var(--green-lt); border: 1px solid rgba(22,163,74,.25); }
  .sa-alert-icon { flex-shrink: 0; margin-top: 1px; }
  .sa-alert.blue .sa-alert-icon svg { color: var(--accent); width: 16px; height: 16px; }
  .sa-alert.green .sa-alert-icon svg { color: var(--green); width: 16px; height: 16px; }
  .sa-alert-title { font-size: 13px; font-weight: 700; color: var(--t1); }
  .sa-alert-sub { font-size: 11.5px; color: var(--t2); margin-top: 3px; }
  .sa-spin {
    width: 16px; height: 16px; border: 2px solid rgba(0,158,247,.25); border-top-color: var(--accent);
    border-radius: 50%; animation: sa-spin 1s linear infinite; flex-shrink: 0;
  }
  @keyframes sa-spin { to { transform: rotate(360deg); } }

  /* ══ SALARY COMPONENTS TABLE ══ */
  .sa-table-wrap { overflow-x: auto; }
  .sa-table { width: 100%; border-collapse: collapse; }
  .sa-table thead tr { background: linear-gradient(to right, #f8fbff, #eef7ff); border-bottom: 1px solid var(--border-s); }
  .sa-table th {
    padding: 10px 14px; text-align: left; font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em; color: var(--t2); white-space: nowrap;
  }
  .sa-table tbody tr { border-bottom: 1px solid var(--border-s); transition: background .12s; }
  .sa-table tbody tr:last-child { border-bottom: none; }
  .sa-table tbody tr:hover { background: #f8fbff; }
  .sa-table td { padding: 9px 14px; vertical-align: middle; }
  .sa-table-num { font-size: 12px; font-weight: 600; color: var(--t3); }
  .sa-table-comp { font-size: 13px; font-weight: 600; color: var(--t1); white-space: nowrap; }
  .sa-section-badge {
    display: inline-flex; align-items: center; justify-content: center;
    width: 24px; height: 24px; border-radius: 6px; font-size: 11px; font-weight: 700;
  }
  .sa-section-badge.A { background: var(--accent-lt); color: var(--accent); border: 1px solid rgba(0,158,247,.2); }
  .sa-section-badge.B { background: var(--purple-lt); color: var(--purple); border: 1px solid rgba(124,58,237,.2); }

  .sa-amount-input {
    height: 38px; padding: 0 10px 0 28px; border-radius: 7px; border: 1px solid var(--border);
    background: var(--bg); color: var(--t1); font-family: 'Inter', sans-serif; font-size: 13px;
    outline: none; transition: all .15s; width: 100%; min-width: 110px; font-weight: 500;
  }
  .sa-amount-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-lt); }
  .sa-amount-input:disabled { opacity: 0.65; background: #f0f4f8; cursor: not-allowed; }
  .sa-amount-wrap { position: relative; }
  .sa-amount-symbol {
    position: absolute; left: 9px; top: 50%; transform: translateY(-50%);
    font-size: 12px; font-weight: 600; color: var(--t3); pointer-events: none;
  }
  .sa-amount-readonly {
    height: 38px; padding: 0 10px 0 28px; border-radius: 7px; border: 1px solid var(--border-s);
    background: linear-gradient(to right, #f8fbff, #eef7ff); color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; width: 100%; min-width: 110px;
    display: flex; align-items: center; font-weight: 600; position: relative;
  }

  /* ══ TOTALS GRID ══ */
  .sa-totals-grid {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; padding: 20px 24px;
    background: linear-gradient(135deg, #f8fbff, #eef7ff); border-top: 1px solid var(--border-s);
  }
  .sa-total-item { display: flex; flex-direction: column; gap: 4px; }
  .sa-total-lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--t3); }
  .sa-total-val {
    font-size: 15px; font-weight: 700; color: var(--t1);
    display: flex; align-items: center; gap: 4px;
  }
  .sa-total-val.accent { color: var(--accent); }
  .sa-total-val.green { color: var(--green); }
  .sa-total-val.purple { color: var(--purple); }
  .sa-total-divider {
    grid-column: 1 / -1; height: 1px; background: var(--border-s); margin: 4px 0;
  }

  /* ══ CONDITIONS TABLE ══ */
  .sa-cond-table { width: 100%; border-collapse: collapse; }
  .sa-cond-table thead tr { background: linear-gradient(to right, #f8fbff, #eef7ff); border-bottom: 1px solid var(--border-s); }
  .sa-cond-table th {
    padding: 10px 14px; text-align: left; font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em; color: var(--t2);
  }
  .sa-cond-table tbody tr { border-bottom: 1px solid var(--border-s); transition: background .12s; }
  .sa-cond-table tbody tr:last-child { border-bottom: none; }
  .sa-cond-table tbody tr:hover { background: #f8fbff; }
  .sa-cond-table td { padding: 10px 14px; vertical-align: top; }
  .sa-cond-text { font-size: 13px; color: var(--t1); line-height: 1.5; }

  /* ══ EMPTY STATE ══ */
  .sa-empty {
    text-align: center; padding: 48px 20px; display: flex; flex-direction: column;
    align-items: center; gap: 10px;
  }
  .sa-empty-icon { color: var(--t3); }
  .sa-empty-title { font-size: 13.5px; font-weight: 600; color: var(--t2); }
  .sa-empty-sub { font-size: 12px; color: var(--t3); }

  /* ══ ACTION BUTTONS ══ */
  .sa-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
  .sa-btn-cancel {
    display: flex; align-items: center; gap: 6px; padding: 10px 20px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--card); color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 500; cursor: pointer; transition: all .14s;
  }
  .sa-btn-cancel:hover { background: #f0f4f8; border-color: #b0c4d4; }
  .sa-btn-submit {
    display: flex; align-items: center; gap: 7px; padding: 10px 28px; border-radius: 8px;
    background: var(--accent); color: #fff; border: none;
    font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: all .15s;
    box-shadow: 0 2px 8px rgba(0,158,247,.3);
  }
  .sa-btn-submit:hover:not(:disabled) { background: var(--accent-h); box-shadow: 0 4px 14px rgba(0,158,247,.4); }
  .sa-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .sa-btn-submit svg { width: 16px; height: 16px; }
  .sa-btn-submit-spin {
    width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    border-radius: 50%; animation: sa-spin 1s linear infinite;
  }

  @media (max-width: 768px) {
    .sa-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .sa-sb.open { transform: translateX(0); }
    .sa-main { margin-left: 0 !important; }
    .sa-page-outer { padding: 16px; }
    .sa-header { padding: 0 16px; }
    .sa-grid-2 { grid-template-columns: 1fr; }
    .sa-grid-3 { grid-template-columns: 1fr; }
    .sa-totals-grid { grid-template-columns: 1fr 1fr; }
  }
`

interface JobApplicant { name: string; applicant_name: string; email_id: string }
interface SalaryComponentTemplate { name: string }
interface ConditionTemplate { name: string }
interface SalaryComponent {
    id: string
    salary_component: string
    section: "A" | "B"
    monthly: number
    annualized: number
}
interface ConditionRow { id: string; condition_text: string }

export default function SalaryAnnexurePage() {
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const [form, setForm] = useState({
        jobApplicant: "",
        salaryComponentTemplate: "",
        conditionTemplate: "",
    })

    const [salaryComponents, setSalaryComponents] = useState<SalaryComponent[]>([])
    const [conditions, setConditions] = useState<ConditionRow[]>([])

    // Totals
    const [totals, setTotals] = useState({
        subA_monthly: 0, subA_annual: 0,
        subB_monthly: 0, subB_annual: 0,
        total_monthly: 0, total_annual: 0,
    })

    // Dropdown data
    const [applicants, setApplicants] = useState<JobApplicant[]>([])
    const [compTemplates, setCompTemplates] = useState<SalaryComponentTemplate[]>([])
    const [condTemplates, setCondTemplates] = useState<ConditionTemplate[]>([])

    const [loading, setLoading] = useState({ applicants: true, compTemplates: true, condTemplates: true })
    const [isSaving, setIsSaving] = useState(false)
    const [loadingTemplate, setLoadingTemplate] = useState(false)
    const [loadingCond, setLoadingCond] = useState(false)

    const [openApplicant, setOpenApplicant] = useState(false)
    const [openCompTemplate, setOpenCompTemplate] = useState(false)
    const [openCondTemplate, setOpenCondTemplate] = useState(false)

    useEffect(() => { document.title = 'Salary Annexure' }, [])
    useEffect(() => {
        fetchApplicants()
        fetchCompTemplates()
        fetchCondTemplates()
    }, [])

    // Recalculate totals whenever salaryComponents change
    useEffect(() => {
        recalcTotals(salaryComponents)
    }, [salaryComponents])

    const recalcTotals = (components: SalaryComponent[]) => {
        let aM = 0, aA = 0, bM = 0, bA = 0
        components.forEach(c => {
            if (c.section === "A") { aM += c.monthly || 0; aA += c.annualized || 0 }
            if (c.section === "B") { bM += c.monthly || 0; bA += c.annualized || 0 }
        })
        setTotals({ subA_monthly: aM, subA_annual: aA, subB_monthly: bM, subB_annual: bA, total_monthly: aM + bM, total_annual: aA + bA })
    }

    const fetchApplicants = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/method/resume.api.offer_letter.get_job_applicants`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
            const data = await res.json()
            setApplicants(data?.message?.data || [])
        } catch { setApplicants([]) }
        finally { setLoading(p => ({ ...p, applicants: false })) }
    }

    const fetchCompTemplates = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_salary_component_templates`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
            const data = await res.json()
            setCompTemplates(data?.message?.data || [])
        } catch { setCompTemplates([]) }
        finally { setLoading(p => ({ ...p, compTemplates: false })) }
    }

    const fetchCondTemplates = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_condition_templates`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
            const data = await res.json()
            setCondTemplates(data?.message?.data || [])
        } catch { setCondTemplates([]) }
        finally { setLoading(p => ({ ...p, condTemplates: false })) }
    }

    const handleCompTemplateChange = async (templateName: string) => {
        setForm(p => ({ ...p, salaryComponentTemplate: templateName }))
        setOpenCompTemplate(false)
        if (!templateName) return
        setLoadingTemplate(true)
        try {
            const res = await fetch(`${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_template_components?template_name=${encodeURIComponent(templateName)}`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
            const data = await res.json()
            const comps = data?.message?.data || []
            setSalaryComponents(comps.map((c: any, i: number) => ({
                id: Date.now().toString() + i,
                salary_component: c.salary_component,
                section: c.section || "A",
                monthly: 0,
                annualized: 0,
            })))
        } catch { setSalaryComponents([]) }
        finally { setLoadingTemplate(false) }
    }

    const handleCondTemplateChange = async (templateName: string) => {
        setForm(p => ({ ...p, conditionTemplate: templateName }))
        setOpenCondTemplate(false)
        if (!templateName) return
        setLoadingCond(true)
        try {
            const res = await fetch(`${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_condition_template_rows?template_name=${encodeURIComponent(templateName)}`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
            const data = await res.json()
            const rows = data?.message?.data || []
            setConditions(rows.map((r: any, i: number) => ({ id: Date.now().toString() + i, condition_text: r.condition_text })))
        } catch { setConditions([]) }
        finally { setLoadingCond(false) }
    }

    //    const updateMonthly = (id: string, value: string) => {
    //          const monthly = parseFloat(value) || 0
    //         setSalaryComponents(prev => prev.map(c =>
    //             c.id === id ? { ...c, monthly, annualized: monthly * 12 } : c
    //         ))
    //     }
    const updateMonthly = (id: string, value: string) => {
        const parsed = parseFloat(value) || 0
        const monthly = parsed < 0 ? 0 : parsed   // ← add this clamp
        setSalaryComponents(prev => prev.map(c =>
            c.id === id ? { ...c, monthly, annualized: monthly * 12 } : c
        ))
    }

    const formatCurrency = (n: number) =>
        n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const resetForm = () => {
        setForm({
            jobApplicant: "",
            salaryComponentTemplate: "",
            conditionTemplate: "",
        })
        setSalaryComponents([])
        setConditions([])
        setTotals({
            subA_monthly: 0, subA_annual: 0,
            subB_monthly: 0, subB_annual: 0,
            total_monthly: 0, total_annual: 0,
        })
    }

    const handleSave = async () => {
        if (!form.jobApplicant) { alert("Please select a Job Applicant"); return }
        setIsSaving(true)
        try {
            const csrfToken = await getFrappeCSRF()
            const payload = {
                custom_job_applicant: form.jobApplicant,
                custom_salary_component_template: form.salaryComponentTemplate,
                custom_condition_template: form.conditionTemplate,
                salary_components: salaryComponents.map(c => ({
                    salary_component: c.salary_component,
                    section: c.section,
                    monthly: c.monthly,
                    annualized: c.annualized,
                })),
                subtotal_a_monthly: totals.subA_monthly,
                subtotal_a_annual: totals.subA_annual,
                subtotal_b_monthly: totals.subB_monthly,
                subtotal_b_annual: totals.subB_annual,
                total_monthly: totals.total_monthly,
                total_annual: totals.total_annual,
                conditions: conditions.map(c => ({ condition_text: c.condition_text })),
            }
            const res = await fetch(
                `${API_BASE_URL}/api/method/${API_MODULE_PATH}.create_salary_annexure`,
                {
                    method: 'POST', credentials: 'include',
                    headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken },
                    body: JSON.stringify({ data: payload })
                }
            )
            const result = await res.json()
            if (result?.message?.success === false) throw new Error(result.message.message || "Failed to create Salary Annexure")
            alert(result?.message?.message || "Salary Annexure created successfully!")
            router.push('/salary-annexure-list')
        } catch (e: any) {
            alert(e.message || "Failed to create Salary Annexure")
        } finally { setIsSaving(false) }
    }

    return (
        <>
            <style>{css}</style>
            <div className="sa">
                <div className="sa-wrap">

                    <div className={`sa-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

                    {/* SIDEBAR */}
                    <aside className={`sa-sb${sidebarOpen ? "" : " collapsed"}`}>
                        <div className="sa-sb-brand">
                            <div className="sa-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
                            <div><div className="sa-sb-name">Job Management</div><div className="sa-sb-sub">HR Platform</div></div>
                            <button className="sa-sb-close" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
                        </div>
                        <nav className="sa-nav">
                            <Link href="/create-job" className="sa-nav-cta"><Plus size={14} /> New Job Opening</Link>
                            <div className="sa-nav-lbl">Pipeline</div>
                            <Link href="/job-opening" className="sa-nav-link"><Briefcase size={15} /> Job Opening</Link>
                            <Link href="/upload-resumes" className="sa-nav-link"><Upload size={15} /> Resume Collection</Link>
                            <Link href="/candidates" className="sa-nav-link"><Users size={15} /> Candidates</Link>
                            <Link href="/interview" className="sa-nav-link"><Calendar size={15} /> Interview Scheduling</Link>
                            <div className="sa-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
                            <Link href="/feedback" className="sa-nav-link"><MessageSquare size={15} /> Feedback</Link>
                            <Link href="/document-verify-list" className="sa-nav-link"><FileText size={15} /> Document Verification</Link>
                            <Link href="/offer-list" className="sa-nav-link"><Zap size={15} /> Offer Letter</Link>
                            <Link href="/salary-annexure-list" className="sa-nav-link active"><DollarSign size={15} /> Salary Annexure</Link>
                            <Link href="/letter-appointment" className="sa-nav-link"><UserCheck size={15} /> Appointment Letter</Link>
                        </nav>
                        <div className="sa-sb-foot">
                            <button className="sa-logout"><LogOut size={15} /> Sign out</button>
                        </div>
                    </aside>

                    {/* MAIN */}
                    <div className={`sa-main${sidebarOpen ? "" : " sb-closed"}`}>
                        <header className="sa-header">
                            <button className="sa-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
                            <div className="sa-hdr-sep" />
                            <button className="sa-back-btn" onClick={() => router.back()}>
                                <ArrowLeft size={14} /> Back
                            </button>
                            <div className="sa-hdr-sep" />
                            <div className="sa-crumb">

                                <Home size={13} /> Home <ChevronRight size={13} />
                                <Link href="/salary-annexure-list" style={{ color: 'var(--t3)', textDecoration: 'none' }}>Salary Annexure</Link>
                                <ChevronRight size={13} /> <strong>Create Salary Annexure</strong>
                            </div>
                        </header>

                        <div className="sa-page-outer">
                            <div className="sa-page">

                                {/* Toolbar */}
                                <div className="sa-toolbar">
                                    <div>
                                        <h1 className="sa-page-title">Create Salary Annexure</h1>
                                        <p className="sa-page-sub">Define salary components and terms for a job applicant</p>
                                    </div>
                                </div>

                                {/* ── BASIC DETAILS CARD ── */}
                                <div className="sa-card">
                                    <div className="sa-card-head">
                                        <div className="sa-card-head-left">
                                            <div className="sa-card-head-icon"><User size={16} /></div>
                                            <span className="sa-card-title">Basic Details</span>
                                        </div>
                                    </div>
                                    <div className="sa-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                        <div className="sa-grid-2">
                                            {/* Job Applicant */}
                                            <div className="sa-field">
                                                <label className="sa-label"><User size={13} /> Job Applicant <span className="sa-req">*</span></label>
                                                <Popover open={openApplicant} onOpenChange={setOpenApplicant}>
                                                    <PopoverTrigger asChild>
                                                        <button
                                                            role="combobox"
                                                            disabled={loading.applicants}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                                height: 42, width: '100%', padding: '0 12px', borderRadius: 8,
                                                                border: '1px solid var(--border)', background: 'var(--bg)',
                                                                fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: 'var(--t1)',
                                                                cursor: loading.applicants ? 'not-allowed' : 'pointer',
                                                                opacity: loading.applicants ? 0.65 : 1,
                                                            }}
                                                        >
                                                            <span style={{ color: form.jobApplicant ? 'var(--t1)' : 'var(--t3)' }}>
                                                                {form.jobApplicant
                                                                    ? applicants.find(a => a.name === form.jobApplicant)?.applicant_name
                                                                    : loading.applicants ? "Loading applicants..." : "Search and select applicant..."}
                                                            </span>
                                                            <ChevronsUpDown size={14} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent style={{ width: 400, padding: 0 }}>
                                                        <Command>
                                                            <CommandInput placeholder="Search by name or email..." />
                                                            <CommandEmpty>No applicant found.</CommandEmpty>
                                                            <CommandGroup style={{ maxHeight: 300, overflow: 'auto' }}>
                                                                {applicants.map(a => (
                                                                    <CommandItem key={a.name} value={`${a.applicant_name} ${a.email_id}`}
                                                                        onSelect={() => { setForm(p => ({ ...p, jobApplicant: a.name })); setOpenApplicant(false) }}>
                                                                        <Check size={14} style={{ marginRight: 8, opacity: form.jobApplicant === a.name ? 1 : 0 }} />
                                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                            <span style={{ fontWeight: 500 }}>{a.applicant_name}</span>
                                                                            <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>{a.email_id}</span>
                                                                        </div>
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                            {/* Salary Component Template */}
                                            <div className="sa-field">
                                                <label className="sa-label"><FileText size={13} /> Salary Component Template</label>
                                                <Popover open={openCompTemplate} onOpenChange={setOpenCompTemplate}>
                                                    <PopoverTrigger asChild>
                                                        <button
                                                            role="combobox"
                                                            disabled={loading.compTemplates}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                                height: 42, width: '100%', padding: '0 12px', borderRadius: 8,
                                                                border: '1px solid var(--border)', background: 'var(--bg)',
                                                                fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: 'var(--t1)',
                                                                cursor: loading.compTemplates ? 'not-allowed' : 'pointer',
                                                                opacity: loading.compTemplates ? 0.65 : 1,
                                                            }}
                                                        >
                                                            <span style={{ color: form.salaryComponentTemplate ? 'var(--t1)' : 'var(--t3)' }}>
                                                                {form.salaryComponentTemplate || (loading.compTemplates ? "Loading templates..." : "Select salary structure template...")}
                                                            </span>
                                                            <ChevronsUpDown size={14} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent style={{ width: 360, padding: 0 }}>
                                                        <Command>
                                                            <CommandInput placeholder="Search template..." />
                                                            <CommandEmpty>No template found.</CommandEmpty>
                                                            <CommandGroup style={{ maxHeight: 300, overflow: 'auto' }}>
                                                                {compTemplates.map(t => (
                                                                    <CommandItem key={t.name} value={t.name} onSelect={() => handleCompTemplateChange(t.name)}>
                                                                        <Check size={14} style={{ marginRight: 8, opacity: form.salaryComponentTemplate === t.name ? 1 : 0 }} />
                                                                        {t.name}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                {form.salaryComponentTemplate && (
                                                    <div className="sa-hint">
                                                        <CheckCircle2 size={12} /> Salary components loaded from template
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── SALARY COMPONENTS CARD ── */}
                                <div className="sa-card">
                                    <div className="sa-card-head">
                                        <div className="sa-card-head-left">
                                            <div className="sa-card-head-icon green"><DollarSign size={16} /></div>
                                            <span className="sa-card-title">Salary Components</span>
                                            {salaryComponents.length > 0 && (
                                                <span className="sa-badge blue" style={{ marginLeft: 8 }}>
                                                    {salaryComponents.length} component{salaryComponents.length !== 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {loadingTemplate ? (
                                        <div className="sa-card-body">
                                            <div className="sa-alert blue">
                                                <div className="sa-spin" />
                                                <div><div className="sa-alert-sub" style={{ color: 'var(--accent)' }}>Loading salary components from template...</div></div>
                                            </div>
                                        </div>
                                    ) : salaryComponents.length === 0 ? (
                                        <div className="sa-empty">
                                            <DollarSign size={44} style={{ color: 'var(--t3)' }} />
                                            <p className="sa-empty-title">No salary components</p>
                                            <p className="sa-empty-sub">Select a Salary Component Template above to auto-load components</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="sa-table-wrap">
                                                <table className="sa-table">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: 50 }}>No.</th>
                                                            <th>Salary Component</th>
                                                            <th style={{ width: 80 }}>Section</th>
                                                            <th style={{ width: 160 }}>Monthly (₹)</th>
                                                            <th style={{ width: 160 }}>Annualized (₹)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {salaryComponents.map((comp, i) => (
                                                            <tr key={comp.id}>
                                                                <td className="sa-table-num">{i + 1}</td>
                                                                <td className="sa-table-comp">{comp.salary_component}</td>
                                                                <td>
                                                                    <span className={`sa-section-badge ${comp.section}`}>{comp.section}</span>
                                                                </td>
                                                                <td>
                                                                    <div className="sa-amount-wrap">
                                                                        <span className="sa-amount-symbol">₹</span>
                                                                        <input
                                                                            className="sa-amount-input"
                                                                            type="number"
                                                                            min="0"
                                                                            step="0.01"
                                                                            value={comp.monthly || ""}
                                                                            onChange={e => updateMonthly(comp.id, e.target.value)}
                                                                            onKeyDown={e => e.key === '-' && e.preventDefault()}   // ← add this
                                                                            placeholder="0.00"
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="sa-amount-wrap">
                                                                        <span className="sa-amount-symbol" style={{ color: 'var(--accent)' }}>₹</span>
                                                                        <input
                                                                            className="sa-amount-input"
                                                                            type="text"
                                                                            value={comp.annualized ? formatCurrency(comp.annualized) : "0.00"}
                                                                            readOnly
                                                                            disabled
                                                                            style={{ background: 'linear-gradient(to right,#f8fbff,#eef7ff)', color: 'var(--accent)', fontWeight: 600 }}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Totals */}
                                            <div className="sa-totals-grid">
                                                <div className="sa-total-item">
                                                    <div className="sa-total-lbl">Sub Total (A) Monthly</div>
                                                    <div className="sa-total-val accent">₹ {formatCurrency(totals.subA_monthly)}</div>
                                                </div>
                                                <div className="sa-total-item">
                                                    <div className="sa-total-lbl">Sub Total (A) Annualized</div>
                                                    <div className="sa-total-val accent">₹ {formatCurrency(totals.subA_annual)}</div>
                                                </div>
                                                <div className="sa-total-item" />
                                                <div className="sa-total-divider" />
                                                <div className="sa-total-item">
                                                    <div className="sa-total-lbl">Sub Total (B) Monthly</div>
                                                    <div className="sa-total-val purple">₹ {formatCurrency(totals.subB_monthly)}</div>
                                                </div>
                                                <div className="sa-total-item">
                                                    <div className="sa-total-lbl">Sub Total (B) Annualized</div>
                                                    <div className="sa-total-val purple">₹ {formatCurrency(totals.subB_annual)}</div>
                                                </div>
                                                <div className="sa-total-item" />
                                                <div className="sa-total-divider" />
                                                <div className="sa-total-item">
                                                    <div className="sa-total-lbl">Total A + B Monthly</div>
                                                    <div className="sa-total-val green">₹ {formatCurrency(totals.total_monthly)}</div>
                                                </div>
                                                <div className="sa-total-item">
                                                    <div className="sa-total-lbl">Total A + B Annualized</div>
                                                    <div className="sa-total-val green">₹ {formatCurrency(totals.total_annual)}</div>
                                                </div>
                                                <div className="sa-total-item" />
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* ── CONDITIONS CARD ── */}
                                <div className="sa-card">
                                    <div className="sa-card-head">
                                        <div className="sa-card-head-left">
                                            <div className="sa-card-head-icon amber"><FileText size={16} /></div>
                                            <span className="sa-card-title">Terms & Conditions</span>
                                            {conditions.length > 0 && (
                                                <span className="sa-badge green" style={{ marginLeft: 8 }}>
                                                    {conditions.length} condition{conditions.length !== 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="sa-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        {/* Condition Template selector */}
                                        <div className="sa-field">
                                            <label className="sa-label"><FileText size={13} /> Condition Template</label>
                                            <Popover open={openCondTemplate} onOpenChange={setOpenCondTemplate}>
                                                <PopoverTrigger asChild>
                                                    <button
                                                        role="combobox"
                                                        disabled={loading.condTemplates}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                            height: 42, width: '100%', maxWidth: 400, padding: '0 12px', borderRadius: 8,
                                                            border: '1px solid var(--border)', background: 'var(--bg)',
                                                            fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: 'var(--t1)',
                                                            cursor: loading.condTemplates ? 'not-allowed' : 'pointer',
                                                            opacity: loading.condTemplates ? 0.65 : 1,
                                                        }}
                                                    >
                                                        <span style={{ color: form.conditionTemplate ? 'var(--t1)' : 'var(--t3)' }}>
                                                            {form.conditionTemplate || (loading.condTemplates ? "Loading templates..." : "Select condition template...")}
                                                        </span>
                                                        <ChevronsUpDown size={14} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent style={{ width: 360, padding: 0 }}>
                                                    <Command>
                                                        <CommandInput placeholder="Search condition template..." />
                                                        <CommandEmpty>No template found.</CommandEmpty>
                                                        <CommandGroup style={{ maxHeight: 300, overflow: 'auto' }}>
                                                            {condTemplates.map(t => (
                                                                <CommandItem key={t.name} value={t.name} onSelect={() => handleCondTemplateChange(t.name)}>
                                                                    <Check size={14} style={{ marginRight: 8, opacity: form.conditionTemplate === t.name ? 1 : 0 }} />
                                                                    {t.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            {form.conditionTemplate && (
                                                <div className="sa-hint">
                                                    <CheckCircle2 size={12} /> Conditions loaded from template
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {loadingCond ? (
                                        <div className="sa-card-body" style={{ paddingTop: 0 }}>
                                            <div className="sa-alert blue">
                                                <div className="sa-spin" />
                                                <div><div className="sa-alert-sub" style={{ color: 'var(--accent)' }}>Loading conditions from template...</div></div>
                                            </div>
                                        </div>
                                    ) : conditions.length === 0 ? (
                                        <div className="sa-empty" style={{ paddingTop: 24 }}>
                                            <FileText size={36} style={{ color: 'var(--t3)' }} />
                                            <p className="sa-empty-title">No conditions added</p>
                                            <p className="sa-empty-sub">Select a Condition Template to auto-fill</p>
                                        </div>
                                    ) : (
                                        <div style={{ overflowX: 'auto' }}>
                                            <table className="sa-cond-table">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: 56 }}>No.</th>
                                                        <th>Condition Text</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {conditions.map((c, i) => (
                                                        <tr key={c.id}>
                                                            <td style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)', paddingTop: 13 }}>{i + 1}</td>
                                                            <td className="sa-cond-text">{c.condition_text}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                {/* ── ACTIONS ── */}
                                <div className="sa-actions">
                                    {/* <button className="sa-btn-cancel" onClick={() => router.back()}>Cancel</button> */}
                                    <button className="sa-btn-cancel" onClick={resetForm}>Cancel</button>

                                    <button className="sa-btn-submit" onClick={handleSave} disabled={isSaving}>
                                        {isSaving ? (
                                            <><div className="sa-btn-submit-spin" /> Creating...</>
                                        ) : (
                                            <><CheckCircle2 size={16} /> Create Salary Annexure</>
                                        )}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
