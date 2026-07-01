import { API_BASE_URL } from '../../config/api'
import React, { useState, useEffect } from "react"
import jwt_decode from "jwt-decode"
import "./UserAuth.css"
import { Link, useNavigate } from "react-router-dom"
import { BookOpen } from "lucide-react"
import axios from "axios"
import { 
    useToast, 
    useUserLogin, 
    useWishlist,
    useCart,
    useOrders
} from "../../index"

function Login()
{
    const { setUserLoggedIn }       = useUserLogin()
    const { showToast }             = useToast()
    const { dispatchUserWishlist }  = useWishlist()
    const { dispatchUserCart }      = useCart()
    const { dispatchUserOrders }    = useOrders()

    const [userEmail    , setUserEmail]    = useState('')
    const [userPassword , setUserPassword] = useState('')
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [loginError, setLoginError] = useState("")

    useEffect(()=>{
        const token=localStorage.getItem('token')

        if(token)
        {
            const user = jwt_decode(token)
            if(!user)
            {
                localStorage.removeItem('token')
            }
            else
            {
                (async function getUpdatedWishlistAndCart()
                {
                    let updatedUserInfo = await axios.get(
                    `${API_BASE_URL}/api/user`,
                    {
                        headers:
                        {
                        'x-access-token': localStorage.getItem('token'),
                        }
                    })

                    if(updatedUserInfo.data.status==="ok")
                    {
                        dispatchUserWishlist({type: "UPDATE_USER_WISHLIST",payload: updatedUserInfo.data.user.wishlist})
                        dispatchUserCart({type: "UPDATE_USER_CART",payload: updatedUserInfo.data.user.cart})
                        dispatchUserOrders({type: "UPDATE_USER_ORDERS",payload: updatedUserInfo.data.user.orders})
                    }
                })()
            }
        }   
    },[])

    const navigate = useNavigate()

    async function loginUser(event)
    {
        event.preventDefault();

        if(isLoggingIn)
        {
            return
        }

        setLoginError("")
        setIsLoggingIn(true)

        try
        {
            const res = await axios.post(
                `${API_BASE_URL}/api/login`,
                {
                    userEmail: userEmail.trim(),
                    userPassword
                },
                {
                    timeout: 6000
                }
            )

            if(res.data?.user)
            {
                localStorage.setItem('token',res.data.user)
                showToast("success","","Logged in successfully")
                setUserLoggedIn(true)
                dispatchUserWishlist({type: "UPDATE_USER_WISHLIST",payload: res.data.wishlist})
                dispatchUserCart({type: "UPDATE_USER_CART",payload: res.data.cart})
                dispatchUserOrders({type: "UPDATE_USER_ORDERS",payload: res.data.orders})
                navigate('/shop')
            }
            else
            {
                throw new Error("Error in user login")
            }
        }
        catch(err)
        {
            const message = "Invalid email or password. Please check your details and try again."
            if(err.code === "ECONNABORTED" || err.response?.status === 504)
            {
                setLoginError(message)
                showToast("error","",message)
            }
            else
            {
                setLoginError("Unable to login right now. Please try again.")
                showToast("error","","Unable to login right now. Please try again.")
            }
        }
        finally
        {
            setIsLoggingIn(false)
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
                        <h3 className="text-2xl font-black text-text-primary mb-2">Welcome Back Reader!</h3>
                        <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
                            Log in to access your dashboard, saved favorites in your wishlist, and manage order deliveries.
                        </p>
                    </div>
                </div>

                {/* Right Side Form */}
                <form onSubmit={loginUser} className="p-8 md:p-12 flex flex-col justify-center gap-6">
                    <div className="text-left">
                        <h2 className="text-3xl font-black text-text-primary mb-1">Sign In</h2>
                        <p className="text-sm text-text-secondary font-medium">Access your BookStack account</p>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 text-left">
                            <label className="text-xs font-bold text-text-secondary uppercase" htmlFor="user-auth-input-email">
                                Email address
                            </label>
                            <input 
                                id="user-auth-input-email" 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary-light outline-none text-sm text-text-primary placeholder-text-light transition-all" 
                                type="email" 
                                placeholder="name@domain.com" 
                                value={userEmail}
                                onChange={(event)=>setUserEmail(event.target.value)}
                                disabled={isLoggingIn}
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
                                value={userPassword}
                                onChange={(event)=>setUserPassword(event.target.value)}
                                disabled={isLoggingIn}
                                required
                            />
                        </div>
                    </div>

                    {loginError && (
                        <p className="auth-error-message" role="alert">
                            {loginError}
                        </p>
                    )}

                    <div className="flex items-center justify-between text-xs font-bold text-text-secondary">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" id="remember-me" className="w-4 h-4 rounded border-slate-300 accent-primary cursor-pointer" />
                            <span>Remember Me</span>
                        </label>
                        <Link to="#" className="text-primary hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? "Signing In..." : "Sign In"}
                    </button>

                    <p className="text-sm font-semibold text-text-secondary text-center mt-2">
                        Don't have an account? &nbsp;
                        <Link to="/signup" className="text-primary hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </form>

            </div>
        </div>
    )
}

export { Login }



