// 'use client'
// import { useState, useEffect } from "react"
// import type React from "react"
// import { useRouter } from "next/navigation"
// import {
//   Briefcase, Upload, MessageSquare, FileText,
//   UserCheck, Plus, ArrowRight, Calendar,
//   Users, Zap, LogOut, ChevronRight, Home, Menu, X,
//   Database,
//   Bot,
//   CalendarCheck,
//   Bell,
// } from "lucide-react"
// import Link from "next/link"
// import { API_BASE_URL } from '@/lib/api-config'
// import { getFrappeCSRF } from "@/lib/csrf"

// const css = `
//   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   .v1 {
//     --sb-w:      265px;
//     --sb:        #1e1e2d;
//     --sb2:       #151521;
//     --sb-hover:  #2b2b40;
//     --sb-bdr:    rgba(255,255,255,.07);
//     --sb-txt:    #9899ac;
//     --sb-lbl:    #474761;

//     --accent:    #009ef7;
//     --accent-h:  #007ec4;
//     --accent-lt: #e0f4ff;
//     --accent-md: rgba(0,158,247,.15);

//     --bg:        #f0f8fe;
//     --card:      #ffffff;
//     --border:    #cce8f8;
//     --border-s:  #ddf0fb;

//     --t1:        #0d1b2a;
//     --t2:        #2d5a78;
//     --t3:        #6a9cb8;

//     font-family: 'Inter', system-ui, sans-serif;
//     font-size: 13.5px;
//     -webkit-font-smoothing: antialiased;
//   }

//   .v1-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

//   /* ══════════════════════════
//      SIDEBAR
//   ══════════════════════════ */
//   .v1-sb {
//     width: var(--sb-w); background: var(--sb);
//     min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 200;
//     display: flex; flex-direction: column;
//     transition: transform .25s cubic-bezier(.4,0,.2,1);
//   }

//   .v1-sb.collapsed {
//     transform: translateX(calc(-1 * var(--sb-w)));
//   }

//   .v1-sb-brand {
//     height: 64px; display: flex; align-items: center; gap: 12px;
//     padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
//   }

//   .v1-sb-icon {
//     width: 38px; height: 38px; border-radius: 10px;
//     background: rgba(0,158,247,.15); border: 1px solid rgba(0,158,247,.25);
//     display: flex; align-items: center; justify-content: center; overflow: hidden;
//     flex-shrink: 0;
//   }
//   .v1-sb-icon img {
//     width: 24px; height: 24px; object-fit: contain;
//     filter: brightness(0) invert(1);
//   }

//   .v1-sb-name {
//     font-size: 14px; font-weight: 700; color: #ffffff;
//     letter-spacing: -0.1px; line-height: 1.25;
//   }
//   .v1-sb-sub {
//     font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px;
//   }

//   .v1-sb-close {
//     margin-left: auto; flex-shrink: 0;
//     width: 28px; height: 28px; border-radius: 7px;
//     background: none; border: none; cursor: pointer;
//     color: var(--sb-lbl);
//     display: flex; align-items: center; justify-content: center;
//     transition: all .14s;
//   }
//   .v1-sb-close:hover { background: var(--sb-hover); color: #fff; }

//   .v1-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
//   .v1-nav::-webkit-scrollbar { width: 3px; }
//   .v1-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }

//   .v1-nav-cta {
//     display: flex; align-items: center; gap: 9px;
//     padding: 11px 14px; border-radius: 9px;
//     background: var(--accent-md);
//     border: 1px solid rgba(0,158,247,.28);
//     color: var(--accent); font-size: 13px; font-weight: 600;
//     text-decoration: none; transition: background .15s;
//     margin-bottom: 22px; letter-spacing: -0.1px;
//   }
//   .v1-nav-cta:hover { background: rgba(0,158,247,.24); }
//   .v1-nav-cta svg { flex-shrink: 0; }

//   .v1-nav-lbl {
//     font-size: 9.5px; font-weight: 700; text-transform: uppercase;
//     letter-spacing: .11em; color: var(--sb-lbl);
//     padding: 4px 12px 7px; margin-top: 4px;
//   }

//   .v1-nav-link {
//     display: flex; align-items: center; gap: 10px;
//     padding: 9px 12px; border-radius: 8px;
//     font-size: 13px; font-weight: 500; color: var(--sb-txt);
//     text-decoration: none; transition: all .14s;
//   }
//   .v1-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; transition: opacity .14s; }
//   .v1-nav-link:hover { background: var(--sb-hover); color: #ffffff; }
//   .v1-nav-link:hover svg { opacity: 1; }

//   .v1-sb-foot {
//     padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0;
//   }

//   .v1-logout {
//     display: flex; align-items: center; gap: 10px; width: 100%;
//     padding: 9px 12px; border-radius: 8px; background: none; border: none;
//     cursor: pointer; font-family: 'Inter', sans-serif;
//     font-size: 13px; font-weight: 500; color: var(--sb-lbl);
//     text-align: left; transition: all .14s;
//   }
//   .v1-logout svg { opacity: .6; width: 15px; height: 15px; }
//   .v1-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }
//   .v1-logout:hover svg { opacity: 1; }

//   /* CHANGE 1: Overlay only on mobile — hidden on desktop */
//   .v1-overlay {
//     display: none;
//     position: fixed; inset: 0; z-index: 150;
//     background: rgba(13,27,42,.35); backdrop-filter: blur(2px);
//     cursor: pointer;
//   }
//   @media (max-width: 768px) {
//     .v1-overlay.show { display: block; }
//   }

//   /* ══════════════════════════
//      MAIN
//   ══════════════════════════ */
//   .v1-main {
//     margin-left: var(--sb-w); flex: 1;
//     display: flex; flex-direction: column; min-height: 100vh;
//     transition: margin-left .25s cubic-bezier(.4,0,.2,1);
//   }

//   .v1-main.sb-closed { margin-left: 0; }

