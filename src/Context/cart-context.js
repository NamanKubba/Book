import { useReducer, createContext, useContext } from "react"

const CartContext = createContext()
const GUEST_CART_KEY = "bookstack_guest_cart"

const getGuestCart = () => {
    try {
        return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || []
    } catch {
        return []
    }
}

const persistGuestCart = (cart) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart))
}

const updateCartFunc = (state,action) => {
    switch(action.type)
    {
        case "UPDATE_USER_CART" : 
            {
                return [...action.payload]
            }
        case "ADD_GUEST_CART_ITEM" :
            {
                const itemAlreadyExists = state.some(product => product._id === action.payload._id)
                const updatedCart = itemAlreadyExists
                    ? state.map(product => product._id === action.payload._id
                        ? { ...product, quantity: Number(product.quantity || 1) + 1 }
                        : product)
                    : [...state, { ...action.payload, quantity: 1 }]

                persistGuestCart(updatedCart)
                return updatedCart
            }
        case "REMOVE_GUEST_CART_ITEM" :
            {
                const updatedCart = state.filter(product => product._id !== action.payload)
                persistGuestCart(updatedCart)
                return updatedCart
            }
        case "UPDATE_GUEST_CART_QUANTITY" :
            {
                const nextQuantity = Math.max(1, Number(action.payload.quantity) || 1)
                const updatedCart = state.map(product => product._id === action.payload.productId
                    ? { ...product, quantity: nextQuantity }
                    : product)
                persistGuestCart(updatedCart)
                return updatedCart
            }
        default : return [...state] 
    }
}

const CartContextProvider = ({children}) => {
    const [userCart, dispatchUserCart] = useReducer(updateCartFunc, [], getGuestCart)

    return (
        <CartContext.Provider value={{userCart, dispatchUserCart}}>
            {children}
        </CartContext.Provider>
    )
}

let useCart = () => useContext(CartContext)

export { useCart, CartContextProvider }
