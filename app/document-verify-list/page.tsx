// "use client"
// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import {
//     Plus,
//     Search,
//     FileText,
//     User,
//     Calendar,
//     Eye,
//     Trash2,
//     Download,
//     Mail,
//     Briefcase,
//     CheckCircle2,
//     XCircle,
//     ArrowLeft,
//     ChevronLeft,
//     ChevronRight,

// } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { API_BASE_URL } from '@/lib/api-config'

// interface ApplicantDocument {
//     name: string
//     applicant_name: string
//     employee: string
//     creation: string
//     modified: string
//     aadhar_card: string
//     passport: string
//     experience: string
//     education: string
//     bank_details: string
//     pan: string
//     medical: string
//     photos: string
//     custom_background_verification: string
//     custom_salary_slip: string
//     custom_additional_document: string
//     applicant_details?: {
//         applicant_name: string
//         email_id: string
//     }
//     employee_details?: {
//         employee_name: string
//         personal_email: string
//     }
// }

// export default function DocumentVerifyListPage() {
//     const router = useRouter()
//     const [documents, setDocuments] = useState<ApplicantDocument[]>([])
//     const [loading, setLoading] = useState(true)
//     const [searchQuery, setSearchQuery] = useState("")
//     const [selectedDoc, setSelectedDoc] = useState<ApplicantDocument | null>(null)

//     // Pagination state                         
//     const ITEMS_PER_PAGE = 10
//     const [currentPage, setCurrentPage] = useState(1)

//     useEffect(() => {
//         fetchDocuments()
//     }, [])

//     useEffect(() => {
//         setCurrentPage(1)
//     }, [searchQuery])

//     useEffect(() => {
//         document.title = 'Document Verification List'
//     }, [])

//     const fetchDocuments = async () => {
//         setLoading(true)
//         try {
//             const response = await fetch(
//                 `${API_BASE_URL}/api/resource/Applicant Document?fields=["*"]&limit_page_length=0&order_by=creation desc`,
//                 {
//                     credentials: 'include',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             )
//             const data = await response.json()

//             if (data && data.data) {
//                 const documentsWithDetails = await Promise.all(
//                     data.data.map(async (doc: ApplicantDocument) => {
//                         if (doc.applicant_name) {
//                             try {
//                                 const applicantResponse = await fetch(
//                                     `${API_BASE_URL}/api/resource/Job Applicant/${doc.applicant_name}`,
//                                     {
//                                         credentials: 'include',
//                                         headers: {
//                                             'Content-Type': 'application/json',
//                                         },
//                                     }
//                                 )
//                                 const applicantData = await applicantResponse.json()
//                                 doc.applicant_details = applicantData.data
//                             } catch (error) {
//                                 console.error("Error fetching applicant details:", error)
//                             }
//                         }

//                         if (doc.employee) {
//                             try {
//                                 const employeeResponse = await fetch(
//                                     `${API_BASE_URL}/api/resource/Employee/${doc.employee}`,
//                                     {
//                                         credentials: 'include',
//                                         headers: {
//                                             'Content-Type': 'application/json',
//                                         },
//                                     }
//                                 )
//                                 const employeeData = await employeeResponse.json()
//                                 doc.employee_details = employeeData.data
//                             } catch (error) {
//                                 console.error("Error fetching employee details:", error)
//                             }
//                         }

