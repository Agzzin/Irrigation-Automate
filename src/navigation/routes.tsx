import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import RNBootSplash from "react-native-bootsplash";
import { useEffect } from "react";


const Stack = createNativeStackNavigator();

const Routes = () => {
    
  useEffect(() => {
    RNBootSplash.hide({ fade: true });
  }, []);

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default Routes;
