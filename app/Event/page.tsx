// "use client"
// import { useState, useEffect, Suspense } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Checkbox } from "@/components/ui/checkbox"
// import { ArrowLeft, Calendar, Clock, MapPin, Video, FileText, Users, CheckCircle2, AlertCircle } from "lucide-react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { API_BASE_URL } from '@/lib/api-config'
// import { getFrappeCSRF } from "@/lib/csrf"

// interface Interviewer {
//   name: string
//   full_name: string
//   email: string
// }

// interface InterviewRound {
//   name: string
//   round_name: string
// }

// interface Location {
//   name: string
// }

// interface InterviewLink {
//   name: string
//   link: string
// }

// function EventPageContent() {
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   const applicantId = searchParams.get('applicantId')
//   const applicantName = searchParams.get('applicantName')
//   const applicantEmail = searchParams.get('applicantEmail')

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

//   const statusOptions = ["Pending", "Under Review", "Cleared", "Rejected"]

//   useEffect(() => {
//     fetchInterviewers()
//     fetchInterviewRounds()
//     fetchLocations()
//     fetchInterviewLinks()
//   }, [])

//   useEffect(() => {
//     document.title = 'Interview Scheduling'
//   }, [])

//   const fetchInterviewLinks = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/resource/Interview Link?fields=["name","google_meet"]&limit_page_length=100`,
//         {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       )
//       const data = await response.json()
//       if (data && data.data) {
//         // Map google_meet to link for consistency
//         const mappedLinks = data.data.map((item: any) => ({
//           name: item.name,
//           link: item.google_meet
//         }))
//         setInterviewLinks(mappedLinks)
//         console.log("Fetched interview links:", mappedLinks)
//       }
//     } catch (error) {
//       console.error("Error fetching interview links:", error)
//     }
//   }

//   const fetchLocations = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/resource/Location?fields=["name"]&limit_page_length=100`,
//         {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       )
//       const data = await response.json()
//       if (data && data.data) {
//         setLocations(data.data)
//         console.log("Fetched locations:", data.data)
//       }
//     } catch (error) {
//       console.error("Error fetching locations:", error)
//     }
//   }

//   const fetchInterviewRounds = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/resource/Interview Round?fields=["name","round_name"]&limit_page_length=100`,
//         {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       )
//       const data = await response.json()
//       if (data && data.data) {
//         setInterviewRounds(data.data)
//         console.log("Fetched interview rounds:", data.data)
//       }
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
//         {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       )
//       const data = await response.json()
//       if (data && data.data) {
//         const filteredUsers = data.data.filter(
//           (user: any) => user.name !== "Administrator" && user.name !== "Guest"
//         )
//         setAvailableInterviewers(filteredUsers)
//         console.log("Fetched interviewers:", filteredUsers)
//       }
//     } catch (error) {
//       console.error("Error fetching interviewers:", error)
//     }
//   }

//   const handleInterviewerToggle = (interviewer: string) => {
//     setEventForm((prev) => ({
//       ...prev,
//       interviewers: prev.interviewers.includes(interviewer)
//         ? prev.interviewers.filter((i) => i !== interviewer)
//         : [...prev.interviewers, interviewer],
//     }))
//   }

//   // const handleSaveEvent = async () => {
//   //   if (!eventForm.interviewRound || !eventForm.jobApplicant || !eventForm.scheduledOn || !eventForm.fromTime || !eventForm.toTime) {
//   //     alert("Please fill all required fields")
//   //     return
//   //   }

//   //   // Check if scheduled date is in the past
//   //   const selectedDate = new Date(eventForm.scheduledOn)
//   //   const today = new Date()
//   //   today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison
//   //   selectedDate.setHours(0, 0, 0, 0)

//   //   if (selectedDate < today) {
//   //     alert("Cannot schedule interview for past dates. Please select today or a future date.")
//   //     return
//   //   }

