// "use client";
// import { useState } from "react";

// export default function CandidatesPage() {
//     const [filters, setFilters] = useState({
//         skills: [],
//         min_exp: 0,
//         max_exp: 100,
//         degree: "",
//         location: "",
//         role: "",
//         applicant_name: ""
//     });

//     const [results, setResults] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedCandidate, setSelectedCandidate] = useState(null);

//     const search = async () => {
//         setLoading(true);

//         try {
//             // Convert filters object to a URL-encoded string
//             const queryParams = new URLSearchParams({
//                 filters: JSON.stringify(filters)
//             }).toString();

//             const res = await fetch(
//                 `/api/method/vaaman_ats_ai.api.data_bank.data_bank.search_candidates?${queryParams}`,
//                 {
//                     method: "GET", // ✅ Changed to GET
//                     headers: {
//                         "Content-Type": "application/json"
//                     }
//                     // ❌ Removed the body completely
//                 }
//             );

//             const data = await res.json();
//             setResults(Array.isArray(data.message) ? data.message : []);
//         } catch (error) {
//             console.error("Failed to fetch candidates", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Helper to get initials for the avatar
//     const getInitials = (name) => {
//         if (!name) return "NA";
//         return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
//     };

//     return (
//         <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
//             <div className="max-w-7xl mx-auto">

//                 {/* Header */}
//                 <div className="mb-8">
//                     <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">DATA BANK</h1>
//                     <p className="text-slate-500 mt-2 text-sm">Search and filter through potential candidates based on skills, experience, and education.</p>
//                 </div>

//                 {/* 🔍 Filters Card */}
//                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-10">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
//                         <div className="flex flex-col">
//                             <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Role</label>
//                             <input
//                                 placeholder="e.g. Frontend Developer"
//                                 onChange={(e) => setFilters({ ...filters, role: e.target.value })}
//                                 className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
//                             />
//                         </div>

//                         <div className="flex flex-col">
//                             <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Qualification</label>
//                             <input
//                                 placeholder="e.g. B.Tech"
//                                 onChange={(e) => setFilters({ ...filters, degree: e.target.value })}
//                                 className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
//                             />
//                         </div>

//                         <div className="flex flex-col">
//                             <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Min Exp (Yrs)</label>
//                             <input
//                                 placeholder="0"
//                                 type="number"
//                                 min="0"
//                                 onChange={(e) => setFilters({ ...filters, min_exp: Number(e.target.value) })}
//                                 className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
//                             />
//                         </div>

//                         <div className="flex flex-col">
//                             <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Max Exp (Yrs)</label>
//                             <input
//                                 // placeholder="10"
//                                 type="number"
//                                 min="0"
//                                 onChange={(e) => setFilters({ ...filters, max_exp: Number(e.target.value) })}
//                                 className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
//                             />
//                         </div>

//                         <div className="flex flex-col lg:col-span-2">
//                             <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Skills</label>
//                             <input
//                                 placeholder="React, Node.js, Python..."
//                                 onChange={(e) =>
//                                     setFilters({
//                                         ...filters,
//                                         skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
//                                     })
//                                 }
//                                 className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
//                             />
//                         </div>

//                         <div className="flex flex-col">
//                             <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Location</label>
//                             <input
//                                 placeholder="e.g. city"
//                                 onChange={(e) => setFilters({ ...filters, location: e.target.value })}
//                                 className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
//                             />
//                         </div>

//                         <div className="flex flex-col">
//                             <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Applicant Name</label>
//                             <input
//                                 placeholder="e.g. John Doe"
//                                 onChange={(e) => setFilters({ ...filters, applicant_name: e.target.value })}
//                                 className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
//                             />
//                         </div>

//                         <div className="lg:col-start-5 flex justify-end">
//                             <button
//                                 onClick={search}
//                                 disabled={loading}
//                                 className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
//                             >
//                                 {loading ? (
//                                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                 ) : (
//                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                     </svg>
//                                 )}
//                                 {loading ? "Searching..." : "Search"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* ❌ Empty State */}
//                 {!loading && results.length === 0 && (
//                     <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
//                         <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                         </svg>
//                         <h3 className="mt-4 text-sm font-semibold text-slate-900">No candidates found</h3>
//                         <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search terms.</p>
//                     </div>
//                 )}

//                 {/* 📋 Results Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                     {results?.map((c) => (
//                         <div key={c.name} className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 p-6 flex flex-col transition-all duration-300 group">

//                             {/* Card Header (Avatar + Identity) */}
//                             <div className="flex items-start gap-4 mb-4">
//                                 <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
//                                     {getInitials(c.applicant_name)}
//                                 </div>
//                                 <div>
//                                     <h2 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
//                                         {c.applicant_name}
//                                     </h2>
//                                     <p className="text-xs font-mono text-slate-400 mt-0.5 uppercase tracking-wider">{c.name}</p>
//                                 </div>
//                             </div>

