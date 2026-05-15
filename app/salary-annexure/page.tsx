"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    ArrowLeft, FileText, Calendar, Briefcase, Building2,
    Plus, Trash2, User, CheckCircle2, AlertCircle,
    Menu, X, Home, ChevronRight, Upload, Users, MessageSquare,
    Zap, UserCheck, LogOut, DollarSign, Hash, RefreshCw, FileSpreadsheet,
} from "lucide-react"
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,
} from "@/components/ui/command"
import {
    Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { getFrappeCSRF } from "@/lib/csrf"
import * as XLSX from "xlsx"

const API_MODULE_PATH = "resume.api.salary_annexure"
const API_BASE_URL = "https://ats.vaaman.in"

// ─── Salary component name → form field mapping ───────────────────────────
// Maps Excel row labels (uppercase) → salary_component identifiers used in UI
// All known Excel label variants → canonical component name used in templates
// Add new aliases here whenever a new Excel format is encountered
// Maps any Excel label variant (uppercase) → canonical component name used in templates
// Add new variants here whenever a new Excel format is encountered
const COMPONENT_NAME_MAP: Record<string, string> = {
    // ── Section A — Standard allowances ──
    "BASIC SALARY": "BASIC SALARY",
    "HOUSE RENT ALLOWANCE": "HOUSE RENT ALLOWANCE",
    "HRA": "HOUSE RENT ALLOWANCE",
    "CONVEYANCE ALLOWANCE": "CONVEYANCE ALLOWANCE",
    "CONVEYANCE": "CONVEYANCE ALLOWANCE",
    "MOBILE-DATA CARD ALLOWANCE": "MOBILE-DATA CARD ALLOWANCE",
    "MOBILE DATA CARD ALLOWANCE": "MOBILE-DATA CARD ALLOWANCE",
    "MEDICAL ALLOWANCE": "MEDICAL ALLOWANCE",
    "CHILDREN EDUCATION ALLOWANCE": "CHILDREN EDUCATION ALLOWANCE",
    "CHILD EDUCATION ALLOWANCE": "CHILDREN EDUCATION ALLOWANCE",
    "UNIFORM WASHING ALLOWANCE": "UNIFORM WASHING ALLOWANCE",
    "LEAVE TRAVEL ALLOWANCE": "LEAVE TRAVEL ALLOWANCE",
    "LTA": "LEAVE TRAVEL ALLOWANCE",
    "LOCATION ALLOWANCE": "LOCATION ALLOWANCE",
    "PERSONAL ALLOWANCE": "PERSONAL ALLOWANCE",

    // ── Bonus / advance bonus — fresher Excel uses ADVANCE BONUS, regular uses BONUS @ ──
    "ADVANCE BONUS (@8.33%)": "ADVANCE BONUS (@8.33%)",
    "ADVANCE BONUS (@ 8.33%)": "ADVANCE BONUS (@8.33%)",
    "ADVANCE BONUS(@8.33%)": "ADVANCE BONUS (@8.33%)",
    "ADVANCE BONUS (8.33%)": "ADVANCE BONUS (@8.33%)",
    "ADVANCE BONUS @8.33%": "ADVANCE BONUS (@8.33%)",
    "BONUS @ 8.33% ON BASIC": "BONUS @ 8.33% ON BASIC",
    "BONUS @8.33% ON BASIC": "BONUS @ 8.33% ON BASIC",
    "BONUS@ 8.33% ON BASIC": "BONUS @ 8.33% ON BASIC",
    "BONUS 8.33% ON BASIC": "BONUS @ 8.33% ON BASIC",

    // ── Section B — PF (PROVIDEND is a common Excel typo for PROVIDENT) ──
    "PROVIDEND FUND EMPLOYER CONTRIBUTION": "PROVIDENT FUND EMPLOYER CONTRIBUTION",
    "PROVIDENT FUND EMPLOYER CONTRIBUTION": "PROVIDENT FUND EMPLOYER CONTRIBUTION",
    "PF EMPLOYER CONTRIBUTION": "PROVIDENT FUND EMPLOYER CONTRIBUTION",
    "PF CONTRIBUTION": "PROVIDENT FUND EMPLOYER CONTRIBUTION",
    "EMPLOYER PF CONTRIBUTION": "PROVIDENT FUND EMPLOYER CONTRIBUTION",

    // ── Section B — ESIC ──
    "ESIC EMPLOYER CONTRIBUTION": "ESIC EMPLOYER CONTRIBUTION",
    "ESIC CONTRIBUTION": "ESIC EMPLOYER CONTRIBUTION",

    // ── Section B — Gratuity ──
    "GRATUITY AFTER COMPLETION OF 5 YEARS": "GRATUITY AFTER COMPLETION OF 5 YEARS",
    "GRATUITY AFTER COMPLETION OF 5 YRS": "GRATUITY AFTER COMPLETION OF 5 YEARS",
    "GRATUITY": "GRATUITY AFTER COMPLETION OF 5 YEARS",
}

// Reverse map: canonical template name → all possible Excel labels (for matching in both directions)
// Built automatically from COMPONENT_NAME_MAP
function buildReverseMap(): Record<string, string[]> {
    const rev: Record<string, string[]> = {}
    for (const [excelLabel, canonical] of Object.entries(COMPONENT_NAME_MAP)) {
        if (!rev[canonical]) rev[canonical] = []
        if (!rev[canonical].includes(excelLabel)) rev[canonical].push(excelLabel)
    }
    return rev
}
const REVERSE_COMPONENT_MAP = buildReverseMap()

// Given a template component name and a valMap built from Excel,
// find the best matching value using direct lookup + reverse-map aliases + fuzzy fallback
function resolveValue(templateName: string, valMap: Record<string, number>): number {
    const key = templateName.toUpperCase().trim()

    // 1. Direct lookup by template name
    if (valMap[key] !== undefined && valMap[key] > 0) return valMap[key]

    // 2. Canonical name → look up all Excel aliases from the reverse map
    const canonical = COMPONENT_NAME_MAP[key] || key
    if (valMap[canonical] !== undefined && valMap[canonical] > 0) return valMap[canonical]
    const aliases = REVERSE_COMPONENT_MAP[canonical] || REVERSE_COMPONENT_MAP[key] || []
    for (const alias of aliases) {
        if (valMap[alias] !== undefined && valMap[alias] > 0) return valMap[alias]
    }

    // 3. Fuzzy: normalise both sides and compare
    const norm = (s: string) => s
        .replace(/PROVIDEND/g, "PROVIDENT")
        .replace(/[@()%]/g, " ")
        .replace(/\s+/g, " ").trim()
    const normKey = norm(key)
    for (const [vk, val] of Object.entries(valMap)) {
        if (val > 0 && norm(vk) === normKey) return val
    }
    // Partial fuzzy
    for (const [vk, val] of Object.entries(valMap)) {
        if (val > 0) {
            const normVk = norm(vk)
            if (normVk.includes(normKey) || normKey.includes(normVk)) return val
        }
    }

    return 0
}

// Normalise a component name for fuzzy matching:
// strips special chars, collapses spaces, fixes known typos/variants
const normaliseComponentName = (s: string): string =>
    s.toUpperCase()
        .replace(/PROVIDEND/g, "PROVIDENT")
        .replace(/ADVANCE BONUS.*?%[)]/g, "BONUS @ 8.33% ON BASIC")
        .replace(/BONUS\s*@\s*8\.33%/g, "BONUS @ 8.33%")
        .replace(/[()@]/g, " ")
        .replace(/\s+/g, " ")
        .trim()

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

  .sa-hint { display: flex; align-items: center; gap: 5px; font-size: 11.5px; color: var(--accent); margin-top: 4px; }
  .sa-hint svg { width: 12px; height: 12px; }
  .sa-hint.amber { color: var(--amber); }

  /* ══ ALERT BANNERS ══ */
  .sa-alert {
    border-radius: 10px; padding: 14px 16px; display: flex; align-items: flex-start; gap: 12px;
  }
  .sa-alert.blue { background: var(--accent-lt); border: 1px solid rgba(0,158,247,.25); }
  .sa-alert.green { background: var(--green-lt); border: 1px solid rgba(22,163,74,.25); }
  .sa-alert.amber { background: var(--amber-lt); border: 1px solid rgba(217,119,6,.25); }
  .sa-alert-icon { flex-shrink: 0; margin-top: 1px; }
  .sa-alert.blue .sa-alert-icon svg { color: var(--accent); width: 16px; height: 16px; }
  .sa-alert.green .sa-alert-icon svg { color: var(--green); width: 16px; height: 16px; }
  .sa-alert.amber .sa-alert-icon svg { color: var(--amber); width: 16px; height: 16px; }
  .sa-alert-title { font-size: 13px; font-weight: 700; color: var(--t1); }
  .sa-alert-sub { font-size: 11.5px; color: var(--t2); margin-top: 3px; }
  .sa-spin {
    width: 16px; height: 16px; border: 2px solid rgba(0,158,247,.25); border-top-color: var(--accent);
    border-radius: 50%; animation: sa-spin 1s linear infinite; flex-shrink: 0;
  }
  @keyframes sa-spin { to { transform: rotate(360deg); } }

  /* ══ UPLOAD ZONE ══ */
  .sa-upload-zone {
    border: 2px dashed var(--border); border-radius: 12px; padding: 24px 20px;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    background: var(--bg); cursor: pointer; transition: all .15s; text-align: center;
  }
  .sa-upload-zone:hover, .sa-upload-zone.drag-over {
    border-color: var(--accent); background: var(--accent-lt);
  }
  .sa-upload-zone-icon {
    width: 48px; height: 48px; border-radius: 12px;
    background: linear-gradient(135deg, rgba(0,158,247,.12), rgba(0,158,247,.06));
    border: 1px solid rgba(0,158,247,.2); display: flex; align-items: center; justify-content: center;
  }
  .sa-upload-zone-icon svg { color: var(--accent); }
  .sa-upload-zone-title { font-size: 13.5px; font-weight: 600; color: var(--t1); }
  .sa-upload-zone-sub { font-size: 12px; color: var(--t3); }
  .sa-upload-zone-btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 7px 16px;
    border-radius: 7px; background: var(--accent); color: #fff; border: none;
    font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer;
    transition: background .14s; margin-top: 4px;
  }
  .sa-upload-zone-btn:hover { background: var(--accent-h); }

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
  .sa-amount-input.excel-filled {
    background: #f0fdf4; border-color: rgba(22,163,74,.35); color: var(--green); font-weight: 600;
  }
  .sa-amount-wrap { position: relative; }
  .sa-amount-symbol {
    position: absolute; left: 9px; top: 50%; transform: translateY(-50%);
    font-size: 12px; font-weight: 600; color: var(--t3); pointer-events: none;
  }

  /* ══ TOTALS GRID ══ */
 .sa-totals-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr 1fr !important;
    gap: 0;
    background: linear-gradient(135deg, #f8fbff, #eef7ff);
    border-top: 1px solid var(--border-s);
}
.sa-total-item {
    padding: 18px 24px;
    border-bottom: 1px solid var(--border-s);
    border-right: 1px solid var(--border-s);
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.sa-total-item:nth-child(3n) { border-right: none; }
.sa-total-item.no-border { border-bottom: none; }
.sa-total-lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--t3); }
.sa-total-val { font-size: 15px; font-weight: 700; color: var(--t1); display: flex; align-items: center; gap: 4px; }
.sa-total-val.accent { color: var(--accent); }
.sa-total-val.green { color: var(--green); }
.sa-total-val.purple { color: var(--purple); }
.sa-total-divider { display: none; }

  /* ══ CONDITIONS ══ */
  .sa-cond-list { display: flex; flex-direction: column; gap: 0; }
  .sa-cond-row {
    display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px;
    border-bottom: 1px solid var(--border-s); transition: background .12s;
  }
  .sa-cond-row:last-child { border-bottom: none; }
  .sa-cond-row:hover { background: #f8fbff; }
  .sa-cond-row.deselected { opacity: 0.45; }

  /* Custom checkbox */
  .sa-checkbox {
    width: 18px; height: 18px; border-radius: 5px; border: 2px solid var(--border);
    background: var(--bg); cursor: pointer; flex-shrink: 0; margin-top: 2px;
    display: flex; align-items: center; justify-content: center; transition: all .14s;
  }
  .sa-checkbox.checked { background: var(--accent); border-color: var(--accent); }
  .sa-checkbox svg { color: #fff; width: 11px; height: 11px; }
  .sa-cond-num { font-size: 12px; font-weight: 600; color: var(--t3); min-width: 22px; margin-top: 2px; }
  .sa-cond-text-wrap { flex: 1; }
  .sa-cond-text { font-size: 13px; color: var(--t1); line-height: 1.55; }
  .sa-cond-text-input {
    width: 100%; padding: 8px 12px; border-radius: 7px; border: 1px solid var(--border);
    background: var(--bg); color: var(--t1); font-family: 'Inter', sans-serif; font-size: 13px;
    outline: none; resize: vertical; min-height: 60px; transition: all .15s; line-height: 1.5;
  }
  .sa-cond-text-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-lt); }
  .sa-cond-actions { display: flex; gap: 6px; align-items: flex-start; margin-top: 2px; }
  .sa-cond-del {
    width: 28px; height: 28px; border-radius: 6px; background: none; border: 1px solid transparent;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--t3); transition: all .14s;
  }
  .sa-cond-del:hover { background: var(--red-lt); border-color: rgba(220,38,38,.2); color: var(--red); }
  .sa-cond-del svg { width: 13px; height: 13px; }

  /* Add new condition */
  .sa-add-cond {
    display: flex; align-items: center; gap: 8px; padding: 12px 16px;
    border-top: 1px solid var(--border-s); background: #fafcff;
  }
  .sa-add-cond-input {
    flex: 1; height: 38px; padding: 0 12px; border-radius: 7px; border: 1px solid var(--border);
    background: #fff; color: var(--t1); font-family: 'Inter', sans-serif; font-size: 13px;
    outline: none; transition: all .15s;
  }
  .sa-add-cond-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-lt); }
  .sa-add-cond-input::placeholder { color: var(--t3); }
  .sa-add-cond-btn {
    display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 7px;
    background: var(--accent); color: #fff; border: none; font-family: 'Inter', sans-serif;
    font-size: 12.5px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: background .14s;
  }
  .sa-add-cond-btn:hover { background: var(--accent-h); }
  .sa-add-cond-btn svg { width: 13px; height: 13px; }

  /* select/deselect all */
  .sa-cond-toolbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 16px; border-bottom: 1px solid var(--border-s);
    background: linear-gradient(to right, #f8fbff, #eef7ff);
  }
  .sa-cond-sel-info { font-size: 12px; color: var(--t2); font-weight: 500; }
  .sa-cond-sel-info span { font-weight: 700; color: var(--accent); }
  .sa-cond-sel-btns { display: flex; gap: 8px; }
  .sa-sel-all-btn {
    font-size: 11.5px; font-weight: 600; color: var(--accent); background: none; border: none;
    cursor: pointer; padding: 3px 8px; border-radius: 5px; transition: background .12s;
  }
  .sa-sel-all-btn:hover { background: var(--accent-lt); }

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
    .sa-add-cond { flex-direction: column; }
    .sa-add-cond-input { width: 100%; }
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
    fromExcel?: boolean
}
interface ConditionRow {
    id: string
    condition_text: string
    selected: boolean
    isNew?: boolean
}