//   .v1-header {
//     height: 60px; background: #ffffff;
//     border-bottom: 1px solid var(--border);
//     display: flex; align-items: center;
//     padding: 0 28px; gap: 12px;
//     position: sticky; top: 0; z-index: 50;
//     box-shadow: 0 1px 0 rgba(0,158,247,.08);
//   }

//   .v1-toggle {
//     width: 34px; height: 34px; border-radius: 8px;
//     background: none; border: 1px solid var(--border);
//     cursor: pointer; display: flex; align-items: center; justify-content: center;
//     color: var(--t2); flex-shrink: 0; transition: all .14s;
//   }
//   .v1-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

//   .v1-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }

//   .v1-crumb {
//     display: flex; align-items: center; gap: 6px;
//     font-size: 13px; color: var(--t3);
//   }
//   .v1-crumb svg { width: 13px; height: 13px; color: var(--t3); }
//   .v1-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }

//   .v1-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }

//   .v1-btn {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 8px 18px; border-radius: 8px;
//     background: var(--accent); color: #fff;
//     font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
//     border: none; cursor: pointer; text-decoration: none; white-space: nowrap;
//     transition: background .15s; letter-spacing: -0.1px;
//   }
//   .v1-btn:hover { background: var(--accent-h); }

//   .v1-btn-out {
//     display: inline-flex; align-items: center; gap: 7px;
//     padding: 7px 14px; border-radius: 8px;
//     background: transparent; color: var(--t3);
//     font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
//     border: 1px solid var(--border); cursor: pointer; transition: all .15s;
//     white-space: nowrap;
//   }
//   .v1-btn-out:hover { background: #fff0f0; border-color: #fca5a5; color: #dc2626; }

//   /* ══════════════════════════
//      PAGE CONTENT
//   ══════════════════════════ */
//   .v1-page {
//     padding: 30px 32px;
//     display: flex; flex-direction: column; gap: 26px;
//   }

//   .v1-toolbar {
//     display: flex; align-items: flex-start;
//     justify-content: space-between; gap: 20px;
//   }

//   .v1-page-title {
//     font-size: 21px; font-weight: 800; color: var(--t1);
//     letter-spacing: -0.5px; line-height: 1.15;
//   }
//   .v1-page-sub {
//     font-size: 13px; color: var(--t3); margin-top: 5px; font-weight: 400;
//   }

//   .v1-sec-head {
//     display: flex; align-items: flex-end;
//     justify-content: space-between; margin-bottom: 16px;
//     padding-bottom: 14px;
//     border-bottom: 1px solid var(--border-s);
//   }

//   .v1-sec-title {
//     font-size: 15px; font-weight: 700; color: var(--t1); letter-spacing: -0.2px;
//   }
//   .v1-sec-sub {
//     font-size: 12.5px; color: var(--t3); margin-top: 3px;
//   }

//   .v1-badge {
//     display: inline-flex; align-items: center;
//     padding: 4px 12px; border-radius: 20px;
//     font-size: 11.5px; font-weight: 600;
//     background: var(--accent-lt);
//     border: 1px solid var(--border);
//     color: var(--accent);
//     white-space: nowrap;
//   }

//   .v1-grid {
//     display: grid;
//     grid-template-columns: repeat(2, 1fr);
//     gap: 12px;
//   }

//   .v1-card {
//     background: var(--card);
//     border: 1px solid var(--border-s);
//     border-radius: 10px;
//     padding: 16px 18px;
//     display: flex; align-items: center; gap: 14px;
//     text-decoration: none; cursor: pointer;
//     transition: box-shadow .15s, transform .15s, border-color .15s;
//     box-shadow: 0 1px 3px rgba(0,158,247,.06);
//   }

//   .v1-card:hover {
//     box-shadow: 0 6px 22px rgba(0,158,247,.14);
//     transform: translateY(-2px);
//     border-color: rgba(0,158,247,.45);
//   }

//   .v1-card-icon {
//     width: 42px; height: 42px; border-radius: 10px;
//     background: var(--accent-lt); color: var(--accent);
//     display: flex; align-items: center; justify-content: center;
//     flex-shrink: 0; transition: all .15s;
//   }
//   .v1-card:hover .v1-card-icon {
//     background: var(--accent); color: #fff;
//   }

//   .v1-card-body { flex: 1; min-width: 0; }

//   .v1-card-title {
//     font-size: 13.5px; font-weight: 600; color: var(--t1);
//     letter-spacing: -0.1px; line-height: 1.3;
//   }
//   .v1-card-desc {
//     font-size: 12px; color: var(--t3); margin-top: 2px; line-height: 1.4;
//   }

//   .v1-card-arrow {
//     color: var(--border); flex-shrink: 0;
//     transition: color .15s, transform .15s;
//   }
//   .v1-card:hover .v1-card-arrow {
//     color: var(--accent); transform: translateX(3px);
//   }

//   .v1-divider {
//     grid-column: 1 / -1;
//     display: flex; align-items: center; gap: 10px;
//     padding: 4px 0;
//   }
//   .v1-divider-line { flex: 1; height: 1px; background: var(--border-s); }
//   .v1-divider-txt {
//     font-size: 9.5px; font-weight: 700; text-transform: uppercase;
//     letter-spacing: .1em; color: var(--t3);
//   }

//   /* ══════════════════════════
//      RESPONSIVE
//   ══════════════════════════ */
//   @media (max-width: 960px) {
//     .v1-grid { grid-template-columns: 1fr; }
//   }

//   @media (max-width: 768px) {
//     .v1-sb { transform: translateX(calc(-1 * var(--sb-w))); z-index: 200; }
//     .v1-sb.open { transform: translateX(0); }
//     .v1-main { margin-left: 0 !important; overflow-x: hidden; }
//     .v1-wrap { overflow-x: hidden; }
//     .v1-page { padding: 16px 14px; }
//     .v1-header { padding: 0 12px; gap: 6px; min-height: 56px; overflow: hidden; }
//     .v1-hdr-sep { display: none; }
//     .v1-toolbar { flex-direction: column; gap: 10px; }
//     .v1-btn { width: 100%; justify-content: center; }
//     .v1-crumb { font-size: 12px; flex: 1; min-width: 0; overflow: hidden; }
//     .v1-crumb strong { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; }
//     .v1-grid { grid-template-columns: 1fr; gap: 10px; }
//   }
// `