//                             {/* Info Rows */}
//                             <div className="flex flex-col gap-2 mb-6">
//                                 <div className="flex items-center text-slate-600 text-sm">
//                                     <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
//                                     <span className="font-medium text-slate-800">{c.custom_current_role || "Role Not Specified"}</span>
//                                 </div>
//                                 <div className="flex items-center text-slate-600 text-sm">
//                                     <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
//                                     <span>{c.custom_degree || "Qualification Not Specified"}</span>
//                                 </div>
//                                 <div className="flex items-center text-slate-600 text-sm">
//                                     <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
//                                     <span><strong className="text-slate-800">{c.custom_experience_years || 0}</strong> years experience</span>
//                                 </div>
//                                 <div className="flex items-center text-slate-600 text-sm">
//                                     <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
//                                     <span>{c.current_location || "Location Not Specified"}</span>
//                                 </div>
//                             </div>

//                             {/* Skills Pills */}
//                             <div className="mt-auto">
//                                 <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">Skills</h3>
//                                 <div className="flex flex-wrap gap-2">
//                                     {typeof c.custom_skills === "string" && c.custom_skills ? (
//                                         c.custom_skills.split(",").map((s, i) => (
//                                             <span
//                                                 key={i}
//                                                 className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 text-xs font-medium rounded-md"
//                                             >
//                                                 {s.trim()}
//                                             </span>
//                                         ))
//                                     ) : (
//                                         <span className="text-xs text-slate-400 italic">No skills listed</span>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* ✅ NEW BUTTON */}
//                             <div className="mt-2 pt-4 border-t border-slate-100">
//                                 {c.resumes?.length > 0 && (<button onClick={() => setSelectedCandidate(c)} className="w-full bg-black text-white py-2 rounded" > View Resumes ({c.resumes.length}) </button>)}
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//             </div>
//             {/* ✅ MODAL */}
//             {selectedCandidate && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-xl p-6 w-full max-w-lg">
//                         <h2 className="text-lg font-bold mb-4"> {selectedCandidate.applicant_name} - Resumes </h2>
//                         <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
//                             {selectedCandidate.resumes
//                                 ?.sort((a, b) => new Date(b.creation) - new Date(a.creation))
//                                 .map((r, i) => {
//                                     // const fileName = decodeURIComponent(
//                                     //     r.resume_attachment.split("/").pop().split("_").pop()
//                                     // );

//                                     return (
//                                         <a
//                                             key={i}
//                                             href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${r.resume_attachment}`}
//                                             target="_blank"
//                                             className="bg-gray-100 p-3 rounded flex justify-between items-center"
//                                         >
//                                             <span className="truncate max-w-[70%]">
//                                                 {/* {fileName} */}
//                                                 {r.file_name || "Unnamed Resume"}
//                                             </span>

//                                             <span className="text-xs text-gray-500">
//                                                 {new Date(r.creation).toLocaleString()}
//                                             </span>
//                                         </a>
//                                     );
//                                 })}
//                         </div>
//                         <button onClick={() => setSelectedCandidate(null)} className="mt-4 w-full bg-red-500 text-white py-2 rounded" > Close </button>
//                     </div>
//                 </div>)}
//         </div>
//     );
// }




//2

// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//     Home,
//     ArrowLeft,
//     ChevronRight,
//     Menu,
//     X,
//     Plus,
//     Users,
//     Upload,
//     Briefcase,
//     Calendar,
//     MessageSquare,
//     FileText,
//     UserCheck,
//     Zap,
//     LogOut,
// } from "lucide-react";

// const css = `
//   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   .db {
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
//     --accent-bdr:rgba(0,158,247,.28);

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

//   .db-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

//   /* ── SIDEBAR ── */
//   .db-sb {
//     width: var(--sb-w); background: var(--sb);
//     min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 100;
//     display: flex; flex-direction: column;
//     transition: transform .25s cubic-bezier(.4,0,.2,1);
//   }
//   .db-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }

//   .db-sb-brand {
//     height: 64px; display: flex; align-items: center; gap: 12px;
//     padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
//   }
//   .db-sb-icon {
//     width: 38px; height: 38px; border-radius: 10px;
//     background: var(--accent-md); border: 1px solid var(--accent-bdr);
//     display: flex; align-items: center; justify-content: center;
//     overflow: hidden; flex-shrink: 0;
//   }
//   .db-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
//   .db-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; line-height: 1.25; }
//   .db-sb-sub  { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
//   .db-sb-close {
//     margin-left: auto; flex-shrink: 0;
//     width: 28px; height: 28px; border-radius: 7px;
//     background: none; border: none; cursor: pointer;
//     color: var(--sb-lbl);
//     display: flex; align-items: center; justify-content: center;
//     transition: all .14s;
//   }
//   .db-sb-close:hover { background: var(--sb-hover); color: #fff; }

