// "use client"
// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ArrowLeft, Upload, X, Check, FileText, User, Briefcase, CheckCircle2, AlertCircle, Loader2, ChevronsUpDown } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { API_BASE_URL } from '@/lib/api-config'
// import { getFrappeCSRF } from "@/lib/csrf"
// import { cn } from "@/lib/utils"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"  // ADD THIS
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"

// interface JobApplicant {
//     name: string
//     applicant_name: string
// }

// // interface Employee {
// //     name: string
// //     employee_name: string
// // }

// interface ExistingDocument {
//     name: string
//     applicant_name: string
//     employee: string
//     aadhar_card: string | null
//     passport: string | null
//     experience: string | null
//     education: string | null
//     bank_details: string | null
//     pan: string | null
//     medical: string | null
//     photos: string | null
//     custom_background_verification: string | null
//     custom_salary_slip: string | null
//     custom_additional_document: string | null
// }

// export default function DocumentVerifyPage() {
//     const router = useRouter()

//     const [documentForm, setDocumentForm] = useState({
//         applicantName: "",
//         // employee: "",
//         aadharCard: null as File | null,
//         passport: null as File | null,
//         experience: null as File | null,
//         education: null as File | null,
//         bankDetails: null as File | null,
//         pan: null as File | null,
//         medical: null as File | null,
//         photos: null as File | null,
//         backgroundVerification: [] as File[],
//         salarySlip: [] as File[],
//         additionalDocument: [] as File[],
//     })

//     const [existingDocumentId, setExistingDocumentId] = useState<string | null>(null)
//     const [existingFiles, setExistingFiles] = useState<{ [key: string]: string }>({})
//     const [existingMultipleFiles, setExistingMultipleFiles] = useState<{ [key: string]: string[] }>({
//         backgroundVerification: [],
//         salarySlip: [],
//         additionalDocument: []
//     })
//     const [jobApplicants, setJobApplicants] = useState<JobApplicant[]>([])
//     // const [employees, setEmployees] = useState<Employee[]>([])
//     const [isSaving, setIsSaving] = useState(false)
//     const [isLoadingExisting, setIsLoadingExisting] = useState(false)
//     const [openApplicant, setOpenApplicant] = useState(false)

//     useEffect(() => {
//         fetchJobApplicants()
//         // fetchEmployees()
//     }, [])

//     useEffect(() => {
//         document.title = 'Document Verification'
//     }, [])

//     useEffect(() => {
//         if (documentForm.applicantName) {
//             fetchExistingDocument(documentForm.applicantName)
//         } else {
//             setExistingDocumentId(null)
//             setExistingFiles({})
//             setExistingMultipleFiles({
//                 backgroundVerification: [],
//                 salarySlip: [],
//                 additionalDocument: []
//             })
//         }
//     }, [documentForm.applicantName])

//     // const fetchJobApplicants = async () => {
//     //     try {
//     //         const response = await fetch(
//     //             `${API_BASE_URL}/api/resource/Job Applicant?fields=["name","applicant_name"]&order_by=creation desc&limit_page_length=0`,
//     //             {
//     //                 credentials: 'include',
//     //                 headers: {
//     //                     'Content-Type': 'application/json',
//     //                 },
//     //             }
//     //         )
//     //         const data = await response.json()

//     //         if (data && data.data) {
//     //             setJobApplicants(data.data)
//     //             console.log("Fetched job applicants:", data.data)
//     //         }
//     //     } catch (error) {
//     //         console.error("Error fetching job applicants:", error)
//     //     }
//     // }

//     // ✅ REPLACE fetchJobApplicants with:
//     const fetchJobApplicants = async () => {
//         try {
//             const response = await fetch(
//                 `${API_BASE_URL}/api/method/resume.api.upload_file.get_feedback_applicants`,
//                 {
//                     credentials: 'include',
//                     headers: { 'Content-Type': 'application/json' },
//                 }
//             )
//             const data = await response.json()
//             console.log(" Raw API response:", data)           // ← check this in browser console
//             console.log(" message:", data.message)            // ← check this
//             console.log(" data array:", data.message?.data)   // ← check this
//             if (data?.message?.data) {
//                 setJobApplicants(data.message.data)
//                 console.log("Fetched feedback applicants:", data.message.data)
//             }
//         } catch (error) {
//             console.error("Error fetching job applicants:", error)
//         }
//     }

//     // const fetchEmployees = async () => {
//     //     try {
//     //         const response = await fetch(
//     //             `${API_BASE_URL}/api/resource/Employee?fields=["name","employee_name"]&limit_page_length=0`,
//     //             {
//     //                 credentials: 'include',
//     //                 headers: {
//     //                     'Content-Type': 'application/json',
//     //                 },
//     //             }
//     //         )
//     //         const data = await response.json()

//     //         if (data && data.data) {
//     //             setEmployees(data.data)
//     //             console.log("Fetched employees:", data.data)
//     //         }
//     //     } catch (error) {
//     //         console.error("Error fetching employees:", error)
//     //     }
//     // }

//     const fetchExistingDocument = async (applicantName: string) => {
//         setIsLoadingExisting(true)
//         try {
//             const response = await fetch(
//                 `${API_BASE_URL}/api/resource/Applicant Document?filters=[["applicant_name","=","${applicantName}"]]&fields=["*"]&limit_page_length=0`,
//                 {
//                     credentials: 'include',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             )
//             const data = await response.json()

//             if (data && data.data && data.data.length > 0) {
//                 const existingDoc = data.data[0] as ExistingDocument
//                 console.log("Found existing document:", existingDoc)

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

//                 // Handle multiple file fields
//                 const multipleFiles: { [key: string]: string[] } = {
//                     backgroundVerification: [],
//                     salarySlip: [],
//                     additionalDocument: []
//                 }

//                 if (existingDoc.custom_background_verification) {
//                     try {
//                         const parsed = JSON.parse(existingDoc.custom_background_verification)
//                         multipleFiles.backgroundVerification = Array.isArray(parsed) ? parsed : [existingDoc.custom_background_verification]
//                     } catch {
//                         multipleFiles.backgroundVerification = [existingDoc.custom_background_verification]
//                     }
//                 }