// interface WorkflowStep {
//   id: string; title: string; description: string
//   icon: React.ReactNode; status: "completed" | "current" | "pending"
//   route?: string; color: string
// }

// export default function RecruitmentDashboard() {
//   const router = useRouter()
//   const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
//   // CHANGE 2: default false — sidebar closed on page load
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   const [userRoles, setUserRoles] = useState<string[]>([])
//   const [isSiteHRRole, setIsSiteHRRole] = useState(false)
//   const [roleLoading, setRoleLoading] = useState(true)
//   const [roleError, setRoleError] = useState(false)

//   const handleLogout = async () => {
//     const LOGOUT_URL = `${API_BASE_URL}/api/method/logout`
//     const csrfToken = await getFrappeCSRF()
//     const response = await fetch(LOGOUT_URL, {
//       method: 'POST', credentials: "include",
//       headers: { "X-Frappe-CSRF-Token": csrfToken }
//     })
//     if (response.ok) router.push("/Login")
//     else console.error("Logout failed", await response.text())
//   }

//   // useEffect(() => { document.title = 'Dashboard' }, [])
//   useEffect(() => {
//     document.title = "Dashboard"

//     const fetchUserRoles = async () => {
//       try {
//         setRoleLoading(true)
//         setRoleError(false)

//         const response = await fetch(
//           `${API_BASE_URL}/api/method/resume.api.job_opening.get_current_user_roles`,
//           {
//             method: "GET",
//             credentials: "include",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         )

//         if (!response.ok) {
//           throw new Error("Failed to fetch user roles")
//         }

//         const result = await response.json()

//         const data = result?.message

//         if (!data?.success) {
//           throw new Error(data?.message || "Unable to get user roles")
//         }

//         setUserRoles(data.roles || [])
//         setIsSiteHRRole(Boolean(data.is_site_hr_role))

//       } catch (error) {
//         console.error("Role fetch error:", error)
//         setRoleError(true)
//       } finally {
//         setRoleLoading(false)
//       }
//     }

//     fetchUserRoles()
//   }, [])

//   const workflowSteps: WorkflowStep[] = [
//     { id: "job-opening", title: "Job Opening", description: "Create or select job opening", icon: <Briefcase className="h-4 w-4" />, status: selectedJobId ? "completed" : "current", route: "/job-opening", color: "" },
//     { id: "resume", title: "Resume Collection", description: "Upload and process resumes", icon: <Upload className="h-4 w-4" />, status: selectedJobId ? "current" : "pending", route: "/upload-resumes", color: "" },
//     { id: "candidates", title: "Candidates", description: "View and manage candidates", icon: <Users className="h-4 w-4" />, status: "pending", route: "/candidates", color: "" },
//     { id: "interview", title: "Interview Scheduling", description: "Schedule and conduct interviews", icon: <Calendar className="h-4 w-4" />, status: "pending", route: "/interview", color: "" },
//     { id: "feedback", title: "Candidate Feedback", description: "Review and provide feedback", icon: <MessageSquare className="h-4 w-4" />, status: "pending", route: "/feedback", color: "" },
//     { id: "doc-verify", title: "Document Verification", description: "Verify Documents", icon: <FileText className="h-4 w-4" />, status: "pending", route: "/document-verify-list", color: "" },
//     { id: "salary-annexure", title: "Salary Annexure", description: "Prepare and manage salary structures", icon: <FileText className="h-4 w-4" />, status: "pending", route: "/salary-annexure", color: "" },
//     { id: "salary-annexure-list", title: "Salary Annexure List", description: "View all salary annexures", icon: <FileText className="h-4 w-4" />, status: "pending", route: "/salary-annexure-list", color: "" },
//     { id: "offer", title: "Offer Letter", description: "Generate and send offers", icon: <Zap className="h-4 w-4" />, status: "pending", route: "/offer-list", color: "" },
//     { id: "appointment", title: "Appointment Letter", description: "Final appointment process", icon: <UserCheck className="h-4 w-4" />, status: "pending", route: "/letter-appointment", color: "" },
//     // { id: "assistant", title: "Assistant", description: "Resume Intelligence AI", icon: <Bot className="h-4 w-4" />, status: "pending", route: "/chat", color: "" },
//     { id: "data_bank", title: "Data Bank", description: "Search Resume with multiple Filters", icon: <Database className="h-4 w-4" />, status: "pending", route: "/data_bank", color: "" },
//     { id: "joining-track", title: "Candidate Joining Track", description: "Track candidate joining status & dates", icon: <CalendarCheck className="h-4 w-4" />, status: "pending", route: "/candidate-joining-track", color: "" },
//     { id: "hr-connect-track", title: "HR Connect Track", description: "30/90/180 day post-joining connect tracker", icon: <Bell className="h-4 w-4" />, status: "pending", route: "/hr-connect-track", color: "" },
//   ]

//   // const pipeline = workflowSteps.slice(0, 4)
//   // const closing = workflowSteps.slice(4)

//   const SITE_HR_ALLOWED_STEP_IDS = [
//     "job-opening",
//     "resume",
//     "candidates",
//     "interview",
//     "feedback",
//     "doc-verify",
//     "data_bank",
//   ]

//   const visibleWorkflowSteps = isSiteHRRole
//     ? workflowSteps.filter(step =>
//       SITE_HR_ALLOWED_STEP_IDS.includes(step.id)
//     )
//     : workflowSteps

//   const pipeline = visibleWorkflowSteps.slice(0, 4)
//   const closing = visibleWorkflowSteps.slice(4)

//   if (roleLoading) {
//     return (
//       <>
//         <style>{css}</style>

