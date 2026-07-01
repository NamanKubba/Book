import React, { useState } from "react"
import "./UserAuth.css"
import { Link, useNavigate } from "react-router-dom"
import { BookOpen } from "lucide-react"
import axios from "axios"
import { useToast } from "../../Context/toast-context"

function Signup()
{
    const { showToast } = useToast()

    const [termsAndConditionsCheckbox, setTermsAndConditionsCheckbox] = useState(false)
    const [newUserName     , setNewUserName]     = useState('')
    const [newUserEmail    , setNewUserEmail]    = useState('')
    const [newUserPassword , setNewUserPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const [isSendingOtp, setIsSendingOtp] = useState(false)
    const [isCreatingAccount, setIsCreatingAccount] = useState(false)
    const [signupError, setSignupError] = useState('')
    const otpApiBaseUrl = process.env.REACT_APP_OTP_API_BASE_URL || "http://localhost:4000"

    const navigate = useNavigate()

    async function sendOtp(event)
    {
        event.preventDefault()

        if(isSendingOtp)
        {
            return
        }

        setSignupError('')
        setIsSendingOtp(true)

        try
        {
            const response = await axios.post(
                `${otpApiBaseUrl}/api/send-otp`,
                {
                    email: newUserEmail.trim()
                },
                {
                    timeout: 10000
                }
            )

            if(response.data.status === 'ok')
            {
                setOtpSent(true)
                showToast("success","","OTP sent to your email")
            }
            else
            {
                throw new Error("Unable to send OTP")
            }
        }
        catch(error)
        {
            const message = "Unable to send OTP. Check OTP server and Gmail app password."
            setSignupError(message)
            showToast("error","",message)
        }
        finally
        {
            setIsSendingOtp(false)
        }
    }

    async function signupUser(event)
    {
        event.preventDefault();

        if(isCreatingAccount)
        {
            return
        }

        setSignupError('')
        setIsCreatingAccount(true)

        try
        {
            const otpResponse = await axios.post(
                `${otpApiBaseUrl}/api/verify-otp`,
                {
                    email: newUserEmail.trim(),
                    otp
                },
                {
                    timeout: 10000
                }
            )

            if(otpResponse.data.status !== 'ok')
            {
                throw new Error("OTP verification failed")
            }

            const res = await axios.post(
                "https://bookztron-server.vercel.app/api/signup",
            {
                newUserName: `${newUserName}`,
                newUserEmail: `${newUserEmail.trim()}`,
                newUserPassword : `${newUserPassword}`
            }
            )

            if(res.data.status==='ok')
            {
                showToast("success","","New user created successfully")
                navigate('/login')
            }
            else
            {
                throw new Error("Error occured while creating new user")
            }
        }
        catch(error)
        {
            const message = error.response?.data?.error || "Error creating new user. Please try again"
            setSignupError(message)
            showToast("error","",message)
        }
        finally
        {
            setIsCreatingAccount(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row items-center justify-center p-6">
            <div className="w-full max-w-5xl bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xl grid md:grid-cols-2">
                
                {/* Left Side Illustration */}
                <div className="bg-primary/5 p-12 flex flex-col justify-center items-center text-center gap-6 border-r border-slate-100 hidden md:flex">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <BookOpen size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-text-primary mb-2">Join BookStack today!</h3>
                        <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
                            Create your account to start managing cart, order items, personal wishlist collections and get personalized recommendations.
                        </p>
                    </div>
                </div>

                {/* Right Side Form */}
                <form onSubmit={otpSent ? signupUser : sendOtp} className="p-8 md:p-12 flex flex-col justify-center gap-6">
                    <div className="text-left">
                        <h2 className="text-3xl font-black text-text-primary mb-1">Create Account</h2>
                        <p className="text-sm text-text-secondary font-medium">Join our global reading community</p>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 text-left">
                            <label className="text-xs font-bold text-text-secondary uppercase" htmlFor="user-auth-input-name">
                                Full Name
                            </label>
                            <input 
                                id="user-auth-input-name" 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary-light outline-none text-sm text-text-primary placeholder-text-light transition-all" 
                                type="text" 
                                placeholder="John Doe" 
                                value={newUserName}
                                onChange={(event)=>setNewUserName(event.target.value)}
                                disabled={otpSent || isSendingOtp || isCreatingAccount}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2 text-left">
                            <label className="text-xs font-bold text-text-secondary uppercase" htmlFor="user-auth-input-email">
                                Email address
                            </label>
                            <input 
                                id="user-auth-input-email" 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary-light outline-none text-sm text-text-primary placeholder-text-light transition-all" 
                                type="email" 
                                placeholder="name@domain.com" 
                                value={newUserEmail}
                                onChange={(event)=>setNewUserEmail(event.target.value)}
                                disabled={otpSent || isSendingOtp || isCreatingAccount}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2 text-left">
                            <label className="text-xs font-bold text-text-secondary uppercase" htmlFor="user-auth-input-password">
                                Password
                            </label>
                            <input 
                                id="user-auth-input-password" 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary-light outline-none text-sm text-text-primary placeholder-text-light transition-all" 
                                type="password" 
                                placeholder="••••••••" 
                                value={newUserPassword}
                                onChange={(event)=>setNewUserPassword(event.target.value)}
                                disabled={otpSent || isSendingOtp || isCreatingAccount}
                                required
                            />
                        </div>

                        {otpSent && (
                            <div className="flex flex-col gap-2 text-left">
                                <label className="text-xs font-bold text-text-secondary uppercase" htmlFor="user-auth-input-otp">
                                    Email OTP
                                </label>
                                <input
                                    id="user-auth-input-otp"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary-light outline-none text-sm text-text-primary placeholder-text-light transition-all"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Enter 6 digit OTP"
                                    value={otp}
                                    onChange={(event)=>setOtp(event.target.value)}
                                    maxLength="6"
                                    disabled={isCreatingAccount}
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {signupError && (
                        <p className="auth-error-message" role="alert">
                            {signupError}
                        </p>
                    )}

                    <div className="flex items-center justify-between text-xs font-bold text-text-secondary">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                id="accept-terms" 
                                checked={termsAndConditionsCheckbox}
                                onChange={()=>setTermsAndConditionsCheckbox(prevState=>!prevState)}
                                disabled={otpSent || isSendingOtp || isCreatingAccount}
                                className="w-4 h-4 rounded border-slate-300 accent-primary cursor-pointer"
                            />
                            <span>I accept all terms and conditions</span>
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={!termsAndConditionsCheckbox || isSendingOtp || isCreatingAccount}
                    >
                        {otpSent
                            ? (isCreatingAccount ? "Verifying..." : "Verify OTP & Sign Up")
                            : (isSendingOtp ? "Sending OTP..." : "Send OTP")
                        }
                    </button>

                    {otpSent && (
                        <button
                            type="button"
                            className="w-full bg-white text-primary border border-slate-200 hover:border-primary py-3 rounded-xl font-bold text-sm transition-all"
                            onClick={() => {
                                setOtpSent(false)
                                setOtp('')
                                setSignupError('')
                            }}
                            disabled={isCreatingAccount}
                        >
                            Change Details
                        </button>
                    )}

                    <p className="text-sm font-semibold text-text-secondary text-center mt-2">
                        Already have an account? &nbsp;
                        <Link to="/login" className="text-primary hover:underline">
                            Sign In
                        </Link>
                    </p>
                </form>

            </div>
        </div>
    )
}

export { Signup }
