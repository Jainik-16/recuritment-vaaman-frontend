
"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Star, MessageSquare, User, Calendar, ArrowLeft, Filter, Loader2,
  MapPin, Briefcase, Mail, Globe, FileText, Building2, Clock,
  UserCheck, Award, AlertCircle, TrendingUp, ChevronLeft, ChevronRight,
  Plus, Upload, Users, Zap, LogOut, Home, Menu, X,
} from "lucide-react"
import Link from "next/link"
import { API_BASE_URL } from "@/lib/api-config"
const API_MODULE_PATH = "resume.api.candidate_feedback"
import { axiosConfig } from '@/lib/axios-config'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .fl {
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
    --yellow:    #d97706;
    --yellow-lt: #fef3c7;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13.5px;
    -webkit-font-smoothing: antialiased;
  }

  .fl-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  .fl-sb {
    width: var(--sb-w); background: var(--sb); min-height: 100vh;
    position: fixed; top: 0; left: 0; z-index: 100; display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .fl-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }

  .fl-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }
  .fl-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(0,158,247,.15); border: 1px solid rgba(0,158,247,.25);
    display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
  }
  .fl-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .fl-sb-name { font-size: 14px; font-weight: 700; color: #ffffff; letter-spacing: -0.1px; line-height: 1.25; }
  .fl-sb-sub { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
  .fl-sb-close {
    margin-left: auto; flex-shrink: 0; width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer; color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center; transition: all .14s;
  }
  .fl-sb-close:hover { background: var(--sb-hover); color: #fff; }

  .fl-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .fl-nav::-webkit-scrollbar { width: 3px; }
  .fl-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }

  .fl-nav-cta {
    display: flex; align-items: center; gap: 9px; padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md); border: 1px solid rgba(0,158,247,.28);
    color: var(--accent); font-size: 13px; font-weight: 600; text-decoration: none;
    transition: background .15s; margin-bottom: 22px; letter-spacing: -0.1px;
  }
  .fl-nav-cta:hover { background: rgba(0,158,247,.24); }
  .fl-nav-cta svg { flex-shrink: 0; }

  .fl-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
  }
  .fl-nav-link {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt); text-decoration: none; transition: all .14s;
  }
  .fl-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; transition: opacity .14s; }
  .fl-nav-link:hover { background: var(--sb-hover); color: #ffffff; }
  .fl-nav-link:hover svg { opacity: 1; }
  .fl-nav-link.active { background: var(--accent-md); color: var(--accent); border: 1px solid rgba(0,158,247,.2); }
  .fl-nav-link.active svg { opacity: 1; }

  .fl-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .fl-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; border-radius: 8px; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--sb-lbl); text-align: left; transition: all .14s;
  }
  .fl-logout svg { opacity: .6; width: 15px; height: 15px; }
  .fl-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }
  .fl-logout:hover svg { opacity: 1; }

  .fl-overlay {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
  }
  @media (max-width: 768px) { .fl-overlay.show { display: block; } }

  .fl-main {
    margin-left: var(--sb-w); flex: 1; display: flex; flex-direction: column;
    min-height: 100vh; transition: margin-left .25s cubic-bezier(.4,0,.2,1);
  }
  .fl-main.sb-closed { margin-left: 0; }

  .fl-header {
    height: 60px; background: #ffffff; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 0 rgba(0,158,247,.08);
  }
  .fl-toggle {
    width: 34px; height: 34px; border-radius: 8px; background: none;
    border: 1px solid var(--border); cursor: pointer; display: flex;
    align-items: center; justify-content: center; color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .fl-btn-back {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 8px;
  background: transparent; color: var(--t2);
  font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
  border: 1px solid var(--border); cursor: pointer; text-decoration: none;
  transition: all .14s; white-space: nowrap;
  }
  .fl-btn-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); } 
  .fl-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .fl-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .fl-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
  .fl-crumb svg { width: 13px; height: 13px; color: var(--t3); }
  .fl-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }

  .fl-page-outer { flex: 1; display: flex; justify-content: center; padding: 28px 32px; }
  .fl-page { width: 100%; max-width: 1200px; display: flex; flex-direction: column; gap: 22px; }

  .fl-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
  .fl-page-title { font-size: 21px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; line-height: 1.15; }
  .fl-page-sub { font-size: 13px; color: var(--t3); margin-top: 5px; font-weight: 400; }

  .fl-select-wrap { position: relative; display: flex; align-items: center; }
  .fl-select-wrap svg { position: absolute; left: 12px; pointer-events: none; color: var(--t3); }
  .fl-select {
    height: 40px; padding: 0 14px 0 36px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--card); color: var(--t1);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; outline: none; appearance: none; min-width: 160px; transition: border-color .15s;
  }
  .fl-select:focus { border-color: var(--accent); }

  .fl-prog-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
    padding: 20px 24px; box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .fl-prog-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .fl-prog-label { font-size: 14px; font-weight: 600; color: var(--t1); }
  .fl-prog-badge {
    display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 20px;
    font-size: 11.5px; font-weight: 600; background: var(--accent-lt); border: 1px solid var(--border); color: var(--accent);
  }
  .fl-prog-bar-wrap { height: 8px; border-radius: 4px; background: var(--border-s); overflow: hidden; }
  .fl-prog-bar { height: 100%; border-radius: 4px; background: var(--accent); transition: width .4s ease; }

  .fl-search-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
    padding: 16px 20px; box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .fl-search-wrap { position: relative; }
  .fl-search-wrap svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--t3); pointer-events: none; }
  .fl-search {
    width: 100%; height: 44px; padding: 0 40px 0 44px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--bg); color: var(--t1);
    font-family: 'Inter', sans-serif; font-size: 13.5px; outline: none; transition: all .15s;
  }
  .fl-search:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-lt); }
  .fl-search::placeholder { color: var(--t3); }
  .fl-search-clear {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: var(--t3); font-size: 14px; transition: color .14s; padding: 4px;
  }
  .fl-search-clear:hover { color: var(--t1); }

  .fl-error {
    background: #fef2f2; border: 1px solid #fca5a5; border-radius: 10px;
    padding: 14px 18px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  }
  .fl-error-msg { color: var(--red); font-size: 13.5px; font-weight: 500; }
  .fl-retry-btn {
    padding: 6px 14px; border-radius: 7px; border: 1px solid #fca5a5;
    background: #fff; color: var(--red); font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .14s;
  }
  .fl-retry-btn:hover { background: #fef2f2; }

  .fl-layout { display: grid; grid-template-columns: 1fr 340px; gap: 22px; align-items: start; }

  .fl-sec-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
    overflow: hidden; box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .fl-sec-head {
    padding: 16px 20px; border-bottom: 1px solid var(--border-s); display: flex; align-items: center; gap: 10px;
  }
  .fl-sec-title { font-size: 14px; font-weight: 700; color: var(--t1); letter-spacing: -0.2px; }
  .fl-sec-count {
    display: inline-flex; align-items: center; padding: 2px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600; background: var(--accent-lt); color: var(--accent); border: 1px solid var(--border); margin-left: auto;
  }
  .fl-sec-body { padding: 20px; }

  .fl-cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }

  .fl-cand-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
    padding: 16px; cursor: pointer; transition: all .2s; box-shadow: 0 1px 3px rgba(0,158,247,.05);
    position: relative; overflow: hidden;
  }
  .fl-cand-card::before {
    content: ''; position: absolute; top: -20px; right: -20px; width: 80px; height: 80px;
    border-radius: 50%; background: radial-gradient(circle, rgba(0,158,247,.08) 0%, transparent 70%); transition: transform .3s;
  }
  .fl-cand-card:hover::before { transform: scale(2); }
  .fl-cand-card:hover { box-shadow: 0 8px 24px rgba(0,158,247,.14); transform: translateY(-2px); border-color: rgba(0,158,247,.35); }
  .fl-cand-card.selected { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(0,158,247,.2); }

  .fl-cand-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
  .fl-avatar {
    width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #009ef7, #3b5bdb);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 14px; font-weight: 700; letter-spacing: 0.5px;
    box-shadow: 0 2px 6px rgba(0,158,247,.3);
  }
  .fl-cand-name { font-size: 14px; font-weight: 700; color: var(--t1); line-height: 1.3; letter-spacing: -0.1px; }
  .fl-cand-id { font-size: 10.5px; color: var(--t3); margin-top: 2px; }

  .fl-badge-cleared { background: var(--green-lt); color: var(--green); border: 1px solid #bbf7d0; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .fl-badge-rejected { background: var(--red-lt); color: var(--red); border: 1px solid #fecaca; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .fl-badge-pending { background: var(--yellow-lt); color: var(--yellow); border: 1px solid #fde68a; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }

  .fl-divider { height: 1px; background: var(--border-s); margin: 10px 0; }

  .fl-cand-rows { display: flex; flex-direction: column; gap: 4px; }
  .fl-cand-row { display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-radius: 8px; transition: background .14s; }
  .fl-cand-row:hover { background: var(--bg); }
  .fl-row-icon { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .fl-row-icon.blue { background: var(--accent-lt); }
  .fl-row-icon.blue svg { color: var(--accent); }
  .fl-row-icon.indigo { background: #ede9fe; }
  .fl-row-icon.indigo svg { color: #6d28d9; }
  .fl-row-icon.amber { background: #fef3c7; }
  .fl-row-icon.amber svg { color: #d97706; }
  .fl-row-icon svg { width: 13px; height: 13px; }
  .fl-row-lbl { font-size: 10px; color: var(--t3); }
  .fl-row-val { font-size: 12px; font-weight: 500; color: var(--t1); margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fl-row-body { flex: 1; min-width: 0; }

  .fl-stars { display: flex; gap: 2px; }
  .fl-stars-row { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
  .fl-stars-sub { font-size: 10.5px; color: var(--t3); }

  .fl-cand-actions { display: flex; gap: 8px; margin-top: 10px; }
  .fl-btn-sm {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
    padding: 7px 10px; border-radius: 7px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;
    cursor: pointer; transition: all .14s; border: 1px solid var(--border); background: var(--card); color: var(--t2);
  }
  .fl-btn-sm:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .fl-btn-sm.accent { background: var(--accent); color: #fff; border-color: var(--accent); }
  .fl-btn-sm.accent:hover { background: var(--accent-h); }
  .fl-btn-sm svg { width: 12px; height: 12px; }

  .fl-empty { text-align: center; padding: 48px 20px; }
  .fl-empty-icon {
    width: 64px; height: 64px; border-radius: 50%; background: var(--accent-lt);
    display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--accent);
  }
  .fl-empty-title { font-size: 16px; font-weight: 700; color: var(--t1); margin-bottom: 6px; }
  .fl-empty-sub { font-size: 13px; color: var(--t3); }

  .fl-pagination { display: flex; align-items: center; justify-content: space-between; padding-top: 16px; border-top: 1px solid var(--border-s); margin-top: 16px; }
  .fl-pag-info { font-size: 12.5px; color: var(--t3); }
  .fl-pag-btns { display: flex; align-items: center; gap: 10px; }
  .fl-pag-btn {
    display: flex; align-items: center; gap: 4px; padding: 6px 12px; border-radius: 7px;
    border: 1px solid var(--border); background: var(--card); color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 500; cursor: pointer; transition: all .14s;
  }
  .fl-pag-btn:hover:not(:disabled) { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .fl-pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .fl-pag-btn svg { width: 14px; height: 14px; }
  .fl-pag-page { font-size: 12.5px; font-weight: 600; color: var(--t1); }

  .fl-detail-hero {
    background: linear-gradient(135deg, #0f3460, #16213e); border-radius: 12px;
    padding: 22px; color: #fff; margin-bottom: 14px; box-shadow: 0 4px 16px rgba(15,52,96,.35);
  }
  .fl-detail-hero-head { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .fl-detail-hero-head svg { color: rgba(255,255,255,.7); }
  .fl-detail-hero-title { font-size: 14px; font-weight: 700; color: #fff; }
  .fl-detail-hero-for { font-size: 12px; color: rgba(255,255,255,.6); margin-top: 2px; }
  .fl-detail-row { margin-bottom: 14px; }
  .fl-detail-lbl { font-size: 11.5px; font-weight: 600; color: rgba(255,255,255,.55); margin-bottom: 4px; }
  .fl-detail-val { font-size: 13.5px; color: #fff; font-weight: 500; }
  .fl-detail-textarea {
    width: 100%; padding: 10px 12px; border-radius: 8px;
    border: 1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.12);
    color: #fff; font-family: 'Inter', sans-serif; font-size: 13px; line-height: 1.5; resize: none; outline: none;
  }
  .fl-detail-stars { display: flex; align-items: center; gap: 8px; }
  .fl-detail-stars-val { font-size: 12px; color: rgba(255,255,255,.65); }

  .fl-info-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
    overflow: hidden; box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .fl-info-head { padding: 14px 18px; border-bottom: 1px solid var(--border-s); }
  .fl-info-title { font-size: 14px; font-weight: 700; color: var(--t1); }
  .fl-info-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; }
  .fl-info-lbl { display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600; color: var(--t3); margin-bottom: 4px; }
  .fl-info-lbl svg { width: 13px; height: 13px; }
  .fl-info-val { font-size: 13px; font-weight: 600; color: var(--t1); }
  .fl-info-val-sm { font-size: 13px; color: var(--t2); }

  .fl-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .fl-tag { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; }
  .fl-tag.green { background: var(--green-lt); color: var(--green); border: 1px solid #bbf7d0; }
  .fl-tag.blue { background: var(--accent-lt); color: var(--accent); border: 1px solid var(--border); }
  .fl-tag.orange { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
  .fl-tag.red { background: var(--red-lt); color: var(--red); border: 1px solid #fecaca; }

  .fl-skill-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-s); }
  .fl-skill-row:last-child { border-bottom: none; }
  .fl-skill-name { font-size: 12.5px; color: var(--t2); font-weight: 500; }

  .fl-remarks-box { background: var(--bg); border-radius: 8px; padding: 10px 12px; font-size: 12.5px; color: var(--t2); line-height: 1.6; }

  .fl-empty-detail {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
    padding: 48px 24px; text-align: center; box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .fl-empty-detail svg { color: var(--t3); margin-bottom: 12px; }
  .fl-empty-detail-title { font-size: 15px; font-weight: 700; color: var(--t1); margin-bottom: 6px; }
  .fl-empty-detail-sub { font-size: 13px; color: var(--t3); line-height: 1.5; }

  .fl-loading {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 100vh; background: var(--bg); gap: 14px;
  }
  .fl-spin { animation: fl-spin 1s linear infinite; color: var(--accent); }
  @keyframes fl-spin { to { transform: rotate(360deg); } }
  .fl-loading-txt { font-size: 13.5px; color: var(--t3); }

  @media (max-width: 1024px) { .fl-layout { grid-template-columns: 1fr; } .fl-cards-grid { grid-template-columns: 1fr; } }
  @media (max-width: 768px) {
    .fl-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .fl-sb.open { transform: translateX(0); }
    .fl-main { margin-left: 0 !important; }
    .fl-page-outer { padding: 16px; }
    .fl-header { padding: 0 16px; }
    .fl-toolbar { flex-direction: column; }
  }
`

interface SkillAssessment { skill: string; rating: number }
interface ApplicantData { applicant_name: string; email_id: string; country: string; phone_number?: string; status?: string }
interface JobOpeningData { job_title: string; location: string; department?: string; designation?: string }
interface FeedbackItem {
  name: string; interview: string; interviewer: string; result: string; feedback: string;
  interview_round: string; creation: string; modified: string; applicant: ApplicantData;
  job_opening: JobOpeningData; skill_assessments: SkillAssessment[]; average_rating: number;
  total_skills: number; candidate_name?: string; interview_date?: string; position_applied_for?: string;
  department?: string; location?: string; new_position?: string; replacement_position?: string;
  applicant_rating?: string; final_score_recommendation?: string[]; not_shortlisted_reason?: string[];
  withdrawn_reason?: string[]; remarks?: string;
  job_applicant?: string;  // ADD THIS

}

export default function FeedbackPage() {
  const router = useRouter()
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([])
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const ITEMS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => { fetchFeedbackList() }, [])
  useEffect(() => { document.title = 'Feedback List' }, [])

  const fetchFeedbackList = async () => {
    setLoading(true); setError(null)
    try {
      console.log("🔄 Fetching feedback list from:", `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_candidate_feedback_list`)
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_candidate_feedback_list`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const result = await response.json()
      console.log("📦 Raw API Response:", result)
      if (result.message?.success) {
        setFeedbackList(result.message.data)
        console.log("✅ Fetched feedback list:", result.message.data.length, "records")
      } else {
        setError(result.message?.error || "Failed to fetch feedback")
        setFeedbackList([])
        console.error("⚠️ API returned success=false:", result)
      }
    } catch (err: any) {
      console.error("❌ Error fetching feedback list:", err)
      setError(err.message || "Network error"); setFeedbackList([])
    } finally { setLoading(false) }
  }

  const filteredFeedback = feedbackList.filter((item) => {
    const matchesStatus = filterStatus === "all" || item.result.toLowerCase() === filterStatus.toLowerCase()
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = searchQuery === "" ||
      (item.candidate_name || item.applicant?.applicant_name || "").toLowerCase().includes(searchLower) ||
      (item.applicant?.email_id || "").toLowerCase().includes(searchLower) ||
      (item.position_applied_for || item.job_opening?.job_title || "").toLowerCase().includes(searchLower) ||
      (item.interview_round || "").toLowerCase().includes(searchLower) ||
      (item.interviewer || "").toLowerCase().includes(searchLower)
    return matchesStatus && matchesSearch
  })

  const totalPages = Math.ceil(filteredFeedback.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedFeedback = filteredFeedback.slice(startIndex, endIndex)

  useEffect(() => { setCurrentPage(1); setSelectedFeedback(null) }, [filterStatus, searchQuery])

  const getResultBadgeClass = (result: string) => {
    switch (result?.toLowerCase()) {
      case "cleared": return "fl-badge-cleared"
      case "rejected": return "fl-badge-rejected"
      default: return "fl-badge-pending"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try { return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }
    catch { return dateString }
  }

  const StarRating = ({ rating, size = 13 }: { rating: number; size?: number }) => (
    <div className="fl-stars">
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star} style={{ width: size, height: size }}
          fill={star <= rating ? "#facc15" : "#e2e8f0"} color={star <= rating ? "#facc15" : "#e2e8f0"} />
      ))}
    </div>
  )

  const getInitials = (name: string) => (name || "NA").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

  const progressValue = (() => {
    if (!feedbackList.length) return 0
    if (filterStatus === "rejected") return (filteredFeedback.filter(f => f.result.toLowerCase() === "rejected").length / feedbackList.length) * 100
    if (filterStatus === "cleared") return (filteredFeedback.filter(f => f.result.toLowerCase() === "cleared").length / feedbackList.length) * 100
    return (feedbackList.filter(f => f.result.toLowerCase() === "cleared").length / feedbackList.length) * 100
  })()

  const progressLabel = (() => {
    if (filterStatus === "rejected") return `${filteredFeedback.filter(f => f.result.toLowerCase() === "rejected").length} Rejected / ${feedbackList.length} Total`
    if (filterStatus === "cleared") return `${filteredFeedback.filter(f => f.result.toLowerCase() === "cleared").length} Cleared / ${feedbackList.length} Total`
    return `${feedbackList.length} Total / ${feedbackList.filter(f => f.result.toLowerCase() === "cleared").length} Cleared / ${feedbackList.filter(f => f.result.toLowerCase() === "rejected").length} Rejected`
  })()

  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div className="fl">
          <div className="fl-loading">
            <Loader2 size={44} className="fl-spin" />
            <p className="fl-loading-txt">Loading feedback data...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{css}</style>
      <div className="fl">
        <div className="fl-wrap">

          <div className={`fl-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

          <aside className={`fl-sb${sidebarOpen ? "" : " collapsed"}`}>
            <div className="fl-sb-brand">
              <div className="fl-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
              <div>
                <div className="fl-sb-name">Job Management</div>
                <div className="fl-sb-sub">HR Platform</div>
              </div>
              <button className="fl-sb-close" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
            </div>
            <nav className="fl-nav">
              <Link href="/create-job" className="fl-nav-cta"><Plus size={14} /> New Job Opening</Link>
              <div className="fl-nav-lbl">General</div>
              <Link href="/home" className="fl-nav-link">
                <Home size={15} /> Home
              </Link>
              <div className="fl-nav-lbl">Pipeline</div>
              <Link href="/job-opening" className="fl-nav-link"><Briefcase size={15} /> Job Opening</Link>
              <Link href="/upload-resumes" className="fl-nav-link"><Upload size={15} /> Resume Collection</Link>
              <Link href="/candidates" className="fl-nav-link"><Users size={15} /> Candidates</Link>
              <Link href="/interview" className="fl-nav-link"><Calendar size={15} /> Interview Scheduling</Link>
              <div className="fl-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
              <Link href="/feedback" className="fl-nav-link active"><MessageSquare size={15} /> Feedback</Link>
              <Link href="/document-verify-list" className="fl-nav-link"><FileText size={15} /> Document Verification</Link>
              <Link href="/offer-list" className="fl-nav-link"><Zap size={15} /> Offer Letter</Link>
              <Link href="/letter-appointment" className="fl-nav-link"><UserCheck size={15} /> Appointment Letter</Link>
            </nav>
            <div className="fl-sb-foot">
              <button className="fl-logout"><LogOut size={15} /> Sign out</button>
            </div>
          </aside>

          <div className={`fl-main${sidebarOpen ? "" : " sb-closed"}`}>
            {/* <header className="fl-header">
              <button className="fl-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
              <div className="fl-hdr-sep" />
              <div className="fl-crumb">
                <Home size={13} /> Home <ChevronRight size={13} /> <strong>Candidate Feedback</strong>
              </div>
            </header> */}
            <header className="fl-header">
              <button className="fl-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
              <div className="fl-hdr-sep" />
              <Link href="/home" className="fl-btn-back">
                <ArrowLeft size={13} /> Back
              </Link>
              <div className="fl-hdr-sep" />
              <div className="fl-crumb">
                <Home size={13} /> Home <ChevronRight size={13} /> <strong>Candidate Feedback</strong>
              </div>
            </header>

            <div className="fl-page-outer">
              <div className="fl-page">

                <div className="fl-toolbar">
                  <div>
                    <h1 className="fl-page-title">Candidate Feedback</h1>
                    <p className="fl-page-sub">Review candidates and provide detailed feedback</p>
                  </div>
                  <div className="fl-select-wrap">
                    <Filter size={14} />
                    <select className="fl-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                      <option value="all">All Status</option>
                      <option value="cleared">Cleared</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="fl-error">
                    <span className="fl-error-msg">⚠️ {error}</span>
                    <button className="fl-retry-btn" onClick={fetchFeedbackList}>Retry</button>
                  </div>
                )}

                {filteredFeedback.length > 0 && (
                  <div className="fl-prog-card">
                    <div className="fl-prog-top">
                      <span className="fl-prog-label">Review Progress</span>
                      <span className="fl-prog-badge">{progressLabel}</span>
                    </div>
                    <div className="fl-prog-bar-wrap">
                      <div className="fl-prog-bar" style={{ width: `${progressValue}%` }} />
                    </div>
                  </div>
                )}

                <div className="fl-search-card">
                  <div className="fl-search-wrap">
                    <User size={16} />
                    <input type="text" className="fl-search"
                      placeholder="Search by candidate name, email, position, round, or interviewer..."
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    {searchQuery && <button className="fl-search-clear" onClick={() => setSearchQuery("")}>✕</button>}
                  </div>
                </div>

                <div className="fl-layout">
                  {/* List */}
                  <div className="fl-sec-card">
                    <div className="fl-sec-head">
                      <User size={16} style={{ color: 'var(--accent)' }} />
                      <span className="fl-sec-title">Candidate Feedback</span>
                      <span className="fl-sec-count">{filteredFeedback.length}</span>
                    </div>
                    <div className="fl-sec-body">
                      {filteredFeedback.length === 0 ? (
                        <div className="fl-empty">
                          <div className="fl-empty-icon"><MessageSquare size={28} /></div>
                          <p className="fl-empty-title">No Feedback Found</p>
                          <p className="fl-empty-sub">
                            {filterStatus === "all" ? "No feedback records available yet." : `No ${filterStatus} feedback found.`}
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="fl-cards-grid">
                            {paginatedFeedback.map(item => (
                              <div key={item.name}
                                className={`fl-cand-card${selectedFeedback?.name === item.name ? " selected" : ""}`}
                                onClick={() => setSelectedFeedback(item)}>
                                <div className="fl-cand-top">
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div className="fl-avatar">{getInitials(item.candidate_name || item.applicant?.applicant_name || "")}</div>
                                    <div>
                                      <div className="fl-cand-name">{item.candidate_name || item.applicant?.applicant_name || "N/A"}</div>
                                      <div className="fl-cand-id">{item.name}</div>
                                    </div>
                                  </div>
                                  <span className={getResultBadgeClass(item.result)}>{item.result || "Pending"}</span>
                                </div>
                                <div className="fl-divider" />
                                <div className="fl-cand-rows">
                                  <div className="fl-cand-row">
                                    <div className="fl-row-icon blue"><Mail size={13} /></div>
                                    <div className="fl-row-body">
                                      <div className="fl-row-lbl">Email</div>
                                      <div className="fl-row-val">{item.applicant?.email_id || "N/A"}</div>
                                    </div>
                                  </div>
                                  <div className="fl-cand-row">
                                    <div className="fl-row-icon indigo"><Briefcase size={13} /></div>
                                    <div className="fl-row-body">
                                      <div className="fl-row-lbl">Position</div>
                                      <div className="fl-row-val">{item.position_applied_for || item.job_opening?.job_title || "N/A"}</div>
                                    </div>
                                  </div>
                                  <div className="fl-cand-row">
                                    <div className="fl-row-icon blue"><Calendar size={13} /></div>
                                    <div className="fl-row-body">
                                      <div className="fl-row-lbl">Interview Round</div>
                                      <div className="fl-row-val">{item.interview_round || "N/A"}</div>
                                    </div>
                                  </div>
                                  {item.average_rating > 0 && (
                                    <div className="fl-cand-row">
                                      <div className="fl-row-icon amber"><Star size={13} /></div>
                                      <div className="fl-row-body">
                                        <div className="fl-row-lbl">Average Rating</div>
                                        <div className="fl-stars-row">
                                          <StarRating rating={Math.round(item.average_rating)} />
                                          <span className="fl-stars-sub">{item.average_rating.toFixed(1)} ({item.total_skills} skills)</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="fl-cand-actions">
                                  {/* <button className="fl-btn-sm" onClick={e => { e.stopPropagation(); router.push("/document-verify") }}> */}
                                  <button className="fl-btn-sm" onClick={e => {
                                    e.stopPropagation();
                                    router.push(`/document-verify?applicant=${encodeURIComponent(item.job_applicant || "")}`)
                                  }}>
                                    <FileText size={12} /> Documents
                                  </button>
                                  {item.result === "Cleared" && (
                                    <button className="fl-btn-sm accent" onClick={e => { e.stopPropagation(); router.push("/offer-letter") }}>
                                      <FileText size={12} /> Offer Letter
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="fl-pagination">
                            <span className="fl-pag-info">Showing {startIndex + 1} to {Math.min(endIndex, filteredFeedback.length)} of {filteredFeedback.length} feedback</span>
                            <div className="fl-pag-btns">
                              <button className="fl-pag-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                <ChevronLeft size={14} /> Previous
                              </button>
                              <span className="fl-pag-page">Page {currentPage} of {totalPages}</span>
                              <button className="fl-pag-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                                Next <ChevronRight size={14} />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Detail panel */}
                  <div>
                    {selectedFeedback ? (
                      <>
                        <div className="fl-detail-hero">
                          <div className="fl-detail-hero-head">
                            <MessageSquare size={16} />
                            <div>
                              <div className="fl-detail-hero-title">Feedback Details</div>
                              <div className="fl-detail-hero-for">For {selectedFeedback.candidate_name || selectedFeedback.applicant?.applicant_name}</div>
                            </div>
                          </div>
                          <div className="fl-detail-row">
                            <div className="fl-detail-lbl">Interview Round</div>
                            <div className="fl-detail-val">{selectedFeedback.interview_round || "N/A"}</div>
                          </div>
                          <div className="fl-detail-row">
                            <div className="fl-detail-lbl">Result</div>
                            <span className={getResultBadgeClass(selectedFeedback.result)}>{selectedFeedback.result}</span>
                          </div>
                          {selectedFeedback.average_rating > 0 && (
                            <div className="fl-detail-row">
                              <div className="fl-detail-lbl">Overall Rating</div>
                              <div className="fl-detail-stars">
                                <StarRating rating={Math.round(selectedFeedback.average_rating)} size={14} />
                                <span className="fl-detail-stars-val">{selectedFeedback.average_rating.toFixed(1)} / 5.0</span>
                              </div>
                            </div>
                          )}
                          <div className="fl-detail-row">
                            <div className="fl-detail-lbl">Detailed Feedback</div>
                            <textarea className="fl-detail-textarea"
                              value={selectedFeedback.feedback || "No feedback provided"} readOnly rows={4} />
                          </div>
                          <div className="fl-detail-row" style={{ marginBottom: 0 }}>
                            <div className="fl-detail-lbl">Interviewed By</div>
                            <div className="fl-detail-val">{selectedFeedback.interviewer}</div>
                          </div>
                        </div>

                        <div className="fl-info-card">
                          <div className="fl-info-head"><div className="fl-info-title">Candidate Information</div></div>
                          <div className="fl-info-body">
                            <div>
                              <div className="fl-info-lbl"><Briefcase size={13} /> Job Position</div>
                              <div className="fl-info-val">{selectedFeedback.position_applied_for || selectedFeedback.job_opening?.job_title || "N/A"}</div>
                            </div>
                            {selectedFeedback.department && (
                              <div>
                                <div className="fl-info-lbl"><Building2 size={13} /> Department</div>
                                <div className="fl-info-val-sm">{selectedFeedback.department}</div>
                              </div>
                            )}
                            {(selectedFeedback.location || selectedFeedback.job_opening?.location) && (
                              <div>
                                <div className="fl-info-lbl"><MapPin size={13} /> Location</div>
                                <div className="fl-info-val-sm">{selectedFeedback.location || selectedFeedback.job_opening?.location}</div>
                              </div>
                            )}
                            {selectedFeedback.applicant?.country && (
                              <div>
                                <div className="fl-info-lbl"><Globe size={13} /> Country</div>
                                <div className="fl-info-val-sm">{selectedFeedback.applicant.country}</div>
                              </div>
                            )}
                            {selectedFeedback.new_position && (
                              <div>
                                <div className="fl-info-lbl"><TrendingUp size={13} /> New Position</div>
                                <div className="fl-info-val-sm">{selectedFeedback.new_position}</div>
                              </div>
                            )}
                            {selectedFeedback.replacement_position && (
                              <div>
                                <div className="fl-info-lbl"><UserCheck size={13} /> Replacement Position</div>
                                <div className="fl-info-val-sm">{selectedFeedback.replacement_position}</div>
                              </div>
                            )}
                            {selectedFeedback.applicant_rating && (
                              <div>
                                <div className="fl-info-lbl"><Award size={13} /> Applicant Rating</div>
                                <div className="fl-tags"><span className="fl-tag blue">{selectedFeedback.applicant_rating}</span></div>
                              </div>
                            )}
                            {selectedFeedback.final_score_recommendation && selectedFeedback.final_score_recommendation.length > 0 && (
                              <div>
                                <div className="fl-info-lbl">Final Score & Recommendation</div>
                                <div className="fl-tags">
                                  {selectedFeedback.final_score_recommendation.map((score, i) => (
                                    <span key={i} className="fl-tag green">{score}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {selectedFeedback.not_shortlisted_reason && selectedFeedback.not_shortlisted_reason.length > 0 && (
                              <div>
                                <div className="fl-info-lbl"><AlertCircle size={13} /> Not Shortlisted Reasons</div>
                                <div className="fl-tags">
                                  {selectedFeedback.not_shortlisted_reason.map((r, i) => (
                                    <span key={i} className="fl-tag orange">{r}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {selectedFeedback.withdrawn_reason && selectedFeedback.withdrawn_reason.length > 0 && (
                              <div>
                                <div className="fl-info-lbl">Withdrawn Reasons</div>
                                <div className="fl-tags">
                                  {selectedFeedback.withdrawn_reason.map((r, i) => (
                                    <span key={i} className="fl-tag red">{r}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {selectedFeedback.skill_assessments && selectedFeedback.skill_assessments.length > 0 && (
                              <div>
                                <div className="fl-info-lbl">Skill Assessment</div>
                                <div>
                                  {selectedFeedback.skill_assessments.map((skill, i) => (
                                    <div key={i} className="fl-skill-row">
                                      <span className="fl-skill-name">{skill.skill}</span>
                                      <StarRating rating={skill.rating} size={13} />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {selectedFeedback.remarks && (
                              <div>
                                <div className="fl-info-lbl">Remarks</div>
                                <div className="fl-remarks-box">{selectedFeedback.remarks}</div>
                              </div>
                            )}
                            <div>
                              <div className="fl-info-lbl"><Clock size={13} /> Interview Date</div>
                              <div className="fl-info-val-sm">{formatDate(selectedFeedback.interview_date || selectedFeedback.creation)}</div>
                            </div>
                            <div>
                              <div className="fl-info-lbl"><Calendar size={13} /> Feedback Date</div>
                              <div className="fl-info-val-sm">{formatDate(selectedFeedback.creation)}</div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="fl-empty-detail">
                        <MessageSquare size={36} />
                        <div className="fl-empty-detail-title">Select a Feedback</div>
                        <div className="fl-empty-detail-sub">Choose a candidate feedback from the list to view detailed information.</div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