//                         return doc
//                     })
//                 )
//                 setDocuments(documentsWithDetails)
//             }
//         } catch (error) {
//             console.error("Error fetching documents:", error)
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleDelete = async (name: string) => {
//         if (!confirm("Are you sure you want to delete this document?")) {
//             return
//         }

//         try {
//             const response = await fetch(
//                 `${API_BASE_URL}/api/resource/Applicant Document/${name}`,
//                 {
//                     method: "DELETE",
//                     credentials: 'include',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             )

//             if (response.ok) {
//                 alert("Document deleted successfully!")
//                 fetchDocuments()
//             } else {
//                 alert("Failed to delete document")
//             }
//         } catch (error) {
//             console.error("Error deleting document:", error)
//             alert("Failed to delete document")
//         }
//     }

//     const filteredDocuments = documents.filter((doc) => {
//         const searchLower = searchQuery.toLowerCase()
//         return (
//             doc.name.toLowerCase().includes(searchLower) ||
//             doc.applicant_details?.applicant_name?.toLowerCase().includes(searchLower) ||
//             doc.employee_details?.employee_name?.toLowerCase().includes(searchLower)
//         )
//     })

//     // Pagination calculation                                       
//     const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE)
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
//     const endIndex = startIndex + ITEMS_PER_PAGE
//     const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex)

//     const formatDate = (dateString: string) => {
//         return new Date(dateString).toLocaleDateString("en-IN", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//         })
//     }

//     const countMultipleFiles = (jsonString: string | null | undefined): number => {
//         if (!jsonString) return 0
//         try {
//             const parsed = JSON.parse(jsonString)
//             return Array.isArray(parsed) ? parsed.length : 1
//         } catch {
//             return jsonString ? 1 : 0
//         }
//     }

//     const countDocuments = (doc: ApplicantDocument) => {
//         let count = 0
//         if (doc.aadhar_card) count++
//         if (doc.passport) count++
//         if (doc.experience) count++
//         if (doc.education) count++
//         if (doc.bank_details) count++
//         if (doc.pan) count++
//         if (doc.medical) count++
//         if (doc.photos) count++
//         if (doc.custom_background_verification) count++
//         if (doc.custom_salary_slip) count++
//         if (doc.custom_additional_document) count++
//         return count
//     }

//     const getCompletionPercentage = (doc: ApplicantDocument) => {
//         const total = 11 // Updated to include 3 new fields
//         const completed = countDocuments(doc)
//         return Math.round((completed / total) * 100)
//     }

//     const parseMultipleFiles = (jsonString: string | null | undefined): string[] => {
//         if (!jsonString) return []
//         try {
//             const parsed = JSON.parse(jsonString)
//             return Array.isArray(parsed) ? parsed : [jsonString]
//         } catch {
//             return jsonString ? [jsonString] : []
//         }
//     }

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//                 <div className="flex flex-col items-center gap-4">
//                     <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                     <p className="text-lg font-medium text-slate-600">Loading documents...</p>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//             <div className="container mx-auto p-8 space-y-8">
//                 {/* Header */}
//                 {/* Header */}
//                 <div className="flex items-center justify-between">
//                     <div className="space-y-2">
//                         <div className="flex items-center space-x-4">
//                             <Button
//                                 variant="outline"
//                                 size="sm"
//                                 // onClick={() => window.history.back()}
//                                 onClick={() => router.push("/home")}
//                                 className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
//                             >
//                                 <ArrowLeft className="h-4 w-4 mr-2" />
//                                 Back to Dashboard
//                             </Button>
//                         </div>
//                         <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                             Document Verification
//                         </h1>
//                         <p className="text-slate-600">Manage and verify applicant documentation</p>
//                     </div>
//                     <div>
//                         <Button
//                             onClick={() => router.push('/offer-letter')}
//                             className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
//                         >
//                             <Plus className="h-4 w-4 mr-2" />
//                             Create Offer Letter
//                         </Button>
//                     </div>
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
//                         <CardContent className="p-6 relative z-10">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-blue-100 text-sm font-medium">Total Documents</p>
//                                     <p className="text-4xl font-bold mt-2">{documents.length}</p>
//                                 </div>
//                                 <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
//                                     <FileText className="h-8 w-8" />
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white overflow-hidden relative">
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
//                         <CardContent className="p-6 relative z-10">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-indigo-100 text-sm font-medium">Applicants</p>
//                                     <p className="text-4xl font-bold mt-2">
//                                         {new Set(documents.map(d => d.applicant_name)).size}
//                                     </p>
//                                 </div>
//                                 <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
//                                     <User className="h-8 w-8" />
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative">
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
//                         <CardContent className="p-6 relative z-10">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-purple-100 text-sm font-medium">This Month</p>
//                                     <p className="text-4xl font-bold mt-2">
//                                         {documents.filter(d => {
//                                             const docDate = new Date(d.creation)
//                                             const now = new Date()
//                                             return docDate.getMonth() === now.getMonth() &&
//                                                 docDate.getFullYear() === now.getFullYear()
//                                         }).length}
//                                     </p>
//                                 </div>
//                                 <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
//                                     <Calendar className="h-8 w-8" />
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {/* Search Card */}
//                 {!selectedDoc && (
//                     <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
//                         <CardContent className="p-6">
//                             <div className="relative">
//                                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search by applicant name, document ID, or employee..."
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                     className="w-full pl-12 pr-4 h-12 border-0 bg-slate-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-800 placeholder:text-slate-400"
//                                 />
//                                 {searchQuery && (
//                                     <button
//                                         onClick={() => setSearchQuery("")}
//                                         className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
//                                     >
//                                         ✕
//                                     </button>
//                                 )}
//                             </div>
//                         </CardContent>
//                     </Card>
//                 )}

//                 {/* Main Content */}
//                 <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
//                     {!selectedDoc ? (
//                         <>
//                             <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
//                                 <CardTitle className="flex items-center space-x-3">
//                                     <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
//                                         <FileText className="h-5 w-5 text-white" />
//                                     </div>
//                                     <span className="text-xl">All Documents</span>
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="p-6">
//                                 {filteredDocuments.length === 0 ? (
//                                     <div className="text-center py-20">
//                                         <div className="inline-block p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-6">
//                                             <FileText className="h-16 w-16 text-blue-400" />
//                                         </div>
//                                         <h3 className="text-xl font-semibold text-slate-800 mb-2">No Documents Found</h3>
//                                         <p className="text-slate-600">No applicant documents available yet.</p>
//                                     </div>
//                                 ) : (
//                                     <>
//                                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                                             {paginatedDocuments.map((doc) => {
//                                                 const percentage = getCompletionPercentage(doc)
//                                                 return (
//                                                     <Card
//                                                         key={doc.name}
//                                                         className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 cursor-pointer"
//                                                         onClick={() => setSelectedDoc(doc)}
//                                                     >
//                                                         <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

//                                                         <CardContent className="p-6 relative z-10">
//                                                             <div className="space-y-4">
//                                                                 {/* Header */}
//                                                                 <div className="flex items-start justify-between">
//                                                                     <div className="flex items-center gap-3">
//                                                                         <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
//                                                                             {doc.applicant_details?.applicant_name?.charAt(0).toUpperCase() || "?"}
//                                                                         </div>
//                                                                         <div>
//                                                                             <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
//                                                                                 {doc.applicant_details?.applicant_name || doc.applicant_name}
//                                                                             </h3>
//                                                                             <p className="text-xs text-slate-500">{doc.name}</p>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>

//                                                                 {/* Progress Bar */}
//                                                                 <div className="space-y-2">
//                                                                     <div className="flex items-center justify-between text-sm">
//                                                                         <span className="text-slate-600 font-medium">Completion</span>
//                                                                         <span className="font-bold text-slate-800">{percentage}%</span>
//                                                                     </div>
//                                                                     <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
//                                                                         <div
//                                                                             className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
//                                                                             style={{ width: `${percentage}%` }}
//                                                                         ></div>
//                                                                     </div>
//                                                                     <p className="text-xs text-slate-500">
//                                                                         {countDocuments(doc)} of 11 documents uploaded
//                                                                     </p>
//                                                                 </div>

//                                                                 {/* Divider */}
//                                                                 <div className="border-t border-slate-200"></div>

//                                                                 {/* Details */}
//                                                                 <div className="space-y-3">
//                                                                     <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
//                                                                         <div className="p-2 bg-blue-100 rounded-lg">
//                                                                             <Mail className="h-4 w-4 text-blue-600" />
//                                                                         </div>
//                                                                         <div className="flex-1 min-w-0">
//                                                                             <p className="text-xs text-slate-500">Email</p>
//                                                                             <p className="font-medium text-sm text-slate-700 truncate">
//                                                                                 {doc.applicant_details?.email_id || "N/A"}
//                                                                             </p>
//                                                                         </div>
//                                                                     </div>

//                                                                     <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
//                                                                         <div className="p-2 bg-indigo-100 rounded-lg">
//                                                                             <Briefcase className="h-4 w-4 text-indigo-600" />
//                                                                         </div>
//                                                                         <div className="flex-1 min-w-0">
//                                                                             <p className="text-xs text-slate-500">Employee</p>
//                                                                             <p className="font-medium text-sm text-slate-700 truncate">
//                                                                                 {doc.employee_details?.employee_name || "Not Assigned"}
//                                                                             </p>
//                                                                         </div>
//                                                                     </div>

//                                                                     <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
//                                                                         <div className="p-2 bg-blue-100 rounded-lg">
//                                                                             <Calendar className="h-4 w-4 text-blue-600" />
//                                                                         </div>
//                                                                         <div className="flex-1 min-w-0">
//                                                                             <p className="text-xs text-slate-500">Last Modified</p>
//                                                                             <p className="font-medium text-sm text-slate-700">
//                                                                                 {formatDate(doc.modified)}
//                                                                             </p>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>

//                                                                 {/* Action Button */}
//                                                                 <Button
//                                                                     size="sm"
//                                                                     className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
//                                                                     onClick={(e) => {
//                                                                         e.stopPropagation()
//                                                                         setSelectedDoc(doc)
//                                                                     }}
//                                                                 >
//                                                                     <Eye className="h-4 w-4 mr-2" />
//                                                                     View Details
//                                                                 </Button>
//                                                             </div>
//                                                         </CardContent>
//                                                     </Card>
//                                                 )
//                                             })}
//                                         </div>

//                                         {/* Pagination Controls */}
//                                         {filteredDocuments.length > ITEMS_PER_PAGE && (
//                                             <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
//                                                 <div className="text-sm text-slate-600">
//                                                     Showing {startIndex + 1} to {Math.min(endIndex, filteredDocuments.length)} of {filteredDocuments.length} documents
//                                                 </div>
//                                                 <div className="flex items-center space-x-2">
//                                                     <Button
//                                                         variant="outline"
//                                                         size="sm"
//                                                         onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                                                         disabled={currentPage === 1}
//                                                     >
//                                                         <ChevronLeft className="h-4 w-4 mr-2" />
//                                                         Previous
//                                                     </Button>
//                                                     <div className="text-sm font-medium text-slate-700">
//                                                         Page {currentPage} of {totalPages}
//                                                     </div>
//                                                     <Button
//                                                         variant="outline"
//                                                         size="sm"
//                                                         onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                                                         disabled={currentPage === totalPages}
//                                                     >
//                                                         Next
//                                                         <ChevronRight className="h-4 w-4 ml-2" />
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </>
//                                 )}
//                             </CardContent>
//                         </>
//                     ) : (
//                         <>
//                             <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
//                                 <div className="flex items-center justify-between">
//                                     <CardTitle className="flex items-center space-x-3">
//                                         <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
//                                             <FileText className="h-5 w-5 text-white" />
//                                         </div>
//                                         <span className="text-xl">Document Details</span>
//                                     </CardTitle>
//                                     <Button
//                                         variant="outline"
//                                         size="sm"
//                                         onClick={() => setSelectedDoc(null)}
//                                         className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
//                                     >
//                                         <ArrowLeft className="h-4 w-4 mr-2" />
//                                         Back to List
//                                     </Button>
//                                 </div>
//                             </CardHeader>
//                             <CardContent className="p-6 space-y-6">
//                                 {/* Applicant Header */}
//                                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
//                                     <div className="flex items-start justify-between">
//                                         <div className="flex items-center gap-4">
//                                             <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
//                                                 {selectedDoc.applicant_details?.applicant_name?.charAt(0).toUpperCase() || "?"}
//                                             </div>
//                                             <div>
//                                                 <h2 className="text-2xl font-bold text-slate-800">
//                                                     {selectedDoc.applicant_details?.applicant_name || selectedDoc.applicant_name}
//                                                 </h2>
//                                                 <p className="text-sm text-slate-500 mt-1">ID: {selectedDoc.name}</p>
//                                             </div>
//                                         </div>
//                                         <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-sm px-4 py-2">
//                                             {countDocuments(selectedDoc)} / 11 Documents
//                                         </Badge>
//                                     </div>
//                                 </div>

//                                 {/* Info Cards */}
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <Card className="border-0 shadow-md bg-gradient-to-br from-white to-blue-50/30">
//                                         <CardContent className="p-4">
//                                             <div className="flex items-center gap-3">
//                                                 <div className="p-3 bg-blue-100 rounded-xl">
//                                                     <Mail className="h-5 w-5 text-blue-600" />
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <p className="text-xs text-slate-500 font-medium">Email Address</p>
//                                                     <p className="text-sm font-semibold text-slate-800 truncate mt-1">
//                                                         {selectedDoc.applicant_details?.email_id || "-"}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </CardContent>
//                                     </Card>

//                                     <Card className="border-0 shadow-md bg-gradient-to-br from-white to-indigo-50/30">
//                                         <CardContent className="p-4">
//                                             <div className="flex items-center gap-3">
//                                                 <div className="p-3 bg-indigo-100 rounded-xl">
//                                                     <Briefcase className="h-5 w-5 text-indigo-600" />
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <p className="text-xs text-slate-500 font-medium">Employee</p>
//                                                     <p className="text-sm font-semibold text-slate-800 truncate mt-1">
//                                                         {selectedDoc.employee_details?.employee_name || "Not Assigned"}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </CardContent>
//                                     </Card>

//                                     <Card className="border-0 shadow-md bg-gradient-to-br from-white to-blue-50/30">
//                                         <CardContent className="p-4">
//                                             <div className="flex items-center gap-3">
//                                                 <div className="p-3 bg-blue-100 rounded-xl">
//                                                     <Calendar className="h-5 w-5 text-blue-600" />
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <p className="text-xs text-slate-500 font-medium">Created Date</p>
//                                                     <p className="text-sm font-semibold text-slate-800 mt-1">
//                                                         {formatDate(selectedDoc.creation)}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </CardContent>
//                                     </Card>

//                                     <Card className="border-0 shadow-md bg-gradient-to-br from-white to-indigo-50/30">
//                                         <CardContent className="p-4">
//                                             <div className="flex items-center gap-3">
//                                                 <div className="p-3 bg-indigo-100 rounded-xl">
//                                                     <Calendar className="h-5 w-5 text-indigo-600" />
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <p className="text-xs text-slate-500 font-medium">Modified Date</p>
//                                                     <p className="text-sm font-semibold text-slate-800 mt-1">
//                                                         {formatDate(selectedDoc.modified)}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </CardContent>
//                                     </Card>
//                                 </div>

//                                 {/* Document Status */}
//                                 <div className="space-y-4">
//                                     <div className="flex items-center gap-3">
//                                         <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
//                                             <FileText className="h-5 w-5 text-white" />
//                                         </div>
//                                         <h3 className="text-xl font-bold text-slate-800">Document Status</h3>
//                                     </div>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         {[
//                                             { label: "Aadhar Card", value: selectedDoc.aadhar_card, icon: FileText },
//                                             { label: "PAN Card", value: selectedDoc.pan, icon: FileText },
//                                             { label: "Passport", value: selectedDoc.passport, icon: FileText },
//                                             { label: "Experience Letter", value: selectedDoc.experience, icon: Briefcase },
//                                             { label: "Education Certificate", value: selectedDoc.education, icon: FileText },
//                                             { label: "Bank Details", value: selectedDoc.bank_details, icon: FileText },
//                                             { label: "Medical Certificate", value: selectedDoc.medical, icon: FileText },
//                                             { label: "Photos", value: selectedDoc.photos, icon: User },
//                                         ].map((item) => (
//                                             <Card
//                                                 key={item.label}
//                                                 className={`border-0 shadow-md transition-all ${item.value
//                                                     ? "bg-gradient-to-br from-green-50 to-emerald-50"
//                                                     : "bg-gradient-to-br from-slate-50 to-slate-100"
//                                                     }`}
//                                             >
//                                                 <CardContent className="p-4">
//                                                     <div className="flex items-center justify-between">
//                                                         <div className="flex items-center gap-3">
//                                                             <div className={`p-2 rounded-lg ${item.value ? "bg-green-100" : "bg-slate-200"
//                                                                 }`}>
//                                                                 <item.icon className={`h-4 w-4 ${item.value ? "text-green-600" : "text-slate-400"
//                                                                     }`} />
//                                                             </div>
//                                                             <div>
//                                                                 <p className="text-sm font-semibold text-slate-800">
//                                                                     {item.label}
//                                                                 </p>
//                                                                 <p className={`text-xs font-medium mt-1 ${item.value ? "text-green-600" : "text-slate-500"
//                                                                     }`}>
//                                                                     {item.value ? "Uploaded" : "Not Uploaded"}
//                                                                 </p>
//                                                             </div>
//                                                         </div>
//                                                         {item.value ? (
//                                                             <a
//                                                                 href={`${API_BASE_URL}${item.value}`}
//                                                                 target="_blank"
//                                                                 rel="noopener noreferrer"
//                                                                 onClick={(e) => e.stopPropagation()}
//                                                                 className="text-blue-600 hover:text-blue-800"
//                                                             >
//                                                                 <Eye className="h-5 w-5" />
//                                                             </a>
//                                                         ) : (
//                                                             <XCircle className="h-5 w-5 text-slate-400" />
//                                                         )}
//                                                     </div>
//                                                 </CardContent>
//                                             </Card>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Multiple File Documents Section */}
//                                 <div className="space-y-4">
//                                     <div className="flex items-center gap-3">
//                                         <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
//                                             <FileText className="h-5 w-5 text-white" />
//                                         </div>
//                                         <h3 className="text-xl font-bold text-slate-800">Additional Documents (Multiple Files)</h3>
//                                     </div>

//                                     <div className="grid grid-cols-1 gap-4">
//                                         {/* Background Verification */}
//                                         <Card className={`border-0 shadow-md ${selectedDoc.custom_background_verification
//                                             ? "bg-gradient-to-br from-purple-50 to-pink-50"
//                                             : "bg-gradient-to-br from-slate-50 to-slate-100"}`}>
//                                             <CardContent className="p-4">
//                                                 <div className="flex items-start justify-between">
//                                                     <div className="flex items-start gap-3 flex-1">
//                                                         <div className={`p-2 rounded-lg ${selectedDoc.custom_background_verification ? "bg-purple-100" : "bg-slate-200"}`}>
//                                                             <FileText className={`h-4 w-4 ${selectedDoc.custom_background_verification ? "text-purple-600" : "text-slate-400"}`} />
//                                                         </div>
//                                                         <div className="flex-1">
//                                                             <p className="text-sm font-semibold text-slate-800">Background Verification</p>
//                                                             <p className={`text-xs font-medium mt-1 ${selectedDoc.custom_background_verification ? "text-purple-600" : "text-slate-500"}`}>
//                                                                 {selectedDoc.custom_background_verification
//                                                                     ? `${countMultipleFiles(selectedDoc.custom_background_verification)} file(s) uploaded`
//                                                                     : "Not Uploaded"}
//                                                             </p>
//                                                             {selectedDoc.custom_background_verification && (
//                                                                 <div className="mt-3 space-y-2">
//                                                                     {parseMultipleFiles(selectedDoc.custom_background_verification).map((fileUrl, idx) => (
//                                                                         <a
//                                                                             key={idx}
//                                                                             href={`${API_BASE_URL}${fileUrl}`}
//                                                                             target="_blank"
//                                                                             rel="noopener noreferrer"
//                                                                             className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
//                                                                         >
//                                                                             <Eye className="h-3 w-3" />
//                                                                             View File {idx + 1}
//                                                                         </a>
//                                                                     ))}
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                     {selectedDoc.custom_background_verification ? (
//                                                         <CheckCircle2 className="h-5 w-5 text-purple-600" />
//                                                     ) : (
//                                                         <XCircle className="h-5 w-5 text-slate-400" />
//                                                     )}
//                                                 </div>
//                                             </CardContent>
//                                         </Card>

//                                         {/* Salary Slip */}
//                                         <Card className={`border-0 shadow-md ${selectedDoc.custom_salary_slip
//                                             ? "bg-gradient-to-br from-blue-50 to-cyan-50"
//                                             : "bg-gradient-to-br from-slate-50 to-slate-100"}`}>
//                                             <CardContent className="p-4">
//                                                 <div className="flex items-start justify-between">
//                                                     <div className="flex items-start gap-3 flex-1">
//                                                         <div className={`p-2 rounded-lg ${selectedDoc.custom_salary_slip ? "bg-blue-100" : "bg-slate-200"}`}>
//                                                             <FileText className={`h-4 w-4 ${selectedDoc.custom_salary_slip ? "text-blue-600" : "text-slate-400"}`} />
//                                                         </div>
//                                                         <div className="flex-1">
//                                                             <p className="text-sm font-semibold text-slate-800">Salary Slip</p>
//                                                             <p className={`text-xs font-medium mt-1 ${selectedDoc.custom_salary_slip ? "text-blue-600" : "text-slate-500"}`}>
//                                                                 {selectedDoc.custom_salary_slip
//                                                                     ? `${countMultipleFiles(selectedDoc.custom_salary_slip)} file(s) uploaded`
//                                                                     : "Not Uploaded"}
//                                                             </p>
//                                                             {selectedDoc.custom_salary_slip && (
//                                                                 <div className="mt-3 space-y-2">
//                                                                     {parseMultipleFiles(selectedDoc.custom_salary_slip).map((fileUrl, idx) => (
//                                                                         <a
//                                                                             key={idx}
//                                                                             href={`${API_BASE_URL}${fileUrl}`}
//                                                                             target="_blank"
//                                                                             rel="noopener noreferrer"
//                                                                             className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
//                                                                         >
//                                                                             <Eye className="h-3 w-3" />
//                                                                             View File {idx + 1}
//                                                                         </a>
//                                                                     ))}
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                     {selectedDoc.custom_salary_slip ? (
//                                                         <CheckCircle2 className="h-5 w-5 text-blue-600" />
//                                                     ) : (
//                                                         <XCircle className="h-5 w-5 text-slate-400" />
//                                                     )}
//                                                 </div>
//                                             </CardContent>
//                                         </Card>

//                                         {/* Additional Document */}
//                                         <Card className={`border-0 shadow-md ${selectedDoc.custom_additional_document
//                                             ? "bg-gradient-to-br from-green-50 to-teal-50"
//                                             : "bg-gradient-to-br from-slate-50 to-slate-100"}`}>
//                                             <CardContent className="p-4">
//                                                 <div className="flex items-start justify-between">
//                                                     <div className="flex items-start gap-3 flex-1">
//                                                         <div className={`p-2 rounded-lg ${selectedDoc.custom_additional_document ? "bg-green-100" : "bg-slate-200"}`}>
//                                                             <FileText className={`h-4 w-4 ${selectedDoc.custom_additional_document ? "text-green-600" : "text-slate-400"}`} />
//                                                         </div>
//                                                         <div className="flex-1">
//                                                             <p className="text-sm font-semibold text-slate-800">Additional Document</p>
//                                                             <p className={`text-xs font-medium mt-1 ${selectedDoc.custom_additional_document ? "text-green-600" : "text-slate-500"}`}>
//                                                                 {selectedDoc.custom_additional_document
//                                                                     ? `${countMultipleFiles(selectedDoc.custom_additional_document)} file(s) uploaded`
//                                                                     : "Not Uploaded"}
//                                                             </p>
//                                                             {selectedDoc.custom_additional_document && (
//                                                                 <div className="mt-3 space-y-2">
//                                                                     {parseMultipleFiles(selectedDoc.custom_additional_document).map((fileUrl, idx) => (
//                                                                         <a
//                                                                             key={idx}
//                                                                             href={`${API_BASE_URL}${fileUrl}`}
//                                                                             target="_blank"
//                                                                             rel="noopener noreferrer"
//                                                                             className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
//                                                                         >
//                                                                             <Eye className="h-3 w-3" />
//                                                                             View File {idx + 1}
//                                                                         </a>
//                                                                     ))}
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                     {selectedDoc.custom_additional_document ? (
//                                                         <CheckCircle2 className="h-5 w-5 text-green-600" />
//                                                     ) : (
//                                                         <XCircle className="h-5 w-5 text-slate-400" />
//                                                     )}
//                                                 </div>
//                                             </CardContent>
//                                         </Card>
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </>
//                     )}
//                 </Card>
//             </div>
//         </div>
//     )
// }



"use client"
import { useState, useEffect } from "react"
import {
    Plus, Search, FileText, User, Calendar, Eye, Trash2,
    Mail, Briefcase, CheckCircle2, XCircle, ArrowLeft,
    ChevronLeft, ChevronRight, Upload, Users, MessageSquare,
    Zap, UserCheck, LogOut, Home, Menu, X,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { API_BASE_URL } from '@/lib/api-config'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dvl {
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

  .dvl-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  /* ══ SIDEBAR ══ */
  .dvl-sb {
    width: var(--sb-w); background: var(--sb); min-height: 100vh;
    position: fixed; top: 0; left: 0; z-index: 100; display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .dvl-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }
  .dvl-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }
  .dvl-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(0,158,247,.15); border: 1px solid rgba(0,158,247,.25);
    display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
  }
  .dvl-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .dvl-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; line-height: 1.25; }
  .dvl-sb-sub { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
  .dvl-sb-close {
    margin-left: auto; flex-shrink: 0; width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer; color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center; transition: all .14s;
  }
  .dvl-sb-close:hover { background: var(--sb-hover); color: #fff; }
  .dvl-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .dvl-nav::-webkit-scrollbar { width: 3px; }
  .dvl-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }
  .dvl-nav-cta {
    display: flex; align-items: center; gap: 9px; padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md); border: 1px solid rgba(0,158,247,.28);
    color: var(--accent); font-size: 13px; font-weight: 600; text-decoration: none;
    transition: background .15s; margin-bottom: 22px; letter-spacing: -0.1px;
  }
  .dvl-nav-cta:hover { background: rgba(0,158,247,.24); }
  .dvl-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
  }
  .dvl-nav-link {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt); text-decoration: none; transition: all .14s;
  }
  .dvl-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; transition: opacity .14s; }
  .dvl-nav-link:hover { background: var(--sb-hover); color: #fff; }
  .dvl-nav-link:hover svg { opacity: 1; }
  .dvl-nav-link.active { background: var(--accent-md); color: var(--accent); border: 1px solid rgba(0,158,247,.2); }
  .dvl-nav-link.active svg { opacity: 1; }
  .dvl-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .dvl-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; border-radius: 8px; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--sb-lbl); text-align: left; transition: all .14s;
  }
  .dvl-logout svg { opacity: .6; width: 15px; height: 15px; }
  .dvl-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }
  .dvl-overlay {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
  }
  @media (max-width: 768px) { .dvl-overlay.show { display: block; } }

  /* ══ MAIN ══ */
  .dvl-main {
    margin-left: var(--sb-w); flex: 1; display: flex; flex-direction: column;
    min-height: 100vh; transition: margin-left .25s cubic-bezier(.4,0,.2,1);
  }
  .dvl-main.sb-closed { margin-left: 0; }
  .dvl-header {
    height: 60px; background: #fff; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 0 rgba(0,158,247,.08);
  }
  .dvl-btn-back {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    background: transparent; color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer; text-decoration: none;
    transition: all .14s; white-space: nowrap;
  }
  .dvl-btn-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); } 
  .dvl-toggle {
    width: 34px; height: 34px; border-radius: 8px; background: none;
    border: 1px solid var(--border); cursor: pointer; display: flex;
    align-items: center; justify-content: center; color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .dvl-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .dvl-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .dvl-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
  .dvl-crumb svg { width: 13px; height: 13px; color: var(--t3); }
  .dvl-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }
  .dvl-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
  .dvl-btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: 8px;
    background: var(--accent); color: #fff; font-family: 'Inter', sans-serif; font-size: 13px;
    font-weight: 600; border: none; cursor: pointer; text-decoration: none; transition: background .15s;
  }
  .dvl-btn:hover { background: var(--accent-h); }
  .dvl-btn svg { width: 14px; height: 14px; }

  /* ══ PAGE ══ */
  .dvl-page-outer { flex: 1; display: flex; justify-content: center; padding: 28px 32px; }
  .dvl-page { width: 100%; max-width: 1200px; display: flex; flex-direction: column; gap: 22px; }

  .dvl-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
  .dvl-page-title { font-size: 21px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; line-height: 1.15; }
  .dvl-page-sub { font-size: 13px; color: var(--t3); margin-top: 5px; }

  /* ══ STAT GRID ══ */
  .dvl-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .dvl-stat {
    border-radius: 12px; padding: 20px 22px; overflow: hidden; position: relative;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0,0,0,.1);
  }
  .dvl-stat::before {
    content: ''; position: absolute; top: -16px; right: -16px;
    width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,.12);
  }
  .dvl-stat-label { font-size: 12px; font-weight: 500; color: rgba(255,255,255,.8); margin-bottom: 6px; }
  .dvl-stat-val { font-size: 32px; font-weight: 800; color: #fff; line-height: 1; }
  .dvl-stat-icon {
    width: 52px; height: 52px; border-radius: 14px; background: rgba(255,255,255,.18);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    backdrop-filter: blur(4px);
  }
  .dvl-stat-icon svg { width: 24px; height: 24px; color: #fff; }
  .dvl-stat.blue { background: linear-gradient(135deg, #009ef7, #0072c6); }
  .dvl-stat.indigo { background: linear-gradient(135deg, #6366f1, #4338ca); }
  .dvl-stat.purple { background: linear-gradient(135deg, #a855f7, #7e22ce); }

  /* ══ SEARCH ══ */
  .dvl-search-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
    padding: 16px 20px; box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .dvl-search-wrap { position: relative; }
  .dvl-search-wrap > svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--t3); pointer-events: none; }
  .dvl-search {
    width: 100%; height: 44px; padding: 0 40px 0 44px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--bg); color: var(--t1);
    font-family: 'Inter', sans-serif; font-size: 13.5px; outline: none; transition: all .15s;
  }
  .dvl-search:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-lt); }
  .dvl-search::placeholder { color: var(--t3); }
  .dvl-search-clear {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: var(--t3); font-size: 14px; padding: 4px; transition: color .14s;
  }
  .dvl-search-clear:hover { color: var(--t1); }

  /* ══ MAIN CARD ══ */
  .dvl-sec-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
    overflow: hidden; box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .dvl-sec-head {
    padding: 16px 22px; border-bottom: 1px solid var(--border-s);
    background: linear-gradient(to right, #f8fbff, #eef7ff);
    display: flex; align-items: center; justify-content: space-between;
  }
  .dvl-sec-head-left { display: flex; align-items: center; gap: 10px; }
  .dvl-sec-head-icon {
    width: 34px; height: 34px; border-radius: 9px;
    background: linear-gradient(135deg, var(--accent), #3b82f6);
    display: flex; align-items: center; justify-content: center;
  }
  .dvl-sec-head-icon svg { color: #fff; width: 16px; height: 16px; }
  .dvl-sec-title { font-size: 14px; font-weight: 700; color: var(--t1); letter-spacing: -0.2px; }
  .dvl-sec-body { padding: 22px; }

  /* ══ DOC CARDS GRID ══ */
  .dvl-cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

  .dvl-doc-card {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 12px;
    padding: 18px; cursor: pointer; transition: all .2s; position: relative; overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,158,247,.05);
  }
  .dvl-doc-card::before {
    content: ''; position: absolute; top: -20px; right: -20px; width: 80px; height: 80px;
    border-radius: 50%; background: radial-gradient(circle, rgba(0,158,247,.08) 0%, transparent 70%);
    transition: transform .3s;
  }
  .dvl-doc-card:hover::before { transform: scale(2.2); }
  .dvl-doc-card:hover { box-shadow: 0 8px 24px rgba(0,158,247,.14); transform: translateY(-2px); border-color: rgba(0,158,247,.35); }

  .dvl-doc-top { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
  .dvl-doc-avatar {
    width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #009ef7, #3b5bdb);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 16px; font-weight: 700;
    box-shadow: 0 2px 6px rgba(0,158,247,.3);
  }
  .dvl-doc-name { font-size: 14px; font-weight: 700; color: var(--t1); line-height: 1.3; letter-spacing: -0.1px; }
  .dvl-doc-id { font-size: 10.5px; color: var(--t3); margin-top: 2px; }

  /* progress */
  .dvl-prog { margin-bottom: 14px; }
  .dvl-prog-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
  .dvl-prog-label { font-size: 12px; font-weight: 500; color: var(--t2); }
  .dvl-prog-pct { font-size: 12px; font-weight: 700; color: var(--t1); }
  .dvl-prog-bar-wrap { height: 6px; border-radius: 3px; background: var(--border-s); overflow: hidden; margin-bottom: 4px; }
  .dvl-prog-bar { height: 100%; border-radius: 3px; background: linear-gradient(to right, var(--accent), #3b82f6); transition: width .4s; }
  .dvl-prog-sub { font-size: 10.5px; color: var(--t3); }

  .dvl-divider { height: 1px; background: var(--border-s); margin: 12px 0; }

  .dvl-doc-rows { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; }
  .dvl-doc-row { display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-radius: 7px; transition: background .14s; }
  .dvl-doc-row:hover { background: var(--bg); }
  .dvl-row-icon { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .dvl-row-icon.blue { background: var(--accent-lt); }
  .dvl-row-icon.blue svg { color: var(--accent); }
  .dvl-row-icon.indigo { background: #ede9fe; }
  .dvl-row-icon.indigo svg { color: #6d28d9; }
  .dvl-row-icon svg { width: 13px; height: 13px; }
  .dvl-row-lbl { font-size: 10px; color: var(--t3); }
  .dvl-row-val { font-size: 12.5px; font-weight: 500; color: var(--t1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dvl-row-body { flex: 1; min-width: 0; }

  .dvl-view-btn {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 9px; border-radius: 8px; background: linear-gradient(135deg, var(--accent), #3b5bdb);
    color: #fff; border: none; cursor: pointer; font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 600; transition: all .15s;
    box-shadow: 0 2px 6px rgba(0,158,247,.25);
  }
  .dvl-view-btn:hover { box-shadow: 0 4px 12px rgba(0,158,247,.4); transform: translateY(-1px); }
  .dvl-view-btn svg { width: 14px; height: 14px; }

  /* ══ EMPTY ══ */
  .dvl-empty { text-align: center; padding: 60px 20px; }
  .dvl-empty-icon {
    width: 72px; height: 72px; border-radius: 50%; background: var(--accent-lt);
    display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--accent);
  }
  .dvl-empty-title { font-size: 16px; font-weight: 700; color: var(--t1); margin-bottom: 6px; }
  .dvl-empty-sub { font-size: 13px; color: var(--t3); }

  /* ══ PAGINATION ══ */
  .dvl-pagination { display: flex; align-items: center; justify-content: space-between; padding-top: 18px; border-top: 1px solid var(--border-s); margin-top: 18px; }
  .dvl-pag-info { font-size: 12.5px; color: var(--t3); }
  .dvl-pag-btns { display: flex; align-items: center; gap: 10px; }
  .dvl-pag-btn {
    display: flex; align-items: center; gap: 4px; padding: 7px 14px; border-radius: 7px;
    border: 1px solid var(--border); background: var(--card); color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 500; cursor: pointer; transition: all .14s;
  }
  .dvl-pag-btn:hover:not(:disabled) { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .dvl-pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .dvl-pag-btn svg { width: 14px; height: 14px; }
  .dvl-pag-page { font-size: 12.5px; font-weight: 600; color: var(--t1); }

  /* ══ DETAIL VIEW ══ */
  .dvl-detail-back {
    display: flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--card); color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .14s;
  }
  .dvl-detail-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

  .dvl-detail-hero {
    background: linear-gradient(135deg, #0f3460, #16213e); border-radius: 14px;
    padding: 24px; display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 4px 16px rgba(15,52,96,.35);
  }
  .dvl-detail-hero-left { display: flex; align-items: center; gap: 16px; }
  .dvl-detail-hero-avatar {
    width: 60px; height: 60px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), #3b5bdb);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 22px; font-weight: 800;
    box-shadow: 0 3px 10px rgba(0,158,247,.4);
  }
  .dvl-detail-hero-name { font-size: 20px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
  .dvl-detail-hero-id { font-size: 12px; color: rgba(255,255,255,.5); margin-top: 3px; }
  .dvl-detail-hero-badge {
    background: rgba(0,158,247,.2); border: 1px solid rgba(0,158,247,.4);
    color: var(--accent); padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;
    white-space: nowrap;
  }

  .dvl-info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .dvl-info-item {
    background: var(--card); border: 1px solid var(--border-s); border-radius: 10px; padding: 14px 16px;
    display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 3px rgba(0,158,247,.04);
  }
  .dvl-info-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .dvl-info-icon.blue { background: var(--accent-lt); }
  .dvl-info-icon.blue svg { color: var(--accent); }
  .dvl-info-icon.indigo { background: #ede9fe; }
  .dvl-info-icon.indigo svg { color: #6d28d9; }
  .dvl-info-icon svg { width: 16px; height: 16px; }
  .dvl-info-lbl { font-size: 10.5px; font-weight: 600; color: var(--t3); margin-bottom: 3px; }
  .dvl-info-val { font-size: 13px; font-weight: 600; color: var(--t1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .dvl-sub-head {
    display: flex; align-items: center; gap: 10px; padding-bottom: 12px;
    border-bottom: 1px solid var(--border-s);
  }
  .dvl-sub-head-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .dvl-sub-head-icon.blue { background: linear-gradient(135deg, var(--accent), #3b82f6); }
  .dvl-sub-head-icon.purple { background: linear-gradient(135deg, #a855f7, #7e22ce); }
  .dvl-sub-head-icon svg { color: #fff; width: 15px; height: 15px; }
  .dvl-sub-title { font-size: 15px; font-weight: 700; color: var(--t1); letter-spacing: -0.2px; }

  .dvl-doc-status-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .dvl-doc-status-item {
    border-radius: 10px; padding: 14px; display: flex; align-items: center; justify-content: space-between;
    border: 1px solid transparent; transition: all .15s;
  }
  .dvl-doc-status-item.uploaded { background: linear-gradient(to right, var(--green-lt), #d1fae5); border-color: #bbf7d0; }
  .dvl-doc-status-item.missing { background: #f8fafc; border-color: var(--border-s); }
  .dvl-doc-status-left { display: flex; align-items: center; gap: 10px; }
  .dvl-doc-status-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .dvl-doc-status-icon.green { background: #bbf7d0; }
  .dvl-doc-status-icon.green svg { color: var(--green); }
  .dvl-doc-status-icon.grey { background: #e2e8f0; }
  .dvl-doc-status-icon.grey svg { color: #94a3b8; }
  .dvl-doc-status-icon svg { width: 14px; height: 14px; }
  .dvl-doc-status-name { font-size: 13px; font-weight: 600; color: var(--t1); }
  .dvl-doc-status-sub { font-size: 11px; font-weight: 500; margin-top: 2px; }
  .dvl-doc-status-sub.uploaded { color: var(--green); }
  .dvl-doc-status-sub.missing { color: #94a3b8; }
  .dvl-doc-eye { color: var(--accent); transition: color .14s; }
  .dvl-doc-eye:hover { color: var(--accent-h); }

  .dvl-multi-item {
    border-radius: 10px; padding: 16px; border: 1px solid transparent;
  }
  .dvl-multi-item.uploaded { background: linear-gradient(to right, #f5f3ff, #fdf4ff); border-color: #e9d5ff; }
  .dvl-multi-item.uploaded.blue { background: linear-gradient(to right, var(--accent-lt), #eff6ff); border-color: var(--border); }
  .dvl-multi-item.uploaded.green { background: linear-gradient(to right, var(--green-lt), #ecfdf5); border-color: #bbf7d0; }
  .dvl-multi-item.missing { background: #f8fafc; border-color: var(--border-s); }
  .dvl-multi-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
  .dvl-multi-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .dvl-multi-icon.purple { background: #ede9fe; }
  .dvl-multi-icon.purple svg { color: #7c3aed; }
  .dvl-multi-icon.blue { background: var(--accent-lt); }
  .dvl-multi-icon.blue svg { color: var(--accent); }
  .dvl-multi-icon.green { background: var(--green-lt); }
  .dvl-multi-icon.green svg { color: var(--green); }
  .dvl-multi-icon.grey { background: #e2e8f0; }
  .dvl-multi-icon.grey svg { color: #94a3b8; }
  .dvl-multi-icon svg { width: 14px; height: 14px; }
  .dvl-multi-name { font-size: 13px; font-weight: 600; color: var(--t1); }
  .dvl-multi-count { font-size: 11.5px; font-weight: 500; margin-top: 2px; }
  .dvl-multi-count.uploaded { color: #7c3aed; }
  .dvl-multi-count.blue { color: var(--accent); }
  .dvl-multi-count.green { color: var(--green); }
  .dvl-multi-count.missing { color: #94a3b8; }
  .dvl-file-links { margin-top: 10px; display: flex; flex-direction: column; gap: 5px; }
  .dvl-file-link {
    display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 500;
    color: var(--accent); text-decoration: none; transition: color .14s;
  }
  .dvl-file-link:hover { color: var(--accent-h); text-decoration: underline; }
  .dvl-file-link svg { width: 12px; height: 12px; }

  /* loading */
  .dvl-loading {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 100vh; background: var(--bg); gap: 14px;
  }
  .dvl-spinner {
    width: 44px; height: 44px; border: 4px solid var(--accent-lt); border-top-color: var(--accent);
    border-radius: 50%; animation: dvl-spin 1s linear infinite;
  }
  @keyframes dvl-spin { to { transform: rotate(360deg); } }
  .dvl-loading-txt { font-size: 14px; font-weight: 500; color: var(--t2); }

  @media (max-width: 1024px) { .dvl-cards-grid { grid-template-columns: repeat(2, 1fr); } .dvl-stats { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 768px) {
    .dvl-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .dvl-sb.open { transform: translateX(0); }
    .dvl-main { margin-left: 0 !important; }
    .dvl-page-outer { padding: 16px; }
    .dvl-header { padding: 0 16px; }
    .dvl-cards-grid { grid-template-columns: 1fr; }
    .dvl-stats { grid-template-columns: 1fr; }
    .dvl-doc-status-grid { grid-template-columns: 1fr; }
    .dvl-info-grid { grid-template-columns: 1fr; }
  }
`

interface ApplicantDocument {
    name: string; applicant_name: string; employee: string;
    creation: string; modified: string;
    aadhar_card: string; passport: string; experience: string; education: string;
    bank_details: string; pan: string; medical: string; photos: string;
    custom_background_verification: string; custom_salary_slip: string; custom_additional_document: string;
    applicant_details?: { applicant_name: string; email_id: string }
    employee_details?: { employee_name: string; personal_email: string }
}

export default function DocumentVerifyListPage() {
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [documents, setDocuments] = useState<ApplicantDocument[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedDoc, setSelectedDoc] = useState<ApplicantDocument | null>(null)
    const ITEMS_PER_PAGE = 10
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => { fetchDocuments() }, [])
    useEffect(() => { setCurrentPage(1) }, [searchQuery])
    useEffect(() => { document.title = 'Document Verification List' }, [])

    const fetchDocuments = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/resource/Applicant Document?fields=["*"]&limit_page_length=0&order_by=creation desc`,
                { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
            )
            const data = await response.json()
            if (data && data.data) {
                const documentsWithDetails = await Promise.all(
                    data.data.map(async (doc: ApplicantDocument) => {
                        if (doc.applicant_name) {
                            try {
                                const applicantResponse = await fetch(
                                    `${API_BASE_URL}/api/resource/Job Applicant/${doc.applicant_name}`,
                                    { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
                                )
                                const applicantData = await applicantResponse.json()
                                doc.applicant_details = applicantData.data
                            } catch (error) { console.error("Error fetching applicant details:", error) }
                        }
                        if (doc.employee) {
                            try {
                                const employeeResponse = await fetch(
                                    `${API_BASE_URL}/api/resource/Employee/${doc.employee}`,
                                    { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
                                )
                                const employeeData = await employeeResponse.json()
                                doc.employee_details = employeeData.data
                            } catch (error) { console.error("Error fetching employee details:", error) }
                        }
                        return doc
                    })
                )
                setDocuments(documentsWithDetails)
            }
        } catch (error) { console.error("Error fetching documents:", error) }
        finally { setLoading(false) }
    }

    const handleDelete = async (name: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/resource/Applicant Document/${name}`,
                { method: "DELETE", credentials: 'include', headers: { 'Content-Type': 'application/json' } }
            )
            if (response.ok) { alert("Document deleted successfully!"); fetchDocuments() }
            else alert("Failed to delete document")
        } catch (error) { console.error("Error deleting document:", error); alert("Failed to delete document") }
    }

    const filteredDocuments = documents.filter((doc) => {
        const searchLower = searchQuery.toLowerCase()
        return (
            doc.name.toLowerCase().includes(searchLower) ||
            doc.applicant_details?.applicant_name?.toLowerCase().includes(searchLower) ||
            doc.employee_details?.employee_name?.toLowerCase().includes(searchLower)
        )
    })

    const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
    }

    const countMultipleFiles = (jsonString: string | null | undefined): number => {
        if (!jsonString) return 0
        try { const parsed = JSON.parse(jsonString); return Array.isArray(parsed) ? parsed.length : 1 }
        catch { return jsonString ? 1 : 0 }
    }

    const countDocuments = (doc: ApplicantDocument) => {
        let count = 0
        if (doc.aadhar_card) count++; if (doc.passport) count++; if (doc.experience) count++
        if (doc.education) count++; if (doc.bank_details) count++; if (doc.pan) count++
        if (doc.medical) count++; if (doc.photos) count++
        if (doc.custom_background_verification) count++; if (doc.custom_salary_slip) count++
        if (doc.custom_additional_document) count++
        return count
    }

    const getCompletionPercentage = (doc: ApplicantDocument) => {
        const total = 11; const completed = countDocuments(doc)
        return Math.round((completed / total) * 100)
    }

    const parseMultipleFiles = (jsonString: string | null | undefined): string[] => {
        if (!jsonString) return []
        try { const parsed = JSON.parse(jsonString); return Array.isArray(parsed) ? parsed : [jsonString] }
        catch { return jsonString ? [jsonString] : [] }
    }

    const thisMonth = documents.filter(d => {
        const docDate = new Date(d.creation); const now = new Date()
        return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear()
    }).length

    if (loading) {
        return (
            <>
                <style>{css}</style>
                <div className="dvl">
                    <div className="dvl-loading">
                        <div className="dvl-spinner" />
                        <p className="dvl-loading-txt">Loading documents...</p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <style>{css}</style>
            <div className="dvl">
                <div className="dvl-wrap">

                    <div className={`dvl-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

                    {/* SIDEBAR */}
                    <aside className={`dvl-sb${sidebarOpen ? "" : " collapsed"}`}>
                        <div className="dvl-sb-brand">
                            <div className="dvl-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
                            <div><div className="dvl-sb-name">Job Management</div><div className="dvl-sb-sub">HR Platform</div></div>
                            <button className="dvl-sb-close" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
                        </div>
                        <nav className="dvl-nav">
                            <Link href="/create-job" className="dvl-nav-cta"><Plus size={14} /> New Job Opening</Link>
                            <div className="dvl-nav-lbl">Pipeline</div>
                            <Link href="/job-opening" className="dvl-nav-link"><Briefcase size={15} /> Job Opening</Link>
                            <Link href="/upload-resumes" className="dvl-nav-link"><Upload size={15} /> Resume Collection</Link>
                            <Link href="/candidates" className="dvl-nav-link"><Users size={15} /> Candidates</Link>
                            <Link href="/interview" className="dvl-nav-link"><Calendar size={15} /> Interview Scheduling</Link>
                            <div className="dvl-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
                            <Link href="/feedback" className="dvl-nav-link"><MessageSquare size={15} /> Feedback</Link>
                            <Link href="/document-verify-list" className="dvl-nav-link active"><FileText size={15} /> Document Verification</Link>
                            <Link href="/offer-list" className="dvl-nav-link"><Zap size={15} /> Offer Letter</Link>
                            <Link href="/letter-appointment" className="dvl-nav-link"><UserCheck size={15} /> Appointment Letter</Link>
                        </nav>
                        <div className="dvl-sb-foot">
                            <button className="dvl-logout"><LogOut size={15} /> Sign out</button>
                        </div>
                    </aside>

                    {/* MAIN */}
                    <div className={`dvl-main${sidebarOpen ? "" : " sb-closed"}`}>
                        <header className="dvl-header">
                            <button className="dvl-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
                            <div className="dvl-hdr-sep" />
                            <Link href="/home" className="dvl-btn-back">
                                <ArrowLeft size={13} /> Back
                            </Link>
                            <div className="dvl-hdr-sep" />
                            <div className="dvl-crumb">
                                <Home size={13} /> Home <ChevronRight size={13} /> <strong>Document Verification</strong>
                            </div>
                            <div className="dvl-hdr-right">
                                <button className="dvl-btn" onClick={() => router.push('/salary-annexure')}>
                                    <Plus size={14} /> Create salary Annexure
                                </button>
                            </div>
                        </header>

                        <div className="dvl-page-outer">
                            <div className="dvl-page">

                                {/* Toolbar */}
                                <div className="dvl-toolbar">
                                    <div>
                                        <h1 className="dvl-page-title">Document Verification</h1>
                                        <p className="dvl-page-sub">Manage and verify applicant documentation</p>
                                    </div>
                                    {selectedDoc && (
                                        <button className="dvl-detail-back" onClick={() => setSelectedDoc(null)}>
                                            <ArrowLeft size={14} /> Back to List
                                        </button>
                                    )}
                                </div>

                                {/* Stats */}
                                {!selectedDoc && (
                                    <div className="dvl-stats">
                                        <div className="dvl-stat blue">
                                            <div>
                                                <div className="dvl-stat-label">Total Documents</div>
                                                <div className="dvl-stat-val">{documents.length}</div>
                                            </div>
                                            <div className="dvl-stat-icon"><FileText size={24} /></div>
                                        </div>
                                        <div className="dvl-stat indigo">
                                            <div>
                                                <div className="dvl-stat-label">Applicants</div>
                                                <div className="dvl-stat-val">{new Set(documents.map(d => d.applicant_name)).size}</div>
                                            </div>
                                            <div className="dvl-stat-icon"><User size={24} /></div>
                                        </div>
                                        <div className="dvl-stat purple">
                                            <div>
                                                <div className="dvl-stat-label">This Month</div>
                                                <div className="dvl-stat-val">{thisMonth}</div>
                                            </div>
                                            <div className="dvl-stat-icon"><Calendar size={24} /></div>
                                        </div>
                                    </div>
                                )}

                                {/* Search (list view only) */}
                                {!selectedDoc && (
                                    <div className="dvl-search-card">
                                        <div className="dvl-search-wrap">
                                            <Search size={16} />
                                            <input type="text" className="dvl-search"
                                                placeholder="Search by applicant name, document ID, or employee..."
                                                value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                                            {searchQuery && <button className="dvl-search-clear" onClick={() => setSearchQuery("")}>✕</button>}
                                        </div>
                                    </div>
                                )}

                                {/* Main card */}
                                <div className="dvl-sec-card">
                                    {!selectedDoc ? (
                                        <>
                                            <div className="dvl-sec-head">
                                                <div className="dvl-sec-head-left">
                                                    <div className="dvl-sec-head-icon"><FileText size={16} /></div>
                                                    <span className="dvl-sec-title">All Documents</span>
                                                </div>
                                            </div>
                                            <div className="dvl-sec-body">
                                                {filteredDocuments.length === 0 ? (
                                                    <div className="dvl-empty">
                                                        <div className="dvl-empty-icon"><FileText size={30} /></div>
                                                        <p className="dvl-empty-title">No Documents Found</p>
                                                        <p className="dvl-empty-sub">No applicant documents available yet.</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="dvl-cards-grid">
                                                            {paginatedDocuments.map(doc => {
                                                                const pct = getCompletionPercentage(doc)
                                                                return (
                                                                    <div key={doc.name} className="dvl-doc-card" onClick={() => setSelectedDoc(doc)}>
                                                                        <div className="dvl-doc-top">
                                                                            <div className="dvl-doc-avatar">
                                                                                {(doc.applicant_details?.applicant_name || doc.applicant_name || "?").charAt(0).toUpperCase()}
                                                                            </div>
                                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                                <div className="dvl-doc-name">
                                                                                    {doc.applicant_details?.applicant_name || doc.applicant_name}
                                                                                </div>
                                                                                <div className="dvl-doc-id">{doc.name}</div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="dvl-prog">
                                                                            <div className="dvl-prog-top">
                                                                                <span className="dvl-prog-label">Completion</span>
                                                                                <span className="dvl-prog-pct">{pct}%</span>
                                                                            </div>
                                                                            <div className="dvl-prog-bar-wrap">
                                                                                <div className="dvl-prog-bar" style={{ width: `${pct}%` }} />
                                                                            </div>
                                                                            <div className="dvl-prog-sub">{countDocuments(doc)} of 11 documents uploaded</div>
                                                                        </div>

                                                                        <div className="dvl-divider" />

                                                                        <div className="dvl-doc-rows">
                                                                            <div className="dvl-doc-row">
                                                                                <div className="dvl-row-icon blue"><Mail size={13} /></div>
                                                                                <div className="dvl-row-body">
                                                                                    <div className="dvl-row-lbl">Email</div>
                                                                                    <div className="dvl-row-val">{doc.applicant_details?.email_id || "N/A"}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="dvl-doc-row">
                                                                                <div className="dvl-row-icon indigo"><Briefcase size={13} /></div>
                                                                                <div className="dvl-row-body">
                                                                                    <div className="dvl-row-lbl">Employee</div>
                                                                                    <div className="dvl-row-val">{doc.employee_details?.employee_name || "Not Assigned"}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="dvl-doc-row">
                                                                                <div className="dvl-row-icon blue"><Calendar size={13} /></div>
                                                                                <div className="dvl-row-body">
                                                                                    <div className="dvl-row-lbl">Last Modified</div>
                                                                                    <div className="dvl-row-val">{formatDate(doc.modified)}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <button className="dvl-view-btn" onClick={e => { e.stopPropagation(); setSelectedDoc(doc) }}>
                                                                            <Eye size={14} /> View Details
                                                                        </button>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>

                                                        {filteredDocuments.length > ITEMS_PER_PAGE && (
                                                            <div className="dvl-pagination">
                                                                <span className="dvl-pag-info">
                                                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredDocuments.length)} of {filteredDocuments.length} documents
                                                                </span>
                                                                <div className="dvl-pag-btns">
                                                                    <button className="dvl-pag-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                                                        <ChevronLeft size={14} /> Previous
                                                                    </button>
                                                                    <span className="dvl-pag-page">Page {currentPage} of {totalPages}</span>
                                                                    <button className="dvl-pag-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                                                                        Next <ChevronRight size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        /* DETAIL VIEW */
                                        <div className="dvl-sec-body" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

                                            {/* Hero */}
                                            <div className="dvl-detail-hero">
                                                <div className="dvl-detail-hero-left">
                                                    <div className="dvl-detail-hero-avatar">
                                                        {(selectedDoc.applicant_details?.applicant_name || selectedDoc.applicant_name || "?").charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="dvl-detail-hero-name">
                                                            {selectedDoc.applicant_details?.applicant_name || selectedDoc.applicant_name}
                                                        </div>
                                                        <div className="dvl-detail-hero-id">ID: {selectedDoc.name}</div>
                                                    </div>
                                                </div>
                                                <div className="dvl-detail-hero-badge">{countDocuments(selectedDoc)} / 11 Documents</div>
                                            </div>

                                            {/* Info Grid */}
                                            <div className="dvl-info-grid">
                                                <div className="dvl-info-item">
                                                    <div className="dvl-info-icon blue"><Mail size={16} /></div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div className="dvl-info-lbl">Email Address</div>
                                                        <div className="dvl-info-val">{selectedDoc.applicant_details?.email_id || "—"}</div>
                                                    </div>
                                                </div>
                                                <div className="dvl-info-item">
                                                    <div className="dvl-info-icon indigo"><Briefcase size={16} /></div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div className="dvl-info-lbl">Employee</div>
                                                        <div className="dvl-info-val">{selectedDoc.employee_details?.employee_name || "Not Assigned"}</div>
                                                    </div>
                                                </div>
                                                <div className="dvl-info-item">
                                                    <div className="dvl-info-icon blue"><Calendar size={16} /></div>
                                                    <div>
                                                        <div className="dvl-info-lbl">Created Date</div>
                                                        <div className="dvl-info-val">{formatDate(selectedDoc.creation)}</div>
                                                    </div>
                                                </div>
                                                <div className="dvl-info-item">
                                                    <div className="dvl-info-icon indigo"><Calendar size={16} /></div>
                                                    <div>
                                                        <div className="dvl-info-lbl">Modified Date</div>
                                                        <div className="dvl-info-val">{formatDate(selectedDoc.modified)}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Document Status */}
                                            <div>
                                                <div className="dvl-sub-head">
                                                    <div className="dvl-sub-head-icon blue"><FileText size={15} /></div>
                                                    <span className="dvl-sub-title">Document Status</span>
                                                </div>
                                                <div style={{ marginTop: 14 }}>
                                                    <div className="dvl-doc-status-grid">
                                                        {[
                                                            { label: "Aadhar Card", value: selectedDoc.aadhar_card },
                                                            { label: "PAN Card", value: selectedDoc.pan },
                                                            { label: "Passport", value: selectedDoc.passport },
                                                            { label: "Experience Letter", value: selectedDoc.experience },
                                                            { label: "Education Certificate", value: selectedDoc.education },
                                                            { label: "Bank Details", value: selectedDoc.bank_details },
                                                            { label: "Medical Certificate", value: selectedDoc.medical },
                                                            { label: "Photos", value: selectedDoc.photos },
                                                        ].map(item => (
                                                            <div key={item.label} className={`dvl-doc-status-item ${item.value ? "uploaded" : "missing"}`}>
                                                                <div className="dvl-doc-status-left">
                                                                    <div className={`dvl-doc-status-icon ${item.value ? "green" : "grey"}`}>
                                                                        <FileText size={14} />
                                                                    </div>
                                                                    <div>
                                                                        <div className="dvl-doc-status-name">{item.label}</div>
                                                                        <div className={`dvl-doc-status-sub ${item.value ? "uploaded" : "missing"}`}>
                                                                            {item.value ? "Uploaded" : "Not Uploaded"}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {item.value ? (
                                                                    <a href={`${API_BASE_URL}${item.value}`} target="_blank" rel="noopener noreferrer" className="dvl-doc-eye" onClick={e => e.stopPropagation()}>
                                                                        <Eye size={18} />
                                                                    </a>
                                                                ) : (
                                                                    <XCircle size={18} style={{ color: '#cbd5e1' }} />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Additional Documents */}
                                            <div>
                                                <div className="dvl-sub-head">
                                                    <div className="dvl-sub-head-icon purple"><FileText size={15} /></div>
                                                    <span className="dvl-sub-title">Additional Documents (Multiple Files)</span>
                                                </div>
                                                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                    {/* Background Verification */}
                                                    <div className={`dvl-multi-item ${selectedDoc.custom_background_verification ? "uploaded" : "missing"}`}>
                                                        <div className="dvl-multi-top">
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
                                                                <div className={`dvl-multi-icon ${selectedDoc.custom_background_verification ? "purple" : "grey"}`}>
                                                                    <FileText size={14} />
                                                                </div>
                                                                <div style={{ flex: 1 }}>
                                                                    <div className="dvl-multi-name">Background Verification</div>
                                                                    <div className={`dvl-multi-count ${selectedDoc.custom_background_verification ? "uploaded" : "missing"}`}>
                                                                        {selectedDoc.custom_background_verification
                                                                            ? `${countMultipleFiles(selectedDoc.custom_background_verification)} file(s) uploaded`
                                                                            : "Not Uploaded"}
                                                                    </div>
                                                                    {selectedDoc.custom_background_verification && (
                                                                        <div className="dvl-file-links">
                                                                            {parseMultipleFiles(selectedDoc.custom_background_verification).map((fileUrl, idx) => (
                                                                                <a key={idx} href={`${API_BASE_URL}${fileUrl}`} target="_blank" rel="noopener noreferrer" className="dvl-file-link">
                                                                                    <Eye size={12} /> View File {idx + 1}
                                                                                </a>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {selectedDoc.custom_background_verification
                                                                ? <CheckCircle2 size={18} style={{ color: '#7c3aed', flexShrink: 0 }} />
                                                                : <XCircle size={18} style={{ color: '#cbd5e1', flexShrink: 0 }} />}
                                                        </div>
                                                    </div>

                                                    {/* Salary Slip */}
                                                    <div className={`dvl-multi-item ${selectedDoc.custom_salary_slip ? "uploaded blue" : "missing"}`}>
                                                        <div className="dvl-multi-top">
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
                                                                <div className={`dvl-multi-icon ${selectedDoc.custom_salary_slip ? "blue" : "grey"}`}>
                                                                    <FileText size={14} />
                                                                </div>
                                                                <div style={{ flex: 1 }}>
                                                                    <div className="dvl-multi-name">Salary Slip</div>
                                                                    <div className={`dvl-multi-count ${selectedDoc.custom_salary_slip ? "blue" : "missing"}`}>
                                                                        {selectedDoc.custom_salary_slip
                                                                            ? `${countMultipleFiles(selectedDoc.custom_salary_slip)} file(s) uploaded`
                                                                            : "Not Uploaded"}
                                                                    </div>
                                                                    {selectedDoc.custom_salary_slip && (
                                                                        <div className="dvl-file-links">
                                                                            {parseMultipleFiles(selectedDoc.custom_salary_slip).map((fileUrl, idx) => (
                                                                                <a key={idx} href={`${API_BASE_URL}${fileUrl}`} target="_blank" rel="noopener noreferrer" className="dvl-file-link">
                                                                                    <Eye size={12} /> View File {idx + 1}
                                                                                </a>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {selectedDoc.custom_salary_slip
                                                                ? <CheckCircle2 size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                                                                : <XCircle size={18} style={{ color: '#cbd5e1', flexShrink: 0 }} />}
                                                        </div>
                                                    </div>

                                                    {/* Additional Document */}
                                                    <div className={`dvl-multi-item ${selectedDoc.custom_additional_document ? "uploaded green" : "missing"}`}>
                                                        <div className="dvl-multi-top">
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
                                                                <div className={`dvl-multi-icon ${selectedDoc.custom_additional_document ? "green" : "grey"}`}>
                                                                    <FileText size={14} />
                                                                </div>
                                                                <div style={{ flex: 1 }}>
                                                                    <div className="dvl-multi-name">Additional Document</div>
                                                                    <div className={`dvl-multi-count ${selectedDoc.custom_additional_document ? "green" : "missing"}`}>
                                                                        {selectedDoc.custom_additional_document
                                                                            ? `${countMultipleFiles(selectedDoc.custom_additional_document)} file(s) uploaded`
                                                                            : "Not Uploaded"}
                                                                    </div>
                                                                    {selectedDoc.custom_additional_document && (
                                                                        <div className="dvl-file-links">
                                                                            {parseMultipleFiles(selectedDoc.custom_additional_document).map((fileUrl, idx) => (
                                                                                <a key={idx} href={`${API_BASE_URL}${fileUrl}`} target="_blank" rel="noopener noreferrer" className="dvl-file-link">
                                                                                    <Eye size={12} /> View File {idx + 1}
                                                                                </a>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {selectedDoc.custom_additional_document
                                                                ? <CheckCircle2 size={18} style={{ color: 'var(--green)', flexShrink: 0 }} />
                                                                : <XCircle size={18} style={{ color: '#cbd5e1', flexShrink: 0 }} />}
                                                        </div>
                                                    </div>
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