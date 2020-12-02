import React, { useEffect } from 'react';
import { FlatList, View, Text, Platform, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Colors from "../../constants/Color";
import HeaderButton from "../../components/UI/HeaderButton";
import OrdersItems from "../../components/UI/OrdersItems";
import * as ordersActions from "../../store/actions/orders";


const OrderScreen = (props) => {
  const orders = useSelector(state => state.orders.orders);
  const dispatch = useDispatch()

  useEffect(() => {
    try{
    dispatch(ordersActions.fetchOrders())
    }catch(err){
      console.log("orddersScreen order action ");
    }
  }, [dispatch])

  if(orders.lenght===0){
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}} >
        <Text>No Orders Found!</Text>
      </View>
    )
  }

  return (
    <FlatList data={orders}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => {
        return (<OrdersItems totalAmount={itemData.item.totalAmount} readableDates={itemData.item.readableDate} items={itemData.item.items} />)
      }} />
  )
}

OrderScreen.navigationOptions = (naviprop) => {
  return {
    headerTitle: 'Your Orders',
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
              naviprop.navigation.toggleDrawer();
            }}
          />
        </HeaderButtons>
      )
    },

  }
}

const styles = StyleSheet.create({

})

export default OrderScreen