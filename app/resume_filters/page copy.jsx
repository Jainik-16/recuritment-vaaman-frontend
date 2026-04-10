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

  const search = async () => {
    const res = await fetch("/api/method/resume_ai.api.resume_filters.candidates.search_candidates", {
      method: "POST",
      body: JSON.stringify(filters)
    });

    const data = await res.json();
    // setResults(data);
    setResults(data.message);
  };
console.log("Current filters:", results);
  return (
    <div className="p-6">
      
      {/* 🔍 Filters */}
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Role"
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="border p-2"
        />

        <input
          placeholder="Degree"
          onChange={(e) => setFilters({ ...filters, degree: e.target.value })}
          className="border p-2"
        />

        <input
          placeholder="Min Exp"
          type="number"
          onChange={(e) => setFilters({ ...filters, min_exp: +e.target.value })}
          className="border p-2"
        />

        <button onClick={search} className="bg-blue-500 text-white px-4">
          Search
        </button>
      </div>

      {/* 📋 Results */}
      <div className="grid gap-4">
        {results?.map((c) => (
          <div key={c.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-bold">{c.name}</h2>
            <p>{c.current_role}</p>
            <p>{c.experience} years</p>

            <div className="flex gap-2 mt-2">
              {c.skills.map((s, i) => (
                <span key={i} className="bg-gray-200 px-2 py-1 text-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}