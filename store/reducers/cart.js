import { ADD_TO_CART, DELETE_TO_CART, DELETE_ENTIRE_PRODUCT, ORDER_CART, SET_CART } from '../actions/cart'
import CartItem from "../../models/cart-item";
import { ADD_ORDER } from "../actions/orders";
import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
    items: {},
    totalAmount: 0,
    itemCount: 0
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_CART:
            if (JSON.stringify(action.cartproduct.cart) !== '{}') {
                console.log('------------empty');
                console.log(JSON.stringify(action.cartproduct.cart) === '{}');
                return {
                    ...state,
                    items: action.cartproduct.cart,
                    totalAmount: action.cartproduct.total,
                    itemCount: action.cartproduct.itemCount
                }

            } else {
                console.log('------------empty------in else');
                return {
                    ...state,
                    items:{},
                    totalAmount:0,
                    itemCount:0
                }
            }

        case ORDER_CART:
            return (initialState)

        case ADD_TO_CART:
            const addedProduct = action.product
            const prodPrice = addedProduct.price
            const prodTitle = addedProduct.title

            let updatedOrNewCartItem
            if (state.items[addedProduct.id]) {
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    prodPrice,
                    prodTitle,
                    state.items[addedProduct.id].sum + prodPrice
                )
            } else {
                updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice)
            }
            return {
                ...state,
                items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
                totalAmount: state.totalAmount + prodPrice,
                itemCount: state.itemCount + 1
            }

        case DELETE_TO_CART:
            const selectedCartItem = state.items[action.pid];
            const currentQty = selectedCartItem.quantity;
            let updatedCartItems;
            if (currentQty > 1) {
                // need to reduce it, not erase it
                const updatedCartItem = new CartItem(
                    selectedCartItem.quantity - 1,
                    selectedCartItem.productPrice,
                    selectedCartItem.productTitle,
                    selectedCartItem.sum - selectedCartItem.productPrice
                );
                updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
            } else {
                updatedCartItems = { ...state.items };
                delete updatedCartItems[action.pid];
            }
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - selectedCartItem.productPrice,
                itemCount: state.itemCount - 1
            };
        case DELETE_ENTIRE_PRODUCT:
            let deletedCartItems = { ...state.items }
            const quantityDelete = state.items[action.pid]
            delete deletedCartItems[action.pid]

            return {
                ...state,
                items: deletedCartItems,
                totalAmount: state.totalAmount - (quantityDelete.quantity * quantityDelete.productPrice),
                itemCount: state.itemCount - quantityDelete.quantity
            }
        case ADD_ORDER:
            return (initialState)
        case DELETE_PRODUCT:
            if (!state.items[action.pid]) {
                return state;
            }
            const updatedItems = { ...state.items };
            const itemTotal = state.items[action.pid].sum;
            const count = state.items[action.pid].quantity
            delete updatedItems[action.pid];
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal,
                itemCount: state.itemCount - count
            };

    }
    return (state)
}