//                 if (existingDoc.custom_salary_slip) {
//                     try {
//                         const parsed = JSON.parse(existingDoc.custom_salary_slip)
//                         multipleFiles.salarySlip = Array.isArray(parsed) ? parsed : [existingDoc.custom_salary_slip]
//                     } catch {
//                         multipleFiles.salarySlip = [existingDoc.custom_salary_slip]
//                     }
//                 }

//                 if (existingDoc.custom_additional_document) {
//                     try {
//                         const parsed = JSON.parse(existingDoc.custom_additional_document)
//                         multipleFiles.additionalDocument = Array.isArray(parsed) ? parsed : [existingDoc.custom_additional_document]
//                     } catch {
//                         multipleFiles.additionalDocument = [existingDoc.custom_additional_document]
//                     }
//                 }

//                 setExistingMultipleFiles(multipleFiles)

//                 if (existingDoc.employee) {
//                     setDocumentForm(prev => ({ ...prev, employee: existingDoc.employee }))
//                 }
//             } else {
//                 console.log("No existing document found for applicant")
//                 setExistingDocumentId(null)
//                 setExistingFiles({})
//                 setExistingMultipleFiles({
//                     backgroundVerification: [],
//                     salarySlip: [],
//                     additionalDocument: []
//                 })
//             }
//         } catch (error) {
//             console.error("Error fetching existing document:", error)
//             setExistingDocumentId(null)
//             setExistingFiles({})
//             setExistingMultipleFiles({
//                 backgroundVerification: [],
//                 salarySlip: [],
//                 additionalDocument: []
//             })
//         } finally {
//             setIsLoadingExisting(false)
//         }
//     }

//     const handleFileChange = (field: string, file: File | null) => {
//         setDocumentForm((prev) => ({
//             ...prev,
//             [field]: file,
//         }))
//     }

//     const handleRemoveFile = (field: string) => {
//         setDocumentForm((prev) => ({
//             ...prev,
//             [field]: null,
//         }))
//     }

//     const handleRemoveExistingFile = (field: string) => {
//         setExistingFiles((prev) => {
//             const newFiles = { ...prev }
//             delete newFiles[field]
//             return newFiles
//         })
//     }

//     const handleMultipleFileChange = (field: string, files: FileList | null) => {
//         if (!files) return
//         const fileArray = Array.from(files)
//         setDocumentForm((prev) => ({
//             ...prev,
//             [field]: [...(prev[field as keyof typeof prev] as File[]), ...fileArray],
//         }))
//     }

//     const handleRemoveMultipleFile = (field: string, index: number) => {
//         setDocumentForm((prev) => {
//             const currentFiles = prev[field as keyof typeof prev] as File[]
//             return {
//                 ...prev,
//                 [field]: currentFiles.filter((_, i) => i !== index),
//             }
//         })
//     }

//     const handleRemoveExistingMultipleFile = (field: string, fileUrl: string) => {
//         setExistingMultipleFiles((prev) => ({
//             ...prev,
//             [field]: prev[field].filter(url => url !== fileUrl)
//         }))
//     }

//     const uploadFile = async (file: File, filename: string): Promise<string | null> => {
//         try {
//             const formData = new FormData()
//             formData.append("file", file)
//             formData.append("is_private", "0")
//             formData.append("doctype", "Applicant Document")
//             formData.append("docname", existingDocumentId || documentForm.applicantName)
//             formData.append("fieldname", filename)
//             formData.append("filename", file.name)

//             const csrfToken = await getFrappeCSRF();

//             const response = await fetch(`${API_BASE_URL}/api/method/upload_file`, {
//                 method: "POST",
//                 credentials: 'include',
//                 headers: {
//                     "X-Frappe-CSRF-Token": csrfToken
//                 },
//                 body: formData,
//             })

//             if (!response.ok) {
//                 console.error(`Upload failed for ${filename}:`, response.status)
//                 const errorData = await response.json()
//                 console.error("Error details:", errorData)

//                 if (errorData.exception) {
//                     console.error("Exception:", errorData.exception)
//                 }
//                 if (errorData._server_messages) {
//                     console.error("Server messages:", errorData._server_messages)
//                 }

//                 return null
//             }

//             const data = await response.json()
//             console.log(`File upload response for ${filename}:`, data)

//             if (data && data.message && data.message.file_url) {
//                 return data.message.file_url
//             }
//             return null
//         } catch (error) {
//             console.error(`Error uploading file ${filename}:`, error)
//             return null
//         }
//     }

//     const handleSaveDocument = async () => {
//         if (!documentForm.applicantName) {
//             alert("Please select an applicant")
//             return
//         }

//         const requiredDocs = [
//             { field: 'aadharCard', name: 'Aadhar Card' },
//             // { field: 'experience', name: 'Experience' },
//             { field: 'education', name: 'Education' },
//             { field: 'bankDetails', name: 'Bank Details' },
//             { field: 'pan', name: 'PAN' }
//         ]

//         const missingDocs = requiredDocs.filter(doc =>
//             !existingFiles[doc.field] && !documentForm[doc.field as keyof typeof documentForm]
//         )

//         if (missingDocs.length > 0) {
//             alert(`Please upload the following required documents:\n${missingDocs.map(d => d.name).join(", ")}`)
//             return
//         }

//         setIsSaving(true)
//         try {
//             const fileUrls: { [key: string]: string | null } = { ...existingFiles }

//             const fileFieldMap = {
//                 aadharCard: 'aadhar_card',
//                 passport: 'passport',
//                 experience: 'experience',
//                 education: 'education',
//                 bankDetails: 'bank_details',
//                 pan: 'pan',
//                 medical: 'medical',
//                 photos: 'photos'
//             }

//             // Upload single files
//             for (const [formField, apiField] of Object.entries(fileFieldMap)) {
//                 const file = documentForm[formField as keyof typeof documentForm] as File | null

//                 if (file) {
//                     console.log(`Uploading new ${formField}...`)
//                     const url = await uploadFile(file, apiField)
//                     if (url) {
//                         fileUrls[formField] = url
//                     } else {
//                         if (requiredDocs.some(d => d.field === formField)) {
//                             throw new Error(`Failed to upload ${formField}`)
//                         }
//                     }
//                 }
//             }

//             // Upload multiple files
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

//                 if (files && files.length > 0) {
//                     console.log(`Uploading ${files.length} files for ${formField}...`)
//                     for (const file of files) {
//                         const url = await uploadFile(file, apiField)
//                         if (url) {
//                             multipleFileUrls[apiField].push(url)
//                         }
//                     }
//                 }
//             }