//   .db-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
//   .db-nav::-webkit-scrollbar { width: 3px; }
//   .db-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }
//   .db-nav-cta {
//     display: flex; align-items: center; gap: 9px;
//     padding: 11px 14px; border-radius: 9px;
//     background: var(--accent-md); border: 1px solid var(--accent-bdr);
//     color: var(--accent); font-size: 13px; font-weight: 600;
//     text-decoration: none; transition: background .15s; margin-bottom: 22px;
//   }
//   .db-nav-cta:hover { background: rgba(0,158,247,.24); }
//   .db-nav-lbl {
//     font-size: 9.5px; font-weight: 700; text-transform: uppercase;
//     letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
//   }
//   .db-nav-link {
//     display: flex; align-items: center; gap: 10px;
//     padding: 9px 12px; border-radius: 8px;
//     font-size: 13px; font-weight: 500; color: var(--sb-txt);
//     text-decoration: none; transition: all .14s;
//   }
//   .db-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; }
//   .db-nav-link:hover { background: var(--sb-hover); color: #fff; }
//   .db-nav-link:hover svg { opacity: 1; }
//   .db-nav-link.active { background: var(--sb-hover); color: #fff; }
//   .db-nav-link.active svg { opacity: 1; }
//   .db-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
//   .db-logout {
//     display: flex; align-items: center; gap: 10px; width: 100%;
//     padding: 9px 12px; border-radius: 8px; background: none; border: none;
//     cursor: pointer; font-family: 'Inter', sans-serif;
//     font-size: 13px; font-weight: 500; color: var(--sb-lbl); text-align: left; transition: all .14s;
//   }
//   .db-logout svg { opacity: .6; width: 15px; height: 15px; }
//   .db-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }

//   .db-overlay {
//     display: none; position: fixed; inset: 0; z-index: 99;
//     background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
//   }
//   .db-overlay.show { display: block; }

//   /* ── MAIN ── */
//   .db-main {
//     margin-left: var(--sb-w); flex: 1;
//     display: flex; flex-direction: column; min-height: 100vh;
//     transition: margin-left .25s cubic-bezier(.4,0,.2,1);
//   }
//   .db-main.sb-closed { margin-left: 0; }

//   /* ── HEADER ── */
//   .db-header {
//     height: 60px; background: #fff;
//     border-bottom: 1px solid var(--border);
//     display: flex; align-items: center; padding: 0 28px; gap: 12px;
//     position: sticky; top: 0; z-index: 50;
//     box-shadow: 0 1px 0 rgba(0,158,247,.08);
//   }
//   .db-toggle {
//     width: 34px; height: 34px; border-radius: 8px;
//     background: none; border: 1px solid var(--border);
//     cursor: pointer; display: flex; align-items: center; justify-content: center;
//     color: var(--t2); flex-shrink: 0; transition: all .14s;
//   }
//   .db-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
//   .db-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
//   .db-btn-back {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 7px 14px; border-radius: 8px;
//     background: transparent; color: var(--t2);
//     font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
//     border: 1px solid var(--border); cursor: pointer; text-decoration: none;
//     transition: all .14s; white-space: nowrap;
//   }
//   .db-btn-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
//   .db-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
//   .db-crumb svg { width: 13px; height: 13px; }
//   .db-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }
//   .db-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
//   .db-btn {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 8px 18px; border-radius: 8px;
//     background: var(--accent); color: #fff;
//     font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
//     border: none; cursor: pointer; text-decoration: none; white-space: nowrap;
//     transition: background .15s;
//   }
//   .db-btn:hover { background: var(--accent-h); }

//   /* ── PAGE CONTENT ── */
//   .db-page { padding: 28px 32px; }

//   @media (max-width: 768px) {
//     .db-sb { transform: translateX(calc(-1 * var(--sb-w))); }
//     .db-sb.open { transform: translateX(0); }
//     .db-main { margin-left: 0 !important; }
//     .db-page { padding: 18px 16px; }
//     .db-header { padding: 0 16px; }
//   }
// `;

// export default function CandidatesPage() {
//     const [filters, setFilters] = useState({
//         skills: [],
//         min_exp: 0,
//         max_exp: 100,
//         degree: "",
//         location: "",
//         role: "",
//         applicant_name: ""
//     });

//     const [results, setResults] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedCandidate, setSelectedCandidate] = useState(null);
//     const [sidebarOpen, setSidebarOpen] = useState(false);

//     const search = async () => {
//         setLoading(true);
//         try {
//             const queryParams = new URLSearchParams({
//                 filters: JSON.stringify(filters)
//             }).toString();

//             const res = await fetch(
//                 `/api/method/vaaman_ats_ai.api.data_bank.data_bank.search_candidates?${queryParams}`,
//                 {
//                     method: "GET",
//                     headers: { "Content-Type": "application/json" }
//                 }
//             );