//   //   console.log("=== DEBUG ===");
//   //   console.log("Meeting Link from state:", eventForm.meetingLink);

//   //   setIsSaving(true)
//   //   try {
//   //     // Prepare interview data
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
//   //       // Success but different format
//   //       console.log("✅ Interview created successfully")
//   //       alert(`Interview created successfully!`)
//   //       router.push('/interview')
//   //     } else {
//   //       // Handle error response
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

//     // Check if scheduled date is in the past
//     const selectedDate = new Date(eventForm.scheduledOn)
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)
//     selectedDate.setHours(0, 0, 0, 0)

//     if (selectedDate < today) {
//       alert("Cannot schedule interview for past dates. Please select today or a future date.")
//       return
//     }

//     // Validate time range
//     if (eventForm.fromTime && eventForm.toTime) {
//       const fromTime = new Date(`2000-01-01T${eventForm.fromTime}`)
//       const toTime = new Date(`2000-01-01T${eventForm.toTime}`)

//       if (fromTime >= toTime) {
//         alert("To Time must be later than From Time")
//         return
//       }
//     }

//     setIsSaving(true)
//     try {
//       // CREATE NEW INTERVIEW (no update check)
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
//           interviewer: interviewer
//         }))
//       }

//       console.log("Creating interview:", JSON.stringify(interviewData, null, 2))

//       const csrfToken = await getFrappeCSRF()
//       const response = await fetch(
//         `${API_BASE_URL}/api/resource/Interview`,
//         {
//           method: 'POST',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//             "X-Frappe-CSRF-Token": csrfToken
//           },
//           body: JSON.stringify(interviewData)
//         }
//       )

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
//                 Schedule New Interview
//               </h1>
//             </div>
//             <p className="text-sm text-muted-foreground ml-[92px]">Create and schedule a new interview event for candidates</p>
//           </div>
//         </div>

//         <div className="max-w-5xl mx-auto space-y-6">
//           {/* Applicant Info Card */}
//           {applicantId && applicantName && (
//             <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
//               <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
//                 <div className="flex items-center gap-3 text-white">
//                   <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
//                     <Users className="h-6 w-6" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-blue-100">Interview Candidate</p>
//                     <h3 className="text-xl font-bold">{applicantName}</h3>
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           )}

