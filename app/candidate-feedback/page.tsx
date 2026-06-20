"use client"
import React, { useState, useEffect, Suspense } from "react"
import { getFrappeCSRF } from "@/lib/csrf"
import {
  Settings, Star, Trash2, Copy, ArrowLeft, Plus, RefreshCw, Eye,
  User, Briefcase, Calendar, FileText, Building2, MapPin,
  CheckCircle2, AlertCircle, MessageSquare, Mail,
  Menu, X, Home, LogOut, Upload, Users, ChevronRight,
  Zap, UserCheck
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { API_BASE_URL } from "@/lib/api-config"
import { axiosConfig } from '@/lib/axios-config'

const API_MODULE_PATH = "resume.api.interview_feedback"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cf {
    --sb-w:       265px;
    --sb:         #1e1e2d;
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
    --green:      #16a34a;
    --green-lt:   #dcfce7;
    --green-bdr:  #bbf7d0;
    --red:        #dc2626;
    --red-lt:     #fee2e2;
    --red-bdr:    #fecaca;
    --yellow:     #d97706;
    --yellow-lt:  #fef9c3;
    --yellow-bdr: #fde68a;
    --orange:     #ea580c;
    --orange-lt:  #fff7ed;
    --orange-bdr: #fed7aa;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13.5px;
    -webkit-font-smoothing: antialiased;
  }
  .cf-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  /* SIDEBAR */
  .cf-sb { width: var(--sb-w); background: var(--sb); min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 100; display: flex; flex-direction: column; transition: transform .25s cubic-bezier(.4,0,.2,1); }
  .cf-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }
  .cf-sb-brand { height: 64px; display: flex; align-items: center; gap: 12px; padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .cf-sb-icon { width: 38px; height: 38px; border-radius: 10px; background: var(--accent-md); border: 1px solid var(--accent-bdr); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
  .cf-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .cf-sb-name { font-size: 14px; font-weight: 700; color: #fff; }
  .cf-sb-sub  { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
  .cf-sb-close { margin-left: auto; width: 28px; height: 28px; border-radius: 7px; background: none; border: none; cursor: pointer; color: var(--sb-lbl); display: flex; align-items: center; justify-content: center; transition: all .14s; }
  .cf-sb-close:hover { background: var(--sb-hover); color: #fff; }
  .cf-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .cf-nav-cta { display: flex; align-items: center; gap: 9px; padding: 11px 14px; border-radius: 9px; background: var(--accent-md); border: 1px solid var(--accent-bdr); color: var(--accent); font-size: 13px; font-weight: 600; text-decoration: none; transition: background .15s; margin-bottom: 22px; }
  .cf-nav-cta:hover { background: rgba(0,158,247,.24); }
  .cf-nav-lbl { font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px; }
  .cf-nav-link { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: var(--sb-txt); text-decoration: none; transition: all .14s; }
  .cf-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; }
  .cf-nav-link:hover, .cf-nav-link.active { background: var(--sb-hover); color: #fff; }
  .cf-nav-link:hover svg, .cf-nav-link.active svg { opacity: 1; }
  .cf-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .cf-logout { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 12px; border-radius: 8px; background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: var(--sb-lbl); transition: all .14s; }
  .cf-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }
  .cf-overlay { display: none; position: fixed; inset: 0; z-index: 99; background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer; }
  @media (max-width: 768px) { .cf-overlay.show { display: block; } }

  /* MAIN */
  .cf-main { margin-left: var(--sb-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; transition: margin-left .25s cubic-bezier(.4,0,.2,1); }
  .cf-main.sb-closed { margin-left: 0; }

  /* HEADER */
  .cf-header { min-height: 60px; background: #fff; border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 28px; gap: 12px; position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 0 rgba(0,158,247,.08); overflow: hidden; }  .cf-toggle { width: 34px; height: 34px; border-radius: 8px; background: none; border: 1px solid var(--border); cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--t2); transition: all .14s; }
  .cf-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .cf-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .cf-crumb { display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--t3); flex: 1; min-width: 0; overflow: hidden; }
  .cf-crumb svg { flex-shrink: 0; }
  .cf-crumb a { white-space: nowrap; flex-shrink: 0; color: var(--t3); text-decoration: none; }
  .cf-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px; }
  .cf-hdr-right { margin-left: auto; }
  .cf-btn-back { display: inline-flex; align-items: center; gap: 7px; padding: 7px 14px; border-radius: 8px; background: transparent; color: var(--t2); font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; border: 1px solid var(--border); cursor: pointer; transition: all .14s; }
  .cf-btn-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

  /* PAGE — centred */
  .cf-page-outer { flex: 1; display: flex; justify-content: center; padding: 28px 32px; }
  .cf-page { width: 100%; max-width: 860px; display: flex; flex-direction: column; gap: 20px; }
  .cf-page-title { font-size: 21px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; }
  .cf-page-sub   { font-size: 13px; color: var(--t3); margin-top: 4px; }

  /* CARDS */
  .cf-card { background: var(--card); border: 1px solid var(--border-s); border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,158,247,.06); }
  .cf-card-head { padding: 14px 20px; border-bottom: 1px solid var(--border-s); display: flex; align-items: center; justify-content: space-between; background: linear-gradient(to right, #f8fcff, var(--accent-lt)); }
  .cf-card-title { font-size: 13.5px; font-weight: 700; color: var(--t1); display: flex; align-items: center; gap: 8px; }
  .cf-card-title svg { color: var(--accent); }
  .cf-card-title.orange svg { color: var(--orange); }
  .cf-card-title.red svg { color: var(--red); }
  .cf-card-body { padding: 22px; }

  /* FORM */
  .cf-form-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .cf-form-field { display: flex; flex-direction: column; gap: 6px; }
  .cf-label { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--t3); display: flex; align-items: center; gap: 5px; }
  .cf-label svg { width: 12px; height: 12px; }
  .cf-req { color: var(--red); margin-left: 1px; }
  .cf-input { width: 100%; height: 44px; padding: 0 13px; border: 1px solid var(--border); border-radius: 9px; background: var(--bg); font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--t1); outline: none; transition: all .15s; }
  .cf-input::placeholder { color: var(--t3); }
  .cf-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .cf-input:disabled { background: #f3f7fa; color: var(--t3); cursor: not-allowed; }
  .cf-input.readonly { background: #f3f7fa; color: var(--t2); }
  .cf-textarea { width: 100%; padding: 12px 14px; min-height: 140px; border: 1px solid var(--border); border-radius: 9px; background: var(--bg); font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--t1); outline: none; resize: vertical; transition: all .15s; line-height: 1.6; }
  .cf-textarea::placeholder { color: var(--t3); }
  .cf-textarea:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .cf-select-wrap { position: relative; }
  .cf-select-arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%) rotate(90deg); color: var(--t3); pointer-events: none; width: 13px; height: 13px; }
  .cf-select { width: 100%; height: 44px; padding: 0 36px 0 13px; border: 1px solid var(--border); border-radius: 9px; background: var(--bg); font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--t2); appearance: none; outline: none; cursor: pointer; transition: all .15s; }
  .cf-select:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .cf-select:disabled { background: #f3f7fa; color: var(--t3); cursor: not-allowed; }

  /* SCORE BOX */
  .cf-score-box { display: flex; align-items: center; justify-content: space-between; background: linear-gradient(to right, var(--accent-lt), #f0f8fe); border: 1px solid var(--border); border-radius: 10px; padding: 18px 22px; margin-bottom: 16px; }
  .cf-score-label { font-size: 15px; font-weight: 600; color: var(--t1); }
  .cf-score-value { font-size: 30px; font-weight: 800; color: var(--accent); letter-spacing: -1px; }

  /* CHECKBOX GRID */
  .cf-check-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .cf-check-row { display: flex; align-items: center; gap: 9px; padding: 9px 12px; border-radius: 8px; cursor: pointer; transition: background .13s; }
  .cf-check-row:hover { background: var(--accent-lt); }
  .cf-check-row.orange:hover { background: var(--orange-lt); }
  .cf-check-row.red-h:hover { background: var(--red-lt); }
  .cf-check { width: 15px; height: 15px; accent-color: var(--accent); cursor: pointer; flex-shrink: 0; }
  .cf-check-label { font-size: 13px; font-weight: 500; color: var(--t2); cursor: pointer; }

  /* SKILL TABLE */
  .cf-table { width: 100%; border-collapse: collapse; }
  .cf-table thead { background: linear-gradient(to right, var(--accent-lt), #f0f8fe); }
  .cf-table th { padding: 12px 16px; text-align: left; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--t2); border-bottom: 1px solid var(--border-s); }
  .cf-table tbody tr { border-bottom: 1px solid var(--border-s); transition: background .12s; }
  .cf-table tbody tr:last-child { border-bottom: none; }
  .cf-table tbody tr:hover { background: var(--accent-lt); }
  .cf-table td { padding: 12px 16px; font-size: 13px; color: var(--t2); }

  /* STAR RATING */
  .cf-stars { display: flex; gap: 4px; }
  .cf-star { width: 26px; height: 26px; background: none; border: none; cursor: pointer; padding: 0; transition: transform .1s; display: flex; align-items: center; justify-content: center; }
  .cf-star:hover { transform: scale(1.18); }
  .cf-star:disabled { cursor: default; }
  .cf-star svg { width: 22px; height: 22px; }
  .cf-star.filled svg { fill: #facc15; color: #facc15; }
  .cf-star.empty  svg { fill: #e2e8f0; color: #e2e8f0; }

  /* ROW ACTIONS */
  .cf-row-actions { display: flex; align-items: center; gap: 6px; }
  .cf-btn-icon { width: 32px; height: 32px; border-radius: 7px; background: none; border: 1px solid var(--border); cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--t3); transition: all .13s; font-family: 'Inter', sans-serif; }
  .cf-btn-icon:hover { background: var(--red-lt); border-color: var(--red-bdr); color: var(--red); }
  .cf-btn-ghost { height: 32px; padding: 0 10px; border-radius: 7px; background: none; border: 1px solid var(--border); cursor: pointer; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; color: var(--t2); transition: all .13s; }
  .cf-btn-ghost:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

  /* ALERTS */
  .cf-alert-warn { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; background: var(--red-lt); border: 1px solid var(--red-bdr); border-radius: 10px; margin-top: 4px; }
  .cf-alert-warn svg { color: var(--red); flex-shrink: 0; margin-top: 1px; }
  .cf-alert-info { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--accent-lt); border: 1px solid var(--border); border-radius: 10px; margin-top: 4px; }
  .cf-alert-info svg { color: var(--accent); flex-shrink: 0; }
  .cf-spinner-sm { width: 15px; height: 15px; border-radius: 50%; border: 2px solid rgba(0,158,247,.3); border-top-color: var(--accent); animation: cf-spin .6s linear infinite; flex-shrink: 0; }
  .cf-alert-title { font-size: 13px; font-weight: 600; color: var(--red); margin-bottom: 2px; }
  .cf-alert-sub   { font-size: 11.5px; color: #991b1b; }
  .cf-alert-txt   { font-size: 13px; color: var(--t2); }

  /* ACTIONS */
  .cf-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
  .cf-btn-cancel { display: inline-flex; align-items: center; gap: 7px; padding: 10px 22px; border-radius: 9px; background: transparent; color: var(--t2); font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 600; border: 1px solid var(--border); cursor: pointer; transition: all .14s; }
  .cf-btn-cancel:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .cf-btn-cancel:disabled { opacity: .5; cursor: not-allowed; }
  .cf-btn-save { display: inline-flex; align-items: center; gap: 7px; padding: 10px 28px; border-radius: 9px; background: var(--accent); color: #fff; font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 700; border: none; cursor: pointer; transition: background .15s; }
  .cf-btn-save:hover:not(:disabled) { background: var(--accent-h); }
  .cf-btn-save:disabled { opacity: .5; cursor: not-allowed; background: var(--t3); }
  .cf-btn-save.exists { background: #6b7280; }
  .cf-spinner { width: 15px; height: 15px; border-radius: 50%; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; animation: cf-spin .6s linear infinite; flex-shrink: 0; }
  @keyframes cf-spin { to { transform: rotate(360deg); } }

  /* COLUMN CONFIG MODAL */
  .cf-modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 200; }
  .cf-modal { background: #fff; border-radius: 14px; width: 100%; max-width: 540px; margin: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,.18); }
  .cf-modal-head { padding: 16px 20px; border-bottom: 1px solid var(--border-s); display: flex; align-items: center; justify-content: space-between; background: linear-gradient(to right, #f8fcff, var(--accent-lt)); }
  .cf-modal-title { font-size: 14px; font-weight: 700; color: var(--t1); }
  .cf-modal-close { width: 28px; height: 28px; border-radius: 7px; background: none; border: none; cursor: pointer; color: var(--t3); display: flex; align-items: center; justify-content: center; transition: all .14s; font-size: 16px; }
  .cf-modal-close:hover { background: var(--accent-lt); color: var(--accent); }
  .cf-modal-body { padding: 20px; }
  .cf-modal-foot { padding: 14px 20px; border-top: 1px solid var(--border-s); display: flex; justify-content: flex-end; gap: 10px; }
  .cf-col-row { display: grid; grid-template-columns: 36px 1fr 1fr 36px; gap: 10px; align-items: center; background: var(--bg); padding: 10px 12px; border-radius: 8px; margin-bottom: 8px; }
  .cf-col-dots { display: flex; flex-direction: column; gap: 3px; align-items: center; }
  .cf-col-dot { width: 4px; height: 4px; background: var(--t3); border-radius: 50%; }
  .cf-btn-link { background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: var(--accent); padding: 4px 0; }
  .cf-btn-link:hover { text-decoration: underline; }
  .cf-btn-del { width: 30px; height: 30px; border-radius: 7px; background: none; border: 1px solid var(--border); cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--t3); transition: all .13s; }
  .cf-btn-del:hover { background: var(--red-lt); border-color: var(--red-bdr); color: var(--red); }

  .cf-loading { min-height: 100vh; background: var(--bg); display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 14px; }
  .cf-loading-spinner { width: 44px; height: 44px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent); animation: cf-spin .7s linear infinite; }
  .cf-loading-txt { font-size: 14px; color: var(--t3); font-weight: 500; }

  @media (max-width: 768px) {
    .cf-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .cf-sb.open { transform: translateX(0); }
    .cf-main { margin-left: 0 !important; overflow-x: hidden; max-width: 100vw; }
    .cf-wrap { overflow-x: hidden; }
    .cf-page-outer { padding: 12px; overflow-x: hidden; }
    .cf-page { overflow-x: hidden; gap: 14px; }
    .cf-header { padding: 0 12px; gap: 6px; }
    .cf-hdr-sep { display: none; }
    .cf-btn-back { font-size: 12px; padding: 6px 10px; flex-shrink: 0; }
    .cf-form-grid { grid-template-columns: 1fr; }
    .cf-check-grid { grid-template-columns: 1fr; }
    .cf-card-body { padding: 14px; }
    .cf-card-head { padding: 12px 14px; }
    .cf-actions { flex-direction: column; }
    .cf-btn-cancel, .cf-btn-save { width: 100%; justify-content: center; }
    .cf-table { min-width: 380px; }
    .cf-table td, .cf-table th { padding: 10px 8px; }
    .cf-table th:first-child, .cf-table td:first-child { width: 32px; padding: 10px 6px; }
    .cf-table th:nth-child(2), .cf-table td:nth-child(2) { width: 36px; }
  }
  .cf-textarea:disabled, .cf-check:disabled { 
    background: #f3f7fa; 
    cursor: not-allowed; 
    opacity: 0.6; 
  }
`

interface SkillAssessment { id: string; skill: string; rating: number }
interface Interview { name: string; job_applicant: string; applicant_name?: string; interview_round: string; scheduled_on: string; status: string }
interface Interviewer { name: string; full_name: string; email: string }
interface ColumnConfig { fieldname: string; width: number }

function CandidateFeedbackForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const candidateIdFromUrl = searchParams.get('candidateId')
  const candidateNameFromUrl = searchParams.get('candidateName')
  const candidateEmailFromUrl = searchParams.get('candidateEmail')
  const interviewNameFromUrl = searchParams.get('interviewName')
  const interviewerFromUrl = searchParams.get('interviewer')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [feedbackForm, setFeedbackForm] = useState({
    // interview: "", interviewer: "", result: "", feedback: "",
    interview: interviewNameFromUrl || "", interviewer: interviewerFromUrl || "", result: "", feedback: "",
    job_applicant: "", interview_round: "", candidate_name: "",
    interview_date: "", position_applied_for: "", department: "",
    location: "", new_position: "", replacement_position: "",
    applicant_rating: "", final_score_recommendation: [] as string[],
    not_shortlisted_reason: [] as string[], withdrawn_reason: [] as string[], remarks: ""
  })

  // const [skillAssessments, setSkillAssessments] = useState<SkillAssessment[]>([
  //   { id: "1", skill: "", rating: 0 }
  // ])
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessment[]>([
    { id: "1", skill: "Communications Skills", rating: 0 },
    { id: "2", skill: "Education", rating: 0 },
    { id: "3", skill: "IT Skills", rating: 0 },
    { id: "5", skill: "Organization Skills", rating: 0 },
    { id: "6", skill: "Technical Skills", rating: 0 },
    { id: "7", skill: "Training", rating: 0 },
    { id: "8", skill: "Work Experience", rating: 0 },
  ])

  // Add these two NEW lines right after the state declarations:
  // const showNotShortlistedSection = feedbackForm.final_score_recommendation.includes("Not Shortlisted")
  // const showWithdrawnSection = feedbackForm.final_score_recommendation.includes("Candidature Withdrawn")

  const showNotShortlistedSection = feedbackForm.final_score_recommendation.includes("Not Shortlisted")
  const showWithdrawnSection = feedbackForm.final_score_recommendation.includes("Candidature Withdrawn")
  // Calculate total score from all skill ratings
  const calculateTotalScore = () => skillAssessments.reduce((sum, skill) => sum + skill.rating, 0)

  const [interviews, setInterviews] = useState<Interview[]>([])
  const [interviewers, setInterviewers] = useState<Interviewer[]>([])
  const [resultOptions, setResultOptions] = useState<string[]>([])
  const [availableSkills, setAvailableSkills] = useState<string[]>([])
  const [finalScoreOptions, setFinalScoreOptions] = useState<string[]>([])
  const [notShortlistedOptions, setNotShortlistedOptions] = useState<string[]>([])
  const [withdrawnReasonOptions, setWithdrawnReasonOptions] = useState<string[]>([])
  const [applicantRatingOptions, setApplicantRatingOptions] = useState<string[]>([])
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([])
  const [locationOptions, setLocationOptions] = useState<string[]>([])
  const [designationOptions, setDesignationOptions] = useState<string[]>([])

  const [loading, setLoading] = useState({
    interviews: true, interviewers: true, resultOptions: true, skills: true,
    finalScoreOptions: true, notShortlistedOptions: true, withdrawnReasonOptions: true,
    applicantRatingOptions: true, departmentOptions: true, locationOptions: true, designationOptions: true
  })
  const [isSaving, setIsSaving] = useState(false)
  const [existingFeedback, setExistingFeedback] = useState<string | null>(null)
  const [checkingDuplicate, setCheckingDuplicate] = useState(false)
  const [editingRowId, setEditingRowId] = useState<string | null>(null)
  const [showColumnConfig, setShowColumnConfig] = useState(false)
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>([
    { fieldname: "Skill", width: 2 }, { fieldname: "Rating", width: 2 }
  ])

  useEffect(() => {
    console.log("🚀 Component mounted, fetching all data...")
    fetchInterviews()
    fetchInterviewers()
    fetchResultOptions()
    fetchSkills()
    fetchFinalScoreOptions()
    fetchNotShortlistedOptions()
    fetchWithdrawnReasonOptions()
    fetchApplicantRatingOptions()
    fetchDepartmentOptions()
    fetchLocationOptions()
    fetchDesignationOptions()

    //   // Auto-fill candidate name if provided in URL
    //   if (candidateNameFromUrl) {
    //     setFeedbackForm(prev => ({
    //       ...prev,
    //       candidate_name: candidateNameFromUrl
    //     }))
    //     console.log("✅ Auto-filled candidate name:", candidateNameFromUrl)
    //   }
    // }, [candidateNameFromUrl])

    // Auto-fill candidate info if provided in URL
    if (candidateNameFromUrl) {

      setFeedbackForm(prev => ({
        ...prev,
        candidate_name: candidateNameFromUrl,
        job_applicant: candidateIdFromUrl || prev.job_applicant
      }))
      console.log("✅ Auto-filled candidate info:", { name: candidateNameFromUrl, id: candidateIdFromUrl })
    }
  }, [candidateNameFromUrl, candidateIdFromUrl])

  // Auto-trigger handleInterviewChange when interviews load and interviewName is in URL
  useEffect(() => {
    if (interviewNameFromUrl && interviews.length > 0) {
      handleInterviewChange(interviewNameFromUrl)
    }
  }, [interviews.length, interviewNameFromUrl])

  // New useEffect to fetch interviews for specific candidate
  useEffect(() => {
    const fetchCandidateInterviews = async () => {
      if (candidateIdFromUrl && interviews.length > 0) {
        // Filter interviews for this specific candidate
        const candidateInterviews = interviews.filter(
          (interview) => interview.job_applicant === candidateIdFromUrl
        )
        console.log("🔍 Interviews for this candidate:", candidateInterviews)
        // If no interviews found in current list, try to fetch directly
        if (candidateInterviews.length === 0) {
          try {
            console.log("🔄 Fetching interviews for candidate:", candidateIdFromUrl)
            const response = await fetch(
              `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_candidate_interviews?candidate_id=${candidateIdFromUrl}`,
              { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
            )
            const data = await response.json()
            const candidateSpecificInterviews = data?.message?.data || []
            if (candidateSpecificInterviews.length > 0) {
              // Merge with existing interviews
              setInterviews(prev => {
                const merged = [...prev]
                candidateSpecificInterviews.forEach((newInterview: Interview) => {
                  if (!merged.find(i => i.name === newInterview.name)) merged.push(newInterview)
                })
                return merged
              })
              console.log("✅ Added candidate-specific interviews:", candidateSpecificInterviews)
            }
          } catch (error) { console.error("❌ Error fetching candidate interviews:", error) }
        }
      }
    }
    fetchCandidateInterviews()
  }, [candidateIdFromUrl, interviews.length])

  useEffect(() => { document.title = 'Candidate Feedback' }, [])

  // useEffect(() => {
  //   const totalScore = calculateTotalScore()
  //   let recommendation = ""; let autoCheckOffered = false
  //   if (totalScore >= 10 && totalScore <= 13) recommendation = "Average (10 to 13)"
  //   else if (totalScore >= 14 && totalScore <= 18) recommendation = "Good (14 to 18)"
  //   else if (totalScore >= 19 && totalScore <= 21) recommendation = "Excellent (19 to 21)"
  //   else if (totalScore > 21) autoCheckOffered = true
  //   const filteredRecommendations = feedbackForm.final_score_recommendation.filter(
  //     item => !["Average (10 to 13)", "Good (14 to 18)", "Excellent (19 to 21)", "To be Offered"].includes(item)
  //   )
  //   let newRecommendations = [...filteredRecommendations]
  //   if (recommendation) newRecommendations.push(recommendation)
  //   if (autoCheckOffered) newRecommendations.push("To be Offered")
  //   const currentSet = new Set(feedbackForm.final_score_recommendation)
  //   const newSet = new Set(newRecommendations)
  //   const hasChanged = currentSet.size !== newSet.size || [...currentSet].some(item => !newSet.has(item))
  //   if (hasChanged) setFeedbackForm(prev => ({ ...prev, final_score_recommendation: newRecommendations }))
  // }, [skillAssessments])

  useEffect(() => {
    const totalScore = calculateTotalScore()
    let recommendation = ""
    if (totalScore >= 10 && totalScore <= 13) recommendation = "Average (10 to 13)"
    else if (totalScore >= 14 && totalScore <= 18) recommendation = "Good (14 to 18)"
    else if (totalScore >= 19 && totalScore <= 21) recommendation = "Excellent (19 to 21)"
    else if (totalScore > 21) recommendation = "To be Offered"

    setFeedbackForm(prev => ({
      ...prev,
      final_score_recommendation: recommendation ? [recommendation] : []
    }))
  }, [skillAssessments])

  const fetchInterviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_interviews`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      const data = await response.json()
      const list = data?.message?.data || []
      setInterviews(list)
      console.log("✅ Fetched interviews:", list.length, list)
      if (list.length > 0) { console.log("🔍 First interview structure:", list[0]); console.log("🔍 Interviewer field:", list[0].interviewer) }
    } catch (error: any) { console.error("❌ Error fetching interviews:", error); setInterviews([]) }
    finally { setLoading(prev => ({ ...prev, interviews: false })) }
  }

  const fetchInterviewers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_interviewers`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      const data = await response.json()
      const list = data?.message?.data || []
      setInterviewers(list)
      console.log("✅ Fetched interviewers:", list.length, list)
    } catch (error: any) { console.error("❌ Error fetching interviewers:", error); setInterviewers([]) }
    finally { setLoading(prev => ({ ...prev, interviewers: false })) }
  }

  const fetchResultOptions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_result_options`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      const data = await response.json()
      const options = data?.message?.data || []
      setResultOptions(options)
      console.log("✅ Fetched result options:", options)
    } catch (error: any) { console.error("❌ Error fetching result options:", error); setResultOptions(["Cleared", "Rejected"]) }
    finally { setLoading(prev => ({ ...prev, resultOptions: false })) }
  }

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_skills`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      const data = await response.json()
      const skills = data?.message?.data || []
      setAvailableSkills(skills)
      console.log("✅ Fetched skills:", skills)
    } catch (error: any) { console.error("❌ Error fetching skills:", error); setAvailableSkills([]) }
    finally { setLoading(prev => ({ ...prev, skills: false })) }
  }

  const fetchFinalScoreOptions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_final_score_options`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      const data = await response.json()
      const options = data?.message?.data || []
      setFinalScoreOptions(options)
      console.log("✅ Fetched final score options:", options)
    } catch (error: any) {
      console.error("❌ Error fetching final score options:", error)
      setFinalScoreOptions(["Average (10 to 13)", "Good (14 to 18)", "Excellent (19 to 21)", "Not Shortlisted", "To be Offered", "Candidature Withdrawn"])
    }
    finally { setLoading(prev => ({ ...prev, finalScoreOptions: false })) }
  }

  const fetchNotShortlistedOptions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_not_shortlisted_options`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      const data = await response.json()
      const options = data?.message?.data || []
      setNotShortlistedOptions(options)
      console.log("✅ Fetched not shortlisted options:", options)
    } catch (error: any) {
      console.error("❌ Error fetching not shortlisted options:", error)
      setNotShortlistedOptions(["No Show for interview", "Not as qualified as others", "Test Scores", "Selected for other position", "Insufficient Skills", "Offer Denied", "Reference Check Unsatisfactory", "Good Skills/Exp, not 1st choice", "Poor Interview Ratings", "Behavioural Attributes"])
    }
    finally { setLoading(prev => ({ ...prev, notShortlistedOptions: false })) }
  }

  const fetchWithdrawnReasonOptions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_withdrawn_reason_options`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      const data = await response.json()
      const options = data?.message?.data || []
      setWithdrawnReasonOptions(options)
      console.log("✅ Fetched withdrawn reason options:", options)
    } catch (error: any) {
      console.error("❌ Error fetching withdrawn reason options:", error)
      setWithdrawnReasonOptions(["Another Job", "Changed Mind", "Hours/Work Schedule", "Job Duties", "Salary too low"])
    }
    finally { setLoading(prev => ({ ...prev, withdrawnReasonOptions: false })) }
  }

  const fetchApplicantRatingOptions = async () => {
    try {
      console.log("🔄 Fetching applicant rating options...")
      const response = await fetch(`${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_applicant_rating_options`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      const data = await response.json()
      const options = data?.message?.data || []
      setApplicantRatingOptions(options)
      console.log("✅ Fetched applicant rating options:", options)
    } catch (error: any) {
      console.error("❌ Error fetching applicant rating options:", error)
      const fallbackOptions = ["0)Unsatisfactory", "1)Marginal", "2)Satisfactory", "3)Superior"]
      setApplicantRatingOptions(fallbackOptions)
      console.log("⚠️ Using fallback applicant rating options:", fallbackOptions)
    }
    finally { setLoading(prev => ({ ...prev, applicantRatingOptions: false })) }
  }

  const fetchDepartmentOptions = async () => {
    try {
      console.log("🔄 Fetching department options...")
      const response = await fetch(`${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_department_options`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      const data = await response.json()
      const options = data?.message?.data || []
      setDepartmentOptions(options)
      console.log("✅ Fetched department options:", options)
    } catch (error: any) {
      console.error("❌ Error fetching department options:", error)
      const fallbackOptions = ["Accounts", "All Departments", "Customer Service", "Dispatch", "Human Resources", "Marketing", "Operations", "Production"]
      setDepartmentOptions(fallbackOptions)
      console.log("⚠️ Using fallback department options:", fallbackOptions)
    }
    finally { setLoading(prev => ({ ...prev, departmentOptions: false })) }
  }

  const fetchLocationOptions = async () => {
    try {
      console.log("🔄 Fetching location options...")
      const response = await fetch(`${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_location_options`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      const data = await response.json()
      const options = data?.message?.data || []
      setLocationOptions(options)
      console.log("✅ Fetched location options:", options)
    } catch (error: any) {
      console.error("❌ Error fetching location options:", error)
      const fallbackOptions = ["Borivali,Mumbai"]
      setLocationOptions(fallbackOptions)
      console.log("⚠️ Using fallback location options:", fallbackOptions)
    }
    finally { setLoading(prev => ({ ...prev, locationOptions: false })) }
  }

  const fetchDesignationOptions = async () => {
    try {
      console.log("🔄 Fetching designation options...")
      console.log("📍 API URL:", `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_designation_options`)
      const response = await fetch(`${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_designation_options`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      console.log("📡 Response status:", response.status, response.statusText)
      const data = await response.json()
      console.log("📦 Raw API response:", data)
      const options = data?.message?.data || []
      console.log("✅ Parsed designation options:", options, "Count:", options.length)
      if (options.length > 0) {
        setDesignationOptions(options)
        console.log("✅ Set designation options successfully:", options)
      } else {
        console.warn("⚠️ No designations returned from API, using fallback")
        const fallbackOptions = ["Software Developer", "Senior Developer", "Project Manager", "HR Manager"]
        setDesignationOptions(fallbackOptions)
      }
    } catch (error: any) {
      console.error("❌ Error fetching designation options:", error)
      console.error("❌ Error details:", error.message, error.stack)
      const fallbackOptions = ["Software Developer", "Senior Developer", "Project Manager", "HR Manager"]
      setDesignationOptions(fallbackOptions)
      console.log("⚠️ Using fallback designation options:", fallbackOptions)
    }
    finally { setLoading(prev => ({ ...prev, designationOptions: false })); console.log("✅ Designation loading complete") }
  }

  const checkExistingFeedback = async (interviewName: string) => {
    if (!interviewName) return
    setCheckingDuplicate(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/method/${API_MODULE_PATH}.check_existing_feedback?interview=${interviewName}`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      const data = await response.json()
      if (data?.message?.exists) { setExistingFeedback(data.message.feedback_name); console.log("⚠️ Feedback already exists:", data.message.feedback_name) }
      else { setExistingFeedback(null); console.log("✅ No existing feedback found") }
    } catch (error) { console.error("❌ Error checking existing feedback:", error); setExistingFeedback(null) }
    finally { setCheckingDuplicate(false) }
  }

  // const handleInterviewChange = async (interviewName: string) => {
  //   setFeedbackForm(prev => ({ ...prev, interview: interviewName }))
  //   await checkExistingFeedback(interviewName)
  //   const selectedInterview = interviews.find(i => i.name === interviewName)
  //   if (selectedInterview) {
  //     setFeedbackForm(prev => ({
  //       ...prev,
  //       interview: interviewName,
  //       job_applicant: selectedInterview.job_applicant || "",
  //       interview_round: selectedInterview.interview_round || "",
  //       candidate_name: selectedInterview.applicant_name || "",
  //       interview_date: selectedInterview.scheduled_on ? selectedInterview.scheduled_on.split(' ')[0] : "",
  //       // ADD THIS LINE - Auto-populate interviewer from interview
  //       interviewer: selectedInterview.interviewer || ""
  //     }))
  //     console.log("✅ Auto-populated fields from interview:", {
  //       job_applicant: selectedInterview.job_applicant,
  //       interview_round: selectedInterview.interview_round,
  //       candidate_name: selectedInterview.applicant_name,
  //       interview_date: selectedInterview.scheduled_on,
  //       interviewer: selectedInterview.interviewer
  //     })
  //     if (selectedInterview.job_applicant) {
  //       try {
  //         console.log("🔄 Fetching job applicant details for:", selectedInterview.job_applicant)
  //         const response = await fetch(
  //           `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_job_applicant_details?job_applicant=${selectedInterview.job_applicant}`,
  //           { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
  //         )
  //         const data = await response.json()
  //         console.log("📦 Full API Response:", data)
  //         if (data?.message?.data) {
  //           const applicantData = data.message.data
  //           console.log("✅ Applicant Data:", applicantData)
  //           setFeedbackForm(prev => ({
  //             ...prev,
  //             position_applied_for: applicantData.designation || "",
  //             department: applicantData.department || "",
  //             location: applicantData.location || ""
  //           }))
  //           console.log("✅ Auto-populated from Job Opening:", {
  //             position: applicantData.designation,
  //             department: applicantData.department,
  //             location: applicantData.location
  //           })
  //         } else { console.warn("⚠️ No data in response:", data) }
  //       } catch (error) { console.error("❌ Error fetching job applicant details:", error) }
  //     }
  //   }
  // }

  const handleInterviewChange = async (interviewName: string) => {
    console.log("🔄 Interview selected:", interviewName)
    await checkExistingFeedback(interviewName)
    const selectedInterview = interviews.find(i => i.name === interviewName)
    console.log("🔍 Selected interview object:", selectedInterview)
    if (selectedInterview) {
      setFeedbackForm(prev => ({
        ...prev,
        interview: interviewName,
        job_applicant: selectedInterview.job_applicant || "",
        interview_round: selectedInterview.interview_round || "",
        candidate_name: selectedInterview.applicant_name || "",
        interview_date: selectedInterview.scheduled_on ? selectedInterview.scheduled_on.split(' ')[0] : "",
        interviewer: (selectedInterview as any).interviewer || ""
      }))
      console.log("✅ Auto-populated fields from interview:", {
        job_applicant: selectedInterview.job_applicant,
        interview_round: selectedInterview.interview_round,
        candidate_name: selectedInterview.applicant_name,
        interview_date: selectedInterview.scheduled_on,
        interviewer: (selectedInterview as any).interviewer
      })
      if (selectedInterview.job_applicant) {
        try {
          console.log("🔄 Fetching job applicant details for:", selectedInterview.job_applicant)
          const response = await fetch(
            `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_job_applicant_details?job_applicant=${selectedInterview.job_applicant}`,
            { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
          )
          const data = await response.json()
          console.log("📦 Full API Response:", data)
          if (data?.message?.data) {
            const applicantData = data.message.data
            console.log("✅ Applicant Data:", applicantData)
            setFeedbackForm(prev => ({
              ...prev,
              position_applied_for: applicantData.designation || "",
              department: applicantData.department || "",
              location: applicantData.location || ""
            }))
            console.log("✅ Auto-populated from Job Opening:", { position: applicantData.designation, department: applicantData.department, location: applicantData.location })
          } else { console.warn("⚠️ No data in response:", data) }
        } catch (error) { console.error("❌ Error fetching job applicant details:", error) }
      }
    }
  }

  const addSkillRow = () => {
    const newSkill: SkillAssessment = { id: Date.now().toString(), skill: "", rating: 0 }
    setSkillAssessments([...skillAssessments, newSkill])
  }

  const removeSkillRow = (id: string) => {
    setSkillAssessments(skillAssessments.filter(skill => skill.id !== id))
    if (editingRowId === id) setEditingRowId(null)
  }

  const duplicateSkillRow = (id: string) => {
    const skillToDuplicate = skillAssessments.find(s => s.id === id)
    if (skillToDuplicate) {
      const newSkill = { ...skillToDuplicate, id: Date.now().toString() }
      const index = skillAssessments.findIndex(s => s.id === id)
      const newSkills = [...skillAssessments]
      newSkills.splice(index + 1, 0, newSkill)
      setSkillAssessments(newSkills)
    }
  }

  const insertRowBelow = (id: string) => {
    const index = skillAssessments.findIndex(s => s.id === id)
    const newSkill: SkillAssessment = { id: Date.now().toString(), skill: "", rating: 0 }
    const newSkills = [...skillAssessments]
    newSkills.splice(index + 1, 0, newSkill)
    setSkillAssessments(newSkills)
  }

  const insertRowAbove = (id: string) => {
    const index = skillAssessments.findIndex(s => s.id === id)
    const newSkill: SkillAssessment = { id: Date.now().toString(), skill: "", rating: 0 }
    const newSkills = [...skillAssessments]
    newSkills.splice(index, 0, newSkill)
    setSkillAssessments(newSkills)
  }

  const updateSkillAssessment = (id: string, field: keyof SkillAssessment, value: string | number) => {
    setSkillAssessments(skillAssessments.map(skill =>
      skill.id === id ? { ...skill, [field]: value } : skill
    ))
  }

  const handleSave = async () => {
    if (!feedbackForm.interview || !feedbackForm.interviewer || !feedbackForm.result) {
      alert("Please fill all required fields (Interview, Interviewer, Result)")
      return
    }
    if (!feedbackForm.applicant_rating) {
      alert("Please select an Overall Rating before submitting")
      return
    }
    if (existingFeedback) {
      alert(`Feedback already exists for this interview (${existingFeedback}). You cannot submit feedback again for the same interview.`)
      return
    }
    const validSkills = skillAssessments.filter(s => s.skill.trim() && s.rating > 0)
    const invalidSkills = skillAssessments.filter(s => s.skill.trim() && (!availableSkills.includes(s.skill.trim())))
    if (invalidSkills.length > 0) {
      alert(`Invalid skills found: ${invalidSkills.map(s => s.skill).join(", ")}\n\nPlease select skills from the dropdown only.`)
      return
    }
    setIsSaving(true)
    try {
      const formData = new URLSearchParams()
      const unratedSkills = skillAssessments.filter(s => s.skill.trim() && s.rating === 0)
      if (unratedSkills.length > 0) {
        alert(`Please provide ratings for all skills before submitting:\n${unratedSkills.map(s => `• ${s.skill}`).join("\n")}`)
        return
      }
      formData.append('interview', feedbackForm.interview)
      formData.append('interviewer', feedbackForm.interviewer)
      formData.append('result', feedbackForm.result)
      if (feedbackForm.feedback) formData.append('feedback', feedbackForm.feedback)
      if (feedbackForm.candidate_name) {
        formData.append('candidate_name', feedbackForm.candidate_name)
        console.log("📝 Sending candidate_name:", feedbackForm.candidate_name)
      }
      if (feedbackForm.interview_date) formData.append('interview_date', feedbackForm.interview_date)
      if (feedbackForm.position_applied_for) formData.append('position_applied_for', feedbackForm.position_applied_for)
      if (feedbackForm.department) formData.append('department', feedbackForm.department)
      if (feedbackForm.location) formData.append('location', feedbackForm.location)
      if (feedbackForm.new_position) formData.append('new_position', feedbackForm.new_position)
      if (feedbackForm.replacement_position) formData.append('replacement_position', feedbackForm.replacement_position)
      if (feedbackForm.applicant_rating) formData.append('applicant_rating', feedbackForm.applicant_rating)
      if (feedbackForm.final_score_recommendation.length > 0) formData.append('final_score_recommendation', JSON.stringify(feedbackForm.final_score_recommendation))
      if (feedbackForm.not_shortlisted_reason.length > 0) formData.append('not_shortlisted_reason', JSON.stringify(feedbackForm.not_shortlisted_reason))
      if (feedbackForm.withdrawn_reason.length > 0) formData.append('withdrawn_reason', JSON.stringify(feedbackForm.withdrawn_reason))
      if (feedbackForm.remarks) formData.append('remarks', feedbackForm.remarks)
      if (validSkills.length > 0) {
        const skillsToSend = validSkills.map(({ skill, rating }) => ({ skill: skill.trim(), rating: Number(rating) }))
        console.log("Skills being sent:", skillsToSend)
        formData.append('skill_assessments', JSON.stringify(skillsToSend))
      }
      console.log("📤 Complete form data being sent:", Object.fromEntries(formData))
      console.log("📤 Candidate name in form:", feedbackForm.candidate_name)
      const csrfToken = await getFrappeCSRF()
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.create_interview_feedback`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', "X-Frappe-CSRF-Token": csrfToken },
          body: formData
        }
      )
      const data = await response.json()
      console.log("✅ Full API Response:", data)
      if (response.ok && data.message) {
        const feedbackName = data.message.name || data.message.doc?.name
        console.log("✅ Created feedback with ID:", feedbackName)
        alert(`Interview Feedback ${feedbackName || ''} created successfully!`)
        console.log("✅ Redirecting to /feedback page...")
        router.push('/feedback')
      } else {
        const errorMessage = data.message || data.exception || "Failed to create interview feedback"
        console.error("❌ API Error:", errorMessage)
        alert(`Error: ${errorMessage}`)
      }
    } catch (error: any) {
      console.error("❌ Error creating interview feedback:", error)
      const errorMsg = error.message || "Failed to create interview feedback"
      alert(`Error: ${errorMsg}`)
    } finally {
      setIsSaving(false)
    }
  }
  const isFormDisabled = existingFeedback !== null;
  const StarRating = ({ rating, onRate, editable = true }: { rating: number; onRate: (rating: number) => void; editable?: boolean }) => (
    <div className="cf-stars">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className={`cf-star ${star <= rating ? "filled" : "empty"}`}
          onClick={() => editable && onRate(star)}
          disabled={!editable}
        >
          <Star />
        </button>
      ))}
    </div>
  )

  const RowActions = ({ skillId }: { skillId: string }) => (
    <div className="cf-row-actions">
      <button className="cf-btn-icon" onClick={() => removeSkillRow(skillId)}>
        <Trash2 size={13} />
      </button>
      <button className="cf-btn-ghost" onClick={() => insertRowBelow(skillId)}>Insert Below</button>
      <button className="cf-btn-ghost" onClick={() => insertRowAbove(skillId)}>Insert Above</button>
      <button className="cf-btn-icon" onClick={() => duplicateSkillRow(skillId)}>
        <Copy size={13} />
      </button>
    </div>
  )

  const ColumnConfigModal = () => {
    if (!showColumnConfig) return null
    return (
      <div className="cf-modal-bg" onClick={() => setShowColumnConfig(false)}>
        <div className="cf-modal" onClick={e => e.stopPropagation()}>
          <div className="cf-modal-head">
            <span className="cf-modal-title">Configure Columns</span>
            <button className="cf-modal-close" onClick={() => setShowColumnConfig(false)}>✕</button>
          </div>
          <div className="cf-modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 1fr 36px', gap: 10, paddingBottom: 10, borderBottom: '1px solid var(--border-s)', marginBottom: 10 }}>
              <div /><span className="cf-label">Fieldname</span><span className="cf-label">Column Width</span><div />
            </div>
            {columnConfig.map((col, index) => (
              <div key={`column-${index}-${col.fieldname}`} className="cf-col-row">
                <div className="cf-col-dots"><div className="cf-col-dot" /><div className="cf-col-dot" /></div>
                <input className="cf-input" value={col.fieldname} onChange={e => { const nc = [...columnConfig]; nc[index].fieldname = e.target.value; setColumnConfig(nc) }} />
                <input type="number" className="cf-input" value={col.width} onChange={e => { const nc = [...columnConfig]; nc[index].width = parseInt(e.target.value) || 2; setColumnConfig(nc) }} />
                <button className="cf-btn-del" onClick={() => setColumnConfig(columnConfig.filter((_, i) => i !== index))}><Trash2 size={13} /></button>
              </div>
            ))}
            <button className="cf-btn-link" onClick={() => setColumnConfig([...columnConfig, { fieldname: "", width: 2 }])}>
              + Add / Remove Columns
            </button>
          </div>
          <div className="cf-modal-foot">
            <button className="cf-btn-cancel" onClick={() => setColumnConfig([{ fieldname: "Skill", width: 2 }, { fieldname: "Rating", width: 2 }])}>
              Reset to default
            </button>
            <button className="cf-btn-save" onClick={() => setShowColumnConfig(false)}>Update</button>
          </div>
        </div>
      </div>
    )
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
      <div className="cf">
        <div className="cf-wrap">
          <div className={`cf-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

          {/* SIDEBAR */}
          <aside className={`cf-sb${sidebarOpen ? "" : " collapsed"}`}>
            <div className="cf-sb-brand">
              <div className="cf-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
              <div><div className="cf-sb-name">Job Management</div><div className="cf-sb-sub">HR Platform</div></div>
              <button className="cf-sb-close" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
            </div>
            <nav className="cf-nav">
              <a href="/create-job" className="cf-nav-cta"><Plus size={14} /> New Job Opening</a>
              <div className="cf-nav-lbl">General</div>
              <Link href="/home" className="cf-nav-link">
                <Home size={15} /> Home
              </Link>
              <div className="cf-nav-lbl">Pipeline</div>
              {sidebarPipeline.map(s => (
                <a key={s.href} href={s.href} className="cf-nav-link">{s.icon} {s.title}</a>
              ))}
              <div className="cf-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
              {sidebarClosing.map(s => (
                <a key={s.href} href={s.href} className={`cf-nav-link${s.href === "/feedback" ? " active" : ""}`}>
                  {s.icon} {s.title}
                </a>
              ))}
            </nav>
            <div className="cf-sb-foot">
              <button className="cf-logout"><LogOut size={15} /> Sign out</button>
            </div>
          </aside>

          {/* MAIN */}
          <div className={`cf-main${sidebarOpen ? "" : " sb-closed"}`}>
            <header className="cf-header">
              <button className="cf-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
              <div className="cf-hdr-sep" />
              <button className="cf-btn-back" onClick={() => router.push("/home")}><ArrowLeft size={13} /> Back</button>
              <div className="cf-hdr-sep" />
              {/* <div className="cf-crumb">
                <Home size={13} /> Home <ChevronRight size={13} />
                <a href="/feedback" style={{ color: 'var(--t3)', textDecoration: 'none' }}>Candidate Feedback</a>
                <ChevronRight size={13} /> <strong>New Feedback</strong>
              </div> */}
              <div className="cf-crumb">
                <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'inherit', textDecoration: 'none' }}>
                  <Home size={13} /> Home
                </Link>
                <ChevronRight size={13} />
                <a href="/feedback" style={{ color: 'var(--t3)', textDecoration: 'none' }}>Candidate Feedback</a>
                <ChevronRight size={13} />
                <strong>New Feedback</strong>
              </div>
            </header>

            {/* CENTRED CONTENT */}
            <div className="cf-page-outer">
              <div className="cf-page">

                <div>
                  <h1 className="cf-page-title">New Candidate Feedback</h1>
                  <p className="cf-page-sub">Provide detailed feedback for candidate interviews</p>
                </div>

                {/* ── INTERVIEW DETAILS CARD ── */}
                <div className="cf-card">
                  <div className="cf-card-head">
                    <div className="cf-card-title"><User size={15} /> Interview Details</div>
                  </div>
                  <div className="cf-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div className="cf-form-grid">
                      <div className="cf-form-field">
                        <label className="cf-label"><Calendar size={12} /> Interview <span className="cf-req">*</span></label>
                        <div className="cf-select-wrap">
                          <select className="cf-select" value={feedbackForm.interview} onChange={e => handleInterviewChange(e.target.value)} disabled={loading.interviews || !!interviewNameFromUrl}>
                            <option value="">{loading.interviews ? "Loading..." : interviews.length === 0 ? "No interviews found" : "Select interview"}</option>
                            {interviews.map(i => <option key={i.name} value={i.name}>{i.name} - {i.applicant_name || i.job_applicant}</option>)}
                          </select>
                          <ChevronRight size={13} className="cf-select-arrow" />
                        </div>
                      </div>
                      <div className="cf-form-field">
                        <label className="cf-label"><User size={12} /> Interviewer <span className="cf-req">*</span></label>
                        <div className="cf-select-wrap">
                          <select className="cf-select" value={feedbackForm.interviewer} onChange={e => setFeedbackForm({ ...feedbackForm, interviewer: e.target.value })} disabled={loading.interviewers}>
                            <option value="">{loading.interviewers ? "Loading..." : interviewers.length === 0 ? "No interviewers found" : "Select interviewer"}</option>
                            {interviewers.map(i => <option key={i.name} value={i.name}>{i.full_name} ({i.email})</option>)}
                          </select>
                          <ChevronRight size={13} className="cf-select-arrow" />
                        </div>
                      </div>
                    </div>

                    {feedbackForm.job_applicant && (
                      <div className="cf-form-grid">
                        <div className="cf-form-field">
                          <label className="cf-label"><Briefcase size={12} /> Job Applicant</label>
                          <input className="cf-input readonly" value={feedbackForm.job_applicant} disabled />
                        </div>
                        <div className="cf-form-field">
                          <label className="cf-label"><FileText size={12} /> Interview Round</label>
                          <input className="cf-input readonly" value={feedbackForm.interview_round} disabled />
                        </div>
                      </div>
                    )}

                    <div className="cf-form-grid">
                      <div className="cf-form-field">
                        <label className="cf-label"><User size={12} /> Candidate Name</label>
                        <input className="cf-input readonly" value={feedbackForm.candidate_name} disabled onChange={e => setFeedbackForm({ ...feedbackForm, candidate_name: e.target.value })} placeholder="Enter candidate name" />
                      </div>
                      <div className="cf-form-field">
                        <label className="cf-label"><Calendar size={12} /> Interview Date</label>
                        <input type="date" className="cf-input readonly" value={feedbackForm.interview_date} disabled onChange={e => setFeedbackForm({ ...feedbackForm, interview_date: e.target.value })} />
                      </div>
                    </div>

                    <div className="cf-form-grid">
                      <div className="cf-form-field">
                        <label className="cf-label"><Briefcase size={12} /> Position Applied For</label>
                        <input className="cf-input readonly" value={feedbackForm.position_applied_for} disabled placeholder="Auto-populated from Job Opening" />
                      </div>
                      <div className="cf-form-field">
                        <label className="cf-label"><Building2 size={12} /> Department</label>
                        <input className="cf-input readonly" value={feedbackForm.department} disabled placeholder="Auto-populated from Job Opening" />
                      </div>
                    </div>

                    <div className="cf-form-grid">
                      <div className="cf-form-field">
                        <label className="cf-label"><MapPin size={12} /> Location</label>
                        <input className="cf-input readonly" value={feedbackForm.location} disabled placeholder="Auto-populated from Job Opening" />
                      </div>
                      <div className="cf-form-field">
                        <label className="cf-label"><Briefcase size={12} /> New Position</label>
                        <input className="cf-input" value={feedbackForm.new_position} onChange={e => setFeedbackForm({ ...feedbackForm, new_position: e.target.value })} placeholder="Enter new position"
                          disabled={isFormDisabled} />
                      </div>
                    </div>

                    <div className="cf-form-field">
                      <label className="cf-label"><Briefcase size={12} /> Replacement Position</label>
                      <input className="cf-input" value={feedbackForm.replacement_position} onChange={e => setFeedbackForm({ ...feedbackForm, replacement_position: e.target.value })} placeholder="Enter replacement position"
                        disabled={isFormDisabled} />
                    </div>

                    <div className="cf-form-field">
                      <label className="cf-label"><CheckCircle2 size={12} /> Result <span className="cf-req">*</span></label>
                      <div className="cf-select-wrap">
                        <select className="cf-select" value={feedbackForm.result} onChange={e => setFeedbackForm({ ...feedbackForm, result: e.target.value })} disabled={loading.resultOptions || isFormDisabled}>
                          <option value="">{loading.resultOptions ? "Loading..." : resultOptions.length === 0 ? "No options available" : "Select Result"}</option>
                          {resultOptions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronRight size={13} className="cf-select-arrow" />
                      </div>
                    </div>

                    {/* ADD THIS NEW CODE HERE - Warning for existing feedback */}
                    {existingFeedback && (
                      <div className="cf-alert-warn">
                        <AlertCircle size={16} />
                        <div>
                          <div className="cf-alert-title">Feedback Already Exists</div>
                          <div className="cf-alert-sub">Feedback has already been submitted for this interview ({existingFeedback}). You cannot create duplicate feedback for the same interview.</div>
                        </div>
                      </div>
                    )}

                    {checkingDuplicate && (
                      <div className="cf-alert-info">
                        <span className="cf-spinner-sm" />
                        <span className="cf-alert-txt">Checking for existing feedback...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── SKILL ASSESSMENT CARD ── */}
                <div className="cf-card">
                  <div className="cf-card-head">
                    <div className="cf-card-title">
                      <Star size={15} /> Skill Assessment
                    </div>
                    {/* <button className="cf-btn-icon" onClick={() => setShowColumnConfig(true)}><Settings size={14} /></button> */}
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="cf-table">
                      <thead>
                        <tr>
                          <th style={{ width: 48 }}><input type="checkbox" className="cf-check" /></th>
                          <th style={{ width: 56 }}>No.</th>
                          <th>Skill <span style={{ color: 'var(--red)' }}>*</span></th>
                          <th>Rating <span style={{ color: 'var(--red)' }}>*</span></th>
                          <th style={{ width: 12 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {skillAssessments.map((skill, index) => (
                          <React.Fragment key={skill.id}>
                            <tr>
                              <td><input type="checkbox" className="cf-check" /></td>
                              <td style={{ color: 'var(--t3)', fontWeight: 600 }}>{index + 1}</td>
                              <td>
                                <input className="cf-input readonly" value={skill.skill} disabled style={{ maxWidth: '100%', minWidth: 160 }} />
                              </td>
                              <td>
                                <StarRating rating={skill.rating} onRate={r => updateSkillAssessment(skill.id, 'rating', r)}
                                  editable={!isFormDisabled} />
                              </td>
                              {/* <td>
                                <button
                                  className="cf-btn-icon"
                                  onClick={() => setEditingRowId(editingRowId === skill.id ? null : skill.id)}
                                >
                                  ✏️
                                </button>
                              </td> */}
                            </tr>
                            {/* {editingRowId === skill.id && (
                              <tr>
                                <td colSpan={5} style={{ background: 'var(--accent-lt)', borderBottom: '1px solid var(--border-s)' }}>
                                  <div style={{ padding: 16 }}>
                                    <div style={{ fontWeight: 600, marginBottom: 12 }}>Editing Row #{index + 1}</div>
                                    <div style={{ marginBottom: 14 }}>
                                      <label className="cf-label" style={{ marginBottom: 6 }}>Rating *</label>
                                      <StarRating rating={skill.rating} onRate={r => updateSkillAssessment(skill.id, 'rating', r)} />
                                    </div>
                                    <RowActions skillId={skill.id} />
                                  </div>
                                </td>
                              </tr>
                            )} */}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── APPLICANT RATING CARD ── */}
                <div className="cf-card">
                  <div className="cf-card-head">
                    <div className="cf-card-title"><Star size={15} /> Applicant Rating</div>
                  </div>
                  <div className="cf-card-body">
                    <div className="cf-form-field">
                      {/* <label className="cf-label"><Star size={12} /> Overall Rating</label> */}
                      <label className="cf-label"><Star size={12} /> Overall Rating <span className="cf-req">*</span></label>
                      <div className="cf-select-wrap">
                        <select className="cf-select" value={feedbackForm.applicant_rating} onChange={e => setFeedbackForm({ ...feedbackForm, applicant_rating: e.target.value })} disabled={loading.applicantRatingOptions || isFormDisabled}>
                          <option value="">{loading.applicantRatingOptions ? "Loading ratings..." : applicantRatingOptions.length === 0 ? "No ratings available" : "Select rating"}</option>
                          {applicantRatingOptions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronRight size={13} className="cf-select-arrow" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── FINAL SCORE CARD ── */}
                <div className="cf-card">
                  <div className="cf-card-head">
                    <div className="cf-card-title"><CheckCircle2 size={15} /> Final Score &amp; Recommendation</div>
                  </div>
                  <div className="cf-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="cf-score-box">
                      <span className="cf-score-label">Total Score:</span>
                      <span className="cf-score-value">{calculateTotalScore()} / 35</span>
                    </div>
                    {/* <div className="cf-check-grid">
                      {["Average (10 to 13)", "Good (14 to 18)", "Excellent (19 to 21)"].map(option => (
                        <label key={option} className="cf-check-row">
                          <input
                            type="checkbox"
                            id={`final-score-${option}`}
                            className="cf-check"
                            checked={feedbackForm.final_score_recommendation.includes(option)}
                            disabled
                          />
                          <span className="cf-check-label">{option}</span>
                        </label>
                      ))}
                      <label className="cf-check-row">
                        <input
                          type="checkbox"
                          id="final-score-To be Offered"
                          className="cf-check"
                          checked={feedbackForm.final_score_recommendation.includes("To be Offered")}
                          onChange={e => {
                            if (e.target.checked) {
                              setFeedbackForm({ ...feedbackForm, final_score_recommendation: [...feedbackForm.final_score_recommendation, "To be Offered"] })
                            } else {
                              setFeedbackForm({ ...feedbackForm, final_score_recommendation: feedbackForm.final_score_recommendation.filter(item => item !== "To be Offered") })
                            }
                          }}
                          disabled={isFormDisabled}
                        />
                        <span className="cf-check-label">To be Offered</span>
                      </label>
                      <label className="cf-check-row">
                        <input
                          type="checkbox"
                          id="final-score-Not Shortlisted"
                          className="cf-check"
                          checked={feedbackForm.final_score_recommendation.includes("Not Shortlisted")}
                          onChange={e => {
                            if (e.target.checked) {
                              setFeedbackForm({ ...feedbackForm, final_score_recommendation: [...feedbackForm.final_score_recommendation, "Not Shortlisted"] })
                            } else {
                              setFeedbackForm({ ...feedbackForm, final_score_recommendation: feedbackForm.final_score_recommendation.filter(item => item !== "Not Shortlisted") })
                            }
                          }}
                        />
                        <span className="cf-check-label">Not Shortlisted</span>
                      </label>
                      <label className="cf-check-row">
                        <input
                          type="checkbox"
                          id="final-score-Candidature Withdrawn"
                          className="cf-check"
                          checked={feedbackForm.final_score_recommendation.includes("Candidature Withdrawn")}
                          onChange={e => {
                            if (e.target.checked) {
                              setFeedbackForm({ ...feedbackForm, final_score_recommendation: [...feedbackForm.final_score_recommendation, "Candidature Withdrawn"] })
                            } else {
                              setFeedbackForm({ ...feedbackForm, final_score_recommendation: feedbackForm.final_score_recommendation.filter(item => item !== "Candidature Withdrawn") })
                            }
                          }}
                        />
                        <span className="cf-check-label">Candidature Withdrawn</span>
                      </label>
                    </div> */}

                    {/* <div className="cf-check-grid">
                      {["Average (10 to 13)", "Good (14 to 18)", "Excellent (19 to 21)", "To be Offered", "Not Shortlisted", "Candidature Withdrawn"].map(option => (
                        <label key={option} className="cf-check-row">
                          <input
                            type="checkbox"
                            className="cf-check"
                            checked={feedbackForm.final_score_recommendation.includes(option)}
                            disabled={isFormDisabled}
                            onChange={e => {
                              setFeedbackForm(prev => ({
                                ...prev,
                                // If checking — replace all with just this one
                                // If unchecking — clear all
                                final_score_recommendation: e.target.checked ? [option] : []
                              }))
                            }}
                          />
                          <span className="cf-check-label">{option}</span>
                        </label>
                      ))}
                    </div> */}

                    <div className="cf-check-grid">
                      {["Average (10 to 13)", "Good (14 to 18)", "Excellent (19 to 21)", "To be Offered", "Not Shortlisted", "Candidature Withdrawn"].map(option => (
                        <label key={option} className="cf-check-row">
                          <input
                            type="checkbox"
                            className="cf-check"
                            checked={feedbackForm.final_score_recommendation.includes(option)}
                            disabled={isFormDisabled || ["Average (10 to 13)", "Good (14 to 18)", "Excellent (19 to 21)"].includes(option)}
                            // onChange={e => {
                            //   if (!["To be Offered", "Not Shortlisted", "Candidature Withdrawn"].includes(option)) return
                            //   setFeedbackForm(prev => ({
                            //     ...prev,
                            //     final_score_recommendation: e.target.checked
                            //       ? [...prev.final_score_recommendation, option]
                            //       : prev.final_score_recommendation.filter(i => i !== option)
                            //   }))
                            // }}
                            onChange={e => {
                              if (!["To be Offered", "Not Shortlisted", "Candidature Withdrawn"].includes(option)) return
                              const scoreOptions = ["Average (10 to 13)", "Good (14 to 18)", "Excellent (19 to 21)"]
                              setFeedbackForm(prev => ({
                                ...prev,
                                final_score_recommendation: e.target.checked
                                  ? [
                                    // Keep only the auto-checked score options, replace any previous recommendation
                                    ...prev.final_score_recommendation.filter(i => scoreOptions.includes(i)),
                                    option
                                  ]
                                  : prev.final_score_recommendation.filter(i => i !== option)
                              }))
                            }}
                          />
                          <span className="cf-check-label">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── NOT SHORTLISTED REASON ── */}
                {showNotShortlistedSection && (
                  <div className="cf-card">
                    <div className="cf-card-head">
                      <div className="cf-card-title orange"><AlertCircle size={15} /> Not Shortlisted Reason</div>
                    </div>
                    <div className="cf-card-body">
                      <div className="cf-check-grid">
                        {notShortlistedOptions.map(option => (
                          <label key={option} className="cf-check-row orange">
                            <input
                              type="checkbox"
                              id={`not-shortlisted-${option}`}
                              className="cf-check"
                              checked={feedbackForm.not_shortlisted_reason.includes(option)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setFeedbackForm({ ...feedbackForm, not_shortlisted_reason: [...feedbackForm.not_shortlisted_reason, option] })
                                } else {
                                  setFeedbackForm({ ...feedbackForm, not_shortlisted_reason: feedbackForm.not_shortlisted_reason.filter(item => item !== option) })
                                }
                              }}
                            />
                            <span className="cf-check-label">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── WITHDRAWN REASON ── */}
                {showWithdrawnSection && (
                  <div className="cf-card">
                    <div className="cf-card-head">
                      <div className="cf-card-title red"><AlertCircle size={15} /> Withdrawn Reason</div>
                    </div>
                    <div className="cf-card-body">
                      <div className="cf-check-grid">
                        {withdrawnReasonOptions.map(option => (
                          <label key={option} className="cf-check-row red-h">
                            <input
                              type="checkbox"
                              id={`withdrawn-${option}`}
                              className="cf-check"
                              style={{ accentColor: 'var(--red)' }}
                              checked={feedbackForm.withdrawn_reason.includes(option)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setFeedbackForm({ ...feedbackForm, withdrawn_reason: [...feedbackForm.withdrawn_reason, option] })
                                } else {
                                  setFeedbackForm({ ...feedbackForm, withdrawn_reason: feedbackForm.withdrawn_reason.filter(item => item !== option) })
                                }
                              }}
                            />
                            <span className="cf-check-label">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── REMARKS CARD ── */}
                <div className="cf-card">
                  <div className="cf-card-head">
                    <div className="cf-card-title"><FileText size={15} /> Remarks</div>
                  </div>
                  <div className="cf-card-body">
                    <div className="cf-form-field">
                      <label className="cf-label"><FileText size={12} /> Description</label>
                      <textarea
                        className="cf-textarea"
                        value={feedbackForm.remarks}
                        onChange={e => setFeedbackForm({ ...feedbackForm, remarks: e.target.value })}
                        placeholder="Enter remarks..."
                        rows={6}
                        disabled={isFormDisabled}
                      />
                    </div>
                  </div>
                </div>

                {/* ── DETAILED FEEDBACK CARD ── */}
                <div className="cf-card">
                  <div className="cf-card-head">
                    <div className="cf-card-title"><MessageSquare size={15} /> Detailed Feedback</div>
                  </div>
                  <div className="cf-card-body">
                    <textarea
                      className="cf-textarea"
                      value={feedbackForm.feedback}
                      onChange={e => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                      placeholder="Enter detailed feedback about the candidate's performance..."
                      rows={6}
                      disabled={isFormDisabled}
                    />
                  </div>
                </div>

                {/* ── ACTIONS ── */}
                <div className="cf-actions">
                  <button className="cf-btn-cancel" onClick={() => router.push('/feedback')} disabled={isSaving}>
                    Cancel
                  </button>
                  <button
                    className={`cf-btn-save${existingFeedback ? " exists" : ""}`}
                    onClick={handleSave}
                    disabled={isSaving || existingFeedback !== null}
                  >
                    {isSaving ? (
                      <><span className="cf-spinner" /> Saving...</>
                    ) : existingFeedback ? (
                      <><AlertCircle size={15} /> Feedback Already Exists</>
                    ) : (
                      <><CheckCircle2 size={15} /> Save Feedback</>
                    )}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

        <ColumnConfigModal />
      </div>
    </>
  )
}

export default function CandidateFeedbackPage() {
  return (
    <Suspense fallback={
      <div className="cf">
        <style>{css}</style>
        <div className="cf-loading">
          <div className="cf-loading-spinner" />
          <div className="cf-loading-txt">Loading...</div>
        </div>
      </div>
    }>
      <CandidateFeedbackForm />
    </Suspense>
  )
}