//             const data = await res.json();
//             setResults(Array.isArray(data.message) ? data.message : []);
//         } catch (error) {
//             console.error("Failed to fetch candidates", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getInitials = (name) => {
//         if (!name) return "NA";
//         return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
//     };

//     const sidebarPipeline = [
//         { id: "job-opening", title: "Job Opening", icon: <Briefcase size={15} />, href: "/job-opening" },
//         { id: "resume", title: "Resume Collection", icon: <Upload size={15} />, href: "/upload-resumes" },
//         { id: "candidates", title: "Candidates", icon: <Users size={15} />, href: "/candidates" },
//         { id: "interview", title: "Interview Scheduling", icon: <Calendar size={15} />, href: "/interview" },
//     ];
//     const sidebarClosing = [
//         { id: "feedback", title: "Candidate Feedback", icon: <MessageSquare size={15} />, href: "/feedback" },
//         { id: "doc-verify", title: "Document Verification", icon: <FileText size={15} />, href: "/document-verify-list" },
//         { id: "offer", title: "Offer Letter", icon: <Zap size={15} />, href: "/offer-list" },
//         { id: "appointment", title: "Appointment Letter", icon: <UserCheck size={15} />, href: "/letter-appointment" },
//     ];

//     return (
//         <>
//             <style>{css}</style>
//             <div className="db">
//                 <div className="db-wrap">

//                     {/* Overlay */}
//                     <div
//                         className={`db-overlay${sidebarOpen ? " show" : ""}`}
//                         onClick={() => setSidebarOpen(false)}
//                     />

//                     {/* ── SIDEBAR ── */}
//                     <aside className={`db-sb${sidebarOpen ? "" : " collapsed"}`}>
//                         <div className="db-sb-brand">
//                             <div className="db-sb-icon">
//                                 <img src="/vaaman_logo.png" alt="logo" />
//                             </div>
//                             <div>
//                                 <div className="db-sb-name">Job Management</div>
//                                 <div className="db-sb-sub">HR Platform</div>
//                             </div>
//                             <button className="db-sb-close" onClick={() => setSidebarOpen(false)} title="Close sidebar">
//                                 <X size={15} />
//                             </button>
//                         </div>
//                         <nav className="db-nav">
//                             <Link href="/create-job" className="db-nav-cta">
//                                 <Plus size={14} /> New Job Opening
//                             </Link>
//                             <div className="db-nav-lbl">General</div>
//                             <Link href="/home" className="db-nav-link">
//                                 <Home size={15} /> Home
//                             </Link>
//                             <div className="db-nav-lbl">Pipeline</div>
//                             {sidebarPipeline.map(s => (
//                                 <Link key={s.id} href={s.href}
//                                     className={`db-nav-link${s.href === "/candidates" ? " active" : ""}`}>
//                                     {s.icon} {s.title}
//                                 </Link>
//                             ))}
//                             <div className="db-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
//                             {sidebarClosing.map(s => (
//                                 <Link key={s.id} href={s.href} className="db-nav-link">
//                                     {s.icon} {s.title}
//                                 </Link>
//                             ))}
//                         </nav>
//                         <div className="db-sb-foot">
//                             <button className="db-logout">
//                                 <LogOut size={15} /> Sign out
//                             </button>
//                         </div>
//                     </aside>

//                     {/* ── MAIN ── */}
//                     <div className={`db-main${sidebarOpen ? "" : " sb-closed"}`}>

//                         {/* ── HEADER (same pattern as Job Openings) ── */}
//                         <header className="db-header">
//                             <button className="db-toggle" onClick={() => setSidebarOpen(o => !o)} title="Toggle sidebar">
//                                 <Menu size={16} />
//                             </button>
//                             <div className="db-hdr-sep" />
//                             <Link href="/home" className="db-btn-back">
//                                 <ArrowLeft size={13} /> Back
//                             </Link>
//                             <div className="db-hdr-sep" />
//                             <div className="db-crumb">
//                                 <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'inherit', textDecoration: 'none' }}>
//                                     <Home size={13} /> Home
//                                 </Link>
//                                 <ChevronRight size={13} />
//                                 <strong>Data Bank</strong>
//                             </div>
//                             <div className="db-hdr-right">
//                                 {/* No extra action buttons needed for Data Bank, but space is reserved */}
//                             </div>
//                         </header>

//                         {/* ── PAGE BODY (unchanged from original) ── */}
//                         <div className="db-page">
//                             <div className="min-h-screen bg-slate-50 font-sans">
//                                 <div className="max-w-7xl mx-auto">

//                                     {/* Header */}
//                                     <div className="mb-8">
//                                         <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">DATA BANK</h1>
//                                         <p className="text-slate-500 mt-2 text-sm">Search and filter through potential candidates based on skills, experience, and education.</p>
//                                     </div>