//           {!applicantId && (
//             <Card className="border-2 border-yellow-200 shadow-lg bg-yellow-50/50 backdrop-blur-sm">
//               <CardContent className="pt-6">
//                 <div className="flex items-center gap-3 text-yellow-800">
//                   <AlertCircle className="h-5 w-5" />
//                   <p className="text-sm font-medium">No applicant selected. Please go back and select a candidate.</p>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Main Details Card */}
//           <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
//             <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
//               <CardTitle className="flex items-center gap-2">
//                 <Calendar className="h-5 w-5 text-blue-600" />
//                 Interview Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6 pt-6">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <CheckCircle2 className="h-4 w-4 text-blue-500" />
//                     Interview Round <span className="text-red-500">*</span>
//                   </Label>
//                   {interviewRounds.length > 0 ? (
//                     <Select
//                       value={eventForm.interviewRound}
//                       onValueChange={(value) => setEventForm({ ...eventForm, interviewRound: value })}
//                     >
//                       <SelectTrigger className="h-11 shadow-sm">
//                         <SelectValue placeholder="Select interview round" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {interviewRounds.map((round) => (
//                           <SelectItem key={round.name} value={round.name}>
//                             {round.round_name || round.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   ) : (
//                     <Input
//                       value={eventForm.interviewRound}
//                       onChange={(e) => setEventForm({ ...eventForm, interviewRound: e.target.value })}
//                       placeholder="Loading rounds..."
//                       className="h-11 shadow-sm"
//                       disabled
//                     />
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <Badge variant="outline" className="h-4 w-4 rounded-full p-0 border-2 border-blue-500" />
//                     Status <span className="text-red-500">*</span>
//                   </Label>
//                   <Select
//                     value={eventForm.status}
//                     onValueChange={(value) => setEventForm({ ...eventForm, status: value })}
//                   >
//                     <SelectTrigger className="h-11 shadow-sm">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {statusOptions.map((status) => (
//                         <SelectItem key={status} value={status}>
//                           <div className="flex items-center gap-2">
//                             <span className={`h-2 w-2 rounded-full ${status === "Cleared" ? "bg-green-500" :
//                               status === "Rejected" ? "bg-red-500" :
//                                 status === "Under Review" ? "bg-yellow-500" :
//                                   "bg-blue-500"
//                               }`} />
//                             {status}
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label className="flex items-center gap-2">
//                   <FileText className="h-4 w-4 text-blue-500" />
//                   Resume Link
//                 </Label>
//                 <Input
//                   type="url"
//                   value={eventForm.resumeLink}
//                   onChange={(e) => setEventForm({ ...eventForm, resumeLink: e.target.value })}
//                   placeholder="https://example.com/resume.pdf"
//                   className="h-11 shadow-sm"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label className="flex items-center gap-2">
//                   <Video className="h-4 w-4 text-blue-500" />
//                   Meeting Link
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     type="url"
//                     value={eventForm.meetingLink}
//                     onChange={(e) => setEventForm({ ...eventForm, meetingLink: e.target.value })}
//                     placeholder="Enter meeting link or select from saved links"
//                     className="h-11 shadow-sm pr-10"
//                     list="meeting-links"
//                   />
//                   {interviewLinks.length > 0 && (
//                     <datalist id="meeting-links">
//                       {interviewLinks.map((link) => (
//                         <option key={link.name} value={link.link} />
//                       ))}
//                     </datalist>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label className="flex items-center gap-2">
//                   <MapPin className="h-4 w-4 text-blue-500" />
//                   Location
//                 </Label>
//                 {locations.length > 0 ? (
//                   <Select
//                     value={eventForm.location}
//                     onValueChange={(value) => setEventForm({ ...eventForm, location: value })}
//                   >
//                     <SelectTrigger className="h-11 shadow-sm">
//                       <SelectValue placeholder="Select location" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {locations.map((location) => (
//                         <SelectItem key={location.name} value={location.name}>
//                           {location.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 ) : (
//                   <Input
//                     value={eventForm.location}
//                     onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
//                     placeholder="Loading locations..."
//                     className="h-11 shadow-sm"
//                     disabled
//                   />
//                 )}
//               </div>

