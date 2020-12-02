import { ADD_ORDER,SET_ORDERS } from "../actions/orders";
import Order from "../../models/order";

const initialState={
    orders:[]
}

export default(state=initialState,action)=>{
    switch(action.type){
        case SET_ORDERS:
            return{
                orders:action.orders
            }
        case ADD_ORDER:
            
            const newOrder=new Order(
                action.orderData.id,
                action.orderData.items,
                action.orderData.amount,
                action.orderData.date
            )
            console.log("add orders");
            console.log(action.orderData.date);
            console.log(action.orderData.id);
            return{
                ...state,
                orders:state.orders.concat(newOrder)
            }

    }
    return state
}