import { useReducer, useContext, createContext } from "react"

const WishlistContext = createContext()
const GUEST_WISHLIST_KEY = "bookstack_guest_wishlist"

const getGuestWishlist = () => {
    try {
        return JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY)) || []
    } catch {
        return []
    }
}

const persistGuestWishlist = (wishlist) => {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(wishlist))
}

const updateWishlistFunc = (state,action) => {
    switch(action.type)
    {
        case "UPDATE_USER_WISHLIST" : 
            {
                return [...action.payload]
            }
        case "ADD_GUEST_WISHLIST_ITEM" :
            {
                const updatedWishlist = state.some(product => product._id === action.payload._id)
                    ? state
                    : [...state, action.payload]
                persistGuestWishlist(updatedWishlist)
                return updatedWishlist
            }
        case "REMOVE_GUEST_WISHLIST_ITEM" :
            {
                const updatedWishlist = state.filter(product => product._id !== action.payload)
                persistGuestWishlist(updatedWishlist)
                return updatedWishlist
            }
        default : return [...state] 
    }
}

const WishlistContextProvider = ({children}) => {
    const [userWishlist, dispatchUserWishlist] = useReducer(updateWishlistFunc, [], getGuestWishlist)

    return (
        <WishlistContext.Provider value={{userWishlist, dispatchUserWishlist}}>
            {children}
        </WishlistContext.Provider>
    )
}

let useWishlist = () => useContext(WishlistContext)

export { WishlistContextProvider, useWishlist }