//         <div
//           style={{
//             minHeight: "100vh",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             background: "#f0f8fe",
//             color: "#2d5a78",
//             fontSize: "14px",
//           }}
//         >
//           Loading dashboard...
//         </div>
//       </>
//     )
//   }
//   if (roleError) {
//     return (
//       <>
//         <style>{css}</style>

//         <div
//           style={{
//             minHeight: "100vh",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             flexDirection: "column",
//             gap: "10px",
//             background: "#f0f8fe",
//             color: "#2d5a78",
//           }}
//         >
//           <strong>Unable to load user permissions.</strong>
//           <span>Please refresh the page or contact administrator.</span>
//         </div>
//       </>
//     )
//   }

//   return (
//     <>
//       <style>{css}</style>
//       <div className="v1">
//         <div className="v1-wrap">

//           {/* CHANGE 3: Overlay — mobile only (CSS hides it on desktop) */}
//           <div
//             className={`v1-overlay${sidebarOpen ? " show" : ""}`}
//             onClick={() => setSidebarOpen(false)}
//           />

//           {/* ══ SIDEBAR ══ */}
//           <aside className={`v1-sb${sidebarOpen ? " open" : " collapsed"}`}>
//             <div className="v1-sb-brand">
//               <div className="v1-sb-icon">
//                 <img src="/vaaman_logo.png" alt="logo" />
//               </div>
//               <div>
//                 <div className="v1-sb-name">Job Management</div>
//                 <div className="v1-sb-sub">HR Platform</div>
//               </div>
//               <button className="v1-sb-close" onClick={() => setSidebarOpen(false)} title="Close sidebar">
//                 <X size={15} />
//               </button>
//             </div>

//             <nav className="v1-nav">
//               <Link href="/create-job" className="v1-nav-cta">
//                 <Plus size={14} /> New Job Opening
//               </Link>
//               <div className="v1-nav-lbl">General</div>
//               <Link href="/home" className="v1-nav-link">
//                 <Home size={15} /> Home
//               </Link>

//               <div className="v1-nav-lbl">Pipeline</div>
//               {pipeline.map(s => (
//                 <Link key={s.id} href={s.route || '#'} className="v1-nav-link">
//                   {s.icon} {s.title}
//                 </Link>
//               ))}

//               <div className="v1-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
//               {closing.map(s => (
//                 <Link key={s.id} href={s.route || '#'} className="v1-nav-link">
//                   {s.icon} {s.title}
//                 </Link>
//               ))}
//             </nav>

//             <div className="v1-sb-foot">
//               <button className="v1-logout" onClick={handleLogout}>
//                 <LogOut size={15} /> Sign out
//               </button>
//             </div>
//           </aside>

//           {/* ══ MAIN ══ */}
//           <div className={`v1-main${sidebarOpen ? "" : " sb-closed"}`}>

//             <header className="v1-header">
//               <button
//                 className="v1-toggle"
//                 onClick={() => setSidebarOpen(o => !o)}
//                 title="Toggle sidebar"
//               >
//                 <Menu size={16} />
//               </button>
//               <div className="v1-hdr-sep" />

//               {/* <div className="v1-crumb">
//                 <Home size={13} />
//                 Home
//                 <ChevronRight size={13} />
//                 <strong>Dashboard</strong>
//               </div> */}
//               <div className="v1-crumb">
//                 <Link href="/home" style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--t3)", textDecoration: "none" }}>
//                   <Home size={13} /> Home
//                 </Link>
//                 <ChevronRight size={13} />
//                 <strong>Dashboard</strong>
//               </div>
//               <div className="v1-hdr-right">
//                 {/* <Link href="/create-job" className="v1-btn">
//                   <Plus size={14} /> New Opening
//                 </Link> */}
//                 <button className="v1-btn-out" onClick={handleLogout}>
//                   <LogOut size={13} /> Sign out
//                 </button>
//               </div>
//             </header>

//             <div className="v1-page">

//               <div className="v1-toolbar">
//                 <div>
//                   <h1 className="v1-page-title">Recruitment Dashboard</h1>
//                   <p className="v1-page-sub">Manage your end-to-end hiring workflow from one place</p>
//                 </div>
//                 <Link href="/create-job" className="v1-btn" style={{ flexShrink: 0 }}>
//                   <Plus size={14} /> Create Job Opening
//                 </Link>
//               </div>

//               <div>
//                 <div className="v1-sec-head">
//                   <div>
//                     <p className="v1-sec-title">Recruitment Stages</p>
//                     <p className="v1-sec-sub">All modules in your hiring workflow</p>
//                   </div>
//                   {/* <span className="v1-badge">{workflowSteps.length} stages</span> */}
//                   <span className="v1-badge">
//                     {visibleWorkflowSteps.length} stages
//                   </span>
//                 </div>

//                 <div className="v1-grid">

//                   <div className="v1-divider">
//                     <div className="v1-divider-line" />
//                     <span className="v1-divider-txt">Pipeline</span>
//                     <div className="v1-divider-line" />
//                   </div>

//                   {pipeline.map(step => (
//                     <Link key={step.id} href={step.route || '#'} className="v1-card">
//                       <div className="v1-card-icon">{step.icon}</div>
//                       <div className="v1-card-body">
//                         <p className="v1-card-title">{step.title}</p>
//                         <p className="v1-card-desc">{step.description}</p>
//                       </div>
//                       <div className="v1-card-arrow"><ChevronRight size={16} /></div>
//                     </Link>
//                   ))}

//                   <div className="v1-divider">
//                     <div className="v1-divider-line" />
//                     <span className="v1-divider-txt">Closing</span>
//                     <div className="v1-divider-line" />
//                   </div>

//                   {closing.map(step => (
//                     <Link key={step.id} href={step.route || '#'} className="v1-card">
//                       <div className="v1-card-icon">{step.icon}</div>
//                       <div className="v1-card-body">
//                         <p className="v1-card-title">{step.title}</p>
//                         <p className="v1-card-desc">{step.description}</p>
//                       </div>
//                       <div className="v1-card-arrow"><ChevronRight size={16} /></div>
//                     </Link>
//                   ))}

