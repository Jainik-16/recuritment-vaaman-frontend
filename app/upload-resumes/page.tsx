// "use client"
// import { useEffect, useState } from "react"
// import type React from "react"
// import axios from "axios"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Progress } from "@/components/ui/progress"
// import { useToast } from "@/hooks/use-toast"
// import { Toaster } from "@/components/ui/toaster"
// import { axiosConfig, axiosConfigMultipart } from '@/lib/axios-config'
// import {
//   Upload,
//   FileText,
//   ArrowLeft,
//   Briefcase,
//   Users,
//   MapPin,
//   CheckCircle,
//   Cloud,
//   Zap,
//   Target,
//   TrendingUp,
//   Clock,
//   Building,
//   X,
//   FileCheck,
//   Trash2,
// } from "lucide-react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { API_BASE_URL } from '@/lib/api-config'
// import { getFrappeCSRF } from "@/lib/csrf"


// interface JobOpening {
//   name: string
//   job_title: string
//   designation: string
//   company?: string
//   location?: string
//   department?: string
// }

// export default function ResumeUploader() {
//   const [jobs, setJobs] = useState<JobOpening[]>([])
//   const [selectedJobId, setSelectedJobId] = useState("")
//   const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null)
//   const [files, setFiles] = useState<File[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [uploadProgress, setUploadProgress] = useState(0)
//   const [dragActive, setDragActive] = useState(false)
//   const [processedFiles, setProcessedFiles] = useState<string[]>([])
//   const { toast } = useToast()
//   const router = useRouter()

//   useEffect(() => {
//     const stored = localStorage.getItem("selectedJobOpening")
//     if (stored) {
//       try {
//         const job = JSON.parse(stored)
//         setSelectedJobId(job.name)
//         setSelectedJob(job)
//         localStorage.removeItem("selectedJobOpening")
//       } catch (e) {
//         console.error("Failed to parse stored job opening", e)
//       }
//     }
//   }, [])


//   // useEffect(() => {
//   //   async function fetchJobs() {
//   //     try {
//   //       const res = await axios.get(
//   //         `${API_BASE_URL}/api/resource/Job Opening?fields=["name","job_title","designation","company","location","department"]`,
//   //         axiosConfig,
//   //       )
//   //       setJobs(res.data.data)

//   //       toast({
//   //         title: "Job Openings Loaded",
//   //         description: `Found ${res.data.data.length} active job openings.`,
//   //         duration: 3000,
//   //       })
//   //     } catch (err) {
//   //       console.error("Failed to fetch jobs", err)
//   //       toast({
//   //         variant: "destructive",
//   //         title: "Failed to Load Jobs",
//   //         description: "Could not fetch job openings. Please refresh the page.",
//   //         duration: 5000,
//   //       })
//   //     }
//   //   }
//   //   fetchJobs()
//   // }, [toast])
//   useEffect(() => {
//     async function fetchJobs() {
//       try {
//         const res = await fetch(
//           // `${API_BASE_URL}/api/resource/Job Opening?fields=["name","job_title","designation","company","location","department"]&order_by=creation desc`,
//           `${API_BASE_URL}/api/resource/Job Opening?fields=["name","job_title","designation","company","location","department"]&filters=[["status","!=","Closed"]]&order_by=creation desc`,
//           {
//             method: 'GET',
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json',
//             }
//           }
//         )

//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`)
//         }

//         const data = await res.json()
//         setJobs(data.data)

//         toast({
//           title: "Job Openings Loaded",
//           description: `Found ${data.data.length} active job openings.`,
//           duration: 3000,
//         })
//       } catch (err) {
//         console.error("Failed to fetch jobs", err)
//         toast({
//           variant: "destructive",
//           title: "Failed to Load Jobs",
//           description: "Could not fetch job openings. Please refresh the page.",
//           duration: 5000,
//         })
//       }
//     }
//     fetchJobs()
//   }, [toast])

//   useEffect(() => {
//     document.title = 'Upload Resumes'
//   }, [])

//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true)
//     } else if (e.type === "dragleave") {
//       setDragActive(false)
//     }
//   }

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setDragActive(false)

//     const droppedFiles = Array.from(e.dataTransfer.files)
//     const pdfFiles = droppedFiles.filter((file) => file.type === "application/pdf")
//     const nonPdfFiles = droppedFiles.filter((file) => file.type !== "application/pdf")

//     if (nonPdfFiles.length > 0) {
//       toast({
//         variant: "destructive",
//         title: "Invalid File Types",
//         description: `${nonPdfFiles.length} file(s) were skipped. Only PDF files are allowed.`,
//         duration: 4000,
//       })
//     }

//     if (pdfFiles.length > 0) {
//       setFiles((prev) => [...prev, ...pdfFiles])
//       toast({
//         title: "Files Added",
//         description: `${pdfFiles.length} PDF file(s) added successfully.`,
//         duration: 3000,
//       })
//     }
//   }

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const selectedFiles = Array.from(e.target.files)
//       const pdfFiles = selectedFiles.filter((file) => file.type === "application/pdf")
//       const nonPdfFiles = selectedFiles.filter((file) => file.type !== "application/pdf")

//       if (nonPdfFiles.length > 0) {
//         toast({
//           variant: "destructive",
//           title: "Invalid File Types",
//           description: `${nonPdfFiles.length} file(s) were skipped. Only PDF files are allowed.`,
//           duration: 4000,
//         })
//       }

//       if (pdfFiles.length > 0) {
//         setFiles((prev) => [...prev, ...pdfFiles])
//         toast({
//           title: "Files Selected",
//           description: `${pdfFiles.length} PDF file(s) selected for upload.`,
//           duration: 3000,
//         })
//       }
//     }
//   }

//   const removeFile = (index: number) => {
//     const fileName = files[index].name
//     setFiles((prev) => prev.filter((_, i) => i !== index))
//     toast({
//       title: "File Removed",
//       description: `${fileName} has been removed from the upload queue.`,
//       duration: 2000,
//     })
//   }

//   const clearAllFiles = () => {
//     const fileCount = files.length
//     setFiles([])
//     toast({
//       title: "All Files Cleared",
//       description: `${fileCount} file(s) removed from the upload queue.`,
//       duration: 3000,
//     })
//   }

//   const handleJobSelect = (jobId: string) => {
//     setSelectedJobId(jobId)
//     const job = jobs.find((j) => j.name === jobId)
//     setSelectedJob(job || null)

