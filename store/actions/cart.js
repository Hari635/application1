export const ADD_TO_CART = 'ADD_TO_CART'
import CartItem from "../../models/cart-item";
export const DELETE_TO_CART = "DELETE_TO_CART"
import { add, deleteCart, deleteFullCart } from "../../components/functions/checkoradd";
import products from "../reducers/products";
export const ORDER_CART = 'ORDER_CART'
export const DELETE_ENTIRE_PRODUCT = 'DELETE_ENTIRE_PRODUCT'
export const SET_CART = 'SET_CART'
// export const FETCH_CART='FETCH_CART'

export const orderCart = () => {
    const itemCount = 0
    const totalAmount = 0
    const items = {}

    return async (dispatch,getState) => {
        const token=getState().auth.token
        const userId=getState().auth.userId
        const response = await fetch(`https://shopping-892aa.firebaseio.com/cart/${userId}/cartData.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itemCount,
                totalAmount,
                items

            })
        })

        const resData = await response.json()

        // console.log(resData);

        dispatch({
            type: ORDER_CART
        })
    }
}

export const fetchCart = () => {
    return async (dispatch,getState) => {
        const userId=getState().auth.userId
        try {
            const response = await fetch(`https://shopping-892aa.firebaseio.com/cart/${userId}.json`)
            if (!response.ok) {
                throw new Error('something went wrong')
            }
            const resData = await response.json()
            // console.log("---------------- resData" + JSON.stringify(resData));
            const totalAmountfetch = resData.cartData.totalAmount
            const itemCountfetch = resData.cartData.itemCount
            // console.log(itemCountfetch);
            // console.log(totalAmountfetch);
            const { items } = resData.cartData
            // console.log(items);

            let loadedCarts = {}
            
            for (const key in items) {
                loadedCarts[key]= items[key]
                // console.log("-----s-----"+JSON.stringify(s));
                // console.log(key);
            }

            console.log("-------lisd----"+JSON.stringify(loadedCarts) === '{}');
            dispatch({
                type:SET_CART,
                cartproduct:{
                    total:totalAmountfetch,
                    itemCount: itemCountfetch,
                    cart:loadedCarts
                }
            })
        } catch (err) {
            throw err
        }
    }
}

export const addToCart = (product, cartItems) => {
    const cartData = add(product, cartItems)



    return async (dispatch,getState) => {
        const token=getState().auth.token
        const userId=getState().auth.userId
        try {
            const response = await fetch(`https://shopping-892aa.firebaseio.com/cart/${userId}.json?auth=${token}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cartData
                })
            })


            const resData = await response.json()




            dispatch({
                type: ADD_TO_CART,
                product: product
            })
        } catch (err) {
            console.log(err.message);
        }
    }
}

export const deleteToCart = (productid, cartItems) => {
    const cartData = deleteCart(productid, cartItems)
    return async (dispatch,getState) => {
        const token=getState().auth.token
        const userId=getState().auth.userId
        try {
            const response = await fetch(`https://shopping-892aa.firebaseio.com/cart/${userId}.json?auth=${token}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cartData
                })
            })
            if (!response.ok) {
                throw new Error("somenthing went wrong")
            }
            dispatch({
                type: DELETE_TO_CART,
                pid: productid
            })
        } catch (err) {
            throw err
        }
    }
}


export const deleteEntireProduct = (productid, cartItems) => {
    const cartData = deleteFullCart(productid, cartItems)
    return async (dispatch,getState) => {
        const token=getState().auth.token
        const userId=getState().auth.userId
        try {
            const response = await fetch(`https://shopping-892aa.firebaseio.com/cart/${userId}.json?auth=${token}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cartData
                })
            })
            if (!response.ok) {
                throw new Error("somenthing went wrong")
            }
            dispatch({
                type: DELETE_ENTIRE_PRODUCT,
                pid: productid
            })
        } catch (err) {
            throw err
        }
    }
}


