// import { useSelector } from "react-redux";
import CartItem from "../../models/cart-item";


export const add = (prod, cartItems) => {

    const addedProduct = prod
    const prodPrice = addedProduct.price
    const prodTitle = addedProduct.title

    let updatedOrNewCartItem
    if (cartItems.items[addedProduct.id]) {
        updatedOrNewCartItem = new CartItem(
            cartItems.items[addedProduct.id].quantity + 1,
            prodPrice,
            prodTitle,
            cartItems.items[addedProduct.id].sum + prodPrice
        )
    } else {
        updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice)
    }
    return {
        ...cartItems,
        items: { ...cartItems.items, [addedProduct.id]: updatedOrNewCartItem },
        totalAmount: cartItems.totalAmount + prodPrice,
        itemCount: cartItems.itemCount + 1
    }

}

export const deleteCart = (pid, cartItems) => {
    const selectedCartItem = cartItems.items[pid];
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
        updatedCartItems = { ...cartItems.items, [pid]: updatedCartItem };
    } else {
        updatedCartItems = { ...cartItems.items };
        delete updatedCartItems[pid];
    }
    return {
        ...cartItems,
        items: updatedCartItems,
        totalAmount: cartItems.totalAmount - selectedCartItem.productPrice,
        itemCount: cartItems.itemCount - 1
    };

}

export const deleteFullCart=(pid,cartItems)=>{
    let deletedCartItems = { ...cartItems.items }
            const quantityDelete = cartItems.items[pid]
            delete deletedCartItems[pid]

            return {
                ...cartItems,
                items: deletedCartItems,
                totalAmount: cartItems.totalAmount - (quantityDelete.quantity * quantityDelete.productPrice),
                itemCount: cartItems.itemCount - quantityDelete.quantity
            }

}

