import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen'
import RNBootSplash from "react-native-bootsplash";
import { useEffect } from "react";


const Stack = createNativeStackNavigator();

const Routes = () => {
    
  useEffect(() => {
    RNBootSplash.hide({ fade: true });
  }, []);

  return (
    <Stack.Navigator initialRouteName="WelcomeScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
    </Stack.Navigator>
  );
};

export default Routes;
