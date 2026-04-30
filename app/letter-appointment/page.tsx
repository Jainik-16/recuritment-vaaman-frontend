"use client"
import { useState, useEffect } from "react"
import {
  UserCheck, ArrowLeft, Calendar, FileText, AlertCircle, CheckCircle2,
  User, Building2, Briefcase, ChevronLeft, ChevronRight,
  Plus, Menu, X, Home, Upload, Users, MessageSquare, Zap, LogOut,
} from "lucide-react"
import { Check, ChevronsUpDown } from "lucide-react"
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,
} from "@/components/ui/command"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { getFrappeCSRF } from "@/lib/csrf"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface AcceptedCandidate {
  name: string; applicant_name: string; applicant_email: string; job_applicant: string;
  designation: string; offer_date: string; company: string; status: string;
  appointment_letter_status?: string;
}
interface Template { name: string; introduction: string }
interface TermRow { title: string; description: string }
interface TemplateDetails { name: string; introduction: string; closing_notes: string; terms: TermRow[] }

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .al {
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

  .al-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  /* ══ SIDEBAR ══ */
  .al-sb {
    width: var(--sb-w); background: var(--sb); min-height: 100vh;
    position: fixed; top: 0; left: 0; z-index: 100; display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .al-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }
  .al-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }
  .al-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(0,158,247,.15); border: 1px solid rgba(0,158,247,.25);
    display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
  }
  .al-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .al-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; }
  .al-sb-sub { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
  .al-sb-close {
    margin-left: auto; flex-shrink: 0; width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer; color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center; transition: all .14s;
  }
  .al-sb-close:hover { background: var(--sb-hover); color: #fff; }
  .al-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .al-nav::-webkit-scrollbar { width: 3px; }
  .al-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }
  .al-nav-cta {
    display: flex; align-items: center; gap: 9px; padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md); border: 1px solid rgba(0,158,247,.28);
    color: var(--accent); font-size: 13px; font-weight: 600; text-decoration: none;
    transition: background .15s; margin-bottom: 22px;
  }
  .al-nav-cta:hover { background: rgba(0,158,247,.24); }
  .al-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
  }
  .al-nav-link {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt); text-decoration: none; transition: all .14s;
  }
  .al-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; transition: opacity .14s; }
  .al-nav-link:hover { background: var(--sb-hover); color: #fff; }
  .al-nav-link:hover svg { opacity: 1; }
  .al-nav-link.active { background: var(--accent-md); color: var(--accent); border: 1px solid rgba(0,158,247,.2); }
  .al-nav-link.active svg { opacity: 1; }
  .al-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .al-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; border-radius: 8px; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--sb-lbl); text-align: left; transition: all .14s;
  }
  .al-logout svg { opacity: .6; width: 15px; height: 15px; }
  .al-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }
  .al-overlay {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
  }
  @media (max-width: 768px) { .al-overlay.show { display: block; } }

  /* ══ MAIN ══ */
  .al-main {
    margin-left: var(--sb-w); flex: 1; display: flex; flex-direction: column;
    min-height: 100vh; transition: margin-left .25s cubic-bezier(.4,0,.2,1);
  }
  .al-main.sb-closed { margin-left: 0; }
  .al-header {
    height: 60px; background: #fff; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 0 rgba(0,158,247,.08);
  }
  .al-btn-back {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 8px;
  background: transparent; color: var(--t2);
  font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
  border: 1px solid var(--border); cursor: pointer; text-decoration: none;
  transition: all .14s; white-space: nowrap;
  }
  .al-btn-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .al-toggle {
    width: 34px; height: 34px; border-radius: 8px; background: none;
    border: 1px solid var(--border); cursor: pointer; display: flex;
    align-items: center; justify-content: center; color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .al-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .al-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .al-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
  .al-crumb svg { width: 13px; height: 13px; color: var(--t3); }
  .al-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }

  /* ══ PAGE ══ */
  .al-page-outer { flex: 1; display: flex; justify-content: center; padding: 28px 32px; }
  .al-page { width: 100%; max-width: 1200px; display: flex; flex-direction: column; gap: 20px; }

  .al-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .al-page-title { font-size: 21px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; }
  .al-page-sub { font-size: 13px; color: var(--t3); margin-top: 5px; }

  /* ══ ALERT BANNERS ══ */
  .al-alert {
    border-radius: 10px; padding: 13px 16px; display: flex; align-items: flex-start; gap: 10px; font-size: 13px;
  }
  .al-alert.red { background: var(--red-lt); border: 1px solid #fca5a5; color: #7f1d1d; }
  .al-alert.green { background: var(--green-lt); border: 1px solid #bbf7d0; color: #14532d; }
  .al-alert svg { flex-shrink: 0; width: 16px; height: 16px; margin-top: 1px; }

  /* ══ TWO-COL LAYOUT ══ */
  .al-body { display: grid; grid-template-columns: 300px 1fr; gap: 20px; align-items: start; }

  /* ══ LEFT PANEL ══ */
  .al-left-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 14px;
    overflow: hidden; box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .al-left-head {
    padding: 16px 18px; border-bottom: 1px solid var(--border-s);
    background: linear-gradient(to right, #f8fbff, #eef7ff);
  }
  .al-left-title { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 700; color: var(--t1); }
  .al-left-title svg { width: 15px; height: 15px; color: var(--accent); }
  .al-left-sub { font-size: 11.5px; color: var(--t3); margin-top: 4px; }
  .al-left-body { padding: 14px; display: flex; flex-direction: column; gap: 8px; }

  .al-candidate-item {
    border: 1px solid var(--border-s); border-radius: 10px; padding: 12px 14px; cursor: pointer;
    transition: all .15s; background: var(--card);
  }
  .al-candidate-item:hover { border-color: rgba(0,158,247,.35); background: #f8fbff; }
  .al-candidate-item.selected { border-color: var(--accent); background: var(--accent-lt); box-shadow: 0 0 0 2px rgba(0,158,247,.15); }
  .al-cand-row { display: flex; align-items: flex-start; gap: 10px; }
  .al-cand-avatar {
    width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), #3b5bdb);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 13px; font-weight: 700;
  }
  .al-cand-name { font-size: 13px; font-weight: 700; color: var(--t1); line-height: 1.3; }
  .al-cand-desg { font-size: 11px; color: var(--t3); margin-top: 2px; }
  .al-cand-date { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--t3); margin-top: 4px; }
  .al-cand-date svg { width: 11px; height: 11px; }
  .al-status-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; display: inline-block; margin-right: 5px;
  }
  .al-status-dot.green { background: var(--green); }
  .al-status-dot.red { background: var(--red); }
  .al-status-dot.blue { background: var(--accent); }
  .al-status-badge {
    display: inline-flex; align-items: center; padding: 2px 9px; border-radius: 20px;
    font-size: 10.5px; font-weight: 600; margin-top: 7px;
  }
  .al-status-badge.close { background: var(--red-lt); color: var(--red); border: 1px solid #fca5a5; }
  .al-status-badge.open { background: var(--green-lt); color: var(--green); border: 1px solid #bbf7d0; }
  .al-status-badge.default { background: var(--accent-lt); color: var(--accent); border: 1px solid rgba(0,158,247,.25); }

  .al-empty-cands { text-align: center; padding: 28px 16px; }
  .al-empty-cands svg { color: var(--t3); margin: 0 auto 10px; display: block; }
  .al-empty-cands p { font-size: 12.5px; color: var(--t3); }

  /* pagination for candidates */
  .al-cand-pag { padding: 12px 14px; border-top: 1px solid var(--border-s); }
  .al-cand-pag-info { font-size: 11px; color: var(--t3); margin-bottom: 8px; }
  .al-cand-pag-btns { display: flex; align-items: center; gap: 8px; }
  .al-pag-btn {
    display: flex; align-items: center; gap: 3px; padding: 5px 10px; border-radius: 6px;
    border: 1px solid var(--border); background: var(--card); color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 11.5px; font-weight: 500; cursor: pointer; transition: all .14s;
  }
  .al-pag-btn:hover:not(:disabled) { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .al-pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .al-pag-btn svg { width: 12px; height: 12px; }
  .al-pag-page { font-size: 11.5px; font-weight: 600; color: var(--t1); }

  /* ══ RIGHT PANEL ══ */
  .al-right { display: flex; flex-direction: column; gap: 18px; }

  /* no-selection state */
  .al-no-select {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 14px;
    padding: 60px 32px; text-align: center; box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .al-no-select-icon {
    width: 72px; height: 72px; border-radius: 50%; background: var(--accent-lt);
    display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--accent);
  }
  .al-no-select-title { font-size: 16px; font-weight: 700; color: var(--t1); margin-bottom: 6px; }
  .al-no-select-sub { font-size: 13px; color: var(--t3); }

  /* already-created banner */
  .al-already-banner {
    border-radius: 14px; overflow: hidden; background: var(--card);
    border: 1px solid var(--border-s); box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .al-already-head {
    padding: 16px 22px; border-bottom: 1px solid var(--border-s);
    background: linear-gradient(to right, #f8fbff, #eef7ff);
    display: flex; align-items: center; justify-content: space-between;
  }
  .al-already-head-left { display: flex; align-items: center; gap: 10px; }
  .al-already-icon {
    width: 34px; height: 34px; border-radius: 9px;
    background: linear-gradient(135deg, var(--accent), #3b82f6);
    display: flex; align-items: center; justify-content: center;
  }
  .al-already-icon svg { color: #fff; width: 16px; height: 16px; }
  .al-already-title { font-size: 14px; font-weight: 700; color: var(--t1); }
  .al-already-sub { font-size: 12px; color: var(--t3); margin-top: 2px; }
  .al-already-body { padding: 22px; }

  /* letter preview box */
  .al-letter-box {
    border: 2px dashed var(--border); border-radius: 12px; padding: 28px;
    display: flex; flex-direction: column; gap: 18px;
  }
  .al-letter-title-row { text-align: center; padding-bottom: 16px; border-bottom: 1px solid var(--border-s); }
  .al-letter-h1 { font-size: 20px; font-weight: 800; color: var(--t1); }
  .al-letter-company { font-size: 13px; color: var(--t3); margin-top: 4px; }
  .al-letter-dear { font-size: 14px; font-weight: 700; color: var(--t1); }
  .al-letter-body-txt { font-size: 13px; color: var(--t2); line-height: 1.6; }
  .al-letter-terms {
    background: var(--bg); border: 1px solid var(--border-s); border-radius: 10px; padding: 18px;
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;
  }
  .al-letter-term-title { font-size: 12.5px; font-weight: 700; color: var(--t1); }
  .al-letter-term-desc { font-size: 12px; color: var(--t2); margin-top: 3px; line-height: 1.5; }
  .al-letter-footer { text-align: center; font-size: 11.5px; color: var(--t3); padding-top: 14px; border-top: 1px solid var(--border-s); }

  .al-dl-btns { display: flex; flex-wrap: wrap; gap: 10px; }
  .al-dl-btn {
    flex: 1; min-width: 160px; display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 11px 20px; border-radius: 8px; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; transition: all .15s;
    box-shadow: 0 2px 8px rgba(0,0,0,.12);
  }
  .al-dl-btn.blue { background: linear-gradient(135deg, var(--accent), #3b5bdb); color: #fff; }
  .al-dl-btn.blue:hover { box-shadow: 0 4px 14px rgba(0,158,247,.35); }
  .al-dl-btn.orange { background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; }
  .al-dl-btn.orange:hover { box-shadow: 0 4px 14px rgba(249,115,22,.35); }
  .al-dl-btn.outline {
    background: var(--card); border: 1px solid var(--border); color: var(--t2);
    box-shadow: 0 1px 3px rgba(0,0,0,.06);
  }
  .al-dl-btn.outline:hover { background: var(--bg); border-color: #b0c4d4; }
  .al-dl-btn svg { width: 15px; height: 15px; }

  .al-loader { text-align: center; padding: 40px; }
  .al-spinner {
    width: 36px; height: 36px; border: 3px solid var(--accent-lt); border-top-color: var(--accent);
    border-radius: 50%; animation: al-spin 1s linear infinite; margin: 0 auto 12px;
  }
  @keyframes al-spin { to { transform: rotate(360deg); } }
  .al-loader-txt { font-size: 13px; color: var(--t2); }

  /* ══ CREATE FORM CARD ══ */
  .al-form-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 14px;
    overflow: hidden; box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .al-form-banner {
    background: linear-gradient(135deg, var(--accent), #4338ca);
    padding: 18px 22px;
  }
  .al-form-banner-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: #fff; }
  .al-form-banner-title svg { width: 16px; height: 16px; }
  .al-form-banner-sub { font-size: 12px; color: rgba(255,255,255,.75); margin-top: 4px; }

  .al-form-sec-head {
    padding: 14px 22px; border-bottom: 1px solid var(--border-s);
    background: linear-gradient(to right, #f8fbff, #eef7ff);
    display: flex; align-items: center; gap: 10px;
  }
  .al-form-sec-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg, var(--accent), #3b82f6);
    display: flex; align-items: center; justify-content: center;
  }
  .al-form-sec-icon svg { color: #fff; width: 14px; height: 14px; }
  .al-form-sec-title { font-size: 13.5px; font-weight: 700; color: var(--t1); }
  .al-form-sec-sub { font-size: 11.5px; color: var(--t3); margin-top: 1px; }
  .al-form-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 18px; }

  .al-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .al-field { display: flex; flex-direction: column; gap: 5px; }
  .al-label {
    display: flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 600;
    color: var(--t2); letter-spacing: 0.02em;
  }
  .al-label svg { width: 12px; height: 12px; color: var(--accent); flex-shrink: 0; }
  .al-req { color: #ef4444; }
  .al-label-hint { font-size: 10.5px; color: #94a3b8; font-weight: 400; }
  .al-input {
    height: 40px; padding: 0 12px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--bg); color: var(--t1); font-family: 'Inter', sans-serif; font-size: 13.5px;
    outline: none; transition: all .15s; width: 100%;
  }
  .al-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-lt); }
  .al-input::placeholder { color: var(--t3); }
  .al-input:disabled { opacity: 0.6; cursor: not-allowed; background: #f0f4f8; }
  .al-textarea {
    min-height: 80px; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--bg); color: var(--t1); font-family: 'Inter', sans-serif; font-size: 13.5px;
    outline: none; transition: all .15s; width: 100%; resize: vertical;
  }
  .al-textarea:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-lt); }
  .al-textarea::placeholder { color: var(--t3); }
  .al-select {
    height: 40px; padding: 0 12px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--bg); color: var(--t1); font-family: 'Inter', sans-serif; font-size: 13.5px;
    outline: none; transition: all .15s; width: 100%; cursor: pointer; appearance: auto;
  }
  .al-select:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-lt); }
  .al-select:disabled { opacity: 0.6; cursor: not-allowed; background: #f0f4f8; }

  .al-hint { display: flex; align-items: center; gap: 5px; font-size: 11px; margin-top: 4px; }
  .al-hint.blue { color: var(--accent); }
  .al-hint.amber { color: #d97706; }
  .al-hint svg { width: 11px; height: 11px; }

  .al-staffworker-row {
    display: flex; align-items: center; gap: 10px; height: 40px; padding: 0 12px;
    border-radius: 8px; border: 1px solid var(--border-s); background: #f8fafc;
  }
  .al-staffworker-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
  .al-staffworker-dot.blue { background: var(--accent); }
  .al-staffworker-dot.orange { background: #f97316; }
  .al-staffworker-txt { font-size: 13px; font-weight: 600; color: var(--t1); }
  .al-staffworker-hint { font-size: 11px; color: var(--t3); margin-left: 4px; }

  /* terms table */
  .al-terms-table { border: 1px solid var(--border-s); border-radius: 10px; overflow: hidden; }
  .al-terms-table table { width: 100%; border-collapse: collapse; }
  .al-terms-table thead tr { background: linear-gradient(to right, #f8fbff, #eef7ff); border-bottom: 1px solid var(--border-s); }
  .al-terms-table th { padding: 9px 14px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--t2); }
  .al-terms-table tbody tr { border-bottom: 1px solid var(--border-s); transition: background .12s; }
  .al-terms-table tbody tr:last-child { border-bottom: none; }
  .al-terms-table tbody tr:hover { background: #f8fbff; }
  .al-terms-table td { padding: 10px 14px; vertical-align: top; }
  .al-terms-num { font-size: 12px; font-weight: 600; color: var(--t3); padding-top: 12px !important; }

  .al-no-terms {
    text-align: center; padding: 36px 20px; background: var(--bg); border-radius: 10px;
    border: 2px dashed var(--border);
  }

  /* badge in label */
  .al-cnt-badge {
    display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 10px;
    background: var(--accent-lt); color: var(--accent); font-size: 10.5px; font-weight: 600;
    border: 1px solid rgba(0,158,247,.2); margin-left: 6px;
  }

  /* submit row */
  .al-submit-row { display: flex; flex-wrap: wrap; gap: 10px; padding-top: 16px; border-top: 1px solid var(--border-s); }
  .al-submit-btn {
    flex: 1; min-width: 180px; display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 11px 24px; border-radius: 8px; background: var(--accent); color: #fff; border: none;
    font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: all .15s;
    box-shadow: 0 2px 8px rgba(0,158,247,.3);
  }
  .al-submit-btn:hover:not(:disabled) { background: var(--accent-h); box-shadow: 0 4px 14px rgba(0,158,247,.4); }
  .al-submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .al-submit-btn svg { width: 16px; height: 16px; }
  .al-btn-spin {
    width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    border-radius: 50%; animation: al-spin 1s linear infinite;
  }

  /* loading full page */
  .al-loading {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 100vh; background: var(--bg); gap: 14px;
  }
  .al-loading-spinner {
    width: 44px; height: 44px; border: 4px solid var(--accent-lt); border-top-color: var(--accent);
    border-radius: 50%; animation: al-spin 1s linear infinite;
  }
  .al-loading-txt { font-size: 14px; font-weight: 500; color: var(--t2); }

  @media (max-width: 1024px) { .al-body { grid-template-columns: 260px 1fr; } }
  @media (max-width: 768px) {
    .al-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .al-sb.open { transform: translateX(0); }
    .al-main { margin-left: 0 !important; }
    .al-page-outer { padding: 16px; }
    .al-header { padding: 0 16px; }
    .al-body { grid-template-columns: 1fr; }
    .al-grid-2 { grid-template-columns: 1fr; }
    .al-letter-terms { grid-template-columns: 1fr; }
  }
`

export default function AppointmentPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [acceptedCandidates, setAcceptedCandidates] = useState<AcceptedCandidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<AcceptedCandidate | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [savedAppointment, setSavedAppointment] = useState<any>(null)
  const [salaryAnnexures, setSalaryAnnexures] = useState<{ name: string }[]>([])
  const [loadingSalaryAnnexures, setLoadingSalaryAnnexures] = useState(false)
  const [employees, setEmployees] = useState<{ name: string; employee_name: string }[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [openEmployee, setOpenEmployee] = useState(false)
  const ITEMS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")


  const getTodayDate = () => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  }

  const [appointmentDetails, setAppointmentDetails] = useState({
    job_applicant: "", applicant_name: "", company: "", appointment_date: "",
    appointment_letter_template: "", introduction: "", closing_notes: "",
    terms: [] as TermRow[], custom_monthly_gross_salary: "",
    custom_employee: "", custom_salary_annexure: "", custom_staffworker: "",
  })

  const API_BASE_URL = "https://ats.octavision.in/api/method/resume.api.appointment_letter"
  const FRAPPE_BASE_URL = "https://ats.octavision.in"
  const filteredCandidates = acceptedCandidates.filter(c =>
    c.applicant_name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex)

  useEffect(() => { fetchAcceptedOffers(); fetchTemplates(); fetchEmployees() }, [])
  useEffect(() => { document.title = 'Appointment Letter' }, [])

  const fetchAcceptedOffers = async () => {
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}.get_accepted_job_offers`, {
        method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' }
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const jsonData = await res.json()
      if (jsonData?.message?.success) {
        const candidates = jsonData.message.data || []
        const candidatesWithStatus = await Promise.all(
          candidates.map(async (candidate: AcceptedCandidate) => {
            try {
              const statusRes = await fetch(
                `${API_BASE_URL}.check_appointment_letter_exists?job_applicant=${encodeURIComponent(candidate.job_applicant)}`,
                { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } }
              )
              if (statusRes.ok) {
                const statusData = await statusRes.json()
                return { ...candidate, appointment_letter_status: statusData?.message?.exists ? "Close" : "Open" }
              }
            } catch (err) { console.error("Error checking status:", err) }
            return { ...candidate, appointment_letter_status: "Open" }
          })
        )
        setAcceptedCandidates(candidatesWithStatus)
      } else { setError("Failed to fetch accepted offers") }
    } catch (err) {
      console.error("Error fetching offers:", err)
      setError("Error fetching accepted offers. Please try again.")
    } finally { setLoading(false) }
  }

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}.get_appointment_letter_templates`, {
        method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' }
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const jsonData = await res.json()
      if (jsonData?.message?.success) setTemplates(jsonData.message.data || [])
    } catch (err) { console.error("Error fetching templates:", err) }
  }

  const fetchEmployees = async () => {
    setLoadingEmployees(true)
    try {
      const res = await fetch(
        `${FRAPPE_BASE_URL}/api/method/frappe.client.get_list?doctype=Employee&fields=${encodeURIComponent(JSON.stringify(["name", "employee_name"]))}&limit_page_length=100&order_by=creation%20desc`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const result = await res.json()
      setEmployees(result?.message || [])
    } catch (err) { console.error("Error fetching employees:", err); setEmployees([]) }
    finally { setLoadingEmployees(false) }
  }

  // const fetchSalaryAnnexuresForApplicant = async (jobApplicantId: string) => {
  //   setSalaryAnnexures([])
  //   setAppointmentDetails(prev => ({ ...prev, custom_salary_annexure: "" }))
  //   setLoadingSalaryAnnexures(true)
  //   try {
  //     const annexureRes = await fetch(
  //       `${FRAPPE_BASE_URL}/api/method/frappe.client.get_list?doctype=Salary%20Annexure&filters=${encodeURIComponent(JSON.stringify({ custom_job_applicant: jobApplicantId }))}&fields=${encodeURIComponent(JSON.stringify(["name"]))}&order_by=creation%20desc&limit_page_length=10`,
  //       { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
  //     )
  //     const annexureResult = await annexureRes.json()
  //     const annexures = annexureResult?.message || []
  //     setSalaryAnnexures(annexures)
  //     if (annexures.length > 0) {
  //       setAppointmentDetails(prev => ({ ...prev, custom_salary_annexure: annexures[0].name }))
  //       console.log("✅ Auto-selected salary annexure:", annexures[0].name)
  //     } else {
  //       setAppointmentDetails(prev => ({ ...prev, custom_salary_annexure: "" }))
  //       console.log("ℹ️ No salary annexure found for this applicant")
  //     }
  //   } catch (error) {
  //     console.error("Error fetching salary annexure:", error)
  //     setSalaryAnnexures([])
  //   } finally { setLoadingSalaryAnnexures(false) }
  // }

  const fetchSalaryAnnexuresForApplicant = async (jobApplicantId: string) => {
    setSalaryAnnexures([])
    setAppointmentDetails(prev => ({ ...prev, custom_salary_annexure: "", custom_monthly_gross_salary: "" }))
    setLoadingSalaryAnnexures(true)
    try {
      const annexureRes = await fetch(
        `${FRAPPE_BASE_URL}/api/method/frappe.client.get_list?doctype=Salary%20Annexure&filters=${encodeURIComponent(JSON.stringify({ custom_job_applicant: jobApplicantId }))}&fields=${encodeURIComponent(JSON.stringify(["name"]))}&order_by=creation%20desc&limit_page_length=10`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const annexureResult = await annexureRes.json()
      const annexures = annexureResult?.message || []
      setSalaryAnnexures(annexures)

      if (annexures.length > 0) {
        const selectedAnnexure = annexures[0].name
        setAppointmentDetails(prev => ({ ...prev, custom_salary_annexure: selectedAnnexure }))

        // ✅ Fetch total_monthly from the selected annexure
        await fetchAndSetGrossSalary(selectedAnnexure)
      }
    } catch (error) {
      console.error("Error fetching salary annexure:", error)
      setSalaryAnnexures([])
    } finally { setLoadingSalaryAnnexures(false) }
  }

  const fetchAndSetGrossSalary = async (annexureName: string) => {
    if (!annexureName) return
    try {
      const res = await fetch(
        `${FRAPPE_BASE_URL}/api/method/resume.api.salary_annexure.get_salary_annexure_details?annexure_name=${encodeURIComponent(annexureName)}`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const result = await res.json()
      const totalMonthly = result?.message?.data?.total_monthly
      if (totalMonthly !== undefined && totalMonthly !== null) {
        setAppointmentDetails(prev => ({
          ...prev,
          custom_monthly_gross_salary: String(totalMonthly)
        }))
      }
    } catch (err) {
      console.error("Error fetching annexure total_monthly:", err)
    }
  }


  const fetchAppointmentLetterDetails = async (jobApplicant: string) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}.get_appointment_letter_by_job_applicant?job_applicant=${encodeURIComponent(jobApplicant)}`,
        { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const jsonData = await res.json()
      console.log("📄 Appointment letter fetch result:", jsonData)
      if (jsonData?.message?.success && jsonData?.message?.data) return jsonData.message.data
      if (jsonData?.message?.data) return jsonData.message.data
      if (jsonData?.message?.name) return jsonData.message
    } catch (err) { console.error("Error fetching appointment letter details:", err) }
    return null
  }

  const handleCandidateSelect = async (candidate: AcceptedCandidate) => {
    setSelectedCandidate(candidate); setError(null); setSuccess(null)
    setSavedAppointment(null); setSalaryAnnexures([])
    const jobApplicantId = candidate.job_applicant
    if (candidate.appointment_letter_status === "Close") {
      const existingLetter = await fetchAppointmentLetterDetails(jobApplicantId)
      if (existingLetter) {
        setSavedAppointment({
          appointmentId: existingLetter.name,
          job_applicant: existingLetter.job_applicant,
          candidateName: existingLetter.applicant_name,
          designation: candidate.designation,
          company: existingLetter.company,
          appointment_date: existingLetter.appointment_date,
          appointment_letter_template: existingLetter.appointment_letter_template,
          introduction: existingLetter.introduction,
          closing_notes: existingLetter.closing_notes,
          terms: existingLetter.terms,
          custom_staffworker: existingLetter.custom_staffworker || "",
        })
      } else {
        setSavedAppointment({
          appointmentId: "", candidateName: candidate.applicant_name,
          designation: candidate.designation, company: candidate.company,
          introduction: "", closing_notes: "", terms: [], custom_staffworker: "",
        })
      }
      return
    }
    setSalaryAnnexures([])
    setAppointmentDetails({
      job_applicant: jobApplicantId, applicant_name: candidate.applicant_name,
      company: candidate.company, appointment_date: "", appointment_letter_template: "",
      introduction: "", closing_notes: "", terms: [], custom_monthly_gross_salary: "",
      custom_employee: "", custom_salary_annexure: "", custom_staffworker: "",
    })
    await fetchSalaryAnnexuresForApplicant(jobApplicantId)
  }

  const handleTemplateSelect = async (templateName: string) => {
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE_URL}.get_appointment_letter_template_details?template_name=${encodeURIComponent(templateName)}`,
        { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const jsonData = await res.json()
      if (jsonData?.message?.success) {
        const templateData: TemplateDetails = jsonData.message.data
        setAppointmentDetails({
          ...appointmentDetails, appointment_letter_template: templateName,
          introduction: templateData.introduction || "",
          closing_notes: templateData.closing_notes || "",
          terms: templateData.terms || []
        })
      } else { setError("Error loading template: " + (jsonData?.message?.message || "Unknown error")) }
    } catch (err) {
      console.error("Error fetching template details:", err)
      setError("Error fetching template details. Please try again.")
    }
  }

  const handleTermChange = (index: number, field: "title" | "description", value: string) => {
    const newTerms = [...appointmentDetails.terms]
    newTerms[index][field] = value
    setAppointmentDetails({ ...appointmentDetails, terms: newTerms })
  }

  const validateForm = (): boolean => {
    if (!appointmentDetails.job_applicant) { alert("Please select a candidate"); return false }
    if (!appointmentDetails.applicant_name) { alert("Applicant name is missing"); return false }
    if (!appointmentDetails.custom_employee) {
      alert("Employee is required. Please create an Employee in Frappe first, then select it here."); return false
    }
    if (appointmentDetails.custom_staffworker !== "Worker" && !appointmentDetails.custom_salary_annexure) {
      alert("Salary Annexure is required for Staff. Please create a Salary Annexure in Frappe first, then create the appointment letter."); return false
    }
    if (!appointmentDetails.appointment_date) { alert("Please select an appointment date"); return false }
    if (!appointmentDetails.appointment_letter_template) { alert("Please select a template"); return false }
    return true
  }

  const handleCreateAppointment = async () => {
    setError(null); setSuccess(null)
    if (!validateForm()) return
    setLoading(true)
    try {
      const csrfToken = await getFrappeCSRF()
      const res = await fetch(`${API_BASE_URL}.create_appointment_letter`, {
        method: "POST", credentials: 'include',
        headers: { 'Content-Type': 'application/json', "X-Frappe-CSRF-Token": csrfToken },
        body: JSON.stringify({ data: appointmentDetails })
      })
      if (!res.ok) {
        if (res.status === 403) throw new Error("Permission denied. Please check your permissions")
        else if (res.status === 401) throw new Error("Authentication required. Please log in to Frappe")
        else if (res.status === 404) throw new Error("API endpoint not found. Please check the server configuration")
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const jsonData = await res.json()
      if (jsonData?.message?.success) {
        setSuccess("Appointment Letter created successfully! (ID: " + jsonData.message.data.name + ")")
        const previewData = {
          appointmentId: jsonData.message.data.name,
          job_applicant: jsonData.message.data.job_applicant || appointmentDetails.job_applicant,
          candidateName: jsonData.message.data.applicant_name || selectedCandidate?.applicant_name,
          designation: selectedCandidate?.designation,
          company: jsonData.message.data.company || appointmentDetails.company,
          appointment_date: jsonData.message.data.appointment_date || appointmentDetails.appointment_date,
          appointment_letter_template: jsonData.message.data.appointment_letter_template || appointmentDetails.appointment_letter_template,
          introduction: jsonData.message.data.introduction || appointmentDetails.introduction,
          closing_notes: jsonData.message.data.closing_notes || appointmentDetails.closing_notes,
          terms: jsonData.message.data.terms || appointmentDetails.terms,
          custom_staffworker: appointmentDetails.custom_staffworker,
        }
        setSavedAppointment(previewData)
        await fetchAcceptedOffers()
        if (selectedCandidate) setSelectedCandidate({ ...selectedCandidate, appointment_letter_status: "Close" })
      } else { setError("Error: " + (jsonData?.message?.message || jsonData?.message || "Unknown error")) }
    } catch (err) {
      console.error("Error creating appointment:", err)
      setError(err instanceof Error ? err.message : "Error creating appointment letter")
    } finally { setLoading(false) }
  }

  const getStatusBadgeClass = (status?: string) => {
    const s = status?.toLowerCase() || "open"
    if (s === "close") return "close"
    if (s === "open") return "open"
    return "default"
  }

  const DownloadButtons = ({ appt }: { appt: any }) => (
    <div className="al-dl-btns">
      {appt.custom_staffworker === "Worker" ? (
        <button className="al-dl-btn orange" onClick={() => {
          window.open(`https://ats.octavision.in/api/method/frappe.utils.print_format.download_pdf?doctype=Appointment%20Letter&name=${encodeURIComponent(appt.appointmentId)}&format=Appointment%20Letter%20Worker%20To%20Staff&no_letterhead=0`, '_blank')
        }}>
          <FileText size={15} /> Download - Worker To Staff
        </button>
      ) : appt.custom_staffworker === "Staff" ? (
        <button className="al-dl-btn blue" onClick={() => {
          window.open(`https://ats.octavision.in/api/method/frappe.utils.print_format.download_pdf?doctype=Appointment%20Letter&name=${encodeURIComponent(appt.appointmentId)}&format=Appointment%20Letter%20To%20Staff&no_letterhead=0`, '_blank')
        }}>
          <FileText size={15} /> Download - Letter To Staff
        </button>
      ) : (
        <>
          <button className="al-dl-btn orange" onClick={() => {
            window.open(`https://ats.octavision.in/api/method/frappe.utils.print_format.download_pdf?doctype=Appointment%20Letter&name=${encodeURIComponent(appt.appointmentId)}&format=Appointment%20Letter%20Worker%20To%20Staff&no_letterhead=0`, '_blank')
          }}>
            <FileText size={15} /> Worker To Staff
          </button>
          <button className="al-dl-btn blue" onClick={() => {
            window.open(`https://ats.octavision.in/api/method/frappe.utils.print_format.download_pdf?doctype=Appointment%20Letter&name=${encodeURIComponent(appt.appointmentId)}&format=Appointment%20Letter%20To%20Staff&no_letterhead=0`, '_blank')
          }}>
            <FileText size={15} /> Letter To Staff
          </button>
        </>
      )}
    </div>
  )

  if (loading && acceptedCandidates.length === 0) {
    return (
      <>
        <style>{css}</style>
        <div className="al">
          <div className="al-loading">
            <div className="al-loading-spinner" />
            <p className="al-loading-txt">Loading...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{css}</style>
      <div className="al">
        <div className="al-wrap">

          <div className={`al-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

          {/* SIDEBAR */}
          <aside className={`al-sb${sidebarOpen ? "" : " collapsed"}`}>
            <div className="al-sb-brand">
              <div className="al-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
              <div><div className="al-sb-name">Job Management</div><div className="al-sb-sub">HR Platform</div></div>
              <button className="al-sb-close" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
            </div>
            <nav className="al-nav">
              <Link href="/create-job" className="al-nav-cta"><Plus size={14} /> New Job Opening</Link>
              <div className="al-nav-lbl">General</div>
              <Link href="/home" className="al-nav-link">
                <Home size={15} /> Home
              </Link>
              <div className="al-nav-lbl">Pipeline</div>
              <Link href="/job-opening" className="al-nav-link"><Briefcase size={15} /> Job Opening</Link>
              <Link href="/upload-resumes" className="al-nav-link"><Upload size={15} /> Resume Collection</Link>
              <Link href="/candidates" className="al-nav-link"><Users size={15} /> Candidates</Link>
              <Link href="/interview" className="al-nav-link"><Calendar size={15} /> Interview Scheduling</Link>
              <div className="al-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
              <Link href="/feedback" className="al-nav-link"><MessageSquare size={15} /> Feedback</Link>
              <Link href="/document-verify-list" className="al-nav-link"><FileText size={15} /> Document Verification</Link>
              <Link href="/offer-list" className="al-nav-link"><Zap size={15} /> Offer Letter</Link>
              <Link href="/letter-appointment" className="al-nav-link active"><UserCheck size={15} /> Appointment Letter</Link>
            </nav>
            <div className="al-sb-foot">
              <button className="al-logout"><LogOut size={15} /> Sign out</button>
            </div>
          </aside>

          {/* MAIN */}
          <div className={`al-main${sidebarOpen ? "" : " sb-closed"}`}>
            <header className="al-header">
              <button className="al-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
              <div className="al-hdr-sep" />
              <Link href="/home" className="al-btn-back">
                <ArrowLeft size={13} /> Back
              </Link>
              <div className="al-hdr-sep" />
              <div className="al-crumb">
                <Home size={13} /> Home <ChevronRight size={13} /> <strong>Appointment Letter</strong>
              </div>
            </header>

            <div className="al-page-outer">
              <div className="al-page">

                {/* Toolbar */}
                <div className="al-toolbar">
                  <div>
                    <h1 className="al-page-title">Appointment Letters</h1>
                    <p className="al-page-sub">Generate appointment letters for candidates who accepted offers</p>
                  </div>
                </div>

                {/* Alerts */}
                {error && (
                  <div className="al-alert red">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="al-alert green">
                    <CheckCircle2 size={16} />
                    <span>{success}</span>
                  </div>
                )}

                {/* Two-col body */}
                <div className="al-body">

                  {/* LEFT: candidates list */}
                  <div className="al-left-card">
                    <div className="al-left-head">
                      <div className="al-left-title">
                        <UserCheck size={15} /> Accepted Offers ({acceptedCandidates.length})
                      </div>
                      <div className="al-left-sub">Candidates ready for appointment</div>
                      <div style={{ position: 'relative', marginTop: 10 }}>
                        <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', width: 14, height: 14, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
                        <input
                          type="text"
                          placeholder="Search candidates..."
                          value={searchQuery}
                          onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                          style={{
                            width: '100%', height: 36, padding: '0 12px 0 32px',
                            border: '1px solid var(--border)', borderRadius: 8,
                            background: 'var(--bg)', fontFamily: 'Inter, sans-serif',
                            fontSize: 13, color: 'var(--t1)', outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                    <div className="al-left-body">
                      {acceptedCandidates.length > 0 ? (
                        paginatedCandidates.map(candidate => (
                          <div
                            key={candidate.name}
                            className={`al-candidate-item${selectedCandidate?.name === candidate.name ? " selected" : ""}`}
                            onClick={() => handleCandidateSelect(candidate)}
                          >
                            <div className="al-cand-row">
                              <div className="al-cand-avatar">
                                {candidate.applicant_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="al-cand-name">{candidate.applicant_name}</div>
                                <div className="al-cand-desg">{candidate.designation}</div>
                                <div className="al-cand-date"><Calendar size={11} /> Offer: {candidate.offer_date}</div>
                              </div>
                            </div>
                            <div>
                              <span className={`al-status-badge ${getStatusBadgeClass(candidate.appointment_letter_status)}`}>
                                <span className={`al-status-dot ${candidate.appointment_letter_status === "Close" ? "red" : "green"}`} />
                                {candidate.appointment_letter_status || "Open"}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="al-empty-cands">
                          <UserCheck size={28} />
                          <p>No accepted offers found</p>
                        </div>
                      )}
                    </div>
                    {filteredCandidates.length > ITEMS_PER_PAGE && (
                      <div className="al-cand-pag">
                        <div className="al-cand-pag-info">
                          {startIndex + 1}–{Math.min(endIndex, filteredCandidates.length)} of {filteredCandidates.length}
                        </div>
                        <div className="al-cand-pag-btns">
                          <button className="al-pag-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                            <ChevronLeft size={12} /> Prev
                          </button>
                          <span className="al-pag-page">{currentPage}/{totalPages}</span>
                          <button className="al-pag-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                            Next <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RIGHT */}
                  <div className="al-right">
                    {!selectedCandidate ? (
                      <div className="al-no-select">
                        <div className="al-no-select-icon"><UserCheck size={30} /></div>
                        <p className="al-no-select-title">Select a Candidate</p>
                        <p className="al-no-select-sub">Choose a candidate who has accepted the offer to generate their appointment letter.</p>
                      </div>
                    ) : selectedCandidate.appointment_letter_status === "Close" ? (

                      /* Already created view */
                      <div className="al-already-banner">
                        <div className="al-already-head">
                          <div className="al-already-head-left">
                            <div className="al-already-icon"><FileText size={16} /></div>
                            <div>
                              <div className="al-already-title">Appointment Letter</div>
                              <div className="al-already-sub">Created for {selectedCandidate.applicant_name}</div>
                            </div>
                          </div>
                          <span className="al-status-badge close"><span className="al-status-dot red" />Close</span>
                        </div>
                        <div className="al-already-body">
                          {savedAppointment ? (
                            <div className="al-letter-box">
                              <div className="al-letter-title-row">
                                <div className="al-letter-h1">APPOINTMENT LETTER</div>
                                <div className="al-letter-company">{savedAppointment.company}</div>
                              </div>
                              <div>
                                <p className="al-letter-dear">Dear {savedAppointment.candidateName},</p>
                                <p className="al-letter-body-txt" style={{ marginTop: 8 }}>
                                  We are pleased to confirm your appointment as <strong>{savedAppointment.designation}</strong> with our organization.
                                </p>
                              </div>
                              {savedAppointment.introduction && (
                                <p className="al-letter-body-txt" style={{ whiteSpace: 'pre-line' }}>{savedAppointment.introduction}</p>
                              )}
                              {savedAppointment.terms?.length > 0 && (
                                <div className="al-letter-terms">
                                  {savedAppointment.terms.map((term: TermRow, idx: number) => (
                                    <div key={idx}>
                                      <p className="al-letter-term-title">{idx + 1}. {term.title}</p>
                                      <p className="al-letter-term-desc">{term.description}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {savedAppointment.closing_notes && (
                                <p className="al-letter-body-txt" style={{ whiteSpace: 'pre-line' }}>{savedAppointment.closing_notes}</p>
                              )}
                              <p className="al-letter-footer">Appointment letter has been successfully created.</p>
                              <DownloadButtons appt={savedAppointment} />
                            </div>
                          ) : (
                            <div className="al-loader">
                              <div className="al-spinner" />
                              <p className="al-loader-txt">Loading appointment letter...</p>
                              <p style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>If this takes too long, try clicking the candidate again.</p>
                            </div>
                          )}
                        </div>
                      </div>

                    ) : (
                      /* Create form */
                      <>
                        <div className="al-form-card">
                          <div className="al-form-banner">
                            <div className="al-form-banner-title"><UserCheck size={16} /> Generate Appointment Letter</div>
                            <div className="al-form-banner-sub">For {selectedCandidate.applicant_name} — {selectedCandidate.designation}</div>
                          </div>

                          <div className="al-form-sec-head">
                            <div className="al-form-sec-icon"><FileText size={14} /></div>
                            <div>
                              <div className="al-form-sec-title">Appointment Details</div>
                              <div className="al-form-sec-sub">Fill in the appointment letter details</div>
                            </div>
                          </div>

                          <div className="al-form-body">
                            <div className="al-grid-2">

                              {/* Job Applicant (read-only) */}
                              <div className="al-field">
                                <label className="al-label"><User size={12} /> Job Applicant</label>
                                <input className="al-input" value={selectedCandidate.applicant_name} disabled />
                              </div>

                              {/* Company (read-only) */}
                              <div className="al-field">
                                <label className="al-label"><Building2 size={12} /> Company</label>
                                <input className="al-input" value={appointmentDetails.company} disabled />
                              </div>

                              {/* Employee - combobox */}
                              <div className="al-field">
                                <label className="al-label"><UserCheck size={12} /> Employee <span className="al-req">*</span></label>
                                <Popover open={openEmployee} onOpenChange={setOpenEmployee}>
                                  <PopoverTrigger asChild>
                                    <button
                                      role="combobox"
                                      aria-expanded={openEmployee}
                                      disabled={loadingEmployees}
                                      onClick={() => setOpenEmployee(o => !o)}
                                      style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        height: 40, width: '100%', padding: '0 12px', borderRadius: 8,
                                        border: '1px solid var(--border)', background: 'var(--bg)',
                                        fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: 'var(--t1)',
                                        cursor: loadingEmployees ? 'not-allowed' : 'pointer',
                                        opacity: loadingEmployees ? 0.65 : 1,
                                      }}
                                    >
                                      <span style={{ color: appointmentDetails.custom_employee ? 'var(--t1)' : 'var(--t3)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>
                                        {appointmentDetails.custom_employee
                                          ? (() => { const e = employees.find(x => x.name === appointmentDetails.custom_employee); return e ? `${e.name} - ${e.employee_name}` : appointmentDetails.custom_employee })()
                                          : loadingEmployees ? "Loading employees..." : "Search and select employee..."}
                                      </span>
                                      <ChevronsUpDown size={13} style={{ color: 'var(--t3)', flexShrink: 0, marginLeft: 6 }} />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent style={{ width: 350, padding: 0 }}>
                                    <Command>
                                      <CommandInput placeholder="Search by employee ID or name..." />
                                      <CommandEmpty>No employee found.</CommandEmpty>
                                      <CommandGroup style={{ maxHeight: 280, overflow: 'auto' }}>
                                        {employees.map(emp => (
                                          <CommandItem
                                            key={emp.name}
                                            value={`${emp.name} ${emp.employee_name}`}
                                            onSelect={async () => {
                                              setAppointmentDetails(prev => ({ ...prev, custom_employee: emp.name, custom_staffworker: "" }))
                                              setOpenEmployee(false)
                                              try {
                                                const res = await fetch(
                                                  `${FRAPPE_BASE_URL}/api/method/frappe.client.get?doctype=Employee&name=${encodeURIComponent(emp.name)}`,
                                                  { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
                                                )
                                                const result = await res.json()
                                                const staffWorker = result?.message?.custom_staffworker || ""
                                                setAppointmentDetails(prev => ({ ...prev, custom_staffworker: staffWorker }))
                                              } catch (err) { console.error("Error fetching employee details:", err) }
                                            }}
                                          >
                                            <Check size={13} style={{ marginRight: 8, opacity: appointmentDetails.custom_employee === emp.name ? 1 : 0 }} />
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                              <span style={{ fontWeight: 500 }}>{emp.name}</span>
                                              <span style={{ fontSize: 11, color: 'var(--t3)' }}>{emp.employee_name}</span>
                                            </div>
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              </div>

                              {/* Salary Annexure */}
                              <div className="al-field">
                                <label className="al-label">
                                  <FileText size={12} /> Salary Annexure
                                  {appointmentDetails.custom_staffworker !== "Worker" && <span className="al-req">*</span>}
                                  {appointmentDetails.custom_staffworker === "Worker" && <span className="al-label-hint">(optional for Worker)</span>}
                                </label>
                                <select
                                  className="al-select"
                                  value={appointmentDetails.custom_salary_annexure}
                                  onChange={e => setAppointmentDetails({ ...appointmentDetails, custom_salary_annexure: e.target.value })}
                                  // disabled={loadingSalaryAnnexures}
                                  disabled={true}
                                >
                                  <option value="">
                                    {loadingSalaryAnnexures ? "Loading annexures..."
                                      : salaryAnnexures.length === 0 ? "No annexures available"
                                        : "Select Salary Annexure"}
                                  </option>
                                  {salaryAnnexures.map(a => (
                                    <option key={a.name} value={a.name}>{a.name}</option>
                                  ))}
                                </select>
                                {salaryAnnexures.length === 0 && !loadingSalaryAnnexures && (
                                  <div className="al-hint amber"><AlertCircle size={11} /> Please create a Salary Annexure in Frappe first.</div>
                                )}
                              </div>

                              {/* Monthly Gross Salary */}
                              <div className="al-field">
                                <label className="al-label"><Briefcase size={12} /> Monthly Gross Salary <span className="al-req">*</span></label>
                                <input
                                  className="al-input"
                                  type="number"
                                  value={appointmentDetails.custom_monthly_gross_salary}
                                  onChange={e => setAppointmentDetails({ ...appointmentDetails, custom_monthly_gross_salary: e.target.value })}
                                  placeholder="Enter monthly gross salary"
                                />
                              </div>

                              {/* Staff/Worker - auto-populated */}
                              {appointmentDetails.custom_staffworker && (
                                <div className="al-field" style={{ gridColumn: '1 / -1' }}>
                                  <label className="al-label"><UserCheck size={12} /> Staff / Worker</label>
                                  <div className="al-staffworker-row">
                                    <span className={`al-staffworker-dot ${appointmentDetails.custom_staffworker === "Staff" ? "blue" : "orange"}`} />
                                    <span className="al-staffworker-txt">{appointmentDetails.custom_staffworker}</span>
                                    <span className="al-staffworker-hint">(auto-populated from Employee)</span>
                                  </div>
                                </div>
                              )}

                              {/* Appointment Date */}
                              <div className="al-field">
                                <label className="al-label"><Calendar size={12} /> Appointment Date <span className="al-req">*</span></label>
                                <input
                                  className="al-input"
                                  type="date"
                                  value={appointmentDetails.appointment_date}
                                  onChange={e => setAppointmentDetails({ ...appointmentDetails, appointment_date: e.target.value })}
                                  min={getTodayDate()}
                                  onClick={e => (e.currentTarget as HTMLInputElement).showPicker?.()}
                                  style={{ cursor: 'pointer' }}
                                />
                              </div>

                              {/* Template */}
                              <div className="al-field" style={{ gridColumn: '1 / -1' }}>
                                <label className="al-label"><FileText size={12} /> Appointment Letter Template <span className="al-req">*</span></label>
                                <select
                                  className="al-select"
                                  value={appointmentDetails.appointment_letter_template}
                                  onChange={e => handleTemplateSelect(e.target.value)}
                                >
                                  <option value="">Select template</option>
                                  {templates.map(t => (
                                    <option key={t.name} value={t.name}>{t.name}</option>
                                  ))}
                                </select>
                                {appointmentDetails.appointment_letter_template && (
                                  <div className="al-hint blue"><CheckCircle2 size={11} /> Template loaded successfully</div>
                                )}
                              </div>
                            </div>

                            {/* Introduction */}
                            <div className="al-field">
                              <label className="al-label"><FileText size={12} /> Introduction</label>
                              <textarea
                                className="al-textarea"
                                value={appointmentDetails.introduction}
                                onChange={e => setAppointmentDetails({ ...appointmentDetails, introduction: e.target.value })}
                                placeholder="Introduction text..."
                                rows={3}
                              />
                            </div>

                            {/* Closing Notes */}
                            <div className="al-field">
                              <label className="al-label"><FileText size={12} /> Closing Notes</label>
                              <textarea
                                className="al-textarea"
                                value={appointmentDetails.closing_notes}
                                onChange={e => setAppointmentDetails({ ...appointmentDetails, closing_notes: e.target.value })}
                                placeholder="Closing notes..."
                                rows={3}
                              />
                            </div>

                            {/* Terms */}
                            <div className="al-field">
                              <label className="al-label">
                                <FileText size={12} /> Terms & Conditions
                                {appointmentDetails.terms.length > 0 && (
                                  <span className="al-cnt-badge">{appointmentDetails.terms.length} term{appointmentDetails.terms.length !== 1 ? 's' : ''}</span>
                                )}
                              </label>
                              {appointmentDetails.terms.length > 0 ? (
                                <div className="al-terms-table">
                                  <table>
                                    <thead>
                                      <tr>
                                        <th style={{ width: 48 }}>No.</th>
                                        <th>Title</th>
                                        <th>Description</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {appointmentDetails.terms.map((term, index) => (
                                        <tr key={index}>
                                          <td className="al-terms-num">{index + 1}</td>
                                          <td>
                                            <input
                                              className="al-input"
                                              value={term.title}
                                              onChange={e => handleTermChange(index, "title", e.target.value)}
                                              placeholder="e.g., Probation Period"
                                              style={{ height: 36, fontSize: 13 }}
                                            />
                                          </td>
                                          <td>
                                            <input
                                              className="al-input"
                                              value={term.description}
                                              onChange={e => handleTermChange(index, "description", e.target.value)}
                                              placeholder="e.g., 6 months from date of joining"
                                              style={{ height: 36, fontSize: 13 }}
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="al-no-terms">
                                  <FileText size={36} style={{ color: 'var(--t3)', margin: '0 auto 8px', display: 'block' }} />
                                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--t2)' }}>No terms added yet</p>
                                  <p style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 4 }}>Select a template or add terms manually</p>
                                </div>
                              )}
                            </div>

                            {/* Submit */}
                            <div className="al-submit-row">
                              <button
                                className="al-submit-btn"
                                onClick={handleCreateAppointment}
                                disabled={loading || !appointmentDetails.appointment_date || !appointmentDetails.appointment_letter_template}
                              >
                                {loading ? (
                                  <><div className="al-btn-spin" /> Saving...</>
                                ) : (
                                  <><CheckCircle2 size={16} /> Save Appointment Letter</>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Preview (after save) */}
                        {savedAppointment && (
                          <div className="al-already-banner">
                            <div className="al-already-head">
                              <div className="al-already-head-left">
                                <div className="al-already-icon"><FileText size={16} /></div>
                                <div>
                                  <div className="al-already-title">Appointment Letter Preview</div>
                                  <div className="al-already-sub">Preview of the appointment letter</div>
                                </div>
                              </div>
                              <span className="al-status-badge open"><span className="al-status-dot green" />Saved</span>
                            </div>
                            <div className="al-already-body">
                              <div className="al-letter-box">
                                <div className="al-letter-title-row">
                                  <div className="al-letter-h1">APPOINTMENT LETTER</div>
                                  <div className="al-letter-company">{savedAppointment.company}</div>
                                </div>
                                <div>
                                  <p className="al-letter-dear">Dear {savedAppointment.candidateName},</p>
                                  <p className="al-letter-body-txt" style={{ marginTop: 8 }}>
                                    We are pleased to confirm your appointment as <strong>{savedAppointment.designation}</strong> with our organization.
                                  </p>
                                </div>
                                {savedAppointment.introduction && (
                                  <p className="al-letter-body-txt" style={{ whiteSpace: 'pre-line' }}>{savedAppointment.introduction}</p>
                                )}
                                {savedAppointment.terms?.length > 0 && (
                                  <div className="al-letter-terms">
                                    {savedAppointment.terms.map((term: TermRow, idx: number) => (
                                      <div key={idx}>
                                        <p className="al-letter-term-title">{idx + 1}. {term.title}</p>
                                        <p className="al-letter-term-desc">{term.description}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {savedAppointment.closing_notes && (
                                  <p className="al-letter-body-txt" style={{ whiteSpace: 'pre-line' }}>{savedAppointment.closing_notes}</p>
                                )}
                                <p className="al-letter-footer">This is a preview. The actual appointment letter will contain complete terms and conditions.</p>
                                <DownloadButtons appt={savedAppointment} />
                                <div>
                                  <button className="al-dl-btn outline" style={{ minWidth: 140 }} onClick={() => setSavedAppointment(null)}>
                                    Close Preview
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
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