//               <div className="grid md:grid-cols-3 gap-6">
//                 <div className="space-y-2 md:col-span-1">
//                   <Label className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4 text-blue-500" />
//                     Date <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       type="date"
//                       value={eventForm.scheduledOn}
//                       onChange={(e) => setEventForm({ ...eventForm, scheduledOn: e.target.value })}
//                       className="h-11 shadow-sm cursor-pointer"
//                       onClick={(e) => e.currentTarget.showPicker?.()}
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <Clock className="h-4 w-4 text-blue-500" />
//                     From <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       type="time"
//                       value={eventForm.fromTime}
//                       onChange={(e) => setEventForm({ ...eventForm, fromTime: e.target.value })}
//                       onFocus={(e) => e.currentTarget.showPicker?.()}
//                       className="h-11 shadow-sm cursor-pointer"
//                       placeholder="HH:MM"
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2">
//                     <Clock className="h-4 w-4 text-blue-500" />
//                     To <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       type="time"
//                       value={eventForm.toTime}
//                       onChange={(e) => setEventForm({ ...eventForm, toTime: e.target.value })}
//                       onFocus={(e) => e.currentTarget.showPicker?.()}
//                       min={eventForm.fromTime}
//                       className="h-11 shadow-sm cursor-pointer"
//                       placeholder="HH:MM"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Interviewers Section */}
//           <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
//             <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="flex items-center gap-2">
//                   <Users className="h-5 w-5 text-blue-600" />
//                   Select Interviewers
//                 </CardTitle>
//                 {eventForm.interviewers.length > 0 && (
//                   <Badge className="bg-blue-100 text-blue-800 border-blue-200">
//                     {eventForm.interviewers.length} selected
//                   </Badge>
//                 )}
//               </div>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <div className="border rounded-lg overflow-hidden shadow-sm">
//                 <div className="max-h-96 overflow-y-auto">
//                   <table className="w-full">
//                     <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b sticky top-0">
//                       <tr>
//                         <th className="text-left p-4 w-12">
//                           <Checkbox disabled />
//                         </th>
//                         <th className="text-left p-4 w-16 text-xs font-semibold text-gray-700 uppercase tracking-wider">No.</th>
//                         <th className="text-left p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Interviewer Details</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {availableInterviewers.length > 0 ? (
//                         availableInterviewers.map((interviewer, index) => (
//                           <tr
//                             key={interviewer.name}
//                             className="hover:bg-blue-50/50 transition-colors cursor-pointer"
//                             onClick={() => handleInterviewerToggle(interviewer.name)}
//                           >
//                             <td className="p-4">
//                               <Checkbox
//                                 checked={eventForm.interviewers.includes(interviewer.name)}
//                                 onCheckedChange={() => handleInterviewerToggle(interviewer.name)}
//                                 onClick={(e) => e.stopPropagation()}
//                               />
//                             </td>
//                             <td className="p-4 text-sm text-gray-500 font-medium">{index + 1}</td>
//                             <td className="p-4">
//                               <div className="flex items-center gap-3">
//                                 <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-sm">
//                                   {(interviewer.full_name || interviewer.name).charAt(0).toUpperCase()}
//                                 </div>
//                                 <div className="flex flex-col">
//                                   <span className="text-sm font-semibold text-gray-900">
//                                     {interviewer.full_name || interviewer.name}
//                                   </span>
//                                   <span className="text-xs text-gray-500">{interviewer.email}</span>
//                                 </div>
//                               </div>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan={3} className="p-8 text-center text-gray-500">
//                             <div className="flex flex-col items-center gap-2">
//                               <Users className="h-12 w-12 text-gray-300" />
//                               <p className="text-sm font-medium">Loading interviewers...</p>
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
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
//               onClick={handleSaveEvent}
//               disabled={isSaving || !applicantId}
//               className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 h-11 shadow-lg hover:shadow-xl transition-all"
//             >
//               {isSaving ? (
//                 <span className="flex items-center gap-2">
//                   <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   Saving...
//                 </span>
//               ) : (
//                 "Create Interview"
//               )}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
// export default function EventPage() {
//   return (
//     <Suspense fallback={
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     }>
//       <EventPageContent />
//     </Suspense>
//   )
// }








