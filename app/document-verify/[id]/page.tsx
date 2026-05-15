// "use client"
// import { useState, useEffect, use } from "react"
// import {
//     Upload, X, Check, FileText, User,
//     CheckCircle2, Loader2, Zap, AlertCircle
// } from "lucide-react"
// import { API_BASE_URL } from '@/lib/api-config'

// const ACCEPTED_FILE_TYPES = ".jpg,.jpeg,.doc,.pdf,.docx"
// const ACCEPTED_MIME_TYPES = ["image/jpeg", "application/msword", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

// const validateFile = (file: File): boolean => {
//     return ACCEPTED_MIME_TYPES.includes(file.type)
// }

// const css = `
//   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   .dv {
//     --accent:    #009ef7;
//     --accent-h:  #007ec4;
//     --accent-lt: #e0f4ff;
//     --bg:        #f0f8fe;
//     --card:      #ffffff;
//     --border:    #cce8f8;
//     --border-s:  #ddf0fb;
//     --t1:        #0d1b2a;
//     --t2:        #2d5a78;
//     --t3:        #6a9cb8;
//     --green:     #16a34a;
//     --green-lt:  #dcfce7;
//     font-family: 'Inter', system-ui, sans-serif;
//     font-size: 13.5px;
//     -webkit-font-smoothing: antialiased;
//   }

//   .dv-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); justify-content: center; }

//   .dv-main {
//     flex: 1; display: flex; flex-direction: column;
//     min-height: 100vh; width: 100%; max-width: 1200px;
//   }

//   .dv-header {
//     height: 70px; background: transparent; 
//     display: flex; align-items: center; padding: 0 32px; gap: 12px;
//     margin-top: 20px;
//   }
//   .dv-brand { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 20px; color: var(--t1); }
//   .dv-brand img { height: 32px; width: auto; }

//   .dv-page-outer { flex: 1; display: flex; justify-content: center; padding: 10px 32px 40px; }
//   .dv-page { width: 100%; display: flex; flex-direction: column; gap: 22px; }

//   .dv-toolbar { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
//   .dv-page-title { font-size: 24px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; }
//   .dv-page-sub { font-size: 14px; color: var(--t3); }

//   .dv-card {
//     background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
//     overflow: hidden; box-shadow: 0 4px 12px rgba(0,158,247,.04);
//   }
//   .dv-card-head {
//     padding: 16px 22px; border-bottom: 1px solid var(--border-s);
//     background: linear-gradient(to right, #f8fbff, #eef7ff);
//     display: flex; align-items: center; gap: 10px;
//   }
//   .dv-card-head svg { color: var(--accent); }
//   .dv-card-title { font-size: 14px; font-weight: 700; color: var(--t1); letter-spacing: -0.2px; }
//   .dv-card-body { padding: 22px; }

//   .dv-spin { animation: dv-spin 1s linear infinite; }
//   @keyframes dv-spin { to { transform: rotate(360deg); } }

//   .dv-label {
//     display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: var(--t2);
//     margin-bottom: 8px; margin-top: 18px;
//   }
//   .dv-label:first-child { margin-top: 0; }
//   .dv-required { color: #ef4444; }

//   .dv-readonly-field {
//     width: 100%; height: 44px; padding: 0 14px; border-radius: 9px;
//     border: 1px solid var(--border); background: #f8fbff; color: var(--t1);
//     font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 10px;
//     cursor: default;
//   }

//   .dv-upload-zone { border: 2px dashed var(--border); border-radius: 10px; transition: border-color .15s; background: #fafcff; }
//   .dv-upload-zone:hover { border-color: var(--accent); }

//   .dv-file-existing {
//     display: flex; align-items: center; justify-content: space-between;
//     background: linear-gradient(to right, var(--green-lt), #d1fae5);
//     border-radius: 9px; padding: 12px 14px; border: 1px solid #bbf7d0;
//   }
//   .dv-file-new {
//     display: flex; align-items: center; justify-content: space-between;
//     background: linear-gradient(to right, var(--accent-lt), #e0eaff);
//     border-radius: 9px; padding: 12px 14px; border: 1px solid var(--border);
//   }
//   .dv-file-info { display: flex; align-items: center; gap: 12px; }
//   .dv-file-icon {
//     width: 36px; height: 36px; border-radius: 9px;
//     display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//     box-shadow: 0 2px 5px rgba(0,0,0,.1);
//   }
//   .dv-file-icon.green { background: linear-gradient(135deg, var(--green), #22c55e); }
//   .dv-file-icon.blue { background: linear-gradient(135deg, var(--accent), #3b82f6); }
//   .dv-file-icon svg { color: #fff; width: 15px; height: 15px; }
//   .dv-file-name { font-size: 13px; font-weight: 600; color: var(--t1); }
//   .dv-file-link { font-size: 11.5px; color: var(--accent); font-weight: 500; text-decoration: none; }
//   .dv-file-link:hover { text-decoration: underline; }
//   .dv-file-meta { font-size: 11.5px; color: var(--t3); }
//   .dv-file-remove {
//     width: 28px; height: 28px; border-radius: 7px; background: none; border: none;
//     cursor: pointer; display: flex; align-items: center; justify-content: center;
//     color: #ef4444; flex-shrink: 0; transition: background .14s;
//   }
//   .dv-file-remove:hover { background: #fef2f2; }

//   .dv-upload-trigger {
//     display: flex; flex-direction: column; align-items: center; justify-content: center;
//     cursor: pointer; padding: 20px 16px; gap: 8px;
//   }
//   .dv-upload-trigger-icon {
//     width: 44px; height: 44px; border-radius: 50%;
//     background: linear-gradient(135deg, var(--accent), #3b82f6);
//     display: flex; align-items: center; justify-content: center;
//     box-shadow: 0 3px 8px rgba(0,158,247,.3); transition: box-shadow .15s;
//   }
//   .dv-upload-trigger-icon svg { color: #fff; width: 20px; height: 20px; }
//   .dv-upload-trigger-label { font-size: 13px; font-weight: 600; color: var(--t2); }
//   .dv-upload-trigger-sub { font-size: 11.5px; color: var(--t3); text-align: center; }

//   .dv-multi-files { display: flex; flex-direction: column; gap: 8px; padding: 10px; }
//   .dv-add-more {
//     display: flex; align-items: center; justify-content: center; gap: 6px;
//     cursor: pointer; padding: 10px; border: 2px dashed var(--border-s);
//     border-radius: 8px; transition: border-color .15s; margin-top: 2px;
//   }
//   .dv-add-more:hover { border-color: var(--accent); }
//   .dv-add-more svg, .dv-add-more-label { color: var(--t3); font-weight: 600; font-size: 11.5px;}

//   .dv-field-wrap { margin-bottom: 20px; }
//   .dv-doc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

//   .dv-save-wrap { display: flex; justify-content: flex-end; padding-bottom: 8px; margin-top: 10px; }
//   .dv-save-btn {
//     display: flex; align-items: center; gap: 8px; padding: 14px 36px; border-radius: 9px;
//     background: var(--accent); color: #fff; border: none; cursor: pointer;
//     font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600;
//     box-shadow: 0 4px 14px rgba(0,158,247,.3); transition: all .15s;
//   }
//   .dv-save-btn:hover:not(:disabled) { background: var(--accent-h); transform: translateY(-1px); }
//   .dv-save-btn:disabled { opacity: 0.55; cursor: not-allowed; }

//   @media (max-width: 768px) {
//     .dv-page-outer { padding: 16px; }
//     .dv-header { padding: 0 16px; margin-top: 10px; }
//     .dv-doc-grid { grid-template-columns: 1fr; }
//   }
// `

// interface ExistingDocument {
//     name: string; applicant_name: string; employee: string;
//     aadhar_card: string | null; passport: string | null; experience: string | null;
//     education: string | null; bank_details: string | null; pan: string | null;
//     medical: string | null; photos: string | null;
//     custom_background_verification: string | null; custom_salary_slip: string | null; custom_additional_document: string | null;
// }

// export default function PublicDocumentVerifyPage({ params }: { params: Promise<{ id: string }> }) {
//     const resolvedParams = use(params)
//     // const applicantId = decodeURIComponent(resolvedParams.id)
//     const token = decodeURIComponent(resolvedParams.id)

//     const [applicantId, setApplicantId] = useState("")

//     const [documentForm, setDocumentForm] = useState({
//         aadharCard: null as File | null, passport: null as File | null,
//         experience: null as File | null, education: null as File | null,
//         bankDetails: null as File | null, pan: null as File | null,
//         medical: null as File | null, photos: null as File | null,
//         backgroundVerification: [] as File[], salarySlip: [] as File[], additionalDocument: [] as File[],
//     })

//     const [existingDocumentId, setExistingDocumentId] = useState<string | null>(null)
//     const [existingFiles, setExistingFiles] = useState<{ [key: string]: string }>({})
//     const [existingMultipleFiles, setExistingMultipleFiles] = useState<{ [key: string]: string[] }>({
//         backgroundVerification: [], salarySlip: [], additionalDocument: []
//     })

//     const [isSaving, setIsSaving] = useState(false)
//     const [isLoadingExisting, setIsLoadingExisting] = useState(true)
//     const [isSubmitted, setIsSubmitted] = useState(false)
//     const [isValidApplicant, setIsValidApplicant] = useState(false)

//     const [otp, setOtp] = useState("")
//     const [otpVerified, setOtpVerified] = useState(false)
//     const [otpLoading, setOtpLoading] = useState(false)
//     const [timeLeft, setTimeLeft] = useState(900)

//     useEffect(() => { document.title = 'Secure Document Upload' }, [])

//     // useEffect(() => {

//     //     const initPage = async () => {

//     //         if (!token) return;

//     //         const res = await fetch(
//     //             `/internal/applicant-document/token-verify?token=${token}`
//     //         );

//     //         const data = await res.json();

//     //         if (!data.valid) {
//     //             setIsValidApplicant(false);
//     //             setIsLoadingExisting(false);
//     //             return;
//     //         }

//     //         setApplicantId(data.email);

//     //         const alreadySubmitted =
//     //             await validateAndFetch(data.email);

//     //         if (alreadySubmitted) return;

//     //         // ✅ check token session
//     //         const verified =
//     //             localStorage.getItem(
//     //                 "otp_verified_" + token
//     //             );

//     //         const expiry =
//     //             localStorage.getItem(
//     //                 "otp_expire_" + token
//     //             );

//     //         const now = new Date().getTime();

//     //         if (
//     //             verified === "true" &&
//     //             expiry &&
//     //             now < Number(expiry)
//     //         ) {
//     //             setOtpVerified(true);
//     //             return;
//     //         }

//     //         // remove old token session
//     //         localStorage.removeItem(
//     //             "otp_verified_" + token
//     //         );

//     //         localStorage.removeItem(
//     //             "otp_expire_" + token
//     //         );

//     //         // send OTP
//     //         sendOtp(false, data.email);
//     //     };

//     //     initPage();

//     // }, [token]);

//     useEffect(() => {

//         const initPage = async () => {

//             if (!token) return;

//             const res = await fetch(
//                 `/internal/applicant-document/token-verify?token=${token}`
//             );

//             const data = await res.json();

//             if (!data.valid) {
//                 setIsValidApplicant(false);
//                 setIsLoadingExisting(false);
//                 return;
//             }

//             setApplicantId(data.email);

//             const alreadySubmitted =
//                 await validateAndFetch(data.email);

//             if (alreadySubmitted) return;

//             const verified =
//                 localStorage.getItem(
//                     "otp_verified_" + token
//                 );

//             const expiry =
//                 localStorage.getItem(
//                     "otp_expire_" + token
//                 );

//             const now = new Date().getTime();

//             // CASE 1: already verified
//             if (
//                 verified === "true" &&
//                 expiry &&
//                 now < Number(expiry)
//             ) {
//                 setOtpVerified(true);

//                 setTimeLeft(
//                     Math.floor(
//                         (Number(expiry) - now) / 1000
//                     )
//                 );

//                 return;
//             }

//             // CASE 2: OTP already sent but not verified
//             if (
//                 expiry &&
//                 now < Number(expiry)
//             ) {
//                 setOtpVerified(false);

//                 setTimeLeft(
//                     Math.floor(
//                         (Number(expiry) - now) / 1000
//                     )
//                 );

//                 return;
//             }

//             // CASE 3: expired
//             localStorage.removeItem(
//                 "otp_verified_" + token
//             );

//             localStorage.removeItem(
//                 "otp_expire_" + token
//             );

//             // send fresh OTP
//             sendOtp(false, data.email);
//         };

//         initPage();

//     }, [token]);

//     useEffect(() => {
//         if (!otpVerified && timeLeft > 0) {
//             const timer = setTimeout(() => {
//                 setTimeLeft(timeLeft - 1)
//             }, 1000)

//             return () => clearTimeout(timer)
//         }
//     }, [timeLeft, otpVerified])

//     // const validateAndFetch = async (name: string) => {
//     //     setIsLoadingExisting(true)
//     //     try {
//     //         // STEP 1: Check if the Applicant exists in Frappe
//     //         const checkRes = await fetch(`/internal/applicant-document/verify?applicant_name=${encodeURIComponent(name)}`)
//     //         const checkData = await checkRes.json()

//     //         if (!checkData.exists) {
//     //             setIsValidApplicant(false)
//     //             setIsLoadingExisting(false)
//     //             return
//     //         }

//     //         setIsValidApplicant(true)

//     //         // STEP 2: Fetch existing document data (if any)
//     //         const response = await fetch(`/internal/applicant-document?applicant_name=${encodeURIComponent(name)}`)

//     //         if (!response.ok) {
//     //             setIsLoadingExisting(false);
//     //             return;
//     //         }

//     //         const data = await response.json()
//     //         if (data && data.data && data.data.length > 0) {
//     //             const existingDoc = data.data[0] as ExistingDocument
//     //             setExistingDocumentId(existingDoc.name)

//     //             const files: { [key: string]: string } = {}
//     //             if (existingDoc.aadhar_card) files.aadharCard = existingDoc.aadhar_card
//     //             if (existingDoc.passport) files.passport = existingDoc.passport
//     //             if (existingDoc.experience) files.experience = existingDoc.experience
//     //             if (existingDoc.education) files.education = existingDoc.education
//     //             if (existingDoc.bank_details) files.bankDetails = existingDoc.bank_details
//     //             if (existingDoc.pan) files.pan = existingDoc.pan
//     //             if (existingDoc.medical) files.medical = existingDoc.medical
//     //             if (existingDoc.photos) files.photos = existingDoc.photos
//     //             setExistingFiles(files)

//     //             const multipleFiles: { [key: string]: string[] } = { backgroundVerification: [], salarySlip: [], additionalDocument: [] }

//     //             const parseCustom = (field: string | null) => {
//     //                 if (!field) return []
//     //                 try { const p = JSON.parse(field); return Array.isArray(p) ? p : [field] }
//     //                 catch { return [field] }
//     //             }

