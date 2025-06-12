import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen'
import EmailLoginScreen from '../screens/EmailLoginScreen';
import RNBootSplash from "react-native-bootsplash";
import SignUpScreen from '../screens/SignUpScreen';
import { useEffect } from "react";
import InitialPage from '../screens/InitialPageScreen';


const Stack = createNativeStackNavigator();

const Routes = () => {
    
  useEffect(() => {
    RNBootSplash.hide({ fade: true });
  }, []);

  return (
    <Stack.Navigator initialRouteName="InitialPage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name='EmailLoginScreen' component={EmailLoginScreen} />
      <Stack.Screen name='SignUpScreen' component={SignUpScreen} />
      <Stack.Screen name='InitialPage' component={InitialPage} />
    </Stack.Navigator>
  );
};

export default Routes;
