import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom"
import jwt_decode from "jwt-decode";
import { useUserLogin, useToast, useWishlist, useCart, useOrders, useSearchBar } from "../../index"
import { Search, Heart, ShoppingCart, LogOut, LogIn, ShoppingBag, BookOpen, Menu, X } from "lucide-react"
import "./Navbar.css"

function Navbar() {
    const { userWishlist, dispatchUserWishlist } = useWishlist()
    const { userCart, dispatchUserCart } = useCart()
    const { userOrders, dispatchUserOrders } = useOrders()
    const { setUserLoggedIn } = useUserLogin(false)
    const { showToast } = useToast()
    const location = useLocation()
    const { searchBarTerm, setSearchBarTerm } = useSearchBar()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(()=>{
        const token=localStorage.getItem('token')
        if(token)
        {
            const user = jwt_decode(token)
            if(!user)
            {
                localStorage.removeItem('token')
                setUserLoggedIn(false)
            }
            else
            {
                setUserLoggedIn(true)
            }
        }
    },[])

    useEffect(()=>{
        function handleInvalidToken() {
            if(localStorage.getItem('token')!==null)
            {
                setUserLoggedIn(true)
            }
            else
            {
                setUserLoggedIn(false)
                dispatchUserWishlist({type:"UPDATE_USER_WISHLIST",payload:[]})
                dispatchUserCart({type:"UPDATE_USER_CART",payload:[]})
                dispatchUserOrders({type:"UPDATE_USER_ORDERS",payload:[]})
            }
        }
        window.addEventListener("storage",handleInvalidToken)
        return function cleanup() {
            window.removeEventListener('storage', handleInvalidToken)
        }
    },[userWishlist,userCart])

    function logoutUser()
    {
        localStorage.removeItem('token')
        dispatchUserWishlist({type:"UPDATE_USER_WISHLIST",payload:[]})
        dispatchUserCart({type:"UPDATE_USER_CART",payload:[]})
        dispatchUserOrders({type:"UPDATE_USER_ORDERS",payload:[]})
        setUserLoggedIn(false)
        localStorage.clear()
        showToast("success","","Logged out successfully")
    }
    
    return (
        <nav className="modern-navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-brand-mark">
                        <BookOpen size={20} />
                    </div>
                    <span>BookStack</span>
                </Link>

                {location.pathname === "/shop" && (
                    <div className="navbar-search">
                        <Search size={18} />
                        <input 
                            placeholder="Search by title, author..."
                            value={searchBarTerm}
                            onChange={event => setSearchBarTerm(event.target.value)}
                        />
                    </div>
                )}

                <div className="navbar-links">
                    <Link to="/shop" className="navbar-link">
                        <BookOpen size={16} /> Catalog
                    </Link>
                    
                    <Link to="/wishlist" className="navbar-icon-link" aria-label="Wishlist">
                        <Heart size={20} />
                        {userWishlist.length !== 0 && (
                            <span className="navbar-count-badge">{userWishlist.length}</span>
                        )}
                    </Link>

                    <Link to="/cart" className="navbar-icon-link" aria-label="Cart">
                        <ShoppingCart size={20} />
                        {userCart.length !== 0 && (
                            <span className="navbar-count-badge">{userCart.length}</span>
                        )}
                    </Link>

                    <Link to="/orders" className="navbar-icon-link" aria-label="Orders">
                        <ShoppingBag size={20} />
                        {userOrders.length !== 0 && (
                            <span className="navbar-count-badge">{userOrders.length}</span>
                        )}
                    </Link>

                    {localStorage.getItem('token') !== null ? (
                        <button 
                            onClick={logoutUser} 
                            className="navbar-auth-btn logout"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    ) : (
                        <Link 
                            to="/login" 
                            className="navbar-auth-btn"
                        >
                            <LogIn size={16} /> Login
                        </Link>
                    )}
                </div>

                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="navbar-menu-btn"
                    aria-label="Open navigation menu"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="navbar-mobile-panel">
                    {location.pathname === "/shop" && (
                        <div className="navbar-search mobile">
                            <Search size={18} />
                            <input 
                                placeholder="Search books..."
                                value={searchBarTerm}
                                onChange={event => setSearchBarTerm(event.target.value)}
                            />
                        </div>
                    )}
                    <Link 
                        to="/shop" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="navbar-mobile-link"
                    >
                        <BookOpen size={18} /> Catalog
                    </Link>
                    <Link 
                        to="/wishlist" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="navbar-mobile-link"
                    >
                        <Heart size={18} /> Wishlist ({userWishlist.length})
                    </Link>
                    <Link 
                        to="/cart" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="navbar-mobile-link"
                    >
                        <ShoppingCart size={18} /> Cart ({userCart.length})
                    </Link>
                    <Link 
                        to="/orders" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="navbar-mobile-link"
                    >
                        <ShoppingBag size={18} /> Orders ({userOrders.length})
                    </Link>
                    {localStorage.getItem('token') !== null ? (
                        <button 
                            onClick={() => { logoutUser(); setMobileMenuOpen(false); }}
                            className="navbar-mobile-auth logout"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    ) : (
                        <Link 
                            to="/login" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="navbar-mobile-auth"
                        >
                            <LogIn size={18} /> Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    )
}

export { Navbar };
