"use client"
import { useState, useEffect, use } from "react"
import {
    Upload, X, Check, FileText, User,
    CheckCircle2, Loader2, Zap
} from "lucide-react"
import { API_BASE_URL } from '@/lib/api-config' // You can still use this for viewing uploaded file links

const ACCEPTED_FILE_TYPES = ".jpg,.jpeg,.doc,.pdf,.docx"
const ACCEPTED_MIME_TYPES = ["image/jpeg", "application/msword", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

const validateFile = (file: File): boolean => {
    return ACCEPTED_MIME_TYPES.includes(file.type)
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dv {
    --accent:    #009ef7;
    --accent-h:  #007ec4;
    --accent-lt: #e0f4ff;
    --bg:        #f0f8fe;
    --card:      #ffffff;
    --border:    #cce8f8;
    --border-s:  #ddf0fb;
    --t1:        #0d1b2a;
    --t2:        #2d5a78;
    --t3:        #6a9cb8;
    --green:     #16a34a;
    --green-lt:  #dcfce7;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13.5px;
    -webkit-font-smoothing: antialiased;
  }

  .dv-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); justify-content: center; }

  .dv-main {
    flex: 1; display: flex; flex-direction: column;
    min-height: 100vh; width: 100%; max-width: 1200px;
  }

  .dv-header {
    height: 70px; background: transparent; 
    display: flex; align-items: center; padding: 0 32px; gap: 12px;
    margin-top: 20px;
  }
  .dv-brand { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 20px; color: var(--t1); }
  .dv-brand img { height: 32px; width: auto; }

  .dv-page-outer { flex: 1; display: flex; justify-content: center; padding: 10px 32px 40px; }
  .dv-page { width: 100%; display: flex; flex-direction: column; gap: 22px; }

  .dv-toolbar { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
  .dv-page-title { font-size: 24px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; }
  .dv-page-sub { font-size: 14px; color: var(--t3); }

  .dv-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
    overflow: hidden; box-shadow: 0 4px 12px rgba(0,158,247,.04);
  }
  .dv-card-head {
    padding: 16px 22px; border-bottom: 1px solid var(--border-s);
    background: linear-gradient(to right, #f8fbff, #eef7ff);
    display: flex; align-items: center; gap: 10px;
  }
  .dv-card-head svg { color: var(--accent); }
  .dv-card-title { font-size: 14px; font-weight: 700; color: var(--t1); letter-spacing: -0.2px; }
  .dv-card-body { padding: 22px; }

  .dv-banner {
    display: flex; align-items: center; gap: 10px; padding: 12px 16px;
    border-radius: 9px; margin-bottom: 16px;
  }
  .dv-banner.loading { background: #eff6ff; border: 1px solid #bfdbfe; }
  .dv-banner.loading svg { color: var(--accent); }
  .dv-banner.loading span { font-size: 13px; font-weight: 500; color: #1d4ed8; }
  .dv-banner.success { background: linear-gradient(to right, var(--green-lt), #d1fae5); border: 1px solid #bbf7d0; }
  .dv-banner.success svg { color: var(--green); flex-shrink: 0; }
  .dv-banner.success span { font-size: 13px; font-weight: 500; color: #166534; }

  .dv-spin { animation: dv-spin 1s linear infinite; }
  @keyframes dv-spin { to { transform: rotate(360deg); } }

  .dv-label {
    display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: var(--t2);
    margin-bottom: 8px; margin-top: 18px;
  }
  .dv-label:first-child { margin-top: 0; }
  .dv-required { color: #ef4444; }

  .dv-readonly-field {
    width: 100%; height: 44px; padding: 0 14px; border-radius: 9px;
    border: 1px solid var(--border); background: #f8fbff; color: var(--t1);
    font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 10px;
    cursor: default;
  }

  .dv-upload-zone { border: 2px dashed var(--border); border-radius: 10px; transition: border-color .15s; background: #fafcff; }
  .dv-upload-zone:hover { border-color: var(--accent); }

  .dv-file-existing {
    display: flex; align-items: center; justify-content: space-between;
    background: linear-gradient(to right, var(--green-lt), #d1fae5);
    border-radius: 9px; padding: 12px 14px; border: 1px solid #bbf7d0;
  }
  .dv-file-new {
    display: flex; align-items: center; justify-content: space-between;
    background: linear-gradient(to right, var(--accent-lt), #e0eaff);
    border-radius: 9px; padding: 12px 14px; border: 1px solid var(--border);
  }
  .dv-file-info { display: flex; align-items: center; gap: 12px; }
  .dv-file-icon {
    width: 36px; height: 36px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    box-shadow: 0 2px 5px rgba(0,0,0,.1);
  }
  .dv-file-icon.green { background: linear-gradient(135deg, var(--green), #22c55e); }
  .dv-file-icon.blue { background: linear-gradient(135deg, var(--accent), #3b82f6); }
  .dv-file-icon svg { color: #fff; width: 15px; height: 15px; }
  .dv-file-name { font-size: 13px; font-weight: 600; color: var(--t1); }
  .dv-file-link { font-size: 11.5px; color: var(--accent); font-weight: 500; text-decoration: none; }
  .dv-file-link:hover { text-decoration: underline; }
  .dv-file-meta { font-size: 11.5px; color: var(--t3); }
  .dv-file-replace { font-size: 11px; color: var(--accent); font-weight: 600; }
  .dv-file-remove {
    width: 28px; height: 28px; border-radius: 7px; background: none; border: none;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: #ef4444; flex-shrink: 0; transition: background .14s;
  }
  .dv-file-remove:hover { background: #fef2f2; }

  .dv-upload-trigger {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    cursor: pointer; padding: 20px 16px; gap: 8px;
  }
  .dv-upload-trigger-icon {
    width: 44px; height: 44px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), #3b82f6);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 3px 8px rgba(0,158,247,.3); transition: box-shadow .15s;
  }
  .dv-upload-trigger:hover .dv-upload-trigger-icon { box-shadow: 0 5px 14px rgba(0,158,247,.4); }
  .dv-upload-trigger-icon svg { color: #fff; width: 20px; height: 20px; }
  .dv-upload-trigger-label { font-size: 13px; font-weight: 600; color: var(--t2); transition: color .14s; }
  .dv-upload-trigger:hover .dv-upload-trigger-label { color: var(--accent); }
  .dv-upload-trigger-sub { font-size: 11.5px; color: var(--t3); text-align: center; }

  .dv-multi-files { display: flex; flex-direction: column; gap: 8px; padding: 10px; }
  .dv-add-more {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    cursor: pointer; padding: 10px; border: 2px dashed var(--border-s);
    border-radius: 8px; transition: border-color .15s; margin-top: 2px;
  }
  .dv-add-more:hover { border-color: var(--accent); }
  .dv-add-more svg, .dv-add-more-label { color: var(--t3); transition: color .14s; font-weight: 600; font-size: 11.5px;}
  .dv-add-more:hover svg, .dv-add-more:hover .dv-add-more-label { color: var(--accent); }

  .dv-field-wrap { margin-bottom: 20px; }
  .dv-doc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

  .dv-save-wrap { display: flex; justify-content: flex-end; padding-bottom: 8px; margin-top: 10px; }
  .dv-save-btn {
    display: flex; align-items: center; gap: 8px; padding: 14px 36px; border-radius: 9px;
    background: var(--accent); color: #fff; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600;
    box-shadow: 0 4px 14px rgba(0,158,247,.3); transition: all .15s;
  }
  .dv-save-btn:hover:not(:disabled) { background: var(--accent-h); box-shadow: 0 6px 20px rgba(0,158,247,.4); transform: translateY(-1px); }
  .dv-save-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

  @media (max-width: 768px) {
    .dv-page-outer { padding: 16px; }
    .dv-header { padding: 0 16px; margin-top: 10px; }
    .dv-doc-grid { grid-template-columns: 1fr; }
  }
`

interface ExistingDocument {
    name: string; applicant_name: string; employee: string;
    aadhar_card: string | null; passport: string | null; experience: string | null;
    education: string | null; bank_details: string | null; pan: string | null;
    medical: string | null; photos: string | null;
    custom_background_verification: string | null; custom_salary_slip: string | null; custom_additional_document: string | null;
}

export default function PublicDocumentVerifyPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const applicantId = decodeURIComponent(resolvedParams.id)

    const [documentForm, setDocumentForm] = useState({
        aadharCard: null as File | null, passport: null as File | null,
        experience: null as File | null, education: null as File | null,
        bankDetails: null as File | null, pan: null as File | null,
        medical: null as File | null, photos: null as File | null,
        backgroundVerification: [] as File[], salarySlip: [] as File[], additionalDocument: [] as File[],
    })

    const [existingDocumentId, setExistingDocumentId] = useState<string | null>(null)
    const [existingFiles, setExistingFiles] = useState<{ [key: string]: string }>({})
    const [existingMultipleFiles, setExistingMultipleFiles] = useState<{ [key: string]: string[] }>({
        backgroundVerification: [], salarySlip: [], additionalDocument: []
    })

    const [isSaving, setIsSaving] = useState(false)
    const [isLoadingExisting, setIsLoadingExisting] = useState(true)
    const [isSubmitted, setIsSubmitted] = useState(false)

    useEffect(() => { document.title = 'Secure Document Upload' }, [])

    useEffect(() => {
        if (applicantId) {
            fetchExistingDocument(applicantId)
        }
    }, [applicantId])

    const fetchExistingDocument = async (name: string) => {
        setIsLoadingExisting(true)
        try {
            // NEW ROUTE: /internal/ instead of /api/
            const response = await fetch(`/internal/applicant-document?applicant_name=${encodeURIComponent(name)}`)
            
            // Error handling to prevent the JSON crash
            if (!response.ok) {
                console.error("Failed to load document. Status:", response.status);
                setIsLoadingExisting(false);
                return;
            }

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

                const multipleFiles: { [key: string]: string[] } = { backgroundVerification: [], salarySlip: [], additionalDocument: [] }

                const parseCustom = (field: string | null) => {
                    if (!field) return []
                    try { const p = JSON.parse(field); return Array.isArray(p) ? p : [field] }
                    catch { return [field] }
                }

                multipleFiles.backgroundVerification = parseCustom(existingDoc.custom_background_verification)
                multipleFiles.salarySlip = parseCustom(existingDoc.custom_salary_slip)
                multipleFiles.additionalDocument = parseCustom(existingDoc.custom_additional_document)

                setExistingMultipleFiles(multipleFiles)

                if (existingDoc.aadhar_card && existingDoc.education && existingDoc.bank_details && existingDoc.pan) {
                    setIsSubmitted(true)
                }
            }
        } catch (error) {
            console.error("Error fetching existing document:", error)
        } finally { setIsLoadingExisting(false) }
    }

    const handleFileChange = (field: string, file: File | null) => setDocumentForm(prev => ({ ...prev, [field]: file }))
    const handleRemoveFile = (field: string) => setDocumentForm(prev => ({ ...prev, [field]: null }))
    const handleRemoveExistingFile = (field: string) => setExistingFiles(prev => { const n = { ...prev }; delete n[field]; return n })

    const handleMultipleFileChange = (field: string, files: FileList | null) => {
        if (!files) return
        const validFiles = Array.from(files).filter(file => {
            if (!validateFile(file)) {
                alert(`"${file.name}" is not allowed. Only JPG, DOC, PDF, and DOCX files are accepted.`)
                return false
            }
            return true
        })
        setDocumentForm(prev => ({ ...prev, [field]: [...(prev[field as keyof typeof prev] as File[]), ...validFiles] }))
    }
    const handleRemoveMultipleFile = (field: string, index: number) => {
        setDocumentForm(prev => ({ ...prev, [field]: (prev[field as keyof typeof prev] as File[]).filter((_, i) => i !== index) }))
    }
    const handleRemoveExistingMultipleFile = (field: string, fileUrl: string) => {
        setExistingMultipleFiles(prev => ({ ...prev, [field]: prev[field].filter(url => url !== fileUrl) }))
    }

    const uploadFile = async (file: File, filename: string): Promise<string | null> => {
        try {
            const formData = new FormData()
            formData.append("file", file);
            formData.append("is_private", "0")
            formData.append("filename", file.name)

            if (existingDocumentId) {
                formData.append("doctype", "Applicant Document")
                formData.append("docname", existingDocumentId)
                formData.append("fieldname", filename);
            }

            // NEW ROUTE: /internal/ instead of /api/
            const response = await fetch(`/internal/applicant-document/upload`, {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                console.error("File upload failed", response.status);
                return null;
            }
            const data = await response.json()
            return (data && data.message && data.message.file_url) ? data.message.file_url : null
        } catch (error) {
            console.error(error);
            return null
        }
    }

    const handleSaveDocument = async () => {
        const requiredDocs = [
            { field: 'aadharCard', name: 'Aadhar Card' },
            { field: 'education', name: 'Education' },
            { field: 'bankDetails', name: 'Bank Details' },
            { field: 'pan', name: 'PAN' }
        ]

        const missingDocs = requiredDocs.filter(doc => !existingFiles[doc.field] && !documentForm[doc.field as keyof typeof documentForm])
        if (missingDocs.length > 0) {
            alert(`Please upload the following required documents:\n${missingDocs.map(d => d.name).join(", ")}`)
            return
        }

        setIsSaving(true)
        try {
            const fileUrls: { [key: string]: string | null } = { ...existingFiles }
            const fileFieldMap = {
                aadharCard: 'aadhar_card', passport: 'passport', experience: 'experience',
                education: 'education', bankDetails: 'bank_details', pan: 'pan', medical: 'medical', photos: 'photos'
            }

            for (const [formField, apiField] of Object.entries(fileFieldMap)) {
                const file = documentForm[formField as keyof typeof documentForm] as File | null
                if (file) {
                    const url = await uploadFile(file, apiField)
                    if (url) { fileUrls[formField] = url }
                    else if (requiredDocs.some(d => d.field === formField)) throw new Error(`Failed to upload ${formField}`)
                }
            }

            const multipleFileFieldMap = {
                backgroundVerification: 'custom_background_verification',
                salarySlip: 'custom_salary_slip',
                additionalDocument: 'custom_additional_document'
            }
            const multipleFileUrls: { [key: string]: string[] } = {
                custom_background_verification: [...existingMultipleFiles.backgroundVerification],
                custom_salary_slip: [...existingMultipleFiles.salarySlip],
                custom_additional_document: [...existingMultipleFiles.additionalDocument]
            }

            for (const [formField, apiField] of Object.entries(multipleFileFieldMap)) {
                const files = documentForm[formField as keyof typeof documentForm] as File[]
                if (files && files.length > 0) {
                    for (const file of files) {
                        const url = await uploadFile(file, apiField)
                        if (url) multipleFileUrls[apiField].push(url)
                    }
                }
            }

            const apiFileUrls: { [key: string]: string | null } = {}
            for (const [formField, url] of Object.entries(fileUrls)) {
                const apiField = fileFieldMap[formField as keyof typeof fileFieldMap]
                if (apiField) apiFileUrls[apiField] = url
            }
            for (const [apiField, urls] of Object.entries(multipleFileUrls)) {
                if (urls.length > 0) apiFileUrls[apiField] = JSON.stringify(urls)
            }

            const docData = { applicant_name: applicantId, ...apiFileUrls }

            let response

            // NEW ROUTE: /internal/ instead of /api/
            if (existingDocumentId) {
                response = await fetch(`/internal/applicant-document?id=${existingDocumentId}`, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(docData),
                })
            } else {
                response = await fetch(`/internal/applicant-document`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(docData),
                })
            }

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const data = await response.json()
            if (data && data.data) {
                setIsSubmitted(true)
            } else {
                throw new Error(data.exception || data._server_messages || "Failed to save document")
            }
        } catch (error) {
            console.error("Save error:", error);
            alert(`Failed to submit documents. Please try again.`)
        } finally { setIsSaving(false) }
    }

    const FileUploadField = ({ label, field, required = false }: { label: string; field: keyof typeof documentForm; required?: boolean }) => {
        const newFile = documentForm[field] as File | null
        const existingFile = existingFiles[field as string]
        return (
            <div className="dv-field-wrap">
                <div className="dv-label" style={{ marginTop: 0, marginBottom: 8 }}>
                    <FileText size={14} />{label} {required && <span className="dv-required">*</span>}
                </div>
                <div className="dv-upload-zone">
                    {existingFile && !newFile ? (
                        <div className="dv-file-existing">
                            <div className="dv-file-info">
                                <div className="dv-file-icon green"><Check size={15} /></div>
                                <div>
                                    <div className="dv-file-name">Already Uploaded</div>
                                    <a href={`${API_BASE_URL}${existingFile}`} target="_blank" rel="noopener noreferrer" className="dv-file-link">View Document →</a>
                                </div>
                            </div>
                            <button type="button" className="dv-file-remove" onClick={() => handleRemoveExistingFile(field as string)}><X size={14} /></button>
                        </div>
                    ) : newFile ? (
                        <div className="dv-file-new">
                            <div className="dv-file-info">
                                <div className="dv-file-icon blue"><Upload size={15} /></div>
                                <div>
                                    <div className="dv-file-name">{newFile.name}</div>
                                    <div className="dv-file-meta">
                                        {(newFile.size / 1024).toFixed(2)} KB
                                        {existingFile && <span className="dv-file-replace"> · Will replace existing</span>}
                                    </div>
                                </div>
                            </div>
                            <button type="button" className="dv-file-remove" onClick={() => handleRemoveFile(field as string)}><X size={14} /></button>
                        </div>
                    ) : (
                        <label className="dv-upload-trigger">
                            <div className="dv-upload-trigger-icon"><Upload size={20} /></div>
                            <span className="dv-upload-trigger-label">Attach Document</span>
                            <span className="dv-upload-trigger-sub">JPG, PDF, DOC, DOCX only</span>
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                accept={ACCEPTED_FILE_TYPES}
                                onChange={e => {
                                    const f = e.target.files?.[0]
                                    if (f) {
                                        if (!validateFile(f)) {
                                            alert(`"${f.name}" is not allowed. Only JPG, DOC, PDF, and DOCX files are accepted.`)
                                            e.target.value = ""
                                            return
                                        }
                                        handleFileChange(field as string, f)
                                    }
                                }}
                            />
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
            <div className="dv-field-wrap">
                <div className="dv-label" style={{ marginTop: 0, marginBottom: 8 }}>
                    <FileText size={14} />{label}
                </div>
                <div className="dv-upload-zone">
                    {hasFiles ? (
                        <div className="dv-multi-files">
                            {existingFilesList.map((fileUrl, index) => (
                                <div key={`existing-${index}`} className="dv-file-existing">
                                    <div className="dv-file-info">
                                        <div className="dv-file-icon green"><Check size={15} /></div>
                                        <div>
                                            <div className="dv-file-name">Uploaded File {index + 1}</div>
                                            <a href={`${API_BASE_URL}${fileUrl}`} target="_blank" rel="noopener noreferrer" className="dv-file-link">View Document →</a>
                                        </div>
                                    </div>
                                    <button type="button" className="dv-file-remove" onClick={() => handleRemoveExistingMultipleFile(field as string, fileUrl)}><X size={14} /></button>
                                </div>
                            ))}
                            {newFiles.map((file, index) => (
                                <div key={`new-${index}`} className="dv-file-new">
                                    <div className="dv-file-info">
                                        <div className="dv-file-icon blue"><Upload size={15} /></div>
                                        <div>
                                            <div className="dv-file-name">{file.name}</div>
                                            <div className="dv-file-meta">{(file.size / 1024).toFixed(2)} KB</div>
                                        </div>
                                    </div>
                                    <button type="button" className="dv-file-remove" onClick={() => handleRemoveMultipleFile(field as string, index)}><X size={14} /></button>
                                </div>
                            ))}
                            <label className="dv-add-more">
                                <Upload size={15} />
                                <span className="dv-add-more-label">Add More Files</span>
                                <input
                                    type="file"
                                    multiple
                                    style={{ display: 'none' }}
                                    accept={ACCEPTED_FILE_TYPES}
                                    onChange={e => handleMultipleFileChange(field as string, e.target.files)}
                                />
                            </label>
                        </div>
                    ) : (
                        <label className="dv-upload-trigger">
                            <div className="dv-upload-trigger-icon"><Upload size={20} /></div>
                            <span className="dv-upload-trigger-label">Attach Documents</span>
                            <span className="dv-upload-trigger-sub">JPG, PDF, DOC, DOCX only</span>
                            <input
                                type="file"
                                multiple
                                style={{ display: 'none' }}
                                accept={ACCEPTED_FILE_TYPES}
                                onChange={e => handleMultipleFileChange(field as string, e.target.files)}
                            />
                        </label>
                    )}
                </div>
            </div>
        )
    }

    if (isLoadingExisting) {
        return (
            <div className="dv">
                <style>{css}</style>
                <div className="dv-wrap" style={{ alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                        <Loader2 size={40} className="dv-spin" style={{ color: 'var(--accent)' }} />
                        <span style={{ color: 'var(--t2)', fontSize: '15px', fontWeight: 600 }}>Securely loading your profile...</span>
                    </div>
                </div>
            </div>
        )
    }

    if (isSubmitted) {
        return (
            <div className="dv">
                <style>{css}</style>
                <div className="dv-wrap" style={{ alignItems: 'center', padding: '20px' }}>
                    <div className="dv-card" style={{ maxWidth: '540px', width: '100%', textAlign: 'center', padding: '48px 32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                            <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-lt), #d1fae5)', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)', boxShadow: '0 4px 14px rgba(22, 163, 74, 0.15)' }}>
                                <Check size={44} strokeWidth={3} />
                            </div>
                        </div>
                        <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--t1)', marginBottom: '12px', letterSpacing: '-0.5px' }}>
                            Submission Complete!
                        </h2>
                        <p style={{ fontSize: '15px', color: 'var(--t2)', lineHeight: '1.6', marginBottom: '32px' }}>
                            Thank you, <strong>{applicantId}</strong>. Your documents have been securely uploaded and are currently under review by our HR team.
                        </p>
                        <div style={{ padding: '18px', background: '#f8fbff', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', gap: '14px', alignItems: 'flex-start', textAlign: 'left' }}>
                            <FileText size={22} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <strong style={{ display: 'block', fontSize: '14px', color: 'var(--t1)', marginBottom: '6px' }}>What happens next?</strong>
                                <span style={{ fontSize: '13.5px', color: 'var(--t3)', lineHeight: '1.5' }}>
                                    We will reach out to you directly via email or phone if any further information or clarification is required. You can safely close this window.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <style>{css}</style>
            <div className="dv">
                <div className="dv-wrap">
                    <div className="dv-main">
                        <header className="dv-header">
                            <div className="dv-brand">
                                <img src="/vaaman_logo.png" alt="Company Logo" />
                                <span>Onboarding Portal</span>
                            </div>
                        </header>

                        <div className="dv-page-outer">
                            <div className="dv-page">
                                <div className="dv-toolbar">
                                    <h1 className="dv-page-title">Secure Document Upload</h1>
                                    <p className="dv-page-sub">Please provide the required documents below to continue your onboarding process.</p>
                                </div>

                                <div className="dv-card">
                                    <div className="dv-card-head"><User size={16} /><span className="dv-card-title">Applicant Profile</span></div>
                                    <div className="dv-card-body">
                                        <div className="dv-label" style={{ marginTop: 0 }}>Applicant Reference</div>
                                        <div className="dv-readonly-field">
                                            <CheckCircle2 size={18} style={{ color: 'var(--green)' }} />
                                            {applicantId}
                                        </div>
                                    </div>
                                </div>

                                <div className="dv-doc-grid">
                                    <div className="dv-card">
                                        <div className="dv-card-head"><FileText size={16} /><span className="dv-card-title">Identity &amp; Experience</span></div>
                                        <div className="dv-card-body">
                                            <FileUploadField label="Aadhar Card" field="aadharCard" required />
                                            <FileUploadField label="Passport" field="passport" />
                                            <FileUploadField label="Experience Certificate" field="experience" />
                                            <FileUploadField label="Education Certificate" field="education" required />
                                        </div>
                                    </div>
                                    <div className="dv-card">
                                        <div className="dv-card-head"><FileText size={16} /><span className="dv-card-title">Financial &amp; Medical</span></div>
                                        <div className="dv-card-body">
                                            <FileUploadField label="Bank Account Details" field="bankDetails" required />
                                            <FileUploadField label="PAN Card" field="pan" required />
                                            <FileUploadField label="Medical Certificate" field="medical" />
                                            <FileUploadField label="Passport Photos" field="photos" />
                                        </div>
                                    </div>
                                </div>

                                <div className="dv-card">
                                    <div className="dv-card-head"><FileText size={16} /><span className="dv-card-title">Additional Documents</span></div>
                                    <div className="dv-card-body">
                                        <div className="dv-doc-grid">
                                            <MultipleFileUploadField label="Background Verification" field="backgroundVerification" />
                                            <MultipleFileUploadField label="Salary Slip" field="salarySlip" />
                                        </div>
                                        <MultipleFileUploadField label="Additional Document" field="additionalDocument" />
                                    </div>
                                </div>

                                <div className="dv-save-wrap">
                                    <button className="dv-save-btn" onClick={handleSaveDocument} disabled={isSaving}>
                                        {isSaving ? (
                                            <><Loader2 size={18} className="dv-spin" /> Securely Uploading...</>
                                        ) : (
                                            <><Zap size={18} /> Submit Documents</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}