"use client";
import { useState } from "react";

export default function CandidatesPage() {
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

    const search = async () => {
        setLoading(true);

        try {
            // Convert filters object to a URL-encoded string
            const queryParams = new URLSearchParams({
                filters: JSON.stringify(filters)
            }).toString();

            const res = await fetch(
                `/api/method/vaaman_ats_ai.api.data_bank.data_bank.search_candidates?${queryParams}`,
                {
                    method: "GET", // ✅ Changed to GET
                    headers: {
                        "Content-Type": "application/json"
                    }
                    // ❌ Removed the body completely
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

    // Helper to get initials for the avatar
    const getInitials = (name) => {
        if (!name) return "NA";
        return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">DATA BANK</h1>
                    <p className="text-slate-500 mt-2 text-sm">Search and filter through potential candidates based on skills, experience, and education.</p>
                </div>

                {/* 🔍 Filters Card */}
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
                                // placeholder="10"
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
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                )}
                                {loading ? "Searching..." : "Search"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ❌ Empty State */}
                {!loading && results.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                        <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="mt-4 text-sm font-semibold text-slate-900">No candidates found</h3>
                        <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search terms.</p>
                    </div>
                )}

                {/* 📋 Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {results?.map((c) => (
                        <div key={c.name} className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 p-6 flex flex-col transition-all duration-300 group">

                            {/* Card Header (Avatar + Identity) */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                                    {getInitials(c.applicant_name)}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                        {c.applicant_name}
                                    </h2>
                                    <p className="text-xs font-mono text-slate-400 mt-0.5 uppercase tracking-wider">{c.name}</p>
                                </div>
                            </div>

                            {/* Info Rows */}
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

                            {/* Skills Pills */}
                            <div className="mt-auto">
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {typeof c.custom_skills === "string" && c.custom_skills ? (
                                        c.custom_skills.split(",").map((s, i) => (
                                            <span
                                                key={i}
                                                className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 text-xs font-medium rounded-md"
                                            >
                                                {s.trim()}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">No skills listed</span>
                                    )}
                                </div>
                            </div>

                            {/* ✅ NEW BUTTON */}
                            <div className="mt-2 pt-4 border-t border-slate-100">
                                {c.resumes?.length > 0 && (<button onClick={() => setSelectedCandidate(c)} className="w-full bg-black text-white py-2 rounded" > View Resumes ({c.resumes.length}) </button>)}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
            {/* ✅ MODAL */}
            {selectedCandidate && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"> <div className="bg-white rounded-xl p-6 w-full max-w-lg"> <h2 className="text-lg font-bold mb-4"> {selectedCandidate.applicant_name} - Resumes </h2> <div className="flex flex-col gap-3 max-h-80 overflow-y-auto"> {selectedCandidate.resumes
                ?.sort((a, b) => new Date(b.creation) - new Date(a.creation))
                .map((r, i) => {
                    // const fileName = decodeURIComponent(
                    //     r.resume_attachment.split("/").pop().split("_").pop()
                    // );

                    return (
                        <a
                            key={i}
                            href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${r.resume_attachment}`}
                            target="_blank"
                            className="bg-gray-100 p-3 rounded flex justify-between items-center"
                        >
                            <span className="truncate max-w-[70%]">
                                {r.file_name || "Unnamed Resume"}
                            </span>

                            <span className="text-xs text-gray-500">
                                {new Date(r.creation).toLocaleString()}
                            </span>
                        </a>
                    );
                })} </div> <button onClick={() => setSelectedCandidate(null)} className="mt-4 w-full bg-red-500 text-white py-2 rounded" > Close </button> </div> </div>)}
        </div>
    );
}