//             const apiFileUrls: { [key: string]: string | null } = {}
//             for (const [formField, url] of Object.entries(fileUrls)) {
//                 const apiField = fileFieldMap[formField as keyof typeof fileFieldMap]
//                 if (apiField) {
//                     apiFileUrls[apiField] = url
//                 }
//             }

//             // Add multiple files as JSON strings
//             for (const [apiField, urls] of Object.entries(multipleFileUrls)) {
//                 if (urls.length > 0) {
//                     apiFileUrls[apiField] = JSON.stringify(urls)
//                 }
//             }

//             const docData = {
//                 applicant_name: documentForm.applicantName,
//                 // employee: documentForm.employee || "",
//                 ...apiFileUrls,
//             }

//             console.log("Document data to save:", docData)
//             const csrfToken = await getFrappeCSRF();

//             let response
//             if (existingDocumentId) {
//                 console.log("Updating existing document:", existingDocumentId)
//                 response = await fetch(
//                     `${API_BASE_URL}/api/resource/Applicant Document/${existingDocumentId}`,
//                     {
//                         method: "PUT",
//                         credentials: 'include',
//                         headers: {
//                             'Content-Type': 'application/json',
//                             "X-Frappe-CSRF-Token": csrfToken
//                         },
//                         body: JSON.stringify(docData),
//                     }
//                 )
//             } else {
//                 console.log("Creating new document")
//                 response = await fetch(`${API_BASE_URL}/api/resource/Applicant Document`, {
//                     method: "POST",
//                     credentials: 'include',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         "X-Frappe-CSRF-Token": csrfToken
//                     },
//                     body: JSON.stringify(docData),
//                 })
//             }

//             const data = await response.json()
//             console.log("API Response:", data)

//             if (data && data.data) {
//                 alert(existingDocumentId
//                     ? "Document verification updated successfully!"
//                     : "Document verification created successfully!")
//                 router.push('/document-verify-list')
//             } else {
//                 throw new Error(data.exception || data._server_messages || "Failed to save document")
//             }
//         } catch (error) {
//             console.error("Error saving document:", error)
//             alert(`Failed to save document verification: ${error}`)
//         } finally {
//             setIsSaving(false)
//         }
//     }

//     const FileUploadField = ({
//         label,
//         field,
//         required = false
//     }: {
//         label: string
//         field: keyof typeof documentForm
//         required?: boolean
//     }) => {
//         const newFile = documentForm[field] as File | null
//         const existingFile = existingFiles[field as string]
//         const hasFile = newFile || existingFile

//         return (
//             <div className="space-y-2">
//                 <Label className="flex items-center gap-2">
//                     <FileText className="h-4 w-4 text-blue-500" />
//                     {label} {required && <span className="text-red-500">*</span>}
//                 </Label>
//                 <div className="border-2 border-dashed rounded-lg p-4 hover:border-blue-400 transition-colors shadow-sm">
//                     {hasFile ? (
//                         <div className="space-y-2">
//                             {existingFile && !newFile && (
//                                 <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
//                                     <div className="flex items-center space-x-3">
//                                         <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
//                                             <Check className="h-5 w-5 text-white" />
//                                         </div>
//                                         <div className="flex flex-col">
//                                             <span className="text-sm font-semibold text-gray-900">
//                                                 Already Uploaded
//                                             </span>
//                                             <a
//                                                 href={`${API_BASE_URL}${existingFile}`}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="text-xs text-blue-600 hover:underline font-medium"
//                                             >
//                                                 View Document →
//                                             </a>
//                                         </div>
//                                     </div>
//                                     <Button
//                                         type="button"
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => handleRemoveExistingFile(field as string)}
//                                         className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                                     >
//                                         <X className="h-4 w-4" />
//                                     </Button>
//                                 </div>
//                             )}

//                             {newFile && (
//                                 <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
//                                     <div className="flex items-center space-x-3">
//                                         <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
//                                             <Upload className="h-5 w-5 text-white" />
//                                         </div>
//                                         <div className="flex flex-col">
//                                             <span className="text-sm font-semibold text-gray-900">{newFile.name}</span>
//                                             <span className="text-xs text-gray-600">
//                                                 {(newFile.size / 1024).toFixed(2)} KB
//                                                 {existingFile && <span className="text-blue-600 font-medium"> (Will replace existing)</span>}
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <Button
//                                         type="button"
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => handleRemoveFile(field as string)}
//                                         className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                                     >
//                                         <X className="h-4 w-4" />
//                                     </Button>
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         <label className="flex flex-col items-center justify-center cursor-pointer py-4 group">
//                             <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-2 shadow-md group-hover:shadow-lg transition-shadow">
//                                 <Upload className="h-6 w-6 text-white" />
//                             </div>
//                             <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Attach Document</span>
//                             <span className="text-xs text-gray-500 mt-1">Click to upload file</span>
//                             <input
//                                 type="file"
//                                 className="hidden"
//                                 onChange={(e) => {
//                                     const selectedFile = e.target.files?.[0]
//                                     if (selectedFile) {
//                                         handleFileChange(field as string, selectedFile)
//                                     }
//                                 }}
//                             />
//                         </label>
//                     )}
//                 </div>
//             </div>
//         )
//     }

//     const MultipleFileUploadField = ({
//         label,
//         field,
//     }: {
//         label: string
//         field: keyof typeof documentForm
//     }) => {
//         const newFiles = documentForm[field] as File[]
//         const existingFilesList = existingMultipleFiles[field as string] || []
//         const hasFiles = newFiles.length > 0 || existingFilesList.length > 0

