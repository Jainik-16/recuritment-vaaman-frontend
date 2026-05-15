"use client"
import { useEffect, useState } from "react"
import {
    ArrowLeft, Mail, Calendar, Building2, User, FileText, Briefcase,
    FileCheck, Search, Phone, Star, UserCheck, ChevronLeft, ChevronRight,
    Plus, Menu, X, Home, Upload, Users, MessageSquare, Zap, LogOut,
    Edit2, Check, Filter,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ofl {
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
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13.5px;
    -webkit-font-smoothing: antialiased;
  }

  .ofl-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  .ofl-sb {
    width: var(--sb-w); background: var(--sb); min-height: 100vh;
    position: fixed; top: 0; left: 0; z-index: 100; display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .ofl-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }
  .ofl-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }
  .ofl-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(0,158,247,.15); border: 1px solid rgba(0,158,247,.25);
    display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
  }
  .ofl-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .ofl-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; line-height: 1.25; }
  .ofl-sb-sub { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
  .ofl-sb-close {
    margin-left: auto; flex-shrink: 0; width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer; color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center; transition: all .14s;
  }
  .ofl-sb-close:hover { background: var(--sb-hover); color: #fff; }
  .ofl-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .ofl-nav::-webkit-scrollbar { width: 3px; }
  .ofl-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }
  .ofl-nav-cta {
    display: flex; align-items: center; gap: 9px; padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md); border: 1px solid rgba(0,158,247,.28);
    color: var(--accent); font-size: 13px; font-weight: 600; text-decoration: none;
    transition: background .15s; margin-bottom: 22px;
  }
  .ofl-nav-cta:hover { background: rgba(0,158,247,.24); }
  .ofl-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
  }
  .ofl-nav-link {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt); text-decoration: none; transition: all .14s;
  }
  .ofl-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; transition: opacity .14s; }
  .ofl-nav-link:hover { background: var(--sb-hover); color: #fff; }
  .ofl-nav-link:hover svg { opacity: 1; }
  .ofl-nav-link.active { background: var(--accent-md); color: var(--accent); border: 1px solid rgba(0,158,247,.2); }
  .ofl-nav-link.active svg { opacity: 1; }
  .ofl-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .ofl-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; border-radius: 8px; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--sb-lbl); text-align: left; transition: all .14s;
  }
  .ofl-logout svg { opacity: .6; width: 15px; height: 15px; }
  .ofl-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }
  .ofl-overlay {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
  }
  @media (max-width: 768px) { .ofl-overlay.show { display: block; } }

  .ofl-main {
    margin-left: var(--sb-w); flex: 1; display: flex; flex-direction: column;
    min-height: 100vh; transition: margin-left .25s cubic-bezier(.4,0,.2,1);
  }
  .ofl-main.sb-closed { margin-left: 0; }
  .ofl-header {
    height: 60px; background: #fff; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 0 rgba(0,158,247,.08);
  }
  .ofl-btn-back {
    display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px;
    background: transparent; color: var(--t2); font-family: 'Inter', sans-serif; font-size: 13px;
    font-weight: 500; border: 1px solid var(--border); cursor: pointer; text-decoration: none;
    transition: all .14s; white-space: nowrap;
  }
  .ofl-btn-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .ofl-toggle {
    width: 34px; height: 34px; border-radius: 8px; background: none;
    border: 1px solid var(--border); cursor: pointer; display: flex;
    align-items: center; justify-content: center; color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .ofl-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .ofl-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .ofl-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
  .ofl-crumb svg { width: 13px; height: 13px; color: var(--t3); }
  .ofl-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }
  .ofl-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }

  .ofl-btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: 8px;
    background: var(--accent); color: #fff; font-family: 'Inter', sans-serif; font-size: 13px;
    font-weight: 600; border: none; cursor: pointer; text-decoration: none; transition: background .15s;
    box-shadow: 0 2px 8px rgba(0,158,247,.25);
  }
  .ofl-btn:hover { background: var(--accent-h); }
  .ofl-btn svg { width: 14px; height: 14px; }

  .ofl-total-pill {
    display: flex; flex-direction: column; align-items: center; padding: 8px 18px;
    background: var(--card); border: 1px solid var(--border-s); border-radius: 10px;
    box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .ofl-total-label { font-size: 10.5px; color: var(--t3); font-weight: 500; }
  .ofl-total-val { font-size: 20px; font-weight: 800; color: var(--accent); line-height: 1.2; }

  .ofl-page-outer { flex: 1; display: flex; justify-content: center; padding: 28px 32px; }
  .ofl-page { width: 100%; max-width: 1200px; display: flex; flex-direction: column; gap: 22px; }

  .ofl-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .ofl-page-title { font-size: 21px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; }
  .ofl-page-sub { font-size: 13px; color: var(--t3); margin-top: 5px; }

  .ofl-search-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
    padding: 16px 20px; box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .ofl-search-wrap { position: relative; }
  .ofl-search-wrap > svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--t3); pointer-events: none; }
  .ofl-search {
    width: 100%; height: 44px; padding: 0 40px 0 44px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--bg); color: var(--t1);
    font-family: 'Inter', sans-serif; font-size: 13.5px; outline: none; transition: all .15s;
  }
  .ofl-search:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-lt); }
  .ofl-search::placeholder { color: var(--t3); }
  .ofl-search-clear {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: var(--t3); font-size: 14px; padding: 4px; transition: color .14s;
  }
  .ofl-search-clear:hover { color: var(--t1); }

  .ofl-sec-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
    overflow: hidden; box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .ofl-sec-head {
    padding: 16px 22px; border-bottom: 1px solid var(--border-s);
    background: linear-gradient(to right, #f8fbff, #eef7ff);
    display: flex; align-items: center; justify-content: space-between;
  }
  .ofl-sec-head-left { display: flex; align-items: center; gap: 10px; }
  .ofl-sec-head-icon {
    width: 34px; height: 34px; border-radius: 9px;
    background: linear-gradient(135deg, var(--accent), #3b82f6);
    display: flex; align-items: center; justify-content: center;
  }
  .ofl-sec-head-icon svg { color: #fff; width: 16px; height: 16px; }
  .ofl-sec-title { font-size: 14px; font-weight: 700; color: var(--t1); letter-spacing: -0.2px; }
  .ofl-sec-body { padding: 22px; }

  .ofl-cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

  .ofl-offer-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
    padding: 18px; cursor: pointer; transition: all .2s; position: relative; overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,158,247,.05);
  }
  .ofl-offer-card::before {
    content: ''; position: absolute; top: -20px; right: -20px; width: 80px; height: 80px;
    border-radius: 50%; background: radial-gradient(circle, rgba(0,158,247,.08) 0%, transparent 70%);
    transition: transform .3s;
  }
  .ofl-offer-card:hover::before { transform: scale(2.2); }
  .ofl-offer-card:hover { box-shadow: 0 8px 24px rgba(0,158,247,.14); transform: translateY(-2px); border-color: rgba(0,158,247,.35); }

  .ofl-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
  .ofl-card-top-left { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
  .ofl-card-top-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
  .ofl-avatar {
    width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #009ef7, #3b5bdb);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 16px; font-weight: 700; box-shadow: 0 2px 6px rgba(0,158,247,.3);
  }
  .ofl-card-name { font-size: 14px; font-weight: 700; color: var(--t1); line-height: 1.3; letter-spacing: -0.1px; }
  .ofl-card-id { font-size: 10.5px; color: var(--t3); margin-top: 2px; }

  .ofl-badge {
    display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600; white-space: nowrap;
  }
  .ofl-badge.green { background: var(--green-lt); color: var(--green); border: 1px solid #bbf7d0; }
  .ofl-badge.red { background: var(--red-lt); color: var(--red); border: 1px solid #fca5a5; }
  .ofl-badge.yellow { background: #fef9c3; color: #a16207; border: 1px solid #fde047; }
  .ofl-badge.blue { background: var(--accent-lt); color: var(--accent); border: 1px solid rgba(0,158,247,.25); }
  .ofl-badge.grey { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }

  .ofl-pdf-btn {
    display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 7px;
    background: linear-gradient(135deg, var(--accent), #3b5bdb); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; border: none; cursor: pointer;
    transition: all .15s; box-shadow: 0 2px 6px rgba(0,158,247,.2); white-space: nowrap;
    pointer-events: all; position: relative; z-index: 2;
  }
  .ofl-pdf-btn * { pointer-events: none; }
  .ofl-pdf-btn:hover { box-shadow: 0 4px 10px rgba(0,158,247,.35); transform: translateY(-1px); }
  .ofl-pdf-btn svg { width: 11px; height: 11px; }

  .ofl-divider { height: 1px; background: var(--border-s); margin: 12px 0; }

  .ofl-card-rows { display: flex; flex-direction: column; gap: 4px; }
  .ofl-card-row { display: flex; align-items: center; gap: 10px; padding: 5px 7px; border-radius: 7px; transition: background .14s; }
  .ofl-card-row:hover { background: var(--bg); }
  .ofl-row-icon { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ofl-row-icon.blue { background: var(--accent-lt); }
  .ofl-row-icon.blue svg { color: var(--accent); }
  .ofl-row-icon.indigo { background: #ede9fe; }
  .ofl-row-icon.indigo svg { color: #6d28d9; }
  .ofl-row-icon.purple { background: #f5f3ff; }
  .ofl-row-icon.purple svg { color: #7c3aed; }
  .ofl-row-icon.amber { background: #fef3c7; }
  .ofl-row-icon.amber svg { color: #d97706; }
  .ofl-row-icon svg { width: 12px; height: 12px; }
  .ofl-row-lbl { font-size: 10px; color: var(--t3); }
  .ofl-row-val { font-size: 12.5px; font-weight: 500; color: var(--t1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ofl-row-body { flex: 1; min-width: 0; }

  .ofl-date-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 4px; }
  .ofl-date-item { display: flex; align-items: center; gap: 6px; padding: 6px 8px; background: var(--bg); border-radius: 7px; }
  .ofl-date-item svg { width: 12px; height: 12px; flex-shrink: 0; }
  .ofl-date-lbl { font-size: 10px; color: var(--t3); }
  .ofl-date-val { font-size: 11.5px; font-weight: 600; color: var(--t1); }

  .ofl-empty { text-align: center; padding: 60px 20px; }
  .ofl-empty-icon {
    width: 72px; height: 72px; border-radius: 50%; background: var(--accent-lt);
    display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--accent);
  }
  .ofl-empty-title { font-size: 16px; font-weight: 700; color: var(--t1); margin-bottom: 6px; }
  .ofl-empty-sub { font-size: 13px; color: var(--t3); }
  .ofl-clear-btn {
    display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; padding: 8px 18px;
    border-radius: 8px; border: 1px solid var(--border); background: var(--card); color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .14s;
  }
  .ofl-clear-btn:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

  .ofl-pagination { display: flex; align-items: center; justify-content: space-between; padding-top: 18px; border-top: 1px solid var(--border-s); margin-top: 18px; }
  .ofl-pag-info { font-size: 12.5px; color: var(--t3); }
  .ofl-pag-btns { display: flex; align-items: center; gap: 10px; }
  .ofl-pag-btn {
    display: flex; align-items: center; gap: 4px; padding: 7px 14px; border-radius: 7px;
    border: 1px solid var(--border); background: var(--card); color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 500; cursor: pointer; transition: all .14s;
  }
  .ofl-pag-btn:hover:not(:disabled) { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .ofl-pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .ofl-pag-btn svg { width: 13px; height: 13px; }
  .ofl-pag-page { font-size: 12.5px; font-weight: 600; color: var(--t1); }

  .ofl-detail-back {
    display: flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--card); color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .14s;
  }
  .ofl-detail-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

  .ofl-detail-hero {
    background: linear-gradient(135deg, #0f3460, #16213e); border-radius: 14px;
    padding: 24px; display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 4px 16px rgba(15,52,96,.35);
  }
  .ofl-detail-hero-left { display: flex; align-items: center; gap: 16px; }
  .ofl-detail-avatar {
    width: 60px; height: 60px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), #3b5bdb);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 22px; font-weight: 800; box-shadow: 0 3px 10px rgba(0,158,247,.4);
  }
  .ofl-detail-name { font-size: 20px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
  .ofl-detail-id { font-size: 12px; color: rgba(255,255,255,.5); margin-top: 3px; }

  .ofl-sec-label {
    font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--t3); margin-bottom: 12px;
  }
  .ofl-info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .ofl-info-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .ofl-info-item {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 10px; padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
  }
  .ofl-info-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ofl-info-icon.blue { background: var(--accent-lt); }
  .ofl-info-icon.blue svg { color: var(--accent); }
  .ofl-info-icon.indigo { background: #ede9fe; }
  .ofl-info-icon.indigo svg { color: #6d28d9; }
  .ofl-info-icon.green { background: var(--green-lt); }
  .ofl-info-icon.green svg { color: var(--green); }
  .ofl-info-icon.amber { background: #fef3c7; }
  .ofl-info-icon.amber svg { color: #d97706; }
  .ofl-info-icon.teal { background: #ccfbf1; }
  .ofl-info-icon.teal svg { color: #0f766e; }
  .ofl-info-icon.purple { background: #f5f3ff; }
  .ofl-info-icon.purple svg { color: #7c3aed; }
  .ofl-info-icon svg { width: 16px; height: 16px; }
  .ofl-info-lbl { font-size: 10.5px; font-weight: 600; color: var(--t3); margin-bottom: 3px; }
  .ofl-info-val { font-size: 13px; font-weight: 600; color: var(--t1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .ofl-template-card {
    background: var(--accent-lt); border: 1px solid rgba(0,158,247,.2); border-radius: 10px; padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
  }
  .ofl-template-icon {
    width: 38px; height: 38px; border-radius: 10px; background: var(--card);
    box-shadow: 0 1px 4px rgba(0,158,247,.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ofl-template-icon svg { color: var(--accent); width: 16px; height: 16px; }
  .ofl-template-lbl { font-size: 11px; color: var(--t2); font-weight: 500; }
  .ofl-template-val { font-size: 13px; font-weight: 700; color: var(--t1); margin-top: 2px; }

  .ofl-terms-head { display: flex; align-items: center; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid var(--border-s); }
  .ofl-terms-head-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: linear-gradient(135deg, var(--accent), #3b82f6);
    display: flex; align-items: center; justify-content: center;
  }
  .ofl-terms-head-icon svg { color: #fff; width: 15px; height: 15px; }
  .ofl-terms-title { font-size: 15px; font-weight: 700; color: var(--t1); }

  .ofl-term-item {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 10px; padding: 16px;
    display: flex; gap: 14px; transition: box-shadow .15s;
  }
  .ofl-term-item:hover { box-shadow: 0 4px 12px rgba(0,158,247,.1); }
  .ofl-term-num {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), #3b5bdb);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 12px; font-weight: 700;
  }
  .ofl-term-title { font-size: 13px; font-weight: 700; color: var(--t1); margin-bottom: 5px; }
  .ofl-term-desc { font-size: 12.5px; color: var(--t2); line-height: 1.5; }
  .ofl-no-terms { text-align: center; padding: 40px 20px; background: var(--bg); border-radius: 10px; border: 1px dashed var(--border); }

  /* ── EDIT STATUS STYLES (same pattern as job opening) ── */
  .ofl-edit-row { display: flex; align-items: center; gap: 6px; }
  .ofl-edit-select {
    flex: 1; height: 34px; padding: 0 10px; border-radius: 7px;
    border: 1px solid var(--accent); background: #fff;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: var(--t1);
    outline: none; cursor: pointer;
  }
  .ofl-edit-save {
    width: 30px; height: 30px; border-radius: 7px; border: none;
    background: var(--accent); color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background .14s; flex-shrink: 0;
  }
  .ofl-edit-save:hover { background: var(--accent-h); }
  .ofl-edit-save:disabled { opacity: .5; cursor: not-allowed; }
  .ofl-edit-cancel {
    width: 30px; height: 30px; border-radius: 7px; border: 1px solid var(--border);
    background: #fff; color: var(--t3); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all .14s; flex-shrink: 0;
  }
  .ofl-edit-cancel:hover { background: var(--bg); color: var(--t1); }
  .ofl-edit-pencil {
    padding: 3px; border-radius: 5px; border: none; background: none;
    cursor: pointer; color: var(--t3); display: inline-flex;
    align-items: center; justify-content: center; transition: all .14s; margin-left: 8px;
  }
  .ofl-edit-pencil:hover { color: var(--accent); background: var(--accent-lt); }

  .ofl-loading {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 100vh; background: var(--bg); gap: 14px;
  }
  .ofl-spinner {
    width: 44px; height: 44px; border: 4px solid var(--accent-lt); border-top-color: var(--accent);
    border-radius: 50%; animation: ofl-spin 1s linear infinite;
  }
  @keyframes ofl-spin { to { transform: rotate(360deg); } }
  .ofl-loading-txt { font-size: 14px; font-weight: 500; color: var(--t2); }

  @media (max-width: 1024px) { .ofl-cards-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) {
    .ofl-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .ofl-sb.open { transform: translateX(0); }
    .ofl-main { margin-left: 0 !important; }
    .ofl-page-outer { padding: 16px; }
    .ofl-header { padding: 0 16px; }
    .ofl-cards-grid { grid-template-columns: 1fr; }
    .ofl-info-grid { grid-template-columns: 1fr; }
    .ofl-info-grid-3 { grid-template-columns: 1fr; }
  }
`

const API_BASE_URL = "https://ats.vaaman.in/api/method/resume.api.offer_letter"

export default function OfferListPage() {
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [offers, setOffers] = useState<any[]>([])
    const [selectedOffer, setSelectedOffer] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const ITEMS_PER_PAGE = 10
    const [currentPage, setCurrentPage] = useState(1)

    // ── EDIT STATUS STATE ────────────────────────────────────
    const [editingStatus, setEditingStatus] = useState(false)
    const [editStatusVal, setEditStatusVal] = useState("")
    const [savingStatus, setSavingStatus] = useState(false)
    const [availableStatuses, setAvailableStatuses] = useState<string[]>([])
    // ────────────────────────────────────────────────────────

    const fetchOffers = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}.get_job_offer_list`, {
                credentials: 'include', headers: { 'Content-Type': 'application/json' },
            })
            const jsonData = await res.json()
            const data = jsonData?.message?.data || []
            setOffers([...data].sort((a, b) => new Date(b.creation).getTime() - new Date(a.creation).getTime()))
        } catch (err) {
            console.error("Error fetching offers:", err)
            setOffers([])
        } finally { setLoading(false) }
    }

    const fetchOfferDetails = async (name: string) => {
        setLoading(true)
        setEditingStatus(false)
        try {
            const res = await fetch(`${API_BASE_URL}.get_job_offer_details?job_offer_name=${encodeURIComponent(name)}`, {
                credentials: 'include', headers: { 'Content-Type': 'application/json' },
            })
            const jsonData = await res.json()
            setSelectedOffer(jsonData?.message?.data)
        } catch (err) {
            console.error("Error fetching offer details:", err)
            setSelectedOffer(null)
        } finally { setLoading(false) }
    }

    // ── FETCH STATUSES ───────────────────────────────────────
    const fetchStatuses = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}.get_job_offer_statuses`, {
                credentials: 'include', headers: { 'Content-Type': 'application/json' },
            })
            const jsonData = await res.json()
            const statuses = jsonData?.message?.data || ["Awaiting Response", "Accepted", "Rejected"]
            setAvailableStatuses(statuses)
        } catch {
            setAvailableStatuses(["Awaiting Response", "Accepted", "Rejected"])
        }
    }
    // ────────────────────────────────────────────────────────

    // ── SAVE STATUS ──────────────────────────────────────────
    // const saveStatus = async () => {
    //     if (!selectedOffer) return
    //     setSavingStatus(true)
    //     try {
    //         const formData = new FormData()
    //         formData.append("name", selectedOffer.name)
    //         formData.append("status", editStatusVal)

    //         const res = await fetch(`${API_BASE_URL}.update_job_offer`, {
    //             method: "POST",
    //             credentials: "include",
    //             body: formData,
    //         })
    //         const jsonData = await res.json()
    //         if (jsonData?.message) {
    //             const updated = { ...selectedOffer, status: editStatusVal }
    //             setSelectedOffer(updated)
    //             setOffers(prev => prev.map(o => o.name === updated.name ? { ...o, status: editStatusVal } : o))
    //             setEditingStatus(false)
    //         } else {
    //             alert("Failed to update status. Please try again.")
    //         }
    //     } catch (err) {
    //         console.error(err)
    //         alert("Error saving status.")
    //     } finally {
    //         setSavingStatus(false)
    //     }
    // }

    const saveStatus = async () => {
        if (!selectedOffer) return
        setSavingStatus(true)
        try {
            const res = await fetch(
                `${API_BASE_URL}.update_job_offer_status?name=${encodeURIComponent(selectedOffer.name)}&status=${encodeURIComponent(editStatusVal)}`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                }
            )

            // Log raw response to see what Frappe is actually returning
            const text = await res.text()
            console.log("Raw response:", text)
            console.log("Status code:", res.status)

            let jsonData
            try { jsonData = JSON.parse(text) } catch { jsonData = null }

            if (res.ok && jsonData?.message) {
                const updated = { ...selectedOffer, status: editStatusVal }
                setSelectedOffer(updated)
                setOffers(prev => prev.map(o => o.name === updated.name ? { ...o, status: editStatusVal } : o))
                setEditingStatus(false)
            } else {
                alert(`Failed: ${text}`)
            }
        } catch (err) {
            console.error(err)
            alert("Error saving status.")
        } finally {
            setSavingStatus(false)
        }
    }
    // ────────────────────────────────────────────────────────

    const filteredOffers = offers.filter((offer) => {
        const s = searchQuery.toLowerCase()
        return (
            searchQuery === "" ||
            (offer.applicant_name || "").toLowerCase().includes(s) ||
            (offer.applicant_email || "").toLowerCase().includes(s) ||
            (offer.designation || "").toLowerCase().includes(s) ||
            (offer.company || "").toLowerCase().includes(s) ||
            (offer.name || "").toLowerCase().includes(s) ||
            (offer.custom_grade || "").toLowerCase().includes(s) ||
            (offer.custom_contact_name || "").toLowerCase().includes(s)
        )
    })

    const totalPages = Math.ceil(filteredOffers.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedOffers = filteredOffers.slice(startIndex, endIndex)

    useEffect(() => { setCurrentPage(1) }, [searchQuery])
    useEffect(() => { fetchOffers(); fetchStatuses() }, [])
    useEffect(() => { document.title = 'Offer Letter List' }, [])
    useEffect(() => {
        const handleFocus = () => fetchOffers()
        const handleVisibility = () => { if (document.visibilityState === 'visible') fetchOffers() }
        window.addEventListener('focus', handleFocus)
        document.addEventListener('visibilitychange', handleVisibility)
        return () => {
            window.removeEventListener('focus', handleFocus)
            document.removeEventListener('visibilitychange', handleVisibility)
        }
    }, [])

    const getStatusBadgeClass = (status: string) => {
        const s = status?.toLowerCase() || ""
        if (s.includes("accept")) return "green"
        if (s.includes("reject")) return "red"
        if (s.includes("pending") || s.includes("awaiting")) return "yellow"
        return "blue"
    }

    if (loading && offers.length === 0) {
        return (
            <>
                <style>{css}</style>
                <div className="ofl">
                    <div className="ofl-loading">
                        <div className="ofl-spinner" />
                        <p className="ofl-loading-txt">Loading offers...</p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <style>{css}</style>
            <div className="ofl">
                <div className="ofl-wrap">

                    <div className={`ofl-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

                    <aside className={`ofl-sb${sidebarOpen ? "" : " collapsed"}`}>
                        <div className="ofl-sb-brand">
                            <div className="ofl-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
                            <div><div className="ofl-sb-name">Job Management</div><div className="ofl-sb-sub">HR Platform</div></div>
                            <button className="ofl-sb-close" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
                        </div>
                        <nav className="ofl-nav">
                            <Link href="/create-job" className="ofl-nav-cta"><Plus size={14} /> New Job Opening</Link>
                            <div className="ofl-nav-lbl">General</div>
                            <Link href="/home" className="ofl-nav-link">
                                <Home size={15} /> Home
                            </Link>
                            <div className="ofl-nav-lbl">Pipeline</div>
                            <Link href="/job-opening" className="ofl-nav-link"><Briefcase size={15} /> Job Opening</Link>
                            <Link href="/upload-resumes" className="ofl-nav-link"><Upload size={15} /> Resume Collection</Link>
                            <Link href="/candidates" className="ofl-nav-link"><Users size={15} /> Candidates</Link>
                            <Link href="/interview" className="ofl-nav-link"><Calendar size={15} /> Interview Scheduling</Link>
                            <div className="ofl-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
                            <Link href="/feedback" className="ofl-nav-link"><MessageSquare size={15} /> Feedback</Link>
                            <Link href="/document-verify-list" className="ofl-nav-link"><FileText size={15} /> Document Verification</Link>
                            <Link href="/offer-list" className="ofl-nav-link active"><Zap size={15} /> Offer Letter</Link>
                            <Link href="/letter-appointment" className="ofl-nav-link"><UserCheck size={15} /> Appointment Letter</Link>
                        </nav>
                        <div className="ofl-sb-foot">
                            <button className="ofl-logout"><LogOut size={15} /> Sign out</button>
                        </div>
                    </aside>

                    <div className={`ofl-main${sidebarOpen ? "" : " sb-closed"}`}>
                        <header className="ofl-header">
                            <button className="ofl-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
                            <div className="ofl-hdr-sep" />
                            <Link href="/home" className="ofl-btn-back"><ArrowLeft size={13} /> Back</Link>
                            <div className="ofl-hdr-sep" />
                            {/* <div className="ofl-crumb">
                                <Home size={13} /> Home <ChevronRight size={13} /> <strong>Offer Letter</strong>
                            </div> */}
                            <div className="ofl-crumb">
                                <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'inherit', textDecoration: 'none' }}>
                                    <Home size={13} /> Home
                                </Link>
                                <ChevronRight size={13} />
                                <strong>Offer Letter</strong>
                            </div>
                            <div className="ofl-hdr-right">
                                <div className="ofl-total-pill">
                                    <span className="ofl-total-label">Total Offers</span>
                                    <span className="ofl-total-val">{offers.length}</span>
                                </div>
                                <button className="ofl-btn" onClick={() => window.location.href = '/letter-appointment'}>
                                    <FileCheck size={14} /> Create Appointment Letter
                                </button>
                            </div>
                        </header>

                        <div className="ofl-page-outer">
                            <div className="ofl-page">

                                <div className="ofl-toolbar">
                                    <div>
                                        <h1 className="ofl-page-title">Job Offer Letters</h1>
                                        <p className="ofl-page-sub">View and manage all job offers</p>
                                    </div>
                                    {selectedOffer && (
                                        <button className="ofl-detail-back" onClick={() => { setSelectedOffer(null); setEditingStatus(false) }}>
                                            <ArrowLeft size={14} /> Back to List
                                        </button>
                                    )}
                                </div>

                                {!selectedOffer && (
                                    <div className="ofl-search-card">
                                        <div className="ofl-search-wrap">
                                            <Search size={16} />
                                            <input type="text" className="ofl-search"
                                                placeholder="Search by candidate name, email, position, company, grade, or ID..."
                                                value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                                            {searchQuery && <button className="ofl-search-clear" onClick={() => setSearchQuery("")}>✕</button>}
                                        </div>
                                    </div>
                                )}

                                <div className="ofl-sec-card">
                                    {!selectedOffer ? (
                                        <>
                                            <div className="ofl-sec-head">
                                                <div className="ofl-sec-head-left">
                                                    <div className="ofl-sec-head-icon"><FileText size={16} /></div>
                                                    <span className="ofl-sec-title">All Candidates</span>
                                                </div>
                                            </div>
                                            <div className="ofl-sec-body">
                                                {filteredOffers.length > 0 ? (
                                                    <>
                                                        <div className="ofl-cards-grid">
                                                            {paginatedOffers.map(offer => (
                                                                <div key={offer.name} className="ofl-offer-card" onClick={() => fetchOfferDetails(offer.name)}>
                                                                    <div className="ofl-card-top">
                                                                        <div className="ofl-card-top-left">
                                                                            <div className="ofl-avatar">{(offer.applicant_name || "?").charAt(0).toUpperCase()}</div>
                                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                                <div className="ofl-card-name">{offer.applicant_name}</div>
                                                                                <div className="ofl-card-id">{offer.name}</div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="ofl-card-top-right">
                                                                            <span className={`ofl-badge ${getStatusBadgeClass(offer.status)}`}>{offer.status}</span>
                                                                            {offer.status?.toLowerCase() !== "rejected" && (
                                                                                <button
                                                                                    className="ofl-pdf-btn"
                                                                                    onClick={e => {
                                                                                        e.stopPropagation()
                                                                                        e.preventDefault()
                                                                                        const url = `https://ats.vaaman.in/api/method/frappe.utils.print_format.download_pdf?doctype=Job%20Offer&name=${encodeURIComponent(offer.name)}&format=Offer%20Letter%20with%20Annexure&no_letterhead=0`
                                                                                        window.open(url, '_blank')
                                                                                    }}
                                                                                    onMouseDown={e => e.stopPropagation()}
                                                                                >
                                                                                    <FileText size={11} /> Download PDF
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="ofl-divider" />
                                                                    <div className="ofl-card-rows">
                                                                        <div className="ofl-card-row">
                                                                            <div className="ofl-row-icon blue"><Briefcase size={12} /></div>
                                                                            <div className="ofl-row-body"><div className="ofl-row-lbl">Position</div><div className="ofl-row-val">{offer.designation || "—"}</div></div>
                                                                        </div>
                                                                        <div className="ofl-card-row">
                                                                            <div className="ofl-row-icon indigo"><Building2 size={12} /></div>
                                                                            <div className="ofl-row-body"><div className="ofl-row-lbl">Company</div><div className="ofl-row-val">{offer.company || "—"}</div></div>
                                                                        </div>
                                                                        <div className="ofl-card-row">
                                                                            <div className="ofl-row-icon blue"><Mail size={12} /></div>
                                                                            <div className="ofl-row-body"><div className="ofl-row-lbl">Email</div><div className="ofl-row-val">{offer.applicant_email || "—"}</div></div>
                                                                        </div>
                                                                        <div className="ofl-card-row">
                                                                            <div className="ofl-row-icon purple"><Phone size={12} /></div>
                                                                            <div className="ofl-row-body"><div className="ofl-row-lbl">Mobile</div><div className="ofl-row-val">{offer.custom_mobile_no || "—"}</div></div>
                                                                        </div>
                                                                        <div className="ofl-card-row">
                                                                            <div className="ofl-row-icon amber"><Star size={12} /></div>
                                                                            <div className="ofl-row-body"><div className="ofl-row-lbl">Grade</div><div className="ofl-row-val">{offer.custom_grade || "—"}</div></div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="ofl-date-grid">
                                                                        <div className="ofl-date-item">
                                                                            <Calendar size={12} style={{ color: '#6d28d9' }} />
                                                                            <div><div className="ofl-date-lbl">Offer Date</div><div className="ofl-date-val">{offer.offer_date || "—"}</div></div>
                                                                        </div>
                                                                        <div className="ofl-date-item">
                                                                            <Calendar size={12} style={{ color: 'var(--green)' }} />
                                                                            <div><div className="ofl-date-lbl">Joining</div><div className="ofl-date-val">{offer.custom_joining_date || "—"}</div></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {filteredOffers.length > ITEMS_PER_PAGE && (
                                                            <div className="ofl-pagination">
                                                                <span className="ofl-pag-info">Showing {startIndex + 1} to {Math.min(endIndex, filteredOffers.length)} of {filteredOffers.length} offers</span>
                                                                <div className="ofl-pag-btns">
                                                                    <button className="ofl-pag-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft size={13} /> Previous</button>
                                                                    <span className="ofl-pag-page">Page {currentPage} of {totalPages}</span>
                                                                    <button className="ofl-pag-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next <ChevronRight size={13} /></button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="ofl-empty">
                                                        <div className="ofl-empty-icon"><FileText size={30} /></div>
                                                        <p className="ofl-empty-title">{searchQuery ? "No Matching Offers Found" : "No Offers Found"}</p>
                                                        <p className="ofl-empty-sub">{searchQuery ? `No offers match "${searchQuery}". Try a different search term.` : "No job offers available yet. Check back later!"}</p>
                                                        {searchQuery && <button className="ofl-clear-btn" onClick={() => setSearchQuery("")}>Clear Search</button>}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        /* DETAIL VIEW */
                                        <div className="ofl-sec-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                                            {/* Hero */}
                                            <div className="ofl-detail-hero">
                                                <div className="ofl-detail-hero-left">
                                                    <div className="ofl-detail-avatar">{(selectedOffer.applicant_name || "?").charAt(0).toUpperCase()}</div>
                                                    <div>
                                                        <div className="ofl-detail-name">{selectedOffer.applicant_name}</div>
                                                        <div className="ofl-detail-id">ID: {selectedOffer.name}</div>
                                                    </div>
                                                </div>
                                                {/* ── EDITABLE STATUS in hero ── */}
                                                {editingStatus ? (
                                                    <div className="ofl-edit-row">
                                                        <select
                                                            className="ofl-edit-select"
                                                            value={editStatusVal}
                                                            onChange={e => setEditStatusVal(e.target.value)}
                                                        >
                                                            {availableStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                        <button className="ofl-edit-save" onClick={saveStatus} disabled={savingStatus} title="Save">
                                                            <Check size={14} />
                                                        </button>
                                                        <button className="ofl-edit-cancel" onClick={() => setEditingStatus(false)} title="Cancel">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <span className={`ofl-badge ${getStatusBadgeClass(selectedOffer.status)}`} style={{ fontSize: 13, padding: '6px 16px' }}>
                                                            {selectedOffer.status}
                                                        </span>
                                                        <button
                                                            className="ofl-edit-pencil"
                                                            style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
                                                            onClick={() => { setEditStatusVal(selectedOffer.status); setEditingStatus(true) }}
                                                            title="Edit status"
                                                        >
                                                            <Edit2 size={13} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Contact & Position */}
                                            <div>
                                                <p className="ofl-sec-label">Contact & Position</p>
                                                <div className="ofl-info-grid">
                                                    {[
                                                        { icon: <Mail size={16} />, cls: "blue", label: "Email Address", val: selectedOffer.applicant_email },
                                                        { icon: <Phone size={16} />, cls: "purple", label: "Mobile No", val: selectedOffer.custom_mobile_no },
                                                        { icon: <Briefcase size={16} />, cls: "indigo", label: "Designation", val: selectedOffer.designation },
                                                        { icon: <Building2 size={16} />, cls: "blue", label: "Company", val: selectedOffer.company },
                                                        { icon: <Star size={16} />, cls: "amber", label: "Grade", val: selectedOffer.custom_grade },
                                                        { icon: <UserCheck size={16} />, cls: "teal", label: "Contact Name", val: selectedOffer.custom_contact_name },
                                                    ].map(item => (
                                                        <div key={item.label} className="ofl-info-item">
                                                            <div className={`ofl-info-icon ${item.cls}`}>{item.icon}</div>
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <div className="ofl-info-lbl">{item.label}</div>
                                                                <div className="ofl-info-val">{item.val || "—"}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Important Dates */}
                                            <div>
                                                <p className="ofl-sec-label">Important Dates</p>
                                                <div className="ofl-info-grid-3">
                                                    {[
                                                        { icon: <Calendar size={16} />, cls: "blue", label: "Offer Date", val: selectedOffer.offer_date },
                                                        { icon: <Calendar size={16} />, cls: "indigo", label: "Offer Acceptance Date", val: selectedOffer.custom_offer_acceptance_date },
                                                        { icon: <Calendar size={16} />, cls: "green", label: "Joining Date", val: selectedOffer.custom_joining_date },
                                                    ].map(item => (
                                                        <div key={item.label} className="ofl-info-item">
                                                            <div className={`ofl-info-icon ${item.cls}`}>{item.icon}</div>
                                                            <div>
                                                                <div className="ofl-info-lbl">{item.label}</div>
                                                                <div className="ofl-info-val">{item.val || "—"}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {selectedOffer.job_offer_term_template && (
                                                <div className="ofl-template-card">
                                                    <div className="ofl-template-icon"><FileText size={16} /></div>
                                                    <div>
                                                        <div className="ofl-template-lbl">Template Used</div>
                                                        <div className="ofl-template-val">{selectedOffer.job_offer_term_template}</div>
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <div className="ofl-terms-head">
                                                    <div className="ofl-terms-head-icon"><FileCheck size={15} /></div>
                                                    <span className="ofl-terms-title">Offer Terms & Conditions</span>
                                                </div>
                                                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                    {selectedOffer.offer_terms?.length ? (
                                                        selectedOffer.offer_terms.map((term: any, idx: number) => (
                                                            <div key={idx} className="ofl-term-item">
                                                                <div className="ofl-term-num">{idx + 1}</div>
                                                                <div style={{ flex: 1 }}>
                                                                    <div className="ofl-term-title">{term.offer_term}</div>
                                                                    <div className="ofl-term-desc">{term.value}</div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="ofl-no-terms">
                                                            <FileText size={36} style={{ color: 'var(--t3)', margin: '0 auto 10px', display: 'block' }} />
                                                            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--t2)' }}>No offer terms available</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

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