//                 </div>
//               </div>

//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   )
// }





'use client'
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import {
  Briefcase, Upload, MessageSquare, FileText,
  UserCheck, Plus, ArrowRight, Calendar,
  Users, Zap, LogOut, ChevronRight, Home, Menu, X,
  Database,
  Bot,
  CalendarCheck,
  Bell, BarChart3,
} from "lucide-react"
import Link from "next/link"
import { API_BASE_URL } from '@/lib/api-config'
import { getFrappeCSRF } from "@/lib/csrf"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .v1 {
    --sb-w:      265px;
    --sb:        #1e1e2d;
    --sb2:       #151521;
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

    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13.5px;
    -webkit-font-smoothing: antialiased;
  }

  .v1-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  /* ══════════════════════════
     SIDEBAR
  ══════════════════════════ */
  .v1-sb {
    width: var(--sb-w); background: var(--sb);
    min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 200;
    display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }

  .v1-sb.collapsed {
    transform: translateX(calc(-1 * var(--sb-w)));
  }

  .v1-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }

  .v1-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(0,158,247,.15); border: 1px solid rgba(0,158,247,.25);
    display: flex; align-items: center; justify-content: center; overflow: hidden;
    flex-shrink: 0;
  }
  .v1-sb-icon img {
    width: 24px; height: 24px; object-fit: contain;
    filter: brightness(0) invert(1);
  }

  .v1-sb-name {
    font-size: 14px; font-weight: 700; color: #ffffff;
    letter-spacing: -0.1px; line-height: 1.25;
  }
  .v1-sb-sub {
    font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px;
  }

  .v1-sb-close {
    margin-left: auto; flex-shrink: 0;
    width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer;
    color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center;
    transition: all .14s;
  }
  .v1-sb-close:hover { background: var(--sb-hover); color: #fff; }

  .v1-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .v1-nav::-webkit-scrollbar { width: 3px; }
  .v1-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }

  .v1-nav-cta {
    display: flex; align-items: center; gap: 9px;
    padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md);
    border: 1px solid rgba(0,158,247,.28);
    color: var(--accent); font-size: 13px; font-weight: 600;
    text-decoration: none; transition: background .15s;
    margin-bottom: 22px; letter-spacing: -0.1px;
  }
  .v1-nav-cta:hover { background: rgba(0,158,247,.24); }
  .v1-nav-cta svg { flex-shrink: 0; }

  .v1-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl);
    padding: 4px 12px 7px; margin-top: 4px;
  }

  .v1-nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt);
    text-decoration: none; transition: all .14s;
  }
  .v1-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; transition: opacity .14s; }
  .v1-nav-link:hover { background: var(--sb-hover); color: #ffffff; }
  .v1-nav-link:hover svg { opacity: 1; }

  .v1-sb-foot {
    padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0;
  }

  .v1-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; border-radius: 8px; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--sb-lbl);
    text-align: left; transition: all .14s;
  }
  .v1-logout svg { opacity: .6; width: 15px; height: 15px; }
  .v1-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }
  .v1-logout:hover svg { opacity: 1; }

  /* CHANGE 1: Overlay only on mobile — hidden on desktop */
  .v1-overlay {
    display: none;
    position: fixed; inset: 0; z-index: 150;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px);
    cursor: pointer;
  }
  @media (max-width: 768px) {
    .v1-overlay.show { display: block; }
  }

  /* ══════════════════════════
     MAIN
  ══════════════════════════ */
  .v1-main {
    margin-left: var(--sb-w); flex: 1;
    display: flex; flex-direction: column; min-height: 100vh;
    transition: margin-left .25s cubic-bezier(.4,0,.2,1);
  }

  .v1-main.sb-closed { margin-left: 0; }

  .v1-header {
    height: 60px; background: #ffffff;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center;
    padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 1px 0 rgba(0,158,247,.08);
  }

  .v1-toggle {
    width: 34px; height: 34px; border-radius: 8px;
    background: none; border: 1px solid var(--border);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .v1-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

  .v1-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }

  .v1-crumb {
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; color: var(--t3);
  }
  .v1-crumb svg { width: 13px; height: 13px; color: var(--t3); }
  .v1-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }

  .v1-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }

  .v1-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: 8px;
    background: var(--accent); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
    border: none; cursor: pointer; text-decoration: none; white-space: nowrap;
    transition: background .15s; letter-spacing: -0.1px;
  }
  .v1-btn:hover { background: var(--accent-h); }

  /* ══════════════════════════
     USER AVATAR + POPOVER
     (Sign out now lives inside this popover)
  ══════════════════════════ */
  .v1-user { position: relative; flex-shrink: 0; }

  .v1-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    border: 2px solid #ffffff;
    outline: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; padding: 0; transition: outline-color .14s, transform .14s;
    color: #ffffff;
    text-shadow: 0 1px 2px rgba(13,27,42,.45);
    /* Fixed geometric pattern — same for every user, not randomly generated */
    background:
      linear-gradient(135deg, rgba(255,255,255,.30) 0%, rgba(255,255,255,0) 45%),
      conic-gradient(from 135deg at 50% 50%,
        var(--accent) 0deg 60deg,
        var(--accent-h) 60deg 120deg,
        #4fc3f7 120deg 180deg,
        var(--accent) 180deg 240deg,
        var(--accent-h) 240deg 300deg,
        #4fc3f7 300deg 360deg);
  }
  .v1-avatar:hover { outline-color: var(--accent); transform: translateY(-1px); }
  .v1-avatar.active { outline: 2px solid var(--accent); }

  .v1-user-menu {
    position: absolute; top: calc(100% + 10px); right: 0;
    min-width: 240px; max-width: 300px;
    background: #ffffff; border: 1px solid var(--border);
    border-radius: 10px; padding: 8px;
    box-shadow: 0 10px 30px rgba(0,158,247,.16);
    z-index: 60;
  }
  .v1-user-menu-head { padding: 8px 10px 12px; }
  .v1-user-menu-name {
    font-size: 13.5px; font-weight: 700; color: var(--t1);
    word-break: break-word;
  }
  .v1-user-menu-email {
    font-size: 12px; color: var(--t3); margin-top: 2px;
    word-break: break-all;
  }
  .v1-user-menu-sep { height: 1px; background: var(--border-s); margin: 0 -8px; }
  .v1-user-menu-signout {
    display: flex; align-items: center; gap: 9px; width: 100%;
    margin-top: 8px; padding: 9px 10px; border-radius: 7px;
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
    color: #dc2626; text-align: left; transition: background .14s;
  }
  .v1-user-menu-signout:hover { background: #fff0f0; }

  /* ══════════════════════════
     PAGE CONTENT
  ══════════════════════════ */
  .v1-page {
    padding: 30px 32px;
    display: flex; flex-direction: column; gap: 26px;
  }

  .v1-toolbar {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 20px;
  }

  .v1-page-title {
    font-size: 21px; font-weight: 800; color: var(--t1);
    letter-spacing: -0.5px; line-height: 1.15;
  }
  .v1-page-sub {
    font-size: 13px; color: var(--t3); margin-top: 5px; font-weight: 400;
  }

  .v1-sec-head {
    display: flex; align-items: flex-end;
    justify-content: space-between; margin-bottom: 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border-s);
  }

  .v1-sec-title {
    font-size: 15px; font-weight: 700; color: var(--t1); letter-spacing: -0.2px;
  }
  .v1-sec-sub {
    font-size: 12.5px; color: var(--t3); margin-top: 3px;
  }

  .v1-badge {
    display: inline-flex; align-items: center;
    padding: 4px 12px; border-radius: 20px;
    font-size: 11.5px; font-weight: 600;
    background: var(--accent-lt);
    border: 1px solid var(--border);
    color: var(--accent);
    white-space: nowrap;
  }

  .v1-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .v1-card {
    background: var(--card);
    border: 1px solid var(--border-s);
    border-radius: 10px;
    padding: 16px 18px;
    display: flex; align-items: center; gap: 14px;
    text-decoration: none; cursor: pointer;
    transition: box-shadow .15s, transform .15s, border-color .15s;
    box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }

  .v1-card:hover {
    box-shadow: 0 6px 22px rgba(0,158,247,.14);
    transform: translateY(-2px);
    border-color: rgba(0,158,247,.45);
  }

  .v1-card-icon {
    width: 42px; height: 42px; border-radius: 10px;
    background: var(--accent-lt); color: var(--accent);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all .15s;
  }
  .v1-card:hover .v1-card-icon {
    background: var(--accent); color: #fff;
  }

  .v1-card-body { flex: 1; min-width: 0; }

  .v1-card-title {
    font-size: 13.5px; font-weight: 600; color: var(--t1);
    letter-spacing: -0.1px; line-height: 1.3;
  }
  .v1-card-desc {
    font-size: 12px; color: var(--t3); margin-top: 2px; line-height: 1.4;
  }

  .v1-card-arrow {
    color: var(--border); flex-shrink: 0;
    transition: color .15s, transform .15s;
  }
  .v1-card:hover .v1-card-arrow {
    color: var(--accent); transform: translateX(3px);
  }

  .v1-divider {
    grid-column: 1 / -1;
    display: flex; align-items: center; gap: 10px;
    padding: 4px 0;
  }
  .v1-divider-line { flex: 1; height: 1px; background: var(--border-s); }
  .v1-divider-txt {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .1em; color: var(--t3);
  }

  /* ══════════════════════════
     RESPONSIVE
  ══════════════════════════ */
  @media (max-width: 960px) {
    .v1-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 768px) {
    .v1-sb { transform: translateX(calc(-1 * var(--sb-w))); z-index: 200; }
    .v1-sb.open { transform: translateX(0); }
    .v1-main { margin-left: 0 !important; overflow-x: hidden; }
    .v1-wrap { overflow-x: hidden; }
    .v1-page { padding: 16px 14px; }
    .v1-header { padding: 0 12px; gap: 6px; min-height: 56px; overflow: hidden; }
    .v1-hdr-sep { display: none; }
    .v1-toolbar { flex-direction: column; gap: 10px; }
    .v1-btn { width: 100%; justify-content: center; }
    .v1-crumb { font-size: 12px; flex: 1; min-width: 0; overflow: hidden; }
    .v1-crumb strong { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; }
    .v1-grid { grid-template-columns: 1fr; gap: 10px; }
    /* header has overflow:hidden on mobile, so popover uses fixed to avoid being clipped */
    .v1-user-menu { position: fixed; top: 62px; right: 12px; left: auto; min-width: 220px; max-width: calc(100vw - 24px); }
  }