//     if (job) {
//       toast({
//         title: "Job Selected",
//         description: `Selected "${job.job_title}" for resume uploads.`,
//         duration: 3000,
//       })
//     }
//   }

//   const handleUpload = async (e: React.FormEvent) => {
//     e.preventDefault()

//     // Validation
//     if (files.length === 0) {
//       toast({
//         variant: "destructive",
//         title: "No Files Selected",
//         description: "Please select at least one PDF resume file to upload.",
//         duration: 4000,
//       })
//       return
//     }

//     if (!selectedJobId) {
//       toast({
//         variant: "destructive",
//         title: "No Job Selected",
//         description: "Please select a job opening before uploading resumes.",
//         duration: 4000,
//       })
//       return
//     }

//     setIsLoading(true)
//     setUploadProgress(0)
//     setProcessedFiles([])

//     // Show initial loading toast
//     toast({
//       title: "🚀 Starting Upload Process",
//       description: `Processing ${files.length} resume(s) with AI analysis...`,
//       duration: 3000,
//     })

//     try {
//       const successfulUploads: string[] = []
//       const failedUploads: string[] = []

//       // for (let i = 0; i < files.length; i++) {
//       //   const file = files[i]
//       //   try {
//       //     const formData = new FormData()
//       //     formData.append("files", file)
//       //     formData.append("job_opening", selectedJobId)
//       //     // await axios.post("http://localhost:8000/api/method/resume.api.upload_and_process", formData, API_AUTH)
//       //     await axios.post(`${API_BASE_URL}/api/method/resume.api.upload_and_process.upload_and_process`, formData, axiosConfigMultipart)
//       //     successfulUploads.push(file.name)
//       //     setProcessedFiles((prev) => [...prev, file.name])

//       //     const progress = ((i + 1) / files.length) * 100
//       //     setUploadProgress(progress)

//       //     // Show progress toast for each file
//       //     toast({
//       //       title: `Processing ${file.name}`,
//       //       description: `File ${i + 1} of ${files.length} processed successfully.`,
//       //       duration: 2000,
//       //     })

//       //     //navigation


//       //   } catch (fileError) {
//       //     console.error(`Failed to upload ${file.name}:`, fileError)
//       //     failedUploads.push(file.name)
//       //   }
//       // }
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i]
//         try {
//           const formData = new FormData()
//           formData.append("files", file)
//           formData.append("job_opening", selectedJobId)
//           const csrfToken = await getFrappeCSRF()

//           const res = await fetch(
//             `${API_BASE_URL}/api/method/resume.api.upload_and_process.upload_and_process`,
//             {
//               method: 'POST',
//               credentials: 'include',
//               headers: {
//                 "X-Frappe-CSRF-Token": csrfToken,
//               },
//               body: formData,
//               // Note: Don't set Content-Type header for FormData, browser sets it automatically with boundary
//             }
//           )

//           if (!res.ok) {
//             throw new Error(`HTTP error! status: ${res.status}`)
//           }

//           await res.json()

//           successfulUploads.push(file.name)
//           setProcessedFiles((prev) => [...prev, file.name])

//           const progress = ((i + 1) / files.length) * 100
//           setUploadProgress(progress)

//           toast({
//             title: `Processing ${file.name}`,
//             description: `File ${i + 1} of ${files.length} processed successfully.`,
//             duration: 2000,
//           })
//         } catch (fileError) {
//           console.error(`Failed to upload ${file.name}:`, fileError)
//           failedUploads.push(file.name)
//         }
//       }

//       // Final success/error summary
//       if (successfulUploads.length === files.length) {
//         toast({
//           title: "🎉 All Resumes Processed Successfully!",
//           description: `${successfulUploads.length} resume(s) uploaded and analyzed. Candidates are now in your pipeline.`,
//           duration: 6000,
//           className: "bg-green-50 border-green-200",
//         })

//         // Navigate to interview schedule
//         setTimeout(() => {
//           // router.push("/interview")
//           router.push("/candidates")
//         }, 2000)


//       } else if (successfulUploads.length > 0) {
//         toast({
//           title: "⚠️ Partial Upload Success",
//           description: `${successfulUploads.length} of ${files.length} resumes processed successfully.`,
//           duration: 5000,
//           className: "bg-yellow-50 border-yellow-200",
//         })
//       }

