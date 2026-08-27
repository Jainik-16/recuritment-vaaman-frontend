
"use client"
import { useState, useEffect, Suspense } from "react"
import {
    ArrowLeft,
    Search,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    FileText,
    Download,
    Eye,
    AlertCircle,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    UserCheck,
    FileCheck,
    Send,
    ClipboardList,
    UserPlus,
    Star,
    Globe,
    MapPinned,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    Home,
    Plus,
    LogOut,
    Upload,
    MessageSquare,
    Zap,
    TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { API_BASE_URL } from '@/lib/api-config'
import { getFrappeCSRF } from "@/lib/csrf"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cp {
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
    --red:       #dc2626;
    --red-lt:    #fee2e2;
    --red-bdr:   #fecaca;
    --yellow:    #d97706;
    --yellow-lt: #fef9c3;
    --yellow-bdr:#fde68a;

    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13.5px;
    -webkit-font-smoothing: antialiased;
  }

  .cp-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  /* ══ SIDEBAR ══ */
  .cp-sb {
    width: var(--sb-w); background: var(--sb);
    min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 100;
    display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .cp-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }
  .cp-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }
  .cp-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
  }
  .cp-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .cp-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; line-height: 1.25; }
  .cp-sb-sub  { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
  .cp-sb-close {
    margin-left: auto; flex-shrink: 0; width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer; color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center; transition: all .14s;
  }
  .cp-sb-close:hover { background: var(--sb-hover); color: #fff; }
  .cp-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .cp-nav::-webkit-scrollbar { width: 3px; }
  .cp-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }
  .cp-nav-cta {
    display: flex; align-items: center; gap: 9px;
    padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    color: var(--accent); font-size: 13px; font-weight: 600;
    text-decoration: none; transition: background .15s; margin-bottom: 22px;
  }
  .cp-nav-cta:hover { background: rgba(0,158,247,.24); }
  .cp-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
  }
  .cp-nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt);
    text-decoration: none; transition: all .14s;
  }
  .cp-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; }
  .cp-nav-link:hover { background: var(--sb-hover); color: #fff; }
  .cp-nav-link:hover svg { opacity: 1; }
  .cp-nav-link.active { background: var(--sb-hover); color: #fff; }
  .cp-nav-link.active svg { opacity: 1; }
  .cp-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .cp-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; border-radius: 8px; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--sb-lbl); text-align: left; transition: all .14s;
  }
  .cp-logout svg { opacity: .6; width: 15px; height: 15px; }
  .cp-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }
  .cp-overlay {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
  }
  @media (max-width: 768px) { .cp-overlay.show { display: block; } }

  /* ══ MAIN ══ */
  .cp-main {
    margin-left: var(--sb-w); flex: 1;
    display: flex; flex-direction: column; min-height: 100vh;
    transition: margin-left .25s cubic-bezier(.4,0,.2,1);
  }
  .cp-main.sb-closed { margin-left: 0; }

  /* ══ HEADER ══ */
  .cp-header {
    min-height: 60px; background: #fff; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 1px 0 rgba(0,158,247,.08);
    overflow: hidden;
  }
  .cp-toggle {
    width: 34px; height: 34px; border-radius: 8px;
    background: none; border: 1px solid var(--border);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .cp-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .cp-btn-back {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    background: transparent; color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer; text-decoration: none;
    transition: all .14s; white-space: nowrap;
  }
  .cp-btn-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .cp-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .cp-crumb { display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--t3); flex: 1; min-width: 0; overflow: hidden; }
