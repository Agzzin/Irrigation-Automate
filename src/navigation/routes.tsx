import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen'
import EmailLoginScreen from '../screens/EmailLoginScreen';
import RNBootSplash from "react-native-bootsplash";
import { useEffect } from "react";


const Stack = createNativeStackNavigator();

const Routes = () => {
    
  useEffect(() => {
    RNBootSplash.hide({ fade: true });
  }, []);

  return (
    <Stack.Navigator initialRouteName="EmailLoginScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name='EmailLoginScreen' component={EmailLoginScreen} />
    </Stack.Navigator>
  );
};

export default Routes;
