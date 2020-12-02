import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import * as carActions from "../../store/actions/cart";
import { Text, View, StyleSheet, Image, ScrollView} from "react-native";
import Colors from "../../constants/Color"
import { Button, Text as NativeText, Card, CardItem, Body} from "native-base";
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from "../../components/UI/HeaderButton";
import IconBadge from 'react-native-icon-badge';

const ProductDetailScreen = (props) => {
    const productid = props.navigation.getParam('productId')
    const CartItem = useSelector((state) => {
        return (state.cart)
    })

    const dispatch = useDispatch()
    const detail = useSelector((state) => {
        return (state.products.availableProducts)
    })

    const CartProduct = useSelector((state) => {
        return (state.cart.itemCount)
    })
    const selectedProduct = detail.find((product) => {
        return (product.id === productid)
    })

    useEffect(() => {
        props.navigation.setParams({ cartCount: CartProduct });
    }, [CartProduct])


    return (
        <ScrollView>
            <View style={styles.imageView} >
                <Image source={{ uri: selectedProduct.imageUrl }} style={styles.image} />
            </View>
            <View style={styles.Price} >
                <Text style={{ color: "#888" }} >RS {selectedProduct.price}</Text>
            </View >
            <View style={styles.Button} >
                <Button bordered success onPress={() => {
                    dispatch(carActions.addToCart(selectedProduct,CartItem))

                }
                } >
                    <NativeText >ADD TO CART</NativeText>
                </Button>
            </View>
            <View style={{ margin: 15 }} >
                <Card>
                    <CardItem>
                        <Body>
                            <NativeText>{selectedProduct.description}</NativeText>
                        </Body>
                    </CardItem>
                </Card>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    imageView: {
        margin: 15
    },

    image: {
        width: '100%',
        height: 200
    },
    Price: {
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
    },
    Button: {
        flexDirection: 'row',
        justifyContent: 'center'
    }

})

ProductDetailScreen.navigationOptions = (naviprops) => {
    const title = naviprops.navigation.getParam('productTitle')
    const count = naviprops.navigation.getParam('cartCount')
    return {
        headerTitle: title,
        headerStyle: {
            backgroundColor: Colors.primary
        },
        headerTintColor: 'white',
        headerRight: () => {
            return (
                <IconBadge MainElement={
                    <HeaderButtons HeaderButtonComponent={HeaderButton}>
                        <Item
                            title="Cart"
                            iconName="ios-cart"
                            onPress={() => {
                                naviprops.navigation.navigate({ routeName: 'cartscr' })
                            }}
                        />
                    </HeaderButtons>
                }
                    BadgeElement={
                            <Text style={{ color: '#FFFFFF' }}>{count}</Text>
                    }
                    IconBadgeStyle={
                        {
                            width: 2,
                            height: 15,
                            backgroundColor: '#FF00EE'
                        }
                    }
                    Hidden={count == 0} />
            )
        },
    }
}


export default ProductDetailScreen