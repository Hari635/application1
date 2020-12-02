import 'react-native-gesture-handler';
import React from 'react';
import { createAppContainer,createSwitchNavigator } from 'react-navigation';
import { DrawerItems } from 'react-navigation-drawer'
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import ProductOverviewScreen from "../screens/shops/ProductOverviewScreen";
import ProductDetailScreen from "../screens/shops/ProductDetailScreen";
import CartScreen from "../screens/shops/CartScreen";

import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Color";
import OrderScreen from '../screens/shops/OrdersScreen';
import UserProductScreen from "../screens/user/UserProductScreen";
import EditProductScreen from "../screens/user/EditProductsScreen";
import AuthScreen from "../screens/user/AuthScreen";
import StartupScreen from "../screens/StartupScreen";
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as authActions  from "../store/actions/auth";

const ProductNavi = createStackNavigator({
    productOverview: ProductOverviewScreen,
    productDetail: ProductDetailScreen,
    cartscr: CartScreen
}, {
    navigationOptions: {
        drawerIcon: (drawerConfig) => (
            <Ionicons
                name='md-cart'
                size={23}
                color={drawerConfig.tintColor} />
        )
    }
})

const OrdersNavi = createStackNavigator({
    orders: OrderScreen
}, {
    navigationOptions: {
        drawerIcon: (drawerConfig) => (
            <Ionicons
                name='md-list'
                size={23}
                color={drawerConfig.tintColor} />
        )
    }
}
)

const AdminNavi = createStackNavigator({
    userProduct: UserProductScreen,
    EditProduct: EditProductScreen
}, {
    navigationOptions: {
        drawerIcon: (drawerConfig) => (
            <Ionicons
                name='md-create'
                size={23}
                color={drawerConfig.tintColor} />
        )
    }
}
)

const ShopNavi=createDrawerNavigator({
    products:ProductNavi,
    Orders:OrdersNavi,
    userProduct:AdminNavi
},
{
    contentOptions:{
        activeTintColor:Colors.primary
    }, contentComponent: props => {
        const dispatch = useDispatch();
        return (
          <View style={{ flex: 1, paddingTop: 20 }}>
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
              <DrawerItems {...props} />
              <Button
                title="Logout"
                color={Colors.primary}
                onPress={() => {
                  dispatch(authActions.logout());
                //   props.navigation.navigate('Auth');
                }}
              />
            </SafeAreaView>
          </View>
        );
      }
})

const AuthNavi=createStackNavigator({
    Auth:AuthScreen

})

const MainNavigator=createSwitchNavigator({
    Startup:StartupScreen,
    Auth:AuthNavi,
    Shop:ShopNavi

})

export default createAppContainer(MainNavigator)