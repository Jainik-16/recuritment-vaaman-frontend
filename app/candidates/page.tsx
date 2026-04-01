"use client"
import { useState, useEffect } from "react"
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
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from '@/lib/api-config'
import { getFrappeCSRF } from "@/lib/csrf"

/* ─────────────────────────────────────────────────────────────
   CSS — same design tokens as Dashboard / Job Opening / Resume
───────────────────────────────────────────────────────────── */
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
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; flex-shrink: 0;
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

  /* Overlay — mobile only */
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
    height: 60px; background: #fff; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 1px 0 rgba(0,158,247,.08);
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
  .cp-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
  .cp-crumb svg { width: 13px; height: 13px; }
  .cp-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }
  .cp-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }

  /* ══ BUTTONS ══ */
  .cp-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: 8px;
    background: var(--accent); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
    border: none; cursor: pointer; text-decoration: none; white-space: nowrap;
    transition: background .15s;
  }
  .cp-btn:hover:not(:disabled) { background: var(--accent-h); }
  .cp-btn:disabled { opacity: .5; cursor: not-allowed; }

  .cp-btn-out {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 14px; border-radius: 8px;
    background: transparent; color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer; text-decoration: none;
    transition: all .14s; white-space: nowrap;
  }
  .cp-btn-out:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

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
  .cp-page { padding: 28px 32px; display: flex; flex-direction: column; gap: 22px; }
  .cp-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
  .cp-page-title { font-size: 21px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; line-height: 1.15; }
  .cp-page-sub   { font-size: 13px; color: var(--t3); margin-top: 5px; font-weight: 400; }

  /* ══ ERROR ══ */
  .cp-error {
    background: var(--red-lt); border: 1px solid var(--red-bdr);
    border-radius: 10px; padding: 14px 16px;
    display: flex; align-items: flex-start; gap: 10px;
  }
  .cp-error svg { color: var(--red); flex-shrink: 0; margin-top: 1px; }
  .cp-error-title { font-size: 13px; font-weight: 700; color: #7f1d1d; }
  .cp-error-msg   { font-size: 12.5px; color: #991b1b; margin-top: 2px; }

  /* ══ STAT GRID ══ */
  .cp-stats { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; }
  .cp-stat {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 8px;
    box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }
  .cp-stat-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 6px; }
  .cp-stat-label { font-size: 11px; color: var(--t3); font-weight: 500; line-height: 1.3; }
  .cp-stat-icon { width: 34px; height: 34px; min-width: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .cp-stat-val { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; line-height: 1; }

  .cp-stat-val.blue   { color: var(--accent); }   .cp-stat-icon.blue   { background: var(--accent-lt); color: var(--accent); }
  .cp-stat-val.purple { color: #7c3aed; }          .cp-stat-icon.purple { background: #ede9fe; color: #7c3aed; }
  .cp-stat-val.orange { color: #ea580c; }          .cp-stat-icon.orange { background: #fff7ed; color: #ea580c; }
  .cp-stat-val.green  { color: var(--green); }     .cp-stat-icon.green  { background: var(--green-lt); color: var(--green); }
  .cp-stat-val.indigo { color: #4f46e5; }          .cp-stat-icon.indigo { background: #e0e7ff; color: #4f46e5; }
  .cp-stat-val.teal   { color: #0d9488; }          .cp-stat-icon.teal   { background: #f0fdfa; color: #0d9488; }
  .cp-stat-val.pink   { color: #db2777; }          .cp-stat-icon.pink   { background: #fdf2f8; color: #db2777; }

  /* ══ LAYOUT ══ */
  .cp-layout { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }

  /* ══ PANEL ══ */
  .cp-panel {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 12px; overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .cp-panel-head { padding: 16px 20px; border-bottom: 1px solid var(--border-s); display: flex; flex-direction: column; gap: 12px; }
  .cp-panel-title-row { display: flex; align-items: center; gap: 8px; }
  .cp-panel-title { font-size: 14px; font-weight: 700; color: var(--t1); }

  /* ══ SEARCH ══ */
  .cp-search-wrap { position: relative; }
  .cp-search-wrap > svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--t3); width: 15px; height: 15px; pointer-events: none; }
  .cp-search {
    width: 100%; height: 42px; padding: 0 14px 0 40px;
    border: 1px solid var(--border); border-radius: 8px;
    background: var(--bg); font-family: 'Inter', sans-serif;
    font-size: 13px; color: var(--t1); outline: none; transition: all .15s;
  }
  .cp-search::placeholder { color: var(--t3); }
  .cp-search:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }

  /* ══ FILTERS ══ */
  .cp-filter-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .cp-select-wrap { position: relative; }
  .cp-select-arrow { position: absolute; right: 11px; top: 50%; transform: translateY(-50%) rotate(90deg); color: var(--t3); pointer-events: none; width: 13px; height: 13px; }
  .cp-select {
    width: 100%; height: 40px; padding: 0 32px 0 13px;
    border: 1px solid var(--border); border-radius: 8px;
    background: var(--bg); font-family: 'Inter', sans-serif;
    font-size: 12.5px; color: var(--t2); appearance: none;
    outline: none; cursor: pointer; transition: all .15s;
  }
  .cp-select:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }

  /* ══ CANDIDATE CARDS ══ */
  .cp-cards { display: flex; flex-direction: column; gap: 10px; padding: 16px 20px; }
  .cp-candidate-card {
    background: var(--bg); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 14px 16px; cursor: pointer;
    transition: box-shadow .15s, transform .15s, border-color .15s;
  }
  .cp-candidate-card:hover { box-shadow: 0 6px 18px rgba(0,158,247,.12); transform: translateY(-1px); border-color: rgba(0,158,247,.35); }
  .cp-candidate-card.selected { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.15); background: var(--card); }

  .cp-avatar {
    width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), #7c3aed);
    color: #fff; display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; box-shadow: 0 4px 10px rgba(0,158,247,.25);
  }
  .cp-card-top { display: flex; align-items: flex-start; gap: 12px; }
  .cp-card-info { flex: 1; min-width: 0; }
  .cp-card-name { font-size: 14px; font-weight: 700; color: var(--t1); letter-spacing: -0.1px; }
  .cp-card-meta { font-size: 12px; color: var(--t3); margin-top: 2px; display: flex; align-items: center; gap: 5px; }
  .cp-card-meta svg { width: 11px; height: 11px; flex-shrink: 0; }
  .cp-card-contacts { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 6px; }
  .cp-card-contact { font-size: 11.5px; color: var(--t3); display: flex; align-items: center; gap: 5px; }
  .cp-card-contact svg { width: 11px; height: 11px; flex-shrink: 0; }
  .cp-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }

  /* badges */
  .cp-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .cp-badge.blue   { background: var(--accent-lt); color: var(--accent); border: 1px solid var(--border); }
  .cp-badge.green  { background: var(--green-lt); color: var(--green); border: 1px solid var(--green-bdr); }
  .cp-badge.red    { background: var(--red-lt); color: var(--red); border: 1px solid var(--red-bdr); }
  .cp-badge.yellow { background: var(--yellow-lt); color: var(--yellow); border: 1px solid var(--yellow-bdr); }
  .cp-badge.gray   { background: var(--border-s); color: var(--t2); border: 1px solid var(--border); }
  .cp-badge.purple { background: #ede9fe; color: #7c3aed; border: 1px solid #ddd6fe; }

  .cp-score { font-size: 13px; font-weight: 700; color: var(--green); }

  /* progress in card */
  .cp-progress-section { margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border-s); }
  .cp-progress-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
  .cp-progress-label { font-size: 12px; color: var(--t3); }
  .cp-progress-stage { font-size: 12px; font-weight: 600; color: var(--accent); }
  .cp-progress-bar-bg { width: 100%; height: 5px; background: var(--border-s); border-radius: 99px; overflow: hidden; }
  .cp-progress-bar-fill { height: 100%; background: var(--accent); border-radius: 99px; transition: width .3s; }
  .cp-progress-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
  .cp-progress-pct { font-size: 11px; color: var(--t3); }

  /* empty */
  .cp-empty { padding: 48px 20px; text-align: center; }
  .cp-empty-icon { width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 14px; background: var(--accent-lt); color: var(--accent); display: flex; align-items: center; justify-content: center; }
  .cp-empty-title { font-size: 14px; font-weight: 700; color: var(--t1); margin-bottom: 5px; }
  .cp-empty-sub   { font-size: 12.5px; color: var(--t3); }

  /* pagination */
  .cp-pagination { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-top: 1px solid var(--border-s); font-size: 12.5px; color: var(--t3); }
  .cp-pag-btns { display: flex; align-items: center; gap: 8px; }
  .cp-pag-cur { font-size: 12.5px; font-weight: 600; color: var(--t1); }

  /* ══ DETAIL PANEL ══ */
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

  /* download */
  .cp-download { display: flex; align-items: center; justify-content: center; gap: 7px; width: 100%; padding: 10px; border-radius: 8px; background: var(--accent); color: #fff; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: background .15s; }
  .cp-download:hover { background: var(--accent-h); }

  /* ══ STAGE PROGRESS ══ */
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

  /* joining checkboxes */
  .cp-joining-box { background: var(--accent-lt); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; margin-top: 8px; }
  .cp-joining-title { font-size: 12px; font-weight: 700; color: var(--t2); margin-bottom: 8px; }
  .cp-joining-option { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; cursor: pointer; }
  .cp-joining-option:last-child { margin-bottom: 0; }
  .cp-joining-option input[type="checkbox"] { width: 14px; height: 14px; accent-color: var(--accent); cursor: pointer; }
  .cp-joining-option label { font-size: 12.5px; font-weight: 500; color: var(--t2); cursor: pointer; }

  /* ══ QUICK ACTIONS ══ */
  .cp-actions-title { font-size: 13px; font-weight: 700; color: var(--t1); padding: 14px 18px 0; margin-bottom: 10px; }
  .cp-actions { padding: 0 18px 18px; display: flex; flex-direction: column; gap: 8px; }
  .cp-action-btn {
    display: flex; align-items: center; gap: 9px;
    padding: 10px 14px; border-radius: 8px;
    background: var(--bg); border: 1px solid var(--border-s);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--t2); cursor: pointer; transition: all .14s; text-align: left; width: 100%;
  }
  .cp-action-btn:hover:not(:disabled) { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .cp-action-btn:disabled { opacity: .5; cursor: not-allowed; }
  .cp-action-btn svg { width: 14px; height: 14px; flex-shrink: 0; }
  .cp-action-completed { margin-left: auto; font-size: 11px; color: var(--red); font-weight: 500; }

  /* detail empty */
  .cp-detail-empty { padding: 48px 20px; text-align: center; }
  .cp-detail-empty-icon { width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 14px; background: var(--accent-lt); color: var(--accent); display: flex; align-items: center; justify-content: center; }
  .cp-detail-empty-title { font-size: 14px; font-weight: 700; color: var(--t1); margin-bottom: 4px; }
  .cp-detail-empty-sub   { font-size: 12.5px; color: var(--t3); }

  /* loading */
  .cp-loading { min-height: 100vh; background: var(--bg); display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 16px; }
  .cp-spinner { width: 44px; height: 44px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent); animation: cp-spin .7s linear infinite; }
  @keyframes cp-spin { to { transform: rotate(360deg); } }
  .cp-loading-txt { font-size: 14px; color: var(--t3); font-weight: 500; }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 1280px) { .cp-stats { grid-template-columns: repeat(4, 1fr); } }
  @media (max-width: 1100px) { .cp-layout { grid-template-columns: 1fr; } .cp-detail { position: static; max-height: none; } }
  @media (max-width: 900px)  { .cp-stats { grid-template-columns: repeat(2, 1fr); } .cp-filter-row { grid-template-columns: 1fr; } .cp-card-contacts { grid-template-columns: 1fr; } }
  @media (max-width: 768px)  {
    .cp-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .cp-sb.open { transform: translateX(0); }
    .cp-main { margin-left: 0 !important; }
    .cp-page { padding: 16px; }
    .cp-header { padding: 0 16px; }
    .cp-stats { grid-template-columns: repeat(2, 1fr); }
  }
