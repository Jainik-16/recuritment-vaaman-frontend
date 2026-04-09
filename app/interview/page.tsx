// "use client"
// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Checkbox } from "@/components/ui/checkbox"
// import axios from "axios"
// import {
//   Calendar,
//   Clock,
//   Video,
//   MapPin,
//   Phone,
//   Mail,
//   ArrowLeft,
//   Plus,
//   Edit,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Users,
//   ChevronLeft,
//   ChevronRight,
//   Search,
// } from "lucide-react"
// import Link from "next/link"
// // import { API_AUTH } from "../create-job/page"
// import { axiosConfig } from '@/lib/axios-config'
// import { useRouter } from "next/navigation"
// import { API_BASE_URL } from '@/lib/api-config'


// interface Candidate {
//   id: string
//   applicant_name: string
//   email_id: string
//   phone_number: string
//   position: string
//   experience: string
//   skills: string[]
//   resumeScore: number
//   status: string
//   appliedDate: string
//   designation?: string
//   interviewStatus?: string
//   recruitment_stage?: string
//   totalRounds?: number
//   interviewDetails?: {
//     date: string
//     time: string
//     from_time?: string
//     to_time?: string
//     type: "in-person" | "video" | "phone"
//     location?: string
//     meeting_link?: string
//     interviewers: string[]
//     round: number
//     round_name?: string
//     notes?: string
//   }
// }

// interface InterviewSlot {
//   date: string
//   time: string
//   available: boolean
//   interviewer: string
// }

// export default function InterviewPage() {
//   const router = useRouter();
//   const [candidates, setCandidate] = useState<Candidate[]>([])
//   const [allInterviews, setAllInterviews] = useState<any[]>([])

//   const [isLoading, setIsLoading] = useState(false)
//   const [apiError, setApiError] = useState<string | null>(null)

//   const [filterStatus, setFilterStatus] = useState("all")
//   const [filterDesignation, setFilterDesignation] = useState("all")
//   const [searchTerm, setSearchTerm] = useState("")


//   // Pagination state
//   const ITEMS_PER_PAGE = 10
//   const [currentPage, setCurrentPage] = useState(1)


//   const fetchJobApplicant = async () => {
//     setIsLoading(true)
//     setApiError(null)
//     try {
//       const applicantsRes = await fetch(
//         `${API_BASE_URL}/api/resource/Job Applicant/?fields=["*"]&limit_page_length=0`,
//         {
//           method: 'GET',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//           }
//         }
//       );

//       const interviewsRes = await fetch(
//         `${API_BASE_URL}/api/resource/Interview/?fields=["*"]&limit_page_length=0`,
//         {
//           method: 'GET',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//           }
//         }
//       );

//       if (!applicantsRes.ok) {
//         throw new Error(`HTTP error! status: ${applicantsRes.status}`)
//       }

//       if (!interviewsRes.ok) {
//         throw new Error(`HTTP error! status: ${interviewsRes.status}`)
//       }

//       const applicantsData = await applicantsRes.json();
//       const interviewsData = await interviewsRes.json();

//       console.log("API Response:", applicantsData);
//       console.log("Interviews Data:", interviewsData);

//       if (applicantsData && applicantsData.data) {
//         const applicants = applicantsData.data;
//         const interviewsRaw = interviewsData.data || [];
//         console.log("Raw Interviews data:", interviewsRaw);

//         // Fetch interviewers for each interview
//         const interviews = await Promise.all(
//           interviewsRaw.map(async (interview: any) => {
//             try {
//               const detailsRes = await fetch(
//                 `${API_BASE_URL}/api/resource/Interview Detail?filters=[["parent","=","${interview.name}"]]&fields=["interviewer"]`,
//                 {
//                   method: 'GET',
//                   credentials: 'include',
//                   headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                   }
//                 }
//               );

//               const detailsData = await detailsRes.json();
//               console.log(`Raw Interview Detail response for ${interview.name}:`, detailsData);
//               console.log(`Interview Detail data structure:`, detailsData.data);

//               if (detailsData.data && detailsData.data.length > 0) {
//                 console.log(`First Interview Detail record:`, detailsData.data[0]);
//                 console.log(`Available fields in first record:`, Object.keys(detailsData.data[0]));
//               }

//               const interviewers = detailsData.data?.map((d: any) => d.interviewer) || [];
//               console.log(`Extracted interviewers for ${interview.name}:`, interviewers);

//               return {
//                 ...interview,
//                 interviewers: interviewers
//               };
//             } catch (error) {
//               console.error("Error fetching interview details for", interview.name, error);
//               return {
//                 ...interview,
//                 interviewers: []
//               };
//             }
//           })
//         );

//         console.log("Interviews with interviewers:", interviews);
//         setAllInterviews(interviews);

//         // Map the API data and add interview status
//         const mappedData = applicants.map((item: any) => {
//           // Find ALL interviews for this applicant
//           const applicantInterviews = interviews.filter((int: any) =>
//             int.job_applicant === item.name || int.job_applicant === item.email_id
//           );

//           // Get the MOST RECENT interview (latest by scheduled_on or creation date)
//           const interview = applicantInterviews.length > 0
//             ? applicantInterviews.sort((a: any, b: any) => {
//               const dateA = new Date(a.scheduled_on || a.creation).getTime();
//               const dateB = new Date(b.scheduled_on || b.creation).getTime();
//               return dateB - dateA; // Most recent first
//             })[0]
//             : null;

//           // Count total interview rounds for this applicant
//           const totalRounds = applicantInterviews.length;

//           return {
//             id: item.name || item.id,
//             applicant_name: item.applicant_name || "Unknown",
//             email_id: item.email_id || "",
//             phone_number: item.phone_number || "",
//             position: item.job_title || item.designation || "Not specified",
//             designation: item.designation || "",
//             experience: item.experience || "N/A",
//             skills: item.skills ? (Array.isArray(item.skills) ? item.skills : []) : [],
//             resumeScore: item.resume_score || 0,
//             status: item.status || "Open",
//             interviewStatus: interview ? interview.status : null,
//             recruitment_stage: item.custom_recruitment_stage || "",
//             appliedDate: item.creation || item.applied_date || new Date().toISOString().split('T')[0],
//             totalRounds: totalRounds,
//             interviewDetails: interview ? {
//               date: interview.scheduled_on || "",
//               time: `${interview.from_time || ""} - ${interview.to_time || ""}`,
//               from_time: interview.from_time || "",
//               to_time: interview.to_time || "",
//               type: interview.type || "video",
//               location: interview.custom_location || interview.location || "",
//               meeting_link: interview.google_meet || interview.meeting_link || "",
//               interviewers: interview.interviewers || [],
//               round: interview.round || 1,
//               round_name: interview.interview_round || "",
//               notes: interview.notes || ""
//             } : undefined
//           };
//         });

//         // Sort candidates by application date in descending order (newest first)
//         const sortedData = mappedData.sort((a, b) => {
//           const dateA = new Date(a.appliedDate).getTime();
//           const dateB = new Date(b.appliedDate).getTime();
//           return dateB - dateA; // Newest first
//         });

//         setCandidate(sortedData);
//         console.log("Mapped candidates:", sortedData);
//       }
//     } catch (error: any) {
//       console.error("Error fetching job applicants:", error);
//       setApiError("Network error: Unable to reach server. Please check if the API server is running.");
//     } finally {
//       setIsLoading(false)
//     }
//   };

//   useEffect(() => {
//     fetchJobApplicant()
//   }, [])

//   useEffect(() => {
//     document.title = 'Interview'
//   }, [])

//   // derive unique lists for filters from fetched candidates
//   const uniqueDesignations = Array.from(
//     new Set(
//       candidates
//         .map(c => c.designation)
//         .filter((d): d is string => Boolean(d) && d.trim() !== '')
//     )
//   )

//   // For statuses we want both interviewStatus and status values, normalize to unique set
//   const allStatusesSet = new Set<string>()
//   candidates.forEach(c => {
//     if (c.interviewStatus && c.interviewStatus.trim() !== '') allStatusesSet.add(c.interviewStatus)
//     if (c.status && c.status.trim() !== '') allStatusesSet.add(c.status)
//   })
//   const uniqueStatuses = Array.from(allStatusesSet)

//   const filteredCandidates = candidates.filter((candidate) => {
//     // Priority: interviewStatus if it exists, otherwise use status
//     const candidateStatus = candidate.interviewStatus || candidate.status
//     const statusMatch = filterStatus === "all" || candidateStatus === filterStatus
//     const designationMatch = filterDesignation === "all" || candidate.designation === filterDesignation

//     // Search filter
//     const searchMatch = searchTerm === "" ||
//       candidate.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       candidate.email_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       candidate.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       candidate.position.toLowerCase().includes(searchTerm.toLowerCase())

//     return statusMatch && designationMatch && searchMatch

//   })

//   // Pagination calculation
//   const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE)
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
//   const endIndex = startIndex + ITEMS_PER_PAGE
//   const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex)

//   // Reset to page 1 when filters change
//   useEffect(() => {
//     setCurrentPage(1)
//   }, [filterStatus, filterDesignation, searchTerm])


//   const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
//   const [showScheduleForm, setShowScheduleForm] = useState(false)
//   const [interviewForm, setInterviewForm] = useState({
//     date: "",
//     time: "",
//     type: "video" as "in-person" | "video" | "phone",
//     location: "",
//     interviewers: [] as string[],
//     round: 1,
//     duration: "60",
//     notes: "",
//   })

//   const getStatusColor = (status: string) => {
//     const normalizedStatus = status?.toLowerCase().trim() || ""

//     if (normalizedStatus.includes("cleared") || normalizedStatus.includes("accept") || normalizedStatus.includes("hired")) {
//       return "bg-green-100 text-green-800 border-green-200"
//     } else if (normalizedStatus.includes("open") || normalizedStatus.includes("replied") || normalizedStatus.includes("hold") || normalizedStatus.includes("under review")) {
//       return "bg-blue-100 text-blue-800 border-blue-200"
//     } else if (normalizedStatus.includes("reject")) {
//       return "bg-red-100 text-red-800 border-red-200"
//     } else {
//       return "bg-yellow-100 text-yellow-800 border-yellow-200"
//     }
//   }

//   const getStatusText = (status: string) => {
//     if (!status) return "Pending"
//     return status.charAt(0).toUpperCase() + status.slice(1)
//   }

//   const getStatusIcon = (status: string) => {
//     const normalizedStatus = status?.toLowerCase().trim() || ""

//     if (normalizedStatus.includes("cleared") || normalizedStatus.includes("accept") || normalizedStatus.includes("hired")) {
//       return <CheckCircle className="h-4 w-4" />
//     } else if (normalizedStatus.includes("open") || normalizedStatus.includes("replied") || normalizedStatus.includes("hold") || normalizedStatus.includes("under review")) {
//       return <Clock className="h-4 w-4" />
//     } else if (normalizedStatus.includes("reject")) {
//       return <XCircle className="h-4 w-4" />
//     } else {
//       return <AlertCircle className="h-4 w-4" />
//     }
//   }

//   const handleScheduleInterview = () => {
//     console.log("Scheduling interview for:", selectedCandidate?.applicant_name, interviewForm)
//     setShowScheduleForm(false)
//     setInterviewForm({
//       date: "",
//       time: "",
//       type: "video",
//       location: "",
//       interviewers: [],
//       round: 1,
//       duration: "60",
//       notes: "",
//     })
//   }

//   const handleInterviewerToggle = (interviewer: string) => {
//     setInterviewForm((prev) => ({
//       ...prev,
//       interviewers: prev.interviewers.includes(interviewer)
//         ? prev.interviewers.filter((i) => i !== interviewer)
//         : [...prev.interviewers, interviewer],
//     }))
//   }

//   const handleRecruitmentStageChange = async (candidateId: string, newStage: string) => {
//     try {
//       // Use the dedicated recruitment stage update endpoint
//       const response = await fetch(
//         `${API_BASE_URL}/api/method/your_app_name.your_module.interview_api.update_recruitment_stage`,
//         {
//           method: 'POST',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//           },
//           body: JSON.stringify({
//             applicant_id: candidateId,
//             recruitment_stage: newStage
//           })
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const result = await response.json();
//       console.log("Recruitment stage updated:", result);

//       // Update local state
//       setCandidate(prevCandidates =>
//         prevCandidates.map(candidate =>
//           candidate.id === candidateId
//             ? { ...candidate, recruitment_stage: newStage }
//             : candidate
//         )
//       );

//       // Update selected candidate if it's the one being updated
//       if (selectedCandidate?.id === candidateId) {
//         setSelectedCandidate(prev => prev ? { ...prev, recruitment_stage: newStage } : null);
//       }

//       // Show success message
//       alert(`Recruitment stage updated to: ${newStage}. Email will be sent automatically.`);

//     } catch (error) {
//       console.error("Error updating recruitment stage:", error);
//       alert("Failed to update recruitment stage. Please try again.");
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <div className="container mx-auto p-8 space-y-8">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="space-y-2">
//             <div className="flex items-center space-x-4">
//               <Link href="/">
//                 <Button variant="outline" size="sm">
//                   <ArrowLeft className="h-4 w-4 mr-2" />
//                   Back to Dashboard
//                 </Button>
//               </Link>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                 Interview Management
//               </h1>
//             </div>
//             <p className="text-muted-foreground">Schedule and manage candidate interviews</p>
//           </div>

//           {/* <div className="flex items-center space-x-4">
//             <Select value={filterStatus} onValueChange={setFilterStatus}>
//               <SelectTrigger className="w-48">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Candidates</SelectItem>
//                 <SelectItem value="Pending">Pending</SelectItem>
//                 <SelectItem value="Open">Open</SelectItem>
//                 <SelectItem value="Under Review">Under Review</SelectItem>
//                 <SelectItem value="Cleared">Cleared</SelectItem>
//                 <SelectItem value="Rejected">Rejected</SelectItem>
//               </SelectContent>
//             </Select>
//           </div> */}
//         </div>

//         {/* API Error Alert */}
//         {apiError && (
//           <Card className="border-red-200 bg-red-50">
//             <CardContent className="p-4">
//               <div className="flex items-start space-x-2">
//                 <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
//                 <div>
//                   <p className="font-semibold text-red-900">API Connection Error</p>
//                   <p className="text-sm text-red-700">{apiError}</p>
//                   <p className="text-xs text-red-600 mt-1">Please check your API configuration.</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Interview Statistics */}
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
//           <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Open</p>
//                   <p className="text-3xl font-bold text-blue-600">
//                     {candidates.filter((c) => c.status === "Open" || c.interviewStatus === "Open").length}
//                   </p>
//                 </div>
//                 <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
//                   <Clock className="h-6 w-6 text-blue-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>


//           <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Pending</p>
//                   <p className="text-3xl font-bold text-gray-600">
//                     {candidates.filter((c) => c.status === "Pending" || c.interviewStatus === "Pending").length}
//                   </p>
//                 </div>
//                 <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
//                   <AlertCircle className="h-6 w-6 text-gray-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Under Review</p>
//                   <p className="text-3xl font-bold text-yellow-600">
//                     {candidates.filter((c) => c.interviewStatus === "Under Review").length}
//                   </p>
//                 </div>
//                 <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
//                   <AlertCircle className="h-6 w-6 text-yellow-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Cleared</p>
//                   <p className="text-3xl font-bold text-green-600">
//                     {candidates.filter((c) => c.interviewStatus === "Cleared").length}
//                   </p>
//                 </div>
//                 <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
//                   <CheckCircle className="h-6 w-6 text-green-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Rejected</p>
//                   <p className="text-3xl font-bold text-red-600">
//                     {candidates.filter((c) => c.interviewStatus === "Rejected").length}
//                   </p>
//                 </div>
//                 <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
//                   <XCircle className="h-6 w-6 text-red-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Candidates List */}
//           <div className="lg:col-span-2 space-y-4">
//             <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//               <CardHeader>
//                 <div className="space-y-4">
//                   <div className="flex items-start justify-between w-full">
//                     <div className="flex items-center space-x-2">
//                       <Users className="h-5 w-5" />
//                       <span className="text-lg font-semibold">Candidates ({filteredCandidates.length})</span>
//                       {isLoading && <span className="text-sm text-muted-foreground">(Loading...)</span>}
//                     </div>

//                     {/* Filters placed to the right of the title (side-by-side) */}
//                     <div className="flex items-center gap-3">
//                       {/* Designation filter (dynamic values from API) */}
//                       <div className="min-w-[160px]">
//                         <Select value={filterDesignation} onValueChange={setFilterDesignation}>
//                           <SelectTrigger className="w-full h-12">
//                             <SelectValue placeholder="Designations" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="all">Designations</SelectItem>
//                             {uniqueDesignations.map((desig) => (
//                               <SelectItem key={desig} value={desig}>
//                                 {desig}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       {/* Interview status filter (dynamic values + fallback options) */}
//                       <div className="min-w-[160px]">
//                         <Select value={filterStatus} onValueChange={setFilterStatus}>
//                           <SelectTrigger className="w-full h-12">
//                             <SelectValue placeholder=" Status" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="all">Status</SelectItem>
//                             {uniqueStatuses.map((st) => (
//                               <SelectItem key={st} value={st}>
//                                 {st}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Search Bar */}
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       placeholder="Search by name, email, phone, or job title..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 h-12"
//                     />
//                   </div>
//                 </div>
//               </CardHeader>