//                                     {/* Filters Card */}
//                                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-10">
//                                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
//                                             <div className="flex flex-col">
//                                                 <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Role</label>
//                                                 <input
//                                                     placeholder="e.g. Frontend Developer"
//                                                     onChange={(e) => setFilters({ ...filters, role: e.target.value })}
//                                                     className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
//                                                 />
//                                             </div>

//                                             <div className="flex flex-col">
//                                                 <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Qualification</label>
//                                                 <input
//                                                     placeholder="e.g. B.Tech"
//                                                     onChange={(e) => setFilters({ ...filters, degree: e.target.value })}
//                                                     className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
//                                                 />
//                                             </div>

//                                             <div className="flex flex-col">
//                                                 <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Min Exp (Yrs)</label>
//                                                 <input
//                                                     placeholder="0"
//                                                     type="number"
//                                                     min="0"
//                                                     onChange={(e) => setFilters({ ...filters, min_exp: Number(e.target.value) })}
//                                                     className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
//                                                 />
//                                             </div>

//                                             <div className="flex flex-col">
//                                                 <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Max Exp (Yrs)</label>
//                                                 <input
//                                                     type="number"
//                                                     min="0"
//                                                     onChange={(e) => setFilters({ ...filters, max_exp: Number(e.target.value) })}
//                                                     className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
//                                                 />
//                                             </div>

//                                             <div className="flex flex-col lg:col-span-2">
//                                                 <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Skills</label>
//                                                 <input
//                                                     placeholder="React, Node.js, Python..."
//                                                     onChange={(e) =>
//                                                         setFilters({
//                                                             ...filters,
//                                                             skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
//                                                         })
//                                                     }
//                                                     className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
//                                                 />
//                                             </div>

//                                             <div className="flex flex-col">
//                                                 <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Location</label>
//                                                 <input
//                                                     placeholder="e.g. city"
//                                                     onChange={(e) => setFilters({ ...filters, location: e.target.value })}
//                                                     className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
//                                                 />
//                                             </div>

//                                             <div className="flex flex-col">
//                                                 <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Applicant Name</label>
//                                                 <input
//                                                     placeholder="e.g. John Doe"
//                                                     onChange={(e) => setFilters({ ...filters, applicant_name: e.target.value })}
//                                                     className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
//                                                 />
//                                             </div>

//                                             <div className="lg:col-start-5 flex justify-end">
//                                                 <button
//                                                     onClick={search}
//                                                     disabled={loading}
//                                                     className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
//                                                 >
//                                                     {loading ? (
//                                                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                                         </svg>
//                                                     ) : (
//                                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                                         </svg>
//                                                     )}
//                                                     {loading ? "Searching..." : "Search"}
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Empty State */}
//                                     {!loading && results.length === 0 && (
//                                         <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
//                                             <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                                             </svg>
//                                             <h3 className="mt-4 text-sm font-semibold text-slate-900">No candidates found</h3>
//                                             <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search terms.</p>
//                                         </div>
//                                     )}

//                                     {/* Results Grid */}
//                                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                                         {results?.map((c) => (
//                                             <div key={c.name} className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 p-6 flex flex-col transition-all duration-300 group">

//                                                 {/* Card Header */}
//                                                 <div className="flex items-start gap-4 mb-4">
//                                                     <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
//                                                         {getInitials(c.applicant_name)}
//                                                     </div>
//                                                     <div>
//                                                         <h2 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
//                                                             {c.applicant_name}
//                                                         </h2>
//                                                         <p className="text-xs font-mono text-slate-400 mt-0.5 uppercase tracking-wider">{c.name}</p>
//                                                     </div>
//                                                 </div>

//                                                 {/* Info Rows */}
//                                                 <div className="flex flex-col gap-2 mb-6">
//                                                     <div className="flex items-center text-slate-600 text-sm">
//                                                         <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
//                                                         <span className="font-medium text-slate-800">{c.custom_current_role || "Role Not Specified"}</span>
//                                                     </div>
//                                                     <div className="flex items-center text-slate-600 text-sm">
//                                                         <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
//                                                         <span>{c.custom_degree || "Qualification Not Specified"}</span>
//                                                     </div>
//                                                     <div className="flex items-center text-slate-600 text-sm">
//                                                         <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
//                                                         <span><strong className="text-slate-800">{c.custom_experience_years || 0}</strong> years experience</span>
//                                                     </div>
//                                                     <div className="flex items-center text-slate-600 text-sm">
//                                                         <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
//                                                         <span>{c.current_location || "Location Not Specified"}</span>
//                                                     </div>
//                                                 </div>

