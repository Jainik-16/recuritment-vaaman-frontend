
"use client"
import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  ArrowLeft,
  Plus,
  Edit,
  Edit2,
  Check,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  Menu,
  X,
  Home,
  LogOut,
  Upload,
  Briefcase,
  MessageSquare,
  Zap,
  UserCheck,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from '@/lib/api-config'
import { getFrappeCSRF } from '@/lib/csrf'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ip {
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
    --gray-lt:   #f3f4f6;
    --gray-bdr:  #e5e7eb;

    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13.5px;
    -webkit-font-smoothing: antialiased;
  }

  .ip-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  /* ══ SIDEBAR ══ */
  .ip-sb {
    width: var(--sb-w); background: var(--sb);
    min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 100;
    display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .ip-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }
  .ip-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }
  .ip-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
  }
  .ip-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .ip-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; line-height: 1.25; }
  .ip-sb-sub  { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
  .ip-sb-close {
    margin-left: auto; flex-shrink: 0; width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer; color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center; transition: all .14s;
  }
  .ip-sb-close:hover { background: var(--sb-hover); color: #fff; }
  .ip-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .ip-nav::-webkit-scrollbar { width: 3px; }
  .ip-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }
  .ip-nav-cta {
    display: flex; align-items: center; gap: 9px;
    padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    color: var(--accent); font-size: 13px; font-weight: 600;
    text-decoration: none; transition: background .15s; margin-bottom: 22px;
  }
  .ip-nav-cta:hover { background: rgba(0,158,247,.24); }
  .ip-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
  }
  .ip-nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt);
    text-decoration: none; transition: all .14s;
  }
  .ip-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; }
  .ip-nav-link:hover { background: var(--sb-hover); color: #fff; }
  .ip-nav-link:hover svg { opacity: 1; }
  .ip-nav-link.active { background: var(--sb-hover); color: #fff; }
  .ip-nav-link.active svg { opacity: 1; }
  .ip-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .ip-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; border-radius: 8px; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--sb-lbl); text-align: left; transition: all .14s;
  }
  .ip-logout svg { opacity: .6; width: 15px; height: 15px; }
  .ip-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }
  .ip-overlay {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
  }
  @media (max-width: 768px) { .ip-overlay.show { display: block; } }

  /* ══ MAIN ══ */
  .ip-main {
    margin-left: var(--sb-w); flex: 1;
    display: flex; flex-direction: column; min-height: 100vh;
    transition: margin-left .25s cubic-bezier(.4,0,.2,1);
  }
  .ip-main.sb-closed { margin-left: 0; }

  /* ══ HEADER ══ */
  .ip-header {
    height: 60px; background: #fff; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 1px 0 rgba(0,158,247,.08);
  }
  .ip-toggle {
    width: 34px; height: 34px; border-radius: 8px;
    background: none; border: 1px solid var(--border);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .ip-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .ip-btn-back {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    background: transparent; color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer; text-decoration: none;
    transition: all .14s; white-space: nowrap;
  }
  .ip-btn-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .ip-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .ip-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
  .ip-crumb svg { width: 13px; height: 13px; }
  .ip-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }

  /* ══ PAGE ══ */
  .ip-page { padding: 28px 32px; display: flex; flex-direction: column; gap: 20px; }
  .ip-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
  .ip-page-title { font-size: 20px; font-weight: 800; color: var(--t1); letter-spacing: -0.4px; }
  .ip-page-sub   { font-size: 13px; color: var(--t3); margin-top: 4px; }

  /* ══ ERROR ══ */
  .ip-error {
    background: var(--red-lt); border: 1px solid var(--red-bdr);
    border-radius: 10px; padding: 14px 16px;
    display: flex; align-items: flex-start; gap: 10px;
  }
  .ip-error svg { color: var(--red); flex-shrink: 0; margin-top: 1px; }
  .ip-error-title { font-size: 13px; font-weight: 700; color: #7f1d1d; }
  .ip-error-msg   { font-size: 12.5px; color: #991b1b; margin-top: 2px; }
  .ip-error-hint  { font-size: 11.5px; color: #b91c1c; margin-top: 3px; }

  /* ══ STATS (same as jol-stats) ══ */
  .ip-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
  .ip-stat {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 16px 18px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }
  .ip-stat-label { font-size: 11.5px; color: var(--t3); font-weight: 500; margin-bottom: 4px; }
  .ip-stat-val   { font-size: 22px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; line-height: 1; }
  .ip-stat-val.blue   { color: var(--accent); }
  .ip-stat-val.gray   { color: #4b5563; }
  .ip-stat-val.yellow { color: var(--yellow); }
  .ip-stat-val.green  { color: var(--green); }
  .ip-stat-val.red    { color: var(--red); }
  .ip-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ip-stat-icon.blue   { background: var(--accent-lt); color: var(--accent); }
  .ip-stat-icon.gray   { background: var(--gray-lt); color: #4b5563; }
  .ip-stat-icon.yellow { background: var(--yellow-lt); color: var(--yellow); }
  .ip-stat-icon.green  { background: var(--green-lt); color: var(--green); }
  .ip-stat-icon.red    { background: var(--red-lt); color: var(--red); }

  /* ══ SEARCH (same as jol-search-wrap) ══ */
  .ip-search-wrap {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 16px 18px;
    box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }
  .ip-search-inner { position: relative; }
  .ip-search-inner > svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--t3); width: 16px; height: 16px; }
  .ip-search-input {
    width: 100%; height: 44px; padding: 0 40px 0 42px;
    border: 1px solid var(--border); border-radius: 8px; background: var(--bg);
    font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--t1);
    outline: none; transition: all .15s;
  }
  .ip-search-input::placeholder { color: var(--t3); }
  .ip-search-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .ip-search-clear {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: var(--t3);
    display: flex; align-items: center; padding: 4px; border-radius: 4px; transition: color .14s;
  }
  .ip-search-clear:hover { color: var(--t1); }

  /* ══ FILTERS (same as jol-filters) ══ */
  .ip-filters {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 14px 18px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }
  .ip-select-wrap { position: relative; }
  .ip-select {
    width: 100%; height: 40px; padding: 0 32px 0 13px;
    border: 1px solid var(--border); border-radius: 8px;
    background: var(--bg); font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--t2); appearance: none;
    outline: none; cursor: pointer; transition: all .15s;
  }
  .ip-select:hover { border-color: var(--accent); background: #fff; }
  .ip-select:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .ip-select-arrow { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); color: var(--t3); pointer-events: none; width: 14px; height: 14px; }

  /* ══ CONTENT LAYOUT (same as jol-content) ══ */
  .ip-content { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }

  /* ══ CARDS GRID (same as jol-cards-grid) ══ */
  .ip-cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }

  /* ══ CANDIDATE CARD (identical to jol-job-card) ══ */
  .ip-job-card {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 12px; padding: 18px;
    cursor: pointer; position: relative; overflow: hidden;
    transition: box-shadow .15s, transform .15s, border-color .15s;
    box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .ip-job-card:hover { box-shadow: 0 8px 24px rgba(0,158,247,.14); transform: translateY(-2px); border-color: rgba(0,158,247,.35); }
  .ip-job-card.selected { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.15); }
  .ip-job-card-bg {
    position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(0,158,247,.08), rgba(0,158,247,.04));
    pointer-events: none; transition: transform .4s;
  }
  .ip-job-card:hover .ip-job-card-bg { transform: scale(2); }

  /* identical to jol-card-head */
  .ip-card-head {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 10px; margin-bottom: 14px; position: relative; z-index: 1;
  }
  .ip-card-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--accent); color: #fff;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    font-size: 14px; font-weight: 700;
    box-shadow: 0 4px 10px rgba(0,158,247,.3);
  }
  .ip-card-title-wrap { flex: 1; min-width: 0; }
  .ip-card-name {
    font-size: 14px; font-weight: 700; color: var(--t1); letter-spacing: -0.2px;
    transition: color .14s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .ip-job-card:hover .ip-card-name { color: var(--accent); }
  .ip-card-id { font-size: 11px; color: var(--t3); margin-top: 2px; }
  .ip-card-badges { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }

  /* badges */
  .ip-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .ip-badge.open    { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
  .ip-badge.closed  { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
  .ip-badge.hold    { background: #fef9c3; color: #92400e; border: 1px solid #fde68a; }
  .ip-badge.blue    { background: var(--accent-lt); color: var(--accent); border: 1px solid var(--border); }
  .ip-badge.green   { background: var(--green-lt); color: var(--green); border: 1px solid var(--green-bdr); }
  .ip-badge.red     { background: var(--red-lt); color: var(--red); border: 1px solid var(--red-bdr); }
  .ip-badge.yellow  { background: var(--yellow-lt); color: var(--yellow); border: 1px solid var(--yellow-bdr); }
  .ip-badge.gray    { background: var(--gray-lt); color: #4b5563; border: 1px solid var(--gray-bdr); }
  .ip-badge.outline { background: transparent; color: var(--t2); border: 1px solid var(--border); }
  .ip-badge.blue-solid { background: var(--accent); color: #fff; border: none; }

  /* identical to jol-card-div */
  .ip-card-div { height: 1px; background: var(--border-s); margin: 12px 0; }

  /* identical to jol-card-row */
  .ip-card-row {
    display: flex; align-items: center; gap: 10px;
    padding: 7px 8px; border-radius: 7px; transition: background .12s; margin-bottom: 4px;
  }
  .ip-card-row:hover { background: var(--accent-lt); }
  .ip-card-row-icon { width: 30px; height: 30px; border-radius: 7px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .ip-card-row-icon.blue   { background: var(--accent-lt); color: var(--accent); }
  .ip-card-row-icon.indigo { background: #ede9fe; color: #7c3aed; }
  .ip-card-row-icon.red    { background: #fee2e2; color: #dc2626; }
  .ip-card-row-icon.green  { background: var(--green-lt); color: var(--green); }
  .ip-card-row-lbl { font-size: 10.5px; color: var(--t3); }
  .ip-card-row-val { font-size: 12.5px; font-weight: 500; color: var(--t1); }

  /* identical to jol-card-foot */
  .ip-card-foot { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11.5px; color: var(--t3); }
  .ip-card-date { display: flex; align-items: center; gap: 5px; }
  .ip-card-date svg { width: 12px; height: 12px; }

  /* action buttons */
  .ip-btn-sm-blue {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 7px;
    font-family: 'Inter', sans-serif; font-size: 11.5px; font-weight: 600;
    background: var(--accent); color: #fff; border: none;
    cursor: pointer; transition: background .15s; white-space: nowrap;
  }
  .ip-btn-sm-blue:hover { background: var(--accent-h); }
  .ip-btn-sm-green {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 7px;
    font-family: 'Inter', sans-serif; font-size: 11.5px; font-weight: 600;
    background: var(--green); color: #fff; border: none;
    cursor: pointer; transition: background .15s; white-space: nowrap;
  }
  .ip-btn-sm-green:hover { background: #15803d; }

  /* inline edit */
  .ip-edit-select {
    height: 32px; padding: 0 8px; border-radius: 7px;
    border: 1px solid var(--accent); background: #fff;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; color: var(--t1);
    outline: none; cursor: pointer; min-width: 110px;
  }
  .ip-edit-save {
    width: 28px; height: 28px; border-radius: 6px; border: none;
    background: var(--green); color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background .14s; flex-shrink: 0;
  }
  .ip-edit-save:hover:not(:disabled) { background: #15803d; }
  .ip-edit-save:disabled { opacity: .5; cursor: not-allowed; }
  .ip-edit-cancel {
    width: 28px; height: 28px; border-radius: 6px;
    border: 1px solid var(--border); background: #fff; color: var(--t3);
    cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .14s; flex-shrink: 0;
  }
  .ip-edit-cancel:hover { background: var(--bg); color: var(--t1); }
  .ip-edit-pencil {
    padding: 3px; border-radius: 5px; border: none; background: none;
    cursor: pointer; color: var(--t3); display: inline-flex;
    align-items: center; justify-content: center; transition: all .14s; margin-left: 4px;
  }
  .ip-edit-pencil:hover { color: var(--accent); background: var(--accent-lt); }

  /* ══ EMPTY ══ */
  .ip-empty {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 12px; padding: 60px 20px; text-align: center;
    box-shadow: 0 1px 4px rgba(0,158,247,.06); grid-column: 1 / -1;
  }
  .ip-empty-icon { width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 18px; background: var(--accent-lt); color: var(--accent); display: flex; align-items: center; justify-content: center; }
  .ip-empty-title { font-size: 15px; font-weight: 700; color: var(--t1); margin-bottom: 6px; }
  .ip-empty-sub   { font-size: 13px; color: var(--t3); }

  /* ══ PAGINATION (same as jol-pagination) ══ */
  .ip-pagination {
    display: flex; align-items: center; justify-content: space-between;
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 12px 18px; margin-top: 14px;
    font-size: 13px; color: var(--t3); box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }
  .ip-pag-btns { display: flex; align-items: center; gap: 8px; }
  .ip-pag-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 7px; font-size: 12.5px; font-weight: 500;
    background: transparent; color: var(--t2); border: 1px solid var(--border);
    cursor: pointer; transition: all .14s; font-family: 'Inter', sans-serif;
  }
  .ip-pag-btn:hover:not(:disabled) { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .ip-pag-btn:disabled { opacity: .4; cursor: not-allowed; }
  .ip-pag-cur { font-size: 12.5px; font-weight: 600; color: var(--t1); }

  /* ══ DETAIL PANEL (same as jol-detail) ══ */
  .ip-detail {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 12px; position: sticky; top: 80px;
    max-height: calc(100vh - 100px); overflow-y: auto;
    box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .ip-detail::-webkit-scrollbar { width: 4px; }
  .ip-detail::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  .ip-detail-inner { padding: 22px; }
  .ip-detail-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 18px; padding-bottom: 16px; border-bottom: 1px solid var(--border-s);
  }
  .ip-detail-head-title { font-size: 14px; font-weight: 700; color: var(--t1); }
  .ip-detail-actions { display: flex; align-items: center; gap: 6px; }
  .ip-icon-btn { width: 32px; height: 32px; border-radius: 8px; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--t3); transition: all .14s; }
  .ip-icon-btn.cls:hover { background: var(--border-s); color: var(--t1); }
  .ip-detail-jobtitle { font-size: 20px; font-weight: 800; color: var(--t1); letter-spacing: -0.4px; margin-bottom: 8px; line-height: 1.2; }
  .ip-detail-id { font-size: 11.5px; color: var(--t3); margin-bottom: 12px; }
  .ip-detail-div { height: 1px; background: var(--border-s); margin: 16px 0; }
  .ip-detail-field { margin-bottom: 14px; }
  .ip-detail-field-label { display: flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 600; color: var(--t3); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 5px; }
  .ip-detail-field-label svg { width: 13px; height: 13px; }
  .ip-detail-field-val { font-size: 13.5px; font-weight: 500; color: var(--t1); padding-left: 20px; }

  /* hero + sub cards */
  .ip-mgmt-hero { background: linear-gradient(135deg, #0f3460, #16213e); border-radius: 12px; padding: 20px; }
  .ip-mgmt-hero-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .ip-mgmt-hero-head svg { color: rgba(255,255,255,.5); }
  .ip-mgmt-hero-title { font-size: 13px; font-weight: 700; color: #fff; }
  .ip-mgmt-hero-sub   { font-size: 12px; color: rgba(255,255,255,.55); margin-bottom: 16px; }
  .ip-stage-box { background: rgba(255,255,255,.1); backdrop-filter: blur(4px); border-radius: 10px; padding: 14px; }
  .ip-stage-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,.7); margin-bottom: 8px; }
  .ip-stage-select { width: 100%; height: 42px; padding: 0 13px; border-radius: 8px; border: none; background: #fff; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: var(--t1); appearance: none; outline: none; cursor: pointer; }
  .ip-stage-indicator { display: flex; align-items: center; gap: 7px; margin-top: 8px; font-size: 12px; color: rgba(255,255,255,.65); }
  .ip-stage-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .ip-stage-note { font-size: 11.5px; color: rgba(255,255,255,.6); background: rgba(255,255,255,.1); padding: 8px 10px; border-radius: 7px; margin-top: 8px; }
  .ip-hero-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
  .ip-btn-white { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 16px; border-radius: 8px; width: 100%; background: #fff; color: var(--accent); font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: background .15s; }
  .ip-btn-white:hover { background: #f0f9ff; }
  .ip-btn-green-glass { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 16px; border-radius: 8px; width: 100%; background: rgba(34,197,94,.2); color: #fff; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; border: 1px solid rgba(34,197,94,.4); cursor: pointer; transition: background .15s; }
  .ip-btn-green-glass:hover { background: rgba(34,197,94,.3); }
  .ip-status-msg { text-align: center; color: rgba(255,255,255,.8); padding: 12px 0 4px; }
  .ip-status-msg svg { margin: 0 auto 6px; display: block; }
  .ip-status-msg p { font-size: 13px; font-weight: 600; }
  .ip-status-msg small { font-size: 11.5px; opacity: .7; }
  .ip-sub-card { background: var(--card); border: 1px solid var(--border-s); border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,158,247,.06); margin-top: 14px; }
  .ip-sub-head { padding: 14px 18px; border-bottom: 1px solid var(--border-s); display: flex; align-items: center; justify-content: space-between; }
  .ip-sub-title { font-size: 13px; font-weight: 700; color: var(--t1); display: flex; align-items: center; gap: 7px; }
  .ip-sub-body  { padding: 16px 18px; }
  .ip-det-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .ip-det-full { grid-column: 1 / -1; }
  .ip-det-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--t3); margin-bottom: 3px; }
  .ip-det-val   { font-size: 13px; font-weight: 500; color: var(--t1); }
  .ip-det-link  { color: var(--accent); font-size: 12px; text-decoration: none; word-break: break-all; }
  .ip-det-link:hover { text-decoration: underline; }
  .ip-interviewers { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
  .ip-interviewer-chip { padding: 3px 10px; border-radius: 20px; background: var(--accent-lt); color: var(--t2); font-size: 11.5px; font-weight: 500; border: 1px solid var(--border); }
  .ip-timeline-items { display: flex; flex-direction: column; gap: 8px; padding: 14px 18px; }
  .ip-tl-item { padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-s); background: var(--bg); }
  .ip-tl-item.current { background: var(--accent-lt); border-color: var(--border); }
  .ip-tl-item-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
  .ip-tl-round { font-size: 12.5px; font-weight: 700; color: var(--t1); display: flex; align-items: center; gap: 6px; }
  .ip-tl-meta  { font-size: 11.5px; color: var(--t3); display: flex; flex-direction: column; gap: 2px; }

  /* schedule form */
  .ip-btn-accent { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 16px; border-radius: 8px; width: 100%; background: var(--accent); color: #fff; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: background .15s; }
  .ip-btn-accent:hover { background: var(--accent-h); }
  .ip-form-btn-cancel { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 16px; border-radius: 8px; flex: 1; background: transparent; color: var(--t2); font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; border: 1px solid var(--border); cursor: pointer; transition: all .14s; }
  .ip-form-btn-cancel:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .ip-form { padding: 16px 18px; display: flex; flex-direction: column; gap: 14px; }
  .ip-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .ip-form-label { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--t3); margin-bottom: 5px; display: block; }
  .ip-form-input { width: 100%; height: 42px; padding: 0 13px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); font-family: 'Inter', sans-serif; font-size: 13px; color: var(--t1); outline: none; transition: all .15s; }
  .ip-form-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .ip-form-select-wrap { position: relative; }
  .ip-form-select-arrow { position: absolute; right: 11px; top: 50%; transform: translateY(-50%) rotate(90deg); color: var(--t3); pointer-events: none; width: 13px; height: 13px; }
  .ip-form-select { width: 100%; height: 42px; padding: 0 32px 0 13px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); font-family: 'Inter', sans-serif; font-size: 13px; color: var(--t2); appearance: none; outline: none; cursor: pointer; transition: all .15s; }
  .ip-form-select:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .ip-form-textarea { width: 100%; padding: 10px 13px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); font-family: 'Inter', sans-serif; font-size: 13px; color: var(--t1); outline: none; resize: vertical; transition: all .15s; min-height: 80px; }
  .ip-form-textarea:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .ip-form-btns { display: flex; gap: 10px; }

  .ip-detail-empty { padding: 48px 22px; text-align: center; }
  .ip-detail-empty-icon { width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 14px; background: var(--accent-lt); color: var(--accent); display: flex; align-items: center; justify-content: center; }
  .ip-detail-empty-title { font-size: 14px; font-weight: 700; color: var(--t1); margin-bottom: 5px; }
  .ip-detail-empty-sub   { font-size: 13px; color: var(--t3); }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 1100px) { .ip-content { grid-template-columns: 1fr; } .ip-detail { position: static; max-height: none; } }
  @media (max-width: 900px)  { .ip-cards-grid { grid-template-columns: 1fr; } .ip-stats { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 768px)  {
    .ip-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .ip-sb.open { transform: translateX(0); }
    .ip-main { margin-left: 0 !important; }
    .ip-page { padding: 18px 16px; }
    .ip-header { padding: 0 16px; }
    .ip-stats { grid-template-columns: repeat(2, 1fr); }
    .ip-filters { grid-template-columns: 1fr; }
    .ip-det-grid { grid-column: 1; grid-template-columns: 1fr; }
    .ip-form-grid { grid-template-columns: 1fr; }
  }
`

interface Candidate {
  id: string
  applicant_name: string
  email_id: string
  phone_number: string
  position: string
  experience: string
  skills: string[]
  resumeScore: number
  status: string
  appliedDate: string
  designation?: string
  interviewStatus?: string
  recruitment_stage?: string
  totalRounds?: number
  interviewDetails?: {
    date: string
    time: string
    from_time?: string
    to_time?: string
    type: "in-person" | "video" | "phone"
    location?: string
    meeting_link?: string
    interviewers: string[]
    round: number
    round_name?: string
    notes?: string
  }
}

export default function InterviewPage() {
  const router = useRouter()
  const [candidates, setCandidate] = useState<Candidate[]>([])
  const [allInterviews, setAllInterviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDesignation, setFilterDesignation] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [interviewStatuses, setInterviewStatuses] = useState<string[]>([])
  const [editingInterviewId, setEditingInterviewId] = useState<string | null>(null)
  const [editingInterviewStatus, setEditingInterviewStatus] = useState<string>("")
  const [savingStatus, setSavingStatus] = useState(false)
  const ITEMS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState(1)

  const fetchInterviewStatuses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/resource/DocType/Interview`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      const data = await response.json()
      const fields = data.data?.fields || []
      const statusField = fields.find((f: any) => f.fieldname === 'status')
      if (statusField?.options) setInterviewStatuses(statusField.options.split('\n').filter(Boolean))
      else setInterviewStatuses(['Pending', 'Under Review', 'Cleared', 'Rejected'])
    } catch { setInterviewStatuses(['Pending', 'Under Review', 'Cleared', 'Rejected']) }
  }

  const saveInterviewStatus = async (candidateId: string) => {
    setSavingStatus(true)
    try {
      const latestInterview = allInterviews.filter(i => i.job_applicant === candidateId).sort((a, b) => new Date(b.scheduled_on || b.creation).getTime() - new Date(a.scheduled_on || a.creation).getTime())[0]
      if (!latestInterview) { alert("No interview found for this candidate."); setSavingStatus(false); return }
      const csrfToken = await getFrappeCSRF()
      const response = await fetch(`${API_BASE_URL}/api/resource/Interview/${latestInterview.name}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken }, body: JSON.stringify({ status: editingInterviewStatus }) })
      const result = await response.json()
      if (result.data) {
        setCandidate(prev => prev.map(c => c.id === candidateId ? { ...c, interviewStatus: editingInterviewStatus } : c))
        if (selectedCandidate?.id === candidateId) setSelectedCandidate(prev => prev ? { ...prev, interviewStatus: editingInterviewStatus } : null)
        setAllInterviews(prev => prev.map(i => i.name === latestInterview.name ? { ...i, status: editingInterviewStatus } : i))
        setEditingInterviewId(null)
      } else alert("Failed to update status. Please try again.")
    } catch { alert("Failed to update status.") }
    finally { setSavingStatus(false) }
  }

  const fetchJobApplicant = async () => {
    setIsLoading(true); setApiError(null)
    try {
      const applicantsRes = await fetch(`${API_BASE_URL}/api/resource/Job Applicant/?fields=["*"]&limit_page_length=0`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } })
      const interviewsRes = await fetch(`${API_BASE_URL}/api/resource/Interview/?fields=["*"]&limit_page_length=0`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } })
      if (!applicantsRes.ok) throw new Error(`HTTP error! status: ${applicantsRes.status}`)
      if (!interviewsRes.ok) throw new Error(`HTTP error! status: ${interviewsRes.status}`)
      const applicantsData = await applicantsRes.json()
      const interviewsData = await interviewsRes.json()
      if (applicantsData?.data) {
        const applicants = applicantsData.data
        const interviewsRaw = interviewsData.data || []
        const interviews = await Promise.all(interviewsRaw.map(async (interview: any) => {
          try {
            const docRes = await fetch(`${API_BASE_URL}/api/resource/Interview/${interview.name}`, { method: 'GET', credentials: 'include', headers: { 'Accept': 'application/json' } })
            if (!docRes.ok) return { ...interview, interviewers: [] }
            const docData = await docRes.json()
            return { ...interview, interviewers: (docData.data?.interview_details || []).map((d: any) => d.interviewer).filter(Boolean) }
          } catch { return { ...interview, interviewers: [] } }
        }))
        setAllInterviews(interviews)
        const mappedData = applicants.map((item: any) => {
          const applicantInterviews = interviews.filter((int: any) => int.job_applicant === item.name || int.job_applicant === item.email_id)
          const interview = applicantInterviews.length > 0 ? applicantInterviews.sort((a: any, b: any) => new Date(b.scheduled_on || b.creation).getTime() - new Date(a.scheduled_on || a.creation).getTime())[0] : null
          return {
            id: item.name || item.id, applicant_name: item.applicant_name || "Unknown",
            email_id: item.email_id || "", phone_number: item.phone_number || "",
            position: item.job_title || item.designation || "Not specified", designation: item.designation || "",
            experience: item.experience || "N/A", skills: item.skills ? (Array.isArray(item.skills) ? item.skills : []) : [],
            resumeScore: item.resume_score || 0, status: item.status || "Open",
            interviewStatus: interview ? interview.status : null, recruitment_stage: item.custom_recruitment_stage || "",
            appliedDate: item.creation || item.applied_date || new Date().toISOString().split('T')[0],
            totalRounds: applicantInterviews.length,
            interviewDetails: interview ? {
              date: interview.scheduled_on || "", time: `${interview.from_time || ""} - ${interview.to_time || ""}`,
              from_time: interview.from_time || "", to_time: interview.to_time || "", type: interview.type || "video",
              location: interview.custom_location || interview.location || "",
              meeting_link: interview.google_meet || interview.meeting_link || "",
              interviewers: interview.interviewers || [], round: interview.round || 1,
              round_name: interview.interview_round || "", notes: interview.notes || ""
            } : undefined
          }
        })
        setCandidate(mappedData.sort((a: any, b: any) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()))
      }
    } catch (error: any) { setApiError("Network error: Unable to reach server. Please check if the API server is running.") }
    finally { setIsLoading(false) }
  }

  useEffect(() => { fetchJobApplicant(); fetchInterviewStatuses() }, [])
  useEffect(() => { document.title = 'Interview' }, [])

  const uniqueDesignations = Array.from(new Set(candidates.map(c => c.designation).filter((d): d is string => Boolean(d) && d.trim() !== '')))
  const allStatusesSet = new Set<string>()
  candidates.forEach(c => { if (c.interviewStatus?.trim()) allStatusesSet.add(c.interviewStatus); if (c.status?.trim()) allStatusesSet.add(c.status) })
  const uniqueStatuses = Array.from(allStatusesSet)

  const filteredCandidates = candidates.filter(candidate => {
    const candidateStatus = candidate.interviewStatus || candidate.status
    return (filterStatus === "all" || candidateStatus === filterStatus) &&
      (filterDesignation === "all" || candidate.designation === filterDesignation) &&
      (searchTerm === "" || candidate.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) || candidate.email_id.toLowerCase().includes(searchTerm.toLowerCase()) || candidate.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) || candidate.position.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  useEffect(() => { setCurrentPage(1) }, [filterStatus, filterDesignation, searchTerm])

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [interviewForm, setInterviewForm] = useState({ date: "", time: "", type: "video" as "in-person" | "video" | "phone", location: "", interviewers: [] as string[], round: 1, duration: "60", notes: "" })

  const getStatusColor = (status: string) => {
    const n = status?.toLowerCase().trim() || ""
    if (n.includes("cleared") || n.includes("accept") || n.includes("hired")) return "open"
    if (n.includes("open") || n.includes("replied") || n.includes("hold") || n.includes("under review")) return "blue"
    if (n.includes("reject")) return "closed"
    return "hold"
  }
  const getStatusText = (status: string) => !status ? "Pending" : status.charAt(0).toUpperCase() + status.slice(1)
  const getStatusIcon = (status: string) => {
    const n = status?.toLowerCase().trim() || ""
    if (n.includes("cleared") || n.includes("accept") || n.includes("hired")) return <CheckCircle size={11} />
    if (n.includes("open") || n.includes("replied") || n.includes("hold") || n.includes("under review")) return <Clock size={11} />
    if (n.includes("reject")) return <XCircle size={11} />
    return <AlertCircle size={11} />
  }
  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
  const formatDate = (d: string) => { if (!d) return "Not Set"; return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) }

  const handleScheduleInterview = () => { setShowScheduleForm(false); setInterviewForm({ date: "", time: "", type: "video", location: "", interviewers: [], round: 1, duration: "60", notes: "" }) }

  const handleRecruitmentStageChange = async (candidateId: string, newStage: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/method/your_app_name.your_module.interview_api.update_recruitment_stage`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ applicant_id: candidateId, recruitment_stage: newStage }) })
      setCandidate(prev => prev.map(c => c.id === candidateId ? { ...c, recruitment_stage: newStage } : c))
      if (selectedCandidate?.id === candidateId) setSelectedCandidate(prev => prev ? { ...prev, recruitment_stage: newStage } : null)
      alert(`Recruitment stage updated to: ${newStage}. Email will be sent automatically.`)
    } catch { alert("Failed to update recruitment stage. Please try again.") }
  }

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

  return (
    <>
      <style>{css}</style>
      <div className="ip">
        <div className="ip-wrap">
          <div className={`ip-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

          {/* ══ SIDEBAR ══ */}
          <aside className={`ip-sb${sidebarOpen ? "" : " collapsed"}`}>
            <div className="ip-sb-brand">
              <div className="ip-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
              <div><div className="ip-sb-name">Job Management</div><div className="ip-sb-sub">HR Platform</div></div>
              <button className="ip-sb-close" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
            </div>
            <nav className="ip-nav">
              <Link href="/create-job" className="ip-nav-cta"><Plus size={14} /> New Job Opening</Link>
              <div className="ip-nav-lbl">General</div>
              <Link href="/home" className="ip-nav-link"><Home size={15} /> Home</Link>
              <div className="ip-nav-lbl">Pipeline</div>
              {sidebarPipeline.map(s => <Link key={s.href} href={s.href} className={`ip-nav-link${s.href === "/interview" ? " active" : ""}`}>{s.icon} {s.title}</Link>)}
              <div className="ip-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
              {sidebarClosing.map(s => <Link key={s.href} href={s.href} className="ip-nav-link">{s.icon} {s.title}</Link>)}
            </nav>
            <div className="ip-sb-foot"><button className="ip-logout"><LogOut size={15} /> Sign out</button></div>
          </aside>

          {/* ══ MAIN ══ */}
          <div className={`ip-main${sidebarOpen ? "" : " sb-closed"}`}>
            <header className="ip-header">
              <button className="ip-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
              <div className="ip-hdr-sep" />
              <Link href="/home" className="ip-btn-back"><ArrowLeft size={13} /> Back</Link>
              <div className="ip-hdr-sep" />
              <div className="ip-crumb"><Home size={13} /> Home <ChevronRight size={13} /> <strong>Interview Management</strong></div>
            </header>

            <div className="ip-page">
              <div className="ip-toolbar">
                <div>
                  <h1 className="ip-page-title">Interview Management</h1>
                  <p className="ip-page-sub">Schedule and manage candidate interviews</p>
                </div>
              </div>

              {apiError && (
                <div className="ip-error"><AlertCircle size={16} /><div><div className="ip-error-title">API Connection Error</div><div className="ip-error-msg">{apiError}</div><div className="ip-error-hint">Please check your API configuration.</div></div></div>
              )}

              {/* ══ STATS ══ */}
              <div className="ip-stats">
                {[
                  { label: "Open", val: candidates.filter(c => c.status === "Open" || c.interviewStatus === "Open").length, cls: "blue", icon: <Clock size={18} /> },
                  { label: "Pending", val: candidates.filter(c => c.status === "Pending" || c.interviewStatus === "Pending").length, cls: "gray", icon: <AlertCircle size={18} /> },
                  { label: "Under Review", val: candidates.filter(c => c.interviewStatus === "Under Review").length, cls: "yellow", icon: <AlertCircle size={18} /> },
                  { label: "Cleared", val: candidates.filter(c => c.interviewStatus === "Cleared").length, cls: "green", icon: <CheckCircle size={18} /> },
                  { label: "Rejected", val: candidates.filter(c => c.interviewStatus === "Rejected").length, cls: "red", icon: <XCircle size={18} /> },
                ].map(s => (
                  <div key={s.label} className="ip-stat">
                    <div><div className="ip-stat-label">{s.label}</div><div className={`ip-stat-val ${s.cls}`}>{s.val}</div></div>
                    <div className={`ip-stat-icon ${s.cls}`}>{s.icon}</div>
                  </div>
                ))}
              </div>

              {/* ══ SEARCH ══ */}
              <div className="ip-search-wrap">
                <div className="ip-search-inner">
                  <Search size={16} />
                  <input type="text" className="ip-search-input" placeholder="Search by name, email, phone, or job title..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  {searchTerm && <button className="ip-search-clear" onClick={() => setSearchTerm("")}><X size={14} /></button>}
                </div>
              </div>

              {/* ══ FILTERS ══ */}
              <div className="ip-filters">
                <div className="ip-select-wrap">
                  <select className="ip-select" value={filterDesignation} onChange={e => setFilterDesignation(e.target.value)}>
                    <option value="all">All Designations</option>
                    {uniqueDesignations.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronRight size={14} className="ip-select-arrow" />
                </div>
                <div className="ip-select-wrap">
                  <select className="ip-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="all">All Statuses</option>
                    {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronRight size={14} className="ip-select-arrow" />
                </div>
              </div>

              {/* ══ CONTENT ══ */}
              <div className="ip-content">
                <div>
                  <div className="ip-cards-grid">
                    {filteredCandidates.length === 0 ? (
                      <div className="ip-empty">
                        <div className="ip-empty-icon"><Users size={28} /></div>
                        <p className="ip-empty-title">No Candidates Found</p>
                        <p className="ip-empty-sub">Try adjusting your filters or search term</p>
                      </div>
                    ) : paginatedCandidates.map((candidate, index) => {
                      const statusCls = getStatusColor(candidate.interviewStatus || candidate.status)
                      return (
                        <div
                          key={index}
                          className={`ip-job-card${selectedCandidate?.id === candidate.id ? " selected" : ""}`}
                          onClick={() => { setSelectedCandidate(candidate); setEditingInterviewId(null) }}
                        >
                          <div className="ip-job-card-bg" />

                          {/* ── HEAD: avatar + name + badges (identical to jol-card-head) ── */}
                          <div className="ip-card-head">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                              <div className="ip-card-avatar">{getInitials(candidate.applicant_name)}</div>
                              <div className="ip-card-title-wrap">
                                <div className="ip-card-name">{candidate.applicant_name}</div>
                                <div className="ip-card-id">{candidate.id}</div>
                              </div>
                            </div>
                            <div className="ip-card-badges">
                              {editingInterviewId === candidate.id ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={e => e.stopPropagation()}>
                                  <select className="ip-edit-select" value={editingInterviewStatus} onChange={e => setEditingInterviewStatus(e.target.value)} autoFocus>
                                    {interviewStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                  </select>
                                  <button className="ip-edit-save" onClick={() => saveInterviewStatus(candidate.id)} disabled={savingStatus}><Check size={12} /></button>
                                  <button className="ip-edit-cancel" onClick={e => { e.stopPropagation(); setEditingInterviewId(null) }}><X size={12} /></button>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <span className={`ip-badge ${statusCls}`}>{getStatusIcon(candidate.interviewStatus || candidate.status)} {getStatusText(candidate.interviewStatus || candidate.status)}</span>
                                  <button className="ip-edit-pencil" onClick={e => { e.stopPropagation(); setEditingInterviewId(candidate.id); setEditingInterviewStatus(candidate.interviewStatus || candidate.status || interviewStatuses[0] || "Pending") }}><Edit2 size={11} /></button>
                                </div>
                              )}
                              {candidate.interviewDetails?.round_name && <span className="ip-badge gray">{candidate.interviewDetails.round_name}</span>}
                            </div>
                          </div>

                          <div className="ip-card-div" />

                          {/* ── ROWS (identical to jol-card-row) ── */}
                          <div className="ip-card-row">
                            <div className="ip-card-row-icon blue"><Users size={13} /></div>
                            <div><div className="ip-card-row-lbl">Designation</div><div className="ip-card-row-val">{candidate.designation || "Not Set"}</div></div>
                          </div>
                          <div className="ip-card-row">
                            <div className="ip-card-row-icon indigo"><Mail size={13} /></div>
                            <div><div className="ip-card-row-lbl">Email</div><div className="ip-card-row-val">{candidate.email_id || "Not Set"}</div></div>
                          </div>
                          <div className="ip-card-row">
                            <div className="ip-card-row-icon red"><Phone size={13} /></div>
                            <div><div className="ip-card-row-lbl">Phone</div><div className="ip-card-row-val">{candidate.phone_number || "Not Set"}</div></div>
                          </div>

                          <div className="ip-card-div" />

                          {/* ── ACTION BUTTONS (same slot as applicant chip in job opening) ── */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }} onClick={e => e.stopPropagation()}>
                            {(() => {
                              const s = candidate.interviewStatus || candidate.status
                              // if (s === "Rejected") return <button className="ip-btn-sm-green" onClick={e => { e.stopPropagation(); const li = allInterviews.filter(i => i.job_applicant === candidate.id).sort((a, b) => new Date(b.scheduled_on || b.creation).getTime() - new Date(a.scheduled_on || a.creation).getTime())[0]; router.push(`/candidate-feedback?candidateId=${encodeURIComponent(candidate.id)}&candidateName=${encodeURIComponent(candidate.applicant_name)}&candidateEmail=${encodeURIComponent(candidate.email_id)}&interviewName=${encodeURIComponent(li?.name || "")}&interviewer=${encodeURIComponent(li?.interviewers?.[0] || "")}`) }}>Feedback</button>
                              // if (s === "Cleared") return <><button className="ip-btn-sm-green" onClick={e => { e.stopPropagation(); const li = allInterviews.filter(i => i.job_applicant === candidate.id).sort((a, b) => new Date(b.scheduled_on || b.creation).getTime() - new Date(a.scheduled_on || a.creation).getTime())[0]; router.push(`/Event?applicantId=${encodeURIComponent(candidate.id)}&applicantName=${encodeURIComponent(candidate.applicant_name)}&applicantEmail=${encodeURIComponent(candidate.email_id)}&jobOpening=${encodeURIComponent(candidate.position || "")}`) }}>Schedule</button></>
                              if (s === "Rejected") return (
                                <button className="ip-btn-sm-green" onClick={e => {
                                  e.stopPropagation();
                                  const li = allInterviews.filter(i => i.job_applicant === candidate.id)
                                    .sort((a, b) => new Date(b.scheduled_on || b.creation).getTime() - new Date(a.scheduled_on || a.creation).getTime())[0];
                                  router.push(`/candidate-feedback?candidateId=${encodeURIComponent(candidate.id)}&candidateName=${encodeURIComponent(candidate.applicant_name)}&candidateEmail=${encodeURIComponent(candidate.email_id)}&interviewName=${encodeURIComponent(li?.name || "")}&interviewer=${encodeURIComponent(li?.interviewers?.[0] || "")}`)
                                }}>Feedback</button>
                              )

                              if (s === "Cleared") return (
                                <>
                                  <button className="ip-btn-sm-green" onClick={e => {
                                    e.stopPropagation();
                                    router.push(`/Event?applicantId=${encodeURIComponent(candidate.id)}&applicantName=${encodeURIComponent(candidate.applicant_name)}&applicantEmail=${encodeURIComponent(candidate.email_id)}&jobOpening=${encodeURIComponent(candidate.position || "")}`)
                                  }}>Schedule</button>
                                  <button className="ip-btn-sm-blue" onClick={e => {
                                    e.stopPropagation();
                                    const li = allInterviews.filter(i => i.job_applicant === candidate.id)
                                      .sort((a, b) => new Date(b.scheduled_on || b.creation).getTime() - new Date(a.scheduled_on || a.creation).getTime())[0];
                                    router.push(`/candidate-feedback?candidateId=${encodeURIComponent(candidate.id)}&candidateName=${encodeURIComponent(candidate.applicant_name)}&candidateEmail=${encodeURIComponent(candidate.email_id)}&interviewName=${encodeURIComponent(li?.name || "")}&interviewer=${encodeURIComponent(li?.interviewers?.[0] || "")}`)
                                  }}>Feedback</button>
                                </>
                              )
                              if (s === "Pending") return <button className="ip-btn-sm-blue" style={{ background: 'var(--yellow)' }} onClick={e => { e.stopPropagation(); router.push(`/Event?applicantId=${encodeURIComponent(candidate.id)}&applicantName=${encodeURIComponent(candidate.applicant_name)}&applicantEmail=${encodeURIComponent(candidate.email_id)}&jobOpening=${encodeURIComponent(candidate.position || "")}`) }}>Reschedule</button>
                              return <button className="ip-btn-sm-blue" onClick={e => { e.stopPropagation(); router.push(`/Event?applicantId=${encodeURIComponent(candidate.id)}&applicantName=${encodeURIComponent(candidate.applicant_name)}&applicantEmail=${encodeURIComponent(candidate.email_id)}&jobOpening=${encodeURIComponent(candidate.position || "")}`) }}>Interview Schedule</button>
                            })()}
                            {candidate.resumeScore > 0 && <span className="ip-badge blue" style={{ marginLeft: 'auto' }}>{candidate.resumeScore}% Match</span>}
                          </div>

                          {/* ── FOOTER (identical to jol-card-foot) ── */}
                          <div className="ip-card-foot">
                            <div className="ip-card-date"><Calendar size={12} style={{ color: 'var(--accent)' }} />Applied: {formatDate(candidate.appliedDate)}</div>
                            {/* <div className="ip-card-date"><Users size={12} style={{ color: '#7c3aed' }} />{candidate.totalRounds || 0} Round{(candidate.totalRounds || 0) !== 1 ? 's' : ''}</div> */}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {filteredCandidates.length > 0 && (
                    <div className="ip-pagination">
                      <span>Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredCandidates.length)} of {filteredCandidates.length} candidate(s)</span>
                      <div className="ip-pag-btns">
                        <button className="ip-pag-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft size={13} /> Previous</button>
                        <span className="ip-pag-cur">Page {currentPage} of {totalPages}</span>
                        <button className="ip-pag-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next <ChevronRight size={13} /></button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ══ RIGHT DETAIL PANEL ══ */}
                <div className="ip-detail">
                  {selectedCandidate ? (
                    <div className="ip-detail-inner">
                      <div className="ip-detail-head">
                        <span className="ip-detail-head-title">Candidate Details</span>
                        <div className="ip-detail-actions">
                          <button className="ip-icon-btn cls" onClick={() => { setSelectedCandidate(null); setShowScheduleForm(false) }}><X size={15} /></button>
                        </div>
                      </div>

                      <div className="ip-detail-jobtitle">{selectedCandidate.applicant_name}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                        <span className={`ip-badge ${getStatusColor(selectedCandidate.interviewStatus || selectedCandidate.status)}`}>{getStatusIcon(selectedCandidate.interviewStatus || selectedCandidate.status)} {getStatusText(selectedCandidate.interviewStatus || selectedCandidate.status)}</span>
                        {selectedCandidate.interviewDetails?.round_name && <span className="ip-badge gray">{selectedCandidate.interviewDetails.round_name}</span>}
                      </div>
                      <div className="ip-detail-id">ID: {selectedCandidate.id}</div>
                      <div className="ip-detail-div" />

                      {[
                        { label: "Designation", icon: <Users size={13} />, val: selectedCandidate.designation, color: 'var(--accent)' },
                        { label: "Position", icon: <Briefcase size={13} />, val: selectedCandidate.position, color: '#16a34a' },
                        { label: "Email", icon: <Mail size={13} />, val: selectedCandidate.email_id, color: '#7c3aed' },
                        { label: "Phone", icon: <Phone size={13} />, val: selectedCandidate.phone_number, color: '#dc2626' },
                      ].map(f => (
                        <div key={f.label} className="ip-detail-field">
                          <div className="ip-detail-field-label" style={{ color: f.color }}>{f.icon} {f.label}</div>
                          <div className="ip-detail-field-val">{f.val || "Not Set"}</div>
                        </div>
                      ))}

                      <div className="ip-detail-div" />

                      {/* <div className="ip-mgmt-hero">
                        <div className="ip-mgmt-hero-head"><Calendar size={14} /><span className="ip-mgmt-hero-title">Interview Management</span></div>
                        <div className="ip-mgmt-hero-sub">For {selectedCandidate.applicant_name}</div>
                        <div className="ip-stage-box">
                          <div className="ip-stage-label">Recruitment Stage</div>
                          <select className="ip-stage-select" value={selectedCandidate.recruitment_stage || ""} onChange={e => handleRecruitmentStageChange(selectedCandidate.id, e.target.value)} disabled={selectedCandidate.interviewStatus !== "Cleared" && selectedCandidate.recruitment_stage !== "Document Upload Requested"}>
                            <option value="">Select Stage</option>
                            <option value="Document Upload Requested">Document Upload Requested</option>
                            <option value="Document Verified">Document Verified</option>
                          </select>
                          {selectedCandidate.recruitment_stage && <div className="ip-stage-indicator"><div className="ip-stage-dot" style={{ background: selectedCandidate.recruitment_stage === "Document Verified" ? "#4ade80" : "#fbbf24" }} /><span>{selectedCandidate.recruitment_stage === "Document Verified" ? "Documents verified and ready" : "Waiting for document upload"}</span></div>}
                          {selectedCandidate.interviewStatus === "Cleared" && selectedCandidate.recruitment_stage !== "Document Verified" && <div className="ip-stage-note">💡 Interview cleared! You can now request document upload or verify documents.</div>}
                        </div>
                        <div className="ip-hero-actions">
                          {(selectedCandidate.status === "Open" || selectedCandidate.interviewStatus === "Open") && <button className="ip-btn-white" onClick={() => setShowScheduleForm(true)}><Plus size={14} /> Schedule Interview</button>}
                          {selectedCandidate.interviewStatus === "Under Review" && <><button className="ip-btn-white" onClick={() => setShowScheduleForm(true)}><Edit size={14} /> Reschedule Interview</button><button className="ip-btn-green-glass"><CheckCircle size={14} /> Mark as Completed</button></>}
                          {selectedCandidate.interviewStatus === "Cleared" && <div className="ip-status-msg"><CheckCircle size={28} /><p>Interview Cleared</p><small>Proceed with document verification</small></div>}
                          {selectedCandidate.interviewStatus === "Rejected" && <div className="ip-status-msg"><XCircle size={28} /><p>Interview Rejected</p></div>}
                        </div>
                      </div> */}

                      {selectedCandidate.interviewDetails && (
                        <div className="ip-sub-card">
                          <div className="ip-sub-head"><div className="ip-sub-title"><Calendar size={14} /> Interview Details</div></div>
                          <div className="ip-sub-body">
                            <div className="ip-det-grid">
                              <div className="ip-det-full"><div className="ip-det-label">Scheduled</div><div className="ip-det-val">{new Date(selectedCandidate.interviewDetails.date).toLocaleDateString('en-GB')}{selectedCandidate.interviewDetails.from_time && selectedCandidate.interviewDetails.to_time && ` at ${selectedCandidate.interviewDetails.from_time} - ${selectedCandidate.interviewDetails.to_time}`}</div></div>
                              {/* <div><div className="ip-det-label">Type</div><div className="ip-det-val" style={{ textTransform: 'capitalize' }}>{selectedCandidate.interviewDetails.type}</div></div> */}
                              <div><div className="ip-det-label">Round</div><div className="ip-det-val">{selectedCandidate.interviewDetails.round_name || `Round ${selectedCandidate.interviewDetails.round}`}</div></div>
                              {selectedCandidate.interviewDetails.location && <div className="ip-det-full"><div className="ip-det-label">Location</div><div className="ip-det-val">{selectedCandidate.interviewDetails.location}</div></div>}
                              {selectedCandidate.interviewDetails.meeting_link && <div className="ip-det-full"><div className="ip-det-label">Meeting Link</div><a href={selectedCandidate.interviewDetails.meeting_link} target="_blank" rel="noopener noreferrer" className="ip-det-link">{selectedCandidate.interviewDetails.meeting_link}</a></div>}
                            </div>
                            <div style={{ marginTop: 12 }}>
                              <div className="ip-det-label">Interviewers</div>
                              {selectedCandidate.interviewDetails.interviewers?.length > 0 ? <div className="ip-interviewers">{selectedCandidate.interviewDetails.interviewers.map((iv, idx) => <span key={idx} className="ip-interviewer-chip">{iv}</span>)}</div> : <div style={{ fontSize: 12.5, color: 'var(--t3)', marginTop: 4 }}>No interviewers assigned</div>}
                            </div>
                            {selectedCandidate.interviewDetails.notes && <div style={{ marginTop: 12 }}><div className="ip-det-label">Notes</div><div className="ip-det-val" style={{ marginTop: 3 }}>{selectedCandidate.interviewDetails.notes}</div></div>}
                          </div>
                        </div>
                      )}

                      {(() => {
                        const allCI = allInterviews.filter((int: any) => int.job_applicant === selectedCandidate.id).sort((a: any, b: any) => new Date(b.scheduled_on || b.creation).getTime() - new Date(a.scheduled_on || a.creation).getTime())
                        const seen = new Set<string>(); const ci: any[] = []
                        for (const iv of allCI) { const k = iv.interview_round || iv.name; if (!seen.has(k)) { seen.add(k); ci.push(iv) } }
                        ci.sort((a: any, b: any) => new Date(a.scheduled_on || a.creation).getTime() - new Date(b.scheduled_on || b.creation).getTime())
                        if (ci.length === 0) return null
                        return (
                          <div className="ip-sub-card">
                            <div className="ip-sub-head"><div className="ip-sub-title"><Calendar size={14} /> Interview Timeline</div><span className="ip-badge outline">{ci.length} Rounds</span></div>
                            <div className="ip-timeline-items">
                              {ci.map((iv: any, idx: number) => {
                                const isCurrent = idx === ci.length - 1
                                return (
                                  <div key={iv.name} className={`ip-tl-item${isCurrent ? " current" : ""}`}>
                                    <div className="ip-tl-item-head">
                                      <div className="ip-tl-round">{iv.interview_round}{isCurrent && <span className="ip-badge blue-solid" style={{ fontSize: 10, padding: '2px 7px' }}>Current</span>}</div>
                                      <span className={`ip-badge ${getStatusColor(iv.status)}`}>{iv.status}</span>
                                    </div>
                                    <div className="ip-tl-meta"><span>📅 {iv.scheduled_on} at {iv.from_time} - {iv.to_time}</span>{iv.custom_location && <span>📍 {iv.custom_location}</span>}</div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })()}

                      {/* {showScheduleForm && (
                        <div className="ip-sub-card">
                          <div className="ip-sub-head"><div className="ip-sub-title">Schedule Interview</div></div>
                          <div className="ip-form">
                            <div className="ip-form-grid">
                              <div><label className="ip-form-label">Date</label><input type="date" className="ip-form-input" value={interviewForm.date} onChange={e => setInterviewForm({ ...interviewForm, date: e.target.value })} /></div>
                              <div><label className="ip-form-label">Time</label><input type="time" className="ip-form-input" value={interviewForm.time} onChange={e => setInterviewForm({ ...interviewForm, time: e.target.value })} /></div>
                            </div>
                            <div>
                              <label className="ip-form-label">Interview Type</label>
                              <div className="ip-form-select-wrap">
                                <select className="ip-form-select" value={interviewForm.type} onChange={e => setInterviewForm({ ...interviewForm, type: e.target.value as any })}><option value="video">Video Call</option><option value="in-person">In-Person</option><option value="phone">Phone Call</option></select>
                                <ChevronRight size={13} className="ip-form-select-arrow" />
                              </div>
                            </div>
                            {interviewForm.type === "in-person" && <div><label className="ip-form-label">Location</label><input type="text" className="ip-form-input" value={interviewForm.location} onChange={e => setInterviewForm({ ...interviewForm, location: e.target.value })} placeholder="Conference Room A" /></div>}
                            <div className="ip-form-grid">
                              <div><label className="ip-form-label">Interview Round</label><div className="ip-form-select-wrap"><select className="ip-form-select" value={interviewForm.round.toString()} onChange={e => setInterviewForm({ ...interviewForm, round: parseInt(e.target.value) })}><option value="1">Round 1 - Technical</option><option value="2">Round 2 - Managerial</option><option value="3">Round 3 - HR</option></select><ChevronRight size={13} className="ip-form-select-arrow" /></div></div>
                              <div><label className="ip-form-label">Duration (minutes)</label><div className="ip-form-select-wrap"><select className="ip-form-select" value={interviewForm.duration} onChange={e => setInterviewForm({ ...interviewForm, duration: e.target.value })}><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option><option value="90">90 minutes</option></select><ChevronRight size={13} className="ip-form-select-arrow" /></div></div>
                            </div>
                            <div><label className="ip-form-label">Additional Notes</label><textarea className="ip-form-textarea" value={interviewForm.notes} onChange={e => setInterviewForm({ ...interviewForm, notes: e.target.value })} placeholder="Any special instructions or notes..." rows={3} /></div>
                            <div className="ip-form-btns"><button className="ip-btn-accent" style={{ flex: 1 }} onClick={handleScheduleInterview}>Schedule Interview</button><button className="ip-form-btn-cancel" onClick={() => setShowScheduleForm(false)}>Cancel</button></div>
                          </div>
                        </div>
                      )} */}

                    </div>
                  ) : (
                    <div className="ip-detail-empty">
                      <div className="ip-detail-empty-icon"><Calendar size={26} /></div>
                      <p className="ip-detail-empty-title">Select a Candidate</p>
                      <p className="ip-detail-empty-sub">Click any card to view details and manage interviews</p>
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