//               <CardContent className="space-y-4">
//                 {paginatedCandidates.map((candidate, index) => (
//                   <Card
//                     key={index}
//                     className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-0 shadow-lg ${selectedCandidate?.id === candidate.id ? "ring-2 ring-blue-500" : ""
//                       }`}
//                     onClick={() => setSelectedCandidate(candidate)}
//                   >
//                     <CardContent className="p-4">
//                       <div className="flex items-start justify-between">
//                         <div className="flex items-start space-x-4">
//                           <Avatar className="h-12 w-12">
//                             <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
//                               {candidate.applicant_name
//                                 .split(" ")
//                                 .map((n) => n[0])
//                                 .join("")}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div className="space-y-2">
//                             <div>
//                               <h3 className="font-semibold">{candidate.applicant_name}</h3>
//                               <p className="text-sm text-muted-foreground">{candidate.position}</p>
//                             </div>
//                             <div className="flex items-center space-x-4 text-sm text-muted-foreground">
//                               <div className="flex items-center space-x-1">
//                                 <Mail className="h-3 w-3" />
//                                 <span>{candidate.email_id}</span>
//                               </div>
//                               <div className="flex items-center space-x-1">
//                                 <Phone className="h-3 w-3" />
//                                 <span>{candidate.phone_number}</span>
//                               </div>
//                             </div>
//                             <div className="flex flex-wrap gap-1">
//                               <div className="flex flex-wrap gap-4 text-gray-700 text-sm mt-1">
//                                 {candidate.designation && (
//                                   <div>
//                                     <span>{candidate.designation}</span>
//                                   </div>
//                                 )}
//                                 <div>
//                                   <span>{candidate.interviewDetails?.round_name || (candidate.interviewStatus || candidate.status)}</span>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-right space-y-2">
//                           <Badge className={getStatusColor(candidate.interviewStatus || candidate.status)}>
//                             <div className="flex items-center space-x-1">
//                               {getStatusIcon(candidate.interviewStatus || candidate.status)}
//                               <span>{getStatusText(candidate.interviewStatus || candidate.status)}</span>
//                             </div>
//                           </Badge>
//                           <div className="text-sm">
//                             <div className="font-semibold text-green-600">{candidate.resumeScore}%</div>
//                             <div className="text-xs text-muted-foreground">Match Score</div>
//                           </div>
//                           {(() => {
//                             const currentStatus = candidate.interviewStatus || candidate.status

//                             // // Don't show any buttons if rejected
//                             // if (currentStatus === "Rejected") {
//                             //   return null
//                             // }

//                             // If rejected, show only feedback button
//                             if (currentStatus === "Rejected") {
//                               return (
//                                 <Button
//                                   size="sm"
//                                   className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs px-3"
//                                   onClick={(e) => {
//                                     e.stopPropagation()
//                                     router.push(
//                                       `/candidate-feedback?candidateId=${encodeURIComponent(candidate.id)}&candidateName=${encodeURIComponent(candidate.applicant_name)}&candidateEmail=${encodeURIComponent(candidate.email_id)}`
//                                     )
//                                   }}
//                                 >
//                                   Candidate Feedback
//                                 </Button>
//                               )
//                             }