export default function SalaryAnnexurePage() {
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [form, setForm] = useState({
        jobApplicant: "",
        salaryComponentTemplate: "",
        conditionTemplate: "",
    })

    const [salaryComponents, setSalaryComponents] = useState<SalaryComponent[]>([])
    const [conditions, setConditions] = useState<ConditionRow[]>([])
    const [newCondText, setNewCondText] = useState("")
    const [excelFileName, setExcelFileName] = useState("")
    const [excelError, setExcelError] = useState("")
    const [isDragOver, setIsDragOver] = useState(false)

    const [totals, setTotals] = useState({
        subA_monthly: 0, subA_annual: 0,
        subB_monthly: 0, subB_annual: 0,
        total_monthly: 0, total_annual: 0,
    })

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

    useEffect(() => { recalcTotals(salaryComponents) }, [salaryComponents])

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
                fromExcel: false,
            })))
            setExcelFileName("")
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
            setConditions(rows.map((r: any, i: number) => ({
                id: Date.now().toString() + i,
                condition_text: r.condition_text,
                selected: true,
            })))
        } catch { setConditions([]) }
        finally { setLoadingCond(false) }
    }

    // ─── Parse uploaded Excel file ───────────────────────────────────────────
    const parseExcelFile = (file: File) => {
        setExcelError("")
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer)
                const wb = XLSX.read(data, { type: "array" })
                const ws = wb.Sheets[wb.SheetNames[0]]
                const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null })

                // Build a lookup: row label (uppercase) → monthly value
                // Captures ALL component rows across both Section A and Section B
                const valMap: Record<string, number> = {}
                let inComponents = false

                for (const row of rows) {
                    const label = String(row[0] || "").trim().toUpperCase()
                    const rawMonthly = row[1]
                    // Handle both numeric and string values (e.g. "-" for zero)
                    const monthly = (rawMonthly === null || rawMonthly === undefined || rawMonthly === "-" || rawMonthly === "")
                        ? 0
                        : parseFloat(String(rawMonthly).replace(/,/g, "")) || 0

                    // Start capturing after "SALARY COMPONENTS" header row
                    if (label === "SALARY COMPONENTS") { inComponents = true; continue }

                    // Skip SUB TOTAL rows but do NOT stop capturing — Section B follows SUB TOTAL (A)
                    if (label.startsWith("SUB TOTAL")) { continue }

                    // Stop only at the final TOTAL A + B row
                    if (label.startsWith("TOTAL A")) { inComponents = false; break }

                    if (inComponents && label) {
                        if (monthly > 0) {
                            // Store under the raw Excel label
                            valMap[label] = monthly
                            // Also store under the canonical name so template lookup finds it directly
                            const canonical = COMPONENT_NAME_MAP[label] || label
                            valMap[canonical] = monthly
                            // Also store under all known reverse-map aliases for this canonical name
                            const aliases = REVERSE_COMPONENT_MAP[canonical] || []
                            for (const alias of aliases) { valMap[alias] = monthly }
                        }
                    }
                }

                if (Object.keys(valMap).length === 0) {
                    setExcelError("Could not read salary values from this Excel file. Please ensure it follows the standard Annexure format.")
                    return
                }

                // Apply values to current salary components
                setSalaryComponents(prev => {
                    if (prev.length === 0) {
                        // No template selected yet — build components from Excel
                        const newComps: SalaryComponent[] = []
                        let inC = false
                        let inB = false

                        for (const row of rows) {
                            const label = String(row[0] || "").trim().toUpperCase()
                            const rawM = row[1]
                            const monthly = (rawM === null || rawM === undefined || rawM === "-" || rawM === "")
                                ? 0 : parseFloat(String(rawM).replace(/,/g, "")) || 0

                            if (label === "SALARY COMPONENTS") { inC = true; inB = false; continue }
                            // Switch to Section B on SUB TOTAL A — do NOT stop
                            if (label === "SUB TOTAL - (A)" || label === "SUB TOTAL (A)" || label === "SUB TOTAL-(A)") { inB = true; continue }
                            // Skip other SUB TOTAL rows (like SUB TOTAL B) without stopping
                            if (label.startsWith("SUB TOTAL")) { continue }
                            // Stop only at the grand total row
                            if (label.startsWith("TOTAL A")) { inC = false; break }

                            if (inC && label) {
                                newComps.push({
                                    id: Date.now().toString() + Math.random(),
                                    salary_component: COMPONENT_NAME_MAP[label] || label.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" "),
                                    section: inB ? "B" : "A",
                                    monthly,
                                    annualized: monthly * 12,
                                    fromExcel: monthly > 0,
                                })
                            }
                        }
                        return newComps
                    }

                    // Template already loaded — update monthly values using resolveValue
                    return prev.map(c => {
                        const val = resolveValue(c.salary_component, valMap)
                        return val > 0
                            ? { ...c, monthly: val, annualized: val * 12, fromExcel: true }
                            : { ...c, fromExcel: false }
                    })
                })

                setExcelFileName(file.name)
            } catch (err) {
                setExcelError("Failed to parse Excel file. Please check the file format.")
            }
        }
        reader.readAsArrayBuffer(file)
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) parseExcelFile(file)
        e.target.value = ""
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        const file = e.dataTransfer.files?.[0]
        if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) parseExcelFile(file)
        else setExcelError("Please upload a valid Excel file (.xlsx or .xls)")
    }

    // ─── Condition helpers ────────────────────────────────────────────────────
    const toggleCondition = (id: string) => {
        setConditions(prev => prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c))
    }

    const deleteCondition = (id: string) => {
        setConditions(prev => prev.filter(c => c.id !== id))
    }

    const addNewCondition = () => {
        const text = newCondText.trim()
        if (!text) return
        setConditions(prev => [...prev, {
            id: Date.now().toString(),
            condition_text: text,
            selected: true,
            isNew: true,
        }])
        setNewCondText("")
    }

    const selectAll = () => setConditions(prev => prev.map(c => ({ ...c, selected: true })))
    const deselectAll = () => setConditions(prev => prev.map(c => ({ ...c, selected: false })))
    const selectedCount = conditions.filter(c => c.selected).length

    const updateMonthly = (id: string, value: string) => {
        const parsed = parseFloat(value) || 0
        const monthly = parsed < 0 ? 0 : parsed
        setSalaryComponents(prev => prev.map(c =>
            c.id === id ? { ...c, monthly, annualized: monthly * 12, fromExcel: false } : c
        ))
    }

    const formatCurrency = (n: number) =>
        n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const resetForm = () => {
        setForm({ jobApplicant: "", salaryComponentTemplate: "", conditionTemplate: "" })
        setSalaryComponents([])
        setConditions([])
        setExcelFileName("")
        setExcelError("")
        setNewCondText("")
        setTotals({ subA_monthly: 0, subA_annual: 0, subB_monthly: 0, subB_annual: 0, total_monthly: 0, total_annual: 0 })
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
                // Only send selected conditions
                conditions: conditions.filter(c => c.selected).map(c => ({ condition_text: c.condition_text })),
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
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                onChange={handleFileInput}
            />

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
                            <div className="sa-nav-lbl">General</div>
                            <Link href="/home" className="sa-nav-link">
                                <Home size={15} /> Home
                            </Link>
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
                            <button className="sa-back-btn" onClick={() => router.back()}><ArrowLeft size={14} /> Back</button>
                            <div className="sa-hdr-sep" />
                            {/* <div className="sa-crumb">
                                <Home size={13} /> Home <ChevronRight size={13} />
                                <Link href="/salary-annexure-list" style={{ color: 'var(--t3)', textDecoration: 'none' }}>Salary Annexure</Link>
                                <ChevronRight size={13} /> <strong>Create Salary Annexure</strong>
                            </div> */}
                            <div className="sa-crumb">
                                <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'inherit', textDecoration: 'none' }}>
                                    <Home size={13} /> Home
                                </Link>
                                <ChevronRight size={13} />
                                <Link href="/salary-annexure-list" style={{ color: 'var(--t3)', textDecoration: 'none' }}>Salary Annexure</Link>
                                <ChevronRight size={13} />
                                <strong>Create Salary Annexure</strong>
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

                                {/* ── EXCEL UPLOAD CARD ── */}
                                <div className="sa-card">
                                    <div className="sa-card-head">
                                        <div className="sa-card-head-left">
                                            <div className="sa-card-head-icon" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                                                <FileSpreadsheet size={16} />
                                            </div>
                                            <span className="sa-card-title">Import from Excel</span>
                                        </div>
                                        {/* {excelFileName && (
                                            <span className="sa-badge green">
                                                <Check size={11} style={{ marginRight: 4 }} /> {excelFileName}
                                            </span>
                                        )} */}

                                        {excelFileName && (
                                            <span className="sa-badge green" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Check size={11} /> {excelFileName}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setExcelFileName(""); setExcelError(""); setSalaryComponents(prev => prev.map(c => ({ ...c, monthly: 0, annualized: 0, fromExcel: false }))); }}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--green)', padding: 0, marginLeft: 2 }}
                                                    title="Remove uploaded file"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        )}

                                    </div>
                                    <div className="sa-card-body">
                                        {/* Upload zone */}
                                        <div
                                            className={`sa-upload-zone${isDragOver ? " drag-over" : ""}`}
                                            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                                            onDragLeave={() => setIsDragOver(false)}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <div className="sa-upload-zone-icon">
                                                <FileSpreadsheet size={22} />
                                            </div>
                                            <div className="sa-upload-zone-title">
                                                {/* {excelFileName ? `Loaded: ${excelFileName}` : "Upload Salary Annexure Excel"} */}
                                                {excelFileName ? `Loaded: ${excelFileName}` : "Upload Salary Annexure Excel"}

                                            </div>
                                            <div className="sa-upload-zone-sub">
                                                Drag & drop your Annexure .xlsx file here, or click to browse
                                            </div>
                                            <button
                                                className="sa-upload-zone-btn"
                                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                                            >
                                                <Upload size={13} /> Choose Excel File
                                            </button>

                                            {excelFileName && (
                                                <button
                                                    className="sa-btn-cancel"
                                                    style={{ marginTop: 4, fontSize: 12, padding: '6px 14px' }}
                                                    onClick={(e) => { e.stopPropagation(); setExcelFileName(""); setExcelError(""); setSalaryComponents(prev => prev.map(c => ({ ...c, monthly: 0, annualized: 0, fromExcel: false }))); }}
                                                >
                                                    <X size={12} /> Clear & Replace
                                                </button>
                                            )}
                                        </div>

                                        {/* Error */}
                                        {excelError && (
                                            <div className="sa-alert amber" style={{ marginTop: 14 }}>
                                                <div className="sa-alert-icon"><AlertCircle size={16} /></div>
                                                <div>
                                                    <div className="sa-alert-title">Import Error</div>
                                                    <div className="sa-alert-sub">{excelError}</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Success */}
                                        {excelFileName && !excelError && (
                                            <div className="sa-alert green" style={{ marginTop: 14 }}>
                                                <div className="sa-alert-icon"><CheckCircle2 size={16} /></div>
                                                <div>
                                                    <div className="sa-alert-title">Excel imported successfully</div>
                                                    <div className="sa-alert-sub">
                                                        Salary values have been auto-filled from <strong>{excelFileName}</strong>.
                                                        Green-highlighted fields were populated from the file. You can still edit them manually.
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: 'var(--accent-lt)', border: '1px solid rgba(0,158,247,.15)' }}>
                                            <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.6 }}>
                                                <strong>How it works:</strong> Upload the standard Annexure-1 Excel file (regular or fresher format).
                                                The system will automatically map salary component values to the table below.
                                                If a Salary Component Template is already selected, only matching components will be filled.
                                                Otherwise, all components from the Excel will be loaded.
                                            </p>
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
                                        {excelFileName && salaryComponents.some(c => c.fromExcel) && (
                                            <span style={{ fontSize: 11.5, color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                                                <FileSpreadsheet size={13} />
                                                {salaryComponents.filter(c => c.fromExcel).length} values from Excel
                                            </span>
                                        )}
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
                                            <p className="sa-empty-sub">Select a Salary Component Template above, or upload an Excel file to auto-load components</p>
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
                                                                <td className="sa-table-comp">
                                                                    {comp.salary_component}
                                                                    {comp.fromExcel && (
                                                                        <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 600, color: 'var(--green)', background: 'var(--green-lt)', padding: '1px 6px', borderRadius: 4, border: '1px solid rgba(22,163,74,.2)' }}>
                                                                            Excel
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <span className={`sa-section-badge ${comp.section}`}>{comp.section}</span>
                                                                </td>
                                                                <td>
                                                                    <div className="sa-amount-wrap">
                                                                        <span className="sa-amount-symbol">₹</span>
                                                                        <input
                                                                            className={`sa-amount-input${comp.fromExcel ? " excel-filled" : ""}`}
                                                                            type="number"
                                                                            min="0"
                                                                            step="0.01"
                                                                            value={comp.monthly || ""}
                                                                            onChange={e => updateMonthly(comp.id, e.target.value)}
                                                                            onKeyDown={e => e.key === '-' && e.preventDefault()}
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
                                                {/* Row 1 */}
                                                <div className="sa-total-item">
                                                    <div className="sa-total-lbl">Sub Total (A) Monthly</div>
                                                    <div className="sa-total-val accent">₹ {formatCurrency(totals.subA_monthly)}</div>
                                                </div>
                                                <div className="sa-total-item">
                                                    <div className="sa-total-lbl">Sub Total (A) Annualized</div>
                                                    <div className="sa-total-val accent">₹ {formatCurrency(totals.subA_annual)}</div>
                                                </div>
                                                <div className="sa-total-item">
                                                    <div className="sa-total-lbl">Sub Total (B) Monthly</div>
                                                    <div className="sa-total-val purple">₹ {formatCurrency(totals.subB_monthly)}</div>
                                                </div>

                                                {/* Row 2 */}
                                                <div className="sa-total-item no-border">
                                                    <div className="sa-total-lbl">Sub Total (B) Annualized</div>
                                                    <div className="sa-total-val purple">₹ {formatCurrency(totals.subB_annual)}</div>
                                                </div>
                                                <div className="sa-total-item no-border">
                                                    <div className="sa-total-lbl">Total A + B Monthly</div>
                                                    <div className="sa-total-val green">₹ {formatCurrency(totals.total_monthly)}</div>
                                                </div>
                                                <div className="sa-total-item no-border">
                                                    <div className="sa-total-lbl">Total A + B Annualized</div>
                                                    <div className="sa-total-val green">₹ {formatCurrency(totals.total_annual)}</div>
                                                </div>
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
                                                    {selectedCount}/{conditions.length} selected
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
                                                    <CheckCircle2 size={12} /> Conditions loaded — use checkboxes below to choose which to include
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
                                        <>
                                            <div className="sa-empty" style={{ paddingTop: 24, paddingBottom: 16 }}>
                                                <FileText size={36} style={{ color: 'var(--t3)' }} />
                                                <p className="sa-empty-title">No conditions added</p>
                                                <p className="sa-empty-sub">Select a Condition Template above, or add a custom condition below</p>
                                            </div>
                                            {/* Add new condition (even when empty) */}
                                            <div className="sa-add-cond">
                                                <input
                                                    className="sa-add-cond-input"
                                                    placeholder="Type a new condition and press Add..."
                                                    value={newCondText}
                                                    onChange={e => setNewCondText(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && addNewCondition()}
                                                />
                                                <button className="sa-add-cond-btn" onClick={addNewCondition}>
                                                    <Plus size={13} /> Add Condition
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* Toolbar with select/deselect all */}
                                            <div className="sa-cond-toolbar">
                                                <span className="sa-cond-sel-info">
                                                    <span>{selectedCount}</span> of {conditions.length} conditions will be included
                                                </span>
                                                <div className="sa-cond-sel-btns">
                                                    <button className="sa-sel-all-btn" onClick={selectAll}>Select All</button>
                                                    <button className="sa-sel-all-btn" style={{ color: 'var(--t3)' }} onClick={deselectAll}>Deselect All</button>
                                                </div>
                                            </div>

                                            {/* Conditions list with checkboxes */}
                                            <div className="sa-cond-list">
                                                {conditions.map((c, i) => (
                                                    <div key={c.id} className={`sa-cond-row${c.selected ? "" : " deselected"}`}>
                                                        {/* Checkbox */}
                                                        <div
                                                            className={`sa-checkbox${c.selected ? " checked" : ""}`}
                                                            onClick={() => toggleCondition(c.id)}
                                                        >
                                                            {c.selected && <Check size={11} />}
                                                        </div>
                                                        <span className="sa-cond-num">{i + 1}.</span>
                                                        <div className="sa-cond-text-wrap">
                                                            <span className="sa-cond-text">{c.condition_text}</span>
                                                            {c.isNew && (
                                                                <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 600, color: 'var(--amber)', background: 'var(--amber-lt)', padding: '1px 6px', borderRadius: 4 }}>
                                                                    Custom
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="sa-cond-actions">
                                                            <button className="sa-cond-del" onClick={() => deleteCondition(c.id)} title="Remove condition">
                                                                <Trash2 size={13} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Add new condition */}
                                            <div className="sa-add-cond">
                                                <input
                                                    className="sa-add-cond-input"
                                                    placeholder="Type a new condition and press Add..."
                                                    value={newCondText}
                                                    onChange={e => setNewCondText(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && addNewCondition()}
                                                />
                                                <button className="sa-add-cond-btn" onClick={addNewCondition}>
                                                    <Plus size={13} /> Add Condition
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* ── ACTIONS ── */}
                                <div className="sa-actions">
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
