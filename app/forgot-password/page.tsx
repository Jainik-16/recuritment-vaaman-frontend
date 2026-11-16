"use client"
import { Suspense, useEffect, useState } from "react"
import { Mail, ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { FRAPPE_BASE_URL } from "@/lib/api-config"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lgn {
    --accent:#009ef7; --accent-lt:#e0f4ff; --accent-md:rgba(0,158,247,.15);
    --bg:#f0f8fe; --card:#fff; --border:#cce8f8; --border-s:#ddf0fb;
    --t1:#0d1b2a; --t2:#2d5a78; --t3:#6a9cb8;
    --red-lt:#fee2e2;
    font-family:'Inter',system-ui,sans-serif;
    min-height:100vh; background:var(--bg);
    display:flex; align-items:center; justify-content:center; padding:24px;
  }
  .lgn-card {
    width:100%; max-width:440px; background:var(--card);
    border:1px solid var(--border-s); border-radius:20px;
    padding:40px 40px 36px;
    box-shadow:0 8px 32px rgba(0,158,247,.1),0 1px 4px rgba(0,0,0,.06);
  }
  .lgn-header { text-align:center; margin-bottom:32px; }
  .lgn-logo-wrap {
    width:72px; height:72px; border-radius:50%; background:var(--accent-md);
    border:2px solid rgba(0,158,247,.25);
    display:flex; align-items:center; justify-content:center; margin:0 auto 18px;
  }
  .lgn-logo-wrap img { width:40px; height:40px; object-fit:contain; }
  .lgn-title { font-size:22px; font-weight:800; color:var(--t1); margin-bottom:8px; }
  .lgn-title span {
    background:linear-gradient(135deg,var(--accent),#3b5bdb);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  .lgn-sub { font-size:13.5px; color:var(--t3); line-height:1.5; }
  .lgn-divider { height:1px; background:var(--border-s); margin-bottom:28px; }
  .lgn-form { display:flex; flex-direction:column; gap:20px; }
  .lgn-field { display:flex; flex-direction:column; gap:6px; }
  .lgn-label { font-size:12px; font-weight:600; color:var(--t2); }
  .lgn-input-wrap { position:relative; }
  .lgn-input-wrap svg {
    position:absolute; left:13px; top:50%; transform:translateY(-50%);
    width:15px; height:15px; color:var(--t3); pointer-events:none;
  }
  .lgn-input {
    width:100%; height:44px; padding:0 14px 0 40px; border-radius:9px;
    border:1px solid var(--border); background:var(--bg); color:var(--t1);
    font-family:'Inter',sans-serif; font-size:14px; outline:none; transition:all .15s;
  }
  .lgn-input:focus { background:#fff; border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-lt); }
  .lgn-input::placeholder { color:var(--t3); }
  .lgn-error {
    background:var(--red-lt); border:1px solid #fca5a5; border-radius:9px;
    padding:11px 14px; font-size:13px; color:#7f1d1d; line-height:1.5;
  }
  .lgn-success {
    background:#dcfce7; border:1px solid #86efac; border-radius:9px;
    padding:11px 14px; font-size:13px; color:#14532d; line-height:1.5;
  }
  .lgn-btn {
    width:100%; height:46px; background:linear-gradient(135deg,var(--accent),#3b5bdb);
    color:#fff; border:none; border-radius:9px; font-family:'Inter',sans-serif;
    font-size:14px; font-weight:700; cursor:pointer; transition:all .2s;
    box-shadow:0 4px 14px rgba(0,158,247,.3);
    display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .lgn-btn:hover:not(:disabled) { box-shadow:0 6px 20px rgba(0,158,247,.45); transform:translateY(-1px); }
  .lgn-btn:disabled { opacity:.75; cursor:not-allowed; }
  .lgn-btn-spin {
    width:16px; height:16px; border:2px solid rgba(255,255,255,.3);
    border-top-color:#fff; border-radius:50%; animation:lgn-spin 1s linear infinite;
  }
  @keyframes lgn-spin { to { transform:rotate(360deg); } }
  .lgn-back {
    margin-top:22px; display:flex; align-items:center; justify-content:center; gap:6px;
    font-size:13px; font-weight:600; color:var(--accent); cursor:pointer;
    background:none; border:none; width:100%; font-family:'Inter',sans-serif;
  }
  .lgn-back svg { width:14px; height:14px; }
  .lgn-back:hover { text-decoration:underline; }
  @media (max-width:480px) {
    .lgn-card { padding:32px 24px 28px; border-radius:16px; }
  }
`

function ForgotPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [email, setEmail] = useState(searchParams.get("email") || "")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    useEffect(() => {
        document.title = "Forgot Password"
    }, [])

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        const trimmedEmail = email.trim()

        if (!trimmedEmail) {
            setError("Please enter your registered email address.")
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(trimmedEmail)) {
            setError("Please enter a valid email address.")
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch(
                `${FRAPPE_BASE_URL}/api/method/frappe.core.doctype.user.user.reset_password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({ user: trimmedEmail }),
                    credentials: "include",
                }
            )

            if (response.ok) {
                const data = await response.json().catch(() => ({}))
                setSuccess(
                    typeof data?.message === "string" && data.message
                        ? data.message
                        : "If this email is registered with us, we have sent password reset instructions to it. Please check your inbox."
                )
            } else {
                let msg = "Unable to send reset link. Please try again later."
                try {
                    const errorData = await response.json()
                    if (errorData?._server_messages) {
                        const arr = JSON.parse(errorData._server_messages)
                        const first = JSON.parse(arr[0])
                        if (first?.message) msg = first.message.replace(/<[^>]*>/g, "")
                    } else if (typeof errorData?.message === "string") {
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

    return (
        <>
            <style>{css}</style>
            <div className="lgn">
                <div className="lgn-card">

                    <div className="lgn-header">
                        <div className="lgn-logo-wrap">
                            <img src="/vaaman_logo.png" alt="Vaaman Logo" />
                        </div>
                        <h1 className="lgn-title">
                            <span>Reset</span> Password
                        </h1>
                        <p className="lgn-sub">
                            Enter your registered email and we&apos;ll send you a link to reset your password.
                        </p>
                    </div>

                    <div className="lgn-divider" />

                    <form className="lgn-form" onSubmit={handleReset}>
                        <div className="lgn-field">
                            <label htmlFor="email" className="lgn-label">Registered Email</label>
                            <div className="lgn-input-wrap">
                                <input
                                    id="email"
                                    type="email"
                                    className="lgn-input"
                                    placeholder="Enter your registered email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                                <Mail />
                            </div>
                        </div>

                        {error && <div className="lgn-error">{error}</div>}
                        {success && <div className="lgn-success">{success}</div>}

                        <button type="submit" className="lgn-btn" disabled={isLoading}>
                            {isLoading ? (
                                <><div className="lgn-btn-spin" /> Sending...</>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                    </form>

                    <button
                        type="button"
                        className="lgn-back"
                        onClick={() => router.push("/Login")}
                    >
                        <ArrowLeft /> Back to Login
                    </button>

                </div>
            </div>
        </>
    )
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ForgotPasswordForm />
        </Suspense>
    )
}
