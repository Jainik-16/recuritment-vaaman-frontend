// "use client"
// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Textarea } from "@/components/ui/textarea"
// import { useRouter } from "next/navigation"
// import { ArrowLeft, FileText, Mail, Calendar, Briefcase, Building2, Plus, Trash2, User, CheckCircle2, AlertCircle, Search } from "lucide-react"
// import { getFrappeCSRF } from "@/lib/csrf"
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/components/ui/command"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import { Check, ChevronsUpDown } from "lucide-react"
// import { cn } from "@/lib/utils"

// const API_MODULE_PATH = "resume.api.offer_letter"
// const API_BASE_URL = "https://ats.octavision.in"

// interface JobApplicant {
//   name: string
//   applicant_name: string
//   email_id: string
// }

// interface JobOfferTemplate {
//   name: string
//   offer_term_template_name?: string
// }

// interface Company {
//   name: string
//   company_name: string
// }

// interface Designation {
//   name: string
//   designation_name: string
// }

// interface EmployeeGrade {
//   name: string
// }

// interface OfferTerm {
//   id: string
//   offer_term: string
//   value_description: string
// }

// export default function JobOfferPage() {
//   const router = useRouter()
//   const [offerForm, setOfferForm] = useState({
//     jobApplicant: "",
//     applicantName: "",
//     applicantEmail: "",
//     status: "Awaiting Response",
//     offerDate: "",
//     designation: "",
//     company: "",
//     jobOfferTemplate: "",
//     customOfferAcceptanceDate: "",
//     customGrade: "",
//     customMobileNo: "",
//     customContactName: "",
//     customJoiningDate: "",
//     customSalaryAnnexure: "",//1
//   })

//   const [offerTerms, setOfferTerms] = useState<OfferTerm[]>([])
//   const [jobApplicants, setJobApplicants] = useState<JobApplicant[]>([])
//   const [templates, setTemplates] = useState<JobOfferTemplate[]>([])
//   const [companies, setCompanies] = useState<Company[]>([])
//   const [designations, setDesignations] = useState<Designation[]>([])
//   const [grades, setGrades] = useState<EmployeeGrade[]>([])
//   const [salaryAnnexures, setSalaryAnnexures] = useState<{ name: string }[]>([])//2

//   const [statusOptions, setStatusOptions] = useState<string[]>([])


//   const [isSaving, setIsSaving] = useState(false)
//   const [loading, setLoading] = useState({
//     applicants: true,
//     templates: true,
//     companies: true,
//     designations: true,
//     grades: true,
//     salaryAnnexures: true,//3 
//     statuses: true,

//   })

//   const [existingOffer, setExistingOffer] = useState<string | null>(null)
//   const [checkingDuplicate, setCheckingDuplicate] = useState(false)


//   // Combobox states
//   const [openApplicant, setOpenApplicant] = useState(false)
//   const [openDesignation, setOpenDesignation] = useState(false)
//   const [openGrade, setOpenGrade] = useState(false)


//   // Add this helper function after state declarations
//   const getTodayDate = () => {
//     const today = new Date()
//     const year = today.getFullYear()
//     const month = String(today.getMonth() + 1).padStart(2, '0')
//     const day = String(today.getDate()).padStart(2, '0')
//     return `${year}-${month}-${day}`
//   }

//   // const statusOptions = [
//   //   "Awaiting Response",
//   //   "Accepted",
//   //   "Rejected",
//   //   "Pending"
//   // ]

//   useEffect(() => {
//     fetchJobApplicants()
//     fetchTemplates()
//     fetchCompanies()
//     fetchDesignations()
//     fetchGrades()
//     fetchStatusOptions()

//   }, [])

//   useEffect(() => {
//     document.title = 'Offer Letter'
//   }, [])

//   useEffect(() => {
//     if (offerForm.jobOfferTemplate) {
//       fetchTemplateTerms(offerForm.jobOfferTemplate);
//     }
//   }, [offerForm.jobOfferTemplate]);

//   const fetchJobApplicants = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_job_applicants`,
//         {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       )
//       const result = await response.json()

//       const data = result?.message?.data || []
//       setJobApplicants(data)
//       console.log("✅ Fetched job applicants:", data.length)
//     } catch (error: any) {
//       console.error("❌ Error fetching job applicants:", error)
//       setJobApplicants([])
//     } finally {
//       setLoading(prev => ({ ...prev, applicants: false }))
//     }
//   }

//   const fetchTemplates = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_job_offer_templates`,
//         {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       )
//       const result = await response.json()

//       const data = result?.message?.data || []
//       setTemplates(data)
//       console.log("✅ Fetched templates:", data.length)
//     } catch (error: any) {
//       console.warn("⚠️ Templates not available:", error.message)
//       setTemplates([])
//     } finally {
//       setLoading(prev => ({ ...prev, templates: false }))
//     }
//   }

//   const fetchCompanies = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_companies`,
//         {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       )
//       const result = await response.json()

//       const data = result?.message?.data || []
//       setCompanies(data)
//       console.log("✅ Fetched companies:", data.length)
//     } catch (error: any) {
//       console.error("❌ Error fetching companies:", error)
//       setCompanies([])
//     } finally {
//       setLoading(prev => ({ ...prev, companies: false }))
//     }
//   }

//   const fetchDesignations = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_designations`,
//         {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       )
//       const result = await response.json()

//       const data = result?.message?.data || []
//       setDesignations(data)
//       console.log("✅ Fetched designations:", data.length)
//     } catch (error: any) {
//       console.error("❌ Error fetching designations:", error)
//       setDesignations([])
//     } finally {
//       setLoading(prev => ({ ...prev, designations: false }))
//     }
//   }

//   const fetchGrades = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_employee_grades`,
//         {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       )
//       const result = await response.json()

//       const data = result?.message?.data || []
//       setGrades(data)
//       console.log('✅ Fetched grades:', data.length)
//     } catch (error: any) {
//       console.error('❌ Error fetching grades:', error)
//       setGrades([])
//     } finally {
//       setLoading(prev => ({ ...prev, grades: false }))
//     }
//   }

//   const fetchStatusOptions = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_job_offer_statuses`,
//         { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
//       )
//       const result = await response.json()
//       setStatusOptions(result?.message?.data || ["Awaiting Response", "Accepted", "Rejected"])
//     } catch (error) {
//       setStatusOptions(["Awaiting Response", "Accepted", "Rejected"])
//     } finally {
//       setLoading(prev => ({ ...prev, statuses: false }))
//     }
//   }


//   //4
//   const fetchSalaryAnnexures = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_salary_annexures`,
//         { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
//       )
//       const result = await response.json()
//       setSalaryAnnexures(result?.message?.data || [])
//     } catch (error) {
//       setSalaryAnnexures([])
//     } finally {
//       setLoading(prev => ({ ...prev, salaryAnnexures: false }))
//     }
//   }



//   const checkExistingOffer = async (jobApplicant: string) => {
//     if (!jobApplicant) return

//     setCheckingDuplicate(true)
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/method/${API_MODULE_PATH}.check_existing_offer?job_applicant=${jobApplicant}`,
//         {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       )
//       const data = await response.json()

//       if (data?.message?.exists) {
//         setExistingOffer(data.message.offer_name)
//         console.log("⚠️ Offer already exists:", data.message.offer_name)
//       } else {
//         setExistingOffer(null)
//         console.log("✅ No existing offer found")
//       }
//     } catch (error) {
//       console.error("❌ Error checking existing offer:", error)
//       setExistingOffer(null)
//     } finally {
//       setCheckingDuplicate(false)
//     }
//   }

//   const fetchTemplateTerms = async (templateName: string) => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_template_terms?template_name=${templateName}`,
//         {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       )
//       const result = await response.json()

//       const terms = result?.message?.data || []
//       const formattedTerms = terms.map((term: any, index: number) => ({
//         id: Date.now().toString() + index,
//         offer_term: term.offer_term || "",
//         value_description: term.value || ""
//       }))

//       setOfferTerms(formattedTerms)
//       console.log("✅ Fetched template terms:", formattedTerms.length)
//     } catch (error: any) {
//       console.error("❌ Error fetching template terms:", error)
//     }
//   }

//   const handleJobApplicantChange = async (value: string) => {
//     const applicant = jobApplicants.find(a => a.name === value)
//     if (applicant) {
//       setSalaryAnnexures([])  // clear previous applicant's annexures
//       setOfferForm({
//         ...offerForm,
//         jobApplicant: value,
//         applicantName: applicant.applicant_name || "",
//         applicantEmail: applicant.email_id || "",
//         // customSalaryAnnexure: ""  // reset while auto-fetching

//       })

//       await checkExistingOffer(value)

//       // Fetch additional details (designation and company)
//       try {
//         const response = await fetch(
//           `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_job_applicant_details?job_applicant_name=${value}`,
//           {
//             credentials: 'include',
//             headers: { 'Content-Type': 'application/json' }
//           }
//         )
//         const result = await response.json()

//         if (result?.message?.data) {
//           const details = result.message.data
//           setOfferForm(prev => ({
//             ...prev,
//             designation: details.designation || prev.designation,
//             company: details.company || prev.company
//           }))
//         }
//         //     } catch (error) {
//         //       console.error("Error fetching applicant details:", error)
//         //     }
//         //   }
//         //   setOpenApplicant(false)
//         // }
//       } catch (error) {
//         console.error("Error fetching applicant details:", error)
//       }

