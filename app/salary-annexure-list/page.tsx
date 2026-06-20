"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
    FileText, Calendar, Briefcase, Plus, Trash2,
    User, Search, Menu, X, Home, ChevronRight, ArrowLeft,
    Upload, Users, MessageSquare, Zap, UserCheck,
    LogOut, DollarSign, RefreshCw,
    ChevronUp, ChevronDown, TrendingUp,
} from "lucide-react"
import { getFrappeCSRF } from "@/lib/csrf"

const API_MODULE_PATH = "resume.api.salary_annexure"
const API_BASE_URL = "https://ats.vaaman.in"
const PAGE_SIZE = 10

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

   :root {
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
    --amber:     #d97706;
    --amber-lt:  #fef3c7;
    --purple:    #7c3aed;
    --purple-lt: #ede9fe;
  }
  .sl {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13.5px;
    -webkit-font-smoothing: antialiased;
  }

  .sl-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  /* ══ SIDEBAR ══ */
  .sl-sb {
    width: var(--sb-w); background: var(--sb); min-height: 100vh;
    position: fixed; top: 0; left: 0; z-index: 100;
    display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .sl-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }
  .sl-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }
  .sl-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(0,158,247,.15); border: 1px solid rgba(0,158,247,.25);
    display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
  }
  .sl-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .sl-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; line-height: 1.25; }
  .sl-sb-sub  { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
  .sl-sb-close {
    margin-left: auto; flex-shrink: 0; width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer; color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center; transition: all .14s;
  }
  .sl-sb-close:hover { background: var(--sb-hover); color: #fff; }
  .sl-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .sl-nav::-webkit-scrollbar { width: 3px; }
  .sl-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }
  .sl-nav-cta {
    display: flex; align-items: center; gap: 9px; padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md); border: 1px solid rgba(0,158,247,.28);
    color: var(--accent); font-size: 13px; font-weight: 600; text-decoration: none;
    transition: background .15s; margin-bottom: 22px; letter-spacing: -0.1px;
  }
  .sl-nav-cta:hover { background: rgba(0,158,247,.24); }
  .sl-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
  }
  .sl-nav-link {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt); text-decoration: none; transition: all .14s;
  }
  .sl-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; transition: opacity .14s; }
  .sl-nav-link:hover { background: var(--sb-hover); color: #fff; }
  .sl-nav-link:hover svg { opacity: 1; }
  .sl-nav-link.active { background: var(--accent-md); color: var(--accent); border: 1px solid rgba(0,158,247,.2); }
  .sl-nav-link.active svg { opacity: 1; }
  .sl-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .sl-logout {
    display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 12px;
    border-radius: 8px; background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--sb-lbl); text-align: left; transition: all .14s;
  }
  .sl-logout svg { opacity: .6; width: 15px; height: 15px; }
  .sl-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }
  .sl-overlay {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
  }
  @media (max-width: 768px) { .sl-overlay.show { display: block; } }

  /* ══ MAIN ══ */
  .sl-main {
    margin-left: var(--sb-w); flex: 1; display: flex; flex-direction: column;
    min-height: 100vh; transition: margin-left .25s cubic-bezier(.4,0,.2,1);
  }
  .sl-main.sb-closed { margin-left: 0; }
  .sl-header {
    min-height: 60px; background: #fff; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 0 rgba(0,158,247,.08);
    overflow: hidden;
  }
  .sl-toggle {
    width: 34px; height: 34px; border-radius: 8px; background: none;
    border: 1px solid var(--border); cursor: pointer; display: flex;
    align-items: center; justify-content: center; color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .sl-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .sl-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .sl-btn-back {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 8px;
  background: transparent; color: var(--t2);
  font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
  border: 1px solid var(--border); cursor: pointer; text-decoration: none;
  transition: all .14s; white-space: nowrap;
}
.sl-btn-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
.sl-crumb { display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--t3); flex: 1; min-width: 0; overflow: hidden; }
.sl-crumb svg { width: 13px; height: 13px; color: var(--t3); flex-shrink: 0; }
.sl-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sl-crumb a { white-space: nowrap; }

  /* ══ PAGE ══ */
  .sl-page-outer { flex: 1; display: flex; justify-content: center; padding: 28px 32px; }
  .sl-page { width: 100%; max-width: 1100px; display: flex; flex-direction: column; gap: 22px; }

  /* ══ TOOLBAR ══ */
  .sl-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .sl-page-title { font-size: 21px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; line-height: 1.15; }
  .sl-page-sub   { font-size: 13px; color: var(--t3); margin-top: 5px; }
  .sl-toolbar-right { display: flex; align-items: center; gap: 10px; }
  .sl-btn-refresh {
    display: flex; align-items: center; gap: 6px; height: 38px; padding: 0 14px;
    border-radius: 8px; border: 1px solid var(--border); background: var(--card);
    color: var(--t2); font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all .14s; white-space: nowrap;
  }
  .sl-btn-refresh svg { width: 14px; height: 14px; }
  .sl-btn-refresh:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .sl-btn-refresh.spinning svg { animation: sl-spin 0.75s linear infinite; }
  .sl-btn-new {
    display: flex; align-items: center; gap: 7px; height: 38px; padding: 0 18px;
    border-radius: 8px; background: var(--accent); color: #fff; border: none;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; text-decoration: none; transition: all .15s;
    box-shadow: 0 2px 8px rgba(0,158,247,.3); white-space: nowrap;
  }
  .sl-btn-new svg { width: 15px; height: 15px; }
  .sl-btn-new:hover { background: var(--accent-h); box-shadow: 0 4px 14px rgba(0,158,247,.4); }
  @keyframes sl-spin { to { transform: rotate(360deg); } }

  /* ══ STAT CARDS ══ */
  .sl-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .sl-stat {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 13px;
    padding: 18px 20px; display: flex; flex-direction: column; gap: 10px;
    box-shadow: 0 1px 4px rgba(0,158,247,.05); transition: box-shadow .15s, transform .15s;
  }
  .sl-stat:hover { box-shadow: 0 6px 20px rgba(0,158,247,.1); transform: translateY(-1px); }
  .sl-stat-icon {
    width: 40px; height: 40px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
  }
  .sl-stat-icon svg { width: 18px; height: 18px; }
  .sl-stat-icon.blue   { background: var(--accent-md); }
  .sl-stat-icon.blue   svg { color: var(--accent); }
  .sl-stat-icon.green  { background: rgba(22,163,74,.12); }
  .sl-stat-icon.green  svg { color: var(--green); }
  .sl-stat-icon.amber  { background: rgba(217,119,6,.12); }
  .sl-stat-icon.amber  svg { color: var(--amber); }
  .sl-stat-val  { font-size: 26px; font-weight: 800; color: var(--t1); letter-spacing: -0.8px; line-height: 1; }
  .sl-stat-lbl  { font-size: 12px; font-weight: 600; color: var(--t3); }

  /* ══ SEARCH BAR ══ */
  .sl-bar {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
    padding: 14px 18px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
    box-shadow: 0 1px 4px rgba(0,158,247,.05);
  }
  .sl-search-wrap { flex: 1; min-width: 200px; position: relative; }
  .sl-search-ico {
    position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
    color: var(--t3); pointer-events: none; display: flex;
  }
  .sl-search-ico svg { width: 15px; height: 15px; }
  .sl-search {
    height: 38px; width: 100%; padding: 0 12px 0 36px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--bg); color: var(--t1);
    font-family: 'Inter', sans-serif; font-size: 13.5px; outline: none; transition: all .15s;
  }
  .sl-search:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-lt); }
  .sl-search::placeholder { color: var(--t3); }
  .sl-bar-sep { width: 1px; height: 24px; background: var(--border); flex-shrink: 0; }
  .sl-select {
    height: 38px; padding: 0 30px 0 12px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--bg); color: var(--t1); font-family: 'Inter', sans-serif;
    font-size: 13px; outline: none; cursor: pointer; transition: all .15s; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236a9cb8' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 10px center; min-width: 148px;
  }
  .sl-select:focus { background-color: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-lt); }
  .sl-result-count { font-size: 12px; font-weight: 600; color: var(--t3); white-space: nowrap; }

  /* ══ TABLE CARD ══ */
 .sl-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 14px;
    box-shadow: 0 1px 4px rgba(0,158,247,.06);
}
  .sl-card-head {
    padding: 15px 22px; border-bottom: 1px solid var(--border-s);
    background: linear-gradient(to right, #f8fbff, #eef7ff);
    display: flex; align-items: center; justify-content: space-between;
  }
  .sl-card-head-left { display: flex; align-items: center; gap: 10px; }
  .sl-card-head-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: linear-gradient(135deg, var(--accent), #3b82f6);
    display: flex; align-items: center; justify-content: center;
  }
  .sl-card-head-icon svg { color: #fff; width: 15px; height: 15px; }
  .sl-card-title { font-size: 13.5px; font-weight: 700; color: var(--t1); }
  .sl-badge {
    display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px;
    font-size: 11.5px; font-weight: 600;
    background: var(--accent-lt); color: var(--accent); border: 1px solid rgba(0,158,247,.25);
  }

  /* ══ TABLE ══ */
  .sl-tbl-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; max-width: 100%; }
  .sl-tbl { width: 100%; border-collapse: collapse; min-width: 600px; }
  .sl-tbl thead tr { border-bottom: 2px solid var(--border-s); }
  .sl-tbl th {
    padding: 10px 16px; text-align: left; font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em; color: var(--t2);
    background: linear-gradient(to right, #f8fbff, #f2f8fd);
    white-space: nowrap; cursor: pointer; user-select: none; transition: color .12s;
  }
  .sl-tbl th:hover { color: var(--accent); }
  .sl-th-inner { display: flex; align-items: center; gap: 4px; }
  .sl-th-inner svg { width: 11px; height: 11px; opacity: 0.55; flex-shrink: 0; }

  /* ── no pointer on rows, no hover highlight ── */
  .sl-tbl tbody tr { border-bottom: 1px solid var(--border-s); }
  .sl-tbl tbody tr:last-child { border-bottom: none; }
  .sl-tbl tbody tr:hover { background: #f8fbff; }
  .sl-tbl td { padding: 13px 16px; vertical-align: middle; }

  /* cell types */
  .sl-serial { font-size: 12px; font-weight: 600; color: var(--t3); }
  .sl-id { font-size: 12px; font-weight: 700; color: var(--accent); letter-spacing: -0.2px; }
  .sl-name { font-size: 13px; font-weight: 600; color: var(--t1); line-height: 1.3; }
  .sl-email { font-size: 11.5px; color: var(--t3); margin-top: 2px; }
  .sl-chip {
    display: inline-block; max-width: 180px; overflow: hidden;
    text-overflow: ellipsis; white-space: nowrap;
    font-size: 12px; font-weight: 500;
    background: var(--accent-lt); color: var(--accent);
    border: 1px solid rgba(0,158,247,.2); padding: 3px 9px; border-radius: 5px;
  }
  .sl-chip.empty { background: #f0f4f8; color: var(--t3); border-color: var(--border); font-style: italic; }
  .sl-amt { font-size: 13px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .sl-amt.blue  { color: var(--accent); }
  .sl-amt.green { color: var(--green); }
  .sl-amt-sub { font-size: 11px; color: var(--t3); margin-top: 2px; }
  .sl-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600;
    border: 1px solid transparent; white-space: nowrap;
  }
  .sl-pill-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .sl-pill.draft     { background: var(--amber-lt); color: var(--amber); border-color: rgba(217,119,6,.25); }
  .sl-pill.draft     .sl-pill-dot { background: var(--amber); }
  .sl-pill.submitted { background: var(--green-lt); color: var(--green); border-color: rgba(22,163,74,.25); }
  .sl-pill.submitted .sl-pill-dot { background: var(--green); }
  .sl-pill.cancelled { background: var(--red-lt);   color: var(--red);   border-color: rgba(220,38,38,.25); }
  .sl-pill.cancelled .sl-pill-dot { background: var(--red); }
  .sl-date { font-size: 12.5px; color: var(--t2); white-space: nowrap; }

  /* delete action — always visible */
  .sl-act-btn {
    width: 30px; height: 30px; border-radius: 7px; border: 1px solid var(--border);
    background: var(--card); cursor: pointer; display: flex; align-items: center;
    justify-content: center; color: var(--t2); transition: all .14s;
  }
  .sl-act-btn svg { width: 13px; height: 13px; }
  .sl-act-btn.del:hover { background: var(--red-lt); border-color: rgba(220,38,38,.3); color: var(--red); }

  /* ══ SKELETON ══ */
  .sl-skel {
    height: 13px; border-radius: 5px;
    background: linear-gradient(90deg,#eef5fb 25%,#ddf0fb 50%,#eef5fb 75%);
    background-size: 200% 100%; animation: sl-skel 1.5s ease infinite;
  }
  @keyframes sl-skel { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  /* ══ EMPTY STATE ══ */
  .sl-empty {
    display: flex; flex-direction: column; align-items: center;
    padding: 72px 20px 80px; gap: 14px; text-align: center;
  }
  .sl-empty-box {
    width: 72px; height: 72px; border-radius: 18px;
    background: linear-gradient(135deg, var(--accent-lt), #ddf0fb);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
  }
  .sl-empty-box svg { color: var(--accent); width: 32px; height: 32px; }
  .sl-empty-title { font-size: 16px; font-weight: 700; color: var(--t1); }
  .sl-empty-sub   { font-size: 13px; color: var(--t3); max-width: 320px; line-height: 1.65; }
  .sl-empty-cta {
    display: flex; align-items: center; gap: 7px; padding: 10px 22px;
    border-radius: 8px; background: var(--accent); color: #fff; border: none; margin-top: 4px;
    font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 600; cursor: pointer;
    text-decoration: none; transition: all .15s; box-shadow: 0 2px 8px rgba(0,158,247,.3);
  }
  .sl-empty-cta:hover { background: var(--accent-h); }

  /* ══ PAGINATION ══ */
  .sl-pagination {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 10px; padding: 14px 22px;
    border-top: 1px solid var(--border-s);
    background: linear-gradient(to right, #f8fbff, #eef7ff);
  }
  .sl-pg-info { font-size: 12.5px; color: var(--t3); }
  .sl-pg-info strong { color: var(--t2); font-weight: 600; }
  .sl-pg-btns { display: flex; align-items: center; gap: 5px; }
  .sl-pg-btn {
    height: 32px; min-width: 32px; padding: 0 9px; border-radius: 7px;
    border: 1px solid var(--border); background: var(--card);
    font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 500;
    color: var(--t2); cursor: pointer; transition: all .14s;
    display: flex; align-items: center; justify-content: center;
  }
  .sl-pg-btn:hover:not(:disabled) { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .sl-pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .sl-pg-btn.active   { background: var(--accent); border-color: var(--accent); color: #fff; font-weight: 700; }

  /* ══ DELETE MODAL ══ */
  .sl-backdrop {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(13,27,42,.60); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; padding: 20px;
}
 .sl-modal {
    background: #ffffff; border-radius: 16px; padding: 28px;
    width: 100%; max-width: 440px;
    box-shadow: 0 32px 80px rgba(0,0,0,.28), 0 0 0 1px rgba(0,0,0,.06);
    border: 1px solid var(--border-s);
    position: relative; z-index: 10000;
    animation: sl-modal-in .18s cubic-bezier(.34,1.56,.64,1);
}
@keyframes sl-modal-in {
    from { opacity: 0; transform: scale(.93) translateY(8px); }
    to   { opacity: 1; transform: scale(1)  translateY(0); }
}

  .sl-modal-ico {
    width: 48px; height: 48px; border-radius: 50%;
    background: var(--red-lt); border: 1px solid rgba(220,38,38,.15);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
  .sl-modal-ico svg { color: var(--red) !important; width: 26px; height: 26px; }
  .sl-modal-title { font-size: 16px; font-weight: 700; color: var(--t1); margin-bottom: 8px; }
  .sl-modal-sub   { font-size: 13px; color: var(--t3); line-height: 1.65; margin-bottom: 24px; }
  .sl-modal-sub strong { color: var(--t1); font-weight: 600; }
  .sl-modal-acts  { display: flex; justify-content: flex-end; gap: 10px; flex-wrap: wrap; margin-top: 24px; }
  .sl-modal-cancel {
    padding: 10px 20px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--card); color: var(--t2); font-family: 'Inter', sans-serif;
    font-size: 13.5px; font-weight: 500; cursor: pointer; transition: all .14s;
  }
  .sl-modal-cancel:hover:not(:disabled) { background: #f0f4f8; }
  .sl-modal-del {
    display: flex !important; align-items: center; gap: 7px; padding: 10px 22px;
    min-width: 90px; flex-shrink: 0;
    border-radius: 8px; border: none; background: var(--red); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 600;
    cursor: pointer; transition: all .14s;
  }
  .sl-modal-del:hover:not(:disabled) { background: #b91c1c; }
  .sl-modal-del:disabled { opacity: 0.6; cursor: not-allowed; }
  .sl-del-spin {
    width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff; border-radius: 50%; animation: sl-spin 1s linear infinite;
  }

  /* responsive */
  @media (max-width: 900px) { .sl-stats { grid-template-columns: repeat(3,1fr); } }
  @media (max-width: 768px) {
    .sl-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .sl-sb.open { transform: translateX(0); }
    .sl-main { margin-left: 0 !important; overflow-x: hidden; max-width: 100vw; }
    .sl-page-outer { padding: 12px; overflow-x: hidden; }
    .sl-header { padding: 0 12px; gap: 6px; }
    .sl-hdr-sep { display: none; }
    .sl-btn-back { font-size: 12px; padding: 6px 10px; }
    .sl-page { gap: 14px; overflow-x: hidden; }
    .sl-wrap { overflow-x: hidden; }
    .sl-card { overflow: hidden; }
    .sl-toolbar { flex-direction: column; align-items: flex-start; gap: 10px; }
    .sl-toolbar-right { width: 100%; }
    .sl-btn-new { width: 100%; justify-content: center; }
    .sl-stats { grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .sl-bar { padding: 10px 12px; gap: 8px; }
    .sl-card-head { padding: 12px 14px; }
    .sl-card-title { font-size: 12.5px; }
    .sl-pagination { padding: 12px 14px; flex-direction: column; align-items: flex-start; }
    .sl-pg-btns { flex-wrap: wrap; }
    .sl-tbl th:nth-child(4), .sl-tbl td:nth-child(4) { display: none; }
    .sl-tbl th:nth-child(6), .sl-tbl td:nth-child(6) { display: none; }
    .sl-tbl th:nth-child(8), .sl-tbl td:nth-child(8) { display: none; }
    .sl-tbl th { padding: 8px 10px; font-size: 9.5px; }
    .sl-tbl td { padding: 10px 10px; }
    .sl-name { font-size: 12px; }
    .sl-email { font-size: 10.5px; }
    .sl-amt { font-size: 12px; }
    .sl-id { font-size: 11px; }
  }

@media (max-width: 480px) {
    .sl-stats { grid-template-columns: repeat(3, 1fr); }
    .sl-tbl th:nth-child(1), .sl-tbl td:nth-child(1) { display: none; }
  }
`

/* ─── types ─── */
interface SalaryAnnexure {
    name: string
    custom_job_applicant: string
    applicant_name?: string
    applicant_email?: string
    custom_salary_component_template?: string
    total_monthly: number
    total_annual: number
    docstatus: number
    creation: string
    owner?: string
}
type SortKey = "name" | "applicant_name" | "total_monthly" | "total_annual" | "creation"
type SortDir = "asc" | "desc"

/* ─── helpers ─── */
const fmt = (n: number) => (n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"
const statusClass = (s: number) => s === 0 ? "draft" : s === 1 ? "submitted" : "cancelled"
const statusLabel = (s: number) => s === 0 ? "Draft" : s === 1 ? "Submitted" : "Cancelled"

/* ════════════════════════════════════════ */
export default function SalaryAnnexureListPage() {
    /* no useRouter needed — no navigation from this page */
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<SalaryAnnexure | null>(null)
    const [rows, setRows] = useState<SalaryAnnexure[]>([])
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [sortKey, setSortKey] = useState<SortKey>("creation")
    const [sortDir, setSortDir] = useState<SortDir>("desc")
    const [page, setPage] = useState(1)

    useEffect(() => { document.title = "Salary Annexure"; fetchRows() }, [])

    const fetchRows = async (silent = false) => {
        silent ? setRefreshing(true) : setLoading(true)
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_salary_annexure_list`,
                { credentials: "include", headers: { "Content-Type": "application/json" } }
            )
            const data = await res.json()
            setRows(data?.message?.data || [])
        } catch { setRows([]) }
        finally { setLoading(false); setRefreshing(false) }
    }

    const confirmDelete = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        try {
            const csrf = await getFrappeCSRF()
            const res = await fetch(
                `${API_BASE_URL}/api/method/${API_MODULE_PATH}.delete_salary_annexure`,
                {
                    method: "POST", credentials: "include",
                    headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": csrf },
                    body: JSON.stringify({ annexure_name: deleteTarget.name }),
                }
            )
            const data = await res.json()
            if (data?.message?.success === false) throw new Error(data.message.message)
            setRows(prev => prev.filter(r => r.name !== deleteTarget.name))
            setDeleteTarget(null)
        } catch (e: any) { alert(e.message || "Delete failed") }
        finally { setDeleting(false) }
    }

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
        else { setSortKey(key); setSortDir("asc") }
        setPage(1)
    }

    const filtered = rows
        .filter(r => {
            const q = search.toLowerCase()
            return (
                (!q ||
                    r.name.toLowerCase().includes(q) ||
                    (r.applicant_name || "").toLowerCase().includes(q) ||
                    (r.applicant_email || "").toLowerCase().includes(q) ||
                    (r.custom_salary_component_template || "").toLowerCase().includes(q)) &&
                (statusFilter === "all" ||
                    (statusFilter === "draft" && r.docstatus === 0) ||
                    (statusFilter === "submitted" && r.docstatus === 1) ||
                    (statusFilter === "cancelled" && r.docstatus === 2))
            )
        })
        .sort((a, b) => {
            let va: any = a[sortKey as keyof SalaryAnnexure] ?? ""
            let vb: any = b[sortKey as keyof SalaryAnnexure] ?? ""
            if (sortKey === "creation") { va = new Date(va).getTime(); vb = new Date(vb).getTime() }
            if (typeof va === "string") va = va.toLowerCase()
            if (typeof vb === "string") vb = vb.toLowerCase()
            return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
        })

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const draftCount = rows.filter(r => r.docstatus === 0).length
    const submittedCount = rows.filter(r => r.docstatus === 1).length

    const SortIco = ({ col }: { col: SortKey }) =>
        sortKey === col ? (sortDir === "asc" ? <ChevronUp /> : <ChevronDown />) : <ChevronDown />

    const pageNums = () => {
        const start = Math.max(1, Math.min(page - 2, totalPages - 4))
        return Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i).filter(p => p >= 1 && p <= totalPages)
    }

    return (
        <>
            <style>{css}</style>
            <div className="sl">
                <div className="sl-wrap">
                    <div className={`sl-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

                    {/* ══ SIDEBAR ══ */}
                    <aside className={`sl-sb${sidebarOpen ? "" : " collapsed"}`}>
                        <div className="sl-sb-brand">
                            <div className="sl-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
                            <div>
                                <div className="sl-sb-name">Job Management</div>
                                <div className="sl-sb-sub">HR Platform</div>
                            </div>
                            <button className="sl-sb-close" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
                        </div>
                        <nav className="sl-nav">
                            <Link href="/create-job" className="sl-nav-cta"><Plus size={14} /> New Job Opening</Link>
                            <div className="sl-nav-lbl">General</div>
                            <Link href="/home" className="sl-nav-link">
                                <Home size={15} /> Home
                            </Link>
                            <div className="sl-nav-lbl">Pipeline</div>
                            <Link href="/job-opening" className="sl-nav-link"><Briefcase size={15} /> Job Opening</Link>
                            <Link href="/upload-resumes" className="sl-nav-link"><Upload size={15} /> Resume Collection</Link>
                            <Link href="/candidates" className="sl-nav-link"><Users size={15} /> Candidates</Link>
                            <Link href="/interview" className="sl-nav-link"><Calendar size={15} /> Interview Scheduling</Link>
                            <div className="sl-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
                            <Link href="/feedback" className="sl-nav-link"><MessageSquare size={15} /> Feedback</Link>
                            <Link href="/document-verify-list" className="sl-nav-link"><FileText size={15} /> Document Verification</Link>
                            <Link href="/offer-list" className="sl-nav-link"><Zap size={15} /> Offer Letter</Link>
                            <Link href="/salary-annexure-list" className="sl-nav-link active"><DollarSign size={15} /> Salary Annexure</Link>
                            <Link href="/letter-appointment" className="sl-nav-link"><UserCheck size={15} /> Appointment Letter</Link>
                        </nav>
                        <div className="sl-sb-foot">
                            <button className="sl-logout"><LogOut size={15} /> Sign out</button>
                        </div>
                    </aside>

                    {/* ══ MAIN ══ */}
                    <div className={`sl-main${sidebarOpen ? "" : " sb-closed"}`}>
                        <header className="sl-header">
                            <button className="sl-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
                            <div className="sl-hdr-sep" />
                            <Link href="/home" className="sl-btn-back">
                                <ArrowLeft size={13} /> Back
                            </Link>
                            <div className="sl-hdr-sep" />
                            {/* <div className="sl-crumb">
                                <Home size={13} /> Home <ChevronRight size={13} />
                                <strong>Salary Annexure</strong>
                            </div> */}
                            <div className="sl-crumb">
                                <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'inherit', textDecoration: 'none' }}>
                                    <Home size={13} /> Home
                                </Link>
                                <ChevronRight size={13} />
                                <strong>Salary Annexure</strong>
                            </div>
                        </header>

                        <div className="sl-page-outer">
                            <div className="sl-page">

                                {/* toolbar */}
                                <div className="sl-toolbar">
                                    <div>
                                        <h1 className="sl-page-title">Salary Annexure</h1>
                                        <p className="sl-page-sub">Manage salary structures and components for candidates</p>
                                    </div>
                                    <div className="sl-toolbar-right">
                                        <Link href="/offer-letter" className="sl-btn-new">
                                            <Plus size={15} /> Create Offer Letter
                                        </Link>
                                    </div>
                                </div>

                                {/* stat cards — 3 only, no CTC card */}
                                <div className="sl-stats">
                                    <div className="sl-stat">
                                        <div className="sl-stat-icon blue"><DollarSign /></div>
                                        <div className="sl-stat-val">{rows.length}</div>
                                        <div className="sl-stat-lbl">Total Annexures</div>
                                    </div>
                                    <div className="sl-stat">
                                        <div className="sl-stat-icon amber"><FileText /></div>
                                        <div className="sl-stat-val">{draftCount}</div>
                                        <div className="sl-stat-lbl">Draft</div>
                                    </div>
                                    <div className="sl-stat">
                                        <div className="sl-stat-icon green"><TrendingUp /></div>
                                        <div className="sl-stat-val">{submittedCount}</div>
                                        <div className="sl-stat-lbl">Submitted</div>
                                    </div>
                                </div>

                                {/* search & filter */}
                                <div className="sl-bar">
                                    <div className="sl-search-wrap">
                                        <span className="sl-search-ico"><Search /></span>
                                        <input
                                            className="sl-search"
                                            placeholder="Search by ID, applicant name, email or template…"
                                            value={search}
                                            onChange={e => { setSearch(e.target.value); setPage(1) }}
                                        />
                                    </div>
                                </div>

                                {/* table card */}
                                <div className="sl-card">
                                    <div className="sl-card-head">
                                        <div className="sl-card-head-left">
                                            <div className="sl-card-head-icon"><DollarSign /></div>
                                            <span className="sl-card-title">All Salary Annexures</span>
                                            {!loading && (
                                                <span className="sl-badge" style={{ marginLeft: 8 }}>
                                                    {filtered.length}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="sl-tbl-wrap">
                                        <table className="sl-tbl">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: 44 }}>#</th>
                                                    <th onClick={() => toggleSort("name")}>
                                                        <div className="sl-th-inner">ID <SortIco col="name" /></div>
                                                    </th>
                                                    <th onClick={() => toggleSort("applicant_name")}>
                                                        <div className="sl-th-inner">Applicant <SortIco col="applicant_name" /></div>
                                                    </th>
                                                    <th>Template</th>
                                                    <th onClick={() => toggleSort("total_monthly")}>
                                                        <div className="sl-th-inner">Monthly CTC <SortIco col="total_monthly" /></div>
                                                    </th>
                                                    <th onClick={() => toggleSort("total_annual")}>
                                                        <div className="sl-th-inner">Annual CTC <SortIco col="total_annual" /></div>
                                                    </th>
                                                    <th>Status</th>
                                                    <th onClick={() => toggleSort("creation")}>
                                                        <div className="sl-th-inner">Created <SortIco col="creation" /></div>
                                                    </th>
                                                    <th>Created By</th>
                                                    <th style={{ width: 60 }} />
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {/* skeleton */}
                                                {loading && Array.from({ length: 7 }).map((_, i) => (
                                                    <tr key={i}>
                                                        <td><div className="sl-skel" style={{ width: 20 }} /></td>
                                                        <td><div className="sl-skel" style={{ width: 95 }} /></td>
                                                        <td>
                                                            <div className="sl-skel" style={{ width: 120, marginBottom: 6 }} />
                                                            <div className="sl-skel" style={{ width: 90, height: 10 }} />
                                                        </td>
                                                        <td><div className="sl-skel" style={{ width: 110 }} /></td>
                                                        <td><div className="sl-skel" style={{ width: 90 }} /></td>
                                                        <td><div className="sl-skel" style={{ width: 100 }} /></td>
                                                        <td><div className="sl-skel" style={{ width: 70 }} /></td>
                                                        <td><div className="sl-skel" style={{ width: 80 }} /></td>
                                                        <td><div className="sl-skel" style={{ width: 28 }} /></td>
                                                    </tr>
                                                ))}

                                                {/* empty */}
                                                {!loading && paginated.length === 0 && (
                                                    <tr><td colSpan={9}>
                                                        <div className="sl-empty">
                                                            <div className="sl-empty-box"><DollarSign /></div>
                                                            <p className="sl-empty-title">
                                                                {search || statusFilter !== "all"
                                                                    ? "No matching records"
                                                                    : "No salary annexures yet"}
                                                            </p>
                                                            <p className="sl-empty-sub">
                                                                {search || statusFilter !== "all"
                                                                    ? "Try clearing your search or changing the status filter."
                                                                    : "Create your first salary annexure to define salary structure for a candidate."}
                                                            </p>
                                                            {!search && statusFilter === "all" && (
                                                                <Link href="/salary-annexure" className="sl-empty-cta">
                                                                    <Plus size={15} /> Create Salary Annexure
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </td></tr>
                                                )}

                                                {/* data rows — NO onClick, NO cursor pointer */}
                                                {!loading && paginated.map((row, i) => (
                                                    <tr key={row.name}>
                                                        <td><span className="sl-serial">{(page - 1) * PAGE_SIZE + i + 1}</span></td>
                                                        <td><div className="sl-id">{row.name}</div></td>
                                                        <td>
                                                            <div className="sl-name">
                                                                {row.applicant_name || row.custom_job_applicant}
                                                            </div>
                                                            {row.applicant_email && (
                                                                <div className="sl-email">{row.applicant_email}</div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <span className={`sl-chip${!row.custom_salary_component_template ? " empty" : ""}`}>
                                                                {row.custom_salary_component_template || "No template"}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="sl-amt blue">₹ {fmt(row.total_monthly)}</div>
                                                            <div className="sl-amt-sub">per month</div>
                                                        </td>
                                                        <td>
                                                            <div className="sl-amt green">₹ {fmt(row.total_annual)}</div>
                                                            <div className="sl-amt-sub">per year</div>
                                                        </td>
                                                        <td>
                                                            <span className={`sl-pill ${statusClass(row.docstatus)}`}>
                                                                <span className="sl-pill-dot" />
                                                                {statusLabel(row.docstatus)}
                                                            </span>
                                                        </td>
                                                        <td><div className="sl-date">{fmtDate(row.creation)}</div></td>
                                                        <td>
                                                            {row.owner && (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                                                    <div style={{
                                                                        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                                                                        background: 'linear-gradient(135deg, #009ef7, #3b5bdb)',
                                                                        color: '#fff', display: 'flex', alignItems: 'center',
                                                                        justifyContent: 'center', fontSize: 11, fontWeight: 700
                                                                    }}>
                                                                        {row.owner.split('@')[0].charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{row.owner.split('@')[0]}</div>
                                                                        <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>{row.owner}</div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {/* only delete — no view button */}
                                                            <button
                                                                className="sl-act-btn del"
                                                                title="Delete"
                                                                onClick={() => setDeleteTarget(row)}
                                                            >
                                                                <Trash2 />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* pagination */}
                                    {!loading && filtered.length > PAGE_SIZE && (
                                        <div className="sl-pagination">
                                            <span className="sl-pg-info">
                                                Showing{" "}
                                                <strong>
                                                    {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}
                                                </strong>{" "}
                                                of <strong>{filtered.length}</strong>
                                            </span>
                                            <div className="sl-pg-btns">
                                                <button className="sl-pg-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
                                                <button className="sl-pg-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹ Prev</button>
                                                {pageNums().map(p => (
                                                    <button key={p} className={`sl-pg-btn${page === p ? " active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                                                ))}
                                                <button className="sl-pg-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next ›</button>
                                                <button className="sl-pg-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ DELETE MODAL ══ */}
            {deleteTarget && (
                <div className="sl-backdrop" onClick={() => !deleting && setDeleteTarget(null)}>
                    <div className="sl-modal" onClick={e => e.stopPropagation()}>
                        {/* <div className="sl-modal-ico"><Trash2 /></div> */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                            <div className="sl-modal-ico"><Trash2 size={20} color="#dc2626" /></div>
                            <div>
                                <div className="sl-modal-title" style={{ marginBottom: 2 }}>Delete Salary Annexure</div>
                                <div style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 600 }}>{deleteTarget.name}</div>
                            </div>
                        </div>
                        <div className="sl-modal-sub">
                            Are you sure you want to delete{" "}
                            <strong>{deleteTarget.name}</strong>
                            {deleteTarget.applicant_name ? ` for ${deleteTarget.applicant_name}` : ""}?{" "}
                            This action <strong>cannot be undone</strong>.
                        </div>
                        <div className="sl-modal-acts">
                            <button
                                className="sl-modal-cancel"
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                className="sl-modal-del"
                                onClick={confirmDelete}
                                disabled={deleting}
                            >
                                {deleting
                                    ? <><div className="sl-del-spin" /> Deleting…</>
                                    : <><Trash2 size={14} /> Delete</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

