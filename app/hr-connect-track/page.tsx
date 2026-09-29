"use client"
import { useState, useEffect } from "react"
import {
    ArrowLeft,
    Search,
    Briefcase,
    Calendar,
    Users,
    CheckCircle,
    Clock,
    Menu,
    X,
    Home,
    Plus,
    LogOut,
    ChevronRight,
    Upload,
    MessageSquare,
    Zap,
    FileText,
    UserCheck,
    Mail,
    Phone,
    CalendarCheck,
    Award,
    Bell,
    Save,
} from "lucide-react"
import Link from "next/link"
import { API_BASE_URL } from '@/lib/api-config'
import { getFrappeCSRF } from "@/lib/csrf"

const API_MODULE_PATH = "resume.api.hr_connect"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .hc {
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
    --accent-bdr:rgba(0,158,247,.28);

    --bg:        #f0f8fe;
    --card:      #ffffff;
    --border:    #cce8f8;
    --border-s:  #ddf0fb;

    --t1:        #0d1b2a;
    --t2:        #2d5a78;
    --t3:        #6a9cb8;

    --green:     #16a34a;
    --green-lt:  #dcfce7;
    --green-bdr: #bbf7d0;
    --yellow:    #d97706;
    --yellow-lt: #fef9c3;
    --yellow-bdr:#fde68a;
    --purple:    #7c3aed;
    --purple-lt: #ede9fe;
    --purple-bdr:#ddd6fe;

    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13.5px;
    -webkit-font-smoothing: antialiased;
  }

  .hc-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  /* ══ SIDEBAR ══ */
  .hc-sb {
    width: var(--sb-w); background: var(--sb);
    min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 100;
    display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .hc-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }
  .hc-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }
  .hc-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
  }
  .hc-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .hc-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; line-height: 1.25; }
  .hc-sb-sub  { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
  .hc-sb-close {
    margin-left: auto; flex-shrink: 0; width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer; color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center; transition: all .14s;
  }
  .hc-sb-close:hover { background: var(--sb-hover); color: #fff; }
  .hc-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .hc-nav::-webkit-scrollbar { width: 3px; }
  .hc-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }
  .hc-nav-cta {
    display: flex; align-items: center; gap: 9px;
    padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    color: var(--accent); font-size: 13px; font-weight: 600;
    text-decoration: none; transition: background .15s; margin-bottom: 22px;
  }
  .hc-nav-cta:hover { background: rgba(0,158,247,.24); }
  .hc-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
  }
  .hc-nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt);
    text-decoration: none; transition: all .14s;
  }
  .hc-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; }
  .hc-nav-link:hover { background: var(--sb-hover); color: #fff; }
  .hc-nav-link:hover svg { opacity: 1; }
  .hc-nav-link.active { background: var(--sb-hover); color: #fff; }
  .hc-nav-link.active svg { opacity: 1; }
  .hc-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .hc-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; border-radius: 8px; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--sb-lbl); text-align: left; transition: all .14s;
  }
  .hc-logout svg { opacity: .6; width: 15px; height: 15px; }
  .hc-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }
  .hc-overlay {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
  }
  @media (max-width: 768px) { .hc-overlay.show { display: block; } }

  /* ══ MAIN ══ */
  .hc-main {
    margin-left: var(--sb-w); flex: 1;
    display: flex; flex-direction: column; min-height: 100vh;
    min-width: 0; max-width: 100%; overflow-x: hidden;
    transition: margin-left .25s cubic-bezier(.4,0,.2,1);
  }
  .hc-main.sb-closed { margin-left: 0; }

  /* ══ HEADER ══ */
  .hc-header {
    min-height: 60px; background: #fff; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 1px 0 rgba(0,158,247,.08);
  }
  .hc-toggle {
    width: 34px; height: 34px; border-radius: 8px;
    background: none; border: 1px solid var(--border);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .hc-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .hc-btn-back {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    background: transparent; color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer; text-decoration: none;
    transition: all .14s; white-space: nowrap;
  }
  .hc-btn-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .hc-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .hc-crumb { display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--t3); }
  .hc-crumb svg { width: 13px; height: 13px; flex-shrink: 0; }
  .hc-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }

  /* ══ PAGE ══ */
  .hc-page { padding: 28px 32px; display: flex; flex-direction: column; gap: 20px; min-width: 0; max-width: 100%; overflow-x: hidden; }
  .hc-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
  .hc-page-title { font-size: 20px; font-weight: 800; color: var(--t1); letter-spacing: -0.4px; }
  .hc-page-sub   { font-size: 13px; color: var(--t3); margin-top: 4px; }

  /* ══ STATS ══ */
  .hc-stats { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 10px; }
  .hc-stat {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 12px 14px; min-width: 0;
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }
  .hc-stat-label { font-size: 10.5px; color: var(--t3); font-weight: 500; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hc-stat-val   { font-size: 18px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; line-height: 1; }
  .hc-stat-val.blue   { color: var(--accent); }
  .hc-stat-val.green  { color: var(--green); }
  .hc-stat-val.yellow { color: var(--yellow); }
  .hc-stat-val.purple { color: var(--purple); }
  .hc-stat-icon { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .hc-stat-icon.blue   { background: var(--accent-lt); color: var(--accent); }
  .hc-stat-icon.green  { background: var(--green-lt); color: var(--green); }
  .hc-stat-icon.yellow { background: var(--yellow-lt); color: var(--yellow); }
  .hc-stat-icon.purple { background: var(--purple-lt); color: var(--purple); }

  /* ══ SEARCH ══ */
  .hc-search-wrap {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 14px 16px;
    box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }
  .hc-search-inner { position: relative; }
  .hc-search-inner > svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--t3); width: 16px; height: 16px; }
  .hc-search-input {
    width: 100%; height: 40px; padding: 0 12px 0 42px;
    border: 1px solid var(--border); border-radius: 8px; background: var(--bg);
    font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--t1);
    outline: none; transition: all .15s;
  }
  .hc-search-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }

  /* ══ TABLE ══ */
  .hc-table-card {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 12px; overflow: hidden;
    min-width: 0; max-width: 100%;
    box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .hc-table { width: 100%; border-collapse: collapse; min-width: 1900px; }
  .hc-table thead tr { background: linear-gradient(to right, #f8fbff, #eef7ff); border-bottom: 1px solid var(--border-s); }
  .hc-table th {
    padding: 10px 12px; text-align: left; font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.06em; color: var(--t2); white-space: nowrap;
  }
  .hc-table th.hc-th-group { text-align: center; border-left: 1px solid var(--border-s); }
  .hc-table tbody tr { border-bottom: 1px solid var(--border-s); transition: background .12s; }
  .hc-table tbody tr:last-child { border-bottom: none; }
  .hc-table tbody tr:hover { background: #f8fbff; }
  .hc-table td { padding: 10px 12px; vertical-align: top; font-size: 12.5px; color: var(--t1); }
  .hc-td-group { border-left: 1px solid var(--border-s); }

  .hc-sno { font-size: 12.5px; font-weight: 700; color: var(--t3); width: 32px; text-align: center; }
  .hc-cand-name { font-weight: 700; color: var(--t1); font-size: 13px; }
  .hc-cand-sub { font-size: 11px; color: var(--t3); display: flex; align-items: center; gap: 4px; margin-top: 2px; }

  .hc-connect-cell { display: flex; flex-direction: column; gap: 5px; min-width: 160px; }
  .hc-connect-date { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; color: var(--t1); }
  .hc-connect-date svg { width: 11px; height: 11px; color: var(--accent); flex-shrink: 0; }
  .hc-reminder-tag { font-size: 10px; color: var(--t3); display: flex; align-items: center; gap: 3px; }
  .hc-reminder-tag.sent { color: var(--accent); }
  .hc-reminder-tag svg { width: 10px; height: 10px; }

  .hc-status-select {
    height: 30px; padding: 0 24px 0 9px; border-radius: 6px;
    font-family: 'Inter', sans-serif; font-size: 11.5px; font-weight: 600;
    outline: none; cursor: pointer; appearance: none; border: 1px solid transparent;
    background-repeat: no-repeat; background-position: right 6px center; background-size: 12px;
  }
  .hc-status-select.done {
    background-color: var(--green-lt); color: var(--green); border-color: var(--green-bdr);
  }
  .hc-status-select.pending {
    background-color: var(--yellow-lt); color: var(--yellow); border-color: var(--yellow-bdr);
  }
  .hc-status-select.confirmed {
    background-color: var(--purple-lt); color: var(--purple); border-color: var(--purple-bdr);
  }
  .hc-status-select.notconfirmed {
    background-color: var(--border-s); color: var(--t2); border-color: var(--border);
  }
  .hc-status-select.na {
    background-color: var(--border-s); color: var(--t2); border-color: var(--border);
  }

  /* ══ REMARK ══ */
  .hc-remark-wrap { margin-top: 2px; display: flex; flex-direction: column; gap: 4px; }
  .hc-remark-input {
    width: 100%; min-height: 44px; resize: vertical;
    border: 1px solid var(--border); border-radius: 6px; background: var(--bg);
    font-family: 'Inter', sans-serif; font-size: 11px; color: var(--t1);
    padding: 5px 7px; outline: none; transition: all .15s;
  }
  .hc-remark-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 2px rgba(0,158,247,.12); }
  .hc-remark-save {
    display: inline-flex; align-items: center; gap: 4px; align-self: flex-start;
    padding: 4px 9px; border-radius: 6px; border: none; cursor: pointer;
    background: var(--accent); color: #fff; font-family: 'Inter', sans-serif;
    font-size: 10.5px; font-weight: 600; transition: background .15s;
  }
  .hc-remark-save:hover { background: var(--accent-h); }
  .hc-remark-save svg { width: 11px; height: 11px; }

  .hc-not-required {
    display: flex; align-items: center; justify-content: center;
    min-width: 160px; min-height: 60px;
    font-size: 11.5px; color: var(--t3); font-style: italic;
  }

  .hc-empty { text-align: center; padding: 60px 20px; }
  .hc-empty-icon { width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 18px; background: var(--accent-lt); color: var(--accent); display: flex; align-items: center; justify-content: center; }
  .hc-empty-title { font-size: 15px; font-weight: 700; color: var(--t1); margin-bottom: 6px; }
  .hc-empty-sub   { font-size: 13px; color: var(--t3); }

  .hc-loading { min-height: 100vh; background: var(--bg); display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 16px; }
  .hc-spinner { width: 44px; height: 44px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent); animation: hc-spin .7s linear infinite; }
  @keyframes hc-spin { to { transform: rotate(360deg); } }
  .hc-loading-txt { font-size: 14px; color: var(--t3); font-weight: 500; }

  @media (max-width: 640px) {
    .hc-stats { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .hc-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .hc-sb.open { transform: translateX(0); }
    .hc-main { margin-left: 0 !important; }
    .hc-page { padding: 12px; }
    .hc-header { padding: 0 12px; gap: 6px; }
    .hc-hdr-sep { display: none; }
    .hc-stats { grid-template-columns: 1fr; }
  }
`

interface HRConnectItem {
    candidate_id: string
    applicant_name: string
    email: string
    phone: string
    designation: string
    grade: string
    date_of_joining: string
    day_30_date: string
    day_30_status: string
    day_30_reminder_sent: boolean
    day_30_remark: string
    day_90_date: string
    day_90_status: string
    day_90_reminder_sent: boolean
    day_90_remark: string
    day_180_date: string
    day_180_status: string
    day_180_reminder_sent: boolean
    day_180_remark: string
    day_270_date: string
    day_270_status: string
    day_270_reminder_sent: boolean
    day_270_remark: string
    day_365_date: string
    day_365_status: string
    day_365_reminder_sent: boolean
    day_365_remark: string
    confirmation_status: string
}

type StageFieldType = '30_day' | '90_day' | '180_day' | '270_day' | '365_day'

interface StatusOptionsMap {
    day_30: string[]
    day_90: string[]
    day_180: string[]
    day_270: string[]
    day_365: string[]
    confirmation: string[]
}

const EMPTY_OPTIONS: StatusOptionsMap = {
    day_30: [], day_90: [], day_180: [], day_270: [], day_365: [], confirmation: [],
}

function getStatusClass(value: string) {
    if (value === "Done") return "done"
    if (value === "Not Done Yet") return "pending"
    return "na"
}

/**
 * One 30/90/180/270/365-day "connect" cell: date, dynamic status dropdown,
 * reminder tag, and its own remark box + save button.
 */
function ConnectCell({
    date,
    status,
    options,
    reminderSent,
    remark,
    onStatusChange,
    onRemarkChange,
    onSaveRemark,
}: {
    date: string
    status: string
    options: string[]
    reminderSent: boolean
    remark: string
    onStatusChange: (value: string) => void
    onRemarkChange: (value: string) => void
    onSaveRemark: () => void
}) {
    return (
        <div className="hc-connect-cell">
            <div className="hc-connect-date"><Calendar />{date}</div>
            <select
                className={`hc-status-select ${getStatusClass(status)}`}
                value={status}
                onChange={e => onStatusChange(e.target.value)}
            >
                {options.length > 0 ? (
                    options.map(opt => <option key={opt} value={opt}>{opt}</option>)
                ) : (
                    <option value={status}>{status}</option>
                )}
            </select>
            {reminderSent && (
                <span className="hc-reminder-tag sent"><Bell /> Reminder sent</span>
            )}
            <div className="hc-remark-wrap">
                <textarea
                    className="hc-remark-input"
                    placeholder="Type a remark..."
                    value={remark}
                    onChange={e => onRemarkChange(e.target.value)}
                />
                <button className="hc-remark-save" onClick={onSaveRemark}>
                    <Save size={11} /> Save
                </button>
            </div>
        </div>
    )
}

export default function HRConnectTrackPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [items, setItems] = useState<HRConnectItem[]>([])
    const [statusOptions, setStatusOptions] = useState<StatusOptionsMap>(EMPTY_OPTIONS)
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => { document.title = 'HR Connect Track' }, [])

    const fetchList = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_hr_connect_list`,
                { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
            )
            const result = await res.json()
            setItems(result?.message?.data || [])
            setStatusOptions(result?.message?.options || EMPTY_OPTIONS)
        } catch (e) {
            console.error("Error fetching HR connect list:", e)
            setItems([])
            setStatusOptions(EMPTY_OPTIONS)
        } finally { setIsLoading(false) }
    }

    useEffect(() => { fetchList() }, [])

    const updateStatus = async (
        candidateId: string,
        fieldType: StageFieldType | 'confirmation',
        value: string
    ) => {
        // Optimistic UI update
        setItems(prev => prev.map(i => {
            if (i.candidate_id !== candidateId) return i
            if (fieldType === '30_day') return { ...i, day_30_status: value }
            if (fieldType === '90_day') return { ...i, day_90_status: value }
            if (fieldType === '180_day') return { ...i, day_180_status: value }
            if (fieldType === '270_day') return { ...i, day_270_status: value }
            if (fieldType === '365_day') return { ...i, day_365_status: value }
            return { ...i, confirmation_status: value }
        }))
        try {
            const csrfToken = await getFrappeCSRF()
            const res = await fetch(
                `${API_BASE_URL}/api/method/${API_MODULE_PATH}.update_hr_connect_status`,
                {
                    method: 'POST', credentials: 'include',
                    headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken },
                    body: JSON.stringify({ candidate_id: candidateId, field_type: fieldType, value })
                }
            )
            const result = await res.json()
            if (!result?.message?.success) {
                alert("Failed to update status.")
                fetchList()
            }
        } catch (e) {
            alert("Error updating status.")
            fetchList()
        }
    }

    // Only updates local state as the HR types — no API call on every keystroke.
    const updateRemarkLocal = (candidateId: string, fieldType: StageFieldType, value: string) => {
        setItems(prev => prev.map(i => {
            if (i.candidate_id !== candidateId) return i
            if (fieldType === '30_day') return { ...i, day_30_remark: value }
            if (fieldType === '90_day') return { ...i, day_90_remark: value }
            if (fieldType === '180_day') return { ...i, day_180_remark: value }
            if (fieldType === '270_day') return { ...i, day_270_remark: value }
            return { ...i, day_365_remark: value }
        }))
    }

    // Persists whatever remark text is currently in state for that stage.
    const saveRemark = async (candidateId: string, fieldType: StageFieldType) => {
        const item = items.find(i => i.candidate_id === candidateId)
        if (!item) return

        const remarkByField: Record<StageFieldType, string> = {
            '30_day': item.day_30_remark,
            '90_day': item.day_90_remark,
            '180_day': item.day_180_remark,
            '270_day': item.day_270_remark,
            '365_day': item.day_365_remark,
        }
        const remark = remarkByField[fieldType] ?? ""

        try {
            const csrfToken = await getFrappeCSRF()
            const res = await fetch(
                `${API_BASE_URL}/api/method/${API_MODULE_PATH}.update_hr_connect_remark`,
                {
                    method: 'POST', credentials: 'include',
                    headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken },
                    body: JSON.stringify({ candidate_id: candidateId, field_type: fieldType, remark })
                }
            )
            const result = await res.json()
            if (!result?.message?.success) {
                alert("Failed to save remark.")
            }
        } catch (e) {
            alert("Error saving remark.")
        }
    }

    const formatDate = (d: string | null) => {
        if (!d) return "N/A"
        return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    const filteredItems = items.filter(item =>
        item.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.grade.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalJoined = items.length
    const totalConfirmed = items.filter(i => i.confirmation_status === "Confirmed").length
    const total30Pending = items.filter(i => i.day_30_status !== "Done").length
    const total90Pending = items.filter(i => i.day_90_status !== "Done").length
    const total180Pending = items.filter(i => i.day_180_status !== "Done").length

    // Whole "9 Months" / "1 Year" columns (header included) are only shown
    // when at least one visible candidate still needs them. If every visible
    // candidate is already Confirmed, the columns disappear entirely instead
    // of showing empty "Not Required" cells under a header nobody needs.
    const showLongTermColumns = filteredItems.some(i => i.confirmation_status !== "Confirmed")

    const sidebarPipeline = [
        { href: "/job-opening", title: "Job Opening", icon: <Briefcase size={15} /> },
        { href: "/upload-resumes", title: "Resume Collection", icon: <Upload size={15} /> },
        { href: "/candidates", title: "Candidates", icon: <Users size={15} /> },
        { href: "/interview", title: "Interview Scheduling", icon: <Calendar size={15} /> },
    ]
    const sidebarClosing = [
        { href: "/feedback", title: "Candidate Feedback", icon: <MessageSquare size={15} /> },
        { href: "/document-verify-list", title: "Document Verification", icon: <FileText size={15} /> },
        { href: "/offer-list", title: "Offer Letter", icon: <Zap size={15} /> },
        { href: "/letter-appointment", title: "Appointment Letter", icon: <UserCheck size={15} /> },
        { href: "/candidate-joining-track", title: "Candidate Joining Track", icon: <CalendarCheck size={15} /> },
        { href: "/hr-connect-track", title: "HR Connect Track", icon: <Bell size={15} /> },
    ]

    if (isLoading) {
        return (
            <div className="hc"><style>{css}</style>
                <div className="hc-loading"><div className="hc-spinner" /><p className="hc-loading-txt">Loading HR Connect Track...</p></div>
            </div>
        )
    }

    return (
        <>
            <style>{css}</style>
            <div className="hc">
                <div className="hc-wrap">
                    <div className={`hc-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

                    {/* ══ SIDEBAR ══ */}
                    <aside className={`hc-sb${sidebarOpen ? "" : " collapsed"}`}>
                        <div className="hc-sb-brand">
                            <div className="hc-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
                            <div><div className="hc-sb-name">Job Management</div><div className="hc-sb-sub">HR Platform</div></div>
                            <button className="hc-sb-close" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
                        </div>
                        <nav className="hc-nav">
                            <Link href="/create-job" className="hc-nav-cta"><Plus size={14} /> New Job Opening</Link>
                            <div className="hc-nav-lbl">General</div>
                            <Link href="/home" className="hc-nav-link"><Home size={15} /> Home</Link>
                            <div className="hc-nav-lbl">Pipeline</div>
                            {sidebarPipeline.map(s => <Link key={s.href} href={s.href} className="hc-nav-link">{s.icon} {s.title}</Link>)}
                            <div className="hc-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
                            {sidebarClosing.map(s => <Link key={s.href} href={s.href} className={`hc-nav-link${s.href === "/hr-connect-track" ? " active" : ""}`}>{s.icon} {s.title}</Link>)}
                        </nav>
                        <div className="hc-sb-foot"><button className="hc-logout"><LogOut size={15} /> Sign out</button></div>
                    </aside>

                    {/* ══ MAIN ══ */}
                    <div className={`hc-main${sidebarOpen ? "" : " sb-closed"}`}>
                        <header className="hc-header">
                            <button className="hc-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
                            <div className="hc-hdr-sep" />
                            <Link href="/home" className="hc-btn-back"><ArrowLeft size={13} /> Back</Link>
                            <div className="hc-hdr-sep" />
                            <div className="hc-crumb">
                                <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'inherit', textDecoration: 'none' }}>
                                    <Home size={13} /> Home
                                </Link>
                                <ChevronRight size={13} />
                                <strong>HR Connect Track</strong>
                            </div>
                        </header>

                        <div className="hc-page">
                            <div className="hc-toolbar">
                                <div>
                                    <h1 className="hc-page-title">HR Connect Track</h1>
                                    <p className="hc-page-sub">30 / 90 / 180 Day, 9 Month &amp; 1 Year post-joining HR connect tracker</p>
                                </div>
                            </div>

                            {/* ══ STATS ══ */}
                            <div className="hc-stats">
                                <div className="hc-stat">
                                    <div><div className="hc-stat-label">Total Joined</div><div className="hc-stat-val blue">{totalJoined}</div></div>
                                    <div className="hc-stat-icon blue"><Users size={15} /></div>
                                </div>
                                <div className="hc-stat">
                                    <div><div className="hc-stat-label">30 Day Pending</div><div className="hc-stat-val yellow">{total30Pending}</div></div>
                                    <div className="hc-stat-icon yellow"><Clock size={15} /></div>
                                </div>
                                <div className="hc-stat">
                                    <div><div className="hc-stat-label">90 Day Pending</div><div className="hc-stat-val yellow">{total90Pending}</div></div>
                                    <div className="hc-stat-icon yellow"><Clock size={15} /></div>
                                </div>
                                <div className="hc-stat">
                                    <div><div className="hc-stat-label">180 Day Pending</div><div className="hc-stat-val yellow">{total180Pending}</div></div>
                                    <div className="hc-stat-icon yellow"><Clock size={15} /></div>
                                </div>
                                <div className="hc-stat">
                                    <div><div className="hc-stat-label">Confirmed</div><div className="hc-stat-val purple">{totalConfirmed}</div></div>
                                    <div className="hc-stat-icon purple"><Award size={15} /></div>
                                </div>
                            </div>

                            {/* ══ SEARCH ══ */}
                            <div className="hc-search-wrap">
                                <div className="hc-search-inner">
                                    <Search size={16} />
                                    <input
                                        type="text" className="hc-search-input"
                                        placeholder="Search by name, email, designation, or grade..."
                                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {filteredItems.length > 0 && (
                                <div style={{ fontSize: 12.5, color: 'var(--t3)', fontWeight: 500 }}>
                                    Showing {filteredItems.length} candidate{filteredItems.length !== 1 ? 's' : ''}
                                </div>
                            )}

                            {/* ══ TABLE ══ */}
                            <div className="hc-table-card">
                                {filteredItems.length === 0 ? (
                                    <div className="hc-empty">
                                        <div className="hc-empty-icon"><Bell size={28} /></div>
                                        <p className="hc-empty-title">No Joined Candidates Yet</p>
                                        <p className="hc-empty-sub">
                                            {searchTerm
                                                ? "Try adjusting your search"
                                                : "Candidates appear here once HR marks them as Joined"}
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{ overflowX: 'auto', width: '100%' }}>
                                        <table className="hc-table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Employee</th>
                                                    <th>Designation</th>
                                                    <th>Grade</th>
                                                    <th>Date of Joining</th>
                                                    <th className="hc-th-group">30 Days</th>
                                                    <th className="hc-th-group">90 Days</th>
                                                    <th className="hc-th-group">180 Days</th>
                                                    {showLongTermColumns && (
                                                        <>
                                                            <th className="hc-th-group">9 Months</th>
                                                            <th className="hc-th-group">1 Year</th>
                                                        </>
                                                    )}
                                                    <th className="hc-th-group">Confirmation Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredItems.map((item, index) => {
                                                    const isConfirmed = item.confirmation_status === "Confirmed"
                                                    return (
                                                        <tr key={item.candidate_id}>
                                                            <td className="hc-sno">{index + 1}</td>
                                                            <td>
                                                                <div className="hc-cand-name">{item.applicant_name}</div>
                                                                <div className="hc-cand-sub"><Mail size={10} /> {item.email || "N/A"}</div>
                                                                {item.phone && <div className="hc-cand-sub"><Phone size={10} /> {item.phone}</div>}
                                                            </td>
                                                            <td>{item.designation || "Not Set"}</td>
                                                            <td>{item.grade || "Not Set"}</td>
                                                            <td>
                                                                <div className="hc-connect-date"><Calendar />{formatDate(item.date_of_joining)}</div>
                                                            </td>

                                                            {/* 30 DAY */}
                                                            <td className="hc-td-group">
                                                                <ConnectCell
                                                                    date={formatDate(item.day_30_date)}
                                                                    status={item.day_30_status}
                                                                    options={statusOptions.day_30}
                                                                    reminderSent={item.day_30_reminder_sent}
                                                                    remark={item.day_30_remark}
                                                                    onStatusChange={v => updateStatus(item.candidate_id, '30_day', v)}
                                                                    onRemarkChange={v => updateRemarkLocal(item.candidate_id, '30_day', v)}
                                                                    onSaveRemark={() => saveRemark(item.candidate_id, '30_day')}
                                                                />
                                                            </td>

                                                            {/* 90 DAY */}
                                                            <td className="hc-td-group">
                                                                <ConnectCell
                                                                    date={formatDate(item.day_90_date)}
                                                                    status={item.day_90_status}
                                                                    options={statusOptions.day_90}
                                                                    reminderSent={item.day_90_reminder_sent}
                                                                    remark={item.day_90_remark}
                                                                    onStatusChange={v => updateStatus(item.candidate_id, '90_day', v)}
                                                                    onRemarkChange={v => updateRemarkLocal(item.candidate_id, '90_day', v)}
                                                                    onSaveRemark={() => saveRemark(item.candidate_id, '90_day')}
                                                                />
                                                            </td>

                                                            {/* 180 DAY */}
                                                            <td className="hc-td-group">
                                                                <ConnectCell
                                                                    date={formatDate(item.day_180_date)}
                                                                    status={item.day_180_status}
                                                                    options={statusOptions.day_180}
                                                                    reminderSent={item.day_180_reminder_sent}
                                                                    remark={item.day_180_remark}
                                                                    onStatusChange={v => updateStatus(item.candidate_id, '180_day', v)}
                                                                    onRemarkChange={v => updateRemarkLocal(item.candidate_id, '180_day', v)}
                                                                    onSaveRemark={() => saveRemark(item.candidate_id, '180_day')}
                                                                />
                                                            </td>

                                                            {/* 9 MONTHS + 1 YEAR — whole columns hidden once every visible row is Confirmed */}
                                                            {showLongTermColumns && (
                                                                <>
                                                                    <td className="hc-td-group">
                                                                        {isConfirmed ? (
                                                                            <div className="hc-not-required">Not Required</div>
                                                                        ) : (
                                                                            <ConnectCell
                                                                                date={formatDate(item.day_270_date)}
                                                                                status={item.day_270_status}
                                                                                options={statusOptions.day_270}
                                                                                reminderSent={item.day_270_reminder_sent}
                                                                                remark={item.day_270_remark}
                                                                                onStatusChange={v => updateStatus(item.candidate_id, '270_day', v)}
                                                                                onRemarkChange={v => updateRemarkLocal(item.candidate_id, '270_day', v)}
                                                                                onSaveRemark={() => saveRemark(item.candidate_id, '270_day')}
                                                                            />
                                                                        )}
                                                                    </td>
                                                                    <td className="hc-td-group">
                                                                        {isConfirmed ? (
                                                                            <div className="hc-not-required">Not Required</div>
                                                                        ) : (
                                                                            <ConnectCell
                                                                                date={formatDate(item.day_365_date)}
                                                                                status={item.day_365_status}
                                                                                options={statusOptions.day_365}
                                                                                reminderSent={item.day_365_reminder_sent}
                                                                                remark={item.day_365_remark}
                                                                                onStatusChange={v => updateStatus(item.candidate_id, '365_day', v)}
                                                                                onRemarkChange={v => updateRemarkLocal(item.candidate_id, '365_day', v)}
                                                                                onSaveRemark={() => saveRemark(item.candidate_id, '365_day')}
                                                                            />
                                                                        )}
                                                                    </td>
                                                                </>
                                                            )}

                                                            {/* CONFIRMATION STATUS */}
                                                            <td className="hc-td-group">
                                                                <select
                                                                    className={`hc-status-select ${item.confirmation_status === "Confirmed" ? "confirmed" : "notconfirmed"}`}
                                                                    value={item.confirmation_status}
                                                                    onChange={e => updateStatus(item.candidate_id, 'confirmation', e.target.value)}
                                                                >
                                                                    {statusOptions.confirmation.length > 0 ? (
                                                                        statusOptions.confirmation.map(opt => (
                                                                            <option key={opt} value={opt}>{opt}</option>
                                                                        ))
                                                                    ) : (
                                                                        <option value={item.confirmation_status}>{item.confirmation_status}</option>
                                                                    )}
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
