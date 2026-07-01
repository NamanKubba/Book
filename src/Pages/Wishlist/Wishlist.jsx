import React, { useEffect } from "react"
import jwt_decode from "jwt-decode";
import axios from "axios"
import { Link } from "react-router-dom"
import { Heart, ShoppingBag } from "lucide-react"
import { 
    WishlistProductCard,
    useWishlist,
    useCart 
} from "../../index"

function Wishlist() {
    const { userWishlist, dispatchUserWishlist } = useWishlist()
    const { dispatchUserCart } = useCart()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            const user = jwt_decode(token)
            if (!user) {
                localStorage.removeItem('token')
            } else {
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
    }, [])

    return (
        <div className="min-h-screen bg-background py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
                    <h2 className="text-2xl font-black text-text-primary flex items-center gap-2">
                        <Heart className="text-danger fill-danger" size={24} />
                        My Wishlist 
                        <span className="text-sm font-semibold text-text-secondary bg-slate-100 px-3 py-1 rounded-full">
                            {userWishlist.length} {userWishlist.length === 1 ? "book" : "books"}
                        </span>
                    </h2>
                </div>

                {userWishlist.length !== 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {userWishlist.map(productdetails => (
                            <WishlistProductCard key={productdetails._id} productdetails={productdetails} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-slate-200/80 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-text-light mb-6">
                            <Heart size={32} />
                        </div>
                        <h3 className="text-lg font-extrabold text-text-primary mb-2">
                            Your wishlist is empty
                        </h3>
                        <p className="text-sm text-text-secondary mb-8 max-w-xs leading-relaxed">
                            Explore our catalog and save your favorite books to read them later!
                        </p>
                        <Link to="/shop">
                            <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-bold text-sm shadow-sm transition-all flex items-center gap-2">
                                <ShoppingBag size={16} /> Explore Catalog
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export { Wishlist }