//         return (
//             <div className="space-y-2">
//                 <Label className="flex items-center gap-2">
//                     <FileText className="h-4 w-4 text-blue-500" />
//                     {label}
//                 </Label>
//                 <div className="border-2 border-dashed rounded-lg p-4 hover:border-blue-400 transition-colors shadow-sm">
//                     {hasFiles ? (
//                         <div className="space-y-3">
//                             {existingFilesList.map((fileUrl, index) => (
//                                 <div key={`existing-${index}`} className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
//                                     <div className="flex items-center space-x-3">
//                                         <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
//                                             <Check className="h-5 w-5 text-white" />
//                                         </div>
//                                         <div className="flex flex-col">
//                                             <span className="text-sm font-semibold text-gray-900">
//                                                 Uploaded File {index + 1}
//                                             </span>
//                                             <a
//                                                 href={`${API_BASE_URL}${fileUrl}`}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="text-xs text-blue-600 hover:underline font-medium"
//                                             >
//                                                 View Document →
//                                             </a>
//                                         </div>
//                                     </div>
//                                     <Button
//                                         type="button"
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => handleRemoveExistingMultipleFile(field as string, fileUrl)}
//                                         className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                                     >
//                                         <X className="h-4 w-4" />
//                                     </Button>
//                                 </div>
//                             ))}

//                             {newFiles.map((file, index) => (
//                                 <div key={`new-${index}`} className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
//                                     <div className="flex items-center space-x-3">
//                                         <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
//                                             <Upload className="h-5 w-5 text-white" />
//                                         </div>
//                                         <div className="flex flex-col">
//                                             <span className="text-sm font-semibold text-gray-900">{file.name}</span>
//                                             <span className="text-xs text-gray-600">
//                                                 {(file.size / 1024).toFixed(2)} KB
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <Button
//                                         type="button"
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => handleRemoveMultipleFile(field as string, index)}
//                                         className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                                     >
//                                         <X className="h-4 w-4" />
//                                     </Button>
//                                 </div>
//                             ))}

//                             <label className="flex flex-col items-center justify-center cursor-pointer py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors group">
//                                 <Upload className="h-5 w-5 text-gray-400 group-hover:text-blue-600 mb-1" />
//                                 <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">Add More Files</span>
//                                 <input
//                                     type="file"
//                                     multiple
//                                     className="hidden"
//                                     onChange={(e) => handleMultipleFileChange(field as string, e.target.files)}
//                                 />
//                             </label>
//                         </div>
//                     ) : (
//                         <label className="flex flex-col items-center justify-center cursor-pointer py-4 group">
//                             <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-2 shadow-md group-hover:shadow-lg transition-shadow">
//                                 <Upload className="h-6 w-6 text-white" />
//                             </div>
//                             <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Attach Documents</span>
//                             <span className="text-xs text-gray-500 mt-1">Click to upload multiple files</span>
//                             <input
//                                 type="file"
//                                 multiple
//                                 className="hidden"
//                                 onChange={(e) => handleMultipleFileChange(field as string, e.target.files)}
//                             />
//                         </label>
//                     )}
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//             <div className="container mx-auto p-6 lg:p-8 space-y-6">
//                 <div className="flex items-center justify-between">
//                     <div className="space-y-1">
//                         <div className="flex items-center space-x-4">
//                             <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => router.back()}
//                                 className="shadow-sm hover:shadow-md transition-shadow"
//                             >
//                                 <ArrowLeft className="h-4 w-4 mr-2" />
//                                 Back
//                             </Button>
//                             <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                                 {existingDocumentId ? "Update Documents" : "Applicant Documents"}
//                             </h1>
//                         </div>
//                         <p className="text-sm text-muted-foreground ml-[92px]">
//                             {existingDocumentId
//                                 ? "Update or add missing applicant documents"
//                                 : "Verify and upload applicant documents"}
//                         </p>
//                     </div>
//                 </div>

//                 <div className="max-w-6xl mx-auto space-y-6">
//                     <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
//                         <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
//                             <CardTitle className="flex items-center gap-2">
//                                 <User className="h-5 w-5 text-blue-600" />
//                                 Basic Information
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="space-y-4 pt-6">
//                             {isLoadingExisting && (
//                                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
//                                     <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
//                                     <span className="text-sm font-medium text-blue-800">Loading existing documents...</span>
//                                 </div>
//                             )}

//                             {existingDocumentId && !isLoadingExisting && (
//                                 <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
//                                     <CheckCircle2 className="h-5 w-5 text-green-600" />
//                                     <span className="text-sm font-medium text-green-800">
//                                         Existing document found. You can upload missing documents or replace existing ones.
//                                     </span>
//                                 </div>
//                             )}

//                             <div className="grid md:grid-cols-1 gap-6">
//                                 <div className="space-y-2">
//                                     <Label className="flex items-center gap-2">
//                                         <User className="h-4 w-4 text-blue-500" />
//                                         Applicant Name <span className="text-red-500">*</span>
//                                     </Label>
//                                     <Popover open={openApplicant} onOpenChange={setOpenApplicant}>
//                                         <PopoverTrigger asChild>
//                                             <Button
//                                                 variant="outline"
//                                                 role="combobox"
//                                                 aria-expanded={openApplicant}
//                                                 className="w-full justify-between h-11 shadow-sm"
//                                                 disabled={isLoadingExisting}
//                                             >
//                                                 {documentForm.applicantName
//                                                     ? jobApplicants.find(a => a.name === documentForm.applicantName)?.applicant_name
//                                                     : "Search and select applicant..."}
//                                                 <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                                             </Button>
//                                         </PopoverTrigger>
//                                         <PopoverContent className="w-[400px] p-0">
//                                             <Command>
//                                                 <CommandInput placeholder="Search applicant..." />
//                                                 <CommandEmpty>No applicant found.</CommandEmpty>
//                                                 <CommandGroup className="max-h-[300px] overflow-auto">
//                                                     {jobApplicants.map((applicant) => (
//                                                         <CommandItem
//                                                             key={applicant.name}
//                                                             value={applicant.applicant_name || applicant.name}
//                                                             onSelect={() => {
//                                                                 setDocumentForm({ ...documentForm, applicantName: applicant.name })
//                                                                 setOpenApplicant(false)
//                                                             }}
//                                                         >
//                                                             <Check
//                                                                 className={cn(
//                                                                     "mr-2 h-4 w-4",
//                                                                     documentForm.applicantName === applicant.name ? "opacity-100" : "opacity-0"
//                                                                 )}
//                                                             />
//                                                             <span>{applicant.applicant_name || applicant.name}</span>
//                                                         </CommandItem>
//                                                     ))}
//                                                 </CommandGroup>
//                                             </Command>
//                                         </PopoverContent>
//                                     </Popover>
//                                 </div>

