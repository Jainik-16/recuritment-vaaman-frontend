"use client";
import { useState } from "react";

export default function CandidatesPage() {
    const [filters, setFilters] = useState({
        skills: [],
        min_exp: 0,
        max_exp: 10,
        degree: "",
        role: ""
    });

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const search = async () => {
        setLoading(true);

        // const res = await fetch("/api/method/resume_ai.api.resume_filters.candidates.search_candidates", {
        //   method: "POST",
        //   body: JSON.stringify(filters)
        // });

        const res = await fetch(
            "/api/method/resume_ai.api.resume_filters.candidates.search_candidates",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                // ✅ FIX HERE
                body: JSON.stringify({
                    filters: filters
                })
            }
        );

        const data = await res.json();

        setResults(Array.isArray(data.message) ? data.message : []);
        setLoading(false);
    };

    console.log(results, "--results")
    return (
        <div className="p-6">

            {/* 🔍 Filters */}
            <div className="flex flex-wrap gap-3 mb-4">

                <input
                    placeholder="Role"
                    onChange={(e) =>
                        setFilters({ ...filters, role: e.target.value })
                    }
                    className="border p-2"
                />

                <input
                    placeholder="Degree"
                    onChange={(e) =>
                        setFilters({ ...filters, degree: e.target.value })
                    }
                    className="border p-2"
                />

                <input
                    placeholder="Min Exp"
                    type="number"
                    onChange={(e) =>
                        setFilters({ ...filters, min_exp: Number(e.target.value) })
                    }
                    className="border p-2"
                />

                <input
                    placeholder="Max Exp"
                    type="number"
                    onChange={(e) =>
                        setFilters({ ...filters, max_exp: Number(e.target.value) })
                    }
                    className="border p-2"
                />

                <input
                    placeholder="Skills (comma separated)"
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            skills: e.target.value.split(",").map(s => s.trim())
                        })
                    }
                    className="border p-2 w-64"
                />

                <button
                    onClick={search}
                    className="bg-blue-500 text-white px-4 py-2"
                >
                    Search
                </button>
            </div>

            {/* ⏳ Loader */}
            {loading && <p>Loading...</p>}

            {/* ❌ Empty */}
            {!loading && results.length === 0 && (
                <p>No candidates found</p>
            )}

            {/* 📋 Results */}
            <div className="grid gap-4">
                {results?.map((c) => (
                    <div key={c.name} className="border p-4 rounded shadow">

                        <h2 className="text-lg font-bold">{c.candidate_name}</h2>
                            <h1 className="text-lg font-bold">({c.name})</h1>

                        <p className="text-sm text-gray-600">
                            {c.current_role}
                        </p>
                        <p className="text-sm text-gray-600">
                            {c.degree}
                        </p>

                        <p className="text-sm">
                            Experience: {c.experience_years} years
                        </p>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {typeof c.skills === "string" &&
                                c.skills.split(",").map((s, i) => (
                                    <span
                                        key={i}
                                        className="bg-gray-200 px-2 py-1 text-sm rounded"
                                    >
                                        {s.trim()}
                                    </span>
                                ))}
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}