//                             // If cleared, show both feedback and interview schedule buttons
//                             if (currentStatus === "Cleared") {
//                               return (
//                                 <div className="flex flex-col gap-2">
//                                   <Button
//                                     size="sm"
//                                     className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs px-3"
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       router.push(
//                                         `/candidate-feedback?candidateId=${encodeURIComponent(candidate.id)}&candidateName=${encodeURIComponent(candidate.applicant_name)}&candidateEmail=${encodeURIComponent(candidate.email_id)}`
//                                       )
//                                     }}
//                                   >
//                                     Candidate Feedback
//                                   </Button>
//                                   <Button
//                                     size="sm"
//                                     className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-8 text-xs px-3"
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       router.push(
//                                         `/Event?applicantId=${encodeURIComponent(candidate.id)}&applicantName=${encodeURIComponent(candidate.applicant_name)}&applicantEmail=${encodeURIComponent(candidate.email_id)}`
//                                       )
//                                     }}
//                                   >
//                                     Interview Schedule
//                                   </Button>
//                                 </div>
//                               )
//                             }

//                             // For all other non-rejected statuses, show schedule button
//                             return (
//                               <Button
//                                 size="sm"
//                                 className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-8 text-xs px-3"
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   router.push(
//                                     `/Event?applicantId=${encodeURIComponent(candidate.id)}&applicantName=${encodeURIComponent(candidate.applicant_name)}&applicantEmail=${encodeURIComponent(candidate.email_id)}`
//                                   )
//                                 }}
//                               >
//                                 Interview Schedule
//                               </Button>
//                             )
//                           })()}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//                 {/* Pagination Controls */}
//                 {filteredCandidates.length > 0 && (
//                   <div className="flex items-center justify-between pt-4 border-t mt-4">
//                     <div className="text-sm text-muted-foreground">
//                       Showing {startIndex + 1} to {Math.min(endIndex, filteredCandidates.length)} of {filteredCandidates.length} candidates
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                         disabled={currentPage === 1}
//                       >
//                         <ChevronLeft className="h-4 w-4" />
//                         Previous
//                       </Button>
//                       <div className="text-sm font-medium">
//                         Page {currentPage} of {totalPages}
//                       </div>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                         disabled={currentPage === totalPages}
//                       >
//                         Next
//                         <ChevronRight className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Interview Management Panel */}
//           <div className="space-y-6">
//             {selectedCandidate ? (
//               <>
//                 <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
//                   <CardHeader>
//                     <CardTitle className="flex items-center space-x-2">
//                       <Calendar className="h-5 w-5" />
//                       <span>Interview Management</span>
//                     </CardTitle>
//                     <CardDescription className="text-blue-100">For {selectedCandidate.applicant_name}</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {/* Recruitment Stage Selector */}
//                     <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-3">
//                       <Label className="text-white font-semibold">Recruitment Stage</Label>
//                       <Select
//                         value={selectedCandidate.recruitment_stage || ""}
//                         onValueChange={(value) => handleRecruitmentStageChange(selectedCandidate.id, value)}
//                         disabled={selectedCandidate.interviewStatus !== "Cleared" && selectedCandidate.recruitment_stage !== "Document Upload Requested"}
//                       >
//                         <SelectTrigger className="bg-white text-gray-900 border-0 h-12">
//                           <SelectValue placeholder="Select Stage" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="Document Upload Requested">Document Upload Requested</SelectItem>
//                           <SelectItem value="Document Verified">Document Verified</SelectItem>
//                         </SelectContent>
//                       </Select>

//                       {/* Status Indicator */}
//                       {selectedCandidate.recruitment_stage && (
//                         <div className="flex items-center space-x-2 text-sm text-blue-100">
//                           <div className={`h-2 w-2 rounded-full ${selectedCandidate.recruitment_stage === "Document Verified"
//                             ? "bg-green-400"
//                             : "bg-yellow-400"
//                             }`} />
//                           <span>
//                             {selectedCandidate.recruitment_stage === "Document Verified"
//                               ? "Documents verified and ready"
//                               : "Waiting for document upload"}
//                           </span>
//                         </div>
//                       )}

//                       {/* Document Verification Note */}
//                       {selectedCandidate.interviewStatus === "Cleared" &&
//                         selectedCandidate.recruitment_stage !== "Document Verified" && (
//                           <div className="text-xs text-blue-100 bg-white/10 p-2 rounded">
//                             💡 Interview cleared! You can now request document upload or verify documents.
//                           </div>
//                         )}
//                     </div>

//                     {/* Existing Interview Action Buttons */}
//                     {(selectedCandidate.status === "Open" || selectedCandidate.interviewStatus === "Open") && (
//                       <Button
//                         className="w-full bg-white text-blue-600 hover:bg-blue-50"
//                         onClick={() => setShowScheduleForm(true)}
//                       >
//                         <Plus className="h-4 w-4 mr-2" />
//                         Schedule Interview
//                       </Button>
//                     )}
//                     {selectedCandidate.interviewStatus === "Under Review" && (
//                       <div className="space-y-2">
//                         <Button
//                           className="w-full bg-white text-blue-600 hover:bg-blue-50"
//                           onClick={() => setShowScheduleForm(true)}
//                         >
//                           <Edit className="h-4 w-4 mr-2" />
//                           Reschedule Interview
//                         </Button>
//                         <Button
//                           variant="outline"
//                           className="w-full bg-green-500 hover:bg-green-600 text-white border-green-400"
//                         >
//                           <CheckCircle className="h-4 w-4 mr-2" />
//                           Mark as Completed
//                         </Button>
//                       </div>
//                     )}
//                     {selectedCandidate.interviewStatus === "Cleared" && (
//                       <div className="text-center text-blue-100">
//                         <CheckCircle className="h-8 w-8 mx-auto mb-2" />
//                         <p>Interview Cleared</p>
//                         <p className="text-xs mt-1">Proceed with document verification</p>
//                       </div>
//                     )}
//                     {selectedCandidate.interviewStatus === "Rejected" && (
//                       <div className="text-center text-blue-100">
//                         <XCircle className="h-8 w-8 mx-auto mb-2" />
//                         <p>Interview Rejected</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Interview Details */}
//                 {selectedCandidate.interviewDetails && (
//                   <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//                     <CardHeader>
//                       <CardTitle className="text-lg">Interview Details</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="space-y-4 text-sm">
//                         <div className="grid grid-cols-2 gap-4">
//                           <div className="col-span-2">
//                             <span className="font-medium text-muted-foreground">Scheduled:</span>
//                             <p>
//                               {new Date(selectedCandidate.interviewDetails.date).toLocaleDateString('en-GB')}
//                               {selectedCandidate.interviewDetails.from_time && selectedCandidate.interviewDetails.to_time &&
//                                 ` at ${selectedCandidate.interviewDetails.from_time} - ${selectedCandidate.interviewDetails.to_time}`
//                               }
//                             </p>
//                           </div>

//                           <div>
//                             <span className="font-medium text-muted-foreground">Type:</span>
//                             <p className="capitalize">{selectedCandidate.interviewDetails.type}</p>
//                           </div>

//                           <div>
//                             <span className="font-medium text-muted-foreground">Round:</span>
//                             <p>{selectedCandidate.interviewDetails.round_name || `Round ${selectedCandidate.interviewDetails.round}`}</p>
//                           </div>

//                           {selectedCandidate.interviewDetails.location && (
//                             <div className="col-span-2">
//                               <span className="font-medium text-muted-foreground">Location:</span>
//                               <p>{selectedCandidate.interviewDetails.location}</p>
//                             </div>
//                           )}

//                           {selectedCandidate.interviewDetails.meeting_link && (
//                             <div className="col-span-2">
//                               <span className="font-medium text-muted-foreground">Meeting Link:</span>
//                               <p className="text-xs break-all">
//                                 <a
//                                   href={selectedCandidate.interviewDetails.meeting_link}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="text-blue-600 hover:underline"
//                                 >
//                                   {selectedCandidate.interviewDetails.meeting_link}
//                                 </a>
//                               </p>
//                             </div>
//                           )}
//                         </div>

//                         <div>
//                           <span className="font-medium text-muted-foreground">Interviewers:</span>
//                           {console.log("Interviewers array:", selectedCandidate.interviewDetails.interviewers)}
//                           <div className="flex flex-wrap gap-1 mt-1">
//                             {selectedCandidate.interviewDetails.interviewers && selectedCandidate.interviewDetails.interviewers.length > 0 ? (
//                               selectedCandidate.interviewDetails.interviewers.map((interviewer, idx) => (
//                                 <Badge key={idx} variant="outline">
//                                   {interviewer}
//                                 </Badge>
//                               ))
//                             ) : (
//                               <p className="text-sm text-muted-foreground">No interviewers assigned</p>
//                             )}
//                           </div>
//                         </div>

//                         {selectedCandidate.interviewDetails.notes && (
//                           <div>
//                             <span className="font-medium text-muted-foreground">Notes:</span>
//                             <p className="text-sm mt-1">{selectedCandidate.interviewDetails.notes}</p>
//                           </div>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}

//                 {/* Interview Timeline - ADD THIS NEW SECTION */}
//                 {selectedCandidate && selectedCandidate.totalRounds && selectedCandidate.totalRounds > 1 && (() => {
//                   // Get all interviews for this candidate, sorted by date
//                   const candidateInterviews = allInterviews.filter((int: any) =>
//                     int.job_applicant === selectedCandidate.id
//                   ).sort((a: any, b: any) => {
//                     const dateA = new Date(a.scheduled_on || a.creation).getTime();
//                     const dateB = new Date(b.scheduled_on || b.creation).getTime();
//                     return dateA - dateB; // Oldest first
//                   });

//                   return (
//                     <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//                       <CardHeader>
//                         <CardTitle className="text-lg flex items-center gap-2">
//                           <Calendar className="h-4 w-4" />
//                           Interview Timeline
//                           <Badge variant="outline" className="ml-auto">
//                             {selectedCandidate.totalRounds} Rounds
//                           </Badge>
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-3">
//                         {candidateInterviews.map((interview: any, index: number) => (
//                           <div
//                             key={interview.name}
//                             className={`p-3 rounded-lg border ${index === candidateInterviews.length - 1
//                               ? 'bg-blue-50 border-blue-200'
//                               : 'bg-gray-50 border-gray-200'
//                               }`}
//                           >
//                             <div className="flex items-center justify-between mb-2">
//                               <div className="flex items-center gap-2">
//                                 <span className="font-semibold text-sm">
//                                   {interview.interview_round}
//                                 </span>
//                                 {index === candidateInterviews.length - 1 && (
//                                   <Badge variant="default" className="text-xs">Current</Badge>
//                                 )}
//                               </div>
//                               <Badge className={getStatusColor(interview.status)}>
//                                 {interview.status}
//                               </Badge>
//                             </div>
//                             <div className="text-xs text-muted-foreground space-y-1">
//                               <div>📅 {interview.scheduled_on} at {interview.from_time} - {interview.to_time}</div>
//                               {interview.custom_location && (
//                                 <div>📍 {interview.custom_location}</div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </CardContent>
//                     </Card>
//                   );
//                 })()}

//                 {/* Schedule Interview Form */}
//                 {showScheduleForm && (
//                   <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//                     <CardHeader>
//                       <CardTitle className="text-lg">Schedule Interview</CardTitle>
//                       <CardDescription>Set up interview details</CardDescription>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="date">Date</Label>
//                           <Input
//                             id="date"
//                             type="date"
//                             value={interviewForm.date}
//                             onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
//                             className="h-12"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="time">Time</Label>
//                           <Input
//                             id="time"
//                             type="time"
//                             value={interviewForm.time}
//                             onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
//                             className="h-12"
//                           />
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <Label>Interview Type</Label>
//                         <Select
//                           value={interviewForm.type}
//                           onValueChange={(value: "in-person" | "video" | "phone") =>
//                             setInterviewForm({ ...interviewForm, type: value })
//                           }
//                         >
//                           <SelectTrigger className="h-12">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="video">Video Call</SelectItem>
//                             <SelectItem value="in-person">In-Person</SelectItem>
//                             <SelectItem value="phone">Phone Call</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       {interviewForm.type === "in-person" && (
//                         <div className="space-y-2">
//                           <Label htmlFor="location">Location</Label>
//                           <Input
//                             id="location"
//                             value={interviewForm.location}
//                             onChange={(e) => setInterviewForm({ ...interviewForm, location: e.target.value })}
//                             placeholder="Conference Room A"
//                             className="h-12"
//                           />
//                         </div>
//                       )}

//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="round">Interview Round</Label>
//                           <Select
//                             value={interviewForm.round.toString()}
//                             onValueChange={(value) =>
//                               setInterviewForm({ ...interviewForm, round: Number.parseInt(value) })
//                             }
//                           >
//                             <SelectTrigger className="h-12">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="1">Round 1 - Technical</SelectItem>
//                               <SelectItem value="2">Round 2 - Managerial</SelectItem>
//                               <SelectItem value="3">Round 3 - HR</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="duration">Duration (minutes)</Label>
//                           <Select
//                             value={interviewForm.duration}
//                             onValueChange={(value) => setInterviewForm({ ...interviewForm, duration: value })}
//                           >
//                             <SelectTrigger className="h-12">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="30">30 minutes</SelectItem>
//                               <SelectItem value="45">45 minutes</SelectItem>
//                               <SelectItem value="60">60 minutes</SelectItem>
//                               <SelectItem value="90">90 minutes</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="notes">Additional Notes</Label>
//                         <Textarea
//                           id="notes"
//                           value={interviewForm.notes}
//                           onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
//                           placeholder="Any special instructions or notes..."
//                           rows={3}
//                         />
//                       </div>

//                       <div className="flex space-x-2">
//                         <Button onClick={handleScheduleInterview} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
//                           Schedule Interview
//                         </Button>
//                         <Button variant="outline" onClick={() => setShowScheduleForm(false)} className="flex-1">
//                           Cancel
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}
//               </>
//             ) : (
//               <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//                 <CardContent className="p-8 text-center">
//                   <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <h3 className="font-semibold mb-2">Select a Candidate</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Choose a candidate to schedule or manage their interview.
//                   </p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }






// "use client"
// import { useState, useEffect } from "react"
// import axios from "axios"
// import {
//   Calendar,
//   Clock,
//   Video,
//   MapPin,
//   Phone,
//   Mail,
//   ArrowLeft,
//   Plus,
//   Edit,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Users,
//   ChevronLeft,
//   ChevronRight,
//   Search,
//   Menu,
//   X,
//   Home,
//   LogOut,
//   Upload,
//   Briefcase,
//   MessageSquare,
//   Zap,
//   UserCheck,
//   FileText,
//   UserPlus,
// } from "lucide-react"
// import Link from "next/link"
// import { axiosConfig } from '@/lib/axios-config'
// import { useRouter } from "next/navigation"
// import { API_BASE_URL } from '@/lib/api-config'

// /* ─────────────────────────────────────────────────────────────
//    CSS — identical design tokens to Dashboard / Job Opening /
//           Resume Upload / Candidates pages
// ───────────────────────────────────────────────────────────── */
// const css = `
//   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   .ip {
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

//     --green:     #16a34a;
//     --green-lt:  #dcfce7;
//     --green-bdr: #bbf7d0;
//     --red:       #dc2626;
//     --red-lt:    #fee2e2;
//     --red-bdr:   #fecaca;
//     --yellow:    #d97706;
//     --yellow-lt: #fef9c3;
//     --yellow-bdr:#fde68a;
//     --gray-lt:   #f3f4f6;
//     --gray-bdr:  #e5e7eb;

//     font-family: 'Inter', system-ui, sans-serif;
//     font-size: 13.5px;
//     -webkit-font-smoothing: antialiased;
//   }

//   .ip-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

//   /* ══ SIDEBAR ══ */
//   .ip-sb {
//     width: var(--sb-w); background: var(--sb);
//     min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 100;
//     display: flex; flex-direction: column;
//     transition: transform .25s cubic-bezier(.4,0,.2,1);
//   }
//   .ip-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }

//   .ip-sb-brand {
//     height: 64px; display: flex; align-items: center; gap: 12px;
//     padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
//   }
//   .ip-sb-icon {
//     width: 38px; height: 38px; border-radius: 10px;
//     background: var(--accent-md); border: 1px solid var(--accent-bdr);
//     display: flex; align-items: center; justify-content: center;
//     overflow: hidden; flex-shrink: 0;
//   }
//   .ip-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
//   .ip-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; line-height: 1.25; }
//   .ip-sb-sub  { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
//   .ip-sb-close {
//     margin-left: auto; flex-shrink: 0; width: 28px; height: 28px; border-radius: 7px;
//     background: none; border: none; cursor: pointer; color: var(--sb-lbl);
//     display: flex; align-items: center; justify-content: center; transition: all .14s;
//   }
//   .ip-sb-close:hover { background: var(--sb-hover); color: #fff; }

//   .ip-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
//   .ip-nav::-webkit-scrollbar { width: 3px; }
//   .ip-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }

//   .ip-nav-cta {
//     display: flex; align-items: center; gap: 9px;
//     padding: 11px 14px; border-radius: 9px;
//     background: var(--accent-md); border: 1px solid var(--accent-bdr);
//     color: var(--accent); font-size: 13px; font-weight: 600;
//     text-decoration: none; transition: background .15s; margin-bottom: 22px;
//   }
//   .ip-nav-cta:hover { background: rgba(0,158,247,.24); }

//   .ip-nav-lbl {
//     font-size: 9.5px; font-weight: 700; text-transform: uppercase;
//     letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
//   }
//   .ip-nav-link {
//     display: flex; align-items: center; gap: 10px;
//     padding: 9px 12px; border-radius: 8px;
//     font-size: 13px; font-weight: 500; color: var(--sb-txt);
//     text-decoration: none; transition: all .14s;
//   }
//   .ip-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; }
//   .ip-nav-link:hover { background: var(--sb-hover); color: #fff; }
//   .ip-nav-link:hover svg { opacity: 1; }
//   .ip-nav-link.active { background: var(--sb-hover); color: #fff; }
//   .ip-nav-link.active svg { opacity: 1; }

//   .ip-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
//   .ip-logout {
//     display: flex; align-items: center; gap: 10px; width: 100%;
//     padding: 9px 12px; border-radius: 8px; background: none; border: none;
//     cursor: pointer; font-family: 'Inter', sans-serif;
//     font-size: 13px; font-weight: 500; color: var(--sb-lbl); text-align: left; transition: all .14s;
//   }
//   .ip-logout svg { opacity: .6; width: 15px; height: 15px; }
//   .ip-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }

//   /* Overlay — mobile only */
//   .ip-overlay {
//     display: none; position: fixed; inset: 0; z-index: 99;
//     background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
//   }
//   @media (max-width: 768px) { .ip-overlay.show { display: block; } }

//   /* ══ MAIN ══ */
//   .ip-main {
//     margin-left: var(--sb-w); flex: 1;
//     display: flex; flex-direction: column; min-height: 100vh;
//     transition: margin-left .25s cubic-bezier(.4,0,.2,1);
//   }
//   .ip-main.sb-closed { margin-left: 0; }

//   /* ══ HEADER ══ */
//   .ip-header {
//     height: 60px; background: #fff; border-bottom: 1px solid var(--border);
//     display: flex; align-items: center; padding: 0 28px; gap: 12px;
//     position: sticky; top: 0; z-index: 50;
//     box-shadow: 0 1px 0 rgba(0,158,247,.08);
//   }
//   .ip-toggle {
//     width: 34px; height: 34px; border-radius: 8px;
//     background: none; border: 1px solid var(--border);
//     cursor: pointer; display: flex; align-items: center; justify-content: center;
//     color: var(--t2); flex-shrink: 0; transition: all .14s;
//   }
//   .ip-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
//   .ip-btn-back {
//   display: inline-flex; align-items: center; gap: 6px;
//   padding: 7px 14px; border-radius: 8px;
//   background: transparent; color: var(--t2);
//   font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
//   border: 1px solid var(--border); cursor: pointer; text-decoration: none;
//   transition: all .14s; white-space: nowrap;
//   }
//   .ip-btn-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
//   .ip-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
//   .ip-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
//   .ip-crumb svg { width: 13px; height: 13px; }
//   .ip-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }
//   .ip-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }

//   /* ══ BUTTONS ══ */
//   .ip-btn-out {
//     display: inline-flex; align-items: center; gap: 7px;
//     padding: 7px 14px; border-radius: 8px;
//     background: transparent; color: var(--t2);
//     font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
//     border: 1px solid var(--border); cursor: pointer; text-decoration: none;
//     transition: all .14s; white-space: nowrap;
//   }
//   .ip-btn-out:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

//   .ip-btn-sm-outline {
//     display: inline-flex; align-items: center; gap: 5px;
//     padding: 6px 12px; border-radius: 7px;
//     font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 500;
//     background: transparent; color: var(--t2); border: 1px solid var(--border);
//     cursor: pointer; transition: all .14s; white-space: nowrap;
//   }
//   .ip-btn-sm-outline:hover:not(:disabled) { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
//   .ip-btn-sm-outline:disabled { opacity: .4; cursor: not-allowed; }

//   /* schedule / action buttons */
//   .ip-btn-accent {
//     display: inline-flex; align-items: center; justify-content: center; gap: 6px;
//     padding: 10px 16px; border-radius: 8px; width: 100%;
//     background: var(--accent); color: #fff;
//     font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
//     border: none; cursor: pointer; transition: background .15s;
//   }
//   .ip-btn-accent:hover { background: var(--accent-h); }

//   .ip-btn-white {
//     display: inline-flex; align-items: center; justify-content: center; gap: 6px;
//     padding: 10px 16px; border-radius: 8px; width: 100%;
//     background: #fff; color: var(--accent);
//     font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
//     border: none; cursor: pointer; transition: background .15s;
//   }
//   .ip-btn-white:hover { background: #f0f9ff; }

//   .ip-btn-green-glass {
//     display: inline-flex; align-items: center; justify-content: center; gap: 6px;
//     padding: 10px 16px; border-radius: 8px; width: 100%;
//     background: rgba(34,197,94,.2); color: #fff;
//     font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
//     border: 1px solid rgba(34,197,94,.4); cursor: pointer; transition: background .15s;
//   }
//   .ip-btn-green-glass:hover { background: rgba(34,197,94,.3); }

//   .ip-btn-sm-blue {
//     display: inline-flex; align-items: center; gap: 5px;
//     padding: 6px 12px; border-radius: 7px;
//     font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
//     background: var(--accent); color: #fff; border: none;
//     cursor: pointer; transition: background .15s; white-space: nowrap;
//   }
//   .ip-btn-sm-blue:hover { background: var(--accent-h); }

//   .ip-btn-sm-green {
//     display: inline-flex; align-items: center; gap: 5px;
//     padding: 6px 12px; border-radius: 7px;
//     font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
//     background: var(--green); color: #fff; border: none;
//     cursor: pointer; transition: background .15s; white-space: nowrap;
//   }
//   .ip-btn-sm-green:hover { background: #15803d; }

//   .ip-form-btn-cancel {
//     display: inline-flex; align-items: center; justify-content: center; gap: 6px;
//     padding: 10px 16px; border-radius: 8px; flex: 1;
//     background: transparent; color: var(--t2);
//     font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
//     border: 1px solid var(--border); cursor: pointer; transition: all .14s;
//   }
//   .ip-form-btn-cancel:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

//   /* ══ PAGE ══ */
//   .ip-page { padding: 28px 32px; display: flex; flex-direction: column; gap: 22px; }
//   .ip-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
//   .ip-page-title { font-size: 21px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; line-height: 1.15; }
//   .ip-page-sub   { font-size: 13px; color: var(--t3); margin-top: 5px; font-weight: 400; }

//   /* ══ ERROR ══ */
//   .ip-error {
//     background: var(--red-lt); border: 1px solid var(--red-bdr);
//     border-radius: 10px; padding: 14px 16px;
//     display: flex; align-items: flex-start; gap: 10px;
//   }
//   .ip-error svg { color: var(--red); flex-shrink: 0; margin-top: 1px; }
//   .ip-error-title { font-size: 13px; font-weight: 700; color: #7f1d1d; }
//   .ip-error-msg   { font-size: 12.5px; color: #991b1b; margin-top: 2px; }
//   .ip-error-hint  { font-size: 11.5px; color: #b91c1c; margin-top: 3px; }

//   /* ══ STAT GRID ══ */
//   .ip-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
//   .ip-stat {
//     background: var(--card); border: 1px solid var(--border-s);
//     border-radius: 10px; padding: 14px 16px;
//     display: flex; flex-direction: column; gap: 8px;
//     box-shadow: 0 1px 3px rgba(0,158,247,.06);
//   }
//   .ip-stat-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 6px; }
//   .ip-stat-label { font-size: 11px; color: var(--t3); font-weight: 500; line-height: 1.3; }
//   .ip-stat-icon { width: 34px; height: 34px; min-width: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
//   .ip-stat-val { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; line-height: 1; }

//   .ip-stat-val.blue   { color: var(--accent); }    .ip-stat-icon.blue   { background: var(--accent-lt); color: var(--accent); }
//   .ip-stat-val.gray   { color: #4b5563; }          .ip-stat-icon.gray   { background: var(--gray-lt); color: #4b5563; }
//   .ip-stat-val.yellow { color: var(--yellow); }    .ip-stat-icon.yellow { background: var(--yellow-lt); color: var(--yellow); }
//   .ip-stat-val.green  { color: var(--green); }     .ip-stat-icon.green  { background: var(--green-lt); color: var(--green); }
//   .ip-stat-val.red    { color: var(--red); }       .ip-stat-icon.red    { background: var(--red-lt); color: var(--red); }

//   /* ══ LAYOUT ══ */
//   .ip-layout { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }

//   /* ══ PANEL (left list) ══ */
//   .ip-panel {
//     background: var(--card); border: 1px solid var(--border-s);
//     border-radius: 12px; overflow: hidden;
//     box-shadow: 0 1px 4px rgba(0,158,247,.06);
//   }
//   .ip-panel-head { padding: 16px 20px; border-bottom: 1px solid var(--border-s); display: flex; flex-direction: column; gap: 12px; }
//   .ip-panel-title-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
//   .ip-panel-title { font-size: 14px; font-weight: 700; color: var(--t1); display: flex; align-items: center; gap: 8px; }

//   /* ══ FILTERS ══ */
//   .ip-filter-row { display: flex; gap: 10px; }
//   .ip-select-wrap { position: relative; }
//   .ip-select-arrow { position: absolute; right: 11px; top: 50%; transform: translateY(-50%) rotate(90deg); color: var(--t3); pointer-events: none; width: 13px; height: 13px; }
//   .ip-select {
//     height: 40px; padding: 0 32px 0 13px;
//     border: 1px solid var(--border); border-radius: 8px;
//     background: var(--bg); font-family: 'Inter', sans-serif;
//     font-size: 12.5px; color: var(--t2); appearance: none;
//     outline: none; cursor: pointer; transition: all .15s;
//   }
//   .ip-select:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }

//   /* ══ SEARCH ══ */
//   .ip-search-wrap { position: relative; }
//   .ip-search-wrap > svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--t3); width: 15px; height: 15px; pointer-events: none; }
//   .ip-search {
//     width: 100%; height: 42px; padding: 0 14px 0 40px;
//     border: 1px solid var(--border); border-radius: 8px;
//     background: var(--bg); font-family: 'Inter', sans-serif;
//     font-size: 13px; color: var(--t1); outline: none; transition: all .15s;
//   }
//   .ip-search::placeholder { color: var(--t3); }
//   .ip-search:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }

//   /* ══ CANDIDATE CARDS ══ */
//   .ip-cards { display: flex; flex-direction: column; gap: 10px; padding: 16px 20px; }

//   .ip-candidate-card {
//     background: var(--bg); border: 1px solid var(--border-s);
//     border-radius: 10px; padding: 14px 16px; cursor: pointer;
//     transition: box-shadow .15s, transform .15s, border-color .15s;
//   }
//   .ip-candidate-card:hover { box-shadow: 0 6px 18px rgba(0,158,247,.12); transform: translateY(-1px); border-color: rgba(0,158,247,.35); }
//   .ip-candidate-card.selected { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.15); background: var(--card); }

//   .ip-avatar {
//     width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
//     background: linear-gradient(135deg, var(--accent), #7c3aed);
//     color: #fff; display: flex; align-items: center; justify-content: center;
//     font-size: 14px; font-weight: 700; box-shadow: 0 4px 10px rgba(0,158,247,.25);
//   }
//   .ip-card-top { display: flex; align-items: flex-start; gap: 12px; }
//   .ip-card-info { flex: 1; min-width: 0; }
//   .ip-card-name { font-size: 14px; font-weight: 700; color: var(--t1); letter-spacing: -0.1px; }
//   .ip-card-pos  { font-size: 12px; color: var(--t3); margin-top: 2px; }
//   .ip-card-contacts { display: flex; gap: 14px; margin-top: 6px; flex-wrap: wrap; }
//   .ip-card-contact { font-size: 11.5px; color: var(--t3); display: flex; align-items: center; gap: 5px; }
//   .ip-card-contact svg { width: 11px; height: 11px; flex-shrink: 0; }
//   .ip-card-meta { display: flex; gap: 10px; margin-top: 5px; flex-wrap: wrap; }
//   .ip-card-meta-item { font-size: 12px; color: var(--t2); }

//   .ip-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }
//   .ip-card-score { font-size: 13px; font-weight: 700; color: var(--green); }
//   .ip-card-score-lbl { font-size: 10px; color: var(--t3); }

//   /* badges */
//   .ip-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }
//   .ip-badge.blue   { background: var(--accent-lt); color: var(--accent); border: 1px solid var(--border); }
//   .ip-badge.green  { background: var(--green-lt); color: var(--green); border: 1px solid var(--green-bdr); }
//   .ip-badge.red    { background: var(--red-lt); color: var(--red); border: 1px solid var(--red-bdr); }
//   .ip-badge.yellow { background: var(--yellow-lt); color: var(--yellow); border: 1px solid var(--yellow-bdr); }
//   .ip-badge.gray   { background: var(--gray-lt); color: #4b5563; border: 1px solid var(--gray-bdr); }
//   .ip-badge.outline{ background: transparent; color: var(--t2); border: 1px solid var(--border); }
//   .ip-badge.blue-solid { background: var(--accent); color: #fff; border: none; }

//   /* ══ PAGINATION ══ */
//   .ip-pagination { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-top: 1px solid var(--border-s); font-size: 12.5px; color: var(--t3); }
//   .ip-pag-btns { display: flex; align-items: center; gap: 8px; }
//   .ip-pag-cur { font-size: 12.5px; font-weight: 600; color: var(--t1); }

//   /* ══ RIGHT DETAIL COLUMN ══ */
//   .ip-detail-sticky { display: contents; }
//   .ip-detail {
//     display: flex; flex-direction: column; gap: 14px;
//     align-self: start;
//   }

//   /* hero management card */
//   .ip-mgmt-hero {
//     background: linear-gradient(135deg, #0f3460, #16213e);
//     border-radius: 12px; padding: 20px;
//   }
//   .ip-mgmt-hero-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
//   .ip-mgmt-hero-head svg { color: rgba(255,255,255,.5); }
//   .ip-mgmt-hero-title { font-size: 13px; font-weight: 700; color: #fff; }
//   .ip-mgmt-hero-sub   { font-size: 12px; color: rgba(255,255,255,.55); margin-bottom: 16px; }

//   /* stage selector box */
//   .ip-stage-box { background: rgba(255,255,255,.1); backdrop-filter: blur(4px); border-radius: 10px; padding: 14px; }
//   .ip-stage-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,.7); margin-bottom: 8px; }
//   .ip-stage-select {
//     width: 100%; height: 42px; padding: 0 13px;
//     border-radius: 8px; border: none; background: #fff;
//     font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
//     color: var(--t1); appearance: none; outline: none; cursor: pointer;
//   }
//   .ip-stage-indicator { display: flex; align-items: center; gap: 7px; margin-top: 8px; font-size: 12px; color: rgba(255,255,255,.65); }
//   .ip-stage-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
//   .ip-stage-note { font-size: 11.5px; color: rgba(255,255,255,.6); background: rgba(255,255,255,.1); padding: 8px 10px; border-radius: 7px; margin-top: 8px; }

//   /* action buttons in hero */
//   .ip-hero-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }

//   /* cleared / rejected status message */
//   .ip-status-msg { text-align: center; color: rgba(255,255,255,.8); padding: 12px 0 4px; }
//   .ip-status-msg svg { margin: 0 auto 6px; display: block; }
//   .ip-status-msg p { font-size: 13px; font-weight: 600; }
//   .ip-status-msg small { font-size: 11.5px; opacity: .7; }

//   /* ══ SUB-CARDS (interview details, timeline, schedule form) ══ */
//   .ip-sub-card {
//     background: var(--card); border: 1px solid var(--border-s);
//     border-radius: 12px; overflow: hidden;
//     box-shadow: 0 1px 4px rgba(0,158,247,.06);
//   }
//   .ip-sub-head {
//     padding: 14px 18px; border-bottom: 1px solid var(--border-s);
//     display: flex; align-items: center; justify-content: space-between;
//   }
//   .ip-sub-title { font-size: 13px; font-weight: 700; color: var(--t1); display: flex; align-items: center; gap: 7px; }
//   .ip-sub-body  { padding: 16px 18px; }

//   /* interview details grid */
//   .ip-det-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
//   .ip-det-full { grid-column: 1 / -1; }
//   .ip-det-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--t3); margin-bottom: 3px; }
//   .ip-det-val   { font-size: 13px; font-weight: 500; color: var(--t1); }
//   .ip-det-link  { color: var(--accent); font-size: 12px; text-decoration: none; word-break: break-all; }
//   .ip-det-link:hover { text-decoration: underline; }

//   .ip-interviewers { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
//   .ip-interviewer-chip { padding: 3px 10px; border-radius: 20px; background: var(--accent-lt); color: var(--t2); font-size: 11.5px; font-weight: 500; border: 1px solid var(--border); }

//   /* timeline items */
//   .ip-timeline-items { display: flex; flex-direction: column; gap: 8px; padding: 14px 18px; }
//   .ip-tl-item { padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-s); background: var(--bg); }
//   .ip-tl-item.current { background: var(--accent-lt); border-color: var(--border); }
//   .ip-tl-item-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
//   .ip-tl-round { font-size: 12.5px; font-weight: 700; color: var(--t1); display: flex; align-items: center; gap: 6px; }
//   .ip-tl-meta  { font-size: 11.5px; color: var(--t3); display: flex; flex-direction: column; gap: 2px; }

//   /* ══ SCHEDULE FORM ══ */
//   .ip-form { padding: 16px 18px; display: flex; flex-direction: column; gap: 14px; }
//   .ip-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
//   .ip-form-label { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--t3); margin-bottom: 5px; display: block; }
//   .ip-form-input {
//     width: 100%; height: 42px; padding: 0 13px;
//     border: 1px solid var(--border); border-radius: 8px;
//     background: var(--bg); font-family: 'Inter', sans-serif;
//     font-size: 13px; color: var(--t1); outline: none; transition: all .15s;
//   }
//   .ip-form-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
//   .ip-form-select-wrap { position: relative; }
//   .ip-form-select-arrow { position: absolute; right: 11px; top: 50%; transform: translateY(-50%) rotate(90deg); color: var(--t3); pointer-events: none; width: 13px; height: 13px; }
//   .ip-form-select {
//     width: 100%; height: 42px; padding: 0 32px 0 13px;
//     border: 1px solid var(--border); border-radius: 8px;
//     background: var(--bg); font-family: 'Inter', sans-serif;
//     font-size: 13px; color: var(--t2); appearance: none; outline: none; cursor: pointer; transition: all .15s;
//   }
//   .ip-form-select:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
//   .ip-form-textarea {
//     width: 100%; padding: 10px 13px; border: 1px solid var(--border); border-radius: 8px;
//     background: var(--bg); font-family: 'Inter', sans-serif; font-size: 13px; color: var(--t1);
//     outline: none; resize: vertical; transition: all .15s; min-height: 80px;
//   }
//   .ip-form-textarea:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
//   .ip-form-btns { display: flex; gap: 10px; }

//   /* ══ EMPTY STATE ══ */
//   .ip-empty { padding: 48px 20px; text-align: center; }
//   .ip-empty-icon { width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 14px; background: var(--accent-lt); color: var(--accent); display: flex; align-items: center; justify-content: center; }
//   .ip-empty-title { font-size: 14px; font-weight: 700; color: var(--t1); margin-bottom: 4px; }
//   .ip-empty-sub   { font-size: 12.5px; color: var(--t3); }

//   /* ══ RESPONSIVE ══ */
//   @media (max-width: 1100px) { .ip-layout { grid-template-columns: 1fr; } }
//   @media (max-width: 900px)  { .ip-stats { grid-template-columns: repeat(3, 1fr); } }
//   @media (max-width: 768px)  {
//     .ip-sb { transform: translateX(calc(-1 * var(--sb-w))); }
//     .ip-sb.open { transform: translateX(0); }
//     .ip-main { margin-left: 0 !important; }
//     .ip-page { padding: 16px; }
//     .ip-header { padding: 0 16px; }
//     .ip-stats { grid-template-columns: repeat(2, 1fr); }
//     .ip-filter-row { flex-direction: column; }
//     .ip-det-grid { grid-template-columns: 1fr; }
//     .ip-form-grid { grid-template-columns: 1fr; }
//   }
// `

// /* ─── types (unchanged) ─── */
// interface Candidate {
//   id: string
//   applicant_name: string
//   email_id: string
//   phone_number: string
//   position: string
//   experience: string
//   skills: string[]
//   resumeScore: number
//   status: string
//   appliedDate: string
//   designation?: string
//   interviewStatus?: string
//   recruitment_stage?: string
//   totalRounds?: number
//   interviewDetails?: {
//     date: string
//     time: string
//     from_time?: string
//     to_time?: string
//     type: "in-person" | "video" | "phone"
//     location?: string
//     meeting_link?: string
//     interviewers: string[]
//     round: number
//     round_name?: string
//     notes?: string
//   }
// }

// export default function InterviewPage() {
//   const router = useRouter()
//   const [candidates, setCandidate] = useState<Candidate[]>([])
//   const [allInterviews, setAllInterviews] = useState<any[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [apiError, setApiError] = useState<string | null>(null)
//   const [filterStatus, setFilterStatus] = useState("all")
//   const [filterDesignation, setFilterDesignation] = useState("all")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   const ITEMS_PER_PAGE = 10
//   const [currentPage, setCurrentPage] = useState(1)

//   // ── ALL ORIGINAL LOGIC UNCHANGED ────────────────────────
//   const fetchJobApplicant = async () => {
//     setIsLoading(true)
//     setApiError(null)
//     try {
//       const applicantsRes = await fetch(
//         `${API_BASE_URL}/api/resource/Job Applicant/?fields=["*"]&limit_page_length=0`,
//         { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
//       )
//       const interviewsRes = await fetch(
//         `${API_BASE_URL}/api/resource/Interview/?fields=["*"]&limit_page_length=0`,
//         { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
//       )
//       if (!applicantsRes.ok) throw new Error(`HTTP error! status: ${applicantsRes.status}`)
//       if (!interviewsRes.ok) throw new Error(`HTTP error! status: ${interviewsRes.status}`)

//       const applicantsData = await applicantsRes.json()
//       const interviewsData = await interviewsRes.json()

//       console.log("API Response:", applicantsData)
//       console.log("Interviews Data:", interviewsData)

//       if (applicantsData && applicantsData.data) {
//         const applicants = applicantsData.data
//         const interviewsRaw = interviewsData.data || []
//         console.log("Raw Interviews data:", interviewsRaw)

//         const interviews = await Promise.all(
//           interviewsRaw.map(async (interview: any) => {
//             try {
//               const detailsRes = await fetch(
//                 `${API_BASE_URL}/api/resource/Interview Detail?filters=[["parent","=","${interview.name}"]]&fields=["interviewer"]`,
//                 { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
//               )
//               const detailsData = await detailsRes.json()
//               console.log(`Raw Interview Detail response for ${interview.name}:`, detailsData)
//               console.log(`Interview Detail data structure:`, detailsData.data)
//               if (detailsData.data && detailsData.data.length > 0) {
//                 console.log(`First Interview Detail record:`, detailsData.data[0])
//                 console.log(`Available fields in first record:`, Object.keys(detailsData.data[0]))
//               }
//               const interviewers = detailsData.data?.map((d: any) => d.interviewer) || []
//               console.log(`Extracted interviewers for ${interview.name}:`, interviewers)
//               return { ...interview, interviewers }
//             } catch (error) {
//               console.error("Error fetching interview details for", interview.name, error)
//               return { ...interview, interviewers: [] }
//             }
//           })
//         )

//         console.log("Interviews with interviewers:", interviews)
//         setAllInterviews(interviews)

//         const mappedData = applicants.map((item: any) => {
//           const applicantInterviews = interviews.filter((int: any) =>
//             int.job_applicant === item.name || int.job_applicant === item.email_id
//           )
//           const interview = applicantInterviews.length > 0
//             ? applicantInterviews.sort((a: any, b: any) => new Date(b.scheduled_on || b.creation).getTime() - new Date(a.scheduled_on || a.creation).getTime())[0]
//             : null
//           const totalRounds = applicantInterviews.length
//           return {
//             id: item.name || item.id,
//             applicant_name: item.applicant_name || "Unknown",
//             email_id: item.email_id || "", phone_number: item.phone_number || "",
//             position: item.job_title || item.designation || "Not specified",
//             designation: item.designation || "", experience: item.experience || "N/A",
//             skills: item.skills ? (Array.isArray(item.skills) ? item.skills : []) : [],
//             resumeScore: item.resume_score || 0, status: item.status || "Open",
//             interviewStatus: interview ? interview.status : null,
//             recruitment_stage: item.custom_recruitment_stage || "",
//             appliedDate: item.creation || item.applied_date || new Date().toISOString().split('T')[0],
//             totalRounds,
//             interviewDetails: interview ? {
//               date: interview.scheduled_on || "", time: `${interview.from_time || ""} - ${interview.to_time || ""}`,
//               from_time: interview.from_time || "", to_time: interview.to_time || "",
//               type: interview.type || "video",
//               location: interview.custom_location || interview.location || "",
//               meeting_link: interview.google_meet || interview.meeting_link || "",
//               interviewers: interview.interviewers || [],
//               round: interview.round || 1, round_name: interview.interview_round || "",
//               notes: interview.notes || ""
//             } : undefined
//           }
//         })

//         const sortedData = mappedData.sort((a: any, b: any) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
//         setCandidate(sortedData)
//         console.log("Mapped candidates:", sortedData)
//       }
//     } catch (error: any) {
//       console.error("Error fetching job applicants:", error)
//       setApiError("Network error: Unable to reach server. Please check if the API server is running.")
//     } finally { setIsLoading(false) }
//   }

//   useEffect(() => { fetchJobApplicant() }, [])
//   useEffect(() => { document.title = 'Interview' }, [])

//   const uniqueDesignations = Array.from(
//     new Set(candidates.map(c => c.designation).filter((d): d is string => Boolean(d) && d.trim() !== ''))
//   )
//   const allStatusesSet = new Set<string>()
//   candidates.forEach(c => {
//     if (c.interviewStatus && c.interviewStatus.trim() !== '') allStatusesSet.add(c.interviewStatus)
//     if (c.status && c.status.trim() !== '') allStatusesSet.add(c.status)
//   })
//   const uniqueStatuses = Array.from(allStatusesSet)

//   const filteredCandidates = candidates.filter(candidate => {
//     const candidateStatus = candidate.interviewStatus || candidate.status
//     const statusMatch = filterStatus === "all" || candidateStatus === filterStatus
//     const designationMatch = filterDesignation === "all" || candidate.designation === filterDesignation
//     const searchMatch = searchTerm === "" ||
//       candidate.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       candidate.email_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       candidate.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
//     return statusMatch && designationMatch && searchMatch
//   })

//   const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE)
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
//   const endIndex = startIndex + ITEMS_PER_PAGE
//   const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex)
//   useEffect(() => { setCurrentPage(1) }, [filterStatus, filterDesignation, searchTerm])

//   const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
//   const [showScheduleForm, setShowScheduleForm] = useState(false)
//   const [interviewForm, setInterviewForm] = useState({
//     date: "", time: "", type: "video" as "in-person" | "video" | "phone",
//     location: "", interviewers: [] as string[], round: 1, duration: "60", notes: "",
//   })

//   const getStatusColor = (status: string) => {
//     const n = status?.toLowerCase().trim() || ""
//     if (n.includes("cleared") || n.includes("accept") || n.includes("hired")) return "green"
//     if (n.includes("open") || n.includes("replied") || n.includes("hold") || n.includes("under review")) return "blue"
//     if (n.includes("reject")) return "red"
//     return "yellow"
//   }

//   const getStatusText = (status: string) => {
//     if (!status) return "Pending"
//     return status.charAt(0).toUpperCase() + status.slice(1)
//   }

//   const getStatusIcon = (status: string) => {
//     const n = status?.toLowerCase().trim() || ""
//     if (n.includes("cleared") || n.includes("accept") || n.includes("hired")) return <CheckCircle size={12} />
//     if (n.includes("open") || n.includes("replied") || n.includes("hold") || n.includes("under review")) return <Clock size={12} />
//     if (n.includes("reject")) return <XCircle size={12} />
//     return <AlertCircle size={12} />
//   }

//   const handleScheduleInterview = () => {
//     console.log("Scheduling interview for:", selectedCandidate?.applicant_name, interviewForm)
//     setShowScheduleForm(false)
//     setInterviewForm({ date: "", time: "", type: "video", location: "", interviewers: [], round: 1, duration: "60", notes: "" })
//   }

//   const handleInterviewerToggle = (interviewer: string) => {
//     setInterviewForm(prev => ({
//       ...prev,
//       interviewers: prev.interviewers.includes(interviewer)
//         ? prev.interviewers.filter(i => i !== interviewer)
//         : [...prev.interviewers, interviewer],
//     }))
//   }

//   const handleRecruitmentStageChange = async (candidateId: string, newStage: string) => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/method/your_app_name.your_module.interview_api.update_recruitment_stage`,
//         {
//           method: 'POST', credentials: 'include',
//           headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
//           body: JSON.stringify({ applicant_id: candidateId, recruitment_stage: newStage })
//         }
//       )
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
//       const result = await response.json()
//       console.log("Recruitment stage updated:", result)
//       setCandidate(prev => prev.map(c => c.id === candidateId ? { ...c, recruitment_stage: newStage } : c))
//       if (selectedCandidate?.id === candidateId) setSelectedCandidate(prev => prev ? { ...prev, recruitment_stage: newStage } : null)
//       alert(`Recruitment stage updated to: ${newStage}. Email will be sent automatically.`)
//     } catch (error) {
//       console.error("Error updating recruitment stage:", error)
//       alert("Failed to update recruitment stage. Please try again.")
//     }
//   }
//   // ────────────────────────────────────────────────────────

//   const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

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
//       <div className="ip">
//         <div className="ip-wrap">

//           {/* Overlay — mobile only */}
//           <div className={`ip-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

//           {/* ══ SIDEBAR ══ */}
//           <aside className={`ip-sb${sidebarOpen ? "" : " collapsed"}`}>
//             <div className="ip-sb-brand">
//               <div className="ip-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
//               <div>
//                 <div className="ip-sb-name">Job Management</div>
//                 <div className="ip-sb-sub">HR Platform</div>
//               </div>
//               <button className="ip-sb-close" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
//             </div>
//             <nav className="ip-nav">
//               <Link href="/create-job" className="ip-nav-cta"><Plus size={14} /> New Job Opening</Link>
//               <div className="ip-nav-lbl">Pipeline</div>
//               {sidebarPipeline.map(s => (
//                 <Link key={s.href} href={s.href} className={`ip-nav-link${s.href === "/interview" ? " active" : ""}`}>
//                   {s.icon} {s.title}
//                 </Link>
//               ))}
//               <div className="ip-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
//               {sidebarClosing.map(s => (
//                 <Link key={s.href} href={s.href} className="ip-nav-link">{s.icon} {s.title}</Link>
//               ))}
//             </nav>
//             <div className="ip-sb-foot">
//               <button className="ip-logout"><LogOut size={15} /> Sign out</button>
//             </div>
//           </aside>

//           {/* ══ MAIN ══ */}
//           <div className={`ip-main${sidebarOpen ? "" : " sb-closed"}`}>

//             {/* Header */}
//             <header className="ip-header">
//               <button className="ip-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
//               <div className="ip-hdr-sep" />
//               <Link href="/home" className="ip-btn-back">
//                 <ArrowLeft size={13} /> Back
//               </Link>
//               <div className="ip-hdr-sep" />
//               <div className="ip-crumb">
//                 <Home size={13} /> Home <ChevronRight size={13} /> <strong>Interview Management</strong>
//               </div>
//             </header>

//             {/* Page */}
//             <div className="ip-page">

//               {/* Title */}
//               <div className="ip-toolbar">
//                 <div>
//                   <h1 className="ip-page-title">Interview Management</h1>
//                   <p className="ip-page-sub">Schedule and manage candidate interviews</p>
//                 </div>
//               </div>

//               {/* Error */}
//               {apiError && (
//                 <div className="ip-error">
//                   <AlertCircle size={16} />
//                   <div>
//                     <div className="ip-error-title">API Connection Error</div>
//                     <div className="ip-error-msg">{apiError}</div>
//                     <div className="ip-error-hint">Please check your API configuration.</div>
//                   </div>
//                 </div>
//               )}

//               {/* Stats */}
//               <div className="ip-stats">
//                 {[
//                   { label: "Open", val: candidates.filter(c => c.status === "Open" || c.interviewStatus === "Open").length, cls: "blue", icon: <Clock size={16} /> },
//                   { label: "Pending", val: candidates.filter(c => c.status === "Pending" || c.interviewStatus === "Pending").length, cls: "gray", icon: <AlertCircle size={16} /> },
//                   { label: "Under Review", val: candidates.filter(c => c.interviewStatus === "Under Review").length, cls: "yellow", icon: <AlertCircle size={16} /> },
//                   { label: "Cleared", val: candidates.filter(c => c.interviewStatus === "Cleared").length, cls: "green", icon: <CheckCircle size={16} /> },
//                   { label: "Rejected", val: candidates.filter(c => c.interviewStatus === "Rejected").length, cls: "red", icon: <XCircle size={16} /> },
//                 ].map(s => (
//                   <div key={s.label} className="ip-stat">
//                     <div className="ip-stat-top">
//                       <div className="ip-stat-label">{s.label}</div>
//                       <div className={`ip-stat-icon ${s.cls}`}>{s.icon}</div>
//                     </div>
//                     <div className={`ip-stat-val ${s.cls}`}>{s.val}</div>
//                   </div>
//                 ))}
//               </div>

//               {/* Layout */}
//               <div className="ip-layout">

//                 {/* LEFT — candidate list */}
//                 <div className="ip-panel">
//                   <div className="ip-panel-head">
//                     <div className="ip-panel-title-row">
//                       <div className="ip-panel-title">
//                         <Users size={15} style={{ color: 'var(--accent)' }} />
//                         Candidates ({filteredCandidates.length})
//                         {isLoading && <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 400 }}>(Loading...)</span>}
//                       </div>
//                       {/* Filters — same as original, placed to right of title */}
//                       <div className="ip-filter-row">
//                         <div className="ip-select-wrap">
//                           <select className="ip-select" value={filterDesignation} onChange={e => setFilterDesignation(e.target.value)}>
//                             <option value="all">Designations</option>
//                             {uniqueDesignations.map(d => <option key={d} value={d}>{d}</option>)}
//                           </select>
//                           <ChevronRight size={13} className="ip-select-arrow" />
//                         </div>
//                         <div className="ip-select-wrap">
//                           <select className="ip-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
//                             <option value="all">Status</option>
//                             {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
//                           </select>
//                           <ChevronRight size={13} className="ip-select-arrow" />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Search */}
//                     <div className="ip-search-wrap">
//                       <Search size={15} />
//                       <input
//                         type="text"
//                         className="ip-search"
//                         placeholder="Search by name, email, phone, or job title..."
//                         value={searchTerm}
//                         onChange={e => setSearchTerm(e.target.value)}
//                       />
//                     </div>
//                   </div>

//                   {/* Cards */}
//                   <div className="ip-cards">
//                     {paginatedCandidates.map((candidate, index) => {
//                       const statusCls = getStatusColor(candidate.interviewStatus || candidate.status)
//                       return (
//                         <div
//                           key={index}
//                           className={`ip-candidate-card${selectedCandidate?.id === candidate.id ? " selected" : ""}`}
//                           onClick={() => setSelectedCandidate(candidate)}
//                         >
//                           <div className="ip-card-top">
//                             <div className="ip-avatar">{getInitials(candidate.applicant_name)}</div>
//                             <div className="ip-card-info">
//                               <div className="ip-card-name">{candidate.applicant_name}</div>
//                               <div className="ip-card-pos">{candidate.position}</div>
//                               <div className="ip-card-contacts">
//                                 <div className="ip-card-contact"><Mail size={11} /> {candidate.email_id}</div>
//                                 <div className="ip-card-contact"><Phone size={11} /> {candidate.phone_number}</div>
//                               </div>
//                               <div className="ip-card-meta">
//                                 {candidate.designation && <span className="ip-card-meta-item">{candidate.designation}</span>}
//                                 <span className="ip-card-meta-item">{candidate.interviewDetails?.round_name || (candidate.interviewStatus || candidate.status)}</span>
//                               </div>
//                             </div>
//                             <div className="ip-card-right">
//                               <span className={`ip-badge ${statusCls}`}>
//                                 {getStatusIcon(candidate.interviewStatus || candidate.status)}
//                                 {getStatusText(candidate.interviewStatus || candidate.status)}
//                               </span>
//                               {candidate.resumeScore > 0 && (
//                                 <div style={{ textAlign: 'right' }}>
//                                   <div className="ip-card-score">{candidate.resumeScore}%</div>
//                                   <div className="ip-card-score-lbl">Match Score</div>
//                                 </div>
//                               )}

//                               {/* Action buttons — all logic unchanged */}
//                               {/* {(() => {
//                                 const currentStatus = candidate.interviewStatus || candidate.status
//                                 // if (currentStatus === "Rejected") {
//                                 //   return (
//                                 //     <button className="ip-btn-sm-green" onClick={e => {
//                                 //       e.stopPropagation()
//                                 //       router.push(`/candidate-feedback?candidateId=${encodeURIComponent(candidate.id)}&candidateName=${encodeURIComponent(candidate.applicant_name)}&candidateEmail=${encodeURIComponent(candidate.email_id)}`)
//                                 //     }}>
//                                 //       Candidate Feedback
//                                 //     </button>
//                                 //   )
//                                 // }
//                                 if (currentStatus === "Rejected") {
//                                   return (
//                                     <button className="ip-btn-sm-green" onClick={e => {
//                                       e.stopPropagation()
//                                       const latestInterview = allInterviews
//                                         .filter(i => i.job_applicant === candidate.id)
//                                         .sort((a, b) => new Date(b.scheduled_on || b.creation).getTime() - new Date(a.scheduled_on || a.creation).getTime())[0]
//                                       router.push(
//                                         `/candidate-feedback` +
//                                         `?candidateId=${encodeURIComponent(candidate.id)}` +
//                                         `&candidateName=${encodeURIComponent(candidate.applicant_name)}` +
//                                         `&candidateEmail=${encodeURIComponent(candidate.email_id)}` +
//                                         `&interviewName=${encodeURIComponent(latestInterview?.name || "")}` +
//                                         `&interviewer=${encodeURIComponent(latestInterview?.interviewers?.[0] || "")}`
//                                       )
//                                     }}>
//                                       Candidate Feedback
//                                     </button>
//                                   )
//                                 }
//                                 if (currentStatus === "Cleared") {
//                                   return (
//                                     <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//                                       <button className="ip-btn-sm-green" onClick={e => {
//                                         e.stopPropagation()
//                                         const latestInterview = allInterviews
//                                           .filter(i => i.job_applicant === candidate.id)
//                                           .sort((a, b) => new Date(b.scheduled_on || b.creation).getTime() - new Date(a.scheduled_on || a.creation).getTime())[0]
//                                         router.push(
//                                           `/candidate-feedback` +
//                                           `?candidateId=${encodeURIComponent(candidate.id)}` +
//                                           `&candidateName=${encodeURIComponent(candidate.applicant_name)}` +
//                                           `&candidateEmail=${encodeURIComponent(candidate.email_id)}` +
//                                           `&interviewName=${encodeURIComponent(latestInterview?.name || "")}` +
//                                           `&interviewer=${encodeURIComponent(latestInterview?.interviewers?.[0] || "")}`
//                                         )
//                                       }}>
//                                         Candidate Feedback
//                                       </button>
//                                       <button className="ip-btn-sm-blue" onClick={e => {
//                                         e.stopPropagation()
//                                         router.push(`/Event?applicantId=${encodeURIComponent(candidate.id)}&applicantName=${encodeURIComponent(candidate.applicant_name)}&applicantEmail=${encodeURIComponent(candidate.email_id)}`)
//                                       }}>
//                                         Interview Schedule
//                                       </button>
//                                     </div>
//                                   )
//                                 }
//                                 return (
//                                   <button className="ip-btn-sm-blue" onClick={e => {
//                                     e.stopPropagation()
//                                     router.push(`/Event?applicantId=${encodeURIComponent(candidate.id)}&applicantName=${encodeURIComponent(candidate.applicant_name)}&applicantEmail=${encodeURIComponent(candidate.email_id)}`)
//                                   }}>
//                                     Interview Schedule
//                                   </button>
//                                 )
//                               })()} */}

//                               {(() => {
//                                 const currentStatus = candidate.interviewStatus || candidate.status

//                                 if (currentStatus === "Rejected") {
//                                   return (
//                                     <button className="ip-btn-sm-green" onClick={e => {
//                                       e.stopPropagation()
//                                       const latestInterview = allInterviews
//                                         .filter(i => i.job_applicant === candidate.id)
//                                         .sort((a, b) => new Date(b.scheduled_on || b.creation).getTime() - new Date(a.scheduled_on || a.creation).getTime())[0]
//                                       router.push(
//                                         `/candidate-feedback` +
//                                         `?candidateId=${encodeURIComponent(candidate.id)}` +
//                                         `&candidateName=${encodeURIComponent(candidate.applicant_name)}` +
//                                         `&candidateEmail=${encodeURIComponent(candidate.email_id)}` +
//                                         `&interviewName=${encodeURIComponent(latestInterview?.name || "")}` +
//                                         `&interviewer=${encodeURIComponent(latestInterview?.interviewers?.[0] || "")}`
//                                       )
//                                     }}>
//                                       Candidate Feedback
//                                     </button>
//                                   )
//                                 }

//                                 if (currentStatus === "Cleared") {
//                                   return (
//                                     <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//                                       <button className="ip-btn-sm-green" onClick={e => {
//                                         e.stopPropagation()
//                                         const latestInterview = allInterviews
//                                           .filter(i => i.job_applicant === candidate.id)
//                                           .sort((a, b) => new Date(b.scheduled_on || b.creation).getTime() - new Date(a.scheduled_on || a.creation).getTime())[0]
//                                         router.push(
//                                           `/candidate-feedback` +
//                                           `?candidateId=${encodeURIComponent(candidate.id)}` +
//                                           `&candidateName=${encodeURIComponent(candidate.applicant_name)}` +
//                                           `&candidateEmail=${encodeURIComponent(candidate.email_id)}` +
//                                           `&interviewName=${encodeURIComponent(latestInterview?.name || "")}` +
//                                           `&interviewer=${encodeURIComponent(latestInterview?.interviewers?.[0] || "")}`
//                                         )
//                                       }}>
//                                         Candidate Feedback
//                                       </button>
//                                       <button className="ip-btn-sm-blue" onClick={e => {
//                                         e.stopPropagation()
//                                         router.push(`/Event?applicantId=${encodeURIComponent(candidate.id)}&applicantName=${encodeURIComponent(candidate.applicant_name)}&applicantEmail=${encodeURIComponent(candidate.email_id)}`)
//                                       }}>
//                                         Interview Schedule
//                                       </button>
//                                     </div>
//                                   )
//                                 }

//                                 // ── NEW: Reschedule for candidates with a Pending interview ──
//                                 if (currentStatus === "Pending") {
//                                   return (
//                                     <button className="ip-btn-sm-blue" style={{ background: 'var(--yellow)', borderColor: 'var(--yellow)' }} onClick={e => {
//                                       e.stopPropagation()
//                                       router.push(
//                                         `/Event?applicantId=${encodeURIComponent(candidate.id)}` +
//                                         `&applicantName=${encodeURIComponent(candidate.applicant_name)}` +
//                                         `&applicantEmail=${encodeURIComponent(candidate.email_id)}`
//                                       )
//                                     }}>
//                                       Reschedule
//                                     </button>
//                                   )
//                                 }

//                                 return (
//                                   <button className="ip-btn-sm-blue" onClick={e => {
//                                     e.stopPropagation()
//                                     router.push(`/Event?applicantId=${encodeURIComponent(candidate.id)}&applicantName=${encodeURIComponent(candidate.applicant_name)}&applicantEmail=${encodeURIComponent(candidate.email_id)}`)
//                                   }}>
//                                     Interview Schedule
//                                   </button>
//                                 )
//                               })()}
//                             </div>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>

//                   {/* Pagination */}
//                   {filteredCandidates.length > 0 && (
//                     <div className="ip-pagination">
//                       <span>Showing {startIndex + 1} to {Math.min(endIndex, filteredCandidates.length)} of {filteredCandidates.length} candidates</span>
//                       <div className="ip-pag-btns">
//                         <button className="ip-btn-sm-outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
//                           <ChevronLeft size={13} /> Previous
//                         </button>
//                         <span className="ip-pag-cur">Page {currentPage} of {totalPages}</span>
//                         <button className="ip-btn-sm-outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
//                           Next <ChevronRight size={13} />
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* RIGHT — detail panel */}
//                 <div className="ip-detail-sticky">
//                   <div className="ip-detail">
//                     {selectedCandidate ? (
//                       <>
//                         {/* Management hero */}
//                         <div className="ip-mgmt-hero">
//                           <div className="ip-mgmt-hero-head">
//                             <Calendar size={14} />
//                             <span className="ip-mgmt-hero-title">Interview Management</span>
//                           </div>
//                           <div className="ip-mgmt-hero-sub">For {selectedCandidate.applicant_name}</div>

//                           {/* Recruitment Stage */}
//                           <div className="ip-stage-box">
//                             <div className="ip-stage-label">Recruitment Stage</div>
//                             <select
//                               className="ip-stage-select"
//                               value={selectedCandidate.recruitment_stage || ""}
//                               onChange={e => handleRecruitmentStageChange(selectedCandidate.id, e.target.value)}
//                               disabled={selectedCandidate.interviewStatus !== "Cleared" && selectedCandidate.recruitment_stage !== "Document Upload Requested"}
//                             >
//                               <option value="">Select Stage</option>
//                               <option value="Document Upload Requested">Document Upload Requested</option>
//                               <option value="Document Verified">Document Verified</option>
//                             </select>

//                             {selectedCandidate.recruitment_stage && (
//                               <div className="ip-stage-indicator">
//                                 <div className="ip-stage-dot" style={{
//                                   background: selectedCandidate.recruitment_stage === "Document Verified" ? "#4ade80" : "#fbbf24"
//                                 }} />
//                                 <span>
//                                   {selectedCandidate.recruitment_stage === "Document Verified"
//                                     ? "Documents verified and ready"
//                                     : "Waiting for document upload"}
//                                 </span>
//                               </div>
//                             )}

//                             {selectedCandidate.interviewStatus === "Cleared" &&
//                               selectedCandidate.recruitment_stage !== "Document Verified" && (
//                                 <div className="ip-stage-note">
//                                   💡 Interview cleared! You can now request document upload or verify documents.
//                                 </div>
//                               )}
//                           </div>

//                           {/* Action buttons */}
//                           <div className="ip-hero-actions">
//                             {(selectedCandidate.status === "Open" || selectedCandidate.interviewStatus === "Open") && (
//                               <button className="ip-btn-white" onClick={() => setShowScheduleForm(true)}>
//                                 <Plus size={14} /> Schedule Interview
//                               </button>
//                             )}
//                             {selectedCandidate.interviewStatus === "Under Review" && (
//                               <>
//                                 <button className="ip-btn-white" onClick={() => setShowScheduleForm(true)}>
//                                   <Edit size={14} /> Reschedule Interview
//                                 </button>
//                                 <button className="ip-btn-green-glass">
//                                   <CheckCircle size={14} /> Mark as Completed
//                                 </button>
//                               </>
//                             )}
//                             {selectedCandidate.interviewStatus === "Cleared" && (
//                               <div className="ip-status-msg">
//                                 <CheckCircle size={28} />
//                                 <p>Interview Cleared</p>
//                                 <small>Proceed with document verification</small>
//                               </div>
//                             )}
//                             {selectedCandidate.interviewStatus === "Rejected" && (
//                               <div className="ip-status-msg">
//                                 <XCircle size={28} />
//                                 <p>Interview Rejected</p>
//                               </div>
//                             )}
//                           </div>
//                         </div>

//                         {/* Interview Details */}
//                         {selectedCandidate.interviewDetails && (
//                           <div className="ip-sub-card">
//                             <div className="ip-sub-head">
//                               <div className="ip-sub-title"><Calendar size={14} /> Interview Details</div>
//                             </div>
//                             <div className="ip-sub-body">
//                               <div className="ip-det-grid">
//                                 <div className="ip-det-full">
//                                   <div className="ip-det-label">Scheduled</div>
//                                   <div className="ip-det-val">
//                                     {new Date(selectedCandidate.interviewDetails.date).toLocaleDateString('en-GB')}
//                                     {selectedCandidate.interviewDetails.from_time && selectedCandidate.interviewDetails.to_time &&
//                                       ` at ${selectedCandidate.interviewDetails.from_time} - ${selectedCandidate.interviewDetails.to_time}`}
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <div className="ip-det-label">Type</div>
//                                   <div className="ip-det-val" style={{ textTransform: 'capitalize' }}>{selectedCandidate.interviewDetails.type}</div>
//                                 </div>
//                                 <div>
//                                   <div className="ip-det-label">Round</div>
//                                   <div className="ip-det-val">{selectedCandidate.interviewDetails.round_name || `Round ${selectedCandidate.interviewDetails.round}`}</div>
//                                 </div>
//                                 {selectedCandidate.interviewDetails.location && (
//                                   <div className="ip-det-full">
//                                     <div className="ip-det-label">Location</div>
//                                     <div className="ip-det-val">{selectedCandidate.interviewDetails.location}</div>
//                                   </div>
//                                 )}
//                                 {selectedCandidate.interviewDetails.meeting_link && (
//                                   <div className="ip-det-full">
//                                     <div className="ip-det-label">Meeting Link</div>
//                                     <a href={selectedCandidate.interviewDetails.meeting_link} target="_blank" rel="noopener noreferrer" className="ip-det-link">
//                                       {selectedCandidate.interviewDetails.meeting_link}
//                                     </a>
//                                   </div>
//                                 )}
//                               </div>

//                               <div style={{ marginTop: 12 }}>
//                                 <div className="ip-det-label">Interviewers</div>
//                                 {console.log("Interviewers array:", selectedCandidate.interviewDetails.interviewers) as any}
//                                 {selectedCandidate.interviewDetails.interviewers && selectedCandidate.interviewDetails.interviewers.length > 0 ? (
//                                   <div className="ip-interviewers">
//                                     {selectedCandidate.interviewDetails.interviewers.map((iv, idx) => (
//                                       <span key={idx} className="ip-interviewer-chip">{iv}</span>
//                                     ))}
//                                   </div>
//                                 ) : (
//                                   <div style={{ fontSize: 12.5, color: 'var(--t3)', marginTop: 4 }}>No interviewers assigned</div>
//                                 )}
//                               </div>

//                               {selectedCandidate.interviewDetails.notes && (
//                                 <div style={{ marginTop: 12 }}>
//                                   <div className="ip-det-label">Notes</div>
//                                   <div className="ip-det-val" style={{ marginTop: 3 }}>{selectedCandidate.interviewDetails.notes}</div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         )}

//                         {/* Interview Timeline */}
//                         {selectedCandidate && selectedCandidate.totalRounds && selectedCandidate.totalRounds > 1 && (() => {
//                           const candidateInterviews = allInterviews
//                             .filter((int: any) => int.job_applicant === selectedCandidate.id)
//                             .sort((a: any, b: any) => new Date(a.scheduled_on || a.creation).getTime() - new Date(b.scheduled_on || b.creation).getTime())
//                           return (
//                             <div className="ip-sub-card">
//                               <div className="ip-sub-head">
//                                 <div className="ip-sub-title"><Calendar size={14} /> Interview Timeline</div>
//                                 <span className="ip-badge outline">{selectedCandidate.totalRounds} Rounds</span>
//                               </div>
//                               <div className="ip-timeline-items">
//                                 {candidateInterviews.map((interview: any, index: number) => {
//                                   const isCurrent = index === candidateInterviews.length - 1
//                                   return (
//                                     <div key={interview.name} className={`ip-tl-item${isCurrent ? " current" : ""}`}>
//                                       <div className="ip-tl-item-head">
//                                         <div className="ip-tl-round">
//                                           {interview.interview_round}
//                                           {isCurrent && <span className="ip-badge blue-solid" style={{ fontSize: 10, padding: '2px 7px' }}>Current</span>}
//                                         </div>
//                                         <span className={`ip-badge ${getStatusColor(interview.status)}`}>{interview.status}</span>
//                                       </div>
//                                       <div className="ip-tl-meta">
//                                         <span>📅 {interview.scheduled_on} at {interview.from_time} - {interview.to_time}</span>
//                                         {interview.custom_location && <span>📍 {interview.custom_location}</span>}
//                                       </div>
//                                     </div>
//                                   )
//                                 })}
//                               </div>
//                             </div>
//                           )
//                         })()}

//                         {/* Schedule Form */}
//                         {showScheduleForm && (
//                           <div className="ip-sub-card">
//                             <div className="ip-sub-head">
//                               <div className="ip-sub-title">Schedule Interview</div>
//                             </div>
//                             <div className="ip-form">
//                               <div className="ip-form-grid">
//                                 <div>
//                                   <label className="ip-form-label">Date</label>
//                                   <input type="date" className="ip-form-input" value={interviewForm.date} onChange={e => setInterviewForm({ ...interviewForm, date: e.target.value })} />
//                                 </div>
//                                 <div>
//                                   <label className="ip-form-label">Time</label>
//                                   <input type="time" className="ip-form-input" value={interviewForm.time} onChange={e => setInterviewForm({ ...interviewForm, time: e.target.value })} />
//                                 </div>
//                               </div>

//                               <div>
//                                 <label className="ip-form-label">Interview Type</label>
//                                 <div className="ip-form-select-wrap">
//                                   <select className="ip-form-select" value={interviewForm.type} onChange={e => setInterviewForm({ ...interviewForm, type: e.target.value as any })}>
//                                     <option value="video">Video Call</option>
//                                     <option value="in-person">In-Person</option>
//                                     <option value="phone">Phone Call</option>
//                                   </select>
//                                   <ChevronRight size={13} className="ip-form-select-arrow" />
//                                 </div>
//                               </div>

//                               {interviewForm.type === "in-person" && (
//                                 <div>
//                                   <label className="ip-form-label">Location</label>
//                                   <input type="text" className="ip-form-input" value={interviewForm.location} onChange={e => setInterviewForm({ ...interviewForm, location: e.target.value })} placeholder="Conference Room A" />
//                                 </div>
//                               )}

//                               <div className="ip-form-grid">
//                                 <div>
//                                   <label className="ip-form-label">Interview Round</label>
//                                   <div className="ip-form-select-wrap">
//                                     <select className="ip-form-select" value={interviewForm.round.toString()} onChange={e => setInterviewForm({ ...interviewForm, round: parseInt(e.target.value) })}>
//                                       <option value="1">Round 1 - Technical</option>
//                                       <option value="2">Round 2 - Managerial</option>
//                                       <option value="3">Round 3 - HR</option>
//                                     </select>
//                                     <ChevronRight size={13} className="ip-form-select-arrow" />
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <label className="ip-form-label">Duration (minutes)</label>
//                                   <div className="ip-form-select-wrap">
//                                     <select className="ip-form-select" value={interviewForm.duration} onChange={e => setInterviewForm({ ...interviewForm, duration: e.target.value })}>
//                                       <option value="30">30 minutes</option>
//                                       <option value="45">45 minutes</option>
//                                       <option value="60">60 minutes</option>
//                                       <option value="90">90 minutes</option>
//                                     </select>
//                                     <ChevronRight size={13} className="ip-form-select-arrow" />
//                                   </div>
//                                 </div>
//                               </div>

//                               <div>
//                                 <label className="ip-form-label">Additional Notes</label>
//                                 <textarea
//                                   className="ip-form-textarea"
//                                   value={interviewForm.notes}
//                                   onChange={e => setInterviewForm({ ...interviewForm, notes: e.target.value })}
//                                   placeholder="Any special instructions or notes..."
//                                   rows={3}
//                                 />
//                               </div>

//                               <div className="ip-form-btns">
//                                 <button className="ip-btn-accent" style={{ flex: 1 }} onClick={handleScheduleInterview}>
//                                   Schedule Interview
//                                 </button>
//                                 <button className="ip-form-btn-cancel" onClick={() => setShowScheduleForm(false)}>
//                                   Cancel
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </>
//                     ) : (
//                       <div className="ip-sub-card">
//                         <div className="ip-empty">
//                           <div className="ip-empty-icon"><Calendar size={26} /></div>
//                           <p className="ip-empty-title">Select a Candidate</p>
//                           <p className="ip-empty-sub">Choose a candidate to schedule or manage their interview.</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>{/* /ip-detail-sticky */}

//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   )
// }














"use client"
import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Plus,
  Edit,
  Edit2,
  Check,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  Menu,
  X,
  Home,
  LogOut,
  Upload,
  Briefcase,
  MessageSquare,
  Zap,
  UserCheck,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from '@/lib/api-config'
import { getFrappeCSRF } from '@/lib/csrf'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ip {
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

    --green:     #16a34a;
    --green-lt:  #dcfce7;
    --green-bdr: #bbf7d0;
    --red:       #dc2626;
    --red-lt:    #fee2e2;
    --red-bdr:   #fecaca;
    --yellow:    #d97706;
    --yellow-lt: #fef9c3;
    --yellow-bdr:#fde68a;
    --gray-lt:   #f3f4f6;
    --gray-bdr:  #e5e7eb;

    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13.5px;
    -webkit-font-smoothing: antialiased;
  }

  .ip-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  /* ══ SIDEBAR ══ */
  .ip-sb {
    width: var(--sb-w); background: var(--sb);
    min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 100;
    display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .ip-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }

  .ip-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }
  .ip-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; flex-shrink: 0;
  }
  .ip-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .ip-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; line-height: 1.25; }
  .ip-sb-sub  { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }
  .ip-sb-close {
    margin-left: auto; flex-shrink: 0; width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer; color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center; transition: all .14s;
  }
  .ip-sb-close:hover { background: var(--sb-hover); color: #fff; }

  .ip-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .ip-nav::-webkit-scrollbar { width: 3px; }
  .ip-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }

  .ip-nav-cta {
    display: flex; align-items: center; gap: 9px;
    padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    color: var(--accent); font-size: 13px; font-weight: 600;
    text-decoration: none; transition: background .15s; margin-bottom: 22px;
  }
  .ip-nav-cta:hover { background: rgba(0,158,247,.24); }

  .ip-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
  }
  .ip-nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt);
    text-decoration: none; transition: all .14s;
  }
  .ip-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; }
  .ip-nav-link:hover { background: var(--sb-hover); color: #fff; }
  .ip-nav-link:hover svg { opacity: 1; }
  .ip-nav-link.active { background: var(--sb-hover); color: #fff; }
  .ip-nav-link.active svg { opacity: 1; }

  .ip-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .ip-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; border-radius: 8px; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--sb-lbl); text-align: left; transition: all .14s;
  }
  .ip-logout svg { opacity: .6; width: 15px; height: 15px; }
  .ip-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }

  .ip-overlay {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
  }
  @media (max-width: 768px) { .ip-overlay.show { display: block; } }

  /* ══ MAIN ══ */
  .ip-main {
    margin-left: var(--sb-w); flex: 1;
    display: flex; flex-direction: column; min-height: 100vh;
    transition: margin-left .25s cubic-bezier(.4,0,.2,1);
  }
  .ip-main.sb-closed { margin-left: 0; }

  /* ══ HEADER ══ */
  .ip-header {
    height: 60px; background: #fff; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 1px 0 rgba(0,158,247,.08);
  }
  .ip-toggle {
    width: 34px; height: 34px; border-radius: 8px;
    background: none; border: 1px solid var(--border);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .ip-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .ip-btn-back {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    background: transparent; color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer; text-decoration: none;
    transition: all .14s; white-space: nowrap;
  }
  .ip-btn-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .ip-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .ip-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
  .ip-crumb svg { width: 13px; height: 13px; }
  .ip-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }
  .ip-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }

  /* ══ BUTTONS ══ */
  .ip-btn-out {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 14px; border-radius: 8px;
    background: transparent; color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer; text-decoration: none;
    transition: all .14s; white-space: nowrap;
  }
  .ip-btn-out:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

  .ip-btn-sm-outline {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 7px;
    font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 500;
    background: transparent; color: var(--t2); border: 1px solid var(--border);
    cursor: pointer; transition: all .14s; white-space: nowrap;
  }
  .ip-btn-sm-outline:hover:not(:disabled) { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .ip-btn-sm-outline:disabled { opacity: .4; cursor: not-allowed; }

  .ip-btn-accent {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 10px 16px; border-radius: 8px; width: 100%;
    background: var(--accent); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
    border: none; cursor: pointer; transition: background .15s;
  }
  .ip-btn-accent:hover { background: var(--accent-h); }

  .ip-btn-white {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 10px 16px; border-radius: 8px; width: 100%;
    background: #fff; color: var(--accent);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
    border: none; cursor: pointer; transition: background .15s;
  }
  .ip-btn-white:hover { background: #f0f9ff; }

  .ip-btn-green-glass {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 10px 16px; border-radius: 8px; width: 100%;
    background: rgba(34,197,94,.2); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
    border: 1px solid rgba(34,197,94,.4); cursor: pointer; transition: background .15s;
  }
  .ip-btn-green-glass:hover { background: rgba(34,197,94,.3); }

  .ip-btn-sm-blue {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 7px;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
    background: var(--accent); color: #fff; border: none;
    cursor: pointer; transition: background .15s; white-space: nowrap;
  }
  .ip-btn-sm-blue:hover { background: var(--accent-h); }

  .ip-btn-sm-green {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 7px;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
    background: var(--green); color: #fff; border: none;
    cursor: pointer; transition: background .15s; white-space: nowrap;
  }
  .ip-btn-sm-green:hover { background: #15803d; }

  .ip-form-btn-cancel {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 10px 16px; border-radius: 8px; flex: 1;
    background: transparent; color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer; transition: all .14s;
  }
  .ip-form-btn-cancel:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

  /* ══ EDIT STYLES (same pattern as job opening) ══ */
  .ip-edit-select {
    height: 32px; padding: 0 8px; border-radius: 7px;
    border: 1px solid var(--accent); background: #fff;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; color: var(--t1);
    outline: none; cursor: pointer; min-width: 120px;
  }
  .ip-edit-save {
    width: 28px; height: 28px; border-radius: 6px; border: none;
    background: var(--green); color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background .14s; flex-shrink: 0;
  }
  .ip-edit-save:hover:not(:disabled) { background: #15803d; }
  .ip-edit-save:disabled { opacity: .5; cursor: not-allowed; }
  .ip-edit-cancel {
    width: 28px; height: 28px; border-radius: 6px;
    border: 1px solid var(--border); background: #fff; color: var(--t3);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all .14s; flex-shrink: 0;
  }
  .ip-edit-cancel:hover { background: var(--bg); color: var(--t1); }
  .ip-edit-pencil {
    padding: 3px; border-radius: 5px; border: none; background: none;
    cursor: pointer; color: var(--t3); display: inline-flex;
    align-items: center; justify-content: center; transition: all .14s; margin-left: 4px;
  }
  .ip-edit-pencil:hover { color: var(--accent); background: var(--accent-lt); }

  /* ══ PAGE ══ */
  .ip-page { padding: 28px 32px; display: flex; flex-direction: column; gap: 22px; }
  .ip-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
  .ip-page-title { font-size: 21px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; line-height: 1.15; }
  .ip-page-sub   { font-size: 13px; color: var(--t3); margin-top: 5px; font-weight: 400; }

  /* ══ ERROR ══ */
  .ip-error {
    background: var(--red-lt); border: 1px solid var(--red-bdr);
    border-radius: 10px; padding: 14px 16px;
    display: flex; align-items: flex-start; gap: 10px;
  }
  .ip-error svg { color: var(--red); flex-shrink: 0; margin-top: 1px; }
  .ip-error-title { font-size: 13px; font-weight: 700; color: #7f1d1d; }
  .ip-error-msg   { font-size: 12.5px; color: #991b1b; margin-top: 2px; }
  .ip-error-hint  { font-size: 11.5px; color: #b91c1c; margin-top: 3px; }

  /* ══ STAT GRID ══ */
  .ip-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
  .ip-stat {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 8px;
    box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }
  .ip-stat-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 6px; }
  .ip-stat-label { font-size: 11px; color: var(--t3); font-weight: 500; line-height: 1.3; }
  .ip-stat-icon { width: 34px; height: 34px; min-width: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ip-stat-val { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; line-height: 1; }

  .ip-stat-val.blue   { color: var(--accent); }    .ip-stat-icon.blue   { background: var(--accent-lt); color: var(--accent); }
  .ip-stat-val.gray   { color: #4b5563; }          .ip-stat-icon.gray   { background: var(--gray-lt); color: #4b5563; }
  .ip-stat-val.yellow { color: var(--yellow); }    .ip-stat-icon.yellow { background: var(--yellow-lt); color: var(--yellow); }
  .ip-stat-val.green  { color: var(--green); }     .ip-stat-icon.green  { background: var(--green-lt); color: var(--green); }
  .ip-stat-val.red    { color: var(--red); }       .ip-stat-icon.red    { background: var(--red-lt); color: var(--red); }

  /* ══ LAYOUT ══ */
  .ip-layout { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }

  /* ══ PANEL ══ */
  .ip-panel {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 12px; overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .ip-panel-head { padding: 16px 20px; border-bottom: 1px solid var(--border-s); display: flex; flex-direction: column; gap: 12px; }
  .ip-panel-title-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
  .ip-panel-title { font-size: 14px; font-weight: 700; color: var(--t1); display: flex; align-items: center; gap: 8px; }

  /* ══ FILTERS ══ */
  .ip-filter-row { display: flex; gap: 10px; }
  .ip-select-wrap { position: relative; }
  .ip-select-arrow { position: absolute; right: 11px; top: 50%; transform: translateY(-50%) rotate(90deg); color: var(--t3); pointer-events: none; width: 13px; height: 13px; }
  .ip-select {
    height: 40px; padding: 0 32px 0 13px;
    border: 1px solid var(--border); border-radius: 8px;
    background: var(--bg); font-family: 'Inter', sans-serif;
    font-size: 12.5px; color: var(--t2); appearance: none;
    outline: none; cursor: pointer; transition: all .15s;
  }
  .ip-select:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }

  /* ══ SEARCH ══ */
  .ip-search-wrap { position: relative; }
  .ip-search-wrap > svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--t3); width: 15px; height: 15px; pointer-events: none; }
  .ip-search {
    width: 100%; height: 42px; padding: 0 14px 0 40px;
    border: 1px solid var(--border); border-radius: 8px;
    background: var(--bg); font-family: 'Inter', sans-serif;
    font-size: 13px; color: var(--t1); outline: none; transition: all .15s;
  }
  .ip-search::placeholder { color: var(--t3); }
  .ip-search:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }

  /* ══ CANDIDATE CARDS ══ */
  .ip-cards { display: flex; flex-direction: column; gap: 10px; padding: 16px 20px; }

  .ip-candidate-card {
    background: var(--bg); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 14px 16px; cursor: pointer;
    transition: box-shadow .15s, transform .15s, border-color .15s;
  }
  .ip-candidate-card:hover { box-shadow: 0 6px 18px rgba(0,158,247,.12); transform: translateY(-1px); border-color: rgba(0,158,247,.35); }
  .ip-candidate-card.selected { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.15); background: var(--card); }

  .ip-avatar {
    width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), #7c3aed);
    color: #fff; display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; box-shadow: 0 4px 10px rgba(0,158,247,.25);
  }
  .ip-card-top { display: flex; align-items: flex-start; gap: 12px; }
  .ip-card-info { flex: 1; min-width: 0; }
  .ip-card-name { font-size: 14px; font-weight: 700; color: var(--t1); letter-spacing: -0.1px; }
  .ip-card-pos  { font-size: 12px; color: var(--t3); margin-top: 2px; }
  .ip-card-contacts { display: flex; gap: 14px; margin-top: 6px; flex-wrap: wrap; }
  .ip-card-contact { font-size: 11.5px; color: var(--t3); display: flex; align-items: center; gap: 5px; }
  .ip-card-contact svg { width: 11px; height: 11px; flex-shrink: 0; }
  .ip-card-meta { display: flex; gap: 10px; margin-top: 5px; flex-wrap: wrap; }
  .ip-card-meta-item { font-size: 12px; color: var(--t2); }

  .ip-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }
  .ip-card-score { font-size: 13px; font-weight: 700; color: var(--green); }
  .ip-card-score-lbl { font-size: 10px; color: var(--t3); }

  /* badges */
  .ip-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .ip-badge.blue   { background: var(--accent-lt); color: var(--accent); border: 1px solid var(--border); }
  .ip-badge.green  { background: var(--green-lt); color: var(--green); border: 1px solid var(--green-bdr); }
  .ip-badge.red    { background: var(--red-lt); color: var(--red); border: 1px solid var(--red-bdr); }
  .ip-badge.yellow { background: var(--yellow-lt); color: var(--yellow); border: 1px solid var(--yellow-bdr); }
  .ip-badge.gray   { background: var(--gray-lt); color: #4b5563; border: 1px solid var(--gray-bdr); }
  .ip-badge.outline{ background: transparent; color: var(--t2); border: 1px solid var(--border); }
  .ip-badge.blue-solid { background: var(--accent); color: #fff; border: none; }

  /* ══ PAGINATION ══ */
  .ip-pagination { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-top: 1px solid var(--border-s); font-size: 12.5px; color: var(--t3); }
  .ip-pag-btns { display: flex; align-items: center; gap: 8px; }
  .ip-pag-cur { font-size: 12.5px; font-weight: 600; color: var(--t1); }

  /* ══ RIGHT DETAIL COLUMN ══ */
  .ip-detail-sticky { display: contents; }
  .ip-detail { display: flex; flex-direction: column; gap: 14px; align-self: start; }

  .ip-mgmt-hero {
    background: linear-gradient(135deg, #0f3460, #16213e);
    border-radius: 12px; padding: 20px;
  }
  .ip-mgmt-hero-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .ip-mgmt-hero-head svg { color: rgba(255,255,255,.5); }
  .ip-mgmt-hero-title { font-size: 13px; font-weight: 700; color: #fff; }
  .ip-mgmt-hero-sub   { font-size: 12px; color: rgba(255,255,255,.55); margin-bottom: 16px; }

  .ip-stage-box { background: rgba(255,255,255,.1); backdrop-filter: blur(4px); border-radius: 10px; padding: 14px; }
  .ip-stage-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,.7); margin-bottom: 8px; }
  .ip-stage-select {
    width: 100%; height: 42px; padding: 0 13px;
    border-radius: 8px; border: none; background: #fff;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--t1); appearance: none; outline: none; cursor: pointer;
  }
  .ip-stage-indicator { display: flex; align-items: center; gap: 7px; margin-top: 8px; font-size: 12px; color: rgba(255,255,255,.65); }
  .ip-stage-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .ip-stage-note { font-size: 11.5px; color: rgba(255,255,255,.6); background: rgba(255,255,255,.1); padding: 8px 10px; border-radius: 7px; margin-top: 8px; }

  .ip-hero-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }

  .ip-status-msg { text-align: center; color: rgba(255,255,255,.8); padding: 12px 0 4px; }
  .ip-status-msg svg { margin: 0 auto 6px; display: block; }
  .ip-status-msg p { font-size: 13px; font-weight: 600; }
  .ip-status-msg small { font-size: 11.5px; opacity: .7; }

  .ip-sub-card {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 12px; overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .ip-sub-head {
    padding: 14px 18px; border-bottom: 1px solid var(--border-s);
    display: flex; align-items: center; justify-content: space-between;
  }
  .ip-sub-title { font-size: 13px; font-weight: 700; color: var(--t1); display: flex; align-items: center; gap: 7px; }
  .ip-sub-body  { padding: 16px 18px; }

  .ip-det-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .ip-det-full { grid-column: 1 / -1; }
  .ip-det-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--t3); margin-bottom: 3px; }
  .ip-det-val   { font-size: 13px; font-weight: 500; color: var(--t1); }
  .ip-det-link  { color: var(--accent); font-size: 12px; text-decoration: none; word-break: break-all; }
  .ip-det-link:hover { text-decoration: underline; }

  .ip-interviewers { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
  .ip-interviewer-chip { padding: 3px 10px; border-radius: 20px; background: var(--accent-lt); color: var(--t2); font-size: 11.5px; font-weight: 500; border: 1px solid var(--border); }

  .ip-timeline-items { display: flex; flex-direction: column; gap: 8px; padding: 14px 18px; }
  .ip-tl-item { padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-s); background: var(--bg); }
  .ip-tl-item.current { background: var(--accent-lt); border-color: var(--border); }
  .ip-tl-item-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
  .ip-tl-round { font-size: 12.5px; font-weight: 700; color: var(--t1); display: flex; align-items: center; gap: 6px; }
  .ip-tl-meta  { font-size: 11.5px; color: var(--t3); display: flex; flex-direction: column; gap: 2px; }

  /* ══ SCHEDULE FORM ══ */
  .ip-form { padding: 16px 18px; display: flex; flex-direction: column; gap: 14px; }
  .ip-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .ip-form-label { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--t3); margin-bottom: 5px; display: block; }
  .ip-form-input {
    width: 100%; height: 42px; padding: 0 13px;
    border: 1px solid var(--border); border-radius: 8px;
    background: var(--bg); font-family: 'Inter', sans-serif;
    font-size: 13px; color: var(--t1); outline: none; transition: all .15s;
  }
  .ip-form-input:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .ip-form-select-wrap { position: relative; }
  .ip-form-select-arrow { position: absolute; right: 11px; top: 50%; transform: translateY(-50%) rotate(90deg); color: var(--t3); pointer-events: none; width: 13px; height: 13px; }
  .ip-form-select {
    width: 100%; height: 42px; padding: 0 32px 0 13px;
    border: 1px solid var(--border); border-radius: 8px;
    background: var(--bg); font-family: 'Inter', sans-serif;
    font-size: 13px; color: var(--t2); appearance: none; outline: none; cursor: pointer; transition: all .15s;
  }
  .ip-form-select:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .ip-form-textarea {
    width: 100%; padding: 10px 13px; border: 1px solid var(--border); border-radius: 8px;
    background: var(--bg); font-family: 'Inter', sans-serif; font-size: 13px; color: var(--t1);
    outline: none; resize: vertical; transition: all .15s; min-height: 80px;
  }
  .ip-form-textarea:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .ip-form-btns { display: flex; gap: 10px; }

  /* ══ EMPTY STATE ══ */
  .ip-empty { padding: 48px 20px; text-align: center; }
  .ip-empty-icon { width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 14px; background: var(--accent-lt); color: var(--accent); display: flex; align-items: center; justify-content: center; }
  .ip-empty-title { font-size: 14px; font-weight: 700; color: var(--t1); margin-bottom: 4px; }
  .ip-empty-sub   { font-size: 12.5px; color: var(--t3); }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 1100px) { .ip-layout { grid-template-columns: 1fr; } }
  @media (max-width: 900px)  { .ip-stats { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 768px)  {
    .ip-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .ip-sb.open { transform: translateX(0); }
    .ip-main { margin-left: 0 !important; }
    .ip-page { padding: 16px; }
    .ip-header { padding: 0 16px; }
    .ip-stats { grid-template-columns: repeat(2, 1fr); }
    .ip-filter-row { flex-direction: column; }
    .ip-det-grid { grid-template-columns: 1fr; }
    .ip-form-grid { grid-template-columns: 1fr; }
  }
`

interface Candidate {
  id: string
  applicant_name: string
  email_id: string
  phone_number: string
  position: string
  experience: string
  skills: string[]
  resumeScore: number
  status: string
  appliedDate: string
  designation?: string
  interviewStatus?: string
  recruitment_stage?: string
  totalRounds?: number
  interviewDetails?: {
    date: string
    time: string
    from_time?: string
    to_time?: string
    type: "in-person" | "video" | "phone"
    location?: string
    meeting_link?: string
    interviewers: string[]
    round: number
    round_name?: string
    notes?: string
  }
}

export default function InterviewPage() {
  const router = useRouter()
  const [candidates, setCandidate] = useState<Candidate[]>([])
  const [allInterviews, setAllInterviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDesignation, setFilterDesignation] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ── DYNAMIC STATUS OPTIONS (fetched from Frappe DocType) ──
  const [interviewStatuses, setInterviewStatuses] = useState<string[]>([])

  // ── INLINE EDIT STATE (same pattern as job opening) ──
  const [editingInterviewId, setEditingInterviewId] = useState<string | null>(null)
  const [editingInterviewStatus, setEditingInterviewStatus] = useState<string>("")
  const [savingStatus, setSavingStatus] = useState(false)

  const ITEMS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState(1)

  // ── FETCH DYNAMIC STATUSES FROM FRAPPE DOCTYPE ──
  const fetchInterviewStatuses = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/resource/DocType/Interview`,
        { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const data = await response.json()
      const fields = data.data?.fields || []
      const statusField = fields.find((f: any) => f.fieldname === 'status')
      if (statusField && statusField.options) {
        const statuses = statusField.options.split('\n').filter(Boolean)
        setInterviewStatuses(statuses)
      } else {
        setInterviewStatuses(['Pending', 'Under Review', 'Cleared', 'Rejected'])
      }
    } catch (error) {
      console.error("Error fetching interview statuses:", error)
      setInterviewStatuses(['Pending', 'Under Review', 'Cleared', 'Rejected'])
    }
  }

  // ── SAVE STATUS (PUT to Frappe Interview doctype) ──
  const saveInterviewStatus = async (candidateId: string) => {
    setSavingStatus(true)
    try {
      const latestInterview = allInterviews
        .filter(i => i.job_applicant === candidateId)
        .sort((a, b) => new Date(b.scheduled_on || b.creation).getTime() - new Date(a.scheduled_on || a.creation).getTime())[0]

      if (!latestInterview) {
        alert("No interview found for this candidate.")
        setSavingStatus(false)
        return
      }

      const csrfToken = await getFrappeCSRF()
      const response = await fetch(`${API_BASE_URL}/api/resource/Interview/${latestInterview.name}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken },
        body: JSON.stringify({ status: editingInterviewStatus })
      })

      const result = await response.json()
      if (result.data) {
        // Update candidates list
        setCandidate(prev => prev.map(c =>
          c.id === candidateId ? { ...c, interviewStatus: editingInterviewStatus } : c
        ))
        // Update selected candidate in right panel
        if (selectedCandidate?.id === candidateId) {
          setSelectedCandidate(prev => prev ? { ...prev, interviewStatus: editingInterviewStatus } : null)
        }
        // Update allInterviews so timeline also reflects change
        setAllInterviews(prev => prev.map(i =>
          i.name === latestInterview.name ? { ...i, status: editingInterviewStatus } : i
        ))
        setEditingInterviewId(null)
      } else {
        alert("Failed to update status. Please try again.")
      }
    } catch (error) {
      console.error("Error updating interview status:", error)
      alert("Failed to update status.")
    } finally {
      setSavingStatus(false)
    }
  }

  const fetchJobApplicant = async () => {
    setIsLoading(true)
    setApiError(null)
    try {
      const applicantsRes = await fetch(
        `${API_BASE_URL}/api/resource/Job Applicant/?fields=["*"]&limit_page_length=0`,
        { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
      )
      const interviewsRes = await fetch(
        `${API_BASE_URL}/api/resource/Interview/?fields=["*"]&limit_page_length=0`,
        { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
      )
      if (!applicantsRes.ok) throw new Error(`HTTP error! status: ${applicantsRes.status}`)
      if (!interviewsRes.ok) throw new Error(`HTTP error! status: ${interviewsRes.status}`)

      const applicantsData = await applicantsRes.json()
      const interviewsData = await interviewsRes.json()

      if (applicantsData && applicantsData.data) {
        const applicants = applicantsData.data
        const interviewsRaw = interviewsData.data || []

        const interviews = await Promise.all(
          interviewsRaw.map(async (interview: any) => {
            try {
              const detailsRes = await fetch(
                `${API_BASE_URL}/api/resource/Interview Detail?filters=[["parent","=","${interview.name}"]]&fields=["interviewer"]`,
                { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
              )
              const detailsData = await detailsRes.json()
              const interviewers = detailsData.data?.map((d: any) => d.interviewer) || []
              return { ...interview, interviewers }
            } catch (error) {
              return { ...interview, interviewers: [] }
            }
          })
        )

        setAllInterviews(interviews)

        const mappedData = applicants.map((item: any) => {
          const applicantInterviews = interviews.filter((int: any) =>
            int.job_applicant === item.name || int.job_applicant === item.email_id
          )
          const interview = applicantInterviews.length > 0
            ? applicantInterviews.sort((a: any, b: any) => new Date(b.scheduled_on || b.creation).getTime() - new Date(a.scheduled_on || a.creation).getTime())[0]
            : null
          const totalRounds = applicantInterviews.length
          return {
            id: item.name || item.id,
            applicant_name: item.applicant_name || "Unknown",
            email_id: item.email_id || "", phone_number: item.phone_number || "",
            position: item.job_title || item.designation || "Not specified",
            designation: item.designation || "", experience: item.experience || "N/A",
            skills: item.skills ? (Array.isArray(item.skills) ? item.skills : []) : [],
            resumeScore: item.resume_score || 0, status: item.status || "Open",
            interviewStatus: interview ? interview.status : null,
            recruitment_stage: item.custom_recruitment_stage || "",
            appliedDate: item.creation || item.applied_date || new Date().toISOString().split('T')[0],
            totalRounds,
            interviewDetails: interview ? {
              date: interview.scheduled_on || "", time: `${interview.from_time || ""} - ${interview.to_time || ""}`,
              from_time: interview.from_time || "", to_time: interview.to_time || "",
              type: interview.type || "video",
              location: interview.custom_location || interview.location || "",
              meeting_link: interview.google_meet || interview.meeting_link || "",
              interviewers: interview.interviewers || [],
              round: interview.round || 1, round_name: interview.interview_round || "",
              notes: interview.notes || ""
            } : undefined
          }
        })

        const sortedData = mappedData.sort((a: any, b: any) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
        setCandidate(sortedData)
      }
    } catch (error: any) {
      console.error("Error fetching job applicants:", error)
      setApiError("Network error: Unable to reach server. Please check if the API server is running.")
    } finally { setIsLoading(false) }
  }

  useEffect(() => {
    fetchJobApplicant()
    fetchInterviewStatuses()   // fetch dynamic statuses on mount
  }, [])

  useEffect(() => { document.title = 'Interview' }, [])

  const uniqueDesignations = Array.from(
    new Set(candidates.map(c => c.designation).filter((d): d is string => Boolean(d) && d.trim() !== ''))
  )
  const allStatusesSet = new Set<string>()
  candidates.forEach(c => {
    if (c.interviewStatus && c.interviewStatus.trim() !== '') allStatusesSet.add(c.interviewStatus)
    if (c.status && c.status.trim() !== '') allStatusesSet.add(c.status)
  })
  const uniqueStatuses = Array.from(allStatusesSet)

  const filteredCandidates = candidates.filter(candidate => {
    const candidateStatus = candidate.interviewStatus || candidate.status
    const statusMatch = filterStatus === "all" || candidateStatus === filterStatus
    const designationMatch = filterDesignation === "all" || candidate.designation === filterDesignation
    const searchMatch = searchTerm === "" ||
      candidate.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
    return statusMatch && designationMatch && searchMatch
  })

  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex)
  useEffect(() => { setCurrentPage(1) }, [filterStatus, filterDesignation, searchTerm])

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [interviewForm, setInterviewForm] = useState({
    date: "", time: "", type: "video" as "in-person" | "video" | "phone",
    location: "", interviewers: [] as string[], round: 1, duration: "60", notes: "",
  })

  const getStatusColor = (status: string) => {
    const n = status?.toLowerCase().trim() || ""
    if (n.includes("cleared") || n.includes("accept") || n.includes("hired")) return "green"
    if (n.includes("open") || n.includes("replied") || n.includes("hold") || n.includes("under review")) return "blue"
    if (n.includes("reject")) return "red"
    return "yellow"
  }

  const getStatusText = (status: string) => {
    if (!status) return "Pending"
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const getStatusIcon = (status: string) => {
    const n = status?.toLowerCase().trim() || ""
    if (n.includes("cleared") || n.includes("accept") || n.includes("hired")) return <CheckCircle size={12} />
    if (n.includes("open") || n.includes("replied") || n.includes("hold") || n.includes("under review")) return <Clock size={12} />
    if (n.includes("reject")) return <XCircle size={12} />
    return <AlertCircle size={12} />
  }

  const handleScheduleInterview = () => {
    setShowScheduleForm(false)
    setInterviewForm({ date: "", time: "", type: "video", location: "", interviewers: [], round: 1, duration: "60", notes: "" })
  }

  const handleInterviewerToggle = (interviewer: string) => {
    setInterviewForm(prev => ({
      ...prev,
      interviewers: prev.interviewers.includes(interviewer)
        ? prev.interviewers.filter(i => i !== interviewer)
        : [...prev.interviewers, interviewer],
    }))
  }

  const handleRecruitmentStageChange = async (candidateId: string, newStage: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/your_app_name.your_module.interview_api.update_recruitment_stage`,
        {
          method: 'POST', credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ applicant_id: candidateId, recruitment_stage: newStage })
        }
      )
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const result = await response.json()
      setCandidate(prev => prev.map(c => c.id === candidateId ? { ...c, recruitment_stage: newStage } : c))
      if (selectedCandidate?.id === candidateId) setSelectedCandidate(prev => prev ? { ...prev, recruitment_stage: newStage } : null)
      alert(`Recruitment stage updated to: ${newStage}. Email will be sent automatically.`)
    } catch (error) {
      console.error("Error updating recruitment stage:", error)
      alert("Failed to update recruitment stage. Please try again.")
    }
  }

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

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
      <div className="ip">
        <div className="ip-wrap">

          <div className={`ip-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

          {/* ══ SIDEBAR ══ */}
          <aside className={`ip-sb${sidebarOpen ? "" : " collapsed"}`}>
            <div className="ip-sb-brand">
              <div className="ip-sb-icon"><img src="/vaaman_logo.png" alt="logo" /></div>
              <div>
                <div className="ip-sb-name">Job Management</div>
                <div className="ip-sb-sub">HR Platform</div>
              </div>
              <button className="ip-sb-close" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
            </div>
            <nav className="ip-nav">
              <Link href="/create-job" className="ip-nav-cta"><Plus size={14} /> New Job Opening</Link>
              <div className="ip-nav-lbl">Pipeline</div>
              {sidebarPipeline.map(s => (
                <Link key={s.href} href={s.href} className={`ip-nav-link${s.href === "/interview" ? " active" : ""}`}>
                  {s.icon} {s.title}
                </Link>
              ))}
              <div className="ip-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
              {sidebarClosing.map(s => (
                <Link key={s.href} href={s.href} className="ip-nav-link">{s.icon} {s.title}</Link>
              ))}
            </nav>
            <div className="ip-sb-foot">
              <button className="ip-logout"><LogOut size={15} /> Sign out</button>
            </div>
          </aside>

          {/* ══ MAIN ══ */}
          <div className={`ip-main${sidebarOpen ? "" : " sb-closed"}`}>

            <header className="ip-header">
              <button className="ip-toggle" onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
              <div className="ip-hdr-sep" />
              <Link href="/home" className="ip-btn-back">
                <ArrowLeft size={13} /> Back
              </Link>
              <div className="ip-hdr-sep" />
              <div className="ip-crumb">
                <Home size={13} /> Home <ChevronRight size={13} /> <strong>Interview Management</strong>
              </div>
            </header>

            <div className="ip-page">

              <div className="ip-toolbar">
                <div>
                  <h1 className="ip-page-title">Interview Management</h1>
                  <p className="ip-page-sub">Schedule and manage candidate interviews</p>
                </div>
              </div>

              {apiError && (
                <div className="ip-error">
                  <AlertCircle size={16} />
                  <div>
                    <div className="ip-error-title">API Connection Error</div>
                    <div className="ip-error-msg">{apiError}</div>
                    <div className="ip-error-hint">Please check your API configuration.</div>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="ip-stats">
                {[
                  { label: "Open", val: candidates.filter(c => c.status === "Open" || c.interviewStatus === "Open").length, cls: "blue", icon: <Clock size={16} /> },
                  { label: "Pending", val: candidates.filter(c => c.status === "Pending" || c.interviewStatus === "Pending").length, cls: "gray", icon: <AlertCircle size={16} /> },
                  { label: "Under Review", val: candidates.filter(c => c.interviewStatus === "Under Review").length, cls: "yellow", icon: <AlertCircle size={16} /> },
                  { label: "Cleared", val: candidates.filter(c => c.interviewStatus === "Cleared").length, cls: "green", icon: <CheckCircle size={16} /> },
                  { label: "Rejected", val: candidates.filter(c => c.interviewStatus === "Rejected").length, cls: "red", icon: <XCircle size={16} /> },
                ].map(s => (
                  <div key={s.label} className="ip-stat">
                    <div className="ip-stat-top">
                      <div className="ip-stat-label">{s.label}</div>
                      <div className={`ip-stat-icon ${s.cls}`}>{s.icon}</div>
                    </div>
                    <div className={`ip-stat-val ${s.cls}`}>{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="ip-layout">

                {/* LEFT — candidate list */}
                <div className="ip-panel">
                  <div className="ip-panel-head">
                    <div className="ip-panel-title-row">
                      <div className="ip-panel-title">
                        <Users size={15} style={{ color: 'var(--accent)' }} />
                        Candidates ({filteredCandidates.length})
                        {isLoading && <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 400 }}>(Loading...)</span>}
                      </div>
                      <div className="ip-filter-row">
                        <div className="ip-select-wrap">
                          <select className="ip-select" value={filterDesignation} onChange={e => setFilterDesignation(e.target.value)}>
                            <option value="all">Designations</option>
                            {uniqueDesignations.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                          <ChevronRight size={13} className="ip-select-arrow" />
                        </div>
                        <div className="ip-select-wrap">
                          <select className="ip-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="all">Status</option>
                            {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronRight size={13} className="ip-select-arrow" />
                        </div>
                      </div>
                    </div>
                    <div className="ip-search-wrap">
                      <Search size={15} />
                      <input
                        type="text"
                        className="ip-search"
                        placeholder="Search by name, email, phone, or job title..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="ip-cards">
                    {paginatedCandidates.map((candidate, index) => {
                      const statusCls = getStatusColor(candidate.interviewStatus || candidate.status)
                      return (
                        <div
                          key={index}
                          className={`ip-candidate-card${selectedCandidate?.id === candidate.id ? " selected" : ""}`}
                          onClick={() => setSelectedCandidate(candidate)}
                        >
                          <div className="ip-card-top">
                            <div className="ip-avatar">{getInitials(candidate.applicant_name)}</div>
                            <div className="ip-card-info">
                              <div className="ip-card-name">{candidate.applicant_name}</div>
                              <div className="ip-card-pos">{candidate.position}</div>
                              <div className="ip-card-contacts">
                                <div className="ip-card-contact"><Mail size={11} /> {candidate.email_id}</div>
                                <div className="ip-card-contact"><Phone size={11} /> {candidate.phone_number}</div>
                              </div>
                              <div className="ip-card-meta">
                                {candidate.designation && <span className="ip-card-meta-item">{candidate.designation}</span>}
                                <span className="ip-card-meta-item">{candidate.interviewDetails?.round_name || (candidate.interviewStatus || candidate.status)}</span>
                              </div>
                            </div>

                            <div className="ip-card-right">

                              {/* ══ INLINE STATUS EDIT (dynamic from Frappe DocType) ══ */}
                              {editingInterviewId === candidate.id ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={e => e.stopPropagation()}>
                                  <select
                                    className="ip-edit-select"
                                    value={editingInterviewStatus}
                                    onChange={e => setEditingInterviewStatus(e.target.value)}
                                    autoFocus
                                  >
                                    {interviewStatuses.map(s => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                  <button
                                    className="ip-edit-save"
                                    onClick={() => saveInterviewStatus(candidate.id)}
                                    disabled={savingStatus}
                                    title="Save"
                                  >
                                    <Check size={13} />
                                  </button>
                                  <button
                                    className="ip-edit-cancel"
                                    onClick={() => setEditingInterviewId(null)}
                                    title="Cancel"
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <span className={`ip-badge ${statusCls}`}>
                                    {getStatusIcon(candidate.interviewStatus || candidate.status)}
                                    {getStatusText(candidate.interviewStatus || candidate.status)}
                                  </span>
                                  <button
                                    className="ip-edit-pencil"
                                    title="Edit status"
                                    onClick={e => {
                                      e.stopPropagation()
                                      setEditingInterviewId(candidate.id)
                                      setEditingInterviewStatus(candidate.interviewStatus || candidate.status || interviewStatuses[0] || "Pending")
                                    }}
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                </div>
                              )}

                              {candidate.resumeScore > 0 && (
                                <div style={{ textAlign: 'right' }}>
                                  <div className="ip-card-score">{candidate.resumeScore}%</div>
                                  <div className="ip-card-score-lbl">Match Score</div>
                                </div>
                              )}

                              {/* ══ ACTION BUTTONS ══ */}
                              {(() => {
                                const currentStatus = candidate.interviewStatus || candidate.status

                                if (currentStatus === "Rejected") {
                                  return (
                                    <button className="ip-btn-sm-green" onClick={e => {
                                      e.stopPropagation()
                                      const latestInterview = allInterviews
                                        .filter(i => i.job_applicant === candidate.id)
                                        .sort((a, b) => new Date(b.scheduled_on || b.creation).getTime() - new Date(a.scheduled_on || a.creation).getTime())[0]
                                      router.push(
                                        `/candidate-feedback` +
                                        `?candidateId=${encodeURIComponent(candidate.id)}` +
                                        `&candidateName=${encodeURIComponent(candidate.applicant_name)}` +
                                        `&candidateEmail=${encodeURIComponent(candidate.email_id)}` +
                                        `&interviewName=${encodeURIComponent(latestInterview?.name || "")}` +
                                        `&interviewer=${encodeURIComponent(latestInterview?.interviewers?.[0] || "")}`
                                      )
                                    }}>
                                      Candidate Feedback
                                    </button>
                                  )
                                }

                                if (currentStatus === "Cleared") {
                                  return (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                      <button className="ip-btn-sm-green" onClick={e => {
                                        e.stopPropagation()
                                        const latestInterview = allInterviews
                                          .filter(i => i.job_applicant === candidate.id)
                                          .sort((a, b) => new Date(b.scheduled_on || b.creation).getTime() - new Date(a.scheduled_on || a.creation).getTime())[0]
                                        router.push(
                                          `/candidate-feedback` +
                                          `?candidateId=${encodeURIComponent(candidate.id)}` +
                                          `&candidateName=${encodeURIComponent(candidate.applicant_name)}` +
                                          `&candidateEmail=${encodeURIComponent(candidate.email_id)}` +
                                          `&interviewName=${encodeURIComponent(latestInterview?.name || "")}` +
                                          `&interviewer=${encodeURIComponent(latestInterview?.interviewers?.[0] || "")}`
                                        )
                                      }}>
                                        Candidate Feedback
                                      </button>
                                      <button className="ip-btn-sm-blue" onClick={e => {
                                        e.stopPropagation()
                                        router.push(`/Event?applicantId=${encodeURIComponent(candidate.id)}&applicantName=${encodeURIComponent(candidate.applicant_name)}&applicantEmail=${encodeURIComponent(candidate.email_id)}`)
                                      }}>
                                        Interview Schedule
                                      </button>
                                    </div>
                                  )
                                }

                                if (currentStatus === "Pending") {
                                  return (
                                    <button
                                      className="ip-btn-sm-blue"
                                      style={{ background: 'var(--yellow)', borderColor: 'var(--yellow)' }}
                                      onClick={e => {
                                        e.stopPropagation()
                                        router.push(
                                          `/Event?applicantId=${encodeURIComponent(candidate.id)}` +
                                          `&applicantName=${encodeURIComponent(candidate.applicant_name)}` +
                                          `&applicantEmail=${encodeURIComponent(candidate.email_id)}`
                                        )
                                      }}
                                    >
                                      Reschedule
                                    </button>
                                  )
                                }

                                return (
                                  <button className="ip-btn-sm-blue" onClick={e => {
                                    e.stopPropagation()
                                    router.push(`/Event?applicantId=${encodeURIComponent(candidate.id)}&applicantName=${encodeURIComponent(candidate.applicant_name)}&applicantEmail=${encodeURIComponent(candidate.email_id)}`)
                                  }}>
                                    Interview Schedule
                                  </button>
                                )
                              })()}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {filteredCandidates.length > 0 && (
                    <div className="ip-pagination">
                      <span>Showing {startIndex + 1} to {Math.min(endIndex, filteredCandidates.length)} of {filteredCandidates.length} candidates</span>
                      <div className="ip-pag-btns">
                        <button className="ip-btn-sm-outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                          <ChevronLeft size={13} /> Previous
                        </button>
                        <span className="ip-pag-cur">Page {currentPage} of {totalPages}</span>
                        <button className="ip-btn-sm-outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                          Next <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT — detail panel */}
                <div className="ip-detail-sticky">
                  <div className="ip-detail">
                    {selectedCandidate ? (
                      <>
                        <div className="ip-mgmt-hero">
                          <div className="ip-mgmt-hero-head">
                            <Calendar size={14} />
                            <span className="ip-mgmt-hero-title">Interview Management</span>
                          </div>
                          <div className="ip-mgmt-hero-sub">For {selectedCandidate.applicant_name}</div>

                          <div className="ip-stage-box">
                            <div className="ip-stage-label">Recruitment Stage</div>
                            <select
                              className="ip-stage-select"
                              value={selectedCandidate.recruitment_stage || ""}
                              onChange={e => handleRecruitmentStageChange(selectedCandidate.id, e.target.value)}
                              disabled={selectedCandidate.interviewStatus !== "Cleared" && selectedCandidate.recruitment_stage !== "Document Upload Requested"}
                            >
                              <option value="">Select Stage</option>
                              <option value="Document Upload Requested">Document Upload Requested</option>
                              <option value="Document Verified">Document Verified</option>
                            </select>

                            {selectedCandidate.recruitment_stage && (
                              <div className="ip-stage-indicator">
                                <div className="ip-stage-dot" style={{
                                  background: selectedCandidate.recruitment_stage === "Document Verified" ? "#4ade80" : "#fbbf24"
                                }} />
                                <span>
                                  {selectedCandidate.recruitment_stage === "Document Verified"
                                    ? "Documents verified and ready"
                                    : "Waiting for document upload"}
                                </span>
                              </div>
                            )}

                            {selectedCandidate.interviewStatus === "Cleared" &&
                              selectedCandidate.recruitment_stage !== "Document Verified" && (
                                <div className="ip-stage-note">
                                  💡 Interview cleared! You can now request document upload or verify documents.
                                </div>
                              )}
                          </div>

                          <div className="ip-hero-actions">
                            {(selectedCandidate.status === "Open" || selectedCandidate.interviewStatus === "Open") && (
                              <button className="ip-btn-white" onClick={() => setShowScheduleForm(true)}>
                                <Plus size={14} /> Schedule Interview
                              </button>
                            )}
                            {selectedCandidate.interviewStatus === "Under Review" && (
                              <>
                                <button className="ip-btn-white" onClick={() => setShowScheduleForm(true)}>
                                  <Edit size={14} /> Reschedule Interview
                                </button>
                                <button className="ip-btn-green-glass">
                                  <CheckCircle size={14} /> Mark as Completed
                                </button>
                              </>
                            )}
                            {selectedCandidate.interviewStatus === "Cleared" && (
                              <div className="ip-status-msg">
                                <CheckCircle size={28} />
                                <p>Interview Cleared</p>
                                <small>Proceed with document verification</small>
                              </div>
                            )}
                            {selectedCandidate.interviewStatus === "Rejected" && (
                              <div className="ip-status-msg">
                                <XCircle size={28} />
                                <p>Interview Rejected</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {selectedCandidate.interviewDetails && (
                          <div className="ip-sub-card">
                            <div className="ip-sub-head">
                              <div className="ip-sub-title"><Calendar size={14} /> Interview Details</div>
                            </div>
                            <div className="ip-sub-body">
                              <div className="ip-det-grid">
                                <div className="ip-det-full">
                                  <div className="ip-det-label">Scheduled</div>
                                  <div className="ip-det-val">
                                    {new Date(selectedCandidate.interviewDetails.date).toLocaleDateString('en-GB')}
                                    {selectedCandidate.interviewDetails.from_time && selectedCandidate.interviewDetails.to_time &&
                                      ` at ${selectedCandidate.interviewDetails.from_time} - ${selectedCandidate.interviewDetails.to_time}`}
                                  </div>
                                </div>
                                <div>
                                  <div className="ip-det-label">Type</div>
                                  <div className="ip-det-val" style={{ textTransform: 'capitalize' }}>{selectedCandidate.interviewDetails.type}</div>
                                </div>
                                <div>
                                  <div className="ip-det-label">Round</div>
                                  <div className="ip-det-val">{selectedCandidate.interviewDetails.round_name || `Round ${selectedCandidate.interviewDetails.round}`}</div>
                                </div>
                                {selectedCandidate.interviewDetails.location && (
                                  <div className="ip-det-full">
                                    <div className="ip-det-label">Location</div>
                                    <div className="ip-det-val">{selectedCandidate.interviewDetails.location}</div>
                                  </div>
                                )}
                                {selectedCandidate.interviewDetails.meeting_link && (
                                  <div className="ip-det-full">
                                    <div className="ip-det-label">Meeting Link</div>
                                    <a href={selectedCandidate.interviewDetails.meeting_link} target="_blank" rel="noopener noreferrer" className="ip-det-link">
                                      {selectedCandidate.interviewDetails.meeting_link}
                                    </a>
                                  </div>
                                )}
                              </div>

                              <div style={{ marginTop: 12 }}>
                                <div className="ip-det-label">Interviewers</div>
                                {selectedCandidate.interviewDetails.interviewers && selectedCandidate.interviewDetails.interviewers.length > 0 ? (
                                  <div className="ip-interviewers">
                                    {selectedCandidate.interviewDetails.interviewers.map((iv, idx) => (
                                      <span key={idx} className="ip-interviewer-chip">{iv}</span>
                                    ))}
                                  </div>
                                ) : (
                                  <div style={{ fontSize: 12.5, color: 'var(--t3)', marginTop: 4 }}>No interviewers assigned</div>
                                )}
                              </div>

                              {selectedCandidate.interviewDetails.notes && (
                                <div style={{ marginTop: 12 }}>
                                  <div className="ip-det-label">Notes</div>
                                  <div className="ip-det-val" style={{ marginTop: 3 }}>{selectedCandidate.interviewDetails.notes}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {selectedCandidate && selectedCandidate.totalRounds && selectedCandidate.totalRounds > 1 && (() => {
                          const candidateInterviews = allInterviews
                            .filter((int: any) => int.job_applicant === selectedCandidate.id)
                            .sort((a: any, b: any) => new Date(a.scheduled_on || a.creation).getTime() - new Date(b.scheduled_on || b.creation).getTime())
                          return (
                            <div className="ip-sub-card">
                              <div className="ip-sub-head">
                                <div className="ip-sub-title"><Calendar size={14} /> Interview Timeline</div>
                                <span className="ip-badge outline">{selectedCandidate.totalRounds} Rounds</span>
                              </div>
                              <div className="ip-timeline-items">
                                {candidateInterviews.map((interview: any, index: number) => {
                                  const isCurrent = index === candidateInterviews.length - 1
                                  return (
                                    <div key={interview.name} className={`ip-tl-item${isCurrent ? " current" : ""}`}>
                                      <div className="ip-tl-item-head">
                                        <div className="ip-tl-round">
                                          {interview.interview_round}
                                          {isCurrent && <span className="ip-badge blue-solid" style={{ fontSize: 10, padding: '2px 7px' }}>Current</span>}
                                        </div>
                                        <span className={`ip-badge ${getStatusColor(interview.status)}`}>{interview.status}</span>
                                      </div>
                                      <div className="ip-tl-meta">
                                        <span>📅 {interview.scheduled_on} at {interview.from_time} - {interview.to_time}</span>
                                        {interview.custom_location && <span>📍 {interview.custom_location}</span>}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })()}

                        {showScheduleForm && (
                          <div className="ip-sub-card">
                            <div className="ip-sub-head">
                              <div className="ip-sub-title">Schedule Interview</div>
                            </div>
                            <div className="ip-form">
                              <div className="ip-form-grid">
                                <div>
                                  <label className="ip-form-label">Date</label>
                                  <input type="date" className="ip-form-input" value={interviewForm.date} onChange={e => setInterviewForm({ ...interviewForm, date: e.target.value })} />
                                </div>
                                <div>
                                  <label className="ip-form-label">Time</label>
                                  <input type="time" className="ip-form-input" value={interviewForm.time} onChange={e => setInterviewForm({ ...interviewForm, time: e.target.value })} />
                                </div>
                              </div>

                              <div>
                                <label className="ip-form-label">Interview Type</label>
                                <div className="ip-form-select-wrap">
                                  <select className="ip-form-select" value={interviewForm.type} onChange={e => setInterviewForm({ ...interviewForm, type: e.target.value as any })}>
                                    <option value="video">Video Call</option>
                                    <option value="in-person">In-Person</option>
                                    <option value="phone">Phone Call</option>
                                  </select>
                                  <ChevronRight size={13} className="ip-form-select-arrow" />
                                </div>
                              </div>

                              {interviewForm.type === "in-person" && (
                                <div>
                                  <label className="ip-form-label">Location</label>
                                  <input type="text" className="ip-form-input" value={interviewForm.location} onChange={e => setInterviewForm({ ...interviewForm, location: e.target.value })} placeholder="Conference Room A" />
                                </div>
                              )}

                              <div className="ip-form-grid">
                                <div>
                                  <label className="ip-form-label">Interview Round</label>
                                  <div className="ip-form-select-wrap">
                                    <select className="ip-form-select" value={interviewForm.round.toString()} onChange={e => setInterviewForm({ ...interviewForm, round: parseInt(e.target.value) })}>
                                      <option value="1">Round 1 - Technical</option>
                                      <option value="2">Round 2 - Managerial</option>
                                      <option value="3">Round 3 - HR</option>
                                    </select>
                                    <ChevronRight size={13} className="ip-form-select-arrow" />
                                  </div>
                                </div>
                                <div>
                                  <label className="ip-form-label">Duration (minutes)</label>
                                  <div className="ip-form-select-wrap">
                                    <select className="ip-form-select" value={interviewForm.duration} onChange={e => setInterviewForm({ ...interviewForm, duration: e.target.value })}>
                                      <option value="30">30 minutes</option>
                                      <option value="45">45 minutes</option>
                                      <option value="60">60 minutes</option>
                                      <option value="90">90 minutes</option>
                                    </select>
                                    <ChevronRight size={13} className="ip-form-select-arrow" />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="ip-form-label">Additional Notes</label>
                                <textarea
                                  className="ip-form-textarea"
                                  value={interviewForm.notes}
                                  onChange={e => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                                  placeholder="Any special instructions or notes..."
                                  rows={3}
                                />
                              </div>

                              <div className="ip-form-btns">
                                <button className="ip-btn-accent" style={{ flex: 1 }} onClick={handleScheduleInterview}>
                                  Schedule Interview
                                </button>
                                <button className="ip-form-btn-cancel" onClick={() => setShowScheduleForm(false)}>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="ip-sub-card">
                        <div className="ip-empty">
                          <div className="ip-empty-icon"><Calendar size={26} /></div>
                          <p className="ip-empty-title">Select a Candidate</p>
                          <p className="ip-empty-sub">Choose a candidate to schedule or manage their interview.</p>
                        </div>
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