.cp-crumb svg { width: 13px; height: 13px; flex-shrink: 0; }
.cp-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90px; }
.cp-crumb a { white-space: nowrap; flex-shrink: 0; }

  /* ══ BUTTONS ══ */
  .cp-btn-sm {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 7px;
    font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 500;
    background: transparent; color: var(--t2); border: 1px solid var(--border);
    cursor: pointer; transition: all .14s; white-space: nowrap;
  }
  .cp-btn-sm:hover:not(:disabled) { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .cp-btn-sm:disabled { opacity: .4; cursor: not-allowed; }

  /* ══ PAGE ══ */
  .cp-page { padding: 28px 32px; display: flex; flex-direction: column; gap: 20px; }
  .cp-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
  .cp-page-title { font-size: 20px; font-weight: 800; color: var(--t1); letter-spacing: -0.4px; }
  .cp-page-sub   { font-size: 13px; color: var(--t3); margin-top: 4px; }

  /* ══ JOB FILTER BANNER ══ */
  .cp-job-filter-banner {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 16px; border-radius: 9px;
    background: var(--accent-lt); border: 1px solid var(--accent-bdr);
    font-size: 13px; font-weight: 500; color: var(--t2);
  }
  .cp-job-filter-banner svg { color: var(--accent); flex-shrink: 0; }
  .cp-job-filter-name { font-weight: 700; color: var(--t1); }
  .cp-job-filter-clear {
    margin-left: auto; display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 7px; border: 1px solid var(--accent-bdr);
    background: #fff; color: var(--accent); font-family: 'Inter', sans-serif;
    font-size: 12px; font-weight: 600; cursor: pointer; transition: all .14s;
  }
  .cp-job-filter-clear:hover { background: var(--accent); color: #fff; }

  /* ══ ERROR ══ */
  .cp-error {
    background: var(--red-lt); border: 1px solid var(--red-bdr);
    border-radius: 10px; padding: 14px 16px;
    display: flex; align-items: flex-start; gap: 10px;
  }
  .cp-error svg { color: var(--red); flex-shrink: 0; margin-top: 1px; }
  .cp-error-title { font-size: 13px; font-weight: 700; color: #7f1d1d; }
  .cp-error-msg   { font-size: 12.5px; color: #991b1b; margin-top: 2px; }

  /* ══ STATS (same as jol-stats) ══ */
  .cp-stats { display: grid; grid-template-columns: repeat(7, 1fr); gap: 14px; }
  .cp-stat {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 16px 18px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 1px 3px rgba(0,158,247,.06);
    overflow: hidden; min-width: 0;
  }
  .cp-stat-label { font-size: 11.5px; color: var(--t3); font-weight: 500; margin-bottom: 4px; }
  .cp-stat-val   { font-size: 22px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; line-height: 1; }
  .cp-stat-val.blue   { color: var(--accent); }
  .cp-stat-val.purple { color: #7c3aed; }
  .cp-stat-val.orange { color: #ea580c; }
  .cp-stat-val.green  { color: var(--green); }
  .cp-stat-val.indigo { color: #4f46e5; }
  .cp-stat-val.teal   { color: #0d9488; }
  .cp-stat-val.pink   { color: #db2777; }
  .cp-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .cp-stat-icon.blue   { background: var(--accent-lt); color: var(--accent); }
  .cp-stat-icon.purple { background: #ede9fe; color: #7c3aed; }
  .cp-stat-icon.orange { background: #fff7ed; color: #ea580c; }
  .cp-stat-icon.green  { background: var(--green-lt); color: var(--green); }
  .cp-stat-icon.indigo { background: #e0e7ff; color: #4f46e5; }
  .cp-stat-icon.teal   { background: #f0fdfa; color: #0d9488; }
  .cp-stat-icon.pink   { background: #fdf2f8; color: #db2777; }

  /* ══ SEARCH (same as jol-search-wrap) ══ */
  .cp-search-wrap {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 16px 18px;
    box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }
  .cp-search-inner { position: relative; }
  .cp-search-inner > svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--t3); width: 16px; height: 16px; }
  .cp-search-input {
    width: 100%; height: 44px; padding: 0 40px 0 42px;
    border: 1px solid var(--border); border-radius: 8px; background: var(--bg);
    font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--t1);
    outline: none; transition: all .15s;
  }
  .cp-search-input::placeholder { color: var(--t3); }
  .cp-search-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .cp-search-clear {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: var(--t3);
    display: flex; align-items: center; padding: 4px; border-radius: 4px;
  }
  .cp-search-clear:hover { color: var(--t1); }

  /* ══ FILTERS (same as jol-filters) ══ */
  .cp-filters {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 14px 18px;
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;
    box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }
  .cp-select-wrap { position: relative; }
  .cp-select {
    width: 100%; height: 40px; padding: 0 32px 0 13px;
    border: 1px solid var(--border); border-radius: 8px;
    background: var(--bg); font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--t2); appearance: none;
    outline: none; cursor: pointer; transition: all .15s;
  }
  .cp-select:hover { border-color: var(--accent); background: #fff; }
  .cp-select:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .cp-select-arrow { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); color: var(--t3); pointer-events: none; width: 14px; height: 14px; }

  /* ══ CONTENT LAYOUT (same as jol-content) ══ */
  .cp-content { display: grid; grid-template-columns: 1fr 420px; gap: 20px; }

  /* ══ CARDS GRID (same as jol-cards-grid) ══ */
  .cp-cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }

  /* ══ CANDIDATE CARD (identical to jol-job-card) ══ */
  .cp-job-card {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 12px; padding: 18px;
    cursor: pointer; position: relative; overflow: hidden;
    transition: box-shadow .15s, transform .15s, border-color .15s;
    box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .cp-job-card:hover { box-shadow: 0 8px 24px rgba(0,158,247,.14); transform: translateY(-2px); border-color: rgba(0,158,247,.35); }
  .cp-job-card.selected { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.15); }
  .cp-job-card-bg {
    position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(0,158,247,.08), rgba(0,158,247,.04));
    pointer-events: none; transition: transform .4s;
  }
  .cp-job-card:hover .cp-job-card-bg { transform: scale(2); }

  /* identical to jol-card-head */
  .cp-card-head {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 10px; margin-bottom: 14px; position: relative; z-index: 1;
  }
  .cp-card-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), #7c3aed); color: #fff;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    font-size: 14px; font-weight: 700;
    box-shadow: 0 4px 10px rgba(0,158,247,.3);
  }
  .cp-card-title-wrap { flex: 1; min-width: 0; }
  .cp-card-name {
    font-size: 14px; font-weight: 700; color: var(--t1); letter-spacing: -0.2px;
    transition: color .14s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .cp-job-card:hover .cp-card-name { color: var(--accent); }
  .cp-card-id { font-size: 11px; color: var(--t3); margin-top: 2px; }
  .cp-card-badges { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }

  /* badges */
  .cp-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .cp-badge.blue   { background: var(--accent-lt); color: var(--accent); border: 1px solid var(--border); }
  .cp-badge.green  { background: var(--green-lt); color: var(--green); border: 1px solid var(--green-bdr); }
  .cp-badge.red    { background: var(--red-lt); color: var(--red); border: 1px solid var(--red-bdr); }
  .cp-badge.yellow { background: var(--yellow-lt); color: var(--yellow); border: 1px solid var(--yellow-bdr); }
  .cp-badge.gray   { background: var(--border-s); color: var(--t2); border: 1px solid var(--border); }
  .cp-badge.purple { background: #ede9fe; color: #7c3aed; border: 1px solid #ddd6fe; }
  .cp-badge.open   { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
  .cp-badge.closed { background: var(--red-lt); color: #b91c1c; border: 1px solid var(--red-bdr); }

  /* identical to jol-card-div */
  .cp-card-div { height: 1px; background: var(--border-s); margin: 12px 0; }

  /* identical to jol-card-row */
  .cp-card-row {
    display: flex; align-items: center; gap: 10px;
    padding: 7px 8px; border-radius: 7px; transition: background .12s; margin-bottom: 4px;
  }
  .cp-card-row:hover { background: var(--accent-lt); }
  .cp-card-row-icon { width: 30px; height: 30px; border-radius: 7px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .cp-card-row-icon.blue   { background: var(--accent-lt); color: var(--accent); }
  .cp-card-row-icon.indigo { background: #ede9fe; color: #7c3aed; }
  .cp-card-row-icon.red    { background: #fee2e2; color: #dc2626; }
  .cp-card-row-icon.green  { background: var(--green-lt); color: var(--green); }
  .cp-card-row-icon.teal   { background: #f0fdfa; color: #0d9488; }
  .cp-card-row-lbl { font-size: 10.5px; color: var(--t3); }
  .cp-card-row-val { font-size: 12.5px; font-weight: 500; color: var(--t1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* identical to jol-card-foot */
  .cp-card-foot { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11.5px; color: var(--t3); }
  .cp-card-date { display: flex; align-items: center; gap: 5px; }
  .cp-card-date svg { width: 12px; height: 12px; }

  /* progress bar in card footer */
  .cp-card-progress { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-s); }
  .cp-card-progress-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
  .cp-card-progress-label { font-size: 11px; color: var(--t3); }
  .cp-card-progress-stage { font-size: 11px; font-weight: 600; color: var(--accent); }
  .cp-card-progress-bg { width: 100%; height: 4px; background: var(--border-s); border-radius: 99px; overflow: hidden; }
  .cp-card-progress-fill { height: 100%; background: var(--accent); border-radius: 99px; transition: width .3s; }
  .cp-card-progress-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; font-size: 10.5px; color: var(--t3); }

  /* ══ EMPTY ══ */
  .cp-empty {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 12px; padding: 60px 20px; text-align: center;
    box-shadow: 0 1px 4px rgba(0,158,247,.06); grid-column: 1 / -1;
  }
  .cp-empty-icon { width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 18px; background: var(--accent-lt); color: var(--accent); display: flex; align-items: center; justify-content: center; }
  .cp-empty-title { font-size: 15px; font-weight: 700; color: var(--t1); margin-bottom: 6px; }
  .cp-empty-sub   { font-size: 13px; color: var(--t3); }

  /* ══ PAGINATION (same as jol-pagination) ══ */
  .cp-pagination {
    display: flex; align-items: center; justify-content: space-between;
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 12px 18px; margin-top: 14px;
    font-size: 13px; color: var(--t3); box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }
  .cp-pag-btns { display: flex; align-items: center; gap: 8px; }
  .cp-pag-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 7px; font-size: 12.5px; font-weight: 500;
    background: transparent; color: var(--t2); border: 1px solid var(--border);
    cursor: pointer; transition: all .14s; font-family: 'Inter', sans-serif;
  }
  .cp-pag-btn:hover:not(:disabled) { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .cp-pag-btn:disabled { opacity: .4; cursor: not-allowed; }
  .cp-pag-cur { font-size: 12.5px; font-weight: 600; color: var(--t1); }

  /* ══ DETAIL PANEL (same as jol-detail but wider) ══ */
  .cp-detail {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 12px; position: sticky; top: 76px;
    max-height: calc(100vh - 96px); overflow-y: auto;
    box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .cp-detail::-webkit-scrollbar { width: 4px; }
  .cp-detail::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .cp-detail-hero { background: linear-gradient(135deg, #0f3460, #16213e); padding: 20px; border-radius: 12px 12px 0 0; }
  .cp-detail-hero-head { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
  .cp-detail-hero-icon { color: rgba(255,255,255,.5); }
  .cp-detail-hero-title { font-size: 13px; font-weight: 700; color: #fff; }
  .cp-detail-avatar { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), #7c3aed); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; margin-bottom: 12px; box-shadow: 0 4px 14px rgba(0,158,247,.3); }
  .cp-detail-name { font-size: 17px; font-weight: 800; color: #fff; letter-spacing: -0.3px; margin-bottom: 8px; }

  .cp-detail-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; }
  .cp-detail-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--t3); margin-bottom: 3px; display: flex; align-items: center; gap: 5px; }
  .cp-detail-label svg { width: 11px; height: 11px; }
  .cp-detail-val { font-size: 13px; font-weight: 500; color: var(--t1); }
  .cp-detail-div { height: 1px; background: var(--border-s); margin: 2px 0; }
  .cp-detail-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* star */
  .cp-star-wrap { position: relative; width: 16px; height: 16px; display: inline-block; }
  .cp-star-fill-wrap { position: absolute; inset: 0; overflow: hidden; }

  /* ai box */
  .cp-ai-box { background: var(--bg); border: 1px solid var(--border-s); border-radius: 8px; padding: 10px 12px; font-size: 12.5px; color: var(--t2); line-height: 1.6; max-height: 120px; overflow-y: auto; margin-top: 4px; }

  /* location dropdown */
  .cp-loc-wrap { position: relative; margin-top: 4px; }
  .cp-loc-select { width: 100%; height: 36px; padding: 0 32px 0 10px; border: 1px solid var(--border); border-radius: 7px; background: #fff; font-family: 'Inter', sans-serif; font-size: 13px; color: var(--t1); appearance: none; outline: none; cursor: pointer; transition: all .15s; }
  .cp-loc-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .cp-loc-select:disabled { opacity: .6; cursor: not-allowed; background: var(--bg); }
  .cp-loc-arrow { position: absolute; right: 10px; top: 50%; transform: translateY(-50%) rotate(90deg); color: var(--t3); pointer-events: none; width: 13px; height: 13px; }
  .cp-loc-saving { font-size: 11px; color: var(--accent); margin-top: 4px; display: flex; align-items: center; gap: 5px; }
  .cp-loc-saved { font-size: 11px; color: var(--green); margin-top: 4px; display: flex; align-items: center; gap: 5px; }
  .cp-loc-spin { width: 11px; height: 11px; border-radius: 50%; border: 2px solid rgba(0,158,247,.25); border-top-color: var(--accent); animation: cp-spin .7s linear infinite; flex-shrink: 0; }

  /* stage progress */
  .cp-stage-section-title { font-size: 13px; font-weight: 700; color: var(--t1); padding: 14px 18px 0; margin-bottom: 14px; }
  .cp-stages { padding: 0 18px 16px; display: flex; flex-direction: column; gap: 0; }
  .cp-stage-item { display: flex; align-items: flex-start; gap: 12px; }
  .cp-stage-left { display: flex; flex-direction: column; align-items: center; }
  .cp-stage-dot { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .cp-stage-dot.completed  { background: var(--green-lt); color: var(--green); }
  .cp-stage-dot.in_progress{ background: var(--accent-lt); color: var(--accent); }
  .cp-stage-dot.rejected   { background: var(--red-lt); color: var(--red); }
  .cp-stage-dot.not_join   { background: var(--yellow-lt); color: var(--yellow); }
  .cp-stage-dot.pending    { background: var(--border-s); color: var(--t3); }
  .cp-stage-line { width: 2px; flex: 1; min-height: 18px; margin: 3px 0; }
  .cp-stage-line.done  { background: var(--green-bdr); }
  .cp-stage-line.other { background: var(--border-s); }
  .cp-stage-body { flex: 1; padding-bottom: 16px; }
  .cp-stage-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
  .cp-stage-name { font-size: 13px; font-weight: 600; color: var(--t1); }

  /* joining */
  .cp-joining-box { background: var(--accent-lt); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; margin-top: 8px; }
  .cp-joining-title { font-size: 12px; font-weight: 700; color: var(--t2); margin-bottom: 8px; }
  .cp-joining-option { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; cursor: pointer; }
  .cp-joining-option:last-child { margin-bottom: 0; }
  .cp-joining-option input[type="checkbox"] { width: 14px; height: 14px; accent-color: var(--accent); cursor: pointer; }
  .cp-joining-option label { font-size: 12.5px; font-weight: 500; color: var(--t2); cursor: pointer; }

  /* quick actions */
  .cp-actions-title { font-size: 13px; font-weight: 700; color: var(--t1); padding: 14px 18px 0; margin-bottom: 10px; }
  .cp-actions { padding: 0 18px 18px; display: flex; flex-direction: column; gap: 8px; }
  .cp-action-btn { display: flex; align-items: center; gap: 9px; padding: 10px 14px; border-radius: 8px; background: var(--bg); border: 1px solid var(--border-s); font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: var(--t2); cursor: pointer; transition: all .14s; text-align: left; width: 100%; }
  .cp-action-btn:hover:not(:disabled) { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .cp-action-btn:disabled { opacity: .5; cursor: not-allowed; }
  .cp-action-btn svg { width: 14px; height: 14px; flex-shrink: 0; }
  .cp-action-completed { margin-left: auto; font-size: 11px; color: var(--red); font-weight: 500; }

  /* comments */
  .cp-comments-section { display: flex; flex-direction: column; gap: 10px; }
  .cp-comment-item { background: var(--bg); border: 1px solid var(--border-s); border-radius: 8px; padding: 10px 12px; }
  .cp-comment-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .cp-comment-avatar { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, var(--accent), #7c3aed); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
  .cp-comment-meta { display: flex; flex-direction: column; }
  .cp-comment-by { font-size: 12px; font-weight: 700; color: var(--t1); }
  .cp-comment-time { font-size: 11px; color: var(--t3); }
  .cp-comment-text { font-size: 12.5px; color: var(--t2); line-height: 1.55; }
  .cp-comment-text p { margin: 0; }
  .cp-comment-input-wrap { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
  .cp-comment-textarea { width: 100%; padding: 9px 12px; border-radius: 8px; border: 1px solid var(--border); background: #fff; color: var(--t1); font-family: 'Inter', sans-serif; font-size: 13px; outline: none; resize: vertical; min-height: 72px; transition: all .15s; line-height: 1.5; }
  .cp-comment-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .cp-comment-textarea::placeholder { color: var(--t3); }
  .cp-comment-save { align-self: flex-end; display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 7px; background: var(--accent); color: #fff; font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 600; border: none; cursor: pointer; transition: background .14s; }
  .cp-comment-save:hover:not(:disabled) { background: var(--accent-h); }
  .cp-comment-save:disabled { opacity: .55; cursor: not-allowed; }
  .cp-comment-empty { font-size: 12px; color: var(--t3); font-style: italic; padding: 4px 0; }
  .cp-comment-loading { font-size: 12px; color: var(--accent); padding: 4px 0; display: flex; align-items: center; gap: 6px; }
  .cp-comment-spin { width: 12px; height: 12px; border-radius: 50%; border: 2px solid rgba(0,158,247,.25); border-top-color: var(--accent); animation: cp-spin .7s linear infinite; flex-shrink: 0; }

  /* detail empty */
  .cp-detail-empty { padding: 48px 22px; text-align: center; }
  .cp-detail-empty-icon { width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 14px; background: var(--accent-lt); color: var(--accent); display: flex; align-items: center; justify-content: center; }
  .cp-detail-empty-title { font-size: 14px; font-weight: 700; color: var(--t1); margin-bottom: 5px; }
  .cp-detail-empty-sub   { font-size: 13px; color: var(--t3); }

  /* loading */
  .cp-loading { min-height: 100vh; background: var(--bg); display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 16px; }
  .cp-spinner { width: 44px; height: 44px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent); animation: cp-spin .7s linear infinite; }
  @keyframes cp-spin { to { transform: rotate(360deg); } }
  .cp-loading-txt { font-size: 14px; color: var(--t3); font-weight: 500; }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 1280px) { .cp-stats { grid-template-columns: repeat(4, 1fr); } }
  @media (max-width: 1100px) { .cp-content { grid-template-columns: 1fr; } .cp-detail { position: static; max-height: none; } }
  @media (max-width: 900px)  { .cp-cards-grid { grid-template-columns: 1fr; } .cp-stats { grid-template-columns: repeat(2, 1fr); } .cp-filters { grid-template-columns: 1fr; } }
  @media (max-width: 768px) {
    .cp-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .cp-sb.open { transform: translateX(0); }
    .cp-main { margin-left: 0 !important; overflow-x: hidden; max-width: 100vw; }
    .cp-wrap { overflow-x: hidden; }
    .cp-page { padding: 12px; overflow-x: hidden; gap: 14px; }
    .cp-header { padding: 0 12px; gap: 6px; }
    .cp-hdr-sep { display: none; }
    .cp-btn-back { font-size: 12px; padding: 6px 10px; flex-shrink: 0; }
    .cp-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .cp-stat { padding: 12px 14px; overflow: hidden; }
    .cp-stat-val { font-size: 18px; }
    .cp-stat-label { font-size: 10.5px; }
    .cp-filters { grid-template-columns: 1fr; gap: 8px; }
    .cp-content { grid-template-columns: 1fr; }
    .cp-detail { position: static; max-height: none; }
    .cp-cards-grid { grid-template-columns: 1fr; }
    .cp-pagination { flex-direction: column; align-items: flex-start; gap: 10px; }
    .cp-job-filter-banner { flex-wrap: wrap; gap: 8px; }
    .cp-job-filter-clear { margin-left: 0; }
  }
`

const RECRUITMENT_STAGES = [
    { id: 'interview', label: 'Interview', icon: Users, order: 1 },
    { id: 'feedback', label: 'Candidate Feedback', icon: ClipboardList, order: 2 },
    { id: 'document_verification', label: 'Document Verification', icon: FileCheck, order: 3 },
    { id: 'offer_letter', label: 'Offer Letter', icon: Send, order: 4 },
    { id: 'joining_confirmation', label: 'Joining Confirmation', icon: UserPlus, order: 5 },
    { id: 'appointment_letter', label: 'Appointment Letter', icon: UserCheck, order: 6 },
]

interface CandidateStageStatus {
    stage_id: string
    status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'join' | 'not_join' | 'offer_revoked'
    completed_date?: string
    notes?: string
}

interface CandidateComment {
    name: string
    comment_by: string
    display_name?: string
    content: string
    creation: string
}

interface Candidate {
    id: string; name: string; applicant_name: string; email_id: string; phone_number: string
    job_title: string; designation: string; status: string; country: string; location: string
    address: string; custom_location: string; custom_address: string; source: string; notes: string
    resume_link: string; cover_letter: string; creation: string; modified: string
    resume_score?: number; custom_recruitment_stage?: string
    stage_statuses?: CandidateStageStatus[]
    justification_by_ai?: string; applicant_rating?: number; fit_level?: string; score?: number
    job_opening?: string
    custom_current_company: string;
    custom_total_experience: string;
    resume_attachment: string;
    owner: string;
    custom_date_of_joining?: string;

}

function CandidatesInner() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const jobOpeningFilter = searchParams.get('jobOpening') || ""
    const searchFromUrl = searchParams.get('search') || ""


    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
    const [updatingJoiningStatus, setUpdatingJoiningStatus] = useState(false)
    const [locations, setLocations] = useState<string[]>([])
    const [updatingLocation, setUpdatingLocation] = useState(false)
    const [locationSaved, setLocationSaved] = useState(false)
    const [updatingJoinDate, setUpdatingJoinDate] = useState(false)   // ADD
    const [joinDateSaved, setJoinDateSaved] = useState(false)

    const [jobTitles, setJobTitles] = useState<string[]>([])
    const [updatingJobTitle, setUpdatingJobTitle] = useState(false)
    const [jobTitleSaved, setJobTitleSaved] = useState(false)
    const [jobTitleMap, setJobTitleMap] = useState<Record<string, string>>({}) // id -> title
    const [jobDesignationMap, setJobDesignationMap] = useState<Record<string, string>>({})


    const [savingComment, setSavingComment] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [filterDesignation, setFilterDesignation] = useState("all")
    const [filterStage, setFilterStage] = useState("all")
    const [comments, setComments] = useState<CandidateComment[]>([])
    const [newComment, setNewComment] = useState("")
    const [loadingComments, setLoadingComments] = useState(false)
    const [pendingInterviewCount, setPendingInterviewCount] = useState(0)
    const ITEMS_PER_PAGE = 10
    const [currentPage, setCurrentPage] = useState(1)

    // const fetchLocations = async () => {
    //     try {
    //         const res = await fetch(`${API_BASE_URL}/api/resource/custom_location?fields=["name","location_name"]&limit_page_length=0`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
    //         if (res.ok) { const data = await res.json(); const locs = (data?.data || []).map((l: any) => l.location_name || l.name).filter(Boolean); if (locs.length > 0) { setLocations(locs); return } }
    //         const res2 = await fetch(`${API_BASE_URL}/api/resource/Location?fields=["name"]&limit_page_length=0`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
    //         if (res2.ok) { const data2 = await res2.json(); setLocations((data2?.data || []).map((l: any) => l.name).filter(Boolean)) }
    //     } catch (e) { console.error("Error fetching locations:", e) }
    // }

    const fetchLocations = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/resource/Cost Center?fields=["name"]&filters=[["Cost Center","is_group","=",0]]&limit_page_length=0`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
            if (res.ok) { const data = await res.json(); const locs = (data?.data || []).map((l: any) => l.name).filter(Boolean); if (locs.length > 0) { setLocations(locs); return } }
        } catch (e) { console.error("Error fetching locations:", e) }
    }

    // const updateCandidateLocation = async (candidateId: string, newLocation: string) => {
    //     if (!newLocation) return
    //     setUpdatingLocation(true); setLocationSaved(false)
    //     try {
    //         const csrfToken = await getFrappeCSRF()
    //         const res = await fetch(`${API_BASE_URL}/api/method/frappe.client.set_value`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken }, body: JSON.stringify({ doctype: 'Job Applicant', name: candidateId, fieldname: 'custom_location', value: newLocation }) })
    //         if (res.ok) { setSelectedCandidate(prev => prev ? { ...prev, custom_location: newLocation } : prev); setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, custom_location: newLocation } : c)); setLocationSaved(true); setTimeout(() => setLocationSaved(false), 2000) }
    //         else { alert("Failed to update location. Please try again.") }
    //     } catch (e) { alert("Error updating location.") }
    //     finally { setUpdatingLocation(false) }
    // }

    const updateCandidateLocation = async (candidateId: string, newLocation: string) => {
        if (!newLocation) return
        setUpdatingLocation(true); setLocationSaved(false)
        try {
            const csrfToken = await getFrappeCSRF()
            const res = await fetch(`${API_BASE_URL}/api/method/resume.api.candidate.update_candidate_field`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Frappe-CSRF-Token': csrfToken
                },
                body: JSON.stringify({
                    candidate_id: candidateId,
                    fieldname: 'custom_location',
                    value: newLocation
                })
            })
            const result = await res.json()
            if (result.message?.success) {
                setSelectedCandidate(prev => prev ? { ...prev, custom_location: newLocation } : prev)
                setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, custom_location: newLocation } : c))
                setLocationSaved(true)
                setTimeout(() => setLocationSaved(false), 2000)
            } else {
                alert("Failed to update location. Please try again.")
            }
        } catch (e) { alert("Error updating location.") }
        finally { setUpdatingLocation(false) }
    }

    const updateJoiningDate = async (candidateId: string, newDate: string) => {
        setUpdatingJoinDate(true); setJoinDateSaved(false)
        try {
            const csrfToken = await getFrappeCSRF()
            const res = await fetch(`${API_BASE_URL}/api/method/resume.api.candidate.update_joining_date`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken },
                body: JSON.stringify({ candidate_id: candidateId, date_of_joining: newDate })
            })
            const result = await res.json()
            if (result.message?.success ?? result.success) {
                setSelectedCandidate(prev => prev ? { ...prev, custom_date_of_joining: newDate } : prev)
                setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, custom_date_of_joining: newDate } : c))
                setJoinDateSaved(true)
                setTimeout(() => setJoinDateSaved(false), 2000)
            } else { alert("Failed to update date of joining.") }
        } catch (e) { alert("Error updating date of joining.") }
        finally { setUpdatingJoinDate(false) }
    }

    const updateCandidateJobTitle = async (candidateId: string, newJobTitle: string) => {
        if (!newJobTitle) return
        // Reverse lookup: title → Job Opening ID
        const jobOpeningId = Object.entries(jobTitleMap).find(
            ([id, title]) => title === newJobTitle && id !== title
        )?.[0] || ""
        setUpdatingJobTitle(true); setJobTitleSaved(false)
        try {
            const csrfToken = await getFrappeCSRF()
            const res = await fetch(`${API_BASE_URL}/api/method/resume.api.candidate.update_candidate_field`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Frappe-CSRF-Token': csrfToken
                },
                body: JSON.stringify({
                    candidate_id: candidateId,
                    fieldname: 'job_title',
                    value: jobOpeningId
                })
            })
            const result = await res.json()
            // if (result.message?.success) {
            //     setSelectedCandidate(prev => prev ? { ...prev, job_title: newJobTitle } : prev)
            //     setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, job_title: newJobTitle } : c))
            //     setJobTitleSaved(true)
            //     setTimeout(() => setJobTitleSaved(false), 2000)
            // }
            if (result.message?.success) {
                const newDesignation = jobDesignationMap[newJobTitle] || ""
                setSelectedCandidate(prev => prev ? {
                    ...prev,
                    job_title: newJobTitle,
                    designation: newDesignation || prev.designation
                } : prev)
                setCandidates(prev => prev.map(c => c.id === candidateId ? {
                    ...c,
                    job_title: newJobTitle,
                    designation: newDesignation || c.designation
                } : c))
                setJobTitleSaved(true)
                setTimeout(() => setJobTitleSaved(false), 2000)

                // Also persist designation to backend if we have one
                if (newDesignation) {
                    try {
                        const csrfToken2 = await getFrappeCSRF()
                        await fetch(`${API_BASE_URL}/api/method/resume.api.candidate.update_candidate_field`, {
                            method: 'POST',
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken2 },
                            body: JSON.stringify({ candidate_id: candidateId, fieldname: 'designation', value: newDesignation })
                        })
                    } catch (e) { console.error("Error updating designation:", e) }
                }
            }
            else {
                alert("Failed to update job title.")
            }
        } catch (e) { alert("Error updating job title.") }
        finally { setUpdatingJobTitle(false) }
    }

    // const fetchCandidates = async () => {
    const fetchCandidates = async (titleMap: Record<string, string> = {}) => {
        setIsLoading(true); setApiError(null)
        try {
            const response = await fetch(`${API_BASE_URL}/api/resource/Job Applicant/?fields=["*"]&limit_page_length=0&order_by=creation desc`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } })
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            const data = await response.json()
            if (data && data.data) {
                const mappedData = data.data.map((item: any) => ({
                    id: item.name || item.id, name: item.name || item.id,
                    applicant_name: item.applicant_name || "Unknown",
                    email_id: item.email_id || "", phone_number: item.phone_number || "",
                    job_title: item.job_title || "Not specified", designation: item.designation || "",
                    job_opening: item.job_title || "",
                    status: item.status || "Open", country: item.country || "",
                    location: item.location || "", address: item.address || "",
                    custom_location: item.custom_location || "", custom_address: item.custom_address || "",
                    source: item.source || "", notes: item.notes || "",
                    resume_link: item.resume_link || "", cover_letter: item.cover_letter || "",
                    creation: item.creation || new Date().toISOString(),
                    modified: item.modified || new Date().toISOString(),
                    resume_score: item.resume_score || 0,
                    custom_recruitment_stage: item.custom_recruitment_stage || "",
                    stage_statuses: [],
                    justification_by_ai: item.justification_by_ai || "",
                    applicant_rating: item.applicant_rating || 0,
                    fit_level: item.fit_level || "", score: item.score || 0,
                    job_opening: item.job_title || "",
                    custom_current_company: item.custom_current_company || "",
                    custom_total_experience: item.custom_total_experience || "",
                    resume_attachment: item.resume_attachment || "",
                    owner: item.owner || "",    // ← ADD THIS
                }))
                setCandidates(mappedData); setFilteredCandidates(mappedData); setIsLoading(false)

                const candidateIds = mappedData.map((c: Candidate) => c.id)

                const fetchBulk = async (doctype: string, filters: any[], fields: string[]) => {
                    const csrfToken = await getFrappeCSRF()
                    const res = await fetch(`${API_BASE_URL}/api/method/frappe.client.get_list`, {
                        method: 'POST', credentials: 'include',
                        headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken },
                        body: JSON.stringify({ doctype, filters, fields, limit_page_length: 0 })
                    })
                    const data = await res.json()
                    return data?.message || []
                }

                const [interviewData, feedbackData, docData, offerData, joiningData, appointmentData] = await Promise.all([
                    fetchBulk('Interview', [['job_applicant', 'in', candidateIds]], ['job_applicant', 'status', 'scheduled_on']),
                    fetchBulk('Interview Feedback', [['job_applicant', 'in', candidateIds]], ['job_applicant']),
                    fetchBulk('Applicant Document', [['applicant_name', 'in', candidateIds]], ['applicant_name']),
                    fetchBulk('Job Offer', [['job_applicant', 'in', candidateIds]], ['job_applicant', 'status']),
                    fetchBulk('Joining Confirmation', [['candidate_id', 'in', candidateIds]], ['candidate_id', 'join', 'not_join', 'offer_revoked', 'modified', 'custom_date_of_joining']),
                    fetchBulk('Appointment Letter', [['job_applicant', 'in', candidateIds]], ['job_applicant']),
                ])
                setPendingInterviewCount(interviewData.filter((i: any) => i.status === 'Pending').length)


                const allResults = mappedData.map((candidate: Candidate) => {
                    const statuses: CandidateStageStatus[] = []
                    const cInterviews = interviewData.filter((i: any) => i.job_applicant === candidate.id)
                    if (cInterviews.length > 0) {
                        const hasCompleted = cInterviews.some((i: any) => i.status === 'Completed' || i.status === 'Cleared')
                        statuses.push({ stage_id: 'interview', status: hasCompleted ? 'completed' : 'in_progress' })
                    } else { statuses.push({ stage_id: 'interview', status: 'pending' }) }
                    const hasFeedback = feedbackData.some((f: any) => f.job_applicant === candidate.id)
                    statuses.push({ stage_id: 'feedback', status: hasFeedback ? 'completed' : 'pending' })
                    const hasDoc = docData.some((d: any) => d.applicant_name === candidate.id)
                    statuses.push({ stage_id: 'document_verification', status: hasDoc ? 'completed' : 'pending' })
                    const candidateOffer = offerData.find((o: any) => o.job_applicant === candidate.id)
                    let offerStageStatus: any = 'pending'
                    if (candidateOffer) {
                        const s = (candidateOffer.status || '').toLowerCase()
                        if (s.includes('accept')) offerStageStatus = 'completed'
                        else if (s.includes('reject')) offerStageStatus = 'rejected'
                        else offerStageStatus = 'in_progress' // e.g. "Awaiting Response"
                    }
                    statuses.push({ stage_id: 'offer_letter', status: offerStageStatus })
                    const joining = joiningData.find((j: any) => j.candidate_id === candidate.id)
                    if (joining) {
                        let joiningStatus: any = 'pending'
                        if (joining.join === 1) joiningStatus = 'completed'
                        else if (joining.offer_revoked === 1) joiningStatus = 'rejected'
                        statuses.push({ stage_id: 'joining_confirmation', status: joiningStatus, completed_date: joining.modified })
                    } else { statuses.push({ stage_id: 'joining_confirmation', status: 'pending' }) }
                    const hasAppointment = appointmentData.some((a: any) => a.job_applicant === candidate.id)
                    statuses.push({ stage_id: 'appointment_letter', status: hasAppointment ? 'completed' : 'pending' })
                    return { id: candidate.id, statuses, dateOfJoining: joining?.custom_date_of_joining || "" }   // CHANGED
                })

                setCandidates(prev => prev.map(c => { const result = allResults.find(r => r.id === c.id); return result ? { ...c, stage_statuses: result.statuses, custom_date_of_joining: result.dateOfJoining } : c }))
                setFilteredCandidates(prev => prev.map(c => { const result = allResults.find(r => r.id === c.id); return result ? { ...c, stage_statuses: result.statuses, custom_date_of_joining: result.dateOfJoining } : c }))
            }
        } catch (error: any) { setApiError("Network error: Unable to reach server."); setIsLoading(false) }
    }

    // const fetchJobTitles = async () => {
    //     try {
    //         const res = await fetch(
    //             `${API_BASE_URL}/api/resource/Job Opening?fields=["name","job_title"]&filters=[["Job Opening","status","=","Open"]]&limit_page_length=0`,
    //             { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
    //         )
    //         if (res.ok) {
    //             const data = await res.json()
    //             // const titles = (data?.data || []).map((j: any) => j.name).filter(Boolean)
    //             const titles = (data?.data || []).map((j: any) => j.job_title).filter(Boolean)
    //             setJobTitles(titles)
    //         }
    //     } catch (e) { console.error("Error fetching job titles:", e) }
    // }


    // const fetchJobTitles = async () => {
    const fetchJobTitles = async (): Promise<Record<string, string>> => {
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/resource/Job Opening?fields=["name","job_title","designation"]&filters=[["Job Opening","status","=","Open"]]&limit_page_length=0`,
                { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
            )
            if (res.ok) {
                const data = await res.json()
                // const map: Record<string, string> = {}
                // const titles: string[] = []
                //     ; (data?.data || []).forEach((j: any) => {
                //         if (j.job_title) {
                //             map[j.name] = j.job_title      // HR-OPN-2026-0106 -> Front Desk Executive
                //             map[j.job_title] = j.job_title  // also map title -> title
                //             titles.push(j.job_title)
                //         }
                //     })
                // setJobTitleMap(map)
                // setJobTitles(titles)
                const map: Record<string, string> = {}
                const designationMap: Record<string, string> = {}  // job_title → designation
                const titles: string[] = []
                    ; (data?.data || []).forEach((j: any) => {
                        if (j.job_title) {
                            map[j.name] = j.job_title
                            map[j.job_title] = j.job_title
                            titles.push(j.job_title)
                            if (j.designation) {
                                designationMap[j.job_title] = j.designation
                            }
                        }
                    })
                setJobTitleMap(map)
                setJobDesignationMap(designationMap)
                setJobTitles(titles)
            }
        } catch (e) { console.error("Error fetching job titles:", e) }
        return {}   // ← ADD THIS LINE

    }

    // const fetchCandidateStageStatuses = async (candidateId: string): Promise<CandidateStageStatus[]> => {
    //     try {
    //         const statuses: CandidateStageStatus[] = []
    //         const interviewResponse = await fetch(`${API_BASE_URL}/api/resource/Interview?filters=[["job_applicant","=","${candidateId}"]]&fields=["status","scheduled_on"]`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } }).catch(() => null)
    //         if (interviewResponse && interviewResponse.ok) { const interviewData = await interviewResponse.json(); const hasCompletedInterview = interviewData.data?.some((i: any) => i.status === "Completed" || i.status === "Cleared"); statuses.push({ stage_id: 'interview', status: hasCompletedInterview ? 'completed' : 'in_progress', completed_date: hasCompletedInterview ? interviewData.data[0]?.scheduled_on : undefined }) }
    //         else { statuses.push({ stage_id: 'interview', status: 'pending' }) }
    //         const feedbackResponse = await fetch(`${API_BASE_URL}/api/resource/Interview Feedback?filters=[["job_applicant","=","${candidateId}"]]`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } }).catch(() => null)
    //         if (feedbackResponse && feedbackResponse.ok) { const feedbackData = await feedbackResponse.json(); statuses.push({ stage_id: 'feedback', status: feedbackData.data?.length > 0 ? 'completed' : 'pending' }) } else { statuses.push({ stage_id: 'feedback', status: 'pending' }) }
    //         const docResponse = await fetch(`${API_BASE_URL}/api/resource/Applicant Document?filters=[["applicant_name","=","${candidateId}"]]`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } }).catch(() => null)
    //         if (docResponse && docResponse.ok) { const docData = await docResponse.json(); statuses.push({ stage_id: 'document_verification', status: docData.data?.length > 0 ? 'completed' : 'pending' }) } else { statuses.push({ stage_id: 'document_verification', status: 'pending' }) }
    //         const offerResponse = await fetch(`${API_BASE_URL}/api/resource/Job Offer?filters=[["job_applicant","=","${candidateId}"]]`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } }).catch(() => null)
    //         if (offerResponse && offerResponse.ok) { const offerData = await offerResponse.json(); statuses.push({ stage_id: 'offer_letter', status: offerData.data?.length > 0 ? 'completed' : 'pending' }) } else { statuses.push({ stage_id: 'offer_letter', status: 'pending' }) }
    //         const joiningResponse = await fetch(`${API_BASE_URL}/api/resource/Joining Confirmation?filters=[["candidate_id","=","${candidateId}"]]&fields=["*"]`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } }).catch(() => null)
    //         if (joiningResponse && joiningResponse.ok) { const joiningData = await joiningResponse.json(); if (joiningData.data && joiningData.data.length > 0) { const joining = joiningData.data[0]; let joiningStatus: any = 'pending'; if (joining.join === 1) joiningStatus = 'completed'; else if (joining.not_join === 1) joiningStatus = 'pending'; else if (joining.offer_revoked === 1) joiningStatus = 'rejected'; statuses.push({ stage_id: 'joining_confirmation', status: joiningStatus, completed_date: joining.modified }) } else { statuses.push({ stage_id: 'joining_confirmation', status: 'pending' }) } }
    //         else { statuses.push({ stage_id: 'joining_confirmation', status: 'pending' }) }
    //         const appointmentResponse = await fetch(`${API_BASE_URL}/api/resource/Appointment Letter?filters=[["job_applicant","=","${candidateId}"]]`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } }).catch(() => null)
    //         if (appointmentResponse && appointmentResponse.ok) { const appointmentData = await appointmentResponse.json(); statuses.push({ stage_id: 'appointment_letter', status: appointmentData.data?.length > 0 ? 'completed' : 'pending' }) } else { statuses.push({ stage_id: 'appointment_letter', status: 'pending' }) }
    //         return statuses
    //     } catch (error) { return [] }
    // }

    const updateJoiningConfirmation = async (candidateId: string, statusType: 'join' | 'not_join' | 'offer_revoked') => {
        setUpdatingJoiningStatus(true)
        const csrfToken = await getFrappeCSRF()
        try {
            if (selectedCandidate?.id === candidateId) { const newStatus = statusType === 'join' ? 'completed' : statusType === 'not_join' ? 'pending' : 'rejected'; const updatedStageStatuses = selectedCandidate.stage_statuses?.map(s => s.stage_id === 'joining_confirmation' ? { ...s, status: newStatus as any } : s) || []; setSelectedCandidate({ ...selectedCandidate, stage_statuses: updatedStageStatuses }) }
            const response = await fetch(`${API_BASE_URL}/api/method/resume.api.candidate.update_joining_confirmation`, { method: "POST", credentials: "include", headers: { 'Content-Type': 'application/json', "X-Frappe-CSRF-Token": csrfToken }, body: JSON.stringify({ candidate_id: candidateId, status_type: statusType }) })
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            const result = await response.json()
            if (result.message?.success) { await fetchCandidates(); setTimeout(() => { setCandidates((latestCandidates) => { const updatedCandidate = latestCandidates.find(c => c.id === candidateId); if (updatedCandidate && selectedCandidate?.id === candidateId) setSelectedCandidate(updatedCandidate); return latestCandidates }) }, 100); alert("Joining confirmation updated successfully!") }
            else { alert(`Error: ${result.message || "Failed to update joining confirmation"}`); await fetchCandidates() }
        } catch (error: any) { alert(`Error: ${error.message || "Failed to update joining confirmation"}`); await fetchCandidates() }
        finally { setUpdatingJoiningStatus(false) }
    }

    const fetchComments = async (candidateId: string) => {
        setLoadingComments(true)
        try {
            const csrfToken = await getFrappeCSRF()
            const res = await fetch(`${API_BASE_URL}/api/method/frappe.client.get_list`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken }, body: JSON.stringify({ doctype: "Comment", fields: ["name", "comment_by", "content", "comment_type", "creation"], filters: [["Comment", "reference_doctype", "=", "Job Applicant"], ["Comment", "reference_name", "=", candidateId], ["Comment", "comment_type", "=", "Comment"]], order_by: "creation asc", limit_page_length: 50 }) })
            const data = await res.json()
            const list: any[] = data?.message || []
            const userIds = [...new Set(list.map((c: any) => c.comment_by).filter(Boolean))]
            let userMap: Record<string, string> = {}
            if (userIds.length > 0) { try { const userRes = await fetch(`${API_BASE_URL}/api/method/frappe.client.get_list`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken }, body: JSON.stringify({ doctype: "User", fields: ["name", "full_name"], filters: [["User", "name", "in", userIds]], limit_page_length: 50 }) }); const userData = await userRes.json(); const users: any[] = userData?.message || []; users.forEach((u: any) => { userMap[u.name] = u.full_name || u.name }) } catch (e) { } }
            setComments(list.map((c: any) => ({ ...c, display_name: c.comment_by ? (userMap[c.comment_by] || c.comment_by) : "Unknown User" })))
        } catch (e) { setComments([]) }
        finally { setLoadingComments(false) }
    }

    const saveComment = async () => {
        if (!newComment.trim() || !selectedCandidate) return
        setSavingComment(true)
        try {
            const csrfToken = await getFrappeCSRF()
            const sessionRes = await fetch(`${API_BASE_URL}/api/method/frappe.auth.get_logged_user`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
            const sessionData = await sessionRes.json()
            const loggedInUser = sessionData?.message || "Administrator"
            const res = await fetch(`${API_BASE_URL}/api/resource/Comment`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken }, body: JSON.stringify({ comment_type: "Comment", reference_doctype: "Job Applicant", reference_name: selectedCandidate.id, content: newComment.trim(), comment_by: loggedInUser }) })
            if (res.ok) { setNewComment(""); await fetchComments(selectedCandidate.id) }
        } catch (e) { console.error("Error saving comment:", e) }
        finally { setSavingComment(false) }
    }

    // useEffect(() => { fetchCandidates(); fetchLocations(), fetchJobTitles() }, [])
    useEffect(() => {
        const init = async () => {
            const titleMap = await fetchJobTitles()
            fetchCandidates(titleMap)
            fetchLocations()
        }
        init()
    }, [])

    useEffect(() => {
        if (searchFromUrl) setSearchTerm(searchFromUrl)
    }, [searchFromUrl])

    useEffect(() => { document.title = 'Candidates' }, [])
    // useEffect(() => { if (selectedCandidate) { fetchComments(selectedCandidate.id); setNewComment(""); setLocationSaved(false) } else { setComments([]) } }, [selectedCandidate?.id])
    useEffect(() => { if (selectedCandidate) { fetchComments(selectedCandidate.id); setNewComment(""); setLocationSaved(false); setJobTitleSaved(false) } else { setComments([]) } }, [selectedCandidate?.id])

    useEffect(() => {
        let filtered = candidates
        if (jobOpeningFilter) filtered = filtered.filter(c =>
            c.job_opening === jobOpeningFilter ||
            c.job_opening === jobTitleMap[jobOpeningFilter] ||
            c.job_title === jobOpeningFilter ||
            c.job_title === jobTitleMap[jobOpeningFilter]
        )
        if (searchTerm) filtered = filtered.filter(c => c.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email_id.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone_number.includes(searchTerm) || c.job_title.toLowerCase().includes(searchTerm.toLowerCase()))
        if (filterStatus !== "all") filtered = filtered.filter(c => c.status === filterStatus)
        if (filterDesignation !== "all") filtered = filtered.filter(c => c.designation === filterDesignation)
        if (filterStage !== "all") { if (filterStage === "completed") filtered = filtered.filter(c => c.stage_statuses?.find(s => s.stage_id === 'appointment_letter')?.status === 'completed'); else filtered = filtered.filter(c => { const ss = c.stage_statuses?.find(s => s.stage_id === filterStage); return ss?.status === 'completed' || ss?.status === 'in_progress' }) }
        setFilteredCandidates(filtered)
    }, [searchTerm, filterStatus, filterDesignation, filterStage, candidates, jobOpeningFilter])

    const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    useEffect(() => { setCurrentPage(1) }, [searchTerm, filterStatus, filterDesignation, filterStage, jobOpeningFilter])

    const getCurrentStage = (candidate: Candidate) => {
        if (!candidate.stage_statuses || candidate.stage_statuses.length === 0) return RECRUITMENT_STAGES[0]
        for (const stage of RECRUITMENT_STAGES) { const stageStatus = candidate.stage_statuses.find(s => s.stage_id === stage.id); if (!stageStatus || stageStatus.status === 'pending' || stageStatus.status === 'in_progress') return stage }
        return RECRUITMENT_STAGES[RECRUITMENT_STAGES.length - 1]
    }
    const calculateProgress = (candidate: Candidate): number => {
        if (!candidate.stage_statuses || candidate.stage_statuses.length === 0) return 0
        return (candidate.stage_statuses.filter(s => s.status === 'completed').length / RECRUITMENT_STAGES.length) * 100
    }
    const getStageStatusBadge = (status: string, stageId?: string) => {
        if (stageId === 'joining_confirmation') { if (status === 'completed') return <span className="cp-badge green"><CheckCircle size={10} /> Accepted</span>; if (status === 'rejected') return <span className="cp-badge red"><XCircle size={10} /> Not Accepted</span>; return <span className="cp-badge yellow"><Clock size={10} /> Pending</span> }
        if (status === 'completed') return <span className="cp-badge green"><CheckCircle size={10} /> Completed</span>
        if (status === 'in_progress') return <span className="cp-badge blue"><Clock size={10} /> In Progress</span>
        if (status === 'rejected') return <span className="cp-badge red"><XCircle size={10} /> Rejected</span>
        return <span className="cp-badge gray"><Clock size={10} /> Pending</span>
    }
    const getStageDotClass = (status: string) => { if (status === 'completed' || status === 'join') return 'completed'; if (status === 'in_progress') return 'in_progress'; if (status === 'rejected' || status === 'offer_revoked') return 'rejected'; if (status === 'not_join') return 'not_join'; return 'pending' }
    const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    const formatDate = (d: string) => { if (!d) return "N/A"; return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }
    const getCommentAuthor = (c: CandidateComment) => c.display_name?.trim() || c.comment_by?.trim() || "User"
    const getCommentInitials = (c: CandidateComment) => { const name = getCommentAuthor(c); return name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() }
    const formatCommentDate = (d: string) => { if (!d) return ""; const dt = new Date(d); return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + ' · ' + dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
    const getCurrentLocationValue = (candidate: Candidate) => candidate.custom_location || ""

    const uniqueDesignations = Array.from(new Set(candidates.map(c => c.designation).filter(d => d && d.trim() !== '')))
    const uniqueStatuses = Array.from(new Set(candidates.map(c => c.status).filter(s => s && s.trim() !== '')))

    const allCandidates = jobOpeningFilter ? candidates.filter(c => c.job_opening === jobOpeningFilter) : candidates
    const totalCandidates = allCandidates.length
    // const candidatesInInterview = allCandidates.filter(c => getCurrentStage(c)?.id === 'interview').length
    const candidatesInDocVerification = allCandidates.filter(c => c.stage_statuses?.find(s => s.stage_id === 'document_verification')?.status === 'completed').length
    const candidatesCompleted = allCandidates.filter(c => c.stage_statuses?.find(s => s.stage_id === 'appointment_letter')?.status === 'completed').length
    const candidatesInOfferLetter = allCandidates.filter(c => c.stage_statuses?.find(s => s.stage_id === 'offer_letter')?.status === 'completed').length
    const candidatesInJoining = allCandidates.filter(c => c.stage_statuses?.find(s => s.stage_id === 'joining_confirmation')?.status === 'completed').length
    const candidatesInAppointment = allCandidates.filter(c => c.stage_statuses?.find(s => s.stage_id === 'appointment_letter')?.status === 'completed').length

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
    ]

    if (isLoading && candidates.length === 0) {
        return (
            <div className="cp"><style>{css}</style>
                <div className="cp-loading"><div className="cp-spinner" /><p className="cp-loading-txt">Loading Candidates...</p></div>
            </div>
        )
    }

    return (
        <>
            <style>{css}</style>
            <div className="cp">
                <div className="cp-wrap">
                    <div className={`cp-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

                    {/* ══ SIDEBAR ══ */}
                    <aside className={`cp-sb${sidebarOpen ? "" : " collapsed"}`}>
                        <div className="cp-sb-brand">
                            <div className="cp-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
                            <div><div className="cp-sb-name">Job Management</div><div className="cp-sb-sub">HR Platform</div></div>
                            <button className="cp-sb-close" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
                        </div>
                        <nav className="cp-nav">
                            <Link href="/create-job" className="cp-nav-cta"><Plus size={14} /> New Job Opening</Link>
                            <div className="cp-nav-lbl">General</div>
                            <Link href="/home" className="cp-nav-link"><Home size={15} /> Home</Link>
                            <div className="cp-nav-lbl">Pipeline</div>
                            {sidebarPipeline.map(s => <Link key={s.href} href={s.href} className={`cp-nav-link${s.href === "/candidates" ? " active" : ""}`}>{s.icon} {s.title}</Link>)}
                            <div className="cp-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
                            {sidebarClosing.map(s => <Link key={s.href} href={s.href} className="cp-nav-link">{s.icon} {s.title}</Link>)}
                        </nav>
                        <div className="cp-sb-foot"><button className="cp-logout"><LogOut size={15} /> Sign out</button></div>
                    </aside>

                    {/* ══ MAIN ══ */}
                    <div className={`cp-main${sidebarOpen ? "" : " sb-closed"}`}>
                        <header className="cp-header">
                            <button className="cp-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
                            <div className="cp-hdr-sep" />
                            <Link href="/home" className="cp-btn-back"><ArrowLeft size={13} /> Back</Link>
                            <div className="cp-hdr-sep" />
                            {/* <div className="cp-crumb">
                                <Home size={13} /> Home <ChevronRight size={13} />
                                {jobOpeningFilter && <><Link href="/job-opening" style={{ color: 'var(--t3)', textDecoration: 'none' }}>Job Openings</Link><ChevronRight size={13} /></>}
                                <strong>Candidates</strong>
                            </div> */}
                            <div className="cp-crumb">
                                <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'inherit', textDecoration: 'none' }}>
                                    <Home size={13} /> Home
                                </Link>
                                <ChevronRight size={13} />
                                {jobOpeningFilter && <><Link href="/job-opening" style={{ color: 'var(--t3)', textDecoration: 'none' }}>Job Openings</Link><ChevronRight size={13} /></>}
                                <strong>Candidates</strong>
                            </div>
                        </header>

                        <div className="cp-page">
                            <div className="cp-toolbar">
                                <div>
                                    <h1 className="cp-page-title">Candidates Management</h1>
                                    <p className="cp-page-sub">Track candidates through each recruitment stage including joining confirmation</p>
                                </div>
                            </div>

                            {jobOpeningFilter && (
                                <div className="cp-job-filter-banner">
                                    <Briefcase size={15} />
                                    <span>Filtered by Job Opening: <span className="cp-job-filter-name">{jobOpeningFilter}</span></span>
                                    <button className="cp-job-filter-clear" onClick={() => router.push('/candidates')}><X size={12} /> Clear Filter</button>
                                </div>
                            )}

                            {apiError && (
                                <div className="cp-error"><AlertCircle size={16} /><div><div className="cp-error-title">API Connection Error</div><div className="cp-error-msg">{apiError}</div></div></div>
                            )}

                            {/* ══ STATS ══ */}
                            <div className="cp-stats">
                                {[
                                    { label: "Total Candidates", val: totalCandidates, cls: "blue", icon: <Users size={18} /> },
                                    // { label: "In Interview", val: candidatesInInterview, cls: "purple", icon: <Users size={18} /> },
                                    { label: "In Interview", val: pendingInterviewCount, cls: "purple", icon: <Users size={18} /> },
                                    { label: "Doc Verification", val: candidatesInDocVerification, cls: "orange", icon: <FileCheck size={18} /> },
                                    { label: "Completed", val: candidatesCompleted, cls: "green", icon: <CheckCircle size={18} /> },
                                    { label: "Offer Letter", val: candidatesInOfferLetter, cls: "indigo", icon: <Send size={18} /> },
                                    { label: "Joining Confirmation", val: candidatesInJoining, cls: "teal", icon: <UserPlus size={18} /> },
                                    { label: "Appointment Letter", val: candidatesInAppointment, cls: "pink", icon: <UserCheck size={18} /> },
                                ].map(s => (
                                    <div key={s.label} className="cp-stat">
                                        <div><div className="cp-stat-label">{s.label}</div><div className={`cp-stat-val ${s.cls}`}>{s.val}</div></div>
                                        <div className={`cp-stat-icon ${s.cls}`}>{s.icon}</div>
                                    </div>
                                ))}
                            </div>

                            {/* ══ SEARCH ══ */}
                            <div className="cp-search-wrap">
                                <div className="cp-search-inner">
                                    <Search size={16} />
                                    <input type="text" className="cp-search-input" placeholder="Search by name, email, phone, or job title..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                    {searchTerm && <button className="cp-search-clear" onClick={() => setSearchTerm("")}><X size={14} /></button>}
                                </div>
                            </div>

                            {/* ══ FILTERS ══ */}
                            <div className="cp-filters">
                                <div className="cp-select-wrap">
                                    <select className="cp-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                        <option value="all">All Statuses</option>
                                        {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <ChevronRight size={14} className="cp-select-arrow" />
                                </div>
                                <div className="cp-select-wrap">
                                    <select className="cp-select" value={filterDesignation} onChange={e => setFilterDesignation(e.target.value)}>
                                        <option value="all">All Designations</option>
                                        {uniqueDesignations.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <ChevronRight size={14} className="cp-select-arrow" />
                                </div>
                                <div className="cp-select-wrap">
                                    <select className="cp-select" value={filterStage} onChange={e => { setFilterStage(e.target.value); setSelectedCandidate(null); }}>
                                        <option value="all">All Stages</option>
                                        {RECRUITMENT_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                        <option value="completed">Completed</option>
                                    </select>
                                    <ChevronRight size={14} className="cp-select-arrow" />
                                </div>
                            </div>

                            {/* ══ CONTENT ══ */}
                            <div className="cp-content">
                                <div>
                                    {/* ══ 2-COL CARD GRID ══ */}
                                    <div className="cp-cards-grid">
                                        {filteredCandidates.length === 0 ? (
                                            <div className="cp-empty">
                                                <div className="cp-empty-icon"><Users size={28} /></div>
                                                <p className="cp-empty-title">No Candidates Found</p>
                                                <p className="cp-empty-sub">{jobOpeningFilter ? `No applicants found for ${jobOpeningFilter}` : searchTerm || filterStatus !== "all" || filterDesignation !== "all" ? "Try adjusting your filters" : "No candidates available"}</p>
                                            </div>
                                        ) : paginatedCandidates.map(candidate => {
                                            const currentStage = getCurrentStage(candidate)
                                            const progress = calculateProgress(candidate)
                                            const completedCount = candidate.stage_statuses?.filter(s => s.status === 'completed').length || 0
                                            return (
                                                <div
                                                    key={candidate.id}
                                                    className={`cp-job-card${selectedCandidate?.id === candidate.id ? " selected" : ""}`}
                                                    onClick={() => {
                                                        setSelectedCandidate(candidate);
                                                        if (window.innerWidth <= 1100) {
                                                            setTimeout(() => {
                                                                const panel = document.getElementById('cp-detail-panel');
                                                                if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                            }, 50);
                                                        }
                                                    }}
                                                >
                                                    <div className="cp-job-card-bg" />

                                                    {/* ── HEAD (identical to jol-card-head) ── */}
                                                    <div className="cp-card-head">
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                                                            <div className="cp-card-avatar">{getInitials(candidate.applicant_name)}</div>
                                                            <div className="cp-card-title-wrap">
                                                                <div className="cp-card-name">{candidate.applicant_name}</div>
                                                                <div className="cp-card-id">{candidate.id}</div>
                                                            </div>
                                                        </div>
                                                        <div className="cp-card-badges">
                                                            <span className={`cp-badge ${candidate.status === 'Open' ? 'open' : candidate.status === 'Closed' ? 'closed' : 'blue'}`}>{candidate.status}</span>
                                                            {candidate.fit_level && <span className="cp-badge purple">{candidate.fit_level}</span>}
                                                            {candidate.resume_score > 0 && <span className="cp-badge blue">{candidate.resume_score}%</span>}
                                                        </div>
                                                    </div>

                                                    <div className="cp-card-div" />

                                                    {/* ── ROWS (identical to jol-card-row) ── */}
                                                    <div className="cp-card-row">
                                                        <div className="cp-card-row-icon blue"><Users size={13} /></div>
                                                        <div><div className="cp-card-row-lbl">Designation</div><div className="cp-card-row-val">{candidate.designation || "Not Set"}</div></div>
                                                    </div>
                                                    <div className="cp-card-row">
                                                        <div className="cp-card-row-icon indigo"><Mail size={13} /></div>
                                                        <div><div className="cp-card-row-lbl">Email</div><div className="cp-card-row-val">{candidate.email_id || "Not Set"}</div></div>
                                                    </div>
                                                    <div className="cp-card-row">
                                                        <div className="cp-card-row-icon red"><Phone size={13} /></div>
                                                        <div><div className="cp-card-row-lbl">Phone</div><div className="cp-card-row-val">{candidate.phone_number || "Not Set"}</div></div>
                                                    </div>

                                                    <div className="cp-card-div" />

                                                    {/* ── PROGRESS (in slot of applicant chip) ── */}
                                                    <div className="cp-card-progress">
                                                        <div className="cp-card-progress-row">
                                                            <span className="cp-card-progress-label">Current Stage:</span>
                                                            <span className="cp-card-progress-stage">{currentStage.label}</span>
                                                        </div>
                                                        <div className="cp-card-progress-bg">
                                                            <div className="cp-card-progress-fill" style={{ width: `${progress}%` }} />
                                                        </div>
                                                        <div className="cp-card-progress-footer">
                                                            <span>{Math.round(progress)}% Complete</span>
                                                            <span>{completedCount}/{RECRUITMENT_STAGES.length} Stages</span>
                                                        </div>
                                                    </div>

                                                    <div style={{ height: 8 }} />

                                                    {/* ── FOOTER (identical to jol-card-foot) ── */}
                                                    <div className="cp-card-foot">
                                                        <div className="cp-card-date"><Calendar size={12} style={{ color: 'var(--accent)' }} />Applied: {formatDate(candidate.creation)}</div>
                                                        {/* <div className="cp-card-date"><Briefcase size={12} style={{ color: '#7c3aed' }} />{candidate.job_title || "No Title"}</div>
                                                         */}
                                                        <div className="cp-card-date"><Briefcase size={12} style={{ color: '#7c3aed' }} />{jobTitleMap[candidate.job_title] || candidate.job_title || "No Title"}</div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* ══ PAGINATION ══ */}
                                    {filteredCandidates.length > 0 && (
                                        <div className="cp-pagination">
                                            <span>Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredCandidates.length)} of {filteredCandidates.length} candidates</span>
                                            <div className="cp-pag-btns">
                                                <button className="cp-pag-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft size={13} /> Previous</button>
                                                <span className="cp-pag-cur">Page {currentPage} of {totalPages}</span>
                                                <button className="cp-pag-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next <ChevronRight size={13} /></button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* ══ RIGHT DETAIL PANEL ══ */}
                                <div className="cp-detail" id="cp-detail-panel">
                                    {selectedCandidate ? (
                                        <>
                                            <div className="cp-detail-hero">
                                                <div className="cp-detail-hero-head">
                                                    <Eye size={14} className="cp-detail-hero-icon" />
                                                    <span className="cp-detail-hero-title">Candidate Details</span>
                                                </div>
                                                <div className="cp-detail-avatar">{getInitials(selectedCandidate.applicant_name)}</div>
                                                <div className="cp-detail-name">{selectedCandidate.applicant_name}</div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                    <span className={`cp-badge ${selectedCandidate.status === 'Open' ? 'open' : 'blue'}`}>{selectedCandidate.status}</span>
                                                    {selectedCandidate.fit_level && <span className="cp-badge purple">{selectedCandidate.fit_level}</span>}
                                                </div>
                                                {/* <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                    <span className={`cp-badge ${selectedCandidate.status === 'Open' ? 'open' : 'blue'}`}>{selectedCandidate.status}</span>
                                                    {selectedCandidate.fit_level && <span className="cp-badge purple">{selectedCandidate.fit_level}</span>}
                                                </div> */}

                                                {/* ← INSERT PART A HERE */}
                                                {(selectedCandidate.custom_current_company || selectedCandidate.custom_total_experience) && (
                                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                                                        {selectedCandidate.custom_current_company && (
                                                            <span style={{
                                                                fontSize: 12, fontWeight: 700, color: '#fff',
                                                                background: 'rgba(255,255,255,0.13)', borderRadius: 6,
                                                                padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5
                                                            }}>
                                                                <Briefcase size={11} /> {selectedCandidate.custom_current_company}
                                                            </span>
                                                        )}
                                                        {selectedCandidate.custom_total_experience && (
                                                            <span style={{
                                                                fontSize: 12, fontWeight: 700, color: '#fff',
                                                                background: 'rgba(255,255,255,0.13)', borderRadius: 6,
                                                                padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5
                                                            }}>
                                                                <Clock size={11} /> {selectedCandidate.custom_total_experience}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="cp-detail-body">
                                                <div className="cp-detail-2col">
                                                    <div><div className="cp-detail-label"><Calendar size={11} /> Created</div><div className="cp-detail-val" style={{ fontSize: 12 }}>{formatDate(selectedCandidate.creation)}</div></div>
                                                    <div><div className="cp-detail-label"><Calendar size={11} /> Modified</div><div className="cp-detail-val" style={{ fontSize: 12 }}>{formatDate(selectedCandidate.modified)}</div></div>
                                                </div>
                                                {/* Created By — HR who added this candidate */}
                                                {selectedCandidate.owner && (
                                                    <div style={{
                                                        display: 'flex', alignItems: 'center', gap: 10,
                                                        padding: '10px 12px', borderRadius: 8,
                                                        background: 'linear-gradient(135deg, var(--accent-lt), #f0f8fe)',
                                                        border: '1px solid var(--accent-bdr)',
                                                        marginBottom: 2
                                                    }}>
                                                        <div style={{
                                                            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                                                            background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
                                                            color: '#fff', display: 'flex', alignItems: 'center',
                                                            justifyContent: 'center', fontSize: 13, fontWeight: 700
                                                        }}>
                                                            {selectedCandidate.owner.split('@')[0].charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--t3)', marginBottom: 2 }}>
                                                                Created By
                                                            </div>
                                                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
                                                                {selectedCandidate.owner.split('@')[0]}
                                                            </div>
                                                            <div style={{ fontSize: 11, color: 'var(--t3)' }}>
                                                                {selectedCandidate.owner}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div><div className="cp-detail-label"><Mail size={11} /> Email</div><div className="cp-detail-val" style={{ wordBreak: 'break-all' }}>{selectedCandidate.email_id}</div></div>
                                                <div><div className="cp-detail-label"><Phone size={11} /> Phone</div><div className="cp-detail-val">{selectedCandidate.phone_number}</div></div>
                                                {selectedCandidate.resume_attachment && (
                                                    <div>
                                                        <div className="cp-detail-label"><FileText size={11} /> Resume</div>
                                                        <a
                                                            href={`${API_BASE_URL}${selectedCandidate.resume_attachment}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: 8,
                                                                marginTop: 4, padding: '8px 12px', borderRadius: 8,
                                                                background: 'var(--bg)', border: '1px solid var(--border-s)',
                                                                fontSize: 12.5, fontWeight: 600, color: 'var(--accent)',
                                                                textDecoration: 'none', transition: 'all .14s',
                                                                wordBreak: 'break-all'
                                                            }}
                                                            onMouseOver={e => (e.currentTarget.style.background = 'var(--accent-lt)')}
                                                            onMouseOut={e => (e.currentTarget.style.background = 'var(--bg)')}
                                                        >
                                                            <Download size={13} style={{ flexShrink: 0 }} />
                                                            {selectedCandidate.resume_attachment.split('/').pop()}
                                                        </a>
                                                    </div>
                                                )}
                                                {/* <div><div className="cp-detail-label"><Briefcase size={11} /> Job Title</div><div className="cp-detail-val">{selectedCandidate.job_title}</div></div> */}

                                                <div>
                                                    <div className="cp-detail-label"><Briefcase size={11} /> Job Title</div>
                                                    <div className="cp-loc-wrap">
                                                        <select
                                                            className="cp-loc-select"
                                                            // value={selectedCandidate.job_title || ""}
                                                            value={jobTitleMap[selectedCandidate.job_title] || selectedCandidate.job_title || ""}
                                                            onChange={e => updateCandidateJobTitle(selectedCandidate.id, e.target.value)}
                                                            disabled={updatingJobTitle}
                                                        >
                                                            <option value="">— Select Job Title —</option>
                                                            {/* {selectedCandidate.job_title && !jobTitles.includes(selectedCandidate.job_title) && (
                                                                <option value={selectedCandidate.job_title}>{selectedCandidate.job_title}</option>
                                                            )} */}

                                                            {jobTitles.map(jt => <option key={jt} value={jt}>{jt}</option>)}
                                                        </select>
                                                        <ChevronRight size={13} className="cp-loc-arrow" />
                                                    </div>
                                                    {updatingJobTitle && <div className="cp-loc-saving"><div className="cp-loc-spin" /> Saving job title...</div>}
                                                    {jobTitleSaved && !updatingJobTitle && <div className="cp-loc-saved"><CheckCircle size={11} /> Job title saved</div>}
                                                </div>

                                                {selectedCandidate.designation && <div><div className="cp-detail-label"><Briefcase size={11} /> Designation</div><div className="cp-detail-val">{selectedCandidate.designation}</div></div>}
                                                {selectedCandidate.country && <div><div className="cp-detail-label"><Globe size={11} /> Country</div><div className="cp-detail-val">{selectedCandidate.country}</div></div>}
                                                <div>
                                                    <div className="cp-detail-label"><MapPin size={11} /> Location</div>
                                                    <div className="cp-loc-wrap">
                                                        <select className="cp-loc-select" value={getCurrentLocationValue(selectedCandidate)} onChange={e => updateCandidateLocation(selectedCandidate.id, e.target.value)} disabled={updatingLocation}>
                                                            <option value="">— Select Location —</option>
                                                            {getCurrentLocationValue(selectedCandidate) && !locations.includes(getCurrentLocationValue(selectedCandidate)) && <option value={getCurrentLocationValue(selectedCandidate)}>{getCurrentLocationValue(selectedCandidate)}</option>}
                                                            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                                        </select>
                                                        <ChevronRight size={13} className="cp-loc-arrow" />
                                                    </div>
                                                    {updatingLocation && <div className="cp-loc-saving"><div className="cp-loc-spin" /> Saving location...</div>}
                                                    {locationSaved && !updatingLocation && <div className="cp-loc-saved"><CheckCircle size={11} /> Location saved</div>}
                                                </div>
                                                {(selectedCandidate.address || selectedCandidate.custom_address) && <div><div className="cp-detail-label"><MapPinned size={11} /> Address</div><div className="cp-detail-val">{selectedCandidate.address || selectedCandidate.custom_address}</div></div>}
                                                {selectedCandidate.applicant_rating > 0 && (
                                                    <div>
                                                        <div className="cp-detail-label"><Star size={11} /> Rating</div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                                                            <span className="cp-detail-val">{(selectedCandidate.score / 100).toFixed(1)} / 1.0</span>
                                                            <div style={{ display: 'flex', gap: 2 }}>
                                                                {[1, 2, 3, 4, 5].map(star => {
                                                                    const ratingOutOf5 = Math.round((selectedCandidate.score / 100) * 5 * 2) / 2
                                                                    const fullStars = Math.floor(ratingOutOf5)
                                                                    const hasHalf = ratingOutOf5 - fullStars === 0.5
                                                                    const isFull = star <= fullStars
                                                                    const isHalf = !isFull && star === fullStars + 1 && hasHalf
                                                                    return (
                                                                        <div key={star} className="cp-star-wrap">
                                                                            <Star size={16} style={{ position: 'absolute', fill: '#e5e7eb', color: '#e5e7eb' }} />
                                                                            {(isFull || isHalf) && <div className="cp-star-fill-wrap" style={{ width: isFull ? '100%' : '50%' }}><Star size={16} style={{ fill: '#fbbf24', color: '#fbbf24' }} /></div>}
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {selectedCandidate.score > 0 && <div><div className="cp-detail-label">Score</div><div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>{selectedCandidate.score}</div></div>}
                                                {selectedCandidate.justification_by_ai && <div><div className="cp-detail-label">AI Justification</div><div className="cp-ai-box">{selectedCandidate.justification_by_ai}</div></div>}
                                                <div className="cp-detail-div" />
                                                <div>
                                                    <div className="cp-detail-label" style={{ marginBottom: 10 }}><MessageSquare size={11} /> Comments {comments.length > 0 ? `(${comments.length})` : ""}</div>
                                                    <div className="cp-comments-section">
                                                        {loadingComments && <div className="cp-comment-loading"><div className="cp-comment-spin" /> Loading comments...</div>}
                                                        {!loadingComments && comments.length === 0 && <p className="cp-comment-empty">No comments yet. Be the first to comment.</p>}
                                                        {!loadingComments && comments.map(c => (
                                                            <div key={c.name} className="cp-comment-item">
                                                                <div className="cp-comment-header">
                                                                    <div className="cp-comment-avatar">{getCommentInitials(c)}</div>
                                                                    <div className="cp-comment-meta"><span className="cp-comment-by">{getCommentAuthor(c)}</span><span className="cp-comment-time">{formatCommentDate(c.creation)}</span></div>
                                                                </div>
                                                                <div className="cp-comment-text" dangerouslySetInnerHTML={{ __html: c.content }} />
                                                            </div>
                                                        ))}
                                                        <div className="cp-comment-input-wrap">
                                                            <textarea className="cp-comment-textarea" placeholder="Type a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) saveComment() }} />
                                                            <button className="cp-comment-save" onClick={saveComment} disabled={savingComment || !newComment.trim()}>{savingComment ? "Saving..." : <><Send size={13} /> Add Comment</>}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="cp-detail-div" />
                                            </div>

                                            <div className="cp-detail-div" />
                                            <div className="cp-stage-section-title">Recruitment Stage Progress</div>
                                            <div className="cp-stages">
                                                {RECRUITMENT_STAGES.map((stage, index) => {
                                                    const StageIcon = stage.icon
                                                    const stageStatus = selectedCandidate.stage_statuses?.find(s => s.stage_id === stage.id)
                                                    const status = stageStatus?.status || 'pending'
                                                    const dotCls = getStageDotClass(status)
                                                    const isLast = index === RECRUITMENT_STAGES.length - 1
                                                    return (
                                                        <div key={stage.id} className="cp-stage-item">
                                                            <div className="cp-stage-left">
                                                                <div className={`cp-stage-dot ${dotCls}`}><StageIcon size={15} /></div>
                                                                {!isLast && <div className={`cp-stage-line ${dotCls === 'completed' ? 'done' : 'other'}`} />}
                                                            </div>
                                                            <div className="cp-stage-body">
                                                                <div className="cp-stage-row">
                                                                    <span className="cp-stage-name">{stage.label}</span>
                                                                    {getStageStatusBadge(status, stage.id)}
                                                                </div>
                                                                {stage.id === 'joining_confirmation' && (
                                                                    <div className="cp-joining-box">
                                                                        <div className="cp-joining-title">Joining Status:</div>
                                                                        <div className="cp-joining-option"><input type="checkbox" id={`join-${selectedCandidate.id}`} checked={status === 'completed'} onChange={async () => { await updateJoiningConfirmation(selectedCandidate.id, 'join') }} disabled={updatingJoiningStatus} /><label htmlFor={`join-${selectedCandidate.id}`}>Join (Status: Accepted)</label></div>
                                                                        <div className="cp-joining-option"><input type="checkbox" id={`not-join-${selectedCandidate.id}`} checked={status === 'pending'} onChange={async () => { await updateJoiningConfirmation(selectedCandidate.id, 'not_join') }} disabled={updatingJoiningStatus} /><label htmlFor={`not-join-${selectedCandidate.id}`}>Not Join (Status: Pending)</label></div>
                                                                        <div className="cp-joining-option"><input type="checkbox" id={`offer-revoked-${selectedCandidate.id}`} checked={status === 'rejected'} onChange={async () => { await updateJoiningConfirmation(selectedCandidate.id, 'offer_revoked') }} disabled={updatingJoiningStatus} /><label htmlFor={`offer-revoked-${selectedCandidate.id}`}>Offer Revoke (Not Accepted)</label></div>
                                                                        {status === 'completed' && (
                                                                            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-s)' }}>
                                                                                <div className="cp-detail-label" style={{ marginBottom: 4 }}><Calendar size={11} /> Date of Joining</div>
                                                                                <input
                                                                                    type="date"
                                                                                    value={selectedCandidate.custom_date_of_joining || ""}
                                                                                    onChange={e => updateJoiningDate(selectedCandidate.id, e.target.value)}
                                                                                    disabled={updatingJoinDate}
                                                                                    style={{
                                                                                        width: '100%', height: 36, padding: '0 10px', borderRadius: 7,
                                                                                        border: '1px solid var(--border)', background: '#fff',
                                                                                        fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'var(--t1)', outline: 'none'
                                                                                    }}
                                                                                />
                                                                                {updatingJoinDate && <div className="cp-loc-saving"><div className="cp-loc-spin" /> Saving date...</div>}
                                                                                {joinDateSaved && !updatingJoinDate && <div className="cp-loc-saved"><CheckCircle size={11} /> Date saved</div>}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div className="cp-detail-div" />
                                            <div className="cp-actions-title">Quick Actions</div>
                                            <div className="cp-actions">
                                                {(() => {
                                                    const isInterviewCompleted = selectedCandidate.stage_statuses?.find(s => s.stage_id === 'offer_letter')?.status === 'completed' && selectedCandidate.stage_statuses?.find(s => s.stage_id === 'joining_confirmation')?.status === 'completed' && selectedCandidate.stage_statuses?.find(s => s.stage_id === 'appointment_letter')?.status === 'completed'
                                                    const isFeedbackCompleted = selectedCandidate.stage_statuses?.find(s => s.stage_id === 'feedback')?.status === 'completed'
                                                    const isDocVerifyCompleted = selectedCandidate.stage_statuses?.find(s => s.stage_id === 'document_verification')?.status === 'completed'
                                                    const isOfferLetterCompleted = selectedCandidate.stage_statuses?.find(s => s.stage_id === 'offer_letter')?.status === 'completed'
                                                    const isAppointmentCompleted = selectedCandidate.stage_statuses?.find(s => s.stage_id === 'appointment_letter')?.status === 'completed'

                                                    return (
                                                        <>
                                                            {/* <button className="cp-action-btn" disabled={isInterviewCompleted} onClick={() => !isInterviewCompleted && router.push(`/interview?applicantId=${selectedCandidate.id}&jobOpening=${encodeURIComponent(selectedCandidate.job_opening || "")}`)}><Users size={14} /> Schedule Interview{isInterviewCompleted && <span className="cp-action-completed">(Completed)</span>}</button> */}
                                                            <button className="cp-action-btn" disabled={isInterviewCompleted}
                                                                onClick={() => !isInterviewCompleted && router.push(
                                                                    `/Event?applicantId=${selectedCandidate.id}&applicantName=${encodeURIComponent(selectedCandidate.applicant_name)}&applicantEmail=${encodeURIComponent(selectedCandidate.email_id)}&jobOpening=${encodeURIComponent(selectedCandidate.job_opening || "")}`
                                                                )}>
                                                                <Users size={14} /> Schedule Interview
                                                                {isInterviewCompleted && <span className="cp-action-completed">(Completed)</span>}
                                                            </button>
                                                            <button className="cp-action-btn" disabled={isFeedbackCompleted} onClick={() => !isFeedbackCompleted && router.push(`/candidate-feedback?candidateId=${selectedCandidate.id}`)}><ClipboardList size={14} /> Add Feedback{isFeedbackCompleted && <span className="cp-action-completed">(Completed)</span>}</button>
                                                            <button className="cp-action-btn" disabled={isDocVerifyCompleted} onClick={() => !isDocVerifyCompleted && router.push(`/document-verify?candidateId=${selectedCandidate.id}`)}><FileCheck size={14} /> Verify Documents{isDocVerifyCompleted && <span className="cp-action-completed">(Completed)</span>}</button>
                                                            <button
                                                                className="cp-action-btn"
                                                                onClick={async () => {
                                                                    try {
                                                                        const csrfToken = await getFrappeCSRF()
                                                                        const res = await fetch(`${API_BASE_URL}/api/method/resume.api.api.generate_document_link`, {
                                                                            method: 'POST',
                                                                            credentials: 'include',
                                                                            headers: {
                                                                                'Content-Type': 'application/json',
                                                                                'X-Frappe-CSRF-Token': csrfToken
                                                                            },
                                                                            body: JSON.stringify({ applicant_name: selectedCandidate.id })
                                                                        })
                                                                        const result = await res.json()
                                                                        if (result.message?.success) {
                                                                            alert("Document link email sent successfully!")
                                                                        } else {
                                                                            alert("Failed to send document link email.")
                                                                        }
                                                                    } catch (e) {
                                                                        alert("Error sending document link.")
                                                                    }
                                                                }}
                                                            >
                                                                <Send size={14} /> Send Document Link
                                                            </button>
                                                            <button className="cp-action-btn" disabled={isOfferLetterCompleted} onClick={() => !isOfferLetterCompleted && router.push(`/offer-letter?candidateId=${selectedCandidate.id}`)}><Send size={14} /> Send Offer Letter{isOfferLetterCompleted && <span className="cp-action-completed">(Completed)</span>}</button>
                                                            <button className="cp-action-btn" style={{ marginBottom: 4 }} disabled={isAppointmentCompleted} onClick={() => !isAppointmentCompleted && router.push(`/letter-appointment?candidateId=${selectedCandidate.id}`)}><Send size={14} /> Send Appointment Letter{isAppointmentCompleted && <span className="cp-action-completed">(Completed)</span>}</button>
                                                            {/* <button
                                                                className="cp-action-btn"
                                                                onClick={async () => {
                                                                    try {
                                                                        const csrfToken = await getFrappeCSRF()
                                                                        const res = await fetch(`${API_BASE_URL}/api/method/resume.api.api.generate_document_link`, {
                                                                            method: 'POST',
                                                                            credentials: 'include',
                                                                            headers: {
                                                                                'Content-Type': 'application/json',
                                                                                'X-Frappe-CSRF-Token': csrfToken
                                                                            },
                                                                            body: JSON.stringify({ applicant_name: selectedCandidate.id })
                                                                        })
                                                                        const result = await res.json()
                                                                        if (result.message?.success) {
                                                                            alert("Document link email sent successfully!")
                                                                        } else {
                                                                            alert("Failed to send document link email.")
                                                                        }
                                                                    } catch (e) {
                                                                        alert("Error sending document link.")
                                                                    }
                                                                }}
                                                            >
                                                                <Send size={14} /> Send Document Link
                                                            </button> */}
                                                        </>
                                                    )
                                                })()}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="cp-detail-empty">
                                            <div className="cp-detail-empty-icon"><Users size={26} /></div>
                                            <p className="cp-detail-empty-title">Select a Candidate</p>
                                            <p className="cp-detail-empty-sub">Choose a candidate to view their recruitment stage progress and details.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default function CandidatesPageWithJoining() {
    return (
        <Suspense fallback={
            <div className="cp"><style>{css}</style>
                <div className="cp-loading"><div className="cp-spinner" /><p className="cp-loading-txt">Loading Candidates...</p></div>
            </div>
        }>
            <CandidatesInner />
        </Suspense>
    )
}