//       if (failedUploads.length > 0) {
//         toast({
//           variant: "destructive",
//           title: "Some Uploads Failed",
//           description: `${failedUploads.length} file(s) failed to upload: ${failedUploads.slice(0, 2).join(", ")}${failedUploads.length > 2 ? "..." : ""}`,
//           duration: 8000,
//           action: (
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => {
//                 toast({
//                   title: "Retry Failed Uploads",
//                   description: "Please check the files and try uploading them again.",
//                   duration: 3000,
//                 })
//               }}
//             >
//               Retry
//             </Button>
//           ),
//         })
//       }

//       // Clear successful uploads
//       if (successfulUploads.length > 0) {
//         setFiles((prev) => prev.filter((file) => !successfulUploads.includes(file.name)))

//         if (successfulUploads.length === files.length) {
//           setSelectedJobId("")
//           setSelectedJob(null)

//           // Show next steps toast
//           setTimeout(() => {
//             toast({
//               title: "What's Next?",
//               description: "You can now review candidates and schedule interviews.",
//               duration: 4000,
//             })
//           }, 2000)
//         }
//       }
//     } catch (err) {
//       console.error("Upload failed", err)
//       toast({
//         variant: "destructive",
//         title: "❌ Upload Process Failed",
//         description: "An unexpected error occurred during the upload process.",
//         duration: 6000,
//         action: (
//           <Button variant="outline" size="sm" onClick={() => handleUpload(e)}>
//             Retry All
//           </Button>
//         ),
//       })
//     } finally {
//       setIsLoading(false)
//       setUploadProgress(0)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
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
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
//                 Resume Collection
//               </h1>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//             <CardContent className="p-6 text-center">
//               <div className="flex items-center justify-center space-x-2 mb-2">
//                 <Briefcase className="h-5 w-5 text-emerald-600" />
//                 <span className="text-2xl font-bold text-emerald-600">{jobs.length}</span>
//               </div>
//               <div className="text-sm text-muted-foreground">Active Job Openings</div>
//             </CardContent>
//           </Card>
//           {/* <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//             <CardContent className="p-6 text-center">
//               <div className="flex items-center justify-center space-x-2 mb-2">
//                 <Zap className="h-5 w-5 text-yellow-600" />
//                 <span className="text-2xl font-bold text-yellow-600">Fast</span>
//               </div>
//               <div className="text-sm text-muted-foreground">Processing</div>
//             </CardContent>
//           </Card> */}
//           {/* <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//             <CardContent className="p-6 text-center">
//               <div className="flex items-center justify-center space-x-2 mb-2">
//                 <Target className="h-5 w-5 text-purple-600" />
//                 <span className="text-2xl font-bold text-purple-600">Smart</span>
//               </div>
//               <div className="text-sm text-muted-foreground">Screening</div>
//             </CardContent>
//           </Card> */}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Job Selection */}
//           <div className="lg:col-span-1 space-y-6">
//             <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <Briefcase className="h-5 w-5" />
//                   <span>Select Job Opening</span>
//                 </CardTitle>
//                 <CardDescription>Choose the position you're hiring for</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <Select value={selectedJobId} onValueChange={handleJobSelect}>
//                   <SelectTrigger className="h-12">
//                     <SelectValue placeholder="Choose a job opening..." />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {jobs.map((job) => (
//                       <SelectItem key={job.name} value={job.name}>
//                         <div className="flex flex-col items-start">
//                           <span className="font-medium">{job.job_title}</span>
//                           <span className="text-sm text-muted-foreground">{job.designation}</span>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 {selectedJob && (
//                   <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
//                     <CardContent className="p-4 space-y-3">
//                       <div className="flex items-center space-x-2">
//                         <CheckCircle className="h-4 w-4 text-emerald-600" />
//                         <span className="font-semibold text-emerald-800">Selected Position</span>
//                       </div>
//                       <div className="space-y-2 text-sm">
//                         <div className="flex items-center space-x-2">
//                           <Briefcase className="h-3 w-3 text-emerald-600" />
//                           <span>{selectedJob.job_title}</span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Users className="h-3 w-3 text-emerald-600" />
//                           <span>{selectedJob.designation}</span>
//                         </div>
//                         {selectedJob.company && (
//                           <div className="flex items-center space-x-2">
//                             <Building className="h-3 w-3 text-emerald-600" />
//                             <span>{selectedJob.company}</span>
//                           </div>
//                         )}
//                         {selectedJob.location && (
//                           <div className="flex items-center space-x-2">
//                             <MapPin className="h-3 w-3 text-emerald-600" />
//                             <span>{selectedJob.location}</span>
//                           </div>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Upload Progress */}
//             {isLoading && (
//               <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//                 <CardContent className="p-6">
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <span className="font-medium">Processing Resumes</span>
//                       <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
//                     </div>
//                     <Progress value={uploadProgress} className="h-2" />
//                     <div className="flex items-center space-x-2 text-sm text-muted-foreground">
//                       <TrendingUp className="h-4 w-4" />
//                       <span>AI is analyzing and matching candidates...</span>
//                     </div>
//                     {/* {processedFiles.length > 0 && (
//                       <div className="space-y-1">
//                         <p className="text-xs text-muted-foreground">Recently processed:</p>
//                         {processedFiles.slice(-3).map((fileName, index) => (
//                           <div key={index} className="flex items-center space-x-2 text-xs">
//                             <FileCheck className="h-3 w-3 text-green-500" />
//                             <span className="truncate">{fileName}</span>
//                           </div>
//                         ))}
//                       </div>
//                     )} */}
//                     {processedFiles.length > 0 && (
//                       <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
//                         <div className="flex items-center space-x-2">
//                           <FileCheck className="h-4 w-4 text-emerald-600" />
//                           <span className="text-sm font-medium text-emerald-800">Processed</span>
//                         </div>
//                         <span className="text-lg font-bold text-emerald-600">
//                           {processedFiles.length} <span className="text-xs font-normal text-emerald-500">files</span>
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* File Upload */}
//           <div className="lg:col-span-2 space-y-6">
//             <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <Upload className="h-5 w-5" />
//                   <span>Upload Resumes</span>
//                 </CardTitle>
//                 <CardDescription>Drag & drop PDF files or click to browse</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleUpload} className="space-y-6">
//                   {/* Drag & Drop Area */}
//                   <div
//                     className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${dragActive
//                       ? "border-emerald-500 bg-emerald-50"
//                       : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50"
//                       }`}
//                     onDragEnter={handleDrag}
//                     onDragLeave={handleDrag}
//                     onDragOver={handleDrag}
//                     onDrop={handleDrop}
//                   >
//                     <input
//                       type="file"
//                       multiple
//                       accept="application/pdf"
//                       onChange={handleFileSelect}
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                     />
//                     <div className="space-y-4">
//                       <div className="flex justify-center">
//                         <div className="p-4 bg-emerald-100 rounded-full">
//                           <Cloud className="h-8 w-8 text-emerald-600" />
//                         </div>
//                       </div>
//                       <div>
//                         <p className="text-lg font-semibold">Drop your resume files here</p>
//                         <p className="text-muted-foreground">or click to browse your computer</p>
//                       </div>
//                       <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
//                         <div className="flex items-center space-x-1">
//                           <FileText className="h-4 w-4" />
//                           <span>PDF only</span>
//                         </div>
//                         <div className="flex items-center space-x-1">
//                           <Upload className="h-4 w-4" />
//                           <span>Multiple files</span>
//                         </div>
//                         {/* <div className="flex items-center space-x-1">
//                           <Zap className="h-4 w-4" />
//                           <span>AI powered</span>
//                         </div> */}
//                       </div>
//                     </div>
//                   </div>

//                   {/* File List */}
//                   {files.length > 0 && (
//                     <div className="space-y-3">
//                       <div className="flex items-center justify-between">
//                         <Label className="text-base font-semibold">Selected Files ({files.length})</Label>
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           onClick={clearAllFiles}
//                           className="text-red-500 hover:text-red-700 bg-transparent"
//                         >
//                           <Trash2 className="h-4 w-4 mr-1" />
//                           Clear All
//                         </Button>
//                       </div>
//                       <div className="space-y-2 max-h-48 overflow-y-auto">
//                         {files.map((file, index) => (
//                           <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                             <div className="flex items-center space-x-3">
//                               <FileText className="h-5 w-5 text-red-500" />
//                               <div>
//                                 <p className="font-medium text-sm">{file.name}</p>
//                                 <p className="text-xs text-muted-foreground">
//                                   {(file.size / 1024 / 1024).toFixed(2)} MB
//                                 </p>
//                               </div>
//                             </div>
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => removeFile(index)}
//                               className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                             >
//                               <X className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Submit Button */}
//                   <Button
//                     type="submit"
//                     disabled={isLoading || files.length === 0 || !selectedJobId}
//                     className="w-full h-12 text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
//                   >
//                     {isLoading ? (
//                       <div className="flex items-center space-x-2">
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         <span>Processing...</span>
//                       </div>
//                     ) : (
//                       <div className="flex items-center space-x-2">
//                         <Upload className="h-5 w-5" />
//                         <span>Upload & Process Resumes</span>
//                       </div>
//                     )}
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>

