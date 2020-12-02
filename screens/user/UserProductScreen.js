import React, { useState, useEffect, useCallback } from "react";
import { FlatList, View, Text, StyleSheet, Image, TouchableNativeFeedback, Platform, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Color";
import { Card, CardItem, Left, Right, Badge, Button, Icon, Text as T } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import * as cartActions from "../../store/actions/cart";
import * as productActions from "../../store/actions/products";
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from "../../components/UI/HeaderButton";


const UserProductScreen = (props) => {
    const userProduct = useSelector((state) => {
        return (state.products.userProducts)
    })

    const dispatch = useDispatch()
    const deleteHandler = (id) => {
        Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: () => {
                    dispatch(productActions.deleteProduct(id));
                }
            }
        ]);
    };

    const cardView = (itemData) => {
        return (

            <TouchableNativeFeedback onPress={() => {
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
                                    props.navigation.navigate('EditProduct', { productId: itemData.item.id })
                                }}>
                                    <AntDesign name="edit" size={24} color="white" />
                                    <T>Edit</T>
                                </Button>
                            </Left>
                            <Right>

                                <Button iconRight onPress={deleteHandler.bind(this, itemData.item.id)} >
                                    <AntDesign name="delete" size={24} color="white" />
                                    <T>Delete</T>
                                </Button>


                            </Right>

                        </CardItem>
                    </Card>
                </View>
            </TouchableNativeFeedback>

        )

    }
    if (userProduct.lenght === 0) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                <Text>No products Found</Text>
            </View>
        )
    }
    return (

        <View>

            <FlatList data={userProduct} keyExtractor={(item, index) => {
                return (item.id)
            }} renderItem={(itemData) => {
                return (
                    cardView(itemData)
                )
            }} />

        </View>
    )
}
UserProductScreen.navigationOptions = (naviprops) => {
    return {
        headerTitle: "Your Product",
        headerStyle: {
            backgroundColor: Colors.primary
        },
        headerTintColor: 'white',
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
        },
        headerRight: () => {
            return (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item
                        title="Add"
                        iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                        onPress={() => {
                            naviprops.navigation.navigate('EditProduct');
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
    }

})
export default UserProductScreen