//                                                 {/* Skills Pills */}
//                                                 <div className="mt-auto">
//                                                     <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">Skills</h3>
//                                                     <div className="flex flex-wrap gap-2">
//                                                         {typeof c.custom_skills === "string" && c.custom_skills ? (
//                                                             c.custom_skills.split(",").map((s, i) => (
//                                                                 <span
//                                                                     key={i}
//                                                                     className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 text-xs font-medium rounded-md"
//                                                                 >
//                                                                     {s.trim()}
//                                                                 </span>
//                                                             ))
//                                                         ) : (
//                                                             <span className="text-xs text-slate-400 italic">No skills listed</span>
//                                                         )}
//                                                     </div>
//                                                 </div>

//                                                 {/* View Resumes Button */}
//                                                 <div className="mt-2 pt-4 border-t border-slate-100">
//                                                     {c.resumes?.length > 0 && (
//                                                         <button
//                                                             onClick={() => setSelectedCandidate(c)}
//                                                             className="w-full bg-black text-white py-2 rounded"
//                                                         >
//                                                             View Resumes ({c.resumes.length})
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Modal */}
//                 {selectedCandidate && (
//                     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-xl p-6 w-full max-w-lg">
//                             <h2 className="text-lg font-bold mb-4">{selectedCandidate.applicant_name} - Resumes</h2>
//                             <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
//                                 {selectedCandidate.resumes
//                                     ?.sort((a, b) => new Date(b.creation) - new Date(a.creation))
//                                     .map((r, i) => (
//                                         <a
//                                             key={i}
//                                             href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${r.resume_attachment}`}
//                                             target="_blank"
//                                             className="bg-gray-100 p-3 rounded flex justify-between items-center"
//                                         >
//                                             <span className="truncate max-w-[70%]">
//                                                 {r.file_name || "Unnamed Resume"}
//                                             </span>
//                                             <span className="text-xs text-gray-500">
//                                                 {new Date(r.creation).toLocaleString()}
//                                             </span>
//                                         </a>
//                                     ))}
//                             </div>
//                             <button
//                                 onClick={() => setSelectedCandidate(null)}
//                                 className="mt-4 w-full bg-red-500 text-white py-2 rounded"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// }





"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Home,
    ArrowLeft,
    ChevronRight,
    Menu,
    X,
    Plus,
    Users,
    Upload,
    Briefcase,
    Calendar,
    MessageSquare,
    FileText,
    UserCheck,
    Zap,
    LogOut,
} from "lucide-react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .db {
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
    --accent-bdr:rgba(0,158,247,.28);

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

  .db-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  .db-sb {
    width: var(--sb-w); background: var(--sb);
    min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 100;
    display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .db-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }

  .db-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }
  .db-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; flex-shrink: 0;
  }
  .db-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .db-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; line-height: 1.25; }
  .db-sb-sub  { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
  .db-sb-close {
    margin-left: auto; flex-shrink: 0;
    width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer;
    color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center;
    transition: all .14s;
  }
  .db-sb-close:hover { background: var(--sb-hover); color: #fff; }

  .db-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .db-nav::-webkit-scrollbar { width: 3px; }
  .db-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }
  .db-nav-cta {
    display: flex; align-items: center; gap: 9px;
    padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    color: var(--accent); font-size: 13px; font-weight: 600;
    text-decoration: none; transition: background .15s; margin-bottom: 22px;
  }
  .db-nav-cta:hover { background: rgba(0,158,247,.24); }
  .db-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
  }
  .db-nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt);
    text-decoration: none; transition: all .14s;
  }
  .db-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; }
  .db-nav-link:hover { background: var(--sb-hover); color: #fff; }
  .db-nav-link:hover svg { opacity: 1; }
  .db-nav-link.active { background: var(--sb-hover); color: #fff; }
  .db-nav-link.active svg { opacity: 1; }
  .db-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .db-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; border-radius: 8px; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--sb-lbl); text-align: left; transition: all .14s;
  }
  .db-logout svg { opacity: .6; width: 15px; height: 15px; }
  .db-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }

  .db-overlay {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
  }
  .db-overlay.show { display: block; }

  .db-main {
    margin-left: var(--sb-w); flex: 1;
    display: flex; flex-direction: column; min-height: 100vh;
    transition: margin-left .25s cubic-bezier(.4,0,.2,1);
  }
  .db-main.sb-closed { margin-left: 0; }

  .db-header {
    height: 60px; background: #fff;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 1px 0 rgba(0,158,247,.08);
  }
  .db-toggle {
    width: 34px; height: 34px; border-radius: 8px;
    background: none; border: 1px solid var(--border);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .db-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .db-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .db-btn-back {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    background: transparent; color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer; text-decoration: none;
    transition: all .14s; white-space: nowrap;
  }
  .db-btn-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .db-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
  .db-crumb svg { width: 13px; height: 13px; }
  .db-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }
  .db-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }

  .db-page { padding: 28px 32px; }

  /* ── CANDIDATE NAME BUTTON ── */
  .candidate-name-btn {
    font-size: 1.125rem;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.25;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    text-align: left;
    font-family: 'Inter', system-ui, sans-serif;
    display: block;
    transition: color 0.15s;
  }
  .candidate-name-btn:hover {
    color: #4f46e5;
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .db-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .db-sb.open { transform: translateX(0); }
    .db-main { margin-left: 0 !important; }
    .db-page { padding: 18px 16px; }
    .db-header { padding: 0 16px; }
  }
