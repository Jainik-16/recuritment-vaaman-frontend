"use client"
import { useEffect, useState } from "react"
import type React from "react"
import { getFrappeCSRF } from "@/lib/csrf"
import {
  ArrowLeft, Briefcase, Building, MapPin, Users, DollarSign,
  Calendar, CheckCircle, AlertCircle, Clock, FileText, Sparkles,
  LogOut, Plus, Upload, MessageSquare, UserCheck, Zap,
  ChevronRight, Home, Menu, X,
} from "lucide-react"
import Link from "next/link"
import { API_BASE_URL } from '@/lib/api-config'
import { useRouter } from "next/navigation"

/* ─────────────────────────────────────────────
   CSS — same design system as dashboard & job list
───────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cj {
    --sb-w:       265px;
    --sb:         #1e1e2d;
    --sb2:        #151521;
    --sb-hover:   #2b2b40;
    --sb-bdr:     rgba(255,255,255,.07);
    --sb-txt:     #9899ac;
    --sb-lbl:     #474761;
    --accent:     #009ef7;
    --accent-h:   #007ec4;
    --accent-lt:  #e0f4ff;
    --accent-md:  rgba(0,158,247,.15);
    --accent-bdr: rgba(0,158,247,.28);
    --bg:         #f0f8fe;
    --card:       #ffffff;
    --border:     #cce8f8;
    --border-s:   #ddf0fb;
    --t1:         #0d1b2a;
    --t2:         #2d5a78;
    --t3:         #6a9cb8;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13.5px;
    -webkit-font-smoothing: antialiased;
  }

  .cj-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  /* ── SIDEBAR ── */
  .cj-sb {
    width: var(--sb-w); background: var(--sb);
    min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 100;
    display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
    transform: translateX(calc(-1 * var(--sb-w)));
  }
  .cj-sb.open { transform: translateX(0); }

  .cj-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }
  .cj-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
  }
  .cj-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .cj-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; line-height: 1.25; }
  .cj-sb-sub  { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }

  .cj-sb-close {
    margin-left: auto; flex-shrink: 0;
    width: 28px; height: 28px; border-radius: 7px; background: none; border: none;
    cursor: pointer; color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center; transition: all .14s;
  }
  .cj-sb-close:hover { background: var(--sb-hover); color: #fff; }

  .cj-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .cj-nav::-webkit-scrollbar { width: 3px; }
  .cj-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }

  .cj-nav-cta {
    display: flex; align-items: center; gap: 9px;
    padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    color: var(--accent); font-size: 13px; font-weight: 600;
    text-decoration: none; transition: background .15s; margin-bottom: 22px;
  }
  .cj-nav-cta:hover { background: rgba(0,158,247,.24); }

  .cj-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
  }
  .cj-nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt);
    text-decoration: none; transition: all .14s;
  }
  .cj-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; }
  .cj-nav-link:hover { background: var(--sb-hover); color: #fff; }
  .cj-nav-link:hover svg { opacity: 1; }

  .cj-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .cj-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; border-radius: 8px; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--sb-lbl); text-align: left; transition: all .14s;
  }
  .cj-logout svg { opacity: .6; width: 15px; height: 15px; }
  .cj-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }

  /* ── OVERLAY — mobile only ── */
  .cj-overlay {
    position: fixed; inset: 0; z-index: 99;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px);
    cursor: pointer; opacity: 0; pointer-events: none; transition: opacity .25s;
  }
  @media (max-width: 768px) {
    .cj-overlay.show { opacity: 1; pointer-events: auto; }
  }

  /* ── MAIN ── */
  .cj-main { margin-left: 0; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* ── HEADER ── */
  .cj-header {
    height: 60px; background: #fff; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 1px 0 rgba(0,158,247,.08);
  }
  .cj-toggle {
    width: 34px; height: 34px; border-radius: 8px;
    background: none; border: 1px solid var(--border);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .cj-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .cj-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .cj-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
  .cj-crumb svg { width: 13px; height: 13px; }
  .cj-crumb a  { color: var(--t3); text-decoration: none; transition: color .14s; }
  .cj-crumb a:hover { color: var(--accent); }
  .cj-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }
  .cj-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }

  .cj-btn-out {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 14px; border-radius: 8px; background: transparent; color: var(--t3);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer; text-decoration: none;
    transition: all .14s; white-space: nowrap;
  }
  .cj-btn-out:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

  /* ── PAGE ── */
  .cj-page {
    padding: 28px 32px; max-width: 860px; width: 100%;
    margin: 0 auto; display: flex; flex-direction: column; gap: 20px;
  }
  .cj-page-title { font-size: 20px; font-weight: 800; color: var(--t1); letter-spacing: -0.4px; }
  .cj-page-sub   { font-size: 13px; color: var(--t3); margin-top: 4px; }

  /* ── PROGRESS CARD ── */
  .cj-progress-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
    padding: 22px 24px; box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .cj-progress-head {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;
  }
  .cj-progress-label { font-size: 13.5px; font-weight: 700; color: var(--t1); }
  .cj-step-badge {
    display: inline-flex; align-items: center;
    padding: 3px 11px; border-radius: 20px; font-size: 11.5px; font-weight: 600;
    background: var(--accent-lt); border: 1px solid var(--border); color: var(--accent);
  }
  .cj-progress-track {
    width: 100%; height: 6px; background: var(--border-s);
    border-radius: 99px; overflow: hidden; margin-bottom: 22px;
  }
  .cj-progress-fill {
    height: 100%; background: var(--accent); border-radius: 99px;
    transition: width .4s cubic-bezier(.4,0,.2,1);
  }

  /* Step row */
  .cj-steps { display: flex; align-items: flex-start; }
  .cj-step-row { display: flex; align-items: center; flex: 1; }
  .cj-step-row:last-child { flex: none; }
  .cj-step-item { display: flex; flex-direction: column; align-items: center; gap: 7px; }
  .cj-step-connector {
    flex: 1; height: 2px; margin: 0 4px; margin-bottom: 22px;
    background: var(--border-s); transition: background .3s;
  }
  .cj-step-connector.done { background: #16a34a; }

  .cj-step-circle {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    transition: all .25s; border: 2px solid var(--border-s);
  }
  .cj-step-circle.done    { background: #16a34a; border-color: #16a34a; color: #fff; }
  .cj-step-circle.current { background: var(--accent); border-color: var(--accent); color: #fff; box-shadow: 0 0 0 4px rgba(0,158,247,.18); }
  .cj-step-circle.pending { background: var(--bg); border-color: var(--border); color: var(--t3); }

  .cj-step-title { font-size: 11.5px; font-weight: 600; color: var(--t3); text-align: center; transition: color .2s; white-space: nowrap; }
  .cj-step-title.current { color: var(--accent); }
  .cj-step-title.done    { color: #16a34a; }

  /* ── FORM CARD ── */
  .cj-form-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
    padding: 28px 32px; box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }

  /* Step header */
  .cj-step-head {
    text-align: center; margin-bottom: 26px;
    padding-bottom: 20px; border-bottom: 1px solid var(--border-s);
  }
  .cj-step-icon-wrap {
    width: 56px; height: 56px; border-radius: 16px; margin: 0 auto 14px;
    display: flex; align-items: center; justify-content: center;
    background: var(--accent-lt); color: var(--accent);
  }
  .cj-step-icon-wrap.green   { background: #dcfce7; color: #16a34a; }
  .cj-step-icon-wrap.purple  { background: #ede9fe; color: #7c3aed; }
  .cj-step-icon-wrap.emerald { background: #d1fae5; color: #059669; }
  .cj-step-head-title { font-size: 18px; font-weight: 800; color: var(--t1); letter-spacing: -0.3px; }
  .cj-step-head-sub   { font-size: 13px; color: var(--t3); margin-top: 5px; }

  /* ── FORM GRID ── */
  .cj-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

  /* ── FIELD ── */
  .cj-field { display: flex; flex-direction: column; gap: 6px; }
  .cj-label {
    display: flex; align-items: center; gap: 7px;
    font-size: 11.5px; font-weight: 700; color: var(--t2);
    text-transform: uppercase; letter-spacing: .055em;
  }
  .cj-label svg { width: 13px; height: 13px; flex-shrink: 0; }

  .cj-input {
    height: 44px; padding: 0 14px;
    border: 1px solid var(--border); border-radius: 8px; background: var(--bg);
    font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--t1);
    outline: none; transition: all .15s; width: 100%;
  }
  .cj-input::placeholder { color: var(--t3); }
  .cj-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .cj-input[type="number"] { -moz-appearance: textfield; }
  .cj-input[type="number"]::-webkit-inner-spin-button,
  .cj-input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; }

  .cj-textarea {
    padding: 12px 14px; min-height: 220px; resize: vertical;
    border: 1px solid var(--border); border-radius: 8px; background: var(--bg);
    font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--t1);
    line-height: 1.65; outline: none; transition: all .15s; width: 100%;
  }
  .cj-textarea::placeholder { color: var(--t3); }
  .cj-textarea:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }

  .cj-hint { font-size: 12px; color: var(--t3); display: flex; align-items: flex-start; gap: 6px; margin-top: 4px; }

  /* ── CUSTOM SELECT ── */
  .cj-select-wrap { position: relative; }
  .cj-select {
    width: 100%; height: 44px; padding: 0 36px 0 14px;
    border: 1px solid var(--border); border-radius: 8px; background: var(--bg);
    font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--t1);
    outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; transition: all .15s;
  }
  .cj-select:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .cj-select-chevron {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%) rotate(90deg);
    pointer-events: none; color: var(--t3);
  }

  /* ── SALARY PREVIEW ── */
  .cj-salary-preview {
    background: linear-gradient(135deg, var(--accent-lt), #f0fff4);
    border: 1px solid var(--border); border-radius: 10px;
    padding: 18px; text-align: center; margin-top: 18px;
  }
  .cj-salary-preview-label { font-size: 11.5px; color: var(--t3); font-weight: 500; margin-bottom: 5px; }
  .cj-salary-preview-val   { font-size: 22px; font-weight: 800; color: #15803d; letter-spacing: -0.5px; }
  .cj-salary-preview-per   { font-size: 12.5px; color: var(--t3); margin-top: 3px; }

  /* ── FORM FOOTER ── */
  .cj-form-footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 28px; padding-top: 20px; border-top: 1px solid var(--border-s);
  }
  .cj-btn-prev {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 22px; border-radius: 9px; background: transparent; color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 600;
    border: 1px solid var(--border); cursor: pointer; transition: all .15s;
  }
  .cj-btn-prev:hover:not(:disabled) { background: var(--bg); border-color: var(--t3); }
  .cj-btn-prev:disabled { opacity: .4; cursor: not-allowed; }

  .cj-btn-next {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 26px; border-radius: 9px; background: var(--accent); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 600;
    border: none; cursor: pointer; transition: background .15s;
  }
  .cj-btn-next:hover { background: var(--accent-h); }

  .cj-btn-submit {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 28px; border-radius: 9px; background: var(--accent); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 700;
    border: none; cursor: pointer; transition: background .15s;
  }
  .cj-btn-submit:hover:not(:disabled) { background: var(--accent-h); }
  .cj-btn-submit:disabled { opacity: .6; cursor: not-allowed; }

  .cj-spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,.35); border-top-color: #fff;
    animation: cj-spin .65s linear infinite; flex-shrink: 0;
  }
  @keyframes cj-spin { to { transform: rotate(360deg); } }

  /* ── TOAST ── */
  .cj-toast-wrap {
    position: fixed; bottom: 24px; right: 24px; z-index: 300;
    display: flex; flex-direction: column; gap: 10px; pointer-events: none;
  }
  .cj-toast {
    min-width: 280px; max-width: 380px; padding: 14px 18px;
    border-radius: 10px; border: 1px solid var(--border-s);
    background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,.12);
    display: flex; align-items: flex-start; gap: 12px;
    animation: cj-toast-in .25s ease; pointer-events: auto;
  }
  .cj-toast.error   { border-color: #fecaca; background: #fff5f5; }
  .cj-toast.success { border-color: #bbf7d0; background: #f0fff4; }
  @keyframes cj-toast-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .cj-toast-icon { width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .cj-toast-icon.info    { background: var(--accent-lt); color: var(--accent); }
  .cj-toast-icon.success { background: #dcfce7; color: #16a34a; }
  .cj-toast-icon.error   { background: #fee2e2; color: #dc2626; }
  .cj-toast-title { font-size: 13px; font-weight: 700; color: var(--t1); line-height: 1.3; }
  .cj-toast-desc  { font-size: 12px; color: var(--t3); margin-top: 2px; line-height: 1.5; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .cj-page     { padding: 18px 16px; }
    .cj-header   { padding: 0 16px; }
    .cj-grid     { grid-template-columns: 1fr; }
    .cj-form-card{ padding: 20px 18px; }
    .cj-step-title { font-size: 10px; }
  }
`

interface ToastItem { id: number; title: string; desc?: string; type: 'info' | 'success' | 'error' }

export default function CreateJobOpeningForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    job_title: "",
    designation: "",
    description: "",
    currency: "INR",
    lower_range: "",
    upper_range: "",
    publish_salary_range: false,
    company: "",
    employment_type: "",
    department: "",
    location: "",
    publish_on_website: false,
    posted_on: new Date().toISOString().split("T")[0],
    closes_on: "",
    status: "Open",
    salary_per: "Month",
  })

  const [options, setOptions] = useState({
    companies: [] as string[],
    departments: [] as string[],
    employment_types: [] as string[],
    designations: [] as string[],
    locations: [] as string[],
    statuses: [] as string[],
    currencies: [] as string[],
    salary_periods: [] as string[],
  })

  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const router = useRouter()

  const showToast = (title: string, desc?: string, type: ToastItem['type'] = 'info') => {
    const id = Date.now()
    setToasts(t => [...t, { id, title, desc, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4500)
  }

  const steps = [
    { id: 1, title: "Job Details", icon: <Briefcase size={18} />, iconColor: "" },
    { id: 2, title: "Company Info", icon: <Building size={18} />, iconColor: "emerald" },
    { id: 3, title: "Requirements", icon: <FileText size={18} />, iconColor: "purple" },
    { id: 4, title: "Compensation", icon: <DollarSign size={18} />, iconColor: "green" },
  ]

  /* ── ALL ORIGINAL LOGIC UNCHANGED ─────────────────── */
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [companiesRes, departmentsRes, employmentTypesRes, designationsRes, locationsRes, docTypeRes, currenciesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/resource/Company?fields=["name"]`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }),
          fetch(`${API_BASE_URL}/api/resource/Department?fields=["name"]`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }),
          fetch(`${API_BASE_URL}/api/resource/Employment Type?fields=["name"]`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }),
          fetch(`${API_BASE_URL}/api/resource/Designation?fields=["name"]`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }),
          fetch(`${API_BASE_URL}/api/resource/Cost Center?fields=["name"]&filters=[["Cost Center","is_group","=",0]]&limit_page_length=0`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }),
          fetch(`${API_BASE_URL}/api/resource/DocType/Job Opening`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }),
          fetch(`${API_BASE_URL}/api/resource/Currency?fields=["name"]&limit_page_length=999`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }),
        ])
        const companies = await companiesRes.json()
        const departments = await departmentsRes.json()
        const employment_types = await employmentTypesRes.json()
        const designations = await designationsRes.json()
        const locations = await locationsRes.json()
        const docTypeData = await docTypeRes.json()
        const currencies = await currenciesRes.json()

        const fields = docTypeData.data?.fields || []
        const statusField = fields.find((f: any) => f.fieldname === 'status')
        const statusOptions = statusField?.options ? statusField.options.split('\n').filter(Boolean) : ['Open', 'Closed']
        const salaryPerField = fields.find((f: any) => f.fieldname === 'salary_per')
        const salaryPerOpts = salaryPerField?.options ? salaryPerField.options.split('\n').filter(Boolean) : ['Month', 'Year']

        console.log("DocType Data:", docTypeData)
        console.log("Currencies Data:", currencies)
        console.log("Status Options:", statusOptions)
        console.log("Salary Period Options:", salaryPerOpts)

        setOptions({
          companies: companies.data.map((d: any) => d.name),
          departments: departments.data.map((d: any) => d.name),
          employment_types: employment_types.data.map((d: any) => d.name),
          designations: designations.data.map((d: any) => d.name),
          locations: locations.data.map((d: any) => d.name),
          statuses: statusOptions,
          currencies: currencies.data.map((c: any) => c.name),
          salary_periods: salaryPerOpts,
        })
        showToast("Data Loaded Successfully", "All dropdown options have been loaded.", "success")
      } catch (err) {
        console.error("Error fetching dropdowns", err)
        showToast("Failed to Load Data", "Could not load dropdown options. Please refresh the page.", "error")
      }
    }
    fetchOptions()
  }, [])

  useEffect(() => { document.title = 'Create Job' }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const handleSelect = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.job_title.trim()) { showToast("Job Title Required", "Please enter a job title to continue.", "error"); return false }
        if (!formData.designation) { showToast("Designation Required", "Please select a designation to continue.", "error"); return false }
        return true
      case 2:
        if (!formData.company) { showToast("Company Required", "Please select a company to continue.", "error"); return false }
        if (!formData.location) { showToast("Work Location Required", "Please select a work location to continue.", "error"); return false }
        if (!formData.employment_type) { showToast("Employment Type Required", "Please select an employment type to continue.", "error"); return false }
        return true
      case 3:
        if (!formData.description.trim()) { showToast("Job Description Required", "Please provide a detailed job description.", "error"); return false }
        return true
      case 4:
        if (!formData.lower_range || !formData.upper_range) { showToast("Salary Range Required", "Please provide both minimum and maximum salary.", "error"); return false }
        const lo = Number.parseFloat(formData.lower_range)
        const hi = Number.parseFloat(formData.upper_range)
        if (isNaN(lo) || lo <= 0) { showToast("Invalid Minimum Salary", "Minimum salary must be a positive number.", "error"); return false }
        if (isNaN(hi) || hi <= 0) { showToast("Invalid Maximum Salary", "Maximum salary must be a positive number.", "error"); return false }
        if (lo >= hi) { showToast("Invalid Salary Range", "Minimum salary must be less than maximum salary.", "error"); return false }
        if (formData.closes_on && formData.closes_on <= formData.posted_on) { showToast("Invalid Application Deadline", "Application deadline must be after the posting date.", "error"); return false }
        return true
      default: return true
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(steps.length, currentStep + 1))
      showToast("Step Completed", `${steps[currentStep - 1].title} information saved successfully.`, "success")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return
    setLoading(true)
    showToast("Creating Job Opening", "Please wait while we process your request...")
    const payload = {
      ...formData,
      lower_range: formData.lower_range ? Number.parseFloat(formData.lower_range) : undefined,
      upper_range: formData.upper_range ? Number.parseFloat(formData.upper_range) : undefined,
      closes_on: formData.closes_on || undefined,
      status: formData.status,
      salary_per: formData.salary_per,
    }
    try {
      const csrfToken = await getFrappeCSRF()
      const res = await fetch(`${API_BASE_URL}/api/method/resume.api.job_opening.create_job_opening`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json', "X-Frappe-CSRF-Token": csrfToken },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      console.log("API Response:", data)
      if (data?.message?.success === false) throw new Error(data.message.message || "Failed to create job opening")
      if (data?.success === false) throw new Error(data.message || "Failed to create job opening")

      showToast("🎉 Job Opening Created Successfully!", `"${formData.job_title}" has been posted. Redirecting to job list...`, "success")
      setFormData({
        job_title: "", designation: "", description: "", currency: "INR",
        lower_range: "", upper_range: "", publish_salary_range: false,
        company: "", employment_type: "", department: "", location: "",
        publish_on_website: false,
        posted_on: new Date().toISOString().split("T")[0],
        closes_on: "", status: "Open", salary_per: "Month",
      })
      setCurrentStep(1)
      setTimeout(() => { router.push('/job-opening') }, 1500)
    } catch (err: any) {
      console.error("Create job failed:", err)
      showToast("❌ Failed to Create Job Opening", err.message || "An unexpected error occurred.", "error")
    } finally {
      setLoading(false)
    }
  }
  /* ─────────────────────────────────────────────────── */

  const getStepStatus = (id: number) => id < currentStep ? "done" : id === currentStep ? "current" : "pending"

  const sidebarPipeline = [
    { id: "job-opening", title: "Job Opening", icon: <Briefcase size={15} />, href: "/job-opening" },
    { id: "resume", title: "Resume Collection", icon: <Upload size={15} />, href: "/upload-resumes" },
    { id: "candidates", title: "Candidates", icon: <Users size={15} />, href: "/candidates" },
    { id: "interview", title: "Interview Scheduling", icon: <Calendar size={15} />, href: "/interview" },
  ]
  const sidebarClosing = [
    { id: "feedback", title: "Candidate Feedback", icon: <MessageSquare size={15} />, href: "/feedback" },
    { id: "doc-verify", title: "Document Verification", icon: <FileText size={15} />, href: "/document-verify-list" },
    { id: "offer", title: "Offer Letter", icon: <Zap size={15} />, href: "/offer-list" },
    { id: "appointment", title: "Appointment Letter", icon: <UserCheck size={15} />, href: "/letter-appointment" },
  ]

  const renderStep = () => {
    switch (currentStep) {

      /* ─── STEP 1: Job Details ─── */
      case 1: return (
        <>
          <div className="cj-step-head">
            <div className="cj-step-icon-wrap"><Sparkles size={26} /></div>
            <p className="cj-step-head-title">Let's Create Something Amazing</p>
            <p className="cj-step-head-sub">Start by defining the core details of your job opening</p>
          </div>
          <div className="cj-grid">
            <div className="cj-field">
              {/* <label className="cj-label"><Briefcase size={13} /> Job Title</label> */}
              <label className="cj-label"><Briefcase size={13} /> Job Title <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
              <input className="cj-input" name="job_title" value={formData.job_title}
                onChange={handleChange} placeholder="e.g., Senior Full Stack Developer" required />
            </div>
            <div className="cj-field">
              {/* <label className="cj-label"><Users size={13} /> Designation</label> */}
              <label className="cj-label"><Users size={13} /> Designation <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
              <div className="cj-select-wrap">
                <select className="cj-select" value={formData.designation}
                  onChange={e => handleSelect("designation", e.target.value)}>
                  <option value="">Select Designation</option>
                  {options.designations.length === 0 && <option value="" disabled>No designations available</option>}
                  {options.designations.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronRight size={14} className="cj-select-chevron" />
              </div>
            </div>
            <div className="cj-field">
              <label className="cj-label"><AlertCircle size={13} /> Status</label>
              <div className="cj-select-wrap">
                <select className="cj-select" value={formData.status}
                  onChange={e => handleSelect("status", e.target.value)}>
                  {options.statuses.length === 0 && <option value="">Loading statuses...</option>}
                  {options.statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronRight size={14} className="cj-select-chevron" />
              </div>
            </div>
            <div className="cj-field">
              {/* <label className="cj-label"><Calendar size={13} /> Application Deadline</label> */}
              <label className="cj-label"><Calendar size={13} /> Application Deadline <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
              <input className="cj-input" type="date" name="closes_on"
                value={formData.closes_on} onChange={handleChange}
                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                min={formData.posted_on} max="9999-12-31" />
            </div>
          </div>
        </>
      )

      /* ─── STEP 2: Company Info ─── */
      case 2: return (
        <>
          <div className="cj-step-head">
            <div className="cj-step-icon-wrap emerald"><Building size={26} /></div>
            <p className="cj-step-head-title">Company & Location Details</p>
            <p className="cj-step-head-sub">Define where and how your team will work</p>
          </div>
          <div className="cj-grid">
            <div className="cj-field">
              {/* <label className="cj-label"><Building size={13} /> Company</label> */}
              <label className="cj-label"><Building size={13} /> Company <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
              <div className="cj-select-wrap">
                <select className="cj-select" value={formData.company}
                  onChange={e => handleSelect("company", e.target.value)}>
                  <option value="">Select Company</option>
                  {options.companies.length === 0 && <option value="" disabled>No companies available</option>}
                  {options.companies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronRight size={14} className="cj-select-chevron" />
              </div>
            </div>
            <div className="cj-field">
              <label className="cj-label"><Users size={13} /> Department</label>
              <div className="cj-select-wrap">
                <select className="cj-select" value={formData.department}
                  onChange={e => handleSelect("department", e.target.value)}>
                  <option value="">Select Department</option>
                  {options.departments.length === 0 && <option value="" disabled>No departments available</option>}
                  {options.departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronRight size={14} className="cj-select-chevron" />
              </div>
            </div>
            <div className="cj-field">
              {/* <label className="cj-label"><MapPin size={13} /> Work Location</label> */}
              <label className="cj-label"><MapPin size={13} /> Work Location <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
              <div className="cj-select-wrap">
                <select className="cj-select" value={formData.location}
                  onChange={e => handleSelect("location", e.target.value)}>
                  <option value="">Select Location</option>
                  {options.locations.length === 0 && <option value="" disabled>No locations available</option>}
                  {options.locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronRight size={14} className="cj-select-chevron" />
              </div>
            </div>
            <div className="cj-field">
              {/* <label className="cj-label"><Clock size={13} /> Employment Type</label> */}
              <label className="cj-label"><Clock size={13} /> Employment Type <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
              <div className="cj-select-wrap">
                <select className="cj-select" value={formData.employment_type}
                  onChange={e => handleSelect("employment_type", e.target.value)}>
                  <option value="">Select Employment Type</option>
                  {options.employment_types.length === 0 && <option value="" disabled>No employment types available</option>}
                  {options.employment_types.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <ChevronRight size={14} className="cj-select-chevron" />
              </div>
            </div>
          </div>
        </>
      )

      /* ─── STEP 3: Requirements ─── */
      case 3: return (
        <>
          <div className="cj-step-head">
            <div className="cj-step-icon-wrap purple"><FileText size={26} /></div>
            <p className="cj-step-head-title">Job Requirements</p>
            <p className="cj-step-head-sub">Describe what you're looking for in detail</p>
          </div>
          <div className="cj-field">
            {/* <label className="cj-label" style={{ fontSize: 13, marginBottom: 4 }}>Job Description</label> */}
            <label className="cj-label" style={{ fontSize: 13, marginBottom: 4 }}>Job Description <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
            <textarea className="cj-textarea" name="description" value={formData.description}
              onChange={handleChange} rows={12}
              placeholder="Describe the role, responsibilities, qualifications, and what makes this opportunity exciting..." />
            <p className="cj-hint">
              💡 Tip: Include key responsibilities, required skills, experience level, and company culture highlights
            </p>
          </div>
        </>
      )

      /* ─── STEP 4: Compensation ─── */
      case 4: return (
        <>
          <div className="cj-step-head">
            <div className="cj-step-icon-wrap green"><DollarSign size={26} /></div>
            <p className="cj-step-head-title">Compensation Package</p>
            <p className="cj-step-head-sub">Define the salary range and benefits</p>
          </div>
          <div className="cj-grid">
            <div className="cj-field">
              <label className="cj-label"><DollarSign size={13} /> Currency</label>
              <div className="cj-select-wrap">
                <select className="cj-select" value={formData.currency}
                  onChange={e => handleSelect("currency", e.target.value)}>
                  {options.currencies.length === 0
                    ? <option value="">Loading currencies...</option>
                    : options.currencies.map(c => <option key={c} value={c}>{c}</option>)
                  }
                </select>
                <ChevronRight size={14} className="cj-select-chevron" />
              </div>
            </div>
            <div className="cj-field">
              <label className="cj-label"><Clock size={13} /> Salary Period</label>
              <div className="cj-select-wrap">
                <select className="cj-select" value={formData.salary_per}
                  onChange={e => handleSelect("salary_per", e.target.value)}>
                  {options.salary_periods.length === 0
                    ? <option value="">Loading periods...</option>
                    : options.salary_periods.map(p => <option key={p} value={p}>{p}</option>)
                  }
                </select>
                <ChevronRight size={14} className="cj-select-chevron" />
              </div>
            </div>
            <div className="cj-field">
              <label className="cj-label"><DollarSign size={13} /> Minimum Salary</label>
              <input className="cj-input" type="number" name="lower_range"
                value={formData.lower_range} onChange={handleChange}
                placeholder="0" min="0" step="1000" required />
            </div>
            <div className="cj-field">
              <label className="cj-label"><DollarSign size={13} /> Maximum Salary</label>
              <input className="cj-input" type="number" name="upper_range"
                value={formData.upper_range} onChange={handleChange}
                placeholder="0" min="0" step="1000" required />
            </div>
          </div>

          {formData.lower_range && formData.upper_range && (
            <div className="cj-salary-preview">
              <p className="cj-salary-preview-label">Salary Range Preview</p>
              <p className="cj-salary-preview-val">
                {formData.currency} {Number(formData.lower_range).toLocaleString()} – {Number(formData.upper_range).toLocaleString()}
              </p>
              <p className="cj-salary-preview-per">per {formData.salary_per.toLowerCase()}</p>
            </div>
          )}
        </>
      )

      default: return null
    }
  }

  return (
    <>
      <style>{css}</style>
      <div className="cj">
        <div className="cj-wrap">

          {/* Overlay — mobile only */}
          <div className={`cj-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

          {/* ══ SIDEBAR ══ */}
          <aside className={`cj-sb${sidebarOpen ? " open" : ""}`}>
            <div className="cj-sb-brand">
              <div className="cj-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
              <div>
                <div className="cj-sb-name">Job Management</div>
                <div className="cj-sb-sub">HR Platform</div>
              </div>
              <button className="cj-sb-close" onClick={() => setSidebarOpen(false)} title="Close"><X size={15} /></button>
            </div>
            <nav className="cj-nav">
              <Link href="/create-job" className="cj-nav-cta"><Plus size={14} /> New Job Opening</Link>
              <div className="cj-nav-lbl">Pipeline</div>
              {sidebarPipeline.map(s => (
                <Link key={s.id} href={s.href} className="cj-nav-link">{s.icon} {s.title}</Link>
              ))}
              <div className="cj-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
              {sidebarClosing.map(s => (
                <Link key={s.id} href={s.href} className="cj-nav-link">{s.icon} {s.title}</Link>
              ))}
            </nav>
            <div className="cj-sb-foot">
              <button className="cj-logout"><LogOut size={15} /> Sign out</button>
            </div>
          </aside>

          {/* ══ MAIN ══ */}
          <div className="cj-main">

            {/* Header */}
            <header className="cj-header">
              <button className="cj-toggle" onClick={() => setSidebarOpen(o => !o)} title="Toggle sidebar">
                <Menu size={16} />
              </button>
              <div className="cj-hdr-sep" />
              <Link href="/" className="cj-btn-out"><ArrowLeft size={13} /> Back</Link>
              <div className="cj-hdr-sep" />
              {/* <div className="cj-crumb">
                <Home size={13} /> Home
                <ChevronRight size={13} />
                <Link href="/job-opening">Job Openings</Link>
                <ChevronRight size={13} />
                <strong>Create Job Opening</strong>
              </div> */}
              <div className="cj-crumb">
                <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'inherit', textDecoration: 'none' }}>
                  <Home size={13} /> Home
                </Link>
                <ChevronRight size={13} />
                <Link href="/job-opening">Job Openings</Link>
                <ChevronRight size={13} />
                <strong>Create Job Opening</strong>
              </div>
            </header>

            {/* Page content */}
            <div className="cj-page">
              <div>
                <h1 className="cj-page-title">Create Job Opening</h1>
                <p className="cj-page-sub">Build your perfect job posting step by step</p>
              </div>

              {/* ── Progress card ── */}
              <div className="cj-progress-card">
                <div className="cj-progress-head">
                  <span className="cj-progress-label">Creation Progress</span>
                  <span className="cj-step-badge">Step {currentStep} of {steps.length}</span>
                </div>
                <div className="cj-progress-track">
                  <div className="cj-progress-fill" style={{ width: `${(currentStep / steps.length) * 100}%` }} />
                </div>
                <div className="cj-steps">
                  {steps.map((step, idx) => {
                    const status = getStepStatus(step.id)
                    return (
                      <div key={step.id} className="cj-step-row"
                        style={{ flex: idx < steps.length - 1 ? 1 : 'none' }}>
                        <div className="cj-step-item">
                          <div className={`cj-step-circle ${status}`}>
                            {status === 'done' ? <CheckCircle size={18} /> : step.icon}
                          </div>
                          <span className={`cj-step-title ${status}`}>{step.title}</span>
                        </div>
                        {idx < steps.length - 1 && (
                          <div className={`cj-step-connector${status === 'done' ? " done" : ""}`} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ── Form card ── */}
              <div className="cj-form-card">
                <form onSubmit={handleSubmit}>
                  {renderStep()}
                  <div className="cj-form-footer">
                    <button type="button" className="cj-btn-prev"
                      onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
                      disabled={currentStep === 1}>
                      <ArrowLeft size={14} /> Previous
                    </button>
                    {currentStep < steps.length ? (
                      <button type="button" className="cj-btn-next" onClick={handleNextStep}>
                        Next Step <ChevronRight size={14} />
                      </button>
                    ) : (
                      <button type="submit" className="cj-btn-submit" disabled={loading}>
                        {loading
                          ? <><div className="cj-spinner" /> Creating…</>
                          : <><CheckCircle size={15} /> Create Job Opening</>
                        }
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>

        {/* Toast notifications */}
        <div className="cj-toast-wrap">
          {toasts.map(t => (
            <div key={t.id} className={`cj-toast ${t.type}`}>
              <div className={`cj-toast-icon ${t.type}`}>
                {t.type === 'success' ? <CheckCircle size={16} /> :
                  t.type === 'error' ? <AlertCircle size={16} /> :
                    <Sparkles size={16} />}
              </div>
              <div>
                <p className="cj-toast-title">{t.title}</p>
                {t.desc && <p className="cj-toast-desc">{t.desc}</p>}
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}
