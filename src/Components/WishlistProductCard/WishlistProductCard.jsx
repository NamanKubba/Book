import { API_BASE_URL } from '../../config/api'
import React,{ useEffect, useState} from 'react'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import jwt_decode from "jwt-decode";
import './WishlistProductCard.css'
import {
    useToast,
    useWishlist,
    useCart
} from '../../index'

export default function WishlistProductCard({ productdetails }) 
{
    const navigate = useNavigate()

    const { userWishlist, dispatchUserWishlist } = useWishlist()
    const { dispatchUserCart } = useCart()
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
    const [wishlistHeartIcon, setWishlistHeartIcon] = useState("fa-heart-o")
    const [wishlistBtn, setWishlistBtn]             = useState("add-to-wishlist-btn")
    const [wishlistAnimating, setWishlistAnimating] = useState(false)
    const [cartAnimating, setCartAnimating] = useState(false)

    useEffect(()=>{
        const index = userWishlist.findIndex(product=> {
            return product._id === productdetails._id
        })

        if(index!==-1)
        {
            setWishlistHeartIcon("fa-heart")
            setWishlistBtn("added-to-wishlist-btn")
        }
        else
        {
            setWishlistHeartIcon("fa-heart-o")
            setWishlistBtn("add-to-wishlist-btn")
        }
    },[userWishlist, productdetails._id, setWishlistHeartIcon, setWishlistBtn])

    async function addOrRemoveItemToWishlist()
    {
        setWishlistAnimating(true)
        window.setTimeout(() => setWishlistAnimating(false), 560)
        if(wishlistHeartIcon==="fa-heart-o" && wishlistBtn ==="add-to-wishlist-btn")
        {
            //Item not present in wishlist, add it
            const token=localStorage.getItem('token')

            if(token)
            {
                const user = jwt_decode(token)
                
                if(!user)
                {
                    localStorage.removeItem('token')
                    showToast("warning","","Kindly Login")
                    navigate('/login')
                }
                else
                {
                    let wishlistUpdateResponse = await axios.patch(
                        `${API_BASE_URL}/api/wishlist`,
                        {
                            productdetails
                        },
                        {
                            headers:
                            {
                                'x-access-token': localStorage.getItem('token'),
                            }
                        }
                    )
            
                    if(wishlistUpdateResponse.data.status==="ok")
                    {
                        setWishlistHeartIcon("fa-heart")
                        setWishlistBtn("added-to-wishlist-btn")
                        dispatchUserWishlist({type: "UPDATE_USER_WISHLIST",payload: wishlistUpdateResponse.data.user.wishlist})
                        showToast("success","","Item successfully added to wishlist")
                    }
                }
            }
            else
            {
                dispatchUserWishlist({type: "ADD_GUEST_WISHLIST_ITEM", payload: productdetails})
                showToast("success","","Saved to wishlist")
            }   
        }
        else
        {
            //Item present in wishlist, remove it
            const token=localStorage.getItem('token')

            if(token)
            {
                const user = jwt_decode(token)
                
                if(!user)
                {
                    localStorage.removeItem('token')
                    showToast("warning","","Kindly Login")
                    navigate('/login')
                }
                else
                {
                    let wishlistUpdateResponse = await axios.delete(
                        `${API_BASE_URL}/api/wishlist/${productdetails._id}`,
                        {
                            headers:
                            {
                                'x-access-token': localStorage.getItem('token'),
                            }
                        },
                        {
                            productdetails
                        }
                    )
                    if(wishlistUpdateResponse.data.status==="ok")
                    {
                        setWishlistHeartIcon("fa-heart-o")
                        setWishlistBtn("add-to-wishlist-btn")
                        dispatchUserWishlist({type: "UPDATE_USER_WISHLIST",payload: wishlistUpdateResponse.data.user.wishlist})
                        showToast("success","","Item successfully deleted from wishlist")
                    }
                }
            }
            else
            {
                dispatchUserWishlist({type: "REMOVE_GUEST_WISHLIST_ITEM", payload: productdetails._id})
                showToast("success","","Removed from wishlist")
            }   
        }    
    }

    async function addItemToCart()
    {
        setCartAnimating(true)
        window.setTimeout(() => setCartAnimating(false), 560)
        const token=localStorage.getItem('token')

        if(token)
        {
            const user = jwt_decode(token)
            
            if(!user)
            {
                localStorage.removeItem('token')
                showToast("warning","","Kindly Login")
                navigate('/login')
            }
            else
            {
                let cartUpdateResponse = await axios.patch(
                    `${API_BASE_URL}/api/cart`,
                    {
                        productdetails
                    },
                    {
                        headers:
                        {
                            'x-access-token': localStorage.getItem('token'),
                        }
                    }
                )
                if(cartUpdateResponse.data.status==="ok")
                {
                    dispatchUserCart({type: "UPDATE_USER_CART",payload: cartUpdateResponse.data.user.cart})
                    showToast("success","","Item successfully added to cart")
                }
            }
        }
        else
        {
            dispatchUserCart({type: "ADD_GUEST_CART_ITEM", payload: productdetails})
            showToast("success","","Added to cart")
        } 
    }
    
    return (
        <Link 
            to={`/shop/${_id}`}  
            onClick={() => localStorage.setItem(`${_id}`, JSON.stringify(productdetails))}
            target="_blank"
            rel="noopener noreferrer"
        >
            <div className="card-basic wishlist-card">
                <img src={imgSrc} alt={imgAlt}/>
                <div className="card-item-details">
                    <div className="item-title">
                        <h4>{bookName}</h4>
                    </div>
                    <h5 className="item-author">- By  &nbsp;{author}</h5>
                    <p><b>Rs. {discountedPrice}   &nbsp;&nbsp;</b><del>Rs. {originalPrice}</del> &nbsp;&nbsp;
                        <span className="discount-on-card">({discountPercent}% off)</span>
                    </p>
                    <div className="card-button">
                        <button 
                            onClick={(event)=>{
                                event.preventDefault();
                                event.stopPropagation();
                                addOrRemoveItemToWishlist()
                            }} 
                            className={`card-icon-btn ${wishlistBtn} outline-card-secondary-btn action-pop ${wishlistAnimating ? "is-animating" : ""}`}>
                                <i className={`fa fa-x ${wishlistHeartIcon}`} aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className="badge-on-card">
                        {badgeText}
                    </div>
                    {
                        outOfStock && (
                            <div className="card-text-overlay-container">
                                    <p>Out of Stock</p>
                            </div>
                        )
                    }
                </div>
                <button 
                        className={`solid-primary-btn add-wishlist-item-to-cart-btn action-pop ${cartAnimating ? "is-animating" : ""}`}
                        onClick={event=>{
                            event.preventDefault()
                            event.stopPropagation()
                            addItemToCart(event)
                        }}
                >
                        Add to Cart
                </button>
            </div>
        </Link>
    )
}

export { WishlistProductCard };



