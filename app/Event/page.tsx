// "use client"
// import { useState, useEffect, Suspense, useRef } from "react"
// import {
//   ArrowLeft, Calendar, Clock, MapPin, Video, FileText, Users,
//   CheckCircle2, AlertCircle, Menu, X, Home, LogOut, Upload,
//   Briefcase, MessageSquare, Zap, UserCheck, ChevronRight, Plus,
// } from "lucide-react"
// import Link from "next/link"
// import { useRouter, useSearchParams } from "next/navigation"
// import { API_BASE_URL } from '@/lib/api-config'
// import { getFrappeCSRF } from "@/lib/csrf"

// const css = `
//   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   .ev {
//     --sb-w:      265px;
//     --sb:        #1e1e2d;
//     --sb-hover:  #2b2b40;
//     --sb-bdr:    rgba(255,255,255,.07);
//     --sb-txt:    #9899ac;
//     --sb-lbl:    #474761;
//     --accent:    #009ef7;
//     --accent-h:  #007ec4;
//     --accent-lt: #e0f4ff;
//     --accent-md: rgba(0,158,247,.15);
//     --accent-bdr:rgba(0,158,247,.28);
//     --bg:        #f0f8fe;
//     --card:      #ffffff;
//     --border:    #cce8f8;
//     --border-s:  #ddf0fb;
//     --t1:        #0d1b2a;
//     --t2:        #2d5a78;
//     --t3:        #6a9cb8;
//     --red:       #dc2626;
//     --yellow:    #d97706;
//     --yellow-lt: #fef9c3;
//     --yellow-bdr:#fde68a;
//     font-family: 'Inter', system-ui, sans-serif;
//     font-size: 13.5px;
//     -webkit-font-smoothing: antialiased;
//   }
//   .ev-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

//   /* SIDEBAR */
//   .ev-sb { width: var(--sb-w); background: var(--sb); min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 100; display: flex; flex-direction: column; transition: transform .25s cubic-bezier(.4,0,.2,1); }
//   .ev-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }
//   .ev-sb-brand { height: 64px; display: flex; align-items: center; gap: 12px; padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0; }
//   .ev-sb-icon { width: 38px; height: 38px; border-radius: 10px; background: var(--accent-md); border: 1px solid var(--accent-bdr); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
//   .ev-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
//   .ev-sb-name { font-size: 14px; font-weight: 700; color: #fff; }
//   .ev-sb-sub  { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
//   .ev-sb-close { margin-left: auto; width: 28px; height: 28px; border-radius: 7px; background: none; border: none; cursor: pointer; color: var(--sb-lbl); display: flex; align-items: center; justify-content: center; transition: all .14s; }
//   .ev-sb-close:hover { background: var(--sb-hover); color: #fff; }
//   .ev-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
//   .ev-nav-cta { display: flex; align-items: center; gap: 9px; padding: 11px 14px; border-radius: 9px; background: var(--accent-md); border: 1px solid var(--accent-bdr); color: var(--accent); font-size: 13px; font-weight: 600; text-decoration: none; transition: background .15s; margin-bottom: 22px; }
//   .ev-nav-cta:hover { background: rgba(0,158,247,.24); }
//   .ev-nav-lbl { font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px; }
//   .ev-nav-link { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: var(--sb-txt); text-decoration: none; transition: all .14s; }
//   .ev-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; }
//   .ev-nav-link:hover, .ev-nav-link.active { background: var(--sb-hover); color: #fff; }
//   .ev-nav-link:hover svg, .ev-nav-link.active svg { opacity: 1; }
//   .ev-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
//   .ev-logout { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 12px; border-radius: 8px; background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: var(--sb-lbl); transition: all .14s; }
//   .ev-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }
//   .ev-overlay { display: none; position: fixed; inset: 0; z-index: 99; background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer; }
//   @media (max-width: 768px) { .ev-overlay.show { display: block; } }

//   /* MAIN */
//   .ev-main { margin-left: var(--sb-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; transition: margin-left .25s cubic-bezier(.4,0,.2,1); }
//   .ev-main.sb-closed { margin-left: 0; }

//   /* HEADER */
//   .ev-header { height: 60px; background: #fff; border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 28px; gap: 12px; position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 0 rgba(0,158,247,.08); }
//   .ev-toggle { width: 34px; height: 34px; border-radius: 8px; background: none; border: 1px solid var(--border); cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--t2); transition: all .14s; }
//   .ev-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
//   .ev-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
//   .ev-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
//   .ev-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }
//   .ev-hdr-right { margin-left: auto; }
//   .ev-btn-out { display: inline-flex; align-items: center; gap: 7px; padding: 7px 14px; border-radius: 8px; background: transparent; color: var(--t2); font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; border: 1px solid var(--border); cursor: pointer; transition: all .14s; }
//   .ev-btn-out:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

//   /* PAGE — full-width centred wrapper */
//   .ev-page-outer { flex: 1; display: flex; justify-content: center; padding: 28px 32px; }
//   .ev-page { width: 100%; max-width: 860px; display: flex; flex-direction: column; gap: 20px; }
//   .ev-page-title { font-size: 21px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; }
//   .ev-page-sub   { font-size: 13px; color: var(--t3); margin-top: 4px; }

//   /* CARDS */
//   .ev-card { background: var(--card); border: 1px solid var(--border-s); border-radius: 12px; box-shadow: 0 1px 4px rgba(0,158,247,.06); }
//   .ev-card-head { padding: 14px 20px; border-bottom: 1px solid var(--border-s); display: flex; align-items: center; justify-content: space-between; flex-wrap: nowrap; gap: 10px; background: linear-gradient(to right, #f8fcff, var(--accent-lt)); }
//   .ev-card-title { font-size: 13.5px; font-weight: 700; color: var(--t1); display: flex; align-items: center; gap: 8px; }
//   .ev-card-title svg { color: var(--accent); }
//   .ev-card-body { padding: 22px; }

//   .ev-applicant-banner { background: linear-gradient(135deg, #0f3460, #16213e); border-radius: 12px; padding: 18px 22px; display: flex; align-items: center; gap: 16px; }
//   .ev-applicant-avatar { width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,.18); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
//   .ev-applicant-label { font-size: 11.5px; color: rgba(255,255,255,.55); margin-bottom: 3px; }
//   .ev-applicant-name  { font-size: 16px; font-weight: 700; color: #fff; }

//   .ev-warning { background: var(--yellow-lt); border: 1px solid var(--yellow-bdr); border-radius: 10px; padding: 14px 16px; display: flex; align-items: center; gap: 10px; }
//   .ev-warning svg { color: var(--yellow); flex-shrink: 0; }
//   .ev-warning-txt { font-size: 13px; font-weight: 500; color: #92400e; }

//   /* FORM */
//   .ev-form-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
//   .ev-form-grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; }
//   .ev-form-field { display: flex; flex-direction: column; gap: 6px; }
//   .ev-label { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--t3); display: flex; align-items: center; gap: 5px; }
//   .ev-label svg { width: 12px; height: 12px; }
//   .ev-req { color: var(--red); margin-left: 1px; }
//   .ev-input { width: 100%; height: 44px; padding: 0 13px; border: 1px solid var(--border); border-radius: 9px; background: var(--bg); font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--t1); outline: none; transition: all .15s; }
//   .ev-input::placeholder { color: var(--t3); }
//   .ev-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
//   .ev-input:disabled { background: #f3f7fa; color: var(--t3); cursor: not-allowed; }
//   .ev-select-wrap { position: relative; }
//   .ev-select-arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%) rotate(90deg); color: var(--t3); pointer-events: none; width: 13px; height: 13px; }
//   .ev-select { width: 100%; height: 44px; padding: 0 36px 0 13px; border: 1px solid var(--border); border-radius: 9px; background: var(--bg); font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--t2); appearance: none; outline: none; cursor: pointer; transition: all .15s; }
//   .ev-select:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
//   .ev-select:disabled { background: #f3f7fa; color: var(--t3); cursor: not-allowed; }

//   /* TABLE */
//   .ev-table-scroll { max-height: 380px; overflow-y: auto; }
//   .ev-table-scroll::-webkit-scrollbar { width: 4px; }
//   .ev-table-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
//   .ev-table { width: 100%; border-collapse: collapse; }
//   .ev-table thead { background: linear-gradient(to right, var(--accent-lt), #f0f8fe); position: sticky; top: 0; z-index: 2; }
//   .ev-table th { padding: 12px 16px; text-align: left; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--t2); border-bottom: 1px solid var(--border-s); }
//   .ev-table tbody tr { border-bottom: 1px solid var(--border-s); transition: background .12s; cursor: pointer; }
//   .ev-table tbody tr:last-child { border-bottom: none; }
//   .ev-table tbody tr:hover { background: var(--accent-lt); }
//   .ev-table td { padding: 12px 16px; font-size: 13px; color: var(--t2); }
//   .ev-interviewer-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), #7c3aed); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
//   .ev-interviewer-name  { font-size: 13px; font-weight: 600; color: var(--t1); }
//   .ev-interviewer-email { font-size: 11.5px; color: var(--t3); margin-top: 1px; }
//   .ev-table-empty { padding: 40px 20px; text-align: center; }
//   .ev-table-empty-icon { width: 52px; height: 52px; border-radius: 50%; background: var(--border-s); color: var(--t3); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; }
//   .ev-table-empty-txt { font-size: 13px; color: var(--t3); font-weight: 500; }
//   .ev-selected-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; background: var(--accent-lt); color: var(--accent); border: 1px solid var(--border); }
//   .ev-check { width: 15px; height: 15px; accent-color: var(--accent); cursor: pointer; }

//   /* ACTIONS */
//   .ev-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
//   .ev-btn-cancel { display: inline-flex; align-items: center; gap: 7px; padding: 10px 22px; border-radius: 9px; background: transparent; color: var(--t2); font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 600; border: 1px solid var(--border); cursor: pointer; transition: all .14s; }
//   .ev-btn-cancel:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
//   .ev-btn-save { display: inline-flex; align-items: center; gap: 7px; padding: 10px 28px; border-radius: 9px; background: var(--accent); color: #fff; font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 700; border: none; cursor: pointer; transition: background .15s; }
//   .ev-btn-save:hover:not(:disabled) { background: var(--accent-h); }
//   .ev-btn-save:disabled { opacity: .55; cursor: not-allowed; }
//   .ev-spinner { width: 15px; height: 15px; border-radius: 50%; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; animation: ev-spin .6s linear infinite; flex-shrink: 0; }
//   @keyframes ev-spin { to { transform: rotate(360deg); } }
//   .ev-loading { min-height: 100vh; background: var(--bg); display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 14px; }
//   .ev-loading-spinner { width: 44px; height: 44px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent); animation: ev-spin .7s linear infinite; }
//   .ev-loading-txt { font-size: 14px; color: var(--t3); font-weight: 500; }

//   @media (max-width: 768px) {
//     .ev-sb { transform: translateX(calc(-1 * var(--sb-w))); }
//     .ev-sb.open { transform: translateX(0); }
//     .ev-main { margin-left: 0 !important; }
//     .ev-page-outer { padding: 16px; }
//     .ev-header { padding: 0 16px; }
//     .ev-form-grid, .ev-form-grid3 { grid-template-columns: 1fr; }
//   }
// `

