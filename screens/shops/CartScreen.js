import React, { useEffect } from "react";
import { Text, StyleSheet, View, FlatList, TouchableOpacity, Alert } from "react-native";
import { Card, CardItem, Button, Text as Nativetext, Icon, ListItem, Left, Right, Body } from "native-base";
import Colors from "../../constants/Color";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from '@expo/vector-icons';
import * as CartActions from "../../store/actions/cart";
import * as OrdersActions from "../../store/actions/orders";

const CartScreen = (props) => {
    const dispatch = useDispatch()
    const cartTotalAmount = useSelector((state) => {
        return (state.cart.totalAmount)
    })
    const cartItems = useSelector((state) => {
        return (state.cart)
    })

    // useEffect(()=>{
    //     dispatch(CartActions.fetchCart())
    // },[dispatch])

    const CartItem = useSelector((state) => {
        const transformedCartItem = []
        for (let key in state.cart.items) {
            transformedCartItem.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum
            })
        }
        return (transformedCartItem.sort((a, b) => {
            a.productId > b.productId ? 1 : -1
        }))
    })

    const cartItemList = (itemdata) => {
        return (
            <ListItem >
                <TouchableOpacity style={{ flexDirection: 'row' }} onLongPress={() => {
                    Alert.alert("Delete", "Are you Sure You want To Delete the Product", [
                        {
                            text: 'CONFIRM',
                            onPress: () => {
                                dispatch(CartActions.deleteEntireProduct(itemdata.item.productId,cartItems))
                            }
                        },
                        {
                            text: 'Cancel',
                            style: 'cancel'
                        }
                    ])
                }} >
                    <Left>
                        <Nativetext>{itemdata.item.productTitle}- </Nativetext>
                        <Nativetext style={{ color: '#888' }}>{itemdata.item.quantity}</Nativetext>
                    </Left>
                    <Right>
                        <View style={styles.flexStyle} >
                            <Nativetext style={styles.sumAlign} >{itemdata.item.sum.toFixed(2)}</Nativetext>
                            <TouchableOpacity onPress={() => {
                                dispatch(CartActions.deleteToCart(itemdata.item.productId, cartItems))
                            }} >
                                <Ionicons name="md-trash" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    </Right>
                </TouchableOpacity>
            </ListItem >




        )
    }

    return (
        <View>
            <Card style={styles.cardStyle} >

                <View style={styles.flexStyle} >

                    <Text style={{ fontSize: 15 }} >
                        Total : RS<Text style={{ color: Colors.accent }} > {cartTotalAmount.toFixed(2)}</Text>
                    </Text>

                    <Button bordered success disabled={CartItem.length === 0}
                        onPress={() => {
                            const callss = async () => {
                                 
                                await dispatch(CartActions.orderCart())
                            }
                            callss().then(() => {
                                dispatch(OrdersActions.addOrder(CartItem, cartTotalAmount))
                                // console.log("---------------1--------------------")
                            }).catch((err)=>{
                                // console.log("------------2-----------------------"+err);
                            })
                            // console.log("---------------3--------------------")






                        }}>
                        <Nativetext>Order Now</Nativetext>
                    </Button>

                </View>

            </Card>

            <FlatList data={CartItem} keyExtractor={(item, index) => {
                return (item.productId)
            }} renderItem={cartItemList} />
        </View>

    )
}

CartScreen.navigationOptions = (naviprops) => {
    const count = naviprops.navigation.getParam('Count')
    return {
        headerTitle: "CART",
        headerStyle: {
            backgroundColor: Colors.primary
        },
        headerTintColor: 'white',
    }
}

const styles = StyleSheet.create({
    cardStyle: {
        margin: 15,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        height: 60
    },
    text: {
        alignItems: "center",
        justifyContent: 'center'
    },
    flexStyle: {
        paddingTop: 7.5,
        paddingBottom: 7.5,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center'
    },
    sumAlign: {
        width: 180,
        textAlign: 'right'
    }


})

export default CartScreen