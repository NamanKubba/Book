import { useEffect } from "react";
import jwt_decode from "jwt-decode"
import axios from "axios";
import { Link } from "react-router-dom"
import { ShoppingCart, ArrowRight } from "lucide-react"
import { 
    useWishlist, 
    useCart, 
    HorizontalProductCard,
    ShoppingBill 
} from "../../index"

function Cart() {
    const { userWishlist, dispatchUserWishlist } = useWishlist()
    const { userCart, dispatchUserCart } = useCart()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            const user = jwt_decode(token)
            if (!user) {
                localStorage.removeItem('token')
            } else {
                if (userCart.length === 0 || userWishlist.length === 0) {
                    (async function getUpdatedWishlistAndCart() {
                        let updatedUserInfo = await axios.get(
                            "https://bookztron-server.vercel.app/api/user",
                            {
                                headers: {
                                    'x-access-token': localStorage.getItem('token'),
                                }
                            }
                        )

                        if (updatedUserInfo.data.status === "ok") {
                            dispatchUserWishlist({ type: "UPDATE_USER_WISHLIST", payload: updatedUserInfo.data.user.wishlist })
                            dispatchUserCart({ type: "UPDATE_USER_CART", payload: updatedUserInfo.data.user.cart })
                        }
                    })()
                }
            }
        }   
    }, [])

    return (
        <div className="min-h-screen bg-background py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
                    <h2 className="text-2xl font-black text-text-primary flex items-center gap-2">
                        <ShoppingCart size={24} className="text-primary" />
                        Shopping Cart 
                        <span className="text-sm font-semibold text-text-secondary bg-slate-100 px-3 py-1 rounded-full">
                            {userCart.length} {userCart.length === 1 ? "item" : "items"}
                        </span>
                    </h2>
                </div>

                {userCart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-slate-200/80 rounded-2xl p-8 max-w-md mx-auto shadow-sm animate-fadeIn">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-text-light mb-6">
                            <ShoppingCart size={32} />
                        </div>
                        <h3 className="text-lg font-extrabold text-text-primary mb-2">
                            Your cart is empty
                        </h3>
                        <p className="text-sm text-text-secondary mb-8 max-w-xs leading-relaxed">
                            Looks like you haven't added any books to your cart yet.
                        </p>
                        <Link to="/shop">
                            <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-bold text-sm shadow-sm transition-all flex items-center gap-2">
                                Start Shopping <ArrowRight size={16} />
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Cart items listing */}
                        <div className="lg:col-span-8 flex flex-col gap-4">
                            {userCart.map((productDetails, index) => (
                                <HorizontalProductCard key={index} productDetails={productDetails} />
                            ))}
                        </div>
                        
                        {/* Billing summary card */}
                        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                            <ShoppingBill />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export { Cart }