//             {/* Features
//             <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
//               <CardContent className="p-6">
//                 <h3 className="text-xl font-bold mb-4">AI-Powered Resume Processing</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="p-2 bg-white/20 rounded-lg">
//                       <Target className="h-5 w-5" />
//                     </div>
//                     <div>
//                       <p className="font-semibold">Smart Matching</p>
//                       <p className="text-sm text-emerald-100">AI matches skills to job requirements</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="p-2 bg-white/20 rounded-lg">
//                       <Zap className="h-5 w-5" />
//                     </div>
//                     <div>
//                       <p className="font-semibold">Instant Processing</p>
//                       <p className="text-sm text-emerald-100">Get results in seconds</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="p-2 bg-white/20 rounded-lg">
//                       <TrendingUp className="h-5 w-5" />
//                     </div>
//                     <div>
//                       <p className="font-semibold">Score Ranking</p>
//                       <p className="text-sm text-emerald-100">Automatic candidate scoring</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="p-2 bg-white/20 rounded-lg">
//                       <Clock className="h-5 w-5" />
//                     </div>
//                     <div>
//                       <p className="font-semibold">Time Saving</p>
//                       <p className="text-sm text-emerald-100">Reduce screening time by 80%</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card> */}
//           </div>
//         </div>
//       </div>

//       {/* Toast Container */}
//       <Toaster />
//     </div>
//   )
// }









