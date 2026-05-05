
"use client"
import { useEffect, useState } from "react"
import {
    Briefcase,
    Building,
    MapPin,
    Calendar,
    DollarSign,
    Search,
    Filter,
    Users,
    TrendingUp,
    Clock,
    X,
    ChevronDown,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Home,
    Plus,
    LogOut,
    Upload,
    MessageSquare,
    FileText,
    UserCheck,
    Zap,
    Menu,
    Edit2,
    Check,
    Globe,
} from "lucide-react"
import { API_BASE_URL } from '@/lib/api-config'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getFrappeCSRF } from "@/lib/csrf"
import { useRouter } from "next/navigation"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .jol {
    --sb-w:      265px;
    --sb:        #1e1e2d;
    --sb2:       #151521;
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

    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13.5px;
    -webkit-font-smoothing: antialiased;
  }

  .jol-wrap {
    display: flex; min-height: 100vh;
    background: var(--bg); color: var(--t1);
  }

  .jol-sb {
    width: var(--sb-w); background: var(--sb);
    min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 100;
    display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .jol-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }

  .jol-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }
  .jol-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; flex-shrink: 0;
  }
  .jol-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .jol-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; line-height: 1.25; }
  .jol-sb-sub  { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
  .jol-sb-close {
    margin-left: auto; flex-shrink: 0;
    width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer;
    color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center;
    transition: all .14s;
  }
  .jol-sb-close:hover { background: var(--sb-hover); color: #fff; }

  .jol-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .jol-nav::-webkit-scrollbar { width: 3px; }
  .jol-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }
  .jol-nav-cta {
    display: flex; align-items: center; gap: 9px;
    padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    color: var(--accent); font-size: 13px; font-weight: 600;
    text-decoration: none; transition: background .15s; margin-bottom: 22px;
  }
  .jol-nav-cta:hover { background: rgba(0,158,247,.24); }
  .jol-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
  }
  .jol-nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt);
    text-decoration: none; transition: all .14s;
  }
  .jol-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; }
  .jol-nav-link:hover { background: var(--sb-hover); color: #fff; }
  .jol-nav-link:hover svg { opacity: 1; }
  .jol-nav-link.active { background: var(--sb-hover); color: #fff; }
  .jol-nav-link.active svg { opacity: 1; }
  .jol-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .jol-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; border-radius: 8px; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--sb-lbl); text-align: left; transition: all .14s;
  }
  .jol-logout svg { opacity: .6; width: 15px; height: 15px; }
  .jol-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }

  .jol-main {
    margin-left: var(--sb-w); flex: 1;
    display: flex; flex-direction: column; min-height: 100vh;
    transition: margin-left .25s cubic-bezier(.4,0,.2,1);
  }
  .jol-main.sb-closed { margin-left: 0; }

  .jol-header {
    height: 60px; background: #fff;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 1px 0 rgba(0,158,247,.08);
  }
  .jol-toggle {
    width: 34px; height: 34px; border-radius: 8px;
    background: none; border: 1px solid var(--border);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .jol-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .jol-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .jol-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
  .jol-crumb svg { width: 13px; height: 13px; }
  .jol-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }
  .jol-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }

  .jol-overlay {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
  }
  @media (max-width: 768px) { .jol-overlay.show { display: block; } }

  .jol-page { padding: 28px 32px; }
  .jol-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
  .jol-page-title { font-size: 20px; font-weight: 800; color: var(--t1); letter-spacing: -0.4px; }
  .jol-page-sub   { font-size: 13px; color: var(--t3); margin-top: 4px; }

  .jol-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: 8px;
    background: var(--accent); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
    border: none; cursor: pointer; text-decoration: none; white-space: nowrap;
    transition: background .15s;
  }
  .jol-btn:hover { background: var(--accent-h); }
  .jol-btn-out {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 14px; border-radius: 8px;
    background: transparent; color: var(--t3);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer; text-decoration: none;
    transition: all .14s; white-space: nowrap;
  }
  .jol-btn-out:hover { background: #fff0f0; border-color: #fca5a5; color: #dc2626; }
  .jol-btn-back {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    background: transparent; color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer; text-decoration: none;
    transition: all .14s; white-space: nowrap;
  }
  .jol-btn-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

  .jol-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
  .jol-stat {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 16px 18px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }
  .jol-stat-label { font-size: 11.5px; color: var(--t3); font-weight: 500; margin-bottom: 4px; }
  .jol-stat-val   { font-size: 22px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; line-height: 1; }
  .jol-stat-val.open   { color: #16a34a; }
  .jol-stat-val.hold   { color: #d97706; }
  .jol-stat-val.closed { color: #dc2626; }
  .jol-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .jol-stat-icon.blue   { background: var(--accent-lt); color: var(--accent); }
  .jol-stat-icon.green  { background: #dcfce7; color: #16a34a; }
  .jol-stat-icon.yellow { background: #fef9c3; color: #d97706; }
  .jol-stat-icon.red    { background: #fee2e2; color: #dc2626; }

  .jol-search-wrap {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 16px 18px; margin-bottom: 14px;
    box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }
  .jol-search-inner { position: relative; }
  .jol-search-inner svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--t3); width: 16px; height: 16px; }
  .jol-search-input {
    width: 100%; height: 44px; padding: 0 40px 0 42px;
    border: 1px solid var(--border); border-radius: 8px; background: var(--bg);
    font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--t1);
    outline: none; transition: all .15s;
  }
  .jol-search-input::placeholder { color: var(--t3); }
  .jol-search-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .jol-search-clear {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: var(--t3);
    display: flex; align-items: center; justify-content: center;
    padding: 4px; border-radius: 4px; transition: color .14s;
  }
  .jol-search-clear:hover { color: var(--t1); }

  .jol-filters {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 14px 18px; margin-bottom: 18px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }
  .jol-dropdown-wrap { position: relative; }
  .jol-dropdown-btn {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    padding: 9px 14px; border: 1px solid var(--border);
    border-radius: 8px; background: var(--bg);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: var(--t2);
    cursor: pointer; transition: all .14s; outline: none;
  }
  .jol-dropdown-btn:hover { border-color: var(--accent); background: #fff; }
  .jol-dropdown-btn svg { width: 14px; height: 14px; color: var(--t3); transition: transform .2s; }
  .jol-dropdown-btn.open svg.chevron { transform: rotate(180deg); }
  .jol-dropdown-inner { display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1; }
  .jol-dropdown-inner > svg { flex-shrink: 0; }
  .jol-dropdown-menu {
    position: absolute; z-index: 50; width: 100%; margin-top: 6px;
    background: #fff; border: 1px solid var(--border);
    border-radius: 10px; box-shadow: 0 8px 24px rgba(0,158,247,.12); overflow: hidden;
  }
  .jol-dropdown-item {
    padding: 10px 14px; font-size: 13px; font-weight: 500; color: var(--t2);
    cursor: pointer; transition: all .12s; border-bottom: 1px solid var(--border-s);
  }
  .jol-dropdown-item:last-child { border-bottom: none; }
  .jol-dropdown-item:hover { background: var(--accent-lt); color: var(--accent); }

  .jol-content { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }

  .jol-cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .jol-job-card {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 12px; padding: 18px;
    cursor: pointer; position: relative; overflow: hidden;
    transition: box-shadow .15s, transform .15s, border-color .15s;
    box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .jol-job-card:hover { box-shadow: 0 8px 24px rgba(0,158,247,.14); transform: translateY(-2px); border-color: rgba(0,158,247,.35); }
  .jol-job-card.selected { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.15); }
  .jol-job-card-bg {
    position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(0,158,247,.08), rgba(0,158,247,.04));
    pointer-events: none; transition: transform .4s;
  }
  .jol-job-card:hover .jol-job-card-bg { transform: scale(2); }
  .jol-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 14px; position: relative; z-index: 1; }
  .jol-card-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--accent); color: #fff;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    box-shadow: 0 4px 10px rgba(0,158,247,.3);
  }
  .jol-card-title-wrap { flex: 1; min-width: 0; }
  .jol-card-name { font-size: 14px; font-weight: 700; color: var(--t1); letter-spacing: -0.2px; transition: color .14s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .jol-job-card:hover .jol-card-name { color: var(--accent); }
  .jol-card-id { font-size: 11px; color: var(--t3); margin-top: 2px; }
  .jol-card-badges { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
  .jol-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .jol-badge.open    { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
  .jol-badge.closed  { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
  .jol-badge.hold    { background: #fef9c3; color: #92400e; border: 1px solid #fde68a; }
  .jol-badge.default { background: var(--border-s); color: var(--t2); border: 1px solid var(--border); }
  .jol-badge.soon    { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
  .jol-badge.pub     { background: var(--accent-lt); color: var(--accent); border: 1px solid var(--border); }
  .jol-delete-btn { padding: 6px; border-radius: 7px; background: none; border: none; cursor: pointer; color: var(--t3); transition: all .14s; display: flex; align-items: center; justify-content: center; }
  .jol-delete-btn:hover { background: #fee2e2; color: #dc2626; }
  .jol-card-div { height: 1px; background: var(--border-s); margin: 12px 0; }
  .jol-card-row { display: flex; align-items: center; gap: 10px; padding: 7px 8px; border-radius: 7px; transition: background .12s; margin-bottom: 4px; }
  .jol-card-row:hover { background: var(--accent-lt); }
  .jol-card-row-icon { width: 30px; height: 30px; border-radius: 7px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .jol-card-row-icon.blue   { background: var(--accent-lt); color: var(--accent); }
  .jol-card-row-icon.indigo { background: #ede9fe; color: #7c3aed; }
  .jol-card-row-icon.red    { background: #fee2e2; color: #dc2626; }
  .jol-card-row-lbl { font-size: 10.5px; color: var(--t3); }
  .jol-card-row-val { font-size: 12.5px; font-weight: 500; color: var(--t1); }
  .jol-card-foot { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11.5px; color: var(--t3); }
  .jol-card-date { display: flex; align-items: center; gap: 5px; }
  .jol-card-date svg { width: 12px; height: 12px; }

  /* ── APPLICANT COUNT CHIP ── */
  .jol-applicant-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px;
    background: var(--accent-lt); border: 1px solid var(--accent-bdr);
    color: var(--accent); font-size: 11.5px; font-weight: 700;
    cursor: pointer; transition: all .15s; white-space: nowrap;
    text-decoration: none; border: none; font-family: 'Inter', sans-serif;
  }
  .jol-applicant-chip:hover {
    background: var(--accent); color: #fff;
    box-shadow: 0 3px 10px rgba(0,158,247,.3);
    transform: translateY(-1px);
  }
  .jol-applicant-chip svg { width: 12px; height: 12px; flex-shrink: 0; }

  /* loading chip skeleton */
  .jol-chip-loading {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px;
    background: var(--border-s); color: var(--t3);
    font-size: 11.5px; font-weight: 600; white-space: nowrap;
  }

  .jol-empty { background: var(--card); border: 1px solid var(--border-s); border-radius: 12px; padding: 60px 20px; text-align: center; box-shadow: 0 1px 4px rgba(0,158,247,.06); grid-column: 1 / -1; }
  .jol-empty-icon { width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 18px; background: var(--accent-lt); color: var(--accent); display: flex; align-items: center; justify-content: center; }
  .jol-empty-title { font-size: 15px; font-weight: 700; color: var(--t1); margin-bottom: 6px; }
  .jol-empty-sub   { font-size: 13px; color: var(--t3); }

  .jol-pagination { display: flex; align-items: center; justify-content: space-between; background: var(--card); border: 1px solid var(--border-s); border-radius: 10px; padding: 12px 18px; margin-top: 14px; font-size: 13px; color: var(--t3); box-shadow: 0 1px 3px rgba(0,158,247,.06); }
  .jol-pag-btns { display: flex; align-items: center; gap: 8px; }
  .jol-pag-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 7px; font-size: 12.5px; font-weight: 500; background: transparent; color: var(--t2); border: 1px solid var(--border); cursor: pointer; transition: all .14s; font-family: 'Inter', sans-serif; }
  .jol-pag-btn:hover:not(:disabled) { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .jol-pag-btn:disabled { opacity: .4; cursor: not-allowed; }
  .jol-pag-cur { font-size: 12.5px; font-weight: 600; color: var(--t1); }

  .jol-detail { background: var(--card); border: 1px solid var(--border-s); border-radius: 12px; position: sticky; top: 80px; max-height: calc(100vh - 100px); overflow-y: auto; box-shadow: 0 1px 4px rgba(0,158,247,.06); }
  .jol-detail::-webkit-scrollbar { width: 4px; }
  .jol-detail::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  .jol-detail-inner { padding: 22px; }
  .jol-detail-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; padding-bottom: 16px; border-bottom: 1px solid var(--border-s); }
  .jol-detail-head-title { font-size: 14px; font-weight: 700; color: var(--t1); }
  .jol-detail-actions { display: flex; align-items: center; gap: 6px; }
  .jol-icon-btn { width: 32px; height: 32px; border-radius: 8px; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--t3); transition: all .14s; }
  .jol-icon-btn:hover.del { background: #fee2e2; color: #dc2626; }
  .jol-icon-btn:hover.cls { background: var(--border-s); color: var(--t1); }
  .jol-detail-jobtitle { font-size: 20px; font-weight: 800; color: var(--t1); letter-spacing: -0.4px; margin-bottom: 8px; line-height: 1.2; }
  .jol-detail-id { font-size: 11.5px; color: var(--t3); margin-bottom: 12px; }
  .jol-detail-div { height: 1px; background: var(--border-s); margin: 16px 0; }
  .jol-detail-field { margin-bottom: 14px; }
  .jol-detail-field-label { display: flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 600; color: var(--t3); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 5px; }
  .jol-detail-field-label svg { width: 13px; height: 13px; }
  .jol-detail-field-val { font-size: 13.5px; font-weight: 500; color: var(--t1); padding-left: 20px; }
  .jol-detail-desc { font-size: 13px; color: var(--t2); line-height: 1.65; padding: 12px 14px; background: var(--bg); border-radius: 8px; border: 1px solid var(--border-s); }

  /* ── EDIT FIELD STYLES ── */
  .jol-edit-row { display: flex; align-items: center; gap: 6px; padding-left: 20px; }
  .jol-edit-select {
    flex: 1; height: 34px; padding: 0 10px; border-radius: 7px;
    border: 1px solid var(--accent); background: #fff;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: var(--t1);
    outline: none; cursor: pointer;
  }
  .jol-edit-date {
    flex: 1; height: 34px; padding: 0 10px; border-radius: 7px;
    border: 1px solid var(--accent); background: #fff;
    font-family: 'Inter', sans-serif; font-size: 13px; color: var(--t1);
    outline: none;
  }
  .jol-edit-save {
    width: 30px; height: 30px; border-radius: 7px; border: none;
    background: var(--accent); color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background .14s; flex-shrink: 0;
  }
  .jol-edit-save:hover { background: var(--accent-h); }
  .jol-edit-save:disabled { opacity: .5; cursor: not-allowed; }
  .jol-edit-cancel {
    width: 30px; height: 30px; border-radius: 7px; border: 1px solid var(--border);
    background: #fff; color: var(--t3); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all .14s; flex-shrink: 0;
  }
  .jol-edit-cancel:hover { background: var(--bg); color: var(--t1); }
  .jol-edit-pencil {
    padding: 3px; border-radius: 5px; border: none; background: none;
    cursor: pointer; color: var(--t3); display: inline-flex;
    align-items: center; justify-content: center; transition: all .14s; margin-left: 6px;
  }
  .jol-edit-pencil:hover { color: var(--accent); background: var(--accent-lt); }

  /* ── PUBLISH CHECKBOX STYLES ── */
  .jol-publish-row {
    display: flex; align-items: center; gap: 10px; padding-left: 20px;
  }
  .jol-publish-checkbox {
    width: 17px; height: 17px; border-radius: 4px;
    border: 2px solid var(--border); background: #fff;
    cursor: pointer; appearance: none; -webkit-appearance: none;
    display: flex; align-items: center; justify-content: center;
    transition: all .15s; flex-shrink: 0; position: relative;
  }
  .jol-publish-checkbox:checked {
    background: var(--accent); border-color: var(--accent);
  }
  .jol-publish-checkbox:checked::after {
    content: ''; position: absolute;
    width: 4px; height: 8px;
    border: 2px solid #fff; border-top: none; border-left: none;
    transform: rotate(45deg) translate(-1px, -1px);
  }
  .jol-publish-checkbox:disabled { opacity: .5; cursor: not-allowed; }
  .jol-publish-label {
    font-size: 13px; font-weight: 500; color: var(--t1); cursor: pointer; user-select: none;
  }
  .jol-publish-saving {
    font-size: 11.5px; color: var(--t3); font-style: italic;
  }
  /* ─────────────────────────── */

  .jol-detail-empty { padding: 48px 22px; text-align: center; }
  .jol-detail-empty-icon { width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 14px; background: var(--accent-lt); color: var(--accent); display: flex; align-items: center; justify-content: center; }
  .jol-detail-empty-title { font-size: 14px; font-weight: 700; color: var(--t1); margin-bottom: 5px; }
  .jol-detail-empty-sub   { font-size: 13px; color: var(--t3); }

  .jol-modal-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(13,27,42,.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 16px; }
  .jol-modal { background: #fff; border-radius: 14px; box-shadow: 0 20px 60px rgba(0,0,0,.2); padding: 24px; max-width: 380px; width: 100%; }
  .jol-modal-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .jol-modal-icon { width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center; }
  .jol-modal-title { font-size: 14px; font-weight: 700; color: var(--t1); }
  .jol-modal-sub   { font-size: 11.5px; color: var(--t3); margin-top: 2px; }
  .jol-modal-body { font-size: 13px; color: var(--t2); margin-bottom: 20px; line-height: 1.6; }
  .jol-modal-footer { display: flex; gap: 10px; justify-content: flex-end; }
  .jol-modal-cancel { padding: 8px 16px; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: var(--t2); background: transparent; border: 1px solid var(--border); cursor: pointer; transition: all .14s; }
  .jol-modal-cancel:hover { background: var(--bg); }
  .jol-modal-del { padding: 8px 18px; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; color: #fff; background: #dc2626; border: none; cursor: pointer; transition: background .14s; }
  .jol-modal-del:hover { background: #b91c1c; }
  .jol-modal-del:disabled { opacity: .6; cursor: not-allowed; }

  .jol-loading { min-height: 100vh; background: var(--bg); display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 16px; }
  .jol-spinner { width: 48px; height: 48px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent); animation: jol-spin 0.7s linear infinite; }
  @keyframes jol-spin { to { transform: rotate(360deg); } }
  .jol-loading-txt { font-size: 14px; color: var(--t3); font-weight: 500; }

  @media (max-width: 1100px) { .jol-content { grid-template-columns: 1fr; } .jol-detail { position: static; max-height: none; } }
  @media (max-width: 900px) { .jol-cards-grid { grid-template-columns: 1fr; } .jol-stats { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) {
    .jol-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .jol-sb.open { transform: translateX(0); }
    .jol-main { margin-left: 0 !important; }
    .jol-page { padding: 18px 16px; } .jol-header { padding: 0 16px; }
    .jol-toolbar { flex-direction: column; align-items: flex-start; }
    .jol-filters { grid-template-columns: 1fr; }
  }
`

interface JobOpening {
    name: string
    job_title: string
    designation: string
    company: string
    department: string
    location: string
    employment_type: string
    status: string
    posted_on: string
    closes_on: string
    currency: string
    lower_range: number
    upper_range: number
    salary_per: string
    description: string
    publish_salary_range: number
    publish_on_website: number
}

export default function JobOpeningList() {
    const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([])
    const [filteredJobs, setFilteredJobs] = useState<JobOpening[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [companyFilter, setCompanyFilter] = useState("all")
    const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null)
    const [showStatusDropdown, setShowStatusDropdown] = useState(false)
    const [showCompanyDropdown, setShowCompanyDropdown] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [availableStatuses, setAvailableStatuses] = useState<string[]>([])
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // ── APPLICANT COUNTS ────────────────────────────────────
    const [applicantCounts, setApplicantCounts] = useState<Record<string, number>>({})
    const [countsLoading, setCountsLoading] = useState(false)
    // ────────────────────────────────────────────────────────

    // ── EDIT STATE ──────────────────────────────────────────
    const [editingField, setEditingField] = useState<string | null>(null)
    const [editStatus, setEditStatus] = useState("")
    const [editPostedOn, setEditPostedOn] = useState("")
    const [editClosesOn, setEditClosesOn] = useState("")
    const [saving, setSaving] = useState(false)
    // ────────────────────────────────────────────────────────

    // ── PUBLISH ON WEBSITE STATE ────────────────────────────
    const [savingPublish, setSavingPublish] = useState(false)
    // ────────────────────────────────────────────────────────

    const ITEMS_PER_PAGE = 10
    const [currentPage, setCurrentPage] = useState(1)
    const router = useRouter()

    const fetchJobOpenings = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/resource/Job Opening?fields=["*"]&limit_page_length=0&order_by=modified desc`,
                { method: "GET", credentials: "include", headers: { 'Content-Type': 'application/json' } }
            )
            const data = await response.json()
            // const jobs = data.data || []
            // setJobOpenings(jobs)
            // setFilteredJobs(jobs)
            const jobs = (data.data || []).map((job: any) => ({
                ...job,
                publish_on_website: job.publish ?? 0,
            }))
            setJobOpenings(jobs)
            setFilteredJobs(jobs)
        } catch (error) {
            console.error("Error fetching job openings:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchApplicantCounts = async (jobs: JobOpening[]) => {
        if (!jobs || jobs.length === 0) return
        setCountsLoading(true)
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/method/resume.api.job_opening.get_applicant_counts`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: { 'Accept': 'application/json' }
                }
            )

            if (!response.ok) return

            const data = await response.json()
            const result = data.message

            if (result && result.success && result.data) {
                const counts: Record<string, number> = {}
                jobs.forEach(job => { counts[job.name] = 0 })
                Object.entries(result.data).forEach(([jobName, count]) => {
                    counts[jobName] = count as number
                })
                setApplicantCounts(counts)
            }
        } catch (error) {
            console.error("Error fetching applicant counts:", error)
        } finally {
            setCountsLoading(false)
        }
    }

    const deleteJobOpening = async (jobName: string) => {
        setDeleting(true)
        try {
            const csrfToken = await getFrappeCSRF()
            const response = await fetch(
                `${API_BASE_URL}/api/method/resume.api.job_opening.delete_job_opening`,
                {
                    method: "POST", credentials: "include",
                    headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken },
                    body: JSON.stringify({ name: jobName })
                }
            )
            const result = await response.json()
            if (result.message?.success) {
                setJobOpenings(prev => prev.filter(j => j.name !== jobName))
                setFilteredJobs(prev => prev.filter(j => j.name !== jobName))
                if (selectedJob?.name === jobName) setSelectedJob(null)
                setDeleteConfirm(null)
            } else {
                setDeleteConfirm(null)
                alert(result.message?.message || "Failed to delete job opening")
            }
        } catch (error) {
            console.error("Delete error:", error)
            alert("Error deleting job opening")
        } finally {
            setDeleting(false)
        }
    }

    // ── SAVE EDIT ────────────────────────────────────────────
    const saveField = async (field: string) => {
        if (!selectedJob) return
        setSaving(true)
        try {
            const csrfToken = await getFrappeCSRF()
            const payload: Record<string, string> = {}
            if (field === "status") payload.status = editStatus
            if (field === "posted_on") payload.posted_on = editPostedOn
            if (field === "closes_on") payload.closes_on = editClosesOn

            const response = await fetch(
                `${API_BASE_URL}/api/resource/Job Opening/${selectedJob.name}`,
                {
                    method: "PUT", credentials: "include",
                    headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken },
                    body: JSON.stringify(payload),
                }
            )
            const result = await response.json()
            console.log("Save result:", result)
            if (result.data) {
                const updated = { ...selectedJob, ...payload, modified: new Date().toISOString() }
                setSelectedJob(updated)
                setJobOpenings(prev => [updated, ...prev.filter(j => j.name !== updated.name)])
                setFilteredJobs(prev => [updated, ...prev.filter(j => j.name !== updated.name)])
                setEditingField(null)
            } else {
                alert("Failed to update. Please try again.")
            }
        } catch (err) {
            console.error(err)
            alert("Error saving change.")
        } finally {
            setSaving(false)
        }
    }
    // ────────────────────────────────────────────────────────

    // ── SAVE PUBLISH ON WEBSITE ──────────────────────────────
    const savePublishOnWebsite = async (newVal: number) => {
        if (!selectedJob) return
        setSavingPublish(true)

        // Optimistically update UI immediately so checkbox feels instant
        const optimistic = { ...selectedJob, publish_on_website: newVal }
        setSelectedJob(optimistic)
        setJobOpenings(prev => prev.map(j => j.name === optimistic.name ? optimistic : j))
        setFilteredJobs(prev => prev.map(j => j.name === optimistic.name ? optimistic : j))

        try {
            const csrfToken = await getFrappeCSRF()

            // Call our custom Python endpoint that uses frappe.db.set_value
            // + explicit commit — guaranteed to persist Check fields correctly
            const formData = new URLSearchParams()
            formData.append("name", selectedJob.name)
            formData.append("publish_on_website", String(newVal))

            const response = await fetch(
                `${API_BASE_URL}/api/method/resume.api.job_opening.update_publish_on_website`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Frappe-CSRF-Token': csrfToken,
                    },
                    body: formData.toString(),
                }
            )
            const result = await response.json()
            const msg = result.message

            if (msg?.success) {
                // Use the value the backend actually confirmed saving (from db read-back)
                const confirmedVal = msg.publish_on_website ?? newVal
                const confirmed = { ...selectedJob, publish_on_website: confirmedVal }
                setSelectedJob(confirmed)
                setJobOpenings(prev => prev.map(j => j.name === confirmed.name ? confirmed : j))
                setFilteredJobs(prev => prev.map(j => j.name === confirmed.name ? confirmed : j))
            } else {
                // Revert optimistic update on failure
                const reverted = { ...selectedJob, publish_on_website: newVal === 1 ? 0 : 1 }
                setSelectedJob(reverted)
                setJobOpenings(prev => prev.map(j => j.name === reverted.name ? reverted : j))
                setFilteredJobs(prev => prev.map(j => j.name === reverted.name ? reverted : j))
                alert(msg?.message || "Failed to update. Please try again.")
            }
        } catch (err) {
            console.error(err)
            // Revert optimistic update on network error
            const reverted = { ...selectedJob, publish_on_website: newVal === 1 ? 0 : 1 }
            setSelectedJob(reverted)
            setJobOpenings(prev => prev.map(j => j.name === reverted.name ? reverted : j))
            setFilteredJobs(prev => prev.map(j => j.name === reverted.name ? reverted : j))
            alert("Network error. Please try again.")
        } finally {
            setSavingPublish(false)
        }
    }
    // ────────────────────────────────────────────────────────

    const fetchStatusOptions = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/resource/DocType/Job Opening`,
                { method: "GET", credentials: "include", headers: { 'Content-Type': 'application/json' } }
            )
            const data = await response.json()
            const fields = data.data?.fields || []
            const statusField = fields.find((f: any) => f.fieldname === 'status')
            if (statusField && statusField.options) {
                const statuses = statusField.options.split('\n').filter(Boolean)
                setAvailableStatuses(statuses)
            } else {
                setAvailableStatuses(['Open', 'Closed'])
            }
        } catch (error) {
            console.error("Error fetching status options:", error)
            setAvailableStatuses(['Open', 'Closed'])
        }
    }

    useEffect(() => {
        fetchJobOpenings()
        fetchStatusOptions()
    }, [])

    useEffect(() => {
        if (jobOpenings.length > 0) {
            fetchApplicantCounts(jobOpenings)
        }
    }, [jobOpenings])

    useEffect(() => { document.title = 'Job Openings List' }, [])

    useEffect(() => {
        let filtered = jobOpenings
        if (searchTerm) {
            filtered = filtered.filter(job =>
                job.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        if (statusFilter !== "all") filtered = filtered.filter(job => job.status === statusFilter)
        if (companyFilter !== "all") filtered = filtered.filter(job => job.company === companyFilter)
        setFilteredJobs(filtered)
        setCurrentPage(1)
    }, [searchTerm, statusFilter, companyFilter, jobOpenings])

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "Open": return "open"
            case "Closed": return "closed"
            case "On Hold": return "hold"
            default: return "default"
        }
    }

    const getUniqueCompanies = () => {
        const companies = jobOpenings.map(job => job.company).filter(Boolean)
        return [...new Set(companies)]
    }

    const getStats = () => {
        const open = jobOpenings.filter(job => job.status === "Open").length
        const closed = jobOpenings.filter(job => job.status === "Closed").length
        const onHold = availableStatuses.includes("On Hold")
            ? jobOpenings.filter(job => job.status === "On Hold").length : 0
        return { open, closed, onHold, total: jobOpenings.length }
    }

    const stats = getStats()
    const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex)

    const formatSalaryRange = (job: JobOpening) => {
        if (!job.lower_range || !job.upper_range) return "Not Specified"
        const currency = job.currency || "INR"
        const per = job.salary_per || "Month"
        return `${currency} ${job.lower_range.toLocaleString()} - ${job.upper_range.toLocaleString()} / ${per}`
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "Not Set"
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    }

    const isClosingSoon = (closesOn: string) => {
        if (!closesOn) return false
        const closeDate = new Date(closesOn)
        const today = new Date()
        const daysUntilClose = Math.ceil((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return daysUntilClose <= 7 && daysUntilClose >= 0
    }

    // ── NAVIGATE TO CANDIDATES WITH JOB OPENING FILTER ──────
    const navigateToCandidates = (e: React.MouseEvent, jobName: string) => {
        e.stopPropagation()
        router.push(`/candidates?jobOpening=${encodeURIComponent(jobName)}`)
    }
    // ────────────────────────────────────────────────────────

    // ── EDITABLE FIELD HELPERS ───────────────────────────────
    const startEdit = (field: string) => {
        if (!selectedJob) return
        setEditStatus(selectedJob.status)
        setEditPostedOn(selectedJob.posted_on || "")
        setEditClosesOn(selectedJob.closes_on || "")
        setEditingField(field)
    }
    const cancelEdit = () => setEditingField(null)
    // ────────────────────────────────────────────────────────

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

    if (loading) {
        return (
            <div className="jol">
                <style>{css}</style>
                <div className="jol-loading">
                    <div className="jol-spinner" />
                    <p className="jol-loading-txt">Loading Job Openings...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <style>{css}</style>
            <div className="jol">
                <div className="jol-wrap">

                    <div
                        className={`jol-overlay${sidebarOpen ? " show" : ""}`}
                        onClick={() => setSidebarOpen(false)}
                    />

                    <aside className={`jol-sb${sidebarOpen ? "" : " collapsed"}`}>
                        <div className="jol-sb-brand">
                            <div className="jol-sb-icon">
                                <img src="/vaaman_logo.png" alt="logo" />
                            </div>
                            <div>
                                <div className="jol-sb-name">Job Management</div>
                                <div className="jol-sb-sub">HR Platform</div>
                            </div>
                            <button className="jol-sb-close" onClick={() => setSidebarOpen(false)} title="Close sidebar">
                                <X size={15} />
                            </button>
                        </div>
                        <nav className="jol-nav">
                            <Link href="/create-job" className="jol-nav-cta">
                                <Plus size={14} /> New Job Opening
                            </Link>
                            <div className="jol-nav-lbl">General</div>
                            <Link href="/home" className="jol-nav-link">
                                <Home size={15} /> Home
                            </Link>

                            <div className="jol-nav-lbl">Pipeline</div>
                            {sidebarPipeline.map(s => (
                                <Link key={s.id} href={s.href}
                                    className={`jol-nav-link${s.href === "/job-opening" ? " active" : ""}`}>
                                    {s.icon} {s.title}
                                </Link>
                            ))}
                            <div className="jol-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
                            {sidebarClosing.map(s => (
                                <Link key={s.id} href={s.href} className="jol-nav-link">
                                    {s.icon} {s.title}
                                </Link>
                            ))}
                        </nav>
                        <div className="jol-sb-foot">
                            <button className="jol-logout">
                                <LogOut size={15} /> Sign out
                            </button>
                        </div>
                    </aside>

                    <div className={`jol-main${sidebarOpen ? "" : " sb-closed"}`}>

                        <header className="jol-header">
                            <button className="jol-toggle" onClick={() => setSidebarOpen(o => !o)} title="Toggle sidebar">
                                <Menu size={16} />
                            </button>
                            <div className="jol-hdr-sep" />
                            <Link href="/home" className="jol-btn-back">
                                <ArrowLeft size={13} /> Back
                            </Link>
                            <div className="jol-hdr-sep" />
                            <div className="jol-crumb">
                                <Home size={13} /> Home
                                <ChevronRight size={13} />
                                <strong>Job Openings</strong>
                            </div>
                            <div className="jol-hdr-right">
                                <Link href="/create-job" className="jol-btn" style={{ flexShrink: 0 }}>
                                    <Plus size={14} /> Create Job Opening
                                </Link>
                                <button
                                    className="jol-btn"
                                    onClick={() => {
                                        if (selectedJob) {
                                            localStorage.setItem("selectedJobOpening", JSON.stringify({
                                                name: selectedJob.name,
                                                job_title: selectedJob.job_title,
                                                designation: selectedJob.designation,
                                                company: selectedJob.company,
                                                location: selectedJob.location,
                                            }))
                                        } else {
                                            localStorage.removeItem("selectedJobOpening")
                                        }
                                        router.push("/upload-resumes")
                                    }}
                                >
                                    <Users size={14} />
                                    Resume Upload {selectedJob ? `(${selectedJob.job_title})` : ""}
                                </button>
                            </div>
                        </header>

                        <div className="jol-page">

                            <div className="jol-toolbar">
                                <div>
                                    <h1 className="jol-page-title">Job Openings</h1>
                                    <p className="jol-page-sub">Manage and track all your recruitment positions</p>
                                </div>
                            </div>

                            <div className="jol-stats">
                                <div className="jol-stat">
                                    <div><div className="jol-stat-label">Total</div><div className="jol-stat-val">{stats.total}</div></div>
                                    <div className="jol-stat-icon blue"><Briefcase size={18} /></div>
                                </div>
                                <div className="jol-stat">
                                    <div><div className="jol-stat-label">Open</div><div className="jol-stat-val open">{stats.open}</div></div>
                                    <div className="jol-stat-icon green"><TrendingUp size={18} /></div>
                                </div>
                                {availableStatuses.includes("On Hold") && (
                                    <div className="jol-stat">
                                        <div><div className="jol-stat-label">On Hold</div><div className="jol-stat-val hold">{stats.onHold}</div></div>
                                        <div className="jol-stat-icon yellow"><Clock size={18} /></div>
                                    </div>
                                )}
                                <div className="jol-stat">
                                    <div><div className="jol-stat-label">Closed</div><div className="jol-stat-val closed">{stats.closed}</div></div>
                                    <div className="jol-stat-icon red"><Users size={18} /></div>
                                </div>
                            </div>

                            <div className="jol-search-wrap">
                                <div className="jol-search-inner">
                                    <Search />
                                    <input
                                        type="text" className="jol-search-input"
                                        placeholder="Search by job title, designation, company, or location..."
                                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {searchTerm && (
                                        <button className="jol-search-clear" onClick={() => setSearchTerm("")}><X size={14} /></button>
                                    )}
                                </div>
                            </div>

                            <div className="jol-filters">
                                <div className="jol-dropdown-wrap">
                                    <button
                                        className={`jol-dropdown-btn${showStatusDropdown ? " open" : ""}`}
                                        onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowCompanyDropdown(false) }}
                                    >
                                        <div className="jol-dropdown-inner">
                                            <Filter size={14} style={{ color: 'var(--t3)' }} />
                                            <span>{statusFilter === "all" ? "All Statuses" : statusFilter}</span>
                                        </div>
                                        <ChevronDown size={14} className="chevron" />
                                    </button>
                                    {showStatusDropdown && (
                                        <div className="jol-dropdown-menu">
                                            <div className="jol-dropdown-item" onClick={() => { setStatusFilter("all"); setShowStatusDropdown(false) }}>All Statuses</div>
                                            {availableStatuses.map(status => (
                                                <div key={status} className="jol-dropdown-item" onClick={() => { setStatusFilter(status); setShowStatusDropdown(false) }}>{status}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="jol-dropdown-wrap">
                                    <button
                                        className={`jol-dropdown-btn${showCompanyDropdown ? " open" : ""}`}
                                        onClick={() => { setShowCompanyDropdown(!showCompanyDropdown); setShowStatusDropdown(false) }}
                                    >
                                        <div className="jol-dropdown-inner">
                                            <Building size={14} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {companyFilter === "all" ? "All Companies" : companyFilter}
                                            </span>
                                        </div>
                                        <ChevronDown size={14} className="chevron" />
                                    </button>
                                    {showCompanyDropdown && (
                                        <div className="jol-dropdown-menu" style={{ maxHeight: 220, overflowY: 'auto' }}>
                                            <div className="jol-dropdown-item" onClick={() => { setCompanyFilter("all"); setShowCompanyDropdown(false) }}>All Companies</div>
                                            {getUniqueCompanies().map(company => (
                                                <div key={company} className="jol-dropdown-item" onClick={() => { setCompanyFilter(company); setShowCompanyDropdown(false) }}>{company}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="jol-content">
                                <div>
                                    <div className="jol-cards-grid">
                                        {filteredJobs.length === 0 ? (
                                            <div className="jol-empty">
                                                <div className="jol-empty-icon"><Briefcase size={28} /></div>
                                                <p className="jol-empty-title">No Job Openings Found</p>
                                                <p className="jol-empty-sub">Try adjusting your filters</p>
                                            </div>
                                        ) : (
                                            paginatedJobs.map(job => {
                                                const applicantCount = applicantCounts[job.name] ?? 0
                                                return (
                                                    <div
                                                        key={job.name}
                                                        className={`jol-job-card${selectedJob?.name === job.name ? " selected" : ""}`}
                                                        onClick={() => { setSelectedJob(job); setEditingField(null) }}
                                                    >
                                                        <div className="jol-job-card-bg" />
                                                        <div className="jol-card-head">
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                                                                <div className="jol-card-avatar"><Briefcase size={20} /></div>
                                                                <div className="jol-card-title-wrap">
                                                                    <div className="jol-card-name">{job.job_title}</div>
                                                                    <div className="jol-card-id">{job.name}</div>
                                                                </div>
                                                            </div>
                                                            <div className="jol-card-badges">
                                                                <span className={`jol-badge ${getStatusBadgeClass(job.status)}`}>{job.status}</span>
                                                                {isClosingSoon(job.closes_on) && <span className="jol-badge soon">Closing Soon</span>}
                                                                <button className="jol-delete-btn" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(job.name) }} title="Delete"><Trash2 size={14} /></button>
                                                            </div>
                                                        </div>
                                                        <div className="jol-card-div" />
                                                        <div className="jol-card-row">
                                                            <div className="jol-card-row-icon blue"><Users size={13} /></div>
                                                            <div><div className="jol-card-row-lbl">Designation</div><div className="jol-card-row-val">{job.designation || "Not Set"}</div></div>
                                                        </div>
                                                        <div className="jol-card-row">
                                                            <div className="jol-card-row-icon indigo"><Building size={13} /></div>
                                                            <div><div className="jol-card-row-lbl">Company</div><div className="jol-card-row-val">{job.company || "Not Set"}</div></div>
                                                        </div>
                                                        <div className="jol-card-row">
                                                            <div className="jol-card-row-icon red"><MapPin size={13} /></div>
                                                            <div><div className="jol-card-row-lbl">Location</div><div className="jol-card-row-val">{job.location || "Not Set"}</div></div>
                                                        </div>
                                                        <div className="jol-card-div" />

                                                        {/* ── APPLICANT COUNT CHIP ── */}
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                                                            {countsLoading ? (
                                                                <span className="jol-chip-loading">
                                                                    <Users size={12} /> Applicant —
                                                                </span>
                                                            ) : (
                                                                <button
                                                                    className="jol-applicant-chip"
                                                                    onClick={(e) => navigateToCandidates(e, job.name)}
                                                                    title={`View ${applicantCount} applicant(s) for ${job.job_title}`}
                                                                >
                                                                    <Users size={12} />
                                                                    Applicant &nbsp;{applicantCount}
                                                                </button>
                                                            )}
                                                        </div>
                                                        {/* ─────────────────────────── */}

                                                        <div className="jol-card-foot">
                                                            <div className="jol-card-date"><Calendar size={12} style={{ color: 'var(--accent)' }} />Posted: {formatDate(job.posted_on)}</div>
                                                            <div className="jol-card-date"><Calendar size={12} style={{ color: '#dc2626' }} />Closes: {formatDate(job.closes_on)}</div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>

                                    {filteredJobs.length > 0 && (
                                        <div className="jol-pagination">
                                            <span>Showing {startIndex + 1}–{Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} opening(s)</span>
                                            <div className="jol-pag-btns">
                                                <button className="jol-pag-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft size={13} /> Previous</button>
                                                <span className="jol-pag-cur">Page {currentPage} of {totalPages}</span>
                                                <button className="jol-pag-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next <ChevronRight size={13} /></button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* ══ DETAIL PANEL ══ */}
                                <div className="jol-detail">
                                    {selectedJob ? (
                                        <div className="jol-detail-inner">
                                            <div className="jol-detail-head">
                                                <span className="jol-detail-head-title">Job Details</span>
                                                <div className="jol-detail-actions">
                                                    <button className="jol-icon-btn del" onClick={() => setDeleteConfirm(selectedJob.name)} title="Delete"><Trash2 size={15} /></button>
                                                    <button className="jol-icon-btn cls" onClick={() => { setSelectedJob(null); setEditingField(null) }} title="Close"><X size={15} /></button>
                                                </div>
                                            </div>

                                            <div className="jol-detail-jobtitle">{selectedJob.job_title}</div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                                                <span className={`jol-badge ${getStatusBadgeClass(selectedJob.status)}`}>{selectedJob.status}</span>
                                                {isClosingSoon(selectedJob.closes_on) && <span className="jol-badge soon"><Clock size={10} /> Closing Soon</span>}
                                                {selectedJob.publish_on_website === 1 && <span className="jol-badge pub">Published</span>}
                                            </div>
                                            <div className="jol-detail-id">ID: {selectedJob.name}</div>

                                            {/* ── APPLICANT COUNT IN DETAIL PANEL ── */}
                                            <div style={{ marginBottom: 12 }}>
                                                {countsLoading ? (
                                                    <span className="jol-chip-loading">
                                                        <Users size={12} /> Applicant —
                                                    </span>
                                                ) : (
                                                    <button
                                                        className="jol-applicant-chip"
                                                        onClick={(e) => navigateToCandidates(e, selectedJob.name)}
                                                        title={`View applicants for ${selectedJob.job_title}`}
                                                    >
                                                        <Users size={12} />
                                                        Applicant &nbsp;{applicantCounts[selectedJob.name] ?? 0}
                                                    </button>
                                                )}
                                            </div>
                                            {/* ─────────────────────────────────────── */}

                                            <div className="jol-detail-div" />

                                            {/* Static fields */}
                                            {[
                                                { label: "Designation", icon: <Users size={13} />, val: selectedJob.designation, color: 'var(--accent)' },
                                                { label: "Company", icon: <Building size={13} />, val: selectedJob.company, color: '#16a34a' },
                                                { label: "Location", icon: <MapPin size={13} />, val: selectedJob.location, color: '#dc2626' },
                                                { label: "Employment Type", icon: <Briefcase size={13} />, val: selectedJob.employment_type, color: '#7c3aed' },
                                            ].map(f => (
                                                <div key={f.label} className="jol-detail-field">
                                                    <div className="jol-detail-field-label" style={{ color: f.color }}>{f.icon} {f.label}</div>
                                                    <div className="jol-detail-field-val">{f.val || "Not Set"}</div>
                                                </div>
                                            ))}

                                            <div className="jol-detail-div" />

                                            {/* ── EDITABLE: Status ── */}
                                            <div className="jol-detail-field">
                                                <div className="jol-detail-field-label" style={{ color: '#d97706' }}>
                                                    <Filter size={13} /> Status
                                                </div>
                                                {editingField === "status" ? (
                                                    <div className="jol-edit-row">
                                                        <select className="jol-edit-select" value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                                                            {availableStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                        <button className="jol-edit-save" onClick={() => saveField("status")} disabled={saving} title="Save">
                                                            <Check size={14} />
                                                        </button>
                                                        <button className="jol-edit-cancel" onClick={cancelEdit} title="Cancel">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 20 }}>
                                                        <span className={`jol-badge ${getStatusBadgeClass(selectedJob.status)}`}>{selectedJob.status}</span>
                                                        <button className="jol-edit-pencil" onClick={() => startEdit("status")} title="Edit status">
                                                            <Edit2 size={12} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* ── Salary Range (read-only) ── */}
                                            <div className="jol-detail-field">
                                                <div className="jol-detail-field-label" style={{ color: '#16a34a' }}><DollarSign size={13} /> Salary Range</div>
                                                <div className="jol-detail-field-val">{formatSalaryRange(selectedJob)}</div>
                                            </div>

                                            {/* ── EDITABLE: Posted On ── */}
                                            <div className="jol-detail-field">
                                                <div className="jol-detail-field-label" style={{ color: 'var(--accent)' }}><Calendar size={13} /> Posted On</div>
                                                {editingField === "posted_on" ? (
                                                    <div className="jol-edit-row">
                                                        <input
                                                            type="date"
                                                            className="jol-edit-date"
                                                            value={editPostedOn}
                                                            max={new Date().toISOString().split("T")[0]}
                                                            onClick={e => (e.target as HTMLInputElement).showPicker?.()}
                                                            onChange={e => setEditPostedOn(e.target.value)}
                                                            onBlur={e => {
                                                                const val = e.target.value
                                                                if (!val) return
                                                                const year = parseInt(val.split("-")[0])
                                                                const today = new Date().toISOString().split("T")[0]
                                                                if (year > 9999 || year < 1900) {
                                                                    alert("Please enter a valid year (1900–current year)")
                                                                    setEditPostedOn("")
                                                                    return
                                                                }
                                                                if (val > today) {
                                                                    alert("Posted On date cannot be a future date")
                                                                    setEditPostedOn(today)
                                                                }
                                                            }}
                                                        />
                                                        <button className="jol-edit-save" onClick={() => saveField("posted_on")} disabled={saving} title="Save"><Check size={14} /></button>
                                                        <button className="jol-edit-cancel" onClick={cancelEdit} title="Cancel"><X size={14} /></button>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 20 }}>
                                                        <span className="jol-detail-field-val" style={{ paddingLeft: 0 }}>{formatDate(selectedJob.posted_on)}</span>
                                                        <button className="jol-edit-pencil" onClick={() => startEdit("posted_on")} title="Edit posted date"><Edit2 size={12} /></button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* ── EDITABLE: Closes On ── */}
                                            <div className="jol-detail-field">
                                                <div className="jol-detail-field-label" style={{ color: '#dc2626' }}><Calendar size={13} /> Closes On</div>
                                                {editingField === "closes_on" ? (
                                                    <div className="jol-edit-row">
                                                        <input
                                                            type="date"
                                                            className="jol-edit-date"
                                                            value={editClosesOn}
                                                            onClick={e => (e.target as HTMLInputElement).showPicker?.()}
                                                            onChange={e => setEditClosesOn(e.target.value)}
                                                            onBlur={e => {
                                                                const val = e.target.value
                                                                if (!val) return
                                                                const year = parseInt(val.split("-")[0])
                                                                if (year > 9999 || year < 1900) {
                                                                    alert("Please enter a valid year (1900–9999)")
                                                                    setEditClosesOn("")
                                                                    return
                                                                }
                                                                const postedDate = editingField === "closes_on" ? (selectedJob?.posted_on || "") : editPostedOn
                                                                if (postedDate && val < postedDate) {
                                                                    alert("Closes On date cannot be earlier than Posted On date")
                                                                    setEditClosesOn("")
                                                                }
                                                            }}
                                                        />
                                                        <button className="jol-edit-save" onClick={() => saveField("closes_on")} disabled={saving} title="Save"><Check size={14} /></button>
                                                        <button className="jol-edit-cancel" onClick={cancelEdit} title="Cancel"><X size={14} /></button>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 20 }}>
                                                        <span className="jol-detail-field-val" style={{ paddingLeft: 0 }}>{formatDate(selectedJob.closes_on)}</span>
                                                        <button className="jol-edit-pencil" onClick={() => startEdit("closes_on")} title="Edit closing date"><Edit2 size={12} /></button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* ── PUBLISH ON WEBSITE CHECKBOX ── */}
                                            <div className="jol-detail-field">
                                                <div className="jol-detail-field-label" style={{ color: '#0ea5e9' }}>
                                                    <Globe size={13} /> Publish on Website
                                                </div>
                                                <div className="jol-publish-row">
                                                    <input
                                                        type="checkbox"
                                                        id="publish-on-website"
                                                        className="jol-publish-checkbox"
                                                        checked={selectedJob.publish_on_website === 1}
                                                        disabled={savingPublish}
                                                        onChange={e => savePublishOnWebsite(e.target.checked ? 1 : 0)}
                                                    />
                                                    <label htmlFor="publish-on-website" className="jol-publish-label">
                                                        Publish on website
                                                    </label>
                                                    {savingPublish && (
                                                        <span className="jol-publish-saving">Saving...</span>
                                                    )}
                                                </div>
                                            </div>
                                            {/* ─────────────────────────────────── */}

                                            {selectedJob.description && (
                                                <>
                                                    <div className="jol-detail-div" />
                                                    <div className="jol-detail-field">
                                                        <div className="jol-detail-field-label">Description</div>
                                                        <div className="jol-detail-desc">{selectedJob.description}</div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="jol-detail-empty">
                                            <div className="jol-detail-empty-icon"><Briefcase size={26} /></div>
                                            <p className="jol-detail-empty-title">Select a Job Opening</p>
                                            <p className="jol-detail-empty-sub">Click any card to view its details</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {deleteConfirm && (
                    <div className="jol-modal-overlay">
                        <div className="jol-modal">
                            <div className="jol-modal-head">
                                <div className="jol-modal-icon"><Trash2 size={18} /></div>
                                <div>
                                    <div className="jol-modal-title">Delete Job Opening</div>
                                    <div className="jol-modal-sub">{deleteConfirm}</div>
                                </div>
                            </div>
                            <p className="jol-modal-body">Are you sure you want to delete this job opening? This action cannot be undone.</p>
                            <div className="jol-modal-footer">
                                <button className="jol-modal-cancel" onClick={() => setDeleteConfirm(null)} disabled={deleting}>Cancel</button>
                                <button className="jol-modal-del" onClick={() => deleteJobOpening(deleteConfirm)} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
