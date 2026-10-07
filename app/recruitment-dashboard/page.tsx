'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import { Home, ChevronRight, ArrowLeft } from "lucide-react"
import {
    ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
} from "recharts"
import { API_BASE_URL } from "@/lib/api-config"

type Item = { label: string; value: number }

const COLORS = ["#009ef7", "#f783ac", "#2f88d9", "#48bb78", "#a0aec0", "#f56565", "#f6d365", "#4c4a8a", "#ed8936", "#38b2ac"]

const api = async (method: string, params: Record<string, string> = {}) => {
    const q = new URLSearchParams(params).toString()
    const res = await fetch(
        `${API_BASE_URL}/api/method/resume.api.recruitment_dashboard.${method}${q ? `?${q}` : ""}`,
        { credentials: "include" }
    )
    const json = await res.json()
    if (!res.ok || !json?.message?.success) throw new Error("API failed")
    return json.message.data
}

const css = `
  .rd { font-family: 'Inter', system-ui, sans-serif; background:#f0f8fe; min-height:100vh; color:#0d1b2a; }
  .rd-header { height:60px; background:#fff; border-bottom:1px solid #cce8f8; display:flex; align-items:center; padding:0 28px; gap:12px; position:sticky; top:0; z-index:10; font-size:13.5px; }
  .rd-header a { display:flex; align-items:center; gap:4px; color:#6a9cb8; text-decoration:none; }
  .rd-header .rd-btn-back { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:8px; background:transparent; color:#2d5a78; font-size:13px; font-weight:500; border:1px solid #cce8f8; text-decoration:none; transition:all .14s; white-space:nowrap; }
  .rd-header .rd-btn-back:hover { background:#e0f4ff; border-color:#009ef7; color:#009ef7; }
  .rd-sep { width:1px; height:20px; background:#cce8f8; flex-shrink:0; }
  .rd-page { padding:28px 32px; display:flex; flex-direction:column; gap:22px; }
  .rd-title { font-size:21px; font-weight:800; letter-spacing:-0.5px; }
  .rd-sub { font-size:13px; color:#6a9cb8; margin-top:4px; }
  .rd-kpis { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .rd-kpi { background:#fff; border:1px solid #ddf0fb; border-radius:10px; padding:16px 18px; }
  .rd-kpi-t { font-size:12.5px; color:#2d5a78; font-weight:500; }
  .rd-kpi-v { font-size:26px; font-weight:700; margin-top:6px; }
  .rd-kpi-s { font-size:12px; color:#6a9cb8; margin-top:4px; }
  .rd-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
  .rd-card { background:#fff; border:1px solid #ddf0fb; border-radius:10px; padding:16px 18px; min-width:0; }
  .rd-card.full { grid-column:1 / -1; }
  .rd-card-h { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; gap:8px; flex-wrap:wrap; }
  .rd-card-t { font-size:14px; font-weight:700; }
  .rd-sel { border:1px solid #cce8f8; border-radius:7px; padding:5px 8px; font-size:12.5px; background:#fff; margin-left:6px; }
  .rd-empty { padding:60px 0; text-align:center; color:#6a9cb8; font-size:13px; }
  .rd-msg { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#f0f8fe; color:#2d5a78; font-size:14px; }
  @media (max-width:960px) { .rd-kpis, .rd-grid { grid-template-columns:1fr; } .rd-page { padding:16px 14px; } }
`

function PieBlock({ data }: { data: Item[] }) {
    if (!data?.length) return <div className="rd-empty">No data</div>
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={data} dataKey="value" nameKey="label" outerRadius={95}>
                    {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend formatter={(v: any, e: any) => `${v} (${e?.payload?.value})`} />
            </PieChart>
        </ResponsiveContainer>
    )
}

