export const ADD_ORDER = 'ADD_ORDER'
export const SET_ORDERS='SET_ORDERS'
import Order from "../../models/order";

export const fetchOrders=()=>{
    return async (dispatch,getState) => {
        const userId=getState().auth.userId
        try {
            const response = await fetch(`https://shopping-892aa.firebaseio.com/Orders/${userId}.json`)

            if (!response.ok) {
                throw new Error('something went wrong')
            }
            
            const resData = await response.json()
            // console.log("response---- "+resData);
            const loadedOrders = []

            for (const key in resData) {
                // console.log("---------------------------------- " +JSON.stringify(resData[key].Date));
                loadedOrders.push(new Order(key,
                    resData[key].cartItems,
                    resData[key].totalAmount,
                    new Date(resData[key].Date))
                )
            }
            dispatch({ type: SET_ORDERS, orders: loadedOrders })
        } catch (err) {
            throw err

        }

    }
}

export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch,getState) => {
        const token=getState().auth.token
        const userId=getState().auth.userId
        const date=new Date()
        try{
        const response = await fetch(`https://shopping-892aa.firebaseio.com/Orders/${userId}.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               cartItems,
               totalAmount,
               Date:date.toISOString()
            })
        })
        if(!response.ok){
            throw new Error('something went Wrong')
        }

        const resData = await response.json()
        // console.log(resData.name);
       

        dispatch({
            type: ADD_ORDER,
            orderData: {
                id:resData.name,
                items: cartItems,
                amount: totalAmount,
                date:date
            }
        })
    }catch(err){
        console.log("ORDERS ADDORDERS-------");
    }

    }
}