//     //             multipleFiles.backgroundVerification = parseCustom(existingDoc.custom_background_verification)
//     //             multipleFiles.salarySlip = parseCustom(existingDoc.custom_salary_slip)
//     //             multipleFiles.additionalDocument = parseCustom(existingDoc.custom_additional_document)

//     //             setExistingMultipleFiles(multipleFiles)

//     //             // Last working logic: if core docs exist, show submitted
//     //             if (existingDoc.aadhar_card && existingDoc.education && existingDoc.bank_details && existingDoc.pan) {
//     //                 setIsSubmitted(true)
//     //             }
//     //         }
//     //     } catch (error) {
//     //         console.error("Validation error:", error)
//     //     } finally { setIsLoadingExisting(false) }
//     // }

//     // const sendOtp = async () => {
//     //     setTimeLeft(900)
//     //     setOtpLoading(true)

//     //     await fetch("/internal/applicant-document/send-otp", {
//     //         method: "POST",
//     //         headers: {
//     //             "Content-Type": "application/json"
//     //         },
//     //         body: JSON.stringify({
//     //             email: applicantId
//     //         })
//     //     })

//     //     setOtpLoading(false)
//     // }

//     const validateAndFetch = async (name: string) => {
//         setIsLoadingExisting(true)

//         try {
//             // STEP 1: Check if Applicant exists
//             const checkRes = await fetch(
//                 `/internal/applicant-document/verify?applicant_name=${encodeURIComponent(name)}`
//             )
//             const checkData = await checkRes.json()

//             if (!checkData.exists) {
//                 setIsValidApplicant(false)
//                 setIsLoadingExisting(false)
//                 return false
//             }

//             setIsValidApplicant(true)

//             // STEP 2: Fetch existing docs
//             const response = await fetch(
//                 `/internal/applicant-document?applicant_name=${encodeURIComponent(name)}`
//             )

//             if (!response.ok) {
//                 setIsLoadingExisting(false)
//                 return false
//             }

//             const data = await response.json()

//             if (data && data.data && data.data.length > 0) {
//                 const existingDoc = data.data[0] as ExistingDocument

//                 setExistingDocumentId(existingDoc.name)

//                 const files: { [key: string]: string } = {}

//                 if (existingDoc.aadhar_card) files.aadharCard = existingDoc.aadhar_card
//                 if (existingDoc.passport) files.passport = existingDoc.passport
//                 if (existingDoc.experience) files.experience = existingDoc.experience
//                 if (existingDoc.education) files.education = existingDoc.education
//                 if (existingDoc.bank_details) files.bankDetails = existingDoc.bank_details
//                 if (existingDoc.pan) files.pan = existingDoc.pan
//                 if (existingDoc.medical) files.medical = existingDoc.medical
//                 if (existingDoc.photos) files.photos = existingDoc.photos

//                 setExistingFiles(files)

//                 const multipleFiles: { [key: string]: string[] } = {
//                     backgroundVerification: [],
//                     salarySlip: [],
//                     additionalDocument: []
//                 }

//                 const parseCustom = (field: string | null) => {
//                     if (!field) return []

//                     try {
//                         const p = JSON.parse(field)
//                         return Array.isArray(p) ? p : [field]
//                     } catch {
//                         return [field]
//                     }
//                 }

//                 multipleFiles.backgroundVerification =
//                     parseCustom(existingDoc.custom_background_verification)

//                 multipleFiles.salarySlip =
//                     parseCustom(existingDoc.custom_salary_slip)

//                 multipleFiles.additionalDocument =
//                     parseCustom(existingDoc.custom_additional_document)

//                 setExistingMultipleFiles(multipleFiles)

//                 // IMPORTANT CHANGE HERE
//                 if (
//                     existingDoc.aadhar_card &&
//                     existingDoc.education &&
//                     existingDoc.bank_details &&
//                     existingDoc.pan
//                 ) {
//                     setIsSubmitted(true)
//                     return true
//                 }
//             }

//             return false

//         } catch (error) {
//             console.error("Validation error:", error)
//             return false

//         } finally {
//             setIsLoadingExisting(false)
//         }
//     }


//     // const sendOtp = async (
//     //     manual = true,
//     //     emailParam = applicantId
//     // ) => {

//     //     if (otpLoading) return;

//     //     try {
//     //         setOtpLoading(true);

//     //         const res = await fetch(
//     //             "/internal/applicant-document/send-otp",
//     //             {
//     //                 method: "POST",
//     //                 headers: {
//     //                     "Content-Type": "application/json"
//     //                 },
//     //                 body: JSON.stringify({
//     //                     email: emailParam,
//     //                     manual
//     //                 })
//     //             }
//     //         );

//     //         const data = await res.json();

//     //         if (!data.success) {
//     //             alert(
//     //                 data.message ||
//     //                 "Failed to send OTP"
//     //             );
//     //             return;
//     //         }

//     //         const expireTime =
//     //             new Date().getTime() +
//     //             (15 * 60 * 1000);

//     //         localStorage.setItem(
//     //             "otp_expire_" + token,
//     //             expireTime.toString()
//     //         );

//     //         setTimeLeft(900);

//     //     } catch (error: any) {

//     //         alert(
//     //             error.message ||
//     //             "Failed to send OTP"
//     //         );

//     //     } finally {
//     //         setOtpLoading(false);
//     //     }
//     // };


//     const sendOtp = async (
//         manual = true,
//         emailParam = applicantId
//     ) => {

//         if (otpLoading) return;

//         try {
//             setOtpLoading(true);

//             const res = await fetch(
//                 "/internal/applicant-document/send-otp",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({
//                         email: emailParam,
//                         manual
//                     })
//                 }
//             );

//             const data = await res.json();

//             if (!data.success) {
//                 alert(
//                     data.message ||
//                     "Failed to send OTP"
//                 );
//                 return;
//             }

//             const oldExpiry =
//                 localStorage.getItem(
//                     "otp_expire_" + token
//                 );

//             const now = new Date().getTime();

//             if (
//                 oldExpiry &&
//                 now < Number(oldExpiry)
//             ) {

//                 setTimeLeft(
//                     Math.floor(
//                         (Number(oldExpiry) - now) / 1000
//                     )
//                 );

//             } else {

//                 const expireTime =
//                     now + (15 * 60 * 1000);

//                 localStorage.setItem(
//                     "otp_expire_" + token,
//                     expireTime.toString()
//                 );

//                 setTimeLeft(900);
//             }

//         } catch (error: any) {

//             alert(
//                 error.message ||
//                 "Failed to send OTP"
//             );

//         } finally {
//             setOtpLoading(false);
//         }
//     };


//     const verifyOtp = async () => {
//         const res = await fetch("/internal/applicant-document/verify-otp", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 email: applicantId,
//                 otp
//             })
//         })

//         const data = await res.json()

//         if (data.verified) {
//             setOtpVerified(true)

//             const expireTime =
//                 new Date().getTime() + (15 * 60 * 1000)

//             localStorage.setItem(
//                 "otp_verified_" + token,
//                 "true"
//             )

//             localStorage.setItem(
//                 "otp_expire_" + token,
//                 expireTime.toString()
//             )
//         } else {
//             alert("Invalid OTP")
//         }
//     }

//     const handleFileChange = (field: string, file: File | null) => setDocumentForm(prev => ({ ...prev, [field]: file }))
//     const handleRemoveFile = (field: string) => setDocumentForm(prev => ({ ...prev, [field]: null }))
//     const handleRemoveExistingFile = (field: string) => setExistingFiles(prev => { const n = { ...prev }; delete n[field]; return n })

//     const handleMultipleFileChange = (field: string, files: FileList | null) => {
//         if (!files) return
//         const validFiles = Array.from(files).filter(file => validateFile(file))
//         setDocumentForm(prev => ({ ...prev, [field]: [...(prev[field as keyof typeof prev] as File[]), ...validFiles] }))
//     }
//     const handleRemoveMultipleFile = (field: string, index: number) => {
//         setDocumentForm(prev => ({ ...prev, [field]: (prev[field as keyof typeof prev] as File[]).filter((_, i) => i !== index) }))
//     }
//     const handleRemoveExistingMultipleFile = (field: string, fileUrl: string) => {
//         setExistingMultipleFiles(prev => ({ ...prev, [field]: prev[field].filter(url => url !== fileUrl) }))
//     }

//     const uploadFile = async (file: File, filename: string): Promise<string | null> => {
//         try {
//             const formData = new FormData()
//             formData.append("file", file);
//             formData.append("is_private", "0")
//             formData.append("filename", file.name)
//             if (existingDocumentId) {
//                 formData.append("doctype", "Applicant Document")
//                 formData.append("docname", existingDocumentId)
//                 formData.append("fieldname", filename);
//             }
//             const response = await fetch(`/internal/applicant-document/upload`, { method: "POST", body: formData })
//             const data = await response.json()
//             return (data && data.message && data.message.file_url) ? data.message.file_url : null
//         } catch (error) { return null }
//     }

//     const handleSaveDocument = async () => {
//         const requiredDocs = [
//             { field: 'aadharCard', name: 'Aadhar Card' },
//             { field: 'education', name: 'Education' },
//             { field: 'bankDetails', name: 'Bank Details' },
//             { field: 'pan', name: 'PAN' }
//         ]

//         const missingDocs = requiredDocs.filter(doc => !existingFiles[doc.field] && !documentForm[doc.field as keyof typeof documentForm])
//         if (missingDocs.length > 0) {
//             alert(`Please upload required docs: ${missingDocs.map(d => d.name).join(", ")}`)
//             return
//         }

//         setIsSaving(true)
//         try {
//             const fileUrls: { [key: string]: string | null } = { ...existingFiles }
//             const fileFieldMap = {
//                 aadharCard: 'aadhar_card', passport: 'passport', experience: 'experience',
//                 education: 'education', bankDetails: 'bank_details', pan: 'pan', medical: 'medical', photos: 'photos'
//             }

//             for (const [formField, apiField] of Object.entries(fileFieldMap)) {
//                 const file = documentForm[formField as keyof typeof documentForm] as File | null
//                 if (file) {
//                     const url = await uploadFile(file, apiField)
//                     if (url) fileUrls[formField] = url
//                 }
//             }

//             const multipleFileFieldMap = {
//                 backgroundVerification: 'custom_background_verification',
//                 salarySlip: 'custom_salary_slip',
//                 additionalDocument: 'custom_additional_document'
//             }
//             const multipleFileUrls: { [key: string]: string[] } = {
//                 custom_background_verification: [...existingMultipleFiles.backgroundVerification],
//                 custom_salary_slip: [...existingMultipleFiles.salarySlip],
//                 custom_additional_document: [...existingMultipleFiles.additionalDocument]
//             }

//             for (const [formField, apiField] of Object.entries(multipleFileFieldMap)) {
//                 const files = documentForm[formField as keyof typeof documentForm] as File[]
//                 for (const file of files) {
//                     const url = await uploadFile(file, apiField)
//                     if (url) multipleFileUrls[apiField].push(url)
//                 }
//             }

//             const apiFileUrls: { [key: string]: string | null } = {}
//             for (const [formField, url] of Object.entries(fileUrls)) {
//                 const apiField = fileFieldMap[formField as keyof typeof fileFieldMap]
//                 if (apiField) apiFileUrls[apiField] = url
//             }
//             for (const [apiField, urls] of Object.entries(multipleFileUrls)) {
//                 if (urls.length > 0) apiFileUrls[apiField] = JSON.stringify(urls)
//             }

//             const docData = { applicant_name: applicantId, ...apiFileUrls }
//             const url = existingDocumentId ? `/internal/applicant-document?id=${existingDocumentId}` : `/internal/applicant-document`
//             const method = existingDocumentId ? "PUT" : "POST"

//             const response = await fetch(url, {
//                 method,
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(docData),
//             })

//             // if (response.ok) {

//             //     localStorage.removeItem(
//             //         "otp_verified_" + applicantId
//             //     )

//             //     localStorage.removeItem(
//             //         "otp_expire_" + applicantId
//             //     )

//             //     setIsSubmitted(true)
//             // }
//             if (response.ok) {

//                 localStorage.removeItem(
//                     "otp_verified_" + token
//                 )

//                 localStorage.removeItem(
//                     "otp_expire_" + token
//                 )

//                 setIsSubmitted(true)
//             }
//         } catch (error) {
//             alert(`Failed to submit documents.`)
//         } finally { setIsSaving(false) }
//     }

//     const FileUploadField = ({ label, field, required = false }: { label: string; field: keyof typeof documentForm; required?: boolean }) => {
//         const newFile = documentForm[field] as File | null
//         const existingFile = existingFiles[field as string]
//         return (
//             <div className="dv-field-wrap">
//                 <div className="dv-label"><FileText size={14} />{label} {required && <span className="dv-required">*</span>}</div>
//                 <div className="dv-upload-zone">
//                     {existingFile && !newFile ? (
//                         <div className="dv-file-existing">
//                             <div className="dv-file-info">
//                                 <div className="dv-file-icon green"><Check size={15} /></div>
//                                 <div>
//                                     <div className="dv-file-name">Already Uploaded</div>
//                                     <a href={`${API_BASE_URL}${existingFile}`} target="_blank" rel="noopener noreferrer" className="dv-file-link">View Document →</a>
//                                 </div>
//                             </div>
//                             <button type="button" className="dv-file-remove" onClick={() => handleRemoveExistingFile(field as string)}><X size={14} /></button>
//                         </div>
//                     ) : newFile ? (
//                         <div className="dv-file-new">
//                             <div className="dv-file-info">
//                                 <div className="dv-file-icon blue"><Upload size={15} /></div>
//                                 <div><div className="dv-file-name">{newFile.name}</div><div className="dv-file-meta">{(newFile.size / 1024).toFixed(2)} KB</div></div>
//                             </div>
//                             <button type="button" className="dv-file-remove" onClick={() => handleRemoveFile(field as string)}><X size={14} /></button>
//                         </div>
//                     ) : (
//                         <label className="dv-upload-trigger">
//                             <div className="dv-upload-trigger-icon"><Upload size={20} /></div>
//                             <span className="dv-upload-trigger-label">Attach Document</span>
//                             <input type="file" style={{ display: 'none' }} accept={ACCEPTED_FILE_TYPES} onChange={e => handleFileChange(field as string, e.target.files?.[0] || null)} />
//                         </label>
//                     )}
//                 </div>
//             </div>
//         )
//     }