function HBarBlock({ data }: { data: Item[] }) {
    if (!data?.length) return <div className="rd-empty">No data</div>
    return (
        <ResponsiveContainer width="100%" height={Math.max(260, data.length * 34)}>
            <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="label" width={150} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" name="Count" fill="#f783ac" radius={[0, 4, 4, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}

function ColumnBlock({ data }: { data: Item[] }) {
    if (!data?.length) return <div className="rd-empty">No data</div>
    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" name="Count" fill="#009ef7" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}

function LineBlock({ data }: { data: Item[] }) {
    if (!data?.length) return <div className="rd-empty">No data</div>
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" name="Applications" stroke="#f783ac" strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    )
}

function Card({ title, full, children, right }: { title: string; full?: boolean; children: React.ReactNode; right?: React.ReactNode }) {
    return (
        <div className={`rd-card${full ? " full" : ""}`}>
            <div className="rd-card-h">
                <span className="rd-card-t">{title}</span>
                {right}
            </div>
            {children}
        </div>
    )
}

export default function RecruitmentDashboardPage() {
    const [data, setData] = useState<any>(null)
    const [frequency, setFrequency] = useState<Item[]>([])
    const [range, setRange] = useState("Last Year")
    const [interval, setInterval] = useState("Monthly")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        document.title = "Recruitment Dashboard"
        api("get_dashboard_data")
            .then(d => { setData(d); setFrequency(d.frequency) })
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [])

    // Line chart ka filter change hone par sirf frequency dobara laao
    const firstLoad = data === null
    useEffect(() => {
        if (firstLoad) return
        api("get_application_frequency", { date_range: range, interval })
            .then(setFrequency)
            .catch(console.error)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [range, interval])

    if (loading) return <><style>{css}</style><div className="rd-msg">Loading dashboard...</div></>
    if (error || !data) return <><style>{css}</style><div className="rd-msg">Unable to load dashboard data. Please refresh.</div></>

    const k = data.kpis
    const pct = (n: number) => `${n >= 0 ? "+" : ""}${n}% vs last month`

    const kpis = [
        { t: "Total Job Openings", v: k.openings_total, s: `${k.openings_open} Open • ${k.openings_closed} Closed` },
        { t: "Openings Created (This Month)", v: k.openings_this_month, s: pct(k.openings_change) },
        { t: "Total Applicants", v: k.applicants_total },
        { t: "Applicants (This Month)", v: k.applicants_this_month, s: pct(k.applicants_change) },
        { t: "Total Interviews", v: k.interviews_total },
        { t: "Interviews (This Month)", v: k.interviews_this_month, s: pct(k.interviews_change) },
        { t: "Accepted Job Applicants", v: k.accepted },
        { t: "Rejected Job Applicants", v: k.rejected },
        { t: "Job Offers (This Month)", v: k.offers_this_month },
        { t: "Applicant-to-Hire %", v: `${k.applicant_to_hire}%` },
        { t: "Job Offer Acceptance Rate", v: `${k.offer_acceptance_rate}%` },
        { t: "Time to Fill (days)", v: k.time_to_fill },
    ]

    return (
        <>
            <style>{css}</style>
            <div className="rd">
                <header className="rd-header">
                    <Link href="/home" className="rd-btn-back">
                        <ArrowLeft size={13} /> Back
                    </Link>
                    <div className="rd-sep" />
                    <Link href="/home"><Home size={13} /> Home</Link>
                    <ChevronRight size={13} color="#6a9cb8" />
                    <strong>Recruitment Dashboard</strong>
                </header>

                <div className="rd-page">
                    <div>
                        <h1 className="rd-title">Recruitment Dashboard</h1>
                        <p className="rd-sub">Live recruitment statistics</p>
                    </div>

                    <div className="rd-kpis">
                        {kpis.map(c => (
                            <div key={c.t} className="rd-kpi">
                                <div className="rd-kpi-t">{c.t}</div>
                                <div className="rd-kpi-v">{c.v}</div>
                                {c.s && <div className="rd-kpi-s">{c.s}</div>}
                            </div>
                        ))}
                    </div>

                    <div className="rd-grid">
                        <Card title="Job Applicant Pipeline (Designation wise)" full><HBarBlock data={data.pipeline} /></Card>
                        <Card title="Job Applicant Source"><PieBlock data={data.source} /></Card>
                        <Card title="Job Applicants by Country"><PieBlock data={data.country} /></Card>
                        <Card title="Job Application Status"><PieBlock data={data.application_status} /></Card>
                        <Card title="Job Offer Status"><PieBlock data={data.offer_status} /></Card>
                        <Card title="Interview Status"><PieBlock data={data.interview_status} /></Card>
                        <Card title="Job Openings Created (Month wise)"><ColumnBlock data={data.openings_monthly} /></Card>
                        <Card title="Job Applicants (Month wise)"><ColumnBlock data={data.applicants_monthly} /></Card>
                        <Card title="Interviews (Month wise)"><ColumnBlock data={data.interviews_monthly} /></Card>

                        <Card
                            title="Job Application Frequency"
                            full
                            right={
                                <div>
                                    <select className="rd-sel" value={range} onChange={e => setRange(e.target.value)}>
                                        <option>Last Month</option>
                                        <option>Last 3 Months</option>
                                        <option>Last 6 Months</option>
                                        <option>Last Year</option>
                                    </select>
                                    <select className="rd-sel" value={interval} onChange={e => setInterval(e.target.value)}>
                                        <option>Daily</option>
                                        <option>Weekly</option>
                                        <option>Monthly</option>
                                    </select>
                                </div>
                            }
                        >
                            <LineBlock data={frequency} />
                        </Card>

                        <Card title="Department Wise Openings"><HBarBlock data={data.department} /></Card>
                        <Card title="Designation Wise Openings"><HBarBlock data={data.designation} /></Card>
                    </div>
                </div>
            </div>
        </>
    )
}
