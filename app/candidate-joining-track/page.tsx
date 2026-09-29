"use client"
import { useState, useEffect } from "react"
import {
    ArrowLeft,
    Search,
    Briefcase,
    MapPin,
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
    Save,
    Mail,
    Phone,
    CalendarCheck,
} from "lucide-react"
import Link from "next/link"
import { API_BASE_URL } from '@/lib/api-config'
import { getFrappeCSRF } from "@/lib/csrf"

const API_MODULE_PATH = "resume.api.joining_track"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .jt {
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

    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13.5px;
    -webkit-font-smoothing: antialiased;
  }

  .jt-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  /* ══ SIDEBAR ══ */
  .jt-sb {
    width: var(--sb-w); background: var(--sb);
    min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 100;
    display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .jt-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }
  .jt-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }
  .jt-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
  }
  .jt-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .jt-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; line-height: 1.25; }
  .jt-sb-sub  { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
  .jt-sb-close {
    margin-left: auto; flex-shrink: 0; width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer; color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center; transition: all .14s;
  }
  .jt-sb-close:hover { background: var(--sb-hover); color: #fff; }
  .jt-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .jt-nav::-webkit-scrollbar { width: 3px; }
  .jt-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }
  .jt-nav-cta {
    display: flex; align-items: center; gap: 9px;
    padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    color: var(--accent); font-size: 13px; font-weight: 600;
    text-decoration: none; transition: background .15s; margin-bottom: 22px;
  }
  .jt-nav-cta:hover { background: rgba(0,158,247,.24); }
  .jt-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
  }
  .jt-nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt);
    text-decoration: none; transition: all .14s;
  }
  .jt-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; }
  .jt-nav-link:hover { background: var(--sb-hover); color: #fff; }
  .jt-nav-link:hover svg { opacity: 1; }
  .jt-nav-link.active { background: var(--sb-hover); color: #fff; }
  .jt-nav-link.active svg { opacity: 1; }
  .jt-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .jt-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; border-radius: 8px; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--sb-lbl); text-align: left; transition: all .14s;
  }
  .jt-logout svg { opacity: .6; width: 15px; height: 15px; }
  .jt-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }
  .jt-overlay {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
  }
  @media (max-width: 768px) { .jt-overlay.show { display: block; } }

  /* ══ MAIN ══ */
  .jt-main {
    margin-left: var(--sb-w); flex: 1;
    display: flex; flex-direction: column; min-height: 100vh;
    transition: margin-left .25s cubic-bezier(.4,0,.2,1);
  }
  .jt-main.sb-closed { margin-left: 0; }

  /* ══ HEADER ══ */
  .jt-header {
    min-height: 60px; background: #fff; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 1px 0 rgba(0,158,247,.08);
  }
  .jt-toggle {
    width: 34px; height: 34px; border-radius: 8px;
    background: none; border: 1px solid var(--border);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .jt-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .jt-btn-back {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    background: transparent; color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer; text-decoration: none;
    transition: all .14s; white-space: nowrap;
  }
  .jt-btn-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .jt-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .jt-crumb { display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--t3); }
  .jt-crumb svg { width: 13px; height: 13px; flex-shrink: 0; }
  .jt-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }

  /* ══ PAGE ══ */
  .jt-page { padding: 28px 32px; display: flex; flex-direction: column; gap: 20px; }
  .jt-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
  .jt-page-title { font-size: 20px; font-weight: 800; color: var(--t1); letter-spacing: -0.4px; }
  .jt-page-sub   { font-size: 13px; color: var(--t3); margin-top: 4px; }

  /* ══ STATS ══ */
  .jt-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .jt-stat {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 16px 18px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }
  .jt-stat-label { font-size: 11.5px; color: var(--t3); font-weight: 500; margin-bottom: 4px; }
  .jt-stat-val   { font-size: 22px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; line-height: 1; }
  .jt-stat-val.blue   { color: var(--accent); }
  .jt-stat-val.green  { color: var(--green); }
  .jt-stat-val.yellow { color: var(--yellow); }
  .jt-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .jt-stat-icon.blue   { background: var(--accent-lt); color: var(--accent); }
  .jt-stat-icon.green  { background: var(--green-lt); color: var(--green); }
  .jt-stat-icon.yellow { background: var(--yellow-lt); color: var(--yellow); }

  /* ══ SEARCH + FILTER ══ */
  .jt-toolrow { display: flex; gap: 12px; }
  .jt-search-wrap {
    flex: 1; background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 14px 16px;
    box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }
  .jt-search-inner { position: relative; }
  .jt-search-inner > svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--t3); width: 16px; height: 16px; }
  .jt-search-input {
    width: 100%; height: 40px; padding: 0 12px 0 42px;
    border: 1px solid var(--border); border-radius: 8px; background: var(--bg);
    font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--t1);
    outline: none; transition: all .15s;
  }
  .jt-search-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .jt-filter-wrap {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 14px 16px;
    box-shadow: 0 1px 3px rgba(0,158,247,.06); display: flex; align-items: center;
  }
  .jt-select {
    height: 40px; padding: 0 32px 0 13px; min-width: 170px;
    border: 1px solid var(--border); border-radius: 8px;
    background: var(--bg); font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--t2); appearance: none;
    outline: none; cursor: pointer;
  }

  /* ══ TABLE CARD ══ */
  .jt-table-card {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 12px; overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .jt-table { width: 100%; border-collapse: collapse; }
  .jt-table thead tr { background: linear-gradient(to right, #f8fbff, #eef7ff); border-bottom: 1px solid var(--border-s); }
  .jt-table th {
    padding: 12px 16px; text-align: left; font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.07em; color: var(--t2); white-space: nowrap;
  }
  .jt-table tbody tr { border-bottom: 1px solid var(--border-s); transition: background .12s; }
  .jt-table tbody tr:last-child { border-bottom: none; }
  .jt-table tbody tr:hover { background: #f8fbff; }
  .jt-table td { padding: 12px 16px; vertical-align: top; font-size: 13px; color: var(--t1); }

  .jt-cand-name { font-weight: 700; color: var(--t1); font-size: 13.5px; }
  .jt-cand-sub { font-size: 11.5px; color: var(--t3); display: flex; align-items: center; gap: 4px; margin-top: 2px; }
  .jt-sno { font-size: 13px; font-weight: 700; color: var(--t3); width: 36px; text-align: center; }

  .jt-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .jt-badge.green  { background: var(--green-lt); color: var(--green); border: 1px solid var(--green-bdr); }
  .jt-badge.yellow { background: var(--yellow-lt); color: var(--yellow); border: 1px solid var(--yellow-bdr); }

  .jt-date-row { display: flex; align-items: center; gap: 5px; font-size: 12.5px; }
  .jt-date-lbl { font-size: 10.5px; color: var(--t3); margin-bottom: 2px; }

  .jt-remark-wrap { display: flex; flex-direction: column; gap: 6px; min-width: 300px; }
  .jt-remark-input {
    width: 100%; height: 64px; padding: 7px 10px; border-radius: 7px;
    border: 1px solid var(--border); background: var(--bg); color: var(--t1);
    font-family: 'Inter', sans-serif; font-size: 12.5px; outline: none;
    resize: none; overflow-y: auto; transition: all .15s;
  }
  .jt-remark-input::-webkit-scrollbar { width: 5px; }
  .jt-remark-input::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  .jt-remark-input:focus { border-color: var(--accent); background: #fff; box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .jt-remark-save {
    align-self: flex-end; display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 6px; background: var(--accent); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 11.5px; font-weight: 600; border: none;
    cursor: pointer; transition: background .14s;
  }
  .jt-remark-save:hover:not(:disabled) { background: var(--accent-h); }
  .jt-remark-save:disabled { opacity: .55; cursor: not-allowed; }
  .jt-remark-saved { font-size: 11px; color: var(--green); display: flex; align-items: center; gap: 4px; }

  .jt-empty {
    text-align: center; padding: 60px 20px;
  }
  .jt-empty-icon { width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 18px; background: var(--accent-lt); color: var(--accent); display: flex; align-items: center; justify-content: center; }
  .jt-empty-title { font-size: 15px; font-weight: 700; color: var(--t1); margin-bottom: 6px; }
  .jt-empty-sub   { font-size: 13px; color: var(--t3); }

  .jt-loading { min-height: 100vh; background: var(--bg); display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 16px; }
  .jt-spinner { width: 44px; height: 44px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent); animation: jt-spin .7s linear infinite; }
  @keyframes jt-spin { to { transform: rotate(360deg); } }
  .jt-loading-txt { font-size: 14px; color: var(--t3); font-weight: 500; }

  @media (max-width: 900px) {
    .jt-stats { grid-template-columns: 1fr; }
    .jt-toolrow { flex-direction: column; }
    .jt-table-card { overflow-x: auto; }
  }
  @media (max-width: 768px) {
    .jt-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .jt-sb.open { transform: translateX(0); }
    .jt-main { margin-left: 0 !important; }
    .jt-page { padding: 12px; }
    .jt-header { padding: 0 12px; gap: 6px; }
    .jt-hdr-sep { display: none; }
  }
`

interface JoiningTrackItem {
    candidate_id: string
    offer_name: string
    applicant_name: string
    email: string
    phone: string
    designation: string
    location: string
    status: "Selected" | "Joined"
    expected_joining_date: string | null
    actual_joining_date: string | null
    remark: string
}

export default function CandidateJoiningTrackPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [items, setItems] = useState<JoiningTrackItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [remarkDrafts, setRemarkDrafts] = useState<Record<string, string>>({})
    const [savingRemark, setSavingRemark] = useState<Record<string, boolean>>({})
    const [savedRemark, setSavedRemark] = useState<Record<string, boolean>>({})

    useEffect(() => { document.title = 'Candidate Joining Track' }, [])

    const fetchTrackList = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_joining_track_list`,
                { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
            )
            const result = await res.json()
            const data: JoiningTrackItem[] = result?.message?.data || []
            setItems(data)
            const drafts: Record<string, string> = {}
            data.forEach(d => { drafts[d.candidate_id] = d.remark || "" })
            setRemarkDrafts(drafts)
        } catch (e) {
            console.error("Error fetching joining track list:", e)
            setItems([])
        } finally { setIsLoading(false) }
    }

    useEffect(() => { fetchTrackList() }, [])

    const saveRemark = async (candidateId: string) => {
        setSavingRemark(prev => ({ ...prev, [candidateId]: true }))
        setSavedRemark(prev => ({ ...prev, [candidateId]: false }))
        try {
            const csrfToken = await getFrappeCSRF()
            const res = await fetch(
                `${API_BASE_URL}/api/method/${API_MODULE_PATH}.update_joining_remark`,
                {
                    method: 'POST', credentials: 'include',
                    headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken },
                    body: JSON.stringify({ candidate_id: candidateId, remark: remarkDrafts[candidateId] || "" })
                }
            )
            const result = await res.json()
            if (result?.message?.success) {
                setItems(prev => prev.map(i => i.candidate_id === candidateId ? { ...i, remark: remarkDrafts[candidateId] || "" } : i))
                setSavedRemark(prev => ({ ...prev, [candidateId]: true }))
                setTimeout(() => setSavedRemark(prev => ({ ...prev, [candidateId]: false })), 2000)
            } else {
                alert("Failed to save remark.")
            }
        } catch (e) {
            alert("Error saving remark.")
        } finally {
            setSavingRemark(prev => ({ ...prev, [candidateId]: false }))
        }
    }

    const formatDate = (d: string | null) => {
        if (!d) return "Not set"
        return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    const filteredItems = items.filter(item => {
        const matchesSearch =
            item.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === "all" || item.status === filterStatus
        return matchesSearch && matchesStatus
    })

    const totalAccepted = items.length
    const totalSelected = items.filter(i => i.status === "Selected").length
    const totalJoined = items.filter(i => i.status === "Joined").length

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
    ]

    if (isLoading) {
        return (
            <div className="jt"><style>{css}</style>
                <div className="jt-loading"><div className="jt-spinner" /><p className="jt-loading-txt">Loading Joining Track...</p></div>
            </div>
        )
    }

    return (
        <>
            <style>{css}</style>
            <div className="jt">
                <div className="jt-wrap">
                    <div className={`jt-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

                    {/* ══ SIDEBAR ══ */}
                    <aside className={`jt-sb${sidebarOpen ? "" : " collapsed"}`}>
                        <div className="jt-sb-brand">
                            <div className="jt-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
                            <div><div className="jt-sb-name">Job Management</div><div className="jt-sb-sub">HR Platform</div></div>
                            <button className="jt-sb-close" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
                        </div>
                        <nav className="jt-nav">
                            <Link href="/create-job" className="jt-nav-cta"><Plus size={14} /> New Job Opening</Link>
                            <div className="jt-nav-lbl">General</div>
                            <Link href="/home" className="jt-nav-link"><Home size={15} /> Home</Link>
                            <div className="jt-nav-lbl">Pipeline</div>
                            {sidebarPipeline.map(s => <Link key={s.href} href={s.href} className="jt-nav-link">{s.icon} {s.title}</Link>)}
                            <div className="jt-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
                            {sidebarClosing.map(s => <Link key={s.href} href={s.href} className={`jt-nav-link${s.href === "/candidate-joining-track" ? " active" : ""}`}>{s.icon} {s.title}</Link>)}
                        </nav>
                        <div className="jt-sb-foot"><button className="jt-logout"><LogOut size={15} /> Sign out</button></div>
                    </aside>

                    {/* ══ MAIN ══ */}
                    <div className={`jt-main${sidebarOpen ? "" : " sb-closed"}`}>
                        <header className="jt-header">
                            <button className="jt-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
                            <div className="jt-hdr-sep" />
                            <Link href="/home" className="jt-btn-back"><ArrowLeft size={13} /> Back</Link>
                            <div className="jt-hdr-sep" />
                            <div className="jt-crumb">
                                <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'inherit', textDecoration: 'none' }}>
                                    <Home size={13} /> Home
                                </Link>
                                <ChevronRight size={13} />
                                <strong>Candidate Joining Track</strong>
                            </div>
                        </header>

                        <div className="jt-page">
                            <div className="jt-toolbar">
                                <div>
                                    <h1 className="jt-page-title">Candidate Joining Track</h1>
                                    <p className="jt-page-sub">Track candidates with accepted offers — from selection until they actually join</p>
                                </div>
                            </div>

                            {/* ══ STATS ══ */}
                            <div className="jt-stats">
                                <div className="jt-stat">
                                    <div><div className="jt-stat-label">Total Accepted Offers</div><div className="jt-stat-val blue">{totalAccepted}</div></div>
                                    <div className="jt-stat-icon blue"><Users size={18} /></div>
                                </div>
                                <div className="jt-stat">
                                    <div><div className="jt-stat-label">Selected (Not Joined)</div><div className="jt-stat-val yellow">{totalSelected}</div></div>
                                    <div className="jt-stat-icon yellow"><Clock size={18} /></div>
                                </div>
                                <div className="jt-stat">
                                    <div><div className="jt-stat-label">Joined</div><div className="jt-stat-val green">{totalJoined}</div></div>
                                    <div className="jt-stat-icon green"><CheckCircle size={18} /></div>
                                </div>
                            </div>

                            {/* ══ SEARCH + FILTER ══ */}
                            <div className="jt-toolrow">
                                <div className="jt-search-wrap">
                                    <div className="jt-search-inner">
                                        <Search size={16} />
                                        <input
                                            type="text" className="jt-search-input"
                                            placeholder="Search by name, email, designation, or location..."
                                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="jt-filter-wrap">
                                    <select className="jt-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                        <option value="all">All Statuses</option>
                                        <option value="Selected">Selected</option>
                                        <option value="Joined">Joined</option>
                                    </select>
                                </div>
                            </div>

                            {/* ══ TABLE ══ */}
                            {filteredItems.length > 0 && (
                                <div style={{ fontSize: 12.5, color: 'var(--t3)', fontWeight: 500 }}>
                                    Showing {filteredItems.length} candidate{filteredItems.length !== 1 ? 's' : ''}
                                </div>
                            )}
                            <div className="jt-table-card">
                                {filteredItems.length === 0 ? (
                                    <div className="jt-empty">
                                        <div className="jt-empty-icon"><CalendarCheck size={28} /></div>
                                        <p className="jt-empty-title">No Candidates Found</p>
                                        <p className="jt-empty-sub">
                                            {searchTerm || filterStatus !== "all"
                                                ? "Try adjusting your search or filter"
                                                : "Candidates with an Accepted offer will appear here"}
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table className="jt-table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Candidate</th>
                                                    <th>Designation</th>
                                                    <th>Location</th>
                                                    <th>Status</th>
                                                    <th>Joining Date</th>
                                                    <th>Remark</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredItems.map((item, index) => (
                                                    <tr key={item.candidate_id}>
                                                        <td className="jt-sno">{index + 1}</td>
                                                        <td>
                                                            <div className="jt-cand-name">{item.applicant_name}</div>
                                                            <div className="jt-cand-sub"><Mail size={11} /> {item.email || "N/A"}</div>
                                                            {item.phone && <div className="jt-cand-sub"><Phone size={11} /> {item.phone}</div>}
                                                        </td>
                                                        <td><div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Briefcase size={12} style={{ color: 'var(--accent)' }} />{item.designation || "Not Set"}</div></td>
                                                        <td><div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={12} style={{ color: '#7c3aed' }} />{item.location || "Not Set"}</div></td>
                                                        <td>
                                                            {item.status === "Joined"
                                                                ? <span className="jt-badge green"><CheckCircle size={10} /> Joined</span>
                                                                : <span className="jt-badge yellow"><Clock size={10} /> Selected</span>}
                                                        </td>
                                                        <td>
                                                            <div className="jt-date-lbl">{item.status === "Joined" ? "Joined On" : "Expected Joining"}</div>
                                                            <div className="jt-date-row">
                                                                <Calendar size={12} style={{ color: 'var(--accent)' }} />
                                                                {item.status === "Joined"
                                                                    ? formatDate(item.actual_joining_date)
                                                                    : formatDate(item.expected_joining_date)}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="jt-remark-wrap">
                                                                <textarea
                                                                    className="jt-remark-input"
                                                                    rows={2}
                                                                    placeholder="Type a remark..."
                                                                    value={remarkDrafts[item.candidate_id] ?? ""}
                                                                    onChange={e => setRemarkDrafts(prev => ({ ...prev, [item.candidate_id]: e.target.value }))}
                                                                />
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                                    {savedRemark[item.candidate_id] && (
                                                                        <span className="jt-remark-saved"><CheckCircle size={11} /> Saved</span>
                                                                    )}
                                                                    <button
                                                                        className="jt-remark-save"
                                                                        onClick={() => saveRemark(item.candidate_id)}
                                                                        disabled={!!savingRemark[item.candidate_id]}
                                                                    >
                                                                        {savingRemark[item.candidate_id] ? "Saving..." : <><Save size={11} /> Save</>}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
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