//                                 {/* <div className="space-y-2">
//                                     <Label className="flex items-center gap-2">
//                                         <Briefcase className="h-4 w-4 text-blue-500" />
//                                         Employee
//                                     </Label>
//                                     <Select
//                                         value={documentForm.employee}
//                                         onValueChange={(value) =>
//                                             setDocumentForm({ ...documentForm, employee: value })
//                                         }
//                                         disabled={isLoadingExisting}
//                                     >
//                                         <SelectTrigger className="h-11 shadow-sm">
//                                             <SelectValue placeholder="Select employee (optional)" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {employees.map((employee) => (
//                                                 <SelectItem key={employee.name} value={employee.name}>
//                                                     {employee.employee_name || employee.name}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </div> */}

//                             </div>
//                         </CardContent>
//                     </Card>

//                     <div className="grid md:grid-cols-2 gap-6">
//                         <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
//                             <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
//                                 <CardTitle className="flex items-center gap-2 text-lg">
//                                     <FileText className="h-5 w-5 text-blue-600" />
//                                     Identity & Experience
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-6 pt-6">
//                                 <FileUploadField label="Aadhar Card" field="aadharCard" required />
//                                 <FileUploadField label="Passport" field="passport" />
//                                 <FileUploadField label="Experience Certificate" field="experience" />
//                                 <FileUploadField label="Education Certificate" field="education" required />
//                             </CardContent>
//                         </Card>

//                         <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
//                             <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
//                                 <CardTitle className="flex items-center gap-2 text-lg">
//                                     <FileText className="h-5 w-5 text-blue-600" />
//                                     Financial & Medical
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-6 pt-6">
//                                 <FileUploadField label="Bank Account Details" field="bankDetails" required />
//                                 <FileUploadField label="PAN Card" field="pan" required />
//                                 <FileUploadField label="Medical Certificate" field="medical" />
//                                 <FileUploadField label="Passport Photos" field="photos" />
//                             </CardContent>
//                         </Card>
//                     </div>

//                     <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
//                         <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
//                             <CardTitle className="flex items-center gap-2 text-lg">
//                                 <FileText className="h-5 w-5 text-blue-600" />
//                                 Additional Documents (Multiple Files Allowed)
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="space-y-6 pt-6">
//                             <MultipleFileUploadField label="Background Verification" field="backgroundVerification" />
//                             <MultipleFileUploadField label="Salary Slip" field="salarySlip" />
//                             <MultipleFileUploadField label="Additional Document" field="additionalDocument" />
//                         </CardContent>
//                     </Card>
//                     <div className="flex justify-end pt-2 pb-6">
//                         <Button
//                             onClick={handleSaveDocument}
//                             disabled={isSaving || isLoadingExisting}
//                             className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 h-11 shadow-lg hover:shadow-xl transition-all"
//                         >
//                             {isSaving ? (
//                                 <span className="flex items-center gap-2">
//                                     <Loader2 className="h-4 w-4 animate-spin" />
//                                     Saving...
//                                 </span>
//                             ) : (
//                                 <span className="flex items-center gap-2">
//                                     <CheckCircle2 className="h-4 w-4" />
//                                     {existingDocumentId ? "Update Documents" : "Save Documents"}
//                                 </span>
//                             )}
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }



"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft, Upload, X, Check, FileText, User, Briefcase,
    CheckCircle2, Loader2, ChevronsUpDown,
    Plus, Calendar, Users, MessageSquare, Zap, UserCheck,
    LogOut, Home, Menu, ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { API_BASE_URL } from '@/lib/api-config'
import { getFrappeCSRF } from "@/lib/csrf"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"