`;

export default function CandidatesPage() {
    const router = useRouter();
    const [filters, setFilters] = useState({
        skills: [],
        min_exp: 0,
        max_exp: 100,
        degree: "",
        location: "",
        role: "",
        applicant_name: ""
    });

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const search = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                filters: JSON.stringify(filters)
            }).toString();

            const res = await fetch(
                `/api/method/vaaman_ats_ai.api.data_bank.data_bank.search_candidates?${queryParams}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                }
            );

            const data = await res.json();
            setResults(Array.isArray(data.message) ? data.message : []);
        } catch (error) {
            console.error("Failed to fetch candidates", error);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return "NA";
        return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
    };

    const sidebarPipeline = [
        { id: "job-opening", title: "Job Opening", icon: <Briefcase size={15} />, href: "/job-opening" },
        { id: "resume", title: "Resume Collection", icon: <Upload size={15} />, href: "/upload-resumes" },
        { id: "candidates", title: "Candidates", icon: <Users size={15} />, href: "/candidates" },
        { id: "interview", title: "Interview Scheduling", icon: <Calendar size={15} />, href: "/interview" },
    ];
    const sidebarClosing = [
        { id: "feedback", title: "Candidate Feedback", icon: <MessageSquare size={15} />, href: "/feedback" },
        { id: "doc-verify", title: "Document Verification", icon: <FileText size={15} />, href: "/document-verify-list" },
        { id: "offer", title: "Offer Letter", icon: <Zap size={15} />, href: "/offer-list" },
        { id: "appointment", title: "Appointment Letter", icon: <UserCheck size={15} />, href: "/letter-appointment" },
    ];

    return (
        <>
            <style>{css}</style>
            <div className="db">
                <div className="db-wrap">

                    <div
                        className={`db-overlay${sidebarOpen ? " show" : ""}`}
                        onClick={() => setSidebarOpen(false)}
                    />

                    <aside className={`db-sb${sidebarOpen ? "" : " collapsed"}`}>
                        <div className="db-sb-brand">
                            <div className="db-sb-icon">
                                <img src="/vaaman_logo.png" alt="logo" />
                            </div>
                            <div>
                                <div className="db-sb-name">Job Management</div>
                                <div className="db-sb-sub">HR Platform</div>
                            </div>
                            <button className="db-sb-close" onClick={() => setSidebarOpen(false)} title="Close sidebar">
                                <X size={15} />
                            </button>
                        </div>
                        <nav className="db-nav">
                            <Link href="/create-job" className="db-nav-cta">
                                <Plus size={14} /> New Job Opening
                            </Link>
                            <div className="db-nav-lbl">General</div>
                            <Link href="/home" className="db-nav-link">
                                <Home size={15} /> Home
                            </Link>
                            <div className="db-nav-lbl">Pipeline</div>
                            {sidebarPipeline.map(s => (
                                <Link key={s.id} href={s.href}
                                    className={`db-nav-link${s.href === "/candidates" ? " active" : ""}`}>
                                    {s.icon} {s.title}
                                </Link>
                            ))}
                            <div className="db-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
                            {sidebarClosing.map(s => (
                                <Link key={s.id} href={s.href} className="db-nav-link">
                                    {s.icon} {s.title}
                                </Link>
                            ))}
                        </nav>
                        <div className="db-sb-foot">
                            <button className="db-logout">
                                <LogOut size={15} /> Sign out
                            </button>
                        </div>
                    </aside>

                    <div className={`db-main${sidebarOpen ? "" : " sb-closed"}`}>

                        <header className="db-header">
                            <button className="db-toggle" onClick={() => setSidebarOpen(o => !o)} title="Toggle sidebar">
                                <Menu size={16} />
                            </button>
                            <div className="db-hdr-sep" />
                            <Link href="/home" className="db-btn-back">
                                <ArrowLeft size={13} /> Back
                            </Link>
                            <div className="db-hdr-sep" />
                            <div className="db-crumb">
                                <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'inherit', textDecoration: 'none' }}>
                                    <Home size={13} /> Home
                                </Link>
                                <ChevronRight size={13} />
                                <strong>Data Bank</strong>
                            </div>
                            <div className="db-hdr-right" />
                        </header>

                        <div className="db-page">
                            <div className="min-h-screen bg-slate-50 font-sans">
                                <div className="max-w-7xl mx-auto">

                                    <div className="mb-8">
                                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">DATA BANK</h1>
                                        <p className="text-slate-500 mt-2 text-sm">Search and filter through potential candidates based on skills, experience, and education.</p>
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                                            <div className="flex flex-col">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Role</label>
                                                <input
                                                    placeholder="e.g. Frontend Developer"
                                                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Qualification</label>
                                                <input
                                                    placeholder="e.g. B.Tech"
                                                    onChange={(e) => setFilters({ ...filters, degree: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Min Exp (Yrs)</label>
                                                <input
                                                    placeholder="0"
                                                    type="number"
                                                    min="0"
                                                    onChange={(e) => setFilters({ ...filters, min_exp: Number(e.target.value) })}
                                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Max Exp (Yrs)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    onChange={(e) => setFilters({ ...filters, max_exp: Number(e.target.value) })}
                                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
                                                />
                                            </div>
                                            <div className="flex flex-col lg:col-span-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Skills</label>
                                                <input
                                                    placeholder="React, Node.js, Python..."
                                                    onChange={(e) =>
                                                        setFilters({
                                                            ...filters,
                                                            skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                                                        })
                                                    }
                                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Location</label>
                                                <input
                                                    placeholder="e.g. city"
                                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Applicant Name</label>
                                                <input
                                                    placeholder="e.g. John Doe"
                                                    onChange={(e) => setFilters({ ...filters, applicant_name: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none px-4 py-2.5 transition-colors"
                                                />
                                            </div>
                                            <div className="lg:col-start-5 flex justify-end">
                                                <button
                                                    onClick={search}
                                                    disabled={loading}
                                                    className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {loading ? (
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>
                                                    )}
                                                    {loading ? "Searching..." : "Search"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {!loading && results.length === 0 && (
                                        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                                            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <h3 className="mt-4 text-sm font-semibold text-slate-900">No candidates found</h3>
                                            <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search terms.</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {results?.map((c) => (
                                            <div key={c.name} className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 p-6 flex flex-col transition-all duration-300 group">

                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                                                        {getInitials(c.applicant_name)}
                                                    </div>
                                                    <div>
                                                        {/* ── FIXED: plain <button> with CSS class, guaranteed to work ── */}

                                                        <button
                                                            className="candidate-name-btn"
                                                            onClick={() => router.push(`/candidates?search=${encodeURIComponent(c.applicant_name)}`)}
                                                        >
                                                            {c.applicant_name}
                                                        </button>
                                                        <p className="text-xs font-mono text-slate-400 mt-0.5 uppercase tracking-wider">{c.name}</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 mb-6">
                                                    <div className="flex items-center text-slate-600 text-sm">
                                                        <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                        <span className="font-medium text-slate-800">{c.custom_current_role || "Role Not Specified"}</span>
                                                    </div>
                                                    <div className="flex items-center text-slate-600 text-sm">
                                                        <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
                                                        <span>{c.custom_degree || "Qualification Not Specified"}</span>
                                                    </div>
                                                    <div className="flex items-center text-slate-600 text-sm">
                                                        <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        <span><strong className="text-slate-800">{c.custom_experience_years || 0}</strong> years experience</span>
                                                    </div>
                                                    <div className="flex items-center text-slate-600 text-sm">
                                                        <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
                                                        <span>{c.current_location || "Location Not Specified"}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-auto">
                                                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">Skills</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {typeof c.custom_skills === "string" && c.custom_skills ? (
                                                            c.custom_skills.split(",").map((s, i) => (
                                                                <span key={i} className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 text-xs font-medium rounded-md">
                                                                    {s.trim()}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-slate-400 italic">No skills listed</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-2 pt-4 border-t border-slate-100">
                                                    {c.resumes?.length > 0 && (
                                                        <button
                                                            onClick={() => setSelectedCandidate(c)}
                                                            className="w-full bg-black text-white py-2 rounded"
                                                        >
                                                            View Resumes ({c.resumes.length})
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {selectedCandidate && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                            <h2 className="text-lg font-bold mb-4">{selectedCandidate.applicant_name} - Resumes</h2>
                            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
                                {selectedCandidate.resumes
                                    ?.sort((a, b) => new Date(b.creation) - new Date(a.creation))
                                    .map((r, i) => (
                                        <a
                                            key={i}
                                            href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${r.resume_attachment}`}
                                            target="_blank"
                                            className="bg-gray-100 p-3 rounded flex justify-between items-center"
                                        >
                                            <span className="truncate max-w-[70%]">{r.file_name || "Unnamed Resume"}</span>
                                            <span className="text-xs text-gray-500">{new Date(r.creation).toLocaleString()}</span>
                                        </a>
                                    ))}
                            </div>
                            <button
                                onClick={() => setSelectedCandidate(null)}
                                className="mt-4 w-full bg-red-500 text-white py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