//       // ✅ Auto-fetch latest salary annexure linked to this applicant
//       try {
//         const annexureRes = await fetch(
//           `${API_BASE_URL}/api/method/frappe.client.get_list?doctype=Salary%20Annexure&filters=${encodeURIComponent(JSON.stringify({ custom_job_applicant: value }))}&fields=${encodeURIComponent(JSON.stringify(["name"]))}&order_by=creation%20desc&limit_page_length=10`,
//           {
//             credentials: 'include',
//             headers: { 'Content-Type': 'application/json' }
//           }
//         )
//         const annexureResult = await annexureRes.json()
//         const annexures = annexureResult?.message || []

//         // ✅ Only show annexures belonging to THIS applicant
//         setSalaryAnnexures(annexures)

//         if (annexures.length > 0) {
//           setOfferForm(prev => ({
//             ...prev,
//             customSalaryAnnexure: annexures[0].name
//           }))
//           console.log("✅ Auto-selected salary annexure:", annexures[0].name)
//         } else {
//           setOfferForm(prev => ({ ...prev, customSalaryAnnexure: "" }))
//           console.log("ℹ️ No salary annexure found for this applicant")
//         }
//       } catch (error) {
//         console.error("Error fetching salary annexure:", error)
//         setSalaryAnnexures([])
//       }
//     }
//     setOpenApplicant(false)
//   }

//   const handleDesignationChange = (value: string) => {
//     setOfferForm({ ...offerForm, designation: value })
//     setOpenDesignation(false)
//   }

//   const handleGradeChange = (value: string) => {
//     setOfferForm({ ...offerForm, customGrade: value })
//     setOpenGrade(false)
//   }

//   const addOfferTerm = () => {
//     const newTerm: OfferTerm = {
//       id: Date.now().toString(),
//       offer_term: "",
//       value_description: ""
//     }
//     setOfferTerms([...offerTerms, newTerm])
//   }

//   const removeOfferTerm = (id: string) => {
//     setOfferTerms(offerTerms.filter(term => term.id !== id))
//   }

//   const updateOfferTerm = (id: string, field: keyof OfferTerm, value: string) => {
//     setOfferTerms(offerTerms.map(term =>
//       term.id === id ? { ...term, [field]: value } : term
//     ))
//   }

//   const handleSave = async () => {
//     // if (!offerForm.jobApplicant || !offerForm.applicantName || !offerForm.designation || !offerForm.company) {
//     //   alert("Please fill all required fields")
//     //   return
//     // }
//     if (!offerForm.jobApplicant || !offerForm.applicantName || !offerForm.designation || !offerForm.company || !offerForm.customGrade || !offerForm.customMobileNo || !offerForm.customContactName) {
//       alert("Please fill all required fields")
//       return
//     }

//     if (!offerForm.customSalaryAnnexure) {
//       alert("Salary Annexure is required. Please create a Salary Annexure in Frappe first, then create the offer letter.")
//       return
//     }


//     if (offerForm.customMobileNo.length !== 10) {
//       alert("Mobile number must be exactly 10 digits")
//       return
//     }


//     if (existingOffer) {
//       alert(`Job Offer already exists for this applicant (${existingOffer}). You cannot create duplicate offers for the same applicant.`)
//       return
//     }

//     setIsSaving(true)
//     try {
//       const requestData = {
//         job_applicant: offerForm.jobApplicant,
//         applicant_name: offerForm.applicantName,
//         applicant_email: offerForm.applicantEmail,
//         offer_date: offerForm.offerDate,
//         designation: offerForm.designation,
//         company: offerForm.company,
//         status: offerForm.status,
//         job_offer_template: offerForm.jobOfferTemplate,
//         custom_offer_acceptance_date: offerForm.customOfferAcceptanceDate,
//         custom_grade: offerForm.customGrade,
//         custom_mobile_no: offerForm.customMobileNo,
//         custom_contact_name: offerForm.customContactName,
//         custom_joining_date: offerForm.customJoiningDate,
//         custom_salary_annexure: offerForm.customSalaryAnnexure,//5
//         offer_terms: offerTerms
//       }

//       console.log("Submitting job offer with data:", requestData)
//       const csrfToken = await getFrappeCSRF();
//       const response = await fetch(
//         `${API_BASE_URL}/api/method/${API_MODULE_PATH}.create_job_offer`,
//         {
//           method: 'POST',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//             "X-Frappe-CSRF-Token": csrfToken
//           },
//           body: JSON.stringify({ data: requestData })
//         }
//       )

//       const result = await response.json()

//       if (result?.message?.success === false) {
//         throw new Error(result.message.message || "Failed to create job offer")
//       }

//       const message = result?.message?.message || "Job Offer created successfully!"
//       alert(message)
//       router.push('/offer-list')

//     } catch (error: any) {
//       console.error("Error creating job offer:", error)
//       alert(error.message || "Failed to create job offer")
//     } finally {
//       setIsSaving(false)
//     }
//   }



//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Accepted": return "bg-green-500"
//       case "Rejected": return "bg-red-500"
//       case "Awaiting Response": return "bg-blue-500"
//       case "Pending": return "bg-yellow-500"
//       default: return "bg-gray-500"
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <div className="container mx-auto p-6 lg:p-8 space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="space-y-1">
//             <div className="flex items-center space-x-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => router.back()}
//                 className="shadow-sm hover:shadow-md transition-shadow"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                 Create Job Offer
//               </h1>
//             </div>
//             <p className="text-sm text-muted-foreground ml-[92px]">Generate and send job offers to selected candidates</p>
//           </div>
//         </div>

//         <div className="max-w-5xl mx-auto space-y-6">
//           {/* Main Details Card */}
//           <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
//             <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
//               <CardTitle className="flex items-center gap-2">
//                 <FileText className="h-5 w-5 text-blue-600" />
//                 Offer Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6 pt-6">
//               <div className="grid md:grid-cols-2 gap-6">
//                 {/* Searchable Job Applicant Combobox */}
//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <User className="h-4 w-4 text-blue-500" />
//                     Job Applicant <span className="text-red-500">*</span>
//                   </Label>
//                   <Popover open={openApplicant} onOpenChange={setOpenApplicant}>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         role="combobox"
//                         aria-expanded={openApplicant}
//                         className="w-full justify-between h-11 shadow-sm"
//                         disabled={loading.applicants}
//                       >
//                         {offerForm.jobApplicant
//                           ? jobApplicants.find(a => a.name === offerForm.jobApplicant)?.applicant_name
//                           : loading.applicants
//                             ? "Loading applicants..."
//                             : "Search and select applicant..."}
//                         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-[400px] p-0">
//                       <Command>
//                         <CommandInput placeholder="Search applicant by name or email..." />
//                         <CommandEmpty>No applicant found.</CommandEmpty>
//                         <CommandGroup className="max-h-[300px] overflow-auto">
//                           {jobApplicants.map((applicant) => (
//                             <CommandItem
//                               key={applicant.name}
//                               value={`${applicant.applicant_name} ${applicant.email_id}`}
//                               onSelect={() => handleJobApplicantChange(applicant.name)}
//                             >
//                               <Check
//                                 className={cn(
//                                   "mr-2 h-4 w-4",
//                                   offerForm.jobApplicant === applicant.name ? "opacity-100" : "opacity-0"
//                                 )}
//                               />
//                               <div className="flex flex-col">
//                                 <span className="font-medium">{applicant.applicant_name}</span>
//                                 <span className="text-xs text-gray-500">{applicant.email_id}</span>
//                               </div>
//                             </CommandItem>
//                           ))}
//                         </CommandGroup>
//                       </Command>
//                     </PopoverContent>
//                   </Popover>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <Badge variant="outline" className="h-4 w-4 rounded-full p-0 border-2 border-blue-500" />
//                     Status <span className="text-red-500">*</span>
//                   </Label>
//                   <Select
//                     value={offerForm.status}
//                     onValueChange={(value) => setOfferForm({ ...offerForm, status: value })}
//                   >
//                     <SelectTrigger className="h-11 shadow-sm">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {statusOptions.map((status) => (
//                         <SelectItem key={status} value={status}>
//                           <div className="flex items-center gap-2">
//                             <span className={`h-2 w-2 rounded-full ${getStatusColor(status)}`} />
//                             {status}
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <User className="h-4 w-4 text-blue-500" />
//                     Applicant Name <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     value={offerForm.applicantName}
//                     onChange={(e) => setOfferForm({ ...offerForm, applicantName: e.target.value })}
//                     placeholder="Full name of applicant"
//                     disabled={!!offerForm.jobApplicant}
//                     className="h-11 shadow-sm bg-gray-50"
//                   />
//                 </div>

//                 {/* <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4 text-blue-500" />
//                     Offer Date
//                   </Label>
//                   <Input
//                     type="date"
//                     value={offerForm.offerDate}
//                     onChange={(e) => setOfferForm({ ...offerForm, offerDate: e.target.value })}
//                     min={getTodayDate()}
//                     className="h-11 shadow-sm cursor-pointer"
//                     // onClick={(e) => e.currentTarget.showPicker?.()}
//                     onFocus={(e) => e.currentTarget.showPicker?.()}

//                   />
//                 </div> */}