"use client"
import { useState, useEffect, Suspense } from "react"
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
  .ev-header { height: 60px; background: #fff; border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 28px; gap: 12px; position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 0 rgba(0,158,247,.08); }
  .ev-toggle { width: 34px; height: 34px; border-radius: 8px; background: none; border: 1px solid var(--border); cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--t2); transition: all .14s; }
  .ev-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .ev-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .ev-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
  .ev-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }
  .ev-hdr-right { margin-left: auto; }
  .ev-btn-out { display: inline-flex; align-items: center; gap: 7px; padding: 7px 14px; border-radius: 8px; background: transparent; color: var(--t2); font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; border: 1px solid var(--border); cursor: pointer; transition: all .14s; }
  .ev-btn-out:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

  /* PAGE — full-width centred wrapper */
  .ev-page-outer { flex: 1; display: flex; justify-content: center; padding: 28px 32px; }
  .ev-page { width: 100%; max-width: 860px; display: flex; flex-direction: column; gap: 20px; }
  .ev-page-title { font-size: 21px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; }
  .ev-page-sub   { font-size: 13px; color: var(--t3); margin-top: 4px; }

  /* CARDS */
  .ev-card { background: var(--card); border: 1px solid var(--border-s); border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,158,247,.06); }
  .ev-card-head { padding: 14px 20px; border-bottom: 1px solid var(--border-s); display: flex; align-items: center; justify-content: space-between; background: linear-gradient(to right, #f8fcff, var(--accent-lt)); }
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
  .ev-select { width: 100%; height: 44px; padding: 0 36px 0 13px; border: 1px solid var(--border); border-radius: 9px; background: var(--bg); font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--t2); appearance: none; outline: none; cursor: pointer; transition: all .15s; }
  .ev-select:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
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
    .ev-main { margin-left: 0 !important; }
    .ev-page-outer { padding: 16px; }
    .ev-header { padding: 0 16px; }
    .ev-form-grid, .ev-form-grid3 { grid-template-columns: 1fr; }
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
  const [isSaving, setIsSaving] = useState(false)


  const statusOptions = ["Pending", "Under Review", "Cleared", "Rejected"]

  useEffect(() => {
    fetchInterviewers()
    fetchInterviewRounds()
    fetchLocations()
    fetchInterviewLinks()
  }, [])

  useEffect(() => { document.title = 'Interview Scheduling' }, [])

  const fetchInterviewLinks = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/resource/Interview Link?fields=["name","google_meet"]&limit_page_length=100`,
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
        `${API_BASE_URL}/api/resource/Interview Round?fields=["name","round_name"]&limit_page_length=100`,
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
        `${API_BASE_URL}/api/resource/User?fields=["name","full_name","email"]&filters=[["enabled","=",1]]&limit_page_length=100`,
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
    const selectedDate = new Date(eventForm.scheduledOn)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      alert("Cannot schedule interview for past dates. Please select today or a future date.")
      return
    }
    if (eventForm.fromTime && eventForm.toTime) {
      const fromTime = new Date(`2000-01-01T${eventForm.fromTime}`)
      const toTime = new Date(`2000-01-01T${eventForm.toTime}`)
      if (fromTime >= toTime) { alert("To Time must be later than From Time"); return }
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
        resume_link: eventForm.resumeLink || '',
        custom_meeting_link: eventForm.meetingLink || '',
        custom_location: eventForm.location || '',
        status: eventForm.status,
        scheduled_on: eventForm.scheduledOn,
        from_time: eventForm.fromTime,
        to_time: eventForm.toTime,
        job_title: null,
        interview_details: eventForm.interviewers.map((interviewer) => ({
          doctype: "Interview Detail",
          interviewer,
        }))
      }
      console.log("Creating interview:", JSON.stringify(interviewData, null, 2))
      const csrfToken = await getFrappeCSRF()
      // Clear bad job_title from applicant before creating interview
      try {
        const csrfToken2 = await getFrappeCSRF()
        await fetch(`${API_BASE_URL}/api/method/frappe.client.set_value`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken2 },
          body: JSON.stringify({
            doctype: 'Job Applicant',
            name: eventForm.jobApplicant,
            fieldname: 'job_title',
            value: ''
          })
        })
      } catch (e) { console.log('Could not clear job_title', e) }
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
              <div className="ev-crumb">
                <Home size={13} /> Home <ChevronRight size={13} />
                <a href="/interview" style={{ color: 'var(--t3)', textDecoration: 'none' }}>Interview Management</a>
                <ChevronRight size={13} /> <strong>Schedule Interview</strong>
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
                    <div className="ev-form-grid">
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

                    <div className="ev-form-field">
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
                <div className="ev-card">
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
                      </thead>
                      <tbody>
                        {availableInterviewers.length > 0 ? (
                          availableInterviewers.map((interviewer, index) => (
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
      </div>
    </>
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
