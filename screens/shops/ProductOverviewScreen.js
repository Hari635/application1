import React, { useState, useEffect, useCallback } from "react";
import { FlatList, View, Text, StyleSheet, Image, TouchableNativeFeedback } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Color";
import { Card, CardItem, Left, Right, Badge, Button, Icon, Text as T, Spinner } from "native-base";
import { MaterialIcons } from '@expo/vector-icons';
import * as cartActions from "../../store/actions/cart";
import * as productActions from "../../store/actions/products";
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from "../../components/UI/HeaderButton";
import IconBadge from 'react-native-icon-badge';
import { SimpleLineIcons } from '@expo/vector-icons';


const ProductOverviewScreen = (props) => {
    
    const [didMount, setDidMount] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isRefresing, setIsRefresing] = useState(false)
    const [error, setError] = useState()
    const dispatch = useDispatch()
    const product = useSelector((state) => {
        return (state.products.availableProducts)
    })


    const CartProduct = useSelector((state) => {
        return (state.cart.itemCount)
    })
    
    const CartItem = useSelector((state) => {
        return (state.cart)
    })
  
// useEffect(()=>{
//     console.log("-------------cartActions---------fetchCart-----");
//     dispatch(cartActions.fetchCart())
// },[CartItem])
useEffect(() => {
    setDidMount(true);
    return () => setDidMount(false);
 }, [])
    useEffect(() => {
        props.navigation.setParams({ Count: CartProduct });
    }, [CartProduct])

    const loadProoduct = useCallback(async () => {
        setError(null)
        setIsRefresing(true)
        try {
            await dispatch(productActions.fetchProducts())
            await dispatch(cartActions.fetchCart())
        } catch (err) {
            setError(err.message)
        }
        setIsRefresing(false)

    }, [dispatch, setIsLoading, setError])

    useEffect(() => {
        setIsLoading(true)
        loadProoduct().then(() => {
            setIsLoading(false)
        })
    }, [dispatch, loadProoduct])
    useEffect(() => {
        const willFocusSub = props.navigation.addListener(
            'willFocus',
            loadProoduct
        )

        return (() => {
            willFocusSub.remove()
        })
    }, [loadProoduct])

    const cardView = (itemData) => {
        return (

            <TouchableNativeFeedback onPress={() => {
                props.navigation.navigate({
                    routeName: 'productDetail',
                    params: {
                        productId: itemData.item.id,
                        productTitle: itemData.item.title,
                        cartCount: CartProduct
                    }
                })
            }} >
                <View style={styles.cardStyle}>
                    <Card style={styles.cardStyle}>
                        <View style={styles.text}>
                            <CardItem bordered  >
                                <Text>{itemData.item.title}</Text>
                            </CardItem>
                        </View>
                        <CardItem cardBody >
                            <View style={styles.imageContainer} >
                                <Image source={{ uri: itemData.item.imageUrl }} style={{ height: 200, width: null, flex: 1 }} />
                            </View>
                        </CardItem>
                        <View style={styles.text}>
                            <CardItem bordered  >
                                <Text style={styles.Price} >RS {itemData.item.price}</Text>
                            </CardItem>
                        </View>
                        <CardItem footer >
                            <Left>
                                <Button iconLeft onPress={() => {
                                    props.navigation.navigate({
                                        routeName: 'productDetail',
                                        params: {
                                            productId: itemData.item.id,
                                            cartCount: CartProduct,
                                            productTitle: itemData.item.title
                                        }
                                    })

                                }}>
                                    <MaterialIcons name="description" size={24} color="white" />
                                    <T>DetailS</T>
                                </Button>
                            </Left>
                            <Right>

                                <Button iconRight onPress={() => {
                                    const storedCartProduct=itemData.item
                                    return (
                                        dispatch(cartActions.addToCart(itemData.item,CartItem))
                                    )
                                }} >
                                    <Icon name='cart' />
                                    <T>cart</T>
                                </Button>


                            </Right>

                        </CardItem>
                    </Card>
                </View>
            </TouchableNativeFeedback>

        )

    }
    console.disableYellowBox = true;
    if(!didMount) {
        return null;
      }
    if (error) {
        return (
            <View style={styles.loading} >
                <T>error occur ! sorry</T>
                <Button onPress={loadProoduct} >
                    <SimpleLineIcons name="reload" size={24} color="black" />
                </Button>
            </View>
        )
    }
    if (isLoading) {
        return (
            <View style={styles.loading} >
                <Spinner color='red' />
            </View>
        )
    }

    if (!isLoading && product.length == 0) {
        return (
            <View style={styles.loading} >
                <T>no product found</T>
            </View>
        )
    }


    return (

        <View>

            <FlatList
                onRefresh={loadProoduct}
                refreshing={isRefresing}
                data={product} keyExtractor={(item, index) => {
                    return (item.id)
                }} renderItem={(itemData) => {
                    return (
                        cardView(itemData)
                    )
                }} />

        </View>
    )
}

ProductOverviewScreen.navigationOptions = (naviprops) => {
    const count = naviprops.navigation.getParam('Count')
    return {
        headerTitle: "All Product",
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

        headerLeft: () => {
            return (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item
                        title="Menu"
                        iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                        onPress={() => {
                            naviprops.navigation.toggleDrawer();
                        }}
                    />
                </HeaderButtons>
            )
        }
    }
}


const styles = StyleSheet.create({
    cardStyle: {
        margin: 15,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    imageContainer: {
        width: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    text: {
        alignContent: 'center',
        alignItems: 'center'
    },
    Price: {
        color: '#888'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ProductOverviewScreen