import React from 'react';
import { StatusBar } from 'react-native';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import ShopNavigator from './navigation/ShopNavigator';
import Apploading from 'expo-app-loading';
import { useFonts } from 'expo-font';
// import { composeWithDevTools } from 'redux-devtools-extension';
import productReducer from './store/reducers/products';
import cartReducer from './store/reducers/cart';
import ordersReducer from './store/reducers/orders';

const rootReducer = combineReducers({
  products: productReducer,
  cart: cartReducer,
  orders: ordersReducer
});

// const store = createStore(rootReducer, composeWithDevTools());
const store = createStore(rootReducer);

export default function App() {
  let [fontsLoaded] = useFonts({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <Apploading />;
  }

  return (
    <Provider store={store}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="rgba(0, 0, 0, 0.3)"
        translucent
      />
      <ShopNavigator />
    </Provider>
  );
}

