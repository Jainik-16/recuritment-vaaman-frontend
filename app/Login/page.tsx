// "use client"
// import { useEffect, useState } from "react"
// import { Briefcase, Lock, User, Loader2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { cn } from "@/lib/utils"
// import { useRouter } from "next/navigation"
// import { FRAPPE_BASE_URL } from "@/lib/api-config"


// function LoginPage() {
//     const [email, setEmail] = useState("")
//     const [password, setPassword] = useState("")
//     const [isLoading, setIsLoading] = useState(false)
//     const [error, setError] = useState("")
//     const router = useRouter()

//     const handleLogin = async (e: React.FormEvent) => {
//         e.preventDefault()
//         setError("")
//         setIsLoading(true)

//         try {
//             const LOGIN_URL = `${FRAPPE_BASE_URL}/api/method/login`

//             const response = await fetch(LOGIN_URL, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/x-www-form-urlencoded",
//                 },
//                 body: new URLSearchParams({
//                     usr: email,
//                     pwd: password,
//                 }).toString(),
//                 credentials: "include",
//             })

//             if (response.ok) {
//                 const data = await response.json()
//                 console.log("Login successful:", data)

//                 if (data.message === "Logged In") {
//                     localStorage.setItem("isLoggedIn", "true")
//                     router.push("/")
//                 } else {
//                     setError("Unexpected response from server.")
//                 }
//             } else {
//                 let msg = "Login failed. Please check credentials."
//                 try {
//                     const errorData = await response.json()
//                     if (errorData.message && typeof errorData.message === "string") {
//                         msg = errorData.message.replace(/[\n\r]/g, " ")
//                     }
//                 } catch { }
//                 setError(msg)
//             }
//         } catch (err) {
//             console.error("Network error:", err)
//             setError("Could not connect to the server. Check your connection.")
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     useEffect(() => {
//         document.title = 'Login'
//     }, [])

//     return (
//         <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
//             <div
//                 className={cn(
//                     "w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 space-y-8",
//                     "border border-gray-200 dark:border-gray-700"
//                 )}
//             >
//                 {/* Header */}
//                 <div className="text-center space-y-2">
//                     <div className="flex items-center justify-center">
//                         <div className="p-3 rounded-full">
//                             <img
//                                 src="/vaaman_logo.png"
//                                 alt="Vaaman Logo"
//                                 className="w-12 h-12 object-contain"
//                             />
//                         </div>
//                     </div>
//                     <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                         Job Management System
//                     </h1>
//                     <p className="text-gray-500 dark:text-gray-400">
//                         Sign in to continue to your recruitment dashboard.
//                     </p>
//                 </div>

//                 {/* Login Form */}
//                 <form className="space-y-6" onSubmit={handleLogin}>
//                     {/* Email */}
//                     <div className="space-y-2">
//                         <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
//                             Email / Username
//                         </Label>
//                         <div className="relative">
//                             <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                             <Input
//                                 id="email"
//                                 type="text"
//                                 placeholder="Enter your email or username"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 required
//                                 className="pl-10 h-11 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
//                             />
//                         </div>
//                     </div>

//                     {/* Password */}
//                     <div className="space-y-2">
//                         <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
//                             Password
//                         </Label>
//                         <div className="relative">
//                             <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                             <Input
//                                 id="password"
//                                 type="password"
//                                 placeholder="Enter your password"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 required
//                                 className="pl-10 h-11 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
//                             />
//                         </div>
//                     </div>

//                     {/* Error */}
//                     {error && (
//                         <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-700">
//                             {error}
//                         </div>
//                     )}

//                     {/* Login Button */}
//                     <Button
//                         type="submit"
//                         disabled={isLoading}
//                         className={cn(
//                             "w-full h-11 font-semibold text-base transition-all duration-200",
//                             "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg",
//                             isLoading && "opacity-80 cursor-not-allowed"
//                         )}
//                     >
//                         {isLoading ? (
//                             <span className="flex items-center">
//                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                 Signing In...
//                             </span>
//                         ) : (
//                             "Login"
//                         )}
//                     </Button>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default LoginPage









"use client"
import { useEffect, useState } from "react"
import { Lock, User, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { FRAPPE_BASE_URL } from "@/lib/api-config"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lgn {
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
    --red:       #dc2626;
    --red-lt:    #fee2e2;
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }

  /* decorative bg blobs */
  .lgn::before {
    content: '';
    position: fixed;
    top: -120px; left: -120px;
    width: 420px; height: 420px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,158,247,.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .lgn::after {
    content: '';
    position: fixed;
    bottom: -100px; right: -100px;
    width: 380px; height: 380px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,91,219,.10) 0%, transparent 70%);
    pointer-events: none;
  }

  /* ══ CARD ══ */
  .lgn-card {
    width: 100%;
    max-width: 440px;
    background: var(--card);
    border: 1px solid var(--border-s);
    border-radius: 20px;
    padding: 40px 40px 36px;
    box-shadow: 0 8px 32px rgba(0,158,247,.1), 0 1px 4px rgba(0,0,0,.06);
    position: relative;
    z-index: 1;
  }

  /* ══ HEADER ══ */
  .lgn-header { text-align: center; margin-bottom: 32px; }
  .lgn-logo-wrap {
    width: 72px; height: 72px; border-radius: 50%;
    background: var(--accent-md);
    border: 2px solid rgba(0,158,247,.25);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 18px;
    box-shadow: 0 4px 14px rgba(0,158,247,.15);
  }
  .lgn-logo-wrap img { width: 40px; height: 40px; object-fit: contain; }
  .lgn-title {
    font-size: 22px; font-weight: 800; color: var(--t1);
    letter-spacing: -0.5px; line-height: 1.2; margin-bottom: 8px;
  }
  .lgn-title span {
    background: linear-gradient(135deg, var(--accent), #3b5bdb);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .lgn-sub { font-size: 13.5px; color: var(--t3); line-height: 1.5; }

  /* ══ DIVIDER ══ */
  .lgn-divider { height: 1px; background: var(--border-s); margin-bottom: 28px; }

  /* ══ FORM ══ */
  .lgn-form { display: flex; flex-direction: column; gap: 20px; }

  .lgn-field { display: flex; flex-direction: column; gap: 6px; }
  .lgn-label {
    font-size: 12px; font-weight: 600; color: var(--t2);
    letter-spacing: 0.02em; display: flex; align-items: center; gap: 5px;
  }
  .lgn-input-wrap { position: relative; }
  .lgn-input-wrap svg {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    width: 15px; height: 15px; color: var(--t3); pointer-events: none;
    transition: color .15s;
  }
  .lgn-input {
    width: 100%; height: 44px; padding: 0 14px 0 40px;
    border-radius: 9px; border: 1px solid var(--border);
    background: var(--bg); color: var(--t1);
    font-family: 'Inter', sans-serif; font-size: 14px;
    outline: none; transition: all .15s;
  }
  .lgn-input:focus {
    background: #fff;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-lt);
  }
  .lgn-input:focus + svg,
  .lgn-input-wrap:focus-within svg { color: var(--accent); }
  .lgn-input::placeholder { color: var(--t3); }

  /* ══ ERROR ══ */
  .lgn-error {
    background: var(--red-lt);
    border: 1px solid #fca5a5;
    border-radius: 9px;
    padding: 11px 14px;
    font-size: 13px;
    color: #7f1d1d;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.5;
  }
  .lgn-error-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--red); flex-shrink: 0; margin-top: 4px;
  }

  /* ══ SUBMIT BUTTON ══ */
  .lgn-btn {
    width: 100%; height: 46px;
    background: linear-gradient(135deg, var(--accent), #3b5bdb);
    color: #fff; border: none; border-radius: 9px;
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all .2s;
    box-shadow: 0 4px 14px rgba(0,158,247,.3);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    letter-spacing: 0.01em;
  }
  .lgn-btn:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(0,158,247,.45);
    transform: translateY(-1px);
  }
  .lgn-btn:active:not(:disabled) { transform: translateY(0); }
  .lgn-btn:disabled { opacity: 0.75; cursor: not-allowed; }
  .lgn-btn svg { width: 16px; height: 16px; }
  .lgn-btn-spin {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: lgn-spin 1s linear infinite;
    flex-shrink: 0;
  }
  @keyframes lgn-spin { to { transform: rotate(360deg); } }

  /* ══ FOOTER ══ */
  .lgn-footer {
    margin-top: 22px; text-align: center;
    font-size: 11.5px; color: var(--t3);
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .lgn-footer-dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--border); display: inline-block;
  }

  @media (max-width: 480px) {
    .lgn-card { padding: 32px 24px 28px; border-radius: 16px; }
    .lgn-title { font-size: 20px; }
  }
`

function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const LOGIN_URL = `${FRAPPE_BASE_URL}/api/method/login`

            const response = await fetch(LOGIN_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    usr: email,
                    pwd: password,
                }).toString(),
                credentials: "include",
            })

            if (response.ok) {
                const data = await response.json()
                console.log("Login successful:", data)

                if (data.message === "Logged In") {
                    localStorage.setItem("isLoggedIn", "true")
                    router.push("/")
                } else {
                    setError("Unexpected response from server.")
                }
            } else {
                let msg = "Login failed. Please check credentials."
                try {
                    const errorData = await response.json()
                    if (errorData.message && typeof errorData.message === "string") {
                        msg = errorData.message.replace(/[\n\r]/g, " ")
                    }
                } catch { }
                setError(msg)
            }
        } catch (err) {
            console.error("Network error:", err)
            setError("Could not connect to the server. Check your connection.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        document.title = 'Login'
    }, [])

    return (
        <>
            <style>{css}</style>
            <div className="lgn">
                <div className="lgn-card">

                    {/* Header */}
                    <div className="lgn-header">
                        <div className="lgn-logo-wrap">
                            <img src="/vaaman_logo.png" alt="Vaaman Logo" />
                        </div>
                        <h1 className="lgn-title">
                            <span>Job Management</span> System
                        </h1>
                        <p className="lgn-sub">Sign in to continue to your recruitment dashboard.</p>
                    </div>

                    <div className="lgn-divider" />

                    {/* Form */}
                    <form className="lgn-form" onSubmit={handleLogin}>

                        {/* Email */}
                        <div className="lgn-field">
                            <label htmlFor="email" className="lgn-label">Email / Username</label>
                            <div className="lgn-input-wrap">
                                <input
                                    id="email"
                                    type="text"
                                    className="lgn-input"
                                    placeholder="Enter your email or username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <User />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="lgn-field">
                            <label htmlFor="password" className="lgn-label">Password</label>
                            <div className="lgn-input-wrap">
                                <input
                                    id="password"
                                    type="password"
                                    className="lgn-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Lock />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="lgn-error">
                                <span className="lgn-error-dot" />
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button type="submit" className="lgn-btn" disabled={isLoading}>
                            {isLoading ? (
                                <><div className="lgn-btn-spin" /> Signing In...</>
                            ) : (
                                "Login"
                            )}
                        </button>

                    </form>

                    {/* Footer */}
                    <div className="lgn-footer">
                        HR Platform <span className="lgn-footer-dot" /> Secure Login
                    </div>

                </div>
            </div>
        </>
    )
}

export default LoginPage
