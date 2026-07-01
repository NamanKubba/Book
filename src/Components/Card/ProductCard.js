import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import jwt_decode from "jwt-decode";
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { useToast } from '../../Context/toast-context';
import { useWishlist } from '../../Context/wishlist-context';
import "./ProductCard.css"

export default function ProductCard({ productdetails }) {
    const navigate = useNavigate()
    const { userWishlist, dispatchUserWishlist } = useWishlist()
    const { showToast } = useToast()
    
    const {
        _id, 
        bookName,
        author,
        originalPrice,
        discountedPrice,
        discountPercent,
        imgSrc, 
        imgAlt,
        badgeText, 
        outOfStock
    } = productdetails

    const [isWishlisted, setIsWishlisted] = useState(false)
    const [wishlistAnimating, setWishlistAnimating] = useState(false)

    useEffect(() => {
        const index = userWishlist.findIndex(product => product._id === _id)
        setIsWishlisted(index !== -1)
    }, [userWishlist, _id])

    async function addOrRemoveItemToWishlist(event) {
        event.preventDefault()
        event.stopPropagation()
        setWishlistAnimating(true)
        window.setTimeout(() => setWishlistAnimating(false), 560)

        const token = localStorage.getItem('token')
        if (!token) {
            if (!isWishlisted) {
                dispatchUserWishlist({ type: "ADD_GUEST_WISHLIST_ITEM", payload: productdetails })
                showToast("success", "", "Saved to wishlist")
            } else {
                dispatchUserWishlist({ type: "REMOVE_GUEST_WISHLIST_ITEM", payload: _id })
                showToast("success", "", "Removed from wishlist")
            }
            return
        }

        const user = jwt_decode(token)
        if (!user) {
            localStorage.removeItem('token')
            showToast("warning", "", "Kindly Login")
            navigate('/login')
            return
        }

        if (!isWishlisted) {
            // Add to wishlist
            let response = await axios.patch(
                "https://bookztron-server.vercel.app/api/wishlist",
                { productdetails },
                { headers: { 'x-access-token': token } }
            )
            if (response.data.status === "ok") {
                setIsWishlisted(true)
                dispatchUserWishlist({ type: "UPDATE_USER_WISHLIST", payload: response.data.user.wishlist })
                showToast("success", "", "Item successfully added to wishlist")
            }
        } else {
            // Remove from wishlist
            let response = await axios.delete(
                `https://bookztron-server.vercel.app/api/wishlist/${_id}`,
                { headers: { 'x-access-token': token } }
            )
            if (response.data.status === "ok") {
                setIsWishlisted(false)
                dispatchUserWishlist({ type: "UPDATE_USER_WISHLIST", payload: response.data.user.wishlist })
                showToast("success", "", "Item successfully deleted from wishlist")
            }
        }
    }
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3, cubicBezier: [0.4, 0, 0.2, 1] }}
            className="product-card-motion"
        >
            <Link 
                to={`/shop/${_id}`}  
                onClick={() => localStorage.setItem(`${_id}`, JSON.stringify(productdetails))}
                target="_blank"
                rel="noopener noreferrer"
                className="product-card"
            >
                <div className="product-card-media">
                    <img 
                        src={imgSrc} 
                        alt={imgAlt} 
                    />
                    
                    {badgeText && (
                        <span className="product-card-badge">
                            {badgeText}
                        </span>
                    )}

                    <button 
                        onClick={addOrRemoveItemToWishlist}
                        className={`product-card-wishlist action-pop ${wishlistAnimating ? "is-animating" : ""}`}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart size={16} className={isWishlisted ? "wishlisted" : ""} />
                    </button>

                    {outOfStock && (
                        <div className="product-card-overlay">
                            <span>Out of Stock</span>
                        </div>
                    )}
                </div>

                <div className="product-card-body">
                    <h4>
                        {bookName}
                    </h4>
                    <span className="product-card-author">
                        By {author}
                    </span>
                    
                    <div className="product-card-footer">
                        <div>
                            <div className="product-card-price-row">
                                <span className="product-card-price">
                                    Rs. {discountedPrice}
                                </span>
                                <del>
                                    Rs. {originalPrice}
                                </del>
                            </div>
                            <span className="product-card-discount">
                                {discountPercent}% OFF
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export { ProductCard };
