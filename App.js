import { StatusBar } from 'expo-status-bar';
import ReduxThunk from "redux-thunk";
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { combineReducers, createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import productsReducer from "./store/reducers/products";
import ShopNavigator from "./navigation/ShopNavigator";
import cartReducer from "./store/reducers/cart";
import ordersReducer from "./store/reducers/orders";
import authReducer from "./store/reducers/auth";
import NavigationContainer from './navigation/NavigationContainer';


const FontLoad = async () => {
  await Font.loadAsync({
    Roboto: require('native-base/Fonts/Roboto.ttf'),
    Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    ...Ionicons.font,

  });
}

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

export default function App() {

  const [LoadFont, SetLoadFont] = useState(false)

  if (!LoadFont) {
    return (
      <AppLoading startAsync={() => {
        return (FontLoad())
      }} onFinish={() => {
        return (SetLoadFont(true))
      }} />
    )
  }

  return (
    <Provider store={store} >
      <NavigationContainer />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif-light'
  },
});