// interface Interviewer { name: string; full_name: string; email: string }
// interface InterviewRound { name: string; round_name: string }
// interface Location { name: string }
// interface InterviewLink { name: string; link: string }

// function EventPageContent() {
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   const applicantId = searchParams.get('applicantId')
//   const applicantName = searchParams.get('applicantName')
//   const applicantEmail = searchParams.get('applicantEmail')
//   const jobOpening = searchParams.get('jobOpening') || ""
//   const clearedRoundsParam = searchParams.get('clearedRounds') || ""
//   const clearedRounds = clearedRoundsParam ? clearedRoundsParam.split(",") : []
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   useEffect(() => {
//     console.log("=== URL Parameters ===")
//     console.log("applicantId:", applicantId)
//     console.log("applicantName:", applicantName)
//     console.log("applicantEmail:", applicantEmail)
//     console.log("Full URL:", window.location.href)
//   }, [applicantId, applicantName, applicantEmail])

//   const [eventForm, setEventForm] = useState({
//     interviewRound: "",
//     jobApplicant: applicantId || "",
//     resumeLink: "",
//     meetingLink: "",
//     location: "",
//     status: "Pending",
//     scheduledOn: "",
//     fromTime: "",
//     toTime: "",
//     interviewers: [] as string[],
//   })

//   const [availableInterviewers, setAvailableInterviewers] = useState<Interviewer[]>([])
//   const [interviewRounds, setInterviewRounds] = useState<InterviewRound[]>([])
//   const [locations, setLocations] = useState<Location[]>([])
//   const [interviewLinks, setInterviewLinks] = useState<InterviewLink[]>([])
//   const [isSaving, setIsSaving] = useState(false)

//   const [interviewerSearch, setInterviewerSearch] = useState("")



//   const statusOptions = ["Pending", "Under Review", "Cleared", "Rejected"]

//   useEffect(() => {
//     fetchInterviewers()
//     fetchInterviewRounds()
//     fetchLocations()
//     fetchInterviewLinks()
//   }, [])

//   useEffect(() => { document.title = 'Interview Scheduling' }, [])

//   const fetchInterviewLinks = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/resource/Interview Link?fields=["name","google_meet"]&limit_page_length=100`,
//         { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
//       )
//       const data = await response.json()
//       if (data && data.data) {
//         const mappedLinks = data.data.map((item: any) => ({ name: item.name, link: item.google_meet }))
//         setInterviewLinks(mappedLinks)
//         console.log("Fetched interview links:", mappedLinks)
//       }
//     } catch (error) { console.error("Error fetching interview links:", error) }
//   }

//   // const fetchLocations = async () => {
//   //   try {
//   //     const response = await fetch(
//   //       `${API_BASE_URL}/api/resource/Location?fields=["name"]&limit_page_length=100`,
//   //       { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
//   //     )
//   //     const data = await response.json()
//   //     if (data && data.data) { setLocations(data.data); console.log("Fetched locations:", data.data) }
//   //   } catch (error) { console.error("Error fetching locations:", error) }
//   // }

//   const fetchLocations = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/resource/Cost Center?fields=["name"]&filters=[["Cost Center","is_group","=",0]]&limit_page_length=0`,
//         { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
//       )
//       const data = await response.json()
//       if (data && data.data) { setLocations(data.data); console.log("Fetched locations:", data.data) }
//     } catch (error) { console.error("Error fetching locations:", error) }
//   }

//   const fetchInterviewRounds = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/resource/Interview Round?fields=["name","round_name"]&limit_page_length=100`,
//         { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
//       )
//       const data = await response.json()
//       if (data && data.data) { setInterviewRounds(data.data); console.log("Fetched interview rounds:", data.data) }
//     } catch (error) {
//       console.error("Error fetching interview rounds:", error)
//       setInterviewRounds([
//         { name: "First Round", round_name: "First Round" },
//         { name: "Second Round", round_name: "Second Round" },
//         { name: "Final Round", round_name: "Final Round" },
//       ])
//     }
//   }

//   const fetchInterviewers = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/resource/User?fields=["name","full_name","email"]&filters=[["enabled","=",1]]&limit_page_length=100`,
//         { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
//       )
//       const data = await response.json()
//       if (data && data.data) {
//         const filteredUsers = data.data.filter(
//           (user: any) => user.name !== "Administrator" && user.name !== "Guest"
//         )
//         setAvailableInterviewers(filteredUsers)
//         console.log("Fetched interviewers:", filteredUsers)
//       }
//     } catch (error) { console.error("Error fetching interviewers:", error) }
//   }

//   const handleInterviewerToggle = (interviewer: string) => {
//     setEventForm(prev => ({
//       ...prev,
//       interviewers: prev.interviewers.includes(interviewer)
//         ? prev.interviewers.filter(i => i !== interviewer)
//         : [...prev.interviewers, interviewer],
//     }))
//   }

//   // const handleSaveEvent = async () => {
//   //   if (!eventForm.interviewRound || !eventForm.jobApplicant || !eventForm.scheduledOn || !eventForm.fromTime || !eventForm.toTime) {
//   //     alert("Please fill all required fields")
//   //     return
//   //   }
//   //   const selectedDate = new Date(eventForm.scheduledOn)
//   //   const today = new Date()
//   //   today.setHours(0, 0, 0, 0)
//   //   selectedDate.setHours(0, 0, 0, 0)
//   //   if (selectedDate < today) {
//   //     alert("Cannot schedule interview for past dates. Please select today or a future date.")
//   //     return
//   //   }
//   //   console.log("=== DEBUG ===");
//   //   console.log("Meeting Link from state:", eventForm.meetingLink);
//   //   setIsSaving(true)
//   //   try {
//   //     const interviewData = {
//   //       doctype: "Interview",
//   //       interview_round: eventForm.interviewRound,
//   //       job_applicant: eventForm.jobApplicant,
//   //       resume_link: eventForm.resumeLink || '',
//   //       meeting_link: eventForm.meetingLink || '',
//   //       location: eventForm.location || '',
//   //       status: eventForm.status,
//   //       scheduled_on: eventForm.scheduledOn,
//   //       from_time: eventForm.fromTime,
//   //       to_time: eventForm.toTime,
//   //       interview_details: eventForm.interviewers.map((interviewer) => ({
//   //         doctype: "Interview Detail",
//   //         interviewer: interviewer
//   //       }))
//   //     };
//   //     console.log("Interview data:", JSON.stringify(interviewData, null, 2));
//   //     const csrfToken = await getFrappeCSRF();
//   //     const response = await fetch(
//   //       `${API_BASE_URL}/api/resource/Interview`,
//   //       {
//   //         method: 'POST',
//   //         credentials: 'include',
//   //         headers: {
//   //           'Content-Type': 'application/json',
//   //           "X-Frappe-CSRF-Token": csrfToken
//   //         },
//   //         body: JSON.stringify(interviewData)
//   //       }
//   //     )
//   //     const data = await response.json()
//   //     console.log("✅ Full API Response:", data)
//   //     console.log("✅ Response status:", response.ok)
//   //     console.log("✅ Data structure:", JSON.stringify(data, null, 2))
//   //     if (response.ok && data.data) {
//   //       const interviewName = data.data.name
//   //       console.log("✅ Created interview with ID:", interviewName)
//   //       alert(`Interview ${interviewName || ''} created successfully!`)
//   //       console.log("✅ Redirecting to /interviews page...")
//   //       router.push('/interview')
//   //     } else if (response.ok) {
//   //       console.log("✅ Interview created successfully")
//   //       alert(`Interview created successfully!`)
//   //       router.push('/interview')
//   //     } else {
//   //       const errorMessage = data.message || data.exception || "Failed to create interview"
//   //       console.error("❌ API Error:", errorMessage)
//   //       alert(`Error: ${errorMessage}`)
//   //     }
//   //   } catch (error: any) {
//   //     console.error("❌ Error creating interview:", error)
//   //     const errorMsg = error.message || "Failed to create interview"
//   //     alert(`Error: ${errorMsg}`)
//   //   } finally {
//   //     setIsSaving(false)
//   //   }
//   // }

//   const handleSaveEvent = async () => {
//     if (!eventForm.interviewRound || !eventForm.jobApplicant || !eventForm.scheduledOn || !eventForm.fromTime || !eventForm.toTime) {
//       alert("Please fill all required fields")
//       return
//     }
//     if (!eventForm.location) {
//       alert("Please select a location")
//       return
//     }
//     if (eventForm.interviewers.length === 0) {
//       alert("Please select at least one interviewer")
//       return
//     }
//     const selectedDate = new Date(eventForm.scheduledOn)
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)
//     selectedDate.setHours(0, 0, 0, 0)
//     if (selectedDate < today) {
//       alert("Cannot schedule interview for past dates. Please select today or a future date.")
//       return
//     }
//     // if (eventForm.fromTime && eventForm.toTime) {
//     //   const fromTime = new Date(`2000-01-01T${eventForm.fromTime}`)
//     //   const toTime = new Date(`2000-01-01T${eventForm.toTime}`)
//     //   if (fromTime >= toTime) { alert("To Time must be later than From Time"); return }
//     // }

//     // // REPLACE the duplicate check block with this:
//     // try {
//     //   const existingRes = await fetch(
//     if (eventForm.fromTime && eventForm.toTime) {
//       const fromTime = new Date(`2000-01-01T${eventForm.fromTime}`)
//       const toTime = new Date(`2000-01-01T${eventForm.toTime}`)
//       if (fromTime >= toTime) { alert("To Time must be later than From Time"); return }
//     }

//     // ✅ NEW: Prevent rescheduling same round at same date+time
//     try {
//       const sameTimeRes = await fetch(
//         `${API_BASE_URL}/api/resource/Interview?` +
//         `filters=[["job_applicant","=","${eventForm.jobApplicant}"],["interview_round","=","${eventForm.interviewRound}"],["scheduled_on","=","${eventForm.scheduledOn}"],["from_time","=","${eventForm.fromTime}:00"]]` +
//         `&fields=["name","scheduled_on","from_time","to_time","status"]&limit_page_length=1`,
//         {
//           credentials: 'include',
//           headers: { 'Content-Type': 'application/json' }
//         }
//       )
//       const sameTimeData = await sameTimeRes.json()
//       console.log("Same time check:", sameTimeData)

//       if (sameTimeData.data && sameTimeData.data.length > 0) {
//         const existing = sameTimeData.data[0]
//         alert(
//           `Cannot reschedule at the same time!\n\n` +
//           `"${eventForm.interviewRound}" is already scheduled on ${eventForm.scheduledOn} at ${eventForm.fromTime}.\n\n` +
//           `Please choose a different date or time.`
//         )
//         return
//       }
//     } catch (err) {
//       console.error("Same time validation failed:", err)
//     }

//     // REPLACE the duplicate check block with this:
//     try {
//       const existingRes = await fetch(
//         `${API_BASE_URL}/api/resource/Interview?` +
//         `filters=[["job_applicant","=","${eventForm.jobApplicant}"],["interview_round","=","${eventForm.interviewRound}"],["status","=","Cleared"]]` +
//         `&fields=["name","status","interview_round"]&limit_page_length=1`,
//         {
//           credentials: 'include',
//           headers: { 'Content-Type': 'application/json' }
//         }
//       )
//       const existingData = await existingRes.json()
//       console.log("Cleared round check:", existingData)

//       if (existingData.data && existingData.data.length > 0) {
//         alert(`"${eventForm.interviewRound}" is already Cleared for this candidate. You cannot schedule the same round again. Please select a different round.`)
//         return
//       }
//     } catch (err) {
//       console.error("Round validation failed:", err)
//     }


//     // BLOCK 3 — Round order validation: must schedule rounds in sequence
//     try {
//       // Fetch all interview rounds in order (assumes round names are ordered in the system)
//       const allRoundsRes = await fetch(
//         `${API_BASE_URL}/api/resource/Interview Round?fields=["name","round_name"]&limit_page_length=100`,
//         { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
//       )
//       const allRoundsData = await allRoundsRes.json()
//       const orderedRounds: string[] = (allRoundsData.data || []).map((r: any) => r.name)

//       const selectedRoundIndex = orderedRounds.indexOf(eventForm.interviewRound)

//       if (selectedRoundIndex > 0) {
//         // There are rounds before this one — check all previous rounds have been scheduled
//         const previousRounds = orderedRounds.slice(0, selectedRoundIndex)

//         const existingRoundsRes = await fetch(
//           `${API_BASE_URL}/api/resource/Interview?` +
//           `filters=[["job_applicant","=","${eventForm.jobApplicant}"]]` +
//           `&fields=["name","interview_round","status"]&limit_page_length=100`,
//           { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
//         )
//         const existingRoundsData = await existingRoundsRes.json()
//         const scheduledRoundNames: string[] = (existingRoundsData.data || []).map((i: any) => i.interview_round)

//         for (const prevRound of previousRounds) {
//           if (!scheduledRoundNames.includes(prevRound)) {
//             alert(
//               `Round order violation!\n\n` +
//               `You cannot schedule "${eventForm.interviewRound}" before "${prevRound}" has been scheduled.\n\n` +
//               `Please schedule rounds in order.`
//             )
//             return
//           }
//         }
//       }
//     } catch (err) {
//       console.error("Round order validation failed:", err)
//     }


//     // BLOCK 2 — NEW: prevent scheduling next round if previous cleared round has no feedback
//     // try {
//     //   const clearedRes = await fetch(
//     //     `${API_BASE_URL}/api/resource/Interview?` +
//     //     `filters=[["job_applicant","=","${eventForm.jobApplicant}"],["status","=","Cleared"]]` +
//     //     `&fields=["name","interview_round","scheduled_on"]&order_by=scheduled_on desc&limit_page_length=1`,
//     //     {
//     //       credentials: 'include',
//     //       headers: { 'Content-Type': 'application/json' }
//     //     }
//     //   )
//     //   const clearedData = await clearedRes.json()
//     //   console.log("Last cleared interview check:", clearedData)

//     //   if (clearedData.data && clearedData.data.length > 0) {
//     //     const lastClearedInterview = clearedData.data[0]

//     //     const feedbackRes = await fetch(
//     //       `${API_BASE_URL}/api/resource/Interview Feedback?` +
//     //       `filters=[["interview","=","${lastClearedInterview.name}"]]` +
//     //       `&fields=["name"]&limit_page_length=1`,
//     //       {
//     //         credentials: 'include',
//     //         headers: { 'Content-Type': 'application/json' }
//     //       }
//     //     )
//     //     const feedbackData = await feedbackRes.json()
//     //     console.log("Feedback check for last cleared interview:", feedbackData)

//     //     if (!feedbackData.data || feedbackData.data.length === 0) {
//     //       alert(
//     //         `Cannot schedule next round!\n\n` +
//     //         `The previous round "${lastClearedInterview.interview_round}" was cleared but feedback has not been submitted yet.\n\n` +
//     //         `Please submit feedback for interview "${lastClearedInterview.name}" before scheduling the next round.`
//     //       )
//     //       return
//     //     }
//     //   }
//     // } catch (err) {
//     //   console.error("Feedback validation failed:", err)
//     // }





//     setIsSaving(true)
//     try {
//       // const interviewData = {
//       //   doctype: "Interview",
//       //   interview_round: eventForm.interviewRound,
//       //   job_applicant: eventForm.jobApplicant,
//       //   resume_link: eventForm.resumeLink || '',
//       //   custom_meeting_link: eventForm.meetingLink || '',
//       //   custom_location: eventForm.location || '',
//       //   status: eventForm.status,
//       //   scheduled_on: eventForm.scheduledOn,
//       //   from_time: eventForm.fromTime,
//       //   to_time: eventForm.toTime,
//       //   interview_details: eventForm.interviewers.map((interviewer) => ({
//       //     doctype: "Interview Detail",
//       //     interviewer,
//       //   }))
//       // }

//       const interviewData = {
//         doctype: "Interview",
//         interview_round: eventForm.interviewRound,
//         job_applicant: eventForm.jobApplicant,
//         resume_link: eventForm.resumeLink || '',
//         custom_meeting_link: eventForm.meetingLink || '',
//         custom_location: eventForm.location || '',
//         status: eventForm.status,
//         scheduled_on: eventForm.scheduledOn,
//         from_time: eventForm.fromTime,
//         to_time: eventForm.toTime,
//         interview_details: eventForm.interviewers.map((interviewer) => ({
//           doctype: "Interview Detail",
//           interviewer,
//         }))
//       }

//       console.log("Creating interview:", JSON.stringify(interviewData, null, 2))
//       const csrfToken = await getFrappeCSRF()

//       const response = await fetch(`${API_BASE_URL}/api/resource/Interview`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json', "X-Frappe-CSRF-Token": csrfToken },
//         body: JSON.stringify(interviewData)
//       })
//       const data = await response.json()
//       console.log("✅ API Response:", data)
//       if (response.ok) {
//         alert(`Interview created successfully!`)
//         router.push('/interview')
//       } else {
//         const errorMessage = data.message || data.exception || "Failed to create interview"
//         console.error("❌ Error:", errorMessage)
//         alert(`Error: ${errorMessage}`)
//       }
//     } catch (error: any) {
//       console.error("❌ Error:", error)
//       alert(`Error: ${error.message}`)
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const sidebarPipeline = [
//     { href: "/job-opening", title: "Job Opening", icon: <Briefcase size={15} /> },
//     { href: "/upload-resumes", title: "Resume Collection", icon: <Upload size={15} /> },
//     { href: "/candidates", title: "Candidates", icon: <Users size={15} /> },
//     { href: "/interview", title: "Interview Scheduling", icon: <Calendar size={15} /> },
//   ]
//   const sidebarClosing = [
//     { href: "/feedback", title: "Candidate Feedback", icon: <MessageSquare size={15} /> },
//     { href: "/document-verify-list", title: "Document Verification", icon: <FileText size={15} /> },
//     { href: "/offer-list", title: "Offer Letter", icon: <Zap size={15} /> },
//     { href: "/letter-appointment", title: "Appointment Letter", icon: <UserCheck size={15} /> },
//   ]

//   return (
//     <>
//       <style>{css}</style>
//       <div className="ev">
//         <div className="ev-wrap">
//           <div className={`ev-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

//           {/* SIDEBAR */}
//           <aside className={`ev-sb${sidebarOpen ? "" : " collapsed"}`}>
//             <div className="ev-sb-brand">
//               <div className="ev-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
//               <div><div className="ev-sb-name">Job Management</div><div className="ev-sb-sub">HR Platform</div></div>
//               <button className="ev-sb-close" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
//             </div>
//             <nav className="ev-nav">
//               <a href="/create-job" className="ev-nav-cta"><Plus size={14} /> New Job Opening</a>
//               <div className="ev-nav-lbl">General</div>
//               <Link href="/home" className="ev-nav-link">
//                 <Home size={15} /> Home
//               </Link>
//               <div className="ev-nav-lbl">Pipeline</div>
//               {sidebarPipeline.map(s => (
//                 <a key={s.href} href={s.href} className={`ev-nav-link${s.href === "/interview" ? " active" : ""}`}>
//                   {s.icon} {s.title}
//                 </a>
//               ))}
//               <div className="ev-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
//               {sidebarClosing.map(s => (
//                 <a key={s.href} href={s.href} className="ev-nav-link">{s.icon} {s.title}</a>
//               ))}
//             </nav>
//             <div className="ev-sb-foot">
//               <button className="ev-logout"><LogOut size={15} /> Sign out</button>
//             </div>
//           </aside>

//           {/* MAIN */}
//           <div className={`ev-main${sidebarOpen ? "" : " sb-closed"}`}>
//             <header className="ev-header">
//               <button className="ev-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
//               <div className="ev-hdr-sep" />
//               <button className="ev-btn-out" onClick={() => router.back()}><ArrowLeft size={13} /> Back</button>
//               <div className="ev-hdr-sep" />
//               {/* <div className="ev-crumb">
//                 <Home size={13} /> Home <ChevronRight size={13} />
//                 <a href="/interview" style={{ color: 'var(--t3)', textDecoration: 'none' }}>Interview Management</a>
//                 <ChevronRight size={13} /> <strong>Schedule Interview</strong>
//               </div> */}
//               <div className="ev-crumb">
//                 <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'inherit', textDecoration: 'none' }}>
//                   <Home size={13} /> Home
//                 </Link>
//                 <ChevronRight size={13} />
//                 <a href="/interview" style={{ color: 'var(--t3)', textDecoration: 'none' }}>Interview Management</a>
//                 <ChevronRight size={13} />
//                 <strong>Schedule Interview</strong>
//               </div>
//             </header>

//             {/* CENTRED CONTENT */}
//             <div className="ev-page-outer">
//               <div className="ev-page">

//                 <div>
//                   <h1 className="ev-page-title">Schedule New Interview</h1>
//                   <p className="ev-page-sub">Create and schedule a new interview event for candidates</p>
//                 </div>

//                 {applicantId && applicantName && (
//                   <div className="ev-applicant-banner">
//                     <div className="ev-applicant-avatar"><Users size={22} /></div>
//                     <div>
//                       <div className="ev-applicant-label">Interview Candidate</div>
//                       <div className="ev-applicant-name">{applicantName}</div>
//                     </div>
//                   </div>
//                 )}

//                 {!applicantId && (
//                   <div className="ev-warning">
//                     <AlertCircle size={16} />
//                     <span className="ev-warning-txt">No applicant selected. Please go back and select a candidate.</span>
//                   </div>
//                 )}

//                 {/* Interview Details card */}
//                 <div className="ev-card">
//                   <div className="ev-card-head">
//                     <div className="ev-card-title"><Calendar size={15} /> Interview Details</div>
//                   </div>
//                   <div className="ev-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
//                     <div className="ev-form-grid">
//                       <div className="ev-form-field">
//                         <label className="ev-label"><CheckCircle2 size={12} /> Interview Round <span className="ev-req">*</span></label>
//                         {interviewRounds.length > 0 ? (
//                           <div className="ev-select-wrap">
//                             <select className="ev-select" value={eventForm.interviewRound} onChange={e => setEventForm({ ...eventForm, interviewRound: e.target.value })}>
//                               <option value="">Select interview round</option>
//                               {interviewRounds.map(r => <option key={r.name} value={r.name}>{r.round_name || r.name}</option>)}
//                             </select>
//                             <ChevronRight size={13} className="ev-select-arrow" />
//                           </div>
//                         ) : (
//                           <input className="ev-input" value={eventForm.interviewRound} onChange={e => setEventForm({ ...eventForm, interviewRound: e.target.value })} placeholder="Loading rounds..." disabled />
//                         )}
//                       </div>
//                       <div className="ev-form-field">
//                         <label className="ev-label">Status <span className="ev-req">*</span></label>
//                         <div className="ev-select-wrap">
//                           <select className="ev-select" value={eventForm.status} onChange={e => setEventForm({ ...eventForm, status: e.target.value })}>
//                             {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
//                           </select>
//                           <ChevronRight size={13} className="ev-select-arrow" />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="ev-form-field">
//                       <label className="ev-label"><FileText size={12} /> Resume Link</label>
//                       <input type="url" className="ev-input" value={eventForm.resumeLink} onChange={e => setEventForm({ ...eventForm, resumeLink: e.target.value })} placeholder="https://example.com/resume.pdf" />
//                     </div>

//                     <div className="ev-form-field">
//                       <label className="ev-label"><Video size={12} /> Meeting Link</label>
//                       <input type="url" className="ev-input" value={eventForm.meetingLink} onChange={e => setEventForm({ ...eventForm, meetingLink: e.target.value })} placeholder="Enter meeting link or select from saved links" list="meeting-links" />
//                       {interviewLinks.length > 0 && (
//                         <datalist id="meeting-links">
//                           {interviewLinks.map(l => <option key={l.name} value={l.link} />)}
//                         </datalist>
//                       )}
//                     </div>

//                     {/* <div className="ev-form-field">
//                       <label className="ev-label"><MapPin size={12} /> Location</label>
//                       {locations.length > 0 ? (
//                         <div className="ev-select-wrap">
//                           <select className="ev-select" value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })}>
//                             <option value="">Select location</option>
//                             {locations.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
//                           </select>
//                           <ChevronRight size={13} className="ev-select-arrow" />
//                         </div>
//                       ) : (
//                         <input className="ev-input" value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} placeholder="Loading locations..." disabled />
//                       )}
//                     </div> */}
//                     <div className="ev-form-field">
//                       {/* <label className="ev-label"><MapPin size={12} /> Location</label> */}
//                       <label className="ev-label"><MapPin size={12} /> Location <span className="ev-req">*</span></label>
//                       <SearchableSelect
//                         value={eventForm.location}
//                         onChange={val => setEventForm({ ...eventForm, location: val })}
//                         options={locations.map(l => l.name)}
//                         placeholder="Select location"
//                       />
//                     </div>

//                     <div className="ev-form-grid3">
//                       <div className="ev-form-field">
//                         <label className="ev-label"><Calendar size={12} /> Date <span className="ev-req">*</span></label>
//                         <input type="date" className="ev-input" value={eventForm.scheduledOn} onChange={e => setEventForm({ ...eventForm, scheduledOn: e.target.value })} onClick={e => (e.target as HTMLInputElement).showPicker?.()} style={{ cursor: 'pointer' }} />
//                       </div>
//                       <div className="ev-form-field">
//                         <label className="ev-label"><Clock size={12} /> From <span className="ev-req">*</span></label>
//                         <input type="time" className="ev-input" value={eventForm.fromTime} onChange={e => setEventForm({ ...eventForm, fromTime: e.target.value })} onFocus={e => (e.target as HTMLInputElement).showPicker?.()} style={{ cursor: 'pointer' }} placeholder="HH:MM" />
//                       </div>
//                       <div className="ev-form-field">
//                         <label className="ev-label"><Clock size={12} /> To <span className="ev-req">*</span></label>
//                         <input type="time" className="ev-input" value={eventForm.toTime} onChange={e => setEventForm({ ...eventForm, toTime: e.target.value })} onFocus={e => (e.target as HTMLInputElement).showPicker?.()} min={eventForm.fromTime} style={{ cursor: 'pointer' }} placeholder="HH:MM" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Interviewers card */}
//                 {/* <div className="ev-card">
//                   <div className="ev-card-head">
//                     <div className="ev-card-title"><Users size={15} /> Select Interviewers</div>
//                     {eventForm.interviewers.length > 0 && (
//                       <span className="ev-selected-badge">{eventForm.interviewers.length} selected</span>
//                     )}
//                   </div>
//                   <div className="ev-table-scroll">
//                     <table className="ev-table">
//                       <thead>
//                         <tr>
//                           <th style={{ width: 48 }}><input type="checkbox" className="ev-check" disabled /></th>
//                           <th style={{ width: 56 }}>No.</th>
//                           <th>Interviewer Details</th>
//                         </tr>
//                       </thead> */}
//                 <div className="ev-card">
//                   <div className="ev-card-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                     {/* <div className="ev-card-title"><Users size={15} /> Select Interviewers</div> */}
//                     <div className="ev-card-title"><Users size={15} /> Select Interviewers <span className="ev-req">*</span></div>
//                     {eventForm.interviewers.length > 0 && (
//                       <span className="ev-selected-badge">{eventForm.interviewers.length} selected</span>
//                     )}
//                   </div>

//                   {/* Search bar */}
//                   <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border-s)", background: "#fff" }}>
//                     <input
//                       className="ev-input"
//                       style={{ height: 38, fontSize: 13 }}
//                       placeholder="Search interviewers by name or email..."
//                       value={interviewerSearch}
//                       onChange={e => setInterviewerSearch(e.target.value)}
//                     />
//                   </div>

//                   <div className="ev-table-scroll">
//                     <table className="ev-table">
//                       <thead>
//                         <tr>
//                           <th style={{ width: 48 }}><input type="checkbox" className="ev-check" disabled /></th>
//                           <th style={{ width: 56 }}>No.</th>
//                           <th>Interviewer Details</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {availableInterviewers.length > 0 ? (
//                           availableInterviewers
//                             .filter(i =>
//                               i.full_name?.toLowerCase().includes(interviewerSearch.toLowerCase()) ||
//                               i.email?.toLowerCase().includes(interviewerSearch.toLowerCase()) ||
//                               i.name?.toLowerCase().includes(interviewerSearch.toLowerCase())
//                             )
//                             .map((interviewer, index) => (
//                               <tr key={interviewer.name} onClick={() => handleInterviewerToggle(interviewer.name)}>
//                                 <td>
//                                   <input
//                                     type="checkbox"
//                                     className="ev-check"
//                                     checked={eventForm.interviewers.includes(interviewer.name)}
//                                     onChange={() => handleInterviewerToggle(interviewer.name)}
//                                     onClick={e => e.stopPropagation()}
//                                   />
//                                 </td>
//                                 <td style={{ color: 'var(--t3)', fontWeight: 600 }}>{index + 1}</td>
//                                 <td>
//                                   <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                                     <div className="ev-interviewer-avatar">
//                                       {(interviewer.full_name || interviewer.name).charAt(0).toUpperCase()}
//                                     </div>
//                                     <div>
//                                       <div className="ev-interviewer-name">{interviewer.full_name || interviewer.name}</div>
//                                       <div className="ev-interviewer-email">{interviewer.email}</div>
//                                     </div>
//                                   </div>
//                                 </td>
//                               </tr>
//                             ))
//                         ) : (
//                           <tr><td colSpan={3}>
//                             <div className="ev-table-empty">
//                               <div className="ev-table-empty-icon"><Users size={22} /></div>
//                               <div className="ev-table-empty-txt">Loading interviewers...</div>
//                             </div>
//                           </td></tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 <div className="ev-actions">
//                   <button className="ev-btn-cancel" onClick={() => router.back()}>Cancel</button>
//                   <button className="ev-btn-save" onClick={handleSaveEvent} disabled={isSaving || !applicantId}>
//                     {isSaving ? <><span className="ev-spinner" /> Saving...</> : "Create Interview"}
//                   </button>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       </div >
//     </>
//   )
// }

// function SearchableSelect({ value, onChange, options, placeholder }: {
//   value: string
//   onChange: (val: string) => void
//   options: string[]
//   placeholder: string
// }) {
//   const [open, setOpen] = useState(false)
//   const [search, setSearch] = useState("")
//   const ref = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
//     }
//     document.addEventListener("mousedown", handler)
//     return () => document.removeEventListener("mousedown", handler)
//   }, [])

//   const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()))

//   return (
//     <div ref={ref} style={{ position: "relative" }}>
//       <div
//         className="ev-input"
//         style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", height: 44 }}
//         onClick={() => { setOpen(o => !o); setSearch("") }}
//       >
//         <span style={{ color: value ? "var(--t1)" : "var(--t3)" }}>{value || placeholder}</span>
//         <ChevronRight size={14} style={{ transform: open ? "rotate(270deg)" : "rotate(90deg)", color: "var(--t3)", transition: "transform .2s" }} />
//       </div>
//       {open && (
//         <div style={{
//           position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 9999,
//           background: "#fff", border: "1px solid var(--border)", borderRadius: 8,
//           boxShadow: "0 8px 24px rgba(0,0,0,.12)", overflow: "hidden"
//         }}>
//           <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--border-s)" }}>
//             <input
//               autoFocus
//               className="ev-input"
//               style={{ height: 34, fontSize: 13 }}
//               placeholder="Search..."
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               onClick={e => e.stopPropagation()}
//             />
//           </div>
//           <div style={{ maxHeight: 220, overflowY: "auto" }}>
//             {filtered.length === 0
//               ? <div style={{ padding: "12px 14px", color: "var(--t3)", fontSize: 13 }}>No results found</div>
//               : filtered.map(opt => (
//                 <div key={opt} onClick={() => { onChange(opt); setOpen(false) }}
//                   style={{
//                     padding: "9px 14px", fontSize: 13.5, cursor: "pointer",
//                     background: opt === value ? "var(--accent-lt)" : "transparent",
//                     color: opt === value ? "var(--accent)" : "var(--t1)",
//                     transition: "background .12s"
//                   }}
//                   onMouseEnter={e => { if (opt !== value) (e.target as HTMLElement).style.background = "var(--bg)" }}
//                   onMouseLeave={e => { if (opt !== value) (e.target as HTMLElement).style.background = "transparent" }}
//                 >
//                   {opt}
//                 </div>
//               ))
//             }
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default function EventPage() {
//   return (
//     <Suspense fallback={
//       <div className="ev">
//         <style>{css}</style>
//         <div className="ev-loading">
//           <div className="ev-loading-spinner" />
//           <div className="ev-loading-txt">Loading...</div>
//         </div>
//       </div>
//     }>
//       <EventPageContent />
//     </Suspense>
//   )
// }














"use client"
import { useState, useEffect, Suspense, useRef } from "react"
import {
  ArrowLeft, Calendar, Clock, MapPin, Video, FileText, Users,
  CheckCircle2, AlertCircle, Menu, X, Home, LogOut, Upload,
  Briefcase, MessageSquare, Zap, UserCheck, ChevronRight, Plus,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { API_BASE_URL } from '@/lib/api-config'
import { getFrappeCSRF } from "@/lib/csrf"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ev {
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
    --red:       #dc2626;
    --yellow:    #d97706;
    --yellow-lt: #fef9c3;
    --yellow-bdr:#fde68a;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13.5px;
    -webkit-font-smoothing: antialiased;
  }
  .ev-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  /* SIDEBAR */
  .ev-sb { width: var(--sb-w); background: var(--sb); min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 100; display: flex; flex-direction: column; transition: transform .25s cubic-bezier(.4,0,.2,1); }
  .ev-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }
  .ev-sb-brand { height: 64px; display: flex; align-items: center; gap: 12px; padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .ev-sb-icon { width: 38px; height: 38px; border-radius: 10px; background: var(--accent-md); border: 1px solid var(--accent-bdr); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
  .ev-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .ev-sb-name { font-size: 14px; font-weight: 700; color: #fff; }
  .ev-sb-sub  { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
  .ev-sb-close { margin-left: auto; width: 28px; height: 28px; border-radius: 7px; background: none; border: none; cursor: pointer; color: var(--sb-lbl); display: flex; align-items: center; justify-content: center; transition: all .14s; }
  .ev-sb-close:hover { background: var(--sb-hover); color: #fff; }
  .ev-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .ev-nav-cta { display: flex; align-items: center; gap: 9px; padding: 11px 14px; border-radius: 9px; background: var(--accent-md); border: 1px solid var(--accent-bdr); color: var(--accent); font-size: 13px; font-weight: 600; text-decoration: none; transition: background .15s; margin-bottom: 22px; }
  .ev-nav-cta:hover { background: rgba(0,158,247,.24); }
  .ev-nav-lbl { font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px; }
  .ev-nav-link { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: var(--sb-txt); text-decoration: none; transition: all .14s; }
  .ev-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; }
  .ev-nav-link:hover, .ev-nav-link.active { background: var(--sb-hover); color: #fff; }
  .ev-nav-link:hover svg, .ev-nav-link.active svg { opacity: 1; }
  .ev-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .ev-logout { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 12px; border-radius: 8px; background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: var(--sb-lbl); transition: all .14s; }
  .ev-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }
  .ev-overlay { display: none; position: fixed; inset: 0; z-index: 99; background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer; }
  @media (max-width: 768px) { .ev-overlay.show { display: block; } }

  /* MAIN */
  .ev-main { margin-left: var(--sb-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; transition: margin-left .25s cubic-bezier(.4,0,.2,1); }
  .ev-main.sb-closed { margin-left: 0; }

  /* HEADER */
  .ev-header { min-height: 60px; background: #fff; border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 28px; gap: 12px; position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 0 rgba(0,158,247,.08); overflow: hidden; }  .ev-toggle { width: 34px; height: 34px; border-radius: 8px; background: none; border: 1px solid var(--border); cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--t2); transition: all .14s; }
  .ev-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .ev-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .ev-crumb { display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--t3); flex: 1; min-width: 0; overflow: hidden; }
  .ev-crumb strong { color: var(--t1); font-weight: 600; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; }
  .ev-crumb a { white-space: nowrap; font-size: 11px; }
  .ev-hdr-right { margin-left: auto; }
  .ev-btn-out { display: inline-flex; align-items: center; gap: 7px; padding: 7px 14px; border-radius: 8px; background: transparent; color: var(--t2); font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; border: 1px solid var(--border); cursor: pointer; transition: all .14s; }
  .ev-btn-out:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

  /* PAGE — full-width centred wrapper */
  .ev-page-outer { flex: 1; display: flex; justify-content: center; padding: 28px 32px; }
  .ev-page { width: 100%; max-width: 860px; display: flex; flex-direction: column; gap: 20px; }
  .ev-page-title { font-size: 21px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; }
  .ev-page-sub   { font-size: 13px; color: var(--t3); margin-top: 4px; }

  /* CARDS */
  .ev-card { background: var(--card); border: 1px solid var(--border-s); border-radius: 12px; box-shadow: 0 1px 4px rgba(0,158,247,.06); }
  .ev-card-head { padding: 14px 20px; border-bottom: 1px solid var(--border-s); display: flex; align-items: center; justify-content: space-between; flex-wrap: nowrap; gap: 10px; background: linear-gradient(to right, #f8fcff, var(--accent-lt)); }
  .ev-card-title { font-size: 13.5px; font-weight: 700; color: var(--t1); display: flex; align-items: center; gap: 8px; }
  .ev-card-title svg { color: var(--accent); }
  .ev-card-body { padding: 22px; }

  .ev-applicant-banner { background: linear-gradient(135deg, #0f3460, #16213e); border-radius: 12px; padding: 18px 22px; display: flex; align-items: center; gap: 16px; }
  .ev-applicant-avatar { width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,.18); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
  .ev-applicant-label { font-size: 11.5px; color: rgba(255,255,255,.55); margin-bottom: 3px; }
  .ev-applicant-name  { font-size: 16px; font-weight: 700; color: #fff; }

  .ev-warning { background: var(--yellow-lt); border: 1px solid var(--yellow-bdr); border-radius: 10px; padding: 14px 16px; display: flex; align-items: center; gap: 10px; }
  .ev-warning svg { color: var(--yellow); flex-shrink: 0; }
  .ev-warning-txt { font-size: 13px; font-weight: 500; color: #92400e; }

  /* FORM */
  .ev-form-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .ev-form-grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; }
  .ev-form-field { display: flex; flex-direction: column; gap: 6px; }
  .ev-label { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--t3); display: flex; align-items: center; gap: 5px; }
  .ev-label svg { width: 12px; height: 12px; }
  .ev-req { color: var(--red); margin-left: 1px; }
  .ev-input { width: 100%; height: 44px; padding: 0 13px; border: 1px solid var(--border); border-radius: 9px; background: var(--bg); font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--t1); outline: none; transition: all .15s; }
  .ev-input::placeholder { color: var(--t3); }
  .ev-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .ev-input:disabled { background: #f3f7fa; color: var(--t3); cursor: not-allowed; }
  .ev-select-wrap { position: relative; }
  .ev-select-arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%) rotate(90deg); color: var(--t3); pointer-events: none; width: 13px; height: 13px; }
  .ev-select { width: 100%; max-width: 100%; height: 44px; padding: 0 36px 0 13px; border: 1px solid var(--border); border-radius: 9px; background: var(--bg); font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--t2); appearance: none; outline: none; cursor: pointer; transition: all .15s; }  .ev-select:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .ev-select:disabled { background: #f3f7fa; color: var(--t3); cursor: not-allowed; }

  /* TABLE */
  .ev-table-scroll { max-height: 380px; overflow-y: auto; }
  .ev-table-scroll::-webkit-scrollbar { width: 4px; }
  .ev-table-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  .ev-table { width: 100%; border-collapse: collapse; }
  .ev-table thead { background: linear-gradient(to right, var(--accent-lt), #f0f8fe); position: sticky; top: 0; z-index: 2; }
  .ev-table th { padding: 12px 16px; text-align: left; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--t2); border-bottom: 1px solid var(--border-s); }
  .ev-table tbody tr { border-bottom: 1px solid var(--border-s); transition: background .12s; cursor: pointer; }
  .ev-table tbody tr:last-child { border-bottom: none; }
  .ev-table tbody tr:hover { background: var(--accent-lt); }
  .ev-table td { padding: 12px 16px; font-size: 13px; color: var(--t2); }
  .ev-interviewer-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), #7c3aed); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
  .ev-interviewer-name  { font-size: 13px; font-weight: 600; color: var(--t1); }
  .ev-interviewer-email { font-size: 11.5px; color: var(--t3); margin-top: 1px; }
  .ev-table-empty { padding: 40px 20px; text-align: center; }
  .ev-table-empty-icon { width: 52px; height: 52px; border-radius: 50%; background: var(--border-s); color: var(--t3); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; }
  .ev-table-empty-txt { font-size: 13px; color: var(--t3); font-weight: 500; }
  .ev-selected-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; background: var(--accent-lt); color: var(--accent); border: 1px solid var(--border); }
  .ev-check { width: 15px; height: 15px; accent-color: var(--accent); cursor: pointer; }

  /* ACTIONS */
  .ev-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
  .ev-btn-cancel { display: inline-flex; align-items: center; gap: 7px; padding: 10px 22px; border-radius: 9px; background: transparent; color: var(--t2); font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 600; border: 1px solid var(--border); cursor: pointer; transition: all .14s; }
  .ev-btn-cancel:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .ev-btn-save { display: inline-flex; align-items: center; gap: 7px; padding: 10px 28px; border-radius: 9px; background: var(--accent); color: #fff; font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 700; border: none; cursor: pointer; transition: background .15s; }
  .ev-btn-save:hover:not(:disabled) { background: var(--accent-h); }
  .ev-btn-save:disabled { opacity: .55; cursor: not-allowed; }
  .ev-spinner { width: 15px; height: 15px; border-radius: 50%; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; animation: ev-spin .6s linear infinite; flex-shrink: 0; }
  @keyframes ev-spin { to { transform: rotate(360deg); } }
  .ev-loading { min-height: 100vh; background: var(--bg); display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 14px; }
  .ev-loading-spinner { width: 44px; height: 44px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent); animation: ev-spin .7s linear infinite; }
  .ev-loading-txt { font-size: 14px; color: var(--t3); font-weight: 500; }

 @media (max-width: 768px) {
    .ev-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .ev-sb.open { transform: translateX(0); }
    .ev-main { margin-left: 0 !important; overflow-x: hidden; max-width: 100vw; }
    .ev-wrap { overflow-x: hidden; }
    .ev-page-outer { padding: 12px; overflow-x: hidden; }
    .ev-page { overflow-x: hidden; gap: 14px; }
    .ev-header { padding: 0 12px; gap: 6px; }
    .ev-hdr-sep { display: none; }
    .ev-btn-out { font-size: 12px; padding: 6px 10px; flex-shrink: 0; }
    .ev-form-grid, .ev-form-grid3 { grid-template-columns: 1fr; }
    .ev-select-wrap { max-width: 100%; }
    .ev-input { max-width: 100%; }
    .ev-card-body { padding: 14px; }
    .ev-card { overflow: hidden; }
    .ev-actions { flex-direction: column; }
    .ev-btn-cancel, .ev-btn-save { width: 100%; justify-content: center; }
  }
`

interface Interviewer { name: string; full_name: string; email: string }
interface InterviewRound { name: string; round_name: string }
interface Location { name: string }
interface InterviewLink { name: string; link: string }

function EventPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()



  const applicantId = searchParams.get('applicantId')
  const applicantName = searchParams.get('applicantName')
  const applicantEmail = searchParams.get('applicantEmail')
  const jobOpening = searchParams.get('jobOpening') || ""
  const clearedRoundsParam = searchParams.get('clearedRounds') || ""
  const interviewName = searchParams.get('interviewName') || ""
  const isReschedule = Boolean(interviewName)
  const clearedRounds = clearedRoundsParam ? clearedRoundsParam.split(",") : []
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    console.log("=== URL Parameters ===")
    console.log("applicantId:", applicantId)
    console.log("applicantName:", applicantName)
    console.log("applicantEmail:", applicantEmail)
    console.log("Full URL:", window.location.href)
  }, [applicantId, applicantName, applicantEmail])

  const [eventForm, setEventForm] = useState({
    interviewRound: "",
    jobApplicant: applicantId || "",
    resumeLink: "",
    meetingLink: "",
    location: "",
    interviewType: "",
    status: "Pending",
    scheduledOn: "",
    fromTime: "",
    toTime: "",
    interviewers: [] as string[],
  })

  const [availableInterviewers, setAvailableInterviewers] = useState<Interviewer[]>([])
  const [interviewRounds, setInterviewRounds] = useState<InterviewRound[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [interviewLinks, setInterviewLinks] = useState<InterviewLink[]>([])
  const [interviewTypes, setInterviewTypes] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const [interviewerSearch, setInterviewerSearch] = useState("")



  const statusOptions = ["Pending", "Under Review", "Cleared", "Rejected"]

  useEffect(() => {
    fetchInterviewers()
    fetchInterviewRounds()
    fetchLocations()
    fetchInterviewLinks()
    fetchInterviewTypes()
  }, [])

  useEffect(() => { document.title = 'Interview Scheduling' }, [])

  useEffect(() => {
    if (!interviewName) return
    const fetchExistingInterview = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/resource/Interview/${interviewName}`, {
          credentials: 'include', headers: { 'Content-Type': 'application/json' }
        })
        const data = await res.json()
        if (data?.data) {
          const d = data.data
          setEventForm(prev => ({
            ...prev,
            interviewRound: d.interview_round || "",
            resumeLink: d.resume_link || "",
            meetingLink: d.custom_meeting_link || "",
            location: d.custom_location || "",
            interviewType: d.custom_interview_type || "",
            status: d.status || "Pending",
            scheduledOn: d.scheduled_on || "",
            fromTime: d.from_time ? d.from_time.slice(0, 5) : "",
            toTime: d.to_time ? d.to_time.slice(0, 5) : "",
            interviewers: (d.interview_details || []).map((i: any) => i.interviewer),
          }))
        }
      } catch (err) { console.error("Error fetching existing interview:", err) }
    }
    fetchExistingInterview()
  }, [interviewName])

  const fetchInterviewLinks = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/resource/Interview Link?fields=["name","google_meet"]&limit_page_length=0`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const data = await response.json()
      if (data && data.data) {
        const mappedLinks = data.data.map((item: any) => ({ name: item.name, link: item.google_meet }))
        setInterviewLinks(mappedLinks)
        console.log("Fetched interview links:", mappedLinks)
      }
    } catch (error) { console.error("Error fetching interview links:", error) }
  }

  // const fetchLocations = async () => {
  //   try {
  //     const response = await fetch(
  //       `${API_BASE_URL}/api/resource/Location?fields=["name"]&limit_page_length=100`,
  //       { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
  //     )
  //     const data = await response.json()
  //     if (data && data.data) { setLocations(data.data); console.log("Fetched locations:", data.data) }
  //   } catch (error) { console.error("Error fetching locations:", error) }
  // }

  const fetchLocations = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/resource/Cost Center?fields=["name"]&filters=[["Cost Center","is_group","=",0]]&limit_page_length=0`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const data = await response.json()
      if (data && data.data) { setLocations(data.data); console.log("Fetched locations:", data.data) }
    } catch (error) { console.error("Error fetching locations:", error) }
  }

  const fetchInterviewRounds = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/resource/Interview Round?fields=["name","round_name"]&limit_page_length=0`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const data = await response.json()
      if (data && data.data) { setInterviewRounds(data.data); console.log("Fetched interview rounds:", data.data) }
    } catch (error) {
      console.error("Error fetching interview rounds:", error)
      setInterviewRounds([
        { name: "First Round", round_name: "First Round" },
        { name: "Second Round", round_name: "Second Round" },
        { name: "Final Round", round_name: "Final Round" },
      ])
    }
  }

  const fetchInterviewers = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/resource/User?fields=["name","full_name","email"]&filters=[["enabled","=",1]]&limit_page_length=0`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const data = await response.json()
      if (data && data.data) {
        const filteredUsers = data.data.filter(
          (user: any) => user.name !== "Administrator" && user.name !== "Guest"
        )
        setAvailableInterviewers(filteredUsers)
        console.log("Fetched interviewers:", filteredUsers)
      }
    } catch (error) { console.error("Error fetching interviewers:", error) }
  }

  const fetchInterviewTypes = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/resource/Custom Field?fields=["options"]&filters=[["Custom Field","dt","=","Interview"],["Custom Field","fieldname","=","custom_interview_type"]]&limit_page_length=1`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const data = await response.json()
      console.log("Custom field raw response:", data)

      if (data?.data?.[0]?.options) {
        const options = data.data[0].options
          .split("\n")
          .map((o: string) => o.trim())
          .filter(Boolean)
        setInterviewTypes(options)
        console.log("Fetched interview types:", options)
      } else {
        console.log("No options found - check fieldname exactly in Frappe")
      }
    } catch (error) {
      console.error("Error fetching interview types:", error)
    }
  }


  const handleInterviewerToggle = (interviewer: string) => {
    setEventForm(prev => ({
      ...prev,
      interviewers: prev.interviewers.includes(interviewer)
        ? prev.interviewers.filter(i => i !== interviewer)
        : [...prev.interviewers, interviewer],
    }))
  }

  // const handleSaveEvent = async () => {
  //   if (!eventForm.interviewRound || !eventForm.jobApplicant || !eventForm.scheduledOn || !eventForm.fromTime || !eventForm.toTime) {
  //     alert("Please fill all required fields")
  //     return
  //   }
  //   const selectedDate = new Date(eventForm.scheduledOn)
  //   const today = new Date()
  //   today.setHours(0, 0, 0, 0)
  //   selectedDate.setHours(0, 0, 0, 0)
  //   if (selectedDate < today) {
  //     alert("Cannot schedule interview for past dates. Please select today or a future date.")
  //     return
  //   }
  //   console.log("=== DEBUG ===");
  //   console.log("Meeting Link from state:", eventForm.meetingLink);
  //   setIsSaving(true)
  //   try {
  //     const interviewData = {
  //       doctype: "Interview",
  //       interview_round: eventForm.interviewRound,
  //       job_applicant: eventForm.jobApplicant,
  //       resume_link: eventForm.resumeLink || '',
  //       meeting_link: eventForm.meetingLink || '',
  //       location: eventForm.location || '',
  //       status: eventForm.status,
  //       scheduled_on: eventForm.scheduledOn,
  //       from_time: eventForm.fromTime,
  //       to_time: eventForm.toTime,
  //       interview_details: eventForm.interviewers.map((interviewer) => ({
  //         doctype: "Interview Detail",
  //         interviewer: interviewer
  //       }))
  //     };
  //     console.log("Interview data:", JSON.stringify(interviewData, null, 2));
  //     const csrfToken = await getFrappeCSRF();
  //     const response = await fetch(
  //       `${API_BASE_URL}/api/resource/Interview`,
  //       {
  //         method: 'POST',
  //         credentials: 'include',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           "X-Frappe-CSRF-Token": csrfToken
  //         },
  //         body: JSON.stringify(interviewData)
  //       }
  //     )
  //     const data = await response.json()
  //     console.log("✅ Full API Response:", data)
  //     console.log("✅ Response status:", response.ok)
  //     console.log("✅ Data structure:", JSON.stringify(data, null, 2))
  //     if (response.ok && data.data) {
  //       const interviewName = data.data.name
  //       console.log("✅ Created interview with ID:", interviewName)
  //       alert(`Interview ${interviewName || ''} created successfully!`)
  //       console.log("✅ Redirecting to /interviews page...")
  //       router.push('/interview')
  //     } else if (response.ok) {
  //       console.log("✅ Interview created successfully")
  //       alert(`Interview created successfully!`)
  //       router.push('/interview')
  //     } else {
  //       const errorMessage = data.message || data.exception || "Failed to create interview"
  //       console.error("❌ API Error:", errorMessage)
  //       alert(`Error: ${errorMessage}`)
  //     }
  //   } catch (error: any) {
  //     console.error("❌ Error creating interview:", error)
  //     const errorMsg = error.message || "Failed to create interview"
  //     alert(`Error: ${errorMsg}`)
  //   } finally {
  //     setIsSaving(false)
  //   }
  // }

  const handleSaveEvent = async () => {
    if (!eventForm.interviewRound || !eventForm.jobApplicant || !eventForm.scheduledOn || !eventForm.fromTime || !eventForm.toTime) {
      alert("Please fill all required fields")
      return
    }
    if (!eventForm.location) {
      alert("Please select a location")
      return
    }
    if (eventForm.interviewers.length === 0) {
      alert("Please select at least one interviewer")
      return
    }
    const selectedDate = new Date(eventForm.scheduledOn)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      alert("Cannot schedule interview for past dates. Please select today or a future date.")
      return
    }

    // 🔴 ADD THIS ENTIRE BLOCK — reschedule branch, sabse pehle check
    if (isReschedule) {
      setIsSaving(true)
      try {
        const csrfToken = await getFrappeCSRF()
        const updatePayload = {
          status: eventForm.status,
          scheduled_on: eventForm.scheduledOn,
          from_time: eventForm.fromTime,
          to_time: eventForm.toTime,
          custom_location: eventForm.location,
          custom_meeting_link: eventForm.meetingLink,
          custom_interview_type: eventForm.interviewType,
          interview_details: eventForm.interviewers.map((interviewer) => ({
            doctype: "Interview Detail",
            interviewer,
          }))
        }
        const response = await fetch(`${API_BASE_URL}/api/resource/Interview/${interviewName}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', "X-Frappe-CSRF-Token": csrfToken },
          body: JSON.stringify(updatePayload)
        })
        const data = await response.json()
        if (response.ok && data.data) {
          alert(`Interview rescheduled successfully!`)
          router.push('/interview')
        } else {
          alert(`Error: ${data.message || data.exception || "Failed to reschedule"}`)
        }
      } catch (error: any) {
        alert(`Error: ${error.message}`)
      } finally {
        setIsSaving(false)
      }
      return   // 🔴 yahan se function exit — neeche wala pura create-flow skip
    }
    // if (eventForm.fromTime && eventForm.toTime) {
    //   const fromTime = new Date(`2000-01-01T${eventForm.fromTime}`)
    //   const toTime = new Date(`2000-01-01T${eventForm.toTime}`)
    //   if (fromTime >= toTime) { alert("To Time must be later than From Time"); return }
    // }

    // // REPLACE the duplicate check block with this:
    // try {
    //   const existingRes = await fetch(
    if (eventForm.fromTime && eventForm.toTime) {
      const fromTime = new Date(`2000-01-01T${eventForm.fromTime}`)
      const toTime = new Date(`2000-01-01T${eventForm.toTime}`)
      if (fromTime >= toTime) { alert("To Time must be later than From Time"); return }
    }

    // ✅ NEW: Prevent rescheduling same round at same date+time
    try {
      const sameTimeRes = await fetch(
        `${API_BASE_URL}/api/resource/Interview?` +
        `filters=[["job_applicant","=","${eventForm.jobApplicant}"],["interview_round","=","${eventForm.interviewRound}"],["scheduled_on","=","${eventForm.scheduledOn}"],["from_time","=","${eventForm.fromTime}:00"]]` +
        `&fields=["name","scheduled_on","from_time","to_time","status"]&limit_page_length=1`,
        {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      )
      const sameTimeData = await sameTimeRes.json()
      console.log("Same time check:", sameTimeData)

      if (sameTimeData.data && sameTimeData.data.length > 0) {
        const existing = sameTimeData.data[0]
        alert(
          `Cannot reschedule at the same time!\n\n` +
          `"${eventForm.interviewRound}" is already scheduled on ${eventForm.scheduledOn} at ${eventForm.fromTime}.\n\n` +
          `Please choose a different date or time.`
        )
        return
      }
    } catch (err) {
      console.error("Same time validation failed:", err)
    }

    // REPLACE the duplicate check block with this:
    try {
      const existingRes = await fetch(
        `${API_BASE_URL}/api/resource/Interview?` +
        `filters=[["job_applicant","=","${eventForm.jobApplicant}"],["interview_round","=","${eventForm.interviewRound}"],["status","=","Cleared"]]` +
        `&fields=["name","status","interview_round"]&limit_page_length=1`,
        {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      )
      const existingData = await existingRes.json()
      console.log("Cleared round check:", existingData)

      if (existingData.data && existingData.data.length > 0) {
        alert(`"${eventForm.interviewRound}" is already Cleared for this candidate. You cannot schedule the same round again. Please select a different round.`)
        return
      }
    } catch (err) {
      console.error("Round validation failed:", err)
    }


    // BLOCK 3 — Round order validation: must schedule rounds in sequence
    try {
      // Fetch all interview rounds in order (assumes round names are ordered in the system)
      const allRoundsRes = await fetch(
        `${API_BASE_URL}/api/resource/Interview Round?fields=["name","round_name"]&limit_page_length=0`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const allRoundsData = await allRoundsRes.json()
      const orderedRounds: string[] = (allRoundsData.data || []).map((r: any) => r.name)

      const selectedRoundIndex = orderedRounds.indexOf(eventForm.interviewRound)

      if (selectedRoundIndex > 0) {
        // There are rounds before this one — check all previous rounds have been scheduled
        const previousRounds = orderedRounds.slice(0, selectedRoundIndex)

        const existingRoundsRes = await fetch(
          `${API_BASE_URL}/api/resource/Interview?` +
          `filters=[["job_applicant","=","${eventForm.jobApplicant}"]]` +
          `&fields=["name","interview_round","status"]&limit_page_length=0`,
          { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
        )
        const existingRoundsData = await existingRoundsRes.json()
        const scheduledRoundNames: string[] = (existingRoundsData.data || []).map((i: any) => i.interview_round)

        for (const prevRound of previousRounds) {
          if (!scheduledRoundNames.includes(prevRound)) {
            alert(
              `Round order violation!\n\n` +
              `You cannot schedule "${eventForm.interviewRound}" before "${prevRound}" has been scheduled.\n\n` +
              `Please schedule rounds in order.`
            )
            return
          }
        }
      }
    } catch (err) {
      console.error("Round order validation failed:", err)
    }


    // BLOCK 2 — NEW: prevent scheduling next round if previous cleared round has no feedback
    try {
      const clearedRes = await fetch(
        `${API_BASE_URL}/api/resource/Interview?` +
        `filters=[["job_applicant","=","${eventForm.jobApplicant}"],["status","=","Cleared"]]` +
        `&fields=["name","interview_round","scheduled_on"]&order_by=scheduled_on desc&limit_page_length=1`,
        {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      )
      const clearedData = await clearedRes.json()
      console.log("Last cleared interview check:", clearedData)

      if (clearedData.data && clearedData.data.length > 0) {
        const lastClearedInterview = clearedData.data[0]

        const feedbackRes = await fetch(
          `${API_BASE_URL}/api/resource/Interview Feedback?` +
          `filters=[["interview","=","${lastClearedInterview.name}"]]` +
          `&fields=["name"]&limit_page_length=1`,
          {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          }
        )
        const feedbackData = await feedbackRes.json()
        console.log("Feedback check for last cleared interview:", feedbackData)

        if (!feedbackData.data || feedbackData.data.length === 0) {
          alert(
            `Cannot schedule next round!\n\n` +
            `The previous round "${lastClearedInterview.interview_round}" was cleared but feedback has not been submitted yet.\n\n` +
            `Please submit feedback for interview "${lastClearedInterview.name}" before scheduling the next round.`
          )
          return
        }
      }
    } catch (err) {
      console.error("Feedback validation failed:", err)
    }





    setIsSaving(true)
    try {
      // const interviewData = {
      //   doctype: "Interview",
      //   interview_round: eventForm.interviewRound,
      //   job_applicant: eventForm.jobApplicant,
      //   resume_link: eventForm.resumeLink || '',
      //   custom_meeting_link: eventForm.meetingLink || '',
      //   custom_location: eventForm.location || '',
      //   status: eventForm.status,
      //   scheduled_on: eventForm.scheduledOn,
      //   from_time: eventForm.fromTime,
      //   to_time: eventForm.toTime,
      //   interview_details: eventForm.interviewers.map((interviewer) => ({
      //     doctype: "Interview Detail",
      //     interviewer,
      //   }))
      // }

      const interviewData = {
        doctype: "Interview",
        interview_round: eventForm.interviewRound,
        job_applicant: eventForm.jobApplicant,
        custom_interview_type: eventForm.interviewType,
        resume_link: eventForm.resumeLink || '',
        custom_meeting_link: eventForm.meetingLink || '',
        custom_location: eventForm.location || '',
        status: eventForm.status,
        scheduled_on: eventForm.scheduledOn,
        from_time: eventForm.fromTime,
        to_time: eventForm.toTime,
        interview_details: eventForm.interviewers.map((interviewer) => ({
          doctype: "Interview Detail",
          interviewer,
        }))
      }

      console.log("Creating interview:", JSON.stringify(interviewData, null, 2))
      const csrfToken = await getFrappeCSRF()

      const response = await fetch(`${API_BASE_URL}/api/resource/Interview`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', "X-Frappe-CSRF-Token": csrfToken },
        body: JSON.stringify(interviewData)
      })
      const data = await response.json()
      console.log("✅ API Response:", data)
      if (response.ok) {
        alert(`Interview created successfully!`)
        router.push('/interview')
      } else {
        const errorMessage = data.message || data.exception || "Failed to create interview"
        console.error("❌ Error:", errorMessage)
        alert(`Error: ${errorMessage}`)
      }
    } catch (error: any) {
      console.error("❌ Error:", error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
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
      <div className="ev">
        <div className="ev-wrap">
          <div className={`ev-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

          {/* SIDEBAR */}
          <aside className={`ev-sb${sidebarOpen ? "" : " collapsed"}`}>
            <div className="ev-sb-brand">
              <div className="ev-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
              <div><div className="ev-sb-name">Job Management</div><div className="ev-sb-sub">HR Platform</div></div>
              <button className="ev-sb-close" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
            </div>
            <nav className="ev-nav">
              <a href="/create-job" className="ev-nav-cta"><Plus size={14} /> New Job Opening</a>
              <div className="ev-nav-lbl">General</div>
              <Link href="/home" className="ev-nav-link">
                <Home size={15} /> Home
              </Link>
              <div className="ev-nav-lbl">Pipeline</div>
              {sidebarPipeline.map(s => (
                <a key={s.href} href={s.href} className={`ev-nav-link${s.href === "/interview" ? " active" : ""}`}>
                  {s.icon} {s.title}
                </a>
              ))}
              <div className="ev-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
              {sidebarClosing.map(s => (
                <a key={s.href} href={s.href} className="ev-nav-link">{s.icon} {s.title}</a>
              ))}
            </nav>
            <div className="ev-sb-foot">
              <button className="ev-logout"><LogOut size={15} /> Sign out</button>
            </div>
          </aside>

          {/* MAIN */}
          <div className={`ev-main${sidebarOpen ? "" : " sb-closed"}`}>
            <header className="ev-header">
              <button className="ev-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
              <div className="ev-hdr-sep" />
              <button className="ev-btn-out" onClick={() => router.back()}><ArrowLeft size={13} /> Back</button>
              <div className="ev-hdr-sep" />
              {/* <div className="ev-crumb">
                <Home size={13} /> Home <ChevronRight size={13} />
                <a href="/interview" style={{ color: 'var(--t3)', textDecoration: 'none' }}>Interview Management</a>
                <ChevronRight size={13} /> <strong>Schedule Interview</strong>
              </div> */}
              <div className="ev-crumb">
                <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'inherit', textDecoration: 'none' }}>
                  <Home size={13} /> Home
                </Link>
                <ChevronRight size={13} />
                <a href="/interview" style={{ color: 'var(--t3)', textDecoration: 'none' }}>Interview Management</a>
                <ChevronRight size={13} />
                <strong>Schedule Interview</strong>
              </div>
            </header>

            {/* CENTRED CONTENT */}
            <div className="ev-page-outer">
              <div className="ev-page">

                <div>
                  <h1 className="ev-page-title">Schedule New Interview</h1>
                  <p className="ev-page-sub">Create and schedule a new interview event for candidates</p>
                </div>

                {applicantId && applicantName && (
                  <div className="ev-applicant-banner">
                    <div className="ev-applicant-avatar"><Users size={22} /></div>
                    <div>
                      <div className="ev-applicant-label">Interview Candidate</div>
                      <div className="ev-applicant-name">{applicantName}</div>
                    </div>
                  </div>
                )}

                {!applicantId && (
                  <div className="ev-warning">
                    <AlertCircle size={16} />
                    <span className="ev-warning-txt">No applicant selected. Please go back and select a candidate.</span>
                  </div>
                )}

                {/* Interview Details card */}
                <div className="ev-card">
                  <div className="ev-card-head">
                    <div className="ev-card-title"><Calendar size={15} /> Interview Details</div>
                  </div>
                  <div className="ev-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {/* <div className="ev-form-grid">
                      <div className="ev-form-field">
                        <label className="ev-label"><CheckCircle2 size={12} /> Interview Round <span className="ev-req">*</span></label>
                        {interviewRounds.length > 0 ? (
                          <div className="ev-select-wrap">
                            <select className="ev-select" value={eventForm.interviewRound} onChange={e => setEventForm({ ...eventForm, interviewRound: e.target.value })}>
                              <option value="">Select interview round</option>
                              {interviewRounds.map(r => <option key={r.name} value={r.name}>{r.round_name || r.name}</option>)}
                            </select>
                            <ChevronRight size={13} className="ev-select-arrow" />
                          </div>
                        ) : (
                          <input className="ev-input" value={eventForm.interviewRound} onChange={e => setEventForm({ ...eventForm, interviewRound: e.target.value })} placeholder="Loading rounds..." disabled />
                        )}
                      </div>
                      <div className="ev-form-field">
                        <label className="ev-label">Status <span className="ev-req">*</span></label>
                        <div className="ev-select-wrap">
                          <select className="ev-select" value={eventForm.status} onChange={e => setEventForm({ ...eventForm, status: e.target.value })}>
                            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronRight size={13} className="ev-select-arrow" />
                        </div>
                      </div>
                    </div> */}
                    <div className="ev-form-grid3">                          {/* ← change grid to grid3 */}

                      {/* EXISTING — Interview Round */}
                      <div className="ev-form-field">
                        <label className="ev-label"><CheckCircle2 size={12} /> Interview Round <span className="ev-req">*</span></label>
                        {interviewRounds.length > 0 ? (
                          <div className="ev-select-wrap">
                            <select className="ev-select" value={eventForm.interviewRound} onChange={e => setEventForm({ ...eventForm, interviewRound: e.target.value })}>
                              <option value="">Select interview round</option>
                              {interviewRounds.map(r => <option key={r.name} value={r.name}>{r.round_name || r.name}</option>)}
                            </select>
                            <ChevronRight size={13} className="ev-select-arrow" />
                          </div>
                        ) : (
                          <input className="ev-input" value={eventForm.interviewRound} onChange={e => setEventForm({ ...eventForm, interviewRound: e.target.value })} placeholder="Loading rounds..." disabled />
                        )}
                      </div>

                      {/* ↓ ADD HERE — Interview Type (new field) */}
                      <div className="ev-form-field">
                        <label className="ev-label">Interview Type</label>
                        {interviewTypes.length > 0 ? (
                          <div className="ev-select-wrap">
                            <select
                              className="ev-select"
                              value={eventForm.interviewType}
                              onChange={e => setEventForm({ ...eventForm, interviewType: e.target.value })}
                            >
                              <option value="">Select interview type</option>
                              {interviewTypes.map(t => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                            <ChevronRight size={13} className="ev-select-arrow" />
                          </div>
                        ) : (
                          <input className="ev-input" placeholder="Loading types..." disabled />
                        )}
                      </div>

                      {/* EXISTING — Status */}
                      <div className="ev-form-field">
                        <label className="ev-label">Status <span className="ev-req">*</span></label>
                        <div className="ev-select-wrap">
                          <select className="ev-select" value={eventForm.status} onChange={e => setEventForm({ ...eventForm, status: e.target.value })}>
                            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronRight size={13} className="ev-select-arrow" />
                        </div>
                      </div>

                    </div>

                    <div className="ev-form-field">
                      <label className="ev-label"><FileText size={12} /> Resume Link</label>
                      <input type="url" className="ev-input" value={eventForm.resumeLink} onChange={e => setEventForm({ ...eventForm, resumeLink: e.target.value })} placeholder="https://example.com/resume.pdf" />
                    </div>

                    <div className="ev-form-field">
                      <label className="ev-label"><Video size={12} /> Meeting Link</label>
                      <input type="url" className="ev-input" value={eventForm.meetingLink} onChange={e => setEventForm({ ...eventForm, meetingLink: e.target.value })} placeholder="Enter meeting link or select from saved links" list="meeting-links" />
                      {interviewLinks.length > 0 && (
                        <datalist id="meeting-links">
                          {interviewLinks.map(l => <option key={l.name} value={l.link} />)}
                        </datalist>
                      )}
                    </div>

                    {/* <div className="ev-form-field">
                      <label className="ev-label"><MapPin size={12} /> Location</label>
                      {locations.length > 0 ? (
                        <div className="ev-select-wrap">
                          <select className="ev-select" value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })}>
                            <option value="">Select location</option>
                            {locations.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
                          </select>
                          <ChevronRight size={13} className="ev-select-arrow" />
                        </div>
                      ) : (
                        <input className="ev-input" value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} placeholder="Loading locations..." disabled />
                      )}
                    </div> */}
                    <div className="ev-form-field">
                      {/* <label className="ev-label"><MapPin size={12} /> Location</label> */}
                      <label className="ev-label"><MapPin size={12} /> Location <span className="ev-req">*</span></label>
                      <SearchableSelect
                        value={eventForm.location}
                        onChange={val => setEventForm({ ...eventForm, location: val })}
                        options={locations.map(l => l.name)}
                        placeholder="Select location"
                      />
                    </div>

                    <div className="ev-form-grid3">
                      <div className="ev-form-field">
                        <label className="ev-label"><Calendar size={12} /> Date <span className="ev-req">*</span></label>
                        <input type="date" className="ev-input" value={eventForm.scheduledOn} onChange={e => setEventForm({ ...eventForm, scheduledOn: e.target.value })} onClick={e => (e.target as HTMLInputElement).showPicker?.()} style={{ cursor: 'pointer' }} />
                      </div>
                      <div className="ev-form-field">
                        <label className="ev-label"><Clock size={12} /> From <span className="ev-req">*</span></label>
                        <input type="time" className="ev-input" value={eventForm.fromTime} onChange={e => setEventForm({ ...eventForm, fromTime: e.target.value })} onFocus={e => (e.target as HTMLInputElement).showPicker?.()} style={{ cursor: 'pointer' }} placeholder="HH:MM" />
                      </div>
                      <div className="ev-form-field">
                        <label className="ev-label"><Clock size={12} /> To <span className="ev-req">*</span></label>
                        <input type="time" className="ev-input" value={eventForm.toTime} onChange={e => setEventForm({ ...eventForm, toTime: e.target.value })} onFocus={e => (e.target as HTMLInputElement).showPicker?.()} min={eventForm.fromTime} style={{ cursor: 'pointer' }} placeholder="HH:MM" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interviewers card */}
                {/* <div className="ev-card">
                  <div className="ev-card-head">
                    <div className="ev-card-title"><Users size={15} /> Select Interviewers</div>
                    {eventForm.interviewers.length > 0 && (
                      <span className="ev-selected-badge">{eventForm.interviewers.length} selected</span>
                    )}
                  </div>
                  <div className="ev-table-scroll">
                    <table className="ev-table">
                      <thead>
                        <tr>
                          <th style={{ width: 48 }}><input type="checkbox" className="ev-check" disabled /></th>
                          <th style={{ width: 56 }}>No.</th>
                          <th>Interviewer Details</th>
                        </tr>
                      </thead> */}
                <div className="ev-card">
                  <div className="ev-card-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {/* <div className="ev-card-title"><Users size={15} /> Select Interviewers</div> */}
                    <div className="ev-card-title"><Users size={15} /> Select Interviewers <span className="ev-req">*</span></div>
                    {eventForm.interviewers.length > 0 && (
                      <span className="ev-selected-badge">{eventForm.interviewers.length} selected</span>
                    )}
                  </div>

                  {/* Search bar */}
                  <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border-s)", background: "#fff" }}>
                    <input
                      className="ev-input"
                      style={{ height: 38, fontSize: 13 }}
                      placeholder="Search interviewers by name or email..."
                      value={interviewerSearch}
                      onChange={e => setInterviewerSearch(e.target.value)}
                    />
                  </div>

                  <div className="ev-table-scroll">
                    <table className="ev-table">
                      <thead>
                        <tr>
                          <th style={{ width: 48 }}><input type="checkbox" className="ev-check" disabled /></th>
                          <th style={{ width: 56 }}>No.</th>
                          <th>Interviewer Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {availableInterviewers.length > 0 ? (
                          availableInterviewers
                            .filter(i =>
                              i.full_name?.toLowerCase().includes(interviewerSearch.toLowerCase()) ||
                              i.email?.toLowerCase().includes(interviewerSearch.toLowerCase()) ||
                              i.name?.toLowerCase().includes(interviewerSearch.toLowerCase())
                            )
                            .map((interviewer, index) => (
                              <tr key={interviewer.name} onClick={() => handleInterviewerToggle(interviewer.name)}>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="ev-check"
                                    checked={eventForm.interviewers.includes(interviewer.name)}
                                    onChange={() => handleInterviewerToggle(interviewer.name)}
                                    onClick={e => e.stopPropagation()}
                                  />
                                </td>
                                <td style={{ color: 'var(--t3)', fontWeight: 600 }}>{index + 1}</td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div className="ev-interviewer-avatar">
                                      {(interviewer.full_name || interviewer.name).charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="ev-interviewer-name">{interviewer.full_name || interviewer.name}</div>
                                      <div className="ev-interviewer-email">{interviewer.email}</div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr><td colSpan={3}>
                            <div className="ev-table-empty">
                              <div className="ev-table-empty-icon"><Users size={22} /></div>
                              <div className="ev-table-empty-txt">Loading interviewers...</div>
                            </div>
                          </td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="ev-actions">
                  <button className="ev-btn-cancel" onClick={() => router.back()}>Cancel</button>
                  <button className="ev-btn-save" onClick={handleSaveEvent} disabled={isSaving || !applicantId}>
                    {isSaving ? <><span className="ev-spinner" /> Saving...</> : "Create Interview"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

function SearchableSelect({ value, onChange, options, placeholder }: {
  value: string
  onChange: (val: string) => void
  options: string[]
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()))

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        className="ev-input"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", height: 44 }}
        onClick={() => { setOpen(o => !o); setSearch("") }}
      >
        <span style={{ color: value ? "var(--t1)" : "var(--t3)" }}>{value || placeholder}</span>
        <ChevronRight size={14} style={{ transform: open ? "rotate(270deg)" : "rotate(90deg)", color: "var(--t3)", transition: "transform .2s" }} />
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 9999,
          background: "#fff", border: "1px solid var(--border)", borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,.12)", overflow: "hidden"
        }}>
          <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--border-s)" }}>
            <input
              autoFocus
              className="ev-input"
              style={{ height: 34, fontSize: 13 }}
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {filtered.length === 0
              ? <div style={{ padding: "12px 14px", color: "var(--t3)", fontSize: 13 }}>No results found</div>
              : filtered.map(opt => (
                <div key={opt} onClick={() => { onChange(opt); setOpen(false) }}
                  style={{
                    padding: "9px 14px", fontSize: 13.5, cursor: "pointer",
                    background: opt === value ? "var(--accent-lt)" : "transparent",
                    color: opt === value ? "var(--accent)" : "var(--t1)",
                    transition: "background .12s"
                  }}
                  onMouseEnter={e => { if (opt !== value) (e.target as HTMLElement).style.background = "var(--bg)" }}
                  onMouseLeave={e => { if (opt !== value) (e.target as HTMLElement).style.background = "transparent" }}
                >
                  {opt}
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  )
}

export default function EventPage() {
  return (
    <Suspense fallback={
      <div className="ev">
        <style>{css}</style>
        <div className="ev-loading">
          <div className="ev-loading-spinner" />
          <div className="ev-loading-txt">Loading...</div>
        </div>
      </div>
    }>
      <EventPageContent />
    </Suspense>
  )
}