`

// ── RECRUITMENT STAGES — unchanged ──────────────────────────
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

interface Candidate {
    id: string; name: string; applicant_name: string; email_id: string; phone_number: string
    job_title: string; designation: string; status: string; country: string; location: string
    address: string; custom_location: string; custom_address: string; source: string; notes: string
    resume_link: string; cover_letter: string; creation: string; modified: string
    resume_score?: number; custom_recruitment_stage?: string
    stage_statuses?: CandidateStageStatus[]
    justification_by_ai?: string; applicant_rating?: number; fit_level?: string; score?: number
}

export default function CandidatesPageWithJoining() {
    const router = useRouter()
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
    const [updatingJoiningStatus, setUpdatingJoiningStatus] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [filterDesignation, setFilterDesignation] = useState("all")
    const [filterStage, setFilterStage] = useState("all")

    const ITEMS_PER_PAGE = 10
    const [currentPage, setCurrentPage] = useState(1)

    // ── ALL ORIGINAL LOGIC UNCHANGED ────────────────────────
    const fetchCandidates = async () => {
        setIsLoading(true)
        setApiError(null)
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/resource/Job Applicant/?fields=["*"]&limit_page_length=0&order_by=creation desc`,
                { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
            )
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            const data = await response.json()
            if (data && data.data) {
                const mappedData = await Promise.all(data.data.map(async (item: any) => {
                    const stageStatuses = await fetchCandidateStageStatuses(item.name)
                    return {
                        id: item.name || item.id, name: item.name || item.id,
                        applicant_name: item.applicant_name || "Unknown",
                        email_id: item.email_id || "", phone_number: item.phone_number || "",
                        job_title: item.job_title || "Not specified", designation: item.designation || "",
                        status: item.status || "Open", country: item.country || "",
                        location: item.location || "", address: item.address || "",
                        custom_location: item.custom_location || "", custom_address: item.custom_address || "",
                        source: item.source || "", notes: item.notes || "",
                        resume_link: item.resume_link || "", cover_letter: item.cover_letter || "",
                        creation: item.creation || new Date().toISOString(),
                        modified: item.modified || new Date().toISOString(),
                        resume_score: item.resume_score || 0,
                        custom_recruitment_stage: item.custom_recruitment_stage || "",
                        stage_statuses: stageStatuses,
                        justification_by_ai: item.justification_by_ai || "",
                        applicant_rating: item.applicant_rating || 0,
                        fit_level: item.fit_level || "", score: item.score || 0,
                    }
                }))
                setCandidates(mappedData)
                setFilteredCandidates(mappedData)
            }
        } catch (error: any) {
            console.error("Error fetching candidates:", error)
            setApiError("Network error: Unable to reach server. Please check if the API server is running.")
        } finally { setIsLoading(false) }
    }

    const fetchCandidateStageStatuses = async (candidateId: string): Promise<CandidateStageStatus[]> => {
        try {
            const statuses: CandidateStageStatus[] = []

            const interviewResponse = await fetch(`${API_BASE_URL}/api/resource/Interview?filters=[["job_applicant","=","${candidateId}"]]&fields=["status","scheduled_on"]`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } }).catch(() => null)
            if (interviewResponse && interviewResponse.ok) {
                const interviewData = await interviewResponse.json()
                const hasCompletedInterview = interviewData.data?.some((i: any) => i.status === "Completed" || i.status === "Cleared")
                statuses.push({ stage_id: 'interview', status: hasCompletedInterview ? 'completed' : 'in_progress', completed_date: hasCompletedInterview ? interviewData.data[0]?.scheduled_on : undefined })
            } else { statuses.push({ stage_id: 'interview', status: 'pending' }) }

            const feedbackResponse = await fetch(`${API_BASE_URL}/api/resource/Interview Feedback?filters=[["job_applicant","=","${candidateId}"]]`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } }).catch(() => null)
            if (feedbackResponse && feedbackResponse.ok) { const feedbackData = await feedbackResponse.json(); statuses.push({ stage_id: 'feedback', status: feedbackData.data?.length > 0 ? 'completed' : 'pending' }) }
            else { statuses.push({ stage_id: 'feedback', status: 'pending' }) }

            const docResponse = await fetch(`${API_BASE_URL}/api/resource/Applicant Document?filters=[["applicant_name","=","${candidateId}"]]`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } }).catch(() => null)
            if (docResponse && docResponse.ok) { const docData = await docResponse.json(); statuses.push({ stage_id: 'document_verification', status: docData.data?.length > 0 ? 'completed' : 'pending' }) }
            else { statuses.push({ stage_id: 'document_verification', status: 'pending' }) }

            const offerResponse = await fetch(`${API_BASE_URL}/api/resource/Job Offer?filters=[["job_applicant","=","${candidateId}"]]`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } }).catch(() => null)
            if (offerResponse && offerResponse.ok) { const offerData = await offerResponse.json(); statuses.push({ stage_id: 'offer_letter', status: offerData.data?.length > 0 ? 'completed' : 'pending' }) }
            else { statuses.push({ stage_id: 'offer_letter', status: 'pending' }) }

            const joiningResponse = await fetch(`${API_BASE_URL}/api/resource/Joining Confirmation?filters=[["candidate_id","=","${candidateId}"]]&fields=["*"]`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } }).catch(() => null)
            if (joiningResponse && joiningResponse.ok) {
                const joiningData = await joiningResponse.json()
                if (joiningData.data && joiningData.data.length > 0) {
                    const joining = joiningData.data[0]
                    let joiningStatus: any = 'pending'
                    if (joining.join === 1) joiningStatus = 'completed'
                    else if (joining.not_join === 1) joiningStatus = 'pending'
                    else if (joining.offer_revoked === 1) joiningStatus = 'rejected'
                    statuses.push({ stage_id: 'joining_confirmation', status: joiningStatus, completed_date: joining.modified })
                } else { statuses.push({ stage_id: 'joining_confirmation', status: 'pending' }) }
            } else { statuses.push({ stage_id: 'joining_confirmation', status: 'pending' }) }

            const appointmentResponse = await fetch(`${API_BASE_URL}/api/resource/Appointment Letter?filters=[["job_applicant","=","${candidateId}"]]`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } }).catch(() => null)
            if (appointmentResponse && appointmentResponse.ok) { const appointmentData = await appointmentResponse.json(); statuses.push({ stage_id: 'appointment_letter', status: appointmentData.data?.length > 0 ? 'completed' : 'pending' }) }
            else { statuses.push({ stage_id: 'appointment_letter', status: 'pending' }) }

            return statuses
        } catch (error) { console.error("Error fetching stage statuses:", error); return [] }
    }

    const updateJoiningConfirmation = async (candidateId: string, statusType: 'join' | 'not_join' | 'offer_revoked') => {
        setUpdatingJoiningStatus(true)
        const csrfToken = await getFrappeCSRF()
        try {
            if (selectedCandidate?.id === candidateId) {
                const newStatus = statusType === 'join' ? 'completed' : statusType === 'not_join' ? 'pending' : 'rejected'
                const updatedStageStatuses = selectedCandidate.stage_statuses?.map(s => s.stage_id === 'joining_confirmation' ? { ...s, status: newStatus as any } : s) || []
                setSelectedCandidate({ ...selectedCandidate, stage_statuses: updatedStageStatuses })
            }
            const response = await fetch(`${API_BASE_URL}/api/method/resume.api.candidate.update_joining_confirmation`, {
                method: "POST", credentials: "include",
                headers: { 'Content-Type': 'application/json', "X-Frappe-CSRF-Token": csrfToken },
                body: JSON.stringify({ candidate_id: candidateId, status_type: statusType })
            })
            if (!response.ok) {
                if (response.status === 403) throw new Error("Permission denied. Please check your permissions")
                else if (response.status === 401) throw new Error("Authentication required. Please log in to Frappe")
                else if (response.status === 417) throw new Error("Request validation failed. Please try again")
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const result = await response.json()
            if (result.message?.success) {
                await fetchCandidates()
                setTimeout(() => {
                    setCandidates((latestCandidates) => {
                        const updatedCandidate = latestCandidates.find(c => c.id === candidateId)
                        if (updatedCandidate && selectedCandidate?.id === candidateId) setSelectedCandidate(updatedCandidate)
                        return latestCandidates
                    })
                }, 100)
                alert("Joining confirmation updated successfully!")
            } else {
                const errorMessage = result.message || result.exception || "Failed to update joining confirmation"
                console.error("❌ API Error:", errorMessage)
                alert(`Error: ${errorMessage}`)
                await fetchCandidates()
            }
        } catch (error: any) {
            console.error("Error updating joining confirmation:", error)
            alert(`Error: ${error.message || "Failed to update joining confirmation"}`)
            await fetchCandidates()
            setTimeout(() => {
                setCandidates((latestCandidates) => {
                    const originalCandidate = latestCandidates.find(c => c.id === candidateId)
                    if (originalCandidate && selectedCandidate?.id === candidateId) setSelectedCandidate(originalCandidate)
                    return latestCandidates
                })
            }, 100)
        } finally { setUpdatingJoiningStatus(false) }
    }

    useEffect(() => { fetchCandidates() }, [])
    useEffect(() => { document.title = 'Candidates' }, [])

    useEffect(() => {
        let filtered = candidates
        if (searchTerm) filtered = filtered.filter(c => c.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email_id.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone_number.includes(searchTerm) || c.job_title.toLowerCase().includes(searchTerm.toLowerCase()))
        if (filterStatus !== "all") filtered = filtered.filter(c => c.status === filterStatus)
        if (filterDesignation !== "all") filtered = filtered.filter(c => c.designation === filterDesignation)
        if (filterStage !== "all") {
            if (filterStage === "completed") filtered = filtered.filter(c => c.stage_statuses?.find(s => s.stage_id === 'appointment_letter')?.status === 'completed')
            else filtered = filtered.filter(c => { const ss = c.stage_statuses?.find(s => s.stage_id === filterStage); return ss?.status === 'completed' || ss?.status === 'in_progress' })
        }
        setFilteredCandidates(filtered)
    }, [searchTerm, filterStatus, filterDesignation, filterStage, candidates])

    const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex)
    useEffect(() => { setCurrentPage(1) }, [searchTerm, filterStatus, filterDesignation, filterStage])

    const getCurrentStage = (candidate: Candidate) => {
        if (!candidate.stage_statuses || candidate.stage_statuses.length === 0) return RECRUITMENT_STAGES[0]
        for (const stage of RECRUITMENT_STAGES) {
            const stageStatus = candidate.stage_statuses.find(s => s.stage_id === stage.id)
            if (!stageStatus || stageStatus.status === 'pending' || stageStatus.status === 'in_progress') return stage
        }
        return RECRUITMENT_STAGES[RECRUITMENT_STAGES.length - 1]
    }

    const calculateProgress = (candidate: Candidate): number => {
        if (!candidate.stage_statuses || candidate.stage_statuses.length === 0) return 0
        const completedStages = candidate.stage_statuses.filter(s => s.status === 'completed').length
        return (completedStages / RECRUITMENT_STAGES.length) * 100
    }

    const getStageStatusBadge = (status: string, stageId?: string) => {
        if (stageId === 'joining_confirmation') {
            if (status === 'completed') return <span className="cp-badge green"><CheckCircle size={10} /> Accepted</span>
            if (status === 'rejected') return <span className="cp-badge red"><XCircle size={10} /> Not Accepted</span>
            return <span className="cp-badge yellow"><Clock size={10} /> Pending</span>
        }
        if (status === 'completed') return <span className="cp-badge green"><CheckCircle size={10} /> Completed</span>
        if (status === 'in_progress') return <span className="cp-badge blue"><Clock size={10} /> In Progress</span>
        if (status === 'rejected') return <span className="cp-badge red"><XCircle size={10} /> Rejected</span>
        return <span className="cp-badge gray"><Clock size={10} /> Pending</span>
    }

    const getStageDotClass = (status: string) => {
        if (status === 'completed' || status === 'join') return 'completed'
        if (status === 'in_progress') return 'in_progress'
        if (status === 'rejected' || status === 'offer_revoked') return 'rejected'
        if (status === 'not_join') return 'not_join'
        return 'pending'
    }

    const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    const uniqueDesignations = Array.from(new Set(candidates.map(c => c.designation).filter(d => d && d.trim() !== '')))
    const uniqueStatuses = Array.from(new Set(candidates.map(c => c.status).filter(s => s && s.trim() !== '')))

    const totalCandidates = candidates.length
    const candidatesInInterview = candidates.filter(c => getCurrentStage(c)?.id === 'interview').length
    const candidatesInDocVerification = candidates.filter(c => c.stage_statuses?.find(s => s.stage_id === 'document_verification')?.status === 'completed').length
    const candidatesCompleted = candidates.filter(c => c.stage_statuses?.find(s => s.stage_id === 'appointment_letter')?.status === 'completed').length
    const candidatesInOfferLetter = candidates.filter(c => c.stage_statuses?.find(s => s.stage_id === 'offer_letter')?.status === 'completed').length
    const candidatesInJoining = candidates.filter(c => c.stage_statuses?.find(s => s.stage_id === 'joining_confirmation')?.status === 'completed').length
    const candidatesInAppointment = candidates.filter(c => c.stage_statuses?.find(s => s.stage_id === 'appointment_letter')?.status === 'completed').length
    // ────────────────────────────────────────────────────────

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
            <div className="cp">
                <style>{css}</style>
                <div className="cp-loading">
                    <div className="cp-spinner" />
                    <p className="cp-loading-txt">Loading Candidates...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <style>{css}</style>
            <div className="cp">
                <div className="cp-wrap">

                    {/* Overlay — mobile only */}
                    <div className={`cp-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

                    {/* ══ SIDEBAR ══ */}
                    <aside className={`cp-sb${sidebarOpen ? "" : " collapsed"}`}>
                        <div className="cp-sb-brand">
                            <div className="cp-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
                            <div>
                                <div className="cp-sb-name">Job Management</div>
                                <div className="cp-sb-sub">HR Platform</div>
                            </div>
                            <button className="cp-sb-close" onClick={() => setSidebarOpen(false)}>
                                <X size={15} />
                            </button>
                        </div>
                        <nav className="cp-nav">
                            <Link href="/create-job" className="cp-nav-cta">
                                <Plus size={14} /> New Job Opening
                            </Link>
                            <div className="cp-nav-lbl">Pipeline</div>
                            {sidebarPipeline.map(s => (
                                <Link key={s.href} href={s.href}
                                    className={`cp-nav-link${s.href === "/candidates" ? " active" : ""}`}>
                                    {s.icon} {s.title}
                                </Link>
                            ))}
                            <div className="cp-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
                            {sidebarClosing.map(s => (
                                <Link key={s.href} href={s.href} className="cp-nav-link">
                                    {s.icon} {s.title}
                                </Link>
                            ))}
                        </nav>
                        <div className="cp-sb-foot">
                            <button className="cp-logout"><LogOut size={15} /> Sign out</button>
                        </div>
                    </aside>

                    {/* ══ MAIN ══ */}
                    <div className={`cp-main${sidebarOpen ? "" : " sb-closed"}`}>

                        {/* Header */}
                        <header className="cp-header">
                            <button className="cp-toggle" onClick={() => setSidebarOpen(o => !o)}>
                                <Menu size={16} />
                            </button>
                            <div className="cp-hdr-sep" />
                            <Link href="/home" className="cp-btn-back">
                                <ArrowLeft size={13} /> Back
                            </Link>
                            <div className="cp-hdr-sep" />
                            <div className="cp-crumb">
                                <Home size={13} /> Home
                                <ChevronRight size={13} />
                                <strong>Candidates</strong>
                            </div>
                        </header>

                        {/* Page */}
                        <div className="cp-page">

                            {/* Title */}
                            <div className="cp-toolbar">
                                <div>
                                    <h1 className="cp-page-title">Candidates Management</h1>
                                    <p className="cp-page-sub">Track candidates through each recruitment stage including joining confirmation</p>
                                </div>
                            </div>

                            {/* Error */}
                            {apiError && (
                                <div className="cp-error">
                                    <AlertCircle size={16} />
                                    <div>
                                        <div className="cp-error-title">API Connection Error</div>
                                        <div className="cp-error-msg">{apiError}</div>
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="cp-stats">
                                {[
                                    { label: "Total Candidates", val: totalCandidates, cls: "blue", icon: <Users size={16} /> },
                                    { label: "In Interview", val: candidatesInInterview, cls: "purple", icon: <Users size={16} /> },
                                    { label: "Doc Verification", val: candidatesInDocVerification, cls: "orange", icon: <FileCheck size={16} /> },
                                    { label: "Completed", val: candidatesCompleted, cls: "green", icon: <CheckCircle size={16} /> },
                                    { label: "Offer Letter", val: candidatesInOfferLetter, cls: "indigo", icon: <Send size={16} /> },
                                    { label: "Joining Confirmation", val: candidatesInJoining, cls: "teal", icon: <UserPlus size={16} /> },
                                    { label: "Appointment Letter", val: candidatesInAppointment, cls: "pink", icon: <UserCheck size={16} /> },
                                ].map(s => (
                                    <div key={s.label} className="cp-stat">
                                        <div className="cp-stat-top">
                                            <div className="cp-stat-label">{s.label}</div>
                                            <div className={`cp-stat-icon ${s.cls}`}>{s.icon}</div>
                                        </div>
                                        <div className={`cp-stat-val ${s.cls}`}>{s.val}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Layout */}
                            <div className="cp-layout">

                                {/* LEFT — candidate list */}
                                <div className="cp-panel">
                                    <div className="cp-panel-head">
                                        <div className="cp-panel-title-row">
                                            <Users size={15} style={{ color: 'var(--accent)' }} />
                                            <span className="cp-panel-title">Candidates ({filteredCandidates.length})</span>
                                        </div>
                                        {/* Search */}
                                        <div className="cp-search-wrap">
                                            <Search size={15} />
                                            <input
                                                type="text"
                                                className="cp-search"
                                                placeholder="Search by name, email, phone, or job title..."
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        {/* Filters */}
                                        <div className="cp-filter-row">
                                            <div className="cp-select-wrap">
                                                <select className="cp-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                                    <option value="all">All Status</option>
                                                    {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                <ChevronRight size={13} className="cp-select-arrow" />
                                            </div>
                                            <div className="cp-select-wrap">
                                                <select className="cp-select" value={filterDesignation} onChange={e => setFilterDesignation(e.target.value)}>
                                                    <option value="all">All Designations</option>
                                                    {uniqueDesignations.map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                                <ChevronRight size={13} className="cp-select-arrow" />
                                            </div>
                                            <div className="cp-select-wrap">
                                                <select className="cp-select" value={filterStage} onChange={e => setFilterStage(e.target.value)}>
                                                    <option value="all">All Stages</option>
                                                    {RECRUITMENT_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                                    <option value="completed">Completed</option>
                                                </select>
                                                <ChevronRight size={13} className="cp-select-arrow" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cards */}
                                    <div className="cp-cards">
                                        {filteredCandidates.length === 0 ? (
                                            <div className="cp-empty">
                                                <div className="cp-empty-icon"><Users size={26} /></div>
                                                <p className="cp-empty-title">No Candidates Found</p>
                                                <p className="cp-empty-sub">
                                                    {searchTerm || filterStatus !== "all" || filterDesignation !== "all"
                                                        ? "Try adjusting your filters"
                                                        : "No candidates available"}
                                                </p>
                                            </div>
                                        ) : (
                                            paginatedCandidates.map(candidate => {
                                                const currentStage = getCurrentStage(candidate)
                                                const progress = calculateProgress(candidate)
                                                return (
                                                    <div
                                                        key={candidate.id}
                                                        className={`cp-candidate-card${selectedCandidate?.id === candidate.id ? " selected" : ""}`}
                                                        onClick={() => setSelectedCandidate(candidate)}
                                                    >
                                                        <div className="cp-card-top">
                                                            <div className="cp-avatar">{getInitials(candidate.applicant_name)}</div>
                                                            <div className="cp-card-info">
                                                                <div className="cp-card-name">{candidate.applicant_name}</div>
                                                                {candidate.designation && (
                                                                    <div className="cp-card-meta">
                                                                        <Briefcase size={11} /> {candidate.designation}
                                                                    </div>
                                                                )}
                                                                {candidate.job_title && (
                                                                    <div className="cp-card-meta" style={{ fontSize: 11.5, opacity: .8 }}>
                                                                        <Briefcase size={11} style={{ opacity: 0 }} /> {candidate.job_title}
                                                                    </div>
                                                                )}
                                                                <div className="cp-card-contacts">
                                                                    <div className="cp-card-contact">
                                                                        <Mail size={11} />
                                                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{candidate.email_id}</span>
                                                                    </div>
                                                                    <div className="cp-card-contact">
                                                                        <Phone size={11} /> {candidate.phone_number}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="cp-card-right">
                                                                <span className="cp-badge blue">{candidate.status}</span>
                                                                {candidate.resume_score > 0 && (
                                                                    <span className="cp-score">{candidate.resume_score}%</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="cp-progress-section">
                                                            <div className="cp-progress-row">
                                                                <span className="cp-progress-label">Current Stage:</span>
                                                                <span className="cp-progress-stage">{currentStage.label}</span>
                                                            </div>
                                                            <div className="cp-progress-bar-bg">
                                                                <div className="cp-progress-bar-fill" style={{ width: `${progress}%` }} />
                                                            </div>
                                                            <div className="cp-progress-footer">
                                                                <span className="cp-progress-pct">{Math.round(progress)}% Complete</span>
                                                                <span className="cp-progress-pct">
                                                                    {RECRUITMENT_STAGES.filter(s => candidate.stage_statuses?.find(st => st.stage_id === s.id && (st.status === 'completed' || st.status === 'join'))).length}/{RECRUITMENT_STAGES.length} Stages
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>

                                    {/* Pagination */}
                                    {filteredCandidates.length > 0 && (
                                        <div className="cp-pagination">
                                            <span>Showing {startIndex + 1}–{Math.min(endIndex, filteredCandidates.length)} of {filteredCandidates.length} candidates</span>
                                            <div className="cp-pag-btns">
                                                <button className="cp-btn-sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                                    <ChevronLeft size={13} /> Previous
                                                </button>
                                                <span className="cp-pag-cur">Page {currentPage} of {totalPages}</span>
                                                <button className="cp-btn-sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                                                    Next <ChevronRight size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* RIGHT — detail panel */}
                                <div className="cp-detail">
                                    {selectedCandidate ? (
                                        <>
                                            {/* Hero */}
                                            <div className="cp-detail-hero">
                                                <div className="cp-detail-hero-head">
                                                    <Eye size={14} className="cp-detail-hero-icon" />
                                                    <span className="cp-detail-hero-title">Candidate Details</span>
                                                </div>
                                                <div className="cp-detail-avatar">{getInitials(selectedCandidate.applicant_name)}</div>
                                                <div className="cp-detail-name">{selectedCandidate.applicant_name}</div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                    <span className="cp-badge blue">{selectedCandidate.status}</span>
                                                    {selectedCandidate.fit_level && <span className="cp-badge purple">{selectedCandidate.fit_level}</span>}
                                                </div>
                                            </div>

                                            {/* Body */}
                                            <div className="cp-detail-body">
                                                <div className="cp-detail-2col">
                                                    <div>
                                                        <div className="cp-detail-label"><Calendar size={11} /> Created</div>
                                                        <div className="cp-detail-val" style={{ fontSize: 12 }}>{formatDate(selectedCandidate.creation)}</div>
                                                    </div>
                                                    <div>
                                                        <div className="cp-detail-label"><Calendar size={11} /> Modified</div>
                                                        <div className="cp-detail-val" style={{ fontSize: 12 }}>{formatDate(selectedCandidate.modified)}</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="cp-detail-label"><Mail size={11} /> Email</div>
                                                    <div className="cp-detail-val" style={{ wordBreak: 'break-all' }}>{selectedCandidate.email_id}</div>
                                                </div>
                                                <div>
                                                    <div className="cp-detail-label"><Phone size={11} /> Phone</div>
                                                    <div className="cp-detail-val">{selectedCandidate.phone_number}</div>
                                                </div>
                                                <div>
                                                    <div className="cp-detail-label"><Briefcase size={11} /> Job Title</div>
                                                    <div className="cp-detail-val">{selectedCandidate.job_title}</div>
                                                </div>
                                                {selectedCandidate.designation && (
                                                    <div>
                                                        <div className="cp-detail-label"><Briefcase size={11} /> Designation</div>
                                                        <div className="cp-detail-val">{selectedCandidate.designation}</div>
                                                    </div>
                                                )}
                                                {selectedCandidate.country && (
                                                    <div>
                                                        <div className="cp-detail-label"><Globe size={11} /> Country</div>
                                                        <div className="cp-detail-val">{selectedCandidate.country}</div>
                                                    </div>
                                                )}
                                                {(selectedCandidate.location || selectedCandidate.custom_location) && (
                                                    <div>
                                                        <div className="cp-detail-label"><MapPin size={11} /> Location</div>
                                                        <div className="cp-detail-val">{selectedCandidate.location || selectedCandidate.custom_location}</div>
                                                    </div>
                                                )}
                                                {(selectedCandidate.address || selectedCandidate.custom_address) && (
                                                    <div>
                                                        <div className="cp-detail-label"><MapPinned size={11} /> Address</div>
                                                        <div className="cp-detail-val">{selectedCandidate.address || selectedCandidate.custom_address}</div>
                                                    </div>
                                                )}

                                                {selectedCandidate.applicant_rating > 0 && (
                                                    <div>
                                                        <div className="cp-detail-label"><Star size={11} /> Rating</div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                                                            <span className="cp-detail-val">{(selectedCandidate.score / 100).toFixed(1)} / 1.0</span>
                                                            <div style={{ display: 'flex', gap: 2 }}>
                                                                {[1, 2, 3, 4, 5].map(star => {
                                                                    const rating = selectedCandidate.score / 100
                                                                    const rawRatingOutOf5 = rating * 5
                                                                    const ratingOutOf5 = Math.round(rawRatingOutOf5 * 2) / 2
                                                                    const fullStars = Math.floor(ratingOutOf5)
                                                                    const hasHalf = ratingOutOf5 - fullStars === 0.5
                                                                    const isFull = star <= fullStars
                                                                    const isHalf = !isFull && star === fullStars + 1 && hasHalf
                                                                    return (
                                                                        <div key={star} className="cp-star-wrap">
                                                                            <Star size={16} style={{ position: 'absolute', fill: '#e5e7eb', color: '#e5e7eb' }} />
                                                                            {(isFull || isHalf) && (
                                                                                <div className="cp-star-fill-wrap" style={{ width: isFull ? '100%' : '50%' }}>
                                                                                    <Star size={16} style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {selectedCandidate.score > 0 && (
                                                    <div>
                                                        <div className="cp-detail-label">Score</div>
                                                        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>{selectedCandidate.score}</div>
                                                    </div>
                                                )}

                                                {selectedCandidate.justification_by_ai && (
                                                    <div>
                                                        <div className="cp-detail-label">AI Justification</div>
                                                        <div className="cp-ai-box">{selectedCandidate.justification_by_ai}</div>
                                                    </div>
                                                )}

                                                <div className="cp-detail-div" />

                                                {/* <div className="cp-detail-2col">
                                                    <div>
                                                        <div className="cp-detail-label"><Calendar size={11} /> Created</div>
                                                        <div className="cp-detail-val" style={{ fontSize: 12 }}>{formatDate(selectedCandidate.creation)}</div>
                                                    </div>
                                                    <div>
                                                        <div className="cp-detail-label"><Calendar size={11} /> Modified</div>
                                                        <div className="cp-detail-val" style={{ fontSize: 12 }}>{formatDate(selectedCandidate.modified)}</div>
                                                    </div>
                                                </div> */}

                                                {selectedCandidate.resume_link && (
                                                    <button className="cp-download" onClick={() => window.open(selectedCandidate.resume_link, '_blank')}>
                                                        <Download size={14} /> Download Resume
                                                    </button>
                                                )}
                                            </div>

                                            <div className="cp-detail-div" />

                                            {/* Stage Progress */}
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
                                                                        <div className="cp-joining-option">
                                                                            <input type="checkbox" id={`join-${selectedCandidate.id}`} checked={status === 'completed'} onChange={async () => { await updateJoiningConfirmation(selectedCandidate.id, 'join') }} disabled={updatingJoiningStatus} />
                                                                            <label htmlFor={`join-${selectedCandidate.id}`}>Join (Status: Accepted)</label>
                                                                        </div>
                                                                        <div className="cp-joining-option">
                                                                            <input type="checkbox" id={`not-join-${selectedCandidate.id}`} checked={status === 'pending'} onChange={async () => { await updateJoiningConfirmation(selectedCandidate.id, 'not_join') }} disabled={updatingJoiningStatus} />
                                                                            <label htmlFor={`not-join-${selectedCandidate.id}`}>Not Join (Status: Pending)</label>
                                                                        </div>
                                                                        <div className="cp-joining-option">
                                                                            <input type="checkbox" id={`offer-revoked-${selectedCandidate.id}`} checked={status === 'rejected'} onChange={async () => { await updateJoiningConfirmation(selectedCandidate.id, 'offer_revoked') }} disabled={updatingJoiningStatus} />
                                                                            <label htmlFor={`offer-revoked-${selectedCandidate.id}`}>Offer Revoke (Not Accepted)</label>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div className="cp-detail-div" />

                                            {/* Quick Actions */}
                                            <div className="cp-actions-title">Quick Actions</div>
                                            <div className="cp-actions">
                                                {(() => {
                                                    const isInterviewCompleted =
                                                        selectedCandidate.stage_statuses?.find(s => s.stage_id === 'offer_letter')?.status === 'completed' &&
                                                        selectedCandidate.stage_statuses?.find(s => s.stage_id === 'joining_confirmation')?.status === 'completed' &&
                                                        selectedCandidate.stage_statuses?.find(s => s.stage_id === 'appointment_letter')?.status === 'completed'
                                                    const isFeedbackCompleted = selectedCandidate.stage_statuses?.find(s => s.stage_id === 'feedback')?.status === 'completed'
                                                    const isDocVerifyCompleted = selectedCandidate.stage_statuses?.find(s => s.stage_id === 'document_verification')?.status === 'completed'
                                                    const isOfferLetterCompleted = selectedCandidate.stage_statuses?.find(s => s.stage_id === 'offer_letter')?.status === 'completed'
                                                    const isAppointmentCompleted = selectedCandidate.stage_statuses?.find(s => s.stage_id === 'appointment_letter')?.status === 'completed'
                                                    return (
                                                        <>
                                                            <button className="cp-action-btn" disabled={isInterviewCompleted} title={isInterviewCompleted ? 'Candidate has completed all hiring stages' : ''} onClick={() => !isInterviewCompleted && router.push(`/interview?applicantId=${selectedCandidate.id}`)}>
                                                                <Users size={14} /> Schedule Interview
                                                                {isInterviewCompleted && <span className="cp-action-completed">(Completed)</span>}
                                                            </button>
                                                            <button className="cp-action-btn" disabled={isFeedbackCompleted} title={isFeedbackCompleted ? 'Feedback already submitted' : ''} onClick={() => !isFeedbackCompleted && router.push(`/candidate-feedback?candidateId=${selectedCandidate.id}`)}>
                                                                <ClipboardList size={14} /> Add Feedback
                                                                {isFeedbackCompleted && <span className="cp-action-completed">(Completed)</span>}
                                                            </button>
                                                            <button className="cp-action-btn" disabled={isDocVerifyCompleted} title={isDocVerifyCompleted ? 'Documents already verified' : ''} onClick={() => !isDocVerifyCompleted && router.push(`/document-verify?candidateId=${selectedCandidate.id}`)}>
                                                                <FileCheck size={14} /> Verify Documents
                                                                {isDocVerifyCompleted && <span className="cp-action-completed">(Completed)</span>}
                                                            </button>
                                                            <button className="cp-action-btn" disabled={isOfferLetterCompleted} title={isOfferLetterCompleted ? 'Offer letter already sent' : ''} onClick={() => !isOfferLetterCompleted && router.push(`/offer-letter?candidateId=${selectedCandidate.id}`)}>
                                                                <Send size={14} /> Send Offer Letter
                                                                {isOfferLetterCompleted && <span className="cp-action-completed">(Completed)</span>}
                                                            </button>
                                                            <button className="cp-action-btn" style={{ marginBottom: 4 }} disabled={isAppointmentCompleted} title={isAppointmentCompleted ? 'Appointment letter already sent' : ''} onClick={() => !isAppointmentCompleted && router.push(`/letter-appointment?candidateId=${selectedCandidate.id}`)}>
                                                                <Send size={14} /> Send Appointment Letter
                                                                {isAppointmentCompleted && <span className="cp-action-completed">(Completed)</span>}
                                                            </button>
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