import { useSearchParams } from "next/navigation"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dv {
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
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13.5px;
    -webkit-font-smoothing: antialiased;
  }

  .dv-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  .dv-sb {
    width: var(--sb-w); background: var(--sb); min-height: 100vh;
    position: fixed; top: 0; left: 0; z-index: 100; display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .dv-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }

  .dv-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }
  .dv-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(0,158,247,.15); border: 1px solid rgba(0,158,247,.25);
    display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
  }
  .dv-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .dv-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; line-height: 1.25; }
  .dv-sb-sub { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
  .dv-sb-close {
    margin-left: auto; flex-shrink: 0; width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer; color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center; transition: all .14s;
  }
  .dv-sb-close:hover { background: var(--sb-hover); color: #fff; }

  .dv-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .dv-nav::-webkit-scrollbar { width: 3px; }
  .dv-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }

  .dv-nav-cta {
    display: flex; align-items: center; gap: 9px; padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md); border: 1px solid rgba(0,158,247,.28);
    color: var(--accent); font-size: 13px; font-weight: 600; text-decoration: none;
    transition: background .15s; margin-bottom: 22px; letter-spacing: -0.1px;
  }
  .dv-nav-cta:hover { background: rgba(0,158,247,.24); }

  .dv-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
  }
  .dv-nav-link {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt); text-decoration: none; transition: all .14s;
  }
  .dv-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; transition: opacity .14s; }
  .dv-nav-link:hover { background: var(--sb-hover); color: #fff; }
  .dv-nav-link:hover svg { opacity: 1; }
  .dv-nav-link.active { background: var(--accent-md); color: var(--accent); border: 1px solid rgba(0,158,247,.2); }
  .dv-nav-link.active svg { opacity: 1; }

  .dv-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .dv-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; border-radius: 8px; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--sb-lbl); text-align: left; transition: all .14s;
  }
  .dv-logout svg { opacity: .6; width: 15px; height: 15px; }
  .dv-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }

  .dv-overlay {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
  }
  @media (max-width: 768px) { .dv-overlay.show { display: block; } }

  .dv-main {
    margin-left: var(--sb-w); flex: 1; display: flex; flex-direction: column;
    min-height: 100vh; transition: margin-left .25s cubic-bezier(.4,0,.2,1);
  }
  .dv-main.sb-closed { margin-left: 0; }

  .dv-header {
    height: 60px; background: #fff; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 0 rgba(0,158,247,.08);
  }
  .dv-toggle {
    width: 34px; height: 34px; border-radius: 8px; background: none;
    border: 1px solid var(--border); cursor: pointer; display: flex;
    align-items: center; justify-content: center; color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .dv-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .dv-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .dv-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
  .dv-crumb svg { width: 13px; height: 13px; color: var(--t3); }
  .dv-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }

  .dv-page-outer { flex: 1; display: flex; justify-content: center; padding: 28px 32px; }
  .dv-page { width: 100%; max-width: 1100px; display: flex; flex-direction: column; gap: 22px; }

  .dv-toolbar { display: flex; align-items: center; gap: 14px; }
  .dv-back-btn {
    display: flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--card); color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .14s;
    flex-shrink: 0;
  }
  .dv-back-btn:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .dv-back-btn svg { width: 14px; height: 14px; }
  .dv-page-title { font-size: 21px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; line-height: 1.15; }
  .dv-page-sub { font-size: 13px; color: var(--t3); margin-top: 4px; }

  .dv-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
    overflow: hidden; box-shadow: 0 1px 4px rgba(0,158,247,.06);
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
  .dv-label svg { width: 14px; height: 14px; color: var(--accent); }
  .dv-required { color: #ef4444; }

  .dv-combobox-btn {
    width: 100%; height: 44px; padding: 0 14px; border-radius: 9px;
    border: 1px solid var(--border); background: var(--card); color: var(--t1);
    font-family: 'Inter', sans-serif; font-size: 13.5px;
    display: flex; align-items: center; justify-content: space-between;
    cursor: pointer; transition: border-color .15s; outline: none;
  }
  .dv-combobox-btn:hover:not(:disabled) { border-color: var(--accent); }
  .dv-combobox-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .dv-combobox-placeholder { color: var(--t3); }
  .dv-combobox-val { color: var(--t1); }

  .dv-upload-zone {
    border: 2px dashed var(--border); border-radius: 10px; transition: border-color .15s; background: #fafcff;
  }
  .dv-upload-zone:hover { border-color: var(--accent); }

  .dv-file-existing {
    display: flex; align-items: center; justify-content: space-between;
    background: linear-gradient(to right, var(--green-lt), #d1fae5);
    border-radius: 9px; padding: 12px 14px;
    border: 1px solid #bbf7d0;
  }
  .dv-file-new {
    display: flex; align-items: center; justify-content: space-between;
    background: linear-gradient(to right, var(--accent-lt), #e0eaff);
    border-radius: 9px; padding: 12px 14px;
    border: 1px solid var(--border);
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
  .dv-file-remove svg { width: 14px; height: 14px; }

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
  .dv-upload-trigger-sub { font-size: 11.5px; color: var(--t3); }

  .dv-multi-files { display: flex; flex-direction: column; gap: 8px; padding: 10px; }
  .dv-add-more {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    cursor: pointer; padding: 10px; border: 2px dashed var(--border-s);
    border-radius: 8px; transition: border-color .15s; margin-top: 2px;
  }
  .dv-add-more:hover { border-color: var(--accent); }
  .dv-add-more svg { color: var(--t3); transition: color .14s; }
  .dv-add-more:hover svg { color: var(--accent); }
  .dv-add-more-label { font-size: 11.5px; font-weight: 600; color: var(--t3); transition: color .14s; }
  .dv-add-more:hover .dv-add-more-label { color: var(--accent); }

  .dv-field-wrap { margin-bottom: 20px; }
  .dv-field-wrap:last-child { margin-bottom: 0; }

  .dv-doc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

  .dv-save-wrap { display: flex; justify-content: flex-end; padding-bottom: 8px; }
  .dv-save-btn {
    display: flex; align-items: center; gap: 8px; padding: 11px 28px; border-radius: 9px;
    background: var(--accent); color: #fff; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
    box-shadow: 0 3px 10px rgba(0,158,247,.3); transition: all .15s;
  }
  .dv-save-btn:hover:not(:disabled) { background: var(--accent-h); box-shadow: 0 5px 16px rgba(0,158,247,.4); }
  .dv-save-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .dv-save-btn svg { width: 16px; height: 16px; }

  @media (max-width: 768px) {
    .dv-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .dv-sb.open { transform: translateX(0); }
    .dv-main { margin-left: 0 !important; }
    .dv-page-outer { padding: 16px; }
    .dv-header { padding: 0 16px; }
    .dv-doc-grid { grid-template-columns: 1fr; }
  }
`

interface JobApplicant { name: string; applicant_name: string }
interface ExistingDocument {
    name: string; applicant_name: string; employee: string;
    aadhar_card: string | null; passport: string | null; experience: string | null;
    education: string | null; bank_details: string | null; pan: string | null;
    medical: string | null; photos: string | null;
    custom_background_verification: string | null; custom_salary_slip: string | null; custom_additional_document: string | null;
}

export default function DocumentVerifyPage() {
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const [documentForm, setDocumentForm] = useState({
        applicantName: "",
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
    const [jobApplicants, setJobApplicants] = useState<JobApplicant[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [isLoadingExisting, setIsLoadingExisting] = useState(false)
    const [openApplicant, setOpenApplicant] = useState(false)

    const searchParams = useSearchParams()
    const [pendingApplicant, setPendingApplicant] = useState<string | null>(null)

    // useEffect(() => { fetchJobApplicants() }, [])
    useEffect(() => {
        const applicantFromUrl = searchParams.get("applicant")
        if (applicantFromUrl) setPendingApplicant(applicantFromUrl)
        fetchJobApplicants()
    }, [])

    // Auto-select once applicants list is loaded
    useEffect(() => {
        if (pendingApplicant && jobApplicants.length > 0) {
            setDocumentForm(prev => ({ ...prev, applicantName: pendingApplicant }))
            setPendingApplicant(null)
        }
    }, [jobApplicants, pendingApplicant])
    useEffect(() => { document.title = 'Document Verification' }, [])

    useEffect(() => {
        if (documentForm.applicantName) {
            fetchExistingDocument(documentForm.applicantName)
        } else {
            setExistingDocumentId(null); setExistingFiles({})
            setExistingMultipleFiles({ backgroundVerification: [], salarySlip: [], additionalDocument: [] })
        }
    }, [documentForm.applicantName])

    const fetchJobApplicants = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/method/resume.api.upload_file.get_feedback_applicants`,
                { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
            )
            const data = await response.json()
            console.log(" Raw API response:", data)
            console.log(" message:", data.message)
            console.log(" data array:", data.message?.data)
            if (data?.message?.data) {
                setJobApplicants(data.message.data)
                console.log("Fetched feedback applicants:", data.message.data)
            }
        } catch (error) { console.error("Error fetching job applicants:", error) }
    }

    const fetchExistingDocument = async (applicantName: string) => {
        setIsLoadingExisting(true)
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/resource/Applicant Document?filters=[["applicant_name","=","${applicantName}"]]&fields=["*"]&limit_page_length=0`,
                { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
            )
            const data = await response.json()
            if (data && data.data && data.data.length > 0) {
                const existingDoc = data.data[0] as ExistingDocument
                console.log("Found existing document:", existingDoc)
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
                if (existingDoc.custom_background_verification) {
                    try { const p = JSON.parse(existingDoc.custom_background_verification); multipleFiles.backgroundVerification = Array.isArray(p) ? p : [existingDoc.custom_background_verification] }
                    catch { multipleFiles.backgroundVerification = [existingDoc.custom_background_verification] }
                }
                if (existingDoc.custom_salary_slip) {
                    try { const p = JSON.parse(existingDoc.custom_salary_slip); multipleFiles.salarySlip = Array.isArray(p) ? p : [existingDoc.custom_salary_slip] }
                    catch { multipleFiles.salarySlip = [existingDoc.custom_salary_slip] }
                }
                if (existingDoc.custom_additional_document) {
                    try { const p = JSON.parse(existingDoc.custom_additional_document); multipleFiles.additionalDocument = Array.isArray(p) ? p : [existingDoc.custom_additional_document] }
                    catch { multipleFiles.additionalDocument = [existingDoc.custom_additional_document] }
                }
                setExistingMultipleFiles(multipleFiles)
                if (existingDoc.employee) setDocumentForm(prev => ({ ...prev, employee: existingDoc.employee }))
            } else {
                console.log("No existing document found for applicant")
                setExistingDocumentId(null); setExistingFiles({})
                setExistingMultipleFiles({ backgroundVerification: [], salarySlip: [], additionalDocument: [] })
            }
        } catch (error) {
            console.error("Error fetching existing document:", error)
            setExistingDocumentId(null); setExistingFiles({})
            setExistingMultipleFiles({ backgroundVerification: [], salarySlip: [], additionalDocument: [] })
        } finally { setIsLoadingExisting(false) }
    }

    const handleFileChange = (field: string, file: File | null) => setDocumentForm(prev => ({ ...prev, [field]: file }))
    const handleRemoveFile = (field: string) => setDocumentForm(prev => ({ ...prev, [field]: null }))
    const handleRemoveExistingFile = (field: string) => setExistingFiles(prev => { const n = { ...prev }; delete n[field]; return n })
    const handleMultipleFileChange = (field: string, files: FileList | null) => {
        if (!files) return
        setDocumentForm(prev => ({ ...prev, [field]: [...(prev[field as keyof typeof prev] as File[]), ...Array.from(files)] }))
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
            formData.append("file", file); formData.append("is_private", "0")
            formData.append("doctype", "Applicant Document")
            formData.append("docname", existingDocumentId || documentForm.applicantName)
            formData.append("fieldname", filename); formData.append("filename", file.name)
            const csrfToken = await getFrappeCSRF()
            const response = await fetch(`${API_BASE_URL}/api/method/upload_file`, {
                method: "POST", credentials: 'include', headers: { "X-Frappe-CSRF-Token": csrfToken }, body: formData,
            })
            if (!response.ok) {
                console.error(`Upload failed for ${filename}:`, response.status)
                const errorData = await response.json(); console.error("Error details:", errorData)
                if (errorData.exception) console.error("Exception:", errorData.exception)
                if (errorData._server_messages) console.error("Server messages:", errorData._server_messages)
                return null
            }
            const data = await response.json()
            console.log(`File upload response for ${filename}:`, data)
            return (data && data.message && data.message.file_url) ? data.message.file_url : null
        } catch (error) { console.error(`Error uploading file ${filename}:`, error); return null }
    }

    const handleSaveDocument = async () => {
        if (!documentForm.applicantName) { alert("Please select an applicant"); return }
        const requiredDocs = [
            { field: 'aadharCard', name: 'Aadhar Card' },
            { field: 'education', name: 'Education' },
            { field: 'bankDetails', name: 'Bank Details' },
            { field: 'pan', name: 'PAN' }
        ]
        const missingDocs = requiredDocs.filter(doc => !existingFiles[doc.field] && !documentForm[doc.field as keyof typeof documentForm])
        if (missingDocs.length > 0) { alert(`Please upload the following required documents:\n${missingDocs.map(d => d.name).join(", ")}`); return }
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
                    for (const file of files) { const url = await uploadFile(file, apiField); if (url) multipleFileUrls[apiField].push(url) }
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
            const docData = { applicant_name: documentForm.applicantName, ...apiFileUrls }
            console.log("Document data to save:", docData)
            const csrfToken = await getFrappeCSRF()
            let response
            if (existingDocumentId) {
                response = await fetch(`${API_BASE_URL}/api/resource/Applicant Document/${existingDocumentId}`, {
                    method: "PUT", credentials: 'include',
                    headers: { 'Content-Type': 'application/json', "X-Frappe-CSRF-Token": csrfToken },
                    body: JSON.stringify(docData),
                })
            } else {
                response = await fetch(`${API_BASE_URL}/api/resource/Applicant Document`, {
                    method: "POST", credentials: 'include',
                    headers: { 'Content-Type': 'application/json', "X-Frappe-CSRF-Token": csrfToken },
                    body: JSON.stringify(docData),
                })
            }
            const data = await response.json()
            console.log("API Response:", data)
            if (data && data.data) {
                alert(existingDocumentId ? "Document verification updated successfully!" : "Document verification created successfully!")
                router.push('/document-verify-list')
            } else {
                throw new Error(data.exception || data._server_messages || "Failed to save document")
            }
        } catch (error) {
            console.error("Error saving document:", error)
            alert(`Failed to save document verification: ${error}`)
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
                            <span className="dv-upload-trigger-sub">Click to upload file</span>
                            <input type="file" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFileChange(field as string, f) }} />
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
                                <input type="file" multiple style={{ display: 'none' }} onChange={e => handleMultipleFileChange(field as string, e.target.files)} />
                            </label>
                        </div>
                    ) : (
                        <label className="dv-upload-trigger">
                            <div className="dv-upload-trigger-icon"><Upload size={20} /></div>
                            <span className="dv-upload-trigger-label">Attach Documents</span>
                            <span className="dv-upload-trigger-sub">Click to upload multiple files</span>
                            <input type="file" multiple style={{ display: 'none' }} onChange={e => handleMultipleFileChange(field as string, e.target.files)} />
                        </label>
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            <style>{css}</style>
            <div className="dv">
                <div className="dv-wrap">

                    <div className={`dv-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

                    <aside className={`dv-sb${sidebarOpen ? "" : " collapsed"}`}>
                        <div className="dv-sb-brand">
                            <div className="dv-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
                            <div><div className="dv-sb-name">Job Management</div><div className="dv-sb-sub">HR Platform</div></div>
                            <button className="dv-sb-close" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
                        </div>
                        <nav className="dv-nav">
                            <Link href="/create-job" className="dv-nav-cta"><Plus size={14} /> New Job Opening</Link>
                            <div className="dv-nav-lbl">Pipeline</div>
                            <Link href="/job-opening" className="dv-nav-link"><Briefcase size={15} /> Job Opening</Link>
                            <Link href="/upload-resumes" className="dv-nav-link"><Upload size={15} /> Resume Collection</Link>
                            <Link href="/candidates" className="dv-nav-link"><Users size={15} /> Candidates</Link>
                            <Link href="/interview" className="dv-nav-link"><Calendar size={15} /> Interview Scheduling</Link>
                            <div className="dv-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
                            <Link href="/feedback" className="dv-nav-link"><MessageSquare size={15} /> Feedback</Link>
                            <Link href="/document-verify-list" className="dv-nav-link active"><FileText size={15} /> Document Verification</Link>
                            <Link href="/offer-list" className="dv-nav-link"><Zap size={15} /> Offer Letter</Link>
                            <Link href="/letter-appointment" className="dv-nav-link"><UserCheck size={15} /> Appointment Letter</Link>
                        </nav>
                        <div className="dv-sb-foot">
                            <button className="dv-logout"><LogOut size={15} /> Sign out</button>
                        </div>
                    </aside>

                    <div className={`dv-main${sidebarOpen ? "" : " sb-closed"}`}>
                        <header className="dv-header">
                            <button className="dv-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
                            <div className="dv-hdr-sep" />
                            <div className="dv-crumb">
                                <Home size={13} /> Home <ChevronRight size={13} />
                                Document Verification <ChevronRight size={13} />
                                <strong>{existingDocumentId ? "Update Documents" : "Applicant Documents"}</strong>
                            </div>
                        </header>

                        <div className="dv-page-outer">
                            <div className="dv-page">

                                <div className="dv-toolbar">
                                    <button className="dv-back-btn" onClick={() => router.back()}><ArrowLeft size={14} /> Back</button>
                                    <div>
                                        <h1 className="dv-page-title">{existingDocumentId ? "Update Documents" : "Applicant Documents"}</h1>
                                        <p className="dv-page-sub">{existingDocumentId ? "Update or add missing applicant documents" : "Verify and upload applicant documents"}</p>
                                    </div>
                                </div>

                                {/* Basic Info */}
                                <div className="dv-card">
                                    <div className="dv-card-head"><User size={16} /><span className="dv-card-title">Basic Information</span></div>
                                    <div className="dv-card-body">
                                        {isLoadingExisting && (
                                            <div className="dv-banner loading">
                                                <Loader2 size={16} className="dv-spin" />
                                                <span>Loading existing documents...</span>
                                            </div>
                                        )}
                                        {existingDocumentId && !isLoadingExisting && (
                                            <div className="dv-banner success">
                                                <CheckCircle2 size={16} />
                                                <span>Existing document found. You can upload missing documents or replace existing ones.</span>
                                            </div>
                                        )}
                                        <div className="dv-label" style={{ marginTop: existingDocumentId || isLoadingExisting ? 0 : 0 }}>
                                            <User size={14} /> Applicant Name <span className="dv-required">*</span>
                                        </div>
                                        <Popover open={openApplicant} onOpenChange={setOpenApplicant}>
                                            <PopoverTrigger asChild>
                                                <button type="button" className="dv-combobox-btn" disabled={isLoadingExisting}>
                                                    <span className={documentForm.applicantName ? "dv-combobox-val" : "dv-combobox-placeholder"}>
                                                        {documentForm.applicantName
                                                            ? jobApplicants.find(a => a.name === documentForm.applicantName)?.applicant_name
                                                            : "Search and select applicant..."}
                                                    </span>
                                                    <ChevronsUpDown size={14} style={{ color: 'var(--t3)' }} />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent style={{ width: 400, padding: 0 }}>
                                                <Command>
                                                    <CommandInput placeholder="Search applicant..." />
                                                    <CommandEmpty>No applicant found.</CommandEmpty>
                                                    <CommandGroup style={{ maxHeight: 300, overflow: 'auto' }}>
                                                        {jobApplicants.map(applicant => (
                                                            <CommandItem
                                                                key={applicant.name}
                                                                value={applicant.applicant_name || applicant.name}
                                                                onSelect={() => { setDocumentForm({ ...documentForm, applicantName: applicant.name }); setOpenApplicant(false) }}
                                                            >
                                                                <Check className={cn("mr-2 h-4 w-4", documentForm.applicantName === applicant.name ? "opacity-100" : "opacity-0")} />
                                                                <span>{applicant.applicant_name || applicant.name}</span>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                {/* Two-col doc cards */}
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

                                {/* Additional docs */}
                                <div className="dv-card">
                                    <div className="dv-card-head"><FileText size={16} /><span className="dv-card-title">Additional Documents (Multiple Files Allowed)</span></div>
                                    <div className="dv-card-body">
                                        <div className="dv-doc-grid">
                                            <MultipleFileUploadField label="Background Verification" field="backgroundVerification" />
                                            <MultipleFileUploadField label="Salary Slip" field="salarySlip" />
                                        </div>
                                        <MultipleFileUploadField label="Additional Document" field="additionalDocument" />
                                    </div>
                                </div>

                                <div className="dv-save-wrap">
                                    <button className="dv-save-btn" onClick={handleSaveDocument} disabled={isSaving || isLoadingExisting}>
                                        {isSaving ? <><Loader2 size={16} className="dv-spin" /> Saving...</> : <><CheckCircle2 size={16} /> {existingDocumentId ? "Update Documents" : "Save Documents"}</>}
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