//     const MultipleFileUploadField = ({ label, field }: { label: string; field: keyof typeof documentForm }) => {
//         const newFiles = documentForm[field] as File[]
//         const existingFilesList = existingMultipleFiles[field as string] || []
//         const hasFiles = newFiles.length > 0 || existingFilesList.length > 0
//         return (
//             <div className="dv-field-wrap">
//                 <div className="dv-label"><FileText size={14} />{label}</div>
//                 <div className="dv-upload-zone">
//                     {hasFiles ? (
//                         <div className="dv-multi-files">
//                             {existingFilesList.map((fileUrl, index) => (
//                                 <div key={`existing-${index}`} className="dv-file-existing">
//                                     <div className="dv-file-info">
//                                         <div className="dv-file-icon green"><Check size={15} /></div>
//                                         <div><a href={`${API_BASE_URL}${fileUrl}`} target="_blank" rel="noopener noreferrer" className="dv-file-link">View File {index + 1} →</a></div>
//                                     </div>
//                                     <button type="button" className="dv-file-remove" onClick={() => handleRemoveExistingMultipleFile(field as string, fileUrl)}><X size={14} /></button>
//                                 </div>
//                             ))}
//                             {newFiles.map((file, index) => (
//                                 <div key={`new-${index}`} className="dv-file-new">
//                                     <div className="dv-file-info">
//                                         <div className="dv-file-icon blue"><Upload size={15} /></div>
//                                         <div><div className="dv-file-name">{file.name}</div></div>
//                                     </div>
//                                     <button type="button" className="dv-file-remove" onClick={() => handleRemoveMultipleFile(field as string, index)}><X size={14} /></button>
//                                 </div>
//                             ))}
//                             <label className="dv-add-more">
//                                 <Upload size={15} /><span className="dv-add-more-label">Add More</span>
//                                 <input type="file" multiple style={{ display: 'none' }} accept={ACCEPTED_FILE_TYPES} onChange={e => handleMultipleFileChange(field as string, e.target.files)} />
//                             </label>
//                         </div>
//                     ) : (
//                         <label className="dv-upload-trigger">
//                             <div className="dv-upload-trigger-icon"><Upload size={20} /></div>
//                             <span className="dv-upload-trigger-label">Attach Documents</span>
//                             <input type="file" multiple style={{ display: 'none' }} accept={ACCEPTED_FILE_TYPES} onChange={e => handleMultipleFileChange(field as string, e.target.files)} />
//                         </label>
//                     )}
//                 </div>
//             </div>
//         )
//     }

//     if (isLoadingExisting) {
//         return (
//             <div className="dv">
//                 <style>{css}</style>
//                 <div className="dv-wrap" style={{ alignItems: 'center' }}>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
//                         <Loader2 size={40} className="dv-spin" style={{ color: 'var(--accent)' }} />
//                         <span style={{ color: 'var(--t2)', fontSize: '15px', fontWeight: 600 }}>Verifying credentials...</span>
//                     </div>
//                 </div>
//             </div>
//         )
//     }

//     if (!isValidApplicant) {
//         return (
//             <div className="dv">
//                 <style>{css}</style>
//                 <div className="dv-wrap" style={{ alignItems: 'center', padding: '20px' }}>
//                     <div className="dv-card" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '48px 32px' }}>
//                         <AlertCircle size={60} style={{ color: '#ef4444', margin: '0 auto 20px' }} />
//                         <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--t1)', marginBottom: '12px' }}>Access Denied</h2>
//                         <p style={{ fontSize: '15px', color: 'var(--t2)', lineHeight: '1.6' }}>
//                             We couldn't find an applicant record for <strong>{applicantId}</strong>. Please ensure the email or ID is correct or contact HR.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         )
//     }

//     // if (isSubmitted) {
//     //     return (
//     //         <div className="dv">
//     //             <style>{css}</style>
//     //             <div className="dv-wrap" style={{ alignItems: 'center', padding: '20px' }}>
//     //                 <div className="dv-card" style={{ maxWidth: '540px', width: '100%', textAlign: 'center', padding: '48px 32px' }}>
//     //                     <h2 style={{ fontSize: '26px', fontWeight: '800' }}>
//     //                         Submission Complete!
//     //                     </h2>

//     //                     <p style={{ marginTop: "15px" }}>
//     //                         Thank you, <strong>{applicantId}</strong>.
//     //                         Your documents are under review.
//     //                     </p>
//     //                 </div>
//     //             </div>
//     //         </div>
//     //     )
//     // }

//     if (isSubmitted) {
//         return (
//             <div className="dv">
//                 <style>{css}</style>

//                 <div
//                     className="dv-wrap"
//                     style={{
//                         alignItems: "center",
//                         justifyContent: "center",
//                         minHeight: "100vh",
//                         padding: "20px"
//                     }}
//                 >
//                     <div
//                         className="dv-card"
//                         style={{
//                             maxWidth: "540px",
//                             width: "100%",
//                             textAlign: "center",
//                             padding: "48px 32px"
//                         }}
//                     >
//                         <h2
//                             style={{
//                                 fontSize: "32px",
//                                 fontWeight: "700",
//                                 marginBottom: "10px",
//                                 color: "#000"
//                             }}
//                         >
//                             Submission Complete!
//                         </h2>

//                         <p style={{ marginTop: "15px", fontSize: "18px" }}>
//                             Thank you, <strong>{applicantId}</strong>. Your documents are under review.
//                         </p>