//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4 text-blue-500" />
//                     Offer Date
//                   </Label>
//                   <Input
//                     type="date"
//                     value={offerForm.offerDate}
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       if (value) {
//                         const year = new Date(value).getFullYear();
//                         if (year > 9999) return;
//                       }
//                       setOfferForm({ ...offerForm, offerDate: value });
//                     }}
//                     onKeyDown={(e) => {
//                       const input = e.currentTarget;
//                       const value = input.value;
//                       if (value) {
//                         const year = value.split("-")[0];
//                         if (year && year.length >= 4 && !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
//                           const parts = value.split("-");
//                           if (input.selectionStart !== null && value.indexOf("-") !== -1) {
//                             // Only block if cursor is in the year section
//                             const cursorPos = input.selectionStart;
//                             const firstDash = value.indexOf("-");
//                             if (cursorPos <= firstDash && year.length >= 4) {
//                               e.preventDefault();
//                             }
//                           }
//                         }
//                       }
//                     }}
//                     min={getTodayDate()}
//                     className="h-11 shadow-sm cursor-pointer"
//                     onFocus={(e) => e.currentTarget.showPicker?.()}
//                   />
//                 </div>

//               </div>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <Mail className="h-4 w-4 text-blue-500" />
//                     Applicant Email Address
//                   </Label>
//                   <Input
//                     type="email"
//                     value={offerForm.applicantEmail}
//                     onChange={(e) => setOfferForm({ ...offerForm, applicantEmail: e.target.value })}
//                     placeholder="email@example.com"
//                     disabled={!!offerForm.jobApplicant}
//                     className="h-11 shadow-sm bg-gray-50"
//                   />
//                 </div>

//                 {/* Searchable Designation Combobox */}
//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <Briefcase className="h-4 w-4 text-blue-500" />
//                     Designation <span className="text-red-500">*</span>
//                   </Label>
//                   <Popover open={openDesignation} onOpenChange={setOpenDesignation}>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         role="combobox"
//                         aria-expanded={openDesignation}
//                         className="w-full justify-between h-11 shadow-sm"
//                         disabled={loading.designations}
//                       >
//                         {offerForm.designation
//                           ? designations.find(d => d.name === offerForm.designation)?.designation_name || offerForm.designation
//                           : loading.designations
//                             ? "Loading designations..."
//                             : "Search and select designation..."}
//                         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-[350px] p-0">
//                       <Command>
//                         <CommandInput placeholder="Search designation..." />
//                         <CommandEmpty>No designation found.</CommandEmpty>
//                         <CommandGroup className="max-h-[300px] overflow-auto">
//                           {designations.map((designation) => (
//                             <CommandItem
//                               key={designation.name}
//                               value={designation.designation_name || designation.name}
//                               onSelect={() => handleDesignationChange(designation.name)}
//                             >
//                               <Check
//                                 className={cn(
//                                   "mr-2 h-4 w-4",
//                                   offerForm.designation === designation.name ? "opacity-100" : "opacity-0"
//                                 )}
//                               />
//                               {designation.designation_name || designation.name}
//                             </CommandItem>
//                           ))}
//                         </CommandGroup>
//                       </Command>
//                     </PopoverContent>
//                   </Popover>
//                 </div>
//               </div>

//               {/* <div className="grid md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4 text-blue-500" />
//                     Offer Acceptance Date
//                   </Label>
//                   <Input
//                     type="date"
//                     value={offerForm.customOfferAcceptanceDate}
//                     onChange={(e) => setOfferForm({ ...offerForm, customOfferAcceptanceDate: e.target.value })}
//                     min={getTodayDate()}
//                     className="h-11 shadow-sm cursor-pointer"
//                     onClick={(e) => e.currentTarget.showPicker?.()}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4 text-blue-500" />
//                     Joining Date
//                   </Label>
//                   <Input
//                     type="date"
//                     value={offerForm.customJoiningDate}
//                     onChange={(e) => setOfferForm({ ...offerForm, customJoiningDate: e.target.value })}
//                     min={getTodayDate()}
//                     className="h-11 shadow-sm cursor-pointer"
//                     onClick={(e) => e.currentTarget.showPicker?.()}
//                   />
//                 </div>
//               </div> */}

//               {/* ✅ Offer Acceptance Date Row */}
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4 text-blue-500" />
//                     Offer Acceptance Date
//                   </Label>
//                   <Input
//                     type="date"
//                     value={offerForm.customOfferAcceptanceDate}
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       if (value) {
//                         const year = new Date(value).getFullYear();
//                         if (year > 9999) return;
//                       }
//                       setOfferForm({ ...offerForm, customOfferAcceptanceDate: value });
//                     }}
//                     onKeyDown={(e) => {
//                       const input = e.currentTarget;
//                       const value = input.value;
//                       if (value) {
//                         const year = value.split("-")[0];
//                         if (year && year.length >= 4 && !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
//                           const cursorPos = input.selectionStart;
//                           const firstDash = value.indexOf("-");
//                           if (cursorPos !== null && cursorPos <= firstDash && year.length >= 4) {
//                             e.preventDefault();
//                           }
//                         }
//                       }
//                     }}
//                     min={getTodayDate()}
//                     className="h-11 shadow-sm cursor-pointer"
//                     onFocus={(e) => e.currentTarget.showPicker?.()}
//                   />
//                 </div>

//                 {/* ✅ NEW: Joining Date */}
//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4 text-blue-500" />
//                     Joining Date
//                   </Label>
//                   <Input
//                     type="date"
//                     value={offerForm.customJoiningDate}
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       if (value) {
//                         const year = new Date(value).getFullYear();
//                         if (year > 9999) return;
//                       }
//                       setOfferForm({ ...offerForm, customJoiningDate: value });
//                     }}
//                     onKeyDown={(e) => {
//                       const input = e.currentTarget;
//                       const value = input.value;
//                       if (value) {
//                         const year = value.split("-")[0];
//                         if (year && year.length >= 4 && !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
//                           const cursorPos = input.selectionStart;
//                           const firstDash = value.indexOf("-");
//                           if (cursorPos !== null && cursorPos <= firstDash && year.length >= 4) {
//                             e.preventDefault();
//                           }
//                         }
//                       }
//                     }}
//                     min={getTodayDate()}
//                     className="h-11 shadow-sm cursor-pointer"
//                     onFocus={(e) => e.currentTarget.showPicker?.()}
//                   />
//                 </div>
//               </div>

//               {/* ✅ NEW: Grade, Mobile No, Contact Name Row */}
//               <div className="grid md:grid-cols-3 gap-6">
//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <Briefcase className="h-4 w-4 text-blue-500" />
//                     Grade <span className="text-red-500">*</span>
//                   </Label>
//                   <Popover open={openGrade} onOpenChange={setOpenGrade}>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         role="combobox"
//                         aria-expanded={openGrade}
//                         className="w-full justify-between h-11 shadow-sm"
//                         disabled={loading.grades}
//                       >
//                         {offerForm.customGrade
//                           ? offerForm.customGrade
//                           : loading.grades
//                             ? "Loading grades..."
//                             : "Search and select grade..."}
//                         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-[250px] p-0">
//                       <Command>
//                         <CommandInput placeholder="Search grade..." />
//                         <CommandEmpty>No grade found.</CommandEmpty>
//                         <CommandGroup className="max-h-[300px] overflow-auto">
//                           {grades.map((grade) => (
//                             <CommandItem
//                               key={grade.name}
//                               value={grade.name}
//                               onSelect={() => handleGradeChange(grade.name)}
//                             >
//                               <Check
//                                 className={cn(
//                                   "mr-2 h-4 w-4",
//                                   offerForm.customGrade === grade.name ? "opacity-100" : "opacity-0"
//                                 )}
//                               />
//                               {grade.name}
//                             </CommandItem>
//                           ))}
//                         </CommandGroup>
//                       </Command>
//                     </PopoverContent>
//                   </Popover>
//                 </div>

//                 {/* <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <FileText className="h-4 w-4 text-blue-500" />
//                     Salary Annexure
//                   </Label>
//                   <Select
//                     value={offerForm.customSalaryAnnexure}
//                     onValueChange={(value) => setOfferForm({ ...offerForm, customSalaryAnnexure: value })}
//                     disabled={loading.salaryAnnexures}
//                   >
//                     <SelectTrigger className="h-11 shadow-sm">
//                       <SelectValue placeholder={
//                         loading.salaryAnnexures ? "Loading..." :
//                           salaryAnnexures.length === 0 ? "No annexures available" :
//                             "Select Salary Annexure (optional)"
//                       } />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {salaryAnnexures.map((annexure) => (
//                         <SelectItem key={annexure.name} value={annexure.name}>
//                           {annexure.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div> */}

//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <FileText className="h-4 w-4 text-blue-500" />
//                     Salary Annexure <span className="text-red-500">*</span>
//                   </Label>
//                   <Select
//                     value={offerForm.customSalaryAnnexure}
//                     onValueChange={(value) => setOfferForm({ ...offerForm, customSalaryAnnexure: value })}
//                     disabled={loading.salaryAnnexures}
//                   >
//                     <SelectTrigger className="h-11 shadow-sm w-full">
//                       <SelectValue placeholder={
//                         loading.salaryAnnexures ? "Loading annexures..." :
//                           salaryAnnexures.length === 0 ? "No annexures available" :
//                             "Search and select annexure..."
//                       } />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {salaryAnnexures.length === 0 && !loading.salaryAnnexures ? (
//                         <div className="p-4 text-center space-y-1">
//                           <AlertCircle className="h-5 w-5 text-amber-500 mx-auto" />
//                           <p className="text-sm font-medium text-gray-700">No Salary Annexures Found</p>
//                           <p className="text-xs text-gray-500">Please create a Salary Annexure in Frappe first.</p>
//                         </div>
//                       ) : (
//                         salaryAnnexures.map((annexure) => (
//                           <SelectItem key={annexure.name} value={annexure.name}>
//                             {annexure.name}
//                           </SelectItem>
//                         ))
//                       )}
//                     </SelectContent>
//                   </Select>
//                 </div>


//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <User className="h-4 w-4 text-blue-500" />
//                     Mobile No <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     type="tel"
//                     value={offerForm.customMobileNo}
//                     onChange={(e) => {
//                       const val = e.target.value.replace(/\D/g, '').slice(0, 10)
//                       setOfferForm({ ...offerForm, customMobileNo: val })
//                     }}
//                     placeholder="e.g., 9876543210"
//                     maxLength={10}
//                     className="h-11 shadow-sm"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <User className="h-4 w-4 text-blue-500" />
//                     Contact Name <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     value={offerForm.customContactName}
//                     onChange={(e) => setOfferForm({ ...offerForm, customContactName: e.target.value })}
//                     placeholder="e.g., HR Manager name"
//                     className="h-11 shadow-sm"
//                   />
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <FileText className="h-4 w-4 text-blue-500" />
//                     Job Offer Term Template
//                   </Label>
//                   <Select
//                     value={offerForm.jobOfferTemplate}
//                     onValueChange={(value) => setOfferForm({ ...offerForm, jobOfferTemplate: value })}
//                     disabled={loading.templates || templates.length === 0}
//                   >
//                     <SelectTrigger className="h-11 shadow-sm">
//                       <SelectValue placeholder={
//                         loading.templates ? "Loading templates..." :
//                           templates.length === 0 ? "No templates available" :
//                             "Select template (optional)"
//                       } />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {templates.map((template) => (
//                         <SelectItem key={template.name} value={template.name}>
//                           {template.offer_term_template_name || template.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {offerForm.jobOfferTemplate && (
//                     <p className="text-xs text-blue-600 flex items-center gap-1">
//                       <CheckCircle2 className="h-3 w-3" />
//                       Template terms will be loaded automatically
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <Building2 className="h-4 w-4 text-blue-500" />
//                     Company <span className="text-red-500">*</span>
//                   </Label>
//                   <Select
//                     value={offerForm.company}
//                     onValueChange={(value) => setOfferForm({ ...offerForm, company: value })}
//                     disabled={loading.companies}
//                   >
//                     <SelectTrigger className="h-11 shadow-sm">
//                       <SelectValue placeholder={
//                         loading.companies ? "Loading companies..." :
//                           companies.length === 0 ? "No companies found" :
//                             "Select company"
//                       } />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {companies.map((company) => (
//                         <SelectItem key={company.name} value={company.name}>
//                           {company.company_name || company.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               {existingOffer && (
//                 <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
//                     <div>
//                       <p className="text-sm font-semibold text-red-900">
//                         Offer Already Exists
//                       </p>
//                       <p className="text-xs text-red-700 mt-1">
//                         A job offer has already been created for this applicant ({existingOffer}).
//                         You cannot create duplicate offers for the same applicant.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {checkingDuplicate && (
//                 <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
//                     <p className="text-sm text-blue-700">Checking for existing offer...</p>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Offer Terms Card */}
//           <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
//             <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="flex items-center gap-2">
//                   <FileText className="h-5 w-5 text-blue-600" />
//                   Job Offer Terms
//                   {offerTerms.length > 0 && (
//                     <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
//                       {offerTerms.length} term{offerTerms.length !== 1 ? 's' : ''}
//                     </Badge>
//                   )}
//                 </CardTitle>
//                 {/* <Button
//                   onClick={addOfferTerm}
//                   size="sm"
//                   className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Term
//                 </Button> */}
//               </div>
//             </CardHeader>
//             <CardContent className="p-0">
//               <div className="overflow-x-auto">
//                 {offerTerms.length === 0 ? (
//                   <div className="p-12 text-center">
//                     <div className="flex flex-col items-center gap-3 text-gray-400">
//                       <FileText className="h-16 w-16" />
//                       <div className="space-y-1">
//                         <p className="text-sm font-medium text-gray-600">No offer terms added yet</p>
//                         {/* <p className="text-xs text-gray-500">Click "Add Term" to create terms or select a template above</p> */}
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <table className="w-full">
//                     <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b sticky top-0">
//                       <tr>
//                         <th className="text-left p-4 w-16 text-xs font-semibold text-gray-700 uppercase tracking-wider">No.</th>
//                         <th className="text-left p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           Offer Term <span className="text-red-500">*</span>
//                         </th>
//                         <th className="text-left p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           Value / Description <span className="text-red-500">*</span>
//                         </th>
//                         <th className="w-24"></th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {offerTerms.map((term, index) => (
//                         <tr key={term.id} className="hover:bg-blue-50/50 transition-colors">
//                           <td className="p-4 text-sm text-gray-500 font-medium">{index + 1}</td>
//                           <td className="p-4">
//                             <Input
//                               value={term.offer_term}
//                               onChange={(e) => updateOfferTerm(term.id, 'offer_term', e.target.value)}
//                               placeholder="e.g., Base Salary, Health Insurance"
//                               className="h-10 shadow-sm"
//                             />
//                           </td>
//                           <td className="p-4">
//                             <Textarea
//                               value={term.value_description}
//                               onChange={(e) => updateOfferTerm(term.id, 'value_description', e.target.value)}
//                               placeholder="e.g., $80,000 per year, comprehensive coverage"
//                               className="min-h-[60px] shadow-sm"
//                               rows={2}
//                             />
//                           </td>
//                           {/* <td className="p-4">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => removeOfferTerm(term.id)}
//                               className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </td> */}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-3 pt-2">
//             <Button
//               variant="outline"
//               onClick={() => router.back()}
//               className="px-6 h-11 shadow-sm"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSave || existingOffer !== null}
//               disabled={isSaving}
//               className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 h-11 shadow-lg hover:shadow-xl transition-all"
//             >
//               {isSaving ? (
//                 <span className="flex items-center gap-2">
//                   <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   Creating Offer...
//                 </span>
//               ) : existingOffer ? (
//                 <span className="flex items-center gap-2">
//                   <AlertCircle className="h-4 w-4" />
//                   Offer Already Exists
//                 </span>
//               ) : (
//                 <span className="flex items-center gap-2">
//                   <CheckCircle2 className="h-4 w-4" />
//                   Create Offer
//                 </span>
//               )}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }







"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, FileText, Mail, Calendar, Briefcase, Building2,
  Plus, Trash2, User, CheckCircle2, AlertCircle, Search,
  Menu, X, Home, ChevronRight, Upload, Users, MessageSquare,
  Zap, UserCheck, LogOut,
} from "lucide-react"
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,
} from "@/components/ui/command"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { getFrappeCSRF } from "@/lib/csrf"

const API_MODULE_PATH = "resume.api.offer_letter"
const API_BASE_URL = "https://ats.octavision.in"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ol {
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

  .ol-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  /* ══ SIDEBAR ══ */
  .ol-sb {
    width: var(--sb-w); background: var(--sb); min-height: 100vh;
    position: fixed; top: 0; left: 0; z-index: 100; display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .ol-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }
  .ol-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }
  .ol-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(0,158,247,.15); border: 1px solid rgba(0,158,247,.25);
    display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
  }
  .ol-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .ol-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; line-height: 1.25; }
  .ol-sb-sub { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
  .ol-sb-close {
    margin-left: auto; flex-shrink: 0; width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer; color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center; transition: all .14s;
  }
  .ol-sb-close:hover { background: var(--sb-hover); color: #fff; }
  .ol-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .ol-nav::-webkit-scrollbar { width: 3px; }
  .ol-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }
  .ol-nav-cta {
    display: flex; align-items: center; gap: 9px; padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md); border: 1px solid rgba(0,158,247,.28);
    color: var(--accent); font-size: 13px; font-weight: 600; text-decoration: none;
    transition: background .15s; margin-bottom: 22px; letter-spacing: -0.1px;
  }
  .ol-nav-cta:hover { background: rgba(0,158,247,.24); }
  .ol-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
  }
  .ol-nav-link {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt); text-decoration: none; transition: all .14s;
  }
  .ol-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; transition: opacity .14s; }
  .ol-nav-link:hover { background: var(--sb-hover); color: #fff; }
  .ol-nav-link:hover svg { opacity: 1; }
  .ol-nav-link.active { background: var(--accent-md); color: var(--accent); border: 1px solid rgba(0,158,247,.2); }
  .ol-nav-link.active svg { opacity: 1; }
  .ol-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .ol-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; border-radius: 8px; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--sb-lbl); text-align: left; transition: all .14s;
  }
  .ol-logout svg { opacity: .6; width: 15px; height: 15px; }
  .ol-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }
  .ol-overlay {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
  }
  @media (max-width: 768px) { .ol-overlay.show { display: block; } }

  /* ══ MAIN ══ */
  .ol-main {
    margin-left: var(--sb-w); flex: 1; display: flex; flex-direction: column;
    min-height: 100vh; transition: margin-left .25s cubic-bezier(.4,0,.2,1);
  }
  .ol-main.sb-closed { margin-left: 0; }
  .ol-header {
    height: 60px; background: #fff; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 0 rgba(0,158,247,.08);
  }
  .ol-toggle {
    width: 34px; height: 34px; border-radius: 8px; background: none;
    border: 1px solid var(--border); cursor: pointer; display: flex;
    align-items: center; justify-content: center; color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .ol-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .ol-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .ol-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
  .ol-crumb svg { width: 13px; height: 13px; color: var(--t3); }
  .ol-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }

  /* ══ PAGE ══ */
  .ol-page-outer { flex: 1; display: flex; justify-content: center; padding: 28px 32px; }
  .ol-page { width: 100%; max-width: 900px; display: flex; flex-direction: column; gap: 22px; }

  /* toolbar */
  .ol-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
  .ol-page-title { font-size: 21px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; line-height: 1.15; }
  .ol-page-sub { font-size: 13px; color: var(--t3); margin-top: 5px; }
  .ol-back-btn {
    display: flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--card); color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .14s;
  }
  .ol-back-btn:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

  /* ══ CARDS ══ */
  .ol-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 14px;
    overflow: hidden; box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .ol-card-head {
    padding: 16px 22px; border-bottom: 1px solid var(--border-s);
    background: linear-gradient(to right, #f8fbff, #eef7ff);
    display: flex; align-items: center; justify-content: space-between;
  }
  .ol-card-head-left { display: flex; align-items: center; gap: 10px; }
  .ol-card-head-icon {
    width: 34px; height: 34px; border-radius: 9px;
    background: linear-gradient(135deg, var(--accent), #3b82f6);
    display: flex; align-items: center; justify-content: center;
  }
  .ol-card-head-icon.purple { background: linear-gradient(135deg, #a855f7, #7e22ce); }
  .ol-card-head-icon svg { color: #fff; width: 16px; height: 16px; }
  .ol-card-title { font-size: 14px; font-weight: 700; color: var(--t1); letter-spacing: -0.2px; }
  .ol-card-body { padding: 24px; }

  /* badge */
  .ol-badge {
    display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px;
    font-size: 11.5px; font-weight: 600; border: 1px solid transparent;
  }
  .ol-badge.blue { background: var(--accent-lt); color: var(--accent); border-color: rgba(0,158,247,.25); }

  /* ══ FORM ══ */
  .ol-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .ol-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
  .ol-field { display: flex; flex-direction: column; gap: 6px; }
  .ol-label {
    display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600;
    color: var(--t2); letter-spacing: 0.02em;
  }
  .ol-label svg { width: 13px; height: 13px; color: var(--accent); flex-shrink: 0; }
  .ol-req { color: #ef4444; margin-left: 2px; }
  .ol-input {
    height: 42px; padding: 0 12px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--bg); color: var(--t1); font-family: 'Inter', sans-serif; font-size: 13.5px;
    outline: none; transition: all .15s; width: 100%;
  }
  .ol-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-lt); }
  .ol-input::placeholder { color: var(--t3); }
  .ol-input:disabled { opacity: 0.65; cursor: not-allowed; background: #f0f4f8; }
  .ol-textarea {
    min-height: 68px; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--bg); color: var(--t1); font-family: 'Inter', sans-serif; font-size: 13.5px;
    outline: none; transition: all .15s; width: 100%; resize: vertical;
  }
  .ol-textarea:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-lt); }
  .ol-textarea::placeholder { color: var(--t3); }

  /* select wrapper for shadcn selects */
  .ol-select-trigger {
    height: 42px !important; border: 1px solid var(--border) !important; background: var(--bg) !important;
    border-radius: 8px !important; font-family: 'Inter', sans-serif !important;
    font-size: 13.5px !important; color: var(--t1) !important; width: 100% !important;
    transition: all .15s !important;
  }
  .ol-select-trigger:focus, .ol-select-trigger[data-state="open"] {
    background: #fff !important; border-color: var(--accent) !important;
    box-shadow: 0 0 0 3px var(--accent-lt) !important;
  }

  /* combobox trigger (popover button) */
  .ol-combo-btn {
    height: 42px !important; width: 100% !important; justify-content: space-between !important;
    border: 1px solid var(--border) !important; background: var(--bg) !important;
    border-radius: 8px !important; font-family: 'Inter', sans-serif !important;
    font-size: 13.5px !important; color: var(--t1) !important; padding: 0 12px !important;
    transition: all .15s !important;
  }
  .ol-combo-btn:hover, .ol-combo-btn[aria-expanded="true"] {
    background: #fff !important; border-color: var(--accent) !important;
    box-shadow: 0 0 0 3px var(--accent-lt) !important;
  }
  .ol-combo-btn:disabled { opacity: 0.65 !important; cursor: not-allowed !important; background: #f0f4f8 !important; }

  /* hint text */
  .ol-hint { display: flex; align-items: center; gap: 5px; font-size: 11.5px; color: var(--accent); margin-top: 4px; }
  .ol-hint svg { width: 12px; height: 12px; }

  /* ══ ALERT BANNERS ══ */
  .ol-alert {
    border-radius: 10px; padding: 14px 16px; display: flex; align-items: flex-start; gap: 12px;
  }
  .ol-alert.red { background: var(--red-lt); border: 1px solid #fca5a5; }
  .ol-alert.blue { background: var(--accent-lt); border: 1px solid rgba(0,158,247,.25); }
  .ol-alert-icon { flex-shrink: 0; margin-top: 1px; }
  .ol-alert.red .ol-alert-icon svg { color: var(--red); width: 18px; height: 18px; }
  .ol-alert.blue .ol-alert-icon svg { color: var(--accent); width: 16px; height: 16px; }
  .ol-alert-title { font-size: 13px; font-weight: 700; color: var(--t1); }
  .ol-alert.red .ol-alert-title { color: #7f1d1d; }
  .ol-alert-sub { font-size: 11.5px; color: var(--t2); margin-top: 3px; }
  .ol-alert.red .ol-alert-sub { color: #991b1b; }
  .ol-alert.blue .ol-alert-sub { color: var(--t2); }
  .ol-spin {
    width: 16px; height: 16px; border: 2px solid rgba(0,158,247,.25); border-top-color: var(--accent);
    border-radius: 50%; animation: ol-spin 1s linear infinite; flex-shrink: 0;
  }
  @keyframes ol-spin { to { transform: rotate(360deg); } }

  /* ══ OFFER TERMS TABLE ══ */
  .ol-terms-table { width: 100%; border-collapse: collapse; }
  .ol-terms-table thead tr { background: linear-gradient(to right, #f8fbff, #eef7ff); border-bottom: 1px solid var(--border-s); }
  .ol-terms-table th {
    padding: 10px 14px; text-align: left; font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em; color: var(--t2);
  }
  .ol-terms-table tbody tr { border-bottom: 1px solid var(--border-s); transition: background .12s; }
  .ol-terms-table tbody tr:last-child { border-bottom: none; }
  .ol-terms-table tbody tr:hover { background: #f8fbff; }
  .ol-terms-table td { padding: 10px 14px; vertical-align: top; }
  .ol-terms-num { font-size: 12px; font-weight: 600; color: var(--t3); padding-top: 12px !important; }

  .ol-terms-empty {
    text-align: center; padding: 48px 20px; display: flex; flex-direction: column;
    align-items: center; gap: 10px;
  }
  .ol-terms-empty-icon { color: var(--t3); }
  .ol-terms-empty-title { font-size: 13.5px; font-weight: 600; color: var(--t2); }

  /* ══ STATUS DOT ══ */
  .ol-status-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; display: inline-block;
  }
  .ol-status-dot.blue { background: var(--accent); }
  .ol-status-dot.green { background: var(--green); }
  .ol-status-dot.red { background: var(--red); }
  .ol-status-dot.yellow { background: #f59e0b; }
  .ol-status-dot.grey { background: #94a3b8; }

  /* ══ ACTION BUTTONS ══ */
  .ol-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
  .ol-btn-cancel {
    display: flex; align-items: center; gap: 6px; padding: 10px 20px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--card); color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 500; cursor: pointer; transition: all .14s;
  }
  .ol-btn-cancel:hover { background: #f0f4f8; border-color: #b0c4d4; }
  .ol-btn-submit {
    display: flex; align-items: center; gap: 7px; padding: 10px 28px; border-radius: 8px;
    background: var(--accent); color: #fff; border: none;
    font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: all .15s;
    box-shadow: 0 2px 8px rgba(0,158,247,.3);
  }
  .ol-btn-submit:hover:not(:disabled) { background: var(--accent-h); box-shadow: 0 4px 14px rgba(0,158,247,.4); }
  .ol-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .ol-btn-submit svg { width: 16px; height: 16px; }
  .ol-btn-submit-spin {
    width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    border-radius: 50%; animation: ol-spin 1s linear infinite;
  }

  @media (max-width: 768px) {
    .ol-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .ol-sb.open { transform: translateX(0); }
    .ol-main { margin-left: 0 !important; }
    .ol-page-outer { padding: 16px; }
    .ol-header { padding: 0 16px; }
    .ol-grid-2 { grid-template-columns: 1fr; }
    .ol-grid-3 { grid-template-columns: 1fr; }
  }
`

interface JobApplicant {
  name: string; applicant_name: string; email_id: string
}
interface JobOfferTemplate { name: string; offer_term_template_name?: string }
interface Company { name: string; company_name: string }
interface Designation { name: string; designation_name: string }
interface EmployeeGrade { name: string }
interface OfferTerm { id: string; offer_term: string; value_description: string }

export default function JobOfferPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [offerForm, setOfferForm] = useState({
    jobApplicant: "",
    applicantName: "",
    applicantEmail: "",
    status: "Awaiting Response",
    offerDate: "",
    designation: "",
    company: "",
    jobOfferTemplate: "",
    customOfferAcceptanceDate: "",
    customGrade: "",
    customMobileNo: "",
    customContactName: "",
    customJoiningDate: "",
    customSalaryAnnexure: "",
  })

  const [offerTerms, setOfferTerms] = useState<OfferTerm[]>([])
  const [jobApplicants, setJobApplicants] = useState<JobApplicant[]>([])
  const [templates, setTemplates] = useState<JobOfferTemplate[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [designations, setDesignations] = useState<Designation[]>([])
  const [grades, setGrades] = useState<EmployeeGrade[]>([])
  const [salaryAnnexures, setSalaryAnnexures] = useState<{ name: string }[]>([])
  const [statusOptions, setStatusOptions] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState({
    applicants: true, templates: true, companies: true,
    designations: true, grades: true, salaryAnnexures: true, statuses: true,
  })
  const [existingOffer, setExistingOffer] = useState<string | null>(null)
  const [checkingDuplicate, setCheckingDuplicate] = useState(false)
  const [openApplicant, setOpenApplicant] = useState(false)
  const [openDesignation, setOpenDesignation] = useState(false)
  const [openGrade, setOpenGrade] = useState(false)

  const getTodayDate = () => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  }

  useEffect(() => {
    fetchJobApplicants(); fetchTemplates(); fetchCompanies()
    fetchDesignations(); fetchGrades(); fetchStatusOptions()
  }, [])

  useEffect(() => { document.title = 'Offer Letter' }, [])

  useEffect(() => {
    if (offerForm.jobOfferTemplate) fetchTemplateTerms(offerForm.jobOfferTemplate)
  }, [offerForm.jobOfferTemplate])

  const fetchJobApplicants = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_job_applicants`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const result = await response.json()
      setJobApplicants(result?.message?.data || [])
      console.log("✅ Fetched job applicants:", result?.message?.data?.length)
    } catch (error: any) {
      console.error("❌ Error fetching job applicants:", error)
      setJobApplicants([])
    } finally { setLoading(prev => ({ ...prev, applicants: false })) }
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_job_offer_templates`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const result = await response.json()
      setTemplates(result?.message?.data || [])
      console.log("✅ Fetched templates:", result?.message?.data?.length)
    } catch (error: any) {
      console.warn("⚠️ Templates not available:", error.message)
      setTemplates([])
    } finally { setLoading(prev => ({ ...prev, templates: false })) }
  }

  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_companies`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const result = await response.json()
      setCompanies(result?.message?.data || [])
      console.log("✅ Fetched companies:", result?.message?.data?.length)
    } catch (error: any) {
      console.error("❌ Error fetching companies:", error)
      setCompanies([])
    } finally { setLoading(prev => ({ ...prev, companies: false })) }
  }

  const fetchDesignations = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_designations`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const result = await response.json()
      setDesignations(result?.message?.data || [])
      console.log("✅ Fetched designations:", result?.message?.data?.length)
    } catch (error: any) {
      console.error("❌ Error fetching designations:", error)
      setDesignations([])
    } finally { setLoading(prev => ({ ...prev, designations: false })) }
  }

  const fetchGrades = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_employee_grades`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const result = await response.json()
      setGrades(result?.message?.data || [])
      console.log('✅ Fetched grades:', result?.message?.data?.length)
    } catch (error: any) {
      console.error('❌ Error fetching grades:', error)
      setGrades([])
    } finally { setLoading(prev => ({ ...prev, grades: false })) }
  }

  const fetchStatusOptions = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_job_offer_statuses`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const result = await response.json()
      setStatusOptions(result?.message?.data || ["Awaiting Response", "Accepted", "Rejected"])
    } catch (error) {
      setStatusOptions(["Awaiting Response", "Accepted", "Rejected"])
    } finally { setLoading(prev => ({ ...prev, statuses: false })) }
  }

  const fetchSalaryAnnexures = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_salary_annexures`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const result = await response.json()
      setSalaryAnnexures(result?.message?.data || [])
    } catch (error) {
      setSalaryAnnexures([])
    } finally { setLoading(prev => ({ ...prev, salaryAnnexures: false })) }
  }

  const checkExistingOffer = async (jobApplicant: string) => {
    if (!jobApplicant) return
    setCheckingDuplicate(true)
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.check_existing_offer?job_applicant=${jobApplicant}`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const data = await response.json()
      if (data?.message?.exists) {
        setExistingOffer(data.message.offer_name)
        console.log("⚠️ Offer already exists:", data.message.offer_name)
      } else {
        setExistingOffer(null)
        console.log("✅ No existing offer found")
      }
    } catch (error) {
      console.error("❌ Error checking existing offer:", error)
      setExistingOffer(null)
    } finally { setCheckingDuplicate(false) }
  }

  const fetchTemplateTerms = async (templateName: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_template_terms?template_name=${templateName}`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const result = await response.json()
      const terms = result?.message?.data || []
      const formattedTerms = terms.map((term: any, index: number) => ({
        id: Date.now().toString() + index,
        offer_term: term.offer_term || "",
        value_description: term.value || ""
      }))
      setOfferTerms(formattedTerms)
      console.log("✅ Fetched template terms:", formattedTerms.length)
    } catch (error: any) {
      console.error("❌ Error fetching template terms:", error)
    }
  }

  const handleJobApplicantChange = async (value: string) => {
    const applicant = jobApplicants.find(a => a.name === value)
    if (applicant) {
      setSalaryAnnexures([])
      setOfferForm({
        ...offerForm,
        jobApplicant: value,
        applicantName: applicant.applicant_name || "",
        applicantEmail: applicant.email_id || "",
      })
      await checkExistingOffer(value)
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_job_applicant_details?job_applicant_name=${value}`,
          { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
        )
        const result = await response.json()
        if (result?.message?.data) {
          const details = result.message.data
          setOfferForm(prev => ({
            ...prev,
            designation: details.designation || prev.designation,
            company: details.company || prev.company
          }))
        }
      } catch (error) { console.error("Error fetching applicant details:", error) }

      try {
        const annexureRes = await fetch(
          `${API_BASE_URL}/api/method/frappe.client.get_list?doctype=Salary%20Annexure&filters=${encodeURIComponent(JSON.stringify({ custom_job_applicant: value }))}&fields=${encodeURIComponent(JSON.stringify(["name"]))}&order_by=creation%20desc&limit_page_length=10`,
          { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
        )
        const annexureResult = await annexureRes.json()
        const annexures = annexureResult?.message || []
        setSalaryAnnexures(annexures)
        if (annexures.length > 0) {
          setOfferForm(prev => ({ ...prev, customSalaryAnnexure: annexures[0].name }))
          console.log("✅ Auto-selected salary annexure:", annexures[0].name)
        } else {
          setOfferForm(prev => ({ ...prev, customSalaryAnnexure: "" }))
          console.log("ℹ️ No salary annexure found for this applicant")
        }
      } catch (error) {
        console.error("Error fetching salary annexure:", error)
        setSalaryAnnexures([])
      }
    }
    setOpenApplicant(false)
  }

  const handleDesignationChange = (value: string) => {
    setOfferForm({ ...offerForm, designation: value })
    setOpenDesignation(false)
  }

  const handleGradeChange = (value: string) => {
    setOfferForm({ ...offerForm, customGrade: value })
    setOpenGrade(false)
  }

  const addOfferTerm = () => {
    setOfferTerms([...offerTerms, { id: Date.now().toString(), offer_term: "", value_description: "" }])
  }

  const removeOfferTerm = (id: string) => {
    setOfferTerms(offerTerms.filter(term => term.id !== id))
  }

  const updateOfferTerm = (id: string, field: keyof OfferTerm, value: string) => {
    setOfferTerms(offerTerms.map(term => term.id === id ? { ...term, [field]: value } : term))
  }

  const handleSave = async () => {
    if (!offerForm.jobApplicant || !offerForm.applicantName || !offerForm.designation || !offerForm.company || !offerForm.customGrade || !offerForm.customMobileNo || !offerForm.customContactName) {
      alert("Please fill all required fields"); return
    }
    if (!offerForm.customSalaryAnnexure) {
      alert("Salary Annexure is required. Please create a Salary Annexure in Frappe first, then create the offer letter."); return
    }
    if (offerForm.customMobileNo.length !== 10) {
      alert("Mobile number must be exactly 10 digits"); return
    }
    if (existingOffer) {
      alert(`Job Offer already exists for this applicant (${existingOffer}). You cannot create duplicate offers for the same applicant.`); return
    }
    setIsSaving(true)
    try {
      const requestData = {
        job_applicant: offerForm.jobApplicant,
        applicant_name: offerForm.applicantName,
        applicant_email: offerForm.applicantEmail,
        offer_date: offerForm.offerDate,
        designation: offerForm.designation,
        company: offerForm.company,
        status: offerForm.status,
        job_offer_template: offerForm.jobOfferTemplate,
        custom_offer_acceptance_date: offerForm.customOfferAcceptanceDate,
        custom_grade: offerForm.customGrade,
        custom_mobile_no: offerForm.customMobileNo,
        custom_contact_name: offerForm.customContactName,
        custom_joining_date: offerForm.customJoiningDate,
        custom_salary_annexure: offerForm.customSalaryAnnexure,
        offer_terms: offerTerms
      }
      console.log("Submitting job offer with data:", requestData)
      const csrfToken = await getFrappeCSRF()
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.create_job_offer`,
        {
          method: 'POST', credentials: 'include',
          headers: { 'Content-Type': 'application/json', "X-Frappe-CSRF-Token": csrfToken },
          body: JSON.stringify({ data: requestData })
        }
      )
      const result = await response.json()
      if (result?.message?.success === false) throw new Error(result.message.message || "Failed to create job offer")
      alert(result?.message?.message || "Job Offer created successfully!")
      router.push('/offer-list')
    } catch (error: any) {
      console.error("Error creating job offer:", error)
      alert(error.message || "Failed to create job offer")
    } finally { setIsSaving(false) }
  }

  const getStatusDotClass = (status: string) => {
    switch (status) {
      case "Accepted": return "green"
      case "Rejected": return "red"
      case "Awaiting Response": return "blue"
      case "Pending": return "yellow"
      default: return "grey"
    }
  }

  const dateChangeHandler = (field: keyof typeof offerForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value && new Date(value).getFullYear() > 9999) return
    setOfferForm(prev => ({ ...prev, [field]: value }))
  }

  const dateKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const value = input.value
    if (!value) return
    const year = value.split("-")[0]
    const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]
    if (year && year.length >= 4 && !allowed.includes(e.key)) {
      const cursorPos = input.selectionStart
      const firstDash = value.indexOf("-")
      if (cursorPos !== null && cursorPos <= firstDash && year.length >= 4) e.preventDefault()
    }
  }

  return (
    <>
      <style>{css}</style>
      <div className="ol">
        <div className="ol-wrap">

          <div className={`ol-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

          {/* SIDEBAR */}
          <aside className={`ol-sb${sidebarOpen ? "" : " collapsed"}`}>
            <div className="ol-sb-brand">
              <div className="ol-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
              <div><div className="ol-sb-name">Job Management</div><div className="ol-sb-sub">HR Platform</div></div>
              <button className="ol-sb-close" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
            </div>
            <nav className="ol-nav">
              <Link href="/create-job" className="ol-nav-cta"><Plus size={14} /> New Job Opening</Link>
              <div className="ol-nav-lbl">Pipeline</div>
              <Link href="/job-opening" className="ol-nav-link"><Briefcase size={15} /> Job Opening</Link>
              <Link href="/upload-resumes" className="ol-nav-link"><Upload size={15} /> Resume Collection</Link>
              <Link href="/candidates" className="ol-nav-link"><Users size={15} /> Candidates</Link>
              <Link href="/interview" className="ol-nav-link"><Calendar size={15} /> Interview Scheduling</Link>
              <div className="ol-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
              <Link href="/feedback" className="ol-nav-link"><MessageSquare size={15} /> Feedback</Link>
              <Link href="/document-verify-list" className="ol-nav-link"><FileText size={15} /> Document Verification</Link>
              <Link href="/offer-list" className="ol-nav-link active"><Zap size={15} /> Offer Letter</Link>
              <Link href="/letter-appointment" className="ol-nav-link"><UserCheck size={15} /> Appointment Letter</Link>
            </nav>
            <div className="ol-sb-foot">
              <button className="ol-logout"><LogOut size={15} /> Sign out</button>
            </div>
          </aside>

          {/* MAIN */}
          <div className={`ol-main${sidebarOpen ? "" : " sb-closed"}`}>
            <header className="ol-header">
              <button className="ol-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
              <div className="ol-hdr-sep" />
              <button className="ol-back-btn" onClick={() => router.back()}>
                <ArrowLeft size={13} /> Back
              </button>
              <div className="ol-hdr-sep" />
              <div className="ol-crumb">
                <Home size={13} /> Home <ChevronRight size={13} />
                <Link href="/offer-list" style={{ color: 'var(--t3)', textDecoration: 'none' }}>Offer Letter</Link>
                <ChevronRight size={13} /> <strong>Create Offer</strong>
              </div>
            </header>

            <div className="ol-page-outer">
              <div className="ol-page">

                {/* Toolbar */}
                <div className="ol-toolbar">
                  <div>
                    <h1 className="ol-page-title">Create Job Offer</h1>
                    <p className="ol-page-sub">Generate and send job offers to selected candidates</p>
                  </div>
                </div>

                {/* ── OFFER DETAILS CARD ── */}
                <div className="ol-card">
                  <div className="ol-card-head">
                    <div className="ol-card-head-left">
                      <div className="ol-card-head-icon"><FileText size={16} /></div>
                      <span className="ol-card-title">Offer Details</span>
                    </div>
                  </div>
                  <div className="ol-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Row 1: Applicant + Status */}
                    <div className="ol-grid-2">
                      <div className="ol-field">
                        <label className="ol-label"><User size={13} /> Job Applicant <span className="ol-req">*</span></label>
                        <Popover open={openApplicant} onOpenChange={setOpenApplicant}>
                          <PopoverTrigger asChild>
                            <button
                              className="ol-combo-btn"
                              role="combobox"
                              aria-expanded={openApplicant}
                              disabled={loading.applicants}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                height: 42, width: '100%', padding: '0 12px', borderRadius: 8,
                                border: '1px solid var(--border)', background: 'var(--bg)',
                                fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: 'var(--t1)',
                                cursor: loading.applicants ? 'not-allowed' : 'pointer',
                                opacity: loading.applicants ? 0.65 : 1,
                                transition: 'all .15s',
                              }}
                            >
                              <span style={{ color: offerForm.jobApplicant ? 'var(--t1)' : 'var(--t3)' }}>
                                {offerForm.jobApplicant
                                  ? jobApplicants.find(a => a.name === offerForm.jobApplicant)?.applicant_name
                                  : loading.applicants ? "Loading applicants..." : "Search and select applicant..."}
                              </span>
                              <ChevronsUpDown size={14} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent style={{ width: 400, padding: 0 }}>
                            <Command>
                              <CommandInput placeholder="Search applicant by name or email..." />
                              <CommandEmpty>No applicant found.</CommandEmpty>
                              <CommandGroup style={{ maxHeight: 300, overflow: 'auto' }}>
                                {jobApplicants.map(applicant => (
                                  <CommandItem
                                    key={applicant.name}
                                    value={`${applicant.applicant_name} ${applicant.email_id}`}
                                    onSelect={() => handleJobApplicantChange(applicant.name)}
                                  >
                                    <Check size={14} style={{ marginRight: 8, opacity: offerForm.jobApplicant === applicant.name ? 1 : 0 }} />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <span style={{ fontWeight: 500 }}>{applicant.applicant_name}</span>
                                      <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>{applicant.email_id}</span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="ol-field">
                        <label className="ol-label">
                          <span className="ol-status-dot blue" style={{ marginRight: 2 }} /> Status <span className="ol-req">*</span>
                        </label>
                        <select
                          className="ol-input"
                          value={offerForm.status}
                          onChange={e => setOfferForm({ ...offerForm, status: e.target.value })}
                          style={{ cursor: 'pointer' }}
                        >
                          {statusOptions.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Applicant Name + Offer Date */}
                    <div className="ol-grid-2">
                      <div className="ol-field">
                        <label className="ol-label"><User size={13} /> Applicant Name <span className="ol-req">*</span></label>
                        <input
                          className="ol-input"
                          value={offerForm.applicantName}
                          onChange={e => setOfferForm({ ...offerForm, applicantName: e.target.value })}
                          placeholder="Full name of applicant"
                          disabled={!!offerForm.jobApplicant}
                        />
                      </div>
                      <div className="ol-field">
                        <label className="ol-label"><Calendar size={13} /> Offer Date</label>
                        <input
                          className="ol-input"
                          type="date"
                          value={offerForm.offerDate}
                          onChange={dateChangeHandler('offerDate')}
                          onKeyDown={dateKeyDownHandler}
                          min={getTodayDate()}
                          onFocus={e => e.currentTarget.showPicker?.()}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                    </div>

                    {/* Row 3: Email + Designation */}
                    <div className="ol-grid-2">
                      <div className="ol-field">
                        <label className="ol-label"><Mail size={13} /> Applicant Email Address</label>
                        <input
                          className="ol-input"
                          type="email"
                          value={offerForm.applicantEmail}
                          onChange={e => setOfferForm({ ...offerForm, applicantEmail: e.target.value })}
                          placeholder="email@example.com"
                          disabled={!!offerForm.jobApplicant}
                        />
                      </div>
                      <div className="ol-field">
                        <label className="ol-label"><Briefcase size={13} /> Designation <span className="ol-req">*</span></label>
                        <Popover open={openDesignation} onOpenChange={setOpenDesignation}>
                          <PopoverTrigger asChild>
                            <button
                              role="combobox"
                              aria-expanded={openDesignation}
                              disabled={loading.designations}
                              onClick={() => setOpenDesignation(o => !o)}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                height: 42, width: '100%', padding: '0 12px', borderRadius: 8,
                                border: '1px solid var(--border)', background: 'var(--bg)',
                                fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: 'var(--t1)',
                                cursor: loading.designations ? 'not-allowed' : 'pointer',
                                opacity: loading.designations ? 0.65 : 1,
                              }}
                            >
                              <span style={{ color: offerForm.designation ? 'var(--t1)' : 'var(--t3)' }}>
                                {offerForm.designation
                                  ? designations.find(d => d.name === offerForm.designation)?.designation_name || offerForm.designation
                                  : loading.designations ? "Loading designations..." : "Search and select designation..."}
                              </span>
                              <ChevronsUpDown size={14} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent style={{ width: 350, padding: 0 }}>
                            <Command>
                              <CommandInput placeholder="Search designation..." />
                              <CommandEmpty>No designation found.</CommandEmpty>
                              <CommandGroup style={{ maxHeight: 300, overflow: 'auto' }}>
                                {designations.map(d => (
                                  <CommandItem
                                    key={d.name}
                                    value={d.designation_name || d.name}
                                    onSelect={() => handleDesignationChange(d.name)}
                                  >
                                    <Check size={14} style={{ marginRight: 8, opacity: offerForm.designation === d.name ? 1 : 0 }} />
                                    {d.designation_name || d.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Row 4: Acceptance Date + Joining Date */}
                    <div className="ol-grid-2">
                      <div className="ol-field">
                        <label className="ol-label"><Calendar size={13} /> Offer Acceptance Date</label>
                        <input
                          className="ol-input"
                          type="date"
                          value={offerForm.customOfferAcceptanceDate}
                          onChange={dateChangeHandler('customOfferAcceptanceDate')}
                          onKeyDown={dateKeyDownHandler}
                          min={getTodayDate()}
                          onFocus={e => e.currentTarget.showPicker?.()}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                      <div className="ol-field">
                        <label className="ol-label"><Calendar size={13} /> Joining Date</label>
                        <input
                          className="ol-input"
                          type="date"
                          value={offerForm.customJoiningDate}
                          onChange={dateChangeHandler('customJoiningDate')}
                          onKeyDown={dateKeyDownHandler}
                          min={getTodayDate()}
                          onFocus={e => e.currentTarget.showPicker?.()}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                    </div>

                    {/* Row 5: Grade + Salary Annexure + Mobile No + Contact Name */}
                    <div className="ol-grid-3">
                      <div className="ol-field">
                        <label className="ol-label"><Briefcase size={13} /> Grade <span className="ol-req">*</span></label>
                        <Popover open={openGrade} onOpenChange={setOpenGrade}>
                          <PopoverTrigger asChild>
                            <button
                              role="combobox"
                              aria-expanded={openGrade}
                              disabled={loading.grades}
                              onClick={() => setOpenGrade(o => !o)}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                height: 42, width: '100%', padding: '0 12px', borderRadius: 8,
                                border: '1px solid var(--border)', background: 'var(--bg)',
                                fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: 'var(--t1)',
                                cursor: loading.grades ? 'not-allowed' : 'pointer',
                                opacity: loading.grades ? 0.65 : 1,
                              }}
                            >
                              <span style={{ color: offerForm.customGrade ? 'var(--t1)' : 'var(--t3)' }}>
                                {offerForm.customGrade
                                  ? offerForm.customGrade
                                  : loading.grades ? "Loading grades..." : "Search and select grade..."}
                              </span>
                              <ChevronsUpDown size={14} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent style={{ width: 250, padding: 0 }}>
                            <Command>
                              <CommandInput placeholder="Search grade..." />
                              <CommandEmpty>No grade found.</CommandEmpty>
                              <CommandGroup style={{ maxHeight: 300, overflow: 'auto' }}>
                                {grades.map(g => (
                                  <CommandItem
                                    key={g.name}
                                    value={g.name}
                                    onSelect={() => handleGradeChange(g.name)}
                                  >
                                    <Check size={14} style={{ marginRight: 8, opacity: offerForm.customGrade === g.name ? 1 : 0 }} />
                                    {g.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="ol-field">
                        <label className="ol-label"><FileText size={13} /> Salary Annexure <span className="ol-req">*</span></label>
                        <select
                          className="ol-input"
                          value={offerForm.customSalaryAnnexure}
                          onChange={e => setOfferForm({ ...offerForm, customSalaryAnnexure: e.target.value })}
                          disabled={loading.salaryAnnexures}
                          style={{ cursor: 'pointer' }}
                        >
                          <option value="">
                            {loading.salaryAnnexures ? "No Salary Anexure found"
                              : salaryAnnexures.length === 0 ? "No annexures available"
                                : "Select annexure..."}
                          </option>
                          {salaryAnnexures.map(a => (
                            <option key={a.name} value={a.name}>{a.name}</option>
                          ))}
                        </select>
                        {salaryAnnexures.length === 0 && !loading.salaryAnnexures && (
                          <div className="ol-hint" style={{ color: '#f59e0b' }}>
                            <AlertCircle size={12} /> Please create a Salary Annexure in Frappe first.
                          </div>
                        )}
                      </div>

                      <div className="ol-field">
                        <label className="ol-label"><User size={13} /> Mobile No <span className="ol-req">*</span></label>
                        <input
                          className="ol-input"
                          type="tel"
                          value={offerForm.customMobileNo}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                            setOfferForm({ ...offerForm, customMobileNo: val })
                          }}
                          placeholder="e.g., 9876543210"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    {/* Row 6: Contact Name (single col) */}
                    <div className="ol-grid-2">
                      <div className="ol-field">
                        <label className="ol-label"><User size={13} /> Contact Name <span className="ol-req">*</span></label>
                        <input
                          className="ol-input"
                          value={offerForm.customContactName}
                          onChange={e => setOfferForm({ ...offerForm, customContactName: e.target.value })}
                          placeholder="e.g., HR Manager name"
                        />
                      </div>
                    </div>

                    {/* Row 7: Template + Company */}
                    <div className="ol-grid-2">
                      <div className="ol-field">
                        <label className="ol-label"><FileText size={13} /> Job Offer Term Template</label>
                        <select
                          className="ol-input"
                          value={offerForm.jobOfferTemplate}
                          onChange={e => setOfferForm({ ...offerForm, jobOfferTemplate: e.target.value })}
                          disabled={loading.templates || templates.length === 0}
                          style={{ cursor: 'pointer' }}
                        >
                          <option value="">
                            {loading.templates ? "Loading templates..."
                              : templates.length === 0 ? "No templates available"
                                : "Select template (optional)"}
                          </option>
                          {templates.map(t => (
                            <option key={t.name} value={t.name}>{t.offer_term_template_name || t.name}</option>
                          ))}
                        </select>
                        {offerForm.jobOfferTemplate && (
                          <div className="ol-hint">
                            <CheckCircle2 size={12} /> Template terms will be loaded automatically
                          </div>
                        )}
                      </div>
                      <div className="ol-field">
                        <label className="ol-label"><Building2 size={13} /> Company <span className="ol-req">*</span></label>
                        <select
                          className="ol-input"
                          value={offerForm.company}
                          onChange={e => setOfferForm({ ...offerForm, company: e.target.value })}
                          disabled={loading.companies}
                          style={{ cursor: 'pointer' }}
                        >
                          <option value="">
                            {loading.companies ? "Loading companies..."
                              : companies.length === 0 ? "No companies found"
                                : "Select company"}
                          </option>
                          {companies.map(c => (
                            <option key={c.name} value={c.name}>{c.company_name || c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Duplicate warning */}
                    {existingOffer && (
                      <div className="ol-alert red">
                        <div className="ol-alert-icon"><AlertCircle size={18} /></div>
                        <div>
                          <div className="ol-alert-title">Offer Already Exists</div>
                          <div className="ol-alert-sub">
                            A job offer has already been created for this applicant ({existingOffer}).
                            You cannot create duplicate offers for the same applicant.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Checking duplicate */}
                    {checkingDuplicate && (
                      <div className="ol-alert blue">
                        <div className="ol-spin" />
                        <div>
                          <div className="ol-alert-sub" style={{ color: 'var(--accent)' }}>Checking for existing offer...</div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* ── OFFER TERMS CARD ── */}
                <div className="ol-card">
                  <div className="ol-card-head">
                    <div className="ol-card-head-left">
                      <div className="ol-card-head-icon purple"><FileText size={16} /></div>
                      <span className="ol-card-title">Job Offer Terms</span>
                      {offerTerms.length > 0 && (
                        <span className="ol-badge blue" style={{ marginLeft: 8 }}>
                          {offerTerms.length} term{offerTerms.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {offerTerms.length === 0 ? (
                    <div className="ol-terms-empty">
                      <FileText size={48} className="ol-terms-empty-icon" style={{ color: 'var(--t3)' }} />
                      <p className="ol-terms-empty-title">No offer terms added yet</p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="ol-terms-table">
                        <thead>
                          <tr>
                            <th style={{ width: 56 }}>No.</th>
                            <th>Offer Term <span style={{ color: '#ef4444' }}>*</span></th>
                            <th>Value / Description <span style={{ color: '#ef4444' }}>*</span></th>
                            <th style={{ width: 60 }} />
                          </tr>
                        </thead>
                        <tbody>
                          {offerTerms.map((term, index) => (
                            <tr key={term.id}>
                              <td className="ol-terms-num">{index + 1}</td>
                              <td>
                                <input
                                  className="ol-input"
                                  value={term.offer_term}
                                  onChange={e => updateOfferTerm(term.id, 'offer_term', e.target.value)}
                                  placeholder="e.g., Base Salary, Health Insurance"
                                />
                              </td>
                              <td>
                                <textarea
                                  className="ol-textarea"
                                  value={term.value_description}
                                  onChange={e => updateOfferTerm(term.id, 'value_description', e.target.value)}
                                  placeholder="e.g., $80,000 per year"
                                  rows={2}
                                />
                              </td>
                              <td />
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* ── ACTIONS ── */}
                <div className="ol-actions">
                  <button className="ol-btn-cancel" onClick={() => router.back()}>Cancel</button>
                  <button
                    className="ol-btn-submit"
                    onClick={handleSave}
                    disabled={isSaving || !!existingOffer}
                  >
                    {isSaving ? (
                      <><div className="ol-btn-submit-spin" /> Creating Offer...</>
                    ) : existingOffer ? (
                      <><AlertCircle size={16} /> Offer Already Exists</>
                    ) : (
                      <><CheckCircle2 size={16} /> Create Offer</>
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