"use client"
import { useEffect, useState } from "react"
import type React from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { axiosConfig, axiosConfigMultipart } from '@/lib/axios-config'
import {
  Upload,
  FileText,
  ArrowLeft,
  Briefcase,
  Users,
  MapPin,
  CheckCircle,
  Cloud,
  Zap,
  Target,
  TrendingUp,
  Clock,
  Building,
  X,
  FileCheck,
  Trash2,
  Home,
  ChevronRight,
  Menu,
  LogOut,
  Plus,
  MessageSquare,
  Calendar,
  UserCheck,
  Filter,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from '@/lib/api-config'
import { getFrappeCSRF } from "@/lib/csrf"

/* ─────────────────────────────────────────────────────────────
   CSS — identical design tokens as Dashboard & Job Opening
───────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ru {
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

    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13.5px;
    -webkit-font-smoothing: antialiased;
  }

  .ru-wrap { display: flex; min-height: 100vh; background: var(--bg); color: var(--t1); }

  /* ══ SIDEBAR ══ */
  .ru-sb {
    width: var(--sb-w); background: var(--sb);
    min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 100;
    display: flex; flex-direction: column;
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
  .ru-sb.collapsed { transform: translateX(calc(-1 * var(--sb-w))); }

  .ru-sb-brand {
    height: 64px; display: flex; align-items: center; gap: 12px;
    padding: 0 16px 0 22px; border-bottom: 1px solid var(--sb-bdr); flex-shrink: 0;
  }
  .ru-sb-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; flex-shrink: 0;
  }
  .ru-sb-icon img { width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1); }
  .ru-sb-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.1px; line-height: 1.25; }
  .ru-sb-sub  { font-size: 10.5px; color: var(--sb-lbl); margin-top: 1px; }

  .ru-sb-close {
    margin-left: auto; flex-shrink: 0;
    width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer;
    color: var(--sb-lbl);
    display: flex; align-items: center; justify-content: center; transition: all .14s;
  }
  .ru-sb-close:hover { background: var(--sb-hover); color: #fff; }

  .ru-nav { flex: 1; padding: 18px 12px; overflow-y: auto; }
  .ru-nav::-webkit-scrollbar { width: 3px; }
  .ru-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.06); border-radius: 4px; }

  .ru-nav-cta {
    display: flex; align-items: center; gap: 9px;
    padding: 11px 14px; border-radius: 9px;
    background: var(--accent-md); border: 1px solid var(--accent-bdr);
    color: var(--accent); font-size: 13px; font-weight: 600;
    text-decoration: none; transition: background .15s; margin-bottom: 22px;
  }
  .ru-nav-cta:hover { background: rgba(0,158,247,.24); }

  .ru-nav-lbl {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .11em; color: var(--sb-lbl); padding: 4px 12px 7px; margin-top: 4px;
  }
  .ru-nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--sb-txt);
    text-decoration: none; transition: all .14s;
  }
  .ru-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .5; }
  .ru-nav-link:hover { background: var(--sb-hover); color: #fff; }
  .ru-nav-link:hover svg { opacity: 1; }
  .ru-nav-link.active { background: var(--sb-hover); color: #fff; }
  .ru-nav-link.active svg { opacity: 1; }

  .ru-sb-foot { padding: 14px 12px; border-top: 1px solid var(--sb-bdr); flex-shrink: 0; }
  .ru-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 9px 12px; border-radius: 8px; background: none; border: none;
    cursor: pointer; font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--sb-lbl); text-align: left; transition: all .14s;
  }
  .ru-logout svg { opacity: .6; width: 15px; height: 15px; }
  .ru-logout:hover { background: rgba(239,68,68,.1); color: #f87171; }

  /* Overlay — mobile only */
  .ru-overlay {
    display: none;
    position: fixed; inset: 0; z-index: 99;
    background: rgba(13,27,42,.35); backdrop-filter: blur(2px); cursor: pointer;
  }
  @media (max-width: 768px) { .ru-overlay.show { display: block; } }

  /* ══ MAIN ══ */
  .ru-main {
    margin-left: var(--sb-w); flex: 1;
    display: flex; flex-direction: column; min-height: 100vh;
    transition: margin-left .25s cubic-bezier(.4,0,.2,1);
  }
  .ru-main.sb-closed { margin-left: 0; }

  /* ══ HEADER ══ */
  .ru-header {
    height: 60px; background: #fff;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 12px;
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 1px 0 rgba(0,158,247,.08);
  }
  .ru-toggle {
    width: 34px; height: 34px; border-radius: 8px;
    background: none; border: 1px solid var(--border);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--t2); flex-shrink: 0; transition: all .14s;
  }
  .ru-toggle:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .ru-btn-back {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 8px;
  background: transparent; color: var(--t2);
  font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
  border: 1px solid var(--border); cursor: pointer; text-decoration: none;
  transition: all .14s; white-space: nowrap;
  }
  .ru-btn-back:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }
  .ru-hdr-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .ru-crumb {
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; color: var(--t3);
  }
  .ru-crumb svg { width: 13px; height: 13px; }
  .ru-crumb strong { color: var(--t1); font-weight: 600; font-size: 13.5px; }
  .ru-hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }

  /* ══ BUTTONS ══ */
  .ru-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: 8px;
    background: var(--accent); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
    border: none; cursor: pointer; text-decoration: none; white-space: nowrap;
    transition: background .15s;
  }
  .ru-btn:hover { background: var(--accent-h); }
  .ru-btn:disabled { opacity: .5; cursor: not-allowed; }

  .ru-btn-out {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 14px; border-radius: 8px;
    background: transparent; color: var(--t2);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer; text-decoration: none;
    transition: all .14s; white-space: nowrap;
  }
  .ru-btn-out:hover { background: var(--accent-lt); border-color: var(--accent); color: var(--accent); }

  .ru-btn-danger {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 12px; border-radius: 7px;
    background: transparent; color: var(--t3);
    font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer;
    transition: all .14s; white-space: nowrap;
  }
  .ru-btn-danger:hover { background: var(--red-lt); border-color: #fca5a5; color: var(--red); }

  /* ══ PAGE ══ */
  .ru-page { padding: 28px 32px; display: flex; flex-direction: column; gap: 24px; }

  .ru-toolbar {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 20px;
  }
  .ru-page-title { font-size: 21px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; line-height: 1.15; }
  .ru-page-sub   { font-size: 13px; color: var(--t3); margin-top: 5px; font-weight: 400; }

  /* ══ STAT ROW ══ */
  .ru-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }

  .ru-stat {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 10px; padding: 16px 18px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 1px 3px rgba(0,158,247,.06);
  }
  .ru-stat-label { font-size: 11.5px; color: var(--t3); font-weight: 500; margin-bottom: 4px; }
  .ru-stat-val   { font-size: 22px; font-weight: 800; color: var(--t1); letter-spacing: -0.5px; line-height: 1; }
  .ru-stat-val.blue  { color: var(--accent); }
  .ru-stat-val.green { color: var(--green); }
  .ru-stat-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ru-stat-icon.blue  { background: var(--accent-lt); color: var(--accent); }
  .ru-stat-icon.green { background: var(--green-lt); color: var(--green); }

  /* ══ TWO-COL LAYOUT ══ */
  .ru-layout { display: grid; grid-template-columns: 300px 1fr; gap: 20px; }

  /* ══ PANEL CARD ══ */
  .ru-panel {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 12px; overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .ru-panel-head {
    padding: 16px 20px; border-bottom: 1px solid var(--border-s);
    display: flex; align-items: center; gap: 9px;
  }
  .ru-panel-head-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--accent-lt); color: var(--accent);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ru-panel-title { font-size: 14px; font-weight: 700; color: var(--t1); letter-spacing: -0.1px; }
  .ru-panel-sub   { font-size: 12px; color: var(--t3); margin-top: 2px; }
  .ru-panel-body  { padding: 18px 20px; }

  /* ══ SELECT ══ */
  .ru-select-wrap { position: relative; margin-bottom: 14px; }
  .ru-select {
    width: 100%; height: 42px;
    padding: 0 36px 0 14px;
    border: 1px solid var(--border); border-radius: 8px;
    background: var(--bg);
    font-family: 'Inter', sans-serif; font-size: 13px; color: var(--t1);
    appearance: none; outline: none; cursor: pointer;
    transition: all .15s;
  }
  .ru-select:focus { background: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,158,247,.12); }
  .ru-select-arrow {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    color: var(--t3); pointer-events: none;
  }

  /* ══ SELECTED JOB CARD ══ */
  .ru-job-card {
    background: linear-gradient(135deg, #f0fff4, #e0f4ff);
    border: 1px solid var(--green-bdr);
    border-radius: 10px; padding: 14px;
  }
  .ru-job-card-header {
    display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
  }
  .ru-job-card-title { font-size: 12.5px; font-weight: 600; color: var(--green); }
  .ru-job-row {
    display: flex; align-items: center; gap: 8px;
    font-size: 12.5px; color: var(--t2); margin-bottom: 6px;
  }
  .ru-job-row svg { color: var(--green); flex-shrink: 0; }
  .ru-job-row:last-child { margin-bottom: 0; }

  /* ══ PROGRESS BOX ══ */
  .ru-progress-panel {
    background: var(--card); border: 1px solid var(--border-s);
    border-radius: 12px; padding: 18px 20px; margin-top: 14px;
    box-shadow: 0 1px 4px rgba(0,158,247,.06);
  }
  .ru-progress-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 10px;
  }
  .ru-progress-label { font-size: 13px; font-weight: 600; color: var(--t1); }
  .ru-progress-pct   { font-size: 12.5px; color: var(--t3); }
  .ru-progress-bar-bg {
    width: 100%; height: 6px; background: var(--border-s); border-radius: 99px; overflow: hidden;
  }
  .ru-progress-bar-fill {
    height: 100%; background: var(--accent); border-radius: 99px;
    transition: width .3s ease;
  }
  .ru-progress-sub {
    display: flex; align-items: center; gap: 7px;
    font-size: 12px; color: var(--t3); margin-top: 10px;
  }
  .ru-processed-box {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; background: var(--green-lt);
    border: 1px solid var(--green-bdr); border-radius: 8px; margin-top: 10px;
  }
  .ru-processed-lbl { font-size: 12.5px; font-weight: 500; color: var(--green); display: flex; align-items: center; gap: 6px; }
  .ru-processed-val { font-size: 18px; font-weight: 800; color: var(--green); }

  /* ══ DROP ZONE ══ */
  .ru-dropzone {
    border: 2px dashed var(--border);
    border-radius: 12px; padding: 40px 24px; text-align: center;
    position: relative; cursor: pointer;
    transition: all .2s;
    background: var(--bg);
  }
  .ru-dropzone:hover, .ru-dropzone.active {
    border-color: var(--accent);
    background: var(--accent-lt);
  }
  .ru-dropzone input {
    position: absolute; inset: 0; width: 100%; height: 100%;
    opacity: 0; cursor: pointer;
  }
  .ru-dropzone-icon {
    width: 56px; height: 56px; border-radius: 14px;
    background: var(--accent-lt); color: var(--accent);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
  }
  .ru-dropzone-title { font-size: 14px; font-weight: 700; color: var(--t1); margin-bottom: 4px; }
  .ru-dropzone-sub   { font-size: 12.5px; color: var(--t3); }
  .ru-dropzone-chips {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    margin-top: 14px;
  }
  .ru-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px;
    background: var(--card); border: 1px solid var(--border);
    font-size: 11.5px; font-weight: 500; color: var(--t2);
  }
  .ru-chip svg { width: 12px; height: 12px; color: var(--accent); }

  /* ══ FILE LIST ══ */
  .ru-file-list-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 10px;
  }
  .ru-file-list-label { font-size: 13px; font-weight: 600; color: var(--t1); }
  .ru-file-scroll { max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; }
  .ru-file-scroll::-webkit-scrollbar { width: 3px; }
  .ru-file-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .ru-file-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; background: var(--bg);
    border: 1px solid var(--border-s); border-radius: 8px;
    transition: border-color .14s;
  }
  .ru-file-item:hover { border-color: var(--border); }
  .ru-file-item-left { display: flex; align-items: center; gap: 10px; }
  .ru-file-icon {
    width: 34px; height: 34px; border-radius: 8px;
    background: var(--red-lt); color: var(--red);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ru-file-name { font-size: 13px; font-weight: 500; color: var(--t1); }
  .ru-file-size { font-size: 11.5px; color: var(--t3); margin-top: 2px; }
  .ru-file-remove {
    width: 28px; height: 28px; border-radius: 7px;
    background: none; border: none; cursor: pointer;
    color: var(--t3); display: flex; align-items: center; justify-content: center;
    transition: all .14s; flex-shrink: 0;
  }
  .ru-file-remove:hover { background: var(--red-lt); color: var(--red); }

  /* ══ SUBMIT ══ */
  .ru-submit {
    width: 100%; height: 46px; border-radius: 9px;
    background: var(--accent); color: #fff;
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700;
    border: none; cursor: pointer; display: flex; align-items: center;
    justify-content: center; gap: 8px;
    transition: background .15s; letter-spacing: -0.1px;
    margin-top: 6px;
  }
  .ru-submit:hover:not(:disabled) { background: var(--accent-h); }
  .ru-submit:disabled { opacity: .5; cursor: not-allowed; }

  .ru-spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    animation: ru-spin .6s linear infinite; flex-shrink: 0;
  }
  @keyframes ru-spin { to { transform: rotate(360deg); } }

  /* ══ SECTION DIVIDER ══ */
  .ru-divider {
    display: flex; align-items: center; gap: 10px; margin: 6px 0;
  }
  .ru-divider-line { flex: 1; height: 1px; background: var(--border-s); }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 1024px) {
    .ru-layout { grid-template-columns: 1fr; }
    .ru-stats  { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .ru-sb { transform: translateX(calc(-1 * var(--sb-w))); }
    .ru-sb.open { transform: translateX(0); }
    .ru-main { margin-left: 0 !important; }
    .ru-page { padding: 18px 16px; }
    .ru-header { padding: 0 16px; }
    .ru-stats { grid-template-columns: 1fr; }
  }
`

interface JobOpening {
  name: string
  job_title: string
  designation: string
  company?: string
  location?: string
  department?: string
}

export default function ResumeUploader() {
  const [jobs, setJobs] = useState<JobOpening[]>([])
  const [selectedJobId, setSelectedJobId] = useState("")
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [processedFiles, setProcessedFiles] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // ── ALL ORIGINAL LOGIC UNCHANGED ──────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("selectedJobOpening")
    if (stored) {
      try {
        const job = JSON.parse(stored)
        setSelectedJobId(job.name)
        setSelectedJob(job)
        localStorage.removeItem("selectedJobOpening")
      } catch (e) {
        console.error("Failed to parse stored job opening", e)
      }
    }
  }, [])

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/resource/Job Opening?fields=["name","job_title","designation","company","location","department"]&filters=[["status","!=","Closed"]]&order_by=creation desc`,
          {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
          }
        )
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data = await res.json()
        setJobs(data.data)
        toast({ title: "Job Openings Loaded", description: `Found ${data.data.length} active job openings.`, duration: 3000 })
      } catch (err) {
        console.error("Failed to fetch jobs", err)
        toast({ variant: "destructive", title: "Failed to Load Jobs", description: "Could not fetch job openings. Please refresh the page.", duration: 5000 })
      }
    }
    fetchJobs()
  }, [toast])

  useEffect(() => { document.title = 'Upload Resumes' }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    const pdfFiles = droppedFiles.filter(f => f.type === "application/pdf")
    const nonPdfFiles = droppedFiles.filter(f => f.type !== "application/pdf")
    if (nonPdfFiles.length > 0) toast({ variant: "destructive", title: "Invalid File Types", description: `${nonPdfFiles.length} file(s) were skipped. Only PDF files are allowed.`, duration: 4000 })
    if (pdfFiles.length > 0) { setFiles(prev => [...prev, ...pdfFiles]); toast({ title: "Files Added", description: `${pdfFiles.length} PDF file(s) added successfully.`, duration: 3000 }) }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const pdfFiles = selectedFiles.filter(f => f.type === "application/pdf")
      const nonPdfFiles = selectedFiles.filter(f => f.type !== "application/pdf")
      if (nonPdfFiles.length > 0) toast({ variant: "destructive", title: "Invalid File Types", description: `${nonPdfFiles.length} file(s) were skipped. Only PDF files are allowed.`, duration: 4000 })
      if (pdfFiles.length > 0) { setFiles(prev => [...prev, ...pdfFiles]); toast({ title: "Files Selected", description: `${pdfFiles.length} PDF file(s) selected for upload.`, duration: 3000 }) }
    }
  }

  const removeFile = (index: number) => {
    const fileName = files[index].name
    setFiles(prev => prev.filter((_, i) => i !== index))
    toast({ title: "File Removed", description: `${fileName} has been removed from the upload queue.`, duration: 2000 })
  }

  const clearAllFiles = () => {
    const fileCount = files.length; setFiles([])
    toast({ title: "All Files Cleared", description: `${fileCount} file(s) removed from the upload queue.`, duration: 3000 })
  }

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId)
    const job = jobs.find(j => j.name === jobId)
    setSelectedJob(job || null)
    if (job) toast({ title: "Job Selected", description: `Selected "${job.job_title}" for resume uploads.`, duration: 3000 })
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) { toast({ variant: "destructive", title: "No Files Selected", description: "Please select at least one PDF resume file to upload.", duration: 4000 }); return }
    if (!selectedJobId) { toast({ variant: "destructive", title: "No Job Selected", description: "Please select a job opening before uploading resumes.", duration: 4000 }); return }

    setIsLoading(true); setUploadProgress(0); setProcessedFiles([])
    toast({ title: "🚀 Starting Upload Process", description: `Processing ${files.length} resume(s) with AI analysis...`, duration: 3000 })

    try {
      const successfulUploads: string[] = []
      const failedUploads: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        try {
          const formData = new FormData()
          formData.append("files", file)
          formData.append("job_opening", selectedJobId)
          const csrfToken = await getFrappeCSRF()
          const res = await fetch(`${API_BASE_URL}/api/method/resume.api.upload_and_process.upload_and_process`, {
            method: 'POST', credentials: 'include',
            headers: { "X-Frappe-CSRF-Token": csrfToken },
            body: formData,
          })
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
          await res.json()
          successfulUploads.push(file.name)
          setProcessedFiles(prev => [...prev, file.name])
          setUploadProgress(((i + 1) / files.length) * 100)
          toast({ title: `Processing ${file.name}`, description: `File ${i + 1} of ${files.length} processed successfully.`, duration: 2000 })
        } catch (fileError) {
          console.error(`Failed to upload ${file.name}:`, fileError)
          failedUploads.push(file.name)
        }
      }

      if (successfulUploads.length === files.length) {
        toast({ title: "🎉 All Resumes Processed Successfully!", description: `${successfulUploads.length} resume(s) uploaded and analyzed. Candidates are now in your pipeline.`, duration: 6000, className: "bg-green-50 border-green-200" })
        setTimeout(() => { router.push("/candidates") }, 2000)
      } else if (successfulUploads.length > 0) {
        toast({ title: "⚠️ Partial Upload Success", description: `${successfulUploads.length} of ${files.length} resumes processed successfully.`, duration: 5000, className: "bg-yellow-50 border-yellow-200" })
      }

      if (failedUploads.length > 0) {
        toast({
          variant: "destructive", title: "Some Uploads Failed",
          description: `${failedUploads.length} file(s) failed to upload: ${failedUploads.slice(0, 2).join(", ")}${failedUploads.length > 2 ? "..." : ""}`,
          duration: 8000,
          action: (<Button variant="outline" size="sm" onClick={() => { toast({ title: "Retry Failed Uploads", description: "Please check the files and try uploading them again.", duration: 3000 }) }}>Retry</Button>),
        })
      }

      if (successfulUploads.length > 0) {
        setFiles(prev => prev.filter(file => !successfulUploads.includes(file.name)))
        if (successfulUploads.length === files.length) {
          setSelectedJobId(""); setSelectedJob(null)
          setTimeout(() => { toast({ title: "What's Next?", description: "You can now review candidates and schedule interviews.", duration: 4000 }) }, 2000)
        }
      }
    } catch (err) {
      console.error("Upload failed", err)
      toast({
        variant: "destructive", title: "❌ Upload Process Failed",
        description: "An unexpected error occurred during the upload process.", duration: 6000,
        action: (<Button variant="outline" size="sm" onClick={() => handleUpload(e)}>Retry All</Button>),
      })
    } finally {
      setIsLoading(false); setUploadProgress(0)
    }
  }
  // ─────────────────────────────────────────────────────────

  const sidebarPipeline = [
    { id: "job-opening", title: "Job Opening", icon: <Briefcase size={15} />, href: "/job-opening" },
    { id: "resume", title: "Resume Collection", icon: <Upload size={15} />, href: "/upload-resumes" },
    { id: "candidates", title: "Candidates", icon: <Users size={15} />, href: "/candidates" },
    { id: "interview", title: "Interview Scheduling", icon: <Calendar size={15} />, href: "/interview" },
  ]
  const sidebarClosing = [
    { id: "feedback", title: "Candidate Feedback", icon: <MessageSquare size={15} />, href: "/feedback" },
    { id: "doc-verify", title: "Document Verification", icon: <FileText size={15} />, href: "/document-verify-list" },
    { id: "offer", title: "Offer Letter", icon: <Zap size={15} />, href: "/offer-list" },
    { id: "appointment", title: "Appointment Letter", icon: <UserCheck size={15} />, href: "/letter-appointment" },
  ]

  return (
    <>
      <style>{css}</style>
      <div className="ru">
        <div className="ru-wrap">

          {/* Overlay — mobile only */}
          <div className={`ru-overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

          {/* ══ SIDEBAR ══ */}
          <aside className={`ru-sb${sidebarOpen ? "" : " collapsed"}`}>
            <div className="ru-sb-brand">
              <div className="ru-sb-icon">
                <img src="/vaaman_logo.png" alt="logo" />
              </div>
              <div>
                <div className="ru-sb-name">Job Management</div>
                <div className="ru-sb-sub">HR Platform</div>
              </div>
              <button className="ru-sb-close" onClick={() => setSidebarOpen(false)} title="Close sidebar">
                <X size={15} />
              </button>
            </div>

            <nav className="ru-nav">
              <Link href="/create-job" className="ru-nav-cta">
                <Plus size={14} /> New Job Opening
              </Link>
              <div className="ru-nav-lbl">Pipeline</div>
              {sidebarPipeline.map(s => (
                <Link key={s.id} href={s.href}
                  className={`ru-nav-link${s.href === "/upload-resumes" ? " active" : ""}`}>
                  {s.icon} {s.title}
                </Link>
              ))}
              <div className="ru-nav-lbl" style={{ marginTop: 12 }}>Closing</div>
              {sidebarClosing.map(s => (
                <Link key={s.id} href={s.href} className="ru-nav-link">
                  {s.icon} {s.title}
                </Link>
              ))}
            </nav>

            <div className="ru-sb-foot">
              <button className="ru-logout">
                <LogOut size={15} /> Sign out
              </button>
            </div>
          </aside>

          {/* ══ MAIN ══ */}
          <div className={`ru-main${sidebarOpen ? "" : " sb-closed"}`}>

            {/* Header */}
            <header className="ru-header">
              <button className="ru-toggle" onClick={() => setSidebarOpen(o => !o)} title="Toggle sidebar">
                <Menu size={16} />
              </button>
              {/* <div className="ru-hdr-sep" /> */}
              <div className="ru-hdr-sep" />
              <Link href="/home" className="ru-btn-back">
                <ArrowLeft size={13} /> Back
              </Link>
              <div className="ru-hdr-sep" />
              <div className="ru-crumb"></div>
              <div className="ru-crumb">
                <Home size={13} /> Home
                <ChevronRight size={13} />
                <strong>Resume Collection</strong>
              </div>
              {/* <div className="ru-hdr-right">
                <Link href="/" className="ru-btn-out">
                  <ArrowLeft size={13} /> Back
                </Link>
              </div> */}
            </header>

            {/* Page */}
            <div className="ru-page">

              {/* Title */}
              <div className="ru-toolbar">
                <div>
                  <h1 className="ru-page-title">Resume Collection</h1>
                  <p className="ru-page-sub">Upload and process candidate resumes with AI analysis</p>
                </div>
              </div>

              {/* Stats */}
              <div className="ru-stats">
                <div className="ru-stat">
                  <div>
                    <div className="ru-stat-label">Active Openings</div>
                    <div className="ru-stat-val blue">{jobs.length}</div>
                  </div>
                  <div className="ru-stat-icon blue"><Briefcase size={18} /></div>
                </div>
                <div className="ru-stat">
                  <div>
                    <div className="ru-stat-label">Files Queued</div>
                    <div className="ru-stat-val blue">{files.length}</div>
                  </div>
                  <div className="ru-stat-icon blue"><FileText size={18} /></div>
                </div>
                <div className="ru-stat">
                  <div>
                    <div className="ru-stat-label">Processed</div>
                    <div className="ru-stat-val green">{processedFiles.length}</div>
                  </div>
                  <div className="ru-stat-icon green"><CheckCircle size={18} /></div>
                </div>
              </div>

              {/* Two-col layout */}
              <div className="ru-layout">

                {/* LEFT — job select + progress */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                  {/* Job Selection Panel */}
                  <div className="ru-panel">
                    <div className="ru-panel-head">
                      <div className="ru-panel-head-icon"><Briefcase size={15} /></div>
                      <div>
                        <div className="ru-panel-title">Select Job Opening</div>
                        <div className="ru-panel-sub">Choose the position you're hiring for</div>
                      </div>
                    </div>
                    <div className="ru-panel-body">
                      <div className="ru-select-wrap">
                        <select
                          className="ru-select"
                          value={selectedJobId}
                          onChange={e => handleJobSelect(e.target.value)}
                        >
                          <option value="">Choose a job opening...</option>
                          {jobs.map(job => (
                            <option key={job.name} value={job.name}>
                              {job.job_title} — {job.designation}
                            </option>
                          ))}
                        </select>
                        <ChevronRight size={14} className="ru-select-arrow" style={{ transform: 'translateY(-50%) rotate(90deg)' }} />
                      </div>

                      {selectedJob && (
                        <div className="ru-job-card">
                          <div className="ru-job-card-header">
                            <CheckCircle size={14} style={{ color: 'var(--green)' }} />
                            <span className="ru-job-card-title">Selected Position</span>
                          </div>
                          <div className="ru-job-row">
                            <Briefcase size={12} />
                            <span>{selectedJob.job_title}</span>
                          </div>
                          <div className="ru-job-row">
                            <Users size={12} />
                            <span>{selectedJob.designation}</span>
                          </div>
                          {selectedJob.company && (
                            <div className="ru-job-row">
                              <Building size={12} />
                              <span>{selectedJob.company}</span>
                            </div>
                          )}
                          {selectedJob.location && (
                            <div className="ru-job-row">
                              <MapPin size={12} />
                              <span>{selectedJob.location}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Panel */}
                  {isLoading && (
                    <div className="ru-progress-panel">
                      <div className="ru-progress-head">
                        <span className="ru-progress-label">Processing Resumes</span>
                        <span className="ru-progress-pct">{Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="ru-progress-bar-bg">
                        <div className="ru-progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <div className="ru-progress-sub">
                        <TrendingUp size={13} />
                        <span>AI is analyzing and matching candidates...</span>
                      </div>
                      {processedFiles.length > 0 && (
                        <div className="ru-processed-box">
                          <div className="ru-processed-lbl">
                            <FileCheck size={14} /> Processed
                          </div>
                          <div className="ru-processed-val">{processedFiles.length} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--green)' }}>files</span></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* RIGHT — upload panel */}
                <div className="ru-panel">
                  <div className="ru-panel-head">
                    <div className="ru-panel-head-icon"><Upload size={15} /></div>
                    <div>
                      <div className="ru-panel-title">Upload Resumes</div>
                      <div className="ru-panel-sub">Drag & drop PDF files or click to browse</div>
                    </div>
                  </div>
                  <div className="ru-panel-body">
                    <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                      {/* Drop Zone */}
                      <div
                        className={`ru-dropzone${dragActive ? " active" : ""}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input type="file" multiple accept="application/pdf" onChange={handleFileSelect} />
                        <div className="ru-dropzone-icon">
                          <Cloud size={24} />
                        </div>
                        <div className="ru-dropzone-title">Drop your resume files here</div>
                        <div className="ru-dropzone-sub">or click to browse your computer</div>
                        <div className="ru-dropzone-chips">
                          <div className="ru-chip"><FileText size={12} />PDF only</div>
                          <div className="ru-chip"><Upload size={12} />Multiple files</div>
                        </div>
                      </div>

                      {/* File List */}
                      {files.length > 0 && (
                        <div>
                          <div className="ru-file-list-head">
                            <span className="ru-file-list-label">Selected Files ({files.length})</span>
                            <button type="button" className="ru-btn-danger" onClick={clearAllFiles}>
                              <Trash2 size={13} /> Clear All
                            </button>
                          </div>
                          <div className="ru-file-scroll">
                            {files.map((file, index) => (
                              <div key={index} className="ru-file-item">
                                <div className="ru-file-item-left">
                                  <div className="ru-file-icon"><FileText size={15} /></div>
                                  <div>
                                    <div className="ru-file-name">{file.name}</div>
                                    <div className="ru-file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                  </div>
                                </div>
                                <button type="button" className="ru-file-remove" onClick={() => removeFile(index)}>
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        className="ru-submit"
                        disabled={isLoading || files.length === 0 || !selectedJobId}
                      >
                        {isLoading ? (
                          <>
                            <div className="ru-spinner" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            Upload & Process Resumes
                          </>
                        )}
                      </button>

                    </form>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Toast Container */}
      <Toaster />
    </>
  )
}