`

interface WorkflowStep {
  id: string; title: string; description: string
  icon: React.ReactNode; status: "completed" | "current" | "pending"
  route?: string; color: string
}

interface CurrentUser {
  fullName: string
  email: string
}

export default function RecruitmentDashboard() {
  const router = useRouter()
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  // CHANGE 2: default false — sidebar closed on page load
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [userRoles, setUserRoles] = useState<string[]>([])
  const [isSiteHRRole, setIsSiteHRRole] = useState(false)
  const [roleLoading, setRoleLoading] = useState(true)
  const [roleError, setRoleError] = useState(false)

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    const LOGOUT_URL = `${API_BASE_URL}/api/method/logout`
    const csrfToken = await getFrappeCSRF()
    const response = await fetch(LOGOUT_URL, {
      method: 'POST', credentials: "include",
      headers: { "X-Frappe-CSRF-Token": csrfToken }
    })
    if (response.ok) router.push("/Login")
    else console.error("Logout failed", await response.text())
  }

  // useEffect(() => { document.title = 'Dashboard' }, [])
  useEffect(() => {
    document.title = "Dashboard"

    const fetchUserRoles = async () => {
      try {
        setRoleLoading(true)
        setRoleError(false)

        const response = await fetch(
          `${API_BASE_URL}/api/method/resume.api.job_opening.get_current_user_roles`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch user roles")
        }

        const result = await response.json()

        const data = result?.message

        if (!data?.success) {
          throw new Error(data?.message || "Unable to get user roles")
        }

        setUserRoles(data.roles || [])
        setIsSiteHRRole(Boolean(data.is_site_hr_role))

      } catch (error) {
        console.error("Role fetch error:", error)
        setRoleError(true)
      } finally {
        setRoleLoading(false)
      }
    }

    fetchUserRoles()
  }, [])

  // Logged-in user name + email (Frappe default APIs, works for every role)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/method/frappe.auth.get_logged_user`, {
          credentials: "include",
        })
        const json = await res.json()
        const userId: string = json?.message
        if (!userId || userId === "Guest") return

        let fullName = userId
        let email = userId

        try {
          const q = new URLSearchParams({
            doctype: "User",
            fieldname: JSON.stringify(["full_name", "email"]),
            filters: JSON.stringify({ name: userId }),
          })
          const r = await fetch(`${API_BASE_URL}/api/method/frappe.client.get_value?${q}`, {
            credentials: "include",
          })
          const d = (await r.json())?.message
          if (d) {
            fullName = d.full_name || userId
            email = d.email || userId
          }
        } catch (e) {
          console.error("User detail fetch error:", e) // fallback: login ID dikhega
        }

        setCurrentUser({ fullName, email })
      } catch (e) {
        console.error("Logged user fetch error:", e)
      }
    }

    fetchCurrentUser()
  }, [])

  // Close user popover when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [userMenuOpen])

  const workflowSteps: WorkflowStep[] = [
    { id: "recruitment-dashboard", title: "Recruitment Dashboard", description: "Live hiring statistics & charts", icon: <BarChart3 className="h-4 w-4" />, status: "pending", route: "/recruitment-dashboard", color: "" },
    { id: "job-opening", title: "Job Opening", description: "Create or select job opening", icon: <Briefcase className="h-4 w-4" />, status: selectedJobId ? "completed" : "current", route: "/job-opening", color: "" },
    { id: "resume", title: "Resume Collection", description: "Upload and process resumes", icon: <Upload className="h-4 w-4" />, status: selectedJobId ? "current" : "pending", route: "/upload-resumes", color: "" },
    { id: "candidates", title: "Candidates", description: "View and manage candidates", icon: <Users className="h-4 w-4" />, status: "pending", route: "/candidates", color: "" },
    { id: "interview", title: "Interview Scheduling", description: "Schedule and conduct interviews", icon: <Calendar className="h-4 w-4" />, status: "pending", route: "/interview", color: "" },
    { id: "feedback", title: "Candidate Feedback", description: "Review and provide feedback", icon: <MessageSquare className="h-4 w-4" />, status: "pending", route: "/feedback", color: "" },
    { id: "doc-verify", title: "Document Verification", description: "Verify Documents", icon: <FileText className="h-4 w-4" />, status: "pending", route: "/document-verify-list", color: "" },
    { id: "salary-annexure", title: "Salary Annexure", description: "Prepare and manage salary structures", icon: <FileText className="h-4 w-4" />, status: "pending", route: "/salary-annexure", color: "" },
    { id: "salary-annexure-list", title: "Salary Annexure List", description: "View all salary annexures", icon: <FileText className="h-4 w-4" />, status: "pending", route: "/salary-annexure-list", color: "" },
    { id: "offer", title: "Offer Letter", description: "Generate and send offers", icon: <Zap className="h-4 w-4" />, status: "pending", route: "/offer-list", color: "" },
    { id: "appointment", title: "Appointment Letter", description: "Final appointment process", icon: <UserCheck className="h-4 w-4" />, status: "pending", route: "/letter-appointment", color: "" },
    // { id: "assistant", title: "Assistant", description: "Resume Intelligence AI", icon: <Bot className="h-4 w-4" />, status: "pending", route: "/chat", color: "" },
    { id: "data_bank", title: "Data Bank", description: "Search Resume with multiple Filters", icon: <Database className="h-4 w-4" />, status: "pending", route: "/data_bank", color: "" },
    { id: "joining-track", title: "Candidate Joining Track", description: "Track candidate joining status & dates", icon: <CalendarCheck className="h-4 w-4" />, status: "pending", route: "/candidate-joining-track", color: "" },
    { id: "hr-connect-track", title: "HR Connect Track", description: "30/90/180 day post-joining connect tracker", icon: <Bell className="h-4 w-4" />, status: "pending", route: "/hr-connect-track", color: "" },
    // { id: "recruitment-dashboard", title: "Recruitment Dashboard", description: "Live hiring statistics & charts", icon: <BarChart3 className="h-4 w-4" />, status: "pending", route: "/recruitment-dashboard", color: "" },
  ]

  // const pipeline = workflowSteps.slice(0, 4)
  // const closing = workflowSteps.slice(4)

  const SITE_HR_ALLOWED_STEP_IDS = [
    "job-opening",
    "resume",
    "candidates",
    "interview",
    "feedback",
    "doc-verify",
    "data_bank",
  ]

  const visibleWorkflowSteps = isSiteHRRole
    ? workflowSteps.filter(step =>
      SITE_HR_ALLOWED_STEP_IDS.includes(step.id)
    )
    : workflowSteps

  const pipeline = visibleWorkflowSteps.slice(0, 4)
  const closing = visibleWorkflowSteps.slice(4)

  if (roleLoading) {
    return (
      <>
        <style>{css}</style>

        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f0f8fe",
            color: "#2d5a78",
            fontSize: "14px",
          }}
        >
          Loading dashboard...
        </div>
      </>
    )
  }
  if (roleError) {
    return (
      <>
        <style>{css}</style>

        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "10px",
            background: "#f0f8fe",
            color: "#2d5a78",
          }}
        >
          <strong>Unable to load user permissions.</strong>
          <span>Please refresh the page or contact administrator.</span>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{css}</style>
      <div className="v1">
        <div className="v1-wrap">

          {/* CHANGE 3: Overlay — mobile only (CSS hides it on desktop) */}
          <div
            className={`v1-overlay${sidebarOpen ? " show" : ""}`}
            onClick={() => setSidebarOpen(false)}
          />

          {/* ══ SIDEBAR ══ */}
          <aside className={`v1-sb${sidebarOpen ? " open" : " collapsed"}`}>
            <div className="v1-sb-brand">
              <div className="v1-sb-icon">
                <img src="/vaaman_logo.png" alt="logo" />
              </div>
              <div>
                <div className="v1-sb-name">Job Management</div>
                <div className="v1-sb-sub">HR Platform</div>
              </div>
              <button className="v1-sb-close" onClick={() => setSidebarOpen(false)} title="Close sidebar">
                <X size={15} />
              </button>
            </div>

            <nav className="v1-nav">
              <Link href="/create-job" className="v1-nav-cta">
                <Plus size={14} /> New Job Opening
              </Link>
              <div className="v1-nav-lbl">General</div>
              <Link href="/home" className="v1-nav-link">
                <Home size={15} /> Home
              </Link>

              <div className="v1-nav-lbl">Pipeline</div>
              {pipeline.map(s => (
                <Link key={s.id} href={s.route || '#'} className="v1-nav-link">
                  {s.icon} {s.title}
                </Link>
              ))}

              <div className="v1-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
              {closing.map(s => (
                <Link key={s.id} href={s.route || '#'} className="v1-nav-link">
                  {s.icon} {s.title}
                </Link>
              ))}
            </nav>

            <div className="v1-sb-foot">
              <button className="v1-logout" onClick={handleLogout}>
                <LogOut size={15} /> Sign out
              </button>
            </div>
          </aside>

          {/* ══ MAIN ══ */}
          <div className={`v1-main${sidebarOpen ? "" : " sb-closed"}`}>

            <header className="v1-header">
              <button
                className="v1-toggle"
                onClick={() => setSidebarOpen(o => !o)}
                title="Toggle sidebar"
              >
                <Menu size={16} />
              </button>
              <div className="v1-hdr-sep" />

              {/* <div className="v1-crumb">
                <Home size={13} />
                Home
                <ChevronRight size={13} />
                <strong>Dashboard</strong>
              </div> */}
              <div className="v1-crumb">
                <Link href="/home" style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--t3)", textDecoration: "none" }}>
                  <Home size={13} /> Home
                </Link>
                <ChevronRight size={13} />
                <strong>Dashboard</strong>
              </div>
              <div className="v1-hdr-right">
                {/* <Link href="/create-job" className="v1-btn">
                  <Plus size={14} /> New Opening
                </Link> */}
                {currentUser && (
                  <div className="v1-user" ref={userMenuRef}>
                    <button
                      type="button"
                      className={`v1-avatar${userMenuOpen ? " active" : ""}`}
                      onClick={() => setUserMenuOpen(o => !o)}
                      aria-haspopup="true"
                      aria-expanded={userMenuOpen}
                      title={currentUser.fullName}
                    >
                      {currentUser.fullName.trim().charAt(0).toUpperCase()}
                    </button>
                    {userMenuOpen && (
                      <div className="v1-user-menu">
                        <div className="v1-user-menu-head">
                          <p className="v1-user-menu-name">{currentUser.fullName}</p>
                          <p className="v1-user-menu-email">{currentUser.email}</p>
                        </div>
                        <div className="v1-user-menu-sep" />
                        <button
                          className="v1-user-menu-signout"
                          onClick={() => { setUserMenuOpen(false); handleLogout() }}
                        >
                          <LogOut size={14} /> Sign out
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </header>

            <div className="v1-page">

              <div className="v1-toolbar">
                <div>
                  <h1 className="v1-page-title">Recruitment Dashboard</h1>
                  <p className="v1-page-sub">Manage your end-to-end hiring workflow from one place</p>
                </div>
                <Link href="/create-job" className="v1-btn" style={{ flexShrink: 0 }}>
                  <Plus size={14} /> Create Job Opening
                </Link>
              </div>

              <div>
                <div className="v1-sec-head">
                  <div>
                    <p className="v1-sec-title">Recruitment Stages</p>
                    <p className="v1-sec-sub">All modules in your hiring workflow</p>
                  </div>
                  {/* <span className="v1-badge">{workflowSteps.length} stages</span> */}
                  <span className="v1-badge">
                    {visibleWorkflowSteps.length} stages
                  </span>
                </div>

                <div className="v1-grid">

                  <div className="v1-divider">
                    <div className="v1-divider-line" />
                    <span className="v1-divider-txt">Pipeline</span>
                    <div className="v1-divider-line" />
                  </div>

                  {pipeline.map(step => (
                    <Link key={step.id} href={step.route || '#'} className="v1-card">
                      <div className="v1-card-icon">{step.icon}</div>
                      <div className="v1-card-body">
                        <p className="v1-card-title">{step.title}</p>
                        <p className="v1-card-desc">{step.description}</p>
                      </div>
                      <div className="v1-card-arrow"><ChevronRight size={16} /></div>
                    </Link>
                  ))}

                  <div className="v1-divider">
                    <div className="v1-divider-line" />
                    <span className="v1-divider-txt">Closing</span>
                    <div className="v1-divider-line" />
                  </div>

                  {closing.map(step => (
                    <Link key={step.id} href={step.route || '#'} className="v1-card">
                      <div className="v1-card-icon">{step.icon}</div>
                      <div className="v1-card-body">
                        <p className="v1-card-title">{step.title}</p>
                        <p className="v1-card-desc">{step.description}</p>
                      </div>
                      <div className="v1-card-arrow"><ChevronRight size={16} /></div>
                    </Link>
                  ))}

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  )
}