//                         <button
//                             onClick={() => window.close()}
//                             style={{
//                                 marginTop: "25px",
//                                 width: "220px",
//                                 height: "42px",
//                                 background: "#009ef7",
//                                 color: "#fff",
//                                 border: "none",
//                                 borderRadius: "8px",
//                                 fontSize: "16px",
//                                 fontWeight: "600",
//                                 cursor: "pointer"
//                             }}
//                         >
//                             Close Window
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (isValidApplicant && !otpVerified) {
//         return (
//             <div className="dv">
//                 <style>{css}</style>

//                 <div className="dv-wrap" style={{ alignItems: "center" }}>
//                     <div className="dv-card" style={{ width: "420px", padding: "30px" }}>

//                         <h2 style={{ fontSize: "24px", fontWeight: "700" }}>
//                             Email Verification
//                         </h2>

//                         <p style={{ marginTop: "10px", color: "#666" }}>
//                             OTP sent to {applicantId}
//                         </p>
//                         <p style={{ marginTop: "8px", color: "red" }}>
//                             OTP expires in {Math.floor(timeLeft / 60)}:
//                             {String(timeLeft % 60).padStart(2, "0")}
//                         </p>

//                         <input
//                             value={otp}
//                             onChange={(e) => setOtp(e.target.value)}
//                             placeholder="Enter OTP"
//                             style={{
//                                 width: "100%",
//                                 height: "45px",
//                                 marginTop: "20px",
//                                 border: "1px solid #ddd",
//                                 padding: "10px",
//                                 borderRadius: "8px"
//                             }}
//                         />

//                         <button
//                             onClick={verifyOtp}
//                             style={{
//                                 width: "100%",
//                                 height: "45px",
//                                 marginTop: "15px",
//                                 background: "#009ef7",
//                                 color: "#fff",
//                                 border: "none",
//                                 borderRadius: "8px"
//                             }}
//                         >
//                             Verify OTP
//                         </button>

//                         <button
//                             onClick={() => sendOtp(true)}
//                             disabled={otpLoading}
//                             style={{
//                                 width: "100%",
//                                 height: "45px",
//                                 marginTop: "10px",
//                                 background: "#eee",
//                                 border: "none",
//                                 borderRadius: "8px"
//                             }}
//                         >
//                             {otpLoading ? "Sending..." : "Resend OTP"}
//                         </button>

//                     </div>
//                 </div>
//             </div>
//         )
//     }


//     return (
//         <>
//             <style>{css}</style>
//             <div className="dv">
//                 <div className="dv-wrap">
//                     <div className="dv-main">
//                         <header className="dv-header">
//                             <div className="dv-brand"><img src="/vaaman_logo.png" alt="Logo" /><span>Onboarding Portal</span></div>
//                         </header>
//                         <div className="dv-page-outer">
//                             <div className="dv-page">
//                                 <div className="dv-toolbar">
//                                     <h1 className="dv-page-title">Secure Document Upload</h1>
//                                     <p className="dv-page-sub">Welcome {applicantId}. Please provide the required documents below.</p>
//                                 </div>
//                                 <div className="dv-card">
//                                     <div className="dv-card-head"><User size={16} /><span className="dv-card-title">Applicant Profile</span></div>
//                                     <div className="dv-card-body">
//                                         <div className="dv-readonly-field"><CheckCircle2 size={18} style={{ color: 'var(--green)' }} />{applicantId}</div>
//                                     </div>
//                                 </div>
//                                 <div className="dv-doc-grid">
//                                     <div className="dv-card">
//                                         <div className="dv-card-head"><FileText size={16} /><span className="dv-card-title">Identity</span></div>
//                                         <div className="dv-card-body">
//                                             <FileUploadField label="Aadhar Card" field="aadharCard" required />
//                                             <FileUploadField label="Passport" field="passport" />
//                                             <FileUploadField label="Experience Certificate" field="experience" />
//                                             <FileUploadField label="Education Certificate" field="education" required />
//                                         </div>
//                                     </div>
//                                     <div className="dv-card">
//                                         <div className="dv-card-head"><FileText size={16} /><span className="dv-card-title">Financial</span></div>
//                                         <div className="dv-card-body">
//                                             <FileUploadField label="Bank Account Details" field="bankDetails" required />
//                                             <FileUploadField label="PAN Card" field="pan" required />
//                                             <FileUploadField label="Medical Certificate" field="medical" />
//                                             <FileUploadField label="Passport Photos" field="photos" />
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="dv-card">
//                                     <div className="dv-card-head"><FileText size={16} /><span className="dv-card-title">Additional</span></div>
//                                     <div className="dv-card-body">
//                                         <div className="dv-doc-grid">
//                                             <MultipleFileUploadField label="Background Verification" field="backgroundVerification" />
//                                             <MultipleFileUploadField label="Salary Slip" field="salarySlip" />
//                                         </div>
//                                         <MultipleFileUploadField label="Additional Document" field="additionalDocument" />
//                                     </div>
//                                 </div>
//                                 <div className="dv-save-wrap">
//                                     <button className="dv-save-btn" onClick={handleSaveDocument} disabled={isSaving}>
//                                         {isSaving ? <><Loader2 size={18} className="dv-spin" /> Uploading...</> : <><Zap size={18} /> Submit Documents</>}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }









"use client"
import { useState, useEffect, use, useCallback } from "react"
import {
    Upload, X, Check, FileText, User,
    CheckCircle2, Loader2, AlertCircle,
    ChevronRight, ChevronLeft, ClipboardList, Shield, Send,
    Plus, Trash2, PenTool
} from "lucide-react"
import { API_BASE_URL } from '@/lib/api-config'

const ACCEPTED_FILE_TYPES = ".jpg,.jpeg,.doc,.pdf,.docx"
const ACCEPTED_MIME_TYPES = ["image/jpeg", "application/msword", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
const validateFile = (file: File) => ACCEPTED_MIME_TYPES.includes(file.type)

interface ExistingDocument {
    name: string; applicant_name: string; employee: string;
    aadhar_card: string | null; passport: string | null; experience: string | null;
    education: string | null; bank_details: string | null; pan: string | null;
    medical: string | null; photos: string | null;
    custom_background_verification: string | null; custom_salary_slip: string | null; custom_additional_document: string | null;
}
interface EducationRow { education_level: string; name_of_institute: string; stream: string; class: string; year_passed: string; subjects: string }
// interface EmploymentRow { sr_no: string; name_of_employer: string; designation: string; reporting_to_name_contact_number_email_id: string; hr_details_of_company_name_email_id_contact_number: string; salary_drawn_per_year: string; reason_for_leaving: string }
interface EmploymentRow { sr_no: string; name_of_employer: string; designation: string; reporting_to_name_contact_number_email_id: string; hr_details_of_company_name_email_id_contact_number: string; salary_drawn_per_year: string; reason_for_leaving: string; duration_of_service: string; no_of_years__months: string }

interface ReferenceRow { reference_name: string; organization_name: string; designation: string; is_current_organization: string; reference_email_id: string; landline_telephone_no: string; mobile_phone_no: string; known_period_monthsyears: string; relationship_with_applicant: string }

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  .ob{--accent:#0070f3;--accent-h:#0051b5;--accent-lt:#e8f1ff;--bg:#f5f7fa;--card:#fff;--border:#e2e8f0;--border-s:#edf0f5;--t1:#0f172a;--t2:#334155;--t3:#94a3b8;--green:#059669;--green-lt:#d1fae5;--red:#dc2626;font-family:'DM Sans',system-ui,sans-serif;font-size:14px;-webkit-font-smoothing:antialiased;color:var(--t1);background:var(--bg);min-height:100vh}
  .ob-wrap{min-height:100vh;background:var(--bg);display:flex;flex-direction:column}
  .ob-header{height:64px;background:#fff;border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 32px;gap:12px;position:sticky;top:0;z-index:50;box-shadow:0 1px 4px rgba(0,0,0,.06)}
  .ob-brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:18px;color:var(--t1)}
  .ob-brand img{height:30px;width:auto}
  .ob-body{flex:1;max-width:980px;margin:0 auto;width:100%;padding:32px 24px 60px}
  .ob-stepper{display:flex;align-items:center;margin-bottom:32px;background:#fff;border:1px solid var(--border);border-radius:14px;padding:20px 28px;box-shadow:0 2px 8px rgba(0,0,0,.04)}
  .ob-step{display:flex;align-items:center;gap:10px;flex:1;min-width:0}
  .ob-step-num{width:34px;height:34px;border-radius:50%;border:2px solid #cbd5e1;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:13px;font-weight:700;color:var(--t3);background:#fff;transition:all .2s}
  .ob-step.done .ob-step-num{background:var(--green);border-color:var(--green);color:#fff}
  .ob-step.active .ob-step-num{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 0 0 4px rgba(0,112,243,.15)}
  .ob-step-label{font-size:13px;font-weight:600;color:var(--t3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .2s}
  .ob-step.done .ob-step-label{color:var(--green)}
  .ob-step.active .ob-step-label{color:var(--accent)}
  .ob-step-sep{flex:1;height:2px;background:var(--border);margin:0 10px;min-width:16px;transition:background .2s}
  .ob-step-sep.done{background:var(--green)}
  .ob-card{background:#fff;border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.04);margin-bottom:20px}
  .ob-card-head{padding:14px 22px;border-bottom:1px solid var(--border-s);background:linear-gradient(to right,#f8fafc,#f1f5f9);display:flex;align-items:center;gap:10px}
  .ob-card-head svg{color:var(--accent);flex-shrink:0}
  .ob-card-title{font-size:14px;font-weight:700;color:var(--t1)}
  .ob-card-body{padding:22px}
  .ob-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .ob-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
  .ob-grid-4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:16px}
  .ob-field{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
  .ob-field:last-child{margin-bottom:0}
  .ob-label{font-size:12.5px;font-weight:600;color:var(--t2)}
  .ob-req{color:var(--red);margin-left:2px}
  .ob-input,.ob-select,.ob-textarea{width:100%;padding:9px 13px;border:1.5px solid var(--border);border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--t1);background:#fff;transition:border-color .15s,box-shadow .15s;outline:none}
  .ob-input:focus,.ob-select:focus,.ob-textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,112,243,.1)}
  .ob-textarea{resize:vertical;min-height:80px;line-height:1.5}
  .ob-select{cursor:pointer}
  .ob-table-wrap{overflow-x:auto;border:1px solid var(--border);border-radius:10px;margin-bottom:10px}
  .ob-table{width:100%;border-collapse:collapse;min-width:600px}
  .ob-table th{background:#f8fafc;padding:10px 12px;font-size:12px;font-weight:700;color:var(--t2);text-align:left;border-bottom:1px solid var(--border);white-space:nowrap}
  .ob-table td{padding:8px 8px;border-bottom:1px solid var(--border-s);vertical-align:middle}
  .ob-table tr:last-child td{border-bottom:none}
  .ob-table-input{width:100%;min-width:100px;padding:6px 9px;border:1.5px solid var(--border);border-radius:6px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--t1);background:#fff;outline:none;transition:border-color .15s}
  .ob-table-input:focus{border-color:var(--accent)}
  .ob-table-select{width:100%;min-width:80px;padding:6px 9px;border:1.5px solid var(--border);border-radius:6px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--t1);background:#fff;outline:none;cursor:pointer}
  .ob-add-row{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border:1.5px dashed var(--border);border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;color:var(--t3);background:none;transition:all .14s;margin-top:8px;font-family:'DM Sans',sans-serif}
  .ob-add-row:hover{border-color:var(--accent);color:var(--accent)}
  .ob-del-row{width:28px;height:28px;border-radius:6px;border:none;background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--red);transition:background .14s}
  .ob-del-row:hover{background:#fef2f2}
  .ob-sig-wrap{border:1.5px solid var(--border);border-radius:10px;overflow:hidden}
  .ob-sig-canvas{display:block;width:100%;height:160px;background:#fff;cursor:crosshair;touch-action:none}
  .ob-sig-bar{display:flex;align-items:center;justify-content:space-between;padding:8px 14px;background:#f8fafc;border-top:1px solid var(--border)}
  .ob-sig-hint{font-size:12px;color:var(--t3)}
  .ob-sig-clear{font-size:12px;font-weight:600;color:var(--red);background:none;border:none;cursor:pointer;padding:4px 10px;border-radius:5px;font-family:'DM Sans',sans-serif}
  .ob-sig-clear:hover{background:#fef2f2}
  .ob-upload-zone{border:2px dashed var(--border);border-radius:10px;transition:border-color .15s;background:#fafcff}
  .ob-upload-zone:hover{border-color:var(--accent)}
  .ob-file-existing{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(to right,var(--green-lt),#d1fae5);border-radius:9px;padding:12px 14px;border:1px solid #bbf7d0}
  .ob-file-new{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(to right,var(--accent-lt),#e0eaff);border-radius:9px;padding:12px 14px;border:1px solid var(--border)}
  .ob-file-info{display:flex;align-items:center;gap:12px}
  .ob-file-icon{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 5px rgba(0,0,0,.1)}
  .ob-file-icon.green{background:linear-gradient(135deg,var(--green),#22c55e)}
  .ob-file-icon.blue{background:linear-gradient(135deg,var(--accent),#3b82f6)}
  .ob-file-icon svg{color:#fff;width:15px;height:15px}
  .ob-file-name{font-size:13px;font-weight:600;color:var(--t1)}
  .ob-file-link{font-size:11.5px;color:var(--accent);font-weight:500;text-decoration:none}
  .ob-file-link:hover{text-decoration:underline}
  .ob-file-meta{font-size:11.5px;color:var(--t3)}
  .ob-file-remove{width:28px;height:28px;border-radius:7px;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#ef4444;flex-shrink:0;transition:background .14s}
  .ob-file-remove:hover{background:#fef2f2}
  .ob-upload-trigger{display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;padding:20px 16px;gap:8px}
  .ob-upload-trigger-icon{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#3b82f6);display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,112,243,.25)}
  .ob-upload-trigger-icon svg{color:#fff;width:20px;height:20px}
  .ob-upload-trigger-label{font-size:13px;font-weight:600;color:var(--t2)}
  .ob-multi-files{display:flex;flex-direction:column;gap:8px;padding:10px}
  .ob-add-more{display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;padding:10px;border:2px dashed var(--border-s);border-radius:8px;transition:border-color .15s;margin-top:2px}
  .ob-add-more:hover{border-color:var(--accent)}
  .ob-add-more svg,.ob-add-more-label{color:var(--t3);font-weight:600;font-size:11.5px}
  .ob-doc-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .ob-field-wrap{margin-bottom:20px}
  .ob-doc-label{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--t2);margin-bottom:8px;margin-top:18px}
  .ob-doc-label:first-child{margin-top:0}
  .ob-nav{display:flex;align-items:center;justify-content:space-between;margin-top:28px;padding-top:24px;border-top:1px solid var(--border-s)}
  .ob-btn{display:inline-flex;align-items:center;gap:8px;padding:11px 26px;border-radius:9px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;border:none;cursor:pointer;transition:all .15s}
  .ob-btn-primary{background:var(--accent);color:#fff;box-shadow:0 3px 10px rgba(0,112,243,.25)}
  .ob-btn-primary:hover:not(:disabled){background:var(--accent-h);transform:translateY(-1px)}
  .ob-btn-primary:disabled{opacity:.55;cursor:not-allowed;transform:none}
  .ob-btn-ghost{background:#fff;color:var(--t2);border:1.5px solid var(--border)}
  .ob-btn-ghost:hover{border-color:var(--accent);color:var(--accent)}
  .ob-btn-success{background:var(--green);color:#fff;box-shadow:0 3px 10px rgba(5,150,105,.25)}
  .ob-btn-success:hover:not(:disabled){background:#047857;transform:translateY(-1px)}
  .ob-btn-success:disabled{opacity:.55;cursor:not-allowed;transform:none}
  .ob-spin{animation:ob-spin 1s linear infinite}
  @keyframes ob-spin{to{transform:rotate(360deg)}}
  .ob-decl-text{background:#f8fafc;border:1px solid var(--border);border-radius:10px;padding:22px;line-height:1.85;font-size:13.5px;color:var(--t2);margin-bottom:24px}
  .ob-decl-text p{margin-bottom:14px}
  .ob-decl-text p:last-child{margin-bottom:0}
  .ob-success{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:64px 32px}
  .ob-success-icon{width:84px;height:84px;border-radius:50%;background:linear-gradient(135deg,var(--green),#22c55e);display:flex;align-items:center;justify-content:center;margin-bottom:28px;box-shadow:0 8px 24px rgba(5,150,105,.3)}
  .ob-center{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
  .ob-otp-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:40px 36px;width:420px;max-width:100%;box-shadow:0 8px 32px rgba(0,0,0,.08)}
  .ob-readonly{width:100%;height:44px;padding:0 14px;border-radius:9px;border:1px solid var(--border);background:#f8fbff;color:var(--t1);font-size:14px;font-weight:600;display:flex;align-items:center;gap:10px}
  .ob-note{background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;font-size:12.5px;color:#92400e;line-height:1.6;margin-bottom:16px}
  @media(max-width:768px){.ob-body{padding:16px 14px 60px}.ob-header{padding:0 16px}.ob-grid-2,.ob-grid-3,.ob-grid-4,.ob-doc-grid{grid-template-columns:1fr}.ob-stepper{padding:16px 18px}.ob-step-label{display:none}}
`

// ─────────────────────────────────────────────────────────────────────────────
// CRITICAL FIX: These components are defined OUTSIDE the page component.
// If defined inside, React treats them as new types on every render and
// unmounts+remounts them — causing focus loss after 1 char and canvas wipes.
// ─────────────────────────────────────────────────────────────────────────────

type AppFormKey = keyof {
    date: string; post_applied_for: string; job_location: string; vacancy_known_from: string; contact_number: string;
    name1: string; father_name: string; occupation: string; local_address: string; permanent_address: string;
    alternate_contact_number: string; email_id: string; birth_date: string; place_of_domicile: string;
    marital_status_are_you_married: string; wife__husband_name: string; his__her_place_of_work: string;
    children_if_any_name_1: string; child_1_age: string; children_if_any_name_2: string; child_2_age: string;
    health_details: string; hobbies: string; epfo_membership: string;
    // salary_expected: string; additional_information: string;
    salary_expected: string; additional_information: string; language_known: string;

    employee_name: string; employee_relationship: string; employee_contact_number: string;
    interviewed_for_which_position: string; interviewed_for_which_location: string;
    interview_date: string; candidate_name: string; signature: string;
}

interface InpProps { field: AppFormKey; label: string; req?: boolean; type?: string; value: string; onChange: (field: AppFormKey, value: string) => void }
const Inp = ({ field, label, req = false, type = "text", value, onChange }: InpProps) => (
    <div className="ob-field">
        <label className="ob-label">{label}{req && <span className="ob-req">*</span>}</label>
        <input type={type} className="ob-input" value={value} onChange={e => onChange(field, e.target.value)} />
    </div>
)

interface TxtProps { field: AppFormKey; label: string; value: string; onChange: (field: AppFormKey, value: string) => void }
const Txt = ({ field, label, value, onChange }: TxtProps) => (
    <div className="ob-field">
        <label className="ob-label">{label}</label>
        <textarea className="ob-textarea" value={value} onChange={e => onChange(field, e.target.value)} />
    </div>
)

// ─────────────────────────────────────────────────────────────────────────────

export default function PublicDocumentVerifyPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const token = decodeURIComponent(resolvedParams.id)

    // auth
    const [applicantId, setApplicantId] = useState("")
    const [isLoadingExisting, setIsLoadingExisting] = useState(true)
    const [isValidApplicant, setIsValidApplicant] = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)
    const [otp, setOtp] = useState("")
    const [otpLoading, setOtpLoading] = useState(false)
    const [timeLeft, setTimeLeft] = useState(900)

    const [currentStep, setCurrentStep] = useState(1)

    const [consentChecked, setConsentChecked] = useState(false)

    // doc upload
    const [documentForm, setDocumentForm] = useState({
        aadharCard: null as File | null, passport: null as File | null,
        experience: null as File | null, education: null as File | null,
        bankDetails: null as File | null, pan: null as File | null,
        medical: null as File | null, photos: null as File | null,
        backgroundVerification: [] as File[], salarySlip: [] as File[], additionalDocument: [] as File[],
    })
    const [existingDocumentId, setExistingDocumentId] = useState<string | null>(null)
    const [existingFiles, setExistingFiles] = useState<{ [key: string]: string }>({})
    const [existingMultipleFiles, setExistingMultipleFiles] = useState<{ [key: string]: string[] }>({ backgroundVerification: [], salarySlip: [], additionalDocument: [] })
    const [isSavingDocs, setIsSavingDocs] = useState(false)

    // application form state
    const [appForm, setAppForm] = useState(() => {
        const defaults = {
            date: "", post_applied_for: "", job_location: "", vacancy_known_from: "", contact_number: "",
            name1: "", father_name: "", occupation: "", local_address: "", permanent_address: "",
            alternate_contact_number: "", email_id: "", birth_date: "", place_of_domicile: "",
            marital_status_are_you_married: "", wife__husband_name: "", his__her_place_of_work: "",
            children_if_any_name_1: "", child_1_age: "", children_if_any_name_2: "", child_2_age: "",
            health_details: "", hobbies: "", epfo_membership: "YES",
            // salary_expected: "", additional_information: "",
            salary_expected: "", additional_information: "", language_known: "",

            employee_name: "", employee_relationship: "", employee_contact_number: "",
            interviewed_for_which_position: "", interviewed_for_which_location: "",
            interview_date: "", candidate_name: "",
            signature: "",
        }
        try {
            const saved = sessionStorage.getItem("appForm_draft")
            return saved ? { ...defaults, ...JSON.parse(saved) } : defaults
        } catch { return defaults }
    })
    const [passportPhoto, setPassportPhoto] = useState<File | null>(null)
    const [appSignatureFile, setAppSignatureFile] = useState<File | null>(null)
    const [declSignatureFile, setDeclSignatureFile] = useState<File | null>(null)

    const [passportPhotoUrl, setPassportPhotoUrl] = useState<string>(() => {
        try { return sessionStorage.getItem("passportPhotoUrl") || "" } catch { return "" }
    })
    const [appSignatureUrl, setAppSignatureUrl] = useState<string>(() => {
        try { return sessionStorage.getItem("appSignatureUrl") || "" } catch { return "" }
    })
    const [declSignatureUrl, setDeclSignatureUrl] = useState<string>(() => {
        try { return sessionStorage.getItem("declSignatureUrl") || "" } catch { return "" }
    })

    const [educationRows, setEducationRows] = useState<EducationRow[]>(() => {
        try { const s = sessionStorage.getItem("educationRows_draft"); return s ? JSON.parse(s) : [] } catch { return [] }
    })
    const [employmentRows, setEmploymentRows] = useState<EmploymentRow[]>(() => {
        try { const s = sessionStorage.getItem("employmentRows_draft"); return s ? JSON.parse(s) : [] } catch { return [] }
    })
    const [referenceRows, setReferenceRows] = useState<ReferenceRow[]>(() => {
        try { const s = sessionStorage.getItem("referenceRows_draft"); return s ? JSON.parse(s) : [] } catch { return [] }
    })
    const [isSavingApp, setIsSavingApp] = useState(false)


    const [declForm, setDeclForm] = useState(() => {
        try { const s = sessionStorage.getItem("declForm_draft"); return s ? JSON.parse(s) : { name1: "", date: "", place: "", signature: "" } } catch { return { name1: "", date: "", place: "", signature: "" } }
    })
    const [isSavingDecl, setIsSavingDecl] = useState(false)

    useEffect(() => { document.title = 'Onboarding Portal' }, [])

    useEffect(() => { sessionStorage.setItem("educationRows_draft", JSON.stringify(educationRows)) }, [educationRows])
    useEffect(() => { sessionStorage.setItem("employmentRows_draft", JSON.stringify(employmentRows)) }, [employmentRows])
    useEffect(() => { sessionStorage.setItem("referenceRows_draft", JSON.stringify(referenceRows)) }, [referenceRows])
    useEffect(() => { sessionStorage.setItem("declForm_draft", JSON.stringify(declForm)) }, [declForm])

    // Stable field setter — won't recreate on every render
    const handleAppFormChange = useCallback((field: AppFormKey, value: string) => {
        setAppForm(prev => {
            const updated = { ...prev, [field]: value }
            sessionStorage.setItem("appForm_draft", JSON.stringify(updated))
            return updated
        })
    }, [])


    // const validateAndFetch = async (name: string) => {
    //     setIsLoadingExisting(true)
    //     try {
    //         const checkRes = await fetch(`/internal/applicant-document/verify?applicant_name=${encodeURIComponent(name)}`)
    //         const checkData = await checkRes.json()
    //         if (!checkData.exists) { setIsValidApplicant(false); setIsLoadingExisting(false); return false }
    //         setIsValidApplicant(true)
    //         const response = await fetch(`/internal/applicant-document?applicant_name=${encodeURIComponent(name)}`)
    //         if (!response.ok) { setIsLoadingExisting(false); return false }
    //         const data = await response.json()
    //         if (data && data.data && data.data.length > 0) {
    //             const existingDoc = data.data[0] as ExistingDocument
    //             setExistingDocumentId(existingDoc.name)
    //             const files: { [key: string]: string } = {}
    //             if (existingDoc.aadhar_card) files.aadharCard = existingDoc.aadhar_card
    //             if (existingDoc.passport) files.passport = existingDoc.passport
    //             if (existingDoc.experience) files.experience = existingDoc.experience
    //             if (existingDoc.education) files.education = existingDoc.education
    //             if (existingDoc.bank_details) files.bankDetails = existingDoc.bank_details
    //             if (existingDoc.pan) files.pan = existingDoc.pan
    //             if (existingDoc.medical) files.medical = existingDoc.medical
    //             if (existingDoc.photos) files.photos = existingDoc.photos
    //             setExistingFiles(files)
    //             const mf: { [key: string]: string[] } = { backgroundVerification: [], salarySlip: [], additionalDocument: [] }
    //             const parse = (f: string | null) => { if (!f) return []; try { const p = JSON.parse(f); return Array.isArray(p) ? p : [f] } catch { return [f] } }
    //             mf.backgroundVerification = parse(existingDoc.custom_background_verification)
    //             mf.salarySlip = parse(existingDoc.custom_salary_slip)
    //             mf.additionalDocument = parse(existingDoc.custom_additional_document)
    //             setExistingMultipleFiles(mf)
    //             if (existingDoc.aadhar_card && existingDoc.education && existingDoc.bank_details && existingDoc.pan) { setCurrentStep(2); return true }
    //         }
    //         return false
    //     } catch (e) { console.error(e); return false }
    //     finally { setIsLoadingExisting(false) }
    // }

    const validateAndFetch = async (name: string) => {
        setIsLoadingExisting(true)
        try {
            const checkRes = await fetch(`/internal/applicant-document/verify?applicant_name=${encodeURIComponent(name)}`)
            const checkData = await checkRes.json()
            if (!checkData.exists) { setIsValidApplicant(false); setIsLoadingExisting(false); return "invalid" }
            setIsValidApplicant(true)

            // 1. Check declaration submitted → step 4
            const declRes = await fetch(`/internal/applicant-document/declaration-check?applicant_name=${encodeURIComponent(name)}`)
            const declData = await declRes.json()
            if (declData.submitted) {
                setOtpVerified(true); setCurrentStep(4); setIsLoadingExisting(false); return "submitted"
            }

            // 2. Check application form submitted → step 3
            const appRes = await fetch(`/internal/applicant-document/application-form-check?applicant_name=${encodeURIComponent(name)}`)
            const appData = await appRes.json()
            if (appData.submitted) {
                setOtpVerified(true); setCurrentStep(3); setIsLoadingExisting(false); return "app_done"
            }

            // 3. Check docs uploaded → step 2
            const response = await fetch(`/internal/applicant-document?applicant_name=${encodeURIComponent(name)}`)
            if (!response.ok) { setIsLoadingExisting(false); return "none" }
            const data = await response.json()
            if (data && data.data && data.data.length > 0) {
                const existingDoc = data.data[0] as ExistingDocument
                setExistingDocumentId(existingDoc.name)
                const files: { [key: string]: string } = {}
                if (existingDoc.aadhar_card) files.aadharCard = existingDoc.aadhar_card
                if (existingDoc.passport) files.passport = existingDoc.passport
                if (existingDoc.experience) files.experience = existingDoc.experience
                if (existingDoc.education) files.education = existingDoc.education
                if (existingDoc.bank_details) files.bankDetails = existingDoc.bank_details
                if (existingDoc.pan) files.pan = existingDoc.pan
                if (existingDoc.medical) files.medical = existingDoc.medical
                if (existingDoc.photos) files.photos = existingDoc.photos
                setExistingFiles(files)
                const mf: { [key: string]: string[] } = { backgroundVerification: [], salarySlip: [], additionalDocument: [] }
                const parse = (f: string | null) => { if (!f) return []; try { const p = JSON.parse(f); return Array.isArray(p) ? p : [f] } catch { return [f] } }
                mf.backgroundVerification = parse(existingDoc.custom_background_verification)
                mf.salarySlip = parse(existingDoc.custom_salary_slip)
                mf.additionalDocument = parse(existingDoc.custom_additional_document)
                setExistingMultipleFiles(mf)
                if (existingDoc.aadhar_card && existingDoc.education && existingDoc.bank_details && existingDoc.pan) {
                    setOtpVerified(true); setCurrentStep(2); setIsLoadingExisting(false); return "docs_done"
                }
            }
            return "none"
        } catch (e) { console.error(e); return "none" }
        finally { setIsLoadingExisting(false) }
    }

    useEffect(() => {
        // const initPage = async () => {
        //     if (!token) return
        //     const res = await fetch(`/internal/applicant-document/token-verify?token=${token}`)
        //     const data = await res.json()
        //     if (!data.valid) { setIsValidApplicant(false); setIsLoadingExisting(false); return }
        //     setApplicantId(data.email)
        //     const alreadySubmitted = await validateAndFetch(data.email)
        //     if (alreadySubmitted) return
        //     const verified = localStorage.getItem("otp_verified_" + token)
        //     const expiry = localStorage.getItem("otp_expire_" + token)
        //     const now = new Date().getTime()
        //     if (verified === "true" && expiry && now < Number(expiry)) { setOtpVerified(true); setTimeLeft(Math.floor((Number(expiry) - now) / 1000)); return }
        //     if (expiry && now < Number(expiry)) { setOtpVerified(false); setTimeLeft(Math.floor((Number(expiry) - now) / 1000)); return }
        //     localStorage.removeItem("otp_verified_" + token)
        //     localStorage.removeItem("otp_expire_" + token)
        //     sendOtp(false, data.email)
        // }

        const initPage = async () => {
            if (!token) return
            const res = await fetch(`/internal/applicant-document/token-verify?token=${token}`)
            const data = await res.json()
            if (!data.valid) { setIsValidApplicant(false); setIsLoadingExisting(false); return }
            setApplicantId(data.email)
            const status = await validateAndFetch(data.email)
            if (status === "submitted") return   // → step 4 success, no OTP
            if (status === "app_done") return    // → step 3 declaration, no OTP
            if (status === "docs_done") return   // → step 2 app form, no OTP
            if (status === "invalid") return     // → access denied
            // "none" → not started yet, check localStorage OTP session
            const verified = localStorage.getItem("otp_verified_" + token)
            const expiry = localStorage.getItem("otp_expire_" + token)
            const now = new Date().getTime()
            if (verified === "true" && expiry && now < Number(expiry)) { setOtpVerified(true); setTimeLeft(Math.floor((Number(expiry) - now) / 1000)); return }
            if (expiry && now < Number(expiry)) { setOtpVerified(false); setTimeLeft(Math.floor((Number(expiry) - now) / 1000)); return }
            localStorage.removeItem("otp_verified_" + token)
            localStorage.removeItem("otp_expire_" + token)
            sendOtp(false, data.email)
        }
        initPage()
    }, [token])

    useEffect(() => {
        if (!otpVerified && timeLeft > 0) { const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000); return () => clearTimeout(t) }
    }, [timeLeft, otpVerified])

    const sendOtp = async (manual = true, emailParam = applicantId) => {
        if (otpLoading) return
        try {
            setOtpLoading(true)
            const res = await fetch("/internal/applicant-document/send-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emailParam, manual }) })
            const data = await res.json()
            if (!data.success) { alert(data.message || "Failed to send OTP"); return }
            const oldExpiry = localStorage.getItem("otp_expire_" + token)
            const now = new Date().getTime()
            if (oldExpiry && now < Number(oldExpiry)) { setTimeLeft(Math.floor((Number(oldExpiry) - now) / 1000)) }
            else { const et = now + (15 * 60 * 1000); localStorage.setItem("otp_expire_" + token, et.toString()); setTimeLeft(900) }
        } catch (e: any) { alert(e.message || "Failed to send OTP") }
        finally { setOtpLoading(false) }
    }
    const verifyOtp = async () => {
        const res = await fetch("/internal/applicant-document/verify-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: applicantId, otp }) })
        const data = await res.json()
        if (data.verified) { setOtpVerified(true); const et = new Date().getTime() + (15 * 60 * 1000); localStorage.setItem("otp_verified_" + token, "true"); localStorage.setItem("otp_expire_" + token, et.toString()) }
        else { alert("Invalid OTP") }
    }

    const handleFileChange = (f: string, file: File | null) => setDocumentForm(p => ({ ...p, [f]: file }))
    const handleRemoveFile = (f: string) => setDocumentForm(p => ({ ...p, [f]: null }))
    const handleRemoveExistingFile = (f: string) => setExistingFiles(p => { const n = { ...p }; delete n[f]; return n })
    const handleMultipleFileChange = (f: string, files: FileList | null) => { if (!files) return; const v = Array.from(files).filter(x => validateFile(x)); setDocumentForm(p => ({ ...p, [f]: [...(p[f as keyof typeof p] as File[]), ...v] })) }
    const handleRemoveMultipleFile = (f: string, i: number) => setDocumentForm(p => ({ ...p, [f]: (p[f as keyof typeof p] as File[]).filter((_, j) => j !== i) }))
    const handleRemoveExistingMultipleFile = (f: string, url: string) => setExistingMultipleFiles(p => ({ ...p, [f]: p[f].filter(u => u !== url) }))

    const uploadFile = async (file: File, filename: string): Promise<string | null> => {
        try {
            const fd = new FormData(); fd.append("file", file); fd.append("is_private", "0"); fd.append("filename", file.name)
            // if (existingDocumentId) { fd.append("doctype", "Applicant Document"); fd.append("docname", existingDocumentId); fd.append("fieldname", filename) }
            if (
                existingDocumentId &&
                existingDocumentId !== "null" &&
                existingDocumentId !== ""
            ) {
                fd.append("doctype", "Applicant Document");
                fd.append(
                    "docname",
                    String(existingDocumentId)
                );
                fd.append("fieldname", filename);
            }
            const r = await fetch("/internal/applicant-document/upload", { method: "POST", body: fd })
            const d = await r.json(); return (d?.message?.file_url) ? d.message.file_url : null
        } catch { return null }
    }

    // const handleSaveDocuments = async () => {
    //     const required = [{ field: 'aadharCard', name: 'Aadhar Card' }, { field: 'education', name: 'Education' }, { field: 'bankDetails', name: 'Bank Details' }, { field: 'pan', name: 'PAN' }]
    //     const missing = required.filter(d => !existingFiles[d.field] && !documentForm[d.field as keyof typeof documentForm])
    //     if (missing.length > 0) { alert(`Please upload required documents: ${missing.map(d => d.name).join(", ")}`); return }
    //     setIsSavingDocs(true)
    //     try {
    //         const fileUrls: { [key: string]: string | null } = { ...existingFiles }
    //         const ffm = { aadharCard: 'aadhar_card', passport: 'passport', experience: 'experience', education: 'education', bankDetails: 'bank_details', pan: 'pan', medical: 'medical', photos: 'photos' }
    //         for (const [ff, af] of Object.entries(ffm)) { const file = documentForm[ff as keyof typeof documentForm] as File | null; if (file) { const url = await uploadFile(file, af); if (url) fileUrls[ff] = url } }
    //         const mffm = { backgroundVerification: 'custom_background_verification', salarySlip: 'custom_salary_slip', additionalDocument: 'custom_additional_document' }
    //         const mfUrls: { [key: string]: string[] } = { custom_background_verification: [...existingMultipleFiles.backgroundVerification], custom_salary_slip: [...existingMultipleFiles.salarySlip], custom_additional_document: [...existingMultipleFiles.additionalDocument] }
    //         for (const [ff, af] of Object.entries(mffm)) { const files = documentForm[ff as keyof typeof documentForm] as File[]; for (const file of files) { const url = await uploadFile(file, af); if (url) mfUrls[af].push(url) } }
    //         const apiUrls: { [key: string]: string | null } = {}
    //         for (const [ff, url] of Object.entries(fileUrls)) { const af = ffm[ff as keyof typeof ffm]; if (af) apiUrls[af] = url }
    //         for (const [af, urls] of Object.entries(mfUrls)) { if (urls.length > 0) apiUrls[af] = JSON.stringify(urls) }
    //         const docData = { applicant_name: applicantId, ...apiUrls }
    //         const url = existingDocumentId ? `/internal/applicant-document?id=${existingDocumentId}` : `/internal/applicant-document`
    //         const method = existingDocumentId ? "PUT" : "POST"
    //         const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(docData) })
    //         if (response.ok) { setCurrentStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }) }
    //         else { alert("Failed to submit documents. Please try again.") }
    //     } catch { alert("Failed to submit documents.") }
    //     finally { setIsSavingDocs(false) }
    // }

    const handleSaveDocuments = async () => {
        const required = [{ field: 'aadharCard', name: 'Aadhar Card' }, { field: 'education', name: 'Education' }, { field: 'bankDetails', name: 'Bank Details' }, { field: 'pan', name: 'PAN' }]
        const missing = required.filter(d => !existingFiles[d.field])
        if (missing.length > 0) { alert(`Please upload required documents: ${missing.map(d => d.name).join(", ")}`); return }
        setIsSavingDocs(true)
        try {
            // All files already uploaded on select — just map existing URLs to Frappe field names
            const ffm: { [key: string]: string } = { aadharCard: 'aadhar_card', passport: 'passport', experience: 'experience', education: 'education', bankDetails: 'bank_details', pan: 'pan', medical: 'medical', photos: 'photos' }
            const apiUrls: { [key: string]: string | null } = {}
            for (const [ff, af] of Object.entries(ffm)) { if (existingFiles[ff]) apiUrls[af] = existingFiles[ff] }
            const mfUrls: { [key: string]: string[] } = {
                custom_background_verification: [...existingMultipleFiles.backgroundVerification],
                custom_salary_slip: [...existingMultipleFiles.salarySlip],
                custom_additional_document: [...existingMultipleFiles.additionalDocument]
            }
            for (const [af, urls] of Object.entries(mfUrls)) { if (urls.length > 0) apiUrls[af] = JSON.stringify(urls) }
            const docData = { applicant_name: applicantId, ...apiUrls }
            const url = existingDocumentId ? `/internal/applicant-document?id=${existingDocumentId}` : `/internal/applicant-document`
            const method = existingDocumentId ? "PUT" : "POST"
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(docData) })
            if (response.ok) { setCurrentStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }) }
            else { alert("Failed to submit documents. Please try again.") }
        } catch { alert("Failed to submit documents.") }
        finally { setIsSavingDocs(false) }
    }

    const handleSaveApplicationForm = async () => {
        if (!appForm.name1.trim()) { alert("Please enter your Full Name"); return }
        // if (!appSignatureFile) { alert("Please attach your Signature"); return }
        // setIsSavingApp(true)
        // try {
        //     let photoUrl = ""
        //     if (passportPhoto) {
        //         const fd = new FormData(); fd.append("file", passportPhoto); fd.append("is_private", "0"); fd.append("filename", passportPhoto.name)
        //         const r = await fetch("/internal/applicant-document/upload", { method: "POST", body: fd })
        //         const d = await r.json(); if (d?.message?.file_url) photoUrl = d.message.file_url
        //     }
        //     let sigUrl = ""
        //     if (appSignatureFile) {
        //         const fd = new FormData(); fd.append("file", appSignatureFile); fd.append("is_private", "0"); fd.append("filename", appSignatureFile.name)
        //         const r = await fetch("/internal/applicant-document/upload", { method: "POST", body: fd })
        //         const d = await r.json(); if (d?.message?.file_url) sigUrl = d.message.file_url
        //     }
        if (!appSignatureUrl) { alert("Please attach your Signature"); return }
        setIsSavingApp(true)
        try {
            const photoUrl = passportPhotoUrl
            const sigUrl = appSignatureUrl

            const payload = {
                ...appForm,
                applicant_email: applicantId,
                signature: sigUrl,
                ...(photoUrl ? { passport_size_photo: photoUrl } : {}),
                education_details: educationRows,
                previous_present_employment: employmentRows,
                professional_references: referenceRows,
            }
            const res = await fetch("/internal/applicant-document/application-form", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
            if (res.ok) { setCurrentStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }) }
            else { const e = await res.json(); alert(e?.message || "Failed to save application form.") }
        } catch { alert("Failed to save application form.") }
        finally { setIsSavingApp(false) }
    }

    const handleSaveDeclaration = async () => {
        if (!declForm.name1.trim()) { alert("Please enter your Name"); return }
        // if (!declSignatureFile) { alert("Please attach your Signature"); return }
        // setIsSavingDecl(true)
        // try {
        //     let sigUrl = ""
        //     if (declSignatureFile) {
        //         const fd = new FormData(); fd.append("file", declSignatureFile); fd.append("is_private", "0"); fd.append("filename", declSignatureFile.name)
        //         const r = await fetch("/internal/applicant-document/upload", { method: "POST", body: fd })
        //         const d = await r.json(); if (d?.message?.file_url) sigUrl = d.message.file_url
        //     }
        if (!declSignatureUrl) { alert("Please attach your Signature"); return }
        setIsSavingDecl(true)
        try {
            const sigUrl = declSignatureUrl
            const payload = {
                custom_applicant_email: applicantId,
                name1: declForm.name1, date: declForm.date, place: declForm.place, signature: sigUrl
            }
            const res = await fetch("/internal/applicant-document/application-declaration", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
            if (res.ok) {
                localStorage.removeItem("otp_verified_" + token)
                localStorage.removeItem("otp_expire_" + token)
                sessionStorage.removeItem("appForm_draft")
                sessionStorage.removeItem("educationRows_draft")
                sessionStorage.removeItem("employmentRows_draft")
                sessionStorage.removeItem("referenceRows_draft")
                sessionStorage.removeItem("declForm_draft")
                sessionStorage.removeItem("passportPhotoUrl")
                sessionStorage.removeItem("appSignatureUrl")
                sessionStorage.removeItem("declSignatureUrl")
                setCurrentStep(4)
                window.scrollTo({ top: 0, behavior: 'smooth' })
            } else { const e = await res.json(); alert(e?.message || "Failed to save declaration.") }
        } catch { alert("Failed to save declaration.") }
        finally { setIsSavingDecl(false) }
    }

    // ── render guards ─────────────────────────────────────────────────────────
    if (isLoadingExisting) return (
        <div className="ob"><style>{css}</style>
            <div className="ob-center"><div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                <Loader2 size={40} className="ob-spin" style={{ color: 'var(--accent)' }} />
                <span style={{ color: 'var(--t2)', fontSize: 15, fontWeight: 600 }}>Verifying credentials...</span>
            </div></div>
        </div>
    )
    if (!isValidApplicant) return (
        <div className="ob"><style>{css}</style>
            <div className="ob-center"><div className="ob-card" style={{ maxWidth: 480, width: '100%', textAlign: 'center', padding: '48px 32px' }}>
                <AlertCircle size={60} style={{ color: '#ef4444', margin: '0 auto 20px' }} />
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Access Denied</h2>
                <p style={{ fontSize: 15, color: 'var(--t2)', lineHeight: 1.6 }}>We couldn't find an applicant record for <strong>{applicantId}</strong>. Please ensure the link is correct or contact HR.</p>
            </div></div>
        </div>
    )
    if (isValidApplicant && !otpVerified) return (
        <div className="ob"><style>{css}</style>
            <div className="ob-center"><div className="ob-otp-card">
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}><Shield size={24} style={{ color: 'var(--accent)' }} /></div>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Email Verification</h2>
                <p style={{ color: 'var(--t3)', fontSize: 14, marginBottom: 6 }}>OTP sent to <strong style={{ color: 'var(--t2)' }}>{applicantId}</strong></p>
                <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 20, fontWeight: 600 }}>Expires in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</p>
                <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" className="ob-input" style={{ marginBottom: 12 }} onKeyDown={e => e.key === 'Enter' && verifyOtp()} />
                <button onClick={verifyOtp} className="ob-btn ob-btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 10 }}>Verify OTP</button>
                <button onClick={() => sendOtp(true)} disabled={otpLoading} className="ob-btn ob-btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>{otpLoading ? "Sending..." : "Resend OTP"}</button>
            </div></div>
        </div>
    )

    const STEPS = [{ num: 1, label: "Document Upload" }, { num: 2, label: "Application Form" }, { num: 3, label: "Declaration" }]
    const Stepper = () => (
        <div className="ob-stepper">
            {STEPS.map((s, i) => (<div key={s.num} style={{ display: 'contents' }}>
                <div className={`ob-step ${currentStep > s.num ? 'done' : currentStep === s.num ? 'active' : ''}`}>
                    <div className="ob-step-num">{currentStep > s.num ? <Check size={14} /> : s.num}</div>
                    <span className="ob-step-label">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`ob-step-sep ${currentStep > s.num ? 'done' : ''}`} />}
            </div>))}
        </div>
    )

    if (currentStep === 4) return (
        <div className="ob"><style>{css}</style>
            <div className="ob-wrap">
                <header className="ob-header"><div className="ob-brand"><img src="/vaaman_logo.png" alt="Logo" /><span>Onboarding Portal</span></div></header>
                <div className="ob-body"><div className="ob-card"><div className="ob-success">
                    <div className="ob-success-icon"><CheckCircle2 size={44} color="#fff" /></div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>All Done! 🎉</h1>
                    <p style={{ fontSize: 16, color: 'var(--t2)', marginBottom: 8, maxWidth: 460, lineHeight: 1.7 }}>Thank you, <strong>{applicantId}</strong>. Your documents, application form, and declaration have been successfully submitted.</p>
                    <p style={{ fontSize: 14, color: 'var(--t3)', marginBottom: 32 }}>Our HR team will review your submission and contact you shortly.</p>
                    <button onClick={() => window.close()} className="ob-btn ob-btn-primary" style={{ padding: '12px 40px' }}>Close Window</button>
                </div></div></div>
            </div>
        </div>
    )

    // FileUpload helpers — these are fine inside the component because they don't use hooks
    // and don't cause the input elements to remount (they render native elements directly)
    const FileUploadField = ({ label, field, required = false }: { label: string; field: keyof typeof documentForm; required?: boolean }) => {
        const newFile = documentForm[field] as File | null
        const existingFile = existingFiles[field as string]
        return (
            <div className="ob-field-wrap">
                <div className="ob-doc-label"><FileText size={14} />{label}{required && <span style={{ color: 'var(--red)', marginLeft: 2 }}>*</span>}</div>
                <div className="ob-upload-zone">
                    {existingFile && !newFile ? (
                        <div className="ob-file-existing">
                            <div className="ob-file-info"><div className="ob-file-icon green"><Check size={15} /></div><div><div className="ob-file-name">Already Uploaded</div><a href={`${API_BASE_URL}${existingFile}`} target="_blank" rel="noopener noreferrer" className="ob-file-link">View Document →</a></div></div>
                            <button type="button" className="ob-file-remove" onClick={() => handleRemoveExistingFile(field as string)}><X size={14} /></button>
                        </div>
                    ) : newFile ? (
                        <div className="ob-file-new">
                            <div className="ob-file-info"><div className="ob-file-icon blue"><Upload size={15} /></div><div><div className="ob-file-name">{newFile.name}</div><div className="ob-file-meta">{(newFile.size / 1024).toFixed(2)} KB</div></div></div>
                            <button type="button" className="ob-file-remove" onClick={() => handleRemoveFile(field as string)}><X size={14} /></button>
                        </div>
                    ) : (
                        <label className="ob-upload-trigger">
                            <div className="ob-upload-trigger-icon"><Upload size={20} /></div>
                            <span className="ob-upload-trigger-label">Attach Document</span>
                            {/* <input type="file" style={{ display: 'none' }} accept={ACCEPTED_FILE_TYPES} onChange={e => handleFileChange(field as string, e.target.files?.[0] || null)} /> */}
                            <input type="file" style={{ display: 'none' }} accept={ACCEPTED_FILE_TYPES} onChange={async e => {
                                const file = e.target.files?.[0] || null
                                if (!file) return
                                handleFileChange(field as string, file)
                                const fd = new FormData(); fd.append("file", file); fd.append("is_private", "0"); fd.append("filename", file.name)
                                if (existingDocumentId && existingDocumentId !== "null" && existingDocumentId !== "") {
                                    fd.append("doctype", "Applicant Document"); fd.append("docname", String(existingDocumentId)); fd.append("fieldname", field as string)
                                }
                                const r = await fetch("/internal/applicant-document/upload", { method: "POST", body: fd })
                                const d = await r.json()
                                if (d?.message?.file_url) {
                                    setExistingFiles(p => ({ ...p, [field as string]: d.message.file_url }))
                                    handleRemoveFile(field as string)
                                }
                            }} />
                        </label>
                    )}
                </div>
            </div>
        )
    }

    const MultipleFileUploadField = ({ label, field }: { label: string; field: keyof typeof documentForm }) => {
        const newFiles = documentForm[field] as File[]
        const existingFilesList = existingMultipleFiles[field as string] || []
        const hasFiles = newFiles.length > 0 || existingFilesList.length > 0
        return (
            <div className="ob-field-wrap">
                <div className="ob-doc-label"><FileText size={14} />{label}</div>
                <div className="ob-upload-zone">
                    {hasFiles ? (
                        <div className="ob-multi-files">
                            {existingFilesList.map((url, i) => (<div key={`e-${i}`} className="ob-file-existing"><div className="ob-file-info"><div className="ob-file-icon green"><Check size={15} /></div><div><a href={`${API_BASE_URL}${url}`} target="_blank" rel="noopener noreferrer" className="ob-file-link">View File {i + 1} →</a></div></div><button type="button" className="ob-file-remove" onClick={() => handleRemoveExistingMultipleFile(field as string, url)}><X size={14} /></button></div>))}
                            {newFiles.map((file, i) => (<div key={`n-${i}`} className="ob-file-new"><div className="ob-file-info"><div className="ob-file-icon blue"><Upload size={15} /></div><div><div className="ob-file-name">{file.name}</div></div></div><button type="button" className="ob-file-remove" onClick={() => handleRemoveMultipleFile(field as string, i)}><X size={14} /></button></div>))}
                            {/* <label className="ob-add-more"><Upload size={15} /><span className="ob-add-more-label">Add More</span><input type="file" multiple style={{ display: 'none' }} accept={ACCEPTED_FILE_TYPES} onChange={e => handleMultipleFileChange(field as string, e.target.files)} /></label>
                            //  */}
                            <label className="ob-add-more"><Upload size={15} /><span className="ob-add-more-label">Add More</span><input type="file" multiple style={{ display: 'none' }} accept={ACCEPTED_FILE_TYPES} onChange={async e => {
                                const files = e.target.files
                                if (!files) return
                                const valid = Array.from(files).filter(x => validateFile(x))
                                for (const file of valid) {
                                    const fd = new FormData(); fd.append("file", file); fd.append("is_private", "0"); fd.append("filename", file.name)
                                    const r = await fetch("/internal/applicant-document/upload", { method: "POST", body: fd })
                                    const d = await r.json()
                                    if (d?.message?.file_url) {
                                        setExistingMultipleFiles(p => ({ ...p, [field as string]: [...(p[field as string] || []), d.message.file_url] }))
                                    }
                                }
                            }} /></label>
                        </div>
                    ) : (
                        <label className="ob-upload-trigger">
                            <div className="ob-upload-trigger-icon"><Upload size={20} /></div>
                            <span className="ob-upload-trigger-label">Attach Documents</span>
                            {/* <input type="file" multiple style={{ display: 'none' }} accept={ACCEPTED_FILE_TYPES} onChange={e => handleMultipleFileChange(field as string, e.target.files)} /> */}
                            <input type="file" multiple style={{ display: 'none' }} accept={ACCEPTED_FILE_TYPES} onChange={async e => {
                                const files = e.target.files
                                if (!files) return
                                const valid = Array.from(files).filter(x => validateFile(x))
                                for (const file of valid) {
                                    const fd = new FormData(); fd.append("file", file); fd.append("is_private", "0"); fd.append("filename", file.name)
                                    const r = await fetch("/internal/applicant-document/upload", { method: "POST", body: fd })
                                    const d = await r.json()
                                    if (d?.message?.file_url) {
                                        setExistingMultipleFiles(p => ({ ...p, [field as string]: [...(p[field as string] || []), d.message.file_url] }))
                                    }
                                }
                            }} />
                        </label>
                    )}
                </div>
            </div>
        )
    }

    // ── step 1 ────────────────────────────────────────────────────────────────
    const renderStep1 = () => (<>
        <div className="ob-card">
            <div className="ob-card-head"><User size={16} /><span className="ob-card-title">Applicant Profile</span></div>
            <div className="ob-card-body"><div className="ob-readonly"><CheckCircle2 size={18} style={{ color: 'var(--green)' }} />{applicantId}</div></div>
        </div>
        <div className="ob-doc-grid">
            <div className="ob-card">
                <div className="ob-card-head"><FileText size={16} /><span className="ob-card-title">Identity Documents</span></div>
                <div className="ob-card-body">
                    <FileUploadField label="Aadhar Card" field="aadharCard" required />
                    <FileUploadField label="Passport" field="passport" />
                    <FileUploadField label="Experience Certificate" field="experience" />
                    <FileUploadField label="Education Certificate" field="education" required />
                </div>
            </div>
            <div className="ob-card">
                <div className="ob-card-head"><FileText size={16} /><span className="ob-card-title">Financial Documents</span></div>
                <div className="ob-card-body">
                    <FileUploadField label="Bank Account Details" field="bankDetails" required />
                    <FileUploadField label="PAN Card" field="pan" required />
                    <FileUploadField label="Medical Certificate" field="medical" />
                    <FileUploadField label="Passport Photos" field="photos" />
                </div>
            </div>
        </div>
        <div className="ob-card">
            <div className="ob-card-head"><FileText size={16} /><span className="ob-card-title">Additional Documents</span></div>
            <div className="ob-card-body">
                <div className="ob-doc-grid">
                    <MultipleFileUploadField label="Background Verification" field="backgroundVerification" />
                    <MultipleFileUploadField label="Salary Slip" field="salarySlip" />
                </div>
                <MultipleFileUploadField label="Additional Document" field="additionalDocument" />
            </div>
        </div>
        {/* <div className="ob-nav">
            <div />
            <button className="ob-btn ob-btn-primary" onClick={handleSaveDocuments} disabled={isSavingDocs}>
                {isSavingDocs ? <><Loader2 size={16} className="ob-spin" /> Uploading...</> : <>Save & Continue <ChevronRight size={16} /></>}
            </button>
        </div> */}
        <div style={{ marginTop: 20, marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 18px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10 }}>
            <input
                type="checkbox"
                id="consent-checkbox"
                checked={consentChecked}
                onChange={e => setConsentChecked(e.target.checked)}
                style={{ marginTop: 3, width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }}
            />
            <label htmlFor="consent-checkbox" style={{ fontSize: 13.5, color: '#92400e', lineHeight: 1.6, cursor: 'pointer', fontWeight: 500 }}>
                I hereby acknowledge and consent to Vaaman Engineers (I) Ltd. using my submitted documents for employment-related purposes.<span style={{ color: 'var(--red)', marginLeft: 3 }}>*</span>
            </label>
        </div>
        <div className="ob-nav">
            <div />
            <button className="ob-btn ob-btn-primary" onClick={handleSaveDocuments} disabled={isSavingDocs || !consentChecked}>
                {isSavingDocs ? <><Loader2 size={16} className="ob-spin" /> Uploading...</> : <>Save & Continue <ChevronRight size={16} /></>}
            </button>
        </div>
    </>)

    // ── step 2 ────────────────────────────────────────────────────────────────
    const renderStep2 = () => (<>
        <div className="ob-card">
            <div className="ob-card-head"><ClipboardList size={16} /><span className="ob-card-title">Details</span></div>
            <div className="ob-card-body">
                <div className="ob-grid-3">
                    <Inp field="date" label="Date" type="date" value={appForm.date} onChange={handleAppFormChange} />
                    <Inp field="post_applied_for" label="Post Applied For" value={appForm.post_applied_for} onChange={handleAppFormChange} />
                    <Inp field="job_location" label="Job Location" value={appForm.job_location} onChange={handleAppFormChange} />
                </div>
                <div className="ob-grid-2">
                    <Inp field="vacancy_known_from" label="Vacancy Known From" value={appForm.vacancy_known_from} onChange={handleAppFormChange} />
                    <Inp field="contact_number" label="Contact Number" value={appForm.contact_number} onChange={handleAppFormChange} />
                </div>
                <div className="ob-field">
                    <label className="ob-label">Passport Size Photo</label>
                    <div className="ob-upload-zone" style={{ maxWidth: 220 }}>
                        {passportPhoto ? (
                            <div className="ob-file-new" style={{ margin: 0, borderRadius: 8 }}>
                                <div className="ob-file-info"><div className="ob-file-icon blue"><Upload size={15} /></div><div><div className="ob-file-name">{passportPhoto.name}</div></div></div>
                                <button type="button" className="ob-file-remove" onClick={() => { setPassportPhoto(null); setPassportPhotoUrl(""); sessionStorage.removeItem("passportPhotoUrl") }}><X size={14} /></button>
                            </div>
                        ) : passportPhotoUrl ? (
                            <div className="ob-file-existing" style={{ margin: 0, borderRadius: 8 }}>
                                <div className="ob-file-info"><div className="ob-file-icon green"><Check size={15} /></div><div><div className="ob-file-name">Photo Uploaded</div><a href={`${API_BASE_URL}${passportPhotoUrl}`} target="_blank" rel="noopener noreferrer" className="ob-file-link">View →</a></div></div>
                                <button type="button" className="ob-file-remove" onClick={() => { setPassportPhotoUrl(""); sessionStorage.removeItem("passportPhotoUrl") }}><X size={14} /></button>
                            </div>
                        ) : (
                            <label className="ob-upload-trigger" style={{ padding: '14px 12px' }}>
                                <div className="ob-upload-trigger-icon" style={{ width: 38, height: 38 }}><Upload size={16} /></div>
                                <span className="ob-upload-trigger-label" style={{ fontSize: 12 }}>Attach Photo</span>
                                {/* <input type="file" style={{ display: 'none' }} accept=".jpg,.jpeg,.png" onChange={e => setPassportPhoto(e.target.files?.[0] || null)} /> */}
                                <input type="file" style={{ display: 'none' }} accept=".jpg,.jpeg,.png" onChange={async e => {
                                    const file = e.target.files?.[0] || null
                                    if (!file) return
                                    setPassportPhoto(file)
                                    const fd = new FormData(); fd.append("file", file); fd.append("is_private", "0"); fd.append("filename", file.name)
                                    const r = await fetch("/internal/applicant-document/upload", { method: "POST", body: fd })
                                    const d = await r.json()
                                    if (d?.message?.file_url) { setPassportPhotoUrl(d.message.file_url); sessionStorage.setItem("passportPhotoUrl", d.message.file_url) }
                                }} />
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div className="ob-card">
            <div className="ob-card-head"><User size={16} /><span className="ob-card-title">Personal Information</span></div>
            <div className="ob-card-body">
                <div className="ob-grid-3">
                    <Inp field="name1" label="Full Name" req value={appForm.name1} onChange={handleAppFormChange} />
                    <Inp field="father_name" label="Father's Name" value={appForm.father_name} onChange={handleAppFormChange} />
                    <Inp field="occupation" label="Occupation" value={appForm.occupation} onChange={handleAppFormChange} />
                </div>
                <Txt field="local_address" label="Local Address" value={appForm.local_address} onChange={handleAppFormChange} />
                <Txt field="permanent_address" label="Permanent Address" value={appForm.permanent_address} onChange={handleAppFormChange} />
                <div className="ob-grid-3">
                    <Inp field="contact_number" label="Contact No." value={appForm.contact_number} onChange={handleAppFormChange} />
                    <Inp field="alternate_contact_number" label="Alternate Contact No." value={appForm.alternate_contact_number} onChange={handleAppFormChange} />
                    <Inp field="email_id" label="Email ID" type="email" value={appForm.email_id} onChange={handleAppFormChange} />
                </div>
                <div className="ob-grid-3">
                    <Inp field="birth_date" label="Birth Date" type="date" value={appForm.birth_date} onChange={handleAppFormChange} />
                    <Inp field="place_of_domicile" label="Place of Domicile" value={appForm.place_of_domicile} onChange={handleAppFormChange} />
                    <div className="ob-field">
                        <label className="ob-label">Marital Status — Are you married?</label>
                        <select className="ob-select" value={appForm.marital_status_are_you_married} onChange={e => handleAppFormChange("marital_status_are_you_married", e.target.value)}>
                            <option value="">Select</option>
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                        </select>
                    </div>
                </div>
                {appForm.marital_status_are_you_married === "YES" && (
                    <div className="ob-grid-2">
                        <Inp field="wife__husband_name" label="Wife / Husband Name" value={appForm.wife__husband_name} onChange={handleAppFormChange} />
                        <Inp field="his__her_place_of_work" label="His / Her Place of Work" value={appForm.his__her_place_of_work} onChange={handleAppFormChange} />
                    </div>
                )}
                <div className="ob-grid-4">
                    <Inp field="children_if_any_name_1" label="Children Name 1" value={appForm.children_if_any_name_1} onChange={handleAppFormChange} />
                    <Inp field="child_1_age" label="Child 1 Age" value={appForm.child_1_age} onChange={handleAppFormChange} />
                    <Inp field="children_if_any_name_2" label="Children Name 2" value={appForm.children_if_any_name_2} onChange={handleAppFormChange} />
                    <Inp field="child_2_age" label="Child 2 Age" value={appForm.child_2_age} onChange={handleAppFormChange} />
                </div>
                <Txt field="health_details" label="Health Details (any disability, illness or past operation)" value={appForm.health_details} onChange={handleAppFormChange} />
                <Inp field="language_known" label="Language Known" value={appForm.language_known} onChange={handleAppFormChange} />
                <div className="ob-grid-3">
                    <div className="ob-field">
                        <label className="ob-label">EPFO Membership</label>
                        <select className="ob-select" value={appForm.epfo_membership} onChange={e => handleAppFormChange("epfo_membership", e.target.value)}>
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                        </select>
                    </div>
                    <Inp field="hobbies" label="Hobbies" value={appForm.hobbies} onChange={handleAppFormChange} />
                </div>
            </div>
        </div>

        <div className="ob-card">
            <div className="ob-card-head"><FileText size={16} /><span className="ob-card-title">Educational Qualification</span></div>
            <div className="ob-card-body">
                <div className="ob-table-wrap">
                    <table className="ob-table">
                        <thead><tr>
                            <th>Education Level</th><th>Name of Institute</th><th>Stream</th>
                            <th>Class</th><th>Year Passed</th><th>Subjects</th><th></th>
                        </tr></thead>
                        <tbody>{educationRows.map((row, i) => (
                            <tr key={i}>
                                <td>
                                    <select className="ob-table-select" value={row.education_level} onChange={e => { const r = [...educationRows]; r[i].education_level = e.target.value; setEducationRows(r) }}>
                                        <option value="">Select</option>
                                        <option value="SSC">SSC</option>
                                        <option value="HSC">HSC</option>
                                        <option value="Graduation">Graduation</option>
                                        <option value="Post Graduation">Post Graduation</option>
                                        <option value="Courses">Courses</option>
                                        <option value="IT Skills">IT Skills</option>
                                    </select>
                                </td>
                                <td><input className="ob-table-input" value={row.name_of_institute} onChange={e => { const r = [...educationRows]; r[i].name_of_institute = e.target.value; setEducationRows(r) }} /></td>
                                <td><input className="ob-table-input" value={row.stream} onChange={e => { const r = [...educationRows]; r[i].stream = e.target.value; setEducationRows(r) }} /></td>
                                <td><input className="ob-table-input" style={{ minWidth: 80 }} value={row.class} onChange={e => { const r = [...educationRows]; r[i].class = e.target.value; setEducationRows(r) }} /></td>
                                <td><input className="ob-table-input" style={{ minWidth: 90 }} value={row.year_passed} onChange={e => { const r = [...educationRows]; r[i].year_passed = e.target.value; setEducationRows(r) }} /></td>
                                <td><input className="ob-table-input" value={row.subjects} onChange={e => { const r = [...educationRows]; r[i].subjects = e.target.value; setEducationRows(r) }} /></td>
                                <td><button className="ob-del-row" onClick={() => setEducationRows(educationRows.filter((_, j) => j !== i))}><Trash2 size={13} /></button></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
                <button className="ob-add-row" onClick={() => setEducationRows([...educationRows, { education_level: "", name_of_institute: "", stream: "", class: "", year_passed: "", subjects: "" }])}><Plus size={14} /> Add Row</button>            </div>
        </div>

        <div className="ob-card">
            <div className="ob-card-head"><FileText size={16} /><span className="ob-card-title">Previous & Present Employment</span></div>
            <div className="ob-card-body">
                <div className="ob-table-wrap">
                    <table className="ob-table">
                        <thead><tr>
                            <th>Sr.</th><th>Name of Employer</th><th>Designation</th>
                            <th>Reporting To (Name / Contact / Email)</th><th>HR Details (Name / Email / Contact)</th>
                            <th>Salary Drawn Per Year</th><th>Reason for Leaving</th><th>Duration of Service (From–To)</th><th>No. of Years / Months</th><th></th>

                        </tr></thead>
                        <tbody>{employmentRows.map((row, i) => (
                            <tr key={i}>
                                <td><input className="ob-table-input" style={{ minWidth: 40 }} value={row.sr_no} onChange={e => { const r = [...employmentRows]; r[i].sr_no = e.target.value; setEmploymentRows(r) }} /></td>
                                <td><input className="ob-table-input" value={row.name_of_employer} onChange={e => { const r = [...employmentRows]; r[i].name_of_employer = e.target.value; setEmploymentRows(r) }} /></td>
                                <td><input className="ob-table-input" value={row.designation} onChange={e => { const r = [...employmentRows]; r[i].designation = e.target.value; setEmploymentRows(r) }} /></td>
                                <td><input className="ob-table-input" value={row.reporting_to_name_contact_number_email_id} onChange={e => { const r = [...employmentRows]; r[i].reporting_to_name_contact_number_email_id = e.target.value; setEmploymentRows(r) }} /></td>
                                <td><input className="ob-table-input" value={row.hr_details_of_company_name_email_id_contact_number} onChange={e => { const r = [...employmentRows]; r[i].hr_details_of_company_name_email_id_contact_number = e.target.value; setEmploymentRows(r) }} /></td>
                                <td><input className="ob-table-input" value={row.salary_drawn_per_year} onChange={e => { const r = [...employmentRows]; r[i].salary_drawn_per_year = e.target.value; setEmploymentRows(r) }} /></td>
                                <td><input className="ob-table-input" value={row.reason_for_leaving} onChange={e => { const r = [...employmentRows]; r[i].reason_for_leaving = e.target.value; setEmploymentRows(r) }} /></td>
                                <td><input className="ob-table-input" placeholder="e.g. Jan 2020 – Mar 2023" value={row.duration_of_service} onChange={e => { const r = [...employmentRows]; r[i].duration_of_service = e.target.value; setEmploymentRows(r) }} /></td>
                                <td><input className="ob-table-input" placeholder="e.g. 3 Years 2 Months" value={row.no_of_years__months} onChange={e => { const r = [...employmentRows]; r[i].no_of_years__months = e.target.value; setEmploymentRows(r) }} /></td>
                                <td><button className="ob-del-row" onClick={() => setEmploymentRows(employmentRows.filter((_, j) => j !== i))}><Trash2 size={13} /></button></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
                <button className="ob-add-row" onClick={() => setEmploymentRows([...employmentRows, { sr_no: String(employmentRows.length + 1), name_of_employer: "", designation: "", reporting_to_name_contact_number_email_id: "", hr_details_of_company_name_email_id_contact_number: "", salary_drawn_per_year: "", reason_for_leaving: "", duration_of_service: "", no_of_years__months: "" }
                ])}><Plus size={14} /> Add Row</button>                <div style={{ marginTop: 20 }} className="ob-grid-2">
                    <Inp field="salary_expected" label="Salary Expected" value={appForm.salary_expected} onChange={handleAppFormChange} />
                </div>
                <Txt field="additional_information" label="Additional Information" value={appForm.additional_information} onChange={handleAppFormChange} />
            </div>
        </div>

        <div className="ob-card">
            <div className="ob-card-head"><FileText size={16} /><span className="ob-card-title">Professional References</span></div>
            <div className="ob-card-body">
                <div className="ob-note">Note: References of friends &amp; relatives shall not be considered. References of Professors / Doctors / Lawyers and colleagues from previous organizations are acceptable. Avoid reference from current organization.</div>
                <div className="ob-table-wrap">
                    <table className="ob-table">
                        <thead><tr>
                            <th>#</th><th>Reference Name</th><th>Organization Name</th><th>Designation</th>
                            <th>Is Current Org?</th><th>Reference Email ID</th><th>Landline No.</th>
                            <th>Mobile No.</th><th>Known Period (Months/Years)</th><th>Relationship</th><th></th>
                        </tr></thead>
                        <tbody>{referenceRows.map((row, i) => (
                            <tr key={i}>
                                <td style={{ fontWeight: 700, color: 'var(--t3)', textAlign: 'center' }}>{i + 1}</td>
                                <td><input className="ob-table-input" value={row.reference_name} onChange={e => { const r = [...referenceRows]; r[i].reference_name = e.target.value; setReferenceRows(r) }} /></td>
                                <td><input className="ob-table-input" value={row.organization_name} onChange={e => { const r = [...referenceRows]; r[i].organization_name = e.target.value; setReferenceRows(r) }} /></td>
                                <td><input className="ob-table-input" value={row.designation} onChange={e => { const r = [...referenceRows]; r[i].designation = e.target.value; setReferenceRows(r) }} /></td>
                                <td><select className="ob-table-select" value={row.is_current_organization} onChange={e => { const r = [...referenceRows]; r[i].is_current_organization = e.target.value; setReferenceRows(r) }}><option value="YES">YES</option><option value="NO">NO</option></select></td>
                                <td><input className="ob-table-input" value={row.reference_email_id} onChange={e => { const r = [...referenceRows]; r[i].reference_email_id = e.target.value; setReferenceRows(r) }} /></td>
                                <td><input className="ob-table-input" value={row.landline_telephone_no} onChange={e => { const r = [...referenceRows]; r[i].landline_telephone_no = e.target.value; setReferenceRows(r) }} /></td>
                                <td><input className="ob-table-input" value={row.mobile_phone_no} onChange={e => { const r = [...referenceRows]; r[i].mobile_phone_no = e.target.value; setReferenceRows(r) }} /></td>
                                <td><input className="ob-table-input" value={row.known_period_monthsyears} onChange={e => { const r = [...referenceRows]; r[i].known_period_monthsyears = e.target.value; setReferenceRows(r) }} /></td>
                                <td><input className="ob-table-input" value={row.relationship_with_applicant} onChange={e => { const r = [...referenceRows]; r[i].relationship_with_applicant = e.target.value; setReferenceRows(r) }} /></td>
                                <td><button className="ob-del-row" onClick={() => setReferenceRows(referenceRows.filter((_, j) => j !== i))}><Trash2 size={13} /></button></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
                <button className="ob-add-row" onClick={() => setReferenceRows([...referenceRows, { reference_name: "", organization_name: "", designation: "", is_current_organization: "NO", reference_email_id: "", landline_telephone_no: "", mobile_phone_no: "", known_period_monthsyears: "", relationship_with_applicant: "" }])}><Plus size={14} /> Add Reference</button>            </div>
        </div>

        <div className="ob-card">
            <div className="ob-card-head"><User size={16} /><span className="ob-card-title">Previous Interview Details (if applicable)</span></div>
            <div className="ob-card-body">
                <div className="ob-grid-3">
                    <Inp field="employee_name" label="Employee Name" value={appForm.employee_name} onChange={handleAppFormChange} />
                    <Inp field="employee_relationship" label="Employee Relationship" value={appForm.employee_relationship} onChange={handleAppFormChange} />
                    <Inp field="employee_contact_number" label="Employee Contact Number" value={appForm.employee_contact_number} onChange={handleAppFormChange} />
                </div>
                <div className="ob-grid-3">
                    <Inp field="interviewed_for_which_position" label="Interviewed for which Position" value={appForm.interviewed_for_which_position} onChange={handleAppFormChange} />
                    <Inp field="interviewed_for_which_location" label="Interviewed for which Location" value={appForm.interviewed_for_which_location} onChange={handleAppFormChange} />
                    <Inp field="interview_date" label="Interview Date" type="date" value={appForm.interview_date} onChange={handleAppFormChange} />
                </div>
                <div className="ob-grid-2">
                    <Inp field="candidate_name" label="Candidate Name" value={appForm.candidate_name} onChange={handleAppFormChange} />
                </div>
            </div>
        </div>

        <div className="ob-card">
            <div className="ob-card-head"><PenTool size={16} /><span className="ob-card-title">Applicant Signature</span></div>
            <div className="ob-card-body">
                <div className="ob-field">
                    <label className="ob-label">Signature <span className="ob-req">*</span></label>
                    <div className="ob-upload-zone" style={{ maxWidth: 220 }}>
                        {appSignatureFile ? (
                            <div className="ob-file-new" style={{ margin: 0, borderRadius: 8 }}>
                                <div className="ob-file-info"><div className="ob-file-icon blue"><Upload size={15} /></div><div><div className="ob-file-name">{appSignatureFile.name}</div></div></div>
                                <button type="button" className="ob-file-remove" onClick={() => { setAppSignatureFile(null); setAppSignatureUrl(""); sessionStorage.removeItem("appSignatureUrl") }}><X size={14} /></button>
                            </div>
                        ) : appSignatureUrl ? (
                            <div className="ob-file-existing" style={{ margin: 0, borderRadius: 8 }}>
                                <div className="ob-file-info"><div className="ob-file-icon green"><Check size={15} /></div><div><div className="ob-file-name">Signature Uploaded</div><a href={`${API_BASE_URL}${appSignatureUrl}`} target="_blank" rel="noopener noreferrer" className="ob-file-link">View →</a></div></div>
                                <button type="button" className="ob-file-remove" onClick={() => { setAppSignatureUrl(""); sessionStorage.removeItem("appSignatureUrl") }}><X size={14} /></button>
                            </div>
                        ) : (
                            <label className="ob-upload-trigger" style={{ padding: '14px 12px' }}>
                                <div className="ob-upload-trigger-icon" style={{ width: 38, height: 38 }}><Upload size={16} /></div>
                                <span className="ob-upload-trigger-label" style={{ fontSize: 12 }}>Attach Signature</span>
                                {/* <input type="file" style={{ display: 'none' }} accept=".jpg,.jpeg,.png" onChange={e => setAppSignatureFile(e.target.files?.[0] || null)} /> */}
                                <input type="file" style={{ display: 'none' }} accept=".jpg,.jpeg,.png" onChange={async e => {
                                    const file = e.target.files?.[0] || null
                                    if (!file) return
                                    setAppSignatureFile(file)
                                    const fd = new FormData(); fd.append("file", file); fd.append("is_private", "0"); fd.append("filename", file.name)
                                    const r = await fetch("/internal/applicant-document/upload", { method: "POST", body: fd })
                                    const d = await r.json()
                                    if (d?.message?.file_url) { setAppSignatureUrl(d.message.file_url); sessionStorage.setItem("appSignatureUrl", d.message.file_url) }
                                }} />
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div className="ob-nav">
            <button className="ob-btn ob-btn-ghost" onClick={() => { setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><ChevronLeft size={16} /> Back</button>
            <button className="ob-btn ob-btn-primary" onClick={handleSaveApplicationForm} disabled={isSavingApp}>
                {isSavingApp ? <><Loader2 size={16} className="ob-spin" /> Saving...</> : <>Save & Continue <ChevronRight size={16} /></>}
            </button>
        </div>
    </>)

    // ── step 3 ────────────────────────────────────────────────────────────────
    const renderStep3 = () => (<>
        <div className="ob-card">
            <div className="ob-card-head"><Shield size={16} /><span className="ob-card-title">Declaration and General Consent to Background Investigation</span></div>
            <div className="ob-card-body">
                <p style={{ fontSize: 13, color: 'var(--t3)', fontWeight: 600, marginBottom: 16 }}>To be signed by the Applicant</p>
                <div className="ob-decl-text">
                    <p>I authorize the Vaaman Engineers (India) Ltd. (VEIL) or retained third parties to obtain investigative employment verification report in connection to my application for employment.</p>
                    <p>The verification report may include information regarding my character, general information, personal characteristic, Education, employment history, credit history, court records, including criminal verification records permitted by law, passport verification, PAN verification, Drug test, address verification, reference from professional and personal associates as may be applicable and any other checks as found relevant for the profile.</p>
                    <p>I certify that the information furnished in this form as well as in all other forms filled-in by me in conjunction with my employment is factually correct and subject to verification by VEIL including Reference Check and Background Verification.</p>
                    <p>I accept that an appointment given to me on this basis can be revoked and / or terminated without any notice at any time in future if any information has been found to be false, misleading, deliberately omitted / suppressed.</p>
                    <p>I certify that I am at present in sound mental and physical condition to undertake employment with VEIL.</p>
                    <p>I confirm that the Company is entitled to share such investigation report with its clients to the extent necessary in connection with the Services, which I may be required to provide to such clients. I confirm and undertake that the Company shall incur no liability or obligation of any nature whatsoever resulting from such investigation or sharing of the investigation results as above.</p>
                    <p>I also declare that there is no criminal case filed against me or pending against me in any Court of law in India or abroad and no restrictions are placed on my travelling anywhere in India or abroad for the purpose of business of the company.</p>
                </div>
                <div className="ob-grid-3">
                    <div className="ob-field">
                        <label className="ob-label">Name <span className="ob-req">*</span></label>
                        <input className="ob-input" value={declForm.name1} onChange={e => setDeclForm(p => ({ ...p, name1: e.target.value }))} />
                    </div>
                    <div className="ob-field">
                        <label className="ob-label">Date</label>
                        <input type="date" className="ob-input" value={declForm.date} onChange={e => setDeclForm(p => ({ ...p, date: e.target.value }))} />
                    </div>
                    <div className="ob-field">
                        <label className="ob-label">Place</label>
                        <input className="ob-input" value={declForm.place} onChange={e => setDeclForm(p => ({ ...p, place: e.target.value }))} />
                    </div>
                </div>
                <div className="ob-field">
                    <label className="ob-label">Signature <span className="ob-req">*</span></label>
                    <div className="ob-upload-zone" style={{ maxWidth: 220 }}>
                        {declSignatureFile ? (
                            <div className="ob-file-new" style={{ margin: 0, borderRadius: 8 }}>
                                <div className="ob-file-info"><div className="ob-file-icon blue"><Upload size={15} /></div><div><div className="ob-file-name">{declSignatureFile.name}</div></div></div>
                                <button type="button" className="ob-file-remove" onClick={() => { setDeclSignatureFile(null); setDeclSignatureUrl(""); sessionStorage.removeItem("declSignatureUrl") }}><X size={14} /></button>
                            </div>
                        ) : declSignatureUrl ? (
                            <div className="ob-file-existing" style={{ margin: 0, borderRadius: 8 }}>
                                <div className="ob-file-info"><div className="ob-file-icon green"><Check size={15} /></div><div><div className="ob-file-name">Signature Uploaded</div><a href={`${API_BASE_URL}${declSignatureUrl}`} target="_blank" rel="noopener noreferrer" className="ob-file-link">View →</a></div></div>
                                <button type="button" className="ob-file-remove" onClick={() => { setDeclSignatureUrl(""); sessionStorage.removeItem("declSignatureUrl") }}><X size={14} /></button>
                            </div>
                        ) : (
                            <label className="ob-upload-trigger" style={{ padding: '14px 12px' }}>
                                <div className="ob-upload-trigger-icon" style={{ width: 38, height: 38 }}><Upload size={16} /></div>
                                <span className="ob-upload-trigger-label" style={{ fontSize: 12 }}>Attach Signature</span>
                                {/* <input type="file" style={{ display: 'none' }} accept=".jpg,.jpeg,.png" onChange={e => setDeclSignatureFile(e.target.files?.[0] || null)} /> */}
                                <input type="file" style={{ display: 'none' }} accept=".jpg,.jpeg,.png" onChange={async e => {
                                    const file = e.target.files?.[0] || null
                                    if (!file) return
                                    setDeclSignatureFile(file)
                                    const fd = new FormData(); fd.append("file", file); fd.append("is_private", "0"); fd.append("filename", file.name)
                                    const r = await fetch("/internal/applicant-document/upload", { method: "POST", body: fd })
                                    const d = await r.json()
                                    if (d?.message?.file_url) { setDeclSignatureUrl(d.message.file_url); sessionStorage.setItem("declSignatureUrl", d.message.file_url) }
                                }} />
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </div>
        <div className="ob-nav">
            <button className="ob-btn ob-btn-ghost" onClick={() => { setCurrentStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><ChevronLeft size={16} /> Back</button>
            <button className="ob-btn ob-btn-success" onClick={handleSaveDeclaration} disabled={isSavingDecl}>
                {isSavingDecl ? <><Loader2 size={16} className="ob-spin" /> Submitting...</> : <><Send size={16} /> Submit All</>}
            </button>
        </div>
    </>)

    return (
        <><style>{css}</style>
            <div className="ob"><div className="ob-wrap">
                <header className="ob-header"><div className="ob-brand"><img src="/vaaman_logo.png" alt="Logo" /><span>Onboarding Portal</span></div></header>
                <div className="ob-body">
                    <div style={{ marginBottom: 24 }}>
                        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--t1)' }}>Candidate Onboarding</h1>
                        <p style={{ fontSize: 14, color: 'var(--t3)', marginTop: 4 }}>Welcome, <strong style={{ color: 'var(--t2)' }}>{applicantId}</strong>. Please complete all steps below.</p>
                    </div>
                    <Stepper />
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                </div>
            </div></div></>
